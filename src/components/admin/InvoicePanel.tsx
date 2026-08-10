import React, { useEffect, useState } from 'react';
import {
    FileText,
    Plus,
    Loader2,
    Check,
    X,
    DollarSign,
    AlertTriangle,
    MessageCircle,
} from 'lucide-react';
import { Company, Invoice, Payment, PaymentMethod } from '../../types';
import {
    subscribeToInvoicesByCompany,
    subscribeToInvoicesByContract,
    generateInvoiceDraft,
    issueInvoice,
    cancelInvoice,
    registerInvoicePayment,
    deleteInvoicePayment,
    subscribeToPaymentsByInvoice,
    updateInvoiceNf,
    updateInvoiceDiscount,
    currentCompetence,
} from '../../services/firebase/invoices';
import { getCompany } from '../../services/firebase/corporate';
import { formatCompetenceLabel, invoiceBalance } from '../../utils/corporateBilling';
import { companyBillingPhone, openInvoiceWhatsApp } from '../../utils/corporateFollowUp';
import { useToast } from '../../contexts/ToastContext';

const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const statusStyles: Record<Invoice['status'], string> = {
    draft: 'bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    issued: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300',
    partial:
        'bg-amber-100 text-amber-900 border border-amber-200 dark:bg-amber-900/40 dark:text-amber-300',
    paid: 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300',
    overdue: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300',
    cancelled: 'bg-stone-100 text-stone-500 line-through border border-stone-200',
};

const statusLabel: Record<Invoice['status'], string> = {
    draft: 'Rascunho',
    issued: 'Emitida',
    partial: 'Parcial',
    paid: 'Paga',
    overdue: 'Vencida',
    cancelled: 'Cancelada',
};

const fieldClass =
    'w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-400 text-gray-900 dark:text-white';

interface InvoicePanelProps {
    companyId: string;
    contractId?: string;
    companyName?: string;
}

const InvoicePanel: React.FC<InvoicePanelProps> = ({ companyId, contractId }) => {
    const { showSuccess, showError } = useToast();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [competence, setCompetence] = useState(currentCompetence());
    const [generating, setGenerating] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (contractId) {
            return subscribeToInvoicesByContract(contractId, setInvoices);
        }
        return subscribeToInvoicesByCompany(companyId, setInvoices);
    }, [companyId, contractId]);

    const handleGenerate = async () => {
        if (!contractId) return;
        setGenerating(true);
        try {
            const id = await generateInvoiceDraft(contractId, competence);
            showSuccess(`Fatura ${formatCompetenceLabel(competence)} gerada`);
            setSelectedId(id);
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao gerar fatura');
        } finally {
            setGenerating(false);
        }
    };

    const selected = invoices.find((i) => i.id === selectedId) || null;

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-2 font-heading">
                        <FileText size={14} /> Ciclo de faturamento
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        Ledger de faturas e baixas manuais — sem double-count no caixa avulso.
                    </p>
                </div>
                {contractId && (
                    <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor="invoice-competence" className="sr-only">
                            Competência da nova fatura
                        </label>
                        <input
                            id="invoice-competence"
                            type="month"
                            value={competence}
                            onChange={(e) => setCompetence(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-400 min-h-[44px]"
                        />
                        <button
                            type="button"
                            disabled={generating}
                            onClick={handleGenerate}
                            className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold disabled:opacity-50 touch-manipulation"
                        >
                            {generating ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Plus size={14} />
                            )}
                            Gerar fatura
                        </button>
                    </div>
                )}
            </div>

            {invoices.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        Nenhuma fatura neste ciclo
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {contractId
                            ? 'Gere a competência do mês para iniciar o ledger.'
                            : 'As faturas aparecem aqui após emissão nos contratos.'}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left border-collapse min-w-[520px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-gray-900/60 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 border-b border-gray-200 dark:border-gray-700">
                                <th className="py-3 px-4">Competência</th>
                                <th className="py-3 px-4">Vencimento</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4 text-right">Total</th>
                                <th className="py-3 px-4 text-right">Pago</th>
                                <th className="py-3 px-4 text-right">Aberto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs">
                            {invoices.map((inv) => {
                                const bal = invoiceBalance(inv.total, inv.amountPaid);
                                const isSel = selectedId === inv.id;
                                return (
                                    <tr
                                        key={inv.id}
                                        onClick={() => setSelectedId(inv.id!)}
                                        className={`cursor-pointer transition-colors ${
                                            isSel
                                                ? 'bg-slate-100 dark:bg-slate-800/60'
                                                : 'bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700/40'
                                        }`}
                                    >
                                        <td className="py-3.5 px-4 font-extrabold text-gray-900 dark:text-white">
                                            {formatCompetenceLabel(inv.competence)}
                                        </td>
                                        <td className="py-3.5 px-4 text-gray-600 dark:text-gray-300">
                                            {inv.dueDate.split('-').reverse().join('/')}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${statusStyles[inv.status]}`}
                                            >
                                                {statusLabel[inv.status]}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-bold text-gray-900 dark:text-white">
                                            {money(inv.total)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-bold text-emerald-700 dark:text-emerald-300">
                                            {money(inv.amountPaid)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-bold text-red-700 dark:text-red-300">
                                            {inv.status === 'cancelled' ? '—' : money(bal)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {selected && (
                <InvoiceDetail
                    invoice={selected}
                    onClose={() => setSelectedId(null)}
                    onError={showError}
                    onSuccess={showSuccess}
                />
            )}
        </div>
    );
};

const InvoiceDetail: React.FC<{
    invoice: Invoice;
    onClose: () => void;
    onError: (m: string) => void;
    onSuccess: (m: string) => void;
}> = ({ invoice, onClose, onError, onSuccess }) => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [busy, setBusy] = useState(false);
    const [payAmount, setPayAmount] = useState('');
    const [payMethod, setPayMethod] = useState<PaymentMethod>('pix');
    const [payDate, setPayDate] = useState(new Date().toISOString().slice(0, 10));
    const [payNote, setPayNote] = useState('');
    const [discount, setDiscount] = useState(String(invoice.discount || 0));
    const [nfNumber, setNfNumber] = useState(invoice.nf?.number || '');
    const [nfNote, setNfNote] = useState(invoice.nf?.urlOrNote || '');
    const [company, setCompany] = useState<Company | null>(null);

    useEffect(() => {
        if (!invoice.id) return;
        return subscribeToPaymentsByInvoice(invoice.id, setPayments);
    }, [invoice.id]);

    useEffect(() => {
        let cancelled = false;
        getCompany(invoice.companyId).then((c) => {
            if (!cancelled) setCompany(c);
        });
        return () => {
            cancelled = true;
        };
    }, [invoice.companyId]);

    useEffect(() => {
        setDiscount(String(invoice.discount || 0));
        setNfNumber(invoice.nf?.number || '');
        setNfNote(invoice.nf?.urlOrNote || '');
        const bal = invoiceBalance(invoice.total, invoice.amountPaid);
        setPayAmount(bal > 0 ? String(bal) : '');
    }, [invoice]);

    const bal = invoiceBalance(invoice.total, invoice.amountPaid);
    const canRemind =
        invoice.status !== 'draft' &&
        invoice.status !== 'cancelled' &&
        invoice.status !== 'paid' &&
        bal > 0;

    return (
        <div className="p-6 rounded-[2rem] border border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900/50 space-y-4">
            <div className="flex justify-between items-start gap-2">
                <div>
                    <h4 className="font-extrabold text-gray-900 dark:text-white font-heading flex items-center gap-2">
                        Fatura {formatCompetenceLabel(invoice.competence)}
                        {invoice.status === 'overdue' && (
                            <AlertTriangle size={16} className="text-red-500" />
                        )}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                        {statusLabel[invoice.status]} · Venc.{' '}
                        {invoice.dueDate.split('-').reverse().join('/')}
                    </p>
                </div>
                <div className="flex items-center gap-1">
                    {canRemind && (
                        <button
                            type="button"
                            onClick={() => {
                                try {
                                    openInvoiceWhatsApp(invoice, companyBillingPhone(company));
                                } catch (err) {
                                    onError(
                                        err instanceof Error
                                            ? err.message
                                            : 'Cadastre o telefone na empresa'
                                    );
                                }
                            }}
                            className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-xl text-sm font-bold bg-emerald-600 text-white touch-manipulation"
                        >
                            <MessageCircle size={14} /> Cobrar
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar detalhe"
                        className="min-h-[44px] min-w-[44px] p-1.5 rounded-xl text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 touch-manipulation"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="space-y-1.5">
                {invoice.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between gap-2 text-sm py-1.5 border-b border-gray-200/60 dark:border-gray-700/60"
                    >
                        <span className="text-gray-600 dark:text-gray-300">{item.description}</span>
                        <span className="font-bold text-gray-900 dark:text-white shrink-0">
                            {money(item.amount)}
                        </span>
                    </div>
                ))}
                {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600">
                        <span>Desconto</span>
                        <span>- {money(invoice.discount)}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm font-extrabold pt-1">
                    <span>Total</span>
                    <span>{money(invoice.total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                    <span>Pago</span>
                    <span>{money(invoice.amountPaid)}</span>
                </div>
                {bal > 0 && (
                    <div className="flex justify-between text-sm font-extrabold text-red-700 dark:text-red-400">
                        <span>Saldo</span>
                        <span>{money(bal)}</span>
                    </div>
                )}
            </div>

            {invoice.status === 'draft' && (
                <div className="flex flex-wrap gap-2 items-end">
                    <div className="flex-1 min-w-[120px]">
                        <label
                            htmlFor={`invoice-discount-${invoice.id}`}
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Desconto (R$)
                        </label>
                        <input
                            id={`invoice-discount-${invoice.id}`}
                            type="number"
                            min={0}
                            step="0.01"
                            className={fieldClass}
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            try {
                                await updateInvoiceDiscount(invoice.id!, Number(discount) || 0);
                                onSuccess('Desconto atualizado');
                            } catch (err) {
                                onError(err instanceof Error ? err.message : 'Erro');
                            } finally {
                                setBusy(false);
                            }
                        }}
                        className="min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-bold border border-gray-300 dark:border-gray-600"
                    >
                        Aplicar
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            try {
                                await issueInvoice(invoice.id!);
                                onSuccess('Fatura emitida');
                            } catch (err) {
                                onError(err instanceof Error ? err.message : 'Erro ao emitir');
                            } finally {
                                setBusy(false);
                            }
                        }}
                        className="min-h-[44px] px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-emerald-600 text-white flex items-center gap-1"
                    >
                        <Check size={14} /> Emitir
                    </button>
                </div>
            )}

            {invoice.status !== 'draft' && invoice.status !== 'cancelled' && bal > 0 && (
                <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 space-y-3">
                    <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                        <DollarSign size={12} /> Registrar pagamento
                    </p>
                    <div className="grid sm:grid-cols-3 gap-2">
                        <input
                            aria-label="Valor do pagamento"
                            type="number"
                            min={0}
                            step="0.01"
                            placeholder="Valor"
                            className={fieldClass}
                            value={payAmount}
                            onChange={(e) => setPayAmount(e.target.value)}
                        />
                        <select
                            aria-label="Forma de pagamento"
                            className={fieldClass}
                            value={payMethod}
                            onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                        >
                            <option value="pix">PIX</option>
                            <option value="transfer">Transferência</option>
                            <option value="card">Cartão</option>
                            <option value="money">Dinheiro</option>
                        </select>
                        <input
                            aria-label="Data do pagamento"
                            type="date"
                            className={fieldClass}
                            value={payDate}
                            onChange={(e) => setPayDate(e.target.value)}
                        />
                    </div>
                    <input
                        aria-label="Observação do pagamento"
                        className={fieldClass}
                        placeholder="Observação (opcional)"
                        value={payNote}
                        onChange={(e) => setPayNote(e.target.value)}
                    />
                    <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            try {
                                await registerInvoicePayment({
                                    invoiceId: invoice.id!,
                                    amount: Number(payAmount),
                                    method: payMethod,
                                    paidAt: payDate,
                                    note: payNote || undefined,
                                });
                                onSuccess('Pagamento registrado');
                            } catch (err) {
                                onError(err instanceof Error ? err.message : 'Erro');
                            } finally {
                                setBusy(false);
                            }
                        }}
                        className="w-full min-h-[48px] py-2.5 rounded-2xl text-sm font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 touch-manipulation"
                    >
                        Dar baixa / Quitar
                    </button>
                </div>
            )}

            {payments.length > 0 && (
                <div>
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Baixas
                    </p>
                    <div className="space-y-1.5">
                        {payments.map((p) => (
                            <div
                                key={p.id}
                                className="flex justify-between items-center gap-2 text-sm py-2 px-3 rounded-xl bg-white dark:bg-gray-800"
                            >
                                <span className="text-gray-600 dark:text-gray-300">
                                    {p.paidAt} · {p.method.toUpperCase()} · {money(p.amount)}
                                    {p.note ? ` — ${p.note}` : ''}
                                </span>
                                {invoice.status !== 'cancelled' && (
                                    <button
                                        type="button"
                                        aria-label="Remover baixa"
                                        onClick={async () => {
                                            if (!confirm('Remover este pagamento?')) return;
                                            try {
                                                await deleteInvoicePayment(p.id!);
                                                onSuccess('Pagamento removido');
                                            } catch (err) {
                                                onError(
                                                    err instanceof Error ? err.message : 'Erro'
                                                );
                                            }
                                        }}
                                        className="min-h-[44px] min-w-[44px] text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 touch-manipulation"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {invoice.status !== 'cancelled' && (
                <div className="grid sm:grid-cols-2 gap-2">
                    <div>
                        <label
                            htmlFor={`invoice-nf-number-${invoice.id}`}
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Nº NF
                        </label>
                        <input
                            id={`invoice-nf-number-${invoice.id}`}
                            className={fieldClass}
                            value={nfNumber}
                            onChange={(e) => setNfNumber(e.target.value)}
                            placeholder="Opcional"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={`invoice-nf-note-${invoice.id}`}
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Link / obs. NF
                        </label>
                        <input
                            id={`invoice-nf-note-${invoice.id}`}
                            className={fieldClass}
                            value={nfNote}
                            onChange={(e) => setNfNote(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={async () => {
                            setBusy(true);
                            try {
                                await updateInvoiceNf(invoice.id!, {
                                    number: nfNumber || undefined,
                                    urlOrNote: nfNote || undefined,
                                    issuedAt: nfNumber ? new Date().toISOString() : undefined,
                                    amount: invoice.total,
                                });
                                onSuccess('NF salva');
                            } catch (err) {
                                onError(err instanceof Error ? err.message : 'Erro');
                            } finally {
                                setBusy(false);
                            }
                        }}
                        className="sm:col-span-2 min-h-[44px] px-3 py-2 rounded-2xl text-xs font-bold border border-gray-300 dark:border-gray-600"
                    >
                        Salvar dados da NF
                    </button>
                </div>
            )}

            {(invoice.status === 'draft' ||
                (invoice.status !== 'cancelled' && invoice.amountPaid === 0)) && (
                <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                        if (!confirm('Cancelar esta fatura?')) return;
                        setBusy(true);
                        try {
                            await cancelInvoice(invoice.id!);
                            onSuccess('Fatura cancelada');
                            onClose();
                        } catch (err) {
                            onError(err instanceof Error ? err.message : 'Erro');
                        } finally {
                            setBusy(false);
                        }
                    }}
                    className="text-xs font-bold text-red-600 hover:text-red-700 min-h-[44px]"
                >
                    Cancelar fatura
                </button>
            )}
        </div>
    );
};

export default InvoicePanel;
