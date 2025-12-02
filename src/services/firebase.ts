import { initializeApp } from 'firebase/app';
import {
  collection, doc, getDoc, getDocs,
  addDoc, setDoc, updateDoc, deleteDoc, onSnapshot,
  query, where, limit, orderBy, writeBatch, startAfter, QueryDocumentSnapshot, DocumentData, Query,
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User
} from 'firebase/auth';
import { PlaceRecommendation, Reservation, AppConfig, SmartSuggestionsConfig, GuestReview, BlockedDateRange } from '../types';
import { logger } from '../utils/logger';

// Configuração
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicialização Segura
const app = initializeApp(firebaseConfig);
// Inicializa com persistência (cache offline)
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
const auth = getAuth(app);
export const storage = getStorage(app);

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
    missingKeys
  };
};

// --- HELPER PARA CACHE LOCAL (REDUÇÃO DE LEITURAS) ---
const CACHE_EXPIRY_MS = 3600000; // 1 hora

const getFromCache = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);

    // Se o cache for mais velho que 1 hora, descarta
    if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }

    return data as T;
  } catch (_e) {
    return null;
  }
};

const saveToCache = (key: string, data: unknown) => {
  try {
    const cacheObj = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheObj));
  } catch (e) {
    logger.warn("Erro ao salvar cache local", e);
  }
};

// ============================================================================
// 1. SERVIÇOS DE BANCO DE DADOS (LOCAIS / PLACES)
// ============================================================================

export const getDynamicPlaces = async (forceRefresh = false): Promise<PlaceRecommendation[]> => {
  if (!forceRefresh) {
    const cachedData = getFromCache<PlaceRecommendation[]>('cached_places');
    if (cachedData) return cachedData;
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'places'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<PlaceRecommendation, 'id'>)
    } as PlaceRecommendation));

    saveToCache('cached_places', data);
    return data;
  } catch (error) {
    logger.error("Erro ao buscar locais:", error);
    return [];
  }
};

export const subscribeToPlaces = (callback: (places: PlaceRecommendation[]) => void) => {
  const q = query(collection(db, 'places'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<PlaceRecommendation, 'id'>)
    } as PlaceRecommendation));
    callback(data);
  }, (error) => {
    logger.error("Erro no listener de locais:", error);
  });
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'places'), cleanData(place));
  return docRef.id;
};

export const updateDynamicPlace = async (id: string, place: Partial<PlaceRecommendation>) => {
  // Remove o ID do objeto para não duplicar dentro do documento
  const { id: _discard, ...dataToUpdate } = place as PlaceRecommendation;
  await updateDoc(doc(db, 'places', id), cleanData(dataToUpdate));
};

export const deleteDynamicPlace = async (id: string) => {
  await deleteDoc(doc(db, 'places', id));
};

// --- FUNÇÃO DE LIMPEZA AUTOMÁTICA DE EVENTOS ---
export const cleanupExpiredEvents = async () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD


  try {
    // Busca apenas locais que são eventos
    const q = query(collection(db, 'places'), where('category', '==', 'events'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const batch = writeBatch(db);
    let deletedCount = 0;

    snapshot.docs.forEach(docSnap => {
      const data = docSnap.data() as PlaceRecommendation;
      const expiryDate = data.eventEndDate || data.eventDate;

      if (expiryDate && expiryDate < today) {
        batch.delete(docSnap.ref);
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      await batch.commit();
    }
  } catch (error) {
    logger.error("Erro na limpeza automática de eventos:", error);
  }
};

// ============================================================================
// 2. SERVIÇOS DE CONFIGURAÇÃO (IMAGENS DE CAPA)
// ============================================================================

export const getHeroImages = async (forceRefresh = false): Promise<string[]> => {
  if (!forceRefresh && !import.meta.env.DEV) {
    const cachedData = getFromCache<string[]>('cached_hero_images');
    if (cachedData) return cachedData;
  }

  try {
    const docSnap = await getDoc(doc(db, 'app_config', 'hero_images'));
    let data: string[] = [];
    if (docSnap.exists()) {
      data = docSnap.data()?.urls || [];
    }
    saveToCache('cached_hero_images', data);
    return data;
  } catch (_error) {
    return [];
  }
};

export const updateHeroImages = async (urls: string[]) => {
  await setDoc(doc(db, 'app_config', 'hero_images'), { urls });
};

// ============================================================================
// 3. SERVIÇOS DE CONFIGURAÇÃO GERAL (WIFI, AVISOS, IA)
// ============================================================================

export const getAppSettings = async (): Promise<AppConfig | null> => {
  try {
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
  await setDoc(doc(db, 'app_config', 'general'), config);
};

export const subscribeToAppSettings = (callback: (config: AppConfig | null) => void) => {
  return onSnapshot(doc(db, 'app_config', 'general'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as AppConfig);
    } else {
      callback(null);
    }
  }, (error) => {
    logger.error("Erro no listener de configs:", error);
  });
};

// ============================================================================
// 4. SERVIÇOS DE SUGESTÕES INTELIGENTES
// ============================================================================

export const getSmartSuggestions = async (): Promise<SmartSuggestionsConfig | null> => {
  try {
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
  await setDoc(doc(db, 'app_config', 'suggestions'), config);
};

export const subscribeToSmartSuggestions = (callback: (config: SmartSuggestionsConfig | null) => void) => {
  return onSnapshot(doc(db, 'app_config', 'suggestions'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data() as SmartSuggestionsConfig);
    } else {
      callback(null);
    }
  }, (error) => {
    logger.error("Erro no listener de sugestões:", error);
    // Não limpa o estado para manter a última versão válida na tela
  });
};

// ============================================================================
// 5. SERVIÇOS DE AVALIAÇÕES (REVIEWS)
// ============================================================================

export const getGuestReviews = async (limitCount?: number): Promise<GuestReview[]> => {
  try {
    let q = collection(db, 'reviews') as Query<DocumentData>;
    if (limitCount) {
      q = query(collection(db, 'reviews'), limit(limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: QueryDocumentSnapshot<unknown, DocumentData>) => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>)
    } as GuestReview));
  } catch (_error) {
    return [];
  }
};

export const addGuestReview = async (review: Omit<GuestReview, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'reviews'), review);
  return docRef.id;
};

export const deleteGuestReview = async (id: string) => {
  await deleteDoc(doc(db, 'reviews', id));
};

// ============================================================================
// 6. SERVIÇOS DE RESERVAS (RESERVATIONS) - OTIMIZADO PARA PAGINAÇÃO
// ============================================================================

const generateShortId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const saveReservation = async (reservation: Reservation): Promise<string> => {
  const data = {
    ...reservation,
    shortId: reservation.shortId || generateShortId(),
    createdAt: new Date().toISOString(),
    status: reservation.status || 'active'
  };
  const docRef = await addDoc(collection(db, 'reservations'), cleanData(data));
  return docRef.id;
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'reservations', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Record<string, unknown>) } as Reservation;
    }
    return null;
  } catch (_error) {
    return null;
  }
};

export const subscribeToSingleReservation = (id: string, callback: (res: Reservation | null) => void) => {
  return onSnapshot(doc(db, 'reservations', id), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...(docSnap.data() as Record<string, unknown>) } as Reservation);
    } else {
      callback(null);
    }
  }, (error) => {
    logger.error("Erro no listener de reserva única:", error);
    // callback(null); // Mantém dados antigos
  });
};

export const deleteReservation = async (id: string) => {
  await deleteDoc(doc(db, 'reservations', id));
};

// --- OTIMIZAÇÃO DE LEITURA: Apenas Ativas em Tempo Real ---
// --- OTIMIZAÇÃO DE LEITURA: Apenas Ativas em Tempo Real ---
export const subscribeToActiveReservations = (callback: (reservations: Reservation[]) => void, allowedProperties?: string[]) => {
  // Pega todas onde o checkout é hoje ou no futuro (Ativas)
  const now = new Date();
  const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local

  let constraints: any[] = [
    where('checkoutDate', '>=', today),
    orderBy('checkoutDate', 'asc')
  ];

  // Se houver restrição de propriedade, adiciona o filtro
  // NOTA: Firestore 'in' suporta até 10 valores.
  if (allowedProperties && allowedProperties.length > 0) {
    constraints.push(where('propertyId', 'in', allowedProperties));
  }

  const q = query(collection(db, 'reservations'), ...constraints);

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
    callback(data);
  }, (error) => {
    logger.error("Erro no listener de reservas ativas:", error);
    // callback([]); // Mantém dados antigos
  });
};

// --- OTIMIZAÇÃO DE LEITURA: Histórico Paginado (Sob Demanda) ---
export const fetchHistoryReservations = async (
  lastDoc: QueryDocumentSnapshot<unknown, DocumentData> | null = null,
  pageSize: number = 20,
  allowedProperties?: string[]
) => {
  const now = new Date();
  const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local

  let constraints: any[] = [
    where('checkoutDate', '<', today), // Apenas passado
    orderBy('checkoutDate', 'desc'), // Mais recentes primeiro
    limit(pageSize)
  ];

  if (allowedProperties && allowedProperties.length > 0) {
    constraints.push(where('propertyId', 'in', allowedProperties));
  }

  let q = query(collection(db, 'reservations'), ...constraints);

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Reservation));

  return {
    data,
    lastVisible: snapshot.docs[snapshot.docs.length - 1],
    hasMore: snapshot.docs.length === pageSize
  };
};

// ANTIGO (Mantido para compatibilidade se necessário, mas depreciado)
export const subscribeToReservations = (callback: (reservations: Reservation[]) => void, limitCount: number = 300) => {
  const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(limitCount));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
    callback(data);
  }, (error) => {
    logger.error("Erro no listener de reservas (legacy):", error);
    // callback([]); // Mantém dados antigos
  });
};

// NOVO: Listener Otimizado (LANDING PAGE) - Pega só o FUTURO
export const subscribeToFutureReservations = (callback: (reservations: Reservation[]) => void) => {
  const now = new Date();
  const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local
  const q = query(collection(db, 'reservations'), where('checkoutDate', '>=', today));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
    callback(data);
  }, (error) => {
    logger.error("Erro ao buscar reservas futuras:", error);
  });
};

export const updateReservation = async (id: string, data: Partial<Reservation>) => {
  const { id: _discard, ...updateData } = data as Record<string, unknown>;
  await updateDoc(doc(db, 'reservations', id), updateData);
  return true;
};

// ============================================================================
// 7. SERVIÇOS DE BLOQUEIO DE DATAS (BLOCKED DATES)
// ============================================================================

export const addBlockedDate = async (block: BlockedDateRange) => {
  await addDoc(collection(db, 'blocked_dates'), block);
};

export const deleteBlockedDate = async (id: string) => {
  await deleteDoc(doc(db, 'blocked_dates', id));
};

export const subscribeToBlockedDates = (callback: (blocks: BlockedDateRange[]) => void) => {
  return onSnapshot(collection(db, 'blocked_dates'), (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>)
    } as BlockedDateRange));
    callback(data);
  }, (error) => {
    logger.error("Erro no listener de datas bloqueadas:", error);
    // callback([]); // Mantém dados antigos
  });
};

export const subscribeToFutureBlockedDates = (callback: (blocks: BlockedDateRange[]) => void) => {
  const now = new Date();
  const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local
  const q = query(collection(db, 'blocked_dates'), where('endDate', '>=', today));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>)
    } as BlockedDateRange));
    callback(data);
  }, (error) => {
    logger.error("Erro no listener de datas bloqueadas futuras:", error);
    // callback([]); // Mantém dados antigos
  });
};

// ============================================================================
// 8. SERVIÇOS DE STORAGE (UPLOAD DE IMAGENS)
// ============================================================================

export const uploadImage = (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });
};

// ============================================================================
// 9. SERVIÇOS DE AUTENTICAÇÃO
// ============================================================================

export const loginCMS = async (email: string, pass: string) => {
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutCMS = async () => {
  return signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ============================================================================
// 10. SERVIÇOS DE CONTEÚDO (DICAS E CURIOSIDADES)
// ============================================================================

import { Tip, CityCuriosity } from '../types';

// --- HELPER PARA REMOVER UNDEFINED (Firestore não aceita) ---
const cleanData = <T extends object>(data: T): T => {
  const clean = { ...data } as Record<string, unknown>;
  Object.keys(clean).forEach(key => {
    if (clean[key] === undefined) {
      delete clean[key];
    }
  });
  return clean as unknown as T;
};

// --- DICAS (TIPS) ---
export const getTips = async (): Promise<Tip[]> => {
  try {
    const q = query(collection(db, 'tips'), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Record<string, unknown>)
    } as Tip));
  } catch (error) {
    logger.error("Erro ao buscar dicas:", error);
    return [];
  }
};

export const addTip = async (tip: Tip) => {
  await addDoc(collection(db, 'tips'), cleanData(tip));
};

export const deleteTip = async (id: string) => {
  await deleteDoc(doc(db, 'tips', id));
};

export const updateTip = async (id: string, tip: Partial<Tip>) => {
  const { id: _discard, ...dataToUpdate } = tip as Record<string, unknown>;
  await updateDoc(doc(db, 'tips', id), cleanData(dataToUpdate));
};

// --- CURIOSIDADES (CURIOSITIES) ---
export const getCuriosities = async (): Promise<CityCuriosity[]> => {
  try {
    const docSnap = await getDoc(doc(db, 'app_config', 'curiosities'));
    if (docSnap.exists()) {
      const items = docSnap.data()?.items || [];
      // Migração segura: Se for string, converte para objeto
      return items.map((item: string | CityCuriosity) => {
        if (typeof item === 'string') {
          return { text: item, visible: true };
        }
        return item;
      });
    }
    return [];
  } catch (_error) {
    return [];
  }
};

export const saveCuriosities = async (items: CityCuriosity[]) => {
  await setDoc(doc(db, 'app_config', 'curiosities'), { items });
};