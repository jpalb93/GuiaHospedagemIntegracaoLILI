import React from 'react';
import { CalendarDays, Clock } from 'lucide-react';

interface DatesSectionProps {
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
    checkInDate,
    setCheckInDate,
    checkoutDate,
    setCheckoutDate,
    checkInTime,
    setCheckInTime,
    checkOutTime,
    setCheckOutTime,
}) => {
    return (
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <CalendarDays size={12} className="text-green-500" /> Check-in (Data)
                </label>
                <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <Clock size={12} className="text-green-500" /> Check-in (Hora)
                </label>
                <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500 font-mono tracking-wider text-gray-900 dark:text-gray-100"
                />
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 border-dashed"></div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <CalendarDays size={12} className="text-orange-500" /> Check-out (Data)
                </label>
                <input
                    type="date"
                    value={checkoutDate}
                    onChange={(e) => setCheckoutDate(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                />
            </div>
            <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                    <Clock size={12} className="text-orange-500" /> Check-out (Hora)
                </label>
                <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-wider text-gray-900 dark:text-gray-100"
                />
            </div>
        </div>
    );
};

export default DatesSection;
