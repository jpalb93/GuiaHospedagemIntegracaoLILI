import React, { useState } from 'react';
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
    MoreVertical,
    Sparkles,
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
    onOpenCleaning?: () => void;
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
    onOpenCleaning,
}) => {
    const [showMenu, setShowMenu] = useState(false);
    const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];
    const initial = res.guestName ? res.guestName.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-5 rounded-[2rem] shadow-xl shadow-gray-200/40 dark:shadow-none border border-white/60 dark:border-gray-700/60 border-l-4 ${statusColor} flex flex-col gap-4 mb-4 transition-all relative`}
        >
            {/* Header: Avatar + Checkbox + Guest Name + Edit & Overflow Menu */}
            <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <label className="flex items-center justify-center p-1 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] shrink-0">
                        <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer shrink-0"
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
                        <h3 className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug break-words tracking-tight">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickView?.();
                                }}
                                className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left font-semibold cursor-pointer break-words max-w-full block"
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

                {/* Edit & Overflow Action Menu in Header (Icon-only on mobile to maximize title space) */}
                <div className="flex items-center gap-1.5 shrink-0 relative">
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        variant="icon"
                        className="min-w-[44px] min-h-[44px] p-2.5 sm:px-3 flex items-center justify-center gap-1.5 bg-stone-100 dark:bg-gray-700/80 text-stone-600 dark:text-stone-300 hover:text-blue-600 rounded-2xl transition-all shadow-xs active:scale-95 touch-manipulation font-extrabold text-xs"
                        title="Editar reserva"
                    >
                        <Pencil size={15} />
                        <span className="hidden sm:inline font-heading">Editar</span>
                    </Button>

                    <div className="relative">
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu((prev) => !prev);
                            }}
                            variant="icon"
                            className="min-w-[44px] min-h-[44px] p-0 flex items-center justify-center bg-stone-100 dark:bg-gray-700/80 text-stone-500 hover:text-rose-600 rounded-2xl transition-all shadow-xs active:scale-95 touch-manipulation"
                            title="Mais opções"
                        >
                            <MoreVertical size={18} />
                        </Button>
                        {showMenu && (
                            <div className="absolute right-0 top-12 z-30 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-stone-200 dark:border-gray-700 p-1.5 min-w-[150px] animate-fadeIn">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenu(false);
                                        onDelete();
                                    }}
                                    className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors text-left font-heading"
                                >
                                    <Trash2 size={15} /> Excluir Reserva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap gap-1.5 items-center">
                {res.status === 'pending' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/30">
                        Pré-Reserva
                    </span>
                )}
                {statusLabel && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-gray-600 bg-transparent">
                        {statusLabel}
                    </span>
                )}
                <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>{property.name}</Badge>

                {/* BADGE DE STATUS DO PAGAMENTO (Cor Sólida do Mapa Oficial) */}
                {res.paymentStatus === 'paid' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Pago Integral
                    </span>
                )}
                {res.paymentStatus === 'partial' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] leading-tight font-extrabold bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Sinal Pago (R${' '}
                        {(res.depositAmount || 0).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                        })}
                        )
                        {res.totalAmount !== undefined &&
                            ` · Resta R$ ${Math.max(0, res.totalAmount - (res.depositAmount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </span>
                )}
                {res.paymentStatus === 'external' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/80 dark:text-slate-300">
                        Pagamento Externo
                    </span>
                )}
                {(res.billingMode === 'corporate' || res.paymentStatus === 'billed') && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-900/50 dark:text-orange-300">
                        Corporativo / Faturado
                    </span>
                )}
                {(res.paymentStatus === 'pending' || !res.paymentStatus) &&
                    res.billingMode !== 'corporate' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 dark:bg-rose-950/60 dark:text-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />{' '}
                            Falta Pagar
                        </span>
                    )}
            </div>

            {/* Info Section: Dates, Total Amount, Notes */}
            <div className="bg-stone-50/80 dark:bg-gray-900/50 p-3.5 rounded-2xl border border-stone-200/60 dark:border-gray-700/50 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
                    <div className="flex items-center gap-2">
                        <CalendarDays size={14} className="text-emerald-500 shrink-0" />
                        <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider">
                            Entrada:
                        </span>
                        <strong className="text-stone-900 dark:text-white font-heading">
                            {res.checkInDate?.split('-').reverse().join('/')}
                        </strong>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-200/40 dark:border-gray-800">
                        <LogOut size={14} className="text-orange-500 shrink-0" />
                        <span className="text-stone-400 font-extrabold text-[10px] uppercase tracking-wider">
                            Saída:
                        </span>
                        <strong className="text-stone-900 dark:text-white font-heading">
                            {res.checkoutDate?.split('-').reverse().join('/')}
                        </strong>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-stone-200/40 dark:border-gray-800">
                    {res.paymentStatus === 'external' ? (
                        <span className="text-xs font-medium italic text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
                            Pago fora do sistema
                        </span>
                    ) : res.billingMode === 'corporate' || res.paymentStatus === 'billed' ? (
                        <span className="text-xs font-medium italic text-orange-700 dark:text-orange-300 bg-orange-100/80 dark:bg-orange-900/40 px-2.5 py-1 rounded-xl border border-orange-200 dark:border-orange-800">
                            Valor na fatura da empresa
                        </span>
                    ) : (
                        <>
                            <span className="text-xs font-extrabold font-heading text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-300/60 dark:border-emerald-800 flex items-center gap-1">
                                <DollarSign size={14} className="text-emerald-500 shrink-0" />
                                Valor:{' '}
                                {res.totalAmount !== undefined && res.totalAmount !== null
                                    ? `R$ ${res.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                    : 'R$ 0,00'}
                            </span>
                            {res.paymentStatus === 'partial' && res.depositAmount !== undefined && (
                                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-300/60 dark:border-amber-800">
                                    Sinal: R${' '}
                                    {res.depositAmount.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            )}
                        </>
                    )}
                </div>

                {res.adminNotes && (
                    <div className="bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 text-xs px-3 py-2 rounded-xl flex items-start gap-1.5 font-medium border border-amber-300/80 dark:border-amber-900/50">
                        <StickyNote
                            size={14}
                            className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                        />
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
                {onOpenPaymentModal &&
                    res.paymentStatus !== 'paid' &&
                    res.paymentStatus !== 'external' &&
                    res.paymentStatus !== 'billed' &&
                    res.billingMode !== 'corporate' && (
                        <Button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenPaymentModal();
                            }}
                            fullWidth
                            leftIcon={<DollarSign size={16} />}
                            className="col-span-2 min-h-[44px] py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-md touch-manipulation"
                            title="Dar baixa no pagamento"
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
                        title="Enviar lembrete de chegada no WhatsApp"
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
                        title="Enviar instruções de saída no WhatsApp"
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
                    title="Abrir vistoria"
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
                        onOpenCleaning?.();
                    }}
                    fullWidth
                    leftIcon={<Sparkles size={16} />}
                    className={`col-span-2 min-h-[44px] py-2.5 rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 shadow-sm active:scale-95 touch-manipulation transition-all ${
                        res.cleanings && res.cleanings.length > 0
                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                    }`}
                    title="Limpezas adicionais (Custos Adicionais)"
                >
                    {res.cleanings && res.cleanings.length > 0
                        ? `Limpezas (R$ ${res.cleanings.reduce((sum, c) => sum + (c.cost || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})`
                        : 'Limpeza Adicional'}
                </Button>

                <Button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onCopyLink();
                    }}
                    leftIcon={isCopied ? <Check size={14} /> : <LinkIcon size={14} />}
                    className={`min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-extrabold font-heading flex items-center justify-center gap-2 transition-all border active:scale-95 touch-manipulation ${isCopied ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-stone-100 dark:bg-gray-700/70 text-stone-700 dark:text-gray-200 border-stone-200 dark:border-gray-600 hover:bg-stone-200'}`}
                    title="Copiar link do guia"
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
                    title="Enviar guia no WhatsApp"
                >
                    WhatsApp
                </Button>
            </div>
        </div>
    );
};

export default ReservationCard;
