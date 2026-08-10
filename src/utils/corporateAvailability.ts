import { Allocation, Reservation } from '../types';
import { checkAvailabilityForPeriod, isDateRangeOverlapping } from './availability';
import { PROPERTIES } from '../config/properties';

export type CorporateBlockReason = 'reservation' | 'allocation';

export interface CorporateFlatBlock {
    flat: string;
    reason: CorporateBlockReason;
    detail: string;
    guestName?: string;
    from?: string;
    to?: string;
}

export interface CorporateAvailabilityQuote {
    startDate: string;
    endDate: string;
    requestedCount: number;
    totalUnits: number;
    availableFlats: string[];
    blockedFlats: CorporateFlatBlock[];
    /** Quantos flats livres no período inteiro */
    availableCount: number;
    /** Dá para atender o pedido? */
    canFulfill: boolean;
    /** Sugestão automática: primeiros N livres */
    suggestedFlats: string[];
    /** Quantos faltam se não der */
    shortfall: number;
}

function allocationOverlapsPeriod(a: Allocation, startDate: string, endDate: string): boolean {
    if (a.status !== 'active') return false;
    if (a.propertyId !== 'integracao') return false;
    const aEndExclusive = a.endDate || '9999-12-31';
    return a.startDate < endDate && aEndExclusive > startDate;
}

/**
 * Consulta de disponibilidade corporativa (sem cadastro).
 * Cruza reservas + alocações ativas de outros contratos.
 */
export function quoteCorporateAvailability(input: {
    startDate: string;
    endDate: string;
    requestedCount: number;
    reservations: Reservation[];
    allocations: Allocation[];
    /** Ignorar alocações deste contrato (ex.: reconsulta ao editar) */
    ignoreContractId?: string;
    units?: string[];
}): CorporateAvailabilityQuote {
    const units = input.units || PROPERTIES.integracao.units || [];
    const { startDate, endDate, requestedCount } = input;

    const empty: CorporateAvailabilityQuote = {
        startDate,
        endDate,
        requestedCount,
        totalUnits: units.length,
        availableFlats: [],
        blockedFlats: [],
        availableCount: 0,
        canFulfill: false,
        suggestedFlats: [],
        shortfall: Math.max(0, requestedCount),
    };

    if (!startDate || !endDate || startDate >= endDate || requestedCount < 1) {
        return empty;
    }

    const reservationSummary = checkAvailabilityForPeriod(
        'integracao',
        startDate,
        endDate,
        input.reservations,
        units
    );

    const blockedFlats: CorporateFlatBlock[] = [];
    const availableFlats: string[] = [];

    for (const unit of units) {
        const resStatus = reservationSummary.unitsStatus.find((u) => u.unit === unit);
        if (resStatus && !resStatus.isAvailable) {
            blockedFlats.push({
                flat: unit,
                reason: 'reservation',
                guestName: resStatus.occupyingGuest,
                detail: resStatus.occupyingGuest
                    ? `Reserva: ${resStatus.occupyingGuest}`
                    : 'Reservado no período',
                from: resStatus.occupyingCheckIn,
                to: resStatus.occupyingCheckout,
            });
            continue;
        }

        const alloc = input.allocations.find(
            (a) =>
                a.flatNumber === unit &&
                a.contractId !== input.ignoreContractId &&
                allocationOverlapsPeriod(a, startDate, endDate)
        );
        if (alloc) {
            blockedFlats.push({
                flat: unit,
                reason: 'allocation',
                detail: 'Alocado a outro contrato corporativo',
                from: alloc.startDate,
                to: alloc.endDate,
            });
            continue;
        }

        availableFlats.push(unit);
    }

    const availableCount = availableFlats.length;
    const suggestedFlats = availableFlats.slice(0, requestedCount);
    const canFulfill = availableCount >= requestedCount;

    return {
        startDate,
        endDate,
        requestedCount,
        totalUnits: units.length,
        availableFlats,
        blockedFlats,
        availableCount,
        canFulfill,
        suggestedFlats,
        shortfall: Math.max(0, requestedCount - availableCount),
    };
}

/** Dias do período (noites) — alinhado ao half-open das reservas */
export function nightsBetween(startDate: string, endDate: string): number {
    if (!startDate || !endDate || startDate >= endDate) return 0;
    const s = new Date(startDate + 'T12:00:00');
    const e = new Date(endDate + 'T12:00:00');
    return Math.max(0, Math.round((e.getTime() - s.getTime()) / 86400000));
}

export function estimatePackageTotal(
    nightlyOrMonthly: number,
    nights: number,
    flatCount: number,
    mode: 'per_night' | 'per_unit_monthly' | 'package_monthly'
): number {
    if (mode === 'per_night') {
        return Math.round(nightlyOrMonthly * nights * flatCount * 100) / 100;
    }
    if (mode === 'package_monthly') {
        // aproxima mês comercial 30 dias
        const months = nights / 30;
        return Math.round(nightlyOrMonthly * months * 100) / 100;
    }
    // per_unit_monthly
    const months = nights / 30;
    return Math.round(nightlyOrMonthly * months * flatCount * 100) / 100;
}

// re-export helper used by tests
export { isDateRangeOverlapping };
