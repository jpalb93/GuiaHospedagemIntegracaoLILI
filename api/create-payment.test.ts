import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from './create-payment';

// Mock Mercado Pago
vi.mock('mercadopago', () => ({
    MercadoPagoConfig: vi.fn(),
    Payment: vi.fn(() => ({
        create: vi.fn(),
    })),
}));

// Mock environment
const originalEnv = process.env;

describe('Create Payment API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env = { ...originalEnv, MERCADO_PAGO_ACCESS_TOKEN: 'test-token' };
    });

    afterEach(() => {
        process.env = originalEnv;
    });

    const validPayload = {
        propertyId: 'lili' as const,
        transaction_amount: 100.5,
        description: 'Test payment',
        payer: {
            email: 'test@example.com',
            first_name: 'John',
            last_name: 'Doe',
            identification: {
                number: '12345678901', // 11 digits CPF
            },
        },
    };

    describe('CORS Handling', () => {
        it('should handle OPTIONS preflight request', async () => {
            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'OPTIONS',
                headers: { origin: 'http://localhost:5173' },
            });

            const response = await handler(request);

            expect(response.status).toBe(200);
            expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
        });

        it('should allow whitelisted origins', async () => {
            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    origin: 'http://localhost:5173',
                },
                body: JSON.stringify(validPayload),
            });

            const { Payment } = await import('mercadopago');
            (Payment as any).mockImplementation(() => ({
                create: vi.fn().mockResolvedValue({
                    id: '123',
                    status: 'pending',
                    point_of_interaction: {
                        transaction_data: {
                            qr_code: 'qr123',
                            qr_code_base64: 'base64data',
                            ticket_url: 'http://ticket.url',
                        },
                    },
                }),
            }));

            const response = await handler(request);

            expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:5173');
        });

        it('should allow Vercel preview deployments', async () => {
            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    origin: 'https://guia-digital-flatlili-abc123.vercel.app',
                },
                body: JSON.stringify(validPayload),
            });

            const { Payment } = await import('mercadopago');
            (Payment as any).mockImplementation(() => ({
                create: vi.fn().mockResolvedValue({
                    id: '123',
                    status: 'pending',
                    point_of_interaction: {},
                }),
            }));

            const response = await handler(request);

            expect(response.headers.get('Access-Control-Allow-Origin')).toBe(
                'https://guia-digital-flatlili-abc123.vercel.app'
            );
        });
    });

    describe('Method Validation', () => {
        it('should reject non-POST requests', async () => {
            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'GET',
            });

            const response = await handler(request);

            expect(response.status).toBe(405);
            const data = await response.json();
            expect(data.error).toBe('Method not allowed');
        });
    });

    describe('Payload Validation', () => {
        it('should reject invalid transaction amount', async () => {
            const invalidPayload = {
                ...validPayload,
                transaction_amount: -50, // Negative
            };

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invalidPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid payment data');
        });

        it('should reject invalid CPF format', async () => {
            const invalidPayload = {
                ...validPayload,
                payer: {
                    ...validPayload.payer,
                    identification: {
                        number: '123', // Too short
                    },
                },
            };

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invalidPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(400);
            const data = await response.json();
            expect(data.error).toBe('Invalid payment data');
        });

        it('should reject invalid email', async () => {
            const invalidPayload = {
                ...validPayload,
                payer: {
                    ...validPayload.payer,
                    email: 'not-an-email',
                },
            };

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invalidPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(400);
        });

        it('should accept integracao propertyId', async () => {
            const integracaoPayload = {
                ...validPayload,
                propertyId: 'integracao' as const,
            };

            const { Payment } = await import('mercadopago');
            (Payment as any).mockImplementation(() => ({
                create: vi.fn().mockResolvedValue({
                    id: '456',
                    status: 'approved',
                    point_of_interaction: {},
                }),
            }));

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(integracaoPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(200);
        });
    });

    describe('Payment Creation', () => {
        it('should create payment successfully', async () => {
            const { Payment } = await import('mercadopago');
            const mockCreate = vi.fn().mockResolvedValue({
                id: '123456',
                status: 'pending',
                point_of_interaction: {
                    transaction_data: {
                        qr_code: 'qr-code-data',
                        qr_code_base64: 'base64-qr',
                        ticket_url: 'https://ticket.url',
                    },
                },
            });

            (Payment as any).mockImplementation(() => ({
                create: mockCreate,
            }));

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.id).toBe('123456');
            expect(data.status).toBe('pending');
            expect(data.qr_code).toBe('qr-code-data');
        });

        it('should handle Mercado Pago errors', async () => {
            const { Payment } = await import('mercadopago');
            (Payment as any).mockImplementation(() => ({
                create: vi.fn().mockRejectedValue(new Error('Mercado Pago failed')),
            }));

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(500);
            const data = await response.json();
            expect(data.error).toBe('Payment creation failed');
        });

        it('should not expose error details in production', async () => {
            process.env.NODE_ENV = 'production';

            const { Payment } = await import('mercadopago');
            (Payment as any).mockImplementation(() => ({
                create: vi.fn().mockRejectedValue(new Error('Sensitive error')),
            }));

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validPayload),
            });

            const response = await handler(request);
            const data = await response.json();

            expect(data.details).toBeUndefined();
        });
    });

    describe('Security', () => {
        it('should reject requests without access token', async () => {
            delete process.env.MERCADO_PAGO_ACCESS_TOKEN;

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(validPayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(500);
        });

        it('should limit transaction amount to 10000', async () => {
            const largePayload = {
                ...validPayload,
                transaction_amount: 10001,
            };

            const request = new Request('http://localhost:3000/api/create-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(largePayload),
            });

            const response = await handler(request);

            expect(response.status).toBe(400);
        });
    });
});
