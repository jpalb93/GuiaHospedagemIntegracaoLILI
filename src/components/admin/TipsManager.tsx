import React, { useState, useEffect } from 'react';
import { Tip, CityCuriosity } from '../../types';
import { Plus, Loader2, Sparkles, Download } from 'lucide-react';
import Button from '../ui/Button';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../../contexts/ToastContext';
import { TipItemCard, TipFormModal, CuriositiesSection } from './tips';

interface TipsManagerProps {
    tips: {
        data: Tip[];
        loading: boolean;
        add: (tip: Tip) => Promise<boolean>;
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
        onConfirm: () => { },
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
        const success = editingId
            ? await tips.update(editingId, formData)
            : await tips.add(formData as Tip);

        setIsSavingTip(false);
        if (success) {
            showSuccess(editingId ? 'Dica atualizada!' : 'Dica criada!');
            setIsModalOpen(false);
        } else {
            showError('Erro ao salvar dica.');
        }
    };

    const handleDeleteTip = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta dica?')) {
            const success = await tips.delete(id);
            success ? showSuccess('Dica removida.') : showError('Erro ao remover dica.');
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
                onDelete={handleDeleteCuriosity}
                showToast={showToast}
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
