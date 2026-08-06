import React, { useMemo } from 'react';
import { Reservation } from '../../../types';
import { TrendingUp, CalendarCheck, BarChart2 } from 'lucide-react';

interface RevenueTrendWidgetProps {
    reservations: Reservation[];
}

export const RevenueTrendWidget: React.FC<RevenueTrendWidgetProps> = ({ reservations }) => {
    // Calculo do faturamento dos últimos 6 meses e Diária Média (ADR)
    const metrics = useMemo(() => {
        const now = new Date();
        const monthsData: {
            monthName: string;
            revenue: number;
            receivedRevenue: number;
            pendingRevenue: number;
            nightsCount: number;
            paidNightsCount: number;
            pendingNightsCount: number;
        }[] = [];

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');

            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

            let monthRevenue = 0;
            let monthReceivedRevenue = 0;
            let monthPendingRevenue = 0;
            let monthNightsCount = 0;
            let monthPaidNightsCount = 0;
            let monthPendingNightsCount = 0;

            reservations.forEach((r) => {
                if (!r.checkInDate || !r.checkoutDate) return;

                // Reservas com Pagamento Externo (ex: Flat 304 com pagto externo) só ocupam calendário visual
                // NÃO entram nem na contagem de noites vendidas nem no financeiro/ADR
                const isExternalPayment = r.paymentStatus === 'external' || r.isExternal === true;
                if (isExternalPayment) return;

                const checkIn = new Date(r.checkInDate + 'T00:00:00');
                const checkOut = new Date(r.checkoutDate + 'T00:00:00');

                // Se a reserva tem sobreposição com este mês
                if (checkIn <= lastDayOfMonth && checkOut > firstDayOfMonth) {
                    const totalStayNights = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

                    const startInMonth = checkIn < firstDayOfMonth ? firstDayOfMonth : checkIn;
                    const nextMonthFirstDay = new Date(year, month + 1, 1);
                    const endInMonth = checkOut > nextMonthFirstDay ? nextMonthFirstDay : checkOut;

                    const nightsInThisMonth = Math.max(0, Math.round((endInMonth.getTime() - startInMonth.getTime()) / (1000 * 3600 * 24)));

                    if (nightsInThisMonth > 0) {
                        const totalAmount = r.totalAmount || 0;
                        monthNightsCount += nightsInThisMonth;

                        if (totalAmount > 0) {
                            const dailyRate = totalAmount / totalStayNights;
                            const stayRevenueInMonth = dailyRate * nightsInThisMonth;
                            monthRevenue += stayRevenueInMonth;

                            if (r.paymentStatus === 'paid') {
                                monthPaidNightsCount += nightsInThisMonth;
                                monthReceivedRevenue += stayRevenueInMonth;
                            } else if (r.paymentStatus === 'partial') {
                                const deposit = r.depositAmount || 0;
                                const remaining = Math.max(0, totalAmount - deposit);
                                const paidRatio = Math.min(1, Math.max(0, deposit / totalAmount));
                                const paidNights = Math.round(nightsInThisMonth * paidRatio);
                                monthPaidNightsCount += paidNights;
                                monthPendingNightsCount += (nightsInThisMonth - paidNights);

                                const paidRev = (deposit / totalStayNights) * nightsInThisMonth;
                                monthReceivedRevenue += paidRev;
                                // Para cobrança no check-in, o saldo restante total a receber do contrato:
                                monthPendingRevenue += remaining;
                            } else {
                                // pending ou não definido (Falta Pagar) -> 100% pendente
                                monthPendingNightsCount += nightsInThisMonth;
                                monthPendingRevenue += totalAmount;
                            }
                        }
                    }
                }
            });

            monthsData.push({
                monthName,
                revenue: Math.round(monthRevenue * 100) / 100,
                receivedRevenue: Math.round(monthReceivedRevenue * 100) / 100,
                pendingRevenue: Math.round(monthPendingRevenue * 100) / 100,
                nightsCount: monthNightsCount,
                paidNightsCount: monthPaidNightsCount,
                pendingNightsCount: monthPendingNightsCount,
            });
        }

        const currentMonthData = monthsData[monthsData.length - 1] || {
            revenue: 0,
            receivedRevenue: 0,
            pendingRevenue: 0,
            nightsCount: 0,
            paidNightsCount: 0,
            pendingNightsCount: 0,
        };
        const totalNights = currentMonthData.nightsCount;
        const paidNights = currentMonthData.paidNightsCount;
        const pendingNights = currentMonthData.pendingNightsCount;
        const pendingRevenue = currentMonthData.pendingRevenue;
        const receivedRevenue = currentMonthData.receivedRevenue;

        // ADR Hoteleiro padrão: Receita Total do Mês ÷ Total de Noites Vendidas
        const averageDailyRate = totalNights > 0 ? currentMonthData.revenue / totalNights : 0;
        const maxRevenue = Math.max(...monthsData.map((m) => m.revenue), 1);

        return {
            monthsData,
            currentRevenue: currentMonthData.revenue,
            averageDailyRate,
            maxRevenue,
            totalNights,
            paidNights,
            pendingNights,
            pendingRevenue,
            receivedRevenue,
        };
    }, [reservations]);

    return (
        <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none flex flex-col justify-between">
            <div>
                {/* Header */}
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
                                Análise de receita e diária média (ADR)
                            </p>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/50">
                        <BarChart2 size={14} /> Faturamento Semestral
                    </div>
                </div>

                {/* Sub Metrics: ADR e Noites */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-emerald-50/60 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 font-heading block mb-1">
                            Diária Média (ADR)
                        </span>
                        <p className="text-xl sm:text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 font-heading">
                            R$ {metrics.averageDailyRate.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                            R$ {metrics.receivedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} recebidos
                        </p>
                    </div>

                    <div className="bg-blue-50/60 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-200/60 dark:border-blue-800/40">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 font-heading flex items-center gap-1 mb-1">
                            <CalendarCheck size={12} /> Diárias Vendidas
                        </span>
                        <p className="text-xl sm:text-2xl font-extrabold text-blue-900 dark:text-blue-100 font-heading">
                            {metrics.totalNights} noites
                        </p>
                        <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                            {metrics.paidNights} pagas / {metrics.pendingNights} pendentes (R$ {metrics.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                        </p>
                    </div>
                </div>

                {/* BAR CHART GRAPHIC */}
                <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 font-heading block mb-4">
                        Histórico dos Últimos 6 Meses
                    </span>
                    <div className="flex items-end justify-between gap-2 sm:gap-4 h-36 pt-4 px-2">
                        {metrics.monthsData.map((m, idx) => {
                            const heightPct = Math.max(12, Math.round((m.revenue / metrics.maxRevenue) * 100));
                            const isCurrent = idx === metrics.monthsData.length - 1;

                            return (
                                <div key={m.monthName} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                    {/* Tooltip on hover */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap shadow-lg">
                                        R$ {m.revenue.toLocaleString('pt-BR')}
                                    </div>

                                    {/* Bar Column */}
                                    <div className="w-full max-w-[40px] bg-gray-100 dark:bg-gray-700/50 rounded-2xl overflow-hidden h-full flex items-end p-1">
                                        <div
                                            className={`w-full rounded-xl transition-all duration-500 group-hover:brightness-110 ${
                                                isCurrent
                                                    ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 shadow-md shadow-emerald-500/20'
                                                    : 'bg-gradient-to-t from-blue-600 to-indigo-500 opacity-70 group-hover:opacity-100'
                                            }`}
                                            style={{ height: `${heightPct}%` }}
                                        />
                                    </div>

                                    {/* Month Label */}
                                    <span className={`text-[11px] font-extrabold uppercase tracking-wider ${isCurrent ? 'text-emerald-600 dark:text-emerald-400 font-heading' : 'text-gray-400'}`}>
                                        {m.monthName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueTrendWidget;
