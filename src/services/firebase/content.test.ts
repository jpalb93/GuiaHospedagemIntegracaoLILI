import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    getTips,
    addTip,
    updateTip,
    deleteTip,
    saveTipsOrder,
    getCuriosities,
    saveCuriosities,
    getGuestReviews,
    addGuestReview,
    deleteGuestReview,
} from './content';
import * as firestore from 'firebase/firestore';
import { Tip, CityCuriosity, GuestReview } from '../../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock config
vi.mock('./config', () => ({
    db: {},
    cleanData: vi.fn((data) => data),
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

describe('Firebase Content Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Tips Management', () => {
        const mockTip: Tip = {
            id: 'tip-1',
            title: 'Test Tip',
            description: 'Test Description',
            icon: 'test-icon',
            category: 'beaches',
            order: 0,
            visible: true,
        };

        describe('getTips', () => {
            it('should return tips ordered by order field', async () => {
                const mockDocs = [
                    { id: 'tip-1', data: () => ({ title: 'Tip 1', order: 0 }) },
                    { id: 'tip-2', data: () => ({ title: 'Tip 2', order: 1 }) },
                ];

                (firestore.query as any).mockReturnValue({});
                (firestore.collection as any).mockReturnValue({});
                (firestore.orderBy as any).mockReturnValue({});
                (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

                const result = await getTips();

                expect(result).toHaveLength(2);
                expect(firestore.orderBy).toHaveBeenCalledWith('order', 'asc');
            });

            it('should return empty array on error', async () => {
                const { logger } = await import('../../utils/logger');

                (firestore.query as any).mockReturnValue({});
                (firestore.collection as any).mockReturnValue({});
                (firestore.orderBy as any).mockReturnValue({});
                (firestore.getDocs as any).mockRejectedValue(new Error('Firestore error'));

                const result = await getTips();

                expect(result).toEqual([]);
                expect(logger.error).toHaveBeenCalled();
            });
        });

        describe('addTip', () => {
            it('should add tip to firestore', async () => {
                (firestore.collection as any).mockReturnValue({});
                (firestore.addDoc as any).mockResolvedValue({ id: 'new-tip-id' });

                await addTip(mockTip);

                expect(firestore.addDoc).toHaveBeenCalled();
            });
        });

        describe('updateTip', () => {
            it('should update tip without overwriting id', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.updateDoc as any).mockResolvedValue(undefined);

                await updateTip('tip-1', { title: 'Updated Title', id: 'should-be-removed' });

                expect(firestore.updateDoc).toHaveBeenCalledWith(
                    {},
                    expect.not.objectContaining({ id: expect.anything() })
                );
            });
        });

        describe('deleteTip', () => {
            it('should delete tip from firestore', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.deleteDoc as any).mockResolvedValue(undefined);

                await deleteTip('tip-to-delete');

                expect(firestore.deleteDoc).toHaveBeenCalled();
            });
        });

        describe('saveTipsOrder', () => {
            it('should batch update tip orders', async () => {
                const mockBatch = {
                    update: vi.fn(),
                    commit: vi.fn().mockResolvedValue(undefined),
                };

                (firestore.writeBatch as any).mockReturnValue(mockBatch);
                (firestore.doc as any).mockReturnValue({});

                const tips = [
                    { id: 'tip-1', order: 0 } as Tip,
                    { id: 'tip-2', order: 1 } as Tip,
                ];

                await saveTipsOrder(tips);

                expect(mockBatch.update).toHaveBeenCalledTimes(2);
                expect(mockBatch.commit).toHaveBeenCalled();
            });

            it('should skip tips without id', async () => {
                const mockBatch = {
                    update: vi.fn(),
                    commit: vi.fn().mockResolvedValue(undefined),
                };

                (firestore.writeBatch as any).mockReturnValue(mockBatch);

                const tips = [
                    { order: 0 } as Tip, // No ID
                ];

                await saveTipsOrder(tips);

                expect(mockBatch.update).not.toHaveBeenCalled();
                expect(mockBatch.commit).toHaveBeenCalled();
            });
        });
    });

    describe('Curiosities Management', () => {
        describe('getCuriosities', () => {
            it('should return curiosities from firestore', async () => {
                const mockCuriosities = [
                    { text: 'Curiosity 1', visible: true },
                    { text: 'Curiosity 2', visible: false },
                ];

                const mockDocSnap = {
                    exists: () => true,
                    data: () => ({ items: mockCuriosities }),
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getCuriosities();

                expect(result).toEqual(mockCuriosities);
            });

            it('should migrate string curiosities to objects', async () => {
                const mockDocSnap = {
                    exists: () => true,
                    data: () => ({
                        items: ['Old string curiosity', { text: 'New object', visible: true }],
                    }),
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getCuriosities();

                expect(result).toEqual([
                    { text: 'Old string curiosity', visible: true },
                    { text: 'New object', visible: true },
                ]);
            });

            it('should return empty array if document does not exist', async () => {
                const mockDocSnap = {
                    exists: () => false,
                };

                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

                const result = await getCuriosities();

                expect(result).toEqual([]);
            });

            it('should return empty array on error', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.getDoc as any).mockRejectedValue(new Error('Error'));

                const result = await getCuriosities();

                expect(result).toEqual([]);
            });
        });

        describe('saveCuriosities', () => {
            it('should save curiosities to firestore', async () => {
                const curiosities: CityCuriosity[] = [
                    { text: 'Curiosity 1', visible: true },
                ];

                (firestore.doc as any).mockReturnValue({});
                (firestore.setDoc as any).mockResolvedValue(undefined);

                await saveCuriosities(curiosities);

                expect(firestore.setDoc).toHaveBeenCalledWith({}, { items: curiosities });
            });
        });
    });

    describe('Reviews Management', () => {
        const mockReview: GuestReview = {
            id: 'review-1',
            guestName: 'John Doe',
            rating: 5,
            comment: 'Great stay!',
            date: '2024-01-01',
        };

        describe('getGuestReviews', () => {
            it('should return all reviews without limit', async () => {
                const mockDocs = [
                    { id: 'review-1', data: () => ({ guestName: 'John', rating: 5 }) },
                    { id: 'review-2', data: () => ({ guestName: 'Jane', rating: 4 }) },
                ];

                (firestore.collection as any).mockReturnValue({});
                (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

                const result = await getGuestReviews();

                expect(result).toHaveLength(2);
            });

            it('should return limited reviews when limit is provided', async () => {
                const mockDocs = [
                    { id: 'review-1', data: () => ({ guestName: 'John', rating: 5 }) },
                ];

                (firestore.collection as any).mockReturnValue({});
                (firestore.query as any).mockReturnValue({});
                (firestore.limit as any).mockReturnValue({});
                (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

                const result = await getGuestReviews(1);

                expect(firestore.limit).toHaveBeenCalledWith(1);
                expect(result).toHaveLength(1);
            });

            it('should return empty array on error', async () => {
                (firestore.collection as any).mockReturnValue({});
                (firestore.getDocs as any).mockRejectedValue(new Error('Error'));

                const result = await getGuestReviews();

                expect(result).toEqual([]);
            });
        });

        describe('addGuestReview', () => {
            it('should add review and return id', async () => {
                const mockDocRef = { id: 'new-review-id' };
                (firestore.collection as any).mockReturnValue({});
                (firestore.addDoc as any).mockResolvedValue(mockDocRef);

                const reviewWithoutId: Omit<GuestReview, 'id'> = {
                    guestName: 'John',
                    rating: 5,
                    comment: 'Great!',
                    date: '2024-01-01',
                };

                const result = await addGuestReview(reviewWithoutId);

                expect(result).toBe('new-review-id');
                expect(firestore.addDoc).toHaveBeenCalled();
            });
        });

        describe('deleteGuestReview', () => {
            it('should delete review from firestore', async () => {
                (firestore.doc as any).mockReturnValue({});
                (firestore.deleteDoc as any).mockResolvedValue(undefined);

                await deleteGuestReview('review-to-delete');

                expect(firestore.deleteDoc).toHaveBeenCalled();
            });
        });
    });
});
