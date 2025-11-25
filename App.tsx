import React, { useState, useEffect } from 'react';
import AdminView from './components/AdminView';
import GuestView from './components/GuestView';
import ContentManager from './components/ContentManager';
import LandingPageLili from './components/LandingPageLili'; 
import { AppMode, GuestConfig } from './types';
import { Lock, MapPin, CalendarX, MessageCircle, AlertTriangle, Loader2, LogOut, KeyRound, ArrowRight, RefreshCw } from 'lucide-react';
import { HERO_IMAGE_URL, HOST_PHONE, USE_OFFICIAL_TIME, fetchOfficialTime, } from './constants';
import { getReservation, subscribeToSingleReservation } from './services/firebase';

const App: React.FC = () => {
  // --- LÓGICA DE TEMA ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';

      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return initialTheme;
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    // 1. Cores exatas do Tailwind (gray-50 e gray-900) para a barra do navegador
    const colorLight = '#f9fafb'; 
    const colorDark = '#111827'; 

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 2. "Pinta" a barra do navegador (Mobile)
    const metaThemeColor = document.querySelector("meta[name=theme-color]");
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === 'dark' ? colorDark : colorLight);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // --- LÓGICA DO APP (ROTEAMENTO E DADOS) ---
  const [appState, setAppState] = useState<{ mode: AppMode | 'LANDING' | 'LILI_LANDING' | 'EXPIRED' | 'BLOCKED' | 'LOADING'; config: GuestConfig }>(() => {
    return { mode: 'LOADING', config: { guestName: '', lockCode: '' } };
  });

  // State para Login Manual na Capa (PWA Recorrente)
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [manualInput, setManualInput] = useState('');

  // Effect de Monitoramento em Tempo Real (Kill Switch)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // Tenta pegar da URL OU do LocalStorage (Persistência para PWA)
    const urlRid = params.get('rid');
    const storedRid = localStorage.getItem('flat_lili_last_rid');
    const reservationId = urlRid || storedRid;

    if (reservationId) {
      // Se veio pela URL, atualiza o storage para garantir
      if (urlRid) localStorage.setItem('flat_lili_last_rid', urlRid);

      const unsubscribe = subscribeToSingleReservation(reservationId, (updatedReservation) => {
        if (!updatedReservation) {
          // Se a reserva foi apagada, limpa o storage para não ficar preso
          localStorage.removeItem('flat_lili_last_rid');
          setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' } });
        } else {
          setAppState(prev => {
            if (prev.mode === AppMode.GUEST || prev.mode === 'LOADING') {
               if (updatedReservation.checkoutDate) {
                 const now = new Date();
                 const parts = updatedReservation.checkoutDate.split('-');
                 const year = parseInt(parts[0]);
                 const month = parseInt(parts[1]) - 1;
                 const day = parseInt(parts[2]);
                 const expirationDate = new Date(year, month, day);
                 expirationDate.setHours(23, 59, 59, 999);

                 if (now > expirationDate) {
                   // Se expirou, limpa o storage
                   localStorage.removeItem('flat_lili_last_rid');
                   return { mode: 'EXPIRED', config: { guestName: '', lockCode: '' }};
                 }
               }
               
               // SANITIZAÇÃO DE DADOS (SEGURANÇA)
               // Usando desestruturação para garantir que dados sensíveis sejam descartados
               // e não fiquem no objeto safeConfig
               const { guestPhone, adminNotes, ...safeConfig } = updatedReservation;

               return { mode: AppMode.GUEST, config: safeConfig };
            }
            return prev;
          });
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Effect Principal de Roteamento Inicial (Fetch Once)
  useEffect(() => {
    const initApp = async () => {
      const path = window.location.pathname; 
      const params = new URLSearchParams(window.location.search);
      let reservationId = params.get('rid'); 
      
      const isAdmin = path === '/admin' || params.get('admin') === 'true';
      const isCMS = path === '/cms' || params.get('mode') === 'cms'; 
      
      // Verifica se é a página da Lili
      const isLiliPage = path === '/lili' || path === '/flat-lili';

      // 1. Rota CMS
      if (isCMS) {
         setAppState({ mode: AppMode.CMS, config: { guestName: '', lockCode: '' }});
         return;
      }

      // 2. Rota Admin (Só se não tiver rid)
      if (isAdmin && !reservationId) {
        setAppState({ mode: AppMode.ADMIN, config: { guestName: '', lockCode: '' } });
        return;
      }

      // 3. Rota Landing Page Lili
      if (isLiliPage) {
         setAppState({ mode: 'LILI_LANDING', config: { guestName: '', lockCode: '' } });
         return;
      }

      // 4. Lógica de Persistência (PWA Support)
      // Se não tem ID na URL, tenta pegar do storage
      if (!reservationId) {
         reservationId = localStorage.getItem('flat_lili_last_rid');
      } else {
         // Se tem ID na URL, salva no storage para o futuro
         localStorage.setItem('flat_lili_last_rid', reservationId);
      }

      // 5. Processamento via ID do Banco de Dados (Guia do Hóspede)
      if (reservationId) {
        try {
          const reservation = await getReservation(reservationId);
          
          if (!reservation) {
            localStorage.removeItem('flat_lili_last_rid'); // Limpa se inválido
            setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' }});
            return;
          }

          if (reservation.checkoutDate) {
             let now = new Date();
             if (USE_OFFICIAL_TIME) {
               try { now = await fetchOfficialTime(); } catch(e) {}
             }
             const parts = reservation.checkoutDate.split('-');
             const year = parseInt(parts[0]);
             const month = parseInt(parts[1]) - 1;
             const day = parseInt(parts[2]);
             const expirationDate = new Date(year, month, day);
             expirationDate.setHours(23, 59, 59, 999);

             if (now > expirationDate) {
               localStorage.removeItem('flat_lili_last_rid'); // Limpa se expirado
               setAppState({ mode: 'EXPIRED', config: { guestName: '', lockCode: '' }});
               return;
             }
          }

          // SANITIZAÇÃO DE DADOS (SEGURANÇA)
          // Garante que o telefone e notas nunca cheguem ao state do componente
          const { guestPhone, adminNotes, ...safeConfig } = reservation;

          setAppState({ mode: AppMode.GUEST, config: safeConfig });
          return;

        } catch (error) {
           console.error("Erro ao buscar reserva", error);
           setAppState({ mode: 'BLOCKED', config: { guestName: '', lockCode: '' }});
           return;
        }
      }

      // 6. Landing Page Genérica (Default - Raiz)
      setAppState({ mode: 'LANDING', config: { guestName: '', lockCode: '' } });
    };

    initApp();
  }, []);

  // Função para Resetar o App (Logout do Hóspede)
  const handleResetApp = () => {
    localStorage.removeItem('flat_lili_last_rid');
    // Redireciona para a raiz limpa para garantir que o estado zere
    window.location.href = '/';
  };

  // Função para Login Manual (Hóspede Recorrente)
  const handleManualSubmit = () => {
    if (!manualInput.trim()) return;
    
    let rid = manualInput.trim();
    // Verifica se o usuário colou o link inteiro em vez do código
    try {
        // Se for um link válido, extrai o parametro 'rid'
        if (rid.includes('http') || rid.includes('?')) {
            const urlObj = new URL(rid.startsWith('http') ? rid : `http://${rid}`);
            const id = urlObj.searchParams.get('rid');
            if (id) rid = id;
        }
    } catch (e) {
        // Não é URL, assume que é o ID direto
    }

    // Salva e recarrega
    localStorage.setItem('flat_lili_last_rid', rid);
    window.location.href = `/?rid=${rid}`;
  };

  // --- RENDERIZAÇÃO ---

  if (appState.mode === 'LOADING') {
     return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={48}/></div>;
  }

  if (appState.mode === AppMode.CMS) {
    return <ContentManager />;
  }

  // Renderiza a Landing Page da Lili
  if (appState.mode === 'LILI_LANDING') {
    return <LandingPageLili />;
  }

  if (appState.mode === 'BLOCKED') {
     return (
       <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <AlertTriangle className="text-red-400" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-white mb-2 font-heading">Reserva Não Encontrada</h1>
           
           {!showManualLogin ? (
             <>
               <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                 Este link não está mais disponível ou a reserva foi cancelada.
               </p>
               <div className="flex flex-col gap-3">
                 <a href={`https://wa.me/${HOST_PHONE}`} className="w-full py-3 bg-white/10 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-colors font-heading">
                   Entrar em contato
                 </a>
                 <button onClick={() => setShowManualLogin(true)} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors font-heading shadow-md">
                   <RefreshCw size={16} /> Tenho um novo código
                 </button>
                 <button onClick={handleResetApp} className="text-xs text-gray-400 hover:text-white underline mt-2">
                   Voltar ao Início
                 </button>
               </div>
             </>
           ) : (
             <div className="animate-fadeIn">
                <p className="text-sm text-gray-300 mb-3 font-medium">Cole o novo link abaixo para atualizar:</p>
                <input 
                    type="text" 
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Cole aqui (ex: ?rid=...)"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4 text-sm transition-all"
                />
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowManualLogin(false)}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleManualSubmit}
                        disabled={!manualInput.trim()}
                        className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Acessar <ArrowRight size={16} />
                    </button>
                </div>
             </div>
           )}
        </div>
      </div>
     );
  }

  if (appState.mode === 'EXPIRED') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-center font-sans text-white">
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-red-500/30 shadow-2xl max-w-md animate-fadeIn w-full">
           <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
             <CalendarX className="text-red-400" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-white mb-2 font-heading">Acesso Expirado</h1>
           
           {!showManualLogin ? (
             <>
               <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
                 A validade deste acesso terminou. Se você tem uma nova reserva, use o botão abaixo.
               </p>
               <div className="space-y-3">
                 <button 
                   onClick={() => setShowManualLogin(true)} 
                   className="w-full py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors font-heading shadow-lg"
                 >
                   <RefreshCw size={18} /> Inserir Novo Código
                 </button>
                 <a href={`https://wa.me/${HOST_PHONE}`} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors font-heading">
                   <MessageCircle size={18} /> Falar com a Anfitriã
                 </a>
                 <button 
                   onClick={handleResetApp} 
                   className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors font-heading text-sm"
                 >
                   <LogOut size={16} /> Sair do App
                 </button>
               </div>
             </>
           ) : (
             <div className="animate-fadeIn">
                <p className="text-sm text-gray-300 mb-3 font-medium">Cole o novo link da sua reserva:</p>
                <input 
                    type="text" 
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Cole aqui (ex: ?rid=...)"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4 text-sm transition-all"
                />
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowManualLogin(false)}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleManualSubmit}
                        disabled={!manualInput.trim()}
                        className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Acessar <ArrowRight size={16} />
                    </button>
                </div>
             </div>
           )}
        </div>
      </div>
    );
  }

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
                <button 
                    onClick={() => setShowManualLogin(true)}
                    className="text-xs text-gray-400 hover:text-white underline underline-offset-4 decoration-gray-500 hover:decoration-white transition-all flex items-center justify-center gap-1 mx-auto"
                >
                    <KeyRound size={12} /> Já tenho um código de acesso
                </button>
            </div>
          ) : (
            <div className="animate-fadeIn bg-black/40 p-6 rounded-2xl border border-white/10">
                <p className="text-sm text-gray-200 mb-3 font-bold text-left">Insira o link ou código:</p>
                <input 
                    type="text" 
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Cole aqui (ex: ?rid=...)"
                    className="w-full p-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 mb-4 text-sm transition-all"
                />
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowManualLogin(false)}
                        className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-bold transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleManualSubmit}
                        disabled={!manualInput.trim()}
                        className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Acessar <ArrowRight size={16} />
                    </button>
                </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 text-white/50 text-xs font-medium">
            <MapPin size={12} /> <span>Petrolina, Pernambuco</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased text-gray-900 dark:text-gray-100 min-h-[100dvh] font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {appState.mode === AppMode.ADMIN ? (
        <AdminView /> 
      ) : (
        // @ts-ignore
        <GuestView config={appState.config} theme={theme} toggleTheme={toggleTheme} />
      )}
    </div>
  );
};

export default App;