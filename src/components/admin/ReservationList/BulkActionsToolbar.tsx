import React from 'react';
import { Trash2 } from 'lucide-react';

interface BulkActionsToolbarProps {
    selectedIds: string[];
    onBulkDelete: () => void;
    onClearSelection: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
    selectedIds,
    onBulkDelete,
    onClearSelection,
}) => {
    if (selectedIds.length === 0) return null;

    return (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 dark:bg-black/90 backdrop-blur-xl text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3.5 border border-white/10 animate-slideUp">
            <span className="text-xs sm:text-sm font-bold whitespace-nowrap">
                {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
            </span>
            <div className="h-4 w-px bg-white/20"></div>
            <button
                type="button"
                onClick={onBulkDelete}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-red-400 hover:text-red-300 transition-colors min-h-[44px] px-2 touch-manipulation active:scale-95"
            >
                <Trash2 size={16} /> Excluir
            </button>
            <div className="h-4 w-px bg-white/20"></div>
            <button
                type="button"
                onClick={onClearSelection}
                className="text-xs text-gray-400 hover:text-white min-h-[44px] px-2 touch-manipulation active:scale-95"
            >
                Cancelar
            </button>
        </div>
    );
};

export default BulkActionsToolbar;
