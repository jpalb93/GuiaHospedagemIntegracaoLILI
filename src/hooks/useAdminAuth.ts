import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { subscribeToAuth, loginCMS, logoutCMS } from '../services/firebase';
import { getUserPermission } from '../services/userManagement';
import { UserPermission } from '../types';

export interface UseAdminAuthReturn {
    user: User | null;
    userPermission: UserPermission | null;
    authLoading: boolean;
    login: (e: React.FormEvent, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

export const useAdminAuth = (): UseAdminAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [userPermission, setUserPermission] = useState<UserPermission | null>(null);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = subscribeToAuth(async (u) => {
            setUser(u);
            if (u && u.email) {
                const perm = await getUserPermission(u.email);
                setUserPermission(perm);
            } else {
                setUserPermission(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (
        e: React.FormEvent,
        email: string,
        pass: string
    ): Promise<{ success: boolean; error?: string }> => {
        e.preventDefault();
        try {
            await loginCMS(email, pass);
            return { success: true };
        } catch (_e) {
            return { success: false, error: 'Erro ao entrar. Verifique email e senha.' };
        }
    };

    const logout = async () => {
        await logoutCMS();
    };

    return {
        user,
        userPermission,
        authLoading,
        login,
        logout,
    };
};
