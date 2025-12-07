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
    Salad,
    Pill,
} from 'lucide-react';
import SectionCard from '../../SectionCard';
import BottomSheet from '../../ui/BottomSheet';
import { PlaceRecommendation } from '../../../types';

// Importa sheets e componentes auxiliares
import FlatAmenitiesSheet from './sheets/FlatAmenitiesSheet';
import RulesSheet from './sheets/RulesSheet';
import EmergencySheet from './sheets/EmergencySheet';
import ExpandablePlaceList from './ExpandablePlaceList';
import { PlacesCategory } from './PlacesCategory';

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
                        title="O Flat & Comodidades"
                        icon={Home}
                        color="bg-orange-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('O Flat & Comodidades')}
                    />
                    <SectionCard
                        title="Regras & Avisos"
                        icon={AlertTriangle}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Regras & Avisos')}
                    />
                    <SectionCard
                        title="Mercados e Serviços"
                        icon={ShoppingBasket}
                        color="bg-green-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Mercados e Serviços')}
                    />
                    <SectionCard
                        title="Bares e Restaurantes"
                        icon={Utensils}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Bares e Restaurantes')}
                    />
                </div>

                {/* Coluna 2 */}
                <div className="flex flex-col gap-6">
                    <SectionCard
                        title="Cafés e Padarias"
                        icon={Coffee}
                        color="bg-amber-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('Cafés e Padarias')}
                    />
                    <SectionCard
                        title="Passeios & Lazer"
                        icon={Map}
                        color="bg-blue-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Passeios & Lazer')}
                    />
                    <SectionCard
                        title="Eventos & Agenda"
                        icon={CalendarHeart}
                        color="bg-pink-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Eventos & Agenda')}
                    />
                    <div ref={emergencyRef} className="break-inside-avoid">
                        <SectionCard
                            title="SOS & Emergência"
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
                title="O Flat & Comodidades"
                icon={Home}
            >
                <FlatAmenitiesSheet propertyId={propertyId} />
            </BottomSheet>

            {/* Regras & Avisos */}
            <BottomSheet
                isOpen={activeSheet === 'Regras & Avisos'}
                onClose={handleClose}
                title="Regras & Avisos"
                icon={AlertTriangle}
            >
                <RulesSheet />
            </BottomSheet>

            {/* Mercados e Serviços */}
            <BottomSheet
                isOpen={activeSheet === 'Mercados e Serviços'}
                onClose={handleClose}
                title="Mercados e Serviços"
                icon={ShoppingBasket}
            >
                <PlacesCategory
                    title="Mercados"
                    icon={<ShoppingBasket size={18} className="text-green-600" />}
                    places={mergePlaces([], 'essentials')}
                    visible={hasContent([], 'essentials')}
                />
                <PlacesCategory
                    title="Farmácias"
                    icon={<Pill size={18} className="text-red-500" />}
                    places={mergePlaces([], 'pharmacies')}
                    visible={hasContent([], 'pharmacies')}
                />
                <PlacesCategory
                    title="Lavanderia"
                    icon={
                        <span role="img" aria-label="laundry">
                            🧺
                        </span>
                    }
                    places={mergePlaces([], 'laundry')}
                    visible={hasContent([], 'laundry')}
                />
                <PlacesCategory
                    title="Salão de Beleza"
                    icon={
                        <span role="img" aria-label="salon">
                            💇‍♀️
                        </span>
                    }
                    places={mergePlaces([], 'salon')}
                    visible={hasContent([], 'salon')}
                />
                <PlacesCategory
                    title="Academia"
                    icon={
                        <span role="img" aria-label="gym">
                            💪
                        </span>
                    }
                    places={mergePlaces([], 'gym')}
                    visible={hasContent([], 'gym')}
                />
            </BottomSheet>

            {/* Bares e Restaurantes */}
            <BottomSheet
                isOpen={activeSheet === 'Bares e Restaurantes'}
                onClose={handleClose}
                title="Bares e Restaurantes"
                icon={Utensils}
            >
                <PlacesCategory
                    title="Bares & Pubs"
                    icon={
                        <span role="img" aria-label="beer">
                            🍺
                        </span>
                    }
                    places={mergePlaces([], 'bars')}
                    visible={hasContent([], 'bars')}
                />
                <PlacesCategory
                    title="Hambúrguer & Sanduíches"
                    icon={
                        <span role="img" aria-label="burger">
                            🍔
                        </span>
                    }
                    places={mergePlaces([], 'burgers')}
                    visible={hasContent([], 'burgers')}
                />
                <PlacesCategory
                    title="Espetinhos & Jantinha"
                    icon={<Flame size={18} className="text-orange-500" />}
                    places={mergePlaces([], 'skewers')}
                    visible={hasContent([], 'skewers')}
                />
                <PlacesCategory
                    title="Saladas & Saudável"
                    icon={<Salad size={18} className="text-green-500" />}
                    places={mergePlaces([], 'salads')}
                    visible={hasContent([], 'salads')}
                />
                <PlacesCategory
                    title="Pizzas & Massas"
                    icon={<Pizza size={18} className="text-red-500" />}
                    places={mergePlaces([], 'pasta')}
                    visible={hasContent([], 'pasta')}
                />
                <PlacesCategory
                    title="Oriental & Sushi"
                    icon={
                        <span role="img" aria-label="sushi">
                            🍣
                        </span>
                    }
                    places={mergePlaces([], 'oriental')}
                    visible={hasContent([], 'oriental')}
                />
                <PlacesCategory
                    title="À La Carte & Refinados"
                    icon={<Utensils size={18} className="text-gray-500" />}
                    places={mergePlaces([], 'alacarte')}
                    visible={hasContent([], 'alacarte')}
                />
                <PlacesCategory
                    title="Self-Service & Almoço"
                    icon={<Utensils size={18} className="text-green-600" />}
                    places={mergePlaces([], 'selfservice')}
                    visible={hasContent([], 'selfservice')}
                />
                <PlacesCategory
                    title="Lanches Rápidos"
                    icon={
                        <span role="img" aria-label="hotdog">
                            🌭
                        </span>
                    }
                    places={mergePlaces([], 'snacks')}
                    visible={hasContent([], 'snacks')}
                />
            </BottomSheet>

            {/* Cafés e Padarias */}
            <BottomSheet
                isOpen={activeSheet === 'Cafés e Padarias'}
                onClose={handleClose}
                title="Cafés e Padarias"
                icon={Coffee}
            >
                <PlacesCategory
                    title="Cafés & Padarias"
                    icon={<Coffee size={18} className="text-amber-700" />}
                    places={mergePlaces([], 'cafes')}
                    visible={hasContent([], 'cafes')}
                />
            </BottomSheet>

            {/* Passeios & Lazer */}
            <BottomSheet
                isOpen={activeSheet === 'Passeios & Lazer'}
                onClose={handleClose}
                title="Passeios & Lazer"
                icon={Map}
            >
                <PlacesCategory
                    title="Passeios Imperdíveis"
                    icon={<Map size={18} className="text-blue-600" />}
                    places={mergePlaces([], 'attractions')}
                    visible={hasContent([], 'attractions')}
                />
                <PlacesCategory
                    title="Aluguel de Bicicletas"
                    icon={
                        <span role="img" aria-label="bike">
                            🚲
                        </span>
                    }
                    places={mergePlaces([], 'bikes')}
                    visible={hasContent([], 'bikes')}
                />
                <PlacesCategory
                    title="Lembrancinhas"
                    icon={
                        <span role="img" aria-label="gift">
                            🎁
                        </span>
                    }
                    places={mergePlaces([], 'souvenirs')}
                    visible={hasContent([], 'souvenirs')}
                />
            </BottomSheet>

            {/* Eventos & Agenda */}
            <BottomSheet
                isOpen={activeSheet === 'Eventos & Agenda'}
                onClose={handleClose}
                title="Eventos & Agenda"
                icon={CalendarHeart}
            >
                {activeEvents.length > 0 ? (
                    <ExpandablePlaceList places={activeEvents} />
                ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p className="text-xs">Nenhum evento programado para os próximos dias.</p>
                    </div>
                )}
            </BottomSheet>

            {/* SOS & Emergência */}
            <BottomSheet
                isOpen={activeSheet === 'SOS & Emergência'}
                onClose={handleClose}
                title="SOS & Emergência"
                icon={HeartPulse}
            >
                <EmergencySheet emergencyPlaces={mergePlaces([], 'emergency')} />
            </BottomSheet>
        </>
    );
};

export default GuestRecommendations;
