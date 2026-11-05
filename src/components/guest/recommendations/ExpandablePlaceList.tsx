import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { PlaceRecommendation } from '../../../types';
import PlaceCard from '../../PlaceCard';
import { useLanguage } from '../../../hooks/useLanguage';

interface ExpandablePlaceListProps {
    places: PlaceRecommendation[];
    initialLimit?: number;
}

/**
 * Lista expansível de locais/estabelecimentos
 * Mostra um limite inicial e permite expandir para ver todos
 */
const ExpandablePlaceList: React.FC<ExpandablePlaceListProps> = ({ places, initialLimit = 3 }) => {
    const { t } = useLanguage();
    const [showAll, setShowAll] = useState(false);
    const visiblePlaces = showAll ? places : places.slice(0, initialLimit);
    const hiddenCount = places.length - initialLimit;

    if (places.length === 0) return null;

    return (
        <div className="flex flex-col gap-3.5 mb-2">
            {!showAll && places.length > initialLimit && (
                <div className="flex items-center justify-between px-1 mb-0.5">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 uppercase tracking-wider font-bold font-sans">
                        {t('Destaques da Categoria', 'Category Highlights', 'Destacados')}
                    </p>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                        {initialLimit} {t('de', 'of', 'de')} {places.length}
                    </span>
                </div>
            )}

            {/* Grid adaptável: 1 coluna no mobile/tablet, 2 colunas panorâmicas no desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-4">
                {visiblePlaces.map((place, idx) => (
                    <PlaceCard key={place.id || idx} place={place} />
                ))}
            </div>

            {places.length > initialLimit && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowAll(!showAll);
                    }}
                    className="w-full py-3 px-4 mt-1 text-xs font-bold font-sans text-[#C85A32] dark:text-amber-300 bg-amber-50/80 dark:bg-white/5 border border-amber-200/80 dark:border-amber-500/25 rounded-2xl hover:bg-amber-100/70 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-sm active:scale-[0.98]"
                >
                    {showAll ? (
                        <>
                            <span>{t('Mostrar menos', 'Show less', 'Mostrar menos')}</span>
                            <ChevronUp size={15} />
                        </>
                    ) : (
                        <>
                            <span>
                                {t('Ver mais opções', 'View more options', 'Ver más opciones')} (+
                                {hiddenCount})
                            </span>
                            <ChevronDown size={15} />
                        </>
                    )}
                </button>
            )}
        </div>
    );
};

export default ExpandablePlaceList;
