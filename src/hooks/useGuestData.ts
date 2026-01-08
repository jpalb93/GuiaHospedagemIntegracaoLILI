import { useState, useEffect, useCallback } from 'react';
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
                console.log('[useGuestData] fetchTips result:', fetchedTips?.length);
                if (fetchedTips && fetchedTips.length > 0) {
                    const visibleTips = fetchedTips.filter((t) => t.visible !== false);
                    console.log('[useGuestData] setting tips:', visibleTips.length);
                    setTips(visibleTips);
                } else {
                    console.log('[useGuestData] no tips found or empty');
                }

                const fetchedCuriosities = await getCuriosities();
                if (fetchedCuriosities && fetchedCuriosities.length > 0) {
                    setCuriosities(fetchedCuriosities);
                }
            } catch (error) {
                logger.error('Error loading static guest data:', { error });
            }
        };
        loadStaticData();

        // 2. Assinaturas em Tempo Real (Real-time)
        let unsubscribePlaces: (() => void) | undefined;
        let unsubscribeSettings: (() => void) | undefined;
        let unsubscribeSuggestions: (() => void) | undefined;

        const setupSubscriptions = async () => {
            unsubscribePlaces = await subscribeToPlaces((places) => {
                console.log('[useGuestData] places update:', places.length);
                setDynamicPlaces(places.filter((p) => p.visible !== false));
            });

            unsubscribeSettings = await subscribeToAppSettings((settings) => {
                setAppSettings(settings);
            });

            unsubscribeSuggestions = await subscribeToSmartSuggestions((suggestions) => {
                setSmartSuggestions(suggestions);
            });
        };

        setupSubscriptions();

        return () => {
            if (unsubscribePlaces) unsubscribePlaces();
            if (unsubscribeSettings) unsubscribeSettings();
            if (unsubscribeSuggestions) unsubscribeSuggestions();
        };
    }, [config.guestName, config.propertyId]);

    const dismissGlobal = useCallback((text: string) => {
        setDismissedGlobalText(text);
        localStorage.setItem('flat_lili_dismissed_global', text);
    }, []);

    const dismissPersonal = useCallback(
        (text: string) => {
            setDismissedPersonalText(text);
            localStorage.setItem(`flat_lili_dismissed_personal_${config.guestName}`, text);
        },
        [config.guestName]
    );

    const dismissAlert = useCallback(
        (type: 'global' | 'personal', text: string) => {
            if (type === 'global') dismissGlobal(text);
            else dismissPersonal(text);
        },
        [dismissGlobal, dismissPersonal]
    );

    const mergePlaces = useCallback(
        (staticList: PlaceRecommendation[], category: string) => {
            const dynamic = dynamicPlaces.filter((p) => p.category === category);
            return [...dynamic, ...staticList];
        },
        [dynamicPlaces]
    );

    const hasContent = useCallback(
        (list: PlaceRecommendation[], category: string) => {
            return list.length > 0 || dynamicPlaces.some((p) => p.category === category);
        },
        [dynamicPlaces]
    );

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
