import type { VercelRequest, VercelResponse } from '@vercel/node';

const apiKey = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS Configuration
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
        console.error('CRITICAL: GEMINI_API_KEY is missing');
        return res.status(500).json({ error: 'Server Configuration Error: Missing API Key' });
    }

    try {
        const { prompt, model } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        const modelName = model || 'gemini-2.5-flash-lite';
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1, // Lower temperature for deterministic utility tasks
                }
            }),
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            console.error('Gemini API Error (Translate):', JSON.stringify(errorData));
            throw new Error(`Gemini API Error: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await apiResponse.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        return res.status(200).json({ text: responseText });

    } catch (error: any) {
        console.error('Translation API Error:', error);
        return res.status(500).json({ error: 'Failed to translate', details: error.message });
    }
}
