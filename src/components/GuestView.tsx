import React, { useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { triggerConfetti } from '../utils/confetti';
import { getFirstName } from '../utils/helpers';
import { GuestConfig } from '../types';
import { useGuestStay } from '../hooks/useGuestStay';
import { useGuestData } from '../hooks/useGuestData';
import { useGuestUI } from '../hooks/useGuestUI';
import { useLanguage } from '../hooks/useLanguage';
import { useDesktopGuestLayout } from '../hooks/useDesktopGuestLayout';
import DesktopGuestGuide from './guest/desktop/DesktopGuestGuide';

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
import StoryViewer, { StoryItem } from './StoryViewer';

// Modais
import CheckinModal from './modals/CheckinModal';
import CheckoutModal from './modals/CheckoutModal';
import OfflineCardModal from './modals/OfflineCardModal';
import DriverModeModal from './modals/DriverModeModal';
import VideoModal from './modals/VideoModal';
import SupportModal from './modals/SupportModal';

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
import logoEximus from '../assets/logo-eximus.png';

interface GuestViewProps {
    config: GuestConfig;
}

const GuestView: React.FC<GuestViewProps> = ({ config }) => {
    const isDesktop = useDesktopGuestLayout();
    // Hooks
    const { stayStage, isTimeVerified, isPasswordReleased, isSingleNight, isCheckoutToday } =
        useGuestStay(config);
    const property = PROPERTIES[config.propertyId || 'lili'];
    const desktopAccessReleased =
        isPasswordReleased &&
        config.isReleased !== false &&
        !config.manualDeactivation &&
        stayStage !== 'post_checkout';
    const flatAddress = property.address;
    const isIntegracao = config.propertyId === 'integracao';

    const {
        appSettings,
        loadingSettings,
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

    const { t, currentLang, toggleLanguage } = useLanguage();

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

        return filtered;
    }, [mergePlaces]);

    // Lógica de Stories
    const [currentStories, setCurrentStories] = React.useState<StoryItem[]>([]);
    const [currentStoriesType, setCurrentStoriesType] = React.useState<
        'agenda' | 'curiosities' | 'tips' | null
    >(null);

    const handleOpenStories = useCallback(
        (type: 'agenda' | 'curiosities' | 'tips') => {
            setCurrentStoriesType(type);
            if (navigator.vibrate) navigator.vibrate(50);
            if (type === 'agenda') {
                const eligibleEvents = isDesktop
                    ? activeEvents.filter(
                          (event) =>
                              !event.propertyId ||
                              event.propertyId === 'all' ||
                              event.propertyId === property.id
                      )
                    : activeEvents;
                const eventStories: StoryItem[] = eligibleEvents.map((evt) => {
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
                        title_es: evt.name_es,
                        subtitle: subtitle || 'Em breve',
                        subtitle_en: subtitle,
                        subtitle_es: subtitle,
                        content: evt.description,
                        content_en: evt.description_en,
                        content_es: evt.description_es,
                        image: evt.imageUrl,
                        link: evt.orderLink,
                        icon: CalendarHeart,
                        address: evt.address,
                    };
                });
                setCurrentStories(eventStories);
            } else if (type === 'tips') {
                const eligibleTips = isDesktop
                    ? tips.filter(
                          (tip) =>
                              !tip.propertyId ||
                              tip.propertyId === 'all' ||
                              tip.propertyId === property.id
                      )
                    : tips;
                const tipStories: StoryItem[] = eligibleTips.map((tip) => ({
                    id: tip.id || tip.title,
                    type: tip.type,
                    title: tip.title,
                    title_en: tip.title_en,
                    title_es: tip.title_es,
                    subtitle: tip.subtitle,
                    subtitle_en: tip.subtitle_en,
                    subtitle_es: tip.subtitle_es,
                    content: tip.content,
                    content_en: tip.content_en,
                    content_es: tip.content_es,
                    image: tip.image,
                    icon: getIcon(tip.iconName),
                    color: 'from-[#C85A32] to-[#7C2D12]',
                }));
                setCurrentStories(tipStories);
            } else {
                const sourceCuriosities = curiosities && curiosities.length > 0 ? curiosities : [];

                const shuffled = [...sourceCuriosities].sort(() => 0.5 - Math.random()).slice(0, 5);
                const shuffledImages = [...CURIOSITY_STORY_IMAGES].sort(() => 0.5 - Math.random());

                const curiosityStories: StoryItem[] = shuffled.map((item, idx) => ({
                    id: item.id || `curiosity-${idx}`,
                    type: 'curiosity',
                    title: 'Você Sabia?',
                    title_en: 'Did You Know?',
                    title_es: '¿Sabías Qué?',
                    subtitle: 'Curiosidade de Petrolina',
                    subtitle_en: 'Curiosity about Petrolina',
                    subtitle_es: 'Curiosidad sobre Petrolina',
                    content: item.text,
                    content_en: item.text_en,
                    content_es: item.text_es,
                    icon: Sparkles,
                    image: item.image || shuffledImages[idx % shuffledImages.length],
                }));
                setCurrentStories(curiosityStories);
            }

            stories.setStoryStartIndex(0);
            modals.setIsStoryOpen(true);
        },
        [
            activeEvents,
            tips,
            curiosities,
            formatFriendlyDate,
            stories,
            modals,
            isDesktop,
            property.id,
        ]
    );

    // Emergency & Requested Sheet Logic
    const [openEmergency, setOpenEmergency] = React.useState(false);
    const [requestedSheet, setRequestedSheet] = React.useState<string | null>(null);
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
    const currentWifiSSID = appSettings?.wifiSSID || (loadingSettings ? '' : 'Flat_Petrolina_5G');
    const currentSafeCode = appSettings?.safeCode || config.safeCode || '----';
    const currentHostPhone =
        appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone;

    return (
        <div
            className={`min-h-screen pb-20 bg-[#FAF7F2] dark:bg-[#120F0D] font-sans text-stone-900 dark:text-stone-100 selection:bg-orange-100 selection:text-orange-900 transition-colors duration-300 text-sm relative`}
        >
            <Helmet>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="animate-fade-up" style={{ animationDelay: '0ms' }}>
                <GuestHeader
                    appSettings={appSettings}
                    config={config}
                    dismissedAlerts={dismissedAlerts}
                    onDismissAlert={dismissAlert}
                />
            </div>

            {/* MODAIS */}
            <CheckinModal
                isOpen={modals.isCheckinModalOpen}
                onClose={() => modals.setIsCheckinModalOpen(false)}
                safeCode={currentSafeCode}
                lockCode={config.lockCode}
                isPasswordReleased={isDesktop ? desktopAccessReleased : isPasswordReleased}
                onOpenVideo={video.openVideoModal}
                propertyId={config.propertyId}
                flatNumber={config.flatNumber}
            />

            <CheckoutModal
                isOpen={modals.isCheckoutModalOpen}
                onClose={checkout.handleCloseCheckout}
                config={config}
                startOnKeyDetails={checkout.startOnKeyDetails}
                hostPhone={
                    appSettings?.hostPhones?.[config.propertyId || 'lili'] || property.hostPhone
                }
            />

            <OfflineCardModal
                isOpen={modals.showOfflineCard}
                onClose={() => modals.setShowOfflineCard(false)}
                config={config}
                wifiSSID={currentWifiSSID}
                wifiPass={currentWifiPass}
                safeCode={currentSafeCode}
                isPasswordReleased={isDesktop ? desktopAccessReleased : isPasswordReleased}
                address={flatAddress}
            />

            <DriverModeModal
                isOpen={modals.showDriverMode}
                onClose={() => modals.setShowDriverMode(false)}
                address={flatAddress}
                propertyId={config.propertyId || 'lili'}
                flatNumber={config.flatNumber}
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
                flatNumber={config.flatNumber}
            />

            <StoryViewer
                isOpen={modals.isStoryOpen}
                onClose={() => modals.setIsStoryOpen(false)}
                items={currentStories}
                startIndex={stories.storyStartIndex}
                audioSrc={currentStoriesType === 'curiosities' ? '/music/juazeiro.mp3' : undefined}
            />

            {isDesktop ? (
                <DesktopGuestGuide
                    config={config}
                    stayStage={stayStage}
                    isPasswordReleased={desktopAccessReleased}
                    wifiSSID={currentWifiSSID}
                    wifiPass={currentWifiPass}
                    safeCode={currentSafeCode}
                    loadingWifi={loadingSettings}
                    heroImage={heroImages[0] || property.assets.heroImage}
                    places={dynamicPlaces}
                    activeEvents={activeEvents}
                    hasTips={tips.some(
                        (tip) =>
                            !tip.propertyId ||
                            tip.propertyId === 'all' ||
                            tip.propertyId === property.id
                    )}
                    isTimeVerified={isTimeVerified}
                    smartSuggestions={smartSuggestions}
                    hostPhone={currentHostPhone}
                    onCheckin={() => modals.setIsCheckinModalOpen(true)}
                    onCheckout={() => modals.setIsCheckoutModalOpen(true)}
                    onSupport={() => modals.setIsSupportModalOpen(true)}
                    onDriver={() => modals.setShowDriverMode(true)}
                    onSaveAccess={() => modals.setShowOfflineCard(true)}
                    onKeyDetails={checkout.handleOpenKeyDetails}
                    onStories={handleOpenStories}
                />
            ) : (
                <>
                    {/* HERO SECTION */}
                    <div className="animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <HeroSection
                            config={config}
                            heroSlides={
                                heroImages.length > 0 ? heroImages : property.assets.heroSlides
                            }
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

                    {/* --- LAYOUT PRINCIPAL (MASTER-DETAIL NO DESKTOP XL, FLUID STACK NO MOBILE) --- */}
                    <motion.div
                        className="max-w-5xl xl:max-w-7xl mx-auto px-4 sm:px-5 relative z-30 mt-2 pb-32 sm:pb-36"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="xl:flex xl:items-start xl:gap-8">
                            {/* FEED / CONTEÚDO PRINCIPAL */}
                            <div className="flex-1 min-w-0 space-y-8">
                                {/* GRID SUPERIOR APENAS EM MOBILE E TABLET (< xl) */}
                                <div className="xl:hidden">
                                    <motion.div
                                        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                                        variants={itemVariants}
                                    >
                                        <div
                                            className="h-full animate-fade-up"
                                            style={{ animationDelay: '300ms' }}
                                        >
                                            <GuestStatusCard
                                                stayStage={stayStage}
                                                isTimeVerified={isTimeVerified}
                                                isPasswordReleased={isPasswordReleased}
                                                config={config}
                                                wifiCopied={clipboard.wifiCopied}
                                                addressCopied={clipboard.addressCopied}
                                                currentWifiSSID={currentWifiSSID}
                                                currentWifiPass={currentWifiPass}
                                                currentSafeCode={currentSafeCode}
                                                isLoadingWifi={loadingSettings}
                                                onOpenCheckin={() =>
                                                    modals.setIsCheckinModalOpen(true)
                                                }
                                                onOpenCheckout={() =>
                                                    modals.setIsCheckoutModalOpen(true)
                                                }
                                                onCopyWifi={() =>
                                                    clipboard.copyToClipboard(
                                                        currentWifiPass,
                                                        'wifi'
                                                    )
                                                }
                                                onCopyAddress={() =>
                                                    clipboard.copyToClipboard(
                                                        flatAddress,
                                                        'address'
                                                    )
                                                }
                                                onOpenDriverMode={() =>
                                                    modals.setShowDriverMode(true)
                                                }
                                                formatFriendlyDate={formatFriendlyDate}
                                                isSingleNight={isSingleNight}
                                                isCheckoutToday={isCheckoutToday}
                                                onOpenSupport={() =>
                                                    modals.setIsSupportModalOpen(true)
                                                }
                                                onEmergency={handleEmergencyClick}
                                                onSaveAccess={() => modals.setShowOfflineCard(true)}
                                            />
                                        </div>

                                        <div
                                            className="flex flex-col gap-6 animate-fade-up"
                                            style={{ animationDelay: '400ms' }}
                                        >
                                            <SmartSuggestion
                                                stayStage={stayStage}
                                                onCheckoutClick={() =>
                                                    modals.setIsCheckoutModalOpen(true)
                                                }
                                                onCheckinClick={() =>
                                                    modals.setIsCheckinModalOpen(true)
                                                }
                                                onOpenCategorySheet={(sheetName) =>
                                                    setRequestedSheet(sheetName)
                                                }
                                                isTimeVerified={isTimeVerified}
                                                customSuggestions={smartSuggestions}
                                                places={dynamicPlaces}
                                                activeEvents={activeEvents}
                                                config={config}
                                                hostPhone={currentHostPhone}
                                                onEmergency={handleEmergencyClick}
                                            />

                                            {/* CARD DE LOCALIZAÇÃO MOBILE & TABLET */}
                                            <div
                                                className={`${stayStage === 'pre_checkin' ? 'flex' : 'hidden lg:flex'} bg-white dark:bg-[#1C1614] rounded-[24px] p-1 shadow-sm border border-stone-200/80 dark:border-amber-500/15 flex-1 min-h-[140px] flex-col`}
                                            >
                                                <div className="flex-1 rounded-[20px] bg-amber-50/50 dark:bg-[#241C19]/70 border border-amber-200/60 dark:border-amber-500/15 p-5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                                                    <button
                                                        onClick={() =>
                                                            modals.setShowDriverMode(true)
                                                        }
                                                        aria-label="Expandir mapa"
                                                        className="absolute top-3 right-3 text-amber-500/60 dark:text-amber-400/50 hover:text-[#C85A32] dark:hover:text-amber-300 transition-colors"
                                                    >
                                                        <Maximize2 size={14} />
                                                    </button>
                                                    <div className="w-10 h-10 bg-orange-100 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-400 rounded-full flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                                                        <MapPin size={20} />
                                                    </div>
                                                    <h3 className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1">
                                                        {t('Localização', 'Location')}
                                                    </h3>
                                                    <p className="text-sm font-bold text-stone-800 dark:text-stone-100 max-w-[280px] leading-snug mb-3">
                                                        {flatAddress}
                                                    </p>

                                                    <button
                                                        onClick={(e) => {
                                                            triggerConfetti(
                                                                e.currentTarget as HTMLElement
                                                            );
                                                            clipboard.copyToClipboard(
                                                                flatAddress,
                                                                'address'
                                                            );
                                                        }}
                                                        aria-label="Copiar endereço"
                                                        className="mb-4 px-4 py-1.5 bg-white dark:bg-stone-900 text-[#C85A32] dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide rounded-full border border-amber-200 dark:border-amber-500/30 hover:bg-amber-50 dark:hover:bg-amber-500/10 active:scale-95 transition-all shadow-sm"
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
                                                            className="flex-1 py-2.5 bg-white dark:bg-stone-900 text-stone-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wide rounded-xl border border-stone-200 dark:border-amber-500/25 hover:bg-stone-50 dark:hover:bg-stone-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                                                        >
                                                            <ExternalLink size={14} />{' '}
                                                            {t('Abrir Mapa', 'Open Map')}
                                                        </a>
                                                        <button
                                                            onClick={() =>
                                                                video.openVideoModal(
                                                                    DRONE_VIDEO_URL,
                                                                    false
                                                                )
                                                            }
                                                            className="flex-1 py-2.5 bg-gradient-to-r from-[#C85A32] to-orange-600 text-white text-[10px] font-bold uppercase tracking-wide rounded-xl shadow-md shadow-orange-900/20 hover:from-orange-600 hover:to-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Video size={14} />{' '}
                                                            {t('Ver do Alto', 'Drone View')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

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
                                        onOpenKeyDetails={checkout.handleOpenKeyDetails}
                                        requestedSheet={requestedSheet}
                                        onRequestedSheetHandled={() => setRequestedSheet(null)}
                                    />
                                </motion.div>

                                <motion.div
                                    className={`rounded-[24px] p-6 text-stone-50 shadow-2xl relative overflow-hidden border ${
                                        isIntegracao
                                            ? 'bg-gradient-to-br from-[#16283B] via-[#111E2E] to-[#0D1622] shadow-sky-950/25 border-sky-400/20'
                                            : 'bg-gradient-to-br from-[#C85A32] via-[#A94420] to-[#712A12] shadow-orange-950/25 border-amber-300/20'
                                    }`}
                                    variants={itemVariants}
                                >
                                    <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
                                        <Star size={120} />
                                    </div>
                                    {property.features.hasReviews && (
                                        <>
                                            <h3 className="text-xl sm:text-2xl font-display font-semibold mb-2">
                                                {t(
                                                    'Sua opinião vale ouro! ⭐',
                                                    'Your opinion is gold! ⭐'
                                                )}
                                            </h3>
                                            <p className="text-stone-100/90 text-sm mb-6 leading-relaxed font-medium">
                                                {getFirstName(config.guestName)
                                                    ? `${t('Olá', 'Hello')}, ${getFirstName(config.guestName)}! `
                                                    : ''}
                                                {t(
                                                    'Espero que tenha amado a estadia. Se puder deixar uma avaliação rápida no Google, ajuda muito o nosso trabalho!',
                                                    'Hope you loved your stay. Leaving a quick review on Google helps us a lot!'
                                                )}
                                            </p>
                                            <motion.a
                                                href={
                                                    property.googleReviewLink || GOOGLE_REVIEW_LINK
                                                }
                                                target="_blank"
                                                rel="noreferrer"
                                                className="bg-stone-50 text-stone-900 font-bold py-3.5 px-6 rounded-xl inline-flex items-center gap-2.5 hover:bg-white transition-all shadow-lg w-full justify-center sm:w-auto font-sans text-sm"
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.97 }}
                                            >
                                                <Star
                                                    size={18}
                                                    className="fill-amber-400 text-amber-400"
                                                />{' '}
                                                {t(
                                                    'Avaliar no Google',
                                                    'Rate on Google',
                                                    'Calificar en Google'
                                                )}
                                            </motion.a>
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}

            <div className="animate-fade-up" style={{ animationDelay: '700ms' }}>
                <React.Suspense
                    fallback={
                        <div className="h-14 w-14 rounded-full bg-white/10 animate-pulse fixed bottom-4 right-4" />
                    }
                >
                    <ChatWidget
                        guestName={config.guestName}
                        systemInstruction={(() => {
                            const propId = config.propertyId || 'lili';

                            let finalPrompt = appSettings?.aiSystemPrompts?.[propId];

                            if (!finalPrompt && propId === 'lili') {
                                finalPrompt = appSettings?.aiSystemPrompt;
                            }

                            if (currentLang === 'en' && appSettings?.aiSystemPrompt_en) {
                                return appSettings.aiSystemPrompt_en;
                            } else if (currentLang === 'es' && appSettings?.aiSystemPrompt_es) {
                                return appSettings.aiSystemPrompt_es;
                            }

                            if (!finalPrompt || !finalPrompt.trim()) {
                                finalPrompt = property.ai.systemPrompt;
                            }

                            return finalPrompt;
                        })()}
                    />
                </React.Suspense>
            </div>

            {/* Discreet Footer */}
            <footer className="mt-12 pb-8 flex flex-col items-center justify-center gap-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
                <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-medium">
                    Desenvolvido por
                </span>
                <a
                    href="https://www.eximusdigital.com.br"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center grayscale hover:grayscale-0 transition-all"
                >
                    <img src={logoEximus} alt="Eximus Digital" className="h-4 w-auto" />
                </a>
            </footer>
        </div>
    );
};

export default GuestView;
