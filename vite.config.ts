import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

function localVercelApiPlugin(): Plugin {
    return {
        name: 'local-vercel-api',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                if (!req.url?.startsWith('/api/')) return next();
                try {
                    const urlObj = new URL(req.url, 'http://localhost:3000');
                    const apiName = urlObj.pathname.replace(/^\/api\//, '').replace(/\/$/, '');
                    const query: Record<string, string> = {};
                    urlObj.searchParams.forEach((v, k) => {
                        query[k] = v;
                    });
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vercelReq = req as any;
                    vercelReq.query = query;

                    if (req.method === 'POST' && !vercelReq.body) {
                        const chunks: Buffer[] = [];
                        for await (const chunk of req) {
                            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
                        }
                        const rawBody = Buffer.concat(chunks).toString('utf-8');
                        try {
                            vercelReq.body = rawBody ? JSON.parse(rawBody) : {};
                        } catch {
                            vercelReq.body = rawBody;
                        }
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vercelRes = res as any;
                    vercelRes.status = (code: number) => {
                        res.statusCode = code;
                        return vercelRes;
                    };
                    vercelRes.json = (data: unknown) => {
                        if (!res.headersSent) {
                            res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        }
                        res.end(JSON.stringify(data));
                        return vercelRes;
                    };

                    const mod = await server.ssrLoadModule(`/api/${apiName}.ts`);
                    if (typeof mod.default === 'function') {
                        await mod.default(vercelReq, vercelRes);
                        return;
                    }
                    next();
                } catch (err) {
                    console.error('[local-vercel-api] Error executing local API:', err);
                    next();
                }
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [
        localVercelApiPlugin(),
        react(),
        /* SSR Prerendering handled via custom script */
        visualizer({
            open: false,
            filename: 'bundle-analysis.html',
            gzipSize: true,
            brotliSize: true,
        }),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
        }),
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
        cors: true,
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-helmet-async',
            'lucide-react',
            'gsap',
            'framer-motion',
            'clsx',
            'tailwind-merge',
        ],
    },

    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                lili: 'lili.html',
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // Agrupar bibliotecas pesadas de animação
                        if (id.includes('gsap') || id.includes('framer-motion')) {
                            return 'animations';
                        }
                    }
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'esbuild',
    },
    esbuild: {
        drop: command === 'build' ? ['console', 'debugger'] : [],
    },
    ssr: {
        noExternal: ['react-helmet-async'],
    },
}));
