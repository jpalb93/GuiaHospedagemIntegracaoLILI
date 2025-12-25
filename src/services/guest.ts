import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { GuestConfig } from '../types';
import { GuestConfigSchema } from '../schemas';
import { logger } from '../utils/logger';

export const fetchGuestConfig = async (rid: string): Promise<GuestConfig | null> => {
    try {
        const isNative = Capacitor.isNativePlatform();
        let data: unknown;

        if (isNative) {
            const targetUrl = `https://flatsintegracao.com.br/api/get-guest-config?rid=${rid}`;
            const response = await CapacitorHttp.get({ url: targetUrl });

            if (response.status === 404) {
                logger.warn('Reserva não encontrada na API (Native).');
                return null;
            }

            if (response.status !== 200) {
                throw new Error(`Erro na API (Native): ${response.status}`);
            }

            data = response.data;
        } else {
            // Web Fallback
            const response = await fetch(`/api/get-guest-config?rid=${rid}`);

            if (!response.ok) {
                if (response.status === 404) {
                    logger.warn('Reserva não encontrada na API.');
                    return null;
                }
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            data = await response.json();

            // Check for SW offline response
            if (
                data &&
                typeof data === 'object' &&
                'error' in data &&
                (data as { error: unknown }).error === 'offline'
            ) {
                throw new Error('Offline (Service Worker)');
            }
        }

        // Validação Zod com tratamento de erro amigável
        const result = GuestConfigSchema.safeParse(data);

        if (!result.success) {
            logger.error('Erro de validação nos dados da reserva', {
                errors: result.error.format(),
                raw: data,
            });
            // Opcional: Retornar null ou lançar erro, dependendo da severidade
            throw new Error('Dados da reserva inválidos recebidos da API.');
        }

        return result.data as GuestConfig;
    } catch (error) {
        console.error('Erro ao buscar configuração do hóspede:', error);
        throw error; // Re-throw to allow retry logic in App.tsx
    }
};
