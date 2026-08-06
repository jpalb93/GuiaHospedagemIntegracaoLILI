import React, { useState, useMemo } from 'react';
import { Reservation } from '../../../types';
import { Search, Calendar, ArrowRight, X } from 'lucide-react';

interface CRMSearchWidgetProps {
    reservations: Reservation[];
    onSelectReservation: (res: Reservation) => void;
}

export const CRMSearchWidget: React.FC<CRMSearchWidgetProps> = ({
    reservations,
    onSelectReservation,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const searchResults = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return [];

        return reservations.filter((r) => {
            const nameMatch = (r.guestName || '').toLowerCase().includes(term);
            const phoneMatch = (r.guestPhone || '').toLowerCase().includes(term);
            const flatMatch = (r.flatNumber || '').toLowerCase().includes(term);
            const propertyMatch = ((r.propertyId || 'lili') === 'lili' ? 'lili' : 'integracao').includes(term);

            return nameMatch || phoneMatch || flatMatch || propertyMatch;
        }).slice(0, 6);
    }, [reservations, searchTerm]);

    return (
        <div className="relative z-30">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Busca rápida global de hóspedes por nome, telefone ou flat..."
                    className="w-full pl-11 pr-10 py-3.5 bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-lg shadow-gray-200/20 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* RESULTS DROPDOWN */}
            {searchTerm.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden animate-slideUp z-50">
                    {searchResults.length === 0 ? (
                        <div className="p-4 text-center text-xs font-medium text-gray-400">
                            Nenhum hóspede localizado para "{searchTerm}".
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {searchResults.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => {
                                        onSelectReservation(res);
                                        setSearchTerm('');
                                    }}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center justify-center font-heading shrink-0">
                                            {res.guestName.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-xs text-gray-900 dark:text-white font-heading group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                                                    {res.guestName}
                                                </p>
                                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    {(res.propertyId || 'lili') === 'lili' ? 'Lili' : `Flat ${res.flatNumber}`}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 flex items-center gap-2 mt-0.5 font-medium">
                                                <span><Calendar size={10} className="inline mr-1" />{res.checkInDate} até {res.checkoutDate}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CRMSearchWidget;
