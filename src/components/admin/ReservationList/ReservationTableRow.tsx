import React from 'react';
import {
    CalendarDays,
    StickyNote,
    Pencil,
    Trash2,
    BellRing,
    LogOut,
    Link as LinkIcon,
    Share2,
    ClipboardCheck,
    DollarSign,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Badge, Button } from '../../ui';

interface ReservationTableRowProps {
    reservation: Reservation;
    statusLabel?: string;
    isCheckinTomorrow: boolean;
    isCheckoutTomorrow: boolean;
    isSelected: boolean;
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

const ReservationTableRow: React.FC<ReservationTableRowProps> = ({
    reservation: res,
    statusLabel,
    isCheckinTomorrow,
    isCheckoutTomorrow,
    isSelected,
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
        <tr className="group hover:bg-gradient-to-r hover:from-orange-50/40 hover:via-white hover:to-orange-50/20 dark:hover:from-gray-800/80 dark:hover:to-gray-800/40 transition-all duration-300 border-b border-stone-200/90 dark:border-gray-700/80 last:border-b-0 divide-x divide-stone-200/60 dark:divide-gray-700/60">
            {/* Checkbox */}
            <td className="py-3 px-2 align-middle w-12 text-center">
                <label className="flex items-center justify-center p-1.5 cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] rounded-xl hover:bg-stone-100 dark:hover:bg-gray-700/60 transition-colors mx-auto">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-stone-300 text-orange-600 focus:ring-orange-500 cursor-pointer shrink-0"
                        checked={isSelected}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelection();
                        }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </label>
            </td>

            {/* Hóspede & Flat + Notas */}
            <td className="py-3 px-3 align-middle">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 text-amber-400 font-extrabold flex items-center justify-center text-sm shadow-md shadow-stone-900/10 shrink-0 font-heading border border-amber-500/20 group-hover:scale-105 group-hover:border-amber-500/40 transition-all">
                        {initial}
                    </div>
                    <div className="flex flex-col items-start min-w-0 flex-1">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuickView?.();
                            }}
                            className="font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left cursor-pointer break-words tracking-tight"
                        >
                            {res.guestName}
                        </button>

                        {/* Flat Badge */}
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-gray-300 border border-stone-200 dark:border-gray-700 shadow-2xs">
                                {res.flatNumber ? `Flat ${res.flatNumber}` : 'Sem nº'}
                            </span>
                        </div>

                        {/* Observações / Avisos (Destaque amplo sem espremer) */}
                        {res.adminNotes && (
                            <div className="mt-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-900/50 px-2.5 py-1 rounded-xl flex items-start gap-1.5 max-w-[340px] shadow-xs">
                                <StickyNote
                                    size={13}
                                    className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                                />
                                <span className="leading-snug break-words">{res.adminNotes}</span>
                            </div>
                        )}
                    </div>
                </div>
            </td>

            {/* Status & Pagamento */}
            <td className="py-3 px-3 align-middle">
                <div className="flex flex-col items-start gap-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                            {property.name}
                        </Badge>
                        {statusLabel && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-300 border border-stone-300/80 dark:border-gray-600 bg-transparent">
                                {statusLabel}
                            </span>
                        )}
                    </div>

                    {/* BADGE DE STATUS DO PAGAMENTO (Cor Sólida do Mapa Oficial) */}
                    {res.paymentStatus === 'paid' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{' '}
                            Pago Integral
                        </span>
                    )}
                    {res.paymentStatus === 'partial' && (
                        <div className="flex flex-col items-start gap-1">
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />{' '}
                                Sinal Pago (R${' '}
                                {(res.depositAmount || 0).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                })}
                                )
                            </span>
                            {res.totalAmount !== undefined && (
                                <span className="text-[11px] font-extrabold text-rose-700 dark:text-rose-400 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 font-mono tabular-nums">
                                    Resta: R${' '}
                                    {Math.max(
                                        0,
                                        res.totalAmount - (res.depositAmount || 0)
                                    ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            )}
                        </div>
                    )}
                    {res.paymentStatus === 'external' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 shadow-2xs">
                            Pagamento Externo
                        </span>
                    )}
                    {(res.billingMode === 'corporate' || res.paymentStatus === 'billed') && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-orange-100 text-orange-800 border border-orange-300 dark:bg-orange-900/50 dark:text-orange-300 shadow-2xs">
                            Corporativo / Faturado
                        </span>
                    )}
                    {(res.paymentStatus === 'pending' || !res.paymentStatus) &&
                        res.billingMode !== 'corporate' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />{' '}
                                Falta Pagar
                            </span>
                        )}
                </div>
            </td>

            {/* Estadia / Datas (Em Português: Entrada e Saída) */}
            <td className="py-3 px-3 align-middle">
                <div className="flex flex-col text-xs font-medium space-y-1 bg-stone-50/90 dark:bg-gray-900/60 p-2.5 rounded-2xl border border-stone-200/70 dark:border-gray-700/60 shadow-2xs group-hover:border-stone-300 dark:group-hover:border-gray-600 transition-all">
                    <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
                        <CalendarDays size={13} className="text-emerald-500 shrink-0" />
                        <span className="text-stone-500 dark:text-stone-400 font-bold text-[11px] uppercase tracking-wide">
                            Entrada:
                        </span>
                        <strong className="text-stone-900 dark:text-stone-100 font-mono text-xs tabular-nums">
                            {res.checkInDate?.split('-').reverse().join('/')}
                        </strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 pt-1 border-t border-stone-200/60 dark:border-gray-800">
                        <LogOut size={13} className="text-orange-500 shrink-0" />
                        <span className="text-stone-500 dark:text-stone-400 font-bold text-[11px] uppercase tracking-wide">
                            Saída:
                        </span>
                        <strong className="text-stone-900 dark:text-stone-100 font-mono text-xs tabular-nums">
                            {res.checkoutDate?.split('-').reverse().join('/')}
                        </strong>
                    </span>
                </div>
            </td>

            {/* Valor Total */}
            <td className="py-3 px-3 align-middle">
                <div className="flex flex-col justify-center">
                    {res.paymentStatus === 'external' ? (
                        <span className="text-xs font-medium italic text-slate-500 dark:text-slate-400">
                            Pago fora do sistema
                        </span>
                    ) : res.billingMode === 'corporate' || res.paymentStatus === 'billed' ? (
                        <span className="text-xs font-medium italic text-orange-600 dark:text-orange-400">
                            Na fatura
                        </span>
                    ) : (
                        <>
                            <span className="font-extrabold font-mono text-stone-900 dark:text-white text-sm sm:text-base tabular-nums flex items-center gap-1">
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold font-sans text-xs">
                                    R$
                                </span>
                                {res.totalAmount !== undefined && res.totalAmount !== null
                                    ? res.totalAmount.toLocaleString('pt-BR', {
                                          minimumFractionDigits: 2,
                                      })
                                    : '0,00'}
                            </span>
                            {res.paymentStatus === 'partial' && res.depositAmount !== undefined && (
                                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold font-mono tabular-nums mt-0.5">
                                    Sinal: R${' '}
                                    {res.depositAmount.toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </td>

            {/* Ações Rápidas */}
            <td className="py-3 px-3 align-middle text-right pr-4 whitespace-nowrap">
                <div className="flex items-center justify-end gap-1 flex-nowrap">
                    {onOpenPaymentModal &&
                        res.paymentStatus !== 'paid' &&
                        res.paymentStatus !== 'external' &&
                        res.paymentStatus !== 'billed' &&
                        res.billingMode !== 'corporate' && (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenPaymentModal();
                                }}
                                variant="icon"
                                className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center gap-1 px-2.5 text-xs font-extrabold font-heading shrink-0"
                                title="Dar baixa no pagamento"
                            >
                                <DollarSign size={14} /> Quitar
                            </Button>
                        )}
                    {isCheckinTomorrow && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendReminder('checkin');
                            }}
                            variant="icon"
                            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
                            title="Enviar lembrete de chegada no WhatsApp"
                        >
                            <BellRing size={16} />
                        </Button>
                    )}
                    {isCheckoutTomorrow && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSendReminder('checkout');
                            }}
                            variant="icon"
                            className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
                            title="Enviar instruções de saída no WhatsApp"
                        >
                            <LogOut size={16} />
                        </Button>
                    )}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenInspection();
                        }}
                        variant="icon"
                        className={`p-2 rounded-xl relative transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md h-9 w-9 flex items-center justify-center shrink-0 ${
                            res.preCheckInInspection || res.postCheckOutInspection
                                ? 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                : 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/60 hover:bg-purple-200 border border-purple-300/80 dark:border-purple-800'
                        }`}
                        title="Abrir vistoria"
                    >
                        <ClipboardCheck size={16} />
                        {(res.preCheckInInspection || res.postCheckOutInspection) && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-gray-900" />
                        )}
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onShareWhatsApp();
                        }}
                        variant="icon"
                        className="p-2 text-emerald-700 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md h-9 w-9 flex items-center justify-center shrink-0"
                        title="Enviar guia no WhatsApp"
                    >
                        <Share2 size={16} />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCopyLink();
                        }}
                        variant="icon"
                        className="p-2 text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md h-9 w-9 flex items-center justify-center shrink-0"
                        title="Copiar link do guia"
                    >
                        <LinkIcon size={16} />
                    </Button>
                    <div className="w-px h-5 bg-stone-200 dark:bg-gray-700 mx-0.5 self-center shrink-0"></div>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        variant="icon"
                        className="p-2 text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md h-9 w-9 flex items-center justify-center shrink-0"
                        title="Editar reserva"
                    >
                        <Pencil size={16} />
                    </Button>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        variant="icon"
                        className="p-2 text-rose-700 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/40 rounded-xl transition-all duration-200 hover:scale-[1.03] active:scale-95 shadow-xs hover:shadow-md h-9 w-9 flex items-center justify-center shrink-0"
                        title="Excluir reserva"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </td>
        </tr>
    );
};

export default ReservationTableRow;
