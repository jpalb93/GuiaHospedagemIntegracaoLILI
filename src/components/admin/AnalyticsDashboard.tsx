import React, { useMemo, useState } from 'react';
import { Reservation } from '../../types';
import { calculateMonthlyStats, MonthlyStats } from '../../utils/analytics';
import { PROPERTIES } from '../../config/properties';
import {
    BarChart,
    DollarSign,
    Phone,
    Printer,
    Share2,
    Filter,
    Building2,
    CheckCircle2,
    AlertCircle,
    Clock,
} from 'lucide-react';
import { formatDateBR } from '../../utils/helpers';

interface AnalyticsDashboardProps {
    reservations: Reservation[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ reservations }) => {
    // FILTROS DO RELATÓRIO DA DONA
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedProperty, setSelectedProperty] = useState<string>('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const stats = useMemo(() => calculateMonthlyStats(reservations), [reservations]);

    // FILTRAGEM INTELIGENTE DE RESERVAS PARA O RELATÓRIO
    const filteredReservations = useMemo(() => {
        return reservations.filter((res) => {
            if (res.status === 'cancelled') return false;

            // Filtro por Mês ou Intervalo Customizado de Datas
            if (startDate && endDate) {
                const resIn = res.checkInDate || '';
                const resOut = res.checkoutDate || '';
                if (resIn > endDate || resOut < startDate) return false;
            } else if (selectedMonth !== 'all') {
                const resMonth = res.checkInDate ? res.checkInDate.substring(0, 7) : '';
                if (resMonth !== selectedMonth) return false;
            }

            // Filtro por Propriedade / Flat Específico
            if (selectedProperty !== 'all') {
                if (selectedProperty === 'lili') {
                    if ((res.propertyId || 'lili') !== 'lili') return false;
                } else if (selectedProperty === 'integracao') {
                    if (res.propertyId !== 'integracao') return false;
                } else {
                    // É um número de Flat específico (ex: '201')
                    if (res.flatNumber !== selectedProperty) return false;
                }
            }

            // Filtro por Status de Pagamento
            if (paymentStatusFilter !== 'all') {
                const currentStatus = res.paymentStatus || 'pending';
                if (currentStatus !== paymentStatusFilter) return false;
            }

            return true;
        }).sort((a, b) => {
            const getFlatNum = (res: Reservation) => {
                if ((res.propertyId || 'lili') === 'lili') return 0;
                const num = parseInt(res.flatNumber || '0', 10);
                return isNaN(num) ? 9999 : num;
            };
            const diff = getFlatNum(a) - getFlatNum(b);
            if (diff !== 0) return diff;
            return (a.checkInDate || '').localeCompare(b.checkInDate || '');
        });
    }, [reservations, selectedMonth, selectedProperty, paymentStatusFilter, startDate, endDate]);

    // CÁLCULO DE TOTAIS FINANCEIROS DO RELATÓRIO
    const financialSummary = useMemo(() => {
        let totalRevenue = 0;
        let paidRevenue = 0;
        let partialRevenue = 0;
        let pendingRevenue = 0;
        let financialCount = 0;

        filteredReservations.forEach((res) => {
            const status = res.paymentStatus || 'pending';
            // Pagamento externo (Airbnb/fora do caixa) não entra no financeiro
            if (status === 'external') return;

            financialCount += 1;
            const total = res.totalAmount || 0;
            const deposit = res.depositAmount || 0;
            totalRevenue += total;

            if (status === 'paid') {
                paidRevenue += total;
            } else if (status === 'partial') {
                paidRevenue += deposit;
                partialRevenue += deposit;
                pendingRevenue += Math.max(0, total - deposit);
            } else {
                pendingRevenue += total;
            }
        });

        return {
            totalRevenue,
            paidRevenue,
            partialRevenue,
            pendingRevenue,
            totalCount: financialCount,
            operationalCount: filteredReservations.length,
        };
    }, [filteredReservations]);

    const reportReservations = useMemo(
        () => filteredReservations.filter((res) => res.paymentStatus !== 'external'),
        [filteredReservations]
    );

    // GERA MENSAGEM DO RELATÓRIO DA DONA PARA COMPARTILHAR NO WHATSAPP
    const handleShareWhatsAppReport = () => {
        const periodText =
            startDate && endDate
                ? `${formatDateBR(startDate)} a ${formatDateBR(endDate)}`
                : selectedMonth !== 'all'
                  ? selectedMonth.split('-').reverse().join('/')
                  : 'Geral (Todo o Período)';

        const propText =
            selectedProperty === 'all'
                ? 'Todos os Flats'
                : selectedProperty === 'lili'
                  ? 'Flat da Lili'
                  : selectedProperty === 'integracao'
                    ? 'Flats Integração'
                    : `Flat ${selectedProperty}`;

        let text = `📊 *RELATÓRIO FINANCEIRO DE RESERVAS*\n`;
        text += `🏠 *Unidade/Escopo:* ${propText}\n`;
        text += `📅 *Período:* ${periodText}\n`;
        text += `--------------------------------\n\n`;

        text += `💰 *RESUMO FINANCEIRO:*\n`;
        text += `💵 *Faturamento Total:* R$ ${financialSummary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        text += `🟢 *Pago:* R$ ${financialSummary.paidRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        text += `🟡 *Sinal Dado:* R$ ${financialSummary.partialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        text += `🔴 *Falta Pagar:* R$ ${financialSummary.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
        text += `📊 *Total de Reservas:* ${financialSummary.totalCount}\n`;
        text += `--------------------------------\n\n`;

        text += `📋 *LISTA DE HÓSPEDES & RESERVAS:*\n`;
        if (reportReservations.length === 0) {
            text += `Nenhuma reserva financeira encontrada para o filtro selecionado.\n`;
        } else {
            reportReservations.forEach((res, index) => {
                const propName = (res.propertyId || 'lili') === 'lili' ? 'Lili' : `Flat ${res.flatNumber || 'N/A'}`;
                const val = res.totalAmount
                    ? `R$ ${res.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'N/A';
                const statusBadge =
                    res.paymentStatus === 'paid'
                        ? '🟢 Pago'
                        : res.paymentStatus === 'partial'
                          ? '🟡 Sinal'
                          : '🔴 Falta Pagar';
                const payMethod = res.paymentMethod ? `(${res.paymentMethod.toUpperCase()})` : '';

                text += `${index + 1}. *${res.guestName}* — ${propName}\n`;
                text += `   📅 ${formatDateBR(res.checkInDate || '')} a ${formatDateBR(res.checkoutDate || '')}\n`;
                text += `   💰 ${val} ${payMethod} — ${statusBadge}\n`;
            });
        }

        const encoded = encodeURIComponent(text);
        window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    };

    const handlePrintReport = () => {
        window.print();
    };

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fadeIn print:p-0 print:space-y-4">
            {/* CABEÇALHO */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart className="text-orange-500" /> Relatório Financeiro & Reservas
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Relatório detalhado por período, flat, telefone, forma de pagamento e valores.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        onClick={handleShareWhatsAppReport}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                    >
                        <Share2 size={16} /> Enviar via WhatsApp
                    </button>
                    <button
                        onClick={handlePrintReport}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-xs shadow-md transition-all"
                    >
                        <Printer size={16} /> Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* PAINEL DE FILTROS AVANÇADOS DA DONA */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden">
                <div className="flex items-center gap-2 font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">
                    <Filter size={14} className="text-orange-500" /> Filtros do Relatório
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {/* FILTRO 1: MÊS / PERÍODO */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Mês Específico
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                setSelectedMonth(e.target.value);
                                setStartDate('');
                                setEndDate('');
                            }}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">Todo o Período</option>
                            {(stats as MonthlyStats[]).map((s) => (
                                <option key={s.month} value={s.month}>
                                    {s.month.split('-').reverse().join('/')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* FILTRO 2: FLAT / PROPRIEDADE */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Flat / Propriedade
                        </label>
                        <select
                            value={selectedProperty}
                            onChange={(e) => setSelectedProperty(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">Geral (Todos os Flats)</option>
                            <option value="lili">Flat da Lili</option>
                            <option value="integracao">Flats Integração (Geral)</option>
                            {PROPERTIES['integracao'].units?.map((u) => (
                                <option key={u} value={u}>
                                    Flat {u}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* FILTRO 3: STATUS DE PAGAMENTO */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Status do Pagamento
                        </label>
                        <select
                            value={paymentStatusFilter}
                            onChange={(e) => setPaymentStatusFilter(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">Todos os Status</option>
                            <option value="paid">🟢 Apenas Pagos</option>
                            <option value="partial">🟡 Apenas com Sinal</option>
                            <option value="pending">🔴 Falta Pagar</option>
                            <option value="external">Pagamento externo</option>
                        </select>
                    </div>

                    {/* FILTRO 4: PERÍODO CUSTOMIZADO (DATA DE -> ATÉ) */}
                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Intervalo de Datas
                        </label>
                        <div className="flex gap-1">
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-1/2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none"
                            />
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-1/2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2 py-2 text-[11px] font-bold text-gray-800 dark:text-gray-200 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CARDS DE RESUMO FINANCEIRO (KPIs DA DONA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* FATURAMENTO TOTAL */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Faturamento Total</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                            R$ {financialSummary.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            {financialSummary.totalCount} reservas no financeiro
                            {financialSummary.operationalCount > financialSummary.totalCount
                                ? ` (${financialSummary.operationalCount - financialSummary.totalCount} externas ocultas)`
                                : ''}
                        </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                        <DollarSign size={24} />
                    </div>
                </div>

                {/* TOTAL PAGO */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">Total Recebido</p>
                        <h3 className="text-2xl font-black text-green-700 dark:text-green-300 mt-1">
                            R$ {financialSummary.paidRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-green-600 dark:text-green-400 mt-0.5">
                            Status 🟢 Pago (100%)
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl">
                        <CheckCircle2 size={24} />
                    </div>
                </div>

                {/* SINAL RECEBIDO */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Sinal / Parcial</p>
                        <h3 className="text-2xl font-black text-amber-700 dark:text-amber-300 mt-1">
                            R$ {financialSummary.partialRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                            Status 🟡 Sinal Dado
                        </p>
                    </div>
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl">
                        <Clock size={24} />
                    </div>
                </div>

                {/* PENDENTE A RECEBER */}
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">Falta Pagar</p>
                        <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">
                            R$ {financialSummary.pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                        <p className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                            Status 🔴 Falta Pagar
                        </p>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl">
                        <AlertCircle size={24} />
                    </div>
                </div>
            </div>

            {/* TABELA DETALHADA DO RELATÓRIO DA DONA */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/40">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <Building2 size={16} className="text-orange-500" />
                        Detalhamento de Reservas ({filteredReservations.length})
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-gray-900/60 text-[11px] font-extrabold uppercase text-gray-500 dark:text-gray-400">
                                <th className="py-3.5 px-4">Hóspede / Contato</th>
                                <th className="py-3.5 px-4">Flat / Unidade</th>
                                <th className="py-3.5 px-4">Período de Estadia</th>
                                <th className="py-3.5 px-4">Pagamento</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Valor Total (R$)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs font-medium">
                            {filteredReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-400">
                                        Nenhuma reserva encontrada para os filtros aplicados.
                                    </td>
                                </tr>
                            ) : (
                                filteredReservations.map((res) => {
                                    const cleanPhone = res.guestPhone ? res.guestPhone.replace(/\D/g, '') : '';
                                    const isLili = (res.propertyId || 'lili') === 'lili';
                                    const unitName = isLili ? 'Flat da Lili' : `Flat ${res.flatNumber || 'N/A'}`;

                                    return (
                                        <tr
                                            key={res.id}
                                            className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                                        >
                                            {/* HÓSPEDE & CONTATO */}
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {res.guestName}
                                                </div>
                                                {res.guestPhone ? (
                                                    <a
                                                        href={`https://wa.me/55${cleanPhone}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-bold hover:underline mt-0.5"
                                                    >
                                                        <Phone size={10} /> {res.guestPhone}
                                                    </a>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400">Sem telefone</span>
                                                )}
                                            </td>

                                            {/* FLAT / UNIDADE */}
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                                                        isLili
                                                            ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300'
                                                    }`}
                                                >
                                                    {unitName}
                                                </span>
                                            </td>

                                            {/* PERÍODO */}
                                            <td className="py-3.5 px-4">
                                                <div className="text-gray-700 dark:text-gray-300 font-bold">
                                                    {formatDateBR(res.checkInDate || '')} a{' '}
                                                    {formatDateBR(res.checkoutDate || '')}
                                                </div>
                                            </td>

                                            {/* FORMA DE PAGAMENTO */}
                                            <td className="py-3.5 px-4">
                                                <span className="uppercase text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    {res.paymentMethod === 'pix'
                                                        ? 'PIX'
                                                        : res.paymentMethod === 'money'
                                                          ? 'Dinheiro / Espécie'
                                                          : res.paymentMethod === 'card'
                                                            ? 'Cartão'
                                                            : 'Não Informado'}
                                                </span>
                                            </td>

                                            {/* STATUS DO PAGAMENTO */}
                                            <td className="py-3.5 px-4">
                                                {res.paymentStatus === 'paid' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/40 dark:text-green-300">
                                                        🟢 Pago
                                                    </span>
                                                )}
                                                {res.paymentStatus === 'partial' && (
                                                    <div className="flex flex-col items-start gap-0.5">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300">
                                                            🟡 Sinal (R$ {(res.depositAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                                                        </span>
                                                        {res.totalAmount !== undefined && (
                                                            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold ml-1">
                                                                Resta R$ {Math.max(0, res.totalAmount - (res.depositAmount || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {res.paymentStatus === 'external' && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/60 dark:text-slate-300">
                                                        Externo
                                                    </span>
                                                )}
                                                {(res.paymentStatus === 'pending' || !res.paymentStatus) && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/40 dark:text-red-300">
                                                        🔴 Falta Pagar
                                                    </span>
                                                )}
                                            </td>

                                            {/* VALOR TOTAL */}
                                            <td className="py-3.5 px-4 text-right">
                                                <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                                                    {res.paymentStatus === 'external'
                                                        ? '—'
                                                        : res.totalAmount !== undefined && res.totalAmount !== null
                                                          ? `R$ ${res.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                                          : 'R$ 0,00'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* GRÁFICO DE OCUPAÇÃO MENSAL (VISÃO COMPLEMENTAR) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 print:hidden">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">
                    Ocupação Mensal (%)
                </h3>
                <div className="h-44 flex items-end gap-2 overflow-x-auto pb-2">
                    {(stats as MonthlyStats[])
                        .slice()
                        .reverse()
                        .map((stat) => (
                            <div
                                key={stat.month}
                                className="group relative flex flex-col items-center gap-2 flex-shrink-0 w-16"
                            >
                                <div
                                    className="w-full bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-800/50 rounded-t-lg transition-all relative"
                                    style={{ height: `${Math.max(10, stat.occupancyRate * 1.5)}px` }}
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
