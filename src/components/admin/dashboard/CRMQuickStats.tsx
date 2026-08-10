import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { DollarSign, TrendingUp, Users, LogIn, LogOut, Sparkles } from 'lucide-react';
import { MIN_SAMPLE_FOR_TREND_BADGES } from '../../../config/constants';

import { isExcludedFromReservationCash } from '../../../utils/reservationFinance';

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
    // Gating estatístico: apenas exibir badges de tendência quando houver amostra mínima suficiente
    const hasMinSample = reservations.length >= MIN_SAMPLE_FOR_TREND_BADGES;

    // Cálculo da receita mensal estimada do mês atual (só caixa de reserva — sem corporativo/external)
    const monthlyMetrics = useMemo(() => {
        const now = new Date();
        const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const monthReservations = reservations.filter((r) => {
            const checkIn = r.checkInDate || '';
            return checkIn.startsWith(currentMonthStr) && !isExcludedFromReservationCash(r);
        });

        const totalRevenue = monthReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
        const occupancyRate =
            totalUnitsCount > 0
                ? Math.min(100, Math.round((activeCount / totalUnitsCount) * 100))
                : 0;

        return {
            totalRevenue,
            occupancyRate,
            countThisMonth: monthReservations.length,
        };
    }, [reservations, totalUnitsCount, activeCount]);

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            onNavigate('list');
        }
    };

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
                            <Sparkles size={14} className="text-emerald-300" /> Caixa avulso (mês)
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                            Mês Atual
                        </span>
                    </div>
                    <div className="mt-4">
                        <h3 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight">
                            R${' '}
                            {monthlyMetrics.totalRevenue.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                            })}
                        </h3>
                        <p className="text-xs text-emerald-200/80 mt-1 font-medium flex items-center gap-1">
                            <TrendingUp size={14} className="text-emerald-300" />
                            {monthlyMetrics.countThisMonth} reserva
                            {monthlyMetrics.countThisMonth !== 1 ? 's' : ''} avulsa
                            {monthlyMetrics.countThisMonth !== 1 ? 's' : ''} · empresas no Relatório
                        </p>
                    </div>
                </div>
            </div>

            {/* KPI 2: TAXA DE OCUPAÇÃO */}
            <div
                onClick={() => scrollToSection('mapa-ocupacao')}
                className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900 text-white p-6 rounded-[2.2rem] shadow-xl shadow-blue-900/10 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
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

            {/* KPI 3: CHEGANDO HOJE */}
            <div
                onClick={() => scrollToSection('chegando-hoje')}
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2.2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
                <div className="absolute -right-4 -bottom-4 opacity-15 dark:opacity-25 group-hover:opacity-30 transition-opacity text-blue-600 dark:text-blue-400">
                    <LogIn size={110} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                            Chegando Hoje
                            {checkinsCount > 0 && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                                </span>
                            )}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shadow-xs shrink-0">
                            <LogIn size={18} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white">
                            {checkinsCount}
                        </span>
                        {hasMinSample &&
                            (checkinsCount > 0 ? (
                                <span className="text-[11px] font-extrabold text-blue-700 bg-blue-100 dark:bg-blue-900/60 dark:text-blue-200 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800/50 shadow-2xs flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />{' '}
                                    Movimento Alto
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400 font-medium">
                                    Sem entradas
                                </span>
                            ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 relative z-10 font-medium">
                    Check-ins previstos para hoje
                </p>
            </div>

            {/* KPI 4: SAINDO HOJE (Cor semântica Âmbar para não colidir com o Laranja de marca) */}
            <div
                onClick={() => scrollToSection('saindo-hoje')}
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-[2.2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/40 dark:shadow-none hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
                <div className="absolute -right-4 -bottom-4 opacity-15 dark:opacity-25 group-hover:opacity-30 transition-opacity text-amber-600 dark:text-amber-400">
                    <LogOut size={110} />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                            Saindo Hoje
                            {checkoutsCount > 0 && (
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                                </span>
                            )}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 flex items-center justify-center shadow-xs shrink-0">
                            <LogOut size={18} />
                        </div>
                    </div>
                    <div className="flex items-baseline gap-3">
                        <span className="text-3xl sm:text-4xl font-extrabold font-heading text-gray-900 dark:text-white">
                            {checkoutsCount}
                        </span>
                        {hasMinSample &&
                            (checkoutsCount > 0 ? (
                                <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 dark:bg-amber-900/60 dark:text-amber-200 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800/50 shadow-2xs">
                                    Check-outs
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400 font-medium">
                                    Sem saídas
                                </span>
                            ))}
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
