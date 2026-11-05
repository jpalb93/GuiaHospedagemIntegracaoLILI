import React, { useState, useEffect } from 'react';
import {
    Coffee,
    Utensils,
    Sunset,
    Moon,
    LogOut,
    CalendarHeart,
    CalendarClock,
    ChevronRight,
    X,
    MapPin,
    Car,
    ExternalLink,
    Phone,
    MessageCircle,
    ShoppingBag,
    Ticket,
    Calendar,
    Clock,
    Sparkles,
    Wind,
    VolumeX,
    ShieldAlert,
    ThermometerSun,
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { fetchOfficialTime } from '../constants';
import {
    SmartSuggestionsConfig,
    PlaceRecommendation,
    TimeOfDaySuggestion,
    GuestConfig,
} from '../types';
import { getFirstName } from '../utils/helpers';
import OptimizedImage from './ui/OptimizedImage';

// --- SKELETON DE CARREGAMENTO ---
const SmartSuggestionSkeleton = () => (
    <div className="rounded-[22px] h-[100px] w-full bg-stone-100 dark:bg-[#1C1614] animate-pulse border border-stone-200 dark:border-amber-500/15 flex items-center px-5 gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-800"></div>
        <div className="flex-1 space-y-2.5">
            <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded-full"></div>
            <div className="h-4 w-full max-w-[200px] bg-stone-200 dark:bg-stone-800 rounded-full"></div>
        </div>
    </div>
);

interface SmartSuggestionProps {
    stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout' | 'post_checkout';
    onCheckoutClick: () => void;
    onCheckinClick?: () => void;
    onOpenCategorySheet?: (sheetName: string) => void;
    isTimeVerified: boolean;
    customSuggestions?: SmartSuggestionsConfig | null;
    places?: PlaceRecommendation[];
    activeEvents?: PlaceRecommendation[];
    config?: GuestConfig;
    hostPhone?: string;
    onEmergency?: () => void;
}

const SmartSuggestion: React.FC<SmartSuggestionProps> = ({
    stayStage,
    onCheckoutClick,
    onCheckinClick,
    onOpenCategorySheet,
    isTimeVerified,
    customSuggestions,
    places = [],
    activeEvents = [],
    config,
    hostPhone,
    onEmergency,
}) => {
    const { t } = useLanguage();
    const [simpleTemp, setSimpleTemp] = useState<number | null>(null);
    const [currentHour, setCurrentHour] = useState<number>(() => new Date().getHours());
    const [selectedPlace, setSelectedPlace] = useState<PlaceRecommendation | null>(null);

    // --- CONTEÚDO ESTÁTICO (Sol do São Francisco & Terracota) ---
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
            color: 'from-amber-400 to-orange-500',
            textColor: 'text-stone-900 dark:text-amber-100',
            iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
            defaultSheet: 'Cafés e Padarias',
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
            color: 'from-[#C85A32] to-orange-500',
            textColor: 'text-stone-900 dark:text-orange-100',
            iconBg: 'bg-orange-100 text-[#C85A32] dark:bg-orange-500/15 dark:text-orange-300',
            defaultSheet: 'Bares e Restaurantes',
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
            color: 'from-amber-500 to-[#C85A32]',
            textColor: 'text-stone-900 dark:text-amber-100',
            iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
            defaultSheet: 'Passeios & Lazer',
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
            color: 'from-amber-500/80 to-stone-600',
            textColor: 'text-stone-900 dark:text-stone-100',
            iconBg: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-amber-300',
            defaultSheet: 'Bares e Restaurantes',
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
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-stone-900 dark:text-amber-100',
        iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        defaultSheet: '',
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
        color: 'from-amber-500 to-orange-600',
        textColor: 'text-stone-900 dark:text-amber-100',
        iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        defaultSheet: '',
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
                setCurrentHour(hour);
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

    // Radar do Clima em Petrolina (Open-Meteo) para cálculo de conforto térmico
    useEffect(() => {
        if (!simpleTemp) {
            fetch(
                'https://api.open-meteo.com/v1/forecast?latitude=-9.39&longitude=-40.50&current=temperature_2m&timezone=America%2FSao_Paulo'
            )
                .then((r) => r.json())
                .then((d) => {
                    if (d.current) setSimpleTemp(Math.round(d.current.temperature_2m));
                })
                .catch(() => setSimpleTemp(31));
        }
    }, [simpleTemp]);

    // Modo Descanso Zen: Ativo entre 22h e 05h da manhã (fora do check-in/out)
    const isLateNight =
        (currentHour >= 22 || currentHour < 5) &&
        stayStage !== 'checkout' &&
        stayStage !== 'pre_checkout' &&
        stayStage !== 'pre_checkin';

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

        const now = new Date();
        const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
        const eventToday = activeEvents.find((event) => event.eventDate === today);

        if (eventToday) {
            return { dynamicPlace: eventToday, isEventToday: true };
        }

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
        activeContent.title = `${t('Que tal o', 'How about', '¿Qué tal el')} ${t(dynamicPlace.name, dynamicPlace.name_en || dynamicPlace.name, dynamicPlace.name_es || dynamicPlace.name)}?`;
        activeContent.desc = t(
            dynamicPlace.description,
            dynamicPlace.description_en || dynamicPlace.description,
            dynamicPlace.description_es || dynamicPlace.description
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
            color: 'from-amber-400 to-[#C85A32]',
            textColor: 'text-stone-900 dark:text-amber-100',
            iconBg: 'bg-amber-100 text-[#C85A32] dark:bg-amber-500/15 dark:text-amber-300',
            defaultSheet: '',
        };
    }

    const Icon = activeContent.icon;

    const handleCardClick = () => {
        if (navigator.vibrate) navigator.vibrate(40);

        if (stayStage === 'checkout' || stayStage === 'pre_checkout') {
            onCheckoutClick();
            return;
        }

        if (stayStage === 'pre_checkin') {
            onCheckinClick?.();
            return;
        }

        if (dynamicPlace) {
            setSelectedPlace(dynamicPlace);
            return;
        }

        if (activeContent.defaultSheet && onOpenCategorySheet) {
            onOpenCategorySheet(activeContent.defaultSheet);
        }
    };

    const ctaHint = (() => {
        if (stayStage === 'checkout' || stayStage === 'pre_checkout') {
            return t(
                'Ver instruções de saída',
                'View exit instructions',
                'Ver instrucciones de salida'
            );
        }
        if (stayStage === 'pre_checkin') {
            return t(
                'Ver instruções de chegada',
                'View arrival instructions',
                'Ver instrucciones de llegada'
            );
        }
        if (dynamicPlace) {
            return t('Toque para ver detalhes', 'Tap for details', 'Toca para ver detalles');
        }
        return t(
            'Toque para explorar opções',
            'Tap to explore options',
            'Toca para explorar opciones'
        );
    })();

    const cleanHostPhone = (hostPhone || '').replace(/\D/g, '');
    const guestFirstName = getFirstName(config?.guestName, t('Hóspede', 'Guest', 'Huésped'));
    const flatUnit = config?.flatNumber
        ? `Flat ${config.flatNumber}`
        : t('meu Flat', 'my Flat', 'mi Flat');
    const checkOutTime = config?.checkOutTime || '11:00';

    const lateCheckoutMsg = encodeURIComponent(
        `Olá! Tudo bem? Aqui é ${guestFirstName}, do ${flatUnit}. Gostaria de verificar se há disponibilidade para estender o meu checkout hoje por mais um período (Late Checkout). Há possibilidade?`
    );
    const lateCheckoutUrl = cleanHostPhone
        ? `https://wa.me/${cleanHostPhone}?text=${lateCheckoutMsg}`
        : '#';

    const selectedDisplayName = selectedPlace
        ? t(
              selectedPlace.name,
              selectedPlace.name_en || selectedPlace.name,
              selectedPlace.name_es || selectedPlace.name
          )
        : '';
    const selectedDisplayDesc = selectedPlace
        ? t(
              selectedPlace.description,
              selectedPlace.description_en || selectedPlace.description,
              selectedPlace.description_es || selectedPlace.description
          )
        : '';
    const selectedCategory = (selectedPlace?.category ?? '').toLowerCase();
    const isAttraction =
        selectedCategory === 'attractions' ||
        selectedCategory === 'passeios' ||
        selectedCategory === 'events' ||
        selectedCategory === 'eventos';
    const ActionIcon = isAttraction ? Ticket : ShoppingBag;
    const actionLabel = isAttraction
        ? t('Reservar / Ver Site', 'Book / View Site', 'Reservar / Ver Sitio')
        : t('Fazer Pedido Online', 'Order Online', 'Pedir en Línea');
    const googleMapsUrl = selectedPlace?.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedPlace.name} ${selectedPlace.address} Petrolina PE`)}`
        : null;

    // --- RENDER CARD CONTENT ---
    const renderCardBody = () => {
        // CASO 1: DIA DO CHECKOUT OU ÚLTIMA NOITE (LEMBRETE INTELIGENTE + LATE CHECKOUT)
        if (stayStage === 'checkout' || stayStage === 'pre_checkout') {
            return (
                <div className="w-full shrink-0 rounded-[24px] p-[1.5px] bg-gradient-to-br from-amber-400/80 via-[#C85A32] to-orange-700/80 shadow-xl shadow-orange-950/20 relative overflow-hidden transition-all duration-300">
                    <div className="bg-[#FAF7F2]/95 dark:bg-[#181311]/95 backdrop-blur-xl p-5 sm:p-6 rounded-[22.5px] relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

                        {/* Header: Icon + Badges */}
                        <div className="flex items-center justify-between gap-3 mb-3 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-100 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-400 border border-orange-200 dark:border-amber-500/30 shadow-sm shrink-0">
                                    <CalendarClock size={22} strokeWidth={2.2} />
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-heading uppercase tracking-wider px-3 py-1 rounded-full bg-orange-100 dark:bg-amber-950/70 text-[#C85A32] dark:text-amber-300 border border-orange-200 dark:border-amber-500/30">
                                        <Clock size={11} />{' '}
                                        {t('Checkout às', 'Checkout at', 'Salida a las')}{' '}
                                        {checkOutTime}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300">
                                        {stayStage === 'checkout'
                                            ? t('Partida Hoje', 'Departure Today', 'Salida Hoy')
                                            : t('Última Noite', 'Last Night', 'Última Noche')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Título & Mensagem */}
                        <div className="relative z-10 mb-4">
                            <h3 className="font-display font-medium text-lg sm:text-xl text-stone-900 dark:text-stone-50 leading-snug mb-1.5">
                                {stayStage === 'checkout'
                                    ? t(
                                          `Seu checkout é hoje às ${checkOutTime}`,
                                          `Your checkout is today at ${checkOutTime}`,
                                          `Su salida es hoy a las ${checkOutTime}`
                                      )
                                    : t(
                                          'Amanhã é dia de despedida',
                                          'Tomorrow is departure day',
                                          'Mañana es día de despedida'
                                      )}
                            </h3>

                            <p className="text-xs sm:text-sm font-medium font-sans text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                                {stayStage === 'checkout'
                                    ? t(
                                          'Esperamos que sua estadia tenha sido acolhedora e memorável! Ao sair, deixe a chave/cartão conforme as instruções e confira se não esqueceu nenhum pertence.',
                                          'Hope you had a lovely stay! Upon leaving, follow key return instructions and check all belongings.',
                                          '¡Esperamos que haya tenido una estancia agradable! Al salir, siga las instrucciones de entrega de llaves y verifique sus pertenencias.'
                                      )
                                    : t(
                                          `Aproveite as últimas horas! O checkout é amanhã às ${checkOutTime}. Caso precise estender o horário de saída ou precise de suporte, confira as opções abaixo.`,
                                          `Enjoy your last hours! Checkout is tomorrow at ${checkOutTime}. If you need late checkout, check the options below.`,
                                          `¡Disfrute las últimas horas! La salida es mañana a las ${checkOutTime}. Si necesita late checkout, vea as opções abaixo.`
                                      )}
                            </p>
                        </div>

                        {/* Grid Symmetrical Actions: Late Checkout WhatsApp & Instruções de Saída */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-stone-200/80 dark:border-white/10 relative z-10">
                            {cleanHostPhone ? (
                                <a
                                    href={lateCheckoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn flex items-center justify-between px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans uppercase tracking-wide shadow-md shadow-emerald-900/20 active:scale-[0.98] transition-all"
                                >
                                    <span className="inline-flex items-center gap-2">
                                        <MessageCircle
                                            size={15}
                                            className="group-hover/btn:scale-110 transition-transform"
                                        />
                                        <span>
                                            {t(
                                                'Solicitar Late Checkout',
                                                'Request Late Checkout',
                                                'Pedir Late Checkout'
                                            )}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="text-white/70 group-hover/btn:translate-x-0.5 transition-transform"
                                    />
                                </a>
                            ) : null}

                            <button
                                type="button"
                                onClick={onCheckoutClick}
                                className="group/btn flex items-center justify-between px-4 py-2.5 rounded-xl bg-white dark:bg-stone-900/90 border border-amber-300/70 dark:border-amber-500/30 text-[#C85A32] dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-white/5 text-xs font-bold font-sans uppercase tracking-wide shadow-sm active:scale-[0.98] transition-all"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <LogOut
                                        size={14}
                                        className="group-hover/btn:scale-110 transition-transform"
                                    />
                                    <span>
                                        {t(
                                            'Instruções de Saída',
                                            'Exit Instructions',
                                            'Instrucciones'
                                        )}
                                    </span>
                                </span>
                                <ChevronRight
                                    size={14}
                                    className="text-amber-400/70 group-hover/btn:translate-x-0.5 transition-transform"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // CASO 2: MODO DESCANSO ZEN & SILÊNCIO (22H - 05H)
        if (isLateNight) {
            return (
                <div className="w-full shrink-0 rounded-[24px] p-[1.5px] bg-gradient-to-br from-indigo-900/60 via-amber-950/30 to-stone-900 shadow-2xl shadow-black/40 relative overflow-hidden transition-all duration-300">
                    <div className="bg-gradient-to-b from-[#161217]/95 to-[#0E0C10]/95 backdrop-blur-xl p-5 sm:p-6 rounded-[22.5px] relative overflow-hidden">
                        {/* Ambient Aura */}
                        <div className="absolute -top-12 -right-12 w-52 h-52 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

                        {/* Top Bar: Icon + Zen Badges */}
                        <div className="flex items-center justify-between gap-3 mb-3.5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 via-indigo-500/15 to-purple-500/10 text-amber-300 border border-amber-300/30 shadow-[0_0_20px_rgba(245,158,11,0.18)] shrink-0">
                                    <Moon size={22} strokeWidth={2.2} className="relative z-10" />
                                    <div className="absolute inset-0 rounded-2xl bg-amber-400/10 blur-sm pointer-events-none" />
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-heading uppercase tracking-widest px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                                        {t(
                                            'Modo Descanso Zen',
                                            'Zen Rest Mode',
                                            'Modo Descanso Zen'
                                        )}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-stone-300/80 border border-white/10">
                                        <VolumeX size={10} className="text-amber-400" />
                                        {t('Silêncio pós-22h', 'Quiet hours', 'Silencio pós-22h')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Título & Mensagem */}
                        <div className="relative z-10 mb-3.5">
                            <h3 className="font-display font-medium text-lg sm:text-xl text-stone-100 leading-snug mb-1.5 bg-gradient-to-r from-amber-100 via-stone-100 to-amber-200/80 bg-clip-text text-transparent">
                                {t(
                                    'Hora de recarregar as energias',
                                    'Time to rest and recharge',
                                    'Hora de recargar energías'
                                )}
                            </h3>

                            <p className="text-xs sm:text-sm font-sans text-stone-300/80 leading-relaxed max-w-2xl">
                                {t(
                                    'O flat está climatizado e preparado para uma ótima noite de sono. O condomínio observa horário de silêncio a partir das 22h.',
                                    'The flat is air-conditioned and ready for a great sleep. Condominium observes quiet hours from 10 PM.',
                                    'El flat está climatizado y listo para un buen descanso. El condominio observa silencio a partir de las 22h.'
                                )}
                            </p>
                        </div>

                        {/* Status de Conforto Térmico (Passivo, não clicável, com dot pulsante de bem-estar) */}
                        <div className="relative z-10 mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-stone-300 text-xs">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
                            </span>
                            <Wind size={13} className="text-sky-300 shrink-0" />
                            <span className="text-stone-300/90 font-normal">
                                {t(
                                    'Climatização recomendada:',
                                    'Recommended climate:',
                                    'Climatización recomendada:'
                                )}{' '}
                                <strong className="text-white font-semibold">22°C – 23°C</strong>
                            </span>
                        </div>

                        {/* Grid de Ações Noturnas: Simétrico, Alta Acessibilidade e Affordance Clara */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-white/[0.08] relative z-10">
                            {onOpenCategorySheet && (
                                <button
                                    type="button"
                                    onClick={() => onOpenCategorySheet('Bares e Restaurantes')}
                                    className="group/btn flex items-center justify-between px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 hover:border-amber-400/40 text-amber-200 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]"
                                >
                                    <span className="inline-flex items-center gap-2.5">
                                        <ShoppingBag
                                            size={14}
                                            className="text-amber-400 group-hover/btn:scale-110 transition-transform"
                                        />
                                        <span>
                                            {t(
                                                'Fome de Madrugada? Deliveries',
                                                'Late Night Food? Deliveries',
                                                '¿Hambre? Deliveries'
                                            )}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="text-amber-400/60 group-hover/btn:translate-x-0.5 transition-transform"
                                    />
                                </button>
                            )}

                            {onEmergency && (
                                <button
                                    type="button"
                                    onClick={onEmergency}
                                    className="group/btn flex items-center justify-between px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 hover:border-rose-400/40 text-rose-200 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-[0.98]"
                                >
                                    <span className="inline-flex items-center gap-2.5">
                                        <ShieldAlert
                                            size={14}
                                            className="text-rose-400 group-hover/btn:scale-110 transition-transform"
                                        />
                                        <span>
                                            {t(
                                                'Central de Ajuda & SOS',
                                                'Help Center & SOS',
                                                'Centro de Ayuda y SOS'
                                            )}
                                        </span>
                                    </span>
                                    <ChevronRight
                                        size={14}
                                        className="text-rose-400/60 group-hover/btn:translate-x-0.5 transition-transform"
                                    />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // CASO 3: RECOMENDAÇÃO DO MOMENTO COM VITRINE FOTOGRÁFICA & CONFORTO TÉRMICO
        const hasImage = Boolean(dynamicPlace?.imageUrl);
        const hasOrder = Boolean(dynamicPlace?.orderLink);
        const hasWhatsApp = Boolean(dynamicPlace?.whatsapp);

        return (
            <div
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick();
                    }
                }}
                className={`w-full shrink-0 rounded-[24px] p-[1.5px] bg-gradient-to-br ${activeContent.color} shadow-lg shadow-stone-200/60 dark:shadow-none relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.008] active:scale-[0.99] group`}
            >
                <div className="bg-white/95 dark:bg-[#1C1614]/95 backdrop-blur-xl p-5 sm:p-6 rounded-[22.5px] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 relative">
                    {/* Badge HOJE para eventos */}
                    {isEventToday && (
                        <div className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full animate-pulse uppercase tracking-wider shadow-lg z-20">
                            {t('HOJE', 'TODAY', 'HOY')}
                        </div>
                    )}

                    {/* Lado Esquerdo: Curadoria Editorial & Conforto Térmico */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                            className={`p-3.5 rounded-2xl ${activeContent.iconBg} shadow-sm shrink-0 mt-0.5 transition-transform group-hover:scale-105`}
                        >
                            <Icon size={24} strokeWidth={2.2} />
                        </div>

                        <div className="flex-1 min-w-0">
                            {/* Linha de Badges: Momento + Clima / Conforto Térmico */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold font-heading uppercase tracking-wider px-3 py-1 rounded-lg bg-stone-100 dark:bg-black/30 text-stone-800 dark:text-amber-200 border border-stone-200/70 dark:border-amber-500/25">
                                    <Sparkles size={11} className="text-amber-400" />
                                    {activeContent.label}
                                </span>

                                {/* Radar do Calor & Conforto Térmico de Petrolina */}
                                {timeOfDay === 'lunch' && simpleTemp && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300/40 dark:border-amber-500/25">
                                        <ThermometerSun size={11} /> {simpleTemp}°C em Petrolina •
                                        Clima quente
                                    </span>
                                )}

                                {timeOfDay === 'sunset' && (
                                    <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-300/40 dark:border-orange-500/25">
                                        <Sunset size={11} /> Brisa do Rio São Francisco
                                    </span>
                                )}

                                {(hasOrder || hasWhatsApp) && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300/40 dark:border-emerald-500/25">
                                        <ShoppingBag size={11} /> Entrega no Flat
                                    </span>
                                )}
                            </div>

                            {/* Título & Descrição */}
                            <h3 className="font-display font-semibold text-lg sm:text-xl text-stone-900 dark:text-stone-50 leading-tight mb-1.5">
                                {activeContent.title}
                            </h3>

                            <p className="text-xs sm:text-sm font-medium font-sans text-stone-600 dark:text-stone-300 leading-relaxed mb-3 line-clamp-2 sm:line-clamp-none">
                                {activeContent.desc}
                            </p>

                            {/* Tags Rápidas & Ações */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {dynamicPlace?.distance && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300 text-[11px] font-medium font-sans">
                                        <MapPin size={11} className="text-amber-500" />{' '}
                                        {dynamicPlace.distance}
                                    </span>
                                )}

                                {hasOrder && dynamicPlace?.orderLink && (
                                    <a
                                        href={dynamicPlace.orderLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="px-3.5 py-1.5 rounded-xl bg-[#C85A32] hover:bg-orange-600 text-white text-xs font-bold font-sans uppercase tracking-wide flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                                    >
                                        <ShoppingBag size={13} />
                                        <span>
                                            {t('Pedir Online', 'Order Online', 'Pedir en Línea')}
                                        </span>
                                    </a>
                                )}

                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C85A32] dark:text-amber-300 group-hover:underline">
                                    <span>{ctaHint}</span>
                                    <ChevronRight
                                        size={14}
                                        className="transform group-hover:translate-x-0.5 transition-transform"
                                    />
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Lado Direito: Vitrine Fotográfica Cinematográfica */}
                    {hasImage && dynamicPlace && (
                        <div className="relative shrink-0 self-center md:self-stretch flex items-center">
                            {/* Desktop Preview Window (Grande, panorâmica e elegante) */}
                            <div className="hidden sm:block w-44 md:w-52 lg:w-60 h-28 md:h-32 lg:h-36 rounded-2xl overflow-hidden relative shadow-md border border-stone-200/80 dark:border-amber-500/25 group-hover:scale-[1.02] transition-transform">
                                <OptimizedImage
                                    src={dynamicPlace.imageUrl}
                                    alt={dynamicPlace.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold drop-shadow">
                                    <span className="truncate pr-1">{dynamicPlace.name}</span>
                                    <span className="text-[10px] font-normal uppercase text-amber-200">
                                        Ver foto
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Preview Window (Compacto e refinado) */}
                            <div className="sm:hidden w-full h-32 rounded-xl overflow-hidden relative shadow-sm border border-stone-200/80 dark:border-amber-500/20 mt-1">
                                <OptimizedImage
                                    src={dynamicPlace.imageUrl}
                                    alt={dynamicPlace.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 left-2.5 text-white text-xs font-bold drop-shadow">
                                    {dynamicPlace.name}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            {renderCardBody()}

            {/* MODAL DE DETALHES DA RECOMENDAÇÃO */}
            {selectedPlace && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div
                        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedPlace(null)}
                    ></div>

                    <div className="bg-[#FAF7F2] dark:bg-[#1C1614] w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-stone-200/80 dark:border-amber-500/20">
                        <button
                            onClick={() => setSelectedPlace(null)}
                            aria-label="Fechar detalhes"
                            className="absolute top-3 right-3 bg-black/35 hover:bg-black/55 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20"
                        >
                            <X size={18} />
                        </button>

                        {selectedPlace.imageUrl && (
                            <div className="h-56 shrink-0 relative bg-stone-200 dark:bg-stone-800">
                                <OptimizedImage
                                    src={selectedPlace.imageUrl}
                                    alt={selectedPlace.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#16110E]/90 via-black/20 to-transparent pointer-events-none"></div>
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <h2 className="text-2xl font-display font-semibold text-white leading-tight pr-8 mb-1 shadow-sm notranslate">
                                        {selectedDisplayName}
                                    </h2>
                                </div>
                            </div>
                        )}

                        <div className="p-6 overflow-y-auto">
                            {!selectedPlace.imageUrl && (
                                <h2 className="text-xl font-display font-semibold text-stone-900 dark:text-stone-50 leading-tight pr-8 mb-3 notranslate">
                                    {selectedDisplayName}
                                </h2>
                            )}

                            <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm mb-6 font-sans font-medium">
                                {selectedDisplayDesc}
                            </p>

                            <div className="space-y-4">
                                {selectedPlace.eventDate && (
                                    <div className="flex items-start gap-3 bg-orange-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-orange-200/60 dark:border-amber-500/20">
                                        <div className="bg-orange-100 dark:bg-amber-500/20 p-2 rounded-xl text-[#C85A32] dark:text-amber-300 shadow-sm">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-[#C85A32] dark:text-amber-400 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                {t('Quando', 'When', 'Cuándo')}
                                            </p>
                                            <p className="text-stone-900 dark:text-stone-50 text-sm font-bold font-sans leading-snug">
                                                {selectedPlace.eventDate
                                                    .split('-')
                                                    .reverse()
                                                    .join('/')}
                                                {selectedPlace.eventEndDate &&
                                                    ` ${t('até', 'until', 'hasta')} ${selectedPlace.eventEndDate.split('-').reverse().join('/')}`}
                                            </p>
                                            {selectedPlace.eventTime && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-orange-800 dark:text-amber-200 font-medium">
                                                    <Clock size={12} />
                                                    {selectedPlace.eventTime}{' '}
                                                    {selectedPlace.eventEndTime
                                                        ? `- ${selectedPlace.eventEndTime}`
                                                        : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {selectedPlace.address && (
                                    <div className="flex items-start gap-3 bg-white dark:bg-[#241C19] p-4 rounded-2xl border border-stone-200/70 dark:border-amber-500/15">
                                        <div className="bg-orange-50 dark:bg-amber-500/15 p-2 rounded-xl text-[#C85A32] dark:text-amber-400 shadow-sm border border-orange-100 dark:border-amber-500/20">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-stone-400 dark:text-stone-400 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                {t('Localização', 'Location', 'Ubicación')}
                                            </p>
                                            <p className="text-stone-900 dark:text-stone-50 text-sm font-bold font-sans leading-snug notranslate">
                                                {selectedPlace.address}
                                            </p>
                                            {selectedPlace.distance && (
                                                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-medium font-sans">
                                                    <Car size={12} />{' '}
                                                    {t('Aprox.', 'Approx.', 'Aprox.')}{' '}
                                                    {selectedPlace.distance}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2.5">
                                    {selectedPlace.orderLink && (
                                        <a
                                            href={selectedPlace.orderLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center gap-2 w-full text-white font-bold font-sans py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm ${isAttraction ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/20' : 'bg-[#C85A32] hover:bg-[#B34E2A] shadow-orange-500/20'}`}
                                        >
                                            <ActionIcon size={18} />
                                            {actionLabel}
                                        </a>
                                    )}

                                    {selectedPlace.address && googleMapsUrl && (
                                        <a
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-[#C85A32] text-white font-bold font-sans py-3.5 rounded-xl hover:bg-[#B34E2A] transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-sm"
                                        >
                                            <ExternalLink size={18} />
                                            {t(
                                                'Abrir no Google Maps',
                                                'Open in Google Maps',
                                                'Abrir en Google Maps'
                                            )}
                                        </a>
                                    )}

                                    {selectedPlace.phoneNumber && (
                                        <a
                                            href={`tel:${selectedPlace.phoneNumber.replace(/[^0-9]/g, '')}`}
                                            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#241C19] border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 font-bold font-sans py-3.5 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-all active:scale-[0.98] text-sm"
                                        >
                                            <Phone
                                                size={18}
                                                className="text-emerald-600 dark:text-emerald-400"
                                            />
                                            {t('Ligar Agora', 'Call Now', 'Llamar Ahora')}
                                        </a>
                                    )}

                                    {selectedPlace.whatsapp && (
                                        <a
                                            href={`https://wa.me/55${selectedPlace.whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white font-bold font-sans py-3.5 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] text-sm"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SmartSuggestion;
