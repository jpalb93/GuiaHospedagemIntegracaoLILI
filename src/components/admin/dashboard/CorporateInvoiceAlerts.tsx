import React, { useEffect, useMemo, useState } from 'react';
import { Building2, AlertTriangle, ArrowRight, MessageCircle } from 'lucide-react';
import { Company, Invoice } from '../../../types';
import { subscribeToOpenInvoices } from '../../../services/firebase/invoices';
import { subscribeToCompanies } from '../../../services/firebase/corporate';
import { formatCompetenceLabel, invoiceBalance } from '../../../utils/corporateBilling';
import { companyBillingPhone, openInvoiceWhatsApp } from '../../../utils/corporateFollowUp';
import { useToast } from '../../../contexts/ToastContext';

interface CorporateInvoiceAlertsProps {
    onNavigateCompanies: () => void;
}

const CorporateInvoiceAlerts: React.FC<CorporateInvoiceAlertsProps> = ({ onNavigateCompanies }) => {
    const { showError } = useToast();
    const [openInvoices, setOpenInvoices] = useState<Invoice[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        const unsubInv = subscribeToOpenInvoices(setOpenInvoices);
        const unsubCo = subscribeToCompanies(setCompanies);
        return () => {
            unsubInv();
            unsubCo();
        };
    }, []);

    const companyById = useMemo(() => {
        const map = new Map<string, Company>();
        companies.forEach((c) => {
            if (c.id) map.set(c.id, c);
        });
        return map;
    }, [companies]);

    if (openInvoices.length === 0) return null;

    const overdue = openInvoices.filter((i) => i.status === 'overdue');
    const totalOpen = openInvoices.reduce((s, i) => s + invoiceBalance(i.total, i.amountPaid), 0);

    return (
        <div className="rounded-[2rem] border border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2 font-heading">
                        <Building2 size={16} />
                        Faturas corporativas em aberto
                    </h3>
                    <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">
                        {openInvoices.length} fatura{openInvoices.length !== 1 ? 's' : ''}
                        {overdue.length > 0
                            ? ` · ${overdue.length} vencida${overdue.length !== 1 ? 's' : ''}`
                            : ''}
                        {' · '}
                        Total{' '}
                        {totalOpen.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onNavigateCompanies}
                    className="inline-flex items-center gap-1 min-h-[44px] text-xs font-bold text-slate-700 dark:text-slate-200 hover:underline"
                >
                    Ver empresas <ArrowRight size={14} />
                </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
                {openInvoices.slice(0, 8).map((inv) => {
                    const bal = invoiceBalance(inv.total, inv.amountPaid);
                    const phone = companyBillingPhone(companyById.get(inv.companyId));
                    return (
                        <div
                            key={inv.id}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/80 dark:bg-gray-900/40 border border-amber-100 dark:border-amber-900/40"
                        >
                            <button
                                type="button"
                                onClick={onNavigateCompanies}
                                className="min-w-0 flex-1 text-left"
                            >
                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                    {inv.companyName}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                    {inv.status === 'overdue' && (
                                        <AlertTriangle size={12} className="text-red-500" />
                                    )}
                                    {formatCompetenceLabel(inv.competence)} · Venc.{' '}
                                    {inv.dueDate.split('-').reverse().join('/')}
                                </p>
                            </button>
                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`text-sm font-extrabold ${
                                        inv.status === 'overdue'
                                            ? 'text-red-600 dark:text-red-400'
                                            : 'text-amber-700 dark:text-amber-300'
                                    }`}
                                >
                                    {bal.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </span>
                                <button
                                    type="button"
                                    title={
                                        phone
                                            ? 'Cobrar via WhatsApp'
                                            : 'Cadastre o telefone na empresa'
                                    }
                                    onClick={() => {
                                        try {
                                            openInvoiceWhatsApp(inv, phone);
                                        } catch (err) {
                                            showError(
                                                err instanceof Error
                                                    ? err.message
                                                    : 'Sem telefone cadastrado'
                                            );
                                        }
                                    }}
                                    className="inline-flex items-center gap-1 min-h-[40px] px-2.5 rounded-xl text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 touch-manipulation"
                                >
                                    <MessageCircle size={14} /> Cobrar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CorporateInvoiceAlerts;
