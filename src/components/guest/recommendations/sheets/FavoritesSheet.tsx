import React from 'react';
import { PlaceRecommendation } from '../../../../types';
import { useFavorites } from '../../../../hooks/useFavorites';
import ExpandablePlaceList from '../ExpandablePlaceList';
import { HeartCrack } from 'lucide-react';

interface FavoritesSheetProps {
    allPlaces: PlaceRecommendation[];
}

const FavoritesSheet: React.FC<FavoritesSheetProps> = ({ allPlaces }) => {
    const { favorites } = useFavorites();

    const favoritePlaces = allPlaces.filter(place =>
        place.id && favorites.includes(place.id)
    );

    if (favoritePlaces.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <HeartCrack size={48} className="mb-4 opacity-50" />
                <h3 className="text-lg font-bold text-gray-600 dark:text-gray-300 mb-2">
                    Nenhum favorito ainda
                </h3>
                <p className="text-sm max-w-xs">
                    Toque no coração nos cards dos lugares que você mais gostar para salvá-los aqui.
                </p>
            </div>
        );
    }

    return (
        <div className="p-1">
            <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold font-sans mb-4 ml-1">
                {favoritePlaces.length} {favoritePlaces.length === 1 ? 'Item salvo' : 'Itens salvos'}
            </p>
            <ExpandablePlaceList places={favoritePlaces} initialLimit={10} />
        </div>
    );
};

export default FavoritesSheet;
