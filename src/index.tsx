import React from 'react';
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

const appTree = (
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

const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
const searchParams = new URLSearchParams(window.location.search);
const ssrRoute = rootElement.getAttribute('data-ssr-route');
const canHydrate =
    Boolean(ssrRoute) &&
    ssrRoute === normalizedPath &&
    !searchParams.get('rid') &&
    searchParams.get('mode') !== 'cms';

if (canHydrate) {
    ReactDOM.hydrateRoot(rootElement, appTree);
} else {
    const root = ReactDOM.createRoot(rootElement);
    root.render(appTree);
}

// Register Service Worker for offline support
// DISABLE Service Worker to prevent Index.html caching on /lili route
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
            registration.unregister().then(() => {
                console.log('🧹 Service Worker unregistered to fix routing issues.');
                // Force reload if we just unregistered (optional, but good for immediate fix)
                // window.location.reload();
            });
        }
    });
}
