import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { Settings, Sparkles, Save, Check, Loader2, Download } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../../constants';
import Button from '../ui/Button';
import {
    PropertySelector,
    HeroImagesSection,
    WifiSafeSection,
    NoticesSection,
    ChecklistSection,
    MessageTemplatesSection,
} from './settings';

interface SettingsManagerProps {
    heroImages: {
        data: Record<string, string[]>;
        update: (images: string[], propertyId: 'lili' | 'integracao') => Promise<void>;
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
    const [activeProperty, setActiveProperty] = useState<'lili' | 'integracao'>('lili');

    // --- HERO IMAGES ---
    const currentHeroImages = heroImages.data[activeProperty] || [];

    const handleRemoveHeroImage = async (index: number) => {
        if (confirm('Remover esta imagem?')) {
            const updatedList = currentHeroImages.filter((_, i) => i !== index);
            await heroImages.update(updatedList, activeProperty);
        }
    };

    const handleAddHeroImage = async (url: string) => {
        const updatedList = [...currentHeroImages, url];
        await heroImages.update(updatedList, activeProperty);
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
            alert('Erro ao salvar configurações.');
        } finally {
            setIsSaving(false);
        }
    };

    // --- BACKUP ---
    const handleExportBackup = () => {
        const backupData = {
            settings: localSettings,
            heroImages: heroImages.data,
            exportedAt: new Date().toISOString(),
        };
        const dataStr = JSON.stringify(backupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup_configuracoes_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        alert('Backup de configurações exportado!');
    };

    // Helper for AI Prompt
    const getAiPrompt = () => {
        if (activeProperty === 'lili') {
            return localSettings.aiSystemPrompt || '';
        }
        return localSettings.aiSystemPrompts?.[activeProperty] || '';
    };

    const setAiPrompt = (val: string) => {
        if (activeProperty === 'lili') {
            setLocalSettings({ ...localSettings, aiSystemPrompt: val });
        } else {
            setLocalSettings({
                ...localSettings,
                aiSystemPrompts: {
                    ...localSettings.aiSystemPrompts,
                    [activeProperty]: val,
                },
            });
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* PROPERTY SELECTOR */}
            <PropertySelector
                activeProperty={activeProperty}
                setActiveProperty={setActiveProperty}
            />

            {/* HERO IMAGES */}
            <HeroImagesSection
                activeProperty={activeProperty}
                images={currentHeroImages}
                onRemove={handleRemoveHeroImage}
                onAdd={handleAddHeroImage}
            />

            {/* AI BRAIN */}
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                <h3 className="text-sm font-bold text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-3">
                    <Sparkles size={16} /> Cérebro da IA (
                    {activeProperty === 'lili' ? 'Mandacaru' : 'Concierge Integração'})
                </h3>
                <textarea
                    value={getAiPrompt()}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder={DEFAULT_SYSTEM_INSTRUCTION}
                    className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500 min-h-[150px] font-mono leading-relaxed"
                />
                <p className="text-[10px] text-gray-400 mt-2">
                    Este prompt define a personalidade e o conhecimento da IA para{' '}
                    <strong>
                        {activeProperty === 'lili' ? 'o Flat da Lili' : 'os Flats Integração'}
                    </strong>
                    .
                </p>
            </div>

            {/* GENERAL SETTINGS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-lg font-bold font-heading mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                    <Settings size={20} className="text-gray-500" />
                    Geral, Acesso & Avisos
                </h2>

                {/* WIFI & SAFE */}
                <WifiSafeSection
                    localSettings={localSettings}
                    setLocalSettings={setLocalSettings}
                    showSafeCode={showSafeCode}
                    setShowSafeCode={setShowSafeCode}
                />

                {/* NOTICES & PHONES */}
                <NoticesSection localSettings={localSettings} setLocalSettings={setLocalSettings} />

                {/* CHECKLIST */}
                <ChecklistSection
                    localSettings={localSettings}
                    setLocalSettings={setLocalSettings}
                />

                {/* MESSAGE TEMPLATES */}
                <MessageTemplatesSection
                    localSettings={localSettings}
                    setLocalSettings={setLocalSettings}
                />

                {/* BACKUP & SAVE BUTTONS */}
                <div className="flex gap-3">
                    <Button
                        onClick={handleExportBackup}
                        variant="ghost"
                        leftIcon={<Download size={18} />}
                        className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40"
                    >
                        Backup
                    </Button>
                    <Button
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        fullWidth
                        leftIcon={isSaving ? <Loader2 className="animate-spin" size={18} /> : saveSuccess ? <Check size={18} /> : <Save size={18} />}
                        className={`${saveSuccess ? 'bg-green-500 hover:bg-green-600 outline-none ring-2 ring-green-500 ring-offset-2' : 'bg-gray-900 dark:bg-gray-700 hover:bg-black dark:hover:bg-gray-600'}`}
                    >
                        {isSaving ? null : saveSuccess ? 'Salvo!' : 'Salvar Configurações'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsManager;
