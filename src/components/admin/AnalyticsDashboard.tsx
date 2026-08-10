import React, { useEffect, useMemo, useState } from 'react';
import { Company, Invoice, Reservation } from '../../types';
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
    Briefcase,
} from 'lucide-react';
import { isExcludedFromReservationCash } from '../../utils/reservationFinance';
import { formatDateBR } from '../../utils/helpers';
import { subscribeToAllInvoices, subscribeToCompanies } from '../../services/firebase';
import {
    filterInvoicesForReport,
    formatCompetenceLabel,
    invoiceBalance,
    summarizeCorporateFinance,
} from '../../utils/corporateFinanceReport';

interface AnalyticsDashboardProps {
    reservations: Reservation[];
}

const money = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const invoiceStatusLabel = (status: Invoice['status']) => {
    switch (status) {
        case 'paid':
            return {
                text: 'Pago',
                className:
                    'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300',
            };
        case 'partial':
            return {
                text: 'Parcial',
                className:
                    'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300',
            };
        case 'overdue':
            return {
                text: 'Vencida',
                className:
                    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300',
            };
        case 'issued':
            return {
                text: 'Emitida',
                className:
                    'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300',
            };
        default:
            return { text: status, className: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ reservations }) => {
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedProperty, setSelectedProperty] = useState<string>('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [companyFilter, setCompanyFilter] = useState<string>('all');
    const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string>('all');

    const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);

    useEffect(() => {
        const unsubInv = subscribeToAllInvoices(setAllInvoices);
        const unsubCo = subscribeToCompanies(setCompanies);
        return () => {
            unsubInv();
            unsubCo();
        };
    }, []);

    const stats = useMemo(() => calculateMonthlyStats(reservations), [reservations]);

    const filteredReservations = useMemo(() => {
        return reservations
            .filter((res) => {
                if (res.status === 'cancelled') return false;

                if (startDate && endDate) {
                    const resIn = res.checkInDate || '';
                    const resOut = res.checkoutDate || '';
                    if (resIn > endDate || resOut < startDate) return false;
                } else if (selectedMonth !== 'all') {
                    const resMonth = res.checkInDate ? res.checkInDate.substring(0, 7) : '';
                    if (resMonth !== selectedMonth) return false;
                }

                if (selectedProperty !== 'all') {
                    if (selectedProperty === 'lili') {
                        if ((res.propertyId || 'lili') !== 'lili') return false;
                    } else if (selectedProperty === 'integracao') {
                        if (res.propertyId !== 'integracao') return false;
                    } else if (res.flatNumber !== selectedProperty) {
                        return false;
                    }
                }

                if (companyFilter !== 'all') {
                    if (res.companyId !== companyFilter) return false;
                }

                if (paymentStatusFilter !== 'all') {
                    const currentStatus = res.paymentStatus || 'pending';
                    if (currentStatus !== paymentStatusFilter) return false;
                }

                return true;
            })
            .sort((a, b) => {
                const getFlatNum = (res: Reservation) => {
                    if ((res.propertyId || 'lili') === 'lili') return 0;
                    const num = parseInt(res.flatNumber || '0', 10);
                    return isNaN(num) ? 9999 : num;
                };
                const diff = getFlatNum(a) - getFlatNum(b);
                if (diff !== 0) return diff;
                return (a.checkInDate || '').localeCompare(b.checkInDate || '');
            });
    }, [
        reservations,
        selectedMonth,
        selectedProperty,
        paymentStatusFilter,
        startDate,
        endDate,
        companyFilter,
    ]);

    /** Caixa avulso — sem externas nem corporativas faturadas */
    const reservationCash = useMemo(() => {
        let totalRevenue = 0;
        let paidRevenue = 0;
        let partialRevenue = 0;
        let pendingRevenue = 0;
        let financialCount = 0;
        let hiddenExternal = 0;
        let hiddenCorporate = 0;

        filteredReservations.forEach((res) => {
            if (isExcludedFromReservationCash(res)) {
                if (res.billingMode === 'corporate' || res.paymentStatus === 'billed') {
                    hiddenCorporate += 1;
                } else {
                    hiddenExternal += 1;
                }
                return;
            }

            financialCount += 1;
            const status = res.paymentStatus || 'pending';
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
            hiddenExternal,
            hiddenCorporate,
        };
    }, [filteredReservations]);

    const filteredInvoices = useMemo(
        () =>
            filterInvoicesForReport(allInvoices, {
                selectedMonth,
                startDate,
                endDate,
                companyId: companyFilter,
                statusFilter: invoiceStatusFilter,
            }),
        [allInvoices, selectedMonth, startDate, endDate, companyFilter, invoiceStatusFilter]
    );

    const corporateSummary = useMemo(
        () => summarizeCorporateFinance(filteredInvoices),
        [filteredInvoices]
    );

    const consolidated = useMemo(() => {
        const billed = reservationCash.totalRevenue + corporateSummary.billedTotal;
        const received = reservationCash.paidRevenue + corporateSummary.receivedTotal;
        const open = reservationCash.pendingRevenue + corporateSummary.openTotal;
        return { billed, received, open };
    }, [reservationCash, corporateSummary]);

    const reportReservations = useMemo(
        () => filteredReservations.filter((res) => !isExcludedFromReservationCash(res)),
        [filteredReservations]
    );

    const companyName = (id: string) => {
        const c = companies.find((x) => x.id === id);
        return c?.tradeName || c?.legalName || id;
    };

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

    const handleShareWhatsAppReport = () => {
        let text = `📊 *RELATÓRIO FINANCEIRO CONSOLIDADO*\n`;
        text += `🏠 *Unidade/Escopo:* ${propText}\n`;
        text += `📅 *Período:* ${periodText}\n`;
        if (companyFilter !== 'all') {
            text += `🏢 *Empresa:* ${companyName(companyFilter)}\n`;
        }
        text += `--------------------------------\n\n`;

        text += `💰 *CONSOLIDADO (avulso + empresas):*\n`;
        text += `💵 *Faturado:* R$ ${money(consolidated.billed)}\n`;
        text += `🟢 *Recebido:* R$ ${money(consolidated.received)}\n`;
        text += `🔴 *Em aberto:* R$ ${money(consolidated.open)}\n`;
        text += `--------------------------------\n\n`;

        text += `🏠 *RESERVAS AVULSAS:*\n`;
        text += `💵 Faturamento: R$ ${money(reservationCash.totalRevenue)}\n`;
        text += `🟢 Recebido: R$ ${money(reservationCash.paidRevenue)}\n`;
        text += `🟡 Sinal: R$ ${money(reservationCash.partialRevenue)}\n`;
        text += `🔴 Falta pagar: R$ ${money(reservationCash.pendingRevenue)}\n`;
        text += `📊 ${reservationCash.totalCount} reservas no caixa`;
        if (reservationCash.hiddenCorporate + reservationCash.hiddenExternal > 0) {
            text += ` (${reservationCash.hiddenCorporate} corporativas + ${reservationCash.hiddenExternal} externas fora do caixa avulso)`;
        }
        text += `\n\n`;

        text += `🏢 *FATURAS EMPRESARIAIS:*\n`;
        text += `💵 Faturado: R$ ${money(corporateSummary.billedTotal)}\n`;
        text += `🟢 Recebido: R$ ${money(corporateSummary.receivedTotal)}\n`;
        text += `🔴 Em aberto: R$ ${money(corporateSummary.openTotal)}\n`;
        text += `📊 ${corporateSummary.invoiceCount} faturas`;
        if (corporateSummary.overdueCount > 0) {
            text += ` (${corporateSummary.overdueCount} vencidas)`;
        }
        text += `\n--------------------------------\n\n`;

        text += `📋 *LISTA DE RESERVAS (caixa):*\n`;
        if (reportReservations.length === 0) {
            text += `Nenhuma reserva avulsa no filtro.\n`;
        } else {
            reportReservations.forEach((res, index) => {
                const unit =
                    (res.propertyId || 'lili') === 'lili'
                        ? 'Lili'
                        : `Flat ${res.flatNumber || 'N/A'}`;
                const val = res.totalAmount ? `R$ ${money(res.totalAmount)}` : 'N/A';
                const statusBadge =
                    res.paymentStatus === 'paid'
                        ? '🟢 Pago'
                        : res.paymentStatus === 'partial'
                          ? '🟡 Sinal'
                          : '🔴 Falta Pagar';
                text += `${index + 1}. *${res.guestName}* — ${unit}\n`;
                text += `   📅 ${formatDateBR(res.checkInDate || '')} a ${formatDateBR(res.checkoutDate || '')}\n`;
                text += `   💰 ${val} — ${statusBadge}\n`;
            });
        }

        if (filteredInvoices.length > 0) {
            text += `\n📋 *FATURAS:*\n`;
            filteredInvoices.forEach((inv, index) => {
                const bal = invoiceBalance(inv.total, inv.amountPaid);
                text += `${index + 1}. *${inv.companyName}* — ${formatCompetenceLabel(inv.competence)}\n`;
                text += `   💵 R$ ${money(inv.total)} | pago R$ ${money(inv.amountPaid)} | aberto R$ ${money(bal)} (${inv.status})\n`;
            });
        }

        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    const handlePrintReport = () => {
        window.print();
    };

    const hiddenNote =
        reservationCash.hiddenCorporate + reservationCash.hiddenExternal > 0
            ? ` (${reservationCash.hiddenCorporate} corporativas + ${reservationCash.hiddenExternal} externas fora do caixa avulso)`
            : '';

    return (
        <div className="p-4 md:p-8 space-y-8 animate-fadeIn print:p-0 print:space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BarChart className="text-orange-500" /> Relatório Financeiro Consolidado
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Reservas avulsas + faturas de empresas, sem contar duas vezes o corporativo.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={handleShareWhatsAppReport}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-all"
                    >
                        <Share2 size={16} /> Enviar via WhatsApp
                    </button>
                    <button
                        type="button"
                        onClick={handlePrintReport}
                        className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-bold text-xs shadow-md transition-all"
                    >
                        <Printer size={16} /> Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* FILTROS */}
            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden">
                <div className="flex items-center gap-2 font-bold text-xs text-gray-400 uppercase tracking-wider mb-3">
                    <Filter size={14} className="text-orange-500" /> Filtros do Relatório
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Status (reservas)
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
                            <option value="billed">Faturado (empresa)</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Empresa
                        </label>
                        <select
                            value={companyFilter}
                            onChange={(e) => setCompanyFilter(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">Todas as empresas</option>
                            {companies
                                .slice()
                                .sort((a, b) =>
                                    (a.tradeName || a.legalName).localeCompare(
                                        b.tradeName || b.legalName
                                    )
                                )
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.tradeName || c.legalName}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 block mb-1">
                            Status (faturas)
                        </label>
                        <select
                            value={invoiceStatusFilter}
                            onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">Todas</option>
                            <option value="open">Em aberto</option>
                            <option value="issued">Emitidas</option>
                            <option value="partial">Parciais</option>
                            <option value="overdue">Vencidas</option>
                            <option value="paid">Pagas</option>
                        </select>
                    </div>

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
                {selectedProperty !== 'all' && (
                    <p className="text-[11px] text-gray-400 mt-3">
                        Filtro de flat afeta só a lista de reservas. Faturas corporativas usam
                        competência (mês) e empresa.
                    </p>
                )}
            </div>

            {/* CONSOLIDADO */}
            <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                    Consolidado (avulso + empresas)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Faturado</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                                R$ {money(consolidated.billed)}
                            </h3>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                Avulso R$ {money(reservationCash.totalRevenue)} + empresas R${' '}
                                {money(corporateSummary.billedTotal)}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">
                                Recebido
                            </p>
                            <h3 className="text-2xl font-black text-green-700 dark:text-green-300 mt-1">
                                R$ {money(consolidated.received)}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl">
                            <CheckCircle2 size={24} />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase">
                                Em aberto
                            </p>
                            <h3 className="text-2xl font-black text-red-700 dark:text-red-300 mt-1">
                                R$ {money(consolidated.open)}
                            </h3>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* AVULSO */}
            <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3">
                    Reservas avulsas (caixa)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <p className="text-xs font-bold text-gray-400 uppercase">Faturamento</p>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                            R$ {money(reservationCash.totalRevenue)}
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            {reservationCash.totalCount} no caixa
                            {hiddenNote}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-sm">
                        <p className="text-xs font-bold text-green-600 uppercase">Recebido</p>
                        <h3 className="text-xl font-black text-green-700 dark:text-green-300 mt-1">
                            R$ {money(reservationCash.paidRevenue)}
                        </h3>
                        <p className="text-[11px] text-green-600 mt-0.5">Pago + sinal recebido</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30 shadow-sm">
                        <p className="text-xs font-bold text-amber-600 uppercase">
                            Sinal / Parcial
                        </p>
                        <h3 className="text-xl font-black text-amber-700 dark:text-amber-300 mt-1">
                            R$ {money(reservationCash.partialRevenue)}
                        </h3>
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-0.5">
                            <Clock size={12} /> Status sinal dado
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
                        <p className="text-xs font-bold text-red-600 uppercase">Falta pagar</p>
                        <h3 className="text-xl font-black text-red-700 dark:text-red-300 mt-1">
                            R$ {money(reservationCash.pendingRevenue)}
                        </h3>
                    </div>
                </div>
            </div>

            {/* CORPORATIVO */}
            <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                    <Briefcase size={14} /> Faturas empresariais
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 shadow-sm">
                        <p className="text-xs font-bold text-indigo-600 uppercase">Faturado</p>
                        <h3 className="text-xl font-black text-indigo-800 dark:text-indigo-200 mt-1">
                            R$ {money(corporateSummary.billedTotal)}
                        </h3>
                        <p className="text-[11px] text-indigo-500 mt-0.5">
                            {corporateSummary.invoiceCount} faturas
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-sm">
                        <p className="text-xs font-bold text-green-600 uppercase">Recebido</p>
                        <h3 className="text-xl font-black text-green-700 dark:text-green-300 mt-1">
                            R$ {money(corporateSummary.receivedTotal)}
                        </h3>
                        <p className="text-[11px] text-green-600 mt-0.5">
                            {corporateSummary.paidCount} quitadas
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm">
                        <p className="text-xs font-bold text-red-600 uppercase">Em aberto</p>
                        <h3 className="text-xl font-black text-red-700 dark:text-red-300 mt-1">
                            R$ {money(corporateSummary.openTotal)}
                        </h3>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-sm">
                        <p className="text-xs font-bold text-orange-600 uppercase">Vencidas</p>
                        <h3 className="text-xl font-black text-orange-700 dark:text-orange-300 mt-1">
                            {corporateSummary.overdueCount}
                        </h3>
                        <p className="text-[11px] text-orange-600 mt-0.5">faturas em atraso</p>
                    </div>
                </div>
            </div>

            {/* TABELA FATURAS */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-indigo-50/40 dark:bg-indigo-950/20">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                        <Briefcase size={16} className="text-indigo-500" />
                        Faturas de empresas ({filteredInvoices.length})
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100/60 dark:bg-gray-900/60 text-[11px] font-extrabold uppercase text-gray-500 dark:text-gray-400">
                                <th className="py-3.5 px-4">Empresa</th>
                                <th className="py-3.5 px-4">Competência</th>
                                <th className="py-3.5 px-4">Vencimento</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Total</th>
                                <th className="py-3.5 px-4 text-right">Pago</th>
                                <th className="py-3.5 px-4 text-right">Aberto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-xs font-medium">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Nenhuma fatura no período/filtro. Emita faturas em Empresas
                                        → contrato.
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((inv) => {
                                    const st = invoiceStatusLabel(inv.status);
                                    const bal = invoiceBalance(inv.total, inv.amountPaid);
                                    return (
                                        <tr
                                            key={inv.id}
                                            className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                                        >
                                            <td className="py-3.5 px-4">
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">
                                                    {inv.companyName}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-gray-700 dark:text-gray-300">
                                                {formatCompetenceLabel(inv.competence)}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-600 dark:text-gray-400">
                                                {formatDateBR(inv.dueDate)}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${st.className}`}
                                                >
                                                    {st.text}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-extrabold text-gray-900 dark:text-white">
                                                R$ {money(inv.total)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-green-700 dark:text-green-300 font-bold">
                                                R$ {money(inv.amountPaid)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right text-red-700 dark:text-red-300 font-bold">
                                                R$ {money(bal)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TABELA RESERVAS */}
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
                                    const cleanPhone = res.guestPhone
                                        ? res.guestPhone.replace(/\D/g, '')
                                        : '';
                                    const isLili = (res.propertyId || 'lili') === 'lili';
                                    const unitName = isLili
                                        ? 'Flat da Lili'
                                        : `Flat ${res.flatNumber || 'N/A'}`;
                                    const isCorporate =
                                        res.billingMode === 'corporate' ||
                                        res.paymentStatus === 'billed';
                                    const isExternal = res.paymentStatus === 'external';

                                    return (
                                        <tr
                                            key={res.id}
                                            className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                                        >
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
                                                    <span className="text-[10px] text-gray-400">
                                                        Sem telefone
                                                    </span>
                                                )}
                                            </td>
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
                                            <td className="py-3.5 px-4">
                                                <div className="text-gray-700 dark:text-gray-300 font-bold">
                                                    {formatDateBR(res.checkInDate || '')} a{' '}
                                                    {formatDateBR(res.checkoutDate || '')}
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="uppercase text-[11px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                                                    {isCorporate
                                                        ? 'Fatura empresa'
                                                        : res.paymentMethod === 'pix'
                                                          ? 'PIX'
                                                          : res.paymentMethod === 'money'
                                                            ? 'Dinheiro / Espécie'
                                                            : res.paymentMethod === 'card'
                                                              ? 'Cartão'
                                                              : res.paymentMethod === 'transfer'
                                                                ? 'Transferência'
                                                                : 'Não Informado'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                {isCorporate && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300">
                                                        Corporativo
                                                    </span>
                                                )}
                                                {res.paymentStatus === 'paid' && !isCorporate && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/40 dark:text-green-300">
                                                        🟢 Pago
                                                    </span>
                                                )}
                                                {res.paymentStatus === 'partial' &&
                                                    !isCorporate && (
                                                        <div className="flex flex-col items-start gap-0.5">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-900/40 dark:text-amber-300">
                                                                🟡 Sinal (R${' '}
                                                                {money(res.depositAmount || 0)})
                                                            </span>
                                                            {res.totalAmount !== undefined && (
                                                                <span className="text-[10px] text-amber-700 dark:text-amber-400 font-extrabold ml-1">
                                                                    Resta R${' '}
                                                                    {money(
                                                                        Math.max(
                                                                            0,
                                                                            res.totalAmount -
                                                                                (res.depositAmount ||
                                                                                    0)
                                                                        )
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                {isExternal && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800/60 dark:text-slate-300">
                                                        Externo
                                                    </span>
                                                )}
                                                {(res.paymentStatus === 'pending' ||
                                                    !res.paymentStatus) &&
                                                    !isCorporate && (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-300 dark:bg-red-900/40 dark:text-red-300">
                                                            🔴 Falta Pagar
                                                        </span>
                                                    )}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                                                    {isExternal || isCorporate
                                                        ? '—'
                                                        : res.totalAmount !== undefined &&
                                                            res.totalAmount !== null
                                                          ? `R$ ${money(res.totalAmount)}`
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
                                    style={{
                                        height: `${Math.max(10, stat.occupancyRate * 1.5)}px`,
                                    }}
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
