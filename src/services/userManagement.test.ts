import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserPermission, canUserAccessProperty } from './userManagement';
import * as firestore from 'firebase/firestore';
import { UserPermission } from '../types';

// Mock Firestore
vi.mock('firebase/firestore');

// Mock Firebase
vi.mock('./firebase', () => ({
    db: {},
}));

// Mock logger
vi.mock('../utils/logger', () => ({
    logger: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        log: vi.fn(),
    },
}));

describe('User Management Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUserPermission', () => {
        it('should fetch user permission from Firestore', async () => {
            const mockData = {
                role: 'admin',
                allowedProperties: ['lili'],
            };

            const mockDocSnap = {
                exists: () => true,
                data: () => mockData,
            };

            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

            const result = await getUserPermission('user@example.com');

            expect(result).toEqual({
                email: 'user@example.com',
                role: 'admin',
                allowedProperties: ['lili'],
            });
        });

        it('should normalize email to lowercase', async () => {
            const mockDocSnap = {
                exists: () => true,
                data: () => ({ role: 'admin', allowedProperties: ['lili'] }),
            };

            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

            const result = await getUserPermission('User@Example.COM');

            expect(result?.email).toBe('user@example.com');
            expect(firestore.doc).toHaveBeenCalledWith({}, 'admin_users', 'user@example.com');
        });

        it('should return null when user not found', async () => {
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

            const result = await getUserPermission('notfound@example.com');

            expect(result).toBeNull();
        });

        it('should log warning when user not found', async () => {
            const { logger } = await import('../utils/logger');
            const mockDocSnap = {
                exists: () => false,
            };

            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

            await getUserPermission('notfound@example.com');

            expect(logger.warn).toHaveBeenCalledWith(
                expect.stringContaining('notfound@example.com')
            );
        });

        it('should handle Firestore errors gracefully', async () => {
            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockRejectedValue(new Error('Firestore error'));

            const result = await getUserPermission('error@example.com');

            expect(result).toBeNull();
        });

        it('should handle super_admin role', async () => {
            const mockDocSnap = {
                exists: () => true,
                data: () => ({
                    role: 'super_admin',
                    allowedProperties: ['lili', 'integracao'],
                }),
            };

            (firestore.doc as any).mockReturnValue({});
            (firestore.getDoc as any).mockResolvedValue(mockDocSnap);

            const result = await getUserPermission('admin@example.com');

            expect(result?.role).toBe('super_admin');
        });
    });

    describe('canUserAccessProperty', () => {
        it('should allow super_admin to access any property', () => {
            const permission: UserPermission = {
                email: 'admin@example.com',
                role: 'super_admin',
                allowedProperties: [],
            };

            expect(canUserAccessProperty(permission, 'lili')).toBe(true);
            expect(canUserAccessProperty(permission, 'integracao')).toBe(true);
        });

        it('should allow access to allowed properties', () => {
            const permission: UserPermission = {
                email: 'user@example.com',
                role: 'admin',
                allowedProperties: ['lili'],
            };

            expect(canUserAccessProperty(permission, 'lili')).toBe(true);
        });

        it('should deny access to non-allowed properties', () => {
            const permission: UserPermission = {
                email: 'user@example.com',
                role: 'admin',
                allowedProperties: ['lili'],
            };

            expect(canUserAccessProperty(permission, 'integracao')).toBe(false);
        });

        it('should handle multiple allowed properties', () => {
            const permission: UserPermission = {
                email: 'user@example.com',
                role: 'admin',
                allowedProperties: ['lili', 'integracao'],
            };

            expect(canUserAccessProperty(permission, 'lili')).toBe(true);
            expect(canUserAccessProperty(permission, 'integracao')).toBe(true);
        });
    });
});
