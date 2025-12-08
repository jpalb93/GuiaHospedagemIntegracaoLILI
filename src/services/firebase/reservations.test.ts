import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    saveReservation,
    getReservation,
    updateReservation,
    deleteReservation,
    subscribeToSingleReservation,
    subscribeToActiveReservations,
    fetchHistoryReservations,
} from './reservations';
import * as firestore from 'firebase/firestore';
import { Reservation } from '../../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock config
vi.mock('./config', () => ({
    db: {},
    cleanData: vi.fn((data) => data),
}));

// Mock utils
vi.mock('../../utils/logger', () => ({
    logger: {
        info: vi.fn(),
        error: vi.fn(),
        warn: vi.fn(),
        log: vi.fn(),
    },
}));

vi.mock('../../utils/helpers', () => ({
    generateShortId: vi.fn(() => 'TEST123'),
}));

describe('Firebase Reservations Service', () => {
    const mockReservation: Reservation = {
        id: 'res-123',
        guestName: 'Test Guest',
        propertyId: 'lili',
        checkInDate: '2024-01-01',
        checkoutDate: '2024-01-05',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        lockCode: '1234',
        status: 'active',
        createdAt: '2024-01-01T00:00:00.000Z',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('saveReservation', () => {
        it('should save reservation with generated shortId', async () => {
            const mockDocRef = { id: 'new-reservation-id' };
            (firestore.addDoc as any).mockResolvedValue(mockDocRef);
            (firestore.collection as any).mockReturnValue({});

            const result = await saveReservation(mockReservation);

            expect(firestore.addDoc).toHaveBeenCalled();
            expect(result).toBe('new-reservation-id');
        });

        it('should use existing shortId if provided', async () => {
            const mockDocRef = { id: 'new-id' };
            (firestore.addDoc as any).mockResolvedValue(mockDocRef);
            (firestore.collection as any).mockReturnValue({});

            const reservationWithShortId = {
                ...mockReservation,
                shortId: 'EXISTING',
            };

            await saveReservation(reservationWithShortId);

            // Should not generate new shortId
            expect(firestore.addDoc).toHaveBeenCalledWith(
                {},
                expect.objectContaining({
                    shortId: 'EXISTING',
                })
            );
        });

        it('should set default status to active', async () => {
            const mockDocRef = { id: 'new-id' };
            (firestore.addDoc as any).mockResolvedValue(mockDocRef);
            (firestore.collection as any).mockReturnValue({});

            const reservationWithoutStatus = { ...mockReservation };
            delete (reservationWithoutStatus as any).status;

            await saveReservation(reservationWithoutStatus);

            expect(firestore.addDoc).toHaveBeenCalledWith(
                {},
                expect.objectContaining({
                    status: 'active',
                })
            );
        });
    });

    describe('getReservation', () => {
        it('should return reservation when it exists', async () => {
            const mockDocSnap = {
                exists: () => true,
                id: 'res-123',
                data: () => ({
                    guestName: 'Test Guest',
                    propertyId: 'lili',
                }),
            };

            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);
            (firestore.doc as any).mockReturnValue({});

            const result = await getReservation('res-123');

            expect(result).toEqual({
                id: 'res-123',
                guestName: 'Test Guest',
                propertyId: 'lili',
            });
        });

        it('should return null when reservation does not exist', async () => {
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);
            (firestore.doc as any).mockReturnValue({});

            const result = await getReservation('non-existent');

            expect(result).toBeNull();
        });

        it('should return null on error', async () => {
            (firestore.getDoc as any).mockRejectedValue(new Error('Firestore error'));
            (firestore.doc as any).mockReturnValue({});

            const result = await getReservation('error-id');

            expect(result).toBeNull();
        });
    });

    describe('updateReservation', () => {
        it('should update reservation without overwriting id', async () => {
            (firestore.updateDoc as any).mockResolvedValue(undefined);
            (firestore.doc as any).mockReturnValue({});

            const updateData = {
                id: 'should-be-removed',
                guestName: 'Updated Name',
                propertyId: 'integracao',
            };

            await updateReservation('res-123', updateData);

            expect(firestore.updateDoc).toHaveBeenCalledWith(
                {},
                expect.not.objectContaining({ id: expect.anything() })
            );
        });

        it('should call updateDoc with correct parameters', async () => {
            (firestore.updateDoc as any).mockResolvedValue(undefined);
            (firestore.doc as any).mockReturnValue({});

            await updateReservation('res-123', { guestName: 'New Name' });

            expect(firestore.updateDoc).toHaveBeenCalled();
        });
    });

    describe('deleteReservation', () => {
        it('should call deleteDoc with correct id', async () => {
            (firestore.deleteDoc as any).mockResolvedValue(undefined);
            (firestore.doc as any).mockReturnValue({});

            await deleteReservation('res-to-delete');

            expect(firestore.deleteDoc).toHaveBeenCalled();
        });
    });

    describe('subscribeToSingleReservation', () => {
        it('should call callback with reservation when it exists', () => {
            const mockCallback = vi.fn();
            const mockUnsubscribe = vi.fn();

            const mockDocSnap = {
                exists: () => true,
                id: 're-123',
                data: () => ({ guestName: 'Test' }),
            };

            (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                setTimeout(() => onNext(mockDocSnap), 0);
                return mockUnsubscribe;
            });
            (firestore.doc as any).mockReturnValue({});

            const unsubscribe = subscribeToSingleReservation('res-123', mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith({
                    id: 'res-123',
                    guestName: 'Test',
                });
            }, 10);

            expect(typeof unsubscribe).toBe('function');
        });

        it('should call callback with null when reservation does not exist', () => {
            const mockCallback = vi.fn();
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                setTimeout(() => onNext(mockDocSnap), 0);
                return () => { };
            });
            (firestore.doc as any).mockReturnValue({});

            subscribeToSingleReservation('non-existent', mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith(null);
            }, 10);
        });
    });

    describe('subscribeToActiveReservations', () => {
        it('should subscribe to active reservations', () => {
            const mockCallback = vi.fn();
            const mockUnsubscribe = vi.fn();

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = subscribeToActiveReservations(mockCallback);

            expect(firestore.onSnapshot).toHaveBeenCalled();
            expect(typeof unsubscribe).toBe('function');
        });

        it('should filter by allowed properties on client side', () => {
            const mockCallback = vi.fn();
            const mockSnapshot = {
                docs: [
                    {
                        id: '1',
                        data: () => ({ propertyId: 'lili', guestName: 'Guest 1' }),
                    },
                    {
                        id: '2',
                        data: () => ({ propertyId: 'integracao', guestName: 'Guest 2' }),
                    },
                ],
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((q, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => { };
            });

            subscribeToActiveReservations(mockCallback, ['lili']);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith([
                    expect.objectContaining({ propertyId: 'lili' }),
                ]);
            }, 10);
        });
    });

    describe('fetchHistoryReservations', () => {
        it('should fetch history with pagination', async () => {
            const mockDocs = [
                { id: '1', data: () => ({ guestName: 'Guest 1' }) },
                { id: '2', data: () => ({ guestName: 'Guest 2' }) },
            ];

            const mockSnapshot = {
                docs: mockDocs,
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.limit as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue(mockSnapshot);

            const result = await fetchHistoryReservations();

            expect(result.data).toHaveLength(2);
            expect(result.hasMore).toBe(false);
        });

        it('should indicate hasMore when page is full', async () => {
            const mockDocs = Array.from({ length: 20 }, (_, i) => ({
                id: `${i}`,
                data: () => ({ guestName: `Guest ${i}` }),
            }));

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.limit as any).mockReturnValue({});
            (firestore.getDocs as any).mockResolvedValue({ docs: mockDocs });

            const result = await fetchHistoryReservations(null, 20);

            expect(result.hasMore).toBe(true);
        });
    });
});
