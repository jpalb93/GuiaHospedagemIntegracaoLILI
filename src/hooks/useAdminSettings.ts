import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { AppConfig, SmartSuggestionsConfig, GuestReview } from '../types';
import {
    getAppSettings, saveAppSettings,
    getHeroImages, updateHeroImages,
    getSmartSuggestions, saveSmartSuggestions,
    getGuestReviews, addGuestReview, deleteGuestReview
} from '../services/firebase';

export const useAdminSettings = () => {
    // --- STATE ---
    const [loading, setLoading] = useState(false);
    const [heroImages, setHeroImages] = useState<string[]>([]);
    const [appSettings, setAppSettings] = useState<AppConfig>({
        wifiSSID: '', wifiPass: '', safeCode: '',
        noticeActive: false, noticeText: '',
        aiSystemPrompt: '', cityCuriosities: [],
        checklist: []
    });
    const [suggestions, setSuggestions] = useState<SmartSuggestionsConfig>({
        morning: [], lunch: [], sunset: [], night: []
    });
    const [reviews, setReviews] = useState<GuestReview[]>([]);

    // --- LOAD DATA ---
    const loadAllSettings = async () => {
        setLoading(true);
        try {
            const [imgs, settings, suggs, revs] = await Promise.all([
                getHeroImages(true),
                getAppSettings(),
                getSmartSuggestions(),
                getGuestReviews(50)
            ]);

            setHeroImages(imgs);
            if (settings) {
                setAppSettings({
                    wifiSSID: settings.wifiSSID || '',
                    wifiPass: settings.wifiPass || '',
                    safeCode: settings.safeCode || '',
                    noticeActive: settings.noticeActive || false,
                    noticeText: settings.noticeText || '',
                    aiSystemPrompt: settings.aiSystemPrompt || '',
                    cityCuriosities: settings.cityCuriosities || [],
                    checklist: settings.checklist || [],
                    globalNotices: settings.globalNotices || {},
                    hostPhones: settings.hostPhones || {}
                });
            }
            if (suggs) {
                setSuggestions({
                    morning: Array.isArray(suggs.morning) ? suggs.morning : [],
                    lunch: Array.isArray(suggs.lunch) ? suggs.lunch : [],
                    sunset: Array.isArray(suggs.sunset) ? suggs.sunset : [],
                    night: Array.isArray(suggs.night) ? suggs.night : [],
                });
            }
            setReviews(revs);
        } catch (error) {
            logger.error("Erro ao carregar configurações:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllSettings();
    }, []);

    // --- ACTIONS: HERO IMAGES ---
    const updateImages = async (newImages: string[]) => {
        setHeroImages(newImages);
        await updateHeroImages(newImages);
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
    const addReview = async (review: { name: string, text: string }) => {
        const id = await addGuestReview(review);
        setReviews(prev => [...prev, { id, ...review }]);
        return id;
    };

    const deleteReview = async (id: string) => {
        await deleteGuestReview(id);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    return {
        loading,
        heroImages: { data: heroImages, update: updateImages },
        settings: { data: appSettings, save: saveSettings },
        suggestions: { data: suggestions, save: saveSuggestionsList },
        reviews: { data: reviews, add: addReview, delete: deleteReview },
        refresh: loadAllSettings
    };
};
