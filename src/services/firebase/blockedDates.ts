/**
 * Serviços de Datas Bloqueadas
 * CRUD para bloqueio de períodos no calendário
 */
import {
    collection, doc, addDoc, deleteDoc, onSnapshot, query, where
} from 'firebase/firestore';
import { db } from './config';
import { BlockedDateRange } from '../../types';
import { logger } from '../../utils/logger';

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
    });
};
