import React from 'react';
import {
    Sparkles,
    User,
    Calendar,
    MapPin,
    Receipt,
    Clock,
    FileSignature,
    CheckCircle2,
} from 'lucide-react';
import { CleaningRecord, Reservation } from '../../types';

interface CompanyInfo {
    name: string;
    address: string;
    logo: string;
}

interface CleaningReportProps {
    companyInfo: CompanyInfo;
    reservation: Reservation;
    cleanings: CleaningRecord[];
}

const CLEANING_TYPE_LABELS: Record<string, string> = {
    full: 'Limpeza Completa',
    linen_change: 'Troca de Enxoval (Toalhas/Lençóis)',
    light: 'Limpeza Leve / Retoque',
    disinfection: 'Desinfecção / Sanitização',
    custom: 'Outro / Personalizado',
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
    paid: {
        label: 'Pago',
        color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
    pending: {
        label: 'Pendente',
        color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    },
    billed_corporate: {
        label: 'Fatura Corporativa',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300',
    },
    courtesy: {
        label: 'Cortesia',
        color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300',
    },
};

const CleaningReport: React.FC<CleaningReportProps> = ({ companyInfo, reservation, cleanings }) => {
    const totalAdditionalCost = cleanings.reduce((sum, item) => sum + (item.cost || 0), 0);

    return (
        <div
            id="cleaning-report-content"
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 rounded-2xl print:bg-white print:text-gray-900 print:p-0 print:rounded-none"
        >
            {/* HEADER WITH LOGO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-gray-300 dark:border-gray-700 pb-4 sm:pb-6 mb-6 gap-3 print:border-black">
                <div className="flex items-center gap-3">
                    <img
                        src={companyInfo.logo}
                        alt={companyInfo.name}
                        className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-lg shrink-0 print:w-20 print:h-20"
                    />
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide leading-tight font-heading">
                            {companyInfo.name}
                        </h1>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {companyInfo.address}
                        </p>
                    </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold inline-block shadow-md uppercase tracking-wider font-heading print:bg-stone-900 print:text-white">
                        RELATÓRIO DE LIMPEZAS ADICIONAIS
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-mono">
                        Emissão: {new Date().toLocaleDateString('pt-BR')} às{' '}
                        {new Date().toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-orange-50/60 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/30 p-4 rounded-xl mb-6 print:bg-gray-100 print:border-gray-300">
                <p className="text-xs sm:text-sm text-stone-700 dark:text-gray-300 leading-relaxed font-medium">
                    Este documento detalha o histórico de serviços de limpeza e manutenção de
                    enxoval solicitados/executados como <strong>Custos Adicionais</strong> durante a
                    estadia.
                </p>
            </div>

            {/* RESERVATION INFO GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden print:border-gray-400 p-4 bg-gray-50/50 dark:bg-gray-800/40">
                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Hóspede / Cliente
                    </p>
                    <p className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 truncate">
                        <User size={14} className="text-orange-500 shrink-0" />
                        <span className="truncate">{reservation.guestName}</span>
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Unidade / Flat
                    </p>
                    <p className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                        <MapPin size={14} className="text-orange-500 shrink-0" />
                        Flat {reservation.flatNumber || 'N/A'}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Período da Estadia
                    </p>
                    <p className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5 font-mono">
                        <Calendar size={14} className="text-orange-500 shrink-0" />
                        {reservation.checkInDate
                            ? reservation.checkInDate.split('-').reverse().join('/')
                            : '—'}{' '}
                        a{' '}
                        {reservation.checkoutDate
                            ? reservation.checkoutDate.split('-').reverse().join('/')
                            : '—'}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Código Reserva
                    </p>
                    <p className="font-mono font-bold text-xs text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Receipt size={14} className="text-orange-500 shrink-0" />
                        {reservation.shortId || reservation.id?.slice(0, 8) || 'N/A'}
                    </p>
                </div>
            </div>

            {/* CLEANINGS TABLE */}
            <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3 flex items-center gap-2 font-heading">
                    <Sparkles size={16} className="text-amber-500" />
                    Histórico de Serviços de Limpeza ({cleanings.length})
                </h3>

                {cleanings.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                        Nenhuma limpeza adicional registrada para esta reserva.
                    </div>
                ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden print:border-gray-400">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 print:bg-gray-200">
                                <tr>
                                    <th className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Data / Hora
                                    </th>
                                    <th className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Serviço / Modalidade
                                    </th>
                                    <th className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Responsável
                                    </th>
                                    <th className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Pagamento
                                    </th>
                                    <th className="py-2.5 px-3 font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-right">
                                        Valor (R$)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {cleanings.map((c) => {
                                    const typeLabel =
                                        c.typeLabel || CLEANING_TYPE_LABELS[c.type] || c.type;
                                    const payInfo = PAYMENT_STATUS_LABELS[c.paymentStatus] || {
                                        label: c.paymentStatus,
                                        color: 'bg-gray-100 text-gray-800',
                                    };
                                    const formattedDate = c.date
                                        ? new Date(c.date + 'T00:00:00').toLocaleDateString('pt-BR')
                                        : '—';

                                    return (
                                        <tr
                                            key={c.id}
                                            className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
                                        >
                                            <td className="py-3 px-3 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock
                                                        size={13}
                                                        className="text-gray-400 shrink-0"
                                                    />
                                                    <span>{formattedDate}</span>
                                                    {c.time && (
                                                        <span className="text-gray-500 text-[11px]">
                                                            ({c.time})
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 font-semibold">
                                                <div>{typeLabel}</div>
                                                {c.notes && (
                                                    <p className="text-[11px] font-normal text-gray-500 dark:text-gray-400 mt-0.5 italic">
                                                        Obs: {c.notes}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="py-3 px-3 text-gray-700 dark:text-gray-300">
                                                {c.cleanerName || '—'}
                                            </td>
                                            <td className="py-3 px-3 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${payInfo.color}`}
                                                >
                                                    {payInfo.label}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right font-bold font-mono text-stone-900 dark:text-white">
                                                R${' '}
                                                {(c.cost || 0).toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* TOTAL CUSTOS ADICIONAIS SUMMARY */}
            <div className="bg-stone-900 text-white dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between gap-4 mb-8 shadow-md print:bg-stone-900 print:text-white">
                <div>
                    <p className="text-xs uppercase tracking-widest text-amber-400 font-bold font-heading">
                        Total em Custos Adicionais (Limpeza)
                    </p>
                    <p className="text-[11px] text-stone-300 mt-0.5">
                        {cleanings.length} serviço(s) registrado(s) para esta reserva
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-extrabold font-mono text-amber-400">
                        R${' '}
                        {totalAdditionalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            {/* SIGNATURE SECTION */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-8 print:border-gray-400">
                <div className="text-center">
                    <div className="h-12 flex items-end justify-center mb-1">
                        <FileSignature className="text-gray-300" size={32} />
                    </div>
                    <div className="border-t border-gray-400 pt-2 mx-8">
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                            Responsável pela Limpeza
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <div className="h-12 flex items-end justify-center mb-1">
                        <CheckCircle2 className="text-gray-300" size={32} />
                    </div>
                    <div className="border-t border-gray-400 pt-2 mx-8">
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">
                            Conferência / Gestão
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleaningReport;
