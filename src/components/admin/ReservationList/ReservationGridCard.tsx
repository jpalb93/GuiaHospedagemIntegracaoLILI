import React from 'react';
import {
    Calendar,
    MoreVertical,
    CheckCircle2,
    DollarSign,
    ClipboardCheck,
    Sparkles,
} from 'lucide-react';
import { Reservation } from '../../../types';

interface ReservationGridCardProps {
    reservation: Reservation;
    isSelected?: boolean;
    onToggleSelection?: (id: string) => void;
    onOpenQuickActions: (res: Reservation) => void;
    onOpenPaymentModal: (res: Reservation) => void;
    onOpenInspection: (res: Reservation) => void;
}

export const ReservationGridCard: React.FC<ReservationGridCardProps> = ({
    reservation,
    isSelected = false,
    onToggleSelection,
    onOpenQuickActions,
    onOpenPaymentModal,
    onOpenInspection,
}) => {
    const isLili = (reservation.propertyId || 'lili') === 'lili';
    const flatLabel = isLili
        ? 'Flat de Lili'
        : reservation.flatNumber
          ? `Flat ${reservation.flatNumber}`
          : 'Flat';

    // Format Dates (BR format)
    const formatBR = (dateStr?: string) => {
        if (!dateStr) return '—';
        const parts = dateStr.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateStr;
    };

    const checkInBR = formatBR(reservation.checkInDate);
    const checkOutBR = formatBR(reservation.checkoutDate);

    // Financial calculations
    const totalAmount = reservation.totalAmount || 0;
    const depositAmount = reservation.depositAmount || 0;
    const isPaid = reservation.paymentStatus === 'paid';
    const isPending = reservation.paymentStatus === 'pending';
    const isPartial = reservation.paymentStatus === 'partial' || (depositAmount > 0 && !isPaid);
    const isExternal = reservation.paymentStatus === 'external';

    const percentPaid = isPaid
        ? 100
        : totalAmount > 0
          ? Math.min(100, Math.round((depositAmount / totalAmount) * 100))
          : 0;

    // Status Pill calculation
    const todayStr = new Date().toLocaleDateString('en-CA');
    const checkInISO = reservation.checkInDate || '';
    const checkOutISO = reservation.checkoutDate || '';

    let statusPill = {
        label: 'AGUARDANDO CHECK-IN',
        bg: 'bg-blue-50 dark:bg-blue-950/60',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800/40',
    };

    if (reservation.status === 'cancelled') {
        statusPill = {
            label: 'CANCELADA',
            bg: 'bg-red-50 dark:bg-red-950/60',
            text: 'text-red-700 dark:text-red-300',
            border: 'border-red-200 dark:border-red-800/40',
        };
    } else if (checkOutISO < todayStr) {
        statusPill = {
            label: 'FINALIZADA',
            bg: 'bg-gray-100 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-300',
            border: 'border-gray-200 dark:border-gray-700',
        };
    } else if (checkOutISO === todayStr) {
        statusPill = {
            label: 'SAÍDA HOJE',
            bg: 'bg-amber-50 dark:bg-amber-950/60',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-200 dark:border-amber-800/40',
        };
    } else if (checkInISO <= todayStr && checkOutISO >= todayStr) {
        statusPill = {
            label: 'HOSPEDADO',
            bg: 'bg-emerald-50 dark:bg-emerald-950/60',
            text: 'text-emerald-700 dark:text-emerald-300',
            border: 'border-emerald-200 dark:border-emerald-800/40',
        };
    } else if (isPending) {
        statusPill = {
            label: 'FALTA PAGAR',
            bg: 'bg-rose-50 dark:bg-rose-950/60',
            text: 'text-rose-700 dark:text-rose-300',
            border: 'border-rose-200 dark:border-rose-800/40',
        };
    } else if (isExternal) {
        statusPill = {
            label: 'PAGAMENTO EXTERNO',
            bg: 'bg-indigo-50 dark:bg-indigo-950/60',
            text: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-200 dark:border-indigo-800/40',
        };
    }

    // Inspection Status
    const hasPreInspection = Boolean(reservation.preCheckInInspection);

    // Cleanings Count & Cost
    const cleaningsCount = reservation.cleanings?.length || 0;
    const cleaningsTotal = (reservation.cleanings || []).reduce(
        (sum, item) => sum + (item.cost || 0),
        0
    );

    // Initial avatar letter
    const initialLetter = (reservation.guestName || '?').trim().charAt(0).toUpperCase();

    // Code
    const codeDisplay = reservation.shortId
        ? `#${reservation.shortId}`
        : reservation.id
          ? `#R-${reservation.id.slice(0, 6)}`
          : '';

    return (
        <div
            onClick={() => onOpenQuickActions(reservation)}
            className={`group p-6 sm:p-7 bg-white dark:bg-gray-800/90 rounded-[2.5rem] border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden shadow-sm hover:shadow-xl ${
                isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg'
                    : 'border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/50 dark:hover:border-amber-500/40'
            }`}
        >
            {/* TOP BAR: AVATAR, GUEST INFO, FLAT BADGE, CODE */}
            <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                        {/* Checkbox for bulk actions if needed */}
                        {onToggleSelection && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    if (reservation.id) onToggleSelection(reservation.id);
                                }}
                                className="w-5 h-5 rounded-lg text-amber-500 focus:ring-amber-400 border-gray-300 dark:border-gray-600 shrink-0 cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}

                        {/* Avatar */}
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-stone-900 via-gray-800 to-stone-950 text-white flex items-center justify-center font-extrabold text-lg sm:text-xl font-heading shrink-0 shadow-md border border-stone-700/60 group-hover:scale-105 transition-transform">
                            {initialLetter}
                        </div>

                        {/* Guest / Company & Flat */}
                        <div className="min-w-0">
                            <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white font-heading truncate leading-snug">
                                {reservation.guestName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 font-heading">
                                    {flatLabel}
                                </span>
                                {cleaningsCount > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-heading">
                                        <Sparkles size={11} /> +R$ {cleaningsTotal.toFixed(0)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CODE ON RIGHT */}
                    <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                            {codeDisplay}
                        </span>
                    </div>
                </div>

                {/* STATUS PILL */}
                <div>
                    <span
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider border font-heading ${statusPill.bg} ${statusPill.text} ${statusPill.border}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {statusPill.label}
                    </span>
                </div>

                {/* DATES GRID */}
                <div className="grid grid-cols-2 gap-3.5 p-4 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-800 text-xs sm:text-sm">
                    <div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                            Check-in
                        </span>
                        <div className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-white font-mono text-sm sm:text-base">
                            <Calendar size={15} className="text-amber-500 shrink-0" />
                            {checkInBR}
                        </div>
                    </div>
                    <div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                            Check-out
                        </span>
                        <div className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-white font-mono text-sm sm:text-base">
                            <Calendar size={15} className="text-amber-500 shrink-0" />
                            {checkOutBR}
                        </div>
                    </div>
                </div>

                {/* FINANCIAL & PROGRESS BAR */}
                <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 font-heading">
                            {isPaid
                                ? '✓ Pago Integral'
                                : isExternal
                                  ? 'Pago fora do sistema'
                                  : isPartial
                                    ? `Sinal pago: R$ ${depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                    : 'Aguardando Pagamento'}
                        </span>
                        <span className="font-mono text-xs sm:text-sm font-extrabold text-gray-600 dark:text-gray-300">
                            {percentPaid}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${
                                isPaid
                                    ? 'bg-emerald-500'
                                    : percentPaid > 0
                                      ? 'bg-amber-500'
                                      : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                            style={{ width: `${percentPaid}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* CARD BOTTOM: TOTAL, PRIMARY CTA, 3-DOTS BUTTON */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
                {/* Total */}
                <div>
                    <span className="text-[10px] sm:text-[11px] uppercase font-extrabold text-gray-400 tracking-wider block mb-0.5">
                        Valor Total
                    </span>
                    <span className="text-lg sm:text-2xl font-extrabold font-mono text-gray-900 dark:text-white">
                        R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5">
                    {/* Contextual Primary Button */}
                    {!isPaid && !isExternal ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenPaymentModal(reservation);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all shadow-md font-heading flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <DollarSign size={15} /> Registrar Pagamento
                        </button>
                    ) : !hasPreInspection && checkOutISO >= todayStr ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenInspection(reservation);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md font-heading flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <ClipboardCheck size={15} /> Iniciar Vistoria
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenQuickActions(reservation);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 transition-all font-heading flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <CheckCircle2 size={15} /> Ver Detalhes
                        </button>
                    )}

                    {/* 3-dots Menu Button */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickActions(reservation);
                        }}
                        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                        title="Mais opções e ações"
                        aria-label="Abrir ações rápidas"
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationGridCard;
