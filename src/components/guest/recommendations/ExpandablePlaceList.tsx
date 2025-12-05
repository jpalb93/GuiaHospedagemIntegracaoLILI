import React, { useState } from 'react';
import { PlaceRecommendation } from '../../../types';
import PlaceCard from '../../PlaceCard';

interface ExpandablePlaceListProps {
    places: PlaceRecommendation[];
    initialLimit?: number;
}

/**
 * Lista expansível de locais/estabelecimentos
 * Mostra um limite inicial e permite expandir para ver todos
 */
const ExpandablePlaceList: React.FC<ExpandablePlaceListProps> = ({
    places,
    initialLimit = 3
}) => {
    const [showAll, setShowAll] = useState(false);
    const visiblePlaces = showAll ? places : places.slice(0, initialLimit);
    const hiddenCount = places.length - initialLimit;

    if (places.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 mb-5">
            {!showAll && places.length > initialLimit && (
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold font-sans ml-1">
                    Exibindo {initialLimit} de {places.length}
                </p>
            )}

            {visiblePlaces.map((place, idx) => (
                <PlaceCard key={place.id || idx} place={place} />
            ))}

            {places.length > initialLimit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowAll(!showAll);
                    }}
                    className="w-full py-3 mt-1 text-xs font-bold font-sans text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-sm active:scale-[0.98]"
                >
                    {showAll ? 'Mostrar menos' : `Ver mais (+${hiddenCount})`}
                </button>
            )}
        </div>
    );
};

export default ExpandablePlaceList;
