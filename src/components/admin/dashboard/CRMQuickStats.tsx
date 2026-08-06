import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { DollarSign, TrendingUp, Users, LogIn, LogOut, Sparkles } from 'lucide-react';

interface CRMQuickStatsProps {
    reservations: Reservation[];
    totalUnitsCount: number;
    checkinsCount: number;
    checkoutsCount: number;
    activeCount: number;
    onNavigate: (tab: string) => void;
}

export const CRMQuickStats: React.FC<CRMQuickStatsProps> = ({
    reservations,
    totalUnitsCount,
    checkinsCount,
    checkoutsCount,
    activeCount,
    onNavigate,
}) => {
    // Calculo da receita mensal estimada do mês atual
    const monthlyMetrics = useMemo(() => {
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const monthReservations = reservations.filter((r) => {
            const checkIn = r.checkInDate || '';
            const isExternal = r.paymentStatus === 'external' || r.isExternal === true;
            return checkIn.startsWith(currentMonthStr) && !isExternal;
        });

        const totalRevenue = monthReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
        const occupancyRate = totalUnitsCount > 0 ? Math.min(100, Math.round((activeCount / totalUnitsCount) * 100)) : 0;

        return {
            totalRevenue,
            occupancyRate,
            countThisMonth: monthReservations.length,
        };
    }, [reservations, totalUnitsCount, activeCount]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* KPI 1: RECEITA DO MÊS */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-green-900 text-white p-6 rounded-[2.2rem] shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1 transition-all duration-300 group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <DollarSign size={120} />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-200/90 font-heading flex items-center gap-1.5">
                            <Sparkles size={14} className="text-emerald-300" /> Faturamento no Mês
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                            Mês Atual
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
                            R$ {monthlyMetrics.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-xs text-emerald-200/80 mt-1 font-medium flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-300" />
                            {monthlyMetrics.countThisMonth} reserva{monthlyMetrics.countThisMonth !== 1 ? 's' : ''} confirmada{monthlyMetrics.countThisMonth !== 1 ? 's' : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI 2: TAXA DE OCUPAÇÃO */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white p-6 rounded-[2.2rem] shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 group">
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users size={120} />
                </div>
                <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-200/90 font-heading">
                            Ocupação em Tempo Real
                        </span>
                        <span className="text-[10px] font-extrabold bg-blue-400/20 text-blue-200 border border-blue-300/30 px-2 py-0.5 rounded-full">
                            Hoje
                        </span>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
                                {monthlyMetrics.occupancyRate}%
                            </h3>
                            <span className="text-xs text-blue-200 font-medium">
                                ({activeCount} de {totalUnitsCount} flats)
                            </span>
                        </div>
                        <div className="w-full bg-blue-950/40 rounded-full h-2 mt-2.5 overflow-hidden border border-blue-400/20">
                            <div
                                className="bg-gradient-to-r from-blue-300 to-cyan-400 h-full rounded-full transition-all duration-500"
                                style={{ width: `${monthlyMetrics.occupancyRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI 3: CHEGANDOS HOJE */}
            <div
                onClick={() => onNavigate('list')}
                className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-[2.2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
                <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity text-blue-600">
                    <LogIn size={110} />
                </div>
                <div className="relative z-10">
                    <span className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-heading block mb-2">
                        Chegando Hoje
                    </span>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white">
                            {checkinsCount}
                        </span>
                        {checkinsCount > 0 ? (
                            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-300 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/50">
                                Movimento Alto
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-medium">Sem entradas</span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 relative z-10 font-medium">
                    Check-ins previstos para hoje
                </p>
            </div>

            {/* KPI 4: SAINDO HOJE */}
            <div
                onClick={() => onNavigate('list')}
                className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-[2.2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
                <div className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity text-red-600">
                    <LogOut size={110} />
                </div>
                <div className="relative z-10">
                    <span className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-heading block mb-2">
                        Saindo Hoje
                    </span>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white">
                            {checkoutsCount}
                        </span>
                        {checkoutsCount > 0 ? (
                            <span className="text-[11px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/40 dark:text-orange-300 px-2.5 py-1 rounded-lg border border-orange-200 dark:border-orange-800/50">
                                Check-outs
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400 font-medium">Sem saídas</span>
                        )}
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 relative z-10 font-medium">
                    Liberação de unidades para limpeza
                </p>
            </div>
        </div>
    );
};

export default CRMQuickStats;
