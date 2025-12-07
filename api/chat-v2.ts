import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

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
    // Configuração de CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

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

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const responseText = response.text();

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
