import { Company, Contract, PricingModel, Reservation } from '../../../types';

export type FlatBlockReason = 'this_contract' | 'other_contract' | 'occupied';

export type FlatAvailability = {
    flat: string;
    blocked: boolean;
    reason?: FlatBlockReason;
    detail?: string;
    guestName?: string;
};

/** Reserva cobre a data (mesmo critério do mapa de ocupação: checkout inclusivo) */
export function reservationCoversDate(r: Reservation, date: string): boolean {
    if (r.status === 'cancelled') return false;
    const checkIn = r.checkInDate || '';
    const checkOut = r.checkoutDate || '';
    if (!checkIn || !checkOut) return false;
    return checkIn <= date && checkOut >= date;
}

/** Há overlap entre [fromDate, ∞) e a estadia (conflito a partir do início da alocação) */
export function reservationOverlapsFrom(r: Reservation, fromDate: string): boolean {
    if (r.status === 'cancelled') return false;
    const checkIn = r.checkInDate || '';
    const checkOut = r.checkoutDate || '';
    if (!checkIn || !checkOut) return false;
    return checkOut > fromDate;
}

export const formatCnpj = (digits: string) => {
    const d = digits.replace(/\D/g, '').slice(0, 14);
    return d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
};

export const statusLabel: Record<Company['status'], string> = {
    active: 'Ativa',
    delinquent: 'Inadimplente',
    archived: 'Arquivada',
};

export const contractStatusLabel: Record<Contract['status'], string> = {
    draft: 'Rascunho',
    active: 'Ativo',
    ended: 'Encerrado',
    cancelled: 'Cancelado',
};

export const pricingLabel: Record<PricingModel, string> = {
    per_unit_monthly: 'Por flat / mês',
    package_monthly: 'Pacote mensal',
    per_night: 'Por diária',
};

export const today = () => new Date().toISOString().slice(0, 10);

export const money = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const companyInitials = (c: Company) => {
    const name = (c.tradeName || c.legalName || '?').trim();
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

export const fieldClass =
    'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 text-gray-900 dark:text-white';

export const btnPrimary =
    'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-extrabold shadow-lg shadow-slate-900/20 dark:shadow-none hover:bg-slate-800 dark:hover:bg-gray-100 transition-all active:scale-[0.98] touch-manipulation disabled:opacity-50';

export const btnSecondary =
    'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98] touch-manipulation';

export const btnDanger =
    'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-2xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-[0.98] touch-manipulation';
