import React, { useMemo, useState } from 'react';
import { Reservation } from '../../types';
import { calculateMonthlyStats, MonthlyStats } from '../../utils/analytics';
import { BarChart, Calendar, Home, TrendingUp, PieChart } from 'lucide-react';

interface AnalyticsDashboardProps {
    reservations: Reservation[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ reservations }) => {
    const [selectedMonth, setSelectedMonth] = useState<string>('all');

    const stats = useMemo(() => calculateMonthlyStats(reservations), [reservations]);

    const displayStats = useMemo(() => {
        if (selectedMonth === 'all') {
            // Aggregate all time (Average occupancy, total count)
            const totalRes = stats.reduce((sum: number, s: MonthlyStats) => sum + s.totalReservations, 0);
            const totalNights = stats.reduce((sum: number, s: MonthlyStats) => sum + s.totalNights, 0);
            // Weighted average for occupancy??? Simple average for now.
            const avgOccupancy = stats.length > 0
                ? stats.reduce((sum: number, s: MonthlyStats) => sum + s.occupancyRate, 0) / stats.length
                : 0;

            return {
                label: 'Todo o Período',
                reservations: totalRes,
                occupancy: avgOccupancy,
                avgStay: totalRes > 0 ? totalNights / totalRes : 0,
                nights: totalNights
            };
        } else {
            const monthStat = (stats as MonthlyStats[]).find(s => s.month === selectedMonth);
            return {
                label: selectedMonth.split('-').reverse().join('/'),
                reservations: monthStat?.totalReservations || 0,
                occupancy: monthStat?.occupancyRate || 0,
                avgStay: (monthStat?.totalReservations || 0) > 0 ? (monthStat?.totalNights || 0) / (monthStat?.totalReservations || 0) : 0,
                nights: monthStat?.totalNights || 0
            };
        }
    }, [selectedMonth, stats]);

    return (
        <div className="p-8 space-y-8 animate-fadeIn">
            {/* HEADER & FILTER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <BarChart className="text-orange-500" /> Relatórios
                    </h2>
                    <p className="text-gray-500 text-sm">Visão geral de desempenho</p>
                </div>

                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500 text-sm font-bold text-gray-700 dark:text-gray-200"
                >
                    <option value="all">Todo o Período</option>
                    {(stats as MonthlyStats[]).map(s => (
                        <option key={s.month} value={s.month}>
                            {s.month.split('-').reverse().join('/')}
                        </option>
                    ))}
                </select>
            </div>

            {/* MAIN METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CARD 1: RESERVAS */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Reservas</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {displayStats.reservations}
                            </h3>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                            <Calendar size={20} />
                        </div>
                    </div>
                    <div className="text-xs text-blue-500 font-medium">
                        {displayStats.nights} diárias totais
                    </div>
                </div>

                {/* CARD 2: OCUPAÇÃO */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Ocupação</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {displayStats.occupancy.toFixed(1)}%
                            </h3>
                        </div>
                        <div className={`p-2 rounded-lg ${displayStats.occupancy > 50 ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600'}`}>
                            <Home size={20} />
                        </div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${displayStats.occupancy > 50 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${displayStats.occupancy}%` }}
                        ></div>
                    </div>
                </div>

                {/* CARD 3: ESTADIA MÉDIA */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Estadia Média</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {displayStats.avgStay.toFixed(1)}
                            </h3>
                        </div>
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">
                        noites por reserva
                    </div>
                </div>

                {/* CARD 4: PLACEHOLDER (Ex: CANCELAMENTOS ou ADMIN) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                                {reservations.length > 0 ? 'Dados Ativos' : 'Sem Dados'}
                            </h3>
                        </div>
                        <div className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 rounded-lg">
                            <PieChart size={20} />
                        </div>
                    </div>
                    <div className="text-xs text-gray-400">
                        {selectedMonth === 'all' ? 'Todas as propriedades' : 'Filtrado por mês'}
                    </div>
                </div>
            </div>

            {/* VISUAL CHART PLACEHOLDER (Since we are keeping it simple no heavy chart lib) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Ocupação Mensal
                </h3>
                <div className="h-48 flex items-end gap-2 overflow-x-auto pb-2">
                    {(stats as MonthlyStats[]).slice().reverse().map(stat => (
                        <div key={stat.month} className="group relative flex flex-col items-center gap-2 flex-shrink-0 w-16">
                            <div
                                className="w-full bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/50 rounded-t-lg transition-all relative"
                                style={{ height: `${Math.max(10, stat.occupancyRate * 1.5)}px` }} // Scale factor
                            >
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {stat.occupancyRate.toFixed(1)}% ({stat.totalNights} noites)
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">
                                {stat.month.split('-')[1]}/{stat.month.split('-')[0].slice(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
