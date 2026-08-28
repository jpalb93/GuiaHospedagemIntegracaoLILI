import React, { useState } from 'react';
import { DollarSign, Sparkles, Calendar, Receipt, Trash2, Pencil, Check, Plus } from 'lucide-react';
import { PaymentMethod, PaymentStatus, PaymentRecord } from '../../../types';
import { getTodayDateStr } from '../../../utils/dateFormatting';
import { formatDateBR } from '../../../utils/helpers';

interface PaymentSectionProps {
    paymentMethod: PaymentMethod | '';
    setPaymentMethod: (v: PaymentMethod | '') => void;
    paymentStatus: PaymentStatus | '';
    setPaymentStatus: (v: PaymentStatus) => void;
    totalAmount: number | '';
    setTotalAmount: (v: number | '') => void;
    depositAmount: number | '';
    setDepositAmount: (v: number | '') => void;
    paidAt?: string;
    setPaidAt?: (v: string) => void;
    payments?: PaymentRecord[];
    setPayments?: (v: PaymentRecord[]) => void;
    isCorporate?: boolean;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
    paymentMethod,
    setPaymentMethod,
    paymentStatus,
    setPaymentStatus,
    totalAmount,
    setTotalAmount,
    depositAmount,
    setDepositAmount,
    paidAt,
    setPaidAt,
    payments,
    setPayments,
    isCorporate = false,
}) => {
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [editDate, setEditDate] = useState<string>('');
    const [editMethod, setEditMethod] = useState<PaymentMethod>('pix');
    const [editType, setEditType] = useState<string>('deposit');
    const [editAmount, setEditAmount] = useState<string>('');
    const [editNotes, setEditNotes] = useState<string>('');

    // Estado para inclusão manual de novo lançamento
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newDate, setNewDate] = useState<string>(getTodayDateStr());
    const [newMethod, setNewMethod] = useState<PaymentMethod>('pix');
    const [newType, setNewType] = useState<string>('deposit');
    const [newAmount, setNewAmount] = useState<string>('');
    const [newNotes, setNewNotes] = useState<string>('');
    const isExternal = paymentStatus === 'external';
    const numericTotal =
        typeof totalAmount === 'number' ? totalAmount : parseFloat(totalAmount) || 0;
    const numericDeposit =
        typeof depositAmount === 'number' ? depositAmount : parseFloat(depositAmount) || 0;
    const remainingBalance = Math.max(0, numericTotal - numericDeposit);

    const handleSelectStatus = (status: PaymentStatus) => {
        setPaymentStatus(status);
        if (status === 'paid' || status === 'partial') {
            if (!paidAt && setPaidAt) {
                setPaidAt(getTodayDateStr());
            }
        }
        if (status === 'external') {
            setTotalAmount('');
            setDepositAmount('');
            setPaymentMethod('');
            if (setPaidAt) setPaidAt('');
        }
    };

    if (isCorporate) {
        return (
            <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/60 dark:bg-orange-950/20">
                <p className="text-sm font-bold text-orange-900 dark:text-orange-200">
                    Faturado na empresa
                </p>
                <p className="text-xs text-orange-800/80 dark:text-orange-300/80 mt-1 leading-relaxed">
                    O valor desta estadia entra na fatura mensal do contrato. Não registre pagamento
                    avulso aqui — use Empresas → Faturas.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* STATUS DO PAGAMENTO */}
            <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1.5">
                    Status do Pagamento
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                        type="button"
                        onClick={() => handleSelectStatus('paid')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'paid'
                                ? 'bg-green-500 text-white border-green-600 shadow-md scale-[1.02]'
                                : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                        Pago
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('partial')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'partial'
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        Deu Sinal
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('pending')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            paymentStatus === 'pending' || !paymentStatus
                                ? 'bg-red-500 text-white border-red-600 shadow-md scale-[1.02]'
                                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        Falta Pagar
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSelectStatus('external')}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all border ${
                            isExternal
                                ? 'bg-slate-700 text-white border-slate-800 shadow-md scale-[1.02]'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800/40 dark:text-slate-300 dark:border-slate-600'
                        }`}
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                        Pagamento externo
                    </button>
                </div>
            </div>

            {isExternal ? (
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Pagamento fora do caixa (ex.: Airbnb)
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        Não exige valor nem forma de pagamento. A reserva segue normal na operação,
                        mas o valor não aparece na lista nem entra no relatório financeiro.
                    </p>
                </div>
            ) : (
                <>
                    <div
                        className={`grid grid-cols-1 sm:grid-cols-2 ${paymentStatus === 'paid' || paymentStatus === 'partial' ? 'lg:grid-cols-3' : ''} gap-4`}
                    >
                        {/* VALOR DA RESERVA */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Valor Total da Reserva (R$)
                            </label>
                            <div className="relative group">
                                <DollarSign
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 z-10 pointer-events-none"
                                    size={20}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={totalAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setTotalAmount(val === '' ? '' : parseFloat(val));
                                    }}
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500 font-bold text-gray-900 dark:text-gray-100"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>

                        {/* FORMA DE PAGAMENTO */}
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                Forma de Pagamento
                            </label>
                            <div className="relative group">
                                <select
                                    value={paymentMethod}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value as PaymentMethod | '')
                                    }
                                    className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 dark:text-gray-100 cursor-pointer"
                                >
                                    <option value="">Não informado</option>
                                    <option value="pix">PIX</option>
                                    <option value="money">Espécie / Dinheiro</option>
                                    <option value="card">Cartão de Crédito/Débito</option>
                                </select>
                            </div>
                        </div>

                        {/* DATA DO PAGAMENTO / SINAL */}
                        {(paymentStatus === 'paid' || paymentStatus === 'partial') && (
                            <div className="animate-fadeIn">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Calendar size={14} className="text-emerald-500" />
                                        {paymentStatus === 'paid'
                                            ? 'Data do Pagamento'
                                            : 'Data do Sinal / Pagamento'}
                                    </label>
                                    {setPaidAt && (
                                        <button
                                            type="button"
                                            onClick={() => setPaidAt(getTodayDateStr())}
                                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                                        >
                                            Hoje
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={paidAt || ''}
                                        onChange={(e) => setPaidAt?.(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 px-4 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-gray-900 dark:text-gray-100 cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CAMPO DINÂMICO DE SINAL */}
                    {paymentStatus === 'partial' && (
                        <div className="p-4 bg-amber-50/80 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl animate-fadeIn space-y-3">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <label className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles size={14} className="text-amber-500" /> Valor Já Pago
                                    de Sinal (R$)
                                </label>

                                {numericTotal > 0 && (
                                    <span className="text-xs font-extrabold px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-sm">
                                        Resta Pagar: R${' '}
                                        {remainingBalance.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                )}
                            </div>

                            <div className="relative group">
                                <DollarSign
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 z-10 pointer-events-none"
                                    size={20}
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={depositAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setDepositAmount(val === '' ? '' : parseFloat(val));
                                    }}
                                    className="w-full bg-white dark:bg-gray-900 border border-amber-300 dark:border-amber-700 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-amber-500 font-extrabold text-gray-900 dark:text-gray-100 text-sm shadow-sm"
                                    placeholder="Ex: 100,00"
                                />
                            </div>
                        </div>
                    )}

                    {/* HISTÓRICO / EXTRATO DE LANÇAMENTOS DESTA RESERVA */}
                    <div className="p-4 bg-stone-50 dark:bg-gray-900/60 border border-stone-200 dark:border-gray-700/80 rounded-2xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 font-heading">
                            <span className="flex items-center gap-1.5">
                                <Receipt size={14} className="text-emerald-500" /> Extrato de
                                Lançamentos ({payments?.length || 0})
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                                    Total Pago: R${' '}
                                    {(payments || [])
                                        .reduce((sum, p) => sum + (p.amount || 0), 0)
                                        .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                                {setPayments && !isAddingNew && (
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
                                                (payments?.length || 0) === 0
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

                        {/* Formulário de Adicionar Novo Lançamento no Form */}
                        {isAddingNew && setPayments && (
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
                                        placeholder="Observação (opcional)"
                                        value={newNotes}
                                        onChange={(e) => setNewNotes(e.target.value)}
                                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
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
                                        const updated = [...(payments || []), newRec];
                                        setPayments(updated);
                                        const newTotal = updated.reduce((s, p) => s + p.amount, 0);
                                        setDepositAmount(newTotal > 0 ? newTotal : '');
                                        if (numericTotal > 0 && newTotal >= numericTotal) {
                                            setPaymentStatus('paid');
                                        } else if (newTotal > 0) {
                                            setPaymentStatus('partial');
                                        }
                                        setIsAddingNew(false);
                                        setNewNotes('');
                                    }}
                                    disabled={!newAmount || parseFloat(newAmount) <= 0}
                                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer font-heading disabled:opacity-50"
                                >
                                    <Check size={14} /> Adicionar ao Extrato
                                </button>
                            </div>
                        )}

                        {payments && payments.length > 0 && (
                            <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
                                {payments.map((p) => {
                                    const isEditingThis = editingRecordId === p.id;

                                    if (isEditingThis) {
                                        return (
                                            <div
                                                key={p.id}
                                                className="p-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-emerald-500/60 shadow-md space-y-2.5 animate-fadeIn"
                                            >
                                                <div className="flex items-center justify-between text-xs font-extrabold text-stone-800 dark:text-stone-200 font-heading">
                                                    <span>Alterar Data / Dados do Lançamento</span>
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
                                                            {
                                                                id: 'deposit',
                                                                label: 'Sinal (Parcial)',
                                                            },
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
                                                        onChange={(e) =>
                                                            setEditNotes(e.target.value)
                                                        }
                                                        className="w-full text-xs p-2 rounded-lg border border-stone-300 dark:border-gray-600 bg-stone-50 dark:bg-gray-700 text-stone-900 dark:text-white outline-none"
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = payments.map((item) =>
                                                            item.id === p.id
                                                                ? {
                                                                      ...item,
                                                                      date:
                                                                          editDate ||
                                                                          getTodayDateStr(),
                                                                      amount:
                                                                          parseFloat(editAmount) ||
                                                                          0,
                                                                      method: editMethod,
                                                                      type: editType,
                                                                      notes: editNotes,
                                                                  }
                                                                : item
                                                        );
                                                        setPayments?.(updated);
                                                        const newTotal = updated.reduce(
                                                            (sum, item) => sum + item.amount,
                                                            0
                                                        );
                                                        setDepositAmount(
                                                            newTotal > 0 ? newTotal : ''
                                                        );
                                                        if (
                                                            numericTotal > 0 &&
                                                            newTotal >= numericTotal
                                                        ) {
                                                            setPaymentStatus('paid');
                                                        } else if (newTotal > 0) {
                                                            setPaymentStatus('partial');
                                                        } else {
                                                            setPaymentStatus('pending');
                                                        }
                                                        if (setPaidAt && editDate) {
                                                            setPaidAt(editDate);
                                                        }
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
                                            key={p.id}
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-stone-200/80 dark:border-gray-700 text-xs hover:border-stone-300 transition-all"
                                        >
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-mono font-extrabold text-stone-800 dark:text-stone-200 text-xs">
                                                    {p.date ? formatDateBR(p.date) : 'Data n/d'}
                                                </span>
                                                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-stone-100 dark:bg-gray-700 text-stone-700 dark:text-gray-200 border border-stone-200 dark:border-gray-600 font-heading">
                                                    {p.method?.toUpperCase() || 'PIX'}
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
                                                    <span className="text-[10px] text-stone-400 truncate max-w-[80px]">
                                                        {p.notes}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">
                                                    + R${' '}
                                                    {p.amount.toLocaleString('pt-BR', {
                                                        minimumFractionDigits: 2,
                                                    })}
                                                </strong>
                                                <button
                                                    type="button"
                                                    title="Alterar data, tipo ou dados deste lançamento"
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
                                                {setPayments && (
                                                    <button
                                                        type="button"
                                                        title="Remover lançamento"
                                                        onClick={() => {
                                                            const filtered = payments.filter(
                                                                (item) => item.id !== p.id
                                                            );
                                                            setPayments(filtered);
                                                            const newTotal = filtered.reduce(
                                                                (sum, item) => sum + item.amount,
                                                                0
                                                            );
                                                            setDepositAmount(
                                                                newTotal > 0 ? newTotal : ''
                                                            );
                                                            if (
                                                                numericTotal > 0 &&
                                                                newTotal >= numericTotal
                                                            ) {
                                                                setPaymentStatus('paid');
                                                            } else if (newTotal > 0) {
                                                                setPaymentStatus('partial');
                                                            } else {
                                                                setPaymentStatus('pending');
                                                            }
                                                        }}
                                                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentSection;
