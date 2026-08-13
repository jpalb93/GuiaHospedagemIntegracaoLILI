import React from 'react';
import { Reservation } from '../../../types';
import { LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import ReservationGridCard from './ReservationGridCard';

interface ReservationSectionProps {
    title: string;
    list: Reservation[];
    statusColor: string;
    showEmpty?: boolean;
    selectedIds: string[];
    onToggleSelection: (id: string) => void;
    onOpenInspection: (res: Reservation) => void;
    onQuickView?: (res: Reservation) => void;
    onOpenPaymentModal?: (res: Reservation) => void;
}

const ReservationSection: React.FC<ReservationSectionProps> = ({
    title,
    list,
    statusColor,
    showEmpty = false,
    selectedIds,
    onToggleSelection,
    onOpenInspection,
    onQuickView,
    onOpenPaymentModal,
}) => {
    if (list.length === 0 && !showEmpty) return null;

    const SectionIcon = title.includes('Saindo')
        ? LogOut
        : title.includes('Hospedado')
          ? CheckCircle2
          : LogIn;

    return (
        <div className="mb-10 animate-fadeIn space-y-4">
            {/* Section Header Bar */}
            <div className="flex items-center gap-3 pl-1">
                <h3 className="text-sm sm:text-base font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2.5 font-heading">
                    <SectionIcon size={18} className={statusColor.replace('border-', 'text-')} />
                    <span
                        className={`w-3 h-3 rounded-full ${statusColor.replace('border-', 'bg-')}`}
                    />
                    {title}
                </h3>
                <span className="bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-bold px-3 py-0.5 rounded-full border border-stone-300/50 dark:border-stone-700 font-mono">
                    {list.length}
                </span>
            </div>

            {/* Responsive 2-Column Grid (Mobile, Tablet, Desktop) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-6">
                {list.map((res) => (
                    <ReservationGridCard
                        key={res.id}
                        reservation={res}
                        isSelected={res.id ? selectedIds.includes(res.id) : false}
                        onToggleSelection={onToggleSelection}
                        onOpenQuickActions={(r) => onQuickView?.(r)}
                        onOpenPaymentModal={() => onOpenPaymentModal?.(res)}
                        onOpenInspection={() => onOpenInspection(res)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReservationSection;
