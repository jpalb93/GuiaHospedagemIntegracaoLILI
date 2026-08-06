import React, { useMemo } from 'react';
import { Reservation } from '../../types';
import { PROPERTIES } from '../../config/properties';

interface ExcelGridCalendarProps {
    currentDate: Date;
    filteredReservations: Reservation[];
    selectedFlatFilter: string;
    onEditReservation: (res: Reservation) => void;
}

const ExcelGridCalendar: React.FC<ExcelGridCalendarProps> = ({
    currentDate,
    filteredReservations,
    selectedFlatFilter,
    onEditReservation,
}) => {
    // 1. LISTA DE UNIDADES/FLATS EXIBIDAS CONFORME O FILTRO
    const unitsList = useMemo(() => {
        if (selectedFlatFilter === 'lili') {
            return ['Lili'];
        }

        const integracaoUnits = PROPERTIES['integracao'].units || [
            '201',
            '202',
            '301',
            '302',
            '303',
            '304',
            '401',
            '402',
            '403',
            '404',
        ];

        if (selectedFlatFilter === 'integracao') {
            return integracaoUnits;
        }

        if (selectedFlatFilter !== 'all') {
            // Unidade específica
            return [selectedFlatFilter];
        }

        // 'all' -> Exibe apenas os 10 flats de Integração (sem o Flat da Lili)
        return integracaoUnits;
    }, [selectedFlatFilter]);

    // 2. DIAS DO MÊS SELECIONADO
    const daysInMonthCount = useMemo(() => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    }, [currentDate]);

    const daysList = useMemo(() => {
        const list: Date[] = [];
        for (let day = 1; day <= daysInMonthCount; day++) {
            list.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
        }
        return list;
    }, [currentDate, daysInMonthCount]);

    // Formatador auxiliar: 01/08/26
    const formatDayHeader = (date: Date) => {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yy = String(date.getFullYear()).slice(-2);
        return `DIA ${dd}/${mm}/${yy}`;
    };

    // Formatador auxiliar de data de entrada/saída: 01/ago
    const formatDateShort = (dateStr?: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const day = parts[2];
        const monthNum = parseInt(parts[1], 10) - 1;
        const monthNames = [
            'jan',
            'fev',
            'mar',
            'abr',
            'mai',
            'jun',
            'jul',
            'ago',
            'set',
            'out',
            'nov',
            'dez',
        ];
        return `${day}/${monthNames[monthNum] || ''}`;
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-2xl">
            {/* LEGENDA DE CORES E STATUS DA PLANILHA */}
            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                        Legenda da Planilha:
                    </span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-sm"></span>
                        <span className="text-gray-700 dark:text-gray-200">🟢 100% Pago</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm"></span>
                        <span className="text-gray-700 dark:text-gray-200">🟠 Deu Sinal (Parcial)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm"></span>
                        <span className="text-gray-700 dark:text-gray-200">🔴 Pagamento Pendente</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-slate-500 inline-block shadow-sm"></span>
                        <span className="text-gray-700 dark:text-gray-200">Pagamento externo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="bg-red-600 text-white font-black animate-pulse px-1 rounded text-[9px] uppercase">SAÍDA</span>
                        <span className="text-red-600 dark:text-red-400 font-bold animate-pulse">= Dia de Saída (Check-out)</span>
                    </div>
                </div>
            </div>

            {/* GRID DE CARDS POR DIA (LAYOUT PLANILHA EXCEL) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {daysList.map((dateObj) => {
                    const dateStr = dateObj.toLocaleDateString('en-CA');
                    const isToday =
                        dateStr === new Date().toLocaleDateString('en-CA');

                    return (
                        <div
                            key={dateStr}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden transition-all ${
                                isToday
                                    ? 'border-orange-500 ring-2 ring-orange-500/20'
                                    : 'border-gray-300 dark:border-gray-700'
                            }`}
                        >
                            {/* TABELA DO DIA (ESTILO EXCEL) */}
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 text-[11px] font-extrabold text-gray-800 dark:text-gray-200 uppercase tracking-tight">
                                        <th className="py-1.5 px-2 font-mono text-xs border-r border-gray-300 dark:border-gray-700" colSpan={2}>
                                            {formatDayHeader(dateObj)}
                                        </th>
                                        <th className="py-1.5 px-1 text-center w-14 border-r border-gray-300 dark:border-gray-700">
                                            ENTRADA
                                        </th>
                                        <th className="py-1.5 px-1 text-center w-14">
                                            SAIDA
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {unitsList.map((unitKey) => {
                                        // Busca se existe reserva nesta unidade neste dia
                                        const activeRes = filteredReservations.find((res) => {
                                            const isTargetUnit =
                                                unitKey === 'Lili'
                                                    ? (res.propertyId || 'lili') === 'lili'
                                                    : res.flatNumber === unitKey;

                                            if (!isTargetUnit) return false;
                                            if (!res.checkInDate || !res.checkoutDate) return false;

                                            // Ocupado se a data atual estiver entre check-in e check-out
                                            return (
                                                dateStr >= res.checkInDate &&
                                                dateStr <= res.checkoutDate
                                            );
                                        });

                                        if (activeRes) {
                                            const isPaid = activeRes.paymentStatus === 'paid';
                                            const isPartial = activeRes.paymentStatus === 'partial';
                                            const isExternal = activeRes.paymentStatus === 'external';
                                            const isCheckoutDay = dateStr === activeRes.checkoutDate;

                                            // Verde pago, laranja sinal, cinza externo, vermelho pendente
                                            let bgClass = 'bg-red-500 text-white font-bold';
                                            if (isPaid) {
                                                bgClass = 'bg-emerald-600 text-white font-bold';
                                            } else if (isPartial) {
                                                bgClass = 'bg-amber-500 text-white font-bold';
                                            } else if (isExternal) {
                                                bgClass = 'bg-slate-500 text-white font-bold';
                                            }

                                            return (
                                                <tr
                                                    key={unitKey}
                                                    onClick={() => onEditReservation(activeRes)}
                                                    className={`cursor-pointer hover:opacity-90 transition-opacity border-b border-gray-200 dark:border-gray-700 text-xs ${bgClass}`}
                                                    title={`Clique para editar a reserva de ${activeRes.guestName}${
                                                        isCheckoutDay ? ' • DIA DE SAÍDA!' : ''
                                                    }`}
                                                >
                                                    <td className="py-1 px-2 border-r border-white/20 font-extrabold w-12 font-mono shrink-0">
                                                        {unitKey}
                                                    </td>
                                                    <td className="py-1 px-2 border-r border-white/20 truncate max-w-[90px] font-bold">
                                                        {activeRes.guestName}
                                                    </td>
                                                    <td className="py-1 px-1 text-center text-[10px] border-r border-white/20 font-mono font-semibold">
                                                        {formatDateShort(activeRes.checkInDate)}
                                                    </td>
                                                    <td className="py-1 px-1 text-center text-[10px] font-mono font-semibold">
                                                        {isCheckoutDay ? (
                                                            <span className="bg-red-600 text-white font-black animate-pulse px-1 rounded text-[9px] leading-none inline-block uppercase">
                                                                SAÍDA
                                                            </span>
                                                        ) : (
                                                            formatDateShort(activeRes.checkoutDate)
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        // FLAT LIVRE / DESOCUPADO NESTE DIA
                                        return (
                                            <tr
                                                key={unitKey}
                                                className="border-b border-gray-200 dark:border-gray-700/60 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                            >
                                                <td className="py-1 px-2 font-bold font-mono border-r border-gray-200 dark:border-gray-700 w-12 text-gray-500 dark:text-gray-400">
                                                    {unitKey}
                                                </td>
                                                <td className="py-1 px-2 border-r border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600">
                                                    —
                                                </td>
                                                <td className="py-1 px-1 text-center border-r border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600">
                                                    —
                                                </td>
                                                <td className="py-1 px-1 text-center text-gray-300 dark:text-gray-600">
                                                    —
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExcelGridCalendar;
