/**
 * Serviços de Autenticação
 * Login, logout e estado de autenticação
 */
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config';

export const loginCMS = async (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logoutCMS = async () => {
    return signOut(auth);
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};
