
import React from 'react';
import { CalendarHeart, Sparkles, Lightbulb } from 'lucide-react';
import { PlaceRecommendation } from '../../types';

interface StoriesBarProps {
  activeEvents: PlaceRecommendation[];
  onOpenStory: (type: 'agenda' | 'curiosities' | 'tips') => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ activeEvents, onOpenStory }) => {
  return (
    // AJUSTE FINO: -mt-20 para subir bem a barra (estilo App Nativo), mb-1 para colar no conteúdo
    <div className="relative z-40 -mt-20 w-full mb-1">
      {/* Wrapper centralizado */}
      <div className="flex justify-center px-4">
        
        {/* CÁPSULA / DOCK FLUTUANTE */}
        <div className="flex items-center gap-6 p-3 px-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 rounded-[2rem] overflow-x-auto no-scrollbar max-w-full">
          
          {/* --- AGENDA --- */}
          {activeEvents.length > 0 && (
            <button onClick={() => onOpenStory('agenda')} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
              {/* Anel de Gradiente */}
              <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 shadow-md shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
                {/* Círculo Interno */}
                <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full border-[2px] border-transparent bg-clip-padding flex items-center justify-center relative overflow-hidden">
                  <CalendarHeart size={22} className="text-pink-600 dark:text-pink-400 relative z-10" strokeWidth={2} />
                  
                  {/* Badge de Contador */}
                  <div className="absolute bottom-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-[1.5px] border-white dark:border-gray-800 z-20">
                    {activeEvents.length}
                  </div>
                </div>
              </div>
              {/* Texto Escuro no Modo Claro / Claro no Escuro */}
              <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 tracking-wide group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                Agenda
              </span>
            </button>
          )}

          {/* --- CURIOSIDADES --- */}
          <button onClick={() => onOpenStory('curiosities')} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
            <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full border-[2px] border-transparent bg-clip-padding flex items-center justify-center relative overflow-hidden">
                <Sparkles size={22} className="text-indigo-600 dark:text-indigo-300 relative z-10" strokeWidth={2} />
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Curiosidades
            </span>
          </button>

          {/* --- DICAS DO FLAT --- */}
          <button onClick={() => onOpenStory('tips')} className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
            <div className="w-[58px] h-[58px] rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 shadow-md shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-shadow">
              <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full border-[2px] border-transparent bg-clip-padding flex items-center justify-center relative overflow-hidden">
                <Lightbulb size={22} className="text-amber-600 dark:text-yellow-300 relative z-10" strokeWidth={2} />
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300 tracking-wide group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Dicas do Flat
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default StoriesBar;
