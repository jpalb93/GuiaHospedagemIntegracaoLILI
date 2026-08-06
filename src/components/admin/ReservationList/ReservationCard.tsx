import React from 'react';
import {
    CalendarDays,
    StickyNote,
    MessageSquare,
    Pencil,
    Trash2,
    BellRing,
    LogOut,
    ClipboardCheck,
    Check,
    Link as LinkIcon,
    Share2,
    DollarSign,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Badge, Button } from '../../ui';

interface ReservationCardProps {
    reservation: Reservation;
    statusColor: string;
    statusLabel?: string;
    isCheckinTomorrow: boolean;
    isCheckoutTomorrow: boolean;
    isIntegracao: boolean;
    isSelected: boolean;
    isCopied: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onCopyLink: () => void;
    onShareWhatsApp: () => void;
    onSendReminder: (type: 'checkin' | 'checkout') => void;
    onOpenInspection: () => void;
    onToggleSelection: () => void;
    onQuickView?: () => void;
    onOpenPaymentModal?: () => void;
}

const ReservationCard: React.FC<ReservationCardProps> = ({
    reservation: res,
    statusColor,
    statusLabel,
    isCheckinTomorrow,
    isCheckoutTomorrow,
    isSelected,
    isCopied,
    onEdit,
    onDelete,
    onCopyLink,
    onShareWhatsApp,
    onSendReminder,
    onOpenInspection,
    onToggleSelection,
    onQuickView,
    onOpenPaymentModal,
}) => {
    const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];
    const initial = res.guestName ? res.guestName.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white/60 dark:border-gray-700/60 border-l-4 ${statusColor} flex flex-col gap-4 mb-4 transition-all`}
        >
            {/* Header: Avatar + Checkbox + Guest Name + Edit/Delete */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <label className="flex items-center justify-center p-1 cursor-pointer touch-manipulation">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                            checked={isSelected}
                            onChange={(e) => {
                                e.stopPropagation();
                                onToggleSelection();
                            }}
                        />
                    </label>

                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stone-800 to-stone-900 text-amber-400 font-extrabold flex items-center justify-center text-sm shadow-md shrink-0 font-heading">
                        {initial}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-extrabold font-heading text-stone-900 dark:text-white text-base leading-tight truncate">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickView?.();
                                }}
                                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left font-extrabold font-heading cursor-pointer truncate max-w-full block"
                            >
                                {res.guestName}
                            </button>
                        </h3>
                        {res.flatNumber && (
                            <span className="text-[11px] font-bold text-stone-500 dark:text-gray-400 font-heading">
                                Flat {res.flatNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Edit & Delete Action Buttons in Header */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        variant="icon"
                        className="w-10 h-10 p-0 flex items-center justify-center bg-stone-100 dark:bg-gray-700/80 text-stone-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl transition-all shadow-xs active:scale-95 touch-manipulation"
                        title="Editar"
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        variant="icon"
                        className="w-10 h-10 p-0 flex items-center justify-center bg-stone-100 dark:bg-gray-700/80 text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-2xl transition-all shadow-xs active:scale-95 touch-manipulation"
                        title="Excluir"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5 items-center">
                {res.status === 'pending' && (
                    <Badge variant="yellow">Pré-Reserva</Badge>
                )}
                {statusLabel && (
                    <Badge
                        variant={
                            statusLabel === 'Checkout Hoje'
                                ? 'orange'
                                : statusLabel === 'Hospedado'
                                  ? 'green'
                                  : 'gray'
                        }
                    >
                        {statusLabel}
                    </Badge>
                )}
                <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                    {property.name}
                </Badge>

                {/* BADGE DE STATUS DO PAGAMENTO */}
                {res.paymentStatus === 'paid' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
                        🟢 Pago
                    </span>
                )}
                {res.paymentStatus === 'partial' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] leading-tight font-extrabold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300">
                        🟡 Sinal (R$ {(res.depositAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                        {res.totalAmount !== undefined && ` · Resta R$ ${Math.max(0, res.totalAmount - (res.depositAmount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </span>
                )}
                {res.paymentStatus === 'external' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/80 dark:text-slate-300">
                        Externo
                    </span>
                )}
                {(res.paymentStatus === 'pending' || !res.paymentStatus) && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300">
                        🔴 Falta Pagar
                    </span>
                )}
            </div>

            {/* Info Section: Dates, Total Amount, Notes */}
            <div className="bg-stone-50/80 dark:bg-gray-900/50 p-3.5 rounded-2xl border border-stone-200/60 dark:border-gray-700/50 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider">Entrada:</span>
                        <strong className="text-stone-900 dark:text-white font-heading">{res.checkInDate?.split('-').reverse().join('/')}</strong>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-200/40 dark:border-gray-800">
                        <LogOut size={14} className="text-orange-500 shrink-0" />
                        <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider">Saída:</span>
                        <strong className="text-stone-900 dark:text-white font-heading">{res.checkoutDate?.split('-').reverse().join('/')}</strong>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-200/40 dark:border-gray-800">
                    {res.paymentStatus === 'external' ? (
                        <span className="text-xs font-extrabold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            Valor: —
                        </span>
                    ) : (
                        <>
                            <span className="text-xs font-extrabold font-heading text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-300/60 dark:border-emerald-800 flex items-center gap-1">
                                <DollarSign size={14} className="text-emerald-500 shrink-0" />
                                Valor: {res.totalAmount !== undefined && res.totalAmount !== null
                                    ? `R$ ${res.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                    : 'R$ 0,00'}
                            </span>
                            {res.paymentStatus === 'partial' && res.depositAmount !== undefined && (
                                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-300/60 dark:border-amber-800">
                                    Sinal: R$ {res.depositAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {res.adminNotes && (
                    <div className="bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-xs px-3 py-2 rounded-xl flex items-start gap-1.5 font-medium border border-amber-300/80 dark:border-amber-900/50">
                        <StickyNote size={14} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                        <span className="leading-snug break-words">Nota: {res.adminNotes}</span>
                    </div>
                )}
                {res.guestAlertActive && (
                    <div className="bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 font-medium border border-blue-200/60 dark:border-blue-900/40">
                        <MessageSquare size={13} className="shrink-0" /> Recado Ativo
                    </div>
                )}
            </div>

            {/* Mobile Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 dark:border-gray-700/60">
                {onOpenPaymentModal && res.paymentStatus !== 'paid' && res.paymentStatus !== 'external' && (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenPaymentModal();
                        }}
                        fullWidth
                        leftIcon={<DollarSign size={16} />}
                        className="col-span-2 min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-md touch-manipulation"
                    >
                        Dar Baixa no Pagamento
                    </Button>
                )}
                {isCheckinTomorrow && (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendReminder('checkin');
                        }}
                        fullWidth
                        leftIcon={<BellRing size={16} />}
                        className="col-span-2 min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-md touch-manipulation"
                    >
                        Lembrete Chegada
                    </Button>
                )}
                {isCheckoutTomorrow && (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendReminder('checkout');
                        }}
                        fullWidth
                        leftIcon={<LogOut size={16} />}
                        className="col-span-2 min-h-[44px] py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-95 text-white rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-md touch-manipulation"
                    >
                        Instruções de Saída
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenInspection();
                    }}
                    fullWidth
                    leftIcon={<ClipboardCheck size={16} />}
                    className={`col-span-2 min-h-[44px] py-2.5 rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-sm active:scale-95 touch-manipulation transition-all ${
                        res.postCheckOutInspection
                            ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                            : res.preCheckInInspection
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                >
                    {res.postCheckOutInspection
                        ? 'Vistoria (Pós Salva ✓)'
                        : res.preCheckInInspection
                        ? 'Vistoria (Pré Salva ✓)'
                        : 'Vistoria'}
                </Button>

                <Button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCopyLink();
                    }}
                    leftIcon={isCopied ? <Check size={14} /> : <LinkIcon size={14} />}
                    className={`min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 transition-all border active:scale-95 touch-manipulation ${isCopied ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-100 dark:bg-gray-700/70 text-stone-700 dark:text-gray-200 border-stone-200 dark:border-gray-600 hover:bg-stone-200'}`}
                >
                    {isCopied ? 'Copiado!' : 'Copiar Link'}
                </Button>
                <Button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onShareWhatsApp();
                    }}
                    leftIcon={<Share2 size={14} />}
                    className="min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all active:scale-95 touch-manipulation"
                >
                    WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default ReservationCard;
