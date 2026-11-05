import React from 'react';
import { CalendarHeart, Sparkles, Lightbulb } from 'lucide-react';
import { PlaceRecommendation } from '../../types';
import { analytics } from '../../services/analytics';
import { hapticFeedback } from '../../utils/haptics';
import { useLanguage } from '../../hooks/useLanguage';

interface StoriesBarProps {
    activeEvents: PlaceRecommendation[];
    onOpenStory: (type: 'agenda' | 'curiosities' | 'tips') => void;
    showTips?: boolean;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ activeEvents, onOpenStory, showTips = true }) => {
    const { t } = useLanguage();

    return (
        <div className="relative z-30 -mt-12 sm:-mt-16 w-full mb-3">
            <div className="flex justify-center px-4">
                {/* CÁPSULA / DOCK FLUTUANTE — Sol do São Francisco Warm Glass */}
                <div className="stories-scroll-container flex items-center gap-6 p-3 px-6 sm:px-8 bg-[#1C1614]/90 dark:bg-[#16110F]/95 backdrop-blur-2xl border-t border-t-amber-300/40 dark:border-t-amber-400/30 border-x border-b border-amber-500/15 shadow-[0_16px_40px_rgba(18,15,13,0.35)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-[2.2rem] overflow-x-auto no-scrollbar max-w-full">
                    {/* --- AGENDA --- */}
                    {activeEvents.length > 0 && (
                        <button
                            onClick={() => {
                                hapticFeedback('light');
                                analytics.trackStoryViewed({
                                    type: 'agenda',
                                    hasActiveEvents: activeEvents.length > 0,
                                });
                                onOpenStory('agenda');
                            }}
                            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
                            style={{ animationDelay: '0ms' }}
                        >
                            <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-rose-500 animate-spin-slow shadow-lg shadow-orange-500/25"></div>

                                <div className="absolute inset-[2.5px] bg-[#1C1614] rounded-full flex items-center justify-center z-10 border border-amber-200/10">
                                    <CalendarHeart
                                        size={22}
                                        className="text-orange-400 relative z-10 animate-breathing"
                                        strokeWidth={2}
                                    />

                                    <div className="absolute bottom-0.5 right-0.5 bg-orange-600 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-[#1C1614] z-20">
                                        {activeEvents.length}
                                    </div>
                                </div>
                            </div>

                            <span className="text-[10px] font-bold text-stone-100/95 tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-sm">
                                {t('Agenda', 'Agenda', 'Agenda')}
                            </span>
                        </button>
                    )}

                    {/* --- CURIOSIDADES --- */}
                    <button
                        onClick={() => {
                            hapticFeedback('light');
                            analytics.trackStoryViewed({ type: 'curiosities' });
                            onOpenStory('curiosities');
                        }}
                        className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
                        style={{ animationDelay: activeEvents.length > 0 ? '150ms' : '0ms' }}
                    >
                        <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-yellow-300 animate-spin-slow shadow-lg shadow-amber-500/20"></div>

                            <div className="absolute inset-[2.5px] bg-[#1C1614] rounded-full flex items-center justify-center z-10 border border-amber-200/10">
                                <Sparkles
                                    size={22}
                                    className="text-amber-300 relative z-10 animate-breathing"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-stone-100/95 tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-sm">
                            {t('Curiosidades', 'Curiosities', 'Curiosidades')}
                        </span>
                    </button>

                    {/* --- DICAS DO FLAT --- */}
                    {showTips && (
                        <button
                            onClick={() => {
                                hapticFeedback('light');
                                analytics.trackStoryViewed({ type: 'tips' });
                                onOpenStory('tips');
                            }}
                            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
                            style={{ animationDelay: activeEvents.length > 0 ? '300ms' : '150ms' }}
                        >
                            <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-400 animate-spin-slow shadow-lg shadow-emerald-500/20"></div>

                                <div className="absolute inset-[2.5px] bg-[#1C1614] rounded-full flex items-center justify-center z-10 border border-amber-200/10">
                                    <Lightbulb
                                        size={22}
                                        className="text-emerald-300 relative z-10 animate-breathing"
                                        strokeWidth={2}
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-stone-100/95 tracking-wide group-hover:text-emerald-300 transition-colors drop-shadow-sm">
                                {t('Dicas do Flat', 'Flat Tips', 'Consejos del Flat')}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(StoriesBar);
