import React from 'react';
import { ChevronDown } from 'lucide-react';
import { PlaceRecommendation } from '../../../types';
import ExpandablePlaceList from './ExpandablePlaceList';
import { useLanguage } from '../../../hooks/useLanguage';

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
        <h5 className="font-heading font-semibold text-stone-700 dark:text-stone-300 text-xs uppercase tracking-wide">
            {title}
        </h5>
        <div className="h-px bg-stone-200/80 dark:bg-stone-700 flex-1 ml-2"></div>
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

/**
 * Categoria de lugares com header clicável tipo Card Esculpido (Acordeão Moderno)
 */
export const PlacesCategory: React.FC<PlacesCategoryProps> = ({
    title,
    icon,
    places,
    visible = true,
    isOpen = false,
    onToggle,
}) => {
    const { t } = useLanguage();
    if (!visible || places.length === 0) return null;

    const placesCountText =
        places.length === 1
            ? t('1 opção', '1 option', '1 opción')
            : `${places.length} ${t('opções', 'options', 'opciones')}`;

    return (
        <div
            className={`mb-3.5 rounded-[22px] border transition-all duration-300 overflow-hidden shadow-sm ${
                isOpen
                    ? 'bg-white dark:bg-[#241C19] border-amber-300/80 dark:border-amber-500/30 shadow-md ring-1 ring-amber-300/40 dark:ring-amber-500/20'
                    : 'bg-white dark:bg-[#241C19] border-stone-200/80 dark:border-amber-500/15 hover:border-amber-300/60 dark:hover:border-amber-500/30'
            }`}
        >
            <button
                type="button"
                onClick={onToggle}
                className="w-full flex items-center gap-3.5 p-3.5 sm:p-4 hover:bg-amber-50/40 dark:hover:bg-white/5 transition-all outline-none text-left select-none group"
            >
                {/* Ícone com Moldura Delicada */}
                <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 transition-transform group-hover:scale-105 border ${
                        isOpen
                            ? 'bg-amber-100 dark:bg-amber-500/20 text-[#C85A32] dark:text-amber-300 border-amber-200 dark:border-amber-500/30 shadow-sm'
                            : 'bg-stone-100/80 dark:bg-white/5 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-white/10'
                    }`}
                >
                    {icon}
                </div>

                {/* Título da Categoria */}
                <div className="flex-1 min-w-0">
                    <h5 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-snug truncate">
                        {title}
                    </h5>
                </div>

                {/* Badge com Quantidade de Lugares */}
                <span className="px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-amber-200/90 text-[11px] font-semibold shrink-0 font-sans">
                    {placesCountText}
                </span>

                {/* Chevron com Rotação Fluida */}
                {onToggle && (
                    <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isOpen
                                ? 'bg-[#C85A32] text-white rotate-180 shadow-sm'
                                : 'bg-stone-100 dark:bg-white/10 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200'
                        }`}
                    >
                        <ChevronDown size={15} strokeWidth={2.5} />
                    </div>
                )}
            </button>

            {/* Conteúdo Aninhado (Lista de Lugares) */}
            <div
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-3.5 pb-4 pt-1 sm:px-4">
                        <ExpandablePlaceList places={places} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlacesCategory;
