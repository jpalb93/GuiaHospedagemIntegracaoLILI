import React, { useState } from 'react';
import { PlaceRecommendation } from '../types';
import {
    MapPin,
    ExternalLink,
    X,
    Car,
    Phone,
    ShoppingBag,
    Ticket,
    Calendar,
    Clock,
    MessageCircle,
    Heart,
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../hooks/useLanguage';

interface PlaceCardProps {
    place: PlaceRecommendation;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // Default expanded as per UX request
    const { isFavorite, toggleFavorite } = useFavorites();
    const { t } = useLanguage();
    const favorite = place.id ? isFavorite(place.id) : false;

    // Translatable Content
    const displayName = t(place.name, place.name_en || '[SEM TRADUÇÃO]', place.name_es);
    const displayDescription = t(place.description, place.description_en, place.description_es);

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (place.id) {
            toggleFavorite(place.id);
        }
    };


    const toggleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const openModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(true);
    };

    const googleMapsUrl = place.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address} Petrolina PE`)}`
        : null;

    const cleanDistance = (dist?: string) => {
        if (!dist) return null;
        return dist.replace(/\s*\(.*?\)/g, '').trim();
    };

    const category = (place.category ?? '').toLowerCase();
    const isAttraction =
        category === 'attractions' ||
        category === 'passeios' ||
        category === 'events' ||
        category === 'eventos';

    const actionLabel = isAttraction
        ? t('Reservar / Ver Site', 'Book / View Site', 'Reservar / Ver Sitio')
        : t('Fazer Pedido Online', 'Order Online', 'Pedir en Línea');
    const ActionIcon = isAttraction ? Ticket : ShoppingBag;

    const getFormattedEventDate = () => {
        if (!place.eventDate) return null;
        const [, m, d] = place.eventDate.split('-');
        return `${d}/${m}`;
    };

    return (
        <>
            {/* --- CARD EXPANDÍVEL --- */}
            <div
                className={`flex flex-col bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:bg-gray-750 transition-all duration-300 w-full group relative ${isExpanded ? 'ring-2 ring-orange-100 dark:ring-gray-600' : ''}`}
            >
                {/* Header Collapsed (Always Visible) */}
                <div
                    onClick={toggleExpand}
                    className="flex items-center p-3 cursor-pointer min-h-[72px]"
                >
                    {/* Tiny Thumbnail */}
                    <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                        <OptimizedImage
                            src={place.imageUrl}
                            alt={place.name}
                            className="w-full h-full object-cover"
                        />
                        {place.eventDate && (
                            <div className="absolute inset-0 bg-pink-900/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white">{getFormattedEventDate()}</span>
                            </div>
                        )}
                    </div>

                    {/* Basic Info */}
                    <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="font-heading font-bold text-gray-900 dark:text-white text-sm leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-1 notranslate">
                            {displayName}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                                {(() => {
                                    const rawTag = place.tags?.[0] || place.category || 'Local';
                                    const tagMap: Record<string, string> = {
                                        'burgers': t('Hambúrguer', 'Burgers', 'Hamburguesas'),
                                        'pizza': t('Pizza', 'Pizza', 'Pizza'),
                                        'japonesa': t('Japonesa', 'Japanese', 'Japonesa'),
                                        'doces': t('Doces', 'Sweets', 'Dulces'),
                                        'brasileira': t('Brasileira', 'Brazilian', 'Brasileña'),
                                        'saudavel': t('Saudável', 'Healthy', 'Saludable'),
                                        'bebidas': t('Bebidas', 'Drinks', 'Bebidas'),
                                        'almoço': t('Almoço', 'Lunch', 'Almuerzo'),
                                        'espetinho': t('Espetinho', 'Skewers', 'Brochetas'),
                                        'local': t('Local', 'Place', 'Lugar'),
                                        'lanches': t('Lanches', 'Snacks', 'Bocadillos'),
                                        'jantar': t('Jantar', 'Dinner', 'Cena'),
                                        'café': t('Café', 'Coffee', 'Café'),
                                        'padaria': t('Padaria', 'Bakery', 'Panadería'),
                                        'sorvete': t('Sorvete', 'Ice Cream', 'Helado'),
                                        'açaí': t('Açaí', 'Acai', 'Açaí'),
                                        'massas': t('Massas', 'Pasta', 'Pastas'),
                                        'frutos do mar': t('Frutos do Mar', 'Seafood', 'Mariscos'),
                                        'carnes': t('Carnes', 'Steakhouse', 'Carnes'),
                                        'vegetariano': t('Vegetariano', 'Vegetarian', 'Vegetariano'),
                                        'vegano': t('Vegano', 'Vegan', 'Vegano'),
                                        'bar': t('Bar', 'Bar', 'Bar'),
                                        'pub': t('Pub', 'Pub', 'Pub'),
                                        'balada': t('Balada', 'Club', 'Discoteca'),
                                        'música ao vivo': t('Música ao Vivo', 'Live Music', 'Música en Vivo'),
                                        'happy hour': t('Happy Hour', 'Happy Hour', 'Happy Hour'),
                                        'delivery': t('Delivery', 'Delivery', 'Entrega'),
                                        'retirada': t('Retirada', 'Pick-up', 'Recogida'),
                                        'rodízio': t('Rodízio', 'All-you-can-eat', 'Rodizio'),
                                        'self-service': t('Self-Service', 'Buffet', 'Buffet'),
                                        'a la carte': t('À La Carte', 'À La Carte', 'A la Carta'),
                                        'fast food': t('Fast Food', 'Fast Food', 'Comida Rápida'),
                                        'gourmet': t('Gourmet', 'Gourmet', 'Gourmet'),
                                        'artesanal': t('Artesanal', 'Artisanal', 'Artesanal'),
                                        'regional': t('Regional', 'Regional', 'Regional'),
                                        'internacional': t('Internacional', 'International', 'Internacional'),
                                    };
                                    return tagMap[rawTag.toLowerCase()] || rawTag;
                                })()}
                            </span>
                            {place.distance && !place.eventDate && (
                                <span className="flex items-center text-[10px] text-gray-400">
                                    <span className="w-0.5 h-0.5 rounded-full bg-gray-300 mx-1.5" />
                                    {cleanDistance(place.distance)}
                                </span>
                            )}
                        </div>
                    </div>


                    {/* Favorite Heart */}
                    <button
                        onClick={handleToggleFavorite}
                        className="p-2 mr-1 text-gray-400 active:scale-95 transition-all outline-none"
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-300 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-gray-400'}`}
                        />
                    </button>

                    {/* Chevron / Toggle Indicator */}
                    <div className={`p-2 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-orange-500' : ''}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>

                {/* Expanded Content (Animated) */}
                <div
                    className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden">
                        <div className="p-3 pt-0 pb-4">
                            {/* Full Image (Click to open modal) */}
                            <div
                                onClick={openModal}
                                className="w-full h-32 rounded-xl overflow-hidden relative group/image cursor-pointer mb-3"
                            >
                                <OptimizedImage
                                    src={place.imageUrl}
                                    alt={place.name}
                                    className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover/image:bg-transparent transition-colors" />
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 font-sans font-medium mb-3">
                                {displayDescription}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={openModal}
                                    className="flex-1 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t('Mais Informações', 'More Info', 'Más Información')}
                                </button>
                                {(place.orderLink || place.whatsapp) && !place.eventDate && (
                                    <a
                                        href={place.orderLink || (place.whatsapp ? `https://wa.me/55${place.whatsapp.replace(/[^0-9]/g, '')}` : '#')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className={`flex-1 py-2 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all ${isAttraction ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        <ActionIcon size={12} />
                                        {isAttraction
                                            ? t('Reservar', 'Book', 'Reservar')
                                            : t('Pedir', 'Order', 'Pedir')}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL DE DETALHES (POP-UP) --- */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    ></div>

                    <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-white/10">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors z-20"
                        >
                            <X size={18} />
                        </button>

                        <div className="h-56 shrink-0 relative bg-gray-100 dark:bg-gray-700">
                            <OptimizedImage
                                src={place.imageUrl}
                                alt={place.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6">
                                <h2 className="text-2xl font-heading font-bold text-white leading-tight pr-8 mb-2 shadow-sm notranslate">
                                    <h2 className="text-2xl font-heading font-bold text-white leading-tight pr-8 mb-2 shadow-sm notranslate">
                                        <h2 className="text-2xl font-heading font-bold text-white leading-tight pr-8 mb-2 shadow-sm notranslate">
                                            {displayName}
                                        </h2>
                                    </h2>
                                </h2>
                                <div className="flex flex-wrap gap-1.5">
                                    {place.tags.slice(0, 3).map((tag, idx) => {
                                        const tagMap: Record<string, string> = {
                                            'burgers': t('Hambúrguer', 'Burgers', 'Hamburguesas'),
                                            'pizza': t('Pizza', 'Pizza', 'Pizza'),
                                            'japonesa': t('Japonesa', 'Japanese', 'Japonesa'),
                                            'doces': t('Doces', 'Sweets', 'Dulces'),
                                            'brasileira': t('Brasileira', 'Brazilian', 'Brasileña'),
                                            'saudavel': t('Saudável', 'Healthy', 'Saludable'),
                                            'bebidas': t('Bebidas', 'Drinks', 'Bebidas'),
                                            'almoço': t('Almoço', 'Lunch', 'Almuerzo'),
                                            'espetinho': t('Espetinho', 'Skewers', 'Brochetas'),
                                            'local': t('Local', 'Place', 'Lugar'),
                                            'lanches': t('Lanches', 'Snacks', 'Bocadillos'),
                                            'jantar': t('Jantar', 'Dinner', 'Cena'),
                                            'café': t('Café', 'Coffee', 'Café'),
                                            'padaria': t('Padaria', 'Bakery', 'Panadería'),
                                            'sorvete': t('Sorvete', 'Ice Cream', 'Helado'),
                                            'açaí': t('Açaí', 'Acai', 'Açaí'),
                                            'massas': t('Massas', 'Pasta', 'Pastas'),
                                            'frutos do mar': t('Frutos do Mar', 'Seafood', 'Mariscos'),
                                            'carnes': t('Carnes', 'Steakhouse', 'Carnes'),
                                            'vegetariano': t('Vegetariano', 'Vegetarian', 'Vegetariano'),
                                            'vegano': t('Vegano', 'Vegan', 'Vegano'),
                                            'bar': t('Bar', 'Bar', 'Bar'),
                                            'pub': t('Pub', 'Pub', 'Pub'),
                                            'balada': t('Balada', 'Club', 'Discoteca'),
                                            'música ao vivo': t('Música ao Vivo', 'Live Music', 'Música en Vivo'),
                                            'happy hour': t('Happy Hour', 'Happy Hour', 'Happy Hour'),
                                            'delivery': t('Delivery', 'Delivery', 'Entrega'),
                                            'retirada': t('Retirada', 'Pick-up', 'Recogida'),
                                            'rodízio': t('Rodízio', 'All-you-can-eat', 'Rodizio'),
                                            'self-service': t('Self-Service', 'Buffet', 'Buffet'),
                                            'a la carte': t('À La Carte', 'À La Carte', 'A la Carta'),
                                            'fast food': t('Fast Food', 'Fast Food', 'Comida Rápida'),
                                            'gourmet': t('Gourmet', 'Gourmet', 'Gourmet'),
                                            'artesanal': t('Artesanal', 'Artisanal', 'Artesanal'),
                                            'regional': t('Regional', 'Regional', 'Regional'),
                                            'internacional': t('Internacional', 'International', 'Internacional'),
                                        };
                                        return (
                                            <span
                                                key={idx}
                                                className="text-[9px] font-bold font-sans uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-lg backdrop-blur-md border border-white/10 shadow-sm"
                                            >
                                                {tagMap[tag.toLowerCase()] || tag}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm mb-6 font-sans font-medium">
                                {displayDescription}
                            </p>

                            <div className="space-y-5">
                                {place.eventDate && (
                                    <div className="flex items-start gap-3 bg-pink-50 dark:bg-pink-900/20 p-4 rounded-2xl border border-pink-100 dark:border-pink-800/30">
                                        <div className="bg-pink-100 dark:bg-pink-900/40 p-2 rounded-xl text-pink-600 dark:text-pink-400 shadow-sm">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-pink-500 dark:text-pink-400 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                {t('Quando', 'When', 'Cuándo')}
                                            </p>
                                            <p className="text-gray-900 dark:text-white text-sm font-bold font-sans leading-snug">
                                                {place.eventDate.split('-').reverse().join('/')}
                                                {place.eventEndDate &&
                                                    ` ${t('até', 'until', 'hasta')} ${place.eventEndDate.split('-').reverse().join('/')}`}
                                            </p>
                                            {place.eventTime && (
                                                <div className="mt-1 flex items-center gap-1 text-xs text-pink-700 dark:text-pink-300 font-medium">
                                                    <Clock size={12} />
                                                    {place.eventTime}{' '}
                                                    {place.eventEndTime
                                                        ? `- ${place.eventEndTime}`
                                                        : ''}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {place.address && (
                                    <div className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                        <div className="bg-white dark:bg-gray-700 p-2 rounded-xl text-orange-500 dark:text-orange-400 shadow-sm border border-orange-50 dark:border-orange-900/30">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                {t('Localização', 'Location', 'Ubicación')}
                                            </p>
                                            <p className="text-gray-900 dark:text-white text-sm font-bold font-sans leading-snug notranslate">
                                                {place.address}
                                            </p>
                                            {place.distance && (
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1 font-medium font-sans">
                                                    <Car size={12} /> {t('Aprox.', 'Approx.', 'Aprox.')} {place.distance}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2.5">
                                    {place.orderLink && (
                                        <a
                                            href={place.orderLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-center gap-2 w-full text-white font-bold font-sans py-3.5 rounded-xl transition-all shadow-lg active:scale-[0.98] text-sm ${isAttraction ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20'}`}
                                        >
                                            <ActionIcon size={18} />
                                            {actionLabel}
                                        </a>
                                    )}

                                    {place.address && googleMapsUrl && !place.orderLink && (
                                        <a
                                            href={googleMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white font-bold font-sans py-3.5 rounded-xl hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20 active:scale-[0.98] text-sm"
                                        >
                                            <ExternalLink size={18} />
                                            {t('Abrir no Google Maps', 'Open in Google Maps', 'Abrir en Google Maps')}
                                        </a>
                                    )}

                                    {place.phoneNumber && (
                                        <a
                                            href={`tel:${place.phoneNumber.replace(/[^0-9]/g, '')}`}
                                            className="flex items-center justify-center gap-2 w-full bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold font-sans py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-200 transition-all active:scale-[0.98] text-sm"
                                        >
                                            <Phone
                                                size={18}
                                                className="text-green-600 dark:text-green-400"
                                            />
                                            {t('Ligar Agora', 'Call Now', 'Llamar Ahora')}
                                        </a>
                                    )}

                                    {place.whatsapp && (
                                        <a
                                            href={`https://wa.me/55${place.whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold font-sans py-3.5 rounded-xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] text-sm"
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

export default React.memo(PlaceCard);

