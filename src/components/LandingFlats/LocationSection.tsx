import React, { useRef, useEffect, useState, useCallback, useId, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { Navigation, MapPin, Car, Footprints, LocateFixed, Maximize2, X } from 'lucide-react';
import {
    RADAR_SPOTS,
    SPOT_CATEGORIES,
    type SpotCategory,
    type TravelMode,
} from './locationRoutesData';
import { useDesktopGsap } from '../../hooks/useDesktopGsap';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

const InteractiveRouteMap = React.lazy(() => import('./InteractiveRouteMap'));

const getSpotsForCategory = (category: SpotCategory) =>
    category === 'destaques'
        ? RADAR_SPOTS.filter((spot) => spot.featured)
        : RADAR_SPOTS.filter((spot) => spot.category === category);

const LocationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const mapBlockRef = useRef<HTMLDivElement>(null);
    const expandedDialogRef = useRef<HTMLDivElement>(null);
    const expandedTitleId = useId();
    const [activeCategory, setActiveCategory] = useState<SpotCategory>('destaques');
    const [selectedSpotId, setSelectedSpotId] = useState<string>(RADAR_SPOTS[0].id);
    const [travelMode, setTravelMode] = useState<TravelMode>('driving');
    const [recenterNonce, setRecenterNonce] = useState(0);
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [showAllInExpanded, setShowAllInExpanded] = useState(false);
    const [showMapTouchHint, setShowMapTouchHint] = useState(false);
    const hintTimerRef = useRef<number>(0);
    const [shouldMountMap, setShouldMountMap] = useState(
        () => typeof window !== 'undefined' && typeof IntersectionObserver === 'undefined'
    );

    const handleLockedTouchAttempt = useCallback(() => {
        setShowMapTouchHint(true);
        window.clearTimeout(hintTimerRef.current);
        hintTimerRef.current = window.setTimeout(() => {
            setShowMapTouchHint(false);
        }, 2400);
    }, []);

    useEffect(() => {
        return () => window.clearTimeout(hintTimerRef.current);
    }, []);

    useDialogAccessibility({
        isOpen: isMapExpanded,
        dialogRef: expandedDialogRef,
        onClose: () => setIsMapExpanded(false),
    });

    const visibleSpots = getSpotsForCategory(activeCategory);
    const expandedSpots = showAllInExpanded ? RADAR_SPOTS : visibleSpots;
    const activeSpot =
        visibleSpots.find((s) => s.id === selectedSpotId) ??
        RADAR_SPOTS.find((s) => s.id === selectedSpotId) ??
        visibleSpots[0] ??
        RADAR_SPOTS[0];
    const activeVariant = activeSpot[travelMode];
    const maxMinutes = Math.max(...visibleSpots.map((spot) => spot[travelMode].minutes), 1);

    const handleCategoryChange = (category: SpotCategory) => {
        setShowAllInExpanded(false);
        setActiveCategory(category);
        const nextSpots = getSpotsForCategory(category);
        if (nextSpots.length > 0 && !nextSpots.some((spot) => spot.id === selectedSpotId)) {
            setSelectedSpotId(nextSpots[0].id);
        }
    };

    const originEncoded = encodeURIComponent(
        'R. São José, 475 B - Centro, Petrolina - PE, 56302-270'
    );
    const routeUrl = `https://www.google.com/maps/dir/?api=1&origin=${originEncoded}&destination=${activeSpot.routeQuery}&travelmode=${travelMode}`;

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            shouldMountMap ||
            typeof IntersectionObserver === 'undefined'
        ) {
            return;
        }
        const target = sectionRef.current ?? mapBlockRef.current;
        if (!target) {
            const rafId = window.requestAnimationFrame(() => setShouldMountMap(true));
            return () => window.cancelAnimationFrame(rafId);
        }
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setShouldMountMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '500px 0px' }
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [shouldMountMap]);

    useDesktopGsap(sectionRef, (gsap) => {
        gsap.from([textBlockRef.current, mapBlockRef.current], {
            y: 16,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 92%',
                toggleActions: 'play none none none',
            },
        });
    });

    return (
        <section
            ref={sectionRef}
            id="localizacao"
            className="py-20 md:py-28 bg-[#F5F2EB] text-[#181614] relative"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-12">
                {/* Header unificado */}
                <div
                    id="localizacao-radar"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end border-b border-[#E5E0D5] pb-10"
                >
                    <div className="lg:col-span-7 space-y-3">
                        <p className="text-[#9E6B2B] font-semibold tracking-[0.18em] uppercase text-xs">
                            Localização · Radar de Distâncias
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-heading font-semibold text-[#181614] leading-[1.08] tracking-tight">
                            Localização Estratégica em Petrolina
                        </h2>
                    </div>
                    <div className="lg:col-span-5">
                        <p className="text-[#5C564E] text-base md:text-lg font-normal leading-relaxed">
                            Explore {RADAR_SPOTS.length} pontos estratégicos de Petrolina por
                            categoria e calcule a rota por rua a partir do flat no Centro.
                        </p>
                    </div>
                </div>

                {/* Split: Endereço + Radar Interativo | Mapa com Card de Rota */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    <div
                        ref={textBlockRef}
                        className="lg:col-span-5 flex flex-col justify-between gap-6"
                    >
                        {/* Bloco de Endereço */}
                        <div className="relative overflow-hidden bg-[#FAF8F3] border border-[#DFD8CA] rounded-[28px] p-7 md:p-8 space-y-5 shadow-[0_12px_36px_rgba(24,22,20,0.05)]">
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9E6B2B]/45 to-transparent"
                            />
                            <h3 className="text-2xl font-heading font-semibold text-[#181614] leading-tight tracking-tight">
                                Hospedagem no Centro de Petrolina
                            </h3>
                            <div className="space-y-3 pt-1 border-t border-[#E5DEC9]">
                                <p className="text-[#181614] font-medium leading-relaxed text-base pt-2">
                                    R. São José, 475 B
                                    <br />
                                    <span className="text-[#5C564E] font-normal">
                                        Centro · Petrolina - PE · 56302-270
                                    </span>
                                </p>
                                <p className="text-[#5C564E] font-normal text-sm leading-relaxed">
                                    Perto de hospitais, comércio e polos de trabalho. Menos tempo no
                                    trânsito, mais na estadia.
                                </p>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/sdcm2s9nYXXbew796"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 bg-[#141210] hover:bg-[#2a2622] text-white font-medium text-xs uppercase tracking-[0.14em] px-5 py-3 rounded-full transition-colors group w-fit"
                            >
                                Abrir no Maps
                                <Navigation
                                    size={14}
                                    className="text-[#E5C98B] group-hover:translate-x-0.5 transition-transform"
                                    aria-hidden
                                />
                            </a>
                        </div>

                        {/* Filtro por Categoria (16 pontos auditados em Petrolina) */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#5C564E] font-semibold">
                                    Categorias · {RADAR_SPOTS.length} lugares
                                </span>
                                <span className="text-[11px] font-mono text-[#767067]">
                                    {visibleSpots.length}{' '}
                                    {visibleSpots.length === 1 ? 'local' : 'locais'}
                                </span>
                            </div>
                            <div
                                className="flex flex-wrap gap-1.5"
                                role="tablist"
                                aria-label="Filtrar lugares por categoria"
                            >
                                {SPOT_CATEGORIES.map((category) => {
                                    const isActive = activeCategory === category.id;
                                    const count = getSpotsForCategory(category.id).length;
                                    return (
                                        <button
                                            key={category.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={isActive}
                                            onClick={() => handleCategoryChange(category.id)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
                                                isActive
                                                    ? 'bg-[#141210] text-[#E5C98B] border-[#141210] shadow-xs'
                                                    : 'bg-[#FAF8F3] text-[#4E4942] border-[#E6E0D5] hover:border-[#D4AF37]/60 hover:text-[#141210]'
                                            }`}
                                        >
                                            <span>{category.label}</span>
                                            <span
                                                className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                                                    isActive
                                                        ? 'bg-[#2C2721] text-[#E5C98B]'
                                                        : 'bg-[#EFECE4] text-[#6B655D]'
                                                }`}
                                            >
                                                {count}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controle de Modo de Trajeto + Lista Radar Interativa */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#5C564E] font-semibold whitespace-nowrap">
                                    Trajeto por rua
                                </span>
                                <div
                                    role="group"
                                    aria-label="Modo de deslocamento"
                                    className="inline-flex shrink-0 items-center p-1 rounded-full bg-[#FAF8F3] border border-[#DFD8CA]"
                                >
                                    <button
                                        type="button"
                                        aria-pressed={travelMode === 'driving'}
                                        onClick={() => setTravelMode('driving')}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                                            travelMode === 'driving'
                                                ? 'bg-[#141210] text-[#E5C98B] shadow-sm'
                                                : 'text-[#5C564E] hover:text-[#181614]'
                                        }`}
                                    >
                                        <Car size={13} aria-hidden="true" />
                                        <span>De carro</span>
                                    </button>
                                    <button
                                        type="button"
                                        aria-pressed={travelMode === 'walking'}
                                        onClick={() => setTravelMode('walking')}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all touch-manipulation ${
                                            travelMode === 'walking'
                                                ? 'bg-[#141210] text-[#E5C98B] shadow-sm'
                                                : 'text-[#5C564E] hover:text-[#181614]'
                                        }`}
                                    >
                                        <Footprints size={13} aria-hidden="true" />
                                        <span>A pé</span>
                                    </button>
                                </div>
                            </div>

                            <div
                                className="space-y-2.5"
                                role="listbox"
                                aria-label="Pontos estratégicos próximos ao flat"
                            >
                                {visibleSpots.map((spot) => {
                                    const selected = spot.id === selectedSpotId;
                                    const variant = spot[travelMode];
                                    const barPct = Math.max(
                                        14,
                                        Math.round((variant.minutes / maxMinutes) * 100)
                                    );
                                    return (
                                        <button
                                            key={spot.id}
                                            type="button"
                                            role="option"
                                            aria-selected={selected}
                                            onClick={() => setSelectedSpotId(spot.id)}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                                                selected
                                                    ? 'bg-[#141210] border-[#141210] text-white shadow-lg'
                                                    : 'bg-[#FAF8F3] border-[#DFD8CA] hover:border-[#9E6B2B]/50 text-[#181614]'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 min-w-0">
                                                    <h4 className="font-heading font-semibold text-base leading-snug">
                                                        {spot.destination}
                                                    </h4>
                                                    <p
                                                        className={`text-xs md:text-sm leading-relaxed ${
                                                            selected
                                                                ? 'text-stone-300'
                                                                : 'text-[#5C564E]'
                                                        }`}
                                                    >
                                                        {spot.desc}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 flex flex-col items-end gap-1">
                                                    <span
                                                        className={`text-xs font-mono font-semibold px-3 py-1 rounded-full tabular-nums ${
                                                            selected
                                                                ? 'bg-[#E5C98B] text-[#141210]'
                                                                : 'bg-[#141210] text-[#E5C98B]'
                                                        }`}
                                                    >
                                                        {variant.timeLabel}
                                                    </span>
                                                    <span
                                                        className={`text-[11px] font-mono tabular-nums ${
                                                            selected
                                                                ? 'text-stone-300'
                                                                : 'text-[#5C564E]'
                                                        }`}
                                                    >
                                                        {variant.kmLabel}
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`mt-3 h-1 rounded-full overflow-hidden ${
                                                    selected ? 'bg-white/10' : 'bg-[#E5DEC9]'
                                                }`}
                                                aria-hidden="true"
                                            >
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-[#9E6B2B] to-[#E5C98B] transition-all duration-500"
                                                    style={{ width: `${barPct}%` }}
                                                />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div
                        ref={mapBlockRef}
                        className="lg:col-span-7 relative isolate min-h-[440px] lg:min-h-[600px] rounded-[28px] overflow-hidden border border-[#DFD8CA] shadow-[0_20px_50px_rgba(24,22,20,0.08)] bg-[#EAE4D7]"
                    >
                        {shouldMountMap ? (
                            <Suspense
                                fallback={
                                    <div className="w-full h-full min-h-[440px] lg:min-h-[600px] flex items-center justify-center bg-[#EAE4D7] text-[#5C564E] text-sm font-medium">
                                        Carregando mapa e traçado da rota...
                                    </div>
                                }
                            >
                                <InteractiveRouteMap
                                    visibleSpots={visibleSpots}
                                    selectedSpotId={selectedSpotId}
                                    travelMode={travelMode}
                                    recenterNonce={recenterNonce}
                                    onSelectSpot={setSelectedSpotId}
                                    interactionMode="inline"
                                    onLockedTouchAttempt={handleLockedTouchAttempt}
                                />
                            </Suspense>
                        ) : (
                            <div className="w-full h-full min-h-[440px] lg:min-h-[600px] flex items-center justify-center bg-[#EAE4D7] text-[#5C564E] text-sm font-medium">
                                Mapa interativo de Petrolina
                            </div>
                        )}

                        {/* Dica breve e não bloqueante caso tentem arrastar horizontalmente com 1 dedo no mapa inline */}
                        {showMapTouchHint && (
                            <div
                                role="status"
                                aria-live="polite"
                                className="pointer-events-none lg:hidden absolute inset-x-6 top-1/2 -translate-y-1/2 z-[1150] flex justify-center animate-fadeIn"
                            >
                                <span className="rounded-full bg-[#141210]/95 text-white border border-[#E5C98B]/40 px-4 py-2 text-xs font-medium shadow-xl text-center">
                                    Use <strong className="text-[#E5C98B]">2 dedos</strong> para
                                    mover ou toque em{' '}
                                    <strong className="text-[#E5C98B]">Expandir</strong>
                                </span>
                            </div>
                        )}

                        {/* Pílula Superior: Modo + Distância + Recentrar + Expandir em tela cheia */}
                        <div className="pointer-events-none absolute top-3.5 left-3.5 right-16 z-[1100] flex flex-wrap items-center gap-2">
                            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#141210]/95 lg:bg-[#141210]/90 lg:backdrop-blur-md text-white border border-white/15 px-3.5 py-2 text-xs shadow-lg min-h-[44px] lg:min-h-0">
                                <span className="w-2 h-2 rounded-full bg-[#E5C98B] animate-pulse" />
                                <span className="font-mono uppercase tracking-[0.14em] text-[#E5C98B]">
                                    {travelMode === 'driving' ? 'De carro' : 'A pé'}
                                </span>
                                <span className="text-stone-400">·</span>
                                <span className="font-semibold tabular-nums">
                                    {activeVariant.kmLabel}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => setRecenterNonce((n) => n + 1)}
                                title="Recentrar rota no mapa"
                                aria-label="Enquadrar rota no mapa"
                                className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FAF8F3]/95 hover:bg-white text-[#181614] border border-[#DFD8CA] px-3 py-2 text-xs font-medium shadow-md transition-colors min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0"
                            >
                                <LocateFixed size={14} className="text-[#9E6B2B]" aria-hidden />
                                <span className="hidden sm:inline">Enquadrar rota</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowMapTouchHint(false);
                                    setIsMapExpanded(true);
                                }}
                                title="Expandir mapa em tela cheia"
                                aria-label="Expandir mapa em tela cheia"
                                className="pointer-events-auto inline-flex items-center justify-center gap-1.5 rounded-full bg-[#141210] hover:bg-[#24201C] text-white border border-[#E5C98B]/60 px-3.5 py-2 text-xs font-semibold shadow-lg transition-colors min-w-[44px] min-h-[44px] lg:min-w-0 lg:min-h-0"
                            >
                                <Maximize2 size={13} className="text-[#E5C98B]" aria-hidden />
                                <span>Expandir</span>
                            </button>
                        </div>

                        {/* Painel Flutuante de Rota Direta até o Ponto Selecionado */}
                        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg z-[1100] bg-[#141210] lg:bg-[#141210]/95 lg:backdrop-blur-xl text-white border border-[#E5C98B]/30 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#E5C98B]">
                                    <MapPin size={12} aria-hidden="true" />
                                    <span>
                                        Trajeto real · {activeVariant.kmLabel} ·{' '}
                                        {activeVariant.timeLabel}
                                    </span>
                                </div>
                                <p className="font-heading font-semibold text-sm sm:text-base leading-snug">
                                    {activeSpot.destination}
                                </p>
                            </div>
                            <a
                                href={routeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-4 py-2.5 text-xs font-semibold transition-colors"
                            >
                                <span>Ver no GPS</span>
                                <Navigation size={13} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {isMapExpanded &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={expandedDialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={expandedTitleId}
                        tabIndex={-1}
                        className="fixed inset-0 z-[200] flex flex-col bg-[#12110F] text-white outline-none animate-fadeIn h-[100dvh]"
                    >
                        {/* Barra superior do mapa expandido */}
                        <header className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#141210] border-b border-white/10">
                            <div className="min-w-0 flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-[#E5C98B] shrink-0" />
                                <div className="min-w-0">
                                    <h3
                                        id={expandedTitleId}
                                        className="font-heading font-semibold text-sm sm:text-base text-white truncate"
                                    >
                                        Mapa de Rotas · Flats Integração
                                    </h3>
                                    <p className="hidden sm:block text-xs text-stone-400 truncate">
                                        {activeSpot.destination} · {activeVariant.kmLabel} ·{' '}
                                        {activeVariant.timeLabel}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div
                                    role="group"
                                    aria-label="Modo de deslocamento"
                                    className="inline-flex items-center rounded-full bg-[#1C1A17] border border-white/10 p-1"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setTravelMode('driving')}
                                        aria-pressed={travelMode === 'driving'}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                                            travelMode === 'driving'
                                                ? 'bg-[#E5C98B] text-[#141210] font-semibold'
                                                : 'text-stone-300 hover:text-white'
                                        }`}
                                    >
                                        <Car size={13} aria-hidden />
                                        <span className="hidden sm:inline">De carro</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTravelMode('walking')}
                                        aria-pressed={travelMode === 'walking'}
                                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                                            travelMode === 'walking'
                                                ? 'bg-[#E5C98B] text-[#141210] font-semibold'
                                                : 'text-stone-300 hover:text-white'
                                        }`}
                                    >
                                        <Footprints size={13} aria-hidden />
                                        <span className="hidden sm:inline">A pé</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setRecenterNonce((n) => n + 1)}
                                    title="Enquadrar rota no mapa"
                                    aria-label="Enquadrar rota no mapa"
                                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1C1A17] hover:bg-[#27241F] text-white border border-white/15 px-3 py-2 text-xs font-medium transition-colors min-w-[44px] min-h-[44px]"
                                >
                                    <LocateFixed size={14} className="text-[#E5C98B]" aria-hidden />
                                    <span className="hidden md:inline">Enquadrar</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsMapExpanded(false)}
                                    aria-label="Fechar mapa expandido"
                                    className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
                                >
                                    <X size={20} aria-hidden />
                                </button>
                            </div>
                        </header>

                        {/* Filtro de Categorias + Todos os pontos */}
                        <div
                            role="tablist"
                            aria-label="Filtrar categorias no mapa expandido"
                            className="shrink-0 flex items-center gap-1.5 overflow-x-auto px-4 sm:px-6 py-2.5 bg-[#171512] border-b border-white/10 no-scrollbar"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={showAllInExpanded}
                                onClick={() => setShowAllInExpanded(true)}
                                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors min-h-[36px] ${
                                    showAllInExpanded
                                        ? 'bg-[#E5C98B] text-[#141210] border-[#E5C98B] font-semibold'
                                        : 'bg-[#1F1C18] hover:bg-[#2A2621] text-stone-200 border-white/10'
                                }`}
                            >
                                <span>Todos</span>
                                <span
                                    className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full ${
                                        showAllInExpanded
                                            ? 'bg-[#141210]/15 text-[#141210]'
                                            : 'bg-white/10 text-stone-300'
                                    }`}
                                >
                                    {RADAR_SPOTS.length}
                                </span>
                            </button>

                            {SPOT_CATEGORIES.map((category) => {
                                const isActive =
                                    !showAllInExpanded && activeCategory === category.id;
                                const count = getSpotsForCategory(category.id).length;
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => handleCategoryChange(category.id)}
                                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors min-h-[36px] ${
                                            isActive
                                                ? 'bg-[#E5C98B] text-[#141210] border-[#E5C98B] font-semibold'
                                                : 'bg-[#1F1C18] hover:bg-[#2A2621] text-stone-200 border-white/10'
                                        }`}
                                    >
                                        <span>{category.label}</span>
                                        <span
                                            className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded-full ${
                                                isActive
                                                    ? 'bg-[#141210]/15 text-[#141210]'
                                                    : 'bg-white/10 text-stone-300'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Área principal do mapa em tela cheia */}
                        <div className="relative flex-1 min-h-0 bg-[#EAE4D7]">
                            <Suspense
                                fallback={
                                    <div className="w-full h-full flex items-center justify-center bg-[#EAE4D7] text-[#5C564E] text-sm font-medium">
                                        Carregando mapa expandido...
                                    </div>
                                }
                            >
                                <InteractiveRouteMap
                                    visibleSpots={expandedSpots}
                                    selectedSpotId={selectedSpotId}
                                    travelMode={travelMode}
                                    recenterNonce={recenterNonce}
                                    onSelectSpot={setSelectedSpotId}
                                    interactionMode="fullscreen"
                                />
                            </Suspense>

                            {/* Barra inferior flutuante: Pílulas de destinos + Resumo da rota + GPS */}
                            <div className="pointer-events-none absolute inset-x-3 sm:inset-x-5 bottom-3 sm:bottom-5 z-[1100] flex flex-col gap-2.5 max-w-5xl mx-auto">
                                <div
                                    role="tablist"
                                    aria-label="Selecionar destino no mapa"
                                    className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar"
                                >
                                    {expandedSpots.map((spot) => {
                                        const isSelected = spot.id === selectedSpotId;
                                        return (
                                            <button
                                                key={spot.id}
                                                type="button"
                                                role="tab"
                                                aria-selected={isSelected}
                                                onClick={() => setSelectedSpotId(spot.id)}
                                                className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium border transition-colors min-h-[40px] shadow-md ${
                                                    isSelected
                                                        ? 'bg-[#E5C98B] text-[#141210] border-[#E5C98B] font-semibold'
                                                        : 'bg-[#141210]/95 hover:bg-[#1E1B18] text-stone-200 border-white/15'
                                                }`}
                                            >
                                                <span>{spot.shortLabel}</span>
                                                <span
                                                    className={`text-[10px] font-mono tabular-nums ${
                                                        isSelected
                                                            ? 'text-[#141210]/80'
                                                            : 'text-[#E5C98B]'
                                                    }`}
                                                >
                                                    {spot[travelMode].timeLabel}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="pointer-events-auto bg-[#141210] lg:bg-[#141210]/95 lg:backdrop-blur-xl text-white border border-[#E5C98B]/30 rounded-2xl p-3.5 sm:p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.16em] text-[#E5C98B]">
                                            <MapPin size={12} aria-hidden />
                                            <span>
                                                {travelMode === 'driving' ? 'De carro' : 'A pé'} ·{' '}
                                                {activeVariant.kmLabel} · {activeVariant.timeLabel}
                                            </span>
                                        </div>
                                        <p className="font-heading font-semibold text-sm sm:text-base leading-snug truncate">
                                            {activeSpot.destination}
                                        </p>
                                        <p className="hidden sm:block text-xs text-stone-400 truncate">
                                            {activeSpot.desc}
                                        </p>
                                    </div>
                                    <a
                                        href={routeUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-4 py-2.5 text-xs font-semibold transition-colors min-h-[44px]"
                                    >
                                        <span>Ver no GPS</span>
                                        <Navigation size={13} aria-hidden />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
};

export default LocationSection;
