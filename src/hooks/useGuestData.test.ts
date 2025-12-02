import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuestData } from './useGuestData';
import * as firebaseService from '../services/firebase';
import { GuestConfig } from '../types';

// Mock do módulo firebase
vi.mock('../services/firebase', () => ({
    getDynamicPlaces: vi.fn(),
    getHeroImages: vi.fn(),
    getTips: vi.fn(),
    getCuriosities: vi.fn(),
    subscribeToAppSettings: vi.fn(() => () => { }), // Retorna função de unsubscribe
    subscribeToSmartSuggestions: vi.fn(() => () => { }),
}));

describe('useGuestData Hook', () => {
    const mockConfig: GuestConfig = {
        guestName: 'Teste',
        checkInDate: '2024-01-01',
        checkoutDate: '2024-01-05',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        welcomeMessage: 'Bem-vindo',
        guestAlertActive: false,
        guestAlertText: '',
        lockCode: '1234',
        wifiSSID: 'Wifi',
        wifiPass: 'Pass',
        safeCode: '0000',
        isReleased: true,
        propertyId: 'lili',
        flatNumber: '101'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should load initial data correctly', async () => {
        // Setup mocks
        (firebaseService.getDynamicPlaces as any).mockResolvedValue([
            { id: '1', name: 'Place 1', category: 'food', visible: true }
        ]);
        (firebaseService.getHeroImages as any).mockResolvedValue(['img1.jpg']);
        (firebaseService.getTips as any).mockResolvedValue([
            { id: '1', text: 'Tip 1', visible: true }
        ]);
        (firebaseService.getCuriosities as any).mockResolvedValue([
            { text: 'Curiosity 1', visible: true }
        ]);

        const { result } = renderHook(() => useGuestData(mockConfig));

        // Initial state check
        expect(result.current.dynamicPlaces).toEqual([]);

        // Wait for async updates
        await waitFor(() => {
            expect(result.current.dynamicPlaces).toHaveLength(1);
            expect(result.current.heroImages).toContain('img1.jpg');
            expect(result.current.tips).toHaveLength(1);
            expect(result.current.curiosities).toHaveLength(1);
        });
    });

    it('should handle errors gracefully', async () => {
        // Mock error
        (firebaseService.getDynamicPlaces as any).mockRejectedValue(new Error('Fetch error'));

        const { result } = renderHook(() => useGuestData(mockConfig));

        await waitFor(() => {
            // Should not crash, just empty state or logged error
            expect(result.current.dynamicPlaces).toEqual([]);
        });
    });

    it('should filter tips for "integracao" property', async () => {
        (firebaseService.getTips as any).mockResolvedValue([
            { id: '1', text: 'Tip 1', visible: true }
        ]);

        const integracaoConfig = { ...mockConfig, propertyId: 'integracao' as const };
        const { result } = renderHook(() => useGuestData(integracaoConfig));

        await waitFor(() => {
            expect(result.current.tips).toEqual([]);
        });
    });
});
