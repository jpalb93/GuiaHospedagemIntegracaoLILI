import type { BlockedDateRange, PropertyId } from '../types';

export interface PublicReservationPeriod {
    checkInDate: string;
    checkoutDate: string;
}

export interface PublicAvailability {
    reservations: PublicReservationPeriod[];
    blockedDates: Pick<BlockedDateRange, 'startDate' | 'endDate'>[];
}

export async function fetchPublicAvailability(
    propertyId: PropertyId,
    signal?: AbortSignal
): Promise<PublicAvailability> {
    const from = new Date().toLocaleDateString('en-CA');
    const params = new URLSearchParams({ propertyId, from });
    const response = await fetch(`/api/get-availability?${params}`, { signal });
    if (!response.ok) {
        throw new Error('Não foi possível carregar a disponibilidade');
    }
    return response.json() as Promise<PublicAvailability>;
}
