import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
import OptimizedImage from './ui/OptimizedImage';
import { useFavorites } from '../hooks/useFavorites';
import { useLanguage } from '../hooks/useLanguage';

interface PlaceCardProps {
    place: PlaceRecommendation;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isFavorite, toggleFavorite } = useFavorites();
    const { t } = useLanguage();
    const favorite = place.id ? isFavorite(place.id) : false;

    // Travar scroll do body quando o modal estiver aberto
    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    // Translatable Content
    const displayName = t(place.name, place.name_en || place.name, place.name_es || place.name);
    const displayDescription = t(
        place.description,
        place.description_en || place.description,
        place.description_es || place.description
    );

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (place.id) {
            toggleFavorite(place.id);
        }
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
            {/* --- CARD EDITORIAL DE LUGAR --- */}
            <div className="flex flex-col bg-white dark:bg-[#1F1916] rounded-[22px] overflow-hidden border border-stone-200/80 dark:border-amber-500/15 shadow-[0_2px_10px_rgba(28,22,20,0.04)] dark:shadow-none hover:shadow-[0_8px_24px_rgba(28,22,20,0.09)] transition-all duration-300 w-full group mb-3">
                {/* Imagem de Capa Panorâmica (Única) com Tags Flutuantes */}
                <div
                    onClick={openModal}
                    className="w-full h-36 sm:h-44 relative overflow-hidden cursor-pointer bg-stone-100 dark:bg-stone-800"
                >
                    <OptimizedImage
                        src={place.imageUrl}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Vinheta fotográfica suave */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Tag Culinária / Categoria Flutuante (Esquerda) */}
                    <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md text-amber-200 border border-white/15 shadow-sm">
                            {(() => {
                                const rawTag = place.tags?.[0] || place.category || 'Local';
                                const tagMap: Record<string, string> = {
                                    burgers: t('Hambúrguer', 'Burgers', 'Hamburguesas'),
                                    pizza: t('Pizza', 'Pizza', 'Pizza'),
                                    japonesa: t('Japonesa', 'Japanese', 'Japonesa'),
                                    doces: t('Doces', 'Sweets', 'Dulces'),
                                    brasileira: t('Brasileira', 'Brazilian', 'Brasileña'),
                                    saudavel: t('Saudável', 'Healthy', 'Saludable'),
                                    bebidas: t('Bebidas', 'Drinks', 'Bebidas'),
                                    almoço: t('Almoço', 'Lunch', 'Almuerzo'),
                                    espetinho: t('Espetinho', 'Skewers', 'Brochetas'),
                                    local: t('Local', 'Place', 'Lugar'),
                                    lanches: t('Lanches', 'Snacks', 'Bocadillos'),
                                    jantar: t('Jantar', 'Dinner', 'Cena'),
                                    café: t('Café', 'Coffee', 'Café'),
                                    padaria: t('Padaria', 'Bakery', 'Panadería'),
                                    sorvete: t('Sorvete', 'Ice Cream', 'Helado'),
                                    açaí: t('Açaí', 'Acai', 'Açaí'),
                                    massas: t('Massas', 'Pasta', 'Pastas'),
                                    'frutos do mar': t('Frutos do Mar', 'Seafood', 'Mariscos'),
                                    carnes: t('Carnes', 'Steakhouse', 'Carnes'),
                                    vegetariano: t('Vegetariano', 'Vegetarian', 'Vegetariano'),
                                    vegano: t('Vegano', 'Vegan', 'Vegano'),
                                    bar: t('Bar', 'Bar', 'Bar'),
                                    pub: t('Pub', 'Pub', 'Pub'),
                                    balada: t('Balada', 'Club', 'Discoteca'),
                                    'música ao vivo': t(
                                        'Música ao Vivo',
                                        'Live Music',
                                        'Música en Vivo'
                                    ),
                                    'happy hour': t('Happy Hour', 'Happy Hour', 'Happy Hour'),
                                    delivery: t('Delivery', 'Delivery', 'Entrega'),
                                    retirada: t('Retirada', 'Pick-up', 'Recogida'),
                                    rodízio: t('Rodízio', 'All-you-can-eat', 'Rodizio'),
                                    'self-service': t('Self-Service', 'Buffet', 'Buffet'),
                                    'a la carte': t('À La Carte', 'À La Carte', 'A la Carta'),
                                    'fast food': t('Fast Food', 'Fast Food', 'Comida Rápida'),
                                    gourmet: t('Gourmet', 'Gourmet', 'Gourmet'),
                                    artesanal: t('Artesanal', 'Artisanal', 'Artesanal'),
                                    regional: t('Regional', 'Regional', 'Regional'),
                                    internacional: t(
                                        'Internacional',
                                        'International',
                                        'Internacional'
                                    ),
                                };
                                return tagMap[rawTag.toLowerCase()] || rawTag;
                            })()}
                        </span>
                    </div>

                    {/* Botão de Favoritar (Direita) */}
                    <button
                        type="button"
                        onClick={handleToggleFavorite}
                        aria-label="Salvar nos favoritos"
                        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/45 backdrop-blur-md text-white border border-white/15 hover:bg-black/60 active:scale-90 transition-all outline-none"
                    >
                        <Heart
                            size={16}
                            className={`transition-colors duration-300 ${
                                favorite ? 'fill-red-500 text-red-500' : 'text-white/90'
                            }`}
                        />
                    </button>

                    {/* Informações de Distância ou Data na Base da Imagem */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between">
                        {place.distance && !place.eventDate && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-stone-200 text-[10px] font-bold">
                                <Car size={11} className="text-amber-300" />
                                <span>{cleanDistance(place.distance)}</span>
                            </span>
                        )}

                        {place.eventDate && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C85A32] text-white text-[10px] font-bold shadow-sm">
                                <Calendar size={11} />
                                <span>{getFormattedEventDate()}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Corpo do Card */}
                <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                    <div>
                        <h4
                            onClick={openModal}
                            className="font-heading font-bold text-stone-900 dark:text-stone-100 text-base leading-snug group-hover:text-[#C85A32] dark:group-hover:text-amber-300 transition-colors line-clamp-1 notranslate cursor-pointer mb-1.5"
                        >
                            {displayName}
                        </h4>

                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-2 font-sans font-medium mb-4">
                            {displayDescription}
                        </p>
                    </div>

                    {/* Barra de Ações com Design Harmonioso */}
                    <div className="flex items-center gap-2 pt-1 border-t border-stone-100 dark:border-white/5">
                        <button
                            type="button"
                            onClick={openModal}
                            className="flex-1 py-2.5 bg-stone-100/80 dark:bg-white/5 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-amber-500/15 text-xs font-bold rounded-xl hover:bg-stone-200/70 dark:hover:bg-white/10 active:scale-95 transition-all text-center"
                        >
                            {t('Mais Detalhes', 'More Details', 'Más Detalles')}
                        </button>

                        {(place.orderLink || place.whatsapp) && !place.eventDate && (
                            <a
                                href={
                                    place.orderLink ||
                                    (place.whatsapp
                                        ? `https://wa.me/55${place.whatsapp.replace(/[^0-9]/g, '')}`
                                        : '#')
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className={`flex-1 py-2.5 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all ${
                                    isAttraction
                                        ? 'bg-gradient-to-r from-sky-600 to-indigo-600 shadow-sky-950/20 hover:from-sky-500 hover:to-indigo-500'
                                        : 'bg-gradient-to-r from-[#C85A32] to-orange-600 shadow-orange-950/20 hover:from-orange-600 hover:to-orange-700'
                                }`}
                            >
                                <ActionIcon size={14} />
                                <span>
                                    {isAttraction
                                        ? t('Reservar', 'Book', 'Reservar')
                                        : t('Fazer Pedido', 'Order Now', 'Pedir')}
                                </span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL DE DETALHES COMPLETO (POP-UP VIP) --- */}
            {isOpen &&
                typeof document !== 'undefined' &&
                ReactDOM.createPortal(
                    <div className="fixed inset-0 z-[180] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
                        <div
                            className="absolute inset-0 bg-[#0E0B0A]/80 backdrop-blur-md transition-opacity"
                            onClick={() => setIsOpen(false)}
                        ></div>

                        <div className="bg-[#FAF7F2] dark:bg-[#1C1614] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-slideUp sm:animate-scaleIn flex flex-col max-h-[92vh] border border-stone-200/80 dark:border-amber-500/15">
                            {/* Botão Fechar */}
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Fechar detalhes do local"
                                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all z-20 active:scale-95 shadow-lg"
                            >
                                <X size={18} />
                            </button>

                            {/* Topo: Imagem Imersiva com Título sobre Vinheta Escura */}
                            <div className="h-60 sm:h-64 shrink-0 relative bg-stone-900">
                                <OptimizedImage
                                    src={place.imageUrl}
                                    alt={place.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1614] via-[#1C1614]/40 to-transparent pointer-events-none"></div>

                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                        {place.tags.slice(0, 3).map((tag, idx) => {
                                            const tagMap: Record<string, string> = {
                                                burgers: t('Hambúrguer', 'Burgers', 'Hamburguesas'),
                                                pizza: t('Pizza', 'Pizza', 'Pizza'),
                                                japonesa: t('Japonesa', 'Japanese', 'Japonesa'),
                                                doces: t('Doces', 'Sweets', 'Dulces'),
                                                brasileira: t(
                                                    'Brasileira',
                                                    'Brazilian',
                                                    'Brasileña'
                                                ),
                                                saudavel: t('Saudável', 'Healthy', 'Saludable'),
                                                bebidas: t('Bebidas', 'Drinks', 'Bebidas'),
                                                almoço: t('Almoço', 'Lunch', 'Almuerzo'),
                                                espetinho: t('Espetinho', 'Skewers', 'Brochetas'),
                                                local: t('Local', 'Place', 'Lugar'),
                                                lanches: t('Lanches', 'Snacks', 'Bocadillos'),
                                                jantar: t('Jantar', 'Dinner', 'Cena'),
                                                café: t('Café', 'Coffee', 'Café'),
                                                padaria: t('Padaria', 'Bakery', 'Panadería'),
                                                sorvete: t('Sorvete', 'Ice Cream', 'Helado'),
                                                açaí: t('Açaí', 'Acai', 'Açaí'),
                                                massas: t('Massas', 'Pasta', 'Pastas'),
                                                'frutos do mar': t(
                                                    'Frutos do Mar',
                                                    'Seafood',
                                                    'Mariscos'
                                                ),
                                                carnes: t('Carnes', 'Steakhouse', 'Carnes'),
                                                vegetariano: t(
                                                    'Vegetariano',
                                                    'Vegetarian',
                                                    'Vegetariano'
                                                ),
                                                vegano: t('Vegano', 'Vegan', 'Vegano'),
                                                bar: t('Bar', 'Bar', 'Bar'),
                                                pub: t('Pub', 'Pub', 'Pub'),
                                                balada: t('Balada', 'Club', 'Discoteca'),
                                                'música ao vivo': t(
                                                    'Música ao Vivo',
                                                    'Live Music',
                                                    'Música en Vivo'
                                                ),
                                                'happy hour': t(
                                                    'Happy Hour',
                                                    'Happy Hour',
                                                    'Happy Hour'
                                                ),
                                                delivery: t('Delivery', 'Delivery', 'Entrega'),
                                                retirada: t('Retirada', 'Pick-up', 'Recogida'),
                                                rodízio: t('Rodízio', 'All-you-can-eat', 'Rodizio'),
                                                'self-service': t(
                                                    'Self-Service',
                                                    'Buffet',
                                                    'Buffet'
                                                ),
                                                'a la carte': t(
                                                    'À La Carte',
                                                    'À La Carte',
                                                    'A la Carta'
                                                ),
                                                'fast food': t(
                                                    'Fast Food',
                                                    'Fast Food',
                                                    'Comida Rápida'
                                                ),
                                                gourmet: t('Gourmet', 'Gourmet', 'Gourmet'),
                                                artesanal: t('Artesanal', 'Artisanal', 'Artesanal'),
                                                regional: t('Regional', 'Regional', 'Regional'),
                                                internacional: t(
                                                    'Internacional',
                                                    'International',
                                                    'Internacional'
                                                ),
                                            };
                                            return (
                                                <span
                                                    key={idx}
                                                    className="text-[10px] font-bold font-sans uppercase tracking-wider bg-amber-500/25 text-amber-200 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-amber-400/30 shadow-sm"
                                                >
                                                    {tagMap[tag.toLowerCase()] || tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-display font-semibold text-stone-50 leading-tight pr-6 drop-shadow-md notranslate">
                                        {displayName}
                                    </h2>
                                </div>
                            </div>

                            {/* Conteúdo do Modal com Scroll Suave */}
                            <div className="p-6 overflow-y-auto space-y-4">
                                <p className="text-stone-700 dark:text-stone-300 leading-relaxed text-sm font-sans font-medium">
                                    {displayDescription}
                                </p>

                                <div className="space-y-3.5">
                                    {place.eventDate && (
                                        <div className="flex items-start gap-3.5 bg-amber-50/80 dark:bg-amber-500/10 p-4 rounded-2xl border border-amber-200/70 dark:border-amber-500/25 shadow-sm">
                                            <div className="bg-amber-100 dark:bg-amber-500/20 p-2.5 rounded-xl text-[#C85A32] dark:text-amber-300 shrink-0">
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-[#C85A32] dark:text-amber-400 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                    {t('Quando', 'When', 'Cuándo')}
                                                </p>
                                                <p className="text-stone-900 dark:text-stone-100 text-sm font-bold font-sans leading-snug">
                                                    {place.eventDate.split('-').reverse().join('/')}
                                                    {place.eventEndDate &&
                                                        ` ${t('até', 'until', 'hasta')} ${place.eventEndDate.split('-').reverse().join('/')}`}
                                                </p>
                                                {place.eventTime && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-stone-600 dark:text-amber-200/80 font-medium">
                                                        <Clock size={12} />
                                                        <span>
                                                            {place.eventTime}{' '}
                                                            {place.eventEndTime
                                                                ? `- ${place.eventEndTime}`
                                                                : ''}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {place.address && (
                                        <div className="flex items-start gap-3.5 bg-white dark:bg-[#241C19] p-4 rounded-2xl border border-stone-200/80 dark:border-amber-500/15 shadow-sm">
                                            <div className="bg-amber-50 dark:bg-amber-500/15 p-2.5 rounded-xl text-[#C85A32] dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20 shrink-0">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-bold mb-0.5 font-heading tracking-wider">
                                                    {t('Localização', 'Location', 'Ubicación')}
                                                </p>
                                                <p className="text-stone-900 dark:text-stone-100 text-sm font-bold font-sans leading-snug notranslate">
                                                    {place.address}
                                                </p>
                                                {place.distance && (
                                                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 flex items-center gap-1 font-medium font-sans">
                                                        <Car size={12} />{' '}
                                                        <span>
                                                            {t('Aprox.', 'Approx.', 'Aprox.')}{' '}
                                                            {place.distance}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bloco de Ações Principais com Respiro Amplo */}
                                    <div className="flex flex-col gap-2.5 pt-2 pb-2">
                                        {place.orderLink && (
                                            <a
                                                href={place.orderLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold font-sans py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-950/20 active:scale-[0.98] text-sm"
                                            >
                                                <ActionIcon size={18} />
                                                <span>{actionLabel}</span>
                                            </a>
                                        )}

                                        {place.address && googleMapsUrl && (
                                            <a
                                                href={googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`flex items-center justify-center gap-2 w-full font-bold font-sans py-3.5 rounded-2xl transition-all active:scale-[0.98] text-sm ${
                                                    place.orderLink
                                                        ? 'bg-white dark:bg-[#241C19] border border-stone-200/90 dark:border-amber-500/25 text-stone-800 dark:text-amber-200 hover:bg-amber-50/50 dark:hover:bg-[#2C221E] shadow-sm'
                                                        : 'bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-950/20'
                                                }`}
                                            >
                                                <ExternalLink size={18} />
                                                <span>
                                                    {t(
                                                        'Abrir no Google Maps',
                                                        'Open in Google Maps',
                                                        'Abrir en Google Maps'
                                                    )}
                                                </span>
                                            </a>
                                        )}

                                        {place.phoneNumber && (
                                            <a
                                                href={`tel:${place.phoneNumber.replace(/[^0-9]/g, '')}`}
                                                className="flex items-center justify-center gap-2 w-full bg-white dark:bg-[#241C19] border border-stone-200/90 dark:border-amber-500/20 text-stone-800 dark:text-stone-200 font-bold font-sans py-3.5 rounded-2xl hover:bg-stone-100 dark:hover:bg-[#2C221E] transition-all active:scale-[0.98] text-sm shadow-sm"
                                            >
                                                <Phone
                                                    size={18}
                                                    className="text-emerald-600 dark:text-emerald-400"
                                                />
                                                <span>
                                                    {t('Ligar Agora', 'Call Now', 'Llamar Ahora')}
                                                </span>
                                            </a>
                                        )}

                                        {place.whatsapp && (
                                            <a
                                                href={`https://wa.me/55${place.whatsapp.replace(/[^0-9]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-emerald-600 text-white font-bold font-sans py-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-950/20 active:scale-[0.98] text-sm"
                                            >
                                                <MessageCircle size={18} />
                                                <span>WhatsApp</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default React.memo(PlaceCard);
