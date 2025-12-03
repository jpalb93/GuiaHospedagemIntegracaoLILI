import React, { useState, useEffect } from 'react';
import { PlaceRecommendation, PlaceCategory } from '../../types';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Save, Loader2, Link as LinkIcon, Phone, Tag, MapPin, MessageCircle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import ToastContainer, { ToastMessage } from '../Toast';
import ImageUpload from './ImageUpload';

interface PlacesManagerProps {
    places: {
        data: PlaceRecommendation[];
        loading: boolean;
        add: (place: Omit<PlaceRecommendation, 'id'>) => Promise<boolean>;
        update: (id: string, place: Partial<PlaceRecommendation>) => Promise<boolean>;
        delete: (id: string) => Promise<boolean>;
        refresh: () => void;
    };
}

const CATEGORIES: { id: PlaceCategory | 'all'; label: string }[] = [
    { id: 'burgers', label: 'Hambúrguer & Sanduíches' },
    { id: 'skewers', label: 'Espetinhos & Jantinha' },
    { id: 'salads', label: 'Saladas & Saudável' },
    { id: 'pasta', label: 'Pizzas & Massas' },
    { id: 'oriental', label: 'Oriental & Sushi' },
    { id: 'alacarte', label: 'À La Carte & Refinados' },
    { id: 'selfservice', label: 'Self-Service & Almoço' },
    { id: 'snacks', label: 'Lanches Rápidos' },
    { id: 'bars', label: 'Bares & Pubs' },
    { id: 'cafes', label: 'Cafés & Padarias' },
    { id: 'attractions', label: 'Passeios & Lazer' },
    { id: 'events', label: 'Eventos & Agenda' },
    { id: 'essentials', label: 'Mercados & Serviços' },
    { id: 'laundry', label: 'Lavanderia' },
    { id: 'salon', label: 'Salão de Beleza' },
    { id: 'gym', label: 'Academia' },
    { id: 'bikes', label: 'Aluguel de Bicicletas' },
    { id: 'souvenirs', label: 'Lembrancinhas' },
    { id: 'emergency', label: 'Hospitais & Clínicas' },
    { id: 'pharmacies', label: 'Farmácias' }
];

const PlacesManager: React.FC<PlacesManagerProps> = ({ places }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<PlaceRecommendation>>({
        name: '',
        description: '',
        address: '',
        mapsLink: '',
        imageUrl: '',
        category: 'burgers',
        visible: true,
        // Event specific
        eventDate: '',
        eventEndDate: '',
        eventTime: '',
        orderLink: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [filterCategory, setFilterCategory] = useState<string>('burgers');

    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [tagInput, setTagInput] = useState('');

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        // eslint-disable-next-line react-hooks/purity
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };

    useEffect(() => {
        if (places.data.length === 0) {
            places.refresh();
        }
    }, [places]);

    const handleOpenModal = (place?: PlaceRecommendation) => {
        if (place) {
            setEditingId(place.id || null);
            setFormData(place);
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                description: '',
                address: '',
                mapsLink: '',
                imageUrl: '',
                category: 'burgers',
                visible: true,
                eventDate: '',
                eventEndDate: '',
                eventTime: '',

                orderLink: '',
                distance: '',
                phoneNumber: '',
                whatsapp: '',
                tags: []
            });
            setTagInput('');
        }
        setIsModalOpen(true);
    };

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
        if (!formData.name || !formData.category) {
            showToast("Nome e Categoria são obrigatórios!", "warning");
            return;
        }

        setIsSaving(true);
        let success = false;

        if (editingId) {
            success = await places.update(editingId, formData);
        } else {
            success = await places.add(formData as Omit<PlaceRecommendation, 'id'>);
        }

        setIsSaving(false);
        if (success) {
            setIsModalOpen(false);
        }
    };

    const filteredPlaces = filterCategory === 'all'
        ? places.data
        : places.data.filter(p => p.category === filterCategory);

    return (
        <div className="space-y-6">
            {/* Header & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="all">Todas as Categorias</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-orange-500/20"
                >
                    <Plus size={20} /> Novo Local
                </button>
            </div>

            {/* List */}
            {places.loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-orange-500" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlaces.map((place) => (
                        <div key={place.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex gap-4 group hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors">
                            <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                                {place.imageUrl ? (
                                    <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24} /></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate pr-2">{place.name}</h3>
                                        <span className="text-[10px] uppercase font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-full">
                                            {CATEGORIES.find(c => c.id === place.category)?.label || place.category}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{place.description}</p>
                                {place.eventDate && (
                                    <p className="text-xs text-purple-500 font-bold mt-1">📅 {place.eventDate}</p>
                                )}

                                <div className="flex justify-end gap-2 mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => handleOpenModal(place)}
                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Edit size={14} /> Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!place.id) return;
                                            setConfirmModal({
                                                isOpen: true,
                                                title: "Excluir Local",
                                                message: `Tem certeza que deseja excluir "${place.name}"?`,
                                                isDestructive: true,
                                                onConfirm: async () => {
                                                    await places.delete(place.id!);
                                                    showToast("Local excluído com sucesso!", "success");
                                                }
                                            });
                                        }}
                                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={14} /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredPlaces.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-400">
                            Nenhum local encontrado nesta categoria.
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingId ? 'Editar Local' : 'Novo Local'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nome</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ex: Burger King"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Categoria</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value as PlaceCategory })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Descrição</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500 min-h-[80px]"
                                    placeholder="Descreva o local..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><MapPin size={12} /> Endereço</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Rua Exemplo, 123"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Distância (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.distance}
                                        onChange={e => setFormData({ ...formData, distance: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Ex: 500m"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><LinkIcon size={12} /> Link Pedido/Site</label>
                                    <input
                                        type="text"
                                        value={formData.orderLink}
                                        onChange={e => setFormData({ ...formData, orderLink: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><Phone size={12} /> Telefone</label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumber}
                                        onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="55879..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><MessageCircle size={12} /> WhatsApp (Opcional)</label>
                                    <input
                                        type="text"
                                        value={formData.whatsapp || ''}
                                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="55879..."
                                    />
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1 flex items-center gap-1"><Tag size={12} /> Tags</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Adicione tags (Enter)"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && addTag()}
                                    />
                                    <button onClick={addTag} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl">+</button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags?.map((tag, i) => (
                                        <span key={i} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                            {tag}
                                            <button onClick={() => removeTag(i)} className="hover:text-red-500"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Link do Maps</label>
                                <input
                                    type="text"
                                    value={formData.mapsLink}
                                    onChange={e => setFormData({ ...formData, mapsLink: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Imagem do Local</label>
                                <ImageUpload
                                    onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
                                    initialUrl={formData.imageUrl}
                                    folder="places"
                                    placeholder="Foto do Local"
                                />
                            </div>

                            {/* Event Specific Fields */}
                            {formData.category === 'events' && (
                                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 space-y-4">
                                    <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 uppercase">Detalhes do Evento</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Data Início</label>
                                            <input
                                                type="date"
                                                value={formData.eventDate}
                                                onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Data Fim (Opcional)</label>
                                            <input
                                                type="date"
                                                value={formData.eventEndDate}
                                                onChange={e => setFormData({ ...formData, eventEndDate: e.target.value })}
                                                className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Horário</label>
                                        <input
                                            type="text"
                                            value={formData.eventTime}
                                            onChange={e => setFormData({ ...formData, eventTime: e.target.value })}
                                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Ex: 20:00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Link de Ingressos/Info</label>
                                        <input
                                            type="text"
                                            value={formData.orderLink}
                                            onChange={e => setFormData({ ...formData, orderLink: e.target.value })}
                                            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            )}

                        </div>

                        <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800 z-10">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                {isSaving ? 'Salvando...' : 'Salvar'}
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

export default PlacesManager;
