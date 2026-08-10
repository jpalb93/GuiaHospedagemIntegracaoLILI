import { doc, getDoc, getDocFromServer } from 'firebase/firestore';
import { getFirestoreInstance } from './firebase/config';
import { UserPermission, PropertyId, UserRole } from '../types';
import { logger } from '../utils/logger';

export const getUserPermission = async (email: string): Promise<UserPermission | null> => {
    try {
        // Normaliza email para minúsculo para evitar erros de case-sensitivity
        const normalizedEmail = email.toLowerCase();
        const db = await getFirestoreInstance();
        const docRef = doc(db, 'admin_users', normalizedEmail);
        let docSnap;
        try {
            docSnap = await getDocFromServer(docRef);
        } catch {
            docSnap = await getDoc(docRef);
        }

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                email: normalizedEmail,
                role: data.role as UserRole,
                allowedProperties: data.allowedProperties as PropertyId[],
            };
        } else {
            logger.warn(`Permissão não encontrada no Firestore para: ${normalizedEmail}`);
        }
    } catch (error) {
        console.error('Error fetching user permission:', error);
    }

    return null;
};

export const canUserAccessProperty = (
    permission: UserPermission,
    propertyId: PropertyId
): boolean => {
    if (permission.role === 'super_admin') return true;
    return permission.allowedProperties.includes(propertyId);
};

export const restoreAdminUser = async (email: string): Promise<boolean> => {
    try {
        const db = await getFirestoreInstance();
        const normalizedEmail = email.toLowerCase();
        const docRef = doc(db, 'admin_users', normalizedEmail);

        // Force Super Admin for recovery
        await import('firebase/firestore').then(({ setDoc }) =>
            setDoc(
                docRef,
                {
                    email: normalizedEmail,
                    role: 'super_admin',
                    allowedProperties: ['lili', 'integracao'],
                    createdAt: new Date().toISOString(),
                    restoredBy: 'system_rescue',
                },
                { merge: true }
            )
        );

        return true;
    } catch (error) {
        console.error('Error restoring admin user:', error);
        return false;
    }
};
