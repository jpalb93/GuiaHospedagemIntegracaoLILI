import React, { useState, useEffect, Suspense, lazy } from 'react';

import { AppMode, GuestConfig } from './types';
// Importação otimizada de ícones - Lucide React já faz tree-shaking automaticamente
import { Lock, MapPin, CalendarX, MessageCircle, AlertTriangle, LogOut, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';

import { HERO_IMAGE_URL, HOST_PHONE, USE_OFFICIAL_TIME, fetchOfficialTime, } from './constants';
import { fetchGuestConfig } from './services/guest';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingScreen, GuestSkeleton, AdminSkeleton, LandingSkeleton } from './components/LoadingSkeletons';

// --- LAZY LOADING (CODE SPLITTING) ---
// Carrega os componentes pesados apenas quando necessários
const AdminDashboard = lazy(() => import(/* webpackChunkName: "admin" */ './components/admin/AdminDashboard'));
const GuestView = lazy(() => import(/* webpackChunkName: "guest" */ './components/GuestView'));
const ContentManager = lazy(() => import(/* webpackChunkName: "cms" */ './components/ContentManager'));
const LandingPageLili = lazy(() => import(/* webpackChunkName: "landing-lili" */ './components/LandingLili'));

// --- FUNÇÃO DE SEGURANÇA: REMOVIDA (Agora é Server-Side) ---
// A sanitização ocorre na API /api/get-guest-config

const App: React.FC = () => {
  // --- TEMA ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('flat_lili_theme');
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const colorLight = '#f9fafb';
    const colorDark = '#111827';

    if (root && root.classList) {
      if (theme === 'dark') {
        root.classList.add('dark');
        document.querySelector("meta[name=theme-color]")?.setAttribute("content", colorDark);
      } else {
        root.classList.remove('dark');
        document.querySelector("meta[name=theme-color]")?.setAttribute("content", colorLight);
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('flat_lili_theme', newTheme);
      return newTheme;
    });
  };

  // --- ESTADO DO APP ---
  const [appState, setAppState] = useState<{ mode: AppMode | 'LANDING' | 'LILI_LANDING' | 'EXPIRED' | 'BLOCKED' | 'LOADING'; config: GuestConfig }>(() => {
    return { mode: 'LOADING', config: { guestName: '', lockCode: '' } };
  });

  const [showManualLogin, setShowManualLogin] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // --- MONITORAMENTO (AGORA VIA API) ---
  useEffect(() => {
    const initApp = async () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      let reservationId = params.get('rid');


      const isCMS = path === '/cms' || params.get('mode') === 'cms';
      const isLiliPage = path === '/lili' || path === '/flat-lili';

      if (isCMS) {
        setAppState({ mode: AppMode.CMS, config: { guestName: '', lockCode: '' } });
        return;
      }

      // ADMIN ROUTE SECURITY:
      // Check for /admin path
      // The AdminView component itself handles authentication (Firebase Auth),
      // so we just need to route correctly here.
      if (path === '/admin') {
        setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
        return;
      }

      if (isLiliPage) {
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
        reservationId = localStorage.getItem('flat_lili_last_rid');
      } else {
        localStorage.setItem('flat_lili_last_rid', reservationId);
      }

      if (reservationId) {
        try {
          // NOVA LÓGICA: Busca via API Segura
          const safeConfig = await fetchGuestConfig(reservationId);

          if (!safeConfig) {
            localStorage.removeItem('flat_lili_last_rid');
            setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
            return;
          }

          // Verificação de Expiração (UX apenas, dados já estão seguros)
          if (safeConfig.checkoutDate) {
            let now = new Date();
            if (USE_OFFICIAL_TIME) {
              try { now = await fetchOfficialTime(); } catch (_e) { }
            }
            const [year, month, day] = safeConfig.checkoutDate.split('-').map(Number);
            const expirationDate = new Date(year, month - 1, day);
            expirationDate.setHours(23, 59, 59, 999);

            if (now > expirationDate) {
              localStorage.removeItem('flat_lili_last_rid');
              setAppState({ mode: 'EXPIRED', config: { guestName: '', lockCode: '' } });
              return;
            }
          }

          setAppState({ mode: AppMode.GUEST, config: safeConfig });

          // LIMPEZA DE URL (UX): Remove o ID da barra de endereço para ficar "bonito"
          // O ID já está salvo no localStorage, então o refresh funciona.
          if (reservationId && window.history.replaceState) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
          return;

        } catch (error) {
          console.error("Erro ao buscar reserva", error);
          setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
          return;
        }
      }

      setAppState({ mode: 'LANDING', config: { guestName: '', lockCode: '' } });
    };

    initApp();
  }, []);

  const handleResetApp = () => {
    localStorage.removeItem('flat_lili_last_rid');
    window.location.href = '/';
  };

  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    let rid = manualInput.trim();
    try {
      if (rid.includes('http') || rid.includes('?')) {
        const urlObj = new URL(rid.startsWith('http') ? rid : `http://${rid}`);
        const id = urlObj.searchParams.get('rid');
        if (id) rid = id;
      }
    } catch (_e) { }
    localStorage.setItem('flat_lili_last_rid', rid);
    window.location.href = `/?rid=${rid}`;
  };

  // --- RENDERIZAÇÃO ---

  // 1. Tela de Carregamento (Enquanto decide a rota)
  if (appState.mode === 'LOADING') {
    return <LoadingScreen />;
  }

  // 2. Modo CMS (Admin de Conteúdo)
  if (appState.mode === AppMode.CMS) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AdminSkeleton />}>
          <ContentManager />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // 3. Modo Landing Page Pública (Lili)
  if (appState.mode === 'LILI_LANDING') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<LandingSkeleton />}>
          <LandingPageLili />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // 4. Telas de Bloqueio / Expirado
  if (appState.mode === 'BLOCKED' || appState.mode === 'EXPIRED') {
    const isExpired = appState.mode === 'EXPIRED';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            {isExpired ? <CalendarX className="text-red-400" size={32} /> : <AlertTriangle className="text-red-400" size={32} />}
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
                <button onClick={() => setShowManualLogin(true)} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors font-heading shadow-md"><RefreshCw size={16} /> {isExpired ? 'Inserir Novo Código' : 'Tenho um novo código'}</button>
                <a href={`https://wa.me/${HOST_PHONE}`} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors font-heading"><MessageCircle size={18} /> Falar com a Anfitriã</a>
                <button onClick={handleResetApp} className="text-xs text-gray-400 hover:text-white underline mt-2 flex items-center justify-center gap-1"><LogOut size={12} /> Voltar ao Início</button>
              </div>
            </>
          ) : (
            <div className="animate-fadeIn">
              <p className="text-sm text-gray-300 mb-3 font-medium">Cole o novo link abaixo:</p>
              <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder="Cole aqui (ex: ?rid=...)" className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4 text-sm transition-all" />
              <div className="flex gap-3">
                <button onClick={() => setShowManualLogin(false)} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold transition-colors">Cancelar</button>
                <button onClick={handleManualSubmit} disabled={!manualInput.trim()} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">Acessar <ArrowRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 5. Tela Inicial (Landing / Login com Código)
  if (appState.mode === 'LANDING') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden font-sans text-white">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMAGE_URL} className="w-full h-full object-cover opacity-40 blur-sm scale-105" alt="Background" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl max-w-md text-center mx-4 animate-fadeIn w-full">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide font-heading">Flats Integração</h1>
          <p className="text-orange-200 text-sm font-medium uppercase tracking-widest mb-8 font-heading">Guia Digital do Hóspede</p>

          {!showManualLogin ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                <p className="text-gray-200 text-sm leading-relaxed font-medium">
                  Bem-vindo! Para acessar as informações do flat, utilize o <span className="font-bold text-white">link exclusivo</span> enviado pelo seu anfitrião via WhatsApp.
                </p>
              </div>
              <button onClick={() => setShowManualLogin(true)} className="text-xs text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-all flex items-center justify-center gap-1 mx-auto">
                <KeyRound size={12} /> Já tenho um código de acesso
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn bg-black/40 p-6 rounded-2xl border border-white/10">
              <p className="text-sm text-gray-200 mb-3 font-bold text-left">Insira o link ou código:</p>
              <input type="text" value={manualInput} onChange={(e) => setManualInput(e.target.value)} placeholder="Cole aqui (ex: ?rid=...)" className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4 text-sm transition-all" />
              <div className="flex gap-3">
                <button onClick={() => setShowManualLogin(false)} className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold transition-colors">Cancelar</button>
                <button onClick={handleManualSubmit} disabled={!manualInput.trim()} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">Acessar <ArrowRight size={16} /></button>
              </div>
            </div>
          )}
          <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-xs font-medium"><MapPin size={12} /> <span>Petrolina, Pernambuco</span></div>
        </div>
      </div>
    );
  }

  // 6. App Principal (Admin ou Guest) com Suspense e ErrorBoundary
  return (
    <ErrorBoundary>
      <Suspense fallback={appState.mode === AppMode.ADMIN ? <AdminSkeleton /> : <GuestSkeleton />}>
        <div className="antialiased text-gray-900 dark:text-gray-100 min-h-[100dvh] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          {appState.mode === AppMode.ADMIN ? (
            <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
          ) : (
            <GuestView config={appState.config} theme={theme} toggleTheme={toggleTheme} />
          )}
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;