import React from 'react';
import { FolderOpen, PlusSquare, Trash2 } from 'lucide-react';
import { ReservationTemplate } from '../../../types';

interface TemplateManagerProps {
    templates: ReservationTemplate[];
    guestName: string;
    editingId: string | null;
    onApplyTemplate: (template: ReservationTemplate) => void;
    onCreateTemplate: () => void;
    onDeleteTemplate?: (id: string) => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({
    templates,
    guestName,
    editingId,
    onApplyTemplate,
    onCreateTemplate,
    onDeleteTemplate,
}) => {
    if (editingId) return null;

    return (
        <>
            {templates.length > 0 && (
                <div className="relative group/templates">
                    <button className="h-full px-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center gap-2 text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <FolderOpen size={16} className="text-orange-500" />
                        Modelos
                    </button>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-1 hidden group-hover/templates:block z-30">
                        {templates.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => onApplyTemplate(t)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group/titem"
                            >
                                <span>{t.name}</span>
                                {onDeleteTemplate && (
                                    <span
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Excluir modelo?'))
                                                onDeleteTemplate(t.id);
                                        }}
                                        className="text-gray-300 hover:text-red-500 p-1"
                                    >
                                        <Trash2 size={12} />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* SAVE AS TEMPLATE BUTTON */}
            {guestName.length > 2 && (
                <div className="flex justify-end -mt-4 mb-2">
                    <button
                        onClick={onCreateTemplate}
                        className="text-[10px] text-gray-400 hover:text-orange-500 flex items-center gap-1 transition-colors"
                    >
                        <PlusSquare size={12} /> Salvar como Modelo
                    </button>
                </div>
            )}
        </>
    );
};

export default TemplateManager;
