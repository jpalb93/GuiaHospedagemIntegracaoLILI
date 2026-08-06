/**
 * Serviços de Conteúdo
 * Dicas (Tips), Curiosidades e Reviews
 */
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    setDoc,
    query,
    limit,
    writeBatch,
    Query,
    DocumentData,
    QueryDocumentSnapshot,
    onSnapshot,
} from 'firebase/firestore';
import { getFirestoreInstance, cleanData } from './config';
import { Tip, CityCuriosity, GuestReview, PropertyId } from '../../types';
import { logger } from '../../utils/logger';

/**
 * Filtro defensivo para dicas:
 * Retorna dicas sem propertyId (legadas), marcadas como 'all', ou pertencentes ao tenant específico.
 */
export const filterTipsByProperty = (tips: Tip[], propertyId?: PropertyId): Tip[] => {
    if (!propertyId) return tips;
    return tips.filter((t) => !t.propertyId || t.propertyId === 'all' || t.propertyId === propertyId);
};

// --- DICAS (TIPS) ---
export const getTips = async (propertyId?: PropertyId): Promise<Tip[]> => {
    try {
        const db = await getFirestoreInstance();
        // REMOVED orderBy('order') to avoid excluding docs without the field
        const q = query(collection(db, 'tips'));
        const snapshot = await getDocs(q);
        const allTips = snapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...(doc.data() as Record<string, unknown>),
                }) as Tip
        );

        const filtered = filterTipsByProperty(allTips, propertyId);
        // Client-side sort
        return filtered.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        logger.error('Erro ao buscar dicas:', { error });
        return [];
    }
};

export const subscribeToTips = async (
    callback: (tips: Tip[]) => void,
    propertyId?: PropertyId
) => {
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'tips'));

    return onSnapshot(
        q,
        (snapshot) => {
            const allTips = snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...(doc.data() as Record<string, unknown>),
                    }) as Tip
            );
            const filtered = filterTipsByProperty(allTips, propertyId);
            // Client-side sort
            callback(filtered.sort((a, b) => (a.order || 0) - (b.order || 0)));
        },
        (error) => {
            logger.error('Erro no subscribeToTips:', { error });
            callback([]);
        }
    );
};

export const addTip = async (tip: Tip): Promise<string> => {
    const db = await getFirestoreInstance();
    const docRef = await addDoc(collection(db, 'tips'), cleanData(tip));
    return docRef.id;
};

export const updateTip = async (id: string, tip: Partial<Tip>) => {
    const { id: _discard, ...dataToUpdate } = tip as Record<string, unknown>;
    const db = await getFirestoreInstance();
    await updateDoc(doc(db, 'tips', id), cleanData(dataToUpdate));
};

export const deleteTip = async (id: string) => {
    const db = await getFirestoreInstance();
    await deleteDoc(doc(db, 'tips', id));
};

export const saveTipsOrder = async (tips: Tip[]) => {
    const db = await getFirestoreInstance();
    const batch = writeBatch(db);
    tips.forEach((tip) => {
        if (tip.id) {
            const ref = doc(db, 'tips', tip.id);
            batch.update(ref, { order: tip.order });
        }
    });
    await batch.commit();
};

// --- CURIOSIDADES (CURIOSITIES) ---
export const getCuriosities = async (): Promise<CityCuriosity[]> => {
    try {
        const db = await getFirestoreInstance();
        const docRef = doc(db, 'app_config', 'curiosities');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let items: CityCuriosity[] = docSnap.data()?.items || [];
            let needsUpdate = false;

            // Normalize and ensure IDs
            items = items.map((item: string | CityCuriosity) => {
                let normItem: CityCuriosity;
                if (typeof item === 'string') {
                    normItem = { text: item, visible: true };
                } else {
                    normItem = { ...item };
                }

                // Generates ID if missing
                if (!normItem.id) {
                    normItem.id = crypto.randomUUID
                        ? crypto.randomUUID()
                        : `curiosity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    needsUpdate = true;
                }
                return normItem;
            });

            // Self-heal: Persist generated IDs so they remain stable
            if (needsUpdate) {
                logger.info('Self-healing: Assigning IDs to Curiosities...');
                await updateDoc(docRef, { items });
            }

            return items;
        }
        return [];
    } catch (_error) {
        return [];
    }
};

export const subscribeToCuriosities = async (callback: (items: CityCuriosity[]) => void) => {
    const db = await getFirestoreInstance();
    const docRef = doc(db, 'app_config', 'curiosities');

    return onSnapshot(
        docRef,
        (docSnap) => {
            if (docSnap.exists()) {
                const items: CityCuriosity[] = docSnap.data()?.items || [];
                callback(items);
            } else {
                callback([]);
            }
        },
        (error) => {
            logger.error('Erro no listener de curiosidades:', { error });
            callback([]);
        }
    );
};

export const saveCuriosities = async (items: CityCuriosity[]) => {
    // Sanitize data: Firestore throws "Unsupported field value: undefined"
    // We must ensure no undefined fields exist in the array objects.
    const cleanItems = items.map((item) => cleanData(item));
    const db = await getFirestoreInstance();
    await setDoc(doc(db, 'app_config', 'curiosities'), { items: cleanItems });
};

// --- AVALIAÇÕES (REVIEWS) ---
export const getGuestReviews = async (limitCount?: number): Promise<GuestReview[]> => {
    try {
        const db = await getFirestoreInstance();
        let q = collection(db, 'reviews') as Query<DocumentData>;
        if (limitCount) {
            q = query(collection(db, 'reviews'), limit(limitCount));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc: QueryDocumentSnapshot<unknown, DocumentData>) =>
                ({
                    id: doc.id,
                    ...(doc.data() as Record<string, unknown>),
                }) as GuestReview
        );
    } catch (_error) {
        return [];
    }
};

export const addGuestReview = async (review: Omit<GuestReview, 'id'>): Promise<string> => {
    const db = await getFirestoreInstance();
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return docRef.id;
};

export const deleteGuestReview = async (id: string) => {
    const db = await getFirestoreInstance();
    await deleteDoc(doc(db, 'reviews', id));
};
