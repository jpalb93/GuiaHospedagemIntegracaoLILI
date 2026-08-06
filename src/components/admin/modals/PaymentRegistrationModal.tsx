import React, { useState, useEffect } from 'react';
import { X, DollarSign, CreditCard, Banknote, QrCode, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Reservation, PaymentStatus } from '../../../types';
import { PROPERTIES } from '../../../config/properties';

interface PaymentRegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation: Reservation | null;
    onConfirmPayment: (
        reservationId: string,
        paymentStatus: PaymentStatus,
        depositAmount: number,
        paymentMethod?: 'pix' | 'money' | 'card'
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
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'money' | 'card'>('pix');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (reservation) {
            setMode('full');
            setPaymentMethod(reservation.paymentMethod || 'pix');
            const total = reservation.totalAmount || 0;
            const currentDeposit = reservation.depositAmount || 0;
            const remaining = Math.max(0, total - currentDeposit);
            setCustomAmountPaid(remaining > 0 ? remaining.toString() : '');
        }
    }, [reservation]);

    if (!isOpen || !reservation) return null;

    const property = PROPERTIES[reservation.propertyId || 'lili'];
    const totalAmount = reservation.totalAmount || 0;
    const currentPaid = reservation.paymentStatus === 'paid' ? totalAmount : (reservation.depositAmount || 0);
    const initialRemaining = Math.max(0, totalAmount - currentPaid);

    // Cálculos dinâmicos
    const addedAmount = mode === 'full' ? initialRemaining : (parseFloat(customAmountPaid) || 0);
    const newTotalPaid = currentPaid + addedAmount;
    const newRemaining = Math.max(0, totalAmount - newTotalPaid);
    const isFullyPaid = newRemaining <= 0.01;

    const handleConfirm = async () => {
        if (!reservation.id) return;

        setIsSubmitting(true);
        try {
            const finalStatus: PaymentStatus = isFullyPaid ? 'paid' : (newTotalPaid > 0 ? 'partial' : 'pending');
            const finalDepositAmount = isFullyPaid ? totalAmount : newTotalPaid;

            await onConfirmPayment(
                reservation.id,
                finalStatus,
                finalDepositAmount,
                paymentMethod
            );
            onClose();
        } catch (_error) {
            // Error is logged and toasted by caller
        } finally {
            setIsSubmitting(false);
        }
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
                
                {/* Header Header */}
                <div className={`p-5 sm:p-6 border-b border-white/10 ${property.id === 'lili' ? 'bg-gradient-to-r from-orange-500 to-amber-600' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white relative shrink-0`}>
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
                                Quitação de Pagamento
                            </span>
                            <h2 className="text-xl font-extrabold truncate font-heading mt-0.5">
                                {reservation.guestName}
                            </h2>
                            <p className="text-xs text-white/90 font-medium">
                                {property.name} — {reservation.flatNumber ? `Flat ${reservation.flatNumber}` : 'Unidade'}
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
                                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {currentPaid > 0 && (
                            <div className="flex justify-between items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                <span>Já Pago Anteriormente:</span>
                                <span className="font-bold">
                                    R$ {currentPaid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-stone-200 dark:border-gray-600/80 flex justify-between items-center text-sm font-extrabold">
                            <span className="text-amber-700 dark:text-amber-400 font-heading">
                                Saldo Restante Atual:
                            </span>
                            <span className="text-amber-600 dark:text-amber-400 font-heading text-base">
                                R$ {initialRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Seleção de Tipo de Quitação */}
                    <div>
                        <label className="block text-xs font-extrabold text-stone-700 dark:text-gray-300 uppercase mb-2 font-heading tracking-wider">
                            Como deseja registrar?
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
                                    <CheckCircle2 size={16} className={mode === 'full' ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300'} />
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
                                    <Sparkles size={16} className={mode === 'partial' ? 'text-amber-600 dark:text-amber-400' : 'text-stone-300'} />
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
                                    max={initialRemaining}
                                    value={customAmountPaid}
                                    onChange={(e) => setCustomAmountPaid(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-700 text-stone-900 dark:text-white font-bold text-base focus:ring-2 focus:ring-amber-500 outline-none"
                                />
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-gray-400 mt-1">
                                Restará pendente:{' '}
                                <strong className="text-amber-600 dark:text-amber-400">
                                    R$ {newRemaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </strong>
                            </p>
                        </div>
                    )}

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
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-5 bg-stone-50 dark:bg-gray-800/90 border-t border-stone-200/80 dark:border-gray-700 flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-gray-600 text-stone-700 dark:text-gray-200 font-bold text-xs hover:bg-stone-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isSubmitting || addedAmount <= 0}
                        className="flex-[2] py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer font-heading"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" /> Registrando...
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
