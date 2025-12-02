import React, { useState, useEffect } from 'react';
import { X, CalendarHeart, MapPin, ExternalLink } from 'lucide-react';
import OptimizedImage from './OptimizedImage';

// --- TIPO DO ITEM DO STORY ---
export interface StoryItem {
    id: string;
    type: 'event' | 'curiosity';
    title: string;
    subtitle?: string;
    content?: string;
    image?: string;
    link?: string;
    icon?: React.ElementType;
    color?: string;
    address?: string;
}

interface StoryViewerProps {
    isOpen: boolean;
    onClose: () => void;
    items: StoryItem[];
    startIndex?: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ isOpen, onClose, items, startIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(startIndex);
    const [progress, setProgress] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (currentIndex !== startIndex) setCurrentIndex(startIndex);
            if (progress !== 0) setProgress(0);
            if (isPaused) setIsPaused(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, startIndex]);

    const handleNext = () => {
        if (currentIndex < items.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setProgress(0);
        } else {
            onClose();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
            setProgress(0);
        } else {
            setProgress(0);
        }
    };

    useEffect(() => {
        if (!isOpen || items.length === 0) return;

        const duration = 10000; // 10 SEGUNDOS
        const intervalTime = 50;
        const step = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            if (!isPaused) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        handleNext();
                        return 0;
                    }
                    return prev + step;
                });
            }
        }, intervalTime);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, currentIndex, items.length, isPaused]);

    if (!isOpen || items.length === 0) return null;

    const currentStory = items[currentIndex];
    if (!currentStory) return null;

    const Icon = currentStory.icon;

    return (
        <div
            className="fixed inset-0 z-[200] bg-black flex flex-col animate-fadeIn select-none"
            onMouseDown={() => setIsPaused(true)}
            onMouseUp={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseLeave={() => setIsPaused(false)}
        >

            {/* Barra de Progresso */}
            <div className="pt-4 pb-2 px-2 flex gap-1 z-50 relative pointer-events-none">
                {items.map((_, idx) => (
                    <div key={idx} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-100 ease-linear"
                            style={{
                                width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 flex justify-between items-center z-50 relative text-white pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-none">
                    <div className={`p-1.5 rounded-full bg-white/20 backdrop-blur-md`}>
                        {Icon && <Icon size={14} className="text-white" />}
                    </div>
                    <div>
                        <span className="font-bold text-sm font-heading block leading-none drop-shadow-md">{currentStory.title}</span>
                        {currentStory.subtitle && <span className="text-xs opacity-90 font-medium drop-shadow-sm">{currentStory.subtitle}</span>}
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors pointer-events-auto cursor-pointer">
                    <X size={24} />
                </button>
            </div>

            {currentStory.image ? (
                // IMPORTANTE: key={currentStory.id} força o React a recriar o componente de imagem
                <div key={currentStory.id} className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <OptimizedImage
                        src={currentStory.image}
                        alt={currentStory.title}
                        className={`w-full h-full object-cover transition-transform duration-[10s] ease-linear ${isPaused ? 'scale-100' : 'scale-[1.03]'}`}
                    />
                </div>
            ) : (
                <div className={`absolute inset-0 z-0 bg-gradient-to-br ${currentStory.color || 'from-gray-800 to-black'}`} />
            )}

            {!currentStory.image && Icon && (
                <Icon size={300} className="absolute text-white opacity-5 rotate-12 -right-20 -bottom-20 z-0 pointer-events-none" />
            )}

            <div className="absolute inset-0 z-10 flex">
                <div
                    className="w-1/3 h-full cursor-pointer"
                    onClick={() => { if (!isPaused) handlePrev(); }}
                    role="button"
                    tabIndex={0}
                    aria-label="Story anterior"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePrev(); }}
                ></div>
                <div
                    className="w-1/3 h-full cursor-pointer"
                    onClick={() => { if (!isPaused) handleNext(); }}
                    role="button"
                    tabIndex={0}
                    aria-label="Próximo story"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNext(); }}
                ></div>
                <div
                    className="w-1/3 h-full cursor-pointer"
                    onClick={() => { if (!isPaused) handleNext(); }}
                    role="button"
                    tabIndex={0}
                    aria-label="Próximo story"
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleNext(); }}
                ></div>
            </div>

            <div className={`absolute inset-0 z-20 flex flex-col items-center p-6 text-center pointer-events-none ${currentStory.type === 'event' ? 'justify-center' : 'justify-end pb-40'
                }`}>
                <div className={`flex flex-col items-center w-full max-w-md animate-scaleIn ${currentStory.type === 'event' ? 'justify-center h-full' : ''
                    }`}>

                    {currentStory.type === 'event' ? (
                        <>
                            <div className="mb-3 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
                                <CalendarHeart size={14} />
                                {currentStory.subtitle}
                            </div>

                            {/* ENDEREÇO NO STORY */}
                            {currentStory.address && (
                                <div className="mb-6 flex items-center gap-2 text-white/90 text-xs font-medium bg-black/30 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                                    <MapPin size={12} className="text-orange-400" />
                                    <span className="notranslate">{currentStory.address}</span>
                                </div>
                            )}

                            <h2 className="text-3xl md:text-4xl text-white font-bold font-heading leading-tight drop-shadow-xl mb-4">
                                {currentStory.title}
                            </h2>

                            {currentStory.content && (
                                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl text-white/90 text-sm md:text-base leading-relaxed mb-8 shadow-lg max-h-40 overflow-y-auto no-scrollbar">
                                    {currentStory.content}
                                </div>
                            )}

                            {currentStory.link && (
                                <a
                                    href={currentStory.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="pointer-events-auto relative z-50 px-8 py-4 bg-white text-pink-600 font-bold rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 animate-bounce-slow uppercase tracking-wide text-sm cursor-pointer hover:bg-gray-100"
                                >
                                    {currentStory.link.includes('instagram') ? 'Ver no Instagram' : 'Garantir Ingresso / Info'}
                                    <ExternalLink size={16} />
                                </a>
                            )}
                        </>
                    ) : (
                        /* CURIOSIDADE OU DICA */
                        <>
                            {!currentStory.image && (
                                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-8 border border-white/20 shadow-lg backdrop-blur-sm">
                                    {Icon && <Icon size={40} className="text-white" />}
                                </div>
                            )}

                            <p className="text-xl md:text-2xl text-white font-bold font-heading leading-relaxed drop-shadow-md">
                                "{currentStory.content}"
                            </p>

                            <div className="mt-8 text-white/50 text-xs font-medium uppercase tracking-widest animate-pulse">
                                {isPaused ? 'Pausado' : 'Segure para ler'}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default React.memo(StoryViewer);
