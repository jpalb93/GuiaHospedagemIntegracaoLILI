import { describe, it, expect } from 'vitest';
import { isDateRangeOverlapping, checkAvailabilityForPeriod } from './availability';
import { Reservation } from '../types';

describe('Availability Calculation Utility', () => {
    describe('isDateRangeOverlapping', () => {
        it('should detect overlapping date ranges', () => {
            expect(isDateRangeOverlapping('2026-08-10', '2026-08-15', '2026-08-12', '2026-08-18')).toBe(true);
            expect(isDateRangeOverlapping('2026-08-10', '2026-08-15', '2026-08-08', '2026-08-11')).toBe(true);
        });

        it('should NOT overlap when checkout date equals next checkin date', () => {
            expect(isDateRangeOverlapping('2026-08-10', '2026-08-15', '2026-08-15', '2026-08-20')).toBe(false);
            expect(isDateRangeOverlapping('2026-08-15', '2026-08-20', '2026-08-10', '2026-08-15')).toBe(false);
        });

        it('should NOT overlap when date ranges are completely separate', () => {
            expect(isDateRangeOverlapping('2026-08-10', '2026-08-15', '2026-08-20', '2026-08-25')).toBe(false);
        });
    });

    describe('checkAvailabilityForPeriod', () => {
        const units = ['201', '202', '301'];
        const sampleReservations: Reservation[] = [
            {
                id: 'res-1',
                guestName: 'Rodrigo',
                propertyId: 'integracao',
                flatNumber: '201',
                checkInDate: '2026-08-10',
                checkoutDate: '2026-08-15',
                createdAt: '2026-08-01',
                status: 'active',
            },
            {
                id: 'res-2',
                guestName: 'Maria',
                propertyId: 'lili',
                checkInDate: '2026-08-10',
                checkoutDate: '2026-08-15',
                createdAt: '2026-08-01',
                status: 'active',
            },
        ];

        it('should correctly identify occupied and available flats for integracao', () => {
            const summary = checkAvailabilityForPeriod(
                'integracao',
                '2026-08-12',
                '2026-08-14',
                sampleReservations,
                units
            );

            expect(summary.availableUnitsCount).toBe(2);
            expect(summary.occupiedUnitsCount).toBe(1);
            expect(summary.unitsStatus.find((u) => u.unit === '201')?.isAvailable).toBe(false);
            expect(summary.unitsStatus.find((u) => u.unit === '201')?.occupyingGuest).toBe('Rodrigo');
            expect(summary.unitsStatus.find((u) => u.unit === '202')?.isAvailable).toBe(true);
        });

        it('should ignore editing reservation when currentEditingId matches', () => {
            const summary = checkAvailabilityForPeriod(
                'integracao',
                '2026-08-12',
                '2026-08-14',
                sampleReservations,
                units,
                'res-1'
            );

            expect(summary.availableUnitsCount).toBe(3);
            expect(summary.occupiedUnitsCount).toBe(0);
        });

        it('should correctly identify availability for Lili', () => {
            const occupiedSummary = checkAvailabilityForPeriod(
                'lili',
                '2026-08-12',
                '2026-08-14',
                sampleReservations,
                []
            );
            expect(occupiedSummary.isAvailable).toBe(false);
            expect(occupiedSummary.overlappingReservations).toHaveLength(1);

            const freeSummary = checkAvailabilityForPeriod(
                'lili',
                '2026-08-16',
                '2026-08-20',
                sampleReservations,
                []
            );
            expect(freeSummary.isAvailable).toBe(true);
        });
    });
});
