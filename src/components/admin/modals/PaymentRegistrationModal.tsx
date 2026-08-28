import React, { useState, useEffect } from 'react';
import {
    X,
    DollarSign,
    CreditCard,
    Banknote,
    QrCode,
    CheckCircle2,
    Loader2,
    Sparkles,
    Calendar,
    Receipt,
    Pencil,
    Trash2,
    Check,
    Plus,
} from 'lucide-react';
import { Reservation, PaymentStatus, PaymentMethod, PaymentRecord } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { getTodayDateStr } from '../../../utils/dateFormatting';
import { formatDateBR } from '../../../utils/helpers';

interface PaymentRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
    onConfirmPayment: (
        reservationId: string,
        paymentStatus: PaymentStatus,
        depositAmount: number,
        paymentMethod?: PaymentMethod,
        paidAt?: string,
        payments?: PaymentRecord[]
    ) => Promise<void>;
}

export const PaymentRegistrationModal: React.FC<PaymentRegistrationModalProps> = ({
    isOpen,
    onClose,
    reservation,
    onConfirmPayment,
}) => {
    const [mode, setMode] = useState<'full' | 'partial'>('full');
    const [customAmountPaid, setCustomAmountPaid] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
    const [paidAt, setPaidAt] = useState<string>(getTodayDateStr());
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado da lista de pagamentos e edição de transações individuais
    const [paymentsList, setPaymentsList] = useState<PaymentRecord[]>([]);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [editDate, setEditDate] = useState<string>('');
    const [editMethod, setEditMethod] = useState<PaymentMethod>('pix');
    const [editType, setEditType] = useState<string>('deposit');
    const [editAmount, setEditAmount] = useState<string>('');
    const [editNotes, setEditNotes] = useState<string>('');

    // Estado para inclusão manual de novo lançamento na lista
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newDate, setNewDate] = useState<string>(getTodayDateStr());
    const [newMethod, setNewMethod] = useState<PaymentMethod>('pix');
    const [newType, setNewType] = useState<string>('deposit');
    const [newAmount, setNewAmount] = useState<string>('');
    const [newNotes, setNewNotes] = useState<string>('');

    useEffect(() => {
        if (reservation) {
            setMode('full');
            setPaymentMethod(reservation.paymentMethod || 'pix');
            setPaidAt(reservation.paidAt || getTodayDateStr());

            const currentTotal = reservation.totalAmount || 0;
            const currentDeposit = reservation.depositAmount || 0;
            const currentPaid =
                reservation.paymentStatus === 'paid' ? currentTotal : currentDeposit;

            const initialList: PaymentRecord[] =
                reservation.payments && reservation.payments.length > 0
                    ? reservation.payments
                    : currentPaid > 0
                      ? [
                            {
                                id: 'legacy_initial',
                                date:
                                    reservation.paidAt ||
                                    reservation.checkInDate ||
                                    getTodayDateStr(),
                                amount: currentPaid,
                                method: reservation.paymentMethod || 'pix',
                                type: reservation.paymentStatus === 'paid' ? 'full' : 'deposit',
                                notes: reservation.paymentStatus === 'paid' ? 'Quitação' : 'Sinal',
                                createdAt: reservation.createdAt || new Date().toISOString(),
                            },
                        ]
                      : [];

            setPaymentsList(initialList);
            setEditingRecordId(null);
            setIsAddingNew(false);

            const initialRemaining = Math.max(0, currentTotal - currentPaid);
            setCustomAmountPaid(initialRemaining > 0 ? initialRemaining.toString() : '');
            setNewAmount(initialRemaining > 0 ? initialRemaining.toString() : '');
        }
    }, [reservation]);

    if (!isOpen || !reservation) return null;

    const property = PROPERTIES[reservation.propertyId || 'lili'];
    const totalAmount = reservation.totalAmount || 0;

    // Cálculo dinâmico do total pago na lista atual
    const currentPaid = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
    const remainingBalance = Math.max(0, totalAmount - currentPaid);
    const isAlreadyFullyPaid = remainingBalance <= 0.01 && totalAmount > 0;

    // Valores calculados para a nova baixa rápida (caso haja saldo pendente)
    const addedAmount =
        remainingBalance <= 0
            ? 0
            : mode === 'full'
              ? remainingBalance
              : parseFloat(customAmountPaid) || 0;
    const newTotalPaid = currentPaid + addedAmount;
    const newRemaining = Math.max(0, totalAmount - newTotalPaid);
    const isFullyPaid = newRemaining <= 0.01;

    const handleConfirm = async () => {
        if (!reservation.id) return;

        setIsSubmitting(true);
        try {
            const finalPayments = [...paymentsList];

            // Se houver nova baixa rápida a ser adicionada via formulário inferior
            if (remainingBalance > 0 && addedAmount > 0 && !isAddingNew) {
                const newRecord: PaymentRecord = {
                    id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
                    date: paidAt || getTodayDateStr(),
                    amount: addedAmount,
                    method: paymentMethod,
                    type: isFullyPaid ? 'full' : mode === 'partial' ? 'installment' : 'deposit',
                    notes: mode === 'full' ? 'Quitação total' : 'Abatimento parcial',
                    createdAt: new Date().toISOString(),
                };
                finalPayments.push(newRecord);
            }

            const calculatedPaid = finalPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
            const finalRemaining = Math.max(0, totalAmount - calculatedPaid);
            const finalStatus: PaymentStatus =
                finalRemaining <= 0.01 && totalAmount > 0
                    ? 'paid'
                    : calculatedPaid > 0
                      ? 'partial'
                      : 'pending';
            const finalDepositAmount = finalStatus === 'paid' ? totalAmount : calculatedPaid;

            // Determinar data e método mais recentes
            const sortedPayments = [...finalPayments].sort((a, b) => b.date.localeCompare(a.date));
            const effectivePaidAt = sortedPayments[0]?.date || paidAt || getTodayDateStr();
            const effectiveMethod = sortedPayments[0]?.method || paymentMethod;

            await onConfirmPayment(
                reservation.id,
                finalStatus,
                finalDepositAmount,
                effectiveMethod,
                effectivePaidAt,
                finalPayments
            );
            onClose();
        } catch (_error) {
            // Error is logged and toasted by caller
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddNewTransaction = () => {
        const amt = parseFloat(newAmount) || 0;
        if (amt <= 0) return;

        const newRec: PaymentRecord = {
            id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            date: newDate || getTodayDateStr(),
            amount: amt,
            method: newMethod,
            type: newType,
            notes:
                newNotes.trim() ||
                (newType === 'deposit'
                    ? 'Sinal'
                    : newType === 'full'
                      ? 'Quitação'
                      : 'Abatimento parcial'),
            createdAt: new Date().toISOString(),
        };

        const updated = [...paymentsList, newRec];
        setPaymentsList(updated);
        setIsAddingNew(false);
        setNewNotes('');
        const newRem = Math.max(0, totalAmount - updated.reduce((s, p) => s + p.amount, 0));
        setNewAmount(newRem > 0 ? newRem.toString() : '');
        setCustomAmountPaid(newRem > 0 ? newRem.toString() : '');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-gray-800 rounded-[2.2rem] shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden transform transition-all border border-gray-100 dark:border-gray-700 animate-slideUp">
                {/* Header */}
                <div
                    className={`p-5 sm:p-6 border-b border-white/10 ${property.id === 'lili' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white relative shrink-0`}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full transition-colors backdrop-blur-md active:scale-95 touch-manipulation"
                        aria-label="Fechar"
                    >
                        <X size={18} />
                    </button>

                    <div className="flex items-center gap-3 pr-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-inner font-heading shrink-0">
                            <DollarSign size={24} />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                                Gestão Financeira
                            </span>
                            <h2 className="text-xl font-extrabold truncate font-heading mt-0.5">
                                {reservation.guestName}
                            </h2>
                            <p className="text-xs text-white/90 font-medium">
                                {property.name} —{' '}
                                {reservation.flatNumber
                                    ? `Flat ${reservation.flatNumber}`
                                    : 'Unidade'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 overflow-y-auto space-y-5 no-scrollbar">
                    {/* Card de Resumo Financeiro Atual */}
                    <div className="bg-stone-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-stone-200/80 dark:border-gray-600/60 space-y-2">
                        <div className="flex justify-between items-center text-xs text-stone-600 dark:text-gray-300 font-medium">
                            <span>Valor Total da Reserva:</span>
                            <span className="font-bold text-stone-900 dark:text-white">
                                R${' '}
                                {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {currentPaid > 0 && (
                            <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                <span>Total Pago até o momento:</span>
                                <span className="font-bold">
                                    R${' '}
                                    {currentPaid.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-stone-200 dark:border-gray-600/80 flex justify-between items-center text-sm font-extrabold">
                            <span className="text-amber-700 dark:text-amber-400 font-heading">
                                Saldo Restante Atual:
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-heading text-base">
                                R${' '}
                                {remainingBalance.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Histórico / Extrato de Recebimentos com Edição de Datas e Tipos */}
                    <div className="p-3.5 bg-stone-100/90 dark:bg-gray-700/40 rounded-2xl border border-stone-200/90 dark:border-gray-600/70 space-y-2.5">
                        <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-stone-700 dark:text-gray-300 font-heading">
                            <span className="flex items-center gap-1.5">
                                <Receipt size={13} className="text-emerald-500" />
                                Lançamentos Registrados ({paymentsList.length})
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                                    Total: R${' '}
                                    {currentPaid.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                                {!isAddingNew && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddingNew(true);
                                            setEditingRecordId(null);
                                            setNewDate(getTodayDateStr());
                                            setNewAmount(
                                                remainingBalance > 0
                                                    ? remainingBalance.toString()
                                                    : ''
                                            );
                                            setNewType(
                                                paymentsList.length === 0
                                                    ? 'deposit'
                                                    : remainingBalance > 0
                                                      ? 'installment'
                                                      : 'full'
                                            );
                                        }}
                                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer font-heading shadow-2xs"
                                    >
                                        <Plus size={12} /> Adicionar
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Formulário de Adicionar Novo Lançamento */}
                        {isAddingNew && (
                            <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-500 shadow-md space-y-2.5 animate-fadeIn">
                                <div className="flex items-center justify-between text-xs font-extrabold text-emerald-900 dark:text-emerald-300 font-heading">
                                    <span className="flex items-center gap-1.5">
                                        <Plus size={14} /> Novo Lançamento de Pagamento
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setIsAddingNew(false)}
                                        className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase">
                                                Data
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setNewDate(getTodayDateStr())}
                                                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                            >
                                                Hoje
                                            </button>
                                        </div>
                                        <input
                                            type="date"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.target.value)}
                                            className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                            Valor (R$)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={newAmount}
                                            onChange={(e) => setNewAmount(e.target.value)}
                                            placeholder="0,00"
                                            className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                {/* Tipo do Lançamento */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                        Tipo do Pagamento
                                    </label>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {[
                                            { id: 'deposit', label: 'Sinal (Parcial)' },
                                            { id: 'installment', label: 'Abatimento / Parcela' },
                                            { id: 'full', label: 'Quitação Total' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setNewType(t.id)}
                                                className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer font-heading ${
                                                    newType === t.id
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : 'bg-stone-100 dark:bg-gray-700 text-stone-600 dark:text-gray-300 border border-stone-200 dark:border-gray-600'
                                                }`}
                                            >
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Forma de Pagamento */}
                                <div>
                                    <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                        Forma de Pagamento
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {(
                                            ['pix', 'card', 'money', 'transfer'] as PaymentMethod[]
                                        ).map((m) => (
                                            <button
                                                key={m}
                                                type="button"
                                                onClick={() => setNewMethod(m)}
                                                className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer text-center font-heading ${
                                                    newMethod === m
                                                        ? 'bg-teal-600 text-white shadow-xs'
                                                        : 'bg-stone-100 dark:bg-gray-700 text-stone-600 dark:text-gray-300 border border-stone-200 dark:border-gray-600'
                                                }`}
                                            >
                                                {m === 'pix'
                                                    ? 'PIX'
                                                    : m === 'card'
                                                      ? 'Cartão'
                                                      : m === 'money'
                                                        ? 'Dinheiro'
                                                        : 'Transf.'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Observação (opcional, ex: Pago na entrada)"
                                        value={newNotes}
                                        onChange={(e) => setNewNotes(e.target.value)}
                                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddNewTransaction}
                                    disabled={!newAmount || parseFloat(newAmount) <= 0}
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-heading disabled:opacity-50"
                                >
                                    <Check size={14} /> Adicionar ao Extrato
                                </button>
                            </div>
                        )}

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5">
                            {paymentsList.map((p, idx) => {
                                const isEditingThis = editingRecordId === p.id;

                                if (isEditingThis) {
                                    return (
                                        <div
                                            key={p.id || idx}
                                            className="p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-500/60 shadow-md space-y-2.5 animate-fadeIn"
                                        >
                                            <div className="flex items-center justify-between text-xs font-extrabold text-stone-800 dark:text-stone-200 font-heading">
                                                <span>Alterar Data / Dados do Pagamento</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingRecordId(null)}
                                                    className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <label className="text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase">
                                                            Data
                                                        </label>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setEditDate(getTodayDateStr())
                                                            }
                                                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                                        >
                                                            Hoje
                                                        </button>
                                                    </div>
                                                    <input
                                                        type="date"
                                                        value={editDate}
                                                        onChange={(e) =>
                                                            setEditDate(e.target.value)
                                                        }
                                                        className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                                        Valor (R$)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={editAmount}
                                                        onChange={(e) =>
                                                            setEditAmount(e.target.value)
                                                        }
                                                        className="w-full text-xs font-bold p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                                                    />
                                                </div>
                                            </div>

                                            {/* Tipo do Pagamento na Edição */}
                                            <div>
                                                <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                                    Tipo do Pagamento
                                                </label>
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    {[
                                                        { id: 'deposit', label: 'Sinal (Parcial)' },
                                                        {
                                                            id: 'installment',
                                                            label: 'Abatimento / Parcela',
                                                        },
                                                        { id: 'full', label: 'Quitação Total' },
                                                    ].map((t) => (
                                                        <button
                                                            key={t.id}
                                                            type="button"
                                                            onClick={() => setEditType(t.id)}
                                                            className={`py-1.5 px-2 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer font-heading ${
                                                                editType === t.id
                                                                    ? 'bg-emerald-600 text-white shadow-xs'
                                                                    : 'bg-stone-100 dark:bg-gray-700 text-stone-600 dark:text-gray-300 border border-stone-200 dark:border-gray-600'
                                                            }`}
                                                        >
                                                            {t.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Forma de Pagamento na Edição */}
                                            <div>
                                                <label className="block text-[10px] font-extrabold text-stone-500 dark:text-gray-400 uppercase mb-1">
                                                    Forma de Pagamento
                                                </label>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {(
                                                        [
                                                            'pix',
                                                            'card',
                                                            'money',
                                                            'transfer',
                                                        ] as PaymentMethod[]
                                                    ).map((m) => (
                                                        <button
                                                            key={m}
                                                            type="button"
                                                            onClick={() => setEditMethod(m)}
                                                            className={`py-1.5 px-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer text-center font-heading ${
                                                                editMethod === m
                                                                    ? 'bg-teal-600 text-white shadow-xs'
                                                                    : 'bg-stone-100 dark:bg-gray-700 text-stone-600 dark:text-gray-300 border border-stone-200 dark:border-gray-600'
                                                            }`}
                                                        >
                                                            {m === 'pix'
                                                                ? 'PIX'
                                                                : m === 'card'
                                                                  ? 'Cartão'
                                                                  : m === 'money'
                                                                    ? 'Dinheiro'
                                                                    : 'Transf.'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Observação (opcional)"
                                                    value={editNotes}
                                                    onChange={(e) => setEditNotes(e.target.value)}
                                                    className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none"
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = paymentsList.map((item) =>
                                                        item.id === p.id
                                                            ? {
                                                                  ...item,
                                                                  date:
                                                                      editDate || getTodayDateStr(),
                                                                  amount:
                                                                      parseFloat(editAmount) || 0,
                                                                  method: editMethod,
                                                                  type: editType,
                                                                  notes: editNotes,
                                                              }
                                                            : item
                                                    );
                                                    setPaymentsList(updated);
                                                    setEditingRecordId(null);
                                                }}
                                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-heading"
                                            >
                                                <Check size={14} /> Confirmar Alteração
                                            </button>
                                        </div>
                                    );
                                }

                                return (
                                    <div
                                        key={p.id || idx}
                                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-stone-200/70 dark:border-gray-600/50 text-xs shadow-2xs hover:border-stone-300 dark:hover:border-gray-500 transition-all"
                                    >
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="font-mono text-stone-800 dark:text-gray-200 text-xs font-extrabold">
                                                {p.date ? formatDateBR(p.date) : 'Data n/d'}
                                            </span>
                                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-stone-100 dark:bg-gray-700 text-stone-700 dark:text-gray-200 border border-stone-200 dark:border-gray-600 font-heading">
                                                {p.method.toUpperCase()}
                                            </span>
                                            {p.type && (
                                                <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900/60 font-heading">
                                                    {p.type === 'deposit'
                                                        ? 'Sinal'
                                                        : p.type === 'installment'
                                                          ? 'Parcela'
                                                          : p.type === 'full'
                                                            ? 'Quitação'
                                                            : p.type}
                                                </span>
                                            )}
                                            {p.notes && (
                                                <span className="text-[10px] text-stone-400 dark:text-gray-400 truncate max-w-[80px]">
                                                    {p.notes}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                                                + R${' '}
                                                {p.amount.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </strong>
                                            <button
                                                type="button"
                                                title="Alterar data, tipo ou dados deste pagamento"
                                                onClick={() => {
                                                    setEditingRecordId(p.id);
                                                    setIsAddingNew(false);
                                                    setEditDate(p.date || getTodayDateStr());
                                                    setEditMethod(p.method || 'pix');
                                                    setEditType(p.type || 'deposit');
                                                    setEditAmount(p.amount.toString());
                                                    setEditNotes(p.notes || '');
                                                }}
                                                className="p-1.5 text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                type="button"
                                                title="Remover este lançamento"
                                                onClick={() => {
                                                    setPaymentsList((prev) =>
                                                        prev.filter((item) => item.id !== p.id)
                                                    );
                                                }}
                                                className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Se a reserva ainda tem saldo pendente, exibe opções para nova baixa */}
                    {remainingBalance > 0.01 ? (
                        <>
                            {/* Seleção de Tipo de Quitação */}
                            <div>
                                <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-2 font-heading tracking-wider">
                                    Registrar Novo Pagamento / Baixa
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setMode('full')}
                                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between gap-1.5 cursor-pointer ${
                                            mode === 'full'
                                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-xs ring-2 ring-emerald-500/20'
                                                : 'bg-white dark:bg-gray-700/40 border-stone-200 dark:border-gray-600 text-stone-600 dark:text-gray-300 hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-heading">Quitação Total</span>
                                            <CheckCircle2
                                                size={16}
                                                className={
                                                    mode === 'full'
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-stone-300'
                                                }
                                            />
                                        </div>
                                        <span className="text-[11px] opacity-80 font-normal">
                                            Zerar saldo (100% Pago)
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMode('partial')}
                                        className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left flex flex-col justify-between gap-1.5 cursor-pointer ${
                                            mode === 'partial'
                                                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-300 shadow-xs ring-2 ring-amber-500/20'
                                                : 'bg-white dark:bg-gray-700/40 border-stone-200 dark:border-gray-600 text-stone-600 dark:text-gray-300 hover:bg-stone-50'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between w-full">
                                            <span className="font-heading">Abatimento Parcial</span>
                                            <Sparkles
                                                size={16}
                                                className={
                                                    mode === 'partial'
                                                        ? 'text-amber-600 dark:text-amber-400'
                                                        : 'text-stone-300'
                                                }
                                            />
                                        </div>
                                        <span className="text-[11px] opacity-80 font-normal">
                                            Informar valor recebido
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Se for modo Parcial, campo de entrada de valor */}
                            {mode === 'partial' && (
                                <div className="animate-fadeIn">
                                    <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-1.5 font-heading">
                                        Valor Adicional Recebido Agora (R$)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                                            R$
                                        </span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            max={remainingBalance}
                                            value={customAmountPaid}
                                            onChange={(e) => setCustomAmountPaid(e.target.value)}
                                            placeholder="0,00"
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-700 text-stone-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none"
                                        />
                                    </div>
                                    <p className="text-[11px] text-stone-500 dark:text-gray-400 mt-1">
                                        Restará pendente:{' '}
                                        <strong className="text-amber-600 dark:text-amber-400">
                                            R${' '}
                                            {newRemaining.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </strong>
                                    </p>
                                </div>
                            )}

                            {/* Data do Pagamento */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase font-heading tracking-wider flex items-center gap-1.5">
                                        <Calendar size={14} className="text-emerald-500" /> Data
                                        deste Pagamento
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setPaidAt(getTodayDateStr())}
                                        className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                    >
                                        Hoje
                                    </button>
                                </div>
                                <input
                                    type="date"
                                    value={paidAt}
                                    onChange={(e) => setPaidAt(e.target.value)}
                                    className="w-full py-2.5 px-3.5 rounded-xl border border-stone-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-stone-900 dark:text-white font-bold text-sm focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                                />
                            </div>

                            {/* Método de Pagamento */}
                            <div>
                                <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-2 font-heading tracking-wider">
                                    Forma de Pagamento Recebida
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('pix')}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            paymentMethod === 'pix'
                                                ? 'bg-teal-500 text-white border-teal-600 shadow-md shadow-teal-500/20 scale-[1.02]'
                                                : 'bg-white dark:bg-gray-700 text-stone-700 dark:text-gray-200 border-stone-200 dark:border-gray-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        <QrCode size={15} /> PIX
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            paymentMethod === 'card'
                                                ? 'bg-purple-600 text-white border-purple-700 shadow-md shadow-purple-600/20 scale-[1.02]'
                                                : 'bg-white dark:bg-gray-700 text-stone-700 dark:text-gray-200 border-stone-200 dark:border-gray-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        <CreditCard size={15} /> Cartão
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('money')}
                                        className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                            paymentMethod === 'money'
                                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-600/20 scale-[1.02]'
                                                : 'bg-white dark:bg-gray-700 text-stone-700 dark:text-gray-200 border-stone-200 dark:border-gray-600 hover:bg-stone-50'
                                        }`}
                                    >
                                        <Banknote size={15} /> Dinheiro
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl flex items-center gap-3 text-emerald-900 dark:text-emerald-200">
                            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                            <div className="text-xs">
                                <p className="font-extrabold font-heading">
                                    Reserva 100% Paga / Quitada
                                </p>
                                <p className="opacity-90">
                                    Você pode ajustar a data ou detalhes de qualquer pagamento acima
                                    clicando no lápis.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-5 bg-stone-50 dark:bg-gray-800/90 border-t border-stone-200/80 dark:border-gray-700 flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-gray-600 text-stone-700 dark:text-gray-200 font-bold text-xs hover:bg-stone-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Fechar
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={
                            isSubmitting ||
                            (remainingBalance > 0.01 &&
                                addedAmount <= 0 &&
                                paymentsList.length === 0)
                        }
                        className="flex-[2] py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer font-heading"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Salvando...
                            </>
                        ) : isAlreadyFullyPaid ? (
                            <>
                                <CheckCircle2 size={16} /> Salvar Alterações
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={16} /> Confirmar Baixa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentRegistrationModal;
