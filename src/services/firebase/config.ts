import { initializeApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import type { FirebaseStorage } from 'firebase/storage';
import type { Messaging } from 'firebase/messaging';
import { logger } from '../../utils/logger';

// Configuração
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicialização Segura (App is lightweight)
const app = initializeApp(firebaseConfig);

// Firestore Lazy
let dbInstance: Firestore | null = null;
export const getFirestoreInstance = async (): Promise<Firestore> => {
    if (!dbInstance) {
        const { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } = await import('firebase/firestore');
        dbInstance = initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
        });
    }
    return dbInstance;
};

// Auth Lazy
let authInstance: Auth | null = null;
export const getFirebaseAuth = async (): Promise<Auth> => {
    if (!authInstance) {
        const { getAuth } = await import('firebase/auth');
        authInstance = getAuth(app);
    }
    return authInstance;
};

// Storage Lazy
let storageInstance: FirebaseStorage | null = null;
export const getStorageInstance = async (): Promise<FirebaseStorage> => {
    if (!storageInstance) {
        const { getStorage } = await import('firebase/storage');
        storageInstance = getStorage(app);
    }
    return storageInstance;
};

// Messaging Lazy
let messagingInstance: Messaging | null = null;
export const getMessagingInstance = async (): Promise<Messaging> => {
    if (!messagingInstance) {
        const { getMessaging } = await import('firebase/messaging');
        messagingInstance = getMessaging(app);
    }
    return messagingInstance;
};

export const isFirebaseConfigured = () => !!app;

export const validateFirebaseConfig = () => {
    const missingKeys = [];
    if (!firebaseConfig.apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
    if (!firebaseConfig.authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
    if (!firebaseConfig.projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
    if (!firebaseConfig.storageBucket) missingKeys.push('VITE_FIREBASE_STORAGE_BUCKET');
    if (!firebaseConfig.messagingSenderId) missingKeys.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
    if (!firebaseConfig.appId) missingKeys.push('VITE_FIREBASE_APP_ID');

    return {
        isValid: missingKeys.length === 0,
        missingKeys,
    };
};

// --- HELPER PARA CACHE LOCAL (REDUÇÃO DE LEITURAS) ---
const CACHE_EXPIRY_MS = 3600000; // 1 hora

export const getFromCache = <T>(key: string): T | null => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);

        if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
            localStorage.removeItem(key);
            return null;
        }

        return data as T;
    } catch (_e) {
        return null;
    }
};

export const saveToCache = (key: string, data: unknown) => {
    try {
        const cacheObj = { data, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(cacheObj));
    } catch (e) {
        logger.warn('Erro ao salvar cache local', { error: e });
    }
};

// --- HELPER PARA REMOVER UNDEFINED (Firestore não aceita) ---
export const cleanData = <T extends object>(data: T): T => {
    const clean = { ...data } as Record<string, unknown>;
    Object.keys(clean).forEach((key) => {
        if (clean[key] === undefined) {
            delete clean[key];
        }
    });
    return clean as unknown as T;
};
