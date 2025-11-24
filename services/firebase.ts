import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { PlaceRecommendation, Reservation, AppConfig, SmartSuggestionsConfig } from '../types';

// ============================================================================
// CONFIGURAÇÃO DO FIREBASE (PROJETO FLAT LILI)
// ============================================================================

// ÁREA DE CONFIGURAÇÃO MANUAL
// Se você não quiser usar .env, cole suas chaves aqui dentro das aspas.
const MANUAL_CONFIG = {
  apiKey: "AIzaSyArp-983ckWo-el-6gO7nCMgT9pC2bB4bM",
  authDomain: "flatlili.firebaseapp.com",
  projectId: "flatlili",
  storageBucket: "flatlili.firebasestorage.app",
  messagingSenderId: "216016161136",
  appId: "1:216016161136:web:682169966be23fcad767b5"
};

const firebaseConfig = MANUAL_CONFIG;

// Inicializa o Firebase
let db: firebase.firestore.Firestore | undefined;
let auth: firebase.auth.Auth | undefined;

try {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // Use existing app
  }
  db = firebase.firestore();
  auth = firebase.auth();
} catch (e) {
  console.warn("Erro ao inicializar Firebase:", e);
}

export const isFirebaseConfigured = () => !!db;

// --- SERVIÇOS DE BANCO DE DADOS (LOCAIS) ---

export const getDynamicPlaces = async (): Promise<PlaceRecommendation[]> => {
  if (!db) return [];
  try {
    const snapshot = await db.collection('places').get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    } as PlaceRecommendation));
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    return [];
  }
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('places').add(place);
};

export const updateDynamicPlace = async (id: string, place: Partial<PlaceRecommendation>) => {
  if (!db) throw new Error("Firebase não configurado");
  // Remove o ID do objeto para não duplicar dentro do documento
  const { id: _, ...dataToUpdate } = place as any;
  await db.collection('places').doc(id).update(dataToUpdate);
};

export const deleteDynamicPlace = async (id: string) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('places').doc(id).delete();
};

// --- SERVIÇOS DE CONFIGURAÇÃO (IMAGENS DE CAPA) ---

export const getHeroImages = async (): Promise<string[]> => {
  if (!db) return [];
  try {
    const doc = await db.collection('app_config').doc('hero_images').get();
    if (doc.exists) {
      return doc.data()?.urls || [];
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar imagens de capa:", error);
    return [];
  }
};

export const updateHeroImages = async (urls: string[]) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('app_config').doc('hero_images').set({ urls });
};

// --- SERVIÇOS DE CONFIGURAÇÃO GERAL (WIFI & AVISOS) ---

export const getAppSettings = async (): Promise<AppConfig | null> => {
  if (!db) return null;
  try {
    const doc = await db.collection('app_config').doc('general').get();
    if (doc.exists) {
      return doc.data() as AppConfig;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar configurações gerais:", error);
    return null;
  }
};

export const saveAppSettings = async (config: AppConfig) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('app_config').doc('general').set(config);
};

// Listener para Configurações em Tempo Real
export const subscribeToAppSettings = (callback: (config: AppConfig | null) => void) => {
  if (!db) return () => {};
  
  return db.collection('app_config').doc('general').onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data() as AppConfig);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Erro no listener de configs:", error);
  });
};

// --- SERVIÇOS DE SUGESTÕES INTELIGENTES (NOVO) ---

export const getSmartSuggestions = async (): Promise<SmartSuggestionsConfig | null> => {
  if (!db) return null;
  try {
    const doc = await db.collection('app_config').doc('suggestions').get();
    if (doc.exists) {
      return doc.data() as SmartSuggestionsConfig;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return null;
  }
};

export const saveSmartSuggestions = async (config: SmartSuggestionsConfig) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('app_config').doc('suggestions').set(config);
};

export const subscribeToSmartSuggestions = (callback: (config: SmartSuggestionsConfig | null) => void) => {
  if (!db) return () => {};
  
  return db.collection('app_config').doc('suggestions').onSnapshot((doc) => {
    if (doc.exists) {
      callback(doc.data() as SmartSuggestionsConfig);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Erro no listener de sugestões:", error);
  });
};


// --- SERVIÇOS DE RESERVAS ---

export const saveReservation = async (reservation: Reservation): Promise<string> => {
  if (!db) throw new Error("Firebase não configurado");
  const data = { 
    ...reservation, 
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  const docRef = await db.collection('reservations').add(data);
  return docRef.id;
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
  if (!db) return null;
  try {
    const doc = await db.collection('reservations').doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...(doc.data() as any) } as Reservation;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar reserva:", error);
    return null;
  }
};

// Listener para uma reserva ÚNICA (para o app do hóspede detectar cancelamento em tempo real)
export const subscribeToSingleReservation = (id: string, callback: (res: Reservation | null) => void) => {
  if (!db) return () => {};
  
  return db.collection('reservations').doc(id).onSnapshot((docSnap) => {
    if (docSnap.exists) {
      callback({ id: docSnap.id, ...(docSnap.data() as any) } as Reservation);
    } else {
      // Se o documento não existe mais (foi deletado), retorna null
      callback(null);
    }
  });
};

export const deleteReservation = async (id: string) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('reservations').doc(id).delete();
};

export const subscribeToReservations = (callback: (reservations: Reservation[]) => void) => {
  if (!db) return () => {};
  
  return db.collection('reservations').orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
    callback(data);
  });
};

// --- NOVO: ATUALIZAR RESERVA ---
export const updateReservation = async (id: string, data: Partial<Reservation>) => {
  if (!db) throw new Error("Firebase não configurado");
  try {
    // Removemos o ID do objeto de dados para não duplicar dentro do documento
    const { id: _, ...updateData } = data as any;
    await db.collection('reservations').doc(id).update(updateData);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    throw error;
  }
};

// --- SERVIÇOS DE AUTENTICAÇÃO ---

export const loginCMS = async (email: string, pass: string) => {
  if (!auth) throw new Error("Firebase Auth não configurado");
  return auth.signInWithEmailAndPassword(email, pass);
};

export const logoutCMS = async () => {
  if (!auth) return;
  return auth.signOut();
};

export const subscribeToAuth = (callback: (user: any) => void) => {
  if (!auth) return () => {};
  return auth.onAuthStateChanged(callback);
};