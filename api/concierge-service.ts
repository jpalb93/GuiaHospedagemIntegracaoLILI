import type { VercelRequest, VercelResponse } from '@vercel/node';

const apiKey = process.env.GEMINI_API_KEY;

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

    if (req.method === 'GET') {
        return res.status(200).json({ status: 'Online', message: 'Concierge Service is ready' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    if (!apiKey) {
        console.error("CRITICAL: GEMINI_API_KEY is missing in environment variables");
        return res.status(500).json({ error: "Erro de Configuração: API Key não encontrada no servidor." });
    }

    try {
        const { message, history, guestName, systemInstruction } = req.body;

        // Monta o prompt do sistema
        const finalSystemInstruction = {
            parts: [{ text: `${systemInstruction || ''}\nO nome do hóspede atual é ${guestName || 'Hóspede'}.` }]
        };

        // Prepara o histórico
        let contents: { role: string; parts: { text: string }[] }[] = [];

        // Adiciona histórico anterior
        if (Array.isArray(history)) {
            contents = history.map((h: any) => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
            }));
        }

        // Remove primeira mensagem se for do modelo (regra da API)
        if (contents.length > 0 && contents[0].role === 'model') {
            contents.shift();
        }

        // Adiciona a mensagem atual do usuário
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // Chamada direta via fetch (sem SDK)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const apiResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents,
                systemInstruction: finalSystemInstruction,
                generationConfig: {
                    temperature: 0.7
                }
            })
        });

        if (!apiResponse.ok) {
            const errorData = await apiResponse.json().catch(() => ({}));
            console.error("Gemini API Error:", JSON.stringify(errorData));
            throw new Error(`Gemini API Error: ${apiResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await apiResponse.json();

        // Extrai o texto da resposta
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui gerar uma resposta (sem texto).";

        return res.status(200).json({ text: responseText });

    } catch (error: any) {
        console.error("Erro na Vercel Function (Native Fetch):", error);
        return res.status(500).json({ error: "Erro interno na IA", details: error.message || String(error) });
    }
}
