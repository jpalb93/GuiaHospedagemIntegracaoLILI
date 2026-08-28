import React, { useState } from 'react';
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
    Sparkles,
    ChevronDown,
    ChevronUp,
    Zap,
} from 'lucide-react';
import { Reservation, PropertyId } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Badge, Button } from '../../ui';
import { formatDateBR } from '../../../utils/helpers';

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
    onOpenCleaning?: () => void;
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
    onOpenCleaning,
}) => {
    const [isActionsExpanded, setIsActionsExpanded] = useState(false);
    const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];
    const initial = res.guestName ? res.guestName.charAt(0).toUpperCase() : '?';

    const hasInspections = Boolean(res.preCheckInInspection || res.postCheckOutInspection);
    const cleaningsCount = res.cleanings?.length || 0;
    const cleaningsTotalCost = res.cleanings?.reduce((sum, c) => sum + (c.cost || 0), 0) || 0;

    return (
        <React.Fragment>
            <tr
                className={`group transition-all duration-300 border-b divide-x divide-stone-200/60 dark:divide-gray-700/60 ${
                    isActionsExpanded
                        ? 'bg-orange-50/50 dark:bg-gray-800/90 border-orange-200 dark:border-gray-700'
                        : 'hover:bg-gradient-to-r hover:from-orange-50/40 hover:via-white hover:to-orange-50/20 dark:hover:from-gray-800/80 dark:hover:to-gray-800/40 border-stone-200/90 dark:border-gray-700/80 last:border-b-0'
                }`}
            >
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

                            {/* Flat Badge & Additional Cleanings Badge */}
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-gray-800 text-stone-700 dark:text-gray-300 border border-stone-200 dark:border-gray-700 shadow-2xs">
                                    {res.flatNumber ? `Flat ${res.flatNumber}` : 'Sem nº'}
                                </span>
                                {cleaningsCount > 0 && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenCleaning?.();
                                        }}
                                        className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-900/50 cursor-pointer hover:bg-amber-200 transition-colors flex items-center gap-1"
                                        title="Ver limpezas adicionais (Custos Adicionais)"
                                    >
                                        <Sparkles size={11} className="text-amber-500" />
                                        Custos Adic: R${' '}
                                        {cleaningsTotalCost.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}{' '}
                                        ({cleaningsCount})
                                    </span>
                                )}
                            </div>

                            {/* Observações / Avisos */}
                            {res.adminNotes && (
                                <div className="mt-1.5 text-xs font-semibold text-amber-900 dark:text-amber-300 bg-amber-100/90 dark:bg-amber-950/70 border border-amber-300/80 dark:border-amber-900/50 px-2.5 py-1 rounded-xl flex items-start gap-1.5 max-w-[340px] shadow-xs">
                                    <StickyNote
                                        size={13}
                                        className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                                    />
                                    <span className="leading-snug break-words">
                                        {res.adminNotes}
                                    </span>
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

                        {/* BADGE DE STATUS DO PAGAMENTO */}
                        {res.paymentStatus === 'paid' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 shadow-2xs">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{' '}
                                Pago Integral
                                {res.paidAt && (
                                    <span className="opacity-80 font-mono font-normal ml-0.5">
                                        ({formatDateBR(res.paidAt)})
                                    </span>
                                )}
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
                                    {res.paidAt && (
                                        <span className="opacity-80 font-mono font-normal">
                                            · {formatDateBR(res.paidAt)}
                                        </span>
                                    )}
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

                {/* Estadia / Datas */}
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
                                {res.paymentStatus === 'partial' &&
                                    res.depositAmount !== undefined && (
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

                {/* Ações Rápidas (EXPANDABLE TOGGLE BUTTON) */}
                <td className="py-3 px-3 align-middle text-right pr-4 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                        {/* QUITAR RÁPIDO (Se falta pagar) */}
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

                        {/* EXPAND ACTIONS BUTTON */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsActionsExpanded(!isActionsExpanded);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold font-heading tracking-wide transition-all duration-200 flex items-center gap-1.5 relative shadow-xs active:scale-95 ${
                                isActionsExpanded
                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/30'
                                    : 'bg-stone-100 hover:bg-stone-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-gray-700'
                            }`}
                        >
                            <Zap
                                size={14}
                                className={isActionsExpanded ? 'text-white' : 'text-orange-500'}
                            />
                            <span>{isActionsExpanded ? 'Fechar Ações' : 'Ações'}</span>
                            {isActionsExpanded ? (
                                <ChevronUp size={15} />
                            ) : (
                                <ChevronDown size={15} />
                            )}

                            {/* Badge Indicator for Inspections / Cleanings */}
                            {!isActionsExpanded && (hasInspections || cleaningsCount > 0) && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white dark:border-gray-900"></span>
                                </span>
                            )}
                        </button>
                    </div>
                </td>
            </tr>

            {/* EXPANDED ACTIONS DRAWER ROW */}
            {isActionsExpanded && (
                <tr className="bg-stone-50/90 dark:bg-gray-900/90 border-b border-stone-200 dark:border-gray-700/80 animate-fadeIn">
                    <td colSpan={6} className="p-4 sm:p-5">
                        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-2xl border border-stone-200/80 dark:border-gray-700/80 shadow-lg shadow-stone-200/30 dark:shadow-none space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-100 dark:border-gray-700/60 pb-2">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} className="text-orange-500" />
                                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-900 dark:text-white font-heading">
                                        Painel de Ações Rápidas — {res.guestName}
                                    </h4>
                                </div>
                                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">
                                    {res.flatNumber ? `Flat ${res.flatNumber}` : 'Sem unidade'}
                                </span>
                            </div>

                            {/* ACTIONS GRID (4 CATEGORIES / GROUPS) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                                {/* 1. VISTORIA */}
                                <div className="bg-stone-50 dark:bg-gray-900/50 p-3 rounded-xl border border-stone-200/60 dark:border-gray-700/60 flex flex-col justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-500 dark:text-gray-400 tracking-wider mb-1">
                                            Controle de Inventário
                                        </p>
                                        <p className="text-xs font-bold text-stone-900 dark:text-white">
                                            {res.postCheckOutInspection
                                                ? 'Vistoria Pós Salva ✓'
                                                : res.preCheckInInspection
                                                  ? 'Vistoria Pré Salva ✓'
                                                  : 'Vistoria Pendente'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenInspection();
                                        }}
                                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-2 shadow-xs transition-all ${
                                            hasInspections
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                                        }`}
                                    >
                                        <ClipboardCheck size={15} />
                                        {hasInspections ? 'Abrir Vistoria' : 'Iniciar Vistoria'}
                                    </Button>
                                </div>

                                {/* 2. LIMPEZAS ADICIONAIS */}
                                <div className="bg-stone-50 dark:bg-gray-900/50 p-3 rounded-xl border border-stone-200/60 dark:border-gray-700/60 flex flex-col justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-500 dark:text-gray-400 tracking-wider mb-1">
                                            Custos Adicionais
                                        </p>
                                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 font-mono">
                                            {cleaningsCount > 0
                                                ? `${cleaningsCount} limpeza(s) — R$ ${cleaningsTotalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                                : 'Nenhuma limpeza registrada'}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onOpenCleaning?.();
                                        }}
                                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-2 shadow-xs transition-all ${
                                            cleaningsCount > 0
                                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                                        }`}
                                    >
                                        <Sparkles size={15} />
                                        {cleaningsCount > 0
                                            ? 'Gerenciar Limpezas'
                                            : 'Adicionar Limpeza'}
                                    </Button>
                                </div>

                                {/* 3. COMUNICAÇÃO & GUIA */}
                                <div className="bg-stone-50 dark:bg-gray-900/50 p-3 rounded-xl border border-stone-200/60 dark:border-gray-700/60 flex flex-col justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-500 dark:text-gray-400 tracking-wider mb-1">
                                            Comunicação WhatsApp & Guia
                                        </p>
                                        <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 truncate">
                                            {res.guestPhone || 'Sem telefone'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onShareWhatsApp();
                                            }}
                                            className="flex-1 py-2 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-1.5 shadow-xs"
                                            title="Enviar guia no WhatsApp"
                                        >
                                            <Share2 size={14} /> WhatsApp
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCopyLink();
                                            }}
                                            className="py-2 px-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-1"
                                            title="Copiar link"
                                        >
                                            <LinkIcon size={14} /> Link
                                        </Button>
                                    </div>
                                    {isCheckinTomorrow && (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSendReminder('checkin');
                                            }}
                                            className="w-full py-1.5 px-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
                                        >
                                            <BellRing size={13} /> Lembrete de Chegada
                                        </Button>
                                    )}
                                    {isCheckoutTomorrow && (
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSendReminder('checkout');
                                            }}
                                            className="w-full py-1.5 px-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
                                        >
                                            <LogOut size={13} /> Instruções de Saída
                                        </Button>
                                    )}
                                </div>

                                {/* 4. GERENCIAMENTO DA RESERVA */}
                                <div className="bg-stone-50 dark:bg-gray-900/50 p-3 rounded-xl border border-stone-200/60 dark:border-gray-700/60 flex flex-col justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-stone-500 dark:text-gray-400 tracking-wider mb-1">
                                            Edição & Exclusão
                                        </p>
                                        <p className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                                            Controle da Reserva
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit();
                                            }}
                                            className="flex-1 py-2 px-2.5 bg-stone-200 dark:bg-gray-700 hover:bg-stone-300 dark:hover:bg-gray-600 text-stone-800 dark:text-white rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-1.5"
                                        >
                                            <Pencil size={14} /> Editar
                                        </Button>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete();
                                            }}
                                            className="py-2 px-2.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-xl text-xs font-bold font-heading flex items-center justify-center gap-1"
                                            title="Excluir reserva"
                                        >
                                            <Trash2 size={14} /> Excluir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};

export default ReservationTableRow;
