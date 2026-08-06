import React from 'react';
import { Building2, ListFilter, Download } from 'lucide-react';
import { PropertyId, UserPermission } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { Input, Button } from '../../ui';

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
}) => {
    const showPropertySelector =
        !userPermission ||
        userPermission.role === 'super_admin' ||
        userPermission.allowedProperties.length > 1;

    return (
        <div className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/30 dark:shadow-none space-y-4">
            {/* Top Row: Search Input & Property Pills */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                {/* SEARCH */}
                <div className="flex-1">
                    <Input
                        variant="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome de hóspede, flat ou anotação..."
                        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl py-3 px-4 shadow-inner text-sm focus:ring-2 focus:ring-orange-500/30"
                    />
                </div>

                {/* PROPERTY PILLS */}
                {showPropertySelector && (
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar snap-x snap-mandatory touch-pan-x shrink-0">
                        <button
                            type="button"
                            onClick={() => setPropertyFilter('all')}
                            className={`snap-start min-h-[44px] px-5 py-2.5 rounded-2xl text-xs font-extrabold font-heading tracking-wider uppercase whitespace-nowrap transition-all active:scale-95 touch-manipulation ${
                                propertyFilter === 'all'
                                    ? 'bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-lg shadow-stone-900/20 dark:from-white dark:to-gray-100 dark:text-stone-900'
                                    : 'bg-stone-100 dark:bg-gray-700/50 text-stone-600 dark:text-gray-300 hover:bg-stone-200/70 dark:hover:bg-gray-700 border border-stone-200/60 dark:border-gray-600/50'
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
                                    className={`snap-start min-h-[44px] px-5 py-2.5 rounded-2xl text-xs font-extrabold font-heading tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 active:scale-95 touch-manipulation ${
                                        propertyFilter === prop.id
                                            ? prop.id === 'lili'
                                                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/30'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                                            : 'bg-stone-100 dark:bg-gray-700/50 text-stone-600 dark:text-gray-300 hover:bg-stone-200/70 dark:hover:bg-gray-700 border border-stone-200/60 dark:border-gray-600/50'
                                    }`}
                                >
                                    <Building2 size={15} /> {prop.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ACTION BAR: ADVANCED FILTERS & EXPORT CSV */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/40 flex-wrap">
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        variant="ghost"
                        leftIcon={<ListFilter size={16} />}
                        className={`min-h-[42px] px-4 text-xs font-extrabold font-heading rounded-xl transition-all active:scale-95 touch-manipulation ${
                            showFilters
                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                : 'text-stone-600 dark:text-gray-300 hover:bg-stone-100 dark:hover:bg-gray-700/50'
                        }`}
                    >
                        Filtros Avançados
                        {hasActiveFilters && (
                            <span className="ml-2 w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                        )}
                    </Button>
                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="min-h-[42px] px-3 text-[11px] font-extrabold font-heading text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all uppercase tracking-wider touch-manipulation"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>

                <Button
                    type="button"
                    onClick={onExportCSV}
                    variant="ghost"
                    leftIcon={<Download size={16} />}
                    className="min-h-[42px] px-4 text-xs font-extrabold font-heading text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/40 rounded-xl active:scale-95 touch-manipulation transition-all"
                >
                    Exportar CSV ({exportCount})
                </Button>
            </div>
        </div>
    );
};

export default FilterBar;
