import React, { useState, useMemo, useEffect } from 'react';
import { Invoice, Reservation } from '../../../types';
import { TrendingUp, CalendarCheck, BarChart2, Info, Briefcase } from 'lucide-react';
import { isExcludedFromReservationCash } from '../../../utils/reservationFinance';
import { subscribeToAllInvoices } from '../../../services/firebase';
import {
    filterInvoicesForReport,
    summarizeCorporateFinance,
} from '../../../utils/corporateFinanceReport';

interface RevenueTrendWidgetProps {
    reservations: Reservation[];
}

const money = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const RevenueTrendWidget: React.FC<RevenueTrendWidgetProps> = ({ reservations }) => {
    const [activeHoverData, setActiveHoverData] = useState<{
        label: string;
        revenue: number;
    } | null>(null);
    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

    useEffect(() => subscribeToAllInvoices(setAllInvoices), []);

    const currentMonthStr = useMemo(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }, []);

    const corporateMonth = useMemo(() => {
        const list = filterInvoicesForReport(allInvoices, {
            selectedMonth: currentMonthStr,
            startDate: '',
            endDate: '',
            companyId: 'all',
            statusFilter: 'all',
        });
        return summarizeCorporateFinance(list);
    }, [allInvoices, currentMonthStr]);

    // ADR, noites e gráfico = caixa avulso (diária da reserva). Empresas entram no bloco abaixo.
    const {
        daysWithDataCount,
        dailyData,
        monthlyData,
        averageDailyRate,
        receivedRevenue,
        pendingRevenue,
        totalNights,
        paidNights,
        pendingNights,
    } = useMemo(() => {
        const uniqueDaysSet = new Set<string>();
        const dailyMap = new Map<string, { dateStr: string; revenue: number; nights: number }>();

        reservations.forEach((r) => {
            if (!r.checkInDate || !r.checkoutDate) return;
            if (isExcludedFromReservationCash(r)) return;

            const checkIn = new Date(r.checkInDate + 'T00:00:00');
            const checkOut = new Date(r.checkoutDate + 'T00:00:00');
            const stayNights = Math.max(
                1,
                Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24))
            );
            const dailyRate = (r.totalAmount || 0) / stayNights;

            const curr = new Date(checkIn);
            while (curr < checkOut) {
                const dateStr = curr.toISOString().split('T')[0];
                uniqueDaysSet.add(dateStr);

                const existing = dailyMap.get(dateStr) || { dateStr, revenue: 0, nights: 0 };
                existing.revenue += dailyRate;
                existing.nights += 1;
                dailyMap.set(dateStr, existing);

                curr.setDate(curr.getDate() + 1);
            }
        });

        const sortedDays = Array.from(dailyMap.values()).sort((a, b) =>
            a.dateStr.localeCompare(b.dateStr)
        );

        const now = new Date();
        const monthsList: {
            monthName: string;
            revenue: number;
            daysCount: number;
            hasRealData: boolean;
        }[] = [];

        let currentMonthRev = 0;
        let totNights = 0;
        let pdNights = 0;
        let pndNights = 0;
        let recRev = 0;
        let pndRev = 0;

        for (let i = 5; i >= 0; i--) {
            const mDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = mDate.getFullYear();
            const month = mDate.getMonth();
            const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
            const monthName = mDate
                .toLocaleDateString('pt-BR', { month: 'short' })
                .replace('.', '');

            let monthRev = 0;
            let monthDays = 0;

            dailyMap.forEach((val, dStr) => {
                if (dStr.startsWith(monthStr)) {
                    monthRev += val.revenue;
                    monthDays += 1;
                }
            });

            monthsList.push({
                monthName,
                revenue: Math.round(monthRev * 100) / 100,
                daysCount: monthDays,
                hasRealData: monthDays > 0,
            });

            if (monthStr === currentMonthStr) {
                currentMonthRev = monthRev;
            }
        }

        reservations.forEach((r) => {
            if (!r.checkInDate || !r.checkoutDate) return;
            if (isExcludedFromReservationCash(r)) return;
            if (r.checkInDate.startsWith(currentMonthStr)) {
                const stayNights = Math.max(
                    1,
                    Math.round(
                        (new Date(r.checkoutDate).getTime() - new Date(r.checkInDate).getTime()) /
                            (1000 * 3600 * 24)
                    )
                );
                totNights += stayNights;
                if (r.paymentStatus === 'paid') {
                    pdNights += stayNights;
                    recRev += r.totalAmount || 0;
                } else if (r.paymentStatus === 'partial') {
                    const dep = r.depositAmount || 0;
                    recRev += dep;
                    pndRev += Math.max(0, (r.totalAmount || 0) - dep);
                    pdNights += 1;
                } else {
                    pndNights += stayNights;
                    pndRev += r.totalAmount || 0;
                }
            }
        });

        const adr = totNights > 0 ? currentMonthRev / totNights : 0;

        return {
            daysWithDataCount: uniqueDaysSet.size,
            dailyData: sortedDays.slice(-14),
            monthlyData: monthsList,
            averageDailyRate: adr,
            receivedRevenue: recRev,
            pendingRevenue: pndRev,
            totalNights: totNights,
            paidNights: pdNights,
            pendingNights: pndNights,
        };
    }, [reservations, currentMonthStr]);

    const consolidatedReceived = receivedRevenue + corporateMonth.receivedTotal;
    const consolidatedOpen = pendingRevenue + corporateMonth.openTotal;

    const maxDailyRevenue = useMemo(
        () => Math.max(...dailyData.map((d) => d.revenue), 1),
        [dailyData]
    );
    const maxMonthlyRevenue = useMemo(
        () => Math.max(...monthlyData.map((m) => m.revenue), 1),
        [monthlyData]
    );

    return (
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none flex flex-col justify-between">
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white font-heading">
                                Desempenho & Faturamento
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                Caixa avulso (ADR/gráfico) + faturas de empresas no mês
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                        <BarChart2 size={14} /> Avulso + empresas
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-heading block mb-1">
                            Diária Média (ADR) · avulso
                        </span>
                        <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
                            R$ {money(averageDailyRate)}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            R$ {money(receivedRevenue)} recebidos (reservas)
                        </p>
                    </div>

                    <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 font-heading flex items-center gap-1 mb-1">
                            <CalendarCheck size={12} /> Diárias Vendidas · avulso
                        </span>
                        <p className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-100 font-heading">
                            {totalNights} noites
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                            {paidNights} pagas / {pendingNights} pendentes (R${' '}
                            {money(pendingRevenue)})
                        </p>
                    </div>
                </div>

                {/* Empresas — competência do mês atual */}
                <div className="mb-6 p-4 rounded-2xl border border-indigo-200/70 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/20">
                    <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 font-heading flex items-center gap-1.5">
                            <Briefcase size={12} /> Empresas · competência{' '}
                            {currentMonthStr.split('-').reverse().join('/')}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                            {corporateMonth.invoiceCount} fatura
                            {corporateMonth.invoiceCount !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                            <p className="text-[10px] font-bold text-indigo-500 uppercase">
                                Faturado
                            </p>
                            <p className="text-sm sm:text-base font-extrabold text-indigo-900 dark:text-indigo-100 font-heading">
                                R$ {money(corporateMonth.billedTotal)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-green-600 uppercase">
                                Recebido
                            </p>
                            <p className="text-sm sm:text-base font-extrabold text-green-800 dark:text-green-200 font-heading">
                                R$ {money(corporateMonth.receivedTotal)}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-red-600 uppercase">
                                Em aberto
                            </p>
                            <p className="text-sm sm:text-base font-extrabold text-red-800 dark:text-red-200 font-heading">
                                R$ {money(corporateMonth.openTotal)}
                            </p>
                        </div>
                    </div>
                    <p className="text-[10px] text-indigo-600/80 dark:text-indigo-400 mt-3 font-medium">
                        Consolidado do mês · recebido R$ {money(consolidatedReceived)} · em aberto
                        R$ {money(consolidatedOpen)}
                    </p>
                </div>

                <div>
                    {daysWithDataCount < 14 ? (
                        <div className="p-6 bg-gray-50/80 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-center">
                            <Info size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-300 font-heading">
                                Histórico de caixa avulso em formação
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                                O gráfico diário usa só reservas avulsas (empresas entram no bloco
                                acima). Faltam dias de histórico: {daysWithDataCount} de 14.
                            </p>
                        </div>
                    ) : daysWithDataCount < 60 ? (
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200 font-heading tracking-tight flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Caixa avulso diário (últimos dias)
                                </span>

                                {activeHoverData ? (
                                    <div className="px-3 py-1 bg-emerald-600 dark:bg-emerald-500 text-white rounded-lg text-xs font-bold font-mono shadow-xs flex items-center gap-1.5 animate-fadeIn">
                                        <span className="opacity-90">{activeHoverData.label}:</span>
                                        <span>R$ {money(activeHoverData.revenue)}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                        Granularidade diária ({daysWithDataCount} dias)
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-3 min-w-0 items-stretch">
                                <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-bold font-mono text-gray-600 dark:text-gray-300 py-1 pr-2 border-r border-gray-200 dark:border-gray-700 shrink-0 select-none">
                                    <span>
                                        R$ {Math.round(maxDailyRevenue).toLocaleString('pt-BR')}
                                    </span>
                                    <span>
                                        R$ {Math.round(maxDailyRevenue / 2).toLocaleString('pt-BR')}
                                    </span>
                                    <span>R$ 0</span>
                                </div>

                                <div className="flex-1 overflow-x-auto no-scrollbar touch-pan-x relative">
                                    <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none z-0">
                                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700/60 w-full" />
                                        <div className="border-b border-dashed border-gray-200 dark:border-gray-700/60 w-full" />
                                        <div className="border-b border-gray-200 dark:border-gray-700/60 w-full" />
                                    </div>

                                    <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-36 min-w-[360px] sm:min-w-0 relative z-10 pt-2 pb-6">
                                        {dailyData.map((d) => {
                                            const pct = Math.round(
                                                (d.revenue / maxDailyRevenue) * 100
                                            );
                                            const label = d.dateStr
                                                .split('-')
                                                .slice(1)
                                                .reverse()
                                                .join('/');
                                            const isHovered = activeHoverData?.label === label;

                                            return (
                                                <div
                                                    key={d.dateStr}
                                                    onMouseEnter={() =>
                                                        setActiveHoverData({
                                                            label,
                                                            revenue: d.revenue,
                                                        })
                                                    }
                                                    onMouseLeave={() => setActiveHoverData(null)}
                                                    onTouchStart={() =>
                                                        setActiveHoverData({
                                                            label,
                                                            revenue: d.revenue,
                                                        })
                                                    }
                                                    className="flex-1 min-w-[20px] sm:min-w-[26px] flex flex-col items-center gap-1.5 group h-full justify-end relative cursor-pointer"
                                                >
                                                    <div className="w-full bg-gray-100 dark:bg-gray-700/40 rounded-lg overflow-hidden h-full flex items-end p-0.5">
                                                        <div
                                                            className={`w-full rounded-md transition-all duration-200 ${
                                                                isHovered
                                                                    ? 'bg-emerald-400 dark:bg-emerald-400 scale-y-[1.02]'
                                                                    : 'bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300'
                                                            }`}
                                                            style={{ height: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span
                                                        className={`text-[10px] sm:text-[11px] font-extrabold font-mono tracking-tight transition-colors ${
                                                            isHovered
                                                                ? 'text-emerald-600 dark:text-emerald-400 font-black'
                                                                : 'text-gray-700 dark:text-gray-300'
                                                        }`}
                                                    >
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs sm:text-sm font-extrabold text-gray-800 dark:text-gray-200 font-heading tracking-tight flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                    Histórico avulso · últimos 6 meses
                                </span>
                                <div className="flex items-center gap-3 text-xs font-bold text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>{' '}
                                        Dado real
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded border border-dashed border-gray-400 bg-gray-200/50 dark:bg-gray-700/50"></span>{' '}
                                        Sem dado
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 min-w-0 items-stretch">
                                <div className="flex flex-col justify-between text-[10px] sm:text-[11px] font-bold font-mono text-gray-600 dark:text-gray-300 py-1 pr-2 border-r border-gray-200 dark:border-gray-700 shrink-0 select-none">
                                    <span>
                                        R$ {Math.round(maxMonthlyRevenue).toLocaleString('pt-BR')}
                                    </span>
                                    <span>
                                        R${' '}
                                        {Math.round(maxMonthlyRevenue / 2).toLocaleString('pt-BR')}
                                    </span>
                                    <span>R$ 0</span>
                                </div>

                                <div className="flex-1 flex items-end justify-between gap-2 sm:gap-4 h-36 pt-2 pb-6">
                                    {monthlyData.map((m, idx) => {
                                        const isCurrent = idx === monthlyData.length - 1;
                                        const pct = m.hasRealData
                                            ? Math.round((m.revenue / maxMonthlyRevenue) * 100)
                                            : 0;

                                        return (
                                            <div
                                                key={m.monthName}
                                                className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end relative"
                                            >
                                                <div className="w-full max-w-[40px] bg-gray-100 dark:bg-gray-700/50 rounded-2xl overflow-hidden h-full flex items-end p-1">
                                                    {m.hasRealData ? (
                                                        <div
                                                            className={`w-full rounded-xl transition-all duration-500 group-hover:brightness-110 ${
                                                                isCurrent
                                                                    ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 shadow-md shadow-emerald-500/20'
                                                                    : 'bg-gradient-to-t from-blue-600 to-indigo-500 opacity-80 group-hover:opacity-100'
                                                            }`}
                                                            style={{ height: `${pct}%` }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full rounded-xl border border-dashed border-gray-300 dark:border-gray-600 bg-gray-200/30 dark:bg-gray-700/20 flex items-center justify-center">
                                                            <span className="text-[10px] font-mono text-gray-500 rotate-90 sm:rotate-0">
                                                                N/D
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <span
                                                    className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider ${
                                                        isCurrent
                                                            ? 'text-emerald-600 dark:text-emerald-400 font-heading'
                                                            : 'text-gray-600 dark:text-gray-400'
                                                    }`}
                                                >
                                                    {m.monthName}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RevenueTrendWidget;
