/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ] as any,
  define: {
    'process.env': {}
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
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
  }
})