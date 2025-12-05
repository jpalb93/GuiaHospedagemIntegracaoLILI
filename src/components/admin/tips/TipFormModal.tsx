import React from 'react';
import { Tip } from '../../../types';
import { X, Save, Loader2, Link } from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { iconMap, iconTranslations } from '../../../utils/iconMap';

interface TipFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: Partial<Tip>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Tip>>>;
    onSave: () => void;
    isSaving: boolean;
    isEditing: boolean;
}

const TipFormModal: React.FC<TipFormModalProps> = ({
    isOpen,
    onClose,
    formData,
    setFormData,
    onSave,
    isSaving,
    isEditing
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? 'Editar Dica' : 'Nova Dica'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
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
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Imagem</label>
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

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(TipFormModal);
