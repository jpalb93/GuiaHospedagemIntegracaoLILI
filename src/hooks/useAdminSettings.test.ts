import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAdminSettings } from './useAdminSettings';
import * as firebase from '../services/firebase';

// Mock Firebase services
vi.mock('../services/firebase', () => ({
    getAppSettings: vi.fn(),
    saveAppSettings: vi.fn(),
    getHeroImages: vi.fn(),
    updateHeroImages: vi.fn(),
    getSmartSuggestions: vi.fn(),
    saveSmartSuggestions: vi.fn(),
    getGuestReviews: vi.fn(),
    addGuestReview: vi.fn(),
    deleteGuestReview: vi.fn(),
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        log: vi.fn(),
    },
}));

describe('useAdminSettings', () => {
    const mockSettings = {
        wifiSSID: 'TestWiFi',
        wifiPass: 'password123',
        safeCode: '1234',
        noticeActive: true,
        noticeText: 'Test notice',
        aiSystemPrompt: 'AI prompt',
        aiSystemPrompts: {},
        cityCuriosities: ['Curiosity 1'],
        checklist: ['Item 1'],
    };

    const mockSuggestions = {
        morning: [{ id: '1', title: 'Morning activity' }],
        lunch: [],
        sunset: [],
        night: [],
    };

    const mockReviews = [
        { id: '1', name: 'John', text: 'Great!' },
        { id: '2', name: 'Jane', text: 'Amazing!' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        (firebase.getHeroImages as any).mockResolvedValue(['image1.jpg', 'image2.jpg']);
        (firebase.getAppSettings as any).mockResolvedValue(mockSettings);
        (firebase.getSmartSuggestions as any).mockResolvedValue(mockSuggestions);
        (firebase.getGuestReviews as any).mockResolvedValue(mockReviews);
    });

    describe('Initial Load', () => {
        it('should load all settings on mount', async () => {
            const { result } = renderHook(() => useAdminSettings());

            expect(result.current.loading).toBe(true);

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(firebase.getHeroImages).toHaveBeenCalledWith(true, 'lili');
            expect(firebase.getHeroImages).toHaveBeenCalledWith(true, 'integracao');
            expect(firebase.getAppSettings).toHaveBeenCalled();
            expect(firebase.getSmartSuggestions).toHaveBeenCalled();
            expect(firebase.getGuestReviews).toHaveBeenCalledWith(50);
        });

        it('should set hero images for both properties', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(result.current.heroImages.data.lili).toEqual(['image1.jpg', 'image2.jpg']);
                expect(result.current.heroImages.data.integracao).toEqual(['image1.jpg', 'image2.jpg']);
            });
        });

        it('should set app settings with defaults', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(result.current.settings.data.wifiSSID).toBe('TestWiFi');
                expect(result.current.settings.data.safeCode).toBe('1234');
            });
        });

        it('should handle missing app settings gracefully', async () => {
            (firebase.getAppSettings as any).mockResolvedValue(null);

            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(result.current.settings.data.wifiSSID).toBe('');
                expect(result.current.loading).toBe(false);
            });
        });

        it('should normalize suggestions arrays', async () => {
            (firebase.getSmartSuggestions as any).mockResolvedValue({
                morning: [{ id: '1', title: 'Test' }],
                lunch: null, // Non-array
                sunset: undefined,
                night: [],
            });

            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(Array.isArray(result.current.suggestions.data.lunch)).toBe(true);
                expect(result.current.suggestions.data.lunch).toEqual([]);
            });
        });

        it('should set reviews', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(result.current.reviews.data).toEqual(mockReviews);
            });
        });

        it('should handle load errors gracefully', async () => {
            const { logger } = await import('../utils/logger');
            (firebase.getAppSettings as any).mockRejectedValue(new Error('Load failed'));

            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
                expect(logger.error).toHaveBeenCalled();
            });
        });
    });

    describe('Hero Images Actions', () => {
        it('should update hero images for lili', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newImages = ['new1.jpg', 'new2.jpg'];
            await result.current.heroImages.update(newImages, 'lili');

            expect(firebase.updateHeroImages).toHaveBeenCalledWith(newImages, 'lili');
            expect(result.current.heroImages.data.lili).toEqual(newImages);
        });

        it('should update hero images for integracao', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newImages = ['integracao1.jpg'];
            await result.current.heroImages.update(newImages, 'integracao');

            expect(firebase.updateHeroImages).toHaveBeenCalledWith(newImages, 'integracao');
            expect(result.current.heroImages.data.integracao).toEqual(newImages);
        });
    });

    describe('Settings Actions', () => {
        it('should save app settings', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newSettings = { ...mockSettings, wifiSSID: 'NewWiFi' };
            await result.current.settings.save(newSettings);

            expect(firebase.saveAppSettings).toHaveBeenCalledWith(newSettings);
            expect(result.current.settings.data.wifiSSID).toBe('NewWiFi');
        });
    });

    describe('Suggestions Actions', () => {
        it('should save suggestions', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newSuggestions = {
                morning: [{ id: '2', title: 'New activity' }],
                lunch: [],
                sunset: [],
                night: [],
            };

            await result.current.suggestions.save(newSuggestions);

            expect(firebase.saveSmartSuggestions).toHaveBeenCalledWith(newSuggestions);
            expect(result.current.suggestions.data).toEqual(newSuggestions);
        });
    });

    describe('Reviews Actions', () => {
        it('should add a review', async () => {
            (firebase.addGuestReview as any).mockResolvedValue('new-review-id');

            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            const newReview = { name: 'Bob', text: 'Excellent!' };
            const id = await result.current.reviews.add(newReview);

            expect(id).toBe('new-review-id');
            expect(firebase.addGuestReview).toHaveBeenCalledWith(newReview);
            expect(result.current.reviews.data).toContainEqual({
                id: 'new-review-id',
                ...newReview,
            });
        });

        it('should delete a review', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            await result.current.reviews.delete('1');

            expect(firebase.deleteGuestReview).toHaveBeenCalledWith('1');
            expect(result.current.reviews.data.find((r) => r.id === '1')).toBeUndefined();
        });
    });

    describe('Refresh', () => {
        it('should reload all settings', async () => {
            const { result } = renderHook(() => useAdminSettings());

            await waitFor(() => expect(result.current.loading).toBe(false));

            vi.clearAllMocks();

            await result.current.refresh();

            expect(firebase.getAppSettings).toHaveBeenCalled();
            expect(firebase.getHeroImages).toHaveBeenCalledTimes(2);
        });
    });
});
