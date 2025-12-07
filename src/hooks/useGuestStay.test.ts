import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useGuestStay } from './useGuestStay';
import { GuestConfig } from '../types';
import { fetchOfficialTime } from '../constants';

// Mock do módulo constants
vi.mock('../constants', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../constants')>();
    return {
        ...actual,
        fetchOfficialTime: vi.fn(),
    };
});

describe('useGuestStay Hook', () => {
    const mockConfig: GuestConfig = {
        guestName: 'Teste',
        checkInDate: '2024-01-10',
        checkoutDate: '2024-01-15',
        checkInTime: '14:00',
        checkOutTime: '11:00',
        isReleased: true,
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Only fake Date so waitFor (which uses setTimeout) works normally
        vi.useFakeTimers({ toFake: ['Date'] });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    const setSystemTime = (dateStr: string) => {
        const date = new Date(dateStr);
        vi.setSystemTime(date);
        // Ensure the mock returns a Date object that corresponds to the mocked system time
        vi.mocked(fetchOfficialTime).mockImplementation(async () => new Date(date));
    };

    it('should identify PRE_CHECKIN stage', async () => {
        setSystemTime('2024-01-01T12:00:00'); // 9 days before

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.stayStage).toBe('pre_checkin');
            expect(result.current.isTimeVerified).toBe(true);
        });
    });

    it('should identify CHECKIN stage', async () => {
        setSystemTime('2024-01-10T12:00:00'); // Check-in day

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.stayStage).toBe('checkin');
        });
    });

    it('should identify MIDDLE stage', async () => {
        setSystemTime('2024-01-12T12:00:00'); // Middle of stay

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.stayStage).toBe('middle');
        });
    });

    it('should identify PRE_CHECKOUT stage', async () => {
        setSystemTime('2024-01-14T12:00:00'); // 1 day before checkout

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.stayStage).toBe('pre_checkout');
        });
    });

    it('should identify CHECKOUT stage', async () => {
        setSystemTime('2024-01-15T10:00:00'); // Checkout day

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.stayStage).toBe('checkout');
            expect(result.current.isCheckoutToday).toBe(true);
        });
    });

    it('should release password 1 day before check-in', async () => {
        setSystemTime('2024-01-09T12:00:00'); // 1 day before check-in

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.isPasswordReleased).toBe(true);
        });
    });

    it('should NOT release password 2 days before check-in', async () => {
        setSystemTime('2024-01-08T12:00:00'); // 2 days before check-in

        const { result } = renderHook(() => useGuestStay(mockConfig));

        await waitFor(() => {
            expect(result.current.isPasswordReleased).toBe(false);
        });
    });
});
