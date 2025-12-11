import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';

import { AppMode, GuestConfig } from './types';
import { Button, Input } from './components/ui';
import { logger } from './utils/logger';
import {
    CalendarX,
    MessageCircle,
    AlertTriangle,
    LogOut,
    RefreshCw,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

import { HOST_PHONE, USE_OFFICIAL_TIME, fetchOfficialTime } from './constants';
import { fetchGuestConfig } from './services/guest';
import ErrorBoundary from './components/ErrorBoundary';
import { GuestSkeleton, AdminSkeleton, LandingSkeleton } from './components/LoadingSkeletons';
import ModernLoadingScreen from './components/ModernLoadingScreen';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LanguageProvider } from './hooks/useLanguage';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageTransition } from './components/ui/PageTransition';

// --- LAZY LOADING (CODE SPLITTING) ---
const AdminDashboard = lazy(
    () => import(/* webpackChunkName: "admin" */ './components/admin/AdminDashboard')
);
const GuestView = lazy(() => import(/* webpackChunkName: "guest" */ './components/GuestView'));

const LandingPageLili = lazy(
    () => import(/* webpackChunkName: "landing-lili" */ './components/LandingLili')
);
const LandingFlatsIntegracao = lazy(
    () => import(/* webpackChunkName: "landing-flats" */ './components/LandingFlats')
);

// --- FUNÇÃO DE SEGURANÇA: REMOVIDA (Agora é Server-Side) ---

const App: React.FC = () => {
    // --- CAPACITOR ANDROID BACK BUTTON ---
    useEffect(() => {
        let backListener: PluginListenerHandle | undefined;
        const setupBack = async () => {
            try {
                const isNative = Capacitor.isNativePlatform();
                if (isNative) {
                    backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                        if (canGoBack) {
                            window.history.back();
                        } else {
                            CapacitorApp.exitApp();
                        }
                    });
                }
            } catch (e) {
                logger.warn('Capacitor App plugin error', e);
            }
        };
        setupBack();

        return () => {
            if (backListener) backListener.remove();
        };
    }, []);

    // Detect Native Platform using Capacitor Global or Plugin
    const isNative = typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform();

    // --- ESTADO DO APP ---
    const [appState, setAppState] = useState<{
        mode:
        | AppMode
        | 'LANDING'
        | 'LILI_LANDING'
        | 'EXPIRED'
        | 'BLOCKED'
        | 'LOADING'
        | 'RECONNECTING';
        config: GuestConfig;
    }>(() => {
        // SE FOR APP NATIVO -> JÁ INICIA COMO ADMIN
        if (isNative) {
            return { mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } };
        }
        return { mode: 'LOADING', config: { guestName: '', lockCode: '' } };
    });

    const [showManualLogin, setShowManualLogin] = useState(false);
    const [manualInput, setManualInput] = useState('');

    // --- MONITORAMENTO (AGORA VIA API) ---
    useEffect(() => {
        const initApp = async () => {
            // Inicia o timer de delay mínimo (2 segundos) para a animação de loading
            const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 2000));

            const path = window.location.pathname;
            const params = new URLSearchParams(window.location.search);
            let reservationId = params.get('rid');

            const isCMS = path === '/cms' || params.get('mode') === 'cms';
            const isLiliPage = path === '/lili' || path === '/flat-lili';

            if (isCMS) {
                await minLoadingTime;
                setAppState({ mode: AppMode.CMS, config: { guestName: '', lockCode: '' } });
                return;
            }

            // SE FOR APP NATIVO ->GARANTE MODO ADMIN
            if (isNative) {
                setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
                return;
            }

            // ADMIN ROUTE SECURITY:
            if (path === '/admin') {
                await minLoadingTime;
                setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
                return;
            }

            if (isLiliPage) {
                await minLoadingTime;
                setAppState({ mode: 'LILI_LANDING', config: { guestName: '', lockCode: '' } });
                return;
            }

            if (!reservationId) {
                // SHORT CODE SUPPORT: /ABC1234
                if (path.length > 1 && !['/admin', '/cms', '/lili', '/flat-lili'].includes(path)) {
                    const potentialCode = path.substring(1);
                    // Basic validation: 6 chars alphanumeric
                    if (/^[A-Z0-9]{6}$/i.test(potentialCode)) {
                        reservationId = potentialCode;
                    }
                }
            }

            if (!reservationId) {
                // Prevent auto-redirect on root path (Landing Page)
                if (path !== '/') {
                    reservationId = localStorage.getItem('flat_lili_last_rid');
                }
            } else {
                localStorage.setItem('flat_lili_last_rid', reservationId);
            }

            if (reservationId) {
                const fetchWithRetry = async () => {
                    try {
                        const [safeConfig] = await Promise.all([
                            fetchGuestConfig(reservationId!),
                            minLoadingTime,
                        ]);

                        if (!safeConfig) {
                            // 404 - Não encontrado (Definitivo)
                            localStorage.removeItem('flat_lili_last_rid');
                            setAppState({
                                mode: 'BLOCKED',
                                config: { guestName: '', lockCode: '' },
                            });
                            return;
                        }

                        // Verificação de Expiração
                        if (safeConfig.checkoutDate) {
                            let now = new Date();
                            if (USE_OFFICIAL_TIME) {
                                try {
                                    now = await fetchOfficialTime();
                                } catch (_e) { }
                            }
                            const [year, month, day] = safeConfig.checkoutDate
                                .split('-')
                                .map(Number);
                            const expirationDate = new Date(year, month - 1, day);
                            expirationDate.setDate(expirationDate.getDate() + 1); // Allow access for 1 day after checkout
                            expirationDate.setHours(23, 59, 59, 999);

                            if (now > expirationDate) {
                                localStorage.removeItem('flat_lili_last_rid');
                                setAppState({
                                    mode: 'EXPIRED',
                                    config: { guestName: '', lockCode: '' },
                                });
                                return;
                            }
                        }

                        // Sucesso!
                        setAppState({ mode: AppMode.GUEST, config: safeConfig });

                        // Limpeza de URL
                        if (reservationId && window.history.replaceState) {
                            const newUrl = window.location.pathname;
                            window.history.replaceState({}, '', newUrl);
                        }
                    } catch (error) {
                        // Erro de Rede (Temporário)
                        logger.warn('Erro de conexão. Entrando em modo de reconexão...', error);
                        setAppState({
                            mode: 'RECONNECTING',
                            config: { guestName: '', lockCode: '' },
                        });

                        // Tenta novamente em 2 segundos
                        setTimeout(fetchWithRetry, 2000);
                    }
                };

                fetchWithRetry();
                return;
            }

            await minLoadingTime;
            setAppState({ mode: 'LANDING', config: { guestName: '', lockCode: '' } });
        };

        initApp();
    }, []);

    const handleResetApp = () => {
        localStorage.removeItem('flat_lili_last_rid');
        window.location.href = '/';
    };

    const handleManualSubmit = async () => {
        if (!manualInput.trim()) return;
        let rid = manualInput.trim();

        try {
            // 1. Tenta extrair de URLs completas
            if (rid.includes('http') || rid.includes('.com') || rid.includes('.app')) {
                const urlString = rid.startsWith('http') ? rid : `https://${rid}`;
                const urlObj = new URL(urlString);
                const idParam = urlObj.searchParams.get('rid');
                if (idParam) {
                    rid = idParam;
                } else {
                    const textSegments = urlObj.pathname
                        .split('/')
                        .filter((s) => s && s.length > 0);
                    if (textSegments.length > 0) {
                        const potentialCode = textSegments[textSegments.length - 1];
                        if (/^[a-zA-Z0-9]{3,20}$/.test(potentialCode)) rid = potentialCode;
                    }
                }
            }
        } catch (e) {
            logger.warn('Erro ao parsear input manual', e);
        }

        setAppState({ mode: 'LOADING', config: { guestName: '', lockCode: '' } });

        try {
            const config = await fetchGuestConfig(rid);
            if (config) {
                localStorage.setItem('flat_lili_last_rid', rid);
                setAppState({ mode: AppMode.GUEST, config });
                setShowManualLogin(false);
            } else {
                setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
            }
        } catch (error) {
            console.error('Erro manual:', error);
            setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
        }
    };

    // --- RENDERIZAÇÃO ---

    // 1. Tela de Carregamento
    if (appState.mode === 'LOADING') {
        let loadingVariant: 'guest' | 'admin' | 'landing' = 'landing';
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        const hasStoredRid =
            typeof localStorage !== 'undefined' && !!localStorage.getItem('flat_lili_last_rid');

        if (path === '/admin') {
            loadingVariant = 'admin';
        } else if (path === '/') {
            loadingVariant = 'landing';
        } else if (
            params.get('rid') ||
            (path.length > 1 && !['/cms', '/lili', '/flat-lili'].includes(path)) ||
            hasStoredRid
        ) {
            loadingVariant = 'guest';
        }

        return <ModernLoadingScreen variant={loadingVariant} />;
    }

    // 1.5 Tela de Reconexão
    if (appState.mode === 'RECONNECTING') {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                        <RefreshCw className="text-orange-500 animate-spin" size={32} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white mb-2 font-heading flex items-center justify-center gap-2">
                            Abrindo seu guia...{' '}
                            <Sparkles className="text-orange-400 animate-pulse" size={20} />
                        </h1>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Modo Admin e CMS
    if (appState.mode === (AppMode.ADMIN as any) || appState.mode === AppMode.CMS) {
        return (
            <ErrorBoundary>
                <ThemeProvider>
                    <LanguageProvider>
                        <Suspense fallback={<ModernLoadingScreen variant="admin" />}>
                            <PageTransition>
                                <AdminDashboard />
                            </PageTransition>
                        </Suspense>
                    </LanguageProvider>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    // 4. Modo Landing Page Pública (Lili)
    if (appState.mode === 'LILI_LANDING') {
        return (
            <ErrorBoundary>
                <ThemeProvider>
                    <Suspense fallback={<LandingSkeleton />}>
                        <PageTransition>
                            <LandingPageLili />
                        </PageTransition>
                    </Suspense>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    // 4. Telas de Bloqueio / Expirado
    if (appState.mode === 'BLOCKED' || appState.mode === 'EXPIRED') {
        const isExpired = appState.mode === 'EXPIRED';
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
                <PageTransition>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            {isExpired ? (
                                <CalendarX className="text-red-400" size={32} />
                            ) : (
                                <AlertTriangle className="text-red-400" size={32} />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 font-heading">
                            {isExpired ? 'Acesso Expirado' : 'Reserva Não Encontrada'}
                        </h1>
                        {!showManualLogin ? (
                            <>
                                <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                                    {isExpired
                                        ? 'A validade deste acesso terminou. Se você tem uma nova reserva, use o botão abaixo.'
                                        : 'Este link não está mais disponível ou a reserva foi cancelada.'}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button
                                        onClick={() => setShowManualLogin(true)}
                                        fullWidth
                                        leftIcon={<RefreshCw size={16} />}
                                    >
                                        {isExpired ? 'Inserir Novo Código' : 'Tenho um novo código'}
                                    </Button>
                                    <a
                                        href={`https://wa.me/${HOST_PHONE}`}
                                        className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors font-heading"
                                    >
                                        <MessageCircle size={18} /> Falar com a Anfitriã
                                    </a>
                                    <Button
                                        variant="ghost"
                                        onClick={handleResetApp}
                                        className="text-xs text-gray-400 hover:text-white underline"
                                        leftIcon={<LogOut size={12} />}
                                    >
                                        Voltar ao Início
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="animate-fadeIn">
                                <p className="text-sm text-gray-300 mb-3 font-medium">
                                    Cole o novo link abaixo:
                                </p>
                                <Input
                                    value={manualInput}
                                    onChange={(e) => setManualInput(e.target.value)}
                                    placeholder="Cole aqui (ex: ?rid=...)"
                                    className="bg-black/50 border-white/20 text-white placeholder:text-gray-500 mb-4"
                                />
                                <div className="flex gap-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowManualLogin(false)}
                                        className="flex-1 bg-white/10 hover:bg-white/20 text-gray-300 border-0"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleManualSubmit}
                                        disabled={!manualInput.trim()}
                                        className="flex-1"
                                        rightIcon={<ArrowRight size={16} />}
                                    >
                                        Acessar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </PageTransition>
            </div>
        );
    }

    // 5. Tela Inicial (Landing / Login com Código)
    if (appState.mode === 'LANDING') {
        return (
            <ErrorBoundary>
                <ThemeProvider>
                    <Suspense fallback={<LandingSkeleton />}>
                        <PageTransition>
                            <LandingFlatsIntegracao />
                        </PageTransition>
                    </Suspense>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    // 6. App Principal (Admin ou Guest) com Suspense e ErrorBoundary
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    <FavoritesProvider>
                        <Suspense
                            fallback={appState.mode === AppMode.ADMIN ? <AdminSkeleton /> : <GuestSkeleton />}
                        >
                            <PageTransition>
                                <div className="antialiased text-gray-900 dark:text-gray-100 min-h-[100dvh] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                                    {appState.mode === AppMode.ADMIN ? (
                                        <AdminDashboard />
                                    ) : (
                                        <GuestView
                                            config={appState.config}
                                        />
                                    )}
                                </div>
                            </PageTransition>
                        </Suspense>
                    </FavoritesProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
};

export default App;
