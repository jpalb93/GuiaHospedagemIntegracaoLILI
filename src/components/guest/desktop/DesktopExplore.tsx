import React, { useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronLeft,
    ChevronRight,
    Coffee,
    Heart,
    ImageOff,
    MapPin,
    MessageCircle,
    Navigation,
    Phone,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Utensils,
    X,
} from 'lucide-react';
import { useFavorites } from '../../../hooks/useFavorites';
import { useLanguage } from '../../../hooks/useLanguage';
import { PlaceRecommendation } from '../../../types';
import './DesktopExplore.css';

export interface DesktopExploreProps {
    places: PlaceRecommendation[];
    activeEvents: PlaceRecommendation[];
    favoritesOnly?: boolean;
    initialCategory?: string;
}

type Category = 'all' | 'food' | 'cafes' | 'services' | 'attractions' | 'events';
const PAGE_SIZE = 6;

const categoryGroups: Record<Exclude<Category, 'all'>, string[]> = {
    food: [
        'burgers',
        'skewers',
        'salads',
        'pasta',
        'oriental',
        'alacarte',
        'selfservice',
        'bars',
        'snacks',
    ],
    cafes: ['cafes'],
    services: ['essentials', 'pharmacies', 'laundry', 'salon', 'gym'],
    attractions: ['attractions', 'bikes', 'souvenirs'],
    events: ['events'],
};

const categoryAliases: Record<string, Category> = {
    'Bares e Restaurantes': 'food',
    'Cafés e Padarias': 'cafes',
    'Mercados e Serviços': 'services',
    'Passeios & Lazer': 'attractions',
    'Eventos & Agenda': 'events',
};

const normalize = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .trim();

const safeWebUrl = (value?: string) => {
    if (!value) return undefined;
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
    } catch {
        return undefined;
    }
};

const safeImageUrl = (value?: string) => {
    if (!value) return undefined;
    const external = safeWebUrl(value);
    if (external) return external;
    try {
        const local = new URL(value, 'https://guest-guide.invalid');
        return local.origin === 'https://guest-guide.invalid' ? value : undefined;
    } catch {
        return undefined;
    }
};

const placeKey = (place: PlaceRecommendation) =>
    place.id || `${place.category || 'place'}:${place.name}:${place.address || ''}`;

const initialGroup = (category?: string): Category => {
    if (!category) return 'all';
    if (categoryAliases[category]) return categoryAliases[category];
    if (category === 'all' || category in categoryGroups) return category as Category;
    return (
        (Object.keys(categoryGroups) as Exclude<Category, 'all'>[]).find((group) =>
            categoryGroups[group].includes(category)
        ) || 'all'
    );
};

const DesktopExplore: React.FC<DesktopExploreProps> = ({
    places,
    activeEvents,
    favoritesOnly = false,
    initialCategory,
}) => {
    const { t, currentLang } = useLanguage();
    const { isFavorite, toggleFavorite } = useFavorites();
    const searchId = useId();
    const detailId = useId();
    const listId = useId();
    const detailPanel = useRef<HTMLElement>(null);
    const listPanel = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<Category>(() => initialGroup(initialCategory));
    const [page, setPage] = useState(1);
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
    const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Recife' }).format(
        new Date()
    );

    const categories = [
        { id: 'all' as const, label: t('Todos', 'All places', 'Todos'), icon: SlidersHorizontal },
        {
            id: 'food' as const,
            label: t('Comer e beber', 'Food & drink', 'Comer y beber'),
            icon: Utensils,
        },
        {
            id: 'cafes' as const,
            label: t('Cafés e padarias', 'Cafés & bakeries', 'Cafés y panaderías'),
            icon: Coffee,
        },
        {
            id: 'services' as const,
            label: t('Serviços', 'Services', 'Servicios'),
            icon: ShoppingBag,
        },
        {
            id: 'attractions' as const,
            label: t('Passeios', 'Things to do', 'Paseos'),
            icon: MapPin,
        },
        { id: 'events' as const, label: t('Agenda', 'Events', 'Agenda'), icon: CalendarDays },
    ];

    const catalog = useMemo(() => {
        const seen = new Set<string>();
        return [
            ...places.filter(
                (place) => place.category !== 'events' && place.category !== 'emergency'
            ),
            ...activeEvents
                .filter((event) => {
                    const expiry = event.eventEndDate || event.eventDate;
                    return !expiry || expiry >= today;
                })
                .map((event): PlaceRecommendation => ({ ...event, category: 'events' })),
        ].filter((place) => {
            if (place.visible === false) return false;
            const key = placeKey(place);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, [places, activeEvents, today]);

    const eligiblePlaces = favoritesOnly
        ? catalog.filter((place) => place.id && isFavorite(place.id))
        : catalog;
    const searchQuery = normalize(query);
    const filteredPlaces = eligiblePlaces.filter((place) => {
        const inCategory =
            category === 'all' || categoryGroups[category].includes(place.category || '');
        const searchableText = [
            place.name,
            place.name_en,
            place.name_es,
            place.description,
            place.description_en,
            place.description_es,
            place.address,
            ...(place.tags || []),
        ]
            .filter(Boolean)
            .join(' ');
        return inCategory && (!searchQuery || normalize(searchableText).includes(searchQuery));
    });
    const pageCount = Math.max(1, Math.ceil(filteredPlaces.length / PAGE_SIZE));
    const currentPage = Math.min(page, pageCount);
    // Favorites and live catalog updates can remove the final page between interactions.
    if (page !== currentPage) setPage(currentPage);
    const pageStart = (currentPage - 1) * PAGE_SIZE;
    const pagePlaces = filteredPlaces.slice(pageStart, pageStart + PAGE_SIZE);
    const selected = pagePlaces.find((place) => placeKey(place) === selectedKey) || pagePlaces[0];
    const selectedIdentity = selected ? placeKey(selected) : null;

    useLayoutEffect(() => {
        if (detailPanel.current) detailPanel.current.scrollTop = 0;
    }, [selectedIdentity]);

    useLayoutEffect(() => {
        if (listPanel.current) listPanel.current.scrollTop = 0;
    }, [currentPage, query, category, favoritesOnly]);

    const resetPage = () => {
        setPage(1);
        setSelectedKey(null);
    };

    const changePage = (next: number) => {
        setPage(Math.min(Math.max(next, 1), pageCount));
        setSelectedKey(null);
    };

    const title = (place: PlaceRecommendation) => t(place.name, place.name_en, place.name_es);
    const description = (place: PlaceRecommendation) =>
        t(place.description, place.description_en, place.description_es);
    const distance = (place: PlaceRecommendation) =>
        t(place.distance || '', place.distance_en, place.distance_es);
    const imageFailed = (url: string) => !safeImageUrl(url) || failedImages.has(url);
    const recordImageFailure = (url: string) =>
        setFailedImages((previous) => new Set(previous).add(url));
    const categoryLabel = (place: PlaceRecommendation) =>
        categories.find(
            (item) => item.id !== 'all' && categoryGroups[item.id].includes(place.category || '')
        )?.label;

    const mapsUrl = selected
        ? safeWebUrl(selected.mapsLink) ||
          (selected.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selected.name} ${selected.address}`)}`
              : undefined)
        : undefined;
    const orderUrl = safeWebUrl(selected?.orderLink);
    const phone = selected?.phoneNumber?.replace(/[^\d+]/g, '');
    const hasPhone = phone && /^\+?\d{8,15}$/.test(phone);
    const whatsappNumber = selected?.whatsapp?.replace(/\D/g, '');
    const whatsappUrl =
        selected?.whatsapp && /^[+\d\s().-]+$/.test(selected.whatsapp)
            ? whatsappNumber && /^\d{8,15}$/.test(whatsappNumber)
                ? `https://wa.me/${whatsappNumber}`
                : undefined
            : safeWebUrl(selected?.whatsapp);

    const formatEventDate = (date?: string) => {
        if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return '';
        const [year, month, day] = date.split('-').map(Number);
        const parsed = new Date(year, month - 1, day);
        if (Number.isNaN(parsed.getTime())) return '';
        return parsed.toLocaleDateString(
            currentLang === 'pt' ? 'pt-BR' : currentLang === 'es' ? 'es' : 'en',
            {
                day: 'numeric',
                month: 'short',
            }
        );
    };

    return (
        <section
            className="gd-explore"
            aria-label={
                favoritesOnly
                    ? t('Meus favoritos', 'My favorites', 'Mis favoritos')
                    : t('Explorar a região', 'Explore the area', 'Explorar la zona')
            }
        >
            <header className="gd-explore-heading">
                <div>
                    <h2>
                        {favoritesOnly
                            ? t(
                                  'Seus lugares favoritos',
                                  'Your favorite places',
                                  'Tus lugares favoritos'
                              )
                            : t(
                                  'O que vamos conhecer?',
                                  'Where shall we go?',
                                  '¿Qué vamos a conocer?'
                              )}
                    </h2>
                    <p>
                        {favoritesOnly
                            ? t(
                                  'Suas escolhas reunidas para aproveitar a estadia.',
                                  'Your saved places, ready for your stay.',
                                  'Tus lugares guardados para disfrutar de la estancia.'
                              )
                            : t(
                                  'Encontre uma boa mesa, um passeio ou o que precisar por perto.',
                                  'Find a good meal, a day out, or something you need nearby.',
                                  'Encuentra dónde comer, un paseo o lo que necesites cerca.'
                              )}
                    </p>
                </div>
                <span className="gd-explore-total">
                    {eligiblePlaces.length} {t('lugares', 'places', 'lugares')}
                </span>
            </header>

            <div className="gd-explore-tools">
                <label className="gd-explore-search" htmlFor={searchId}>
                    <Search size={19} aria-hidden="true" />
                    <span className="sr-only">
                        {t('Buscar lugares', 'Search places', 'Buscar lugares')}
                    </span>
                    <input
                        id={searchId}
                        type="search"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            resetPage();
                        }}
                        placeholder={t(
                            'Busque um lugar, comida ou serviço…',
                            'Search for a place, food or service…',
                            'Busca un lugar, comida o servicio…'
                        )}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                resetPage();
                            }}
                            aria-label={t('Limpar busca', 'Clear search', 'Limpiar búsqueda')}
                        >
                            <X size={17} />
                        </button>
                    )}
                </label>
                <div
                    className="gd-explore-categories"
                    aria-label={t(
                        'Filtrar por categoria',
                        'Filter by category',
                        'Filtrar por categoría'
                    )}
                >
                    {categories.map(({ id, label, icon: Icon }) => {
                        const count =
                            id === 'all'
                                ? eligiblePlaces.length
                                : eligiblePlaces.filter((place) =>
                                      categoryGroups[id].includes(place.category || '')
                                  ).length;
                        if (id !== 'all' && !count && category !== id) return null;
                        return (
                            <button
                                key={id}
                                type="button"
                                aria-pressed={category === id}
                                onClick={() => {
                                    setCategory(id);
                                    resetPage();
                                }}
                                className={category === id ? 'is-active' : ''}
                            >
                                <Icon size={16} aria-hidden="true" />
                                {label}
                                <span>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <p className="gd-explore-results" role="status" aria-live="polite">
                {filteredPlaces.length}{' '}
                {filteredPlaces.length === 1
                    ? t('lugar encontrado', 'place found', 'lugar encontrado')
                    : t('lugares encontrados', 'places found', 'lugares encontrados')}
                {query && (
                    <>
                        {' '}
                        {t('para', 'for', 'para')} “{query}”
                    </>
                )}
            </p>

            {selected ? (
                <div className="gd-explore-layout">
                    <div className="gd-explore-list-column">
                        <div
                            ref={listPanel}
                            className="gd-explore-list-scroll"
                            tabIndex={0}
                            role="region"
                            aria-label={t('Lista de lugares', 'Places list', 'Lista de lugares')}
                        >
                            <ul
                                id={listId}
                                className="gd-explore-list"
                                aria-label={t(
                                    'Lugares encontrados',
                                    'Places found',
                                    'Lugares encontrados'
                                )}
                            >
                                {pagePlaces.map((place) => {
                                    const key = placeKey(place);
                                    const isSelected = placeKey(selected) === key;
                                    const favorite = !!place.id && isFavorite(place.id);
                                    return (
                                        <li key={key} className={isSelected ? 'is-selected' : ''}>
                                            <button
                                                type="button"
                                                className="gd-explore-place"
                                                aria-pressed={isSelected}
                                                aria-controls={detailId}
                                                onClick={() => {
                                                    setSelectedKey(key);
                                                    if (detailPanel.current)
                                                        detailPanel.current.scrollTop = 0;
                                                }}
                                            >
                                                <span className="gd-explore-thumbnail">
                                                    {!imageFailed(place.imageUrl) ? (
                                                        <img
                                                            src={place.imageUrl}
                                                            alt=""
                                                            loading="lazy"
                                                            onError={() =>
                                                                recordImageFailure(place.imageUrl)
                                                            }
                                                        />
                                                    ) : (
                                                        <ImageOff size={23} aria-hidden="true" />
                                                    )}
                                                </span>
                                                <span className="gd-explore-place-copy">
                                                    <strong>{title(place)}</strong>
                                                    <span className="gd-explore-place-meta">
                                                        {categoryLabel(place)}
                                                    </span>
                                                    <span className="gd-explore-place-description">
                                                        {description(place)}
                                                    </span>
                                                    {distance(place) && (
                                                        <span className="gd-explore-distance">
                                                            <MapPin size={13} aria-hidden="true" />
                                                            {distance(place)}
                                                        </span>
                                                    )}
                                                </span>
                                                <ChevronRight
                                                    size={17}
                                                    className="gd-explore-place-arrow"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                            {place.id && (
                                                <button
                                                    type="button"
                                                    className="gd-explore-list-favorite"
                                                    aria-pressed={favorite}
                                                    onClick={() => toggleFavorite(place.id!)}
                                                    aria-label={`${
                                                        favorite
                                                            ? t(
                                                                  'Remover dos favoritos',
                                                                  'Remove from favorites',
                                                                  'Quitar de favoritos'
                                                              )
                                                            : t(
                                                                  'Salvar nos favoritos',
                                                                  'Save to favorites',
                                                                  'Guardar en favoritos'
                                                              )
                                                    }: ${title(place)}`}
                                                >
                                                    <Heart
                                                        size={17}
                                                        fill={favorite ? 'currentColor' : 'none'}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <nav
                            className="gd-explore-pagination"
                            aria-label={t(
                                'Paginação dos lugares',
                                'Places pagination',
                                'Paginación de lugares'
                            )}
                        >
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                aria-controls={listId}
                                onClick={() => changePage(currentPage - 1)}
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                                {t('Anterior', 'Previous', 'Anterior')}
                            </button>
                            <span aria-live="polite" aria-atomic="true">
                                {pageStart + 1}–{pageStart + pagePlaces.length}{' '}
                                {t('de', 'of', 'de')} {filteredPlaces.length}
                            </span>
                            <button
                                type="button"
                                disabled={currentPage === pageCount}
                                aria-controls={listId}
                                onClick={() => changePage(currentPage + 1)}
                            >
                                {t('Próxima', 'Next', 'Siguiente')}
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        </nav>
                    </div>

                    <article
                        ref={detailPanel}
                        className="gd-explore-detail"
                        id={detailId}
                        aria-labelledby={`${detailId}-title`}
                        tabIndex={0}
                    >
                        {!imageFailed(selected.imageUrl) && (
                            <div className="gd-explore-cover">
                                <img
                                    src={selected.imageUrl}
                                    alt={title(selected)}
                                    loading="lazy"
                                    onError={() => recordImageFailure(selected.imageUrl)}
                                />
                            </div>
                        )}
                        <div className="gd-explore-detail-content">
                            <h2 id={`${detailId}-title`}>{title(selected)}</h2>
                            <div className="gd-explore-detail-meta">
                                <span>{categoryLabel(selected)}</span>
                                {distance(selected) && (
                                    <span>
                                        <MapPin size={14} aria-hidden="true" />
                                        {distance(selected)}
                                    </span>
                                )}
                            </div>
                            <p className="gd-explore-detail-description">{description(selected)}</p>
                            {selected.tags?.length > 0 && (
                                <ul
                                    className="gd-explore-tags"
                                    aria-label={t('Características', 'Features', 'Características')}
                                >
                                    {selected.tags.map((tag, index) => (
                                        <li key={`${tag}-${index}`}>{tag}</li>
                                    ))}
                                </ul>
                            )}
                            {(selected.eventDate || selected.eventTime) && (
                                <div className="gd-explore-event-date">
                                    <CalendarDays size={17} aria-hidden="true" />
                                    <span>
                                        {formatEventDate(selected.eventDate)}
                                        {selected.eventEndDate && (
                                            <> – {formatEventDate(selected.eventEndDate)}</>
                                        )}
                                        {selected.eventTime && <> · {selected.eventTime}</>}
                                    </span>
                                </div>
                            )}
                            {selected.address && (
                                <p className="gd-explore-address">
                                    <MapPin size={17} aria-hidden="true" />
                                    {selected.address}
                                </p>
                            )}
                            <div className="gd-explore-actions">
                                {mapsUrl && (
                                    <a
                                        href={mapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="gd-explore-action-primary"
                                    >
                                        <Navigation size={16} aria-hidden="true" />
                                        {t('Como chegar', 'Get directions', 'Cómo llegar')}
                                        <ArrowUpRight size={15} aria-hidden="true" />
                                    </a>
                                )}
                                {selected.id && (
                                    <button
                                        type="button"
                                        aria-pressed={isFavorite(selected.id)}
                                        onClick={() => toggleFavorite(selected.id!)}
                                    >
                                        {isFavorite(selected.id) ? (
                                            <Check size={16} aria-hidden="true" />
                                        ) : (
                                            <Heart size={16} aria-hidden="true" />
                                        )}
                                        {isFavorite(selected.id)
                                            ? t('Salvo', 'Saved', 'Guardado')
                                            : t('Salvar lugar', 'Save place', 'Guardar lugar')}
                                    </button>
                                )}
                                {whatsappUrl && (
                                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle size={16} aria-hidden="true" />
                                        WhatsApp
                                        <ArrowUpRight size={15} aria-hidden="true" />
                                    </a>
                                )}
                                {hasPhone && (
                                    <a href={`tel:${phone}`}>
                                        <Phone size={16} aria-hidden="true" />
                                        {t('Ligar', 'Call', 'Llamar')}
                                    </a>
                                )}
                                {orderUrl && (
                                    <a href={orderUrl} target="_blank" rel="noopener noreferrer">
                                        <ShoppingBag size={16} aria-hidden="true" />
                                        {selected.category === 'events' ||
                                        selected.category === 'attractions'
                                            ? t(
                                                  'Ver site / reservar',
                                                  'Website / booking',
                                                  'Ver sitio / reservar'
                                              )
                                            : t(
                                                  'Pedir / ver site',
                                                  'Order / website',
                                                  'Pedir / ver sitio'
                                              )}
                                        <ArrowUpRight size={15} aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        </div>
                        {selected.address && (
                            <div className="gd-explore-map">
                                <iframe
                                    key={placeKey(selected)}
                                    title={`${t('Localização de', 'Location of', 'Ubicación de')} ${title(selected)}`}
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(`${selected.name} ${selected.address}`)}&output=embed`}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    allowFullScreen
                                />
                                <p>
                                    {t(
                                        'Localização pelo endereço cadastrado.',
                                        'Location based on the listed address.',
                                        'Ubicación según la dirección registrada.'
                                    )}
                                </p>
                            </div>
                        )}
                    </article>
                    <span className="sr-only" aria-live="polite" aria-atomic="true">
                        {t('Detalhes de', 'Details for', 'Detalles de')} {title(selected)}
                    </span>
                </div>
            ) : (
                <div className="gd-explore-empty">
                    {favoritesOnly ? (
                        <Heart size={34} aria-hidden="true" />
                    ) : (
                        <Search size={34} aria-hidden="true" />
                    )}
                    <h2>
                        {query || category !== 'all'
                            ? t(
                                  'Nenhum lugar com esses filtros',
                                  'No places match these filters',
                                  'Ningún lugar con estos filtros'
                              )
                            : favoritesOnly
                              ? t(
                                    'Seus favoritos começam aqui',
                                    'Your favorites start here',
                                    'Tus favoritos empiezan aquí'
                                )
                              : t(
                                    'Nenhuma recomendação publicada',
                                    'No recommendations published',
                                    'No hay recomendaciones publicadas'
                                )}
                    </h2>
                    <p>
                        {query || category !== 'all'
                            ? t(
                                  'Tente outro termo ou veja todas as categorias.',
                                  'Try another search or browse all categories.',
                                  'Prueba otra búsqueda o consulta todas las categorías.'
                              )
                            : favoritesOnly
                              ? t(
                                    'Na seção Explorar, use o coração para guardar os lugares que gostar.',
                                    'In Explore, use the heart to save places you like.',
                                    'En Explorar, usa el corazón para guardar los lugares que te gusten.'
                                )
                              : t(
                                    'As recomendações publicadas pelo anfitrião aparecerão aqui.',
                                    'Recommendations shared by your host will appear here.',
                                    'Las recomendaciones publicadas por el anfitrión aparecerán aquí.'
                                )}
                    </p>
                    {(query || category !== 'all') && (
                        <button
                            type="button"
                            onClick={() => {
                                setQuery('');
                                setCategory('all');
                                resetPage();
                            }}
                        >
                            {t('Limpar filtros', 'Clear filters', 'Limpiar filtros')}
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};

export default DesktopExplore;
