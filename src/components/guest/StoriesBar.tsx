
import React from 'react';
import { CalendarHeart, Sparkles, Lightbulb } from 'lucide-react';
import { PlaceRecommendation } from '../../types';

interface StoriesBarProps {
  activeEvents: PlaceRecommendation[];
  onOpenStory: (type: 'agenda' | 'curiosities' | 'tips') => void;
  showTips?: boolean;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ activeEvents, onOpenStory, showTips = true }) => {
  return (
    // AJUSTE FINO: -mt-20 para subir bem a barra (estilo App Nativo), mb-1 para colar no conteúdo
    <div className="relative z-40 -mt-20 w-full mb-1">
      {/* Wrapper centralizado */}
      <div className="flex justify-center px-4">

        {/* CÁPSULA / DOCK FLUTUANTE - Dark Glass Style */}
        <div className="flex items-center gap-6 p-3 px-6 bg-black/60 dark:bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">

          {/* --- AGENDA --- */}
          {activeEvents.length > 0 && (
            <button
              onClick={() => onOpenStory('agenda')}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
              style={{ animationDelay: '0ms' }}
            >
              {/* Container do Círculo com Anéis Giratórios */}
              <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                {/* Anel Giratório */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 animate-spin-slow shadow-lg shadow-pink-500/20"></div>

                {/* Miolo Estático */}
                <div className="absolute inset-[2.5px] bg-gray-900 rounded-full flex items-center justify-center z-10 border border-white/10">
                  <CalendarHeart size={22} className="text-pink-400 relative z-10 animate-breathing" strokeWidth={2} />

                  {/* Badge de Contador */}
                  <div className="absolute bottom-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-gray-900 z-20">
                    {activeEvents.length}
                  </div>
                </div>
              </div>

              {/* Texto */}
              <span className="text-[10px] font-bold text-white/90 tracking-wide group-hover:text-pink-400 transition-colors drop-shadow-sm">
                Agenda
              </span>
            </button>
          )}

          {/* --- CURIOSIDADES --- */}
          <button
            onClick={() => onOpenStory('curiosities')}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
            style={{ animationDelay: activeEvents.length > 0 ? '150ms' : '0ms' }}
          >
            <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 animate-spin-slow shadow-lg shadow-indigo-500/20"></div>

              <div className="absolute inset-[2.5px] bg-gray-900 rounded-full flex items-center justify-center z-10 border border-white/10">
                <Sparkles size={22} className="text-indigo-300 relative z-10 animate-breathing" strokeWidth={2} />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white/90 tracking-wide group-hover:text-indigo-400 transition-colors drop-shadow-sm">
              Curiosidades
            </span>
          </button>

          {/* --- DICAS DO FLAT --- */}
          {showTips && (
            <button
              onClick={() => onOpenStory('tips')}
              className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95 animate-pop-in"
              style={{ animationDelay: activeEvents.length > 0 ? '300ms' : '150ms' }}
            >
              <div className="w-[58px] h-[58px] relative rounded-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 animate-spin-slow shadow-lg shadow-amber-500/20"></div>

                <div className="absolute inset-[2.5px] bg-gray-900 rounded-full flex items-center justify-center z-10 border border-white/10">
                  <Lightbulb size={22} className="text-yellow-300 relative z-10 animate-breathing" strokeWidth={2} />
                </div>
              </div>
              <span className="text-[10px] font-bold text-white/90 tracking-wide group-hover:text-amber-400 transition-colors drop-shadow-sm">
                Dicas do Flat
              </span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default React.memo(StoriesBar);
