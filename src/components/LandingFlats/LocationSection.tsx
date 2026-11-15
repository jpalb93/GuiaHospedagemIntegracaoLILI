import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Navigation, MapPin, Car, Footprints, LocateFixed } from 'lucide-react';
import {
    RADAR_SPOTS,
    SPOT_CATEGORIES,
    type SpotCategory,
    type TravelMode,
} from './locationRoutesData';

const InteractiveRouteMap = React.lazy(() => import('./InteractiveRouteMap'));

const getSpotsForCategory = (category: SpotCategory) =>
    category === 'destaques'
        ? RADAR_SPOTS.filter((spot) => spot.featured)
        : RADAR_SPOTS.filter((spot) => spot.category === category);

const LocationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const mapBlockRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = useState<SpotCategory>('destaques');
    const [selectedSpotId, setSelectedSpotId] = useState<string>(RADAR_SPOTS[0].id);
    const [travelMode, setTravelMode] = useState<TravelMode>('driving');
    const [recenterNonce, setRecenterNonce] = useState(0);
    const [shouldMountMap, setShouldMountMap] = useState(false);

    const visibleSpots = getSpotsForCategory(activeCategory);
    const activeSpot =
        visibleSpots.find((s) => s.id === selectedSpotId) ??
        RADAR_SPOTS.find((s) => s.id === selectedSpotId) ??
        visibleSpots[0] ??
        RADAR_SPOTS[0];
    const activeVariant = activeSpot[travelMode];
    const maxMinutes = Math.max(...visibleSpots.map((spot) => spot[travelMode].minutes), 1);

    const handleCategoryChange = (category: SpotCategory) => {
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
        if (typeof window === 'undefined' || shouldMountMap) return;
        const target = sectionRef.current ?? mapBlockRef.current;
        if (!target || typeof IntersectionObserver === 'undefined') {
            setShouldMountMap(true);
            return;
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

    useEffect(() => {
        let ctx: { revert: () => void } | undefined;
        let mm: { add: (query: string, func: () => void) => void; revert: () => void } | undefined;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
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
                }, sectionRef);
            });
        };

        const timer = setTimeout(() => {
            initGsap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

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
                                />
                            </Suspense>
                        ) : (
                            <div className="w-full h-full min-h-[440px] lg:min-h-[600px] flex items-center justify-center bg-[#EAE4D7] text-[#5C564E] text-sm font-medium">
                                Mapa interativo de Petrolina
                            </div>
                        )}

                        {/* Pílula Superior: Modo + Distância + Recentrar */}
                        <div className="pointer-events-none absolute top-3.5 left-3.5 right-14 z-[1100] flex flex-wrap items-center gap-2">
                            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#141210]/90 backdrop-blur-md text-white border border-white/15 px-3.5 py-2 text-xs shadow-lg">
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
                                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F3]/95 hover:bg-white text-[#181614] border border-[#DFD8CA] px-3 py-2 text-xs font-medium shadow-md transition-colors"
                            >
                                <LocateFixed size={13} className="text-[#9E6B2B]" aria-hidden />
                                <span className="hidden sm:inline">Enquadrar rota</span>
                            </button>
                        </div>

                        {/* Painel Flutuante de Rota Direta até o Ponto Selecionado */}
                        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-lg z-[1100] bg-[#141210]/95 backdrop-blur-xl text-white border border-[#E5C98B]/30 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </section>
    );
};

export default LocationSection;
