import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
    // Security Note: In a production environment, you should NOT expose your API key like this.
    // You should proxy the WebSocket connection through your own server.
    // This is a Proof of Concept (PoC) implementation.

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key not configured on server.' });
    }

    // Optional: Add basic referer check or auth check here if possible

    return res.status(200).json({ key: apiKey });
}
