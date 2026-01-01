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
}) => {
    if (historyList.length === 0) return null;

    return (
        <div className="mt-12">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 ml-1">
                Histórico Recente
            </h3>
            {groupedHistory.map((group, index) => (
                <div
                    key={index}
                    className="mb-4 bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/30 rounded-3xl overflow-hidden backdrop-blur-sm"
                >
                    <button
                        onClick={() => toggleHistoryGroup(index)}
                        className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
                            {group.label}
                        </span>
                        {openHistoryGroups.includes(index) ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>
                    {openHistoryGroups.includes(index) && (
                        <div className="p-2 md:p-4">
                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {group.items.map((res) => (
                                    <ReservationCard
                                        key={res.id}
                                        reservation={res}
                                        statusColor="border-gray-300"
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
                                    />
                                ))}
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
                                <table className="w-full text-left bg-white dark:bg-gray-900">
                                    <tbody className="divide-y divide-gray-100">
                                        {group.items.map((res) => (
                                            <ReservationTableRow
                                                key={res.id}
                                                reservation={res}
                                                statusLabel="Histórico"
                                                isCheckinTomorrow={res.checkInDate === tomorrowStr}
                                                isCheckoutTomorrow={
                                                    res.checkoutDate === tomorrowStr
                                                }
                                                isSelected={
                                                    res.id ? selectedIds.includes(res.id) : false
                                                }
                                                onEdit={() => onEdit(res)}
                                                onDelete={() => res.id && onDelete(res.id)}
                                                onCopyLink={() => onCopyLink(res)}
                                                onShareWhatsApp={() => onShareWhatsApp(res)}
                                                onSendReminder={(type) => onSendReminder(res, type)}
                                                onToggleSelection={() =>
                                                    res.id && onToggleSelection(res.id)
                                                }
                                            />
                                        ))}
                                    </tbody>
                                </table>
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
                    className="py-4 text-xs font-bold text-gray-500 hover:text-gray-800"
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
