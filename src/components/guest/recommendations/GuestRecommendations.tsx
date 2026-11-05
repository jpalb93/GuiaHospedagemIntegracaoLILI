import React, { useState, useEffect } from 'react';
import {
    Utensils,
    Coffee,
    ShoppingBasket,
    Map,
    Flame,
    Pizza,
    CalendarHeart,
    Home,
    AlertTriangle,
    HeartPulse,
    Heart,
    Salad,
    Pill,
} from 'lucide-react';
import SectionCard from '../../SectionCard';
import BottomSheet from '../../ui/BottomSheet';
import { PlaceRecommendation } from '../../../types';
import { useLanguage } from '../../../hooks/useLanguage';

// Importa sheets e componentes auxiliares
import FlatAmenitiesSheet from './sheets/FlatAmenitiesSheet';
import RulesSheet from './sheets/RulesSheet';
import EmergencySheet from './sheets/EmergencySheet';
import FavoritesSheet from './sheets/FavoritesSheet';
import ExpandablePlaceList from './ExpandablePlaceList';
import AccordionCategoryGroup from './AccordionCategoryGroup';

interface GuestRecommendationsProps {
    mergePlaces: (staticList: PlaceRecommendation[], category: string) => PlaceRecommendation[];
    hasContent: (list: PlaceRecommendation[], category: string) => boolean;
    activeEvents: PlaceRecommendation[];
    openEmergency?: boolean;
    emergencyRef?: React.RefObject<HTMLDivElement>;
    propertyId?: string;
    places?: PlaceRecommendation[];
    onOpenKeyDetails?: () => void;
    requestedSheet?: string | null;
    onRequestedSheetHandled?: () => void;
}

const GuestRecommendations: React.FC<GuestRecommendationsProps> = ({
    mergePlaces,
    hasContent,
    activeEvents,
    openEmergency,
    emergencyRef,
    propertyId = 'lili',
    places = [],
    onOpenKeyDetails,
    requestedSheet,
    onRequestedSheetHandled,
}) => {
    const { t } = useLanguage();
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    const handleOpen = (sheet: string) => setActiveSheet(sheet);
    const handleClose = () => setActiveSheet(null);

    // Abre emergência automaticamente quando solicitado
    useEffect(() => {
        if (openEmergency) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveSheet('SOS & Emergência');
        }
    }, [openEmergency]);

    // Abre uma sheet específica quando solicitado externamente (ex: SmartSuggestion)
    useEffect(() => {
        if (requestedSheet) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setActiveSheet(requestedSheet);
            onRequestedSheetHandled?.();
        }
    }, [requestedSheet, onRequestedSheetHandled]);

    return (
        <>
            {/* Grid de Seções — Paleta Sol do São Francisco & Terracota */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {/* Coluna 1 */}
                <div className="flex flex-col gap-5">
                    <SectionCard
                        title={t(
                            'O Flat & Comodidades',
                            'The Flat & Amenities',
                            'El Flat y Comodidades'
                        )}
                        icon={Home}
                        color="bg-gradient-to-br from-[#C85A32] to-orange-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('O Flat & Comodidades')}
                    />
                    <SectionCard
                        title={t('Regras & Avisos', 'Rules & Notices', 'Reglas y Avisos')}
                        icon={AlertTriangle}
                        color="bg-gradient-to-br from-amber-600 to-orange-700"
                        isTrigger={true}
                        onToggle={() => handleOpen('Regras & Avisos')}
                    />
                    <SectionCard
                        title={t(
                            'Mercados e Serviços',
                            'Markets & Services',
                            'Mercados y Servicios'
                        )}
                        icon={ShoppingBasket}
                        color="bg-gradient-to-br from-emerald-600 to-teal-700"
                        isTrigger={true}
                        onToggle={() => handleOpen('Mercados e Serviços')}
                    />
                    <SectionCard
                        title={t(
                            'Bares e Restaurantes',
                            'Bars & Restaurants',
                            'Bares y Restaurantes'
                        )}
                        icon={Utensils}
                        color="bg-gradient-to-br from-[#B84A24] to-[#8F3518]"
                        isTrigger={true}
                        onToggle={() => handleOpen('Bares e Restaurantes')}
                    />
                </div>

                {/* Coluna 2 */}
                <div className="flex flex-col gap-5">
                    <SectionCard
                        title={t('Meus Favoritos', 'My Favorites', 'Mis Favoritos')}
                        icon={Heart}
                        color="bg-gradient-to-br from-rose-500 to-orange-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('Meus Favoritos')}
                    />
                    <SectionCard
                        title={t('Cafés e Padarias', 'Cafes & Bakeries', 'Cafés y Panaderías')}
                        icon={Coffee}
                        color="bg-gradient-to-br from-amber-500 to-amber-700"
                        isTrigger={true}
                        onToggle={() => handleOpen('Cafés e Padarias')}
                    />
                    <SectionCard
                        title={t('Passeios & Lazer', 'Tours & Leisure', 'Paseos y Ocio')}
                        icon={Map}
                        color="bg-gradient-to-br from-sky-600 to-cyan-700"
                        isTrigger={true}
                        onToggle={() => handleOpen('Passeios & Lazer')}
                    />
                    <SectionCard
                        title={t('Eventos & Agenda', 'Events & Agenda', 'Eventos y Agenda')}
                        icon={CalendarHeart}
                        color="bg-gradient-to-br from-orange-500 to-rose-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('Eventos & Agenda')}
                    />
                    <div ref={emergencyRef} className="break-inside-avoid">
                        <SectionCard
                            title={t('SOS & Emergência', 'SOS & Emergency', 'SOS y Emergencia')}
                            icon={HeartPulse}
                            color="bg-gradient-to-br from-red-600 to-red-700"
                            isTrigger={true}
                            onToggle={() => handleOpen('SOS & Emergência')}
                        />
                    </div>
                </div>
            </div>

            {/* === BOTTOM SHEETS === */}

            {/* O Flat & Comodidades */}
            <BottomSheet
                isOpen={activeSheet === 'O Flat & Comodidades'}
                onClose={handleClose}
                title={t('O Flat & Comodidades', 'The Flat & Amenities', 'El Flat y Comodidades')}
                icon={Home}
            >
                <FlatAmenitiesSheet propertyId={propertyId} />
            </BottomSheet>

            {/* Regras & Avisos */}
            <BottomSheet
                isOpen={activeSheet === 'Regras & Avisos'}
                onClose={handleClose}
                title={t('Regras & Avisos', 'Rules & Notices', 'Reglas y Avisos')}
                icon={AlertTriangle}
            >
                <RulesSheet
                    onOpenKeyDetails={() => {
                        handleClose();
                        onOpenKeyDetails?.();
                    }}
                />
            </BottomSheet>

            {/* Mercados e Serviços */}
            <BottomSheet
                isOpen={activeSheet === 'Mercados e Serviços'}
                onClose={handleClose}
                title={t('Mercados e Serviços', 'Markets & Services', 'Mercados y Servicios')}
                icon={ShoppingBasket}
            >
                <AccordionCategoryGroup
                    categories={[
                        {
                            id: 'markets',
                            title: t('Mercados', 'Markets', 'Mercados'),
                            icon: <ShoppingBasket size={18} className="text-emerald-600" />,
                            places: mergePlaces([], 'essentials'),
                            visible: hasContent([], 'essentials'),
                        },
                        {
                            id: 'pharmacies',
                            title: t('Farmácias', 'Pharmacies', 'Farmacias'),
                            icon: <Pill size={18} className="text-red-500" />,
                            places: mergePlaces([], 'pharmacies'),
                            visible: hasContent([], 'pharmacies'),
                        },
                        {
                            id: 'laundry',
                            title: t('Lavanderia', 'Laundry', 'Lavandería'),
                            icon: (
                                <span role="img" aria-label="laundry">
                                    🧺
                                </span>
                            ),
                            places: mergePlaces([], 'laundry'),
                            visible: hasContent([], 'laundry'),
                        },
                        {
                            id: 'salon',
                            title: t('Salão de Beleza', 'Beauty Salon', 'Salón de Belleza'),
                            icon: (
                                <span role="img" aria-label="salon">
                                    💇‍♀️
                                </span>
                            ),
                            places: mergePlaces([], 'salon'),
                            visible: hasContent([], 'salon'),
                        },
                        {
                            id: 'gym',
                            title: t('Academia', 'Gym', 'Gimnasio'),
                            icon: (
                                <span role="img" aria-label="gym">
                                    💪
                                </span>
                            ),
                            places: mergePlaces([], 'gym'),
                            visible: hasContent([], 'gym'),
                        },
                    ]}
                />
            </BottomSheet>

            {/* Bares e Restaurantes */}
            <BottomSheet
                isOpen={activeSheet === 'Bares e Restaurantes'}
                onClose={handleClose}
                title={t('Bares e Restaurantes', 'Bars & Restaurants', 'Bares y Restaurantes')}
                icon={Utensils}
            >
                <AccordionCategoryGroup
                    categories={[
                        {
                            id: 'bars',
                            title: t('Bares & Pubs', 'Bars & Pubs', 'Bares y Pubs'),
                            icon: (
                                <span role="img" aria-label="beer">
                                    🍺
                                </span>
                            ),
                            places: mergePlaces([], 'bars'),
                            visible: hasContent([], 'bars'),
                        },
                        {
                            id: 'burgers',
                            title: t(
                                'Hambúrguer & Sanduíches',
                                'Burgers & Sandwiches',
                                'Hamburguesas y Sándwiches'
                            ),
                            icon: (
                                <span role="img" aria-label="burger">
                                    🍔
                                </span>
                            ),
                            places: mergePlaces([], 'burgers'),
                            visible: hasContent([], 'burgers'),
                        },
                        {
                            id: 'skewers',
                            title: t(
                                'Espetinhos & Jantinha',
                                'Skewers & Dinner',
                                'Brochetas y Cena'
                            ),
                            icon: <Flame size={18} className="text-orange-500" />,
                            places: mergePlaces([], 'skewers'),
                            visible: hasContent([], 'skewers'),
                        },
                        {
                            id: 'salads',
                            title: t(
                                'Saladas & Saudável',
                                'Salads & Healthy',
                                'Ensaladas y Saludable'
                            ),
                            icon: <Salad size={18} className="text-emerald-500" />,
                            places: mergePlaces([], 'salads'),
                            visible: hasContent([], 'salads'),
                        },
                        {
                            id: 'pizza',
                            title: t('Pizzas & Massas', 'Pizzas & Pasta', 'Pizzas y Pastas'),
                            icon: <Pizza size={18} className="text-orange-600" />,
                            places: mergePlaces([], 'pasta'),
                            visible: hasContent([], 'pasta'),
                        },
                        {
                            id: 'sushi',
                            title: t('Oriental & Sushi', 'Oriental & Sushi', 'Oriental y Sushi'),
                            icon: (
                                <span role="img" aria-label="sushi">
                                    🍣
                                </span>
                            ),
                            places: mergePlaces([], 'oriental'),
                            visible: hasContent([], 'oriental'),
                        },
                        {
                            id: 'alacarte',
                            title: t(
                                'À La Carte & Refinados',
                                'À La Carte & Fine Dining',
                                'A La Carta y Refinados'
                            ),
                            icon: <Utensils size={18} className="text-amber-600" />,
                            places: mergePlaces([], 'alacarte'),
                            visible: hasContent([], 'alacarte'),
                        },
                        {
                            id: 'selfservice',
                            title: t(
                                'Self-Service & Almoço',
                                'Self-Service & Lunch',
                                'Buffet y Almuerzo'
                            ),
                            icon: <Utensils size={18} className="text-emerald-600" />,
                            places: mergePlaces([], 'selfservice'),
                            visible: hasContent([], 'selfservice'),
                        },
                        {
                            id: 'snacks',
                            title: t('Lanches Rápidos', 'Quick Snacks', 'Bocadillos Rápidos'),
                            icon: (
                                <span role="img" aria-label="hotdog">
                                    🌭
                                </span>
                            ),
                            places: mergePlaces([], 'snacks'),
                            visible: hasContent([], 'snacks'),
                        },
                    ]}
                />
            </BottomSheet>

            {/* Cafés e Padarias */}
            <BottomSheet
                isOpen={activeSheet === 'Cafés e Padarias'}
                onClose={handleClose}
                title={t('Cafés e Padarias', 'Cafes & Bakeries', 'Cafés y Panaderías')}
                icon={Coffee}
            >
                <AccordionCategoryGroup
                    categories={[
                        {
                            id: 'cafes',
                            title: t('Cafés & Padarias', 'Cafes & Bakeries', 'Cafés y Panaderías'),
                            icon: <Coffee size={18} className="text-amber-700" />,
                            places: mergePlaces([], 'cafes'),
                            visible: hasContent([], 'cafes'),
                        },
                    ]}
                    initialOpenId="cafes"
                />
            </BottomSheet>

            {/* Passeios & Lazer */}
            <BottomSheet
                isOpen={activeSheet === 'Passeios & Lazer'}
                onClose={handleClose}
                title={t('Passeios & Lazer', 'Tours & Leisure', 'Paseos y Ocio')}
                icon={Map}
            >
                <AccordionCategoryGroup
                    categories={[
                        {
                            id: 'attractions',
                            title: t(
                                'Passeios Imperdíveis',
                                'Must-See Tours',
                                'Paseos Imperdibles'
                            ),
                            icon: <Map size={18} className="text-sky-600" />,
                            places: mergePlaces([], 'attractions'),
                            visible: hasContent([], 'attractions'),
                        },
                        {
                            id: 'bikes',
                            title: t(
                                'Aluguel de Bicicletas',
                                'Bicycle Rental',
                                'Alquiler de Bicicletas'
                            ),
                            icon: (
                                <span role="img" aria-label="bike">
                                    🚲
                                </span>
                            ),
                            places: mergePlaces([], 'bikes'),
                            visible: hasContent([], 'bikes'),
                        },
                        {
                            id: 'souvenirs',
                            title: t('Lembrancinhas', 'Souvenirs', 'Recuerdos'),
                            icon: (
                                <span role="img" aria-label="gift">
                                    🎁
                                </span>
                            ),
                            places: mergePlaces([], 'souvenirs'),
                            visible: hasContent([], 'souvenirs'),
                        },
                    ]}
                />
            </BottomSheet>

            {/* Eventos & Agenda */}
            <BottomSheet
                isOpen={activeSheet === 'Eventos & Agenda'}
                onClose={handleClose}
                title={t('Eventos & Agenda', 'Events & Agenda', 'Eventos y Agenda')}
                icon={CalendarHeart}
            >
                {activeEvents.length > 0 ? (
                    <ExpandablePlaceList places={activeEvents} />
                ) : (
                    <div className="text-center py-4 text-stone-500 dark:text-stone-400">
                        <p className="text-xs">
                            {t(
                                'Nenhum evento programado para os próximos dias.',
                                'No events scheduled for the next few days.',
                                'No hay eventos programados para los próximos días.'
                            )}
                        </p>
                    </div>
                )}
            </BottomSheet>

            {/* SOS & Emergência */}
            <BottomSheet
                isOpen={activeSheet === 'SOS & Emergência'}
                onClose={handleClose}
                title={t('SOS & Emergência', 'SOS & Emergency', 'SOS y Emergencia')}
                icon={HeartPulse}
            >
                <EmergencySheet emergencyPlaces={mergePlaces([], 'emergency')} />
            </BottomSheet>

            {/* Meus Favoritos */}
            <BottomSheet
                isOpen={activeSheet === 'Meus Favoritos'}
                onClose={handleClose}
                title={t('Meus Favoritos', 'My Favorites', 'Mis Favoritos')}
                icon={Heart}
            >
                <FavoritesSheet allPlaces={places} />
            </BottomSheet>
        </>
    );
};

export default GuestRecommendations;
