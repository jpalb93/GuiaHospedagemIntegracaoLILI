import { kv } from '@vercel/kv';
import { RateLimiter } from "limiter";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// LEGACY: Map to store limiters for each IP (fallback se KV não estiver configurado)
// Note: In serverless, this is in-memory and per-instance. 
const limiters = new Map<string, RateLimiter>();

/**
 * Rate limiter distribuído usando Vercel KV (Redis)
 * Falls back to in-memory limiting if KV is not configured
 */
export async function applyRateLimit(
    req: VercelRequest,
    res: VercelResponse,
    tokensPerInterval = 10,
    intervalSeconds = 60
): Promise<boolean> {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded) || req.socket.remoteAddress || 'unknown';

    try {
        // Tenta usar Vercel KV (distribuído)
        const key = `rate_limit:${ip}`;

        // Incrementa contador
        const current = await kv.incr(key);

        if (current === 1) {
            // Primeira requisição neste período, define expiração
            await kv.expire(key, intervalSeconds);
        }

        if (current > tokensPerInterval) {
            res.status(429).json({
                error: 'Too Many Requests',
                retryAfter: intervalSeconds
            });
            return false;
        }

        return true;
    } catch (error) {
        // Fallback para rate limiter em memória se KV não estiver configurado
        console.warn('Vercel KV não disponível, usando rate limiter em memória:', error);

        const interval: "hour" | "min" | "second" = intervalSeconds >= 3600 ? "hour" :
            intervalSeconds >= 60 ? "min" : "second";

        if (!limiters.has(ip)) {
            limiters.set(ip, new RateLimiter({ tokensPerInterval, interval }));
        }

        const limiter = limiters.get(ip)!;
        const hasToken = limiter.tryRemoveTokens(1);

        if (!hasToken) {
            res.status(429).json({ error: 'Too Many Requests' });
            return false;
        }
        return true;
    }
}

export function applyCors(req: VercelRequest, res: VercelResponse) {
    // HOTFIX: Allow all origins to prevent production outage
    // In the future, we should dynamically allow all *.vercel.app subdomains or use a strict list
    const origin = req.headers.origin;
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return retry(fn, retries - 1, delayMs * 2); // Exponential backoff
    }
}
