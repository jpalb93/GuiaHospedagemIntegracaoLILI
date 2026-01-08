import React, { useEffect, useCallback, useMemo } from 'react';
import { triggerConfetti } from '../utils/confetti';
import { GuestConfig } from '../types';
import { useGuestStay } from '../hooks/useGuestStay';
import { useGuestData } from '../hooks/useGuestData';
import { useGuestUI } from '../hooks/useGuestUI';
import { useLanguage } from '../hooks/useLanguage';
import { usePullToRefresh } from '../hooks/usePullToRefresh';

import { motion, Variants } from 'framer-motion';

// Components
import HeroSection from './guest/HeroSection';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};
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
import PullRefreshIndicator from './ui/PullRefreshIndicator';

import { CURIOSITY_STORY_IMAGES, DRONE_VIDEO_URL } from '../constants';
import { PROPERTIES } from '../config/properties';
import {
    CalendarHeart,
    Sparkles,
    MapPin,
    ExternalLink,
    Video,
    Star,
    Maximize2,
} from 'lucide-react';
import { getIcon } from '../utils/iconMap';
import SmartSuggestion from './SmartSuggestion';
// Lazy load ChatWidget for better performance
const ChatWidget = React.lazy(() => import('./ChatWidget'));
import { GOOGLE_REVIEW_LINK } from '../constants';

interface GuestViewProps {
    config: GuestConfig;
}

const GuestView: React.FC<GuestViewProps> = ({ config }) => {
    // Hooks
    const { stayStage, isTimeVerified, isPasswordReleased, isSingleNight, isCheckoutToday } =
        useGuestStay(config);
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
        curiosities,
    } = useGuestData(config);

    const { modals, video, checkout, stories, clipboard } = useGuestUI();

    // State local para idioma (agora via hook)
    const { t, currentLang, toggleLanguage } = useLanguage();

    // Pull to  refresh
    const pullToRefresh = usePullToRefresh({
        threshold: 80,
        onRefresh: async () => {
            // Simple refresh - reload the page
            window.location.reload();
        },
    });

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
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        const today = localDate.toISOString().split('T')[0];

        const filtered = events
            .filter((event) => {
                if (!event.eventDate) return true;
                const expiryDate = event.eventEndDate || event.eventDate;
                return expiryDate >= today;
            })
            .sort((a, b) => {
                const dateA = a.eventDate || '9999-99-99';
                const dateB = b.eventDate || '9999-99-99';
                return dateA.localeCompare(dateB);
            });

        console.log(
            '[GuestView] Calculated activeEvents:',
            filtered.length,
            'from total events:',
            events.length
        );
        return filtered;
    }, [mergePlaces]);

    // Lógica de Stories (ainda um pouco acoplada, mas simplificada)
    const [currentStories, setCurrentStories] = React.useState<StoryItem[]>([]);
    const [currentStoriesType, setCurrentStoriesType] = React.useState<
        'agenda' | 'curiosities' | 'tips' | null
    >(null);

    const handleOpenStories = useCallback(
        (type: 'agenda' | 'curiosities' | 'tips') => {
            setCurrentStoriesType(type);
            if (navigator.vibrate) navigator.vibrate(50);
            if (type === 'agenda') {
                const eventStories: StoryItem[] = activeEvents.map((evt) => {
                    const startDate = evt.eventDate ? formatFriendlyDate(evt.eventDate) : '';
                    const endDate = evt.eventEndDate ? formatFriendlyDate(evt.eventEndDate) : '';

                    let subtitle = startDate;
                    if (endDate) subtitle += ` até ${endDate}`;
                    if (evt.eventTime) subtitle += ` • ${evt.eventTime}`;

                    return {
                        id: evt.id || evt.name,
                        type: 'event',
                        title: evt.name,
                        title_en: evt.name_en,
                        title_es: evt.name_es, // Sync
                        subtitle: subtitle || 'Em breve',
                        subtitle_en: subtitle, // Date
                        subtitle_es: subtitle, // Date
                        content: evt.description,
                        content_en: evt.description_en,
                        content_es: evt.description_es, // Sync
                        image: evt.imageUrl,
                        link: evt.orderLink,
                        icon: CalendarHeart,
                        address: evt.address,
                    };
                });
                setCurrentStories(eventStories);
            } else if (type === 'tips') {
                // Mapeia as dicas dinâmicas para o formato de StoryItem
                const tipStories: StoryItem[] = tips.map((tip) => ({
                    id: tip.id || tip.title,
                    type: tip.type,
                    title: tip.title,
                    title_en: tip.title_en,
                    title_es: tip.title_es, // Sync
                    subtitle: tip.subtitle,
                    subtitle_en: tip.subtitle_en,
                    subtitle_es: tip.subtitle_es, // Sync
                    content: tip.content,
                    content_en: tip.content_en,
                    content_es: tip.content_es, // Sync
                    image: tip.image,
                    icon: getIcon(tip.iconName), // Mapeia string -> Componente
                    color: 'from-blue-800 to-blue-900', // Cor padrão ou vinda do banco se tiver
                }));
                setCurrentStories(tipStories);
            } else {
                // Usa as curiosidades dinâmicas (do banco ou fallback)
                const sourceCuriosities = curiosities && curiosities.length > 0 ? curiosities : []; // Fallback vazio

                const shuffled = [...sourceCuriosities].sort(() => 0.5 - Math.random()).slice(0, 5);
                const shuffledImages = [...CURIOSITY_STORY_IMAGES].sort(() => 0.5 - Math.random());

                const curiosityStories: StoryItem[] = shuffled.map((item, idx) => ({
                    id: item.id || `curiosity-${idx}`, // Prefer ID if available (self-healed)
                    type: 'curiosity',
                    title: 'Você Sabia?',
                    title_en: 'Did You Know?',
                    title_es: '¿Sabías Qué?', // Static translation
                    subtitle: 'Curiosidade de Petrolina',
                    subtitle_en: 'Curiosity about Petrolina',
                    subtitle_es: 'Curiosidad sobre Petrolina', // Static translation
                    content: item.text,
                    content_en: item.text_en,
                    content_es: item.text_es, // Sync dynamic content
                    icon: Sparkles,
                    image: item.image || shuffledImages[idx % shuffledImages.length],
                }));
                setCurrentStories(curiosityStories);
            }

            stories.setStoryStartIndex(0);
            modals.setIsStoryOpen(true);
        },
        [activeEvents, tips, curiosities, formatFriendlyDate, stories, modals]
    );

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
    const currentWifiPass = config.wifiPass || 'Disponível no check-in';
    const currentWifiSSID = appSettings?.wifiSSID || 'Flat_Petrolina_5G';
    const currentSafeCode = appSettings?.safeCode || config.safeCode || '----';

    return (
        <div
            className={`min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300 text-sm relative`}
        >
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
                hostPhone={
                    appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone
                }
                propertyId={config.propertyId}
            />

            <StoryViewer
                isOpen={modals.isStoryOpen}
                onClose={() => modals.setIsStoryOpen(false)}
                items={currentStories}
                startIndex={stories.storyStartIndex}
                // Adiciona música apenas para as Dicas/Curiosidades
                audioSrc={currentStoriesType === 'curiosities' ? '/music/juazeiro.mp3' : undefined}
            />

            {/* Pull to Refresh Indicator */}
            <PullRefreshIndicator
                pullDistance={pullToRefresh.pullDistance}
                isRefreshing={pullToRefresh.isRefreshing}
                progress={pullToRefresh.progress}
            />

            {/* HERO SECTION */}
            <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                <HeroSection
                    config={config}
                    heroSlides={heroImages.length > 0 ? heroImages : property.assets.heroSlides}
                    currentLang={currentLang}
                    toggleLanguage={toggleLanguage}
                />
            </div>

            {/* STORIES BAR */}
            {/* DEBUG LOG: {console.log(...)} */}
            <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
                <StoriesBar
                    activeEvents={activeEvents}
                    onOpenStory={handleOpenStories}
                    showTips={tips.length > 0}
                />
            </div>

            {/* --- LAYOUT PRINCIPAL (GRID + MASONRY) --- */}
            <motion.div
                className="max-w-5xl mx-auto px-4 sm:px-5 relative z-30 mt-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* GRID SUPERIOR: ACESSO RÁPIDO + SMART SUGGESTION + LOCALIZAÇÃO */}
                <motion.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
                    variants={itemVariants}
                >
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
                    <div
                        className="flex flex-col gap-6 animate-fade-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        <SmartSuggestion
                            stayStage={stayStage}
                            onCheckoutClick={() => modals.setIsCheckoutModalOpen(true)}
                            isTimeVerified={isTimeVerified}
                            customSuggestions={smartSuggestions}
                            places={dynamicPlaces}
                            activeEvents={activeEvents}
                        />

                        {/* CARD DE LOCALIZAÇÃO */}
                        <div
                            className={`${stayStage === 'pre_checkin' ? 'flex' : 'hidden lg:flex'} bg-white dark:bg-gray-800 rounded-[24px] p-1 shadow-sm border border-gray-100 dark:border-gray-700/50 flex-1 min-h-[140px] flex-col`}
                        >
                            <div className="flex-1 rounded-[20px] bg-purple-50/50 dark:bg-gray-700/30 border border-purple-100 dark:border-gray-600/30 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                <button
                                    onClick={() => modals.setShowDriverMode(true)}
                                    aria-label="Expandir mapa"
                                    className="absolute top-3 right-3 text-purple-300 dark:text-purple-900/40 hover:text-purple-500 dark:hover:text-purple-400 transition-colors"
                                >
                                    <Maximize2 size={14} />
                                </button>
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                    <MapPin size={20} />
                                </div>
                                <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">
                                    {t('Localização', 'Location')}
                                </h3>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 max-w-[280px] leading-snug mb-3">
                                    {flatAddress}
                                </p>

                                <button
                                    onClick={(e) => {
                                        triggerConfetti(e.currentTarget as HTMLElement);
                                        clipboard.copyToClipboard(flatAddress, 'address');
                                    }}
                                    aria-label="Copiar endereço"
                                    className="mb-4 px-4 py-1.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-full border border-purple-100 dark:border-purple-900/30 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 transition-all shadow-sm"
                                >
                                    {clipboard.addressCopied
                                        ? t('Copiado!', 'Copied!')
                                        : t('Toque p/ Copiar', 'Tap to Copy')}
                                </button>

                                <div className="flex gap-3 w-full justify-center">
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(flatAddress)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-2.5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wide rounded-xl border border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <ExternalLink size={14} /> {t('Abrir Mapa', 'Open Map')}
                                    </a>
                                    <button
                                        onClick={() => video.openVideoModal(DRONE_VIDEO_URL, false)}
                                        className="flex-1 py-2.5 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-xl shadow-md shadow-purple-200 dark:shadow-none hover:bg-purple-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Video size={14} /> {t('Ver do Alto', 'Drone View')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* RECOMENDAÇÕES (ACCORDIONS) */}
                <motion.div variants={itemVariants}>
                    <GuestRecommendations
                        mergePlaces={mergePlaces}
                        hasContent={hasContent}
                        activeEvents={activeEvents}
                        openEmergency={openEmergency}
                        emergencyRef={emergencyRef}
                        propertyId={config.propertyId || 'lili'}
                        places={dynamicPlaces}
                    />
                </motion.div>

                <motion.div
                    className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[24px] p-6 text-white shadow-2xl shadow-blue-900/20 mb-8 relative overflow-hidden border border-white/10"
                    variants={itemVariants}
                >
                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                        <Star size={120} />
                    </div>
                    {property.features.hasReviews && (
                        <>
                            <h3 className="text-xl font-heading font-bold mb-2">
                                {t('Sua opinião vale ouro! ⭐', 'Your opinion is gold! ⭐')}
                            </h3>
                            <p className="text-blue-50 text-sm mb-6 leading-relaxed font-medium opacity-90">
                                {t('Olá', 'Hello')}, {config.guestName}!{' '}
                                {t(
                                    'Espero que tenha amado a estadia. Se puder deixar uma avaliação rápida no Google, ajuda muito o nosso trabalho!',
                                    'Hope you loved your stay. Leaving a quick review on Google helps us a lot!'
                                )}
                            </p>
                            <motion.a
                                href={property.googleReviewLink || GOOGLE_REVIEW_LINK}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white text-blue-700 font-bold py-3.5 px-6 rounded-xl inline-flex items-center gap-2.5 hover:bg-blue-50 transition-all shadow-lg w-full justify-center sm:w-auto font-sans text-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Star size={18} className="fill-yellow-400 text-yellow-400" />{' '}
                                {t('Avaliar no Google', 'Rate on Google', 'Calificar en Google')}
                            </motion.a>
                        </>
                    )}
                </motion.div>
            </motion.div>

            <div className="animate-fade-up" style={{ animationDelay: '700ms' }}>
                {/* CORREÇÃO: Lógica de seleção do prompt para evitar misturar personas */}
                <React.Suspense
                    fallback={
                        <div className="h-14 w-14 rounded-full bg-white/10 animate-pulse fixed bottom-4 right-4" />
                    }
                >
                    <ChatWidget
                        guestName={config.guestName}
                        systemInstruction={(() => {
                            const propId = config.propertyId || 'lili';

                            // 1. Tenta pegar a configuração específica da propriedade
                            let finalPrompt = appSettings?.aiSystemPrompts?.[propId];

                            // 2. Se for a Lili e não tiver específico, tenta o campo legado (global)
                            if (!finalPrompt && propId === 'lili') {
                                finalPrompt = appSettings?.aiSystemPrompt;
                            }

                            // 3. Verifica se temos traduções (se o usuário estiver em outro idioma)
                            if (currentLang === 'en' && appSettings?.aiSystemPrompt_en) {
                                return appSettings.aiSystemPrompt_en;
                            } else if (currentLang === 'es' && appSettings?.aiSystemPrompt_es) {
                                return appSettings.aiSystemPrompt_es;
                            }

                            // 4. Se o prompt encontrado for vazio ou apenas espaços, usa o Default do código (properties.ts)
                            // Isso previne que um save vazio quebre a IA
                            if (!finalPrompt || !finalPrompt.trim()) {
                                finalPrompt = property.ai.systemPrompt;
                            }

                            return finalPrompt;
                        })()}
                    />
                </React.Suspense>
            </div>

            <SupportModal
                isOpen={modals.isSupportModalOpen}
                onClose={() => modals.setIsSupportModalOpen(false)}
                guestName={config.guestName}
                hostPhone={
                    appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone
                }
                propertyId={config.propertyId}
            />
        </div>
    );
};

export default GuestView;
