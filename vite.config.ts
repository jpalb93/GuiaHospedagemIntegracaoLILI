import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [
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
                        
                        // Bibliotecas de terceiros menores ficam no chunk principal ou vendor automático
                        // Removido o chunk manual de lucide-react para permitir tree-shaking eficiente
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
