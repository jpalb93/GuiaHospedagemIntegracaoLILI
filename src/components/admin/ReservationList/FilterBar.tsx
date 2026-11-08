import React from 'react';
import { Building2, Download, Plus, Search, Filter, X } from 'lucide-react';
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
        <div className="bg-white/95 dark:bg-gray-850/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-gray-200/80 dark:border-gray-750/80 shadow-lg shadow-gray-200/10 dark:shadow-none space-y-3">
            {/* Row 1: Search Bar & Desktop Actions */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
                {/* Search Bar with Icon and Clear button */}
                <div className="relative flex-1 min-w-0">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por hóspede, flat, empresa..."
                        className="w-full bg-gray-50/90 dark:bg-gray-900/80 border border-gray-200/90 dark:border-gray-700/90 rounded-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none transition-all"
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            aria-label="Limpar busca"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        >
                            <X size={15} />
                        </button>
                    )}
                </div>

                {/* Desktop-only Action Row (on mobile, moved to Row 2 for perfect alignment) */}
                <div className="hidden md:flex items-center gap-2.5 shrink-0">
                    {/* Toggle Advanced Filters */}
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`h-10 px-4 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
                            showFilters
                                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                                : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100'
                        }`}
                    >
                        <Filter size={15} className="text-amber-500" />
                        Filtros
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
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
                            className="h-10 px-3.5 rounded-xl text-xs font-bold font-heading bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500/30 outline-none cursor-pointer"
                        >
                            <option value="all">Status: Todos</option>
                            <option value="active">Confirmadas / Ativas</option>
                            <option value="pending">Aguardando Pagamento</option>
                            <option value="cancelled">Canceladas</option>
                        </select>
                    )}

                    {/* Export CSV CTA */}
                    <Button
                        type="button"
                        onClick={onExportCSV}
                        variant="ghost"
                        leftIcon={<Download size={14} />}
                        className="h-10 px-3.5 text-xs font-bold font-heading text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/70 dark:border-emerald-800/50 rounded-xl active:scale-95 transition-all"
                    >
                        CSV ({exportCount})
                    </Button>

                    {/* + Nova Reserva CTA */}
                    {onNewReservation && (
                        <button
                            type="button"
                            onClick={onNewReservation}
                            className="h-10 px-5 rounded-xl text-xs font-bold font-heading bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                            <Plus size={16} /> Nova Reserva
                        </button>
                    )}
                </div>
            </div>

            {/* Row 2 (Mobile only): Compact Actions Toolbar */}
            <div className="flex md:hidden items-center gap-2">
                {/* Toggle Advanced Filters */}
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex-1 h-9 px-3 rounded-xl text-xs font-bold font-heading transition-all flex items-center justify-center gap-1.5 border cursor-pointer active:scale-95 ${
                        showFilters
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200'
                    }`}
                >
                    <Filter size={14} className="text-amber-500 shrink-0" />
                    <span className="truncate">Filtros</span>
                    {hasActiveFilters && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
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
                        className="flex-1 h-9 px-2.5 rounded-xl text-xs font-bold font-heading bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-amber-500/30 outline-none cursor-pointer truncate"
                    >
                        <option value="all">Status: Todos</option>
                        <option value="active">Confirmadas</option>
                        <option value="pending">Aguardando</option>
                        <option value="cancelled">Canceladas</option>
                    </select>
                )}

                {/* Compact Export CSV */}
                <button
                    type="button"
                    onClick={onExportCSV}
                    className="h-9 px-3 rounded-xl text-xs font-bold font-heading text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50 flex items-center justify-center gap-1 shrink-0 active:scale-95 transition-all"
                    title={`Exportar CSV (${exportCount} registros)`}
                >
                    <Download size={13} />
                    <span>CSV ({exportCount})</span>
                </button>

                {/* Quick Add CTA icon on mobile (complements the bottom dock) */}
                {onNewReservation && (
                    <button
                        type="button"
                        onClick={onNewReservation}
                        aria-label="Nova Reserva"
                        className="h-9 w-9 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0 active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {/* Row 3: Segmented Property Selector */}
            {showPropertySelector && (
                <div className="pt-2.5 border-t border-gray-100 dark:border-gray-750/70 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth py-0.5 touch-pan-x flex-1 min-w-0">
                        <button
                            type="button"
                            onClick={() => setPropertyFilter('all')}
                            className={`snap-start px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 touch-manipulation cursor-pointer flex items-center gap-1.5 ${
                                propertyFilter === 'all'
                                    ? 'bg-stone-900 text-white shadow-sm dark:bg-white dark:text-stone-900'
                                    : 'bg-gray-100/90 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 border border-gray-200/60 dark:border-gray-700/60'
                            }`}
                        >
                            <Building2 size={13} />
                            Todos os Flats
                        </button>
                        {Object.values(PROPERTIES).map((prop) => {
                            if (
                                userPermission &&
                                userPermission.role !== 'super_admin' &&
                                !userPermission.allowedProperties.includes(prop.id)
                            )
                                return null;
                            const isSelected = propertyFilter === prop.id;
                            return (
                                <button
                                    type="button"
                                    key={prop.id}
                                    onClick={() => setPropertyFilter(prop.id)}
                                    className={`snap-start px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 touch-manipulation cursor-pointer ${
                                        isSelected
                                            ? prop.id === 'lili'
                                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/25'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25'
                                            : 'bg-gray-100/90 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200/70 border border-gray-200/60 dark:border-gray-700/60'
                                    }`}
                                >
                                    <Building2 size={13} />
                                    {prop.name}
                                </button>
                            );
                        })}
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="px-2.5 py-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all shrink-0 whitespace-nowrap cursor-pointer"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterBar;
