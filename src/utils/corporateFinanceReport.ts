import { Invoice } from '../types';
import {
    deriveInvoiceStatus,
    formatCompetenceLabel,
    invoiceBalance,
    competenceBounds,
    roundMoney,
} from './corporateBilling';

export interface CorporateFinanceSummary {
    billedTotal: number;
    receivedTotal: number;
    openTotal: number;
    invoiceCount: number;
    overdueCount: number;
    paidCount: number;
}

/** Filtra faturas para o relatório (ignora draft/cancelled) */
export function filterInvoicesForReport(
    invoices: Invoice[],
    opts: {
        selectedMonth: string;
        startDate: string;
        endDate: string;
        companyId: string;
        statusFilter: string;
    }
): Invoice[] {
    const today = new Date().toISOString().slice(0, 10);

    return invoices
        .filter((inv) => {
            if (inv.status === 'draft' || inv.status === 'cancelled') return false;

            if (opts.companyId !== 'all' && inv.companyId !== opts.companyId) return false;

            if (opts.selectedMonth !== 'all' && !(opts.startDate && opts.endDate)) {
                if (inv.competence !== opts.selectedMonth) return false;
            }

            if (opts.startDate && opts.endDate) {
                const { first, last } = competenceBounds(inv.competence);
                if (first > opts.endDate || last < opts.startDate) return false;
            }

            const status = deriveInvoiceStatus(
                inv.total,
                inv.amountPaid,
                inv.status,
                inv.dueDate,
                today
            );

            if (opts.statusFilter !== 'all') {
                if (opts.statusFilter === 'open') {
                    if (status === 'paid') return false;
                } else if (status !== opts.statusFilter) {
                    return false;
                }
            }

            return true;
        })
        .map((inv) => ({
            ...inv,
            status: deriveInvoiceStatus(inv.total, inv.amountPaid, inv.status, inv.dueDate, today),
        }))
        .sort((a, b) => b.competence.localeCompare(a.competence));
}

export function summarizeCorporateFinance(invoices: Invoice[]): CorporateFinanceSummary {
    let billedTotal = 0;
    let receivedTotal = 0;
    let openTotal = 0;
    let overdueCount = 0;
    let paidCount = 0;

    invoices.forEach((inv) => {
        billedTotal += inv.total || 0;
        receivedTotal += inv.amountPaid || 0;
        const bal = invoiceBalance(inv.total, inv.amountPaid);
        openTotal += bal;
        if (inv.status === 'overdue') overdueCount += 1;
        if (inv.status === 'paid') paidCount += 1;
    });

    return {
        billedTotal: roundMoney(billedTotal),
        receivedTotal: roundMoney(receivedTotal),
        openTotal: roundMoney(openTotal),
        invoiceCount: invoices.length,
        overdueCount,
        paidCount,
    };
}

export { formatCompetenceLabel, invoiceBalance };
