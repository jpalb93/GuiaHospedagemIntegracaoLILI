
import React from 'react';
import { CalendarHeart, Sparkles, Lightbulb } from 'lucide-react';
import { PlaceRecommendation } from '../../types';

interface StoriesBarProps {
  activeEvents: PlaceRecommendation[];
  onOpenStory: (type: 'agenda' | 'curiosities' | 'tips') => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ activeEvents, onOpenStory }) => {
  return (
    <div className="relative z-40 -mt-16 w-full">
      {/* AJUSTE DE LAYOUT: Wrapper centralizado */}
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="flex gap-3 overflow-x-auto pb-4 pt-2 no-scrollbar items-start">
          {activeEvents.length > 0 && (
            <button onClick={() => onOpenStory('agenda')} className="w-20 flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-red-500 to-orange-500 shadow-lg shadow-pink-500/30 animate-spin-slow-once">
                <div className="w-full h-full bg-gray-900 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-red-500/20 opacity-50"></div>
                  <CalendarHeart size={20} className="text-pink-400 relative z-10" />
                  <div className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm z-20">{activeEvents.length}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 text-center whitespace-nowrap">Agenda</span>
            </button>
          )}

          <button onClick={() => onOpenStory('curiosities')} className="w-20 flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-blue-500 shadow-lg shadow-indigo-500/30">
              <div className="w-full h-full bg-gray-900 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-50"></div>
                <Sparkles size={20} className="text-indigo-300 relative z-10" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 text-center whitespace-nowrap">Curiosidades</span>
          </button>

          <button onClick={() => onOpenStory('tips')} className="w-20 flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform active:scale-95">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-400 via-yellow-500 to-orange-500 shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-gray-900 rounded-full border-2 border-white/10 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 opacity-50"></div>
                <Lightbulb size={20} className="text-yellow-300 relative z-10" />
              </div>
            </div>
            <span className="text-[10px] font-bold text-white drop-shadow-md bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-md border border-white/10 text-center whitespace-nowrap">Dicas do Flat</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoriesBar;
