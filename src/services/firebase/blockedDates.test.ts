import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    addBlockedDate,
    deleteBlockedDate,
    subscribeToBlockedDates,
    subscribeToFutureBlockedDates,
} from './blockedDates';
import * as firestore from 'firebase/firestore';
import { BlockedDateRange } from '../../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock config
vi.mock('./config', () => ({
    db: {},
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

describe('Firebase BlockedDates Service', () => {
    const mockBlockedDate: BlockedDateRange = {
        id: 'block-1',
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        reason: 'Maintenance',
        propertyId: 'lili',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('addBlockedDate', () => {
        it('should add blocked date to firestore', async () => {
            (firestore.collection as any).mockReturnValue({});
            (firestore.addDoc as any).mockResolvedValue({ id: 'new-block-id' });

            await addBlockedDate(mockBlockedDate);

            expect(firestore.addDoc).toHaveBeenCalledWith({}, mockBlockedDate);
        });
    });

    describe('deleteBlockedDate', () => {
        it('should delete blocked date from firestore', async () => {
            (firestore.doc as any).mockReturnValue({});
            (firestore.deleteDoc as any).mockResolvedValue(undefined);

            await deleteBlockedDate('block-to-delete');

            expect(firestore.deleteDoc).toHaveBeenCalled();
        });
    });

    describe('subscribeToBlockedDates', () => {
        it('should subscribe to all blocked dates', () => {
            const mockCallback = vi.fn();
            const mockSnapshot = {
                docs: [
                    { id: 'block-1', data: () => ({ startDate: '2024-01-01', endDate: '2024-01-05' }) },
                    { id: 'block-2', data: () => ({ startDate: '2024-02-01', endDate: '2024-02-05' }) },
                ],
            };

            (firestore.collection as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((collectionRef, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => { };
            });

            subscribeToBlockedDates(mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith([
                    expect.objectContaining({ id: 'block-1' }),
                    expect.objectContaining({ id: 'block-2' }),
                ]);
            }, 10);
        });

        it('should return unsubscribe function', () => {
            const mockUnsubscribe = vi.fn();
            (firestore.collection as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = subscribeToBlockedDates(() => { });

            expect(typeof unsubscribe).toBe('function');
        });
    });

    describe('subscribeToFutureBlockedDates', () => {
        beforeEach(() => {
            // Mock today as 2024-01-15
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2024-01-15'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should filter blocked dates by endDate >= today', () => {
            const mockCallback = vi.fn();

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(() => { });

            subscribeToFutureBlockedDates(mockCallback);

            // Should query with where endDate >= today
            expect(firestore.where).toHaveBeenCalledWith('endDate', '>=', '2024-01-15');
        });

        it('should subscribe to future blocked dates', () => {
            const mockCallback = vi.fn();
            const mockSnapshot = {
                docs: [
                    {
                        id: 'future-block',
                        data: () => ({ startDate: '2024-01-20', endDate: '2024-01-25' }),
                    },
                ],
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((q, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => { };
            });

            subscribeToFutureBlockedDates(mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith([
                    expect.objectContaining({ id: 'future-block' }),
                ]);
            }, 10);
        });

        it('should return unsubscribe function', () => {
            const mockUnsubscribe = vi.fn();
            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = subscribeToFutureBlockedDates(() => { });

            expect(typeof unsubscribe).toBe('function');
        });
    });

    describe('Error Handling', () => {
        it('should log error in subscription when error occurs', () => {
            const mockCallback = vi.fn();

            (firestore.collection as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((collectionRef, onNext, onError) => {
                setTimeout(() => onError(new Error('Firestore error')), 0);
                return () => { };
            });

            subscribeToBlockedDates(mockCallback);

            // Error should be logged
            setTimeout(async () => {
                const { logger } = await import('../../utils/logger');
                expect(logger.error).toHaveBeenCalled();
            }, 10);
        });
    });
});
