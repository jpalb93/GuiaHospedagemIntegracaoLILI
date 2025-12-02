import React, { useEffect, useCallback, useMemo } from 'react';
import { GuestConfig } from '../types';
import { useGuestStay } from '../hooks/useGuestStay';
import { useGuestData } from '../hooks/useGuestData';
import { useGuestUI } from '../hooks/useGuestUI';
import { useLanguage } from '../hooks/useLanguage';

// Components
import HeroSection from './guest/HeroSection';
import StoriesBar from './guest/StoriesBar';
import GuestHeader from './guest/GuestHeader';
import GuestStatusCard from './guest/GuestStatusCard';
import GuestRecommendations from './guest/GuestRecommendations';
import StoryViewer, { StoryItem } from './StoryViewer'; // Mantido por enquanto, ou mover para components/guest

// Modais
import CheckinModal from './modals/CheckinModal';
import CheckoutModal from './modals/CheckoutModal';
import OfflineCardModal from './modals/OfflineCardModal';
import DriverModeModal from './modals/DriverModeModal';
import VideoModal from './modals/VideoModal';
import SupportModal from './modals/SupportModal';

import {
  CURIOSITY_STORY_IMAGES, DRONE_VIDEO_URL
} from '../constants';
import { PROPERTIES } from '../config/properties';
import { CalendarHeart, Sparkles, MapPin, ExternalLink, Video, Siren, Star, Maximize2 } from 'lucide-react';
import { getIcon } from '../utils/iconMap';
import SmartSuggestion from './SmartSuggestion';
import ChatWidget from './ChatWidget';
import { GOOGLE_REVIEW_LINK } from '../constants';

interface GuestViewProps {
  config: GuestConfig;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

const GuestView: React.FC<GuestViewProps> = ({ config, theme, toggleTheme }) => {
  // Hooks
  const { stayStage, isTimeVerified, isPasswordReleased, isSingleNight, isCheckoutToday } = useGuestStay(config);
  const property = PROPERTIES[config.propertyId || 'lili'];
  const flatAddress = property.address;

  const {
    appSettings,
    dynamicPlaces,
    dismissedAlerts,
    dismissAlert,
    mergePlaces,
    hasContent,
    smartSuggestions,
    tips,
    curiosities
  } = useGuestData(config);

  const {
    modals, video, checkout, stories, clipboard
  } = useGuestUI();

  // State local para idioma (agora via hook)
  const { currentLang, toggleLanguage } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Helpers
  const formatFriendlyDate = useCallback((dateStr?: string) => {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}`;
  }, []);

  const activeEvents = useMemo(() => {
    const events = mergePlaces([], 'events');

    // CORREÇÃO: Usar data local em vez de UTC para evitar que eventos sumam antes da hora
    // Ajusta o fuso horário subtraindo o offset em minutos
    const now = new Date();
    const localDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    const today = localDate.toISOString().split('T')[0];

    return events.filter(event => {
      if (!event.eventDate) return true;
      const expiryDate = event.eventEndDate || event.eventDate;
      return expiryDate >= today;
    }).sort((a, b) => {
      const dateA = a.eventDate || '9999-99-99';
      const dateB = b.eventDate || '9999-99-99';
      return dateA.localeCompare(dateB);
    });
  }, [mergePlaces]);

  // Lógica de Stories (ainda um pouco acoplada, mas simplificada)
  const [currentStories, setCurrentStories] = React.useState<StoryItem[]>([]);

  const handleOpenStories = useCallback((type: 'agenda' | 'curiosities' | 'tips') => {
    if (navigator.vibrate) navigator.vibrate(50);
    if (type === 'agenda') {
      const eventStories: StoryItem[] = activeEvents.map(evt => {
        const startDate = evt.eventDate ? formatFriendlyDate(evt.eventDate) : '';
        const endDate = evt.eventEndDate ? formatFriendlyDate(evt.eventEndDate) : '';

        let subtitle = startDate;
        if (endDate) subtitle += ` até ${endDate}`;
        if (evt.eventTime) subtitle += ` • ${evt.eventTime}`;

        return {
          id: evt.id || evt.name,
          type: 'event',
          title: evt.name,
          subtitle: subtitle || 'Em breve',
          content: evt.description,
          image: evt.imageUrl,
          link: evt.orderLink,
          icon: CalendarHeart,
          address: evt.address
        };
      });
      setCurrentStories(eventStories);
    } else if (type === 'tips') {
      // Mapeia as dicas dinâmicas para o formato de StoryItem
      const tipStories: StoryItem[] = tips.map(tip => ({
        id: tip.id || tip.title,
        type: tip.type,
        title: tip.title,
        subtitle: tip.subtitle,
        content: tip.content,
        image: tip.image,
        icon: getIcon(tip.iconName), // Mapeia string -> Componente
        color: 'from-blue-800 to-blue-900' // Cor padrão ou vinda do banco se tiver
      }));
      setCurrentStories(tipStories);
    } else {
      // Usa as curiosidades dinâmicas (do banco ou fallback)
      const sourceCuriosities = (curiosities && curiosities.length > 0)
        ? curiosities
        : []; // Fallback vazio

      const shuffled = [...sourceCuriosities].sort(() => 0.5 - Math.random()).slice(0, 5);
      const shuffledImages = [...CURIOSITY_STORY_IMAGES].sort(() => 0.5 - Math.random());

      const curiosityStories: StoryItem[] = shuffled.map((item, idx) => ({
        id: `curiosity-${idx}`,
        type: 'curiosity',
        title: 'Você Sabia?',
        subtitle: 'Curiosidade de Petrolina',
        content: item.text,
        icon: Sparkles,
        image: item.image || shuffledImages[idx % shuffledImages.length]
      }));

      setCurrentStories(curiosityStories);
    }

    stories.setStoryStartIndex(0);
    modals.setIsStoryOpen(true);
  }, [activeEvents, tips, curiosities, formatFriendlyDate, stories, modals]);

  // Emergency Logic
  const [openEmergency, setOpenEmergency] = React.useState(false);
  const emergencyRef = React.useRef<HTMLDivElement>(null);

  const handleEmergencyClick = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    setOpenEmergency(false);
    setTimeout(() => {
      setOpenEmergency(true);
      setTimeout(() => {
        emergencyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 50);
  }, []);

  // Security Logic (from API)
  const currentWifiPass = config.wifiPass || "Disponível no check-in";
  const currentWifiSSID = appSettings?.wifiSSID || "Flat_Petrolina_5G";
  const currentSafeCode = appSettings?.safeCode || config.safeCode || '----';

  return (
    <div className={`min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300 text-sm relative`}>

      <GuestHeader
        appSettings={appSettings}
        config={config}
        dismissedAlerts={dismissedAlerts}
        onDismissAlert={dismissAlert}
      />

      {/* MODAIS */}
      {/* ... (modals remain the same) ... */}
      <CheckinModal
        isOpen={modals.isCheckinModalOpen}
        onClose={() => modals.setIsCheckinModalOpen(false)}
        safeCode={currentSafeCode}
        lockCode={config.lockCode}
        isPasswordReleased={isPasswordReleased}
        onOpenVideo={video.openVideoModal}
      />

      <CheckoutModal
        isOpen={modals.isCheckoutModalOpen}
        onClose={checkout.handleCloseCheckout}
        config={config}
        startOnKeyDetails={checkout.startOnKeyDetails}
      />

      <OfflineCardModal
        isOpen={modals.showOfflineCard}
        onClose={() => modals.setShowOfflineCard(false)}
        config={config}
        wifiSSID={currentWifiSSID}
        wifiPass={currentWifiPass}
        safeCode={currentSafeCode}
        isPasswordReleased={isPasswordReleased}
        address={flatAddress}
      />

      <DriverModeModal
        isOpen={modals.showDriverMode}
        onClose={() => modals.setShowDriverMode(false)}
        address={flatAddress}
      />

      <VideoModal
        isOpen={modals.showVideoModal}
        onClose={() => modals.setShowVideoModal(false)}
        videoUrl={video.currentVideoUrl}
        isVertical={video.isVideoVertical}
      />

      <SupportModal
        isOpen={modals.isSupportModalOpen}
        onClose={() => modals.setIsSupportModalOpen(false)}
        guestName={config.guestName}
        hostPhone={appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone}
      />

      <StoryViewer
        isOpen={modals.isStoryOpen}
        onClose={() => modals.setIsStoryOpen(false)}
        items={currentStories}
        startIndex={stories.storyStartIndex}
      />

      {/* HERO SECTION */}
      <HeroSection
        config={config}
        heroSlides={property.assets.heroSlides}
        theme={theme}
        toggleTheme={toggleTheme}
        currentLang={currentLang}
        toggleLanguage={toggleLanguage}
      />

      {/* STORIES BAR */}
      <StoriesBar
        activeEvents={activeEvents}
        onOpenStory={handleOpenStories}
        showTips={tips.length > 0}
      />

      {/* --- LAYOUT PRINCIPAL (GRID + MASONRY) --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-5 relative z-30 mt-2">

        {/* GRID SUPERIOR: ACESSO RÁPIDO + SMART SUGGESTION + LOCALIZAÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* COLUNA 1: ACESSO RÁPIDO */}
          <div className="h-full">
            <div className="p-0.5 rounded-[22px] bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 shadow-2xl shadow-orange-500/20 dark:shadow-black/50 h-full">
              <div className="bg-white dark:bg-gray-800 rounded-[20px] p-5 flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center px-1">
                  <h2 className="text-[10px] font-heading font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-[0.15em]">Acesso Rápido</h2>
                  <div className="flex gap-2">
                    {stayStage !== 'pre_checkin' && (
                      <button onClick={handleEmergencyClick} aria-label="Acionar emergência" className="text-[10px] font-bold text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 px-3 py-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-sans shadow-sm min-h-[32px]">
                        <Siren size={12} /> SOS
                      </button>
                    )}
                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); modals.setShowOfflineCard(true); }} className="text-[10px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-sans shadow-sm min-h-[32px]">
                      Salvar Acesso
                    </button>
                  </div>
                </div>

                {/* CARD DINÂMICO (CHECKIN/WIFI/ADDRESS) */}
                <div className="flex flex-col gap-4 flex-1">
                  <div className="bg-orange-50/80 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800/30 flex flex-col w-full overflow-hidden transition-all duration-500 min-h-[160px] justify-center flex-1">
                    <GuestStatusCard
                      stayStage={stayStage}
                      isTimeVerified={isTimeVerified}
                      isPasswordReleased={isPasswordReleased}
                      config={config}
                      wifiCopied={clipboard.wifiCopied}
                      addressCopied={clipboard.addressCopied}
                      currentWifiSSID={currentWifiSSID}
                      currentWifiPass={currentWifiPass}
                      onOpenCheckin={() => modals.setIsCheckinModalOpen(true)}
                      onOpenCheckout={() => modals.setIsCheckoutModalOpen(true)}
                      onCopyWifi={() => clipboard.copyToClipboard(currentWifiPass, 'wifi')}

                      onCopyAddress={() => clipboard.copyToClipboard(flatAddress, 'address')}
                      onOpenDriverMode={() => modals.setShowDriverMode(true)}
                      formatFriendlyDate={formatFriendlyDate}
                      isSingleNight={isSingleNight}
                      isCheckoutToday={isCheckoutToday}
                      onOpenSupport={() => modals.setIsSupportModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: SMART SUGGESTION + LOCALIZAÇÃO */}
          <div className="flex flex-col gap-6">
            <SmartSuggestion
              stayStage={stayStage}
              onCheckoutClick={() => modals.setIsCheckoutModalOpen(true)}
              isTimeVerified={isTimeVerified}
              customSuggestions={smartSuggestions}
              places={dynamicPlaces}
              activeEvents={activeEvents}
            />

            {/* CARD DE LOCALIZAÇÃO */}
            <div className="bg-white dark:bg-gray-800 rounded-[24px] p-1 shadow-sm border border-gray-100 dark:border-gray-700/50 flex-1 min-h-[140px] flex flex-col">
              <div className="flex-1 rounded-[20px] bg-purple-50/50 dark:bg-gray-700/30 border border-purple-100 dark:border-gray-600/30 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <button
                  onClick={() => modals.setShowDriverMode(true)}
                  aria-label="Expandir mapa"
                  className="absolute top-3 right-3 text-purple-300 dark:text-purple-900/40 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                >
                  <Maximize2 size={14} />
                </button>
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform"><MapPin size={20} /></div>
                <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Localização</h3>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 max-w-[280px] leading-snug mb-3">{flatAddress}</p>

                <button onClick={() => clipboard.copyToClipboard(flatAddress, 'address')} aria-label="Copiar endereço" className="mb-4 px-4 py-1.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-full border border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors shadow-sm">
                  {clipboard.addressCopied ? 'Copiado!' : 'Toque p/ Copiar'}
                </button>

                <div className="flex gap-3 w-full justify-center">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(flatAddress)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ExternalLink size={14} /> Abrir Mapa
                  </a>
                  <button onClick={() => video.openVideoModal(DRONE_VIDEO_URL, false)} className="flex-1 py-2.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-xl shadow-md shadow-purple-200 dark:shadow-none hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                    <Video size={14} /> Ver do Alto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMENDAÇÕES (ACCORDIONS) */}
        <GuestRecommendations
          mergePlaces={mergePlaces}
          hasContent={hasContent}
          activeEvents={activeEvents}
          openEmergency={openEmergency}
          emergencyRef={emergencyRef}
        />

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-2xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4"><Star size={120} /></div>
          {property.features.hasReviews && (
            <>
              <h3 className="text-xl font-heading font-bold mb-2">Sua opinião vale ouro! ⭐</h3>
              <p className="text-blue-50 text-sm mb-6 leading-relaxed font-medium opacity-90">Olá, {config.guestName}! Espero que tenha amado a estadia. Se puder deixar uma avaliação rápida no Google, ajuda muito o nosso trabalho!</p>
              <a href={property.googleReviewLink || GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer" className="bg-white text-blue-700 font-bold py-3.5 px-6 rounded-xl inline-flex items-center gap-2.5 hover:bg-blue-50 transition-colors shadow-lg w-full justify-center sm:w-auto font-sans text-sm active:scale-[0.98]"><Star size={18} className="fill-yellow-400 text-yellow-400" /> Avaliar no Google</a>
            </>
          )}
        </div>
      </div>

      <ChatWidget guestName={config.guestName} systemInstruction={appSettings?.aiSystemPrompt || property.ai.systemPrompt} />

      <SupportModal
        isOpen={modals.isSupportModalOpen}
        onClose={() => modals.setIsSupportModalOpen(false)}
        guestName={config.guestName}
        hostPhone={appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone}
      />
    </div>
  );
};

export default GuestView;