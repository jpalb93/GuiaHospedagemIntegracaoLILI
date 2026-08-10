import React, { useMemo, useState } from 'react';
import { Reservation } from '../../../types';
import {
    DollarSign,
    ClipboardCheck,
    ArrowRight,
    CheckCircle2,
    Clock,
    AlertCircle,
} from 'lucide-react';
import { formatDateDisplay, getTodayDateStr } from '../../../utils/dateFormatting';

import { isExcludedFromReservationCash } from '../../../utils/reservationFinance';

interface CRMActionsAlertsProps {
    reservations: Reservation[];
    onSelectReservation: (res: Reservation) => void;
    onEditReservation: (res: Reservation) => void;
    onOpenPaymentModal?: (res: Reservation) => void;
}

export interface PendingActionItem {
    id: string;
    type: 'payment' | 'inspection';
    reservation: Reservation;
    guestName: string;
    flatLabel: string;
    timeLabel: string;
    sortTime: string; // ISO ou HH:MM para ordenação do mais próximo
    detail: string;
    remainingAmount?: number;
}

export const CRMActionsAlerts: React.FC<CRMActionsAlertsProps> = ({
    reservations,
    onSelectReservation,
    onEditReservation,
    onOpenPaymentModal,
}) => {
    const [filterType, setFilterType] = useState<'all' | 'payment' | 'inspection'>('all');

    const todayStr = useMemo(() => {
        return getTodayDateStr();
    }, []);

    // Helper para calcular exatamente quanto resta a cobrar da reserva
    const getRemainingAmount = (r: Reservation) => {
        if (isExcludedFromReservationCash(r) || r.paymentStatus === 'paid') {
            return 0;
        }
        const total = r.totalAmount || 0;
        const deposit = r.depositAmount || 0;
        if (r.paymentStatus === 'partial') {
            return Math.max(0, total - deposit);
        }
        return total;
    };

    // Unificação de pendências financeiras e operacionais do dia
    const pendingActions = useMemo(() => {
        const items: PendingActionItem[] = [];

        reservations.forEach((r) => {
            const checkIn = r.checkInDate || '';
            const checkOut = r.checkoutDate || '';
            const isCheckInToday = checkIn === todayStr;

            // 1. Cobrança pendente para reservas ativas ou com entrada hoje
            if (checkOut >= todayStr) {
                const remaining = getRemainingAmount(r);
                if (remaining > 1) {
                    const timeStr = r.checkInTime || '15:00';
                    items.push({
                        id: `pay-${r.id}`,
                        type: 'payment',
                        reservation: r,
                        guestName: r.guestName,
                        flatLabel:
                            (r.propertyId || 'lili') === 'lili'
                                ? 'Flat da Lili'
                                : `Flat ${r.flatNumber || 'N/A'}`,
                        timeLabel: isCheckInToday
                            ? `Entrada hoje às ${timeStr}`
                            : `Entrada: ${formatDateDisplay(checkIn)}`,
                        sortTime: `${checkIn}T${timeStr}`,
                        detail: `Saldo a cobrar: R$ ${remaining.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        remainingAmount: remaining,
                    });
                }
            }

            // 2. Vistoria pré check-in de hoje sem vistoria realizada
            if (isCheckInToday && !r.preCheckInInspection) {
                const timeStr = r.checkInTime || '15:00';
                items.push({
                    id: `insp-${r.id}`,
                    type: 'inspection',
                    reservation: r,
                    guestName: r.guestName,
                    flatLabel:
                        (r.propertyId || 'lili') === 'lili'
                            ? 'Flat da Lili'
                            : `Flat ${r.flatNumber || 'N/A'}`,
                    timeLabel: `Check-in hoje às ${timeStr}`,
                    sortTime: `${checkIn}T${timeStr}`,
                    detail: 'Vistoria de entrada pendente de realização',
                });
            }
        });

        // Ordena por horário de entrada/saída (mais próximo primeiro)
        items.sort((a, b) => a.sortTime.localeCompare(b.sortTime));

        return items;
    }, [reservations, todayStr]);

    const filteredItems = useMemo(() => {
        if (filterType === 'all') return pendingActions;
        return pendingActions.filter((i) => i.type === filterType);
    }, [pendingActions, filterType]);

    const paymentCount = pendingActions.filter((i) => i.type === 'payment').length;
    const inspectionCount = pendingActions.filter((i) => i.type === 'inspection').length;

    return (
        <div
            id="acoes-pendentes-hoje"
            className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none"
        >
            {/* HEADER DO BLOCO UNIFICADO */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 shadow-sm">
                        <AlertCircle size={22} />
                    </div>
                    <div>
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading flex items-center gap-2">
                            Ações Pendentes Hoje
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Pendências financeiras e operacionais ordenadas por urgência
                        </p>
                    </div>
                </div>

                {/* FILTROS E CONTADORES */}
                <div className="flex items-center gap-2 flex-wrap text-xs font-extrabold">
                    <button
                        type="button"
                        onClick={() => setFilterType('all')}
                        className={`px-3.5 py-1.5 rounded-full transition-all active:scale-95 ${
                            filterType === 'all'
                                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200'
                        }`}
                    >
                        Todas ({pendingActions.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterType('payment')}
                        className={`px-3.5 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1.5 ${
                            filterType === 'payment'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        }`}
                    >
                        <DollarSign size={14} /> Cobranças ({paymentCount})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterType('inspection')}
                        className={`px-3.5 py-1.5 rounded-full transition-all active:scale-95 flex items-center gap-1.5 ${
                            filterType === 'inspection'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                        }`}
                    >
                        <ClipboardCheck size={14} /> Vistorias ({inspectionCount})
                    </button>
                </div>
            </div>

            {/* LISTA DE PENDÊNCIAS UNIFICADA */}
            {filteredItems.length === 0 ? (
                <div className="text-center py-10 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-[2rem] border-2 border-dashed border-emerald-200/60 dark:border-emerald-900/30">
                    <CheckCircle2 size={36} className="mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200 font-heading">
                        Nenhuma ação pendente no momento!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Todas as cobranças e vistorias programadas estão em dia.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {filteredItems.map((item) => {
                        const isPayment = item.type === 'payment';
                        return (
                            <div
                                key={item.id}
                                onClick={() => onSelectReservation(item.reservation)}
                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group ${
                                    isPayment
                                        ? 'bg-gradient-to-r from-white via-emerald-50/30 to-white dark:from-gray-900/80 dark:via-emerald-950/20 dark:to-gray-900/80 border-emerald-200/80 dark:border-emerald-800/40 hover:border-emerald-400'
                                        : 'bg-gradient-to-r from-white via-purple-50/30 to-white dark:from-gray-900/80 dark:via-purple-950/20 dark:to-gray-900/80 border-purple-200/80 dark:border-purple-800/40 hover:border-purple-400'
                                }`}
                            >
                                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                    {/* ÍCONE DE TIPO */}
                                    <div
                                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm mt-0.5 sm:mt-0 ${
                                            isPayment
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                        }`}
                                    >
                                        {isPayment ? (
                                            <DollarSign size={20} />
                                        ) : (
                                            <ClipboardCheck size={20} />
                                        )}
                                    </div>

                                    {/* DETALHES DA RESERVA (HIERARQUIA VERTICAL: BADGE -> NOME + FLAT -> HORÁRIO -> DETALHE) */}
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div>
                                            <span
                                                className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block ${
                                                    isPayment
                                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
                                                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                                                }`}
                                            >
                                                {isPayment ? 'Cobrança' : 'Vistoria'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white font-heading leading-snug">
                                                {item.guestName}
                                            </h4>
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                                • {item.flatLabel}
                                            </span>
                                        </div>

                                        <div className="space-y-0.5 text-xs font-medium">
                                            <p className="flex items-center gap-1 text-gray-500">
                                                <Clock size={12} className="shrink-0" />{' '}
                                                {item.timeLabel}
                                            </p>
                                            <p
                                                className={`font-extrabold break-words ${
                                                    isPayment
                                                        ? 'text-emerald-600 dark:text-emerald-400'
                                                        : 'text-purple-700 dark:text-purple-300'
                                                }`}
                                            >
                                                {item.detail}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BOTÕES DE AÇÃO (LARGURA TOTAL NO MOBILE, ROXO PARA VISTORIA) */}
                                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-gray-800">
                                    {isPayment ? (
                                        onOpenPaymentModal && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onOpenPaymentModal(item.reservation);
                                                }}
                                                className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer font-heading touch-manipulation"
                                            >
                                                <DollarSign size={15} /> Dar Baixa
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditReservation(item.reservation);
                                            }}
                                            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] sm:min-h-0 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-sm shadow-purple-600/20 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer font-heading touch-manipulation"
                                        >
                                            <ClipboardCheck size={15} /> Realizar Vistoria
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditReservation(item.reservation);
                                        }}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
                                        title="Ver detalhes da reserva"
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CRMActionsAlerts;
