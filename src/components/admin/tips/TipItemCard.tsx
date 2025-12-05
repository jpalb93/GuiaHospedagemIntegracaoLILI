import React from 'react';
import { Tip } from '../../../types';
import { Edit, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { getIcon } from '../../../utils/iconMap';

interface TipItemCardProps {
    tip: Tip;
    index: number;
    totalItems: number;
    onEdit: (tip: Tip) => void;
    onDelete: (id: string) => void;
    onMoveUp: (index: number) => void;
    onMoveDown: (index: number) => void;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragEnd: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, targetIndex: number) => void;
}

const TipItemCard: React.FC<TipItemCardProps> = ({
    tip,
    index,
    totalItems,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop
}) => {
    const Icon = getIcon(tip.iconName);

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 group hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all select-none"
        >
            {/* Controles de ordenação */}
            <div className="flex flex-col items-center justify-center gap-1 text-gray-300">
                <button
                    onClick={() => onMoveUp(index)}
                    disabled={index === 0}
                    className="p-1 hover:text-yellow-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                >
                    <ChevronUp size={16} />
                </button>
                <GripVertical size={16} className="cursor-grab active:cursor-grabbing opacity-50" />
                <button
                    onClick={() => onMoveDown(index)}
                    disabled={index === totalItems - 1}
                    className="p-1 hover:text-yellow-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                >
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* Ícone */}
            <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                <Icon size={24} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 dark:text-white truncate">{tip.title}</h3>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{tip.subtitle}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{tip.content}</p>

                {/* Ações */}
                <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => onEdit(tip)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                        <Edit size={14} /> Editar
                    </button>
                    <button
                        onClick={() => tip.id && onDelete(tip.id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                        <Trash2 size={14} /> Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TipItemCard);
