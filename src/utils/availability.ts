import { Reservation, PropertyId } from '../types';

export interface FlatUnitAvailability {
    unit: string;
    isAvailable: boolean;
    occupyingGuest?: string;
    occupyingCheckIn?: string;
    occupyingCheckout?: string;
}

export interface PropertyAvailabilitySummary {
    propertyId: PropertyId;
    isAvailable: boolean;
    totalUnits: number;
    availableUnitsCount: number;
    occupiedUnitsCount: number;
    unitsStatus: FlatUnitAvailability[];
    overlappingReservations: Reservation[];
}

/**
 * Checa se dois intervalos de datas [checkIn, checkout) se sobrepõem.
 * O checkout de um hóspede pode ser no mesmo dia do check-in de outro.
 */
export const isDateRangeOverlapping = (
    startA: string,
    endA: string,
    startB: string,
    endB: string
): boolean => {
    if (!startA || !endA || !startB || !endB) return false;
    return startA < endB && endA > startB;
};

/**
 * Calcula a disponibilidade inteligente de flats/propriedade para um período de datas.
 */
export const checkAvailabilityForPeriod = (
    propertyId: PropertyId,
    checkInDate: string,
    checkoutDate: string,
    reservations: Reservation[],
    units: string[] = [],
    currentEditingId?: string | null
): PropertyAvailabilitySummary => {
    if (!checkInDate || !checkoutDate || checkInDate >= checkoutDate) {
        return {
            propertyId,
            isAvailable: true,
            totalUnits: units.length,
            availableUnitsCount: units.length,
            occupiedUnitsCount: 0,
            unitsStatus: units.map((unit) => ({ unit, isAvailable: true })),
            overlappingReservations: [],
        };
    }

    // Filtra reservas que se sobrepõem no período
    const overlappingReservations = reservations.filter((res) => {
        if (res.status === 'cancelled') return false;
        if (currentEditingId && res.id === currentEditingId) return false;
        const resProp = res.propertyId || 'lili';
        if (resProp !== propertyId) return false;

        return isDateRangeOverlapping(
            checkInDate,
            checkoutDate,
            res.checkInDate || '',
            res.checkoutDate || ''
        );
    });

    if (units.length === 0) {
        // Propriedade sem unidades numéricas individuais (ex: Flat da Lili)
        const isAvailable = overlappingReservations.length === 0;
        return {
            propertyId,
            isAvailable,
            totalUnits: 1,
            availableUnitsCount: isAvailable ? 1 : 0,
            occupiedUnitsCount: isAvailable ? 0 : 1,
            unitsStatus: [],
            overlappingReservations,
        };
    }

    // Propriedade com unidades individuais (ex: Flats Integração)
    const unitsStatus: FlatUnitAvailability[] = units.map((unit) => {
        const occupying = overlappingReservations.find(
            (res) => res.flatNumber && res.flatNumber.trim() === unit.trim()
        );

        if (occupying) {
            return {
                unit,
                isAvailable: false,
                occupyingGuest: occupying.guestName,
                occupyingCheckIn: occupying.checkInDate,
                occupyingCheckout: occupying.checkoutDate,
            };
        }

        return {
            unit,
            isAvailable: true,
        };
    });

    const availableUnitsCount = unitsStatus.filter((u) => u.isAvailable).length;
    const occupiedUnitsCount = unitsStatus.length - availableUnitsCount;

    return {
        propertyId,
        isAvailable: availableUnitsCount > 0,
        totalUnits: units.length,
        availableUnitsCount,
        occupiedUnitsCount,
        unitsStatus,
        overlappingReservations,
    };
};
