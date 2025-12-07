import express from 'express';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

const port = 3001;

app.post('/api/create-payment', async (req, res) => {
    try {
        const { transaction_amount, description, payer } = req.body;

        const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
        if (!accessToken) {
            console.error('MERCADO_PAGO_ACCESS_TOKEN is missing');
            return res.status(500).json({ error: 'Server configuration error: Missing Token' });
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
        };

        console.log('Creating payment with data:', JSON.stringify(body, null, 2));

        const response = await payment.create({ body });

        console.log('Payment created:', response.id);

        res.status(200).json({
            id: response.id,
            status: response.status,
            qr_code: response.point_of_interaction?.transaction_data?.qr_code,
            qr_code_base64: response.point_of_interaction?.transaction_data?.qr_code_base64,
            ticket_url: response.point_of_interaction?.transaction_data?.ticket_url,
        });
    } catch (error) {
        console.error('Mercado Pago Error:', error);
        res.status(500).json({
            error: 'Payment creation failed',
            details: error.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Local API Server running at http://localhost:${port}`);
});
