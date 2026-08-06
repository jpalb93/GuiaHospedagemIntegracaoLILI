import React, { useEffect, Suspense, lazy } from 'react';

import { AppMode } from './types';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useManualAuth } from './hooks/useManualAuth';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import GuideList from './pages/GuideList';


import CookieConsent from './components/CookieConsent';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { Button, Input } from './components/ui';
import {
    CalendarX,
    MessageCircle,
    AlertTriangle,
    RefreshCw,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

import { HOST_PHONE } from './constants';
import { initAnalytics } from './services/analytics';
import ErrorBoundary from './components/ErrorBoundary';
import {
    GuestSkeleton,
    LandingSkeleton,
    LiliSkeleton,
} from './components/LoadingSkeletons';
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

// Articles Lazy Loading (Code Splitting for optimized initial bundle)
const WineRouteArticle = lazy(() => import(/* webpackChunkName: "article-wine" */ './pages/articles/WineRoute'));
const GuideArticleLoader = lazy(() => import(/* webpackChunkName: "guide-loader" */ './components/GuideArticleLoader'));
const BododromoArticle = lazy(() => import(/* webpackChunkName: "article-bododromo" */ './pages/articles/Bododromo'));
const RioSaoFranciscoArticle = lazy(() => import(/* webpackChunkName: "article-rio" */ './pages/articles/RioSaoFrancisco'));
const CorporateArticle = lazy(() => import(/* webpackChunkName: "article-corporate" */ './pages/articles/Corporate'));
const MedicalStayArticle = lazy(() => import(/* webpackChunkName: "article-medical" */ './pages/articles/MedicalStay'));
const FlatVsHotelArticle = lazy(() => import(/* webpackChunkName: "article-flat-hotel" */ './pages/articles/FlatVsHotel'));
const SaoJoaoArticle = lazy(() => import(/* webpackChunkName: "article-sao-joao" */ './pages/articles/SaoJoao'));
const MonthlyStayArticle = lazy(() => import(/* webpackChunkName: "article-monthly" */ './pages/articles/MonthlyStay'));



const App: React.FC = () => {
    const { appState, setAppState } = useAppInitialization();
    const {
        showManualLogin,
        setShowManualLogin,
        manualInput,
        setManualInput,
        handleManualSubmit,
    } = useManualAuth(setAppState);

    useEffect(() => {
        const timer = setTimeout(() => {
            initAnalytics();
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Remove a classe de ocultação e limpa o estilo temporário do head após a primeira montagem bem-sucedida do React
        if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('route-private');
            const styleOverride = document.getElementById('critical-skeleton-override');
            if (styleOverride) {
                styleOverride.remove();
            }
            console.log('✨ Hidratação segura React concluída: classe route-private removida.');
        }
    }, []);

    // Encapsulamento de Providers Globais
    const withGlobalProviders = (children: React.ReactNode) => (
        <ErrorBoundary>
            <ThemeProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );

    const path = typeof window !== 'undefined' ? window.location.pathname : '';

    // 1. Tela de Carregamento (Só mostra se não for rota pública/landing)
    if (appState.mode === 'LOADING') {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
        const isGuestLoading = !!(params.get('rid') || (path.length > 1 && !['/cms', '/lili', '/flat-lili', '/admin'].includes(path)));
        const isPublicRoute = (path === '/' || path.startsWith('/guia') || path === '/politica-privacidade' || path === '/lili' || path === '/flat-lili') && !isGuestLoading;
        
        if (!isPublicRoute) {
            let loadingVariant: 'guest' | 'admin' | 'landing' = 'landing';
            if (path === '/admin') loadingVariant = 'admin';
            else if (isGuestLoading) loadingVariant = 'guest';
            
            return withGlobalProviders(<ModernLoadingScreen variant={loadingVariant} />);
        }
    }

    // 2. Tela de Reconexão
    if (appState.mode === 'RECONNECTING') {
        return withGlobalProviders(
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
                <div className="flex flex-col items-center gap-6 animate-pulse">
                    <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                        <RefreshCw className="text-orange-500 animate-spin" size={32} />
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2 font-heading flex items-center justify-center gap-2">
                        Abrindo seu guia... <Sparkles className="text-orange-400 animate-pulse" size={20} />
                    </h1>
                </div>
            </div>
        );
    }

    // 3. Modos Específicos que NÃO usam MainLayout (Lili, Admin, Blocked)
    
    if (appState.mode === 'LILI_LANDING' || (appState.mode === 'LOADING' && (path === '/lili' || path === '/flat-lili'))) {
        return withGlobalProviders(
            <Suspense fallback={<LiliSkeleton />}>
                <PageTransition>
                    <LandingPageLili />
                </PageTransition>
            </Suspense>
        );
    }

    if (appState.mode === AppMode.ADMIN || appState.mode === AppMode.CMS) {
        return withGlobalProviders(
            <Suspense fallback={<ModernLoadingScreen variant="admin" />}>
                <PageTransition>
                    <AdminDashboard />
                </PageTransition>
            </Suspense>
        );
    }

    if (appState.mode === 'BLOCKED' || appState.mode === 'EXPIRED' || appState.mode === 'REVOKED') {
        const isExpired = appState.mode === 'EXPIRED';
        const isRevoked = appState.mode === 'REVOKED';
        return withGlobalProviders(
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
                <PageTransition>
                    <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            {isExpired || isRevoked ? <CalendarX className="text-red-400" size={32} /> : <AlertTriangle className="text-red-400" size={32} />}
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 font-heading">
                            {isRevoked ? 'Link desativado' : isExpired ? 'Acesso Expirado' : 'Reserva Não Encontrada'}
                        </h1>
                        {!showManualLogin ? (
                            <>
                                <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                                    {isRevoked ? 'Link indisponível. Entre em contato com a anfitriã.' : isExpired ? 'A validade deste acesso terminou.' : 'Este link não está mais disponível.'}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Button onClick={() => setShowManualLogin(true)} fullWidth leftIcon={<RefreshCw size={16} />}>
                                        {isExpired ? 'Inserir Novo Código' : 'Tenho um novo código'}
                                    </Button>
                                    <a href={`https://wa.me/${HOST_PHONE}`} target="_blank" rel="noreferrer" className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors font-heading">
                                        <MessageCircle size={18} /> Falar com a Anfitriã
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="animate-fadeIn">
                                <Input value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder="Cole o link aqui..." className="bg-black/50 border-white/20 text-white mb-4" />
                                <div className="flex gap-3">
                                    <Button variant="secondary" onClick={() => setShowManualLogin(false)} className="flex-1 bg-white/10 text-gray-300">Cancelar</Button>
                                    <Button onClick={handleManualSubmit} disabled={!manualInput.trim()} className="flex-1" rightIcon={<ArrowRight size={16} />}>Acessar</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </PageTransition>
            </div>
        );
    }



    // 4. Modo Landing / Guia / Público (Usa MainLayout)
    const isPublicPage = path === '/' || path.startsWith('/guia') || path === '/politica-privacidade';

    if (isPublicPage || appState.mode === 'LANDING' || appState.mode === 'LOADING') {
        return withGlobalProviders(
            <Suspense fallback={<LandingSkeleton />}>
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/guia" element={<GuideList />} />
                        <Route path="/guia/roteiro-vinho-petrolina" element={<WineRouteArticle />} />
                        <Route path="/guia/onde-comer-petrolina-bododromo" element={<BododromoArticle />} />
                        <Route path="/guia/rio-sao-francisco-rodeadouro-barquinha" element={<RioSaoFranciscoArticle />} />
                        <Route path="/guia/hospedagem-corporativa-empresas-petrolina" element={<CorporateArticle />} />
                        <Route path="/guia/hospedagem-proximo-hospitais-petrolina" element={<MedicalStayArticle />} />
                        <Route path="/guia/flat-ou-hotel-petrolina-comparativo" element={<FlatVsHotelArticle />} />
                        <Route path="/guia/onde-ficar-petrolina-sao-joao-guia" element={<SaoJoaoArticle />} />
                        <Route path="/guia/aluguel-mensal-petrolina-flat-mobiliado" element={<MonthlyStayArticle />} />
                        <Route path="/guia/:slug" element={<GuideArticleLoader />} />
                        <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
                        <Route path="*" element={<Home />} />
                    </Routes>
                    <CookieConsent />
                </MainLayout>
            </Suspense>
        );
    }

    // 5. Modo Guest Principal (Usa FavoritesProvider)
    return withGlobalProviders(
        <FavoritesProvider
            reservationId={appState.config.id}
            initialFavorites={appState.config.favoritePlaces || []}
        >
            <Suspense fallback={<GuestSkeleton />}>
                <PageTransition>
                    <div className="antialiased text-gray-900 dark:text-gray-100 min-h-[100dvh] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                        <GuestView config={appState.config} />
                    </div>
                </PageTransition>
            </Suspense>
        </FavoritesProvider>
    );
};

export default App;
