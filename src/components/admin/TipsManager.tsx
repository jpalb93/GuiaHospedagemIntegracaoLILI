import React, { useState, useEffect } from 'react';
import { Tip, CityCuriosity } from '../../types';
import { Plus, Edit, Trash2, Save, X, Loader2, Sparkles, Image as ImageIcon, Link, GripVertical } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { iconMap, getIcon, iconTranslations } from '../../utils/iconMap';
import ConfirmModal from './ConfirmModal';
import ToastContainer, { ToastMessage } from '../Toast';

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

const TipsManager: React.FC<TipsManagerProps> = ({ tips, curiosities }) => {
    // --- TIPS STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Tip>>({
        title: '',
        subtitle: '',
        content: '',
        iconName: 'Sparkles',
        type: 'curiosity',
        visible: true,
        order: 0,
        image: ''
    });
    const [isSavingTip, setIsSavingTip] = useState(false);
    const [visibleTipsCount, setVisibleTipsCount] = useState(10); // PAGINATION

    // --- CURIOSITIES STATE ---
    const [curiosityForm, setCuriosityForm] = useState({ text: '', image: '' });
    const [editingCuriosityIndex, setEditingCuriosityIndex] = useState<number | null>(null); // EDITING STATE
    const [isSavingCuriosities, setIsSavingCuriosities] = useState(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    useEffect(() => {
        if (tips.data.length === 0) tips.refresh();
        if (curiosities.data.length === 0) curiosities.refresh();
    }, [tips, curiosities]);

    // --- TIPS HANDLERS ---
    const handleOpenModal = (tip?: Tip) => {
        if (tip) {
            setEditingId(tip.id || null);
            setFormData(tip);
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                subtitle: '',
                content: '',
                iconName: 'Sparkles',
                type: 'curiosity',
                visible: true,
                order: tips.data.length
            });
        }
        setIsModalOpen(true);
    };

    const handleSaveTip = async () => {
        if (!formData.title || !formData.content) {
            showToast("Título e Conteúdo são obrigatórios!", "warning");
            return;
        }

        setIsSavingTip(true);
        let success = false;

        if (editingId) {
            success = await tips.update(editingId, formData);
        } else {
            success = await tips.add(formData as Tip);
        }

        setIsSavingTip(false);
        if (success) {
            showToast(editingId ? "Dica atualizada com sucesso!" : "Dica criada com sucesso!", "success");
            setIsModalOpen(false);
        } else {
            showToast("Erro ao salvar dica.", "error");
        }
    };

    const handleLoadMoreTips = () => {
        setVisibleTipsCount(prev => prev + 10);
    };

    // --- CURIOSITIES HANDLERS ---
    const handleAddCuriosity = async () => {
        if (!curiosityForm.text.trim()) return;

        const newItem: CityCuriosity = {
            text: curiosityForm.text.trim(),
            image: curiosityForm.image.trim() || undefined,
            visible: true
        };

        let newItems = [...curiosities.data];

        if (editingCuriosityIndex !== null) {
            // UPDATE EXISTING
            newItems[editingCuriosityIndex] = newItem;
        } else {
            // ADD NEW
            newItems = [...newItems, newItem];
        }

        setIsSavingCuriosities(true);
        await curiosities.save(newItems);

        // RESET FORM
        setCuriosityForm({ text: '', image: '' });
        setEditingCuriosityIndex(null);
        setIsSavingCuriosities(false);
        showToast("Curiosidade salva!", "success");
    };

    const handleEditCuriosity = (index: number) => {
        const item = curiosities.data[index];
        setCuriosityForm({ text: item.text, image: item.image || '' });
        setEditingCuriosityIndex(index);
    };

    const handleCancelCuriosityEdit = () => {
        setCuriosityForm({ text: '', image: '' });
        setEditingCuriosityIndex(null);
    };

    const handleDeleteCuriosity = async (index: number) => {
        setConfirmModal({
            isOpen: true,
            title: "Remover Curiosidade",
            message: "Tem certeza que deseja remover esta curiosidade?",
            isDestructive: true,
            onConfirm: async () => {
                const newItems = curiosities.data.filter((_, i) => i !== index);
                setIsSavingCuriosities(true);
                await curiosities.save(newItems);
                setIsSavingCuriosities(false);
                showToast("Curiosidade removida.", "success");

                // If deleting the item currently being edited, cancel edit mode
                if (editingCuriosityIndex === index) {
                    handleCancelCuriosityEdit();
                }
            }
        });
    };

    const handleDeleteTip = async (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir esta dica?")) {
            const success = await tips.delete(id);
            if (success) {
                showToast("Dica removida.", "success");
            } else {
                showToast("Erro ao remover dica.", "error");
            }
        }
    };

    const sortedTips = [...tips.data].sort((a, b) => (a.order || 0) - (b.order || 0));
    const visibleTips = sortedTips.slice(0, visibleTipsCount);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* --- LEFT COLUMN: TIPS --- */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="text-yellow-500" /> Dicas do Flat
                    </h2>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-yellow-500/20 text-sm"
                    >
                        <Plus size={18} /> Nova Dica
                    </button>
                </div>

                {tips.loading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-yellow-500" size={32} /></div>
                ) : (
                    <div
                        className="space-y-4"
                        onDragOver={(e) => {
                            e.preventDefault();
                            const SCROLL_THRESHOLD = 150;
                            const SCROLL_SPEED = 20;

                            if (e.clientY < SCROLL_THRESHOLD) {
                                window.scrollBy(0, -SCROLL_SPEED);
                            } else if (e.clientY > window.innerHeight - SCROLL_THRESHOLD) {
                                window.scrollBy(0, SCROLL_SPEED);
                            }
                        }}
                    >
                        {visibleTips.map((tip, index) => {
                            const Icon = getIcon(tip.iconName);
                            return (
                                <div
                                    key={tip.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('text/plain', index.toString());
                                        e.dataTransfer.effectAllowed = 'move';
                                        // Add a ghost class or style if needed
                                        (e.target as HTMLElement).style.opacity = '0.5';
                                    }}
                                    onDragEnd={(e) => {
                                        (e.target as HTMLElement).style.opacity = '1';
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault(); // Necessary to allow dropping
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const draggedIndexStr = e.dataTransfer.getData('text/plain');
                                        const draggedIndex = parseInt(draggedIndexStr, 10);
                                        const targetIndex = index;

                                        if (draggedIndex !== targetIndex) {
                                            const newTips = [...sortedTips];
                                            const [removed] = newTips.splice(draggedIndex, 1);
                                            newTips.splice(targetIndex, 0, removed);

                                            // Update order property for all items
                                            const reorderedTips = newTips.map((t, i) => ({ ...t, order: i }));
                                            tips.reorder(reorderedTips);
                                        }
                                    }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 group hover:border-yellow-200 dark:hover:border-yellow-900/50 transition-all cursor-move active:cursor-grabbing"
                                >
                                    <div className="flex items-center justify-center text-gray-300 cursor-grab active:cursor-grabbing">
                                        <GripVertical size={20} />
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600 dark:text-yellow-400 flex-shrink-0">
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate">{tip.title}</h3>
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{tip.subtitle}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">{tip.content}</p>

                                        <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={() => handleOpenModal(tip)}
                                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <Edit size={14} /> Editar
                                            </button>
                                            <button
                                                onClick={() => tip.id && handleDeleteTip(tip.id)}
                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <Trash2 size={14} /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {sortedTips.length > visibleTipsCount && (
                            <button
                                onClick={handleLoadMoreTips}
                                className="w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Carregar mais dicas ({sortedTips.length - visibleTipsCount} restantes)
                            </button>
                        )}

                        {sortedTips.length === 0 && (
                            <div className="text-center py-8 text-gray-400 text-sm">Nenhuma dica cadastrada.</div>
                        )}
                    </div>
                )}
            </div>

            {/* --- RIGHT COLUMN: CURIOSITIES --- */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    💡 Curiosidades da Cidade
                </h2>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    <div className="flex flex-col gap-3 mb-6">
                        <input
                            type="text"
                            value={curiosityForm.text}
                            onChange={(e) => setCuriosityForm({ ...curiosityForm, text: e.target.value })}
                            placeholder="Digite uma curiosidade..."
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <ImageIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={curiosityForm.image}
                                    onChange={(e) => setCuriosityForm({ ...curiosityForm, image: e.target.value })}
                                    placeholder="URL da Imagem (Opcional)"
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCuriosity()}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <ImageUpload
                                onUpload={(url) => setCuriosityForm(prev => ({ ...prev, image: url }))}
                                initialUrl={curiosityForm.image}
                                folder="curiosities"
                                placeholder="Ou envie uma imagem"
                                maxDimension={800}
                            />

                            {editingCuriosityIndex !== null && (
                                <button
                                    onClick={handleCancelCuriosityEdit}
                                    className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-xl font-bold transition-colors"
                                    title="Cancelar Edição"
                                >
                                    <X size={20} />
                                </button>
                            )}

                            <button
                                onClick={handleAddCuriosity}
                                disabled={isSavingCuriosities || !curiosityForm.text.trim()}
                                className={`${editingCuriosityIndex !== null ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-4 py-2 rounded-xl font-bold disabled:opacity-50 transition-colors flex items-center justify-center min-w-[50px]`}
                            >
                                {isSavingCuriosities ? <Loader2 className="animate-spin" size={20} /> : (editingCuriosityIndex !== null ? <Save size={20} /> : <Plus size={20} />)}
                            </button>
                        </div>
                    </div>

                    {curiosities.loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-blue-500" size={24} /></div>
                    ) : (
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                            {curiosities.data.map((item, idx) => (
                                <div key={idx} className={`flex items-start gap-3 p-3 rounded-xl group transition-colors ${editingCuriosityIndex === idx ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900'}`}>
                                    <span className="text-blue-500 font-bold text-xs mt-1">#{idx + 1}</span>
                                    {item.image && (
                                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-200" />
                                    )}
                                    <p className="flex-1 text-sm text-gray-700 dark:text-gray-300">{item.text}</p>

                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => handleEditCuriosity(idx)}
                                            className="text-gray-400 hover:text-blue-500 p-1"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCuriosity(idx)}
                                            className="text-gray-400 hover:text-red-500 p-1"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {curiosities.data.length === 0 && (
                                <div className="text-center py-8 text-gray-400 text-sm">Nenhuma curiosidade cadastrada.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODAL FOR TIPS --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingId ? 'Editar Dica' : 'Nova Dica'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Título</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Ex: Wi-Fi"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Subtítulo</label>
                                <input
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Ex: Senha da Rede"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ícone</label>
                                <select
                                    value={formData.iconName}
                                    onChange={e => setFormData({ ...formData, iconName: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {Object.keys(iconMap).sort().map(iconName => (
                                        <option key={iconName} value={iconName}>
                                            {iconTranslations[iconName] || iconName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Imagem (URL)</label>
                                <div className="space-y-2">
                                    <ImageUpload
                                        onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                                        initialUrl={formData.image}
                                        folder="tips"
                                        placeholder="Enviar imagem da dica"
                                        maxDimension={1200}
                                    />
                                    <div className="relative">
                                        <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.image || ''}
                                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-3 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-sm font-mono text-gray-600"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Conteúdo</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500 min-h-[100px]"
                                    placeholder="Texto da dica..."
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Ordem</label>
                                <input
                                    type="number"
                                    value={formData.order}
                                    onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveTip}
                                disabled={isSavingTip}
                                className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSavingTip ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {isSavingTip ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                message={confirmModal.message}
                isDestructive={confirmModal.isDestructive}
            />

            <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
        </div>
    );
};

export default TipsManager;
