/**
 * Serviços de lugares/locais (Places)
 * CRUD para recomendações de lugares
 */
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    where,
    writeBatch,
} from 'firebase/firestore';
import { db, cleanData, getFromCache, saveToCache } from './config';
import { PlaceRecommendation } from '../../types';
import { logger } from '../../utils/logger';

export const getDynamicPlaces = async (forceRefresh = false): Promise<PlaceRecommendation[]> => {
    if (!forceRefresh) {
        const cachedData = getFromCache<PlaceRecommendation[]>('cached_places');
        if (cachedData) return cachedData;
    }

    try {
        const querySnapshot = await getDocs(collection(db, 'places'));
        const data = querySnapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...(doc.data() as Omit<PlaceRecommendation, 'id'>),
                }) as PlaceRecommendation
        );

        saveToCache('cached_places', data);
        return data;
    } catch (error) {
        logger.error('Erro ao buscar locais:', error);
        return [];
    }
};

export const subscribeToPlaces = (callback: (places: PlaceRecommendation[]) => void) => {
    const q = query(collection(db, 'places'));
    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...(doc.data() as Omit<PlaceRecommendation, 'id'>),
                    }) as PlaceRecommendation
            );
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de locais:', error);
        }
    );
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'places'), cleanData(place));
    return docRef.id;
};

export const updateDynamicPlace = async (id: string, place: Partial<PlaceRecommendation>) => {
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
        const q = query(collection(db, 'places'), where('category', '==', 'events'));
        const snapshot = await getDocs(q);

        if (snapshot.empty) return;

        const batch = writeBatch(db);
        let deletedCount = 0;

        snapshot.docs.forEach((docSnap) => {
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
        logger.error('Erro na limpeza automática de eventos:', error);
    }
};
