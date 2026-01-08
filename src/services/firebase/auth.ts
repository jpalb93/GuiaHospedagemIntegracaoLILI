/**
 * Serviços de Autenticação
 * Login, logout e estado de autenticação
 */
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirebaseAuth } from './config';

export const loginCMS = async (email: string, pass: string) => {
    const auth = await getFirebaseAuth();
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutCMS = async () => {
    const auth = await getFirebaseAuth();
    return signOut(auth);
};

export const subscribeToAuth = async (callback: (user: User | null) => void) => {
    const auth = await getFirebaseAuth();
    return onAuthStateChanged(auth, callback);
};
