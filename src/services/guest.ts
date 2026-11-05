import { GuestConfig } from '../types';
import { GuestConfigSchema } from '../schemas';
import { logger } from '../utils/logger';

const PROD_API_BASE = 'https://www.flatsintegracao.com.br';

async function fetchFromFirestoreDevFallback(rid: string): Promise<GuestConfig | null> {
    try {
        const [
            { getFirestoreInstance },
            { collection, doc, getDoc, getDocs, limit, query, where },
        ] = await Promise.all([import('./firebase/config'), import('firebase/firestore')]);

        const db = await getFirestoreInstance();
        let reservationData: Record<string, unknown> | null = null;

        if (rid.length <= 8) {
            const q = query(collection(db, 'reservations'), where('shortId', '==', rid), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) {
                reservationData = snap.docs[0].data() as Record<string, unknown>;
            }
        } else {
            const snap = await getDoc(doc(db, 'reservations', rid));
            if (snap.exists()) {
                reservationData = snap.data() as Record<string, unknown>;
            }
        }

        if (!reservationData) return null;

        const configSnap = await getDoc(doc(db, 'app_config', 'general'));
        const globalConfig = (configSnap.exists() ? configSnap.data() : {}) as Record<
            string,
            unknown
        >;

        const safeConfig = {
            stayType: (reservationData.stayType as 'overnight' | 'day_use') || 'overnight',
            guestName: String(reservationData.guestName || 'Hóspede'),
            checkInDate: reservationData.checkInDate as string | undefined,
            checkoutDate: reservationData.checkoutDate as string | undefined,
            checkInTime: reservationData.checkInTime as string | undefined,
            checkOutTime: reservationData.checkOutTime as string | undefined,
            welcomeMessage: reservationData.welcomeMessage as string | undefined,
            guestAlertActive: Boolean(reservationData.guestAlertActive),
            guestAlertText: reservationData.guestAlertText as string | undefined,
            lockCode: String(reservationData.lockCode || ''),
            wifiSSID: String(globalConfig.wifiSSID || 'Flat_Petrolina_5G'),
            wifiPass: String(globalConfig.wifiPass || 'visitante123'),
            safeCode: String(globalConfig.safeCode || '----'),
            isReleased: true,
            propertyId: (reservationData.propertyId as 'lili' | 'integracao') || 'lili',
            flatNumber: reservationData.flatNumber as string | undefined,
            manualDeactivation: Boolean(reservationData.manualDeactivation),
        };

        const parsed = GuestConfigSchema.safeParse(safeConfig);
        return parsed.success ? (parsed.data as GuestConfig) : (safeConfig as GuestConfig);
    } catch (err) {
        logger.warn('Fallback Firestore dev falhou:', { err });
        return null;
    }
}

export const fetchGuestConfig = async (rid: string): Promise<GuestConfig | null> => {
    try {
        // Web Fetch
        let response = await fetch(`/api/get-guest-config?rid=${rid}`);

        // Em localhost (Vite sem vercel dev), /api/* pode retornar o index.html (text/html)
        const contentType = response.headers?.get?.('content-type') || '';
        const isHtmlFallback = contentType.includes('text/html');

        if (isHtmlFallback) {
            try {
                response = await fetch(
                    `${PROD_API_BASE}/api/get-guest-config?rid=${encodeURIComponent(rid)}`
                );
            } catch (_prodErr) {
                const devConfig = await fetchFromFirestoreDevFallback(rid);
                if (devConfig) return devConfig;
            }
        }

        if (!response.ok) {
            if (response.status === 404 || response.status === 410) {
                // Em ambiente local, se não encontrou na API de produção (ou se é reserva local/admin autenticado), tenta Firestore direto
                if (
                    typeof window !== 'undefined' &&
                    (window.location.hostname === 'localhost' ||
                        window.location.hostname === '127.0.0.1')
                ) {
                    const devConfig = await fetchFromFirestoreDevFallback(rid);
                    if (devConfig) return devConfig;
                }
                logger.warn('Reserva não encontrada na API.');
                return null;
            }
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        let data: unknown;
        try {
            data = await response.json();
        } catch (jsonErr) {
            // Caso o Vite retorne HTML sem header content-type explícito no ambiente local
            if (
                typeof window !== 'undefined' &&
                (window.location.hostname === 'localhost' ||
                    window.location.hostname === '127.0.0.1')
            ) {
                try {
                    const prodResp = await fetch(
                        `${PROD_API_BASE}/api/get-guest-config?rid=${encodeURIComponent(rid)}`
                    );
                    if (prodResp.ok) {
                        data = await prodResp.json();
                    } else if (prodResp.status === 404 || prodResp.status === 410) {
                        return await fetchFromFirestoreDevFallback(rid);
                    }
                } catch (_e) {
                    const devConfig = await fetchFromFirestoreDevFallback(rid);
                    if (devConfig) return devConfig;
                }
            }
            if (!data) throw jsonErr;
        }

        // Check for SW offline response
        if (
            data &&
            typeof data === 'object' &&
            'error' in data &&
            (data as { error: unknown }).error === 'offline'
        ) {
            throw new Error('Offline (Service Worker)');
        }

        // Validação Zod com tratamento de erro amigável
        const result = GuestConfigSchema.safeParse(data);

        if (!result.success) {
            logger.error('Erro de validação nos dados da reserva', {
                errors: result.error.format(),
                raw: data,
            });
            throw new Error('Dados da reserva inválidos recebidos da API.');
        }

        return result.data as GuestConfig;
    } catch (error) {
        console.error('Erro ao buscar configuração do hóspede:', error);
        throw error; // Re-throw to allow retry logic in App.tsx
    }
};
