import React from 'react';
import { Building2, Download, Plus, Search, Filter } from 'lucide-react';
import { PropertyId, UserPermission } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Button } from '../../ui';

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    propertyFilter: PropertyId | 'all';
    setPropertyFilter: (filter: PropertyId | 'all') => void;
    userPermission: UserPermission | null;
    showFilters: boolean;
    setShowFilters: (show: boolean) => void;
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onExportCSV: () => void;
    exportCount: number;
    statusFilter?: 'all' | 'active' | 'pending' | 'cancelled';
    setStatusFilter?: (status: 'all' | 'active' | 'pending' | 'cancelled') => void;
    onNewReservation?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm,
    setSearchTerm,
    propertyFilter,
    setPropertyFilter,
    userPermission,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    onClearFilters,
    onExportCSV,
    exportCount,
    statusFilter = 'all',
    setStatusFilter,
    onNewReservation,
}) => {
    const showPropertySelector =
        !userPermission ||
        userPermission.role === 'super_admin' ||
        userPermission.allowedProperties.length > 1;

    return (
        <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl p-5 sm:p-7 rounded-[2.5rem] border border-gray-200/80 dark:border-gray-700/80 shadow-xl shadow-gray-200/20 dark:shadow-none space-y-4">
            {/* Top Row: Search Input, Filters Button, Status Dropdown, + Nova Reserva CTA */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
                {/* Search Bar with Icon */}
                <div className="relative flex-1">
                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por hóspede, empresa, flat ou código..."
                        className="w-full bg-gray-50 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 pl-12 pr-4 text-sm sm:text-base font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                    {/* Toggle Advanced Filters */}
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`min-h-[46px] px-5 rounded-2xl text-xs sm:text-sm font-extrabold font-heading transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
                            showFilters
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        <Filter size={16} className="text-amber-500" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                        )}
                    </button>

                    {/* Quick Status Select */}
                    {setStatusFilter && (
                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value as 'all' | 'active' | 'pending' | 'cancelled'
                                )
                            }
                            className="min-h-[46px] px-4 rounded-2xl text-xs sm:text-sm font-extrabold font-heading bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500/30 outline-none cursor-pointer"
                        >
                            <option value="all">Status: Todos</option>
                            <option value="active">Confirmadas / Ativas</option>
                            <option value="pending">Aguardando Pagamento</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    )}

                    {/* + Nova Reserva CTA */}
                    {onNewReservation && (
                        <button
                            type="button"
                            onClick={onNewReservation}
                            className="min-h-[46px] px-6 rounded-2xl text-xs sm:text-sm font-extrabold font-heading bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                        >
                            <Plus size={18} /> Nova Reserva
                        </button>
                    )}
                </div>
            </div>

            {/* Bottom Row: Property Selector & Export Button */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-gray-700/50 flex-wrap">
                {/* PROPERTY PILLS */}
                {showPropertySelector && (
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory touch-pan-x shrink-0">
                        <button
                            type="button"
                            onClick={() => setPropertyFilter('all')}
                            className={`snap-start px-4 py-2 rounded-xl text-xs font-extrabold font-heading tracking-wider uppercase whitespace-nowrap transition-all active:scale-95 touch-manipulation cursor-pointer ${
                                propertyFilter === 'all'
                                    ? 'bg-stone-900 text-white shadow-md dark:bg-white dark:text-stone-900'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 border border-gray-200/60 dark:border-gray-700'
                            }`}
                        >
                            Todos
                        </button>
                        {Object.values(PROPERTIES).map((prop) => {
                            if (
                                userPermission &&
                                userPermission.role !== 'super_admin' &&
                                !userPermission.allowedProperties.includes(prop.id)
                            )
                                return null;
                            return (
                                <button
                                    type="button"
                                    key={prop.id}
                                    onClick={() => setPropertyFilter(prop.id)}
                                    className={`snap-start px-4 py-2 rounded-xl text-xs font-extrabold font-heading tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 touch-manipulation cursor-pointer ${
                                        propertyFilter === prop.id
                                            ? prop.id === 'lili'
                                                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200/70 border border-gray-200/60 dark:border-gray-700'
                                    }`}
                                >
                                    <Building2 size={13} /> {prop.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="px-3 py-2 text-[11px] font-extrabold font-heading text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all uppercase tracking-wider cursor-pointer"
                        >
                            Limpar Filtros
                        </button>
                    )}

                    <Button
                        type="button"
                        onClick={onExportCSV}
                        variant="ghost"
                        leftIcon={<Download size={14} />}
                        className="px-3.5 py-2 text-xs font-extrabold font-heading text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl active:scale-95 transition-all"
                    >
                        Exportar CSV ({exportCount})
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
