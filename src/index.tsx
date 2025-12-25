import React from 'react';

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    import('react-scan').then(({ scan }) => {
        scan({
            enabled: true,
        });
    });
}

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error('Could not find root element to mount to');
}

import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { ToastProvider } from './contexts/ToastContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';

const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                    <Analytics />
                </ToastProvider>
            </QueryClientProvider>
        </HelmetProvider>
    </React.StrictMode>
);

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch((error) => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}
