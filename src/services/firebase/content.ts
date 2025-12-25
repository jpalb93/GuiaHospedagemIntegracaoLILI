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
    orderBy,
    limit,
    writeBatch,
    Query,
    DocumentData,
    QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db, cleanData } from './config';
import { Tip, CityCuriosity, GuestReview } from '../../types';
import { logger } from '../../utils/logger';

// --- DICAS (TIPS) ---
export const getTips = async (): Promise<Tip[]> => {
    try {
        const q = query(collection(db, 'tips'), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(
            (doc) =>
                ({
                    id: doc.id,
                    ...(doc.data() as Record<string, unknown>),
                }) as Tip
        );
    } catch (error) {
        logger.error('Erro ao buscar dicas:', { error });
        return [];
    }
};

export const addTip = async (tip: Tip): Promise<string> => {
    const docRef = await addDoc(collection(db, 'tips'), cleanData(tip));
    return docRef.id;
};

export const updateTip = async (id: string, tip: Partial<Tip>) => {
    const { id: _discard, ...dataToUpdate } = tip as Record<string, unknown>;
    await updateDoc(doc(db, 'tips', id), cleanData(dataToUpdate));
};

export const deleteTip = async (id: string) => {
    await deleteDoc(doc(db, 'tips', id));
};

export const saveTipsOrder = async (tips: Tip[]) => {
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

export const saveCuriosities = async (items: CityCuriosity[]) => {
    // Sanitize data: Firestore throws "Unsupported field value: undefined"
    // We must ensure no undefined fields exist in the array objects.
    const cleanItems = items.map((item) => cleanData(item));
    await setDoc(doc(db, 'app_config', 'curiosities'), { items: cleanItems });
};

// --- AVALIAÇÕES (REVIEWS) ---
export const getGuestReviews = async (limitCount?: number): Promise<GuestReview[]> => {
    try {
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
    const docRef = await addDoc(collection(db, 'reviews'), review);
    return docRef.id;
};

export const deleteGuestReview = async (id: string) => {
    await deleteDoc(doc(db, 'reviews', id));
};
