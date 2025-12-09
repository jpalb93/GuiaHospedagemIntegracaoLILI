import React from 'react';
import { PlaceRecommendation } from '../../../types';
import ExpandablePlaceList from './ExpandablePlaceList';

interface CategoryHeaderProps {
    title: string;
    icon: React.ReactNode;
}

/**
 * Cabeçalho de categoria dentro de uma seção de lugares
 */
export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ title, icon }) => (
    <div className="flex items-center gap-2.5 mb-3 mt-4 px-1">
        <span className="text-lg filter drop-shadow-sm">{icon}</span>
        <h5 className="font-heading font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">
            {title}
        </h5>
        <div className="h-px bg-gray-100 dark:bg-gray-700 flex-1 ml-2"></div>
    </div>
);

interface PlacesCategoryProps {
    title: string;
    icon: React.ReactNode;
    places: PlaceRecommendation[];
    visible?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
}

import { ChevronDown } from 'lucide-react';

/**
 * Categoria de lugares com header clicável (Acordeão)
 */
export const PlacesCategory: React.FC<PlacesCategoryProps> = ({
    title,
    icon,
    places,
    visible = true,
    isOpen = true, // Default open for backward compatibility if needed, or controlled
    onToggle,
}) => {
    if (!visible || places.length === 0) return null;

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 py-4 px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors outline-none"
            >
                <span className="text-xl filter drop-shadow-sm">{icon}</span>
                <h5 className="font-heading font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide flex-1 text-left">
                    {title}
                </h5>
                {onToggle && (
                    <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                )}
            </button>

            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 mb-6' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <ExpandablePlaceList places={places} />
                </div>
            </div>
        </div>
    );
};

export default PlacesCategory;
