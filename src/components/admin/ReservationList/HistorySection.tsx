import React from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Reservation } from '../../../types';
import { Button } from '../../ui';
import ReservationCard from './ReservationCard';
import ReservationTableRow from './ReservationTableRow';

interface HistoryGroup {
    label: string;
    items: Reservation[];
}

interface HistorySectionProps {
    historyList: Reservation[];
    groupedHistory: HistoryGroup[];
    openHistoryGroups: number[];
    toggleHistoryGroup: (index: number) => void;
    hasMoreHistory: boolean;
    loadingHistory: boolean;
    loadMoreHistory: () => void;
    tomorrowStr: string;
    selectedIds: string[];
    listCopiedId: string | null;
    onToggleSelection: (id: string) => void;
    onEdit: (res: Reservation) => void;
    onDelete: (id: string) => void;
    onCopyLink: (res: Reservation) => void;
    onShareWhatsApp: (res: Reservation) => void;
    onSendReminder: (res: Reservation, type: 'checkin' | 'checkout') => void;
    onOpenInspection: (res: Reservation) => void;
    onQuickView?: (res: Reservation) => void;
    onOpenCleaning?: (res: Reservation) => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
    historyList,
    groupedHistory,
    openHistoryGroups,
    toggleHistoryGroup,
    hasMoreHistory,
    loadingHistory,
    loadMoreHistory,
    tomorrowStr,
    selectedIds,
    listCopiedId,
    onToggleSelection,
    onEdit,
    onDelete,
    onCopyLink,
    onShareWhatsApp,
    onSendReminder,
    onOpenInspection,
    onQuickView,
    onOpenCleaning,
}) => {
    if (historyList.length === 0) return null;

    return (
        <div className="mt-12 animate-fadeIn">
            <h3 className="text-xs font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-4 ml-1">
                Histórico Recente de Reservas
            </h3>
            {groupedHistory.map((group, index) => (
                <div
                    key={index}
                    className="mb-4 bg-white/80 dark:bg-gray-800/70 border border-white/60 dark:border-gray-700/60 rounded-[2rem] overflow-hidden backdrop-blur-xl shadow-lg shadow-stone-200/20 dark:shadow-none transition-all"
                >
                    <button
                        type="button"
                        onClick={() => toggleHistoryGroup(index)}
                        className="w-full flex items-center justify-between p-5 bg-stone-50/80 dark:bg-gray-900/60 hover:bg-stone-100 dark:hover:bg-gray-800/80 transition-colors"
                    >
                        <span className="font-extrabold font-heading text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                            {group.label}
                        </span>
                        <span className="p-1 rounded-xl bg-stone-200/60 dark:bg-gray-800 text-stone-600 dark:text-stone-300">
                            {openHistoryGroups.includes(index) ? (
                                <ChevronUp size={18} />
                            ) : (
                                <ChevronDown size={18} />
                            )}
                        </span>
                    </button>
                    {openHistoryGroups.includes(index) && (
                        <div className="p-3 md:p-5">
                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {group.items.map((res) => (
                                    <ReservationCard
                                        key={res.id}
                                        reservation={res}
                                        statusColor="border-stone-300"
                                        statusLabel="Histórico"
                                        isCheckinTomorrow={res.checkInDate === tomorrowStr}
                                        isCheckoutTomorrow={res.checkoutDate === tomorrowStr}
                                        isIntegracao={res.propertyId === 'integracao'}
                                        isSelected={res.id ? selectedIds.includes(res.id) : false}
                                        isCopied={listCopiedId === res.id}
                                        onEdit={() => onEdit(res)}
                                        onDelete={() => res.id && onDelete(res.id)}
                                        onCopyLink={() => onCopyLink(res)}
                                        onShareWhatsApp={() => onShareWhatsApp(res)}
                                        onSendReminder={(type) => onSendReminder(res, type)}
                                        onOpenInspection={() => onOpenInspection(res)}
                                        onToggleSelection={() =>
                                            res.id && onToggleSelection(res.id)
                                        }
                                        onQuickView={() => onQuickView?.(res)}
                                        onOpenCleaning={() => onOpenCleaning?.(res)}
                                    />
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-hidden rounded-[1.5rem] border border-stone-200/60 dark:border-gray-700/60">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full min-w-[900px] text-left bg-white dark:bg-gray-900 border-collapse">
                                        <tbody className="divide-y divide-stone-100 dark:divide-gray-800">
                                            {group.items.map((res) => (
                                                <ReservationTableRow
                                                    key={res.id}
                                                    reservation={res}
                                                    statusLabel="Histórico"
                                                    isCheckinTomorrow={
                                                        res.checkInDate === tomorrowStr
                                                    }
                                                    isCheckoutTomorrow={
                                                        res.checkoutDate === tomorrowStr
                                                    }
                                                    isSelected={
                                                        res.id
                                                            ? selectedIds.includes(res.id)
                                                            : false
                                                    }
                                                    onEdit={() => onEdit(res)}
                                                    onDelete={() => res.id && onDelete(res.id)}
                                                    onCopyLink={() => onCopyLink(res)}
                                                    onShareWhatsApp={() => onShareWhatsApp(res)}
                                                    onSendReminder={(type) =>
                                                        onSendReminder(res, type)
                                                    }
                                                    onOpenInspection={() => onOpenInspection(res)}
                                                    onToggleSelection={() =>
                                                        res.id && onToggleSelection(res.id)
                                                    }
                                                    onQuickView={() => onQuickView?.(res)}
                                                    onOpenCleaning={() => onOpenCleaning?.(res)}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
