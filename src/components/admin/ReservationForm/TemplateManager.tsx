import { useEffect, useId, useRef, useState } from 'react';
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

export default function TemplateManager({
    templates,
    guestName,
    editingId,
    onApplyTemplate,
    onCreateTemplate,
    onDeleteTemplate,
}: TemplateManagerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const panelId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const onOutside = (event: PointerEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
        };
        document.addEventListener('pointerdown', onOutside);
        return () => document.removeEventListener('pointerdown', onOutside);
    }, [isOpen]);

    if (editingId || (!templates.length && guestName.trim().length <= 2)) return null;

    return (
        <div
            ref={rootRef}
            className="min-w-0 space-y-2"
            onKeyDown={(event) => {
                if (event.key === 'Escape' && isOpen) {
                    event.preventDefault();
                    setIsOpen(false);
                    triggerRef.current?.focus();
                }
            }}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null))
                    setIsOpen(false);
            }}
        >
            <div className="flex flex-wrap gap-2">
                {templates.length > 0 && (
                    <button
                        ref={triggerRef}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setIsOpen((open) => !open)}
                        className="min-h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                        <FolderOpen size={18} aria-hidden="true" /> Modelos
                    </button>
                )}
                {guestName.trim().length > 2 && (
                    <button
                        type="button"
                        onClick={onCreateTemplate}
                        className="min-h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                    >
                        <PlusSquare size={18} aria-hidden="true" /> Salvar como modelo
                    </button>
                )}
            </div>
            {isOpen && (
                <div
                    id={panelId}
                    role="region"
                    aria-label="Modelos de reserva"
                    className="max-h-64 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-2 space-y-1"
                >
                    {templates.map((template) => (
                        <div key={template.id} className="flex min-w-0 items-start gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onApplyTemplate(template);
                                    setIsOpen(false);
                                    triggerRef.current?.focus();
                                }}
                                className="min-h-11 min-w-0 flex-1 rounded-lg px-3 py-2 text-left text-sm font-semibold break-words text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                            >
                                {template.name}
                            </button>
                            {onDeleteTemplate && (
                                <button
                                    type="button"
                                    aria-label={`Excluir modelo ${template.name}`}
                                    onClick={() => {
                                        if (window.confirm('Excluir modelo?'))
                                            onDeleteTemplate(template.id);
                                    }}
                                    className="h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-lg text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                    <Trash2 size={18} aria-hidden="true" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
