// Utility functions for calculating dashboard metrics
import { Reservation } from '../types';

interface AnalyticsMetrics {
    revenue: number;
    occupancyRate: number;
    adr: number; // Average Daily Rate
    revpar: number; // Revenue Per Available Room
    bookedNights: number;
    reservationCount: number;
}

export function calculateMonthlyMetrics(
    reservations: Reservation[],
    month?: Date
): AnalyticsMetrics {
    const targetDate = month || new Date();
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    const daysInMonth = endOfMonth.getDate();

    // Filter reservations for this month
    const monthReservations = reservations.filter(r => {
        const checkIn = new Date(r.checkInDate || '');
        return checkIn >= startOfMonth && checkIn <= endOfMonth;
    });

    // Calculate nights
    const calculateNights = (r: Reservation): number => {
        const checkIn = new Date(r.checkInDate || '');
        const checkOut = new Date(r.checkoutDate || '');
        const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return nights > 0 ? nights : 0;
    };

    const totalNights = monthReservations.reduce((sum, r) => sum + calculateNights(r), 0);

    // Estimate revenue (adjust the 400 to your average daily rate)
    const totalRevenue = monthReservations.reduce((sum, r) => {
        const nights = calculateNights(r);
        return sum + (nights * 400); // R$400 per night average
    }, 0);

    // Calculate metrics
    const occupancyRate = daysInMonth > 0 ? (totalNights / daysInMonth) * 100 : 0;
    const adr = totalNights > 0 ? totalRevenue / totalNights : 0;
    const revpar = daysInMonth > 0 ? totalRevenue / daysInMonth : 0;

    return {
        revenue: totalRevenue,
        occupancyRate,
        adr,
        revpar,
        bookedNights: totalNights,
        reservationCount: monthReservations.length,
    };
}

export function formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
}

export function formatPercent(value: number): string {
    return `${value.toFixed(1)}%`;
}
