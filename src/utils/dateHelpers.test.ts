import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Testes para funções de parse e formatação de datas
 * Essas funções são usadas em vários componentes do sistema
 */

// Recria a função parseDate usada em useGuestStay
const parseDate = (str: string): Date => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

// Recria a função getFormattedEventDate de PlaceCard
const getFormattedEventDate = (eventDate: string): string => {
    const [, m, d] = eventDate.split('-');
    return `${d}/${m}`;
};

// Recria getGreeting de HeroSection
const getGreeting = (hour: number): string => {
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
};

// Recria isDateOccupied (simplificado) de LandingPageLili
interface Reservation {
    checkInDate: string;
    checkoutDate: string;
    status?: string;
}

const isDateOccupied = (
    date: Date,
    reservations: Reservation[],
    blockedDates: { startDate: string; endDate: string }[] = []
): boolean => {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const targetTime = target.getTime();

    const isReserved = reservations.some((res) => {
        if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return false;
        const [inY, inM, inD] = res.checkInDate.split('-').map(Number);
        const [outY, outM, outD] = res.checkoutDate.split('-').map(Number);
        const start = new Date(inY, inM - 1, inD);
        const end = new Date(outY, outM - 1, outD);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return targetTime >= start.getTime() && targetTime <= end.getTime();
    });

    if (isReserved) return true;

    return blockedDates.some((block) => {
        if (!block.startDate || !block.endDate) return false;
        const [inY, inM, inD] = block.startDate.split('-').map(Number);
        const [outY, outM, outD] = block.endDate.split('-').map(Number);
        const start = new Date(inY, inM - 1, inD);
        const end = new Date(outY, outM - 1, outD);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        return targetTime >= start.getTime() && targetTime <= end.getTime();
    });
};

describe('parseDate', () => {
    it('should parse YYYY-MM-DD format correctly', () => {
        const date = parseDate('2024-01-15');
        expect(date.getFullYear()).toBe(2024);
        expect(date.getMonth()).toBe(0); // Janeiro = 0
        expect(date.getDate()).toBe(15);
    });

    it('should handle month boundaries', () => {
        const date = parseDate('2024-12-31');
        expect(date.getMonth()).toBe(11); // Dezembro = 11
        expect(date.getDate()).toBe(31);
    });

    it('should handle February', () => {
        const date = parseDate('2024-02-29'); // 2024 é bissexto
        expect(date.getMonth()).toBe(1);
        expect(date.getDate()).toBe(29);
    });
});

describe('getFormattedEventDate', () => {
    it('should format date as DD/MM', () => {
        expect(getFormattedEventDate('2024-01-15')).toBe('15/01');
        expect(getFormattedEventDate('2024-12-25')).toBe('25/12');
    });

    it('should preserve leading zeros', () => {
        expect(getFormattedEventDate('2024-03-05')).toBe('05/03');
    });
});

describe('getGreeting', () => {
    it('should return "Bom dia" for morning hours (5-11)', () => {
        expect(getGreeting(5)).toBe('Bom dia');
        expect(getGreeting(8)).toBe('Bom dia');
        expect(getGreeting(11)).toBe('Bom dia');
    });

    it('should return "Boa tarde" for afternoon hours (12-17)', () => {
        expect(getGreeting(12)).toBe('Boa tarde');
        expect(getGreeting(14)).toBe('Boa tarde');
        expect(getGreeting(17)).toBe('Boa tarde');
    });

    it('should return "Boa noite" for evening/night hours', () => {
        expect(getGreeting(18)).toBe('Boa noite');
        expect(getGreeting(21)).toBe('Boa noite');
        expect(getGreeting(0)).toBe('Boa noite');
        expect(getGreeting(4)).toBe('Boa noite');
    });
});

describe('isDateOccupied', () => {
    const reservations: Reservation[] = [
        { checkInDate: '2024-01-10', checkoutDate: '2024-01-15' },
        { checkInDate: '2024-02-01', checkoutDate: '2024-02-05', status: 'cancelled' },
    ];

    it('should return true for dates within a reservation', () => {
        const middleDate = new Date(2024, 0, 12); // 12 de Janeiro
        expect(isDateOccupied(middleDate, reservations)).toBe(true);
    });

    it('should return true for check-in date', () => {
        const checkIn = new Date(2024, 0, 10);
        expect(isDateOccupied(checkIn, reservations)).toBe(true);
    });

    it('should return true for checkout date', () => {
        const checkout = new Date(2024, 0, 15);
        expect(isDateOccupied(checkout, reservations)).toBe(true);
    });

    it('should return false for dates outside reservations', () => {
        const freeDate = new Date(2024, 0, 8);
        expect(isDateOccupied(freeDate, reservations)).toBe(false);
    });

    it('should ignore cancelled reservations', () => {
        const inCancelledRange = new Date(2024, 1, 3); // 3 de Fevereiro
        expect(isDateOccupied(inCancelledRange, reservations)).toBe(false);
    });

    it('should handle blocked dates', () => {
        const blockedDates = [{ startDate: '2024-03-01', endDate: '2024-03-10' }];
        const blockedDate = new Date(2024, 2, 5);
        expect(isDateOccupied(blockedDate, [], blockedDates)).toBe(true);
    });
});
