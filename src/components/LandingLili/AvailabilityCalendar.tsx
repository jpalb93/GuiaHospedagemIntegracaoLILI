import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { subscribeToFutureReservations, subscribeToFutureBlockedDates } from '../../services/firebase';
import { Reservation, BlockedDateRange } from '../../types';

interface AvailabilityCalendarProps {
    onRangeSelect?: (start: Date | null, end: Date | null) => void;
    selectedStart?: Date | null;
    selectedEnd?: Date | null;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ onRangeSelect, selectedStart, selectedEnd }) => {
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

        // 1. Checa Reservas
        const isReserved = reservations.some(res => {
            if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return false;
            const [inY, inM, inD] = res.checkInDate.split('-').map(Number);
            const [outY, outM, outD] = res.checkoutDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime < end.getTime();
        });

        if (isReserved) return true;

        // 2. Checa Bloqueios Administrativos
        const isBlocked = blockedDates.some(block => {
            if (!block.startDate || !block.endDate) return false;
            const [inY, inM, inD] = block.startDate.split('-').map(Number);
            const [outY, outM, outD] = block.endDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime <= end.getTime();
        });

        return isBlocked;
    };

    const handleDateClick = (date: Date) => {
        if (!onRangeSelect) return;
        if (isDateOccupied(date)) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) return;

        // Se já tiver start e end, ou nenhum, começa novo range
        if ((selectedStart && selectedEnd) || (!selectedStart && !selectedEnd)) {
            onRangeSelect(date, null);
            return;
        }

        // Se só tem start
        if (selectedStart && !selectedEnd) {
            if (date < selectedStart) {
                // Clicou antes do start, vira novo start
                onRangeSelect(date, null);
            } else if (date.getTime() === selectedStart.getTime()) {
                // Clicou no mesmo dia, deseleciona
                onRangeSelect(null, null);
            } else {
                // Clicou depois, fecha o range
                // Verifica se tem dias ocupados no meio
                let hasOccupied = false;
                const check = new Date(selectedStart);
                while (check < date) {
                    check.setDate(check.getDate() + 1);
                    if (isDateOccupied(check)) {
                        hasOccupied = true;
                        break;
                    }
                }

                if (hasOccupied) {
                    alert("O período selecionado contém datas indisponíveis.");
                    onRangeSelect(date, null); // Reinicia no clique
                } else {
                    onRangeSelect(selectedStart, date);
                }
            }
        }
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const daysArray: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="w-full">
            {/* Header do Calendário */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Mês anterior">
                    <ChevronLeft size={20} className="text-gray-600" />
                </button>
                <h4 className="font-bold text-gray-800 capitalize">
                    {monthNames[month]} {year}
                </h4>
                <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors" aria-label="Próximo mês">
                    <ChevronRight size={20} className="text-gray-600" />
                </button>
            </div>

            {/* Grid Dias da Semana */}
            <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs font-bold text-gray-400">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Dias */}
            <div className="grid grid-cols-7 gap-1">
                {daysArray.map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const isOccupied = isDateOccupied(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                    // Lógica de Seleção Visual
                    const isSelectedStart = selectedStart && date.getTime() === selectedStart.getTime();
                    const isSelectedEnd = selectedEnd && date.getTime() === selectedEnd.getTime();
                    const isInRange = selectedStart && selectedEnd && date > selectedStart && date < selectedEnd;
                    const isSelected = isSelectedStart || isSelectedEnd || isInRange;

                    return (
                        <div
                            key={idx}
                            onClick={() => !isOccupied && !isPast && handleDateClick(date)}
                            className={`
                        aspect-square flex items-center justify-center rounded-lg text-sm font-medium relative transition-all
                        ${isOccupied
                                    ? 'bg-red-100 text-red-400 cursor-not-allowed'
                                    : isPast
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'cursor-pointer hover:scale-105 font-bold'
                                } 
                        ${!isOccupied && !isPast && !isSelected ? 'bg-green-50 text-green-700 hover:bg-green-100' : ''}
                        ${isSelectedStart ? 'bg-amber-600 text-white shadow-md z-10' : ''}
                        ${isSelectedEnd ? 'bg-amber-600 text-white shadow-md z-10' : ''}
                        ${isInRange ? 'bg-amber-100 text-amber-800' : ''}
                        ${isToday && !isSelected ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
                     `}
                            title={isOccupied ? "Ocupado" : (isPast ? "Passado" : "Disponível")}
                        >
                            {date.getDate()}
                            {isOccupied && <XCircle size={12} className="absolute top-0.5 right-0.5 opacity-50" />}
                        </div>
                    );
                })}
            </div>

            {/* Legenda */}
            <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-gray-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Disponível</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Ocupado</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-600"></div> Selecionado</div>
            </div>
        </div>
    );
};

export default AvailabilityCalendar;
