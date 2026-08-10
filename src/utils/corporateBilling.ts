import { Allocation, Contract, InvoiceLineItem, ProrationRule } from '../types';

/** Dias no mês de competência YYYY-MM */
export function daysInCompetence(competence: string): number {
    const [y, m] = competence.split('-').map(Number);
    return new Date(y, m, 0).getDate();
}

export function competenceBounds(competence: string): {
    first: string;
    last: string;
    next: string;
} {
    const days = daysInCompetence(competence);
    const [year, month] = competence.split('-').map(Number);
    const nextDate = new Date(Date.UTC(year, month, 1));
    return {
        first: `${competence}-01`,
        last: `${competence}-${String(days).padStart(2, '0')}`,
        next: `${nextDate.getUTCFullYear()}-${String(nextDate.getUTCMonth() + 1).padStart(2, '0')}-01`,
    };
}

export function dueDateForCompetence(competence: string, billingDay: number): string {
    const days = daysInCompetence(competence);
    const day = Math.min(Math.max(1, billingDay), days);
    return `${competence}-${String(day).padStart(2, '0')}`;
}

export function currentCompetence(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

/** Interseção [start,end) com o mês. endDate é checkout/fim exclusivo e não é cobrado. */
export function activeDaysInMonth(
    startDate: string,
    endDate: string | undefined,
    competence: string
): number {
    const { first, next } = competenceBounds(competence);
    const start = startDate > first ? startDate : first;
    const endExclusive = !endDate || endDate > next ? next : endDate;
    if (start >= endExclusive) return 0;

    const s = new Date(start + 'T12:00:00');
    const e = new Date(endExclusive + 'T12:00:00');
    return Math.floor((e.getTime() - s.getTime()) / 86400000);
}

export function applyProration(
    monthlyPrice: number,
    activeDays: number,
    daysInMonth: number,
    rule: ProrationRule
): number {
    if (activeDays <= 0 || monthlyPrice <= 0) return 0;
    if (rule === 'full_month') return roundMoney(monthlyPrice);
    if (rule === 'full_if_half_month') {
        if (activeDays >= 15) return roundMoney(monthlyPrice);
        return roundMoney(monthlyPrice * (activeDays / daysInMonth));
    }
    // daily
    return roundMoney(monthlyPrice * (activeDays / daysInMonth));
}

export function roundMoney(n: number): number {
    return Math.round(n * 100) / 100;
}

function newLineId(): string {
    return `li_${Math.random().toString(36).slice(2, 10)}`;
}

export function buildInvoiceItems(
    contract: Contract,
    allocations: Allocation[],
    competence: string
): InvoiceLineItem[] {
    const daysMonth = daysInCompetence(competence);
    const rule = contract.prorationRule || 'daily';
    const items: InvoiceLineItem[] = [];

    const relevant = allocations.filter((a) => {
        if (a.status === 'paused') return false;
        const days = activeDaysInMonth(a.startDate, a.endDate, competence);
        return days > 0;
    });

    if (relevant.length === 0) return [];

    if (contract.pricingModel === 'package_monthly') {
        const packagePrice = contract.packageMonthlyPrice || 0;
        // Rateio do pacote pelo overlap do contrato com o mês
        const contractDays = activeDaysInMonth(contract.startDate, contract.endDate, competence);
        const amount = applyProration(packagePrice, contractDays, daysMonth, rule);
        const flats = relevant
            .map((a) => a.flatNumber || a.propertyId)
            .filter(Boolean)
            .join(', ');
        items.push({
            id: newLineId(),
            type: 'package',
            description: `Pacote mensal (${flats || 'flats'}) — ${formatCompetenceLabel(competence)}`,
            quantity: 1,
            unitAmount: amount,
            amount,
        });
        return items;
    }

    if (contract.pricingModel === 'per_night') {
        for (const a of relevant) {
            const days = activeDaysInMonth(a.startDate, a.endDate, competence);
            const rate = a.nightlyPrice ?? contract.nightlyPrice ?? 0;
            const amount = roundMoney(rate * days);
            items.push({
                id: newLineId(),
                type: 'allocation',
                description: `${flatLabel(a)} — ${days} diária${days !== 1 ? 's' : ''} (${formatCompetenceLabel(competence)})`,
                allocationId: a.id,
                propertyId: a.propertyId,
                flatNumber: a.flatNumber,
                quantity: days,
                unitAmount: rate,
                amount,
            });
        }
        return items;
    }

    // per_unit_monthly (default)
    for (const a of relevant) {
        const days = activeDaysInMonth(a.startDate, a.endDate, competence);
        const monthly = a.monthlyPrice ?? contract.unitMonthlyPrice ?? 0;
        const amount = applyProration(monthly, days, daysMonth, rule);
        items.push({
            id: newLineId(),
            type: 'allocation',
            description: `${flatLabel(a)} — ${formatCompetenceLabel(competence)} (${days}/${daysMonth} dias)`,
            allocationId: a.id,
            propertyId: a.propertyId,
            flatNumber: a.flatNumber,
            quantity: days,
            unitAmount: roundMoney(monthly / daysMonth),
            amount,
        });
    }
    return items;
}

function flatLabel(a: Allocation): string {
    if (a.propertyId === 'lili') return 'Flat da Lili';
    return `Flat ${a.flatNumber || '?'}`;
}

export function formatCompetenceLabel(competence: string): string {
    const [y, m] = competence.split('-');
    const months = [
        'jan',
        'fev',
        'mar',
        'abr',
        'mai',
        'jun',
        'jul',
        'ago',
        'set',
        'out',
        'nov',
        'dez',
    ];
    const idx = Number(m) - 1;
    return `${months[idx] || m}/${y}`;
}

export function invoiceBalance(total: number, amountPaid: number): number {
    return roundMoney(Math.max(0, total - amountPaid));
}

export function deriveInvoiceStatus(
    total: number,
    amountPaid: number,
    current: 'draft' | 'issued' | 'partial' | 'paid' | 'overdue' | 'cancelled',
    dueDate: string,
    today: string = new Date().toISOString().slice(0, 10)
): 'draft' | 'issued' | 'partial' | 'paid' | 'overdue' | 'cancelled' {
    if (current === 'draft' || current === 'cancelled') return current;
    if (amountPaid >= total - 0.009) return 'paid';
    if (amountPaid > 0) {
        if (dueDate < today) return 'overdue';
        return 'partial';
    }
    if (dueDate < today) return 'overdue';
    return 'issued';
}
