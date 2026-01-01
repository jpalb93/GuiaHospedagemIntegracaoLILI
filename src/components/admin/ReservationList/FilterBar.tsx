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
        <>
            {/* SEARCH */}
            <Input
                variant="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou nota..."
            />

            {/* PROPERTY PILLS */}
            {showPropertySelector && (
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    <button
                        onClick={() => setPropertyFilter('all')}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${propertyFilter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
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
                                key={prop.id}
                                onClick={() => setPropertyFilter(prop.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${propertyFilter === prop.id ? (prop.id === 'lili' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30') : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                            >
                                <Building2 size={12} /> {prop.name}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* EXPORT BUTTON */}
            <div className="flex justify-end mb-2">
                <Button
                    onClick={onExportCSV}
                    variant="ghost"
                    leftIcon={<Download size={16} />}
                    className="text-xs font-bold text-gray-500 hover:text-green-600 hover:bg-green-50"
                >
                    Exportar CSV ({exportCount})
                </Button>
            </div>

            {/* ADVANCED FILTERS TOGGLE */}
            <div className="flex justify-between items-center">
                <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="ghost"
                    leftIcon={<ListFilter size={16} />}
                    className={`text-xs font-bold ${showFilters ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    Filtros Avançados
                    {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                </Button>
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase tracking-wider"
                    >
                        Limpar Filtros
                    </button>
                )}
            </div>
        </>
    );
};

export default FilterBar;
