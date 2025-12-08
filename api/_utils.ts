import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiter (no external dependencies)
// Map: IP -> { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiter simples em memória (por instância serverless)
 * Sem dependências externas
 */
export async function applyRateLimit(
    req: VercelRequest,
    res: VercelResponse,
    maxRequests = 10,
    windowSeconds = 60
): Promise<boolean> {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        const ip =
            (Array.isArray(forwarded) ? forwarded[0] : forwarded) ||
            req.socket?.remoteAddress ||
            'unknown';
        const now = Date.now();
        const windowMs = windowSeconds * 1000;

        const existing = rateLimitMap.get(ip);

        if (!existing || now > existing.resetTime) {
            // Nova janela ou janela expirada
            rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
            return true;
        }

        if (existing.count >= maxRequests) {
            const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
            res.status(429).json({ error: 'Too Many Requests', retryAfter });
            return false;
        }

        existing.count++;
        return true;
    } catch (error) {
        // Fail-open: se houver qualquer erro, permite a requisição
        console.warn('Rate limiter error, allowing request:', error);
        return true;
    }
}

export function applyCors(req: VercelRequest, res: VercelResponse) {
    // Whitelist de origens permitidas
    const allowedOrigins: (string | RegExp)[] = [
        // Produção Vercel
        'https://guia-digital-flatlili.vercel.app',
        // Produção - Domínio customizado (todas as variantes)
        'https://www.flatsintegracao.com.br',
        'https://flatsintegracao.com.br',
        'http://www.flatsintegracao.com.br',
        'http://flatsintegracao.com.br',
        // Ambientes Vercel (para preview deployments)
        /^https:\/\/guia-digital-flatlili-.*\.vercel\.app$/,
        /^https:\/\/guia-digital-flatlili\.vercel\.app$/,
        // Qualquer subdomínio de flatsintegracao.com.br
        /^https?:\/\/.*\.?flatsintegracao\.com\.br$/,
        // Desenvolvimento local
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
    ];

    const origin = req.headers.origin;

    // Verifica se a origem está na whitelist
    const isAllowed =
        origin &&
        allowedOrigins.some((allowed) => {
            if (typeof allowed === 'string') {
                return allowed === origin;
            } else {
                // RegExp para preview deployments
                return allowed.test(origin);
            }
        });

    if (isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    } else if (!origin) {
        // Se não há header Origin (requisições diretas), permitir por compatibilidade
        // mas sem credentials
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        // Origem não autorizada - não adiciona headers CORS
        // A requisição será bloqueada pelo browser
        console.warn(`CORS: Origem não autorizada tentou acessar API: ${origin}`);
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return true; // Handled
    }
    return false; // Not handled, proceed
}

export async function retry<T>(
    fn: () => Promise<T>,
    retries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return retry(fn, retries - 1, delayMs * 2); // Exponential backoff
    }
}

// Export alias for backward compatibility
export { applyCors as handleCors };
