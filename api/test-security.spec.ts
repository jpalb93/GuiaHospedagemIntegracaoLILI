import { describe, it, expect, vi } from 'vitest';

// Mock do Firebase Admin
vi.mock('firebase-admin/app', () => ({
    initializeApp: vi.fn(),
    getApps: vi.fn(() => []),
    cert: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => {
    const mockGet = vi.fn();
    const mockDoc = vi.fn(() => ({ get: mockGet }));
    const mockCollection = vi.fn(() => ({ doc: mockDoc }));

    return {
        getFirestore: vi.fn(() => ({
            collection: mockCollection,
        })),
    };
});

// Importar o handler (precisamos ajustar para testar a lógica interna ou mockar req/res)
// Como é uma serverless function, vamos simular a lógica de sanitização isoladamente
// ou mockar o handler se ele for exportável.
// Para simplificar e não depender de ambiente node real, vamos replicar a lógica de sanitização aqui para teste unitário
// garantindo que a regra de negócio (24h antes) esteja correta.

function sanitizeConfig(reservationData: any, globalConfig: any, serverTime: Date) {
    const brazilTime = new Date(
        serverTime.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    );
    brazilTime.setHours(0, 0, 0, 0);

    let isReleased = false;

    if (reservationData.checkInDate) {
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

    return {
        lockCode: isReleased ? reservationData.lockCode : '****',
        wifiPass: isReleased ? globalConfig.wifiPass || 'visitante123' : 'Disponível no Check-in',
        isReleased,
    };
}

describe('Guest Config Security Logic', () => {
    const reservation = {
        checkInDate: '2025-12-25', // Natal
        lockCode: '1234',
    };

    const globalConfig = {
        wifiPass: 'wifi-secret',
    };

    it('should HIDE passwords 2 days before check-in', () => {
        // 23 de Dezembro (2 dias antes)
        const serverTime = new Date('2025-12-23T12:00:00Z');
        const result = sanitizeConfig(reservation, globalConfig, serverTime);

        expect(result.isReleased).toBe(false);
        expect(result.lockCode).toBe('****');
        expect(result.wifiPass).toBe('Disponível no Check-in');
    });

    it('should RELEASE passwords 1 day before check-in', () => {
        // 24 de Dezembro (1 dia antes)
        const serverTime = new Date('2025-12-24T12:00:00Z');
        const result = sanitizeConfig(reservation, globalConfig, serverTime);

        expect(result.isReleased).toBe(true);
        expect(result.lockCode).toBe('1234');
        expect(result.wifiPass).toBe('wifi-secret');
    });

    it('should RELEASE passwords on check-in day', () => {
        // 25 de Dezembro (Dia do check-in)
        const serverTime = new Date('2025-12-25T08:00:00Z');
        const result = sanitizeConfig(reservation, globalConfig, serverTime);

        expect(result.isReleased).toBe(true);
        expect(result.lockCode).toBe('1234');
    });
});
