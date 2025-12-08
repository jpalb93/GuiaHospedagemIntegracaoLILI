import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGuestConfig } from './guest';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { GuestConfig } from '../types';

// Mock Capacitor
vi.mock('@capacitor/core', () => ({
    Capacitor: {
        isNativePlatform: vi.fn(),
    },
    CapacitorHttp: {
        get: vi.fn(),
    },
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    logger: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        log: vi.fn(),
    },
}));

// Mock global fetch
global.fetch = vi.fn();
global.console.error = vi.fn();

describe('Guest Service', () => {
    const mockGuestConfig: GuestConfig = {
        guestName: 'Test Guest',
        checkInDate: '2024-01-01',
        checkoutDate: '2024-01-05',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        isReleased: true,
        propertyId: 'lili',
        lockCode: '1234',
        wifiSSID: 'WiFi-Test',
        wifiPass: 'password123',
        safeCode: '0000',
        welcomeMessage: 'Welcome!',
        guestAlertActive: false,
        guestAlertText: '',
        flatNumber: '101',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('fetchGuestConfig - Native Platform', () => {
        beforeEach(() => {
            (Capacitor.isNativePlatform as any).mockReturnValue(true);
        });

        it('should fetch config successfully on native', async () => {
            (CapacitorHttp.get as any).mockResolvedValue({
                status: 200,
                data: mockGuestConfig,
            });

            const result = await fetchGuestConfig('ABC123');

            expect(CapacitorHttp.get).toHaveBeenCalledWith({
                url: 'https://flatsintegracao.com.br/api/get-guest-config?rid=ABC123',
            });
            expect(result).toEqual(mockGuestConfig);
        });

        it('should return null for 404 on native', async () => {
            const { logger } = await import('../utils/logger');

            (CapacitorHttp.get as any).mockResolvedValue({
                status: 404,
            });

            const result = await fetchGuestConfig('NOTFOUND');

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith('Reserva não encontrada na API (Native).');
        });

        it('should throw error for non-200 status on native', async () => {
            (CapacitorHttp.get as any).mockResolvedValue({
                status: 500,
            });

            await expect(fetchGuestConfig('ERROR')).rejects.toThrow('Erro na API (Native): 500');
        });

        it('should throw error on network failure (native)', async () => {
            (CapacitorHttp.get as any).mockRejectedValue(new Error('Network error'));

            await expect(fetchGuestConfig('NETWORK_ERR')).rejects.toThrow('Network error');
            expect(console.error).toHaveBeenCalledWith(
                'Erro ao buscar configuração do hóspede:',
                expect.any(Error)
            );
        });
    });

    describe('fetchGuestConfig - Web Platform', () => {
        beforeEach(() => {
            (Capacitor.isNativePlatform as any).mockReturnValue(false);
        });

        it('should fetch config successfully on web', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => mockGuestConfig,
            });

            const result = await fetchGuestConfig('WEB123');

            expect(global.fetch).toHaveBeenCalledWith('/api/get-guest-config?rid=WEB123');
            expect(result).toEqual(mockGuestConfig);
        });

        it('should return null for 404 on web', async () => {
            const { logger } = await import('../utils/logger');

            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
            });

            const result = await fetchGuestConfig('NOTFOUND_WEB');

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith('Reserva não encontrada na API.');
        });

        it('should throw error for non-ok response on web', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            });

            await expect(fetchGuestConfig('ERROR_WEB')).rejects.toThrow(
                'Erro na API: Internal Server Error'
            );
        });

        it('should throw error on network failure (web)', async () => {
            (global.fetch as any).mockRejectedValue(new Error('Fetch failed'));

            await expect(fetchGuestConfig('FETCH_FAIL')).rejects.toThrow('Fetch failed');
            expect(console.error).toHaveBeenCalledWith(
                'Erro ao buscar configuração do hóspede:',
                expect.any(Error)
            );
        });

        it('should parse JSON response correctly', async () => {
            const customConfig = { ...mockGuestConfig, guestName: 'Custom Name' };

            (global.fetch as any).mockResolvedValue({
                ok: true,
                status: 200,
                json: async () => customConfig,
            });

            const result = await fetchGuestConfig('CUSTOM');

            expect(result?.guestName).toBe('Custom Name');
        });
    });

    describe('fetchGuestConfig - Edge Cases', () => {
        it('should handle empty rid parameter', async () => {
            (Capacitor.isNativePlatform as any).mockReturnValue(false);
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
            });

            const result = await fetchGuestConfig('');

            expect(result).toBeNull();
        });

        it('should handle special characters in rid', async () => {
            (Capacitor.isNativePlatform as any).mockReturnValue(false);
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => mockGuestConfig,
            });

            await fetchGuestConfig('ABC-123_TEST');

            expect(global.fetch).toHaveBeenCalledWith('/api/get-guest-config?rid=ABC-123_TEST');
        });
    });
});
