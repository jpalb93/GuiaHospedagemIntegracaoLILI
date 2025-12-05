/**
 * Serviços de Conteúdo
 * Dicas (Tips), Curiosidades e Reviews
 */
import {
    collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, setDoc,
    query, orderBy, limit, writeBatch, Query, DocumentData, QueryDocumentSnapshot
} from 'firebase/firestore';
import { db, cleanData } from './config';
import { Tip, CityCuriosity, GuestReview } from '../../types';
import { logger } from '../../utils/logger';

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

// --- AVALIAÇÕES (REVIEWS) ---
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
