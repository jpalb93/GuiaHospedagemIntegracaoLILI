import React from 'react';
import { ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Reservation } from '../../../types';
import { Button } from '../../ui';
import ReservationGridCard from './ReservationGridCard';

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
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onOpenInspection: (res: Reservation) => void;
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
    onOpenInspection,
    onQuickView,
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
                        <div className="p-5 sm:p-7">
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
                                {group.items.map((res) => (
                                    <ReservationGridCard
                                        key={res.id}
                                        reservation={res}
                                        isSelected={res.id ? selectedIds.includes(res.id) : false}
                                        onToggleSelection={onToggleSelection}
                                        onOpenQuickActions={(r) => onQuickView?.(r)}
                                        onOpenPaymentModal={() => onQuickView?.(res)}
                                        onOpenInspection={() => onOpenInspection(res)}
                                    />
                                ))}
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
