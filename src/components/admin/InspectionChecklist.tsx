import React from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { ChecklistItem } from '../../types';

export interface ChecklistItemState {
    status: 'ok' | 'issue';
    note?: string;
    image?: string;
}

export interface ChecklistState {
    [key: string]: ChecklistItemState;
}

interface InspectionChecklistProps {
    checklistItems: ChecklistItem[];
    checklistState: ChecklistState;
    unitNumber?: string;
    reservationName: string;
    progress: number;
    onStatusChange: (id: string, status: 'ok' | 'issue') => void;
    onNoteChange: (id: string, note: string) => void;
    onTriggerImageUpload: (id: string) => void;
    onRemoveImage: (id: string) => void;
}

const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
    checklistItems,
    checklistState,
    unitNumber,
    reservationName,
    progress,
    onStatusChange,
    onNoteChange,
    onTriggerImageUpload,
    onRemoveImage,
}) => {
    // Group items by category
    const groupedItems = checklistItems.reduce(
        (acc, item) => {
            const cat = item.category || 'Outros';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, ChecklistItem[]>
    );

    return (
        <div className="space-y-6">
            {/* Header with progress */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                    Vistoria do Flat <strong>{unitNumber}</strong> - {reservationName}
                </p>
                <div className="mt-3 h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Checklist by category */}
            <div className="space-y-8">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">
                            {category}
                        </h3>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-gray-700 dark:text-gray-200">
                                            {item.label}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onStatusChange(item.id, 'ok')}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${checklistState[item.id]?.status === 'ok'
                                                    ? 'bg-green-500 text-white shadow-md scale-105'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                OK
                                            </button>
                                            <button
                                                onClick={() => onStatusChange(item.id, 'issue')}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${checklistState[item.id]?.status === 'issue'
                                                    ? 'bg-red-500 text-white shadow-md scale-105'
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                    }`}
                                            >
                                                PROBLEMA
                                            </button>
                                        </div>
                                    </div>

                                    {/* Issue details */}
                                    {checklistState[item.id]?.status === 'issue' && (
                                        <div className="animate-fadeIn space-y-3">
                                            <textarea
                                                placeholder="Descreva o problema..."
                                                value={checklistState[item.id]?.note || ''}
                                                onChange={(e) => onNoteChange(item.id, e.target.value)}
                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                                rows={2}
                                            />
                                            <div className="flex items-center gap-3">
                                                {checklistState[item.id]?.image ? (
                                                    <div className="relative group">
                                                        <img
                                                            src={checklistState[item.id]?.image}
                                                            alt="Evidência"
                                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                        />
                                                        <button
                                                            onClick={() => onRemoveImage(item.id)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onTriggerImageUpload(item.id)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <Camera size={14} /> Anexar Foto
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InspectionChecklist;
