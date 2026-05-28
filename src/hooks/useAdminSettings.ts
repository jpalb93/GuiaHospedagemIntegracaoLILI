import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { AppConfig, SmartSuggestionsConfig, GuestReview } from '../types';
import {
    getAppSettings,
    saveAppSettings,
    getHeroImages,
    updateHeroImages,
    getSmartSuggestions,
    saveSmartSuggestions,
    getGuestReviews,
    addGuestReview,
    deleteGuestReview,
} from '../services/firebase';

export const useAdminSettings = () => {
    // --- STATE ---
    const [loading, setLoading] = useState(true);
    const [heroImages, setHeroImages] = useState<Record<string, string[]>>({
        lili: [],
        integracao: [],
    });
    const [appSettings, setAppSettings] = useState<AppConfig>({
        wifiSSID: '',
        wifiPass: '',
        safeCode: '',
        noticeActive: false,
        noticeText: '',
        aiSystemPrompt: '',
        aiSystemPrompts: {},
        cityCuriosities: [],
        checklist: [],
        reservationTemplates: [],
    });
    const [suggestions, setSuggestions] = useState<SmartSuggestionsConfig>({
        morning: [],
        lunch: [],
        sunset: [],
        night: [],
    });
    const [reviews, setReviews] = useState<GuestReview[]>([]);
    const [error, setError] = useState(false);

    // --- LOAD DATA ---
    const loadAllSettings = async () => {
        setLoading(true);
        setError(false);

        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            try {
                const [liliImgs, integracaoImgs, settings, suggs, revs] = await Promise.all([
                    getHeroImages(true, 'lili'),
                    getHeroImages(true, 'integracao'),
                    getAppSettings(),
                    getSmartSuggestions(),
                    getGuestReviews(50),
                ]);

                // Success check - if settings loaded, we are good
                if (settings) {
                    setHeroImages({ lili: liliImgs, integracao: integracaoImgs });

                    setAppSettings({
                        wifiSSID: settings.wifiSSID || '',
                        wifiPass: settings.wifiPass || '',
                        safeCode: settings.safeCode || '',
                        noticeActive: settings.noticeActive || false,
                        noticeText: settings.noticeText || '',
                        aiSystemPrompt: settings.aiSystemPrompt || '',
                        aiSystemPrompts: settings.aiSystemPrompts || {},
                        cityCuriosities: settings.cityCuriosities || [],
                        checklist: settings.checklist || [],
                        globalNotices: settings.globalNotices || {},
                        hostPhones: settings.hostPhones || {},
                        reservationTemplates: settings.reservationTemplates || [],
                    });

                    if (suggs) {
                        setSuggestions({
                            morning: Array.isArray(suggs.morning) ? suggs.morning : [],
                            lunch: Array.isArray(suggs.lunch) ? suggs.lunch : [],
                            sunset: Array.isArray(suggs.sunset) ? suggs.sunset : [],
                            night: Array.isArray(suggs.night) ? suggs.night : [],
                        });
                    }
                    if (reviews) setReviews(revs);

                    setLoading(false);
                    return; // Exit successfully
                }

                // If settings is null, force throw to trigger retry
                throw new Error('Configurações retornaram vazias (provavel race condition)');

            } catch (err) {
                attempts++;
                if (attempts >= maxAttempts) {
                    logger.error('Erro fatal ao carregar configurações após retentativas:', { error: err });
                    setError(true);
                    setLoading(false);
                } else {
                    // Exponential backoff: 500ms, 1000ms
                    await new Promise((resolve) => setTimeout(resolve, 500 * attempts));
                }
            }
        }
    };

    useEffect(() => {
        loadAllSettings();
    }, []);

    // --- ACTIONS: HERO IMAGES ---
    const updateImages = async (
        newImages: string[],
        propertyId: 'lili' | 'integracao' = 'lili'
    ) => {
        setHeroImages((prev) => ({ ...prev, [propertyId]: newImages }));
        await updateHeroImages(newImages, propertyId);
    };

    // --- ACTIONS: APP SETTINGS ---
    const saveSettings = async (newSettings: AppConfig) => {
        setAppSettings(newSettings);
        await saveAppSettings(newSettings);
    };

    // --- ACTIONS: SUGGESTIONS ---
    const saveSuggestionsList = async (newSuggestions: SmartSuggestionsConfig) => {
        setSuggestions(newSuggestions);
        await saveSmartSuggestions(newSuggestions);
    };

    // --- ACTIONS: REVIEWS ---
    const addReview = async (review: { name: string; text: string }) => {
        const newReview = { ...review, visible: true };
        const id = await addGuestReview(newReview);
        setReviews((prev) => [...prev, { id, ...newReview }]);
        return id;
    };

    const deleteReview = async (id: string) => {
        await deleteGuestReview(id);
        setReviews((prev) => prev.filter((r) => r.id !== id));
    };

    return {
        loading,
        heroImages: { data: heroImages, update: updateImages },
        settings: { data: appSettings, save: saveSettings },
        suggestions: { data: suggestions, save: saveSuggestionsList },
        reviews: { data: reviews, add: addReview, delete: deleteReview },
        refresh: loadAllSettings,
        error
    };
};
