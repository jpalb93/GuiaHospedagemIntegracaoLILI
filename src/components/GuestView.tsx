import React, { useEffect, useCallback, useMemo } from 'react';
import { triggerConfetti } from '../utils/confetti';
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
import { CalendarHeart, Sparkles, MapPin, ExternalLink, Video, Star, Maximize2 } from 'lucide-react';
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
    heroImages,
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

      <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
        <GuestHeader
          appSettings={appSettings}
          config={config}
          dismissedAlerts={dismissedAlerts}
          onDismissAlert={dismissAlert}
        />
      </div>

      {/* MODAIS */}
      {/* ... (modals remain the same) ... */}
      <CheckinModal
        isOpen={modals.isCheckinModalOpen}
        onClose={() => modals.setIsCheckinModalOpen(false)}
        safeCode={currentSafeCode}
        lockCode={config.lockCode}
        isPasswordReleased={isPasswordReleased}
        onOpenVideo={video.openVideoModal}
        propertyId={config.propertyId}
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
        propertyId={config.propertyId}
      />

      <StoryViewer
        isOpen={modals.isStoryOpen}
        onClose={() => modals.setIsStoryOpen(false)}
        items={currentStories}
        startIndex={stories.storyStartIndex}
      />

      {/* HERO SECTION */}
      <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
        <HeroSection
          config={config}
          heroSlides={heroImages.length > 0 ? heroImages : property.assets.heroSlides}
          theme={theme}
          toggleTheme={toggleTheme}
          currentLang={currentLang}
          toggleLanguage={toggleLanguage}
        />
      </div>

      {/* STORIES BAR */}
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <StoriesBar
          activeEvents={activeEvents}
          onOpenStory={handleOpenStories}
          showTips={tips.length > 0}
        />
      </div>

      {/* --- LAYOUT PRINCIPAL (GRID + MASONRY) --- */}
      <div className="max-w-5xl mx-auto px-4 sm:px-5 relative z-30 mt-2">

        {/* GRID SUPERIOR: ACESSO RÁPIDO + SMART SUGGESTION + LOCALIZAÇÃO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          <div className="h-full animate-fade-up" style={{ animationDelay: '300ms' }}>
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
              onEmergency={handleEmergencyClick}
              onSaveAccess={() => modals.setShowOfflineCard(true)}
            />
          </div>


          {/* COLUNA 2: SMART SUGGESTION + LOCALIZAÇÃO */}
          <div className="flex flex-col gap-6 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <SmartSuggestion
              stayStage={stayStage}
              onCheckoutClick={() => modals.setIsCheckoutModalOpen(true)}
              isTimeVerified={isTimeVerified}
              customSuggestions={smartSuggestions}
              places={dynamicPlaces}
              activeEvents={activeEvents}
            />

            {/* CARD DE LOCALIZAÇÃO */}
            <div className={`${stayStage === 'pre_checkin' ? 'flex' : 'hidden lg:flex'} bg-white dark:bg-gray-800 rounded-[24px] p-1 shadow-sm border border-gray-100 dark:border-gray-700/50 flex-1 min-h-[140px] flex-col`}>
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

                <button onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); clipboard.copyToClipboard(flatAddress, 'address'); }} aria-label="Copiar endereço" className="mb-4 px-4 py-1.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-full border border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 transition-all shadow-sm">
                  {clipboard.addressCopied ? 'Copiado!' : 'Toque p/ Copiar'}
                </button>

                <div className="flex gap-3 w-full justify-center">
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(flatAddress)}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm">
                    <ExternalLink size={14} /> Abrir Mapa
                  </a>
                  <button onClick={() => video.openVideoModal(DRONE_VIDEO_URL, false)} className="flex-1 py-2.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-xl shadow-md shadow-purple-200 dark:shadow-none hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Video size={14} /> Ver do Alto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMENDAÇÕES (ACCORDIONS) */}
        <div className="animate-fade-up" style={{ animationDelay: '500ms' }}>
          <GuestRecommendations
            mergePlaces={mergePlaces}
            hasContent={hasContent}
            activeEvents={activeEvents}
            openEmergency={openEmergency}
            emergencyRef={emergencyRef}
            propertyId={config.propertyId || 'lili'}
          />
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-2xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-white/10 animate-fade-up" style={{ animationDelay: '600ms' }}>
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4"><Star size={120} /></div>
          {property.features.hasReviews && (
            <>
              <h3 className="text-xl font-heading font-bold mb-2">Sua opinião vale ouro! ⭐</h3>
              <p className="text-blue-50 text-sm mb-6 leading-relaxed font-medium opacity-90">Olá, {config.guestName}! Espero que tenha amado a estadia. Se puder deixar uma avaliação rápida no Google, ajuda muito o nosso trabalho!</p>
              <a href={property.googleReviewLink || GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer" className="bg-white text-blue-700 font-bold py-3.5 px-6 rounded-xl inline-flex items-center gap-2.5 hover:bg-blue-50 transition-all shadow-lg w-full justify-center sm:w-auto font-sans text-sm active:scale-95"><Star size={18} className="fill-yellow-400 text-yellow-400" /> Avaliar no Google</a>
            </>
          )}
        </div>
      </div>

      <div className="animate-fade-up" style={{ animationDelay: '700ms' }}>
        {/* CORREÇÃO: Lógica de seleção do prompt para evitar misturar personas */}
        <ChatWidget
          guestName={config.guestName}
          systemInstruction={(() => {
            const propId = config.propertyId || 'lili';
            // 1. Tenta pegar a configuração específica da propriedade (NOVO PADRÃO)
            const specificPrompt = appSettings?.aiSystemPrompts?.[propId];
            if (specificPrompt) return specificPrompt;

            // 2. Se for a Lili, aceita o fallback para o campo antigo (LEGADO)
            if (propId === 'lili') {
              return appSettings?.aiSystemPrompt || property.ai.systemPrompt;
            }

            // 3. Se for outra propriedade e não tiver config específica, usa o hardcoded do código
            return property.ai.systemPrompt;
          })()}
        />

      </div>

      <SupportModal
        isOpen={modals.isSupportModalOpen}
        onClose={() => modals.setIsSupportModalOpen(false)}
        guestName={config.guestName}
        hostPhone={appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone}
        propertyId={config.propertyId}
      />
    </div >
  );
};

export default GuestView;