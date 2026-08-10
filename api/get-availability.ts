import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { applyCors, applyRateLimit } from './_utils';

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

const db = getFirestore();

const QuerySchema = z.object({
    propertyId: z.enum(['lili', 'integracao']).default('lili'),
    from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (applyCors(req, res)) return;
    if (!(await applyRateLimit(req, res, 60, 60))) return;
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const parsed = QuerySchema.parse({
            propertyId: Array.isArray(req.query.propertyId)
                ? req.query.propertyId[0]
                : req.query.propertyId,
            from: Array.isArray(req.query.from) ? req.query.from[0] : req.query.from,
        });
        const from = parsed.from || new Date().toISOString().slice(0, 10);
        const [reservationSnap, blockedSnap] = await Promise.all([
            db
                .collection('reservations')
                .where('propertyId', '==', parsed.propertyId)
                .where('checkoutDate', '>=', from)
                .get(),
            db.collection('blocked_dates').where('endDate', '>=', from).get(),
        ]);

        const reservations = reservationSnap.docs
            .map((doc) => doc.data())
            .filter(
                (data) =>
                    data.status !== 'cancelled' &&
                    typeof data.checkInDate === 'string' &&
                    typeof data.checkoutDate === 'string'
            )
            .map((data) => ({
                checkInDate: data.checkInDate,
                checkoutDate: data.checkoutDate,
            }));

        const blockedDates = blockedSnap.docs.map((doc) => {
            const data = doc.data();
            return { startDate: data.startDate, endDate: data.endDate };
        });

        res.setHeader(
            'Cache-Control',
            'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
        );
        return res.status(200).json({ reservations, blockedDates });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Parâmetros inválidos', details: error.issues });
        }
        console.error('Availability API error:', error);
        return res.status(500).json({ error: 'Não foi possível consultar a disponibilidade' });
    }
}
