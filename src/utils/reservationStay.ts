import type { Reservation } from '../types';
import { PROPERTIES } from '../config/properties';

type Stay = Pick<
    Reservation,
    | 'stayType'
    | 'propertyId'
    | 'checkInDate'
    | 'checkoutDate'
    | 'checkInTime'
    | 'checkOutTime'
    | 'guestCount'
    | 'billingMode'
>;

export function getStayValidationError(stay: Stay): string | null {
    const { checkInDate, checkoutDate, checkInTime, checkOutTime } = stay;
    const validDate = (value?: string) =>
        !!value &&
        /^\d{4}-\d{2}-\d{2}$/.test(value) &&
        Number.isFinite(Date.parse(`${value}T00:00:00Z`)) &&
        new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
    if (!validDate(checkInDate) || !validDate(checkoutDate))
        return 'Verifique as datas de entrada e saída.';
    const validTime = (value?: string) => !!value && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    if (!validTime(checkInTime) || !validTime(checkOutTime))
        return 'Verifique os horários de entrada e saída.';
    if (stay.stayType === 'day_use') {
        if (stay.propertyId !== 'integracao')
            return 'Day use está disponível apenas nos Flats Integração.';
        if (stay.billingMode === 'corporate')
            return 'Day use deve ser cadastrado como reserva avulsa.';
        if (stay.guestCount !== 1)
            return 'Day use é individual: selecione 1 pessoa, sem visitantes.';
        if (checkInDate !== checkoutDate)
            return 'No day use, entrada e saída devem ocorrer no mesmo dia.';
        if (checkOutTime! <= checkInTime!)
            return 'No day use, o horário de saída deve ser depois da entrada.';
    } else if (checkoutDate! <= checkInDate!) {
        return 'O Check-out deve ser DEPOIS do Check-in.';
    }
    return null;
}

export function reservationInterval(stay: Stay) {
    const defaults = PROPERTIES[stay.propertyId || 'lili'].defaults;
    return {
        start: `${stay.checkInDate}T${stay.checkInTime || (stay.stayType === 'day_use' ? '08:00' : defaults.checkInTime)}`,
        end: `${stay.checkoutDate}T${stay.checkOutTime || (stay.stayType === 'day_use' ? '12:00' : defaults.checkOutTime)}`,
    };
}

export function reservationsOverlap(a: Stay, b: Stay): boolean {
    if (!a.checkInDate || !a.checkoutDate || !b.checkInDate || !b.checkoutDate) return false;
    // Preserve the legacy date-based policy for pairs of overnight stays.
    if (a.stayType !== 'day_use' && b.stayType !== 'day_use') {
        return a.checkInDate < b.checkoutDate && a.checkoutDate > b.checkInDate;
    }
    const first = reservationInterval(a);
    const second = reservationInterval(b);
    return first.start < second.end && first.end > second.start;
}

export function reservationNights(stay: Stay): number {
    if (stay.stayType === 'day_use') return 0;
    if (!stay.checkInDate || !stay.checkoutDate) return 0;
    return Math.max(
        1,
        Math.round((Date.parse(stay.checkoutDate) - Date.parse(stay.checkInDate)) / 86400000)
    );
}

export function dayUseLabel(stay: Stay): string {
    return `Day use · ${stay.checkInTime || '08:00'}–${stay.checkOutTime || '12:00'}`;
}

export function dayUsePhase(
    stay: Stay,
    now = new Date()
): 'upcoming' | 'active' | 'finished' | null {
    if (stay.stayType !== 'day_use' || !stay.checkInDate || !stay.checkoutDate) return null;
    const interval = reservationInterval(stay);
    const start = Date.parse(`${interval.start}:00-03:00`);
    const end = Date.parse(`${interval.end}:00-03:00`);
    if (now.getTime() >= end) return 'finished';
    return now.getTime() < start ? 'upcoming' : 'active';
}
