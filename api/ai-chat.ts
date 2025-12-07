import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { applyCors, applyRateLimit, retry } from './_utils';

const apiKey = process.env.GEMINI_API_KEY;

// Schema de Validação
const ChatSchema = z.object({
    message: z.string().min(1, 'Mensagem não pode ser vazia').max(1000, 'Mensagem muito longa'),
    history: z
        .array(
            z.object({
                role: z.string(),
                text: z.string(),
            })
        )
        .optional()
        .default([]),
    guestName: z.string().optional().default('Hóspede'),
    systemInstruction: z.string().optional().default(''),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // 1. CORS
    if (applyCors(req, res)) return;

    // 2. Rate Limit (5 requests per minute per IP for Chat to save costs)
    const rateLimitPassed = await applyRateLimit(req, res, 5, 60); // 5 req/min
    if (!rateLimitPassed) return;

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!apiKey) {
        return res
            .status(500)
            .json({ error: 'Erro de Configuração: API Key não encontrada no servidor.' });
    }

    try {
        // Validação com Zod
        const { message, history, guestName, systemInstruction } = ChatSchema.parse(req.body);

        // Inicializa o SDK antigo (Estável)
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            systemInstruction: `${systemInstruction}\nO nome do hóspede atual é ${guestName}.`,
        });

        // Converte histórico para o formato do SDK antigo
        let chatHistory = history.map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }],
        }));

        // CORREÇÃO: O SDK exige que a primeira mensagem do histórico seja do usuário
        // Se a primeira for 'model' (ex: saudação inicial), removemos ela.
        if (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory = chatHistory.slice(1);
        }

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
            },
        });

        // Implementando Retry + Timeout
        const responseText = await retry(
            async () => {
                // Timeout de 15 segundos para a IA responder
                const timeoutPromise = new Promise<never>((_, reject) =>
                    setTimeout(
                        () => reject(new Error('Timeout: IA demorou muito para responder')),
                        15000
                    )
                );

                const resultPromise = chat.sendMessage(message);

                const result = await Promise.race([resultPromise, timeoutPromise]);
                const response = await result.response;
                return response.text();
            },
            2,
            1000
        ); // 2 retries (total 3 attempts), start with 1s delay

        return res.status(200).json({ text: responseText });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Dados inválidos', details: error.issues });
        }
        console.error('Erro na Vercel Function:', error);
        return res
            .status(500)
            .json({ error: 'Erro interno na IA', details: error.message || String(error) });
    }
}
