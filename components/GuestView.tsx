import React, { useState, useEffect, useRef } from 'react';
import { GuestConfig, PlaceRecommendation, AppConfig, SmartSuggestionsConfig } from '../types';
import { getDynamicPlaces, getHeroImages, subscribeToAppSettings, subscribeToSmartSuggestions } from '../services/firebase';
import { MapPin, Wifi, Key, Home, Coffee, Utensils, Map, Check, Star, Tv, ShoppingBasket, Maximize2, ExternalLink, Camera, Share2, Video, MessageCircle, Pizza, LogOut, Siren, HeartPulse, Moon, Sun, Clock, Megaphone, CalendarHeart, AlertTriangle, Ambulance, Flame, Shield, Phone, Briefcase, ShowerHead, Trash2, Ban, AlertCircle, Lightbulb, Droplets, UserCheck, Car, Footprints } from 'lucide-react';
import SectionCard from './SectionCard';
import PlaceCard from './PlaceCard';
import ChatWidget from './ChatWidget';
import OptimizedImage from './OptimizedImage';
import WeatherWidget from './WeatherWidget';
import SmartSuggestion from './SmartSuggestion';
import { useGuestStay } from '../hooks/useGuestStay';

// Modais
import CheckinModal from './modals/CheckinModal';
import CheckoutModal from './modals/CheckoutModal';
import OfflineCardModal from './modals/OfflineCardModal';
import DriverModeModal from './modals/DriverModeModal';
import VideoModal from './modals/VideoModal';

import { 
  BURGERS, SKEWERS, SALADS, PASTA, ORIENTAL, ALA_CARTE, SELF_SERVICE, BARS,
  CAFES, ATTRACTIONS, ESSENTIALS, SNACKS, EMERGENCY, 
  WIFI_SSID as DEFAULT_WIFI_SSID, WIFI_PASS as DEFAULT_WIFI_PASS, GOOGLE_REVIEW_LINK, FLAT_ADDRESS, HOST_PHONE, HERO_IMAGE_URL, HERO_IMAGE_2_URL, DRONE_VIDEO_URL,
  HERO_IMAGE_3_URL
} from '../constants';

interface GuestViewProps {
  config: GuestConfig;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

// --- CONFIGURAÇÃO PADRÃO (FALLBACK) ---
const DEFAULT_SLIDES = [
  HERO_IMAGE_URL, 
  HERO_IMAGE_2_URL,
  HERO_IMAGE_3_URL 
];

// --- COMPONENTES AUXILIARES (SKELETONS) ---
const CardSkeleton = () => (
  <div className="w-full h-full min-h-[160px] p-6 flex flex-col items-center justify-center animate-pulse">
    <div className="w-12 h-12 bg-orange-200/50 dark:bg-orange-800/40 rounded-full mb-3"></div>
    <div className="h-4 w-32 bg-orange-200/50 dark:bg-orange-800/40 rounded mb-2"></div>
    <div className="h-3 w-48 bg-orange-200/50 dark:bg-orange-800/40 rounded"></div>
  </div>
);

const ExpandablePlaceList: React.FC<{ places: PlaceRecommendation[] }> = ({ places }) => {
  const LIMIT = 3;
  const [showAll, setShowAll] = useState(false);
  const visiblePlaces = showAll ? places : places.slice(0, LIMIT);
  const hiddenCount = places.length - LIMIT;

  if (places.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mb-5">
      {!showAll && places.length > LIMIT && (
        <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold font-sans ml-1">
          Exibindo {LIMIT} de {places.length}
        </p>
      )}

      {visiblePlaces.map((place, idx) => (
        <PlaceCard key={idx} place={place} />
      ))}
      
      {places.length > LIMIT && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(!showAll);
          }}
          className="w-full py-3 mt-1 text-xs font-bold font-sans text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-sm active:scale-[0.98]"
        >
          {showAll ? 'Mostrar menos' : `Ver mais (+${hiddenCount})`}
        </button>
      )}
    </div>
  );
};

const CategoryHeader: React.FC<{ title: string; icon: string }> = ({ title, icon }) => (
  <div className="flex items-center gap-2.5 mb-3 mt-4 px-1">
    <span className="text-lg filter drop-shadow-sm">{icon}</span>
    <h5 className="font-heading font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">{title}</h5>
    <div className="h-px bg-gray-100 dark:bg-gray-700 flex-1 ml-2"></div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---
const GuestView: React.FC<GuestViewProps> = ({ config, theme, toggleTheme }) => {
  // Hook Personalizado de Lógica
  const { stayStage, isTimeVerified, isPasswordReleased, isCheckoutToday } = useGuestStay(config);

  // States Visuais
  const [wifiCopied, setWifiCopied] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  
  // States de Modais
  const [showDriverMode, setShowDriverMode] = useState(false);
  const [showOfflineCard, setShowOfflineCard] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // NOVO: State para controlar se o checkout deve abrir direto na chave
  const [startOnKeyDetails, setStartOnKeyDetails] = useState(false);
  
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [isVideoVertical, setIsVideoVertical] = useState(false);
  
  // Hero Images
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<string[]>(DEFAULT_SLIDES);
  
  // Configurações Globais Dinâmicas
  const [appSettings, setAppSettings] = useState<AppConfig | null>(null);
  // Sugestões Dinâmicas
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestionsConfig | null>(null);
  
  const [openEmergency, setOpenEmergency] = useState(false);
  const emergencyRef = useRef<HTMLDivElement>(null);
  
  // State para locais dinâmicos do Firebase
  const [dynamicPlaces, setDynamicPlaces] = useState<PlaceRecommendation[]>([]);

  // Carrega locais, imagens e configs do Firebase ao montar
  useEffect(() => {
    const loadData = async () => {
      const places = await getDynamicPlaces();
      setDynamicPlaces(places.filter(p => p.visible !== false));
      
      const images = await getHeroImages();
      if (images && images.length > 0) {
        setHeroSlides(images);
      }
    };
    loadData();

    const unsubscribeSettings = subscribeToAppSettings((settings) => {
      setAppSettings(settings);
    });

    const unsubscribeSuggestions = subscribeToSmartSuggestions((suggestions) => {
        setSmartSuggestions(suggestions);
    });

    return () => {
        unsubscribeSettings();
        unsubscribeSuggestions();
    };
  }, []);

  const mergePlaces = (staticList: PlaceRecommendation[], category: string) => {
    const dynamic = dynamicPlaces.filter(p => p.category === category);
    return [...staticList, ...dynamic];
  };

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); 
    return () => clearInterval(timer);
  }, [heroSlides]);

  // VARIAVEIS DINAMICAS
  const currentWifiSSID = appSettings?.wifiSSID || DEFAULT_WIFI_SSID;
  const currentWifiPass = appSettings?.wifiPass || DEFAULT_WIFI_PASS;
  const currentSafeCode = appSettings?.safeCode || config.safeCode || '----';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const openVideoModal = (url: string, vertical: boolean = false) => {
    setCurrentVideoUrl(url);
    setIsVideoVertical(vertical);
    setShowVideoModal(true);
  };

  // NOVO: Função para abrir o modal direto na chave
  const handleOpenKeyDetails = () => {
    setStartOnKeyDetails(true);
    setIsCheckoutModalOpen(true);
  };

  // NOVO: Função ao fechar o modal de checkout (reseta o estado da chave)
  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false);
    setTimeout(() => setStartOnKeyDetails(false), 500);
  };

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(currentWifiPass);
    setWifiCopied(true);
    setTimeout(() => setWifiCopied(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(FLAT_ADDRESS);
    setAddressCopied(true);
    setTimeout(() => setAddressCopied(false), 2000);
  };

  const handleShareLocation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Flats Integração',
          text: `Estou hospedado no Flats Integração: ${FLAT_ADDRESS}`,
          url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FLAT_ADDRESS)}`
        });
      } catch (error) {
        console.log('Erro ao compartilhar', error);
      }
    } else {
      handleCopyAddress();
    }
  };

  const handleEmergencyClick = () => {
    setOpenEmergency(false); 
    setTimeout(() => {
      setOpenEmergency(true);
      setTimeout(() => {
        emergencyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 50);
  };

  const mapsNavigationUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FLAT_ADDRESS)}`;

   const formatFriendlyDate = (dateStr?: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' });
  };

  const hasContent = (list: PlaceRecommendation[], category: string) => {
    const merged = mergePlaces(list, category);
    return merged.length > 0;
  }

  return (
    <div className={`min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300 text-sm relative`}>
      
      {/* BANNER DE AVISO GLOBAL */}
      {appSettings?.noticeActive && (
        <div className="sticky top-0 left-0 w-full bg-yellow-500 text-white z-[45] shadow-md animate-fadeIn">
           <div className="max-w-3xl mx-auto px-4 py-2 flex items-start gap-3">
              <Megaphone size={18} className="shrink-0 mt-0.5 animate-pulse" fill="currentColor" />
              <p className="text-xs font-bold leading-snug font-sans">
                {appSettings.noticeText}
              </p>
           </div>
        </div>
      )}

      {/* MODAIS */}
      <CheckinModal 
        isOpen={isCheckinModalOpen}
        onClose={() => setIsCheckinModalOpen(false)}
        safeCode={currentSafeCode}
        lockCode={config.lockCode}
        isPasswordReleased={isPasswordReleased}
        onOpenVideo={openVideoModal}
      />

      {/* MODAL DE CHECKOUT ATUALIZADO COM PROP DE INÍCIO */}
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={handleCloseCheckout}
        config={config}
        startOnKeyDetails={startOnKeyDetails}
      />

      <OfflineCardModal 
        isOpen={showOfflineCard}
        onClose={() => setShowOfflineCard(false)}
        config={config}
        wifiSSID={currentWifiSSID}
        wifiPass={currentWifiPass}
        safeCode={currentSafeCode}
        isPasswordReleased={isPasswordReleased}
        address={FLAT_ADDRESS}
      />

      <DriverModeModal 
        isOpen={showDriverMode}
        onClose={() => setShowDriverMode(false)}
        address={FLAT_ADDRESS}
      />

      <VideoModal 
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={currentVideoUrl}
        isVertical={isVideoVertical}
      />

      {/* Hero Section */}
      <div className="relative h-72 sm:h-80 bg-gray-900 overflow-hidden">
        {/* Botões de Topo: Clima e Tema */}
        <div className="absolute top-5 right-5 z-30 flex gap-2">
           {toggleTheme && (
             <button 
               onClick={toggleTheme}
               className="px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-black/10 transition-all flex items-center justify-center"
             >
               {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
             </button>
           )}
           {/* Widget de Clima */}
           <WeatherWidget />
        </div>
        
        {/* SLIDESHOW */}
        {heroSlides.map((img, index) => (
           <div 
             key={index}
             className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
           >
             <OptimizedImage 
               src={img} 
               alt="Flats Integração" 
               className="w-full h-full object-cover opacity-60" 
             />
           </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent z-20" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 z-30">
          <p className="text-white/90 font-bold mb-1.5 tracking-widest uppercase text-[10px] font-heading bg-black/30 inline-block px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10">Guia Interativo • Flat de Lili</p>
          <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-2 leading-tight text-white drop-shadow-sm">Olá, {config.guestName?.split(' ')[0] || 'Visitante'}!</h1>
          
          {config.welcomeMessage ? (
             <div className="mt-1.5 inline-block max-w-md">
               <div className="bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-3 rounded-xl shadow-lg">
                 <p className="text-white text-sm sm:text-lg font-medium italic leading-relaxed font-sans">
                   "{config.welcomeMessage}"
                 </p>
               </div>
             </div>
          ) : (
            <p className="text-white/90 text-sm sm:text-lg font-medium font-sans max-w-lg leading-relaxed drop-shadow-sm">
              Sua casa longe de casa no Vale do São Francisco.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-5 -mt-6 relative z-30">
        
        {/* Quick Actions / ACESSO RÁPIDO */}
        <div className="mb-6 p-0.5 rounded-[22px] bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 shadow-2xl shadow-orange-500/20 dark:shadow-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-[20px] p-5 flex flex-col gap-4 h-full">
            
            <div className="flex justify-between items-center px-1">
              <h2 className="text-[10px] font-heading font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Acesso Rápido</h2>
              <div className="flex gap-2">
                {/* ESCONDE BOTÃO SOS NO PRÉ-CHECKIN */}
                {stayStage !== 'pre_checkin' && (
                  <button 
                    onClick={handleEmergencyClick}
                    className="text-[9px] font-bold text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-2.5 py-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-sans shadow-sm"
                  >
                    <Siren size={10} /> SOS
                  </button>
                )}
                <button 
                  onClick={() => setShowOfflineCard(true)}
                  className="text-[9px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-sans shadow-sm"
                >
                  <Camera size={10} /> Salvar Acesso
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* CARTÃO DINÂMICO (Muda conforme o dia) */}
              <div className="bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30 flex flex-col w-full overflow-hidden transition-all duration-500 min-h-[160px] justify-center">
                
                {/* SKELETON LOADING (Evita FOUC) */}
                {!isTimeVerified ? (
                  <CardSkeleton />
                ) : (
                  <>
                    {/* PAINEL DE "AQUECIMENTO" (PRÉ-CHECKIN) */}
                    {stayStage === 'pre_checkin' && (
                      <div className="p-6 animate-fadeIn text-center relative overflow-hidden group bg-gradient-to-br from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/20 dark:to-purple-900/20">
                         <div className="absolute top-0 right-0 p-3 text-purple-200/50 dark:text-purple-900/30 transform rotate-12">
                           <CalendarHeart size={80} strokeWidth={1} />
                         </div>
                         
                         {isPasswordReleased ? (
                           <>
                             <h3 className="text-lg font-heading font-bold text-purple-900 dark:text-purple-100 mb-2 relative z-10">SEU CHECK-IN É AMANHÃ! 🤩</h3>
                             
                             <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xs mx-auto mb-4 relative z-10">
                               Enquanto não chega, dá uma olhada nas regras e o que te espera na cidade!
                               <br/><br/>
                               <span className="text-purple-800 dark:text-purple-200 font-bold">
                                   AH, suas senhas já estão liberadas, viu?
                               </span>
                               <br/>
                               Clique acima em <span className="font-bold border-b border-purple-300">Salvar Acesso</span> e tira um print do seu cartão!
                             </p>

                             <button 
                               onClick={() => setIsCheckinModalOpen(true)}
                               className="px-4 py-2 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                             >
                               Ver instruções de acesso
                             </button>
                           </>
                         ) : (
                           <>
                             <h3 className="text-lg font-heading font-bold text-purple-900 dark:text-purple-100 mb-2 relative z-10">Sua viagem está chegando! ✈️</h3>
                             
                             <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed max-w-xs mx-auto mb-4 relative z-10">
                               Seu check-in é no dia <strong className="text-purple-700 dark:text-purple-300">{formatFriendlyDate(config.checkInDate)}</strong>, a partir das <strong className="text-purple-700 dark:text-purple-300">{config.checkInTime || '14:00'}</strong>.
                               <br/><br/>
                               Enquanto não chega, dá uma olhada nas regras e o que te espera na cidade!
                             </p>

                             <button 
                               onClick={() => setIsCheckinModalOpen(true)}
                               className="px-4 py-2 border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold uppercase tracking-wide hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                             >
                               Ver instruções de acesso
                             </button>
                           </>
                         )}
                      </div>
                    )}

                    {/* PAINEL DE VÉSPERA (PRÉ-CHECKOUT) */}
                    {stayStage === 'pre_checkout' && (
                       <div className="p-2 animate-fadeIn">
                          <div className="mb-3 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/30 flex flex-col items-center text-center">
                             <h3 className="text-sm font-heading font-bold text-indigo-900 dark:text-indigo-100 mb-1">Amanhã é dia de partir 😢</h3>
                             <p className="text-[10px] text-indigo-700 dark:text-indigo-300 mb-3 max-w-[240px] leading-tight">
                               Seu check-out é amanhã até às <strong className="text-indigo-900 dark:text-white">{config.checkOutTime || '11:00'}</strong>. 
                               Vai sair de madrugada? Veja as instruções.
                             </p>
                             <button 
                               onClick={() => setIsCheckoutModalOpen(true)}
                               className="w-full py-2 bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wide border border-indigo-200 dark:border-indigo-800/50 rounded-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                             >
                               Ver instruções de saída
                             </button>
                          </div>
                          
                          {/* GRID DE 3 COLUNAS (Senha, WiFi, Endereço) */}
                          <div className="grid grid-cols-3 gap-2">
                              {/* 1. SENHA (Compacto) */}
                              <div className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col justify-center items-center gap-1">
                                  <div className="text-orange-500 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded-lg">
                                     <Key size={18} strokeWidth={2.5} />
                                  </div>
                                  <div>
                                     <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">Senha</p>
                                     <p className="text-lg font-bold text-gray-900 dark:text-white font-mono leading-none">{config.lockCode}</p>
                                  </div>
                              </div>

                              {/* 2. WIFI (Compacto e Interativo) */}
                              <div 
                                onClick={handleCopyWifi}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              >
                                  <div className={`p-1.5 rounded-lg transition-colors ${wifiCopied ? 'bg-green-100 text-green-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'}`}>
                                     {wifiCopied ? <Check size={18} /> : <Wifi size={18} />}
                                  </div>
                                  <div>
                                     <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">WiFi</p>
                                     <p className="text-[10px] font-bold text-gray-900 dark:text-white leading-none truncate max-w-[80px]">Conectar</p>
                                  </div>
                              </div>

                              {/* 3. ENDEREÇO (Novo card) */}
                              <div 
                                onClick={handleCopyAddress}
                                className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm flex flex-col justify-center items-center gap-1 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                              >
                                  <div className={`p-1.5 rounded-lg transition-colors ${addressCopied ? 'bg-green-100 text-green-600' : 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'}`}>
                                     {addressCopied ? <Check size={18} /> : <MapPin size={18} />}
                                  </div>
                                   <div>
                                     <p className="text-[8px] text-gray-400 uppercase font-bold tracking-wider text-center mb-0.5">Local</p>
                                     <p className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">{addressCopied ? 'Copiado!' : 'Copiar'}</p>
                                  </div>
                              </div>
                          </div>
                       </div>
                    )}

                    {/* PAINEL COMPACTO (MEIO DA ESTADIA) - Refinado */}
                    {stayStage === 'middle' && (
                      <div className="p-2 animate-fadeIn">
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          
                          {/* 1. SENHA */}
                          <div className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-orange-200 dark:border-orange-800/50 shadow-sm flex flex-col justify-center items-start relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-1.5 text-orange-100 dark:text-orange-900/10 transform rotate-12"><Key size={48} strokeWidth={1.5} /></div>
                              <p className="text-[9px] text-orange-600 dark:text-orange-400 font-bold uppercase tracking-widest mb-0.5 font-heading">Senha</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white font-mono tracking-wider z-10">{config.lockCode}</p>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsCheckinModalOpen(true); }}
                                className="mt-1.5 px-2 py-1 bg-orange-50 dark:bg-orange-900/40 hover:bg-orange-100 text-orange-700 dark:text-orange-300 text-[9px] font-bold rounded-lg flex items-center gap-1 transition-colors z-10"
                              >
                                <Video size={10} /> Ver vídeo
                              </button>
                          </div>

                          {/* 2. ENDEREÇO */}
                          <div 
                            onClick={handleCopyAddress}
                            className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-purple-200 dark:border-purple-800/50 shadow-sm flex flex-col justify-center items-start relative overflow-hidden cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                          >
                              <div className="absolute top-2 right-2 text-purple-400 bg-purple-50 dark:bg-purple-900/30 p-1 rounded-md"><Maximize2 size={10} onClick={(e: React.MouseEvent) => { e.stopPropagation(); setShowDriverMode(true); }} /></div>
                              <p className="text-[9px] text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mb-0.5 font-heading">Endereço</p>
                              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 pr-4">R. São José, 475 B</p>
                              <p className="text-[9px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{addressCopied ? 'Copiado!' : 'Toque p/ Copiar'}</p>
                          </div>

                          {/* 3. WIFI (AGORA COM O NOME DA REDE) */}
                          <div 
                            onClick={handleCopyWifi}
                            className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                              <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 p-2 rounded-lg shrink-0"><Wifi size={16} /></div>
                              <div className="overflow-hidden">
                                <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase truncate" title={currentWifiSSID}>
                                  {currentWifiSSID}
                                </p>
                                <p className="text-[10px] text-gray-600 dark:text-gray-300 font-medium truncate">
                                   {wifiCopied ? 'Senha Copiada!' : (currentWifiPass.length < 12 ? currentWifiPass : 'Copiar Senha')}
                                </p>
                              </div>
                          </div>

                          {/* 4. CHECKOUT */}
                          <div
                            onClick={(e) => { e.stopPropagation(); setIsCheckoutModalOpen(true); }}
                            className="col-span-1 bg-white dark:bg-gray-800 p-3 rounded-xl border border-indigo-200 dark:border-indigo-800/50 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                          >
                              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 p-2 rounded-lg shrink-0"><LogOut size={16} /></div>
                              <div>
                                <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold uppercase mb-0.5">Check-out</p>
                                {config.checkoutDate ? (
                                  <div className="leading-tight">
                                    <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200">
                                      {(() => {
                                          const [y, m, d] = config.checkoutDate.split('-').map(Number);
                                          const date = new Date(y, m - 1, d);
                                          const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                                          return `${days[date.getDay()]} (${d}/${m})`;
                                      })()}
                                    </p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-400">
                                      às {config.checkOutTime || '11:00'}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{config.checkOutTime || '11:00'}</p>
                                )}
                              </div>
                          </div>
                        </div>
                        
                        <a 
                          href={`https://wa.me/${HOST_PHONE}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3.5 bg-white dark:bg-gray-700 border-2 border-green-100 dark:border-green-900/30 hover:border-green-50 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-xl flex items-center justify-center gap-2 transition-all font-sans group shadow-sm mt-4 animate-fadeIn"
                        >
                          <MessageCircle size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold uppercase tracking-wide">Falar com a Lili</span>
                        </a>
                      </div>
                    )}

                    {/* PAINEL PADRÃO (CHECK-IN E CHECK-OUT) */}
                    {(stayStage === 'checkin' || stayStage === 'checkout') && (
                      <div 
                        onClick={isCheckoutToday ? () => setIsCheckoutModalOpen(true) : undefined}
                        className={`p-6 flex flex-col items-center text-center group animate-fadeIn ${isCheckoutToday ? 'cursor-pointer hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors' : ''}`}
                      >
                          {/* CASO 1: CHECK-OUT */}
                          {stayStage === 'checkout' && (
                            <>
                              <div className="p-3 rounded-full mb-3 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm animate-pulse-slow border border-blue-50 dark:border-blue-900/30">
                                <LogOut size={24} strokeWidth={2} />
                              </div>
                              <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1.5">Hoje é seu Check-out</h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors font-medium max-w-xs leading-relaxed">
                                Esperamos que tenha sido incrível! Toque aqui para ver o checklist.
                              </p>
                              <div className="flex flex-col gap-2 w-full max-w-[260px]">
                                <div className="flex items-center justify-center gap-2.5 bg-white dark:bg-gray-800 py-2.5 px-4 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                                  <Clock size={16} className="text-blue-500"/>
                                  <span className="text-xs font-bold text-gray-700 dark:text-gray-200 font-sans">
                                    Horário do Check-Out: {config.checkOutTime || '11:00'}
                                  </span>
                                </div>
                              </div>
                            </>
                          )}

                          {/* CASO 2: CHECK-IN */}
                          {stayStage === 'checkin' && (
                            <>
                              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                                <Key size={20} className="text-orange-500" strokeWidth={2.5} />
                                Que alegria te receber, {config.guestName?.split(' ')[0] || 'Visitante'}!
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300 mb-5 font-medium max-w-xs mx-auto leading-relaxed">
                                Preparamos um guia rápido para você entrar sem estresse.
                              </p>
                              
                              <button 
                                onClick={(e) => { e.stopPropagation(); setIsCheckinModalOpen(true); }}
                                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 text-sm flex items-center justify-center gap-2 font-sans active:scale-[0.98]"
                              >
                                Iniciar Passo a Passo
                              </button>
                            </>
                          )}
                      </div>
                    )}

                    {/* RODAPÉ COM HORÁRIOS - EXIBE APENAS NO CHECK-IN */}
                    {stayStage === 'checkin' && (
                      <div className="bg-orange-50/50 dark:bg-orange-900/20 border-t border-orange-100/50 dark:border-orange-800/30 px-5 py-2.5 flex justify-center items-center animate-fadeIn">
                          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                             <Clock size={14} />
                             <p className="text-xs font-bold font-sans">
                                Check-in liberado a partir das {config.checkInTime || '14:00'}
                             </p>
                          </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Exibe os cartões normais de WiFi/Endereço */}
              {isTimeVerified && stayStage !== 'middle' && stayStage !== 'pre_checkout' && (
                <div className="animate-fadeIn">
                  {/* Card do WiFi - SÓ APARECE NO CHECK-IN */}
                  {stayStage === 'checkin' && (
                    <button 
                      onClick={handleCopyWifi}
                      className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 flex flex-col items-center text-center transition-all active:scale-[0.98] hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer relative overflow-hidden group w-full mb-4"
                    >
                      <div className={`p-2.5 rounded-full mb-2 shadow-sm transition-colors duration-300 ${wifiCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-white dark:bg-gray-700 text-blue-500 border border-blue-50 dark:border-blue-900/30'}`}>
                        {wifiCopied ? <Check size={20} /> : <Wifi size={20} />}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-bold uppercase tracking-wide">Rede WiFi</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white break-all leading-tight mb-1.5 font-sans">{currentWifiSSID}</p>
                      <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide transition-colors duration-300 border ${wifiCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-700 text-blue-500 border-blue-100 dark:border-blue-900/30 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500'}`}>
                        {wifiCopied ? 'Senha Copiada!' : 'Toque p/ Copiar Senha'}
                      </div>
                    </button>
                  )}

                  {/* Card do Endereço */}
                  <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30 flex flex-col items-center text-center relative group w-full hover:shadow-lg hover:shadow-purple-500/5 transition-all">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDriverMode(true);
                      }}
                      className="absolute top-2 right-2 p-1.5 text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
                      title="Modo Motorista (Tela Cheia)"
                    >
                      <Maximize2 size={16} />
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareLocation();
                      }}
                      className="absolute top-2 left-2 p-1.5 text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-colors"
                      title="Compartilhar Localização"
                    >
                      <Share2 size={16} />
                    </button>

                    <div onClick={handleCopyAddress} className="cursor-pointer w-full flex flex-col items-center active:scale-95 transition-transform mb-3">
                      <div className={`p-2.5 rounded-full mb-2 shadow-sm transition-colors duration-300 ${addressCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-white dark:bg-gray-700 text-purple-500 border border-purple-50 dark:border-purple-900/30'}`}>
                        {addressCopied ? <Check size={20} /> : <MapPin size={20} />}
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-bold uppercase tracking-wide">Localização</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight mb-1.5 line-clamp-2 px-2 font-sans">
                        {FLAT_ADDRESS}
                      </p>
                      <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide transition-colors duration-300 border ${addressCopied ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-700 text-purple-500 border-purple-100 dark:border-purple-900/30'}`}>
                        {addressCopied ? 'Endereço Copiado!' : 'Toque p/ Copiar'}
                      </div>
                    </div>

                    <div className="w-full flex gap-2">
                      <a 
                        href={mapsNavigationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-white dark:bg-gray-700 border border-purple-100 dark:border-purple-800/30 text-purple-700 dark:text-purple-300 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors font-sans shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} /> Abrir Mapa
                      </a>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openVideoModal(DRONE_VIDEO_URL);
                        }}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-purple-700 transition-colors shadow-md shadow-purple-500/20 font-sans"
                      >
                        <Video size={12} /> Ver do Alto
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-0">
               {/* Botão Falar com a Lili (SÓ APÓS CARREGAR) */}
               {isTimeVerified && stayStage !== 'middle' && (
                 <a 
                   href={`https://wa.me/${HOST_PHONE}`}
                   target="_blank"
                   rel="noreferrer"
                   className="w-full py-3.5 bg-white dark:bg-gray-700 border-2 border-green-100 dark:border-green-900/30 hover:border-green-50 hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-400 rounded-xl flex items-center justify-center gap-2 transition-all font-sans group shadow-sm mt-4 animate-fadeIn"
                 >
                   <MessageCircle size={18} className="text-green-500 group-hover:scale-110 transition-transform" />
                   <span className="text-xs font-bold uppercase tracking-wide">Falar com a Lili</span>
                 </a>
               )}
            </div>

          </div>
        </div>

        {/* SMART SUGGESTION ATUALIZADA */}
        <SmartSuggestion 
          stayStage={stayStage} 
          onCheckoutClick={() => setIsCheckoutModalOpen(true)}
          isTimeVerified={isTimeVerified}
          customSuggestions={smartSuggestions}
        />

        {/* SEÇÕES */}
        <div className="space-y-5 mb-10">
          
          {/* CARD 1: O FLAT & COMODIDADES (Conforto) */}
          <SectionCard title="O Flat & Comodidades" icon={Home} color="bg-orange-500">
            <div className="space-y-6">
              
              {/* Intro */}
              <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                 <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 font-medium">
                   Um flat todo equipado, confortável e novinho! Com 30m² cheios de estilo, é fácil de manter organizado e atende perfeitamente às necessidades do dia a dia.
                 </p>
              </div>

               {/* Localização e Curiosidade (MOVIDO PARA CÁ) */}
               <div>
                   <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                     <div className="p-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-md"><MapPin size={14}/></div> Sobre a Localização
                   </h4>
                   
                   <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        O flat fica na <strong>Rua São José, 475</strong>, ao lado da Av. da Integração. Acesso rápido ao centro, shopping e hospitais.
                      </p>

                      {/* INFORMAÇÕES DE ACESSO E ESTACIONAMENTO (ADICIONADO AQUI) */}
                      <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                         <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <div className="p-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full mt-0.5"><Car size={10} /></div>
                            <p><strong>Não possuímos estacionamento</strong> (vagas disponíveis na rua).</p>
                         </div>
                         <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
                            <div className="p-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full mt-0.5"><Footprints size={10} /></div>
                            <p>O prédio não possui elevador (acesso por escadas).</p>
                         </div>
                      </div>
                      
                      <div className="flex gap-3 text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">
                         <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Aeroporto: 15-20 min</span>
                         <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Rodoviária: 10-15 min</span>
                      </div>

                      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                         <p className="text-[10px] font-bold text-orange-600 dark:text-orange-400 mb-1 uppercase">Curiosidade Local</p>
                         <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                           Quase em frente, você verá o icônico <strong>Monumento da Integração</strong> (apelidado de "Monumento da Besteira"). Ele simboliza a união dos bairros de Petrolina! 😄
                         </p>
                      </div>
                   </div>
                </div>

              {/* Ambientes */}
              <div className="space-y-4">
                 {/* Sala */}
                 <div>
                    <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md"><Tv size={14}/></div> Sala de Estar
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        {['TV de 50"', 'Cafeteira', 'Jogos de Tabuleiro', 'Livros'].map(item => (
                          <span key={item} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 px-2 rounded-lg text-[10px] text-gray-600 dark:text-gray-300 font-semibold shadow-sm font-sans">{item}</span>
                        ))}
                    </div>
                 </div>

                 {/* Cozinha */}
                 <div>
                    <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <div className="p-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md"><Utensils size={14}/></div> Cozinha Completa
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-center mb-2">
                        {['Geladeira Inverter', 'Microondas', 'Air Fryer', 'Liquidificador', 'Sanduicheira', 'Mini Processador'].map(item => (
                          <span key={item} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 px-2 rounded-lg text-[10px] text-gray-600 dark:text-gray-300 font-semibold shadow-sm font-sans">{item}</span>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 ml-1 font-medium">+ Panelas, louça e talheres.</p>
                 </div>

                 {/* Quarto */}
                 <div>
                    <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                      <div className="p-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md"><Moon size={14}/></div> Quarto Acolhedor
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                        {['Ar-condicionado', 'Ventilador', 'Roupas de Cama', 'TV', 'Escrivaninha'].map(item => (
                          <span key={item} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-2 px-2 rounded-lg text-[10px] text-gray-600 dark:text-gray-300 font-semibold shadow-sm font-sans">{item}</span>
                        ))}
                    </div>
                 </div>

                 {/* Banheiro e Office */}
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                         <div className="p-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-md"><ShowerHead size={14}/></div> Banheiro
                       </h4>
                       <ul className="text-[10px] text-gray-600 dark:text-gray-400 font-medium space-y-1 ml-1">
                          <li>• Chuveiro Elétrico</li>
                          <li>• Secador de Cabelo</li>
                          <li>• Toalhas e Sabonete</li>
                       </ul>
                    </div>
                    <div>
                       <h4 className="font-heading font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                         <div className="p-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md"><Briefcase size={14}/></div> Home Office
                       </h4>
                       <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium leading-tight">
                         Espaço com iluminação confortável e conexão rápida. Ideal para reuniões e estudos.
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </SectionCard>

          {/* CARD 2: REGRAS & AVISOS (Atualizado com novas regras) */}
          <SectionCard title="Regras & Avisos" icon={AlertCircle} color="bg-rose-500">
             <div className="space-y-6">
                
                {/* ALERTA DE CAPACIDADE (Hóspedes da Reserva) */}
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <UserCheck size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-800 dark:text-rose-200 text-sm font-heading mb-0.5">Hóspedes da Reserva</p>
                      <p className="text-xs text-rose-700 dark:text-rose-300 font-medium leading-relaxed">
                        Acesso exclusivo aos hóspedes da reserva. Proibida a entrada de visitantes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alerta 220V */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-800 dark:text-red-200 text-sm font-heading mb-0.5">Atenção: Voltagem 220V</p>
                      <p className="text-xs text-red-700 dark:text-red-300 font-medium leading-relaxed">Cuidado ao ligar secadores e equipamentos.</p>
                    </div>
                  </div>
                </div>

                {/* Regras de Lixo (Atualizado com detalhe do vizinho) */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Trash2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-blue-800 dark:text-blue-200 text-sm font-heading mb-0.5">Descarte de Lixo</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                        Segunda, Quarta e Sexta (06:00 – 18:00h).<br/>
                        <span className="opacity-80 text-[10px]">Local: Na calçada entre o totem e o poste (<strong>não colocar no vizinho</strong>).</span>
                      </p>
                    </div>
                  </div>
                </div>

                 {/* Cuidado com Enxoval */}
                 <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <Droplets size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-amber-800 dark:text-amber-200 text-sm font-heading mb-0.5">Cuidado com o Enxoval</p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-medium leading-relaxed">
                        Danos ou manchas em lençóis e toalhas poderão gerar cobrança de taxa de reposição.
                      </p>
                    </div>
                  </div>
                </div>

                 {/* Checkout Rápido */}
                 <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <LogOut size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="w-full">
                      <p className="font-bold text-emerald-800 dark:text-emerald-200 text-sm font-heading mb-0.5">Check-out Rápido</p>
                      <ul className="text-xs text-emerald-700 dark:text-emerald-300 font-medium leading-relaxed space-y-2 mt-1">
                        <li>• Apague luzes e desligue o AC</li>
                        <li>• Feche as janelas</li>
                        
                        {/* ITEM DA CHAVE COM BOTÃO */}
                        <li className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                           <div className="flex items-center gap-1">
                              <span>• Chave: Devolva na caixinha <strong>"Self Checkout"</strong></span>
                           </div>
                           <button 
                             onClick={handleOpenKeyDetails}
                             className="ml-2 sm:ml-0 px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded border border-emerald-200 shadow-sm flex items-center gap-1 transition-colors w-fit"
                           >
                             <Camera size={10} /> Ver foto
                           </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lista de Proibições & Deveres (COMPLETA) */}
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Limpeza por conta do hóspede durante a estadia</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Não deixar pertences no hall ou áreas comuns</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Proibido fumar dentro do flat</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Proibido som alto</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Não são permitidos animais</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Não permitimos festas/eventos</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Não usar para qualquer atividade ilegal</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 mt-0.5"><Ban size={10} /></div> Não secar roupas na cama ou sofá</li>
                  
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 mt-0.5"><Lightbulb size={10} /></div> Usar AC com portas/janelas fechadas</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 mt-0.5"><Lightbulb size={10} /></div> Usar água e energia de forma responsável</li>
                  <li className="flex items-start gap-2 text-gray-600 dark:text-gray-300 font-medium text-xs"><div className="w-4 h-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 mt-0.5"><AlertCircle size={10} /></div> Avisar imediatamente sobre danos</li>
                </ul>

             </div>
          </SectionCard>

          {/* Mercados */}
          <SectionCard title="Mercados e Farmácias" icon={ShoppingBasket} color="bg-emerald-500">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium ml-1">Itens essenciais pertinho de você.</p>
            <div className="flex flex-col gap-3">
               <ExpandablePlaceList places={mergePlaces(ESSENTIALS, 'essentials')} />
            </div>
          </SectionCard>
          
          {/* Delivery */}
          {(hasContent(SNACKS, 'snacks')) && (
            <SectionCard title="Lanches e Delivery" icon={Pizza} color="bg-yellow-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium ml-1">Opções para pedir sem sair de casa.</p>
                <div className="flex flex-col gap-3">
                  <ExpandablePlaceList places={mergePlaces(SNACKS, 'snacks')} />
              </div>
            </SectionCard>
          )}

          {/* Restaurantes (AGRUPADOS) */}
          <SectionCard title="Bares e Restaurantes" icon={Utensils} color="bg-red-500">
            
            {hasContent(BURGERS, 'burgers') && (
              <>
                <CategoryHeader title="Hambúrguer" icon="🍔" />
                <ExpandablePlaceList places={mergePlaces(BURGERS, 'burgers')} />
              </>
            )}

            {hasContent(SKEWERS, 'skewers') && (
              <>
                <CategoryHeader title="Espetinho" icon="🍢" />
                <ExpandablePlaceList places={mergePlaces(SKEWERS, 'skewers')} />
              </>
            )}

            {hasContent(SALADS, 'salads') && (
              <>
                <CategoryHeader title="Salada & Saudável" icon="🥗" />
                <ExpandablePlaceList places={mergePlaces(SALADS, 'salads')} />
              </>
            )}

            {hasContent(PASTA, 'pasta') && (
              <>
                <CategoryHeader title="Massas & Pizza" icon="🍝" />
                <ExpandablePlaceList places={mergePlaces(PASTA, 'pasta')} />
              </>
            )}

            {hasContent(ORIENTAL, 'oriental') && (
              <>
                <CategoryHeader title="Culinária Oriental" icon="🍣" />
                <ExpandablePlaceList places={mergePlaces(ORIENTAL, 'oriental')} />
              </>
            )}

            {hasContent(ALA_CARTE, 'alacarte') && (
              <>
                <CategoryHeader title="À la Carte & Regional" icon="🍽️" />
                <ExpandablePlaceList places={mergePlaces(ALA_CARTE, 'alacarte')} />
              </>
            )}

            {hasContent(SELF_SERVICE, 'selfservice') && (
              <>
                <CategoryHeader title="Self-Service" icon="🍛" />
                <ExpandablePlaceList places={mergePlaces(SELF_SERVICE, 'selfservice')} />
              </>
            )}

            {hasContent(BARS, 'bars') && (
              <>
                <CategoryHeader title="Bares" icon="🍻" />
                <ExpandablePlaceList places={mergePlaces(BARS, 'bars')} />
              </>
            )}

          </SectionCard>

          {/* Cafés */}
          <SectionCard title="Cafés e Padarias" icon={Coffee} color="bg-amber-600">
            <ExpandablePlaceList places={mergePlaces(CAFES, 'cafes')} />
          </SectionCard>

          {/* Passeios */}
          <SectionCard title="Passeios Imperdíveis" icon={Map} color="bg-indigo-500">
            <ExpandablePlaceList places={mergePlaces(ATTRACTIONS, 'attractions')} />
          </SectionCard>

          {/* SOS */}
          <div ref={emergencyRef}>
            <SectionCard 
              title="SOS & Emergência" 
              icon={HeartPulse} 
              color="bg-red-600" 
              forceOpen={openEmergency}
            >
              
              {/* NOVO GRID DE DESTAQUE DE EMERGÊNCIA */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                 <a href="tel:192" className="flex flex-col items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 group">
                    <Ambulance size={28} className="mb-1 group-hover:scale-110 transition-transform"/>
                    <span className="text-2xl font-bold font-heading leading-none">192</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">SAMU</span>
                 </a>
                 <a href="tel:193" className="flex flex-col items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/30 transition-all active:scale-95 group">
                    <Flame size={28} className="mb-1 group-hover:scale-110 transition-transform"/>
                    <span className="text-2xl font-bold font-heading leading-none">193</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Bombeiros</span>
                 </a>
                 <a href="tel:190" className="flex flex-col items-center justify-center p-4 bg-blue-800 hover:bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-800/30 transition-all active:scale-95 group">
                    <Shield size={28} className="mb-1 group-hover:scale-110 transition-transform"/>
                    <span className="text-2xl font-bold font-heading leading-none">190</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Polícia</span>
                 </a>
                 <a href="tel:188" className="flex flex-col items-center justify-center p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all active:scale-95 group">
                    <Phone size={28} className="mb-1 group-hover:scale-110 transition-transform"/>
                    <span className="text-2xl font-bold font-heading leading-none">188</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">CVV (Vida)</span>
                 </a>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-bold font-heading uppercase tracking-wider ml-1">Hospitais e Clínicas</p>
              <div className="flex flex-col gap-3">
                <ExpandablePlaceList places={mergePlaces(EMERGENCY, 'emergency')} />
              </div>
            </SectionCard>
          </div>

        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-2xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Star size={120} />
          </div>
          
          <h3 className="text-xl font-heading font-bold mb-2">Sua opinião vale ouro! ⭐</h3>
          <p className="text-blue-50 text-sm mb-6 leading-relaxed font-medium opacity-90">
            Olá, {config.guestName}! Espero que tenha amado a estadia. 
            Se puder deixar uma avaliação rápida no Google, ajuda muito o nosso trabalho!
          </p>
          
          <a 
            href={GOOGLE_REVIEW_LINK}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-blue-700 font-bold py-3.5 px-6 rounded-xl inline-flex items-center gap-2.5 hover:bg-blue-50 transition-colors shadow-lg w-full justify-center sm:w-auto font-sans text-sm active:scale-[0.98]"
          >
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
            Avaliar no Google
          </a>
        </div>

      </div>

      <ChatWidget guestName={config.guestName} />
    </div>
  );
};

export default GuestView;