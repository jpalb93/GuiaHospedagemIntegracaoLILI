import React, { useState, useEffect } from 'react';
import {
    ImageIcon, Trash2, Settings, Wifi, Box, Lock, Megaphone, Sparkles, Lightbulb, Save, Check
} from 'lucide-react';
import { AppConfig, CityCuriosity } from '../../types';
import { getHeroImages, updateHeroImages, getAppSettings, saveAppSettings } from '../../services/firebase';
import OptimizedImage from '../OptimizedImage';
import ImageUpload from '../admin/ImageUpload';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../../constants';

const ConfigManager: React.FC = () => {
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [appSettings, setAppSettings] = useState<AppConfig>({
        wifiSSID: '',
        wifiPass: '',
        safeCode: '',
        noticeActive: false,
        noticeText: '',
        aiSystemPrompt: '',
        cityCuriosities: []
    });
    const [curiosityForm, setCuriosityForm] = useState({ text: '', image: '' });
    const [isSavingConfig, setIsSavingConfig] = useState(false);
    const [configSavedSuccess, setConfigSavedSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadConfig();
    }, []);

    const loadConfig = async () => {
        setLoading(true);
        const images = await getHeroImages(true);
        setHeroImages(images);

        const settings = await getAppSettings();
        if (settings) {
            setAppSettings({
                wifiSSID: settings.wifiSSID || '',
                wifiPass: settings.wifiPass || '',
                safeCode: settings.safeCode || '',
                noticeActive: settings.noticeActive || false,
                noticeText: settings.noticeText || '',
                aiSystemPrompt: settings.aiSystemPrompt || '',
                cityCuriosities: settings.cityCuriosities || []
            });
        }
        setLoading(false);
    };



    const handleRemoveHeroImage = async (index: number) => {
        if (!confirm("Remover esta imagem?")) return;
        const updatedList = heroImages.filter((_, i) => i !== index);
        setHeroImages(updatedList);
        await updateHeroImages(updatedList);
    };

    const handleAddCuriosity = () => {
        if (!curiosityForm.text.trim()) return;
        const currentList = appSettings.cityCuriosities || [];

        const newItem: CityCuriosity = {
            text: curiosityForm.text.trim(),
            image: curiosityForm.image.trim() || undefined,
            visible: true
        };

        setAppSettings({
            ...appSettings,
            cityCuriosities: [...currentList, newItem]
        });
        setCuriosityForm({ text: '', image: '' });
    };

    const handleRemoveCuriosity = (index: number) => {
        const currentList = appSettings.cityCuriosities || [];
        const updated = currentList.filter((_, i) => i !== index);
        setAppSettings({ ...appSettings, cityCuriosities: updated });
    };

    const handleSaveAppConfig = async () => {
        setIsSavingConfig(true);
        setConfigSavedSuccess(false);
        try {
            await saveAppSettings(appSettings);
            setConfigSavedSuccess(true);
            setTimeout(() => setConfigSavedSuccess(false), 3000);
        } catch (_e) {
            alert("Erro ao salvar configurações.");
        } finally {
            setIsSavingConfig(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10 opacity-50 flex items-center justify-center gap-2"><div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full"></div> Carregando configurações...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            {/* SEÇÃO 1: CAPA DO SITE (HERO) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                    <ImageIcon size={20} className="text-orange-500" />
                    Imagens do Carrossel (Hero)
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    Adicione as URLs das imagens que aparecem no topo do site. A primeira imagem é a principal.
                </p>

                <div className="space-y-4 mb-6">
                    {heroImages.length === 0 && (
                        <p className="text-sm italic text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                            Nenhuma imagem customizada. O site usará as imagens padrão.
                        </p>
                    )}
                    {heroImages.map((url, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-700 group">
                            <div className="w-16 h-10 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                <OptimizedImage src={url} className="w-full h-full object-cover" alt="Capa" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 truncate font-mono">{url}</p>
                            </div>
                            <button
                                onClick={() => handleRemoveHeroImage(idx)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Adicionar Nova Imagem de Capa</label>
                    <ImageUpload
                        onUpload={(url) => {
                            if (url) {
                                const updatedList = [...heroImages, url];
                                setHeroImages(updatedList);
                                updateHeroImages(updatedList);
                            }
                        }}
                        folder="hero"
                        placeholder="Nova Imagem de Capa (1920x1080)"
                        maxDimension={1920}
                        quality={0.9}
                    />
                </div>
            </div>

            {/* SEÇÃO 2: CONFIGURAÇÕES GERAIS (WIFI, COFRE & AVISOS) */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-orange-500" />
                    Geral, Acesso & Avisos
                </h2>

                <div className="space-y-6">

                    {/* GRUPO DE ACESSO (WIFI E COFRE) */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* WIFI */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                                <Wifi size={16} className="text-blue-500" /> Rede Wi-Fi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome da Rede (SSID)</label>
                                    <input
                                        value={appSettings.wifiSSID}
                                        onChange={(e) => setAppSettings({ ...appSettings, wifiSSID: e.target.value })}
                                        placeholder="Ex: Flat_Lili_5G"
                                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha do Wi-Fi</label>
                                    <input
                                        value={appSettings.wifiPass}
                                        onChange={(e) => setAppSettings({ ...appSettings, wifiPass: e.target.value })}
                                        placeholder="Ex: visitante123"
                                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SENHA DO COFRE (NOVO) */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                                <Box size={16} className="text-orange-500" /> Senha do Cofre (Global)
                            </h3>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha Atual do Cofre de Chaves</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={appSettings.safeCode}
                                        onChange={(e) => setAppSettings({ ...appSettings, safeCode: e.target.value.replace(/\D/g, '') })}
                                        placeholder="Ex: 8080"
                                        inputMode="numeric"
                                        className="w-full p-3 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500 font-mono tracking-widest"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AVISOS */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
                                <Megaphone size={16} /> Aviso Global (Para Todos)
                            </h3>
                            <div className="flex items-center gap-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={appSettings.noticeActive}
                                        onChange={(e) => setAppSettings({ ...appSettings, noticeActive: e.target.checked })}
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                    <span className="ml-2 text-xs font-medium text-gray-900 dark:text-gray-300">{appSettings.noticeActive ? 'Ativado' : 'Desativado'}</span>
                                </label>
                            </div>
                        </div>

                        <textarea
                            value={appSettings.noticeText}
                            onChange={(e) => setAppSettings({ ...appSettings, noticeText: e.target.value })}
                            placeholder="Ex: Manutenção na piscina dia 20/10 das 8h às 12h."
                            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-sm outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px]"
                            disabled={!appSettings.noticeActive}
                        />
                        {appSettings.noticeActive && (
                            <div className="mt-2 p-2 bg-yellow-500 text-white text-xs font-bold text-center rounded-lg shadow-sm">
                                Prévia: {appSettings.noticeText || "Seu texto aqui..."}
                            </div>
                        )}
                    </div>

                    {/* CÉREBRO DA IA */}
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                        <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-3">
                            <Sparkles size={16} /> Cérebro da IA (Mandacaru)
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 leading-relaxed">
                            Aqui você define a personalidade e o conhecimento da Inteligência Artificial. Tudo o que você escrever aqui será a "verdade absoluta" para o robô.
                        </p>

                        <textarea
                            value={appSettings.aiSystemPrompt || ''}
                            onChange={(e) => setAppSettings({ ...appSettings, aiSystemPrompt: e.target.value })}
                            placeholder={DEFAULT_SYSTEM_INSTRUCTION}
                            className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px] font-mono leading-relaxed"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 text-right">
                            Deixe em branco para usar o padrão do sistema (definido no código).
                        </p>
                    </div>

                    {/* CITY CURIOSITIES */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3"><Lightbulb size={16} /> Curiosidades da Cidade</h3>
                        <div className="space-y-2 mb-4">
                            {appSettings.cityCuriosities?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        {item.image && (
                                            <img src={item.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-200" />
                                        )}
                                        <span>{item.text}</span>
                                    </div>
                                    <button onClick={() => handleRemoveCuriosity(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={14} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                value={curiosityForm.text}
                                onChange={(e) => setCuriosityForm({ ...curiosityForm, text: e.target.value })}
                                placeholder="Nova curiosidade..."
                                className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCuriosity()}
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Imagem (Opcional)</label>
                            <ImageUpload
                                onUpload={(url) => setCuriosityForm({ ...curiosityForm, image: url })}
                                initialUrl={curiosityForm.image}
                                folder="curiosities"
                                placeholder="Imagem da Curiosidade"
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleAddCuriosity}
                                disabled={!curiosityForm.text.trim()}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-600 disabled:opacity-50 transition-colors"
                            >
                                Adicionar Curiosidade
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSaveAppConfig}
                    disabled={isSavingConfig}
                    className={`w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg ${configSavedSuccess ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600'}`}
                >
                    {isSavingConfig ? (
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : configSavedSuccess ? (
                        <><Check size={18} /> Salvo com Sucesso!</>
                    ) : (
                        <><Save size={18} /> Salvar Configurações</>
                    )}
                </button>
            </div>
        </div>

    );
};

export default ConfigManager;
