import React, { useState, useMemo } from 'react';
import { Reservation } from '../../types';
import { PROPERTIES } from '../../config/properties';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface ReservationCalendarProps {
    reservations: Reservation[];
    onEditReservation: (res: Reservation) => void;
}

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ reservations, onEditReservation }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

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

    const getReservationsForDate = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA');
        return reservations.filter(res => {
            if (!res.checkInDate || !res.checkoutDate) return false;
            return dateStr >= res.checkInDate && dateStr < res.checkoutDate; // < checkoutDate because checkout day is free for next guest
        });
    };

    const getCheckoutsForDate = (date: Date) => {
        const dateStr = date.toLocaleDateString('en-CA');
        return reservations.filter(res => res.checkoutDate === dateStr);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
            {/* HEADER */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                    <CalendarIcon size={20} className="text-orange-500" />
                    {monthName}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors">
                        Hoje
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* GRID HEADER */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="p-2 text-center text-xs font-bold text-gray-400 uppercase bg-gray-50 dark:bg-gray-900/30">
                        {day}
                    </div>
                ))}
            </div>

            {/* GRID BODY */}
            <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((date, idx) => {
                    if (!date) return <div key={idx} className="bg-gray-50/50 dark:bg-gray-900/20 border-b border-r border-gray-100 dark:border-gray-800 min-h-[100px]"></div>;

                    const dayReservations = getReservationsForDate(date);
                    const checkouts = getCheckoutsForDate(date);
                    const isToday = date.toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');

                    return (
                        <div key={idx} className={`border-b border-r border-gray-100 dark:border-gray-800 min-h-[100px] p-1 relative group transition-colors ${isToday ? 'bg-orange-50/30 dark:bg-orange-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                            <span className={`text-xs font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center mb-1 ${isToday ? 'bg-orange-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                {date.getDate()}
                            </span>

                            <div className="space-y-1">
                                {/* CHECKOUTS (Small indicator) */}
                                {checkouts.map(res => (
                                    <div key={'out-' + res.id} className="text-[9px] text-gray-400 flex items-center gap-1 px-1 opacity-60">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                        Saída: {res.guestName.split(' ')[0]}
                                    </div>
                                ))}

                                {/* ACTIVE STAYS */}
                                {dayReservations.map(res => {
                                    const isStart = res.checkInDate === date.toLocaleDateString('en-CA');
                                    const isLili = (res.propertyId || 'lili') === 'lili';
                                    const colorClass = isLili
                                        ? 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200'
                                        : 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200';

                                    return (
                                        <button
                                            key={res.id}
                                            onClick={() => onEditReservation(res)}
                                            className={`w-full text-left text-[10px] font-bold px-1.5 py-1 rounded-md border truncate transition-all shadow-sm ${colorClass} ${isStart ? 'ml-0' : ''}`}
                                            title={`${res.guestName} (${PROPERTIES[res.propertyId || 'lili'].name})`}
                                        >
                                            {isStart ? (isLili ? '🏠 ' : '🏢 ') : ''}
                                            {res.guestName.split(' ')[0]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div> Flat da Lili</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div> Flats Integração</div>
            </div>
        </div>
    );
};

export default ReservationCalendar;
