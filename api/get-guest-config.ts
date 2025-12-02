import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Initialize Firebase Admin
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    } catch (error) {
        console.error('Firebase Admin initialization error', error);
    }
}

const db = getFirestore();

// Schema de Validação
const QuerySchema = z.object({
    rid: z.string().min(1, "Missing reservation ID (rid)")
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS (Basic handling if needed, but reverting to original behavior)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Validação com Zod
        const { rid } = QuerySchema.parse(req.query);

        // 1. Fetch Reservation
        let reservationData: Record<string, unknown> = {};

        // DETECT SHORT ID (Assuming Doc IDs are > 15 chars, Short IDs are ~6)
        if (rid.length <= 8) {
            const q = db.collection('reservations').where('shortId', '==', rid).limit(1);
            const snapshot = await q.get();

            if (snapshot.empty) {
                return res.status(404).json({ error: 'Reservation not found (Short ID)' });
            }

            const doc = snapshot.docs[0];
            reservationData = doc.data();
        } else {
            const reservationRef = db.collection('reservations').doc(rid);
            const reservationSnap = await reservationRef.get();

            if (!reservationSnap.exists) {
                return res.status(404).json({ error: 'Reservation not found' });
            }
            reservationData = reservationSnap.data() || {};
        }

        // 2. Fetch Global Config (for Wi-Fi)
        const configRef = db.collection('app_config').doc('general');
        const configSnap = await configRef.get();
        const globalConfig = configSnap.data() || {};

        // 3. Time Validation (Server Time)
        // Using Sao Paulo time for consistency with the business location
        const now = new Date();
        const brazilTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
        brazilTime.setHours(0, 0, 0, 0);

        let isReleased = false;

        if (reservationData.checkInDate && typeof reservationData.checkInDate === 'string') {
            const [year, month, day] = reservationData.checkInDate.split('-').map(Number);
            const checkIn = new Date(year, month - 1, day);
            checkIn.setHours(0, 0, 0, 0);

            // Release 1 day before check-in
            const releaseDate = new Date(checkIn);
            releaseDate.setDate(releaseDate.getDate() - 1);

            if (brazilTime.getTime() >= releaseDate.getTime()) {
                isReleased = true;
            }
        }

        // 4. Sanitize Data
        const safeConfig = {
            guestName: reservationData.guestName,
            checkInDate: reservationData.checkInDate,
            checkoutDate: reservationData.checkoutDate,
            checkInTime: reservationData.checkInTime,
            checkOutTime: reservationData.checkOutTime,
            welcomeMessage: reservationData.welcomeMessage,
            guestAlertActive: reservationData.guestAlertActive,
            guestAlertText: reservationData.guestAlertText,
            // Always include these, but value depends on release
            lockCode: isReleased ? reservationData.lockCode : '****',
            wifiSSID: globalConfig.wifiSSID || 'Flat_Petrolina_5G',
            wifiPass: isReleased ? (globalConfig.wifiPass || 'visitante123') : 'Disponível no Check-in',
            safeCode: isReleased ? (globalConfig.safeCode || '----') : '****',
            isReleased: isReleased, // Helper for frontend UI
            propertyId: reservationData.propertyId || 'lili',
            flatNumber: reservationData.flatNumber
        };

        return res.status(200).json(safeConfig);

    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: "Parâmetros inválidos", details: error.issues });
        }
        console.error('Error fetching guest config:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
