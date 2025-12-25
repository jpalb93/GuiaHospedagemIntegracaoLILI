import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useReservations } from './useReservations';
import * as firebaseService from '../services/firebase/reservations';
import { Reservation, UserPermission } from '../types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Create a wrapper for React Query
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
                staleTime: 0,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}> {children} </QueryClientProvider>
    );
};

// Mock Firebase Service
vi.mock('../services/firebase/reservations', () => ({
    subscribeToActiveReservations: vi.fn(() => () => {}),
    fetchHistoryReservations: vi.fn(),
    deleteReservation: vi.fn(),
    saveReservation: vi.fn(),
    updateReservation: vi.fn(),
    archiveReservation: vi.fn(),
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    logger: {
        error: vi.fn(),
        info: vi.fn(),
    },
}));

describe('useReservations Hook', () => {
    const mockShowToast = vi.fn();
    const mockUserPermission: UserPermission = {
        role: 'super_admin',
        allowedProperties: ['lili'],
        email: 'test@example.com',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial state', async () => {
        const { result } = renderHook(
            () => useReservations({ userPermission: mockUserPermission, showToast: mockShowToast }),
            { wrapper: createWrapper() }
        );

        expect(result.current.activeReservations).toEqual([]);
        expect(result.current.historyReservations).toEqual([]);
        // status is implicit in useInfiniteQuery
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
                checkInDate: '2024-01-01',
                checkoutDate: '2024-01-05',
                checkInTime: '14:00',
                checkOutTime: '11:00',
                guestCount: 2,
                paymentMethod: 'pix',
                createdAt: '2023-12-01',
                shortId: 'ABC',
                lockCode: '1234',
                welcomeMessage: 'Hi',
                adminNotes: '',
                guestAlertActive: false,
                guestAlertText: '',
                email: 'guest@example.com',
                guestRating: 5,
                guestFeedback: '',
            },
        ];

        (firebaseService.subscribeToActiveReservations as import('vitest').Mock).mockImplementation(
            (callback: (res: Reservation[]) => void) => {
                callback(mockReservations);
                return () => {};
            }
        );

        const { result } = renderHook(
            () => useReservations({ userPermission: mockUserPermission, showToast: mockShowToast }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.activeReservations).toHaveLength(1);
            expect(result.current.activeReservations[0].guestName).toBe('Guest 1');
        });
    });

    it('should load history reservations via React Query', async () => {
        const mockHistory: Reservation[] = [
            {
                id: '2',
                guestName: 'Guest 2',
                status: 'active',
                propertyId: 'lili',
                guestPhone: '456',
                flatNumber: '102',
                checkInDate: '2023-01-01',
                checkoutDate: '2023-01-05',
                checkInTime: '14:00',
                checkOutTime: '11:00',
                guestCount: 1,
                paymentMethod: 'card',
                createdAt: '2022-12-01',
                shortId: 'DEF',
                lockCode: '5678',
                welcomeMessage: 'Hi',
                adminNotes: '',
                guestAlertActive: false,
                guestAlertText: '',
                email: 'guest2@example.com',
                guestRating: 5,
                guestFeedback: '',
            },
        ];

        (firebaseService.fetchHistoryReservations as import('vitest').Mock).mockResolvedValue({
            data: mockHistory,
            lastVisible: 'doc-ref',
            hasMore: false,
        });

        const { result } = renderHook(
            () => useReservations({ userPermission: mockUserPermission, showToast: mockShowToast }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => {
            expect(result.current.historyReservations).toHaveLength(1);
            expect(result.current.historyReservations[0].guestName).toBe('Guest 2');
        });
    });

    it('should handle removeReservation successfully', async () => {
        (firebaseService.deleteReservation as import('vitest').Mock).mockResolvedValue(undefined);

        const { result } = renderHook(
            () => useReservations({ userPermission: mockUserPermission, showToast: mockShowToast }),
            { wrapper: createWrapper() }
        );

        await act(async () => {
            await result.current.removeReservation('123');
        });

        await waitFor(() => {
            expect(firebaseService.deleteReservation).toHaveBeenCalledWith('123');
            expect(mockShowToast).toHaveBeenCalledWith('Reserva excluída!', 'success');
        });
    });
});
