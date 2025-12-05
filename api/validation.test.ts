import { describe, it, expect } from 'vitest';

/**
 * Testes para validação de schemas Zod usados nas APIs
 */

import { z } from 'zod';

// Schema de validação do get-guest-config API
const QuerySchema = z.object({
    rid: z.string().min(1, "Missing reservation ID (rid)")
});

// Schema de validação para reserva (usado em APIs de admin)
const ReservationSchema = z.object({
    guestName: z.string().min(1, "Nome do hóspede obrigatório"),
    guestPhone: z.string().optional(),
    checkInDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)"),
    checkoutDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido (YYYY-MM-DD)"),
    propertyId: z.enum(['lili', 'integracao']).optional().default('lili'),
    flatNumber: z.string().optional(),
    notes: z.string().optional()
});

// Schema de validação para mensagem do AI Chat
const ChatMessageSchema = z.object({
    message: z.string().min(1, "Mensagem não pode ser vazia").max(500, "Mensagem muito longa"),
    propertyId: z.string().optional()
});

describe('QuerySchema (get-guest-config)', () => {
    it('should validate valid reservation ID', () => {
        const result = QuerySchema.safeParse({ rid: 'abc123' });
        expect(result.success).toBe(true);
    });

    it('should reject empty reservation ID', () => {
        const result = QuerySchema.safeParse({ rid: '' });
        expect(result.success).toBe(false);
    });

    it('should reject missing rid', () => {
        const result = QuerySchema.safeParse({});
        expect(result.success).toBe(false);
    });

    it('should accept short IDs', () => {
        const result = QuerySchema.safeParse({ rid: 'ABC123' });
        expect(result.success).toBe(true);
    });

    it('should accept long document IDs', () => {
        const result = QuerySchema.safeParse({ rid: 'abc123def456ghi789jkl' });
        expect(result.success).toBe(true);
    });
});

describe('ReservationSchema', () => {
    const validReservation = {
        guestName: 'João Silva',
        checkInDate: '2024-01-10',
        checkoutDate: '2024-01-15'
    };

    it('should validate complete reservation', () => {
        const result = ReservationSchema.safeParse(validReservation);
        expect(result.success).toBe(true);
    });

    it('should reject empty guest name', () => {
        const result = ReservationSchema.safeParse({
            ...validReservation,
            guestName: ''
        });
        expect(result.success).toBe(false);
    });

    it('should reject invalid date format', () => {
        const result = ReservationSchema.safeParse({
            ...validReservation,
            checkInDate: '10/01/2024' // Formato errado
        });
        expect(result.success).toBe(false);
    });

    it('should accept optional fields', () => {
        const result = ReservationSchema.safeParse({
            ...validReservation,
            guestPhone: '87999999999',
            notes: 'Hóspede VIP'
        });
        expect(result.success).toBe(true);
    });

    it('should default propertyId to lili', () => {
        const result = ReservationSchema.safeParse(validReservation);
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.propertyId).toBe('lili');
        }
    });

    it('should accept integracao propertyId', () => {
        const result = ReservationSchema.safeParse({
            ...validReservation,
            propertyId: 'integracao'
        });
        expect(result.success).toBe(true);
    });

    it('should reject invalid propertyId', () => {
        const result = ReservationSchema.safeParse({
            ...validReservation,
            propertyId: 'invalid'
        });
        expect(result.success).toBe(false);
    });
});

describe('ChatMessageSchema', () => {
    it('should validate normal message', () => {
        const result = ChatMessageSchema.safeParse({ message: 'Olá, preciso de ajuda' });
        expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
        const result = ChatMessageSchema.safeParse({ message: '' });
        expect(result.success).toBe(false);
    });

    it('should reject message over 500 chars', () => {
        const longMessage = 'a'.repeat(501);
        const result = ChatMessageSchema.safeParse({ message: longMessage });
        expect(result.success).toBe(false);
    });

    it('should accept message with propertyId', () => {
        const result = ChatMessageSchema.safeParse({
            message: 'Qual o código do Wi-Fi?',
            propertyId: 'lili'
        });
        expect(result.success).toBe(true);
    });
});

describe('Date Validation Patterns', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    it('should match valid ISO date', () => {
        expect(datePattern.test('2024-01-15')).toBe(true);
        expect(datePattern.test('2024-12-31')).toBe(true);
    });

    it('should reject invalid formats', () => {
        expect(datePattern.test('15/01/2024')).toBe(false);
        expect(datePattern.test('2024/01/15')).toBe(false);
        expect(datePattern.test('01-15-2024')).toBe(false);
        expect(datePattern.test('2024-1-15')).toBe(false);
    });
});
