import React, { useState, useEffect } from 'react';
import {
    Plus, Save, X, Image as ImageIcon, MapPin, Phone, Tag,
    Link as LinkIcon, Edit, Trash2, Calendar, Clock, ChevronDown, ChevronUp, AlertCircle, MessageCircle
} from 'lucide-react';
import { PlaceRecommendation, PlaceCategory } from '../../types';
import { getDynamicPlaces, addDynamicPlace, updateDynamicPlace, deleteDynamicPlace } from '../../services/firebase';
import OptimizedImage from '../OptimizedImage';
import ImageUpload from '../admin/ImageUpload';

const CATEGORIES: { id: PlaceCategory; label: string }[] = [
    { id: 'burgers', label: 'Hambúrgueres' },
    { id: 'skewers', label: 'Espetinhos' },
    { id: 'salads', label: 'Saladas & Saudável' },
    { id: 'pasta', label: 'Massas & Pizza' },
    { id: 'oriental', label: 'Oriental' },
    { id: 'alacarte', label: 'À la Carte' },
    { id: 'selfservice', label: 'Self-Service' },
    { id: 'bars', label: 'Bares' },
    { id: 'cafes', label: 'Cafés & Padarias' },
    { id: 'snacks', label: 'Lanches & Delivery' },
    { id: 'essentials', label: 'Mercados & Serviços' },
    { id: 'laundry', label: 'Lavanderia' },
    { id: 'salon', label: 'Salão de Beleza' },
    { id: 'gym', label: 'Academia' },
    { id: 'attractions', label: 'Passeios & Lazer' },
    { id: 'bikes', label: 'Aluguel de Bicicletas' },
    { id: 'souvenirs', label: 'Lembrancinhas' },
    { id: 'events', label: 'Eventos & Shows' },
    { id: 'emergency', label: 'Emergência' },
    { id: 'pharmacies', label: 'Farmácias' },
];

const PlacesManager: React.FC = () => {
    const [places, setPlaces] = useState<PlaceRecommendation[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');

    const [newPlace, setNewPlace] = useState<Partial<PlaceRecommendation>>({
        tags: [],
        visible: true,
        category: 'burgers'
    });

    useEffect(() => {
        loadPlaces();
    }, []);

    const loadPlaces = async () => {
        setLoading(true);
        const data = await getDynamicPlaces(true);
        setPlaces(data);
        setLoading(false);
    };

    const toggleCategory = (catId: string) => {
        setCollapsedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const validateImageUrl = (url: string): boolean => {
        if (!url) return false;
        try {
            const parsed = new URL(url);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
            return false;
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setNewPlace({ tags: [], visible: true, category: 'burgers' });
        setTagInput('');
    };

    const handleEditPlace = (place: PlaceRecommendation) => {
        if (!place.id) return;
        setEditingId(place.id);
        setNewPlace(place);
        setIsFormOpen(true);
    };

    const handleSavePlace = async () => {
        if (!newPlace.name || !newPlace.description || !newPlace.imageUrl || !newPlace.category) {
            alert("Preencha os campos obrigatórios!");
            return;
        }

        if (!validateImageUrl(newPlace.imageUrl)) {
            alert("URL de imagem inválida! Certifique-se de usar um link completo começando com http:// ou https://");
            return;
        }

        setLoading(true);
        try {
            const placeData = {
                name: newPlace.name,
                description: newPlace.description,
                imageUrl: newPlace.imageUrl,
                category: newPlace.category as PlaceCategory,
                tags: newPlace.tags || [],
                address: newPlace.address || "",
                phoneNumber: newPlace.phoneNumber || "",
                whatsapp: newPlace.whatsapp || "",
                orderLink: newPlace.orderLink || "",
                distance: newPlace.distance || "",
                eventDate: newPlace.eventDate || "",
                eventEndDate: newPlace.eventEndDate || "",
                eventTime: newPlace.eventTime || "",
                eventEndTime: newPlace.eventEndTime || "",
                visible: true
            };

            if (editingId) {
                await updateDynamicPlace(editingId, placeData);
                setPlaces(prev => prev.map(p => p.id === editingId ? { ...p, ...placeData } : p));
            } else {
                const newId = await addDynamicPlace(placeData);
                setPlaces(prev => [...prev, { id: newId, ...placeData }]);
            }

            handleCloseForm();
        } catch (e) {
            console.error(e);
            alert(`Erro ao salvar: ${(e as Error).message || "Tente novamente."}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id || !confirm("Tem certeza que deseja excluir este local?")) return;
        setLoading(true);
        try {
            await deleteDynamicPlace(id);
            setPlaces(prev => prev.filter(p => p.id !== id));
        } catch (_e) {
            alert("Erro ao excluir.");
        } finally {
            setLoading(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setNewPlace(prev => ({
                ...prev,
                tags: [...(prev.tags || []), tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (indexToRemove: number) => {
        setNewPlace(prev => ({
            ...prev,
            tags: prev.tags?.filter((_, index) => index !== indexToRemove)
        }));
    };

    const uncategorizedPlaces = places.filter(p => !CATEGORIES.some(c => c.id === p.category));

    if (loading && places.length === 0) {
        return <div className="text-center py-10 opacity-50 flex items-center justify-center gap-2"><div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div> Carregando locais...</div>;
    }

    return (
        <>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                    <Plus size={16} /> Novo Local
                </button>
            </div>

            {!loading && places.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
                    <p className="text-gray-400 font-medium">Nenhum local cadastrado ainda.</p>
                    <button onClick={() => setIsFormOpen(true)} className="mt-4 text-orange-500 font-bold hover:underline">Cadastrar o primeiro</button>
                </div>
            )}

            <div className="space-y-8">
                {CATEGORIES.map(category => {
                    const categoryPlaces = places.filter(p => p.category === category.id);
                    if (categoryPlaces.length === 0) return null;

                    const isCollapsed = collapsedCategories.includes(category.id);

                    return (
                        <div key={category.id} className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold font-heading text-gray-800 dark:text-white flex items-center gap-2">
                                        {category.label}
                                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2 py-0.5 rounded-full font-sans">
                                            {categoryPlaces.length}
                                        </span>
                                    </h2>
                                </div>
                                {isCollapsed ? <ChevronDown className="text-gray-400" /> : <ChevronUp className="text-gray-400" />}
                            </button>

                            {!isCollapsed && (
                                <div className="p-4 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryPlaces.map(place => (
                                            <div key={place.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all flex flex-col group">
                                                <div className="h-40 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                                                    <OptimizedImage src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-lg font-heading mb-1">{place.name}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{place.description}</p>

                                                    {(place.category === 'events' && place.eventDate) && (
                                                        <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded-md w-fit">
                                                            <Calendar size={12} />
                                                            {place.eventDate.split('-').reverse().join('/')}
                                                            {place.eventTime && ` • ${place.eventTime}`}
                                                        </div>
                                                    )}

                                                    <div className="mt-auto flex justify-end pt-3 border-t border-gray-100 dark:border-gray-700 gap-2">
                                                        <button
                                                            onClick={() => handleEditPlace(place)}
                                                            className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                                        >
                                                            <Edit size={16} /> Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(place.id)}
                                                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold uppercase"
                                                        >
                                                            <Trash2 size={16} /> Excluir
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {uncategorizedPlaces.length > 0 && (
                    <div className="bg-white/50 dark:bg-gray-800/30 rounded-2xl border border-red-200 dark:border-red-900 overflow-hidden">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
                            <h2 className="text-lg font-bold font-heading text-red-700 dark:text-red-400 flex items-center gap-2">
                                <AlertCircle size={20} /> Outros / Sem Categoria
                                <span className="bg-white dark:bg-black/20 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-sans">
                                    {uncategorizedPlaces.length}
                                </span>
                            </h2>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {uncategorizedPlaces.map(place => (
                                <div key={place.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
                                    <div className="p-4">
                                        <h3 className="font-bold">{place.name}</h3>
                                        <p className="text-xs text-gray-500 mb-2">Categoria inválida: {place.category}</p>
                                        <button onClick={() => handleEditPlace(place)} className="text-blue-500 text-xs font-bold uppercase">Corrigir Agora</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleCloseForm}
                        role="button"
                        tabIndex={0}
                        aria-label="Fechar modal"
                        onKeyDown={(e) => e.key === 'Escape' && handleCloseForm()}
                    ></div>
                    <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh]">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800 rounded-t-2xl">
                            <h2 className="text-xl font-bold font-heading">{editingId ? 'Editar Local' : 'Novo Local'}</h2>
                            <button onClick={handleCloseForm} aria-label="Fechar" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome do Local *</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="Ex: Pizzaria Bella Napoli"
                                        value={newPlace.name || ''}
                                        onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria *</label>
                                    <select
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
                                        value={newPlace.category}
                                        onChange={e => setNewPlace({ ...newPlace, category: e.target.value as PlaceCategory })}
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {newPlace.category === 'events' && (
                                    <div className="col-span-1 md:col-span-2 bg-pink-50 dark:bg-pink-900/20 p-4 rounded-xl border border-pink-100 dark:border-pink-800/30 grid grid-cols-2 gap-4 animate-fadeIn">
                                        <div className="col-span-2">
                                            <p className="text-xs font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1 mb-2 uppercase tracking-wider">
                                                <Calendar size={14} /> Configuração do Evento
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data do Evento (Início) *</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                                value={newPlace.eventDate || ''}
                                                onChange={e => setNewPlace({ ...newPlace, eventDate: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Fim (Opcional)</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                                value={newPlace.eventEndDate || ''}
                                                onChange={e => setNewPlace({ ...newPlace, eventEndDate: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Início (Opcional)</label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="time"
                                                    className="w-full p-3 pl-9 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                                    value={newPlace.eventTime || ''}
                                                    onChange={e => setNewPlace({ ...newPlace, eventTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Hora Fim (Opcional)</label>
                                            <div className="relative">
                                                <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="time"
                                                    className="w-full p-3 pl-9 bg-white dark:bg-gray-800 rounded-xl border border-pink-200 dark:border-gray-700 focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                                    value={newPlace.eventEndTime || ''}
                                                    onChange={e => setNewPlace({ ...newPlace, eventEndTime: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 text-[10px] text-pink-600 dark:text-pink-400 italic">
                                            * O evento deixará de aparecer no guia automaticamente após a data final.
                                        </div>
                                    </div>
                                )}

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição *</label>
                                    <textarea
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none resize-none h-24"
                                        placeholder="Descreva o local em poucas palavras..."
                                        value={newPlace.description || ''}
                                        onChange={e => setNewPlace({ ...newPlace, description: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><ImageIcon size={12} /> Imagem do Local *</label>
                                    <ImageUpload
                                        onUpload={(url) => setNewPlace({ ...newPlace, imageUrl: url })}
                                        initialUrl={newPlace.imageUrl}
                                        folder="places"
                                        placeholder="Foto do Local (Restaurante, Prato...)"
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><MapPin size={12} /> Endereço</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Rua..."
                                                value={newPlace.address || ''}
                                                onChange={e => setNewPlace({ ...newPlace, address: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Distância (Opcional)</label>
                                            <input
                                                className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Ex: 500m"
                                                value={newPlace.distance || ''}
                                                onChange={e => setNewPlace({ ...newPlace, distance: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><LinkIcon size={12} /> Link Pedido/Site</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="https://ifood..."
                                        value={newPlace.orderLink || ''}
                                        onChange={e => setNewPlace({ ...newPlace, orderLink: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Phone size={12} /> Telefone (Só Números)</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="55879..."
                                        value={newPlace.phoneNumber || ''}
                                        onChange={e => setNewPlace({ ...newPlace, phoneNumber: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><MessageCircle size={12} /> WhatsApp (Opcional)</label>
                                    <input
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                        placeholder="55879..."
                                        value={newPlace.whatsapp || ''}
                                        onChange={e => setNewPlace({ ...newPlace, whatsapp: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Tag size={12} /> Tags</label>
                                    <div className="flex gap-2">
                                        <input
                                            className="flex-1 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-orange-500 outline-none"
                                            placeholder="Adicione tags (Enter)"
                                            value={tagInput}
                                            onChange={e => setTagInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && addTag()}
                                        />
                                        <button onClick={addTag} className="bg-gray-200 dark:bg-gray-700 px-4 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-bold text-xl">+</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {newPlace.tags?.map((tag, i) => (
                                            <span key={i} className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                                {tag}
                                                <button onClick={() => removeTag(i)} className="hover:text-red-500"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl">
                            <button
                                onClick={handleSavePlace}
                                disabled={loading}
                                className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50"
                            >
                                {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div> : <Save size={20} />}
                                {editingId ? 'Atualizar Local' : 'Salvar Local'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default PlacesManager;
