import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { subscribeToFutureReservations } from '../../services/firebase/reservations';
import { subscribeToFutureBlockedDates } from '../../services/firebase/blockedDates';
import { Reservation, BlockedDateRange } from '../../types';

const AvailabilityCalendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);

    useEffect(() => {
        const unsubscribeRes = subscribeToFutureReservations((data) => {
            setReservations(data);
        });
        const unsubscribeBlocked = subscribeToFutureBlockedDates((data) => {
            setBlockedDates(data);
        });
        return () => {
            unsubscribeRes();
            unsubscribeBlocked();
        };
    }, []);

    const isDateOccupied = (date: Date) => {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);
        const targetTime = target.getTime();

        const isReserved = reservations.some((res) => {
            if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return false;
            const [inY, inM, inD] = res.checkInDate.split('-').map(Number);
            const [outY, outM, outD] = res.checkoutDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime < end.getTime();
        });

        if (isReserved) return true;

        const isBlocked = blockedDates.some((block) => {
            if (!block.startDate || !block.endDate) return false;
            const [inY, inM, inD] = block.startDate.split('-').map(Number);
            const [outY, outM, outD] = block.endDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime <= end.getTime();
        });

        return isBlocked;
    };

    const nextMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () =>
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const daysArray: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));

    const monthNames = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];

    return (
        <div className="w-full bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={prevMonth}
                    className="p-3 hover:bg-gray-100 rounded-full transition-all"
                    aria-label="Mês anterior"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h4 className="font-heading font-bold text-gray-900 capitalize text-xl md:text-2xl">
                    {monthNames[month]} <span className="text-gray-400 font-light">{year}</span>
                </h4>
                <button
                    onClick={nextMonth}
                    className="p-3 hover:bg-gray-100 rounded-full transition-all"
                    aria-label="Próximo mês"
                >
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div
                        key={i}
                        className="text-xs font-bold text-gray-400 uppercase tracking-widest"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2">
                {daysArray.map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const isOccupied = isDateOccupied(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                        <div
                            key={idx}
                            className={`
                        aspect-square flex items-center justify-center rounded-xl text-sm font-medium relative transition-all duration-300
                        ${
                            isOccupied
                                ? 'bg-red-50 text-red-300 cursor-not-allowed'
                                : isPast
                                  ? 'text-gray-200 cursor-not-allowed'
                                  : 'bg-gray-50 text-gray-700 hover:bg-gray-900 hover:text-white cursor-pointer'
                        } 
                        ${isToday ? 'ring-1 ring-gray-900 font-bold' : ''}
                     `}
                        >
                            {date.getDate()}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center gap-6 mt-8 text-xs font-medium text-gray-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                    Disponível
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-100"></div>
                    Ocupado
                </div>
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
