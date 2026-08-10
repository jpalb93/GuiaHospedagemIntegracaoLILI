import { Reservation } from '../types';

/**
 * Reservas que NÃO entram no caixa avulso (B2C).
 * Corporativo faturado e externos (Airbnb) ficam de fora para evitar double-count.
 */
export function isExcludedFromReservationCash(r: Reservation): boolean {
    if (r.billingMode === 'corporate') return true;
    if (r.paymentStatus === 'billed') return true;
    if (r.paymentStatus === 'external') return true;
    if (r.isExternal === true) return true;
    return false;
}
