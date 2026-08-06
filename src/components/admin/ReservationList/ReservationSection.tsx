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
    onQuickView?: (res: Reservation) => void;
    onOpenPaymentModal?: (res: Reservation) => void;
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
    onQuickView,
    onOpenPaymentModal,
}) => {
    if (list.length === 0 && !showEmpty) return null;

    return (
        <div className="mb-10 animate-fadeIn">
            {/* Section Header Bar */}
            <div className="flex items-center gap-3 mb-4 pl-1">
                <h3 className="text-sm font-extrabold font-heading text-stone-800 dark:text-stone-200 uppercase tracking-wider flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${statusColor.replace('border-', 'bg-')}`} />
                    {title}
                </h3>
                <span className="bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full font-heading border border-stone-300/50 dark:border-stone-700">
                    {list.length}
                </span>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
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
                        onQuickView={() => onQuickView?.(res)}
                        onOpenPaymentModal={() => onOpenPaymentModal?.(res)}
                    />
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none overflow-hidden transition-all">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-stone-50/80 dark:bg-gray-900/60 border-b border-stone-200/60 dark:border-gray-700/60">
                        <tr>
                            <th className="py-4 px-4 w-10"></th>
                            <th className="py-4 px-4 text-[11px] font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                Hóspede & Flat
                            </th>
                            <th className="py-4 px-4 text-[11px] font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                Status & Pagamento
                            </th>
                            <th className="py-4 px-4 text-[11px] font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                Estadia / Datas
                            </th>
                            <th className="py-4 px-4 text-[11px] font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                                Valor Total (R$)
                            </th>
                            <th className="py-4 px-4 text-[11px] font-extrabold font-heading text-stone-500 dark:text-stone-400 uppercase tracking-wider text-right pr-6">
                                Ações Rápidas
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
                                onOpenInspection={() => onOpenInspection(res)}
                                onToggleSelection={() => res.id && onToggleSelection(res.id)}
                                onQuickView={() => onQuickView?.(res)}
                                onOpenPaymentModal={() => onOpenPaymentModal?.(res)}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationSection;
