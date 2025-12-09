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
import FavoritesSheet from './sheets/FavoritesSheet'; // New import
import ExpandablePlaceList from './ExpandablePlaceList';
import AccordionCategoryGroup from './AccordionCategoryGroup';

interface GuestRecommendationsProps {
    mergePlaces: (staticList: PlaceRecommendation[], category: string) => PlaceRecommendation[];
    hasContent: (list: PlaceRecommendation[], category: string) => boolean;
    activeEvents: PlaceRecommendation[];
    openEmergency?: boolean;
    emergencyRef?: React.RefObject<HTMLDivElement>;
    propertyId?: string;
}

/**
 * Componente principal de recomendações para o hóspede
 * Refatorado para usar subcomponentes: sheets individuais para cada seção
 */
const GuestRecommendations: React.FC<GuestRecommendationsProps> = ({
    mergePlaces,
    hasContent,
    activeEvents,
    openEmergency,
    emergencyRef,
    propertyId = 'lili',
}) => {
    const { t } = useLanguage();
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    const handleOpen = (sheet: string) => setActiveSheet(sheet);
    const handleClose = () => setActiveSheet(null);

    // Abre emergência automaticamente quando solicitado
    useEffect(() => {
        if (openEmergency) {
            setActiveSheet('SOS & Emergência');
        }
    }, [openEmergency]);

    return (
        <>
            {/* Grid de Seções */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Coluna 1 */}
                <div className="flex flex-col gap-6">
                    <SectionCard
                        title={t('O Flat & Comodidades', 'The Flat & Amenities', 'El Flat y Comodidades')}
                        icon={Home}
                        color="bg-orange-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('O Flat & Comodidades')}
                    />
                    <SectionCard
                        title={t('Regras & Avisos', 'Rules & Notices', 'Reglas y Avisos')}
                        icon={AlertTriangle}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Regras & Avisos')}
                    />
                    <SectionCard
                        title={t('Mercados e Serviços', 'Markets & Services', 'Mercados y Servicios')}
                        icon={ShoppingBasket}
                        color="bg-green-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Mercados e Serviços')}
                    />
                    <SectionCard
                        title={t('Bares e Restaurantes', 'Bars & Restaurants', 'Bares y Restaurantes')}
                        icon={Utensils}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Bares e Restaurantes')}
                    />
                </div>

                {/* Coluna 2 */}
                <div className="flex flex-col gap-6">
                    <SectionCard
                        title={t('Meus Favoritos', 'My Favorites', 'Mis Favoritos')}
                        icon={Heart} // Using Heart icon
                        color="bg-pink-600" // Distinct color
                        isTrigger={true}
                        onToggle={() => handleOpen('Meus Favoritos')}
                    />
                    <SectionCard
                        title={t('Cafés e Padarias', 'Cafes & Bakeries', 'Cafés y Panaderías')}
                        icon={Coffee}
                        color="bg-amber-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('Cafés e Padarias')}
                    />
                    <SectionCard
                        title={t('Passeios & Lazer', 'Tours & Leisure', 'Paseos y Ocio')}
                        icon={Map}
                        color="bg-blue-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Passeios & Lazer')}
                    />
                    <SectionCard
                        title={t('Eventos & Agenda', 'Events & Agenda', 'Eventos y Agenda')}
                        icon={CalendarHeart}
                        color="bg-pink-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Eventos & Agenda')}
                    />
                    <div ref={emergencyRef} className="break-inside-avoid">
                        <SectionCard
                            title={t('SOS & Emergência', 'SOS & Emergency', 'SOS y Emergencia')}
                            icon={HeartPulse}
                            color="bg-red-600"
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
                <RulesSheet />
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
                            icon: <ShoppingBasket size={18} className="text-green-600" />,
                            places: mergePlaces([], 'essentials'),
                            visible: hasContent([], 'essentials')
                        },
                        {
                            id: 'pharmacies',
                            title: t('Farmácias', 'Pharmacies', 'Farmacias'),
                            icon: <Pill size={18} className="text-red-500" />,
                            places: mergePlaces([], 'pharmacies'),
                            visible: hasContent([], 'pharmacies')
                        },
                        {
                            id: 'laundry',
                            title: t('Lavanderia', 'Laundry', 'Lavandería'),
                            icon: <span role="img" aria-label="laundry">🧺</span>,
                            places: mergePlaces([], 'laundry'),
                            visible: hasContent([], 'laundry')
                        },
                        {
                            id: 'salon',
                            title: t('Salão de Beleza', 'Beauty Salon', 'Salón de Belleza'),
                            icon: <span role="img" aria-label="salon">💇‍♀️</span>,
                            places: mergePlaces([], 'salon'),
                            visible: hasContent([], 'salon')
                        },
                        {
                            id: 'gym',
                            title: t('Academia', 'Gym', 'Gimnasio'),
                            icon: <span role="img" aria-label="gym">💪</span>,
                            places: mergePlaces([], 'gym'),
                            visible: hasContent([], 'gym')
                        }
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
                            icon: <span role="img" aria-label="beer">🍺</span>,
                            places: mergePlaces([], 'bars'),
                            visible: hasContent([], 'bars')
                        },
                        {
                            id: 'burgers',
                            title: t('Hambúrguer & Sanduíches', 'Burgers & Sandwiches', 'Hamburguesas y Sándwiches'),
                            icon: <span role="img" aria-label="burger">🍔</span>,
                            places: mergePlaces([], 'burgers'),
                            visible: hasContent([], 'burgers')
                        },
                        {
                            id: 'skewers',
                            title: t('Espetinhos & Jantinha', 'Skewers & Dinner', 'Brochetas y Cena'),
                            icon: <Flame size={18} className="text-orange-500" />,
                            places: mergePlaces([], 'skewers'),
                            visible: hasContent([], 'skewers')
                        },
                        {
                            id: 'salads',
                            title: t('Saladas & Saudável', 'Salads & Healthy', 'Ensaladas y Saludable'),
                            icon: <Salad size={18} className="text-green-500" />,
                            places: mergePlaces([], 'salads'),
                            visible: hasContent([], 'salads')
                        },
                        {
                            id: 'pizza',
                            title: t('Pizzas & Massas', 'Pizzas & Pasta', 'Pizzas y Pastas'),
                            icon: <Pizza size={18} className="text-red-500" />,
                            places: mergePlaces([], 'pasta'),
                            visible: hasContent([], 'pasta')
                        },
                        {
                            id: 'sushi',
                            title: t('Oriental & Sushi', 'Oriental & Sushi', 'Oriental y Sushi'),
                            icon: <span role="img" aria-label="sushi">🍣</span>,
                            places: mergePlaces([], 'oriental'),
                            visible: hasContent([], 'oriental')
                        },
                        {
                            id: 'alacarte',
                            title: t('À La Carte & Refinados', 'À La Carte & Fine Dining', 'A La Carta y Refinados'),
                            icon: <Utensils size={18} className="text-gray-500" />,
                            places: mergePlaces([], 'alacarte'),
                            visible: hasContent([], 'alacarte')
                        },
                        {
                            id: 'selfservice',
                            title: t('Self-Service & Almoço', 'Self-Service & Lunch', 'Buffet y Almuerzo'),
                            icon: <Utensils size={18} className="text-green-600" />,
                            places: mergePlaces([], 'selfservice'),
                            visible: hasContent([], 'selfservice')
                        },
                        {
                            id: 'snacks',
                            title: t('Lanches Rápidos', 'Quick Snacks', 'Bocadillos Rápidos'),
                            icon: <span role="img" aria-label="hotdog">🌭</span>,
                            places: mergePlaces([], 'snacks'),
                            visible: hasContent([], 'snacks')
                        }
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
                            visible: hasContent([], 'cafes')
                        }
                    ]}
                    initialOpenId="cafes" // Auto-open since it is the only one? Or let it be closed? User said "menus close others". If only one, maybe better open? 
                // Let's stick to default behavior (first open).
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
                            title: t('Passeios Imperdíveis', 'Must-See Tours', 'Paseos Imperdibles'),
                            icon: <Map size={18} className="text-blue-600" />,
                            places: mergePlaces([], 'attractions'),
                            visible: hasContent([], 'attractions')
                        },
                        {
                            id: 'bikes',
                            title: t('Aluguel de Bicicletas', 'Bicycle Rental', 'Alquiler de Bicicletas'),
                            icon: <span role="img" aria-label="bike">🚲</span>,
                            places: mergePlaces([], 'bikes'),
                            visible: hasContent([], 'bikes')
                        },
                        {
                            id: 'souvenirs',
                            title: t('Lembrancinhas', 'Souvenirs', 'Recuerdos'),
                            icon: <span role="img" aria-label="gift">🎁</span>,
                            places: mergePlaces([], 'souvenirs'),
                            visible: hasContent([], 'souvenirs')
                        }
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
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p className="text-xs">{t('Nenhum evento programado para os próximos dias.', 'No events scheduled for the next few days.', 'No hay eventos programados para los próximos días.')}</p>
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
                <FavoritesSheet
                    allPlaces={mergePlaces([], 'all')} // We need to pass all places to filter them
                />
            </BottomSheet>
        </>
    );
};

export default GuestRecommendations;
