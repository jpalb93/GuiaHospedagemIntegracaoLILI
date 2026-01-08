/**
 * Serviços de Configurações da Aplicação
 * Settings gerais, hero images e sugestões inteligentes
 */
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { getFirestoreInstance, getFromCache, saveToCache } from './config';
import { AppConfig, SmartSuggestionsConfig } from '../../types';
import { logger } from '../../utils/logger';

// --- CONFIGURAÇÕES GERAIS ---
export const getAppSettings = async (): Promise<AppConfig | null> => {
    try {
        const db = await getFirestoreInstance();
        const docSnap = await getDoc(doc(db, 'app_config', 'general'));
        if (docSnap.exists()) {
            return docSnap.data() as AppConfig;
        }
        return null;
    } catch (_error) {
        return null;
    }
};

export const saveAppSettings = async (config: AppConfig) => {
    const db = await getFirestoreInstance();
    await setDoc(doc(db, 'app_config', 'general'), config, { merge: true });

    // Sync curiosities to its own document for GuestView
    if (config.cityCuriosities) {
        await setDoc(doc(db, 'app_config', 'curiosities'), { items: config.cityCuriosities });
    }
};

export const subscribeToAppSettings = async (callback: (config: AppConfig | null) => void) => {
    const db = await getFirestoreInstance();
    return onSnapshot(
        doc(db, 'app_config', 'general'),
        (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data() as AppConfig);
            } else {
                callback(null);
            }
        },
        (error) => {
            logger.error('Erro no listener de configs:', { error });
        }
    );
};

// --- IMAGENS DE CAPA (HERO) ---
export const getHeroImages = async (
    forceRefresh = false,
    propertyId: 'lili' | 'integracao' = 'lili'
): Promise<string[]> => {
    const cacheKey = `cached_hero_images_${propertyId}`;
    if (!forceRefresh && !import.meta.env.DEV) {
        const cachedData = getFromCache<string[]>(cacheKey);
        if (cachedData) return cachedData;
    }

    try {
        const db = await getFirestoreInstance();
        const docSnap = await getDoc(doc(db, 'app_config', 'hero_images'));
        let data: string[] = [];
        if (docSnap.exists()) {
            const field = propertyId === 'integracao' ? 'integracao_urls' : 'urls';
            data = docSnap.data()?.[field] || [];
        }
        saveToCache(cacheKey, data);
        return data;
    } catch (_error) {
        return [];
    }
};

export const updateHeroImages = async (
    urls: string[],
    propertyId: 'lili' | 'integracao' = 'lili'
) => {
    const field = propertyId === 'integracao' ? 'integracao_urls' : 'urls';
    const db = await getFirestoreInstance();
    await setDoc(doc(db, 'app_config', 'hero_images'), { [field]: urls }, { merge: true });
};

// --- SUGESTÕES INTELIGENTES ---
export const getSmartSuggestions = async (): Promise<SmartSuggestionsConfig | null> => {
    try {
        const db = await getFirestoreInstance();
        const docSnap = await getDoc(doc(db, 'app_config', 'suggestions'));
        if (docSnap.exists()) {
            return docSnap.data() as SmartSuggestionsConfig;
        }
        return null;
    } catch (_error) {
        return null;
    }
};

export const saveSmartSuggestions = async (config: SmartSuggestionsConfig) => {
    const db = await getFirestoreInstance();
    await setDoc(doc(db, 'app_config', 'suggestions'), config);
};

export const subscribeToSmartSuggestions = async (
    callback: (config: SmartSuggestionsConfig | null) => void
) => {
    const db = await getFirestoreInstance();
    return onSnapshot(
        doc(db, 'app_config', 'suggestions'),
        (docSnap) => {
            if (docSnap.exists()) {
                callback(docSnap.data() as SmartSuggestionsConfig);
            } else {
                callback(null);
            }
        },
        (error) => {
            logger.error('Erro no listener de sugestões:', { error });
        }
    );
};
