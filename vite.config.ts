/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
    typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            open: false,
            filename: 'stats.html',
            gzipSize: true,
            brotliSize: true,
        }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as unknown as any,
    define: {
        'process.env': {},
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',
        projects: [
            {
                extends: true,
                plugins: [
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({}),
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
            {
                test: {
                    name: 'unit',
                    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
                    exclude: ['**/*.stories.test.tsx', 'node_modules'],
                    environment: 'jsdom',
                    globals: true,
                    setupFiles: './src/test/setup.ts',
                },
            },
        ],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:3001',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',
                lili: 'lili.html',
            },
        },
        // Vite já faz code splitting automático excelente com lazy imports
        // Deixamos ele lidar com isso automaticamente
        chunkSizeWarningLimit: 500,
        sourcemap: false,
        minify: 'esbuild', // esbuild é mais rápido e já vem com Vite
    },
});
