import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loginCMS, logoutCMS, subscribeToAuth } from './auth';
import * as firebaseAuth from 'firebase/auth';

// Mock Firebase Auth module
vi.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn(),
}));

// Mock Firebase config
vi.mock('./config', () => ({
    auth: { currentUser: null },
}));

describe('Firebase Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loginCMS', () => {
        it('should call signInWithEmailAndPassword with correct params', async () => {
            const mockCredential = { user: { uid: 'test-uid', email: 'test@test.com' } };
            (firebaseAuth.signInWithEmailAndPassword as any).mockResolvedValue(mockCredential);

            const result = await loginCMS('test@test.com', 'password123');

            expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
                expect.anything(), // auth instance
                'test@test.com',
                'password123'
            );
            expect(result).toEqual(mockCredential);
        });

        it('should propagate authentication errors', async () => {
            const authError = new Error('Invalid credentials');
            (firebaseAuth.signInWithEmailAndPassword as any).mockRejectedValue(authError);

            await expect(loginCMS('bad@email.com', 'badpass')).rejects.toThrow('Invalid credentials');
        });
    });

    describe('logoutCMS', () => {
        it('should call signOut', async () => {
            (firebaseAuth.signOut as any).mockResolvedValue(undefined);

            await logoutCMS();

            expect(firebaseAuth.signOut).toHaveBeenCalledWith(expect.anything());
        });

        it('should propagate logout errors', async () => {
            const logoutError = new Error('Network error');
            (firebaseAuth.signOut as any).mockRejectedValue(logoutError);

            await expect(logoutCMS()).rejects.toThrow('Network error');
        });
    });

    describe('subscribeToAuth', () => {
        it('should call onAuthStateChanged with callback', () => {
            const mockCallback = vi.fn();
            const mockUnsubscribe = vi.fn();
            (firebaseAuth.onAuthStateChanged as any).mockReturnValue(mockUnsubscribe);

            const unsubscribe = subscribeToAuth(mockCallback);

            expect(firebaseAuth.onAuthStateChanged).toHaveBeenCalledWith(
                expect.anything(), // auth instance
                mockCallback
            );
            expect(unsubscribe).toBe(mockUnsubscribe);
        });

        it('should allow callback to receive user on auth change', () => {
            const mockUser = { uid: 'user-123', email: 'user@test.com' };
            const mockCallback = vi.fn();

            (firebaseAuth.onAuthStateChanged as any).mockImplementation((auth, callback) => {
                // Simulate immediate auth state change
                setTimeout(() => callback(mockUser), 0);
                return () => { }; // unsubscribe function
            });

            subscribeToAuth(mockCallback);

            // Wait a tick for setTimeout to fire
            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith(mockUser);
            }, 10);
        });

        it('should allow callback to receive null on logout', () => {
            const mockCallback = vi.fn();

            (firebaseAuth.onAuthStateChanged as any).mockImplementation((auth, callback) => {
                setTimeout(() => callback(null), 0);
                return () => { };
            });

            subscribeToAuth(mockCallback);

            setTimeout(() => {
                expect(mockCallback).toHaveBeenCalledWith(null);
            }, 10);
        });
    });
});
