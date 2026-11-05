import { describe, it, expect } from 'vitest';
import { generateShortId, formatDateBR, onlyNumbers, getFirstName } from './helpers';

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

    describe('getFirstName', () => {
        it('should extract only the first name from full names', () => {
            expect(getFirstName('João Victor')).toBe('João');
            expect(getFirstName('Maria Silva Santos')).toBe('Maria');
            expect(getFirstName('Carlos')).toBe('Carlos');
        });

        it('should handle leading/trailing and multiple whitespace', () => {
            expect(getFirstName('  Ana   Paula  ')).toBe('Ana');
        });

        it('should return fallback if name is empty, null or undefined', () => {
            expect(getFirstName('', 'Visitante')).toBe('Visitante');
            expect(getFirstName(null, 'Hóspede')).toBe('Hóspede');
            expect(getFirstName(undefined, 'Convidado')).toBe('Convidado');
            expect(getFirstName('   ', 'Visitante')).toBe('Visitante');
            expect(getFirstName('')).toBe('');
        });
    });
});
