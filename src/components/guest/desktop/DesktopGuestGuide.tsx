import { useRef, useState } from 'react';
import {
    ArrowUpRight,
    BookOpen,
    Check,
    ChevronDown,
    Compass,
    Copy,
    Heart,
    Home,
    KeyRound,
    LifeBuoy,
    MapPin,
    Monitor,
    Moon,
    Phone,
    ShieldAlert,
    Smartphone,
    Sun,
    Wifi,
} from 'lucide-react';
import { GuestConfig, PlaceRecommendation, SmartSuggestionsConfig } from '../../../types';
import { PROPERTIES } from '../../../config/properties';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTheme } from '../../../contexts/ThemeContext';
import { useFavorites } from '../../../hooks/useFavorites';
import flatsLogo from '../../../assets/flats-integracao-logo.png';
import LogoLili from '../../LogoLili';
import DesktopQrCard from '../cards/DesktopQrCard';
import FlatAmenitiesSheet from '../recommendations/sheets/FlatAmenitiesSheet';
import RulesSheet from '../recommendations/sheets/RulesSheet';
import EmergencySheet from '../recommendations/sheets/EmergencySheet';
import DesktopExplore from './DesktopExplore';
import DesktopStayOverview from './DesktopStayOverview';
import SmartSuggestion from '../../SmartSuggestion';
import './DesktopGuestGuide.css';

type Section = 'stay' | 'flat' | 'explore' | 'favorites' | 'rules' | 'help';
type StayStage =
    | 'pre_checkin'
    | 'checkin'
    | 'middle'
    | 'pre_checkout'
    | 'checkout'
    | 'post_checkout';

interface DesktopGuestGuideProps {
    config: GuestConfig;
    stayStage: StayStage;
    isPasswordReleased: boolean;
    wifiSSID: string;
    wifiPass: string;
    safeCode: string;
    loadingWifi: boolean;
    heroImage?: string;
    places: PlaceRecommendation[];
    activeEvents: PlaceRecommendation[];
    hasTips: boolean;
    isTimeVerified?: boolean;
    smartSuggestions?: SmartSuggestionsConfig | null;
    hostPhone: string;
    onCheckin: () => void;
    onCheckout: () => void;
    onSupport: () => void;
    onDriver: () => void;
    onSaveAccess: () => void;
    onKeyDetails: () => void;
    onStories: (type: 'agenda' | 'curiosities' | 'tips') => void;
}

/** Desktop extends the guest guide's existing identity and data; mobile owns its composition. */
export default function DesktopGuestGuide({
    config,
    stayStage,
    isPasswordReleased,
    wifiSSID,
    wifiPass,
    safeCode,
    loadingWifi,
    heroImage,
    places,
    activeEvents,
    hasTips,
    isTimeVerified = false,
    smartSuggestions = null,
    hostPhone,
    onCheckin,
    onCheckout,
    onSupport,
    onDriver,
    onSaveAccess,
    onKeyDetails,
    onStories,
}: DesktopGuestGuideProps) {
    const { t, currentLang, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const { favorites } = useFavorites();
    const [section, setSection] = useState<Section>('stay');
    const [exploreCategory, setExploreCategory] = useState<string | undefined>();
    const [showMobile, setShowMobile] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [copied, setCopied] = useState('');
    const [copyError, setCopyError] = useState(false);
    const heading = useRef<HTMLHeadingElement>(null);
    const mobilePanel = useRef<HTMLDivElement>(null);
    const property = PROPERTIES[config.propertyId || 'lili'];
    const released =
        isPasswordReleased &&
        config.isReleased !== false &&
        !config.manualDeactivation &&
        stayStage !== 'post_checkout';
    const propertyPlaces = places.filter(
        (place) =>
            place.visible !== false &&
            (!place.propertyId || place.propertyId === 'all' || place.propertyId === property.id)
    );
    const propertyEvents = activeEvents.filter(
        (place) =>
            place.visible !== false &&
            (!place.propertyId || place.propertyId === 'all' || place.propertyId === property.id)
    );
    const favoriteCount = new Set(
        [
            ...propertyPlaces.filter(
                (place) => place.category !== 'events' && place.category !== 'emergency'
            ),
            ...propertyEvents,
        ]
            .filter((place) => place.id && favorites.includes(place.id))
            .map((place) => place.id)
    ).size;

    const navigate = (next: Section) => {
        setSection(next);
        requestAnimationFrame(() => heading.current?.focus({ preventScroll: true }));
        window.scrollTo({ top: 0, behavior: 'instant' });
    };

    const openExplore = (category?: string) => {
        setExploreCategory(category);
        navigate('explore');
    };

    const copy = async (value: string, key: string) => {
        setCopyError(false);
        try {
            await navigator.clipboard.writeText(value);
            setCopied(key);
        } catch {
            setCopied('');
            setCopyError(true);
        }
    };

    const nav = [
        { id: 'stay' as const, icon: Home, label: t('Minha estadia', 'My stay', 'Mi estancia') },
        { id: 'flat' as const, icon: KeyRound, label: t('O flat', 'The flat', 'El flat') },
        {
            id: 'explore' as const,
            icon: Compass,
            label: t('Explorar a região', 'Explore the area', 'Explorar la zona'),
        },
        {
            id: 'favorites' as const,
            icon: Heart,
            label: t('Meus favoritos', 'My favorites', 'Mis favoritos'),
        },
        {
            id: 'rules' as const,
            icon: BookOpen,
            label: t('Regras e avisos', 'Rules & notices', 'Reglas y avisos'),
        },
        { id: 'help' as const, icon: LifeBuoy, label: t('Ajuda', 'Help', 'Ayuda') },
    ];
    const currentTitle = nav.find((item) => item.id === section)!.label;

    return (
        <div className="gd-guide" data-property={property.id}>
            <a className="gd-skip" href="#desktop-guide-content">
                {t('Ir para o conteúdo', 'Skip to content', 'Ir al contenido')}
            </a>
            <header className="gd-topbar">
                <a
                    className="gd-brand"
                    href="#desktop-guide-content"
                    onClick={() => navigate('stay')}
                    aria-label={property.name}
                >
                    {property.id === 'integracao' ? (
                        <img src={flatsLogo} alt={property.name} />
                    ) : (
                        <LogoLili className="gd-lili-logo" />
                    )}
                    <span>
                        {t('Seu guia de hospedagem', 'Your stay guide', 'Tu guía de estancia')}
                    </span>
                </a>
                <div className="gd-top-actions">
                    <button
                        type="button"
                        className="gd-mobile-trigger"
                        aria-expanded={showMobile}
                        aria-controls="desktop-mobile-pass"
                        onClick={() => {
                            setShowMobile(!showMobile);
                            if (!showMobile)
                                requestAnimationFrame(() =>
                                    mobilePanel.current?.scrollIntoView({ block: 'nearest' })
                                );
                        }}
                    >
                        <Smartphone size={17} />
                        {t('Levar no celular', 'Take it on mobile', 'Llevar al móvil')}
                    </button>
                    <label className="gd-language">
                        <span className="sr-only">{t('Idioma', 'Language', 'Idioma')}</span>
                        <select
                            value={currentLang}
                            onChange={(e) => setLanguage(e.target.value as 'pt' | 'en' | 'es')}
                        >
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </label>
                    <button
                        type="button"
                        className="gd-icon-button"
                        onClick={() =>
                            setTheme(
                                theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
                            )
                        }
                        aria-label={t('Alternar tema', 'Change theme', 'Cambiar tema')}
                    >
                        {theme === 'light' ? (
                            <Sun size={19} />
                        ) : theme === 'dark' ? (
                            <Moon size={19} />
                        ) : (
                            <Monitor size={19} />
                        )}
                    </button>
                </div>
            </header>

            <div className="gd-layout">
                <aside className="gd-sidebar">
                    <nav
                        aria-label={t(
                            'Navegação do guia',
                            'Guide navigation',
                            'Navegación de la guía'
                        )}
                    >
                        {nav.map(({ id, icon: Icon, label }) => (
                            <button
                                type="button"
                                key={id}
                                className="gd-nav-item"
                                aria-current={section === id ? 'page' : undefined}
                                onClick={() => (id === 'explore' ? openExplore() : navigate(id))}
                            >
                                <Icon size={19} />
                                <span>{label}</span>
                                {id === 'favorites' && favoriteCount > 0 && (
                                    <span className="gd-nav-count">{favoriteCount}</span>
                                )}
                            </button>
                        ))}
                    </nav>
                    <div className="gd-sidebar-footer">
                        <p>
                            {property.name}
                            {config.flatNumber && (
                                <strong>
                                    {t('Unidade', 'Unit', 'Unidad')} {config.flatNumber}
                                </strong>
                            )}
                        </p>
                        <button type="button" onClick={onSupport}>
                            <Phone size={16} />
                            {t('Falar com anfitrião', 'Contact host', 'Contactar al anfitrión')}
                        </button>
                        <button
                            type="button"
                            className="gd-sos"
                            onClick={() => {
                                setShowEmergency(true);
                                navigate('help');
                            }}
                        >
                            <ShieldAlert size={16} />
                            {t('SOS e emergência', 'SOS & emergency', 'SOS y emergencia')}
                        </button>
                    </div>
                </aside>

                <main id="desktop-guide-content" className="gd-main" tabIndex={-1}>
                    <div className="gd-page-heading">
                        <h1 ref={heading} tabIndex={-1}>
                            {currentTitle}
                        </h1>
                        <span>
                            {property.name}
                            {config.flatNumber
                                ? ` · ${t('Unidade', 'Unit', 'Unidad')} ${config.flatNumber}`
                                : ''}
                        </span>
                    </div>
                    {section === 'stay' && (
                        <>
                            <section
                                className="gd-stay-smart"
                                aria-label={t(
                                    'Sugestão para sua estadia',
                                    'Suggestion for your stay',
                                    'Sugerencia para tu estancia'
                                )}
                            >
                                <SmartSuggestion
                                    stayStage={stayStage}
                                    onCheckoutClick={onCheckout}
                                    onCheckinClick={onCheckin}
                                    onOpenCategorySheet={openExplore}
                                    isTimeVerified={isTimeVerified}
                                    customSuggestions={smartSuggestions}
                                    places={propertyPlaces}
                                    activeEvents={propertyEvents}
                                    config={config}
                                    hostPhone={hostPhone}
                                    onEmergency={() => {
                                        setShowEmergency(true);
                                        navigate('help');
                                    }}
                                />
                            </section>
                            <DesktopStayOverview
                                config={config}
                                stayStage={stayStage}
                                isPasswordReleased={released}
                                heroImage={heroImage}
                                onCheckin={onCheckin}
                                onCheckout={onCheckout}
                                onExplore={() => openExplore()}
                                onFlat={() => navigate('flat')}
                                onSupport={onSupport}
                                onStories={onStories}
                                hasTips={hasTips}
                                eventCount={propertyEvents.length}
                            />
                        </>
                    )}
                    {(section === 'explore' || section === 'favorites') && (
                        <DesktopExplore
                            key={`${section}:${exploreCategory || 'all'}`}
                            places={propertyPlaces}
                            activeEvents={propertyEvents}
                            favoritesOnly={section === 'favorites'}
                            initialCategory={section === 'explore' ? exploreCategory : undefined}
                        />
                    )}
                    {section === 'flat' && (
                        <div className="gd-reading">
                            <FlatAmenitiesSheet propertyId={property.id} />
                        </div>
                    )}
                    {section === 'rules' && (
                        <div className="gd-reading">
                            <RulesSheet onOpenKeyDetails={onKeyDetails} />
                        </div>
                    )}
                    {section === 'help' && (
                        <div className="gd-help gd-reading">
                            <h2>
                                {t(
                                    'Conte com a gente',
                                    'We are here to help',
                                    'Estamos para ayudarte'
                                )}
                            </h2>
                            <p>
                                {t(
                                    'Para dúvidas de acesso, manutenção ou algo que você precise durante a estadia, fale com o anfitrião.',
                                    'Contact your host for access questions, maintenance or anything you need during your stay.',
                                    'Contacta al anfitrión por dudas de acceso, mantenimiento o cualquier necesidad durante tu estancia.'
                                )}
                            </p>
                            <button type="button" className="gd-primary" onClick={onSupport}>
                                <Phone size={17} />
                                {t(
                                    'Abrir opções de contato',
                                    'Open contact options',
                                    'Abrir opciones de contacto'
                                )}
                                <ArrowUpRight size={17} />
                            </button>
                            <p className="gd-contact-number">
                                {t(
                                    'Contato do anfitrião',
                                    'Host contact',
                                    'Contacto del anfitrión'
                                )}
                                : +{hostPhone.replace(/\D/g, '')}
                            </p>
                            <button
                                type="button"
                                className="gd-emergency-toggle"
                                aria-expanded={showEmergency}
                                onClick={() => setShowEmergency(!showEmergency)}
                            >
                                <ShieldAlert size={19} />
                                {t('SOS e emergência', 'SOS & emergency', 'SOS y emergencia')}
                                <ChevronDown size={17} />
                            </button>
                            {showEmergency && (
                                <EmergencySheet
                                    emergencyPlaces={propertyPlaces.filter(
                                        (place) => place.category === 'emergency'
                                    )}
                                />
                            )}
                        </div>
                    )}
                </main>

                <aside
                    className="gd-context"
                    aria-label={t(
                        'Informações da estadia',
                        'Stay information',
                        'Información de la estancia'
                    )}
                >
                    <div className="gd-access">
                        <h2>
                            <KeyRound size={17} />
                            {t('Seu acesso', 'Your access', 'Tu acceso')}
                        </h2>
                        {config.flatNumber && (
                            <p className="gd-unit">
                                {t('Unidade', 'Unit', 'Unidad')}
                                <strong>{config.flatNumber}</strong>
                            </p>
                        )}
                        {released ? (
                            <>
                                {property.features.hasDigitalLock && config.lockCode && (
                                    <div className="gd-credential">
                                        <span>
                                            {t(
                                                'Senha da porta',
                                                'Door code',
                                                'Código de la puerta'
                                            )}
                                        </span>
                                        <strong>{config.lockCode}</strong>
                                    </div>
                                )}
                                {property.features.hasSafe &&
                                    safeCode &&
                                    !/^-+$/.test(safeCode) && (
                                        <div className="gd-credential">
                                            <span>
                                                {t(
                                                    'Senha do cofre',
                                                    'Key safe code',
                                                    'Código de la caja de llaves'
                                                )}
                                            </span>
                                            <strong>{safeCode}</strong>
                                        </div>
                                    )}
                                <button type="button" onClick={onCheckin}>
                                    {t(
                                        'Ver instruções de entrada',
                                        'View check-in instructions',
                                        'Ver instrucciones de entrada'
                                    )}
                                    <ArrowUpRight size={15} />
                                </button>
                            </>
                        ) : (
                            <p className="gd-access-pending">
                                {t(
                                    'As informações de acesso aparecem conforme a liberação da sua reserva.',
                                    'Access details appear when your reservation is released.',
                                    'Los datos de acceso aparecen cuando se habilita tu reserva.'
                                )}
                            </p>
                        )}
                        <button type="button" onClick={onSaveAccess}>
                            {t('Salvar acesso', 'Save access', 'Guardar acceso')}
                            <Copy size={14} />
                        </button>
                    </div>
                    <section className="gd-context-section">
                        <h2>
                            <Wifi size={17} />
                            Wi-Fi
                        </h2>
                        {loadingWifi ? (
                            <p role="status">
                                {t('Carregando rede…', 'Loading network…', 'Cargando red…')}
                            </p>
                        ) : (
                            <p className="gd-network">
                                {wifiSSID ||
                                    t(
                                        'Consulte o anfitrião',
                                        'Contact your host',
                                        'Consulta al anfitrión'
                                    )}
                            </p>
                        )}
                        {released && !loadingWifi && wifiPass ? (
                            <button type="button" onClick={() => copy(wifiPass, 'wifi')}>
                                {copied === 'wifi' ? <Check size={15} /> : <Copy size={15} />}
                                {copied === 'wifi'
                                    ? t('Senha copiada', 'Password copied', 'Contraseña copiada')
                                    : t('Copiar senha', 'Copy password', 'Copiar contraseña')}
                            </button>
                        ) : (
                            <p className="gd-small">
                                {t(
                                    'Senha disponível com a liberação do acesso.',
                                    'Password available when access is released.',
                                    'Contraseña disponible al habilitar el acceso.'
                                )}
                            </p>
                        )}
                    </section>
                    <section className="gd-context-section">
                        <h2>
                            <MapPin size={17} />
                            {t('Como chegar', 'Getting here', 'Cómo llegar')}
                        </h2>
                        <p>{property.address}</p>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('Abrir rota', 'Open directions', 'Abrir ruta')}
                            <ArrowUpRight size={15} />
                        </a>
                        <button type="button" onClick={() => copy(property.address, 'address')}>
                            {copied === 'address' ? <Check size={15} /> : <Copy size={15} />}
                            {copied === 'address'
                                ? t('Endereço copiado', 'Address copied', 'Dirección copiada')
                                : t('Copiar endereço', 'Copy address', 'Copiar dirección')}
                        </button>
                        <button type="button" onClick={onDriver}>
                            {t('Mostrar ao motorista', 'Show driver', 'Mostrar al conductor')}
                            <ArrowUpRight size={15} />
                        </button>
                    </section>
                    <p className="gd-copy-status" role="status">
                        {copyError
                            ? t(
                                  'Não foi possível copiar. Selecione o texto ou tente novamente.',
                                  'Could not copy. Select the text or try again.',
                                  'No se pudo copiar. Selecciona el texto o inténtalo de nuevo.'
                              )
                            : copied
                              ? t(
                                    'Copiado para a área de transferência.',
                                    'Copied to clipboard.',
                                    'Copiado al portapapeles.'
                                )
                              : ''}
                    </p>
                    {showMobile && (
                        <div id="desktop-mobile-pass" ref={mobilePanel}>
                            <DesktopQrCard propertyId={property.id} />
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}
