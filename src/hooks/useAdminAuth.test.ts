import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAdminAuth } from './useAdminAuth';
import * as firebaseAuth from '../services/firebase';
import * as userManagement from '../services/userManagement';
import { UserPermission } from '../types';

// Mock Firebase Auth
vi.mock('../services/firebase', () => ({
    subscribeToAuth: vi.fn(),
    loginCMS: vi.fn(),
    logoutCMS: vi.fn(),
}));

// Mock User Management
vi.mock('../services/userManagement', () => ({
    getUserPermission: vi.fn(),
}));

describe('useAdminAuth Hook', () => {
    const mockUser = {
        uid: 'test-uid-123',
        email: 'admin@test.com',
    };

    const mockUserPermission: UserPermission = {
        email: 'admin@test.com',
        role: 'super_admin',
        allowedProperties: ['lili', 'integracao'],
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Authentication State', () => {
        it('should start with loading state', () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => () => { });

            const { result } = renderHook(() => useAdminAuth());

            expect(result.current.authLoading).toBe(true);
            expect(result.current.user).toBeNull();
            expect(result.current.userPermission).toBeNull();
        });

        it('should set user and permissions when authenticated', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation((callback: any) => {
                setTimeout(() => callback(mockUser), 0);
                return () => { };
            });

            (userManagement.getUserPermission as any).mockResolvedValue(mockUserPermission);

            const { result } = renderHook(() => useAdminAuth());

            await waitFor(() => {
                expect(result.current.authLoading).toBe(false);
            });

            expect(result.current.user).toEqual(mockUser);
            expect(result.current.userPermission).toEqual(mockUserPermission);
        });

        it('should clear user and permissions when logged out', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation((callback: any) => {
                setTimeout(() => callback(null), 0);
                return () => { };
            });

            const { result } = renderHook(() => useAdminAuth());

            await waitFor(() => {
                expect(result.current.authLoading).toBe(false);
            });

            expect(result.current.user).toBeNull();
            expect(result.current.userPermission).toBeNull();
        });

        it('should fetch user permissions when user logs in', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation((callback: any) => {
                setTimeout(() => callback(mockUser), 0);
                return () => { };
            });

            (userManagement.getUserPermission as any).mockResolvedValue(mockUserPermission);

            renderHook(() => useAdminAuth());

            await waitFor(() => {
                expect(userManagement.getUserPermission).toHaveBeenCalledWith('admin@test.com');
            });
        });
    });

    describe('Login', () => {
        it('should login successfully', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => () => { });
            (firebaseAuth.loginCMS as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminAuth());

            const mockEvent = { preventDefault: vi.fn() } as any;
            const loginResult = await result.current.login(mockEvent, 'test@test.com', 'password123');

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(firebaseAuth.loginCMS).toHaveBeenCalledWith('test@test.com', 'password123');
            expect(loginResult.success).toBe(true);
            expect(loginResult.error).toBeUndefined();
        });

        it('should handle login failure', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => () => { });
            (firebaseAuth.loginCMS as any).mockRejectedValue(new Error('Invalid credentials'));

            const { result } = renderHook(() => useAdminAuth());

            const mockEvent = { preventDefault: vi.fn() } as any;
            const loginResult = await result.current.login(mockEvent, 'wrong@test.com', 'wrongpass');

            expect(loginResult.success).toBe(false);
            expect(loginResult.error).toBe('Erro ao entrar. Verifique email e senha.');
        });

        it('should prevent default form submission on login', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => () => { });
            (firebaseAuth.loginCMS as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminAuth());

            const mockEvent = { preventDefault: vi.fn() } as any;
            await result.current.login(mockEvent, 'test@test.com', 'password');

            expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
        });
    });

    describe('Logout', () => {
        it('should logout successfully', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => () => { });
            (firebaseAuth.logoutCMS as any).mockResolvedValue(undefined);

            const { result } = renderHook(() => useAdminAuth());

            await result.current.logout();

            expect(firebaseAuth.logoutCMS).toHaveBeenCalledTimes(1);
        });
    });

    describe('Subscription Cleanup', () => {
        it('should unsubscribe on unmount', () => {
            const mockUnsubscribe = vi.fn();
            (firebaseAuth.subscribeToAuth as any).mockImplementation(() => mockUnsubscribe);

            const { unmount } = renderHook(() => useAdminAuth());

            unmount();

            expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
        });
    });

    describe('Edge Cases', () => {
        it('should handle user without email', async () => {
            const userWithoutEmail = { uid: 'test-uid', email: null };

            (firebaseAuth.subscribeToAuth as any).mockImplementation((callback: any) => {
                setTimeout(() => callback(userWithoutEmail), 0);
                return () => { };
            });

            const { result } = renderHook(() => useAdminAuth());

            await waitFor(() => {
                expect(result.current.authLoading).toBe(false);
            });

            expect(result.current.user).toEqual(userWithoutEmail);
            expect(result.current.userPermission).toBeNull();
            expect(userManagement.getUserPermission).not.toHaveBeenCalled();
        });

        it('should handle getUserPermission failure', async () => {
            (firebaseAuth.subscribeToAuth as any).mockImplementation((callback: any) => {
                setTimeout(() => callback(mockUser), 0);
                return () => { };
            });

            (userManagement.getUserPermission as any).mockRejectedValue(
                new Error('Permission fetch failed')
            );

            const { result } = renderHook(() => useAdminAuth());

            await waitFor(() => {
                expect(result.current.user).toEqual(mockUser);
            });
        });
    });
});
