import type { VercelRequest, VercelResponse } from '@vercel/node';

const ttsKey = process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Configuração de CORS (Permitir acesso do seu front-end)
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

    if (!ttsKey) {
        console.error('CRITICAL: GOOGLE_TTS_API_KEY is missing');
        return res.status(500).json({ error: 'Server Configuration Error: Missing TTS API Key' });
    }

    try {
        const { text, lang = 'pt-BR' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Missing text' });
        }

        // Mapeamento de idioma para Voz Neural do Google
        // https://cloud.google.com/text-to-speech/docs/voices
        let languageCode = 'pt-BR';
        let name = 'pt-BR-Standard-D'; // Voz Masculina (Standard - Mais econômica)

        if (lang.startsWith('en')) {
            languageCode = 'en-US';
            name = 'en-US-Neural2-F'; // Voz Feminina Natural (Neural)
        } else if (lang.startsWith('es')) {
            languageCode = 'es-ES';
            name = 'es-ES-Neural2-A'; // Voz Feminina Natural (Neural)
        }

        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${ttsKey}`;

        const requestBody = {
            input: { text },
            voice: { languageCode, name },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Google TTS API Error: ${JSON.stringify(error)}`);
        }

        const data = await response.json();

        // Retorna o áudio em base64
        return res.status(200).json({ audioContent: data.audioContent });

    } catch (error: any) {
        console.error('TTS Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
