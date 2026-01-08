import React from 'react';
import {
    User,
    Phone,
    CalendarDays,
    Sparkles,
    CheckCircle2,
    Star,
    AlertTriangle,
} from 'lucide-react';
import { Reservation } from '../../../types';
import { useGuestAutocomplete, GuestHistoryItem } from './hooks/useGuestAutocomplete';

interface GuestInfoSectionProps {
    guestName: string;
    setGuestName: (v: string | ((prev: string) => string)) => void;
    guestPhone: string;
    setGuestPhone: (v: string) => void;
    previousGuests: Reservation[];
}

const GuestInfoSection: React.FC<GuestInfoSectionProps> = ({
    guestName,
    setGuestName,
    guestPhone,
    setGuestPhone,
    previousGuests,
}) => {
    const handleSelectGuest = (item: GuestHistoryItem) => {
        const { reservation } = item;
        setGuestName(reservation.guestName);
        if (reservation.guestPhone) setGuestPhone(reservation.guestPhone);
    };

    const {
        filteredGuests,
        showSuggestions,
        setShowSuggestions,
        handleGuestNameChange,
        selectGuest,
    } = useGuestAutocomplete({
        previousGuests,
        onSelectGuest: handleSelectGuest,
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGuestName(value);
        handleGuestNameChange(value);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length > 10) {
            value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 6) {
            value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length > 2) {
            value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (value.length > 0) {
            value = value.replace(/^(\d{0,2})/, '($1');
        }

        setGuestPhone(value);
    };

    return (
        <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Hóspede</label>
                <div className="relative group">
                    <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500"
                        size={20}
                    />
                    <input
                        type="text"
                        value={guestName}
                        onChange={handleNameChange}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-gray-100"
                        placeholder="Nome Completo"
                    />
                    {showSuggestions && filteredGuests.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                            {filteredGuests.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => selectGuest(item)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center transition-colors group/item border-b border-gray-100 dark:border-gray-700 last:border-0"
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors">
                                                {item.reservation.guestName}
                                            </span>
                                            {item.visitCount > 1 && (
                                                <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                    <Sparkles size={10} /> {item.visitCount}ª vez
                                                </span>
                                            )}
                                            {item.visitCount === 1 && (
                                                <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-md font-bold">
                                                    Novo
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            {item.reservation.guestPhone && (
                                                <span className="flex items-center gap-1">
                                                    <Phone size={10} />{' '}
                                                    {item.reservation.guestPhone}
                                                </span>
                                            )}
                                            {item.lastVisit && (
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays size={10} /> Última:{' '}
                                                    {item.lastVisit.split('-').reverse().join('/')}
                                                </span>
                                            )}
                                        </div>

                                        {/* RATING BADGES */}
                                        <div className="flex gap-2 mt-1">
                                            {item.averageRating < 3 ? (
                                                <span className="text-[10px] bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                    <AlertTriangle size={10} /> Cuidado (
                                                    {item.averageRating.toFixed(1)})
                                                </span>
                                            ) : item.averageRating >= 4.5 ? (
                                                <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                                                    <Star size={10} fill="currentColor" /> VIP (
                                                    {item.averageRating.toFixed(1)})
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="opacity-0 group-hover/item:opacity-100 transition-opacity text-orange-500">
                                        <CheckCircle2 size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    WhatsApp (Opcional)
                </label>
                <div className="relative group">
                    <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500"
                        size={20}
                    />
                    <input
                        type="tel"
                        value={guestPhone}
                        onChange={handlePhoneChange}
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-gray-100"
                        placeholder="(87) 99999-8888"
                    />
                </div>
            </div>
        </div>
    );
};

export default GuestInfoSection;
