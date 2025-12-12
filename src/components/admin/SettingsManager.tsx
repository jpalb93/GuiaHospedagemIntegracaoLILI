import React, { useState } from 'react';
import { AppConfig } from '../../types';
import { Settings, Sparkles, Save, Check, Loader2, Download, BellRing } from 'lucide-react';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../../constants';
import Button from '../ui/Button';
import {
    PropertySelector,
    HeroImagesSection,
    WifiSafeSection,
    NoticesSection,
    ChecklistSection,
    MessageTemplatesSection,
    TranslationManager,
    PushNotificationManager
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

    // --- TRANSLATE PROMPT ---
    const handleTranslatePrompt = async () => {
        const promptText = getAiPrompt();
        if (!promptText) return;

        if (activeProperty !== 'lili') {
            alert('A tradução automática para propriedades secundárias (Integração) será implementada em breve. Por enquanto, traduza o prompt principal (Lili/Padrão).');
            return;
        }

        setIsSaving(true);
        try {
            // Import dynamically to avoid circular dependencies
            const { sendMessageToGemini } = await import('../../services/geminiService');

            const translateTo = async (targetLang: 'English' | 'Spanish', slangExamples: string) => {
                const translationInstruction = `
                    You are an expert cultural consultant and translator specialized in adapting brand personas.
                    
                    TASK: Translate the following AI System Prompt from Portuguese (Brazil - Northeast Region) to ${targetLang}.
                    
                    CRITICAL INSTRUCTIONS:
                    1. **Adapt, Don't Just Translate**: The original text contains local Brazilian Northeast slang like "oxe", "viu", "painho", "massa". CHANGE these into natural, warm, and friendly equivalents in ${targetLang} (such as: ${slangExamples}) that convey the same feeling of hospitality and intimacy.
                       - Example (PT -> EN): "Oxe, viu" -> "Oh my!", "Gosh", "You know?", or "Don't worry" (depending on context).
                       - Example (PT -> ES): "Oxe, viu" -> "¡Vaya!", "¡Oye!", "¡Anda!".
                    2. **Maintain Personality**: The persona "Lili" is warm, caring, like a requested "auntie" or a super-host. The translation MUST feel human, not robotic.
                    3. **Output Only**: Return ONLY the translated/adapted text. No explanations.
                `;

                return await sendMessageToGemini(
                    `Please translate/adapt this text:\n\n${promptText}`,
                    [],
                    'Admin',
                    translationInstruction
                );
            };

            const [enText, esText] = await Promise.all([
                translateTo('English', "Wow, Gosh, You know"),
                translateTo('Spanish', "¡Vaya!, ¡Oye!")
            ]);

            if (enText && esText) {
                const newSettings = {
                    ...localSettings,
                    aiSystemPrompt_en: enText,
                    aiSystemPrompt_es: esText
                };

                // Update local UI
                setLocalSettings(newSettings);

                // AUTO-SAVE to Firebase to prevent data loss
                await settings.save(newSettings);

                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);

                alert('Prompt traduzido e salvo com sucesso! \n\nO sistema converteu gírias locais para expressões naturais em Inglês e Espanhol.');
            } else {
                throw new Error("Falha na geração de uma das traduções.");
            }

        } catch (e) {
            console.error(e);
            alert('Erro ao traduzir prompt. Verifique sua conexão ou tente novamente.');
        } finally {
            setIsSaving(false);
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
                <div className="mt-2 flex justify-end">
                    <Button
                        onClick={handleTranslatePrompt}
                        variant="ghost"
                        size="sm"
                        leftIcon={<Sparkles size={14} />}
                        className="text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/40"
                    >
                        Traduzir Prompt
                    </Button>
                </div>
            </div>

            {/* TRANSLATION MANAGER (AI) */}
            <TranslationManager />

            {/* GENERAL SETTINGS */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 space-y-6">

                {/* PUSH NOTIFICATIONS */}
                <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-800/30">
                    <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2 mb-2">
                        <BellRing size={16} /> Notificações (Push)
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
                        Receba alertas de novas reservas e check-ins mesmo com o app fechado.
                    </p>

                    <PushNotificationManager />
                </div>

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
