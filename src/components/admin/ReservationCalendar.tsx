import React, { useState, useMemo } from 'react';
import { Reservation } from '../../types';
import { PROPERTIES } from '../../config/properties';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Table } from 'lucide-react';
import ExcelGridCalendar from './ExcelGridCalendar';

interface ReservationCalendarProps {
    reservations: Reservation[];
    onEditReservation: (res: Reservation) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
    reservations,
    onEditReservation,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFlatFilter, setSelectedFlatFilter] = useState<string>('all');
    const [calendarView, setCalendarView] = useState<'excel' | 'traditional'>('excel');

    const daysInMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const prevMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

    // FILTRAGEM DE RESERVAS NO CALENDÁRIO POR FLAT/PROPRIEDADE
    const filteredReservations = useMemo(() => {
        return reservations.filter((res) => {
            if (res.status === 'cancelled') return false;

            if (selectedFlatFilter === 'all') return true;
            if (selectedFlatFilter === 'lili') return (res.propertyId || 'lili') === 'lili';
            if (selectedFlatFilter === 'integracao') return res.propertyId === 'integracao';

            // Filtro por unidade específica (ex: '201', '302')
            return res.flatNumber === selectedFlatFilter;
        });
    }, [reservations, selectedFlatFilter]);

    const calendarDays = useMemo(() => {
        const days = [];
        const totalDays = daysInMonth(currentDate);
        const startDay = firstDayOfMonth(currentDate);

        // Empty slots for previous month
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Days of current month
        for (let i = 1; i <= totalDays; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }

        return days;
    }, [currentDate]);

    const sortByFlatNumber = (a: Reservation, b: Reservation) => {
        const getFlatNum = (res: Reservation) => {
            if ((res.propertyId || 'lili') === 'lili') return 0;
            const num = parseInt(res.flatNumber || '0', 10);
            return isNaN(num) ? 9999 : num;
        };
        return getFlatNum(a) - getFlatNum(b);
    };

    const getReservationsForDate = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA');
        return filteredReservations
            .filter((res) => {
                if (!res.checkInDate || !res.checkoutDate) return false;
                return dateStr >= res.checkInDate && dateStr < res.checkoutDate;
            })
            .sort(sortByFlatNumber);
    };

    const getCheckoutsForDate = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA');
        return filteredReservations
            .filter((res) => res.checkoutDate === dateStr)
            .sort(sortByFlatNumber);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
            {/* HEADER NAVEGAÇÃO MÊS */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                    <CalendarIcon size={20} className="text-orange-500" />
                    {monthName}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={prevMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Mês Anterior"
                    >
                        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-3 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                        Hoje
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="Próximo Mês"
                    >
                        <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* BARRA DE FILTRO POR FLAT & MODO DE VISÃO (PLANILHA VS MENSAL) */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
                {/* SELETOR DE MODO DE VISÃO */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => setCalendarView('excel')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                            calendarView === 'excel'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <Table size={14} /> Visão Planilha (Excel)
                    </button>
                    <button
                        type="button"
                        onClick={() => setCalendarView('traditional')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                            calendarView === 'traditional'
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <CalendarIcon size={14} /> Calendário Mensal
                    </button>
                </div>

                {/* FILTRO DE UNIDADES */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter size={14} className="text-orange-500 hidden sm:inline" />
                    <select
                        value={selectedFlatFilter}
                        onChange={(e) => setSelectedFlatFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                        <option value="all">Todas as Unidades (Geral)</option>
                        <option value="lili">Flat da Lili</option>
                        <option value="integracao">Flats Integração (Todos)</option>
                        <optgroup label="Flats Integração Individuais">
                            {PROPERTIES['integracao'].units?.map((unit) => (
                                <option key={unit} value={unit}>
                                    Flat {unit}
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    {selectedFlatFilter !== 'all' && (
                        <button
                            onClick={() => setSelectedFlatFilter('all')}
                            className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors"
                        >
                            Limpar Filtro
                        </button>
                    )}
                </div>
            </div>

            {/* MODO PLANILHA EXCEL (PADRÃO) */}
            {calendarView === 'excel' ? (
                <ExcelGridCalendar
                    currentDate={currentDate}
                    filteredReservations={filteredReservations}
                    selectedFlatFilter={selectedFlatFilter}
                    onEditReservation={onEditReservation}
                />
            ) : (
                /* MODO CALENDÁRIO MENSAL TRADICIONAL */
                <div>
                    {/* GRID HEADER */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div
                        key={day}
                        className="p-2 text-center text-xs font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/30"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* GRID BODY */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((date, idx) => {
                    if (!date)
                        return (
                            <div
                                key={idx}
                                className="bg-gray-50/50 dark:bg-gray-900/20 border-b border-r border-gray-100 dark:border-gray-800 min-h-[100px]"
                            ></div>
                        );

                    const dayReservations = getReservationsForDate(date);
                    const checkouts = getCheckoutsForDate(date);
                    const isToday =
                        date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');

                    return (
                        <div
                            key={idx}
                            className={`border-b border-r border-gray-100 dark:border-gray-800 min-h-[100px] p-1 relative group transition-colors ${
                                isToday
                                    ? 'bg-orange-50/30 dark:bg-orange-900/10'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                            <span
                                className={`text-xs font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center mb-1 ${
                                    isToday
                                        ? 'bg-orange-500 text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                }`}
                            >
                                {date.getDate()}
                            </span>

                            <div className="space-y-1">
                                {/* CHECKOUTS */}
                                {checkouts.map((res) => (
                                    <div
                                        key={'out-' + res.id}
                                        className="text-[9px] text-gray-400 flex items-center gap-1 px-1 opacity-60 truncate"
                                    >
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                                        <span className="truncate">
                                            Saída: {res.guestName.split(' ')[0]}
                                            {res.flatNumber ? ` (${res.flatNumber})` : ''}
                                        </span>
                                    </div>
                                ))}

                                {/* ACTIVE STAYS */}
                                {dayReservations.map((res) => {
                                    const isStart =
                                        res.checkInDate === date.toLocaleDateString('en-CA');
                                    const isLili = (res.propertyId || 'lili') === 'lili';
                                    const colorClass = isLili
                                        ? 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
                                        : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';

                                    const paymentStatusDot =
                                        res.paymentStatus === 'paid'
                                            ? 'bg-green-500'
                                            : res.paymentStatus === 'partial'
                                              ? 'bg-amber-500'
                                              : res.paymentStatus === 'external'
                                                ? 'bg-slate-400'
                                                : 'bg-red-500';

                                    const paymentStatusTitle =
                                        res.paymentStatus === 'paid'
                                            ? 'Pago (100%)'
                                            : res.paymentStatus === 'partial'
                                              ? `Sinal (R$ ${res.depositAmount || 0}${res.totalAmount ? ` | Resta R$ ${Math.max(0, res.totalAmount - (res.depositAmount || 0))}` : ''})`
                                              : res.paymentStatus === 'external'
                                                ? 'Pagamento externo'
                                                : 'Falta Pagar';

                                    const flatLabel = res.flatNumber ? ` (${res.flatNumber})` : '';

                                    return (
                                        <button
                                            key={res.id}
                                            onClick={() => onEditReservation(res)}
                                            className={`w-full text-left text-[10px] font-bold px-1.5 py-1 rounded-md border truncate transition-all shadow-sm flex items-center justify-between gap-1 ${colorClass} ${
                                                isStart ? 'ml-0' : ''
                                            }`}
                                            title={`${res.guestName}${flatLabel} - ${
                                                PROPERTIES[res.propertyId || 'lili'].name
                                            } [${paymentStatusTitle}]`}
                                        >
                                            <span className="truncate">
                                                {isStart ? (isLili ? '🏠 ' : '🏢 ') : ''}
                                                {res.guestName.split(' ')[0]}
                                                {flatLabel}
                                            </span>
                                            <span
                                                className={`w-2 h-2 rounded-full shrink-0 ${paymentStatusDot}`}
                                                title={`Pagamento: ${paymentStatusTitle}`}
                                            ></span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* LEGENDA */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>{' '}
                    Flat da Lili
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div> Flats
                    Integração
                </div>
                <div className="flex items-center gap-2 ml-auto">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Pago
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span> Sinal
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> Falta Pagar
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Externo
                    </span>
                </div>
            </div>
                </div>
            )}
        </div>
    );
};

export default ReservationCalendar;
