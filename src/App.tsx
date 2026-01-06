import React, { useEffect, Suspense, lazy } from 'react';

import { AppMode } from './types';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useManualAuth } from './hooks/useManualAuth';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import GuideList from './pages/GuideList';
import WineRouteArticle from './pages/articles/WineRoute';
import GuideArticleLoader from './components/GuideArticleLoader';
import BododromoArticle from './pages/articles/Bododromo';
import RioSaoFranciscoArticle from './pages/articles/RioSaoFrancisco';
import CorporateArticle from './pages/articles/Corporate';

import ScrollToTop from './components/ScrollToTop';
import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { Button, Input } from './components/ui';
import {
    CalendarX,
    MessageCircle,
    AlertTriangle,
    LogOut,
    RefreshCw,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

import { HOST_PHONE } from './constants';
import { initAnalytics } from './services/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import {
    GuestSkeleton,
    AdminSkeleton,
    LandingSkeleton,
    LiliSkeleton,
} from './components/LoadingSkeletons';
import ModernLoadingScreen from './components/ModernLoadingScreen';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { LanguageProvider } from './hooks/useLanguage';
import { ThemeProvider } from './contexts/ThemeContext';
import SmoothScroll from './components/SmoothScroll';
import { PageTransition } from './components/ui/PageTransition';

// --- LAZY LOADING (CODE SPLITTING) ---
const AdminDashboard = lazy(
    () => import(/* webpackChunkName: "admin" */ './components/admin/AdminDashboard')
);
const GuestView = lazy(() => import(/* webpackChunkName: "guest" */ './components/GuestView'));

const LandingPageLili = lazy(
    () => import(/* webpackChunkName: "landing-lili" */ './components/LandingLili')
);

const App: React.FC = () => {
    // --- ESTADO DO APP (Refatorado para Hook) ---
    const { appState, setAppState } = useAppInitialization();

    // --- MANUAL AUTH (Refatorado para Hook) ---
    const {
        showManualLogin,
        setShowManualLogin,
        manualInput,
        setManualInput,
        handleManualSubmit,
        handleResetApp,
    } = useManualAuth(setAppState);

    // --- ANALYTICS INIT ---
    useEffect(() => {
        initAnalytics();
    }, []);

    // --- ROTEAMENTO PÚBLICO (Guia) ---
    // REMOVIDO: Unificado no bloco LANDING abaixo

    // --- RENDERIZAÇÃO ---

    // 1. Tela de Carregamento
    if (appState.mode === 'LOADING') {
        const path = window.location.pathname;

        // OTIMIZAÇÃO: Se for a Landing Page (raiz), não mostra tela de loading,
        // renderiza direto (o Suspense cuidará do esqueleto se necessário).
        // OTIMIZAÇÃO: Se for rota pública (Landing, Blog/Guia),
        // não mostra tela de loading, renderiza direto para SEO e Performance.
        if (path === '/' || path.startsWith('/guia') || path === '/politica-privacidade') {
            return (
                <ErrorBoundary>
                    <ThemeProvider>
                        <Suspense fallback={<LandingSkeleton />}>
                            <MainLayout>
                                <ScrollToTop />
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <PageTransition>
                                                <Home />
                                            </PageTransition>
                                        }
                                    />
                                    <Route path="/guia" element={<GuideList />} />
                                    {/* Rotas Explícitas para Artigos */}
                                    <Route
                                        path="/guia/roteiro-vinho-petrolina"
                                        element={<WineRouteArticle />}
                                    />
                                    <Route
                                        path="/guia/onde-comer-petrolina-bododromo"
                                        element={<BododromoArticle />}
                                    />
                                    <Route
                                        path="/guia/rio-sao-francisco-rodeadouro-barquinha"
                                        element={<RioSaoFranciscoArticle />}
                                    />
                                    <Route
                                        path="/guia/hospedagem-corporativa-empresas-petrolina"
                                        element={<CorporateArticle />}
                                    />
                                    <Route path="/guia/:slug" element={<GuideArticleLoader />} />
                                    <Route
                                        path="/politica-privacidade"
                                        element={<PrivacyPolicy />}
                                    />
                                    <Route path="*" element={<Home />} />
                                </Routes>
                                <CookieConsent />
                            </MainLayout>
                        </Suspense>
                    </ThemeProvider>
                </ErrorBoundary>
            );
        }

        // OTIMIZAÇÃO: Se for a Landing Page da Lili (/lili ou /flat-lili),
        // também não mostra loading, renderiza direto.
        if (path === '/lili' || path === '/flat-lili') {
            return (
                <ErrorBoundary>
                    <ThemeProvider>
                        <SmoothScroll />
                        <Suspense fallback={<LiliSkeleton />}>
                            <PageTransition>
                                <LandingPageLili />
                            </PageTransition>
                        </Suspense>
                    </ThemeProvider>
                </ErrorBoundary>
            );
        }

        let loadingVariant: 'guest' | 'admin' | 'landing' = 'landing';
        const params = new URLSearchParams(window.location.search);
        const hasStoredRid =
            typeof localStorage !== 'undefined' && !!localStorage.getItem('flat_lili_last_rid');

        if (path === '/admin') {
            loadingVariant = 'admin';
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
    if (appState.mode === (AppMode.ADMIN as AppMode) || appState.mode === AppMode.CMS) {
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
                    <SmoothScroll />
                    <Suspense fallback={<LiliSkeleton />}>
                        <PageTransition>
                            <LandingPageLili />
                        </PageTransition>
                    </Suspense>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }

    // 4. Telas de Bloqueio / Expirado
    if (appState.mode === 'BLOCKED' || appState.mode === 'EXPIRED' || appState.mode === 'REVOKED') {
        const isExpired = appState.mode === 'EXPIRED';
        const isRevoked = appState.mode === 'REVOKED';
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
                <PageTransition>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            {isExpired || isRevoked ? (
                                <CalendarX className="text-red-400" size={32} />
                            ) : (
                                <AlertTriangle className="text-red-400" size={32} />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 font-heading">
                            {isRevoked
                                ? 'Link desativado'
                                : isExpired
                                  ? 'Acesso Expirado'
                                  : 'Reserva Não Encontrada'}
                        </h1>
                        {!showManualLogin ? (
                            <>
                                <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                                    {isRevoked
                                        ? 'Link indisponível. Entre em contato com a anfitriã.'
                                        : isExpired
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
                        <MainLayout>
                            <ScrollToTop />
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <PageTransition>
                                            <Home />
                                        </PageTransition>
                                    }
                                />
                                <Route path="/guia" element={<GuideList />} />
                                {/* Rotas Explícitas para Artigos (Melhor SEO e evita redirects) */}
                                <Route
                                    path="/guia/roteiro-vinho-petrolina"
                                    element={<WineRouteArticle />}
                                />
                                <Route
                                    path="/guia/onde-comer-petrolina-bododromo"
                                    element={<BododromoArticle />}
                                />
                                <Route
                                    path="/guia/rio-sao-francisco-rodeadouro-barquinha"
                                    element={<RioSaoFranciscoArticle />}
                                />
                                <Route
                                    path="/guia/hospedagem-corporativa-empresas-petrolina"
                                    element={<CorporateArticle />}
                                />

                                {/* Fallback para carregamento dinâmico ou links legados */}
                                <Route path="/guia/:slug" element={<GuideArticleLoader />} />
                                <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                                <Route path="*" element={<Home />} />
                            </Routes>
                            <CookieConsent />
                        </MainLayout>
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
                    <FavoritesProvider
                        // Cast config to Reservation to access sync props
                        reservationId={(appState.config as unknown as { id: string }).id}
                        initialFavorites={
                            (appState.config as unknown as { favoritePlaces: string[] })
                                .favoritePlaces
                        }
                    >
                        <Suspense
                            fallback={
                                appState.mode === AppMode.ADMIN ? (
                                    <AdminSkeleton />
                                ) : (
                                    <GuestSkeleton />
                                )
                            }
                        >
                            <PageTransition>
                                <div className="antialiased text-gray-900 dark:text-gray-100 min-h-[100dvh] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                                    {appState.mode === AppMode.ADMIN ? (
                                        <AdminDashboard />
                                    ) : (
                                        <GuestView config={appState.config} />
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
