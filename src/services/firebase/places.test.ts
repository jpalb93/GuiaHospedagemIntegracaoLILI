import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getDynamicPlaces,
    subscribeToPlaces,
    addDynamicPlace,
    updateDynamicPlace,
    deleteDynamicPlace,
    cleanupExpiredEvents,
} from './places';
import * as firestore from 'firebase/firestore';
import { PlaceRecommendation } from '../../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock config with cache
vi.mock('./config', () => ({
    db: {},
    cleanData: vi.fn((data) => data),
    getFromCache: vi.fn(),
    saveToCache: vi.fn(),
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        log: vi.fn(),
    },
}));

describe('Firebase Places Service', () => {
    const mockPlace: PlaceRecommendation = {
        id: 'place-1',
        name: 'Test Place',
        category: 'beaches',
        address: 'Test Address',
        description: 'Test Description',
        visible: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getDynamicPlaces', () => {
        it('should return cached data when available and not forcing refresh', async () => {
            const cachedPlaces = [mockPlace];
            const { getFromCache } = await import('./config');
            (getFromCache as any).mockReturnValue(cachedPlaces);

            const result = await getDynamicPlaces(false);

            expect(result).toEqual(cachedPlaces);
            expect(firestore.getDocs).not.toHaveBeenCalled();
        });

        it('should fetch from firestore when forceRefresh is true', async () => {
            const mockDocs = [
                { id: 'place-1', data: () => ({ name: 'Place 1', category: 'beaches' }) },
            ];

            (firestore.collection as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

            const result = await getDynamicPlaces(true);

            expect(firestore.getDocs).toHaveBeenCalled();
            expect(result).toHaveLength(1);
        });

        it('should save fetched data to cache', async () => {
            const { saveToCache } = await import('./config');
            const mockDocs = [
                { id: 'place-1', data: () => ({ name: 'Place 1' }) },
            ];

            (firestore.collection as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

            await getDynamicPlaces(true);

            expect(saveToCache).toHaveBeenCalledWith('cached_places', expect.any(Array));
        });

        it('should return empty array on error', async () => {
            const { logger } = await import('../../utils/logger');
            const { getFromCache } = await import('./config');
            (getFromCache as any).mockReturnValue(null);
            (firestore.collection as any).mockReturnValue({});
            (firestore.getDocs as any).mockRejectedValue(new Error('Fetch error'));

            const result = await getDynamicPlaces();

            expect(result).toEqual([]);
            expect(logger.error).toHaveBeenCalled();
        });
    });

    describe('subscribeToPlaces', () => {
        it('should call callback with places data', () => {
            const mockCallback = vi.fn();
            const mockSnapshot = {
                docs: [
                    { id: 'place-1', data: () => ({ name: 'Place 1' }) },
                ],
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((q, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => { };
            });

            subscribeToPlaces(mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith([
                    expect.objectContaining({ id: 'place-1', name: 'Place 1' }),
                ]);
            }, 10);
        });

        it('should return unsubscribe function', () => {
            const mockUnsubscribe = vi.fn();
            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = subscribeToPlaces(() => { });

            expect(typeof unsubscribe).toBe('function');
        });
    });

    describe('addDynamicPlace', () => {
        it('should add place and return id', async () => {
            const mockDocRef = { id: 'new-place-id' };
            (firestore.collection as any).mockReturnValue({});
            (firestore.addDoc as any).mockResolvedValue(mockDocRef);

            const placeWithoutId: Omit<PlaceRecommendation, 'id'> = {
                name: 'New Place',
                category: 'restaurants',
                visible: true,
            };

            const result = await addDynamicPlace(placeWithoutId);

            expect(result).toBe('new-place-id');
            expect(firestore.addDoc).toHaveBeenCalled();
        });
    });

    describe('updateDynamicPlace', () => {
        it('should update place without overwriting id', async () => {
            (firestore.doc as any).mockReturnValue({});
            (firestore.updateDoc as any).mockResolvedValue(undefined);

            await updateDynamicPlace('place-1', {
                name: 'Updated Name',
                id: 'should-be-removed',
            });

            expect(firestore.updateDoc).toHaveBeenCalledWith(
                {},
                expect.not.objectContaining({ id: expect.anything() })
            );
        });
    });

    describe('deleteDynamicPlace', () => {
        it('should delete place from firestore', async () => {
            (firestore.doc as any).mockReturnValue({});
            (firestore.deleteDoc as any).mockResolvedValue(undefined);

            await deleteDynamicPlace('place-to-delete');

            expect(firestore.deleteDoc).toHaveBeenCalled();
        });
    });

    describe('cleanupExpiredEvents', () => {
        beforeEach(() => {
            // Mock today's date as 2024-02-01
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2024-02-01'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should delete expired events', async () => {
            const mockBatch = {
                delete: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            const expiredEvent = {
                id: 'expired-event',
                ref: {},
                data: () => ({
                    category: 'events',
                    eventDate: '2024-01-15', // Expired
                    name: 'Old Event',
                }),
            };

            const futureEvent = {
                id: 'future-event',
                ref: {},
                data: () => ({
                    category: 'events',
                    eventDate: '2024-02-15', // Future
                    name: 'Future Event',
                }),
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({
                empty: false,
                docs: [expiredEvent, futureEvent],
            });
            (firestore.writeBatch as any).mockReturnValue(mockBatch);

            await cleanupExpiredEvents();

            expect(mockBatch.delete).toHaveBeenCalledTimes(1);
            expect(mockBatch.delete).toHaveBeenCalledWith(expiredEvent.ref);
            expect(mockBatch.commit).toHaveBeenCalled();
        });

        it('should use eventEndDate if available', async () => {
            const mockBatch = {
                delete: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            const expiredEventWithEndDate = {
                id: 'expired-event',
                ref: {},
                data: () => ({
                    category: 'events',
                    eventDate: '2024-01-10',
                    eventEndDate: '2024-01-20', // Expired
                    name: 'Multi-day Event',
                }),
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({
                empty: false,
                docs: [expiredEventWithEndDate],
            });
            (firestore.writeBatch as any).mockReturnValue(mockBatch);

            await cleanupExpiredEvents();

            expect(mockBatch.delete).toHaveBeenCalledTimes(1);
        });

        it('should not commit if no events to delete', async () => {
            const mockBatch = {
                delete: vi.fn(),
                commit: vi.fn().mockResolvedValue(undefined),
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({
                empty: false,
                docs: [],
            });
            (firestore.writeBatch as any).mockReturnValue(mockBatch);

            await cleanupExpiredEvents();

            expect(mockBatch.delete).not.toHaveBeenCalled();
            expect(mockBatch.commit).not.toHaveBeenCalled();
        });

        it('should handle empty snapshot', async () => {
            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({ empty: true });

            await cleanupExpiredEvents();

            expect(firestore.writeBatch).not.toHaveBeenCalled();
        });

        it('should handle errors gracefully', async () => {
            const { logger } = await import('../../utils/logger');

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));

            await cleanupExpiredEvents();

            expect(logger.error).toHaveBeenCalled();
        });
    });
});
