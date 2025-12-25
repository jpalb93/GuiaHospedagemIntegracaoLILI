import { describe, it, expect } from 'vitest';
import { generateShortId, formatDateBR, onlyNumbers } from './helpers';

describe('helpers', () => {
    describe('generateShortId', () => {
        it('should generate string with default length 6', () => {
            const id = generateShortId();
            expect(id).toHaveLength(6);
            expect(typeof id).toBe('string');
        });

        it('should generate string with custom length', () => {
            const id = generateShortId(10);
            expect(id).toHaveLength(10);
        });

        it('should only contain uppercase alphanumeric chars', () => {
            const id = generateShortId(100);
            expect(id).toMatch(/^[A-Z0-9]+$/);
        });
    });

    describe('formatDateBR', () => {
        it('should format YYYY-MM-DD to DD/MM/YYYY', () => {
            expect(formatDateBR('2023-10-25')).toBe('25/10/2023');
        });

        it('should return empty string if input is empty', () => {
            expect(formatDateBR('')).toBe('');
        });
    });

    describe('onlyNumbers', () => {
        it('should remove non-numeric characters', () => {
            expect(onlyNumbers('123.456-78')).toBe('12345678');
            expect(onlyNumbers('(11) 99999-9999')).toBe('11999999999');
        });

        it('should return empty string if no numbers', () => {
            expect(onlyNumbers('abc')).toBe('');
        });
    });
});
