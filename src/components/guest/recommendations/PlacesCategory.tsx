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
}

/**
 * Categoria de lugares com header e lista expansível
 */
export const PlacesCategory: React.FC<PlacesCategoryProps> = ({
    title,
    icon,
    places,
    visible = true,
}) => {
    if (!visible || places.length === 0) return null;

    return (
        <>
            <CategoryHeader title={title} icon={icon} />
            <ExpandablePlaceList places={places} />
        </>
    );
};

export default PlacesCategory;
