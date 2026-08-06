import React from 'react';
import { PROPERTIES } from '../../../config/properties';

interface DateRange {
    start: string;
    end: string;
    type: 'checkin' | 'checkout';
}

interface AdvancedFiltersProps {
    showFilters: boolean;
    statusFilter: 'all' | 'active' | 'pending' | 'cancelled';
    setStatusFilter: (filter: 'all' | 'active' | 'pending' | 'cancelled') => void;
    flatFilter: string;
    setFlatFilter: (flat: string) => void;
    dateRange: DateRange;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    showFilters,
    statusFilter,
    setStatusFilter,
    flatFilter,
    setFlatFilter,
    dateRange,
    setDateRange,
}) => {
    if (!showFilters) return null;

    return (
        <div className="p-5 sm:p-6 bg-white/90 dark:bg-gray-800/90 rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none backdrop-blur-xl animate-in slide-in-from-top-2 fade-in duration-200 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Flat / Unidade Filter */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold font-heading text-stone-600 dark:text-stone-300 uppercase tracking-wider block">
                        Flat / Unidade
                    </label>
                    <select
                        value={flatFilter}
                        onChange={(e) => setFlatFilter(e.target.value)}
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-xs font-extrabold font-heading text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500/40 focus:bg-white outline-none transition-all cursor-pointer shadow-xs"
                    >
                        <option value="all" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Todos os Flats
                        </option>
                        <option value="lili" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Flat da Lili
                        </option>
                        <optgroup label="Flats Integração" className="font-bold text-stone-500 dark:text-gray-400">
                            {PROPERTIES['integracao'].units?.map((unit) => (
                                <option
                                    key={unit}
                                    value={unit}
                                    className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100"
                                >
                                    Flat {unit}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold font-heading text-stone-600 dark:text-stone-300 uppercase tracking-wider block">
                        Status da Reserva
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as 'all' | 'active' | 'pending' | 'cancelled'
                            )
                        }
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-xs font-extrabold font-heading text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500/40 focus:bg-white outline-none transition-all cursor-pointer shadow-xs"
                    >
                        <option value="all" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Todos os Status
                        </option>
                        <option value="active" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Confirmadas (Ativas)
                        </option>
                        <option value="pending" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Pré-Reserva
                        </option>
                        <option value="cancelled" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Canceladas
                        </option>
                    </select>
                </div>

                {/* Date Type */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold font-heading text-stone-600 dark:text-stone-300 uppercase tracking-wider block">
                        Filtrar Data Por
                    </label>
                    <select
                        value={dateRange.type}
                        onChange={(e) =>
                            setDateRange((prev) => ({
                                ...prev,
                                type: e.target.value as 'checkin' | 'checkout',
                            }))
                        }
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-xs font-extrabold font-heading text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500/40 focus:bg-white outline-none transition-all cursor-pointer shadow-xs"
                    >
                        <option value="checkin" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Data de Check-in
                        </option>
                        <option value="checkout" className="bg-white dark:bg-gray-900 text-stone-900 dark:text-gray-100">
                            Data de Saída
                        </option>
                    </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold font-heading text-stone-600 dark:text-stone-300 uppercase tracking-wider block">
                        A partir de
                    </label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, start: e.target.value }))
                        }
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-xs font-extrabold font-heading text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500/40 focus:bg-white outline-none transition-all shadow-xs"
                    />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                    <label className="text-[11px] font-extrabold font-heading text-stone-600 dark:text-stone-300 uppercase tracking-wider block">
                        Até a data
                    </label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                        className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-gray-900 border border-stone-200 dark:border-gray-700 text-xs font-extrabold font-heading text-stone-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500/40 focus:bg-white outline-none transition-all shadow-xs"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;
