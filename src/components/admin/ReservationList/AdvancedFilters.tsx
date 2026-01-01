import React from 'react';

interface DateRange {
    start: string;
    end: string;
    type: 'checkin' | 'checkout';
}

interface AdvancedFiltersProps {
    showFilters: boolean;
    statusFilter: 'all' | 'active' | 'pending' | 'cancelled';
    setStatusFilter: (filter: 'all' | 'active' | 'pending' | 'cancelled') => void;
    dateRange: DateRange;
    setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
    showFilters,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
}) => {
    if (!showFilters) return null;

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Status
                    </label>
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value as 'all' | 'active' | 'pending' | 'cancelled'
                            )
                        }
                        className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">Todos</option>
                        <option value="active">Confirmadas (Ativas)</option>
                        <option value="pending">Pré-Reserva</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                </div>

                {/* Date Type */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Filtrar Data
                    </label>
                    <select
                        value={dateRange.type}
                        onChange={(e) =>
                            setDateRange((prev) => ({
                                ...prev,
                                type: e.target.value as 'checkin' | 'checkout',
                            }))
                        }
                        className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="checkin">Data de Check-in</option>
                        <option value="checkout">Data de Saída</option>
                    </select>
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        De
                    </label>
                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                            setDateRange((prev) => ({ ...prev, start: e.target.value }))
                        }
                        className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* End Date */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Até
                    </label>
                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                        className="w-full p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;
