import React, { useState } from 'react';
import { Camera, Trash2, PlusCircle, Plus } from 'lucide-react';
import { ChecklistItem } from '../../types';

export type InspectionItemStatus = 'ok' | 'pending' | 'issue';

export interface ChecklistItemState {
    status: InspectionItemStatus;
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
    inspectionType?: 'pre_checkin' | 'post_checkout';
    onStatusChange: (id: string, status: InspectionItemStatus) => void;
    onNoteChange: (id: string, note: string) => void;
    onTriggerImageUpload: (id: string) => void;
    onRemoveImage: (id: string) => void;
    onAddCustomItem?: (label: string) => void;
    onRemoveItem?: (id: string) => void;
}

const InspectionChecklist: React.FC<InspectionChecklistProps> = ({
    checklistItems,
    checklistState,
    unitNumber,
    reservationName,
    progress,
    inspectionType = 'pre_checkin',
    onStatusChange,
    onNoteChange,
    onTriggerImageUpload,
    onRemoveImage,
    onAddCustomItem,
    onRemoveItem,
}) => {
    const [customItemName, setCustomItemName] = useState('');

    const safeItems = (checklistItems && Array.isArray(checklistItems))
        ? checklistItems.filter((i): i is ChecklistItem => Boolean(i && typeof i === 'object' && i.id))
        : [];

    // Group items by category
    const groupedItems = safeItems.reduce(
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
            <div
                className={`p-4 rounded-xl border ${
                    inspectionType === 'pre_checkin'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-900 dark:text-blue-100'
                        : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40 text-indigo-900 dark:text-indigo-100'
                }`}
            >
                <div className="flex items-center justify-between">
                    <p className="text-sm font-bold flex items-center gap-2">
                        {inspectionType === 'pre_checkin'
                            ? '📥 Vistoria PRÉ Check-in (Entrada)'
                            : '📤 Vistoria PÓS Check-out (Saída)'}
                    </p>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-white/60 dark:bg-black/30">
                        Flat {unitNumber || 'N/A'} • {reservationName}
                    </span>
                </div>
                <div className="mt-3 h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${
                            inspectionType === 'pre_checkin' ? 'bg-blue-600' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* ADICIONAR ITEM ESPECIAL PARA ESTA RESERVA */}
            {onAddCustomItem && (
                <div className="p-4 bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                        <PlusCircle size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                            Adicionar Item Especial para esta Reserva
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        Ex: Berço de Bebê, Colchão Extra, Kit Pet, Air Fryer, Ventilador Adicional.
                        Use a lixeira em cada item para remover o que não existe neste flat/reserva.
                    </p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (customItemName.trim()) {
                                onAddCustomItem(customItemName);
                                setCustomItemName('');
                            }
                        }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={customItemName}
                            onChange={(e) => setCustomItemName(e.target.value)}
                            placeholder="Nome do item especial (ex: Berço de Bebê)..."
                            className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            disabled={!customItemName.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
                        >
                            <Plus size={14} /> Adicionar Item
                        </button>
                    </form>
                </div>
            )}

            {/* Checklist by category */}
            <div className="space-y-8">
                {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">
                            {category}
                        </h3>
                        <div className="space-y-4">
                            {items.map((item) => {
                                const currentStatus = checklistState[item.id]?.status || 'pending';
                                const isOk = currentStatus === 'ok';
                                const isPending = currentStatus === 'pending';
                                const isIssue = currentStatus === 'issue';

                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 rounded-xl border transition-all ${
                                            isOk
                                                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/40'
                                                : isPending
                                                  ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/40'
                                                  : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/40'
                                        }`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                            <div className="flex items-center justify-between min-w-0 w-full sm:w-auto gap-2">
                                                <span className="font-bold text-gray-800 dark:text-gray-100 text-sm flex items-center gap-2 min-w-0">
                                                    {isOk && <span className="text-green-500 shrink-0">🟢</span>}
                                                    {isPending && <span className="text-amber-500 shrink-0">🟡</span>}
                                                    {isIssue && <span className="text-red-500 shrink-0">🔴</span>}
                                                    <span className="truncate">{item.label}</span>
                                                </span>
                                                {onRemoveItem && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onRemoveItem(item.id)}
                                                        title="Remover item desta vistoria (não existe neste flat/reserva)"
                                                        className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-xs font-extrabold transition-all border bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-600 active:scale-95 touch-manipulation shrink-0"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>

                                            {/* TRÊS STATUS + EXCLUIR DESTA VISTORIA */}
                                            <div className="grid grid-cols-3 sm:flex items-center gap-1.5 w-full sm:w-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => onStatusChange(item.id, 'ok')}
                                                    className={`min-h-[44px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center active:scale-95 touch-manipulation ${
                                                        isOk
                                                            ? 'bg-green-500 text-white border-green-600 shadow-sm'
                                                            : 'bg-gray-100 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-green-50 hover:text-green-600'
                                                    }`}
                                                >
                                                    OK
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onStatusChange(item.id, 'pending')}
                                                    className={`min-h-[44px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center active:scale-95 touch-manipulation ${
                                                        isPending
                                                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                                                            : 'bg-gray-100 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-amber-50 hover:text-amber-600'
                                                    }`}
                                                >
                                                    PENDENTE
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => onStatusChange(item.id, 'issue')}
                                                    className={`min-h-[44px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center active:scale-95 touch-manipulation ${
                                                        isIssue
                                                            ? 'bg-red-500 text-white border-red-600 shadow-sm'
                                                            : 'bg-gray-100 dark:bg-gray-700/70 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-600'
                                                    }`}
                                                >
                                                    PROBLEMA
                                                </button>

                                                {onRemoveItem && (
                                                    <button
                                                        type="button"
                                                        onClick={() => onRemoveItem(item.id)}
                                                        title="Remover item desta vistoria (não existe neste flat/reserva)"
                                                        className="hidden sm:flex min-h-[44px] px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all border bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 items-center justify-center active:scale-95 touch-manipulation"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Detalhes para itens Pendentes ou com Problema */}
                                        {(isIssue || isPending) && (
                                            <div className="animate-fadeIn space-y-3 mt-3 pt-3 border-t border-gray-200/60 dark:border-gray-700/60">
                                                <textarea
                                                    placeholder={
                                                        isPending
                                                            ? 'Descreva a pendência ou motivo de aguardar...'
                                                            : 'Descreva a avaria ou problema...'
                                                    }
                                                    value={checklistState[item.id]?.note || ''}
                                                    onChange={(e) => onNoteChange(item.id, e.target.value)}
                                                    className={`w-full p-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-semibold outline-none focus:ring-2 ${
                                                        isPending
                                                            ? 'border-amber-400 dark:border-amber-700 focus:ring-amber-500'
                                                            : 'border-red-400 dark:border-red-700 focus:ring-red-500'
                                                    }`}
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
                                                                type="button"
                                                                onClick={() => onRemoveImage(item.id)}
                                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => onTriggerImageUpload(item.id)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm"
                                                        >
                                                            <Camera size={14} /> Anexar Foto
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InspectionChecklist;
