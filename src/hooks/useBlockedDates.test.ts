import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBlockedDates } from './useBlockedDates';
import * as firebaseService from '../services/firebase';
import * as constants from '../constants';
import { BlockedDateRange } from '../types';

// Mock dependências
vi.mock('../services/firebase', () => ({
    subscribeToFutureBlockedDates: vi.fn(() => () => { }),
    addBlockedDate: vi.fn(),
    deleteBlockedDate: vi.fn(),
}));

vi.mock('../constants', () => ({
    fetchOfficialTime: vi.fn(),
}));

describe('useBlockedDates Hook', () => {
    const mockShowToast = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock for time
        (constants.fetchOfficialTime as any).mockResolvedValue(new Date('2024-01-01T12:00:00'));
    });

    it('should initialize with default empty state', () => {
        const { result } = renderHook(() => useBlockedDates({ showToast: mockShowToast }));

        expect(result.current.blockedDates).toEqual([]);
        expect(result.current.isBlocking).toBe(false);
    });

    it('should subscribe to blocked dates', async () => {
        const mockBlocked: BlockedDateRange[] = [
            { id: '1', startDate: '2024-02-01', endDate: '2024-02-05', reason: 'Maintenance' },
        ];

        (firebaseService.subscribeToFutureBlockedDates as any).mockImplementation(
            (callback: (dates: BlockedDateRange[]) => void) => {
                callback(mockBlocked);
                return () => { };
            }
        );

        const { result } = renderHook(() => useBlockedDates({ showToast: mockShowToast }));

        // Subscribe called manually in useBlockedDates (or via useEffect in parent)
        // But hook exposes subscribe function
        const unsubscribe = result.current.subscribe();

        // Wait for update (mock calls back immediately/synchronously here but usually async)
        await waitFor(() => {
            // Since subscribeToFutureBlockedDates update state via setBlockedDates,
            // and we are calling it inside renderHook context, it should update.
            // BUT subscribe return value handling depends on how useBlockedDates uses it.
            // Looking at implementation: 
            // const subscribe = useCallback(() => subscribeToFutureBlockedDates(setBlockedDates), []);
        });

        // We need to trigger the subscription if it's not automatic. 
        // In useAdminDashboard it calls subscribe inside useEffect.
        // In the hook test, we can call result.current.subscribe()

        act(() => {
            result.current.subscribe();
        });

        await waitFor(() => {
            expect(result.current.blockedDates).toHaveLength(1);
            expect(result.current.blockedDates[0].reason).toBe('Maintenance');
        });
    });

    it('should reset blocked form with next day dates', async () => {
        const { result } = renderHook(() => useBlockedDates({ showToast: mockShowToast }));

        await act(async () => {
            await result.current.resetBlockedForm();
        });

        // Mock date is 2024-01-01
        // Start date should be today: 2024-01-01
        // End date should be tomorrow: 2024-01-02
        expect(result.current.blockedStartDate).toBe('2024-01-01');
        expect(result.current.blockedEndDate).toBe('2024-01-02');
    });

    it('should handle add blocked date success', async () => {
        (firebaseService.addBlockedDate as any).mockResolvedValue('new-id');

        const { result } = renderHook(() => useBlockedDates({ showToast: mockShowToast }));

        // Set form values
        act(() => {
            result.current.setBlockedStartDate('2024-03-01');
            result.current.setBlockedEndDate('2024-03-05');
            result.current.setBlockedReason('Test Block');
        });

        await act(async () => {
            await result.current.handleAddBlock();
        });

        expect(firebaseService.addBlockedDate).toHaveBeenCalledWith({
            startDate: '2024-03-01',
            endDate: '2024-03-05',
            reason: 'Test Block',
        });
        expect(mockShowToast).toHaveBeenCalledWith('Período bloqueado com sucesso!', 'success');
    });

    it('should validation add block dates', async () => {
        const { result } = renderHook(() => useBlockedDates({ showToast: mockShowToast }));

        // End date before start date
        act(() => {
            result.current.setBlockedStartDate('2024-03-10');
            result.current.setBlockedEndDate('2024-03-05');
        });

        await act(async () => {
            await result.current.handleAddBlock();
        });

        expect(firebaseService.addBlockedDate).not.toHaveBeenCalled();
        expect(mockShowToast).toHaveBeenCalledWith('Data de fim deve ser após a data de início.', 'warning');
    });
});
