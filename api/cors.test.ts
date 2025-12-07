// Teste simples para validar a lógica CORS
import { describe, test, expect, beforeEach, vi, type Mock } from 'vitest';
import { applyCors } from './_utils';

describe('CORS Whitelist', () => {
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        mockReq = {
            headers: {},
            method: 'GET',
        };
        mockRes = {
            setHeader: vi.fn(),
            status: vi.fn().mockReturnThis(),
            end: vi.fn(),
        };
    });

    test('should allow production domain guia-digital-flatlili.vercel.app', () => {
        mockReq.headers.origin = 'https://guia-digital-flatlili.vercel.app';
        applyCors(mockReq, mockRes);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'https://guia-digital-flatlili.vercel.app'
        );
        expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    });

    test('should allow production domain flatsintegracao.com.br with www', () => {
        mockReq.headers.origin = 'https://www.flatsintegracao.com.br';
        applyCors(mockReq, mockRes);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'https://www.flatsintegracao.com.br'
        );
    });

    test('should allow preview deployments matching pattern', () => {
        mockReq.headers.origin = 'https://guia-digital-flatlili-abc123xyz.vercel.app';
        applyCors(mockReq, mockRes);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'https://guia-digital-flatlili-abc123xyz.vercel.app'
        );
    });

    test('should allow localhost for development', () => {
        mockReq.headers.origin = 'http://localhost:5173';
        applyCors(mockReq, mockRes);

        expect(mockRes.setHeader).toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'http://localhost:5173'
        );
    });

    test('should NOT allow unauthorized origin', () => {
        mockReq.headers.origin = 'https://malicious-site.com';
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        applyCors(mockReq, mockRes);

        // Não deve definir Access-Control-Allow-Origin para origem não autorizada
        expect(mockRes.setHeader).not.toHaveBeenCalledWith(
            'Access-Control-Allow-Origin',
            'https://malicious-site.com'
        );

        // Deve logar warning
        expect(consoleWarnSpy).toHaveBeenCalledWith(
            expect.stringContaining('CORS: Origem não autorizada')
        );

        consoleWarnSpy.mockRestore();
    });

    test('should allow requests without Origin header (direct API calls)', () => {
        // Sem definir origin
        applyCors(mockReq, mockRes);

        expect(mockRes.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    });
});
