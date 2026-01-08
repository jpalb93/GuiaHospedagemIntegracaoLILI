/**
 * Serviços de Datas Bloqueadas
 * CRUD para bloqueio de períodos no calendário
 */
import { collection, doc, addDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { getFirestoreInstance } from './config';
import { BlockedDateRange } from '../../types';
import { logger } from '../../utils/logger';

export const addBlockedDate = async (block: BlockedDateRange) => {
    const db = await getFirestoreInstance();
    await addDoc(collection(db, 'blocked_dates'), block);
};

export const deleteBlockedDate = async (id: string) => {
    const db = await getFirestoreInstance();
    await deleteDoc(doc(db, 'blocked_dates', id));
};

export const subscribeToBlockedDates = async (callback: (blocks: BlockedDateRange[]) => void) => {
    const db = await getFirestoreInstance();
    return onSnapshot(
        collection(db, 'blocked_dates'),
        (snapshot) => {
            const data = snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...(doc.data() as Record<string, unknown>),
                    }) as BlockedDateRange
            );
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de datas bloqueadas:', { error });
        }
    );
};

export const subscribeToFutureBlockedDates = async (callback: (blocks: BlockedDateRange[]) => void) => {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // YYYY-MM-DD Local
    const db = await getFirestoreInstance();
    const q = query(collection(db, 'blocked_dates'), where('endDate', '>=', today));

    return onSnapshot(
        q,
        (snapshot) => {
            const data = snapshot.docs.map(
                (doc) =>
                    ({
                        id: doc.id,
                        ...(doc.data() as Record<string, unknown>),
                    }) as BlockedDateRange
            );
            callback(data);
        },
        (error) => {
            logger.error('Erro no listener de datas bloqueadas futuras:', { error });
        }
    );
};
