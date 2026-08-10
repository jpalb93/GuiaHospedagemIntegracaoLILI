import React, { useState, useMemo, useCallback } from 'react';
import { Reservation } from '../../types';
import { PROPERTIES } from '../../config/properties';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Filter,
    Table,
    LogIn,
    LogOut,
    Home,
    Building2,
    X,
    CalendarDays,
    Info,
} from 'lucide-react';
import ExcelGridCalendar from './ExcelGridCalendar';

interface ReservationCalendarProps {
    reservations: Reservation[];
    onEditReservation: (res: Reservation) => void;
}

interface CalendarDayItem {
    date: Date;
    dateStr: string;
    isCurrentMonth: boolean;
    isToday: boolean;
    isWeekend: boolean;
    dayNumber: number;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({
    reservations,
    onEditReservation,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFlatFilter, setSelectedFlatFilter] = useState<string>('all');
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
    const [calendarView, setCalendarView] = useState<'excel' | 'traditional'>('excel');
    const [selectedDayModalDate, setSelectedDayModalDate] = useState<Date | null>(null);

    const prevMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const goToToday = () => setCurrentDate(new Date());

    // Month Name Format (ex: "Agosto de 2026")
    const formattedMonthName = useMemo(() => {
        const raw = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return raw.charAt(0).toUpperCase() + raw.slice(1);
    }, [currentDate]);

    // FILTRAGEM DAS RESERVAS
    const filteredReservations = useMemo(() => {
        return reservations.filter((res) => {
            if (res.status === 'cancelled') return false;

            // Filtro por Unidade / Propriedade
            if (selectedFlatFilter === 'lili' && (res.propertyId || 'lili') !== 'lili')
                return false;
            if (selectedFlatFilter === 'integracao' && res.propertyId !== 'integracao')
                return false;
            if (
                selectedFlatFilter !== 'all' &&
                selectedFlatFilter !== 'lili' &&
                selectedFlatFilter !== 'integracao' &&
                res.flatNumber !== selectedFlatFilter
            ) {
                return false;
            }

            // Filtro por Status de Pagamento
            if (paymentStatusFilter !== 'all' && res.paymentStatus !== paymentStatusFilter) {
                return false;
            }

            return true;
        });
    }, [reservations, selectedFlatFilter, paymentStatusFilter]);

    // GERAÇÃO DOS DIAS DA GRADE DO CALENDÁRIO (INCLUINDO DIAS DOS MESES ANTERIOR E PRÓXIMO)
    const calendarGridDays = useMemo(() => {
        const days: CalendarDayItem[] = [];
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfWeek = new Date(year, month, 1).getDay();
        const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthTotalDays = new Date(year, month, 0).getDate();

        const todayStr = new Date().toLocaleDateString('en-CA');

        // Dias do mês anterior para preencher a primeira semana
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const dayNum = prevMonthTotalDays - i;
            const date = new Date(year, month - 1, dayNum);
            const dateStr = date.toLocaleDateString('en-CA');
            const dayOfWeek = date.getDay();
            days.push({
                date,
                dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                dayNumber: dayNum,
            });
        }

        // Dias do mês atual
        for (let dayNum = 1; dayNum <= totalDaysInMonth; dayNum++) {
            const date = new Date(year, month, dayNum);
            const dateStr = date.toLocaleDateString('en-CA');
            const dayOfWeek = date.getDay();
            days.push({
                date,
                dateStr,
                isCurrentMonth: true,
                isToday: dateStr === todayStr,
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                dayNumber: dayNum,
            });
        }

        // Dias do mês seguinte para fechar as colunas (grade de 7 colunas)
        const totalGridSlots = days.length;
        const remainder = totalGridSlots % 7;
        const daysToFillNextMonth = remainder === 0 ? 0 : 7 - remainder;

        for (let dayNum = 1; dayNum <= daysToFillNextMonth; dayNum++) {
            const date = new Date(year, month + 1, dayNum);
            const dateStr = date.toLocaleDateString('en-CA');
            const dayOfWeek = date.getDay();
            days.push({
                date,
                dateStr,
                isCurrentMonth: false,
                isToday: dateStr === todayStr,
                isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
                dayNumber: dayNum,
            });
        }

        return days;
    }, [currentDate]);

    // MÉTODOS DE ORDENAÇÃO E AGRUPAMENTO POR DATA
    const sortByFlatNumber = (a: Reservation, b: Reservation) => {
        const getFlatNum = (res: Reservation) => {
            if ((res.propertyId || 'lili') === 'lili') return 0;
            const num = parseInt(res.flatNumber || '0', 10);
            return isNaN(num) ? 9999 : num;
        };
        return getFlatNum(a) - getFlatNum(b);
    };

    const getDayEvents = useCallback(
        (dateStr: string) => {
            const checkouts = filteredReservations
                .filter((res) => res.checkoutDate === dateStr)
                .sort(sortByFlatNumber);

            const checkins = filteredReservations
                .filter((res) => res.checkInDate === dateStr)
                .sort(sortByFlatNumber);

            const continuing = filteredReservations
                .filter((res) => {
                    if (!res.checkInDate || !res.checkoutDate) return false;
                    return dateStr > res.checkInDate && dateStr < res.checkoutDate;
                })
                .sort(sortByFlatNumber);

            return {
                checkouts,
                checkins,
                continuing,
                total: checkouts.length + checkins.length + continuing.length,
            };
        },
        [filteredReservations]
    );

    // ESTATÍSTICAS DO MÊS SELECIONADO
    const monthStats = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const startStr = new Date(year, month, 1).toLocaleDateString('en-CA');
        const endStr = new Date(year, month + 1, 0).toLocaleDateString('en-CA');

        let checkinsCount = 0;
        let checkoutsCount = 0;
        let activeMonthReservations = 0;

        filteredReservations.forEach((res) => {
            if (!res.checkInDate || !res.checkoutDate) return;
            if (res.checkInDate >= startStr && res.checkInDate <= endStr) checkinsCount++;
            if (res.checkoutDate >= startStr && res.checkoutDate <= endStr) checkoutsCount++;
            if (res.checkInDate <= endStr && res.checkoutDate >= startStr)
                activeMonthReservations++;
        });

        return { checkinsCount, checkoutsCount, activeMonthReservations };
    }, [currentDate, filteredReservations]);

    // RENDERIZADOR DO DOT DE STATUS DE PAGAMENTO (WCAG ACCESSIBLE)
    const renderPaymentBadge = (status?: string) => {
        switch (status) {
            case 'paid':
                return (
                    <span
                        className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ring-2 ring-emerald-200 dark:ring-emerald-950"
                        title="Status: Pago (100%)"
                    />
                );
            case 'partial':
                return (
                    <span
                        className="w-2 h-2 rounded-full bg-amber-500 shrink-0 ring-2 ring-amber-200 dark:ring-amber-950"
                        title="Status: Sinal (Parcial)"
                    />
                );
            case 'external':
                return (
                    <span
                        className="w-2 h-2 rounded-full bg-slate-400 shrink-0 ring-2 ring-slate-200 dark:ring-slate-900"
                        title="Status: Pagamento Externo"
                    />
                );
            default:
                return (
                    <span
                        className="w-2 h-2 rounded-full bg-rose-500 shrink-0 ring-2 ring-rose-200 dark:ring-rose-950 animate-pulse"
                        title="Status: Falta Pagar"
                    />
                );
        }
    };

    // DADOS DO DIA SELECIONADO PARA O MODAL
    const selectedDayEvents = useMemo(() => {
        if (!selectedDayModalDate) return null;
        const dateStr = selectedDayModalDate.toLocaleDateString('en-CA');
        return getDayEvents(dateStr);
    }, [selectedDayModalDate, getDayEvents]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn transition-all">
            {/* HEADER NAVEGAÇÃO & PAINEL SUPERIOR */}
            <div className="p-4 md:p-5 border-b border-gray-200 dark:border-gray-700 bg-slate-50/80 dark:bg-gray-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl border border-orange-500/20">
                        <CalendarIcon size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {formattedMonthName}
                        </h2>
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                            <span>{monthStats.activeMonthReservations} reservas neste mês</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {monthStats.checkinsCount} check-ins
                            </span>
                            <span>•</span>
                            <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                {monthStats.checkoutsCount} saídas
                            </span>
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO ENTRE MESES */}
                <div className="flex items-center gap-2 self-start md:self-auto bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xs">
                    <button
                        type="button"
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all active:scale-95"
                        title="Mês Anterior"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={goToToday}
                        className="px-3 py-1 text-xs font-bold bg-orange-500 text-white rounded-lg hover:bg-orange-600 shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                    >
                        <CalendarDays size={13} /> Hoje
                    </button>
                    <button
                        type="button"
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-700 dark:text-gray-300 transition-all active:scale-95"
                        title="Próximo Mês"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* BARRA DE FILTROS E ALTERNÂNCIA DE MODO */}
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-wrap items-center justify-between gap-3">
                {/* SELETOR DE VISÃO (PLANILHA VS MENSAL TRADICIONAL) */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={() => setCalendarView('traditional')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            calendarView === 'traditional'
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <CalendarIcon size={14} /> Calendário Mensal
                    </button>
                    <button
                        type="button"
                        onClick={() => setCalendarView('excel')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            calendarView === 'excel'
                                ? 'bg-orange-500 text-white shadow-xs'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        <Table size={14} /> Visão Planilha (Excel)
                    </button>
                </div>

                {/* GRUPO DE FILTROS (UNIDADE + PAGAMENTO) */}
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1">
                        <Filter size={13} className="text-orange-500" />
                        <select
                            value={selectedFlatFilter}
                            onChange={(e) => setSelectedFlatFilter(e.target.value)}
                            className="bg-transparent text-xs font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
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
                    </div>

                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-800 dark:text-gray-200 outline-none cursor-pointer"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="paid">🟢 Pago (100%)</option>
                        <option value="partial">🟠 Sinal (Parcial)</option>
                        <option value="unpaid">🔴 Falta Pagar</option>
                        <option value="external">⚪ Pagamento Externo</option>
                    </select>

                    {(selectedFlatFilter !== 'all' || paymentStatusFilter !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedFlatFilter('all');
                                setPaymentStatusFilter('all');
                            }}
                            className="px-2.5 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
            </div>

            {/* EXIBIÇÃO: MODO PLANILHA OU MODO TRADICIONAL */}
            {calendarView === 'excel' ? (
                <ExcelGridCalendar
                    currentDate={currentDate}
                    filteredReservations={filteredReservations}
                    selectedFlatFilter={selectedFlatFilter}
                    onEditReservation={onEditReservation}
                />
            ) : (
                /* MODO CALENDÁRIO MENSAL TRADICIONAL REDESENHADO */
                <div>
                    {/* DIAS DA SEMANA */}
                    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 text-center font-bold text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, idx) => (
                            <div
                                key={day}
                                className={`py-2.5 border-r border-gray-100 dark:border-gray-800 last:border-r-0 ${
                                    idx === 0 || idx === 6
                                        ? 'bg-orange-50/20 dark:bg-orange-950/10 text-orange-600/80 dark:text-orange-400/80'
                                        : ''
                                }`}
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* GRADE DE DIAS DO MÊS */}
                    <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 dark:bg-gray-900/50 gap-[1px]">
                        {calendarGridDays.map((dayItem, idx) => {
                            const { date, dateStr, isCurrentMonth, isToday, isWeekend, dayNumber } =
                                dayItem;
                            const events = getDayEvents(dateStr);
                            const { checkouts, checkins, continuing, total } = events;

                            const maxVisible = 3;
                            let renderedCount = 0;

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-[110px] md:min-h-[135px] p-1.5 bg-white dark:bg-gray-800 transition-all flex flex-col justify-between group ${
                                        !isCurrentMonth
                                            ? 'bg-gray-50/60 dark:bg-gray-900/30 opacity-40'
                                            : isToday
                                              ? 'ring-2 ring-orange-500/50 bg-orange-50/30 dark:bg-orange-950/20 z-10'
                                              : isWeekend
                                                ? 'bg-slate-50/40 dark:bg-gray-850'
                                                : 'hover:bg-slate-50/60 dark:hover:bg-gray-750'
                                    }`}
                                >
                                    {/* CABEÇALHO DO DIA (NÚMERO DA DATA + BADGE SE HOJE OU TOTAL) */}
                                    <div className="flex items-center justify-between mb-1">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDayModalDate(date)}
                                            className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                                                isToday
                                                    ? 'bg-orange-500 text-white font-extrabold shadow-xs'
                                                    : isCurrentMonth
                                                      ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                                      : 'text-gray-400 dark:text-gray-600'
                                            }`}
                                        >
                                            {dayNumber}
                                        </button>

                                        {total > 0 && isCurrentMonth && (
                                            <span
                                                onClick={() => setSelectedDayModalDate(date)}
                                                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 cursor-pointer hover:bg-orange-100 hover:text-orange-700 transition-colors"
                                                title="Clique para ver o resumo do dia"
                                            >
                                                {total} {total === 1 ? 'item' : 'itens'}
                                            </span>
                                        )}
                                    </div>

                                    {/* LISTA DE RESERVAS DO DIA (CHECKOUTS, CHECKINS, MEIO) */}
                                    <div className="space-y-1 overflow-hidden flex-1">
                                        {/* 1. CHECK-OUTS DO DIA (SAÍDAS DESTACADAS COM ALTO CONTRASTE) */}
                                        {checkouts.map((res: Reservation) => {
                                            if (renderedCount >= maxVisible) return null;
                                            renderedCount++;

                                            const guestFirstName = res.guestName.split(' ')[0];
                                            const flatLabel = res.flatNumber ? res.flatNumber : '';

                                            return (
                                                <button
                                                    key={'out-' + res.id}
                                                    type="button"
                                                    onClick={() => onEditReservation(res)}
                                                    className="w-full text-left text-[10px] font-extrabold px-1.5 py-1 rounded-md border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/70 transition-all shadow-2xs flex items-center justify-between gap-1 truncate group/btn"
                                                    title={`Saída (Check-out): ${res.guestName} - Flat ${flatLabel}`}
                                                >
                                                    <span className="truncate flex items-center gap-1">
                                                        <LogOut
                                                            size={10}
                                                            className="text-rose-600 shrink-0"
                                                        />
                                                        <span className="opacity-90 font-mono">
                                                            {flatLabel ? `${flatLabel} ` : ''}
                                                        </span>
                                                        <span className="truncate">
                                                            {guestFirstName}
                                                        </span>
                                                    </span>
                                                    {renderPaymentBadge(res.paymentStatus)}
                                                </button>
                                            );
                                        })}

                                        {/* 2. CHECK-INS DO DIA (ENTRADAS) */}
                                        {checkins.map((res: Reservation) => {
                                            if (renderedCount >= maxVisible) return null;
                                            renderedCount++;

                                            const guestFirstName = res.guestName.split(' ')[0];
                                            const flatLabel = res.flatNumber ? res.flatNumber : '';

                                            return (
                                                <button
                                                    key={'in-' + res.id}
                                                    type="button"
                                                    onClick={() => onEditReservation(res)}
                                                    className="w-full text-left text-[10px] font-extrabold px-1.5 py-1 rounded-l-md rounded-r-xs border border-l-4 border-l-emerald-500 border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-100 dark:hover:bg-emerald-900/70 transition-all shadow-2xs flex items-center justify-between gap-1 truncate"
                                                    title={`Entrada (Check-in): ${res.guestName} - Flat ${flatLabel}`}
                                                >
                                                    <span className="truncate flex items-center gap-1">
                                                        <LogIn
                                                            size={10}
                                                            className="text-emerald-600 shrink-0"
                                                        />
                                                        <span className="opacity-90 font-mono">
                                                            {flatLabel ? `${flatLabel} ` : ''}
                                                        </span>
                                                        <span className="truncate">
                                                            {guestFirstName}
                                                        </span>
                                                    </span>
                                                    {renderPaymentBadge(res.paymentStatus)}
                                                </button>
                                            );
                                        })}

                                        {/* 3. PERMANÊNCIAS CONTINUAS (HOSPEDADOS NO MEIO DA ESTADIA) */}
                                        {continuing.map((res: Reservation) => {
                                            if (renderedCount >= maxVisible) return null;
                                            renderedCount++;

                                            const isLili = (res.propertyId || 'lili') === 'lili';
                                            const guestFirstName = res.guestName.split(' ')[0];
                                            const flatLabel = res.flatNumber ? res.flatNumber : '';

                                            const colorStyle = isLili
                                                ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100'
                                                : 'bg-sky-50 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800/50 hover:bg-sky-100';

                                            return (
                                                <button
                                                    key={'stay-' + res.id}
                                                    type="button"
                                                    onClick={() => onEditReservation(res)}
                                                    className={`w-full text-left text-[10px] font-semibold px-1.5 py-0.5 rounded-xs border-x-0 border-y transition-all flex items-center justify-between gap-1 truncate ${colorStyle}`}
                                                    title={`Hospedado: ${res.guestName} - Flat ${flatLabel}`}
                                                >
                                                    <span className="truncate flex items-center gap-1">
                                                        {isLili ? (
                                                            <Home
                                                                size={9}
                                                                className="shrink-0 opacity-75"
                                                            />
                                                        ) : (
                                                            <Building2
                                                                size={9}
                                                                className="shrink-0 opacity-75"
                                                            />
                                                        )}
                                                        <span className="font-mono font-bold text-[9.5px]">
                                                            {flatLabel || 'Flat'}
                                                        </span>
                                                        <span className="truncate opacity-90">
                                                            {guestFirstName}
                                                        </span>
                                                    </span>
                                                    {renderPaymentBadge(res.paymentStatus)}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* BOTÃO OVERFLOW DE ITENS RESTANTES */}
                                    {total > maxVisible && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDayModalDate(date)}
                                            className="w-full text-center text-[9px] font-extrabold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 py-0.5 rounded border border-orange-200 dark:border-orange-900/40 transition-colors mt-1"
                                        >
                                            + {total - maxVisible} mais...
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* BARRA INFERIOR DE LEGENDA E EXPLICAÇÕES (DESIGN PRINCIPLES COMPLIANT) */}
                    <div className="p-3 bg-slate-50 dark:bg-gray-900/60 border-t border-gray-200 dark:border-gray-700 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-4 flex-wrap">
                            <span className="font-bold text-gray-800 dark:text-gray-200 text-[11px] uppercase tracking-wider">
                                Legenda:
                            </span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 dark:bg-emerald-950 dark:border-emerald-700 inline-flex items-center justify-center">
                                    <LogIn
                                        size={8}
                                        className="text-emerald-700 dark:text-emerald-300"
                                    />
                                </span>
                                <span>Entrada (Check-in)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300 dark:bg-rose-950 dark:border-rose-700 inline-flex items-center justify-center">
                                    <LogOut size={8} className="text-rose-700 dark:text-rose-300" />
                                </span>
                                <span>Saída (Check-out)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300 dark:bg-amber-950 dark:border-amber-700 inline-block" />
                                <span>Flat da Lili</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded bg-sky-100 border border-sky-300 dark:bg-sky-950 dark:border-sky-700 inline-block" />
                                <span>Flats Integração</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 ml-auto">
                            <span className="flex items-center gap-1 text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" /> 100% Pago
                            </span>
                            <span className="flex items-center gap-1 text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-amber-500" /> Sinal Parcial
                            </span>
                            <span className="flex items-center gap-1 text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-rose-500" /> Falta Pagar
                            </span>
                            <span className="flex items-center gap-1 text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-slate-400" /> Externo
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE DETALHES DO DIA SELECIONADO */}
            {selectedDayModalDate && selectedDayEvents && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-lg w-full overflow-hidden">
                        {/* HEADER DO MODAL */}
                        <div className="p-4 bg-slate-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-extrabold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                                    <CalendarIcon size={18} className="text-orange-500" />
                                    {selectedDayModalDate.toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Resumo completo das movimentações desta data
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedDayModalDate(null)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* CORPO DO MODAL (LISTA DE ENTRADAS, PERMANÊNCIAS E SAÍDAS) */}
                        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                            {selectedDayEvents.total === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400 space-y-2">
                                    <Info size={32} className="mx-auto text-gray-400 opacity-60" />
                                    <p className="text-sm font-semibold">
                                        Nenhuma reserva ou movimentação agendada para este dia.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* SEÇÃO: SAÍDAS (CHECK-OUTS) */}
                                    {selectedDayEvents.checkouts.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <LogOut size={14} /> Saídas Programadas (
                                                {selectedDayEvents.checkouts.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedDayEvents.checkouts.map(
                                                    (res: Reservation) => (
                                                        <div
                                                            key={'modal-out-' + res.id}
                                                            onClick={() => {
                                                                setSelectedDayModalDate(null);
                                                                onEditReservation(res);
                                                            }}
                                                            className="p-3 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <span>{res.guestName}</span>
                                                                    <span className="text-xs px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-mono">
                                                                        Flat{' '}
                                                                        {res.flatNumber || 'S/N'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    Estadia: {res.checkInDate} até{' '}
                                                                    {res.checkoutDate}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                {renderPaymentBadge(
                                                                    res.paymentStatus
                                                                )}
                                                                <span className="text-[10px] font-bold block mt-1 text-rose-700 dark:text-rose-300">
                                                                    Saída Hoje
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: ENTRADAS (CHECK-INS) */}
                                    {selectedDayEvents.checkins.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <LogIn size={14} /> Entradas Programadas (
                                                {selectedDayEvents.checkins.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedDayEvents.checkins.map(
                                                    (res: Reservation) => (
                                                        <div
                                                            key={'modal-in-' + res.id}
                                                            onClick={() => {
                                                                setSelectedDayModalDate(null);
                                                                onEditReservation(res);
                                                            }}
                                                            className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <span>{res.guestName}</span>
                                                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-mono">
                                                                        Flat{' '}
                                                                        {res.flatNumber || 'S/N'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    Estadia: {res.checkInDate} até{' '}
                                                                    {res.checkoutDate}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                {renderPaymentBadge(
                                                                    res.paymentStatus
                                                                )}
                                                                <span className="text-[10px] font-bold block mt-1 text-emerald-700 dark:text-emerald-300">
                                                                    Check-in Hoje
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* SEÇÃO: HOSPEDADOS (PERMANÊNCIA) */}
                                    {selectedDayEvents.continuing.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                <Home size={14} /> Em Hospedagem (
                                                {selectedDayEvents.continuing.length})
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedDayEvents.continuing.map(
                                                    (res: Reservation) => (
                                                        <div
                                                            key={'modal-cont-' + res.id}
                                                            onClick={() => {
                                                                setSelectedDayModalDate(null);
                                                                onEditReservation(res);
                                                            }}
                                                            className="p-3 bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                                                        >
                                                            <div>
                                                                <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                                                    <span>{res.guestName}</span>
                                                                    <span className="text-xs px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-200 font-mono">
                                                                        Flat{' '}
                                                                        {res.flatNumber || 'S/N'}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                    Check-in: {res.checkInDate} |
                                                                    Saída: {res.checkoutDate}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {renderPaymentBadge(
                                                                    res.paymentStatus
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* FOOTER DO MODAL */}
                        <div className="p-3 bg-slate-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-right">
                            <button
                                type="button"
                                onClick={() => setSelectedDayModalDate(null)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl text-xs font-bold transition-colors"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReservationCalendar;
