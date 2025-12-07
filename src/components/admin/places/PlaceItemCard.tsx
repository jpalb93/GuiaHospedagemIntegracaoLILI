import React from 'react';
import { PlaceRecommendation } from '../../../types';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { getCategoryLabel } from './constants';

interface PlaceItemCardProps {
    place: PlaceRecommendation;
    onEdit: (place: PlaceRecommendation) => void;
    onDelete: (place: PlaceRecommendation) => void;
}

/**
 * Card que exibe um local na lista do gerenciador
 */
const PlaceItemCard: React.FC<PlaceItemCardProps> = ({ place, onEdit, onDelete }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 group hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
            {/* Thumbnail */}
            <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                {place.imageUrl ? (
                    <img
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon size={24} />
                    </div>
                )}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">
                            {place.name}
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                            {getCategoryLabel(place.category)}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {place.description}
                </p>

                {place.eventDate && (
                    <p className="text-xs text-purple-500 font-bold mt-1">📅 {place.eventDate}</p>
                )}

                {/* Ações */}
                <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => onEdit(place)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                        <Edit size={14} /> Editar
                    </button>
                    <button
                        onClick={() => onDelete(place)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                        <Trash2 size={14} /> Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceItemCard;
