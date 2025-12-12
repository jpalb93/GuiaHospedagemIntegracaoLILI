import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { SystemLog } from '../../types';

const COLLECTION_NAME = 'logs';

export const logAction = async (
    action: SystemLog['action'],
    userEmail: string,
    details: string,
    targetId?: string,
    targetName?: string
) => {
    try {
        const log: SystemLog = {
            action,
            userEmail,
            details,
            targetId,
            targetName,
            timestamp: new Date().toISOString(),
        };
        await addDoc(collection(db, COLLECTION_NAME), log);
    } catch (error) {
        console.error('Error logging action:', error);
        // Silent fail to not block main flow
    }
};

export const fetchLogs = async (max = 50): Promise<SystemLog[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy('timestamp', 'desc'),
            limit(max)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SystemLog));
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
};
