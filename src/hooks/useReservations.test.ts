import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useReservations } from './useReservations';
import * as firebaseService from '../services/firebase';
import { Reservation, UserPermission } from '../types';

// Mock Firebase Service
vi.mock('../services/firebase', () => ({
    subscribeToActiveReservations: vi.fn(() => () => { }),
    fetchHistoryReservations: vi.fn(() => Promise.resolve({ data: [], lastVisible: null, hasMore: false })),
    deleteReservation: vi.fn(),
}));

describe('useReservations Hook', () => {
    const mockShowToast = vi.fn();
    const mockUserPermission: UserPermission = {
        role: 'super_admin',
        allowedProperties: ['lili'],
        email: 'test@example.com'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', async () => {
        const { result } = renderHook(() =>
            useReservations({ userPermission: mockUserPermission, showToast: mockShowToast })
        );

        expect(result.current.activeReservations).toEqual([]);
        expect(result.current.historyReservations).toEqual([]);
        await waitFor(() => {
            expect(result.current.loadingHistory).toBe(false);
        });
        expect(result.current.hasMoreHistory).toBe(false); // Mock returns hasMore: false
    });

    it('should subscribe to active reservations on mount', async () => {
        const mockReservations: Reservation[] = [
            {
                id: '1',
                guestName: 'Guest 1',
                status: 'active',
                propertyId: 'lili',
                guestPhone: '123',
                flatNumber: '101',
                lockCode: '1234',
                welcomeMessage: 'Welcome',
                adminNotes: '',
                guestAlertActive: false,
                guestAlertText: '',
                checkInDate: '2024-01-01',
                checkoutDate: '2024-01-05',
                checkInTime: '14:00',
                checkOutTime: '11:00',
                guestCount: 2,
                paymentMethod: 'pix',
                createdAt: '2023-12-01',
                shortId: 'ABC',
            },
        ];

        (firebaseService.subscribeToActiveReservations as any).mockImplementation(
            (callback: (res: Reservation[]) => void) => {
                callback(mockReservations);
                return () => { };
            }
        );

        const { result } = renderHook(() =>
            useReservations({ userPermission: mockUserPermission, showToast: mockShowToast })
        );

        await waitFor(() => {
            expect(result.current.activeReservations).toHaveLength(1);
            expect(result.current.activeReservations[0].guestName).toBe('Guest 1');
        });
    });

    it('should load history reservations', async () => {
        const mockHistory: Reservation[] = [
            {
                id: '2',
                guestName: 'Guest 2',
                status: 'active',
                propertyId: 'lili',
                guestPhone: '456',
                flatNumber: '102',
                lockCode: '5678',
                welcomeMessage: 'Welcome Back',
                adminNotes: '',
                guestAlertActive: false,
                guestAlertText: '',
                checkInDate: '2023-01-01',
                checkoutDate: '2023-01-05',
                checkInTime: '14:00',
                checkOutTime: '11:00',
                guestCount: 1,
                paymentMethod: 'card',
                createdAt: '2022-12-01',
                shortId: 'DEF',
            },
        ];

        (firebaseService.fetchHistoryReservations as any).mockResolvedValue({
            data: mockHistory,
            lastVisible: 'doc',
            hasMore: false,
        });

        const { result } = renderHook(() =>
            useReservations({ userPermission: mockUserPermission, showToast: mockShowToast })
        );

        // Initial load happens automatically in useEffect if authorized
        // But we can test explicit loadMoreHistory
        await act(async () => {
            await result.current.loadMoreHistory();
        });

        await waitFor(() => {
            expect(result.current.historyReservations).toHaveLength(1);
            expect(result.current.historyReservations[0].guestName).toBe('Guest 2');
        });
    });

    it('should handle removeReservation successfully', async () => {
        (firebaseService.deleteReservation as any).mockResolvedValue(undefined);

        const { result } = renderHook(() =>
            useReservations({ userPermission: mockUserPermission, showToast: mockShowToast })
        );

        await act(async () => {
            await result.current.removeReservation('123');
        });

        expect(firebaseService.deleteReservation).toHaveBeenCalledWith('123');
    });

    it('should handle removeReservation error', async () => {
        (firebaseService.deleteReservation as any).mockRejectedValue(new Error('Delete invalid'));

        const { result } = renderHook(() =>
            useReservations({ userPermission: mockUserPermission, showToast: mockShowToast })
        );

        await expect(async () => {
            await act(async () => {
                await result.current.removeReservation('123');
            });
        }).rejects.toThrow('Delete invalid');

        expect(mockShowToast).not.toHaveBeenCalled();
    });
});
