import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import {
    PlaceRecommendation,
    AppConfig,
    SmartSuggestionsConfig,
    GuestConfig,
    Tip,
    CityCuriosity,
} from '../types';
import {
    getHeroImages,
    subscribeToAppSettings,
    subscribeToSmartSuggestions,
    getTips,
    getCuriosities,
    subscribeToPlaces,
} from '../services/firebase';
import { DEFAULT_SLIDES, DEFAULT_CITY_CURIOSITIES } from '../constants';

export const useGuestData = (config: GuestConfig) => {
    const [dynamicPlaces, setDynamicPlaces] = useState<PlaceRecommendation[]>([]);
    const [heroSlides, setHeroSlides] = useState<string[]>(DEFAULT_SLIDES);
    const [appSettings, setAppSettings] = useState<AppConfig | null>(null);
    const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestionsConfig | null>(null);
    const [dismissedGlobalText, setDismissedGlobalText] = useState(() => {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem('flat_lili_dismissed_global') || '';
        }
        return '';
    });
    const [dismissedPersonalText, setDismissedPersonalText] = useState(() => {
        if (typeof localStorage !== 'undefined') {
            return localStorage.getItem(`flat_lili_dismissed_personal_${config.guestName}`) || '';
        }
        return '';
    });

    // Content State
    const [tips, setTips] = useState<Tip[]>([]);
    const [curiosities, setCuriosities] = useState<CityCuriosity[]>(
        DEFAULT_CITY_CURIOSITIES.map((text) => ({ text, visible: true }))
    );

    useEffect(() => {
        // 1. Carrega dados estáticos (que mudam pouco)
        const loadStaticData = async () => {
            try {
                const images = await getHeroImages(false, config.propertyId || 'lili');
                if (images && images.length > 0) {
                    setHeroSlides(images);
                }

                const fetchedTips = await getTips();
                if (fetchedTips && fetchedTips.length > 0) {
                    if (config.propertyId === 'integracao') {
                        setTips([]);
                    } else {
                        setTips(fetchedTips.filter((t) => t.visible !== false));
                    }
                }

                const fetchedCuriosities = await getCuriosities();
                if (fetchedCuriosities && fetchedCuriosities.length > 0) {
                    setCuriosities(fetchedCuriosities);
                }
            } catch (error) {
                logger.error('Error loading static guest data:', error);
            }
        };
        loadStaticData();

        // 2. Assinaturas em Tempo Real (Real-time)
        const unsubscribePlaces = subscribeToPlaces((places) => {
            setDynamicPlaces(places.filter((p) => p.visible !== false));
        });

        const unsubscribeSettings = subscribeToAppSettings((settings) => {
            setAppSettings(settings);
        });

        const unsubscribeSuggestions = subscribeToSmartSuggestions((suggestions) => {
            setSmartSuggestions(suggestions);
        });

        return () => {
            unsubscribePlaces();
            unsubscribeSettings();
            unsubscribeSuggestions();
        };
    }, [config.guestName, config.propertyId]);

    const dismissGlobal = (text: string) => {
        setDismissedGlobalText(text);
        localStorage.setItem('flat_lili_dismissed_global', text);
    };

    const dismissPersonal = (text: string) => {
        setDismissedPersonalText(text);
        localStorage.setItem(`flat_lili_dismissed_personal_${config.guestName}`, text);
    };

    const dismissAlert = (type: 'global' | 'personal', text: string) => {
        if (type === 'global') dismissGlobal(text);
        else dismissPersonal(text);
    };

    const mergePlaces = (staticList: PlaceRecommendation[], category: string) => {
        const dynamic = dynamicPlaces.filter((p) => p.category === category);
        return [...dynamic, ...staticList];
    };

    const hasContent = (list: PlaceRecommendation[], category: string) => {
        return list.length > 0 || dynamicPlaces.some((p) => p.category === category);
    };

    return {
        dynamicPlaces,
        heroImages: heroSlides,
        appSettings,
        smartSuggestions,
        tips,
        curiosities,
        dismissedAlerts: {
            global: dismissedGlobalText,
            personal: dismissedPersonalText,
        },
        dismissAlert,
        mergePlaces,
        hasContent,
    };
};
