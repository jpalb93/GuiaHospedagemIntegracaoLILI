import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { GuestConfig } from '../types';
import { logger } from '../utils/logger';

export const fetchGuestConfig = async (rid: string): Promise<GuestConfig | null> => {
    try {
        const isNative = Capacitor.isNativePlatform();

        if (isNative) {
            const targetUrl = `https://flatsintegracao.com.br/api/get-guest-config?rid=${rid}`;

            const response = await CapacitorHttp.get({
                url: targetUrl,
            });

            if (response.status === 404) {
                logger.warn('Reserva não encontrada na API (Native).');
                return null;
            }

            if (response.status !== 200) {
                throw new Error(`Erro na API (Native): ${response.status}`);
            }

            return response.data as GuestConfig;
        }

        // Web Fallback
        const response = await fetch(`/api/get-guest-config?rid=${rid}`);

        if (!response.ok) {
            if (response.status === 404) {
                logger.warn('Reserva não encontrada na API.');
                return null;
            }
            throw new Error(`Erro na API: ${response.statusText}`);
        }

        const data = await response.json();

        // Check for SW offline response
        if (data && (data as any).error === 'offline') {
            throw new Error('Offline (Service Worker)');
        }

        return data as GuestConfig;
    } catch (error) {
        console.error('Erro ao buscar configuração do hóspede:', error);
        throw error; // Re-throw to allow retry logic in App.tsx
    }
};
