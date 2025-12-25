import React, { useState, useEffect } from 'react';
import { PlaceRecommendation, PlaceCategory } from '../../../types';
import {
    X,
    Save,
    Loader2,
    Link as LinkIcon,
    Phone,
    Tag,
    MapPin,
    MessageCircle,
} from 'lucide-react';
import ImageUpload from '../ImageUpload';
import { CATEGORIES, DEFAULT_FORM_DATA } from './constants';

interface PlaceFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (place: Partial<PlaceRecommendation>, isEdit: boolean) => Promise<void>;
    editingPlace: PlaceRecommendation | null;
    isSaving: boolean;
}

/**
 * Modal de formulário para criar ou editar um local
 */
const PlaceFormModal: React.FC<PlaceFormModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingPlace,
    isSaving,
}) => {
    const [formData, setFormData] = useState<Partial<PlaceRecommendation>>(DEFAULT_FORM_DATA);
    const [tagInput, setTagInput] = useState('');

    // Preenche o formulário quando editando
    useEffect(() => {
        if (editingPlace) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(editingPlace);
            setTagInput('');
        } else {
            setFormData(DEFAULT_FORM_DATA);
            setTagInput('');
        }
    }, [editingPlace, isOpen]);

    const addTag = () => {
        if (!tagInput.trim()) return;
        const currentTags = formData.tags || [];
        setFormData({ ...formData, tags: [...currentTags, tagInput.trim()] });
        setTagInput('');
    };

    const removeTag = (index: number) => {
        const currentTags = formData.tags || [];
        setFormData({ ...formData, tags: currentTags.filter((_, i) => i !== index) });
    };

    const handleSave = async () => {
        await onSave(formData, !!editingPlace);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {editingPlace ? 'Editar Local' : 'Novo Local'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-4">
                    {/* Nome e Categoria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                Nome
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex: Burger King"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                Categoria
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        category: e.target.value as PlaceCategory,
                                    })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Descrição */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Descrição
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
                            placeholder="Descreva o local..."
                        />
                    </div>

                    {/* Endereço e Distância */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <MapPin size={12} /> Endereço
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Rua Exemplo, 123"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                Distância (Opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.distance}
                                onChange={(e) =>
                                    setFormData({ ...formData, distance: e.target.value })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex: 500m"
                            />
                        </div>
                    </div>

                    {/* Link de Pedido e Telefone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <LinkIcon size={12} /> Link Pedido/Site
                            </label>
                            <input
                                type="text"
                                value={formData.orderLink}
                                onChange={(e) =>
                                    setFormData({ ...formData, orderLink: e.target.value })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <Phone size={12} /> Telefone
                            </label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) =>
                                    setFormData({ ...formData, phoneNumber: e.target.value })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="55879..."
                            />
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                <MessageCircle size={12} /> WhatsApp (Opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.whatsapp || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, whatsapp: e.target.value })
                                }
                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="55879..."
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                            <Tag size={12} /> Tags
                        </label>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Adicione tags (Enter)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                            />
                            <button
                                onClick={addTag}
                                className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl"
                            >
                                +
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags?.map((tag, i) => (
                                <span
                                    key={i}
                                    className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeTag(i)}
                                        className="hover:text-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Link do Maps */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Link do Maps
                        </label>
                        <input
                            type="text"
                            value={formData.mapsLink}
                            onChange={(e) => setFormData({ ...formData, mapsLink: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="https://maps.google.com/..."
                        />
                    </div>

                    {/* Imagem */}
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                            Imagem do Local
                        </label>
                        <ImageUpload
                            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                            initialUrl={formData.imageUrl}
                            folder="places"
                            placeholder="Foto do Local"
                        />
                    </div>

                    {/* Campos de Evento (apenas se categoria for 'events') */}
                    {formData.category === 'events' && (
                        <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 space-y-4">
                            <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 uppercase">
                                Detalhes do Evento
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                        Data Início
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) =>
                                            setFormData({ ...formData, eventDate: e.target.value })
                                        }
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                        Data Fim (Opcional)
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.eventEndDate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                eventEndDate: e.target.value,
                                            })
                                        }
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                    Horário
                                </label>
                                <input
                                    type="text"
                                    value={formData.eventTime}
                                    onChange={(e) =>
                                        setFormData({ ...formData, eventTime: e.target.value })
                                    }
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Ex: 20:00"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                                    Link de Ingressos/Info
                                </label>
                                <input
                                    type="text"
                                    value={formData.orderLink}
                                    onChange={(e) =>
                                        setFormData({ ...formData, orderLink: e.target.value })
                                    }
                                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || !formData.name || !formData.category}
                        className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {isSaving ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceFormModal;
