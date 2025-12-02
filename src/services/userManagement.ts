import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserPermission, PropertyId, UserRole } from '../types';

export const getUserPermission = async (email: string): Promise<UserPermission | null> => {
    try {
        // Normaliza email para minúsculo para evitar erros de case-sensitivity
        const normalizedEmail = email.toLowerCase();
        const docRef = doc(db, 'admin_users', normalizedEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                email: normalizedEmail,
                role: data.role as UserRole,
                allowedProperties: data.allowedProperties as PropertyId[]
            };
        } else {
            console.warn(`Permissão não encontrada no Firestore para: ${normalizedEmail}`);
        }
    } catch (error) {
        console.error("Error fetching user permission:", error);
    }

    return null;
};

export const canUserAccessProperty = (permission: UserPermission, propertyId: PropertyId): boolean => {
    if (permission.role === 'super_admin') return true;
    return permission.allowedProperties.includes(propertyId);
};
