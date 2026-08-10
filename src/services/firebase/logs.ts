import { getFirestoreInstance } from './config';
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
        const db = await getFirestoreInstance();
        await addDoc(collection(db, COLLECTION_NAME), log);
    } catch (error) {
        console.error('Error logging action:', error);
        // Silent fail to not block main flow
    }
};

export const fetchLogs = async (max = 50): Promise<SystemLog[]> => {
    try {
        const db = await getFirestoreInstance();
        const q = query(collection(db, COLLECTION_NAME), orderBy('timestamp', 'desc'), limit(max));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SystemLog);
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
};

/** Histórico relacionado a uma conta (por id e nomes legíveis) */
export const fetchCompanyActivityLogs = async (
    companyId: string,
    names: string[],
    maxScan = 150
): Promise<SystemLog[]> => {
    const all = await fetchLogs(maxScan);
    const nameSet = new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean));
    return all.filter((log) => {
        if (log.targetId === companyId) return true;
        const tn = (log.targetName || '').toLowerCase();
        if (tn && nameSet.has(tn)) return true;
        const details = (log.details || '').toLowerCase();
        for (const n of nameSet) {
            if (n.length >= 3 && details.includes(n)) return true;
        }
        return false;
    });
};
