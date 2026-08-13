import React from 'react';
import { Reservation } from '../../../types';
import { LogIn, LogOut, CheckCircle2 } from 'lucide-react';
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
    onOpenCleaning?: (res: Reservation) => void;
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
    onOpenCleaning,
}) => {
    if (list.length === 0 && !showEmpty) return null;

    const SectionIcon = title.includes('Saindo')
        ? LogOut
        : title.includes('Hospedado')
          ? CheckCircle2
          : LogIn;

    return (
        <div className="mb-10 animate-fadeIn">
            {/* Section Header Bar */}
            <div className="flex items-center gap-3 mb-4 pl-1">
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
                    <SectionIcon size={16} className={statusColor.replace('border-', 'text-')} />
                    <span
                        className={`w-2.5 h-2.5 rounded-full ${statusColor.replace('border-', 'bg-')}`}
                    />
                    {title}
                </h3>
                <span className="bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-stone-300/50 dark:border-stone-700">
                    {list.length}
                </span>
            </div>

            {/* Cards View (Mobile + Tablet Portrait 744px-1024px) */}
            <div className="lg:hidden portrait:block space-y-3">
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
                        onOpenCleaning={() => onOpenCleaning?.(res)}
                    />
                ))}
            </div>

            {/* Desktop Table View (Tablet Landscape 1024px-1366px + Desktop) */}
            <div className="hidden lg:block portrait:hidden bg-white/90 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] border border-stone-200/80 dark:border-gray-700/80 shadow-2xl shadow-stone-200/40 dark:shadow-none overflow-hidden transition-all duration-300">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[900px] text-left border-collapse">
                        <thead className="bg-gradient-to-r from-stone-100/90 via-stone-50/90 to-stone-100/90 dark:from-gray-900/90 dark:via-gray-850/90 dark:to-gray-900/90 border-b border-stone-200/80 dark:border-gray-700/80">
                            <tr className="divide-x divide-stone-200/70 dark:divide-gray-700/70">
                                <th className="py-3.5 px-2 w-12 text-center"></th>
                                <th className="py-3.5 px-3 text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                                    Hóspede & Flat
                                </th>
                                <th className="py-3.5 px-3 text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                                    Status & Pagamento
                                </th>
                                <th className="py-3.5 px-3 text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                                    Estadia / Datas
                                </th>
                                <th className="py-3.5 px-3 text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
                                    Valor Total (R$)
                                </th>
                                <th className="py-3.5 px-3 text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wider text-right pr-4 whitespace-nowrap">
                                    Ações Rápidas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/90 dark:divide-gray-700/80">
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
                                    onOpenCleaning={() => onOpenCleaning?.(res)}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReservationSection;
