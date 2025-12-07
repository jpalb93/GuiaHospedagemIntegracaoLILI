import { MercadoPagoConfig, Payment } from 'mercadopago';
import { z } from 'zod';

export const config = {
    runtime: 'edge',
};

// Whitelist de origens permitidas (sincronizada com _utils.ts)
const ALLOWED_ORIGINS = [
    'https://guia-digital-flatlili.vercel.app',
    'https://www.flatsintegracao.com.br',
    'https://flatsintegracao.com.br',
    'http://www.flatsintegracao.com.br',
    'http://flatsintegracao.com.br',
    'http://localhost:5173',
    'http://localhost:3000',
];

// Regex patterns para domínios dinâmicos
const ALLOWED_PATTERNS = [
    /^https:\/\/guia-digital-flatlili-.*\.vercel\.app$/,
    /^https?:\/\/.*\.?flatsintegracao\.com\.br$/,
];

// Schema de validação do payload
const PaymentSchema = z.object({
    transaction_amount: z.number().positive().max(10000), // Limite de R$10.000
    description: z.string().min(1).max(200),
    payer: z.object({
        email: z.string().email(),
        first_name: z.string().min(1),
        last_name: z.string().min(1),
        identification: z.object({
            number: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
        }),
    }),
});

function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Verifica se a origem está na whitelist (strings ou patterns)
    const isAllowed = origin && (
        ALLOWED_ORIGINS.includes(origin) ||
        ALLOWED_PATTERNS.some(pattern => pattern.test(origin))
    );

    if (isAllowed) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Credentials'] = 'true';
    } else if (!origin) {
        // Requisições sem origin (ex: chamadas server-side)
        headers['Access-Control-Allow-Origin'] = '*';
    }

    return headers;
}

export default async function handler(request: Request) {
    const origin = request.headers.get('origin');
    const corsHeaders = getCorsHeaders(origin);

    // Preflight CORS
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders,
        });
    }

    // Verifica origem (bloqueia requisições de origens não permitidas)
    if (origin && !ALLOWED_ORIGINS.includes(origin) && !origin.match(/^https:\/\/guia-digital-flatlili-.*\.vercel\.app$/)) {
        return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
            status: 403,
            headers: corsHeaders,
        });
    }

    try {
        const rawBody = await request.json();

        // Validação com Zod
        const validationResult = PaymentSchema.safeParse(rawBody);
        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Invalid payment data',
                details: validationResult.error.issues
            }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const { transaction_amount, description, payer } = validationResult.data;

        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured');
        }

        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const payment = new Payment(client);

        const body = {
            transaction_amount,
            description,
            payment_method_id: 'pix',
            payer: {
                email: payer.email,
                first_name: payer.first_name,
                last_name: payer.last_name,
                identification: {
                    type: 'CPF',
                    number: payer.identification.number,
                },
            },
            notification_url: process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}/api/webhook-payment`
                : undefined,
        };

        const response = await payment.create({ body });

        return new Response(JSON.stringify({
            id: response.id,
            status: response.status,
            qr_code: response.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
            ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
        }), {
            status: 200,
            headers: corsHeaders,
        });

    } catch (error: unknown) {
        console.error('Mercado Pago Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return new Response(JSON.stringify({
            error: 'Payment creation failed',
            details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }), {
            status: 500,
            headers: corsHeaders,
        });
    }
}

