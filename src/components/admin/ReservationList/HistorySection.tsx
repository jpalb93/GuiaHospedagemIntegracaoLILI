import React from 'react';
import { ArrowUpRight, CalendarDays, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Reservation } from '../../../types';
import { Button } from '../../ui';
import { formatDateBR } from '../../../utils/helpers';

interface HistoryGroup {
    key: string;
    label: string;
    items: Reservation[];
}

interface HistorySectionProps {
    historyList: Reservation[];
    groupedHistory: HistoryGroup[];
    openHistoryGroups: string[];
    toggleHistoryGroup: (key: string) => void;
    hasMoreHistory: boolean;
    loadingHistory: boolean;
    loadMoreHistory: () => void;
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onQuickView?: (res: Reservation) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
    historyList,
    groupedHistory,
    openHistoryGroups,
    toggleHistoryGroup,
    hasMoreHistory,
    loadingHistory,
    loadMoreHistory,
    selectedIds,
    onToggleSelection,
    onQuickView,
}) => {
    if (historyList.length === 0) return null;

    return (
        <div className="mt-12 animate-fadeIn">
            <h3 className="text-xs font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-4 ml-1">
                Histórico Recente de Reservas
            </h3>
            {groupedHistory.map((group) => (
                <div
                    key={group.key}
                    className="mb-4 bg-white/80 dark:bg-gray-800/70 border border-white/60 dark:border-gray-700/60 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-lg shadow-stone-200/20 dark:shadow-none transition-all"
                >
                    <button
                        type="button"
                        onClick={() => toggleHistoryGroup(group.key)}
                        className="w-full flex items-center justify-between p-5 bg-stone-50/80 dark:bg-gray-900/60 hover:bg-stone-100 dark:hover:bg-gray-800/80 transition-colors"
                    >
                        <span className="font-extrabold font-heading text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                            {group.label}
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                                {group.items.length} carregadas
                            </span>
                        </span>
                        <span className="p-1 rounded-xl bg-stone-200/60 dark:bg-gray-800 text-stone-600 dark:text-stone-300">
                            {openHistoryGroups.includes(group.key) ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </span>
                    </button>
                    {openHistoryGroups.includes(group.key) && (
                        <div className="grid gap-3 p-4 sm:p-5 xl:grid-cols-2">
                            {group.items.map((res) => (
                                <div
                                    key={res.id}
                                    className={`group relative min-w-0 rounded-2xl border p-4 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none sm:p-5 ${res.id && selectedIds.includes(res.id) ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500/20 dark:bg-amber-950/20' : 'border-stone-200/80 bg-white hover:border-amber-300 dark:border-gray-700 dark:bg-gray-800/80 dark:hover:border-amber-600/60'}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            aria-label={`Selecionar reserva de ${res.guestName}`}
                                            checked={res.id ? selectedIds.includes(res.id) : false}
                                            onChange={() => res.id && onToggleSelection(res.id)}
                                            className="mt-1 h-4 w-4 shrink-0 accent-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500"
                                        />
                                        <span
                                            aria-hidden="true"
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-stone-700/20 bg-stone-900 font-heading text-sm font-bold text-amber-300 shadow-sm dark:border-amber-500/20 dark:bg-gray-950"
                                        >
                                            {(res.guestName || '?').trim().charAt(0).toUpperCase()}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p
                                                        className="truncate font-heading text-sm font-extrabold text-stone-900 dark:text-white"
                                                        title={res.guestName}
                                                    >
                                                        {res.guestName}
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-stone-600 dark:text-stone-300">
                                                        {(res.propertyId || 'lili') === 'lili'
                                                            ? 'Flat da Lili'
                                                            : `Flat ${res.flatNumber || '—'}`}
                                                        {res.shortId ? ` · #${res.shortId}` : ''}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${res.paymentStatus === 'paid' ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/70 dark:bg-emerald-900/30 dark:text-emerald-200' : res.paymentStatus === 'partial' || res.paymentStatus === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/70 dark:bg-amber-900/30 dark:text-amber-200' : 'border-stone-200 bg-stone-50 text-stone-700 dark:border-gray-600 dark:bg-gray-700/60 dark:text-stone-200'}`}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className="h-1.5 w-1.5 rounded-full bg-current"
                                                    />
                                                    {res.paymentStatus === 'paid'
                                                        ? 'Pago'
                                                        : res.paymentStatus === 'partial'
                                                          ? 'Parcial'
                                                          : res.paymentStatus === 'pending'
                                                            ? 'Pendente'
                                                            : res.paymentStatus === 'billed'
                                                              ? 'Faturado'
                                                              : res.paymentStatus === 'external'
                                                                ? 'Externo'
                                                                : 'Não informado'}
                                                </span>
                                            </div>
                                            <p className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-stone-100/80 px-2 py-1 text-xs font-medium text-stone-700 dark:bg-gray-900/60 dark:text-stone-200">
                                                <CalendarDays
                                                    size={14}
                                                    className="shrink-0 text-amber-600 dark:text-amber-400"
                                                    aria-hidden="true"
                                                />
                                                <span>
                                                    {formatDateBR(res.checkInDate || '')} →{' '}
                                                    {formatDateBR(res.checkoutDate || '')}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-200/80 pt-3 dark:border-gray-700">
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                                                Valor total
                                            </p>
                                            <p className="truncate font-heading text-base font-extrabold tabular-nums text-stone-900 dark:text-white">
                                                {res.totalAmount != null
                                                    ? res.totalAmount.toLocaleString('pt-BR', {
                                                          style: 'currency',
                                                          currency: 'BRL',
                                                      })
                                                    : 'Não informado'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onQuickView?.(res)}
                                            className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-xl border border-amber-200/80 bg-amber-50/70 px-3 text-xs font-bold text-amber-900 transition-colors hover:border-amber-400 hover:bg-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-900/40"
                                            aria-label={`Ver detalhes da reserva de ${res.guestName}`}
                                        >
                                            Detalhes <ArrowUpRight size={15} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {hasMoreHistory && (
                <Button
                    onClick={loadMoreHistory}
                    disabled={loadingHistory}
                    variant="ghost"
                    fullWidth
                    className="py-4 text-xs font-extrabold font-heading text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-gray-800 rounded-2xl transition-all active:scale-95"
                >
                    {loadingHistory ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : (
                        'Carregar Mais Antigos'
                    )}
                </Button>
            )}
        </div>
    );
};

export default HistorySection;
