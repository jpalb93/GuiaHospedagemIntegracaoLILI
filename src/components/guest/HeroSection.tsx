
import React, { useState, useEffect } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import OptimizedImage from '../OptimizedImage';
import WeatherWidget from '../WeatherWidget';
import { GuestConfig } from '../../types';
import { DEFAULT_SLIDES } from '../../constants';

interface HeroSectionProps {
  config: GuestConfig;
  heroSlides?: string[];
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
  currentLang: 'pt' | 'en';
  toggleLanguage: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  config,
  heroSlides = DEFAULT_SLIDES,
  theme,
  toggleTheme,
  currentLang,
  toggleLanguage
}) => {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides]);

  return (
    <div className="relative h-[26rem] sm:h-[30rem] bg-gray-900 overflow-hidden shadow-xl group">
      {/* Controles Superiores */}
      <div className="absolute top-5 right-5 z-50 flex gap-2">
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 dark:bg-black/60 dark:hover:bg-black/80 backdrop-blur-md text-white border border-white/20 shadow-black/10 transition-all flex items-center gap-1 justify-center font-bold text-[10px]"
        >
          <Globe size={12} />
          {currentLang === 'pt' ? 'EN' : 'PT'}
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

      {heroSlides.map((img, index) => (
        <div
          key={`${img}-${index}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentHeroSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <OptimizedImage src={img} alt="Flats Integração" className="w-full h-full object-cover opacity-100" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent z-20" />

      {/* Wrapper de Conteúdo com Padding Ajustado para a Dock */}
      {/* AJUSTE FINO: pb-32 para empurrar o texto mais para cima e não ficar atrás da barra */}
      <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-end pb-40">
        <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 pointer-events-auto">
            <div className="mb-1">
              <p className="text-white/90 font-bold mb-2 tracking-widest uppercase text-[10px] font-heading bg-black/30 inline-block px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                Guia Interativo • Flat de Lili
              </p>
              <h1 className="text-3xl sm:text-5xl font-heading font-bold mb-2 leading-tight text-white drop-shadow-sm">
                Olá, {config.guestName?.split(' ')[0] || 'Visitante'}!
              </h1>

              {config.welcomeMessage ? (
                <div className="mt-2 max-w-lg animate-fadeIn">
                  <div className="h-0.5 w-12 bg-orange-500 mb-3 rounded-full shadow-sm shadow-orange-500/50"></div>
                  <p className="text-white/90 text-lg sm:text-xl font-medium leading-relaxed font-sans drop-shadow-md tracking-tight">
                    "{config.welcomeMessage}"
                  </p>
                </div>
              ) : (
                <p className="text-white/90 text-sm sm:text-lg font-medium font-sans max-w-lg leading-relaxed drop-shadow-sm tracking-tight">
                  Sua casa longe de casa no Vale do São Francisco.
                </p>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
