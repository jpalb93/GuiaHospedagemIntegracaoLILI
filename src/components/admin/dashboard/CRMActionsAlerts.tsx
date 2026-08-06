import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { DollarSign, ClipboardCheck, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { formatDateDisplay } from '../../../utils/dateFormatting';

interface CRMActionsAlertsProps {
    reservations: Reservation[];
    onSelectReservation: (res: Reservation) => void;
    onEditReservation: (res: Reservation) => void;
    onOpenPaymentModal?: (res: Reservation) => void;
}

export const CRMActionsAlerts: React.FC<CRMActionsAlertsProps> = ({
    reservations,
    onSelectReservation,
    onEditReservation,
    onOpenPaymentModal,
}) => {
    const todayStr = useMemo(() => {
        const today = new Date();
        const offset = today.getTimezoneOffset() * 60000;
        const localDate = new Date(today.getTime() - offset);
        return localDate.toISOString().split('T')[0];
    }, []);

    // Helper para calcular exatamente quanto resta a cobrar da reserva
    const getRemainingAmount = (r: Reservation) => {
        // Reservas pagas (100%) ou externas não possuem saldo a cobrar
        if (r.paymentStatus === 'paid' || r.paymentStatus === 'external' || r.isExternal === true) {
            return 0;
        }

        const total = r.totalAmount || 0;
        const deposit = r.depositAmount || 0;

        // Se deu sinal parcial, resta: total - deposit
        if (r.paymentStatus === 'partial') {
            return Math.max(0, total - deposit);
        }

        // Se está como pending (ou sem status), resta 100% do valor total
        return total;
    };

    // 1. Reservas com Saldo Restante a Cobrar (Ativas e Próximas Chegadas)
    const pendingPayments = useMemo(() => {
        return reservations
            .filter((r) => {
                const checkOut = r.checkoutDate || '';
                // Não exibe reservas cujo check-out já passou
                if (checkOut < todayStr) return false;

                const remaining = getRemainingAmount(r);
                return remaining > 1; // Saldo pendente maior que R$ 1.00
            })
            .sort((a, b) => (a.checkInDate || '').localeCompare(b.checkInDate || ''));
    }, [reservations, todayStr]);

    // 2. Check-ins de hoje sem vistoria pré salva
    const pendingInspections = useMemo(() => {
        return reservations.filter((r) => {
            const checkIn = r.checkInDate || '';
            if (checkIn !== todayStr) return false;
            return !r.preCheckInInspection;
        });
    }, [reservations, todayStr]);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* PENDÊNCIAS FINANCEIRAS A COBRAR */}
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-heading">
                            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
                                <DollarSign size={18} />
                            </div>
                            Cobrança no Check-in (Saldo Restante)
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                            {pendingPayments.length} pendente{pendingPayments.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {pendingPayments.length === 0 ? (
                        <div className="text-center py-8 bg-amber-50/30 dark:bg-amber-950/10 rounded-2xl border border-dashed border-amber-200/60 dark:border-amber-900/30">
                            <CheckCircle2 size={28} className="mx-auto text-amber-500 mb-2" />
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                Nenhum saldo pendente a cobrar!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                            {pendingPayments.map((res) => {
                                const remaining = getRemainingAmount(res);
                                const isToday = res.checkInDate === todayStr;
                                return (
                                    <div
                                        key={res.id}
                                        onClick={() => onSelectReservation(res)}
                                        className="flex items-center justify-between p-3.5 bg-gray-50/80 dark:bg-gray-700/40 rounded-2xl border border-gray-100 dark:border-gray-700/70 hover:border-amber-300 dark:hover:border-amber-800/60 transition-all cursor-pointer group"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p className="font-bold text-xs text-gray-900 dark:text-white font-heading">
                                                    {res.guestName}
                                                </p>
                                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                                    {(res.propertyId || 'lili') === 'lili'
                                                        ? 'Lili'
                                                        : `Flat ${res.flatNumber || 'N/A'}`}
                                                </span>
                                                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                                                    isToday
                                                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300'
                                                        : 'bg-stone-100 dark:bg-gray-800 text-stone-600 dark:text-gray-400 border-stone-200 dark:border-gray-700'
                                                }`}>
                                                    {isToday ? 'Hoje' : `Entrada: ${formatDateDisplay(res.checkInDate)}`}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-extrabold mt-1">
                                                Resta cobrar: R$ {remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {onOpenPaymentModal && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onOpenPaymentModal(res);
                                                    }}
                                                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer font-heading"
                                                >
                                                    <DollarSign size={14} /> Dar Baixa
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditReservation(res);
                                                }}
                                                className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                                                title="Editar reserva completa"
                                            >
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ALERTAS DE VISTORIA PRÉ CHECK-IN */}
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-2 font-heading">
                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                                <ClipboardCheck size={18} />
                            </div>
                            Vistorias Pré Check-in de Hoje
                        </h3>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                            {pendingInspections.length} sem vistoria
                        </span>
                    </div>

                    {pendingInspections.length === 0 ? (
                        <div className="text-center py-8 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl border border-dashed border-blue-200/60 dark:border-blue-900/30">
                            <CheckCircle2 size={28} className="mx-auto text-blue-500 mb-2" />
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-300">
                                Todas as vistorias de hoje estão em dia!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                            {pendingInspections.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => onSelectReservation(res)}
                                    className="flex items-center justify-between p-3.5 bg-gray-50/80 dark:bg-gray-700/40 rounded-2xl border border-gray-100 dark:border-gray-700/70 hover:border-blue-300 dark:hover:border-blue-800/60 transition-all cursor-pointer group"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-xs text-gray-900 dark:text-white font-heading">
                                                {res.guestName}
                                            </p>
                                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                                {(res.propertyId || 'lili') === 'lili'
                                                    ? 'Lili'
                                                    : `Flat ${res.flatNumber || 'N/A'}`}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-extrabold mt-1 flex items-center gap-1">
                                            <ShieldAlert size={12} />
                                            Vistoria de entrada pendente
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditReservation(res);
                                        }}
                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                    >
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CRMActionsAlerts;
