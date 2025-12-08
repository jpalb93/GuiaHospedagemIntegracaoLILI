import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAdminContent } from './useAdminContent';
import * as firebase from '../services/firebase';

// Mock Firebase services
vi.mock('../services/firebase', () => ({
    getDynamicPlaces: vi.fn(),
    addDynamicPlace: vi.fn(),
    updateDynamicPlace: vi.fn(),
    deleteDynamicPlace: vi.fn(),
    getTips: vi.fn(),
    addTip: vi.fn(),
    updateTip: vi.fn(),
    deleteTip: vi.fn(),
    saveTipsOrder: vi.fn(),
    getCuriosities: vi.fn(),
    saveCuriosities: vi.fn(),
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

// Mock window.confirm
global.confirm = vi.fn(() => true);

describe('useAdminContent', () => {
    const mockPlaces = [
        { id: '1', name: 'Place 1', category: 'restaurants' as const, visible: true },
        { id: '2', name: 'Place 2', category: 'beaches' as const, visible: true },
    ];

    const mockTips = [
        { id: '1', title: 'Tip 1', description: 'Desc 1', order: 0, visible: true },
        { id: '2', title: 'Tip 2', description: 'Desc 2', order: 1, visible: true },
    ];

    const mockCuriosities = [
        { text: 'Curiosity 1', visible: true },
        { text: 'Curiosity 2', visible: true },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (firebase.getDynamicPlaces as any).mockResolvedValue(mockPlaces);
        (firebase.getTips as any).mockResolvedValue(mockTips);
        (firebase.getCuriosities as any).mockResolvedValue(mockCuriosities);
    });

    describe('Initialization', () => {
        it('should load curiosities on mount', async () => {
            const { result } = renderHook(() => useAdminContent());

            await waitFor(() => {
                expect(result.current.curiosities.data).toEqual(mockCuriosities);
            });

            expect(firebase.getCuriosities).toHaveBeenCalled();
        });

        it('should not load places/tips automatically', () => {
            renderHook(() => useAdminContent());

            expect(firebase.getDynamicPlaces).not.toHaveBeenCalled();
            expect(firebase.getTips).not.toHaveBeenCalled();
        });
    });

    describe('Places', () => {
        it('should load places when refresh is called', async () => {
            const { result } = renderHook(() => useAdminContent());

            await result.current.places.refresh();

            expect(firebase.getDynamicPlaces).toHaveBeenCalledWith(true);
            await waitFor(() => {
                expect(result.current.places.data).toEqual(mockPlaces);
            });
        });

        it('should filter expired events during load', async () => {
            const today = new Date();
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - 2);
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + 2);

            const placesWithExpired = [
                {
                    id: '1',
                    name: 'Expired Event',
                    category: 'events' as const,
                    eventDate: pastDate.toISOString().split('T')[0], // Expired
                    visible: true,
                },
                {
                    id: '2',
                    name: 'Future Event',
                    category: 'events' as const,
                    eventDate: futureDate.toISOString().split('T')[0],
                    visible: true,
                },
            ];

            (firebase.getDynamicPlaces as any).mockResolvedValue(placesWithExpired);
            (firebase.deleteDynamicPlace as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminContent());

            await result.current.places.refresh();

            await waitFor(() => {
                expect(result.current.places.data).toHaveLength(1);
                expect(result.current.places.data[0].name).toBe('Future Event');
            });
        });

        it('should add place optimistically', async () => {
            (firebase.addDynamicPlace as any).mockResolvedValue('new-id');
            (firebase.getDynamicPlaces as any).mockResolvedValue([
                ...mockPlaces,
                { id: 'new-id', name: 'New Place', category: 'restaurants', visible: true },
            ]);

            const { result } = renderHook(() => useAdminContent());

            const newPlace = { name: 'New Place', category: 'restaurants' as const, visible: true };
            await result.current.places.add(newPlace);

            // Should have temp place
            expect(result.current.places.data[0].name).toBe('New Place');
        });
    });

    describe('Tips', () => {
        it('should load tips when refresh is called', async () => {
            const { result } = renderHook(() => useAdminContent());

            await result.current.tips.refresh();

            expect(firebase.getTips).toHaveBeenCalled();
            await waitFor(() => {
                expect(result.current.tips.data).toEqual(mockTips);
            });
        });

        it('should add tip', async () => {
            (firebase.addTip as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminContent());

            const newTip = { id: '3', title: 'New Tip', description: 'New Desc', order: 2, visible: true };
            const success = await result.current.tips.add(newTip);

            expect(success).toBe(true);
            expect(firebase.addTip).toHaveBeenCalledWith(newTip);
        });

        it('should handle tip add error', async () => {
            (firebase.addTip as any).mockRejectedValue(new Error('Add failed'));

            const { result } = renderHook(() => useAdminContent());

            const newTip = { id: '3', title: 'New', description: 'Desc', order: 2, visible: true };
            const success = await result.current.tips.add(newTip);

            expect(success).toBe(false);
        });
    });

    describe('Curiosities', () => {
        it('should save curiosities', async () => {
            (firebase.saveCuriosities as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminContent());

            await waitFor(() => expect(result.current.curiosities.loading).toBe(false));

            const newCuriosities = [{ text: 'New curiosity', visible: true }];
            const success = await result.current.curiosities.save(newCuriosities);

            expect(success).toBe(true);
            expect(firebase.saveCuriosities).toHaveBeenCalledWith(newCuriosities);
        });

        it('should prevent saving empty curiosities without force', async () => {
            const { result } = renderHook(() => useAdminContent());

            await waitFor(() => expect(result.current.curiosities.data).toHaveLength(2));

            const success = await result.current.curiosities.save([], false);

            expect(success).toBe(false);
            expect(firebase.saveCuriosities).not.toHaveBeenCalled();
        });

        it('should allow saving empty curiosities with force', async () => {
            (firebase.saveCuriosities as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminContent());

            await waitFor(() => expect(result.current.curiosities.data).toHaveLength(2));

            const success = await result.current.curiosities.save([], true);

            expect(success).toBe(true);
            expect(firebase.saveCuriosities).toHaveBeenCalledWith([]);
        });
    });
});
