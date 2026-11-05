import React, { useState, useEffect } from 'react';
import {
    Moon,
    Sun,
    Monitor,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Camera,
    MapPin,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import OptimizedImage from '../ui/OptimizedImage';
import WeatherWidget from '../WeatherWidget';
import { GuestConfig } from '../../types';
import { DEFAULT_SLIDES } from '../../constants';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import LogoLili from '../LogoLili';
import { hapticFeedback } from '../../utils/haptics';
import { useTheme } from '../../contexts/ThemeContext';

interface HeroSectionProps {
    config: GuestConfig;
    heroSlides?: string[];
    currentLang: 'pt' | 'en' | 'es';
    toggleLanguage: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    config,
    heroSlides = DEFAULT_SLIDES,
    currentLang,
    toggleLanguage,
}) => {
    const { theme, setTheme } = useTheme();
    const cycleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };
    const { t } = useLanguage();
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

    const nextSlide = () => {
        hapticFeedback('light');
        setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    };

    const prevSlide = () => {
        hapticFeedback('light');
        setCurrentHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    useEffect(() => {
        if (!heroSlides || heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [heroSlides]);

    // Navegação por teclado no Desktop (Setas Esquerda / Direita)
    useEffect(() => {
        if (!heroSlides || heroSlides.length <= 1) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target &&
                (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
                    target.isContentEditable)
            ) {
                return;
            }
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [heroSlides]);

    const parallaxRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (parallaxRef.current) {
                const scrolled = window.scrollY;
                parallaxRef.current.style.transform = `translateY(${scrolled * 0.35}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper para saudação (Brasília Time)
    const getGreeting = () => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const brasiliaTime = new Date(utc - 3 * 60 * 60 * 1000);
        const hour = brasiliaTime.getHours();

        if (hour >= 5 && hour < 12) return t('Bom dia', 'Good morning', 'Buenos días');
        if (hour >= 12 && hour < 18) return t('Boa tarde', 'Good afternoon', 'Buenas tardes');
        return t('Boa noite', 'Good evening', 'Buenas noches');
    };

    const greeting = getGreeting();
    const isIntegracao = config.propertyId === 'integracao';
    const guestFirstName = config.guestName?.trim()?.split(' ')[0] || 'Visitante';
    const unitBadge = config.flatNumber
        ? `Flat ${config.flatNumber}`
        : isIntegracao
          ? 'Flats Integração'
          : 'Flat da Lili';

    return (
        <div className="relative h-[32rem] sm:h-[36rem] lg:h-[38rem] xl:h-[42rem] 2xl:h-[46rem] bg-[#0E0B0A] overflow-hidden shadow-2xl group select-none">
            {/* Ambient Backlight Glow (Simula a luz dourada do Sol do São Francisco) */}
            <div
                className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[110px] pointer-events-none z-20 opacity-40 transition-colors duration-1000 ${
                    isIntegracao ? 'bg-sky-500/25' : 'bg-amber-500/30'
                }`}
            />

            {/* Top Bar Flutuante & Balanceada */}
            <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 z-40 flex items-center justify-between pointer-events-none animate-fadeIn">
                {/* Lado Esquerdo: Clima de Petrolina com Glassmorphism refinado */}
                <div className="pointer-events-auto">
                    <WeatherWidget />
                </div>

                {/* Lado Direito: Pílula Glass com Idioma e Tema */}
                <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-stone-950/50 hover:bg-stone-950/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/30 transition-all">
                    <button
                        type="button"
                        onClick={() => {
                            hapticFeedback('light');
                            toggleLanguage();
                        }}
                        aria-label="Alternar idioma"
                        className="px-2.5 py-1 rounded-full text-xs font-bold text-stone-100 hover:text-white hover:bg-white/10 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                        <span>
                            {currentLang === 'pt' ? '🇧🇷' : currentLang === 'en' ? '🇺🇸' : '🇪🇸'}
                        </span>
                        <span className="uppercase text-[10px] tracking-wider font-mono">
                            {currentLang}
                        </span>
                    </button>

                    <div className="w-px h-3.5 bg-white/20" />

                    <button
                        type="button"
                        onClick={() => {
                            hapticFeedback('light');
                            cycleTheme();
                        }}
                        aria-label="Alternar tema claro/escuro"
                        className="p-1.5 rounded-full text-stone-200 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
                    >
                        {theme === 'dark' ? (
                            <Moon size={13} className="text-amber-300" />
                        ) : theme === 'light' ? (
                            <Sun size={13} className="text-amber-400" />
                        ) : (
                            <Monitor size={13} className="text-sky-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Imagem de Fundo com Parallax e Transição Suave */}
            <div ref={parallaxRef} className="absolute inset-0 w-full h-full will-change-transform">
                {heroSlides.map((img, index) => (
                    <div
                        key={`${img}-${index}`}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                            index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        <OptimizedImage
                            src={img}
                            alt={isIntegracao ? 'Flats Integração' : 'Flat da Lili'}
                            className="w-full h-full object-cover scale-[1.03] transition-transform duration-[10000ms] ease-out group-hover:scale-108"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                    </div>
                ))}
            </div>

            {/* Camadas de Iluminação Cinematográfica de Alto Contraste */}
            {/* 1. Vinheta suave superior para contraste dos controles */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/15 to-transparent z-20 pointer-events-none" />

            {/* 2. Escurecimento central aveludado (Sol do São Francisco / Rio) */}
            <div
                className={`absolute inset-0 z-20 pointer-events-none ${
                    isIntegracao
                        ? 'bg-gradient-to-t from-[#0A1017] via-[#0A1017]/80 via-50% to-transparent'
                        : 'bg-gradient-to-t from-[#120D0B] via-[#120D0B]/80 via-50% to-transparent'
                }`}
            />

            {/* 3. Vinheta radial sutil nas bordas */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.5)_100%)] z-20 pointer-events-none" />

            {/* Botões de Navegação de Slide (Sutis e elegantes) */}
            {heroSlides.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Foto anterior"
                        className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-40 p-2.5 lg:p-3.5 rounded-full bg-black/25 hover:bg-black/50 lg:bg-black/40 lg:hover:bg-black/75 text-white/70 hover:text-white backdrop-blur-md border border-white/10 lg:border-white/20 opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-xl"
                    >
                        <ChevronLeft size={18} className="lg:w-5 lg:h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Próxima foto"
                        className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40 p-2.5 lg:p-3.5 rounded-full bg-black/25 hover:bg-black/50 lg:bg-black/40 lg:hover:bg-black/75 text-white/70 hover:text-white backdrop-blur-md border border-white/10 lg:border-white/20 opacity-0 group-hover:opacity-100 transition-all active:scale-90 shadow-xl"
                    >
                        <ChevronRight size={18} className="lg:w-5 lg:h-5" />
                    </button>

                    {/* Contador de Fotos Minimalista no Canto Inferior Direito */}
                    <div className="absolute bottom-28 right-4 sm:right-8 z-30 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-mono text-stone-200">
                        <Camera size={11} className="text-amber-300" />
                        <span>
                            {currentHeroSlide + 1} / {heroSlides.length}
                        </span>
                    </div>
                </>
            )}

            {/* Conteúdo Central do Hero */}
            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-32 sm:pb-36 lg:pb-40 xl:pb-44">
                <div className="w-full max-w-3xl mx-auto px-6 sm:px-8 pointer-events-auto flex flex-col items-center text-center">
                    {/* Linha de Localização / Editorial */}
                    <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-stone-300/80 font-medium mb-3">
                        <MapPin size={11} className="text-amber-400 shrink-0" />
                        <span>Petrolina, PE • Vale do São Francisco</span>
                    </div>

                    {/* Bloco de Identidade da Propriedade */}
                    {isIntegracao ? (
                        <div className="flex flex-col items-center mb-3 animate-fadeIn">
                            <div className="relative mb-2.5 transition-transform duration-300 hover:scale-105">
                                <img
                                    src={flatsLogo}
                                    alt="Logo Flats Integração"
                                    className="h-14 sm:h-16 w-auto object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]"
                                />
                            </div>

                            {/* Badge VIP com unidade e shimmer */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 dark:bg-sky-950/50 border border-sky-300/30 backdrop-blur-md shadow-lg shadow-sky-950/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-sky-200">
                                    {unitBadge} •{' '}
                                    {t('GUIA DO HÓSPEDE', 'GUEST GUIDE', 'GUÍA DEL HUÉSPED')}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center mb-3 animate-fadeIn">
                            <div className="relative mb-2.5 transition-transform duration-300 hover:scale-105">
                                <LogoLili
                                    className="h-14 sm:h-16 w-auto text-stone-50 drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]"
                                    sunClassName="text-amber-400 animate-sunrise-pulse"
                                    textClassName="text-stone-50"
                                />
                            </div>

                            {/* Badge VIP com unidade e shimmer */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 dark:bg-amber-950/50 border border-amber-300/30 backdrop-blur-md shadow-lg shadow-orange-950/30">
                                <Sparkles size={11} className="text-amber-300" />
                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.24em] text-amber-200">
                                    {unitBadge} •{' '}
                                    {t('GUIA DO HÓSPEDE', 'GUEST GUIDE', 'GUÍA DEL HUÉSPED')}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Saudação com Tipografia Editorial Fraunces & Ouro Champanhe */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-semibold mb-2 leading-tight text-stone-50 drop-shadow-xl tracking-tight">
                        <span className="font-normal italic">{greeting}, </span>
                        <span className="bg-gradient-to-r from-amber-200 via-stone-50 to-amber-300 bg-clip-text text-transparent font-bold">
                            {guestFirstName}
                        </span>
                        !
                    </h1>

                    {/* Mensagem de Boas-Vindas ou Tagline */}
                    {config.welcomeMessage ? (
                        <div className="max-w-lg mx-auto mt-1 animate-fadeIn">
                            <div
                                className={`h-0.5 w-12 mb-2.5 rounded-full mx-auto ${
                                    isIntegracao
                                        ? 'bg-sky-400 shadow-sm shadow-sky-400/50'
                                        : 'bg-amber-400 shadow-sm shadow-amber-500/50'
                                }`}
                            />
                            <p className="text-stone-100/95 text-sm sm:text-base font-display italic leading-relaxed drop-shadow-md">
                                "{config.welcomeMessage}"
                            </p>
                        </div>
                    ) : (
                        <p className="text-stone-200/95 text-xs sm:text-sm md:text-base font-medium font-sans max-w-md leading-relaxed drop-shadow-md tracking-tight">
                            {t(
                                'Sua casa longe de casa no Vale do São Francisco.',
                                'Your home away from home in the San Francisco Valley.',
                                'Tu hogar lejos de casa en el Valle del São Francisco.'
                            )}
                        </p>
                    )}

                    {/* Barras de Progresso dos Slides (Estilo Stories / Luxury Dash) */}
                    {heroSlides.length > 1 && (
                        <div className="flex items-center gap-1.5 mt-4">
                            {heroSlides.map((_, dotIdx) => (
                                <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => setCurrentHeroSlide(dotIdx)}
                                    aria-label={`Foto ${dotIdx + 1}`}
                                    className={`transition-all duration-300 rounded-full ${
                                        dotIdx === currentHeroSlide
                                            ? 'w-7 h-1 bg-amber-400 shadow-sm shadow-amber-400/50'
                                            : 'w-1.5 h-1 bg-white/35 hover:bg-white/70'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Divisória Escultural Ondulada (Águas do Rio São Francisco & Dunas) */}
            <div className="absolute bottom-0 inset-x-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
                <svg
                    viewBox="0 0 1440 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-16 sm:h-24 block -mb-[1px] preserve-3d"
                    preserveAspectRatio="none"
                >
                    {/* Onda 1: Véu de luz e reflexo d'água / dunas douradas */}
                    <path
                        d="M0,28 C320,68 480,-8 720,42 C960,88 1120,8 1440,32 L1440,100 L0,100 Z"
                        className={isIntegracao ? 'fill-sky-400/25' : 'fill-amber-400/30'}
                    />
                    {/* Onda 2: Superfície esculpida perfeitamente contínua com o fundo da página */}
                    <path
                        d="M0,48 C340,98 520,18 720,62 C920,102 1140,28 1440,54 L1440,100 L0,100 Z"
                        className="fill-[#FAF7F2] dark:fill-[#120F0D] transition-colors duration-300"
                    />
                </svg>
            </div>
        </div>
    );
};

export default HeroSection;
