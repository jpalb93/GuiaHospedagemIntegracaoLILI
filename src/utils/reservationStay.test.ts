import { describe, expect, it } from 'vitest';
import type { Reservation } from '../types';
import {
    dayUsePhase,
    getStayValidationError,
    reservationNights,
    reservationsOverlap,
} from './reservationStay';
import { checkAvailabilityForPeriod } from './availability';
import { calculateMonthlyStats } from './analytics';

const dayUse: Reservation = {
    id: 'day',
    guestName: 'Day use',
    propertyId: 'integracao',
    flatNumber: '201',
    stayType: 'day_use',
    guestCount: 1,
    checkInDate: '2026-10-28',
    checkoutDate: '2026-10-28',
    checkInTime: '08:00',
    checkOutTime: '12:00',
    createdAt: '2026-10-01',
    status: 'active',
};
const overnight: Reservation = {
    ...dayUse,
    id: 'night',
    stayType: 'overnight',
    checkInDate: '2026-10-27',
    checkoutDate: '2026-10-28',
    checkInTime: '15:00',
    checkOutTime: '13:00',
};

describe('Day use stay rules', () => {
    it('follows the entry and exit time in Petrolina, including exact boundaries', () => {
        expect(dayUsePhase(dayUse, new Date('2026-10-28T07:59:00-03:00'))).toBe('upcoming');
        expect(dayUsePhase(dayUse, new Date('2026-10-28T08:00:00-03:00'))).toBe('active');
        expect(dayUsePhase(dayUse, new Date('2026-10-28T12:00:00-03:00'))).toBe('finished');
    });
    it('accepts the morning period and other same-day hours', () => {
        expect(getStayValidationError(dayUse)).toBeNull();
        expect(
            getStayValidationError({ ...dayUse, checkInTime: '14:30', checkOutTime: '18:30' })
        ).toBeNull();
    });
    it.each([
        { checkoutDate: '2026-10-29' },
        { checkOutTime: '08:00' },
        { checkOutTime: '07:59' },
        { guestCount: 2 },
        { propertyId: 'lili' as const },
        { checkInTime: '25:00' },
        { checkInDate: '2026-02-30' },
        { billingMode: 'corporate' as const },
    ])('rejects invalid day use: %o', (patch) => {
        expect(getStayValidationError({ ...dayUse, ...patch })).not.toBeNull();
    });
    it('does not permit legacy overnight stays with same-day checkout', () => {
        expect(getStayValidationError({ ...dayUse, stayType: undefined })).not.toBeNull();
        expect(getStayValidationError({ ...overnight, stayType: undefined })).toBeNull();
    });
    it('counts revenue-generating day use as zero nights', () => {
        expect(reservationNights(dayUse)).toBe(0);
        expect(reservationNights(overnight)).toBe(1);
        const stats = calculateMonthlyStats([dayUse, overnight]);
        expect(stats[0].totalReservations).toBe(2);
        expect(stats[0].totalNights).toBe(1);
    });
});

describe('Day use occupancy by time', () => {
    it('detects a guest still occupying the flat on checkout morning', () => {
        expect(reservationsOverlap(dayUse, overnight)).toBe(true);
        expect(reservationsOverlap(overnight, dayUse)).toBe(true);
    });
    it('allows a normal arrival after morning day use', () => {
        const nextStay = { ...overnight, checkInDate: '2026-10-28', checkoutDate: '2026-10-29' };
        expect(reservationsOverlap(dayUse, nextStay)).toBe(false);
    });
    it('allows adjacent periods but rejects overlapping hours', () => {
        expect(
            reservationsOverlap(dayUse, { ...dayUse, checkInTime: '12:00', checkOutTime: '16:00' })
        ).toBe(false);
        expect(
            reservationsOverlap(dayUse, { ...dayUse, checkInTime: '11:59', checkOutTime: '16:00' })
        ).toBe(true);
    });
    it('uses property defaults when legacy overnight stays have no hours', () => {
        expect(
            reservationsOverlap(dayUse, {
                ...overnight,
                checkInTime: undefined,
                checkOutTime: undefined,
            })
        ).toBe(true);
    });
    it('keeps the old overnight turnover policy', () => {
        expect(
            reservationsOverlap(overnight, {
                ...overnight,
                checkInDate: '2026-10-28',
                checkoutDate: '2026-10-29',
            })
        ).toBe(false);
    });
    it('marks only the occupied unit and ignores cancellations/editing itself', () => {
        const check = (reservations: Reservation[], id?: string) =>
            checkAvailabilityForPeriod(
                'integracao',
                dayUse.checkInDate!,
                dayUse.checkoutDate!,
                reservations,
                ['201', '202'],
                id,
                dayUse
            );
        expect(check([overnight]).unitsStatus[0].isAvailable).toBe(false);
        expect(check([overnight]).unitsStatus[1].isAvailable).toBe(true);
        expect(check([{ ...overnight, status: 'cancelled' }]).availableUnitsCount).toBe(2);
        expect(check([dayUse], 'day').availableUnitsCount).toBe(2);
    });
    it('detects an existing day use when checking an overnight stay', () => {
        const summary = checkAvailabilityForPeriod(
            'integracao',
            '2026-10-27',
            '2026-10-29',
            [dayUse],
            ['201']
        );
        expect(summary.isAvailable).toBe(false);
    });
});
