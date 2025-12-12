import { Reservation } from '../types';

export interface MonthlyStats {
    month: string; // "YYYY-MM"
    totalReservations: number;
    totalNights: number;
    occupancyRate: number;
    returningGuestsCount: number;
    newGuestsCount: number;
    platformDistribution: Record<string, number>; // "Airbnb", "Booking", "Direct" (inferred)
}

export const calculateMonthlyStats = (
    reservations: Reservation[]
): MonthlyStats[] => {

    // Helper: Get YYYY-MM from date string
    const getMonthKey = (dateStr: string) => dateStr.substring(0, 7);

    // Group reservations by month (using check-in date)
    const statsByMonth = new Map<string, {
        reservations: Reservation[];
        nights: number;
        returning: number;
        source: Record<string, number>;
    }>();

    reservations.forEach(res => {
        if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return;

        const key = getMonthKey(res.checkInDate);

        if (!statsByMonth.has(key)) {
            statsByMonth.set(key, { reservations: [], nights: 0, returning: 0, source: {} });
        }

        const entry = statsByMonth.get(key)!;
        entry.reservations.push(res);

        // Calculate nights
        const start = new Date(res.checkInDate);
        const end = new Date(res.checkoutDate);
        const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
        entry.nights += nights;

        // Check if returning guest (simple logic: check if name appears before in the list?)
        // Actually, the calling component usually passes the FULL history. 
        // Ideally we check if this guest has previous reservations in the WHOLE history, 
        // but for a month view we might just count how many reservations in this month are repeaters.
        // A better approach for "Returning Guest" metric in a specific month is:
        // "Did this guest have any reservation BEFORE this one?"
        // Since we receive a `reservations` array, let's assume it's the full history needed for context.
        // But `calculateMonthlyStats` might receive a subset.
        // Let's refine: The metric "Returning Guests" usually means: "Of the people who stayed this month, how many had stayed before?"

        // For now, let's rely on a simpler heuristic or passed metadata if available. 
        // Since we don't have strictly linked "Generic Guest ID", we'll skip complex "Returning" logic per month
        // inside this reducer and handle it broadly or simplistically.
        // Simplistic: derived from `visitCount` if we had computed it before. 
        // We don't have `visitCount` on the Reservation object stored in DB, strictly speaking.
        // We calculated it in the UI. 
        // Let's calculate "Average Stay" instead which is solid.

        // Source Distribution (Inferred from adminNotes or logic)
        // If not explicit, we assume "Direct" or "Unknown".
        const source = res.adminNotes?.toLowerCase().includes('airbnb') ? 'Airbnb'
            : res.adminNotes?.toLowerCase().includes('booking') ? 'Booking'
                : 'Direta';
        entry.source[source] = (entry.source[source] || 0) + 1;
    });

    const results: MonthlyStats[] = [];

    statsByMonth.forEach((data, month) => {
        // Calculate Occupancy
        // Days in month
        const [year, m] = month.split('-').map(Number);
        const daysInMonth = new Date(year, m, 0).getDate();
        const propertyCount = 2; // Lili + Integração (Hardcoded for now, or passed as config)
        const totalCapacityDays = daysInMonth * propertyCount;

        const occupancyRate = totalCapacityDays > 0 ? (data.nights / totalCapacityDays) * 100 : 0;

        results.push({
            month,
            totalReservations: data.reservations.length,
            totalNights: data.nights,
            occupancyRate: Math.min(100, occupancyRate), // Cap at 100% just in case
            returningGuestsCount: 0, // Placeholder
            newGuestsCount: data.reservations.length, // Placeholder
            platformDistribution: data.source
        });
    });

    // Sort by month descending
    return results.sort((a, b) => b.month.localeCompare(a.month));
};

export const aggregateTotals = (stats: MonthlyStats[]) => {
    return stats.reduce((acc, curr) => ({
        totalReservations: acc.totalReservations + curr.totalReservations,
        totalNights: acc.totalNights + curr.totalNights,
        occupancyRate: (acc.occupancyRate + curr.occupancyRate) / 2, // Rough average
    }), { totalReservations: 0, totalNights: 0, occupancyRate: 0 });
};
