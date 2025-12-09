import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import OptimizedImage from '../OptimizedImage';
import WeatherWidget from '../WeatherWidget';
import { GuestConfig } from '../../types';
import { DEFAULT_SLIDES } from '../../constants';
// import { PROPERTIES } from '../../config/properties';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import LogoLili from '../LogoLili';
import { hapticFeedback } from '../../utils/haptics';

interface HeroSectionProps {
    config: GuestConfig;
    heroSlides?: string[];
    theme?: 'light' | 'dark';
    toggleTheme?: () => void;
    currentLang: 'pt' | 'en' | 'es';
    toggleLanguage: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    config,
    heroSlides = DEFAULT_SLIDES,
    theme,
    toggleTheme,
    currentLang,
    toggleLanguage,
}) => {
    const { t } = useLanguage();
    const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

    useEffect(() => {
        if (!heroSlides || heroSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroSlides]);

    const parallaxRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (parallaxRef.current) {
                const scrolled = window.scrollY;
                parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper para saudação (Brasília Time)
    const getGreeting = () => {
        const now = new Date();
        // Ajuste manual para UTC-3 (Brasília) para garantir consistência
        // Obtém o deslocamento atual em milissegundos e ajusta para -3h
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const brasiliaTime = new Date(utc - 3 * 60 * 60 * 1000);
        const hour = brasiliaTime.getHours();

        if (hour >= 5 && hour < 12) return t('Bom dia', 'Good morning', 'Buenos días');
        if (hour >= 12 && hour < 18) return t('Boa tarde', 'Good afternoon', 'Buenas tardes');
        return t('Boa noite', 'Good evening', 'Buenas noches');
    };

    const greeting = getGreeting();

    return (
        <div className="relative h-[26rem] sm:h-[30rem] bg-gray-900 overflow-hidden shadow-xl group">
            {/* Controles Superiores + Guia Interativo (Esquerda) */}
            <div className="absolute top-5 left-5 z-40 flex flex-col gap-2 animate-fadeIn">
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            hapticFeedback('light');
                            toggleLanguage();
                        }}
                        className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-black/10 transition-all flex items-center gap-1 justify-center font-bold text-sm"
                    >
                        {currentLang === 'pt' ? '🇺🇸' : currentLang === 'en' ? '🇪🇸' : '🇧🇷'}
                    </button>

                    {toggleTheme && (
                        <button
                            onClick={toggleTheme}
                            className="px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-black/10 transition-all flex items-center justify-center"
                        >
                            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
                        </button>
                    )}
                    <WeatherWidget />
                </div>

                {/* Guia Interativo alinhado abaixo dos ícones */}
            </div>

            <div ref={parallaxRef} className="absolute inset-0 w-full h-full will-change-transform">
                {heroSlides.map((img, index) => (
                    <div
                        key={`${img}-${index}`}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <OptimizedImage
                            src={img}
                            alt="Flats Integração"
                            className="w-full h-full object-cover opacity-100"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            fetchPriority={index === 0 ? 'high' : 'auto'}
                        />
                    </div>
                ))}
            </div>

            {/* Enhanced Gradient Overlay for Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-20" />

            {/* Wrapper de Conteúdo com Padding Ajustado para a Dock */}
            {/* AJUSTE FINO: pb-32 para empurrar o texto mais para cima e não ficar atrás da barra */}
            <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-40">
                <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 pointer-events-auto">
                    <div className="mb-1">
                        {config.propertyId === 'integracao' ? (
                            <div className="mb-4 animate-fadeIn flex flex-col items-center text-center w-full">
                                <div className="flex items-center justify-center gap-4 mb-2">
                                    <div className="relative group">
                                        {/* Glassmorphism Ring */}
                                        <div className="absolute -inset-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl" />
                                        <img
                                            src={flatsLogo}
                                            alt="Logo Flats Integração"
                                            className="relative z-10 h-20 w-auto object-contain drop-shadow-2xl"
                                        />
                                        <div
                                            className="absolute inset-0 z-20 animate-logo-shimmer pointer-events-none"
                                            style={{
                                                maskImage: `url(${flatsLogo})`,
                                                WebkitMaskImage: `url(${flatsLogo})`,
                                                maskSize: 'contain',
                                                WebkitMaskSize: 'contain',
                                                maskRepeat: 'no-repeat',
                                                WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center',
                                                WebkitMaskPosition: 'center',
                                            }}
                                        />
                                    </div>
                                    <div className="h-8 w-px bg-white/30 rounded-full mx-1"></div>
                                    <p className="text-white/90 font-light tracking-[0.2em] uppercase text-xs font-heading drop-shadow-sm">
                                        {t('GUIA INTERATIVO', 'INTERACTIVE GUIDE', 'GUÍA INTERACTIVA')}
                                    </p>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2 leading-tight text-white drop-shadow-sm mt-2">
                                    {greeting}, {config.guestName?.split(' ')[0] || 'Visitante'}!
                                </h1>
                            </div>
                        ) : (
                            <div className="mb-4 animate-fadeIn flex flex-col items-center text-center w-full">
                                {/* Text Logo + Guia Interativo (Matching Integração Layout) */}
                                <div className="flex items-center justify-center gap-4 mb-2">
                                    {/* Typographic Logo Lockup */}
                                    {/* Glassmorphism Ring for Lili Logo */}
                                    <div className="relative">
                                        <div className="absolute -inset-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl" />
                                        <LogoLili
                                            className="relative h-16 w-auto text-white drop-shadow-2xl"
                                            sunClassName="text-yellow-400 animate-sunrise-pulse"
                                            textClassName="text-white animate-reveal-curtain"
                                        />
                                    </div>

                                    {/* Vertical Separator */}
                                    <div className="h-10 w-px bg-white/30 rounded-full mx-1"></div>

                                    {/* Label */}
                                    <p className="text-white/90 font-light tracking-[0.2em] uppercase text-xs font-heading drop-shadow-sm">
                                        {t('GUIA INTERATIVO', 'INTERACTIVE GUIDE', 'GUÍA INTERACTIVA')}
                                    </p>
                                </div>

                                <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2 leading-tight text-white drop-shadow-sm mt-2">
                                    {greeting}, {config.guestName?.split(' ')[0] || 'Visitante'}!
                                </h1>
                            </div>
                        )}

                        {config.welcomeMessage ? (
                            <div
                                className={`mt-2 max-w-lg animate-fadeIn ${config.propertyId !== 'integracao' ? 'mx-auto text-center' : ''}`}
                            >
                                <div
                                    className={`h-0.5 w-12 bg-orange-500 mb-3 rounded-full shadow-sm shadow-orange-500/50 ${config.propertyId !== 'integracao' ? 'mx-auto' : ''}`}
                                ></div>
                                <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed font-sans drop-shadow-md tracking-tight">
                                    "{config.welcomeMessage}"
                                </p>
                            </div>
                        ) : (
                            <p
                                className={`text-white/90 text-sm sm:text-lg font-medium font-sans max-w-lg leading-relaxed drop-shadow-sm tracking-tight ${config.propertyId !== 'integracao' ? 'mx-auto text-center' : ''}`}
                            >
                                {t('Sua casa longe de casa no Vale do São Francisco.', 'Your home away from home in the San Francisco Valley.', 'Tu hogar lejos de casa en el Valle del São Francisco.')}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
