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
import { getFirestoreInstance, cleanData, getFromCache, saveToCache } from './config';
import { PlaceRecommendation, PropertyId } from '../../types';
import { logger } from '../../utils/logger';
import { mapFirestoreDocs } from './mappers';

/**
 * Filtro defensivo para manter 100% de compatibilidade retroativa:
 * Retorna itens sem propertyId (legados), marcados como 'all', ou pertencentes ao tenant específico.
 */
export const filterPlacesByProperty = (
    places: PlaceRecommendation[],
    propertyId?: PropertyId
): PlaceRecommendation[] => {
    if (!propertyId) return places;
    return places.filter(
        (p) => !p.propertyId || p.propertyId === 'all' || p.propertyId === propertyId
    );
};

export const getDynamicPlaces = async (
    forceRefresh = false,
    propertyId?: PropertyId
): Promise<PlaceRecommendation[]> => {
    const cacheKey = propertyId ? `cached_places_${propertyId}` : 'cached_places';
    if (!forceRefresh) {
        const cachedData = getFromCache<PlaceRecommendation[]>(cacheKey);
        if (cachedData) return cachedData;
    }

    try {
        const db = await getFirestoreInstance();
        const querySnapshot = await getDocs(collection(db, 'places'));
        const allData = mapFirestoreDocs<PlaceRecommendation>(querySnapshot);
        const data = filterPlacesByProperty(allData, propertyId);

        saveToCache(cacheKey, data);
        return data;
    } catch (error) {
        logger.error('Erro ao buscar locais:', { error });
        return [];
    }
};

export const subscribeToPlaces = async (
    callback: (places: PlaceRecommendation[]) => void,
    propertyId?: PropertyId
) => {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'places'));
    return onSnapshot(
        q,
        (snapshot) => {
            const allData = mapFirestoreDocs<PlaceRecommendation>(snapshot);
            const filteredData = filterPlacesByProperty(allData, propertyId);
            callback(filteredData);
        },
        (error) => {
            logger.error('Erro no listener de locais:', { error });
        }
    );
};

export const addDynamicPlace = async (place: Omit<PlaceRecommendation, 'id'>): Promise<string> => {
    const db = await getFirestoreInstance();
    const docRef = await addDoc(collection(db, 'places'), cleanData(place));
    return docRef.id;
};

export const updateDynamicPlace = async (id: string, place: Partial<PlaceRecommendation>) => {
    const { id: _discard, ...dataToUpdate } = place as PlaceRecommendation;
    const db = await getFirestoreInstance();
    await updateDoc(doc(db, 'places', id), cleanData(dataToUpdate));
};

export const deleteDynamicPlace = async (id: string) => {
    const db = await getFirestoreInstance();
    await deleteDoc(doc(db, 'places', id));
};

// --- FUNÇÃO DE LIMPEZA AUTOMÁTICA DE EVENTOS ---
export const cleanupExpiredEvents = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        const db = await getFirestoreInstance();
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
        logger.error('Erro na limpeza automática de eventos:', { error });
    }
};
