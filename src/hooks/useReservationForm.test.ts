import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReservationForm } from './useReservationForm';
import { Reservation } from '../types';
import { PROPERTIES } from '../config/properties';

describe('useReservationForm Hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return initial default state', () => {
        const { result } = renderHook(() => useReservationForm());

        expect(result.current.guestName).toBe('');
        expect(result.current.propertyId).toBe('lili');
        expect(result.current.editingId).toBeNull();
        expect(result.current.guestCount).toBe(1);
    });

    it('should load reservation data', () => {
        const { result } = renderHook(() => useReservationForm());

        const mockRes: Reservation = {
            id: '123',
            guestName: 'John Doe',
            propertyId: 'integracao',
            flatNumber: '202',
            lockCode: '9999',
            welcomeMessage: 'Hi',
            adminNotes: 'Note',
            guestAlertActive: true,
            guestAlertText: 'Alert',
            checkInDate: '2024-05-10',
            checkoutDate: '2024-05-15',
            checkInTime: '15:00',
            checkOutTime: '10:00',
            guestCount: 3,
            paymentMethod: 'pix',
            status: 'active',
            createdAt: '2024-01-01',
            shortId: 'XYZ',
        };

        act(() => {
            result.current.loadReservation(mockRes);
        });

        expect(result.current.editingId).toBe('123');
        expect(result.current.guestName).toBe('John Doe');
        expect(result.current.propertyId).toBe('integracao');
        expect(result.current.flatNumber).toBe('202');
        expect(result.current.guestAlertActive).toBe(true);
    });

    it('should reset form', async () => {
        const { result } = renderHook(() => useReservationForm());

        // First modify state
        act(() => {
            result.current.setGuestName('Modified');
            result.current.setPropertyId('integracao');
        });

        expect(result.current.guestName).toBe('Modified');

        // Then reset
        await act(async () => {
            await result.current.resetForm();
        });

        expect(result.current.guestName).toBe('');
        expect(result.current.propertyId).toBe('lili');
    });

    it('should get form values correctly', () => {
        const { result } = renderHook(() => useReservationForm());

        act(() => {
            result.current.setGuestName(' Test Name ');
            result.current.setGuestPhone('123-456');
            result.current.setGuestCount(4);
        });

        const values = result.current.getFormValues();

        expect(values.guestName).toBe('Test Name'); // should trim
        expect(values.guestPhone).toBe('123456'); // should strip non-digits
        expect(values.guestCount).toBe(4);
    });
});
