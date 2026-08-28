import React from 'react';
import { Calendar, LogIn, LogOut, DollarSign } from 'lucide-react';
import { Reservation } from '../../../types';

interface ReservationKPIsProps {
    reservations: Reservation[];
    allFiltered: Reservation[];
    todayStr: string;
}

export const ReservationKPIs: React.FC<ReservationKPIsProps> = ({ allFiltered, todayStr }) => {
    const metrics = React.useMemo(() => {
        let activeCount = 0;
        let checkInTodayCount = 0;
        let checkOutTodayCount = 0;
        let confirmedRevenue = 0;

        allFiltered.forEach((res) => {
            const checkIn = res.checkInDate || '';
            const checkOut = res.checkoutDate || '';

            if (checkIn === todayStr) {
                checkInTodayCount++;
            }
            if (checkOut === todayStr) {
                checkOutTodayCount++;
            }
            if (checkIn <= todayStr && checkOut >= todayStr) {
                activeCount++;
            } else if (checkIn > todayStr && res.status !== 'cancelled') {
                activeCount++;
            }

            // Confirmed revenue: deposit or full if paid/partially paid
            if (res.status !== 'cancelled') {
                if (res.paymentStatus === 'paid') {
                    confirmedRevenue += res.totalAmount || 0;
                } else if (res.depositAmount && res.depositAmount > 0) {
                    confirmedRevenue += res.depositAmount;
                }
            }
        });

        return {
            activeCount,
            checkInTodayCount,
            checkOutTodayCount,
            confirmedRevenue,
        };
    }, [allFiltered, todayStr]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 animate-fadeIn">
            {/* 1. RESERVAS ATIVAS */}
            <div className="p-6 sm:p-7 bg-white dark:bg-gray-800/90 rounded-[2.5rem] border border-gray-200/80 dark:border-gray-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 group">
                <div className="space-y-1.5 min-w-0">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white tracking-tight">
                        {metrics.activeCount}
                    </span>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 font-heading">
                        Reservas Ativas
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                        Check-in futuro e em curso
                    </p>
                </div>
                <div className="w-14 h-14 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
                    <Calendar size={26} />
                </div>
            </div>

            {/* 2. CHECK-IN HOJE */}
            <div className="p-6 sm:p-7 bg-white dark:bg-gray-800/90 rounded-[2.5rem] border border-gray-200/80 dark:border-gray-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 group">
                <div className="space-y-1.5 min-w-0">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-orange-600 dark:text-orange-400 tracking-tight">
                        {metrics.checkInTodayCount}
                    </span>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 font-heading">
                        Check-in Hoje
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                        Chegadas previstas hoje
                    </p>
                </div>
                <div className="w-14 h-14 rounded-3xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/40 group-hover:scale-105 transition-transform">
                    <LogIn size={26} />
                </div>
            </div>

            {/* 3. CHECK-OUT HOJE */}
            <div className="p-6 sm:p-7 bg-white dark:bg-gray-800/90 rounded-[2.5rem] border border-gray-200/80 dark:border-gray-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 group">
                <div className="space-y-1.5 min-w-0">
                    <span className="text-3xl sm:text-4xl font-extrabold font-heading text-cyan-600 dark:text-cyan-400 tracking-tight">
                        {metrics.checkOutTodayCount}
                    </span>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 font-heading">
                        Check-out Hoje
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                        Saídas previstas hoje
                    </p>
                </div>
                <div className="w-14 h-14 rounded-3xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-100 dark:border-cyan-900/40 group-hover:scale-105 transition-transform">
                    <LogOut size={26} />
                </div>
            </div>

            {/* 4. RECEITA CONFIRMADA */}
            <div className="p-6 sm:p-7 bg-white dark:bg-gray-800/90 rounded-[2.5rem] border border-gray-200/80 dark:border-gray-700/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between gap-4 group">
                <div className="space-y-1.5 min-w-0">
                    <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono tracking-tight block truncate">
                        R${' '}
                        {metrics.confirmedRevenue.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </span>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-gray-100 font-heading">
                        Receita Confirmada
                    </p>
                    <p className="text-xs text-gray-400 font-medium truncate">
                        Recebimentos registrados
                    </p>
                </div>
                <div className="w-14 h-14 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/40 group-hover:scale-105 transition-transform">
                    <DollarSign size={26} />
                </div>
            </div>
        </div>
    );
};

export default ReservationKPIs;
