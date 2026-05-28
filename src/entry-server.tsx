import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query';
import { ToastProvider } from './contexts/ToastContext';
import App from './App';

export function render(url: string, helmetContext: any) {
    return ReactDOMServer.renderToString(
        <React.StrictMode>
            <HelmetProvider context={helmetContext}>
                <QueryClientProvider client={queryClient}>
                    <ToastProvider>
                        <MemoryRouter initialEntries={[url]}>
                            <App />
                        </MemoryRouter>
                    </ToastProvider>
                </QueryClientProvider>
            </HelmetProvider>
        </React.StrictMode>
    );
}
