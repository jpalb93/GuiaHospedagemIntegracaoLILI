import { MercadoPagoConfig, Payment } from 'mercadopago';

export const config = {
    runtime: 'edge',
};

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { transaction_amount, description, payer } = await request.json();

        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!accessToken) {
            throw new Error('MERCADO_PAGO_ACCESS_TOKEN not configured');
        }

        const client = new MercadoPagoConfig({ accessToken: accessToken });
        const payment = new Payment(client);

        const body = {
            transaction_amount: Number(transaction_amount),
            description: description,
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
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Mercado Pago Error:', error);
        return new Response(JSON.stringify({
            error: 'Payment creation failed',
            details: error.message
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
