import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, getDoc, getDocs, 
  addDoc, setDoc, updateDoc, deleteDoc, onSnapshot, 
  query, where, limit, orderBy, writeBatch 
} from 'firebase/firestore';
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User 
} from 'firebase/auth';
import { PlaceRecommendation, Reservation, AppConfig, SmartSuggestionsConfig, GuestReview, BlockedDateRange } from '../types';

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
const db = getFirestore(app);
const auth = getAuth(app);

export const isFirebaseConfigured = () => !!app;

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
  if (!forceRefresh) {
    const cachedData = getFromCache<PlaceRecommendation[]>('cached_places');
    if (cachedData) return cachedData;
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'places'));
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    } as PlaceRecommendation));
    
    saveToCache('cached_places', data);
    return data;
  } catch (error) {
    console.error("Erro ao buscar locais:", error);
    return [];
  }
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'places'), place);
  return docRef.id;
};

export const updateDynamicPlace = async (id: string, place: Partial<PlaceRecommendation>) => {
  // Remove o ID do objeto para não duplicar dentro do documento
  const { id: _, ...dataToUpdate } = place as any;
  await updateDoc(doc(db, 'places', id), dataToUpdate);
};

export const deleteDynamicPlace = async (id: string) => {
  await deleteDoc(doc(db, 'places', id));
};

// --- FUNÇÃO DE LIMPEZA AUTOMÁTICA DE EVENTOS ---
export const cleanupExpiredEvents = async () => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  console.log("🧹 Verificando eventos expirados antes de: ", today);

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
      console.log(`✅ Faxina completa: ${deletedCount} eventos antigos removidos.`);
    }
  } catch (error) {
    console.error("Erro na limpeza automática de eventos:", error);
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
  } catch (error) {
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
  } catch (error) {
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
    console.error("Erro no listener de configs:", error);
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
  } catch (error) {
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
  });
};

// ============================================================================
// 5. SERVIÇOS DE AVALIAÇÕES (REVIEWS)
// ============================================================================

export const getGuestReviews = async (limitCount?: number): Promise<GuestReview[]> => {
  try {
    let q = collection(db, 'reviews') as any;
    if (limitCount) {
      q = query(collection(db, 'reviews'), limit(limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...(doc.data() as any)
    } as GuestReview));
  } catch (error) {
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
// 6. SERVIÇOS DE RESERVAS (RESERVATIONS)
// ============================================================================

export const saveReservation = async (reservation: Reservation): Promise<string> => {
  const data = { 
    ...reservation, 
    createdAt: new Date().toISOString(),
    status: 'active'
  };
  const docRef = await addDoc(collection(db, 'reservations'), data);
  return docRef.id;
};

export const getReservation = async (id: string): Promise<Reservation | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'reservations', id));
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as any) } as Reservation;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const subscribeToSingleReservation = (id: string, callback: (res: Reservation | null) => void) => {
  return onSnapshot(doc(db, 'reservations', id), (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...(docSnap.data() as any) } as Reservation);
    } else {
      callback(null);
    }
  });
};

export const deleteReservation = async (id: string) => {
  await deleteDoc(doc(db, 'reservations', id));
};

export const subscribeToReservations = (callback: (reservations: Reservation[]) => void, limitCount: number = 300) => {
  const q = query(collection(db, 'reservations'), orderBy('createdAt', 'desc'), limit(limitCount));
  
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Reservation));
    callback(data);
  });
};

// NOVO: Listener Otimizado (LANDING PAGE) - Pega só o FUTURO
export const subscribeToFutureReservations = (callback: (reservations: Reservation[]) => void) => {
  const today = new Date().toISOString().split('T')[0]; 
  const q = query(collection(db, 'reservations'), where('checkoutDate', '>=', today));

  return onSnapshot(q, (snapshot) => {
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
  const { id: _, ...updateData } = data as any;
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
      ...(doc.data() as any)
    } as BlockedDateRange));
    callback(data);
  });
};

export const subscribeToFutureBlockedDates = (callback: (blocks: BlockedDateRange[]) => void) => {
  const today = new Date().toISOString().split('T')[0];
  const q = query(collection(db, 'blocked_dates'), where('endDate', '>=', today));

  return onSnapshot(q, (snapshot) => {
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
  return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutCMS = async () => {
  return signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};