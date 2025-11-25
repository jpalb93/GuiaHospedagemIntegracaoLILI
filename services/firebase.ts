import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { PlaceRecommendation, Reservation, AppConfig, SmartSuggestionsConfig, GuestReview, BlockedDateRange } from '../types';

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

// --- HELPER PARA CACHE LOCAL (REDUÇÃO DE LEITURAS) ---
const CACHE_EXPIRY_MS = 3600000; // 1 hora

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // Se o cache for mais velho que 1 hora, descarta
    if (now - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data as T;
  } catch (e) {
    return null;
  }
};

const saveToCache = (key: string, data: any) => {
  try {
    const cacheObj = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheObj));
  } catch (e) {
    console.warn("Erro ao salvar cache local", e);
  }
};

// ============================================================================
// 1. SERVIÇOS DE BANCO DE DADOS (LOCAIS / PLACES)
// ============================================================================

export const getDynamicPlaces = async (forceRefresh = false): Promise<PlaceRecommendation[]> => {
  if (!db) return [];
  
  // Verifica Cache se não for refresh forçado
  if (!forceRefresh) {
    const cachedData = getFromCache<PlaceRecommendation[]>('cached_places');
    if (cachedData) return cachedData;
  }

  try {
    const snapshot = await db.collection('places').get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    } as PlaceRecommendation));
    
    // Salva no Cache
    saveToCache('cached_places', data);
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    return [];
  }
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>): Promise<string> => {
  if (!db) throw new Error("Firebase não configurado");
  const docRef = await db.collection('places').add(place);
  return docRef.id;
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

// --- FUNÇÃO DE LIMPEZA AUTOMÁTICA DE EVENTOS ---
export const cleanupExpiredEvents = async () => {
  if (!db) return;
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  console.log("🧹 Verificando eventos expirados antes de: ", today);

  try {
    // Busca apenas locais que são eventos
    const snapshot = await db.collection('places').where('category', '==', 'events').get();
    
    if (snapshot.empty) return;

    const batch = db.batch();
    let deletedCount = 0;

    snapshot.docs.forEach(doc => {
      const data = doc.data() as PlaceRecommendation;
      // Usa a data final se existir, senão a data de início
      const expiryDate = data.eventEndDate || data.eventDate;

      // Se a data de validade for MENOR que hoje (ontem ou antes), deleta
      if (expiryDate && expiryDate < today) {
        batch.delete(doc.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
      console.log(`✅ Faxina completa: ${deletedCount} eventos antigos removidos automaticamente.`);
    } else {
      console.log("✨ Nenhum evento expirado encontrado.");
    }
  } catch (error) {
    console.error("Erro na limpeza automática de eventos:", error);
  }
};

// ============================================================================
// 2. SERVIÇOS DE CONFIGURAÇÃO (IMAGENS DE CAPA)
// ============================================================================

export const getHeroImages = async (forceRefresh = false): Promise<string[]> => {
  if (!db) return [];

  // Verifica Cache se não for refresh forçado
  if (!forceRefresh) {
    const cachedData = getFromCache<string[]>('cached_hero_images');
    if (cachedData) return cachedData;
  }

  try {
    const doc = await db.collection('app_config').doc('hero_images').get();
    let data: string[] = [];
    if (doc.exists) {
      data = doc.data()?.urls || [];
    }
    
    // Salva no Cache
    saveToCache('cached_hero_images', data);
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar imagens de capa:", error);
    return [];
  }
};

export const updateHeroImages = async (urls: string[]) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('app_config').doc('hero_images').set({ urls });
};

// ============================================================================
// 3. SERVIÇOS DE CONFIGURAÇÃO GERAL (WIFI, AVISOS, IA)
// ============================================================================

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

// ============================================================================
// 4. SERVIÇOS DE SUGESTÕES INTELIGENTES
// ============================================================================

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

// ============================================================================
// 5. SERVIÇOS DE AVALIAÇÕES (REVIEWS)
// ============================================================================

export const getGuestReviews = async (limitCount?: number): Promise<GuestReview[]> => {
  if (!db) return [];
  try {
    let query: firebase.firestore.Query = db.collection('reviews');
    
    // Otimização: Limita o número de leituras se solicitado
    if (limitCount) {
      query = query.limit(limitCount);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    } as GuestReview));
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return [];
  }
};

export const addGuestReview = async (review: Omit<GuestReview, 'id'>): Promise<string> => {
  if (!db) throw new Error("Firebase não configurado");
  const docRef = await db.collection('reviews').add(review);
  return docRef.id;
};

export const deleteGuestReview = async (id: string) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('reviews').doc(id).delete();
};

// ============================================================================
// 6. SERVIÇOS DE RESERVAS (RESERVATIONS)
// ============================================================================

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

// Listener Geral (ADMIN) - Pega tudo para histórico
// Otimização: limitCount padrão para evitar baixar todo o banco em contas antigas
export const subscribeToReservations = (callback: (reservations: Reservation[]) => void, limitCount: number = 300) => {
  if (!db) return () => {};
  
  return db.collection('reservations')
    .orderBy('createdAt', 'desc')
    .limit(limitCount)
    .onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      callback(data);
    });
};

// NOVO: Listener Otimizado (LANDING PAGE) - Pega só o FUTURO
export const subscribeToFutureReservations = (callback: (reservations: Reservation[]) => void) => {
  if (!db) return () => {};
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  // Filtra onde a data de saída é maior ou igual a hoje.
  // Ignora reservas que já acabaram no passado.
  return db.collection('reservations')
    .where('checkoutDate', '>=', today)
    .onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      callback(data);
    }, (error) => {
      console.error("Erro ao buscar reservas futuras:", error);
    });
};

export const updateReservation = async (id: string, data: Partial<Reservation>) => {
  if (!db) throw new Error("Firebase não configurado");
  try {
    const { id: _, ...updateData } = data as any;
    await db.collection('reservations').doc(id).update(updateData);
    return true;
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    throw error;
  }
};

// ============================================================================
// 7. SERVIÇOS DE BLOQUEIO DE DATAS (BLOCKED DATES)
// ============================================================================

export const addBlockedDate = async (block: BlockedDateRange) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('blocked_dates').add(block);
};

export const deleteBlockedDate = async (id: string) => {
  if (!db) throw new Error("Firebase não configurado");
  await db.collection('blocked_dates').doc(id).delete();
};

// Listener Geral (ADMIN)
export const subscribeToBlockedDates = (callback: (blocks: BlockedDateRange[]) => void) => {
  if (!db) return () => {};
  
  return db.collection('blocked_dates').onSnapshot((snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    } as BlockedDateRange));
    callback(data);
  });
};

// NOVO: Listener Otimizado (LANDING PAGE)
export const subscribeToFutureBlockedDates = (callback: (blocks: BlockedDateRange[]) => void) => {
  if (!db) return () => {};
  
  const today = new Date().toISOString().split('T')[0];

  return db.collection('blocked_dates')
    .where('endDate', '>=', today)
    .onSnapshot((snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      } as BlockedDateRange));
      callback(data);
    });
};

// ============================================================================
// 8. SERVIÇOS DE AUTENTICAÇÃO
// ============================================================================

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