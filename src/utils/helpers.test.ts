import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateShortId, formatDateBR, onlyNumbers } from './helpers';

describe('Utils - Helpers', () => {
    describe('generateShortId', () => {
        it('should generate ID with default length of 6', () => {
            const id = generateShortId();
            expect(id).toHaveLength(6);
        });

        it('should generate ID with custom length', () => {
            const id = generateShortId(10);
            expect(id).toHaveLength(10);
        });

        it('should only contain uppercase letters and numbers', () => {
            const id = generateShortId(20);
            expect(id).toMatch(/^[A-Z0-9]+$/);
        });

        it('should generate different IDs on subsequent calls', () => {
            const id1 = generateShortId();
            const id2 = generateShortId();
            expect(id1).not.toBe(id2);
        });

        it('should handle length of 1', () => {
            const id = generateShortId(1);
            expect(id).toHaveLength(1);
            expect(id).toMatch(/^[A-Z0-9]$/);
        });

        it('should be within valid character set', () => {
            const validChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const id = generateShortId(100);

            for (const char of id) {
                expect(validChars).toContain(char);
            }
        });
    });

    describe('formatDateBR', () => {
        it('should format YYYY-MM-DD to DD/MM/YYYY', () => {
            expect(formatDateBR('2024-01-15')).toBe('15/01/2024');
        });

        it('should handle different dates correctly', () => {
            expect(formatDateBR('2023-12-25')).toBe('25/12/2023');
            expect(formatDateBR('2024-06-30')).toBe('30/06/2024');
            expect(formatDateBR('2025-02-14')).toBe('14/02/2025');
        });

        it('should return empty string for empty input', () => {
            expect(formatDateBR('')).toBe('');
        });

        it('should handle single-digit months and days', () => {
            expect(formatDateBR('2024-01-05')).toBe('05/01/2024');
            expect(formatDateBR('2024-03-09')).toBe('09/03/2024');
        });

        it('should handle leap year dates', () => {
            expect(formatDateBR('2024-02-29')).toBe('29/02/2024');
        });
    });

    describe('onlyNumbers', () => {
        it('should remove all non-numeric characters', () => {
            expect(onlyNumbers('abc123def456')).toBe('123456');
        });

        it('should handle phone numbers', () => {
            expect(onlyNumbers('(11) 98765-4321')).toBe('11987654321');
            expect(onlyNumbers('+55 11 9 8765-4321')).toBe('5511987654321');
        });

        it('should handle empty string', () => {
            expect(onlyNumbers('')).toBe('');
        });

        it('should handle string with no numbers', () => {
            expect(onlyNumbers('abcdef')).toBe('');
        });

        it('should handle string with only numbers', () => {
            expect(onlyNumbers('123456')).toBe('123456');
        });

        it('should remove special characters', () => {
            expect(onlyNumbers('!@#$123%^&*456')).toBe('123456');
        });

        it('should handle mixed content', () => {
            expect(onlyNumbers('User123-ID-456')).toBe('123456');
        });

        it('should handle spaces', () => {
            expect(onlyNumbers('1 2 3 4 5 6')).toBe('123456');
        });
    });
});
