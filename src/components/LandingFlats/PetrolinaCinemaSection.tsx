import React, { useEffect, useRef } from 'react';

interface CinemaPhoto {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const PETROLINA_PHOTOS: CinemaPhoto[] = [
    {
        src: '/assets/petrolina/01-ponte-entardecer.webp',
        alt: 'Pôr do sol dourado sob a Ponte Presidente Dutra e barcos no Rio São Francisco em Petrolina',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/02-catamara-sao-francisco.webp',
        alt: 'Embarcação navegando ao entardecer pelas águas do Rio São Francisco em Petrolina',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/03-catedral-petrolina.webp',
        alt: 'Catedral Sagrado Coração de Jesus refletida na fonte no Centro de Petrolina',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/04-ilha-rodeadouro.webp',
        alt: 'Águas tranquilas da Ilha do Rodeadouro no Rio São Francisco com deck e balanço à beira do rio',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/05-fruticultura-mangas.webp',
        alt: 'Colheita de mangas frescas da fruticultura irrigada do Vale do São Francisco',
        width: 640,
        height: 1137,
    },
    {
        src: '/assets/petrolina/06-vinhedo-vale.webp',
        alt: 'Cachos de uvas sob vinhedo ensolarado na rota do vinho do Vale do São Francisco',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/07-vinho-barricas.webp',
        alt: 'Taça de vinho tinto diante de barricas de carvalho das vinícolas de Petrolina',
        width: 640,
        height: 1137,
    },
];

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const clamp01 = (v: number) => clamp(v, 0, 1);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Editorial 7-frame vertical portrait cinema gallery bridging Hero (#12110F)
 * to FeaturesSection (#F5F2EB) via a scroll-scrubbed horizontal dolly,
 * dynamic depth-of-field scaling, internal lens parallax, and 3D curtain handoff.
 */
export const PetrolinaCinemaSection: React.FC = () => {
    const trackRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const exitScaleRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const veilRefs = useRef<(HTMLDivElement | null)[]>([]);
    const frameBorderRefs = useRef<(HTMLDivElement | null)[]>([]);
    const exitVeilRef = useRef<HTMLDivElement>(null);
    const progressWrapRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const track = trackRef.current;
        const stage = stageRef.current;
        const rail = railRef.current;
        if (!track || !stage || !rail) return;

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) return;

        let centers: number[] = [];
        let vpCenter = 0;
        let step = 360;
        let startTx = 0;
        let endTx = 0;
        let hasUpgradedLazy = false;
        let rafId = 0;

        const measure = () => {
            vpCenter = stage.clientWidth / 2;
            centers = cardRefs.current.map((el) =>
                el ? el.offsetLeft + el.offsetWidth / 2 : vpCenter
            );
            step = centers.length > 1 ? Math.max(Math.abs(centers[1] - centers[0]), 240) : 360;
            startTx = vpCenter - (centers[0] ?? vpCenter);
            endTx = vpCenter - (centers[centers.length - 1] ?? vpCenter);
        };

        const upgradeImages = () => {
            if (hasUpgradedLazy || window.scrollY <= 30) return;
            hasUpgradedLazy = true;
            imgRefs.current.forEach((img) => {
                if (img && img.loading === 'lazy') {
                    img.loading = 'eager';
                }
            });
        };

        const renderFrame = () => {
            rafId = 0;
            upgradeImages();

            const rect = track.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const scrollable = Math.max(track.offsetHeight - vh, 1);

            const entryRaw = clamp01((vh * 0.94 - rect.top) / (vh * 0.94));
            const entryP = easeOutCubic(entryRaw);
            const fanP = easeOutCubic(clamp01((entryRaw - 0.34) / 0.66));
            const pinP = clamp01(-rect.top / scrollable);

            // Curtain bevel flattens cleanly into edge-to-edge full bleed upon locking
            const bevel = rect.top > 0 ? Math.min(1, rect.top / (vh * 0.35)) : 0;
            const rPx = `${Math.round(bevel * 36)}px`;
            stage.style.borderTopLeftRadius = rPx;
            stage.style.borderTopRightRadius = rPx;
            track.style.borderTopLeftRadius = rPx;
            track.style.borderTopRightRadius = rPx;

            // Ease travel across the 7 vertical frames, locking the 7th portrait just as FeaturesSection rises
            const travelP = easeInOutSine(clamp01((pinP - 0.03) / 0.84));
            const tx = startTx + (endTx - startTx) * travelP;
            rail.style.transform = `translate3d(${tx.toFixed(2)}px, 0, 0)`;

            for (let i = 0; i < PETROLINA_PHOTOS.length; i++) {
                const card = cardRefs.current[i];
                const img = imgRefs.current[i];
                const veil = veilRefs.current[i];
                const border = frameBorderRefs.current[i];
                if (!card) continue;

                const cardScreenCenter = (centers[i] ?? vpCenter) + tx;
                const normDist = (cardScreenCenter - vpCenter) / step;
                const focus = clamp01(1 - Math.abs(normDist) * 0.68);
                const entryScale = i === 0 ? 0.78 + 0.22 * entryP : 0.88 + 0.12 * fanP;
                const cardScale = (0.86 + 0.14 * focus) * entryScale;
                const fanOffsetX = i === 0 ? 0 : -Math.min(i, 2) * 95 * (1 - fanP);
                const entryLiftY = i === 0 ? (1 - entryP) * 32 : (1 - fanP) * 24;

                card.style.transform = `translate3d(${fanOffsetX.toFixed(2)}px, ${entryLiftY.toFixed(2)}px, 0) scale3d(${cardScale.toFixed(4)}, ${cardScale.toFixed(4)}, 1)`;
                card.style.opacity =
                    i === 0 ? Math.min(1, 0.25 + entryP * 0.9).toFixed(3) : fanP.toFixed(3);

                if (i === 0) {
                    if (entryP < 0.998) {
                        const insetY = ((1 - entryP) * 26).toFixed(2);
                        const insetX = ((1 - entryP) * 34).toFixed(2);
                        card.style.clipPath = `inset(${insetY}% ${insetX}% round 26px)`;
                    } else {
                        card.style.clipPath = '';
                    }
                }

                if (img) {
                    const imgShift = clamp(normDist, -1.15, 1.15) * -6.5;
                    const shutterZoom = i === 0 ? (1 - entryP) * 0.16 : 0;
                    const imgScale = 1.12 - focus * 0.03 + shutterZoom;
                    img.style.transform = `translate3d(${imgShift.toFixed(3)}%, 0, 0) scale(${imgScale.toFixed(4)})`;
                }

                if (veil) {
                    veil.style.opacity = ((1 - focus) * 0.58).toFixed(3);
                }

                if (border) {
                    border.style.opacity = (0.14 + focus * 0.42).toFixed(3);
                }
            }

            if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${Math.max(0.06, travelP).toFixed(4)})`;
            }

            // Gentle 3D recede as FeaturesSection (#F5F2EB) rises directly over the final portrait
            const exitP = easeInOutSine(clamp01((pinP - 0.87) / 0.13));
            if (exitScaleRef.current) {
                const s = 1 - exitP * 0.045;
                const yShift = -exitP * 14;
                exitScaleRef.current.style.transform = `translate3d(0, ${yShift.toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
            }
            if (exitVeilRef.current) {
                exitVeilRef.current.style.opacity = (exitP * 0.52).toFixed(3);
            }
            if (progressWrapRef.current) {
                progressWrapRef.current.style.opacity = (1 - exitP).toFixed(3);
            }
            if (glowRef.current) {
                glowRef.current.style.opacity = (
                    (1 - exitP * 0.6) *
                    (0.15 + 0.85 * entryP)
                ).toFixed(3);
                glowRef.current.style.transform = `scale(${(0.5 + 0.65 * entryP).toFixed(3)})`;
            }
            if (headlineRef.current) {
                const headIn = easeOutCubic(clamp01((entryRaw - 0.25) / 0.72));
                const hOpacity = headIn * (1 - exitP * 0.35);
                const hLift = (1 - headIn) * 34;
                headlineRef.current.style.opacity = hOpacity.toFixed(3);
                headlineRef.current.style.transform = `translate3d(0, ${hLift.toFixed(2)}px, 0)`;
            }
        };

        const scheduleRender = () => {
            if (!rafId) {
                rafId = window.requestAnimationFrame(renderFrame);
            }
        };

        const handleResize = () => {
            measure();
            scheduleRender();
        };

        measure();
        renderFrame();

        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleResize) : null;
        if (ro) ro.observe(stage);

        window.addEventListener('scroll', scheduleRender, { passive: true });
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('scroll', scheduleRender);
            window.removeEventListener('resize', handleResize);
            ro?.disconnect();
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section
            ref={trackRef}
            aria-label="Retratos de Petrolina e do Vale do São Francisco"
            className="relative z-10 bg-[#12110F] rounded-t-[28px] md:rounded-t-[40px] border-t border-[#E5C98B]/20 h-[240vh] md:h-[275vh] motion-reduce:h-auto motion-reduce:py-16"
        >
            <div
                ref={stageRef}
                className="sticky top-0 h-[100dvh] motion-reduce:relative motion-reduce:h-auto w-full overflow-hidden rounded-t-[28px] md:rounded-t-[40px] flex flex-col items-center justify-center pt-20 sm:pt-24 pb-10 sm:pb-12 bg-[#12110F]"
            >
                {/* Ambient warm horizon glow behind center portrait */}
                <div
                    ref={glowRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_60%_at_50%_56%,rgba(229,201,139,0.14)_0%,transparent_70%)] motion-reduce:hidden"
                />

                <div
                    ref={exitScaleRef}
                    className="w-full flex flex-col items-center justify-center will-change-transform motion-reduce:!transform-none"
                >
                    {/* Editorial invitation above the 7-frame gallery */}
                    <div
                        ref={headlineRef}
                        className="relative z-10 shrink-0 px-6 mb-5 sm:mb-7 text-center max-w-2xl will-change-[opacity,transform] motion-reduce:!opacity-100 motion-reduce:!transform-none"
                    >
                        <div className="inline-flex items-center gap-3 mb-2">
                            <span className="w-5 sm:w-7 h-px bg-[#E5C98B]/55" aria-hidden="true" />
                            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#E5C98B]">
                                Petrolina · Vale do São Francisco
                            </span>
                            <span className="w-5 sm:w-7 h-px bg-[#E5C98B]/55" aria-hidden="true" />
                        </div>
                        <p className="text-xl sm:text-2xl md:text-[28px] font-semibold tracking-tight text-white leading-[1.2]">
                            Viva o Vale do Rio São Francisco.{' '}
                            <span className="text-[#E5C98B] font-normal block sm:inline">
                                Entre o rio dourado, o sol e as vinícolas.
                            </span>
                        </p>
                    </div>

                    {/* 7-frame horizontal dolly rail */}
                    <div className="w-full overflow-hidden motion-reduce:overflow-x-auto motion-reduce:px-6">
                        <div
                            ref={railRef}
                            className="relative flex items-center gap-5 sm:gap-8 md:gap-10 w-max will-change-transform motion-reduce:!transform-none"
                        >
                            {PETROLINA_PHOTOS.map((photo, idx) => (
                                <div
                                    key={photo.src}
                                    ref={(el) => {
                                        cardRefs.current[idx] = el;
                                    }}
                                    className="relative shrink-0 h-[46dvh] sm:h-[50dvh] md:h-[54dvh] max-h-[500px] aspect-[3/4] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#181613] shadow-[0_30px_70px_rgba(0,0,0,0.65)] will-change-transform motion-reduce:!transform-none"
                                >
                                    <img
                                        ref={(el) => {
                                            imgRefs.current[idx] = el;
                                        }}
                                        src={photo.src}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        loading={idx === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                        fetchPriority="low"
                                        className="w-full h-full object-cover object-center will-change-transform select-none motion-reduce:!transform-none"
                                    />

                                    {/* Edge depth darkening for peripheral frames */}
                                    <div
                                        ref={(el) => {
                                            veilRefs.current[idx] = el;
                                        }}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 bg-[#12110F] transition-none motion-reduce:hidden"
                                        style={{ opacity: idx === 0 ? 0 : 0.45 }}
                                    />

                                    {/* Subtle champagne architectural hairline */}
                                    <div
                                        ref={(el) => {
                                            frameBorderRefs.current[idx] = el;
                                        }}
                                        aria-hidden="true"
                                        className="pointer-events-none absolute inset-0 rounded-[22px] sm:rounded-[26px] border border-[#E5C98B]"
                                        style={{ opacity: idx === 0 ? 0.45 : 0.16 }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Silent champagne hairline progress bar (no captions) */}
                <div
                    ref={progressWrapRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-[2px] rounded-full bg-white/15 overflow-hidden motion-reduce:hidden"
                >
                    <div
                        ref={progressFillRef}
                        className="w-full h-full bg-[#E5C98B] origin-left will-change-transform"
                        style={{ transform: 'scaleX(0.06)' }}
                    />
                </div>

                {/* Soft theater dim as FeaturesSection rises over the final portrait */}
                <div
                    ref={exitVeilRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 bg-[#0B0A09] motion-reduce:hidden"
                    style={{ opacity: 0 }}
                />
            </div>
        </section>
    );
};
