// @vitest-environment jsdom
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
            paymentStatus: 'paid',
            totalAmount: 1000,
            depositAmount: 1000,
            paidAt: '2024-05-01',
            payments: [
                {
                    id: 'p1',
                    date: '2024-05-01',
                    amount: 500,
                    method: 'pix',
                    type: 'deposit',
                    createdAt: '2024-05-01T10:00:00.000Z',
                },
                {
                    id: 'p2',
                    date: '2024-05-05',
                    amount: 500,
                    method: 'card',
                    type: 'full',
                    createdAt: '2024-05-05T10:00:00.000Z',
                },
            ],
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
        expect(result.current.paidAt).toBe('2024-05-01');
        expect(result.current.payments).toHaveLength(2);
        expect(result.current.payments[0].amount).toBe(500);
    });

    it('should reset form', async () => {
        const { result } = renderHook(() => useReservationForm());

        // First modify state
        act(() => {
            result.current.setGuestName('Modified');
            result.current.setPropertyId('integracao');
            result.current.setPaidAt('2024-05-01');
            result.current.setPayments([
                {
                    id: 'p1',
                    date: '2024-05-01',
                    amount: 200,
                    method: 'pix',
                    createdAt: '2024-05-01',
                },
            ]);
        });

        expect(result.current.guestName).toBe('Modified');
        expect(result.current.paidAt).toBe('2024-05-01');
        expect(result.current.payments).toHaveLength(1);

        // Then reset
        await act(async () => {
            await result.current.resetForm();
        });

        expect(result.current.guestName).toBe('');
        expect(result.current.propertyId).toBe('lili');
        expect(result.current.paidAt).toBe('');
        expect(result.current.payments).toEqual([]);
    });

    it('should get form values correctly', () => {
        const { result } = renderHook(() => useReservationForm());

        const samplePayments = [
            {
                id: 'p1',
                date: '2024-05-01',
                amount: 200,
                method: 'pix' as const,
                createdAt: '2024-05-01',
            },
        ];

        act(() => {
            result.current.setGuestName(' Test Name ');
            result.current.setGuestPhone('123-456');
            result.current.setGuestCount(4);
            result.current.setPaidAt('2024-05-01');
            result.current.setPayments(samplePayments);
        });

        const values = result.current.getFormValues();

        expect(values.guestName).toBe('Test Name'); // should trim
        expect(values.guestPhone).toBe('123456'); // should strip non-digits
        expect(values.guestCount).toBe(4);
        expect(values.paidAt).toBe('2024-05-01');
        expect(values.payments).toEqual(samplePayments);
    });
});
