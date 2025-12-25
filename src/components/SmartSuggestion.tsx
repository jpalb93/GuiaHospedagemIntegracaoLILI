import React, { useState, useEffect } from 'react';
import { Coffee, Utensils, Sunset, Moon, LogOut, CalendarHeart, CalendarClock } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { fetchOfficialTime } from '../constants';
import { SmartSuggestionsConfig, PlaceRecommendation, TimeOfDaySuggestion } from '../types';

// --- SKELETON DE CARREGAMENTO ---
const SmartSuggestionSkeleton = () => (
    <div className="rounded-[22px] h-[100px] w-full bg-gray-100 dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700/50 flex items-center px-5 gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700"></div>
        <div className="flex-1 space-y-2.5">
            <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 w-full max-w-[200px] bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
    </div>
);

interface SmartSuggestionProps {
    stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout' | 'post_checkout';
    onCheckoutClick: () => void;
    isTimeVerified: boolean;
    customSuggestions?: SmartSuggestionsConfig | null;
    places?: PlaceRecommendation[];
    activeEvents?: PlaceRecommendation[];
}

const SmartSuggestion: React.FC<SmartSuggestionProps> = ({
    stayStage,
    onCheckoutClick,
    isTimeVerified,
    customSuggestions,
    places = [],
    activeEvents = [],
}) => {
    const { t } = useLanguage();
    const [simpleTemp, setSimpleTemp] = useState<number | null>(null);

    // --- CONTEÚDO ESTÁTICO (Agora com Tradução) ---
    const DEFAULT_TIME_CONTENT = {
        morning: {
            icon: Coffee,
            label: t('Bom dia', 'Good morning', 'Buenos días'),
            title: t('Café da Manhã', 'Breakfast', 'Desayuno'),
            desc: t(
                'Que tal um bolo de rolo na Pão Nosso?',
                'How about a roll cake at Pão Nosso?',
                '¿Qué tal un pastel de rollo en Pão Nosso?'
            ),
            color: 'from-orange-400 to-amber-400',
            textColor: 'text-orange-900 dark:text-orange-100',
            iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-300',
        },
        lunch: {
            icon: Utensils,
            label: t('Almoço', 'Lunch', 'Almuerzo'),
            title: t('Vai um Bodinho?', 'Want some Goat Meat?', '¿Quieres carne de chivo?'),
            desc: t(
                'O Bodódromo é parada obrigatória!',
                'The Bodódromo is a mandatory stop!',
                '¡El Bodódromo es una parada obligatoria!'
            ),
            color: 'from-red-400 to-orange-400',
            textColor: 'text-red-900 dark:text-red-100',
            iconBg: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300',
        },
        sunset: {
            icon: Sunset,
            label: t('Fim de Tarde', 'Late Afternoon', 'Atardecer'),
            title: t(
                'Pôr do Sol na Orla',
                'Sunset at the Waterfront',
                'Puesta de Sol en la Orilla'
            ),
            desc: t(
                'Corra para a Orla e veja um pôr do sol deslumbrante!',
                'Run to the Waterfront and see a stunning sunset!',
                '¡Corre a la Orilla y ve una puesta de sol impresionante!'
            ),
            color: 'from-indigo-400 to-purple-400',
            textColor: 'text-indigo-900 dark:text-indigo-100',
            iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
        },
        night: {
            icon: Moon,
            label: t('Boa Noite', 'Good Night', 'Buenas Noches'),
            title: t('Jantar ou Delivery?', 'Dinner or Delivery?', '¿Cena o Delivery?'),
            desc: t(
                'O Villa Romana tem ótimas pizzas!',
                'Villa Romana has great pizzas!',
                '¡Villa Romana tiene excelentes pizzas!'
            ),
            color: 'from-slate-400 to-blue-400',
            textColor: 'text-slate-900 dark:text-slate-100',
            iconBg: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
        },
    };

    const CHECKOUT_CONTENT = {
        icon: LogOut,
        label: t('Despedida', 'Farewell', 'Despedida'),
        title: t('Hoje é dia de partir', 'Today is departure day', 'Hoy es día de partir'),
        desc: t(
            'Poxa, hoje é dia de despedida. A melhor dica: VOLTE SEMPRE!',
            'Oh, today is goodbye. Best tip: COME BACK SOON!',
            'Oh, hoy es despedida. Mejor consejo: ¡VUELVE PRONTO!'
        ),
        color: 'from-blue-400 to-cyan-400',
        textColor: 'text-blue-900 dark:text-blue-100',
        iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300',
    };

    const PRE_CHECKOUT_CONTENT = {
        icon: CalendarClock,
        label: t('Última Noite', 'Last Night', 'Última Noche'),
        title: t(
            'Amanhã é dia de partir 😢',
            'Tomorrow is departure day 😢',
            'Mañana es día de partir 😢'
        ),
        desc: t(
            'Aproveite as últimas horas! Se for sair de madrugada, veja as instruções.',
            'Enjoy the last hours! If leaving at dawn, see instructions.',
            '¡Disfruta las últimas horas! Si sales de madrugada, mira instrucciones.'
        ),
        color: 'from-indigo-400 to-blue-400',
        textColor: 'text-indigo-900 dark:text-indigo-100',
        iconBg: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300',
    };

    // Estado inicial preguiçoso
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'lunch' | 'sunset' | 'night'>(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) return 'morning';
        if (hour >= 11 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 18) return 'sunset';
        return 'night';
    });

    useEffect(() => {
        const checkTime = async () => {
            try {
                const now = await fetchOfficialTime();
                const hour = now.getHours();
                if (hour >= 5 && hour < 11) setTimeOfDay('morning');
                else if (hour >= 11 && hour < 15) setTimeOfDay('lunch');
                else if (hour >= 15 && hour < 18) setTimeOfDay('sunset');
                else setTimeOfDay('night');
            } catch (e) {
                console.error(e);
            }
        };

        checkTime();
        const interval = setInterval(checkTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (stayStage === 'pre_checkin' && !simpleTemp) {
            fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-9.39&longitude=-40.50&current=temperature_2m&timezone=America%2FSao_Paulo'
            )
                .then((r) => r.json())
                .then((d) => {
                    if (d.current) setSimpleTemp(Math.round(d.current.temperature_2m));
                })
                .catch(() => setSimpleTemp(30));
        }
    }, [stayStage, simpleTemp]);

    const [randomSuggestion, setRandomSuggestion] = useState<TimeOfDaySuggestion | null>(null);

    useEffect(() => {
        if (customSuggestions) {
            const suggestionsList = customSuggestions[timeOfDay];
            if (suggestionsList && Array.isArray(suggestionsList) && suggestionsList.length > 0) {
                const randomIndex = Math.floor(Math.random() * suggestionsList.length);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setRandomSuggestion(suggestionsList[randomIndex]);
            } else {
                setRandomSuggestion(null);
            }
        }
    }, [customSuggestions, timeOfDay]);

    const { dynamicPlace, isEventToday } = React.useMemo(() => {
        if (randomSuggestion) return { dynamicPlace: null, isEventToday: false };

        // 2. 🔴 PRIORIDADE ABSOLUTA: Eventos HOJE (+1000 pontos)
        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
        const eventToday = activeEvents.find((event) => event.eventDate === today);

        if (eventToday) {
            return { dynamicPlace: eventToday, isEventToday: true };
        }

        // 3. 🧠 SUPER SMART: Sistema de pontuação para escolher o melhor lugar
        if (places && places.length > 0) {
            const now = new Date();
            const isWeekend = now.getDay() === 5 || now.getDay() === 6;

            const validCategoriesForTime = {
                morning: ['cafes', 'essentials', 'snacks'],
                lunch: ['selfservice', 'alacarte', 'oriental', 'pasta', 'salads'],
                sunset: ['attractions', 'bikes', 'snacks', 'cafes'],
                night: [
                    'burgers',
                    'pizza',
                    'skewers',
                    'oriental',
                    'snacks',
                    'bars',
                    'pasta',
                    'alacarte',
                    'alacarte', // Duplicate in original?
                ],
            };

            const allowedCategories = validCategoriesForTime[timeOfDay] || [];

            const eligiblePlaces = places.filter((place) => {
                if (!place.category || !allowedCategories.includes(place.category)) return false;
                const hasDelivery = place.orderLink || place.whatsapp;
                const isAttraction = ['attractions', 'passeios', 'events', 'eventos'].includes(
                    (place.category || '').toLowerCase()
                );
                if (hasDelivery && !isAttraction && timeOfDay !== 'night') {
                    return false;
                }
                return true;
            });

            if (eligiblePlaces.length === 0) return { dynamicPlace: null, isEventToday: false };

            const scoredPlaces = eligiblePlaces.map((place) => {
                let score = 0;
                score += 100;
                if (isWeekend && place.category && ['bars', 'events'].includes(place.category))
                    score += 50;
                if (place.orderLink || place.whatsapp) score += 30;
                if (timeOfDay === 'sunset') {
                    const name = (place.name || '').toLowerCase();
                    const desc = (place.description || '').toLowerCase();
                    if (
                        name.includes('orla') ||
                        desc.includes('orla') ||
                        name.includes('ilha do fogo') ||
                        desc.includes('ilha do fogo')
                    ) {
                        score += 500;
                    }
                }
                return { place, score };
            });

            scoredPlaces.sort((a, b) => b.score - a.score);
            const topCandidates = scoredPlaces.slice(0, 3);

            if (topCandidates.length > 0) {
                const currentMinute = new Date().getMinutes();
                const rotationIndex = Math.floor(currentMinute / 15) % topCandidates.length;
                return { dynamicPlace: topCandidates[rotationIndex].place, isEventToday: false };
            }
        }
        return { dynamicPlace: null, isEventToday: false };
    }, [randomSuggestion, places, activeEvents, timeOfDay]);

    if (!isTimeVerified) return <SmartSuggestionSkeleton />;

    let activeContent = { ...DEFAULT_TIME_CONTENT[timeOfDay] };

    if (randomSuggestion) {
        activeContent.title = randomSuggestion.title;
        activeContent.desc = randomSuggestion.description;
    } else if (dynamicPlace) {
        activeContent.title = `${t('Que tal o', 'How about', '¿Qué tal el')} ${t(dynamicPlace.name, dynamicPlace.name_en, dynamicPlace.name_es)}?`;
        activeContent.desc = t(
            dynamicPlace.description,
            dynamicPlace.description_en,
            dynamicPlace.description_es
        );
    }

    if (stayStage === 'checkout' || stayStage === 'post_checkout') activeContent = CHECKOUT_CONTENT;
    if (stayStage === 'pre_checkout') activeContent = PRE_CHECKOUT_CONTENT;

    if (stayStage === 'pre_checkin') {
        activeContent = {
            icon: CalendarHeart,
            label: t('Contagem Regressiva', 'Countdown', 'Cuenta Regresiva'),
            title: t('Prepare as malas! 🧳', 'Pack your bags! 🧳', '¡Empaca tus maletas! 🧳'),
            desc: `${t('Petrolina te espera!', 'Petrolina awaits you!', '¡Petrolina te espera!')} ${t('O clima hoje está na casa dos', "Today's weather is around", 'El clima hoy está alrededor de')} ${simpleTemp || 30}°C.`,
            color: 'from-fuchsia-400 to-purple-400',
            textColor: 'text-purple-900 dark:text-purple-100',
            iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300',
        };
    }

    const Icon = activeContent.icon;

    return (
        <div
            onClick={stayStage === 'checkout' ? onCheckoutClick : undefined}
            className={`w-full shrink-0 rounded-[24px] p-[2px] bg-gradient-to-br ${activeContent.color} shadow-lg shadow-gray-200/50 dark:shadow-none relative overflow-hidden transition-all duration-300 animate-pulse-subtle ${stayStage === 'checkout' ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : 'shrink-0'}`}
        >
            <div className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-xl p-5 rounded-[22px] flex items-start gap-4 relative">
                {/* Badge HOJE para eventos */}
                {isEventToday && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full animate-pulse uppercase tracking-wider shadow-lg">
                        {t('HOJE', 'TODAY', 'HOY')}
                    </div>
                )}
                <div
                    className={`p-3.5 rounded-2xl ${activeContent.iconBg} shadow-sm shrink-0 mt-0.5 transition-transform hover:scale-110`}
                >
                    <Icon size={24} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span
                            className={`text-[10px] font-extrabold font-heading uppercase tracking-widest px-3 py-1 rounded-lg bg-white dark:bg-black/20 ${activeContent.textColor} border border-black/5 dark:border-white/10`}
                        >
                            {activeContent.label}
                        </span>
                    </div>
                    <h3
                        className={`font-heading font-bold text-lg leading-tight mb-1.5 ${activeContent.textColor}`}
                    >
                        {activeContent.title}
                    </h3>
                    <p className="text-sm font-medium font-sans text-gray-600 dark:text-gray-300 leading-relaxed">
                        {activeContent.desc}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SmartSuggestion;
