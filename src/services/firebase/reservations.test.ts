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
    cleanData: vi.fn((data) => {
        const clean = { ...data };
        Object.keys(clean).forEach((key) => {
            if (clean[key] === undefined) delete clean[key];
        });
        return clean;
    }),
    getFirestoreInstance: vi.fn(async () => ({})),
    getFirebaseAuth: vi.fn(async () => ({ currentUser: { email: 'admin@test.com' } })),
}));

vi.mock('./logs', () => ({
    logAction: vi.fn(async () => undefined),
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

        it('should strip undefined fields and not overwrite createdAt', async () => {
            (firestore.updateDoc as any).mockResolvedValue(undefined);
            (firestore.doc as any).mockReturnValue({});

            await updateReservation('res-123', {
                guestName: 'Updated',
                createdAt: '',
                depositAmount: undefined,
                totalAmount: 730,
            });

            const saved = (firestore.updateDoc as any).mock.calls[0][1];
            expect(saved).toEqual(
                expect.objectContaining({
                    guestName: 'Updated',
                    totalAmount: 730,
                })
            );
            expect(saved).not.toHaveProperty('depositAmount');
            expect(saved).not.toHaveProperty('createdAt');
            expect(saved).not.toHaveProperty('id');
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
        it('should call callback with reservation when it exists', async () => {
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

            const unsubscribe = await subscribeToSingleReservation('res-123', mockCallback);

            await vi.waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith({ id: 're-123', guestName: 'Test' });
            });

            expect(typeof unsubscribe).toBe('function');
        });

        it('should call callback with null when reservation does not exist', async () => {
            const mockCallback = vi.fn();
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.onSnapshot as any).mockImplementation((docRef, onNext) => {
                setTimeout(() => onNext(mockDocSnap), 0);
                return () => {};
            });
            (firestore.doc as any).mockReturnValue({});

            await subscribeToSingleReservation('non-existent', mockCallback);

            await vi.waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith(null);
            });
        });
    });

    describe('subscribeToActiveReservations', () => {
        it('should subscribe to active reservations', async () => {
            const mockCallback = vi.fn();
            const mockUnsubscribe = vi.fn();

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = await subscribeToActiveReservations(mockCallback);

            expect(firestore.onSnapshot).toHaveBeenCalled();
            expect(typeof unsubscribe).toBe('function');
        });

        it('should constrain the Firestore query by allowed property', async () => {
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
                metadata: { fromCache: false, hasPendingWrites: false },
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((q, options, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => {};
            });

            await subscribeToActiveReservations(mockCallback, ['integracao']);

            expect(firestore.where).toHaveBeenCalledWith('propertyId', '==', 'integracao');
        });

        it('should expose whether a snapshot came from cache', async () => {
            const mockCallback = vi.fn();
            const mockSnapshot = {
                docs: [],
                metadata: { fromCache: true, hasPendingWrites: false },
            };

            (firestore.query as any).mockReturnValue({});
            (firestore.collection as any).mockReturnValue({});
            (firestore.where as any).mockReturnValue({});
            (firestore.orderBy as any).mockReturnValue({});
            (firestore.onSnapshot as any).mockImplementation((q, options, onNext) => {
                setTimeout(() => onNext(mockSnapshot), 0);
                return () => {};
            });

            await subscribeToActiveReservations(mockCallback);

            await vi.waitFor(() => {
                expect(mockCallback).toHaveBeenCalledWith([], {
                    status: 'cached',
                    fromCache: true,
                    hasPendingWrites: false,
                });
            });
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
            (firestore.getDocsFromServer as any).mockResolvedValue(mockSnapshot);

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
            (firestore.getDocsFromServer as any).mockResolvedValue({ docs: mockDocs });

            const result = await fetchHistoryReservations(null, 20);

            expect(result.hasMore).toBe(true);
        });
    });
});
