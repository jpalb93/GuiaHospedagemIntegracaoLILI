import React, { useState, useEffect } from 'react';
import { Tip, CityCuriosity } from '../../types';
import { Plus, Loader2, Sparkles, Download } from 'lucide-react';
import Button from '../ui/Button';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../../contexts/ToastContext';
import { TipItemCard, TipFormModal, CuriositiesSection } from './tips';
import { translateBatch } from '../../services/translation';

interface TipsManagerProps {
    tips: {
        data: Tip[];
        loading: boolean;
        add: (tip: Tip) => Promise<string | null>;
        update: (id: string, tip: Partial<Tip>) => Promise<boolean>;
        delete: (id: string) => Promise<boolean>;
        reorder: (tips: Tip[]) => Promise<boolean>;
        refresh: () => void;
    };
    curiosities: {
        data: CityCuriosity[];
        loading: boolean;
        save: (items: CityCuriosity[]) => Promise<boolean>;
        refresh: () => void;
    };
}

const DEFAULT_TIP_FORM: Partial<Tip> = {
    title: '',
    subtitle: '',
    content: '',
    iconName: 'Sparkles',
    type: 'curiosity',
    visible: true,
    order: 0,
    image: '',
};

const TipsManager: React.FC<TipsManagerProps> = ({ tips, curiosities }) => {
    // --- TIPS STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Tip>>(DEFAULT_TIP_FORM);
    const [isSavingTip, setIsSavingTip] = useState(false);
    const [visibleTipsCount, setVisibleTipsCount] = useState(10);

    // --- CURIOSITIES STATE ---
    const [curiosityForm, setCuriosityForm] = useState({ text: '', image: '' });
    const [editingCuriosityIndex, setEditingCuriosityIndex] = useState<number | null>(null);
    const [isSavingCuriosities, setIsSavingCuriosities] = useState(false);

    // --- UI STATE ---
    const { showSuccess, showError, showWarning } = useToast();

    // Compatibility wrapper for CuriositiesSection prop
    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        const toastFunctions = { success: showSuccess, error: showError, warning: showWarning };
        toastFunctions[type](message);
    };

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        isDestructive: false,
    });

    useEffect(() => {
        if (tips.data.length === 0 && !tips.loading) tips.refresh();
        if (curiosities.data.length === 0 && !curiosities.loading) curiosities.refresh();
    }, [
        tips.data.length,
        tips.loading,
        tips.refresh,
        curiosities.data.length,
        curiosities.loading,
        curiosities.refresh,
    ]);

    // --- TIPS HANDLERS ---
    const handleOpenModal = (tip?: Tip) => {
        if (tip) {
            setEditingId(tip.id || null);
            setFormData(tip);
        } else {
            setEditingId(null);
            setFormData({ ...DEFAULT_TIP_FORM, order: tips.data.length });
        }
        setIsModalOpen(true);
    };

    const handleSaveTip = async () => {
        if (!formData.title || !formData.content) {
            showWarning('Título e Conteúdo são obrigatórios!');
            return;
        }

        setIsSavingTip(true);
        let resultId: string | null | boolean = null;

        if (editingId) {
            resultId = await tips.update(editingId, formData);
        } else {
            resultId = await tips.add(formData as Tip);
        }

        setIsSavingTip(false);

        if (resultId) {
            showSuccess(editingId ? 'Dica atualizada!' : 'Dica criada!');
            setIsModalOpen(false);

            // AUTO-TRANSLATE (Option 1)
            const tipId = editingId || (typeof resultId === 'string' ? resultId : null);
            if (tipId) {
                // Construct the full tip object for translation
                const tipToTranslate: Tip = {
                    ...(formData as Tip),
                    id: tipId,
                };
                // Trigger silent translation
                handleTranslateTips([tipToTranslate], true);
            }
        } else {
            showError('Erro ao salvar dica.');
        }
    };

    const handleDeleteTip = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta dica?')) {
            const success = await tips.delete(id);
            if (success) {
                showSuccess('Dica removida.');
            } else {
                showError('Erro ao remover dica.');
            }
        }
    };

    const sortedTips = [...tips.data].sort((a, b) => (a.order || 0) - (b.order || 0));
    const visibleTips = sortedTips.slice(0, visibleTipsCount);

    const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const newTips = [...sortedTips];
        [newTips[index], newTips[index - 1]] = [newTips[index - 1], newTips[index]];
        tips.reorder(newTips.map((t, i) => ({ ...t, order: i })));
    };

    const handleMoveDown = (index: number) => {
        if (index === sortedTips.length - 1) return;
        const newTips = [...sortedTips];
        [newTips[index], newTips[index + 1]] = [newTips[index + 1], newTips[index]];
        tips.reorder(newTips.map((t, i) => ({ ...t, order: i })));
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', index.toString());
        e.dataTransfer.effectAllowed = 'move';
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (draggedIndex !== targetIndex) {
            const newTips = [...sortedTips];
            const [removed] = newTips.splice(draggedIndex, 1);
            newTips.splice(targetIndex, 0, removed);
            tips.reorder(newTips.map((t, i) => ({ ...t, order: i })));
        }
    };

    // --- CURIOSITIES HANDLERS ---
    const handleDeleteCuriosity = (index: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remover Curiosidade',
            message: 'Tem certeza que deseja remover esta curiosidade?',
            isDestructive: true,
            onConfirm: async () => {
                const newItems = curiosities.data.filter((_, i) => i !== index);
                setIsSavingCuriosities(true);
                await curiosities.save(newItems);
                setIsSavingCuriosities(false);
                showSuccess('Curiosidade removida.');
                if (editingCuriosityIndex === index) {
                    setCuriosityForm({ text: '', image: '' });
                    setEditingCuriosityIndex(null);
                }
            },
        });
    };

    // --- TRANSLATION LOGIC (TIPS) ---
    const handleTranslateTips = async (itemsToTranslate?: Tip[], silent = false) => {
        const tipsToCheck = itemsToTranslate || tips.data;

        const untranslated = tipsToCheck.filter((t) => !t.title_en || !t.content_en || !t.title_es);

        if (untranslated.length === 0) {
            if (!silent) showSuccess('Todas as dicas já estão traduzidas!');
            return;
        }

        if (!silent && !confirm(`Traduzir ${untranslated.length} dicas pendentes?`)) return;

        setIsSavingTip(true);
        try {
            const results = await translateBatch(
                untranslated.map((t) => ({
                    ...t, // Pass all props so translateBatch checks work
                    id: t.id!,
                    // No need to stringify. translateBatch picks keys from 'fields' config.
                })),
                [
                    { source: 'title', targetEn: 'title_en', targetEs: 'title_es' },
                    { source: 'subtitle', targetEn: 'subtitle_en', targetEs: 'subtitle_es' },
                    { source: 'content', targetEn: 'content_en', targetEs: 'content_es' },
                ],
                'gemini-2.5-flash-lite'
            );

            for (const item of results) {
                const res = item as unknown as Tip;
                if (res.id) {
                    // O resultado já é o objeto de atualização (Partial<Tip>)
                    await tips.update(res.id, res);
                }
            }
            showSuccess('Dicas traduzidas!');
            tips.refresh();
        } catch (err) {
            console.error(err);
            showError('Erro na tradução automática. Verifique sua conexão.');
        } finally {
            setIsSavingTip(false);
        }
    };

    // --- TRANSLATION LOGIC (CURIOSITIES) ---
    const handleTranslateCuriosities = async (itemsToScan?: CityCuriosity[], silent = false) => {
        // Use provided list OR current state
        const listToCheck = itemsToScan || curiosities.data;

        const untranslated = listToCheck.filter((c) => !c.text_en || !c.text_es);

        if (untranslated.length === 0) {
            if (!silent) showSuccess('Curiosidades já traduzidas!');
            return;
        }

        if (!silent && !confirm(`Traduzir ${untranslated.length} curiosidades pendentes?`)) return;

        setIsSavingCuriosities(true);
        try {
            // Curiosities usually just have 'text'.
            const results = await translateBatch(
                untranslated.map((c) => ({
                    id: c.id || `temp-${Date.now()}-${Math.random()}`, // Ensure ID exists for mapping
                    text: c.text,
                    type: 'curiosity',
                    field: 'text',
                })),
                [{ source: 'text', targetEn: 'text_en', targetEs: 'text_es' }],
                'gemini-2.5-flash-lite'
            );

            // Batch save for curiosities (usually we save the whole array)
            // But here we might update items in place and save the whole array.
            // IMPORTANT: If itemsToScan is provided (e.g. from CuriositiesSection after add), use it!
            // Otherwise we risk using stale state from curiosities.data and overwriting the new item.
            const newCuriosities = itemsToScan ? [...itemsToScan] : [...curiosities.data];
            let changed = false;
            let matchCount = 0;

            for (const item of results) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const res = item as any; // Cast to any to access translated fields
                // Tenta encontrar pelo ID (que garantimos enviar)
                let idx = newCuriosities.findIndex((c) => c.id === res.id);

                // Fallback: Tenta pelo texto se o ID falhar (improvável mas seguro)
                if (idx === -1 && res.text) {
                    idx = newCuriosities.findIndex((c) => c.text === res.text);
                }

                if (idx !== -1) {
                    newCuriosities[idx] = {
                        ...newCuriosities[idx],
                        text_en: res.text_en || newCuriosities[idx].text_en,
                        text_es: res.text_es || newCuriosities[idx].text_es,
                    };
                    changed = true;
                    matchCount++;
                }
            }

            if (changed) {
                await curiosities.save(newCuriosities);
                if (!silent) showSuccess(`Sucesso! ${matchCount} curiosidades traduzidas.`);
            } else {
                if (!silent) showWarning('Nenhuma curiosidade foi atualizada. Verifique os logs.');
            }
        } catch (err) {
            console.error(err);
            // Always show error for translation failures, even in silent mode,
            // otherwise user thinks it worked but it didn't.
            showError('Erro na tradução automática. Tente novamente.');
        } finally {
            setIsSavingCuriosities(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- LEFT COLUMN: TIPS --- */}
            <div className="space-y-6">
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-yellow-500" /> Dicas do Flat
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                        {/* Backup Buttons */}
                        {tips.data.length > 0 && (
                            <Button
                                onClick={() => {
                                    const dataStr = JSON.stringify(tips.data, null, 2);
                                    const blob = new Blob([dataStr], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `backup_dicas_${new Date().toISOString().split('T')[0]}.json`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                    showSuccess('Backup exportado!');
                                }}
                                variant="ghost"
                                size="sm"
                                leftIcon={<Download size={14} />}
                                className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                            >
                                Backup
                            </Button>
                        )}
                        <Button
                            onClick={() => handleTranslateTips()}
                            variant="ghost"
                            size="sm"
                            leftIcon={<Sparkles size={16} />}
                            className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                            disabled={isSavingTip}
                        >
                            {isSavingTip ? '...' : 'Traduzir'}
                        </Button>
                        <Button
                            onClick={() => handleOpenModal()}
                            leftIcon={<Plus size={18} />}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-yellow-500/20"
                        >
                            Nova Dica
                        </Button>
                    </div>
                </div>

                {tips.loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-yellow-500" size={32} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {visibleTips.map((tip, index) => (
                            <TipItemCard
                                key={tip.id}
                                tip={tip}
                                index={index}
                                totalItems={sortedTips.length}
                                onEdit={handleOpenModal}
                                onDelete={handleDeleteTip}
                                onMoveUp={handleMoveUp}
                                onMoveDown={handleMoveDown}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            />
                        ))}

                        {sortedTips.length > visibleTipsCount && (
                            <Button
                                onClick={() => setVisibleTipsCount((prev) => prev + 10)}
                                variant="ghost"
                                fullWidth
                                className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Carregar mais dicas ({sortedTips.length - visibleTipsCount}{' '}
                                restantes)
                            </Button>
                        )}

                        {sortedTips.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Nenhuma dica cadastrada.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* --- RIGHT COLUMN: CURIOSITIES --- */}
            <CuriositiesSection
                curiosities={curiosities}
                curiosityForm={curiosityForm}
                setCuriosityForm={setCuriosityForm}
                editingIndex={editingCuriosityIndex}
                setEditingIndex={setEditingCuriosityIndex}
                isSaving={isSavingCuriosities}
                setIsSaving={setIsSavingCuriosities}
                showToast={showToast}
                onTranslate={handleTranslateCuriosities}
                onDelete={handleDeleteCuriosity}
            />

            {/* --- MODAL --- */}
            <TipFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSave={handleSaveTip}
                isSaving={isSavingTip}
                isEditing={!!editingId}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={confirmModal.isDestructive}
            />
        </div>
    );
};

export default TipsManager;
