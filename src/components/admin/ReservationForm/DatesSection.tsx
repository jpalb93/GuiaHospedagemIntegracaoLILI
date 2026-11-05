import React, { useId } from 'react';
import { CalendarDays } from 'lucide-react';

interface DatesSectionProps {
    isDayUse?: boolean;
    checkInDate: string;
    setCheckInDate: (v: string) => void;
    checkoutDate: string;
    setCheckoutDate: (v: string) => void;
    checkInTime: string;
    setCheckInTime: (v: string) => void;
    checkOutTime: string;
    setCheckOutTime: (v: string) => void;
}

const DatesSection: React.FC<DatesSectionProps> = ({
    isDayUse = false,
    checkInDate,
    setCheckInDate,
    checkoutDate,
    setCheckoutDate,
    checkInTime,
    setCheckInTime,
    checkOutTime,
    setCheckOutTime,
}) => {
    const fieldId = useId();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isDayUse && checkInTime >= '20:00' && !checkOutTime && (
                <p
                    role="status"
                    className="sm:col-span-2 text-sm text-orange-700 dark:text-orange-300"
                >
                    As 4 horas ultrapassam este dia. Ajuste a entrada ou informe uma saída no mesmo
                    dia.
                </p>
            )}
            {/* CHECK-IN */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                    <label
                        htmlFor={`${fieldId}-entry-date`}
                        className="text-xs font-extrabold text-green-700 dark:text-green-400 uppercase tracking-wider flex items-center gap-1.5"
                    >
                        <CalendarDays size={14} className="text-green-600" /> Check-in (Entrada)
                    </label>
                </div>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 sm:col-span-7">
                        <input
                            type="date"
                            id={`${fieldId}-entry-date`}
                            aria-label={isDayUse ? 'Data do day use' : 'Data de entrada'}
                            value={checkInDate}
                            onChange={(e) => setCheckInDate(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-2 px-2.5 text-xs font-extrabold outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 shadow-sm cursor-pointer"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-5">
                        <label
                            htmlFor={`${fieldId}-entry-time`}
                            className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 sm:sr-only"
                        >
                            Horário de entrada
                        </label>
                        <input
                            type="time"
                            id={`${fieldId}-entry-time`}
                            aria-label="Horário de entrada"
                            value={checkInTime}
                            onChange={(e) => setCheckInTime(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-2 px-2 text-xs font-extrabold outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100 shadow-sm cursor-pointer text-center"
                        />
                    </div>
                </div>
            </div>

            {/* CHECK-OUT */}
            <div className="p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-2">
                <div className="flex justify-between items-center">
                    <label
                        htmlFor={`${fieldId}-exit-date`}
                        className="text-xs font-extrabold text-orange-700 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5"
                    >
                        <CalendarDays size={14} className="text-orange-600" /> Check-out (Saída)
                    </label>
                </div>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 sm:col-span-7">
                        <input
                            type="date"
                            id={`${fieldId}-exit-date`}
                            aria-label="Data de saída"
                            disabled={isDayUse}
                            min={checkInDate}
                            value={isDayUse ? checkInDate : checkoutDate}
                            onChange={(e) => setCheckoutDate(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-2 px-2.5 text-xs font-extrabold outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 shadow-sm cursor-pointer"
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-5">
                        <label
                            htmlFor={`${fieldId}-exit-time`}
                            className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 sm:sr-only"
                        >
                            Horário de saída
                        </label>
                        <input
                            type="time"
                            id={`${fieldId}-exit-time`}
                            aria-label="Horário de saída"
                            value={checkOutTime}
                            onChange={(e) => setCheckOutTime(e.target.value)}
                            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-2 px-2 text-xs font-extrabold outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100 shadow-sm cursor-pointer text-center"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatesSection;
