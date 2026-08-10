import { describe, it, expect } from 'vitest';
import { quoteCorporateAvailability } from './corporateAvailability';
import { Allocation, Reservation } from '../types';

const baseRes = (over: Partial<Reservation>): Reservation =>
    ({
        guestName: 'Hóspede',
        createdAt: '',
        status: 'active',
        propertyId: 'integracao',
        ...over,
    }) as Reservation;

const baseAlloc = (over: Partial<Allocation>): Allocation =>
    ({
        contractId: 'ct-other',
        companyId: 'co-1',
        propertyId: 'integracao',
        status: 'active',
        startDate: '2026-01-01',
        createdAt: '',
        updatedAt: '',
        ...over,
    }) as Allocation;

describe('quoteCorporateAvailability', () => {
    it('atende pedido quando há flats livres suficientes', () => {
        const quote = quoteCorporateAvailability({
            startDate: '2026-09-01',
            endDate: '2026-09-10',
            requestedCount: 3,
            reservations: [
                baseRes({
                    flatNumber: '201',
                    checkInDate: '2026-09-01',
                    checkoutDate: '2026-09-05',
                    guestName: 'João',
                }),
            ],
            allocations: [],
            units: ['201', '202', '301', '302'],
        });

        expect(quote.availableCount).toBe(3);
        expect(quote.canFulfill).toBe(true);
        expect(quote.suggestedFlats).toEqual(['202', '301', '302']);
        expect(quote.blockedFlats[0].flat).toBe('201');
        expect(quote.blockedFlats[0].reason).toBe('reservation');
    });

    it('bloqueia flat com alocação corporativa no período', () => {
        const quote = quoteCorporateAvailability({
            startDate: '2026-09-01',
            endDate: '2026-09-30',
            requestedCount: 2,
            reservations: [],
            allocations: [
                baseAlloc({ flatNumber: '202', startDate: '2026-08-01', endDate: undefined }),
            ],
            units: ['201', '202', '301'],
        });

        expect(quote.availableFlats).toEqual(['201', '301']);
        expect(quote.canFulfill).toBe(true);
        expect(quote.blockedFlats.some((b) => b.flat === '202' && b.reason === 'allocation')).toBe(
            true
        );
    });

    it('indica shortfall quando não há vagas suficientes', () => {
        const quote = quoteCorporateAvailability({
            startDate: '2026-09-01',
            endDate: '2026-09-10',
            requestedCount: 5,
            reservations: [],
            allocations: [
                baseAlloc({ flatNumber: '201' }),
                baseAlloc({ flatNumber: '202', contractId: 'ct-2' }),
                baseAlloc({ flatNumber: '301', contractId: 'ct-3' }),
            ],
            units: ['201', '202', '301', '302'],
        });

        expect(quote.availableCount).toBe(1);
        expect(quote.canFulfill).toBe(false);
        expect(quote.shortfall).toBe(4);
    });
});
