import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'POST') {
        return res.status(200).json({ message: 'POST works', body: req.body });
    }
    return res.status(200).json({ message: 'GET works' });
}
