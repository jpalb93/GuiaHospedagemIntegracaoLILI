import React, { useState } from 'react';
import { AppConfig } from '../../types';
import OptimizedImage from '../OptimizedImage';
import ImageUpload from './ImageUpload';
import { ImageIcon, Trash2, Settings, Wifi, Box, Lock, Megaphone, Sparkles, Save, Check, Loader2, ChevronDown, ChevronRight, Eye, EyeOff, MessageSquare } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../../constants';

interface SettingsManagerProps {
    heroImages: {
        data: string[];
        update: (images: string[]) => Promise<void>;
    };
    settings: {
        data: AppConfig;
        save: (settings: AppConfig) => Promise<void>;
    };
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ heroImages, settings }) => {
    const [localSettings, setLocalSettings] = useState<AppConfig>(settings.data);
    const [isSaving, setIsSaving] = useState(false);
    const [showSafeCode, setShowSafeCode] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [checklistForm, setChecklistForm] = useState('');
    const [checklistCategory, setChecklistCategory] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // --- HERO IMAGES ---


    const handleRemoveHeroImage = async (index: number) => {
        if (confirm("Remover esta imagem?")) {
            const updatedList = heroImages.data.filter((_, i) => i !== index);
            await heroImages.update(updatedList);
        }
    };

    // --- SETTINGS ---
    const handleSaveSettings = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await settings.save(localSettings);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (_error) {
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSaving(false);
        }
    };



    const handleAddChecklistItem = () => {
        if (!checklistForm.trim()) return;
        const currentList = localSettings.checklist || [];
        const newItem = {
            id: Date.now().toString(),
            label: checklistForm.trim(),
            category: checklistCategory.trim() || 'Geral',
            active: true
        };
        setLocalSettings({
            ...localSettings,
            checklist: [...currentList, newItem]
        });
        setChecklistForm('');
        // Mantém a categoria para facilitar adição em massa
    };

    const handleRemoveChecklistItem = (id: string) => {
        const currentList = localSettings.checklist || [];
        setLocalSettings({
            ...localSettings,
            checklist: currentList.filter(item => item.id !== id)
        });
    };

    const handleImportDefaultChecklist = () => {
        if (!confirm("Isso irá adicionar vários itens à sua lista atual. Deseja continuar?")) return;

        const defaultItems = [
            { category: "Quarto", items: ["Lençóis", "Cobertor", "Travesseiros", "Controle Ar", "Ferro", "Ventilador"] },
            { category: "Banheiro", items: ["Toalhas", "Kit Banheiro"] },
            { category: "Sala", items: ["Tv + Controle", "Sofa + almofadas"] },
            { category: "Cozinha", items: ["Cadeiras", "Microondas", "Frigobar", "Porta Condimentos", "Porta Detergente", "Lixeira", "Pano Prato", "Talheres", "Xícaras", "Copos", "Pratos", "Jogo Americano", "Panelas", "Bandeja", "Fruteira", "Liquidificador", "Sanduicheira", "Cafeteira", "Escorredor", "Tábua Corte", "Vasilhas", "Peneira", "Garrafa Agua"] },
            { category: "Área Serviço", items: ["Balde", "Rodo", "Varal", "Vassoura", "Pregadores", "Pano de Chão"] },
            { category: "Chaves", items: ["Chave Porta Flat", "Chave Portão Entrada"] },
            { category: "Pet", items: ["Manta Pet", "Comedouro Pet", "Bebedouro Pet", "Quadrinhos Pet"] }
        ];

        const newItems = defaultItems.flatMap(group =>
            group.items.map(label => ({
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                label,
                category: group.category,
                active: true
            }))
        );

        setLocalSettings({
            ...localSettings,
            checklist: [...(localSettings.checklist || []), ...newItems]
        });
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">

            {/* HERO IMAGES */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <ImageIcon size={20} className="text-orange-500" />
                    Imagens do Carrossel (Hero)
                </h2>
                <div className="space-y-4 mb-6">
                    {heroImages.data.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="w-16 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                <OptimizedImage src={url} className="w-full h-full object-cover" alt="Capa" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 truncate font-mono">{url}</p>
                            </div>
                            <button onClick={() => handleRemoveHeroImage(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adicionar Nova Imagem de Capa</label>
                    <ImageUpload
                        onUpload={async (url) => {
                            if (url) {
                                const updatedList = [...heroImages.data, url];
                                await heroImages.update(updatedList);
                            }
                        }}
                        folder="hero"
                        placeholder="Nova Imagem de Capa (1920x1080)"
                        maxDimension={1920}
                        quality={0.9}
                    />
                </div>
            </div>

            {/* GENERAL SETTINGS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Settings size={20} className="text-orange-500" />
                    Geral, Acesso & Avisos
                </h2>

                {/* WIFI & SAFE */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3"><Wifi size={16} className="text-blue-500" /> Rede Wi-Fi</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome (SSID)</label>
                                <input value={localSettings.wifiSSID} onChange={(e) => setLocalSettings({ ...localSettings, wifiSSID: e.target.value })} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
                                <input value={localSettings.wifiPass} onChange={(e) => setLocalSettings({ ...localSettings, wifiPass: e.target.value })} className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3"><Box size={16} className="text-orange-500" /> Senha do Cofre</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Atual</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showSafeCode ? "text" : "password"}
                                    value={localSettings.safeCode}
                                    onChange={(e) => setLocalSettings({ ...localSettings, safeCode: e.target.value.replace(/\D/g, '') })}
                                    className="w-full p-2 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono tracking-widest"
                                />
                                <button
                                    onClick={() => setShowSafeCode(!showSafeCode)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    {showSafeCode ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Visível para todos os hóspedes ativos.</p>
                        </div>
                    </div>
                </div>

                {/* NOTICES */}
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                    <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-2 mb-3"><Megaphone size={16} /> Avisos Globais</h3>

                    <div className="space-y-4">
                        {['lili', 'integracao'].map((pid) => {
                            const pId = pid as 'lili' | 'integracao';
                            const notice = localSettings.globalNotices?.[pId] || { active: false, text: '' };

                            return (
                                <div key={pId} className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/50">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold uppercase text-gray-500">{pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={notice.active}
                                                onChange={(e) => {
                                                    const newNotices = { ...localSettings.globalNotices };
                                                    newNotices[pId] = { ...notice, active: e.target.checked };
                                                    setLocalSettings({ ...localSettings, globalNotices: newNotices });
                                                }}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                        </label>
                                    </div>
                                    <textarea
                                        value={notice.text}
                                        onChange={(e) => {
                                            const newNotices = { ...localSettings.globalNotices };
                                            newNotices[pId] = { ...notice, text: e.target.value };
                                            setLocalSettings({ ...localSettings, globalNotices: newNotices });
                                        }}
                                        placeholder={`Aviso para ${pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}...`}
                                        className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:ring-1 focus:ring-yellow-500 min-h-[60px]"
                                        disabled={!notice.active}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* HOST PHONES */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                    <h3 className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-3"><Megaphone size={16} /> Telefones de Contato (WhatsApp)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['lili', 'integracao'].map((pid) => {
                            const pId = pid as 'lili' | 'integracao';
                            const phone = localSettings.hostPhones?.[pId] || '';

                            return (
                                <div key={pId}>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">{pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}</label>
                                    <input
                                        value={phone}
                                        onChange={(e) => {
                                            const newPhones = { ...localSettings.hostPhones };
                                            newPhones[pId] = e.target.value;
                                            setLocalSettings({ ...localSettings, hostPhones: newPhones });
                                        }}
                                        placeholder="Ex: 5587999999999"
                                        className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CHECKLIST ITEMS */}
                <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
                    <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-3"><Check size={16} /> Itens de Vistoria (Checkout)</h3>
                    <div className="space-y-2 mb-4">
                        {(() => {
                            const grouped = (localSettings.checklist || []).reduce((acc, item) => {
                                const cat = item.category || 'Geral';
                                if (!acc[cat]) acc[cat] = [];
                                acc[cat].push(item);
                                return acc;
                            }, {} as Record<string, typeof localSettings.checklist>);

                            return Object.entries(grouped).sort((a, b) => a[0].localeCompare(b[0])).map(([category, items]) => (
                                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            {expandedCategories.includes(category) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                                            <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-300">{category}</span>
                                            <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 px-1.5 py-0.5 rounded-full">{items?.length}</span>
                                        </div>
                                    </button>

                                    {expandedCategories.includes(category) && (
                                        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                            {items?.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-3 pl-9 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                    <span>{item.label}</span>
                                                    <button onClick={() => handleRemoveChecklistItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ));
                        })()}
                    </div>
                    <div className="flex gap-2">
                        <input
                            list="categories"
                            value={checklistCategory}
                            onChange={(e) => setChecklistCategory(e.target.value)}
                            placeholder="Categoria (ex: Quarto)"
                            className="w-1/3 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                        />
                        <datalist id="categories">
                            {Array.from(new Set(localSettings.checklist?.map(i => i.category || 'Geral') || [])).sort().map(cat => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>

                        <input
                            value={checklistForm}
                            onChange={(e) => setChecklistForm(e.target.value)}
                            placeholder="Novo item (ex: Controle TV...)"
                            className="flex-1 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-1 focus:ring-orange-500"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddChecklistItem()}
                        />
                        <button onClick={handleAddChecklistItem} disabled={!checklistForm.trim()} className="bg-orange-500 text-white px-3 rounded-lg font-bold text-xs hover:bg-orange-600 disabled:opacity-50 transition-colors">Adicionar</button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800/30 flex justify-end">
                        <button onClick={handleImportDefaultChecklist} className="text-orange-600 dark:text-orange-400 text-xs font-bold hover:underline flex items-center gap-1">
                            <Sparkles size={14} /> Importar Lista da Foto (Padrão)
                        </button>
                    </div>
                </div>

                {/* MESSAGE TEMPLATES */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                    <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3"><MessageSquare size={16} /> Templates de Mensagem (WhatsApp)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Convite (Boas-vindas)</label>
                            <textarea
                                value={localSettings.messageTemplates?.invite || ''}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    messageTemplates: { ...localSettings.messageTemplates || { checkin: '', checkout: '', invite: '' }, invite: e.target.value }
                                })}
                                placeholder="Mensagem de convite..."
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lembrete de Check-in (Véspera)</label>
                            <textarea
                                value={localSettings.messageTemplates?.checkin || ''}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    messageTemplates: { ...localSettings.messageTemplates || { checkin: '', checkout: '', invite: '' }, checkin: e.target.value }
                                })}
                                placeholder="Mensagem de check-in..."
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Lembrete de Checkout (Véspera)</label>
                            <textarea
                                value={localSettings.messageTemplates?.checkout || ''}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    messageTemplates: { ...localSettings.messageTemplates || { checkin: '', checkout: '', invite: '' }, checkout: e.target.value }
                                })}
                                placeholder="Mensagem de checkout..."
                                className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            />
                        </div>
                        <p className="text-[10px] text-gray-400">Variáveis disponíveis: {'{guestName}'}, {'{link}'}, {'{password}'}</p>
                    </div>
                </div>

                {/* AI BRAIN */}
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                    <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-3"><Sparkles size={16} /> Cérebro da IA (Mandacaru)</h3>
                    <textarea value={localSettings.aiSystemPrompt || ''} onChange={(e) => setLocalSettings({ ...localSettings, aiSystemPrompt: e.target.value })} placeholder={DEFAULT_SYSTEM_INSTRUCTION} className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px] font-mono leading-relaxed" />
                </div>

                {/* CITY CURIOSITIES */}


                {/* SAVE BUTTON */}
                <button onClick={handleSaveSettings} disabled={isSaving} className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${saveSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600'}`}>
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <><Check size={18} /> Salvo!</> : <><Save size={18} /> Salvar Configurações</>}
                </button>
            </div>
        </div>
    );
};

export default SettingsManager;
