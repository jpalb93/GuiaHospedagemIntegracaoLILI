import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Expand, MapPin, X } from 'lucide-react';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

interface CinemaPhoto {
    src: string;
    thumbSrc: string;
    alt: string;
    title: string;
    location: string;
    caption: string;
    width: number;
    height: number;
}

const PETROLINA_PHOTOS: CinemaPhoto[] = [
    {
        src: '/assets/petrolina/01-ponte-entardecer.webp',
        thumbSrc: '/assets/petrolina/01-ponte-entardecer-320.webp',
        alt: 'Pôr do sol dourado sob a Ponte Presidente Dutra e barcos no Rio São Francisco em Petrolina',
        title: 'Entardecer no Velho Chico',
        location: 'Ponte Presidente Dutra · Petrolina',
        caption:
            'Luz dourada refletida nas águas calmas do Rio São Francisco a poucos minutos do Centro.',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/02-catamara-sao-francisco.webp',
        thumbSrc: '/assets/petrolina/02-catamara-sao-francisco-320.webp',
        alt: 'Embarcação navegando ao entardecer pelas águas do Rio São Francisco em Petrolina',
        title: 'Passeios pelo São Francisco',
        location: 'Orla Fluvial · Petrolina',
        caption:
            'Rotas de catamarã e barquinha entre praias de rio, ilhas e cenários do pôr do sol.',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/04-ilha-rodeadouro.webp',
        thumbSrc: '/assets/petrolina/04-ilha-rodeadouro-320.webp',
        alt: 'Águas tranquilas da Ilha do Rodeadouro no Rio São Francisco com deck e balanço à beira do rio',
        title: 'Ilha do Rodeadouro',
        location: 'Rio São Francisco · Petrolina',
        caption:
            'Águas limpas para banho de rio, quiosques ribeirinhos e descanso sob o sol sertanejo.',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/03-catedral-petrolina.webp',
        thumbSrc: '/assets/petrolina/03-catedral-petrolina-320.webp',
        alt: 'Catedral Sagrado Coração de Jesus refletida na fonte no Centro de Petrolina',
        title: 'Catedral Sagrado Coração de Jesus',
        location: 'Centro Histórico · Petrolina',
        caption:
            'Ícone arquitetônico no coração da cidade, cercado por praças arborizadas e cafés.',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/05-fruticultura-mangas.webp',
        thumbSrc: '/assets/petrolina/05-fruticultura-mangas-320.webp',
        alt: 'Colheita de mangas frescas da fruticultura irrigada do Vale do São Francisco',
        title: 'Fruticultura Irrigada do Vale',
        location: 'Polo Agrícola · Petrolina',
        caption:
            'Reconhecida internacionalmente pela produção de mangas e frutas tropicais sob sol pleno.',
        width: 640,
        height: 1137,
    },
    {
        src: '/assets/petrolina/06-vinhedo-vale.webp',
        thumbSrc: '/assets/petrolina/06-vinhedo-vale-320.webp',
        alt: 'Cachos de uvas sob vinhedo ensolarado na rota do vinho do Vale do São Francisco',
        title: 'Vinhedos do Sertão',
        location: 'Rota do Vinho · Vale do São Francisco',
        caption:
            'Única região do mundo a produzir uvas finas o ano inteiro em clima semiárido tropical.',
        width: 640,
        height: 853,
    },
    {
        src: '/assets/petrolina/07-vinho-barricas.webp',
        thumbSrc: '/assets/petrolina/07-vinho-barricas-320.webp',
        alt: 'Taça de vinho tinto diante de barricas de carvalho das vinícolas de Petrolina',
        title: 'Enoturismo Premiado',
        location: 'Vinícolas do Vale · Petrolina',
        caption:
            'Visitas guiadas, barricas e degustações ao entardecer que consagram o Vale como destino.',
        width: 640,
        height: 1137,
    },
];

// Symmetrical architectural blade heights tapering outward from the centerpiece (idx 3) on desktop
const DESKTOP_RIBBON_HEIGHTS = [
    'lg:h-[320px] xl:h-[360px]',
    'lg:h-[360px] xl:h-[405px]',
    'lg:h-[395px] xl:h-[440px]',
    'lg:h-[430px] xl:h-[475px]',
    'lg:h-[395px] xl:h-[440px]',
    'lg:h-[360px] xl:h-[405px]',
    'lg:h-[320px] xl:h-[360px]',
];

// Subtle alternating parallax speeds so columns breathe independently during normal scroll on desktop
const PARALLAX_FACTORS = [-18, 12, -10, 16, -10, 12, -18];

const clamp = (v: number, min: number, max: number) => (v < min ? min : v > max ? max : v);
const clamp01 = (v: number) => clamp(v, 0, 1);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Vitrine editorial em 7 lâminas conectando o Hero (#12110F) à FeaturesSection (#F5F2EB).
 * - Desktop (>= 1024px): palco sticky com abertura tipo obturador, paralaxe alternada e véu de saída.
 * - Mobile (< 1024px): fluxo normal (zero scroll-trap sticky/dwell) e revelação única por IntersectionObserver.
 */
export const PetrolinaCinemaSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);
    const bladeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const glowRef = useRef<HTMLDivElement>(null);
    const crestGlowRef = useRef<HTMLDivElement>(null);
    const crestLineRef = useRef<HTMLDivElement>(null);
    const headlineRef = useRef<HTMLDivElement>(null);
    const exitVeilRef = useRef<HTMLDivElement>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const touchStartXRef = useRef<number | null>(null);
    const lightboxTitleId = useId();

    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const [loadedBlades, setLoadedBlades] = useState<Record<number, boolean>>({});
    const [retryCounts, setRetryCounts] = useState<Record<number, number>>({});
    const [isMobileRevealed, setIsMobileRevealed] = useState(
        () =>
            typeof window !== 'undefined' &&
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    const retryAttemptsRef = useRef<Record<number, number>>({});
    const retryTimersRef = useRef<Record<number, number>>({});

    const markBladeLoaded = useCallback((idx: number, img?: HTMLImageElement | null) => {
        if (img && typeof img.decode === 'function') {
            img.decode().catch(() => {});
        }
        setLoadedBlades((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
    }, []);

    const handleImageError = useCallback((idx: number) => {
        const current = retryAttemptsRef.current[idx] ?? 0;
        if (current >= 3) return;
        const nextAttempt = current + 1;
        retryAttemptsRef.current[idx] = nextAttempt;
        window.clearTimeout(retryTimersRef.current[idx]);
        retryTimersRef.current[idx] = window.setTimeout(() => {
            setRetryCounts((state) => ({ ...state, [idx]: nextAttempt }));
        }, 350 * nextAttempt);
    }, []);

    // Dispara eager loading apenas quando a seção se aproxima (500px), sem inundar o decode inicial
    useEffect(() => {
        const syncExistingImages = () => {
            imgRefs.current.forEach((img, idx) => {
                if (!img) return;
                if (img.loading === 'lazy') {
                    img.loading = 'eager';
                }
                if (!img.complete) return;
                if (img.naturalWidth > 0) {
                    markBladeLoaded(idx, img);
                } else {
                    handleImageError(idx);
                }
            });
        };

        const section = sectionRef.current;
        let approachObserver: IntersectionObserver | undefined;
        let revealObserver: IntersectionObserver | undefined;

        if (section && typeof IntersectionObserver !== 'undefined') {
            approachObserver = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        syncExistingImages();
                        approachObserver?.disconnect();
                    }
                },
                { rootMargin: '500px 0px' }
            );
            approachObserver.observe(section);

            revealObserver = new IntersectionObserver(
                (entries) => {
                    if (entries.some((entry) => entry.isIntersecting)) {
                        setIsMobileRevealed(true);
                        revealObserver?.disconnect();
                    }
                },
                { threshold: 0.08 }
            );
            revealObserver.observe(section);
        } else {
            syncExistingImages();
            const rafId = window.requestAnimationFrame(() => setIsMobileRevealed(true));
            return () => window.cancelAnimationFrame(rafId);
        }

        const timers = retryTimersRef.current;
        return () => {
            approachObserver?.disconnect();
            revealObserver?.disconnect();
            Object.values(timers).forEach((timerId) => window.clearTimeout(timerId));
        };
    }, [markBladeLoaded, handleImageError]);

    const openLightbox = useCallback((idx: number) => {
        setLightboxIdx(idx);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIdx(null);
    }, []);

    const showPrevLightbox = useCallback(() => {
        setLightboxIdx((prev) =>
            prev === null ? null : (prev - 1 + PETROLINA_PHOTOS.length) % PETROLINA_PHOTOS.length
        );
    }, []);

    const showNextLightbox = useCallback(() => {
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % PETROLINA_PHOTOS.length));
    }, []);

    useDialogAccessibility({
        isOpen: lightboxIdx !== null,
        dialogRef: lightboxRef,
        onClose: closeLightbox,
        onPrev: showPrevLightbox,
        onNext: showNextLightbox,
    });

    // Coreografia scroll-driven ativa exclusivamente no desktop (>= 1024px) e com redução de movimento desativada
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReduced) {
            return;
        }

        let rafId = 0;
        let isDesktop = (window.innerWidth || 0) >= 1024;
        let cachedVh = window.innerHeight || 900;
        let scrollListening = false;

        const clearDesktopInlineStyles = () => {
            section.style.top = '';
            section.style.borderTopLeftRadius = '';
            section.style.borderTopRightRadius = '';
            if (crestGlowRef.current) {
                crestGlowRef.current.style.opacity = '';
                crestGlowRef.current.style.transform = '';
            }
            if (crestLineRef.current) {
                crestLineRef.current.style.opacity = '';
            }
            if (glowRef.current) {
                glowRef.current.style.opacity = '';
                glowRef.current.style.transform = '';
            }
            if (stageRef.current) {
                stageRef.current.style.transform = '';
            }
            if (exitVeilRef.current) {
                exitVeilRef.current.style.opacity = '';
            }
            if (galleryRef.current) {
                galleryRef.current.style.pointerEvents = '';
            }
            if (headlineRef.current) {
                headlineRef.current.style.opacity = '';
                headlineRef.current.style.transform = '';
            }
            bladeRefs.current.forEach((el) => {
                if (!el) return;
                el.style.clipPath = '';
                el.style.opacity = '';
                el.style.transform = '';
            });
            imgRefs.current.forEach((imgEl) => {
                if (!imgEl) return;
                imgEl.style.transform = '';
            });
        };

        const measureDesktopLayout = () => {
            isDesktop = (window.innerWidth || 0) >= 1024;
            cachedVh = window.innerHeight || 900;
            if (!isDesktop) {
                clearDesktopInlineStyles();
                return;
            }
            const h = section.offsetHeight || 0;
            section.style.top = `${Math.min(0, cachedVh - h)}px`;
        };

        const applyDesktopFrame = () => {
            rafId = 0;
            if (!isDesktop) return;

            const rect = section.getBoundingClientRect();
            const vh = cachedVh || 1;

            // Viewport culling: pula cálculos quando a seção inteira está fora da tela
            if (rect.top >= vh + 80 || rect.bottom <= -80) {
                return;
            }

            const bevel = rect.top > 0 ? Math.min(1, rect.top / (vh * 0.38)) : 0;
            const rPx = `${Math.round(bevel * 38)}px`;
            section.style.borderTopLeftRadius = rPx;
            section.style.borderTopRightRadius = rPx;

            const nextEl = section.nextElementSibling as HTMLElement | null;
            const nextTop = nextEl ? nextEl.getBoundingClientRect().top : vh * 2;
            const exitRaw = nextEl ? clamp01((vh * 0.94 - nextTop) / (vh * 0.88)) : 0;
            const exitEased = easeOutCubic(exitRaw);
            const exitPulse = Math.sin(exitRaw * Math.PI);

            const entryRaw = clamp01((vh * 0.98 - rect.top) / (vh * 0.56));
            const entryP = easeOutCubic(entryRaw);
            const crestPulse = Math.sin(clamp01((vh - rect.top) / (vh * 0.92)) * Math.PI);

            if (crestGlowRef.current) {
                crestGlowRef.current.style.opacity = (
                    (0.18 + 0.72 * crestPulse) *
                    (1 - exitEased)
                ).toFixed(3);
                crestGlowRef.current.style.transform = `scale3d(${(0.82 + 0.24 * entryP).toFixed(3)}, 1, 1)`;
            }

            if (crestLineRef.current) {
                crestLineRef.current.style.opacity = (
                    (0.28 + 0.72 * crestPulse) *
                    (1 - exitEased)
                ).toFixed(3);
            }

            if (glowRef.current) {
                const baseGlow = 0.18 + 0.82 * entryP;
                const exitGlowOp = baseGlow * (1 - exitRaw * 0.92) + 0.36 * exitPulse;
                const glowScale = 0.68 + 0.36 * entryP + 0.22 * exitPulse;
                glowRef.current.style.opacity = clamp01(exitGlowOp).toFixed(3);
                glowRef.current.style.transform = `scale3d(${glowScale.toFixed(3)}, ${glowScale.toFixed(3)}, 1)`;
            }

            if (stageRef.current) {
                if (exitEased > 0.001) {
                    const stageScale = 1 - 0.095 * exitEased;
                    const stageRotateX = 7.2 * exitEased;
                    const stageShiftY = -34 * exitEased;
                    stageRef.current.style.transform = `perspective(1400px) translate3d(0, ${stageShiftY.toFixed(2)}px, 0) rotateX(${stageRotateX.toFixed(2)}deg) scale3d(${stageScale.toFixed(4)}, ${stageScale.toFixed(4)}, 1)`;
                } else {
                    stageRef.current.style.transform = '';
                }
            }

            if (exitVeilRef.current) {
                exitVeilRef.current.style.opacity = (0.76 * exitEased).toFixed(3);
            }

            if (galleryRef.current) {
                galleryRef.current.style.pointerEvents = exitEased > 0.68 ? 'none' : '';
            }

            if (headlineRef.current) {
                const headRaw = clamp01((vh * 0.93 - rect.top) / (vh * 0.38));
                const headP = easeOutCubic(headRaw);
                const headExit = clamp01(exitRaw / 0.52);
                const headExitEased = easeOutCubic(headExit);
                const headOpacity = Math.max(0.08, headP) * (1 - headExitEased);
                const headY = (1 - headP) * 32 - headExitEased * 22;
                const headScale = (0.97 + 0.03 * headP) * (1 - 0.035 * headExitEased);
                headlineRef.current.style.opacity = headOpacity.toFixed(3);
                headlineRef.current.style.transform = `translate3d(0, ${headY.toFixed(2)}px, 0) scale3d(${headScale.toFixed(4)}, ${headScale.toFixed(4)}, 1)`;
            }

            const centerProgress = clamp(
                (vh * 0.5 - (rect.top + rect.height * 0.5)) / (vh + rect.height * 0.5),
                -1,
                1
            );

            for (let i = 0; i < PETROLINA_PHOTOS.length; i++) {
                const blade = bladeRefs.current[i];
                const imgEl = imgRefs.current[i];
                if (!blade) continue;

                const distFromCenter = Math.abs(i - 3);
                const startTop = vh * (0.64 - distFromCenter * 0.055);
                const bladeRaw = clamp01((startTop - rect.top) / (vh * 0.46));
                const bladeEased = easeOutCubic(bladeRaw);

                const exitDelay = (3 - distFromCenter) * 0.095;
                const bladeExit =
                    exitRaw > 0
                        ? easeOutCubic(clamp01((exitRaw - exitDelay) / (1 - exitDelay)))
                        : 0;

                const isEntering = bladeRaw < 0.995;
                if (isEntering) {
                    const clipX = (1 - bladeEased) * 47;
                    const clipY = (1 - bladeEased) * 10;
                    blade.style.clipPath = `inset(${clipY.toFixed(2)}% ${clipX.toFixed(2)}% ${clipY.toFixed(2)}% ${clipX.toFixed(2)}% round 20px)`;
                } else {
                    blade.style.clipPath = '';
                }

                const spreadX = (i - 3) * (1 - bladeEased) * -14 + (i - 3) * bladeExit * -34;
                const liftBase = 18 + distFromCenter * 10;
                const parallaxY =
                    centerProgress * (PARALLAX_FACTORS[i] ?? 0) * bladeEased * (1 - bladeExit);
                const liftY = (1 - bladeEased) * liftBase - bladeExit * (22 + distFromCenter * 12);
                const scale = (0.94 + 0.06 * bladeEased) * (1 - 0.14 * bladeExit);
                const entryOpacity = bladeRaw <= 0 ? 0 : clamp01(Math.pow(bladeRaw, 0.42) * 1.45);
                const finalOpacity = entryOpacity * (1 - Math.pow(bladeExit, 1.4));

                const enterRotateY = (i - 3) * (1 - bladeEased) * -13;
                const enterRotateX = i === 3 ? (1 - bladeEased) * 10 : 0;
                const exitRotateY = (i - 3) * bladeExit * -10.5;
                const totalRotateY = enterRotateY + exitRotateY;

                blade.style.opacity = finalOpacity.toFixed(3);
                if (isEntering || bladeExit > 0.001) {
                    blade.style.transform = `perspective(1000px) translate3d(${spreadX.toFixed(2)}px, ${(liftY + parallaxY).toFixed(2)}px, 0) rotateY(${totalRotateY.toFixed(2)}deg) rotateX(${enterRotateX.toFixed(2)}deg) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
                } else {
                    blade.style.transform = `translate3d(${spreadX.toFixed(2)}px, ${(liftY + parallaxY).toFixed(2)}px, 0) scale3d(${scale.toFixed(4)}, ${scale.toFixed(4)}, 1)`;
                }

                if (imgEl) {
                    if (isEntering) {
                        const lensZoom = 1 + (1 - bladeEased) * 0.16;
                        imgEl.style.transform = `scale(${lensZoom.toFixed(4)})`;
                    } else {
                        imgEl.style.transform = '';
                    }
                }
            }
        };

        const scheduleDesktopFrame = () => {
            if (!isDesktop || rafId) return;
            rafId = window.requestAnimationFrame(applyDesktopFrame);
        };

        const syncDesktopListeners = () => {
            measureDesktopLayout();
            if (isDesktop && !scrollListening) {
                scrollListening = true;
                window.addEventListener('scroll', scheduleDesktopFrame, { passive: true });
                applyDesktopFrame();
            } else if (!isDesktop && scrollListening) {
                scrollListening = false;
                window.removeEventListener('scroll', scheduleDesktopFrame);
                if (rafId) {
                    window.cancelAnimationFrame(rafId);
                    rafId = 0;
                }
            } else if (isDesktop) {
                applyDesktopFrame();
            }
        };

        syncDesktopListeners();
        window.addEventListener('resize', syncDesktopListeners, { passive: true });

        return () => {
            window.removeEventListener('scroll', scheduleDesktopFrame);
            window.removeEventListener('resize', syncDesktopListeners);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="petrolina-cinema-section"
            aria-label="Retratos de Petrolina e do Vale do São Francisco"
            className="relative lg:sticky lg:top-0 motion-reduce:relative z-10 lg:min-h-[100dvh] flex flex-col justify-center bg-[#12110F] rounded-t-[28px] md:rounded-t-[40px] border-t border-[#E5C98B]/20 shadow-[0_-18px_40px_rgba(0,0,0,0.6)] lg:shadow-[0_-24px_80px_rgba(0,0,0,0.75)] overflow-hidden pt-16 sm:pt-24 pb-14 lg:pb-14"
        >
            {/* Luminous rising champagne crest line & sunrise halo sweeping over receding Hero (desktop) */}
            <div
                ref={crestLineRef}
                aria-hidden="true"
                className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[78%] max-w-4xl h-px bg-gradient-to-r from-transparent via-[#E5C98B]/85 to-transparent lg:will-change-[opacity] motion-reduce:hidden"
            />
            <div
                ref={crestGlowRef}
                aria-hidden="true"
                className="hidden lg:block pointer-events-none absolute -top-2 left-0 right-0 h-44 bg-[radial-gradient(ellipse_62%_100%_at_50%_0%,rgba(229,201,139,0.22)_0%,transparent_72%)] lg:will-change-[opacity,transform] motion-reduce:hidden"
            />

            {/* Palco retrátil para a saída rumo à seção clara do flat */}
            <div
                ref={stageRef}
                className="relative origin-center lg:will-change-transform motion-reduce:!transform-none"
            >
                {/* Ambient warm horizon glow behind center blade (desktop) */}
                <div
                    ref={glowRef}
                    aria-hidden="true"
                    className="hidden lg:block pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_52%_58%_at_50%_54%,rgba(229,201,139,0.16)_0%,transparent_72%)] motion-reduce:hidden"
                />

                <div className="relative z-10 max-w-[1380px] mx-auto px-4 sm:px-6 md:px-10 space-y-6 sm:space-y-8 md:space-y-12">
                    {/* Editorial invitation */}
                    <div
                        ref={headlineRef}
                        className={`text-center max-w-2xl mx-auto px-2 lg:will-change-[opacity,transform] transition-all duration-700 ease-out lg:transition-none motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!transform-none ${
                            isMobileRevealed
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0'
                        }`}
                    >
                        <div className="inline-flex items-center gap-3 mb-2">
                            <span className="w-5 sm:w-7 h-px bg-[#E5C98B]/55" aria-hidden="true" />
                            <span className="text-xs font-semibold tracking-[0.22em] uppercase text-[#E5C98B]">
                                Petrolina · Vale do São Francisco
                            </span>
                            <span className="w-5 sm:w-7 h-px bg-[#E5C98B]/55" aria-hidden="true" />
                        </div>
                        <p className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white leading-[1.18]">
                            Viva o Vale do Rio São Francisco.{' '}
                            <span className="text-[#E5C98B] font-normal block sm:inline">
                                Entre o rio dourado, o sol e as vinícolas.
                            </span>
                        </p>
                    </div>

                    {/* 7 colunas no desktop; grade bento 1+3x2 no mobile sem travas sticky */}
                    <div
                        ref={galleryRef}
                        className="group/gallery grid grid-cols-3 lg:grid-cols-7 items-center gap-2 sm:gap-3 xl:gap-3.5"
                    >
                        {PETROLINA_PHOTOS.map((photo, idx) => {
                            const isLeadMobile = idx === 0;
                            const isCenterDesktop = idx === 3;
                            const staggerDelay = `${idx * 45}ms`;

                            return (
                                <div
                                    key={photo.src}
                                    ref={(el) => {
                                        bladeRefs.current[idx] = el;
                                    }}
                                    style={{ transitionDelay: staggerDelay }}
                                    className={`group/blade relative rounded-[16px] sm:rounded-[20px] md:rounded-[22px] lg:will-change-[transform,opacity] transition-[opacity,transform] duration-500 ease-out lg:transition-none motion-reduce:transition-none motion-reduce:!opacity-100 motion-reduce:!transform-none lg:hover:z-20 ${
                                        isMobileRevealed
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-4 lg:opacity-100 lg:translate-y-0'
                                    } ${
                                        isLeadMobile
                                            ? 'col-span-3 aspect-[16/9] sm:aspect-[2/1] lg:col-span-1 lg:aspect-auto'
                                            : 'aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto'
                                    } ${DESKTOP_RIBBON_HEIGHTS[idx]}`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => openLightbox(idx)}
                                        aria-label={`Ampliar foto: ${photo.title}`}
                                        className="relative block w-full h-full overflow-hidden rounded-[16px] sm:rounded-[20px] md:rounded-[22px] bg-[#181613] shadow-lg lg:shadow-[0_24px_60px_rgba(0,0,0,0.62)] transition-[opacity,transform] duration-500 ease-out cursor-pointer lg:group-hover/gallery:opacity-55 lg:group-hover/blade:!opacity-100 lg:group-hover/blade:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                                    >
                                        {!loadedBlades[idx] && (
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 bg-[#1B1814]"
                                            />
                                        )}
                                        <span className="relative z-[1] block w-full h-full lg:transition-transform lg:duration-700 lg:ease-out lg:group-hover/blade:scale-[1.05]">
                                            <img
                                                ref={(el) => {
                                                    imgRefs.current[idx] = el;
                                                }}
                                                src={
                                                    retryCounts[idx]
                                                        ? `${photo.src}?retry=${retryCounts[idx]}`
                                                        : photo.src
                                                }
                                                srcSet={
                                                    retryCounts[idx]
                                                        ? undefined
                                                        : `${photo.thumbSrc} 320w, ${photo.src} 640w`
                                                }
                                                sizes={
                                                    isLeadMobile
                                                        ? '(max-width: 1023px) 92vw, 220px'
                                                        : '(max-width: 1023px) 32vw, 220px'
                                                }
                                                alt={photo.alt}
                                                width={photo.width}
                                                height={photo.height}
                                                loading="lazy"
                                                decoding="async"
                                                onLoad={(e) =>
                                                    markBladeLoaded(idx, e.currentTarget)
                                                }
                                                onError={() => handleImageError(idx)}
                                                className="w-full h-full object-cover object-center select-none lg:will-change-transform motion-reduce:!transform-none"
                                            />
                                        </span>

                                        {/* Subtle vignette gradient for cinematic depth */}
                                        <div
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute inset-0 z-[2] transition-opacity duration-500 ${
                                                isCenterDesktop
                                                    ? 'bg-gradient-to-t from-[#12110F]/45 via-transparent to-transparent'
                                                    : 'bg-gradient-to-t from-[#12110F]/55 via-[#12110F]/10 to-transparent lg:group-hover/blade:opacity-40'
                                            }`}
                                        />

                                        {/* Warm champagne architectural hairline border */}
                                        <div
                                            aria-hidden="true"
                                            className={`pointer-events-none absolute inset-0 z-[3] rounded-[16px] sm:rounded-[20px] md:rounded-[22px] border transition-colors duration-500 ${
                                                isCenterDesktop
                                                    ? 'border-[#E5C98B]/20 lg:border-[#E5C98B]/50'
                                                    : isLeadMobile
                                                      ? 'border-[#E5C98B]/45 lg:border-[#E5C98B]/20 lg:group-hover/blade:border-[#E5C98B]/65'
                                                      : 'border-[#E5C98B]/20 lg:group-hover/blade:border-[#E5C98B]/65'
                                            }`}
                                        />

                                        {/* Subtle hover-only expand affordance (desktop) */}
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none hidden lg:inline-flex items-center justify-center absolute bottom-3 right-3 z-[4] w-7 h-7 rounded-full bg-[#12110F]/75 backdrop-blur-md border border-[#E5C98B]/35 text-[#E5C98B] opacity-0 group-hover/blade:opacity-100 transition-opacity duration-300"
                                        >
                                            <Expand size={13} />
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Véu atmosférico progressivo na saída da vitrine antes da cortina clara (desktop) */}
            <div
                ref={exitVeilRef}
                aria-hidden="true"
                className="hidden lg:block pointer-events-none absolute inset-0 z-[15] bg-gradient-to-b from-[#12110F] via-[#12110F]/95 to-[#1B1712] lg:will-change-[opacity] motion-reduce:hidden"
                style={{ opacity: 0 }}
            />

            {lightboxIdx !== null &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={lightboxRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={lightboxTitleId}
                        onClick={closeLightbox}
                        className="fixed inset-0 z-[100] bg-[#0B0A08] flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-hidden outline-none"
                    >
                        {/* Ambient studio blur apenas a partir de sm para preservar fluidez mobile */}
                        <div
                            aria-hidden="true"
                            className="hidden sm:block pointer-events-none absolute inset-0 overflow-hidden"
                        >
                            <img
                                src={PETROLINA_PHOTOS[lightboxIdx].src}
                                alt=""
                                className="w-full h-full object-cover opacity-[0.12] blur-3xl scale-125 saturate-150"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A08]/80 via-[#0B0A08]/65 to-[#0B0A08]/95" />
                        </div>

                        {/* Top bar: index badge + close */}
                        <div
                            className="relative z-10 max-w-6xl w-full mx-auto flex items-center justify-between gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="inline-flex items-center gap-3">
                                <span className="text-xs font-mono tracking-[0.22em] uppercase text-[#E5C98B] tabular-nums">
                                    0{lightboxIdx + 1} / 0{PETROLINA_PHOTOS.length}
                                </span>
                                <span className="hidden sm:inline-block w-6 h-px bg-[#E5C98B]/40" />
                                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs tracking-[0.14em] uppercase text-stone-300/85">
                                    <MapPin
                                        size={12}
                                        className="text-[#E5C98B]"
                                        aria-hidden="true"
                                    />
                                    {PETROLINA_PHOTOS[lightboxIdx].location}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={closeLightbox}
                                aria-label="Fechar foto ampliada"
                                className="w-11 h-11 rounded-full bg-[#1B1814]/90 hover:bg-[#E5C98B] text-[#F5F2EB] hover:text-[#141210] border border-[#E5C98B]/25 transition-colors flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                            >
                                <X size={19} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Center curated showcase: portrait frame + editorial caption */}
                        <div
                            className="relative flex-1 min-h-0 max-w-6xl w-full mx-auto flex items-center justify-center my-3 sm:my-4 touch-pan-y"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                touchStartXRef.current = e.touches[0]?.clientX ?? null;
                            }}
                            onTouchEnd={(e) => {
                                if (touchStartXRef.current === null) return;
                                const dx =
                                    (e.changedTouches[0]?.clientX ?? touchStartXRef.current) -
                                    touchStartXRef.current;
                                touchStartXRef.current = null;
                                if (dx > 45) showPrevLightbox();
                                if (dx < -45) showNextLightbox();
                            }}
                        >
                            <button
                                type="button"
                                onClick={showPrevLightbox}
                                aria-label="Foto anterior"
                                className="hidden md:flex absolute left-0 lg:left-2 z-20 w-11 h-11 rounded-full bg-[#1B1814]/85 hover:bg-[#E5C98B] text-[#F5F2EB] hover:text-[#141210] border border-[#E5C98B]/25 transition-colors items-center justify-center backdrop-blur-md shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                            >
                                <ChevronLeft size={20} aria-hidden="true" />
                            </button>

                            <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 max-h-full px-1 sm:px-10">
                                {/* Warm radial aura behind expanded portrait (desktop/tablet) */}
                                <div
                                    aria-hidden="true"
                                    className="hidden sm:block pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[460px] rounded-full bg-[#E5C98B]/10 blur-3xl"
                                />

                                <div className="relative shrink-0 rounded-[22px] sm:rounded-[26px] overflow-hidden border border-[#E5C98B]/30 bg-[#181613] shadow-2xl sm:shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
                                    <img
                                        key={PETROLINA_PHOTOS[lightboxIdx].src}
                                        src={PETROLINA_PHOTOS[lightboxIdx].src}
                                        alt={PETROLINA_PHOTOS[lightboxIdx].alt}
                                        className="block max-h-[54vh] sm:max-h-[62vh] md:max-h-[68vh] w-auto max-w-[88vw] md:max-w-[52vw] object-contain"
                                    />
                                </div>

                                <div className="relative max-w-sm text-center md:text-left space-y-2.5 px-2">
                                    <span className="inline-flex sm:hidden items-center gap-1.5 text-xs font-mono tracking-[0.14em] uppercase text-[#E5C98B]">
                                        <MapPin size={11} aria-hidden="true" />
                                        {PETROLINA_PHOTOS[lightboxIdx].location}
                                    </span>
                                    <div
                                        className="hidden md:block w-8 h-px bg-[#E5C98B]/60 mb-3"
                                        aria-hidden="true"
                                    />
                                    <h3
                                        id={lightboxTitleId}
                                        className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight"
                                    >
                                        {PETROLINA_PHOTOS[lightboxIdx].title}
                                    </h3>
                                    <p className="text-stone-300/90 text-sm sm:text-base font-normal leading-relaxed">
                                        {PETROLINA_PHOTOS[lightboxIdx].caption}
                                    </p>

                                    {/* Mobile prev/next arrows com alvo mínimo de 44x44px */}
                                    <div className="flex md:hidden items-center justify-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={showPrevLightbox}
                                            aria-label="Foto anterior"
                                            className="w-11 h-11 rounded-full bg-[#1B1814] border border-[#E5C98B]/25 text-[#E5C98B] flex items-center justify-center active:scale-95 transition-transform"
                                        >
                                            <ChevronLeft size={18} aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={showNextLightbox}
                                            aria-label="Próxima foto"
                                            className="w-11 h-11 rounded-full bg-[#1B1814] border border-[#E5C98B]/25 text-[#E5C98B] flex items-center justify-center active:scale-95 transition-transform"
                                        >
                                            <ChevronRight size={18} aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={showNextLightbox}
                                aria-label="Próxima foto"
                                className="hidden md:flex absolute right-0 lg:right-2 z-20 w-11 h-11 rounded-full bg-[#1B1814]/85 hover:bg-[#E5C98B] text-[#F5F2EB] hover:text-[#141210] border border-[#E5C98B]/25 transition-colors items-center justify-center backdrop-blur-md shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                            >
                                <ChevronRight size={20} aria-hidden="true" />
                            </button>
                        </div>

                        {/* Bottom refined thumbnail strip */}
                        <div
                            className="relative z-10 max-w-full mx-auto flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 px-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {PETROLINA_PHOTOS.map((thumb, idx) => {
                                const isCurrent = idx === lightboxIdx;
                                return (
                                    <button
                                        key={thumb.src}
                                        type="button"
                                        onClick={() => setLightboxIdx(idx)}
                                        aria-label={`Ver ${thumb.title}`}
                                        aria-current={isCurrent ? 'true' : undefined}
                                        className={`relative w-12 h-14 sm:w-12 sm:h-16 rounded-xl overflow-hidden border transition-all duration-300 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B] ${
                                            isCurrent
                                                ? 'border-[#E5C98B] scale-105 opacity-100 shadow-[0_6px_18px_rgba(229,201,139,0.28)]'
                                                : 'border-white/15 opacity-45 hover:opacity-85'
                                        }`}
                                    >
                                        <img
                                            src={thumb.thumbSrc}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
};
