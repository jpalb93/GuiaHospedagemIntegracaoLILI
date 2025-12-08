import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessageToGemini, isApiConfigured } from './geminiService';

// Mock fetch
global.fetch = vi.fn();

describe('Gemini Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Configuration', () => {
        it('should be configured', () => {
            expect(isApiConfigured).toBe(true);
        });
    });

    describe('sendMessageToGemini - Success', () => {
        it('should send message and return response', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ text: 'AI response' }),
            });

            const result = await sendMessageToGemini('Hello', [], 'John');

            expect(result).toBe('AI response');
            expect(global.fetch).toHaveBeenCalledWith('/api/concierge-service', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'Hello',
                    history: [],
                    guestName: 'John',
                    systemInstruction: '',
                }),
            });
        });

        it('should include history in request', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ text: 'Response with context' }),
            });

            const history = [
                { role: 'user' as const, text: 'Previous message' },
                { role: 'model' as const, text: 'Previous response' },
            ];

            await sendMessageToGemini('New message', history, 'Jane');

            expect(global.fetch).toHaveBeenCalledWith(
                '/api/concierge-service',
                expect.objectContaining({
                    body: expect.stringContaining('"history"'),
                })
            );
        });

        it('should use custom system instruction', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({ text: 'Custom response' }),
            });

            await sendMessageToGemini('Question', [], 'User', 'Custom instruction');

            const callBody = JSON.parse((global.fetch as any).mock.calls[0][1].body);
            expect(callBody.systemInstruction).toBe('Custom instruction');
        });

        it('should return default message when API returns no text', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: async () => ({}),
            });

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toBe('Desculpe, não consegui gerar uma resposta.');
        });
    });

    describe('sendMessageToGemini - Errors', () => {
        it('should handle 404 error with helpful message', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 404,
                url: '/api/concierge-service',
                json: async () => ({}),
            });

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('404');
            expect(result).toContain('npx vercel dev');
        });

        it('should handle general HTTP errors', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 500,
                json: async () => ({ error: 'Internal server error' }),
            });

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('Desculpe, tive um problema técnico');
        });

        it('should handle malformed error response', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => {
                    throw new Error('Invalid JSON');
                },
            });

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('Desculpe, tive um problema técnico');
        });

        it('should handle network errors', async () => {
            (global.fetch as any).mockRejectedValue(new Error('Network failed'));

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('Desculpe, tive um problema técnico');
            expect(result).toContain('Network failed');
        });

        it('should extract error from JSON error message', async () => {
            (global.fetch as any).mockResolvedValue({
                ok: false,
                status: 400,
                json: async () => ({ error: 'Bad request', details: 'Invalid format' }),
            });

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('Erro do Sistema');
        });

        it('should handle unknown error types', async () => {
            (global.fetch as any).mockRejectedValue('String error');

            const result = await sendMessageToGemini('Test', [], 'User');

            expect(result).toContain('Erro desconhecido');
        });
    });
});
