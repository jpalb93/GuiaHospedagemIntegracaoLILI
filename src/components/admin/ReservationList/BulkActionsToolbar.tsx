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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-gray-700">
            <span className="text-sm font-bold whitespace-nowrap">
                {selectedIds.length} selecionado{selectedIds.length > 1 ? 's' : ''}
            </span>
            <div className="h-4 w-px bg-gray-700"></div>
            <button
                onClick={onBulkDelete}
                className="flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
            >
                <Trash2 size={16} /> Excluir
            </button>
            <div className="h-4 w-px bg-gray-700"></div>
            <button onClick={onClearSelection} className="text-xs text-gray-400 hover:text-white">
                Cancelar
            </button>
        </div>
    );
};

export default BulkActionsToolbar;
