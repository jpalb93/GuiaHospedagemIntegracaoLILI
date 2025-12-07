import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useGuestData } from './useGuestData';
import * as firebaseService from '../services/firebase';
import { GuestConfig, PlaceRecommendation } from '../types';

// Mock do módulo firebase com TODAS as funções usadas pelo hook
vi.mock('../services/firebase', () => ({
    // Funções de carregamento estático
    getHeroImages: vi.fn(),
    getTips: vi.fn(),
    getCuriosities: vi.fn(),

    // Funções de subscription em tempo real - retornam função de unsubscribe
    subscribeToPlaces: vi.fn((callback) => {
        // Chama o callback com dados mock imediatamente
        setTimeout(() => callback([]), 0);
        return () => {}; // Função de unsubscribe
    }),
    subscribeToAppSettings: vi.fn((callback) => {
        setTimeout(() => callback(null), 0);
        return () => {};
    }),
    subscribeToSmartSuggestions: vi.fn((callback) => {
        setTimeout(() => callback(null), 0);
        return () => {};
    }),
}));

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        clear: () => {
            store = {};
        },
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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
        flatNumber: '101',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.clear();

        // Setup default mocks
        (firebaseService.getHeroImages as any).mockResolvedValue([]);
        (firebaseService.getTips as any).mockResolvedValue([]);
        (firebaseService.getCuriosities as any).mockResolvedValue([]);
    });

    it('should return initial state with empty arrays', async () => {
        const { result } = renderHook(() => useGuestData(mockConfig));

        // Estado inicial deve estar vazio
        expect(result.current.dynamicPlaces).toEqual([]);
        expect(result.current.tips).toEqual([]);
    });

    it('should load hero images and tips from Firebase', async () => {
        // Setup mocks para retornar dados
        (firebaseService.getHeroImages as any).mockResolvedValue(['img1.jpg', 'img2.jpg']);
        (firebaseService.getTips as any).mockResolvedValue([
            { id: '1', text: 'Dica 1', visible: true },
            { id: '2', text: 'Dica 2', visible: true },
        ]);
        (firebaseService.getCuriosities as any).mockResolvedValue([
            { text: 'Curiosidade 1', visible: true },
        ]);

        const { result } = renderHook(() => useGuestData(mockConfig));

        // Aguarda carregar os dados
        await waitFor(() => {
            expect(result.current.heroImages).toContain('img1.jpg');
        });

        await waitFor(() => {
            expect(result.current.tips).toHaveLength(2);
        });

        await waitFor(() => {
            expect(result.current.curiosities).toHaveLength(1);
        });
    });

    it('should handle Firebase errors gracefully', async () => {
        // Mock erro
        (firebaseService.getHeroImages as any).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useGuestData(mockConfig));

        // Deve continuar funcionando sem crashar
        await waitFor(() => {
            expect(result.current.dynamicPlaces).toEqual([]);
        });
    });

    it('should receive places from subscription', async () => {
        const mockPlaces: PlaceRecommendation[] = [
            { id: '1', name: 'Bar do Zé', category: 'bars', visible: true },
            { id: '2', name: 'Café Central', category: 'cafes', visible: true },
        ];

        // Mock subscribeToPlaces para chamar callback com dados
        (firebaseService.subscribeToPlaces as any).mockImplementation(
            (callback: (places: PlaceRecommendation[]) => void) => {
                setTimeout(() => callback(mockPlaces), 10);
                return () => {};
            }
        );

        const { result } = renderHook(() => useGuestData(mockConfig));

        await waitFor(() => {
            expect(result.current.dynamicPlaces).toHaveLength(2);
            expect(result.current.dynamicPlaces[0].name).toBe('Bar do Zé');
        });
    });

    it('should filter tips for "integracao" property', async () => {
        (firebaseService.getTips as any).mockResolvedValue([
            { id: '1', text: 'Dica 1', visible: true },
        ]);

        const integracaoConfig = { ...mockConfig, propertyId: 'integracao' as const };
        const { result } = renderHook(() => useGuestData(integracaoConfig));

        // Para integracao, tips deve ser vazio
        await waitFor(() => {
            expect(result.current.tips).toEqual([]);
        });
    });

    it('should provide mergePlaces helper that combines dynamic and static places', async () => {
        const mockPlaces: PlaceRecommendation[] = [
            { id: '1', name: 'Dynamic Bar', category: 'bars', visible: true },
        ];

        (firebaseService.subscribeToPlaces as any).mockImplementation(
            (callback: (places: PlaceRecommendation[]) => void) => {
                setTimeout(() => callback(mockPlaces), 10);
                return () => {};
            }
        );

        const { result } = renderHook(() => useGuestData(mockConfig));

        await waitFor(() => {
            expect(result.current.dynamicPlaces).toHaveLength(1);
        });

        // Testa mergePlaces
        const staticPlaces: PlaceRecommendation[] = [
            { id: '2', name: 'Static Bar', category: 'bars', visible: true },
        ];
        const merged = result.current.mergePlaces(staticPlaces, 'bars');

        expect(merged).toHaveLength(2);
        expect(merged.some((p) => p.name === 'Dynamic Bar')).toBe(true);
        expect(merged.some((p) => p.name === 'Static Bar')).toBe(true);
    });

    it('should provide hasContent helper', async () => {
        const mockPlaces: PlaceRecommendation[] = [
            { id: '1', name: 'Test Bar', category: 'bars', visible: true },
        ];

        (firebaseService.subscribeToPlaces as any).mockImplementation(
            (callback: (places: PlaceRecommendation[]) => void) => {
                setTimeout(() => callback(mockPlaces), 10);
                return () => {};
            }
        );

        const { result } = renderHook(() => useGuestData(mockConfig));

        await waitFor(() => {
            expect(result.current.dynamicPlaces).toHaveLength(1);
        });

        expect(result.current.hasContent([], 'bars')).toBe(true);
        expect(result.current.hasContent([], 'cafes')).toBe(false);
    });
});
