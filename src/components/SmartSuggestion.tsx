import React, { useState, useEffect, useMemo } from 'react';
import { Coffee, Utensils, Sunset, Moon, LogOut, CalendarHeart, CalendarClock } from 'lucide-react';
import { fetchOfficialTime } from '../constants';
import { SmartSuggestionsConfig } from '../types';

// --- SKELETON DE CARREGAMENTO ---
const SmartSuggestionSkeleton = () => (
  <div className="mb-6 rounded-2xl h-[80px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700/50 flex items-center px-4 gap-4 shadow-sm">
     <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
     <div className="flex-1 space-y-2">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
     </div>
  </div>
);

// --- CONTEÚDO ESTÁTICO (Otimização: Definido fora do componente) ---
const DEFAULT_TIME_CONTENT = {
  morning: {
    icon: Coffee, label: 'Bom dia', title: 'Café da Manhã', desc: 'Que tal um bolo de rolo na Pão Nosso?',
    color: 'from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30',
    border: 'border-orange-100 dark:border-orange-800/30', textColor: 'text-orange-900 dark:text-orange-100',
    iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300'
  },
  lunch: {
    icon: Utensils, label: 'Almoço', title: 'Vai um Bodinho?', desc: 'O Bodódromo é parada obrigatória!',
    color: 'from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30',
    border: 'border-red-100 dark:border-red-800/30', textColor: 'text-red-900 dark:text-red-100',
    iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300'
  },
  sunset: {
    icon: Sunset, label: 'Fim de Tarde', title: 'Pôr do Sol na Orla', desc: 'Corra para a Orla ou Ilha do Fogo.',
    color: 'from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30',
    border: 'border-indigo-100 dark:border-indigo-800/30', textColor: 'text-indigo-900 dark:text-indigo-100',
    iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
  },
  night: {
    icon: Moon, label: 'Boa Noite', title: 'Jantar ou Delivery?', desc: 'O Villa Romana tem ótimas pizzas!',
    color: 'from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-blue-900/30',
    border: 'border-slate-200 dark:border-slate-700', textColor: 'text-slate-900 dark:text-slate-100',
    iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
  }
};

const CHECKOUT_CONTENT = {
  icon: LogOut, label: 'Despedida', title: 'Hoje é dia de partir', desc: 'Poxa, hoje é dia de despedida. A melhor dica: VOLTE SEMPRE!',
  color: 'from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30',
  border: 'border-blue-100 dark:border-blue-800/30', textColor: 'text-blue-900 dark:text-blue-100',
  iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300'
};

const PRE_CHECKOUT_CONTENT = {
  icon: CalendarClock, label: 'Última Noite', title: 'Amanhã é dia de partir 😢',
  desc: 'Aproveite as últimas horas! Se for sair de madrugada, veja as instruções.',
  color: 'from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30',
  border: 'border-indigo-100 dark:border-indigo-800/30', textColor: 'text-indigo-900 dark:text-indigo-100',
  iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
};

interface SmartSuggestionProps { 
  stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout'; 
  onCheckoutClick: () => void;
  isTimeVerified: boolean;
  customSuggestions?: SmartSuggestionsConfig | null;
}

const SmartSuggestion: React.FC<SmartSuggestionProps> = ({ stayStage, onCheckoutClick, isTimeVerified, customSuggestions }) => {
  
  const [simpleTemp, setSimpleTemp] = useState<number | null>(null);

  // Estado inicial preguiçoso (Lazy initialization)
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'lunch' | 'sunset' | 'night'>(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 15) return 'lunch';
    if (hour >= 15 && hour < 18) return 'sunset';
    return 'night';
  });

  // Verifica horário
  useEffect(() => {
    const checkTime = async () => {
      try {
        const now = await fetchOfficialTime();
        const hour = now.getHours();
        if (hour >= 5 && hour < 11) setTimeOfDay('morning');
        else if (hour >= 11 && hour < 15) setTimeOfDay('lunch');
        else if (hour >= 15 && hour < 18) setTimeOfDay('sunset');
        else setTimeOfDay('night');
      } catch (e) { console.error(e); }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); 
    return () => clearInterval(interval);
  }, []);

  // Verifica temperatura (apenas se necessário)
  useEffect(() => {
    if (stayStage === 'pre_checkin' && !simpleTemp) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=-9.39&longitude=-40.50&current=temperature_2m&timezone=America%2FSao_Paulo')
        .then(r => r.json())
        .then(d => { if(d.current) setSimpleTemp(Math.round(d.current.temperature_2m)); })
        .catch(() => setSimpleTemp(30));
    }
  }, [stayStage, simpleTemp]);

  // Lógica de Sorteio da Sugestão (Random Pick)
  const randomSuggestion = useMemo(() => {
    if (!customSuggestions) return null;
    
    const suggestionsList = customSuggestions[timeOfDay];
    
    if (suggestionsList && Array.isArray(suggestionsList) && suggestionsList.length > 0) {
      // Sorteia um índice aleatório
      const randomIndex = Math.floor(Math.random() * suggestionsList.length);
      return suggestionsList[randomIndex];
    }
    
    return null;
  }, [customSuggestions, timeOfDay]); // Recalcula apenas se as sugestões mudarem ou o turno mudar

  if (!isTimeVerified) return <SmartSuggestionSkeleton />;

  // Lógica de Seleção de Conteúdo
  let activeContent = { ...DEFAULT_TIME_CONTENT[timeOfDay] };

  // Se houver sugestão sorteada, usa ela
  if (randomSuggestion) {
      activeContent.title = randomSuggestion.title;
      activeContent.desc = randomSuggestion.description;
  }

  if (stayStage === 'checkout') activeContent = CHECKOUT_CONTENT;
  if (stayStage === 'pre_checkout') activeContent = PRE_CHECKOUT_CONTENT;
  
  // Pre-checkin é dinâmico (depende da temperatura), então definimos aqui
  if (stayStage === 'pre_checkin') {
    activeContent = {
      icon: CalendarHeart, label: 'Contagem Regressiva', title: 'Prepare as malas! 🧳', 
      desc: `Petrolina te espera! O clima hoje está na casa dos ${simpleTemp || 30}°C.`,
      color: 'from-fuchsia-50 to-purple-50 dark:from-fuchsia-900/30 dark:to-purple-900/30',
      border: 'border-purple-100 dark:border-purple-800/30', textColor: 'text-purple-900 dark:text-purple-100',
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300'
    };
  }

  const Icon = activeContent.icon;

  return (
    <div 
      onClick={stayStage === 'checkout' ? onCheckoutClick : undefined}
      className={`mb-6 rounded-2xl p-1 bg-gradient-to-r ${activeContent.color} shadow-sm dark:shadow-none border ${activeContent.border} relative overflow-hidden transition-all duration-300 ${stayStage === 'checkout' ? 'cursor-pointer hover:shadow-lg active:scale-[0.99]' : ''}`}
    >
      <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-md p-4 rounded-xl flex items-center gap-4 relative z-10">
        <div className={`p-2.5 rounded-xl ${activeContent.iconBg} shadow-sm shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 pr-1"> 
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[9px] font-bold font-sans uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-gray-800 ${activeContent.textColor} shadow-sm`}>
              {activeContent.label}
            </span>
          </div>
          <h3 className={`font-heading font-bold text-base leading-tight mb-0.5 ${activeContent.textColor}`}>{activeContent.title}</h3>
          <p className="text-xs font-medium font-sans text-gray-600 dark:text-gray-300 leading-tight">{activeContent.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default SmartSuggestion;