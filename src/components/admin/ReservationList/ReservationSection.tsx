import React from 'react';
import { Reservation } from '../../../types';
import ReservationCard from './ReservationCard';
import ReservationTableRow from './ReservationTableRow';

interface ReservationSectionProps {
    title: string;
    list: Reservation[];
    statusColor: string;
    statusLabel: string;
    showEmpty?: boolean;
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

const ReservationSection: React.FC<ReservationSectionProps> = ({
    title,
    list,
    statusColor,
    statusLabel,
    showEmpty = false,
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
    if (list.length === 0 && !showEmpty) return null;

    return (
        <div className="mb-8 animate-fadeIn">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                {title}{' '}
                <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 rounded-md">
                    {list.length}
                </span>
            </h3>

            {/* Mobile Cards */}
            <div className="md:hidden">
                {list.map((res) => (
                    <ReservationCard
                        key={res.id}
                        reservation={res}
                        statusColor={statusColor}
                        statusLabel={statusLabel}
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
                        onToggleSelection={() => res.id && onToggleSelection(res.id)}
                    />
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-gray-700/50 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-gray-700/50">
                        <tr>
                            <th className="py-4 px-4 w-10"></th>
                            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Hóspede
                            </th>
                            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Datas
                            </th>
                            <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {list.map((res) => (
                            <ReservationTableRow
                                key={res.id}
                                reservation={res}
                                statusLabel={statusLabel}
                                isCheckinTomorrow={res.checkInDate === tomorrowStr}
                                isCheckoutTomorrow={res.checkoutDate === tomorrowStr}
                                isSelected={res.id ? selectedIds.includes(res.id) : false}
                                onEdit={() => onEdit(res)}
                                onDelete={() => res.id && onDelete(res.id)}
                                onCopyLink={() => onCopyLink(res)}
                                onShareWhatsApp={() => onShareWhatsApp(res)}
                                onSendReminder={(type) => onSendReminder(res, type)}
                                onToggleSelection={() => res.id && onToggleSelection(res.id)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationSection;
