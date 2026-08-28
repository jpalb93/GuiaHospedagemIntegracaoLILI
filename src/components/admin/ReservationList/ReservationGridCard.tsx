import React from 'react';
import {
    Calendar,
    Clock,
    Phone,
    Users,
    KeyRound,
    MoreVertical,
    CheckCircle2,
    DollarSign,
    ClipboardCheck,
    Sparkles,
    Shirt,
    LogIn,
    FileText,
    MessageSquare,
    CreditCard,
} from 'lucide-react';
import { Reservation } from '../../../types';
import { formatDateBR } from '../../../utils/helpers';

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

    // Format Brazilian Phone with DDD: (xx) xxxxx-xxxx
    const formatPhoneBR = (phone?: string) => {
        if (!phone) return '';
        let digits = phone.replace(/\D/g, '');
        if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
            digits = digits.slice(2);
        }
        if (digits.length === 11) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
        if (digits.length === 10) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
        }
        if (digits.length > 2) {
            return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        }
        return phone;
    };

    const checkInBR = formatBR(reservation.checkInDate);
    const checkOutBR = formatBR(reservation.checkoutDate);
    const checkInTime = reservation.checkInTime || '14:00';
    const checkOutTime = reservation.checkOutTime || '12:00';

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

    // Status & Day checks
    const todayStr = new Date().toLocaleDateString('en-CA');
    const checkInISO = reservation.checkInDate || '';
    const checkOutISO = reservation.checkoutDate || '';

    const isArrivingToday =
        checkInISO === todayStr && reservation.status !== 'cancelled' && checkOutISO >= todayStr;
    const isLeavingToday = checkOutISO === todayStr && reservation.status !== 'cancelled';

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
    } else if (isArrivingToday) {
        statusPill = {
            label: 'CHEGANDO HOJE',
            bg: 'bg-orange-100 dark:bg-orange-950/80',
            text: 'text-orange-800 dark:text-orange-200 font-extrabold',
            border: 'border-orange-300 dark:border-orange-600/80',
        };
    } else if (isLeavingToday) {
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

    // Laundries Count & Cost
    const laundriesCount = reservation.laundries?.length || 0;
    const laundriesTotal = (reservation.laundries || []).reduce(
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

    // Payment Method Label Helper
    const formatPaymentMethod = (method?: string) => {
        switch (method) {
            case 'pix':
                return 'PIX';
            case 'credit_card':
                return 'Cartão';
            case 'debit_card':
                return 'Débito';
            case 'bank_transfer':
                return 'Transferência';
            case 'cash':
                return 'Dinheiro';
            case 'billed':
                return 'Faturado';
            default:
                return method;
        }
    };

    return (
        <div
            onClick={() => onOpenQuickActions(reservation)}
            className={`group p-6 sm:p-7 rounded-[2.5rem] border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden shadow-sm hover:shadow-xl ${
                isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-lg bg-white dark:bg-gray-800/90'
                    : isArrivingToday
                      ? 'bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40 dark:from-orange-950/30 dark:via-gray-800/95 dark:to-gray-800/90 border-orange-300 dark:border-orange-600/60 ring-2 ring-orange-500/15 shadow-md shadow-orange-500/10 hover:border-orange-500'
                      : 'bg-white dark:bg-gray-800/90 border-gray-200/80 dark:border-gray-700/80 hover:border-amber-500/50 dark:hover:border-amber-500/40'
            }`}
        >
            {/* ARRIVING TODAY TOP ACCENT GLOW STRIP */}
            {isArrivingToday && (
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600" />
            )}

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
                        <div
                            className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg sm:text-xl font-heading shrink-0 shadow-md group-hover:scale-105 transition-transform ${
                                isArrivingToday
                                    ? 'bg-gradient-to-br from-orange-600 to-amber-600 text-white border border-orange-400/50 shadow-orange-500/20'
                                    : 'bg-gradient-to-br from-stone-900 via-gray-800 to-stone-950 text-white border border-stone-700/60'
                            }`}
                        >
                            {initialLetter}
                        </div>

                        {/* Guest / Company & Flat */}
                        <div className="min-w-0 flex-1">
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
                                {laundriesCount > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-heading">
                                        <Shirt size={11} /> +R$ {laundriesTotal.toFixed(0)}
                                    </span>
                                )}
                                {reservation.guestCount && reservation.guestCount > 1 && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50 px-2 py-0.5 rounded-full font-heading">
                                        <Users size={11} /> {reservation.guestCount}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* CODE ON RIGHT + ARRIVING TODAY BADGE */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-xs font-mono font-bold text-gray-400 dark:text-gray-500 px-2.5 py-1 rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200/60 dark:border-gray-700/60">
                            {codeDisplay}
                        </span>
                        {isArrivingToday && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500 text-white font-extrabold text-[10px] tracking-wider uppercase font-heading shadow-sm shadow-orange-500/30 animate-pulse">
                                <LogIn size={10} /> Check-in Hoje
                            </span>
                        )}
                    </div>
                </div>

                {/* STATUS & BADGES ROW (Status, Formatted Phone with DDD, Payment Method, Lock Code) */}
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Status Pill */}
                    <span
                        className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider border font-heading ${statusPill.bg} ${statusPill.text} ${statusPill.border}`}
                    >
                        <span className="w-2 h-2 rounded-full bg-current" />
                        {statusPill.label}
                    </span>

                    {/* Telefone Formatado com DDD: (xx) xxxxx-xxxx */}
                    {reservation.guestPhone && (
                        <a
                            href={`https://wa.me/${reservation.guestPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 font-mono font-bold text-xs transition-colors cursor-pointer"
                            title="Conversar no WhatsApp"
                        >
                            <Phone size={12} className="text-emerald-500" />
                            {formatPhoneBR(reservation.guestPhone)}
                        </a>
                    )}

                    {/* Forma de Pagamento */}
                    {reservation.paymentMethod && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700 font-heading">
                            <CreditCard size={12} className="text-gray-500" />
                            {formatPaymentMethod(reservation.paymentMethod)}
                        </span>
                    )}

                    {/* Senha da Porta / Cofre */}
                    {(reservation.lockCode || reservation.safeCode) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-stone-300 text-xs font-mono font-bold border border-stone-200/70 dark:border-gray-700">
                            <KeyRound size={11} className="text-amber-500" />
                            Senha: {reservation.lockCode || reservation.safeCode}
                        </span>
                    )}
                </div>

                {/* OBSERVAÇÕES INTERNAS & RECADOS DO GUIA */}
                {(reservation.adminNotes || reservation.guestAlertActive) && (
                    <div className="space-y-2 pt-0.5">
                        {/* Observações Internas (Ex: Saíram dia 12/08...) */}
                        {reservation.adminNotes && (
                            <div className="flex items-start gap-2 px-3.5 py-2 rounded-2xl bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-800/60 text-amber-950 dark:text-amber-200 text-xs font-semibold shadow-2xs">
                                <FileText
                                    size={14}
                                    className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5"
                                />
                                <span className="leading-snug break-words">
                                    {reservation.adminNotes}
                                </span>
                            </div>
                        )}

                        {/* Recado Ativo do Hóspede */}
                        {reservation.guestAlertActive && (
                            <div className="flex items-start gap-2 px-3.5 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-xs font-semibold shadow-2xs">
                                <MessageSquare
                                    size={14}
                                    className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
                                />
                                <span className="leading-snug break-words">
                                    <strong className="font-bold font-heading">
                                        Recado do Guia:
                                    </strong>{' '}
                                    {reservation.guestAlertText || 'Recado ativo no guia digital'}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* DATES & TIMES GRID */}
                <div
                    className={`grid grid-cols-2 gap-3.5 p-4 rounded-2xl border text-xs sm:text-sm ${
                        isArrivingToday
                            ? 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-200/70 dark:border-orange-800/40'
                            : 'bg-gray-50 dark:bg-gray-900/60 border-gray-100 dark:border-gray-800'
                    }`}
                >
                    {/* Check-in Date + Time */}
                    <div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                            Check-in
                        </span>
                        <div className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-white font-mono text-sm sm:text-base flex-wrap">
                            <Calendar
                                size={15}
                                className={
                                    isArrivingToday
                                        ? 'text-orange-600 dark:text-orange-400 shrink-0'
                                        : 'text-amber-500 shrink-0'
                                }
                            />
                            <span>{checkInBR}</span>
                            {isArrivingToday && (
                                <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-orange-600 text-white uppercase tracking-wider font-heading">
                                    Hoje
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1 font-mono">
                            <Clock size={12} className="text-gray-400" /> às {checkInTime}
                        </div>
                    </div>

                    {/* Check-out Date + Time */}
                    <div>
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
                            Check-out
                        </span>
                        <div className="flex items-center gap-2 font-extrabold text-gray-900 dark:text-white font-mono text-sm sm:text-base">
                            <Calendar size={15} className="text-amber-500 shrink-0" />
                            {checkOutBR}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-1 font-mono">
                            <Clock size={12} className="text-gray-400" /> até {checkOutTime}
                        </div>
                    </div>
                </div>

                {/* FINANCIAL & PROGRESS BAR */}
                <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-200 font-heading">
                            {isPaid
                                ? `✓ Pago Integral${reservation.paidAt ? ` (${formatDateBR(reservation.paidAt)})` : ''}`
                                : isExternal
                                  ? 'Pago fora do sistema'
                                  : isPartial
                                    ? `Sinal pago: R$ ${depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ ${totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}${reservation.paidAt ? ` (${formatDateBR(reservation.paidAt)})` : ''}`
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
                            className="min-h-[44px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 transition-all shadow-md font-heading flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            <ClipboardCheck size={15} /> Vistoria Pré Check-in
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
                        className="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-gray-200 dark:border-gray-600"
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
