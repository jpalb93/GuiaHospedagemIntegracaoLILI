import { useRef, useEffect } from 'react';
import { ArrowRight, BadgePercent, Building2, Clock } from 'lucide-react';
// GSAP is now dynamically imported to save initial bundle size

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const bottomStripRef = useRef<HTMLDivElement>(null);
    const theaterVeilRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let rafId = 0;

        const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const syncStickyTop = () => {
            const container = containerRef.current;
            if (!container) return;
            const vh = window.innerHeight || 0;
            const overflow = Math.max(0, container.offsetHeight - vh);
            container.style.top = overflow > 0 ? `${-overflow}px` : '0px';
        };

        const updateExitCinema = () => {
            rafId = 0;
            const container = containerRef.current;
            const stage = stageRef.current;
            if (!container || !stage || prefersReduced) return;

            const vh = window.innerHeight || 1;
            const overflow = Math.max(0, container.offsetHeight - vh);
            const scrolledIntoExit = Math.max(0, window.scrollY - overflow);
            const p = Math.min(1, scrolledIntoExit / Math.max(vh * 0.92, 1));
            const easedP = 1 - Math.pow(1 - p, 2.2);

            // Deep 3D cinema stage retreat + subtle backward tilt while PetrolinaCinemaSection rises
            const stageScale = 1 - easedP * 0.115;
            const stageRotateX = easedP * 2.2;
            const stageY = -easedP * 16;
            stage.style.transform = `perspective(1400px) translate3d(0, ${stageY.toFixed(1)}px, 0) rotateX(${stageRotateX.toFixed(2)}deg) scale(${stageScale.toFixed(4)})`;
            stage.style.borderRadius = `${(easedP * 34).toFixed(1)}px`;
            stage.style.boxShadow =
                p > 0.01
                    ? `inset 0 0 0 1px rgba(229,201,139,${(Math.min(1, p * 2.2) * 0.22).toFixed(3)}), 0 36px 90px rgba(0,0,0,0.85)`
                    : 'none';

            if (bgRef.current) {
                bgRef.current.style.transform = `translate3d(0, ${(easedP * 48).toFixed(1)}px, 0) scale(${(1 + easedP * 0.12).toFixed(4)})`;
            }

            if (theaterVeilRef.current) {
                theaterVeilRef.current.style.opacity = (Math.pow(p, 1.05) * 0.84).toFixed(3);
            }

            const fgOpacity = Math.max(0, 1 - p * 1.45).toFixed(3);
            const fgY = (-easedP * 28).toFixed(2);

            if (textRef.current) {
                textRef.current.style.opacity = fgOpacity;
                textRef.current.style.transform = `translate3d(0, ${fgY}px, 0)`;
            }
            if (bottomStripRef.current) {
                bottomStripRef.current.style.opacity = fgOpacity;
                bottomStripRef.current.style.transform = `translate3d(0, ${(-p * 12).toFixed(2)}px, 0)`;
            }
        };

        const scheduleExit = () => {
            if (!rafId) {
                rafId = window.requestAnimationFrame(updateExitCinema);
            }
        };

        const handleResize = () => {
            syncStickyTop();
            scheduleExit();
        };

        if (!prefersReduced) {
            syncStickyTop();
            updateExitCinema();
            window.addEventListener('scroll', scheduleExit, { passive: true });
            window.addEventListener('resize', handleResize, { passive: true });
        }

        return () => {
            window.removeEventListener('scroll', scheduleExit);
            window.removeEventListener('resize', handleResize);
            if (rafId) window.cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <section
            id="inicio"
            ref={containerRef}
            className="sticky top-0 z-0 motion-reduce:relative min-h-[100dvh] w-full bg-[#12110F]"
        >
            <div
                ref={stageRef}
                className="relative min-h-[100dvh] w-full overflow-hidden bg-[#12110F] flex flex-col justify-between origin-center will-change-[transform,border-radius]"
            >
                {/* Background com Picture para Imagens Responsivas */}
                <div ref={bgRef} className="absolute inset-0">
                    <picture>
                        <source
                            media="(max-width: 800px)"
                            srcSet="/hero-bg-mobile1.webp"
                            type="image/webp"
                        />
                        <img
                            src="/hero-bg-nova1.webp"
                            className="w-full h-full object-cover object-center opacity-85 hero-ken-burns"
                            alt="Hospedagem em Petrolina: Flats Integração no Centro, próximos a hospitais"
                            loading="eager"
                            fetchPriority="high"
                            width="1672"
                            height="941"
                        />
                    </picture>
                </div>

                {/* Luz solar quente sutil + scrims cinematográficos */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 right-[8%] w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(229,201,139,0.16)_0%,rgba(229,201,139,0)_70%)] blur-2xl z-10 hero-ambient-glow"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#12110F]/90 via-[#12110F]/50 to-[#12110F]/15 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#12110F]/45 via-transparent to-[#12110F]/95 z-10 pointer-events-none" />
                {/* Cortina obsidian progressiva na saída do Hero ("lights dimming") */}
                <div
                    ref={theaterVeilRef}
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-[15] bg-[#12110F] will-change-[opacity]"
                    style={{ opacity: 0 }}
                />

                {/* Conteúdo Principal Alinhado à Esquerda */}
                <div className="max-w-[1320px] w-full mx-auto px-6 md:px-12 relative z-20 flex-1 flex flex-col justify-center pt-28 sm:pt-32 md:pt-36 pb-10">
                    <div ref={textRef} className="max-w-2xl will-change-[transform,opacity]">
                        <div className="inline-flex items-center gap-3 mb-3 hero-rise hero-delay-1">
                            <span
                                className="w-7 h-px bg-[#E5C98B] hero-line-reveal hero-delay-1"
                                aria-hidden
                            />
                            <span className="text-xs sm:text-sm font-medium text-[#E5C98B] tracking-[0.2em] uppercase">
                                Flats Integração
                            </span>
                        </div>

                        <div className="overflow-hidden">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-heading font-semibold text-white leading-[1.06] tracking-[-0.025em] drop-shadow-sm hero-rise hero-delay-2">
                                Hospedagem em Petrolina
                            </h1>
                        </div>

                        <p className="mt-5 text-base sm:text-lg md:text-[1.125rem] font-normal text-stone-200/90 leading-relaxed max-w-lg hero-rise hero-delay-3">
                            Hospedagem mobiliada no Centro: cozinha, Wi-Fi fibra e melhor
                            custo-benefício que hotel. Lazer ou empresa.
                        </p>

                        {/* Dual intent: lazer (WhatsApp) + B2B (cotação) */}
                        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 hero-rise hero-delay-4">
                            <a
                                href="https://wa.me/5587988283273?text=Ol%C3%A1!%20Quero%20reservar%20um%20flat%20nos%20Flats%20Integra%C3%A7%C3%A3o."
                                target="_blank"
                                rel="noreferrer"
                                className="group relative overflow-hidden bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-[0.98]"
                            >
                                <span
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-[130%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12"
                                />
                                <span className="relative">Reservar Agora</span>
                                <ArrowRight
                                    size={16}
                                    className="relative group-hover:translate-x-1 transition-transform duration-300"
                                />
                            </a>
                            <a
                                href="#empresas"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3.5 rounded-full text-sm font-medium border border-white/20 transition-all duration-300 inline-flex items-center justify-center active:scale-[0.98]"
                            >
                                Cotação empresas
                            </a>
                        </div>
                    </div>
                </div>

                {/* Indicador vertical sutil estilo hotel boutique (desktop) */}
                <a
                    href="#galeria"
                    aria-label="Explorar os flats"
                    className="hidden xl:flex flex-col items-center gap-2.5 absolute right-10 bottom-36 z-20 text-white/60 hover:text-[#E5C98B] transition-colors hero-rise hero-delay-5"
                >
                    <span className="text-[10px] font-medium uppercase tracking-[0.26em] [writing-mode:vertical-rl]">
                        Explorar
                    </span>
                    <span className="relative w-px h-10 bg-white/20 overflow-hidden" aria-hidden>
                        <span className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-[#E5C98B] to-transparent hero-scroll-beacon" />
                    </span>
                </a>

                {/* Faixa Inferior Arquitetônica — Realoca os destaques, ticker e Day Use */}
                <div
                    ref={bottomStripRef}
                    className="max-w-[1320px] w-full mx-auto px-6 md:px-12 relative z-20 pb-7 md:pb-9 hero-rise hero-delay-5 will-change-[transform,opacity]"
                >
                    <div className="relative pt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
                        <span
                            aria-hidden
                            className="absolute inset-x-0 top-0 h-px bg-white/20 hero-line-reveal hero-delay-4"
                        />
                        <div className="lg:col-span-3 lg:pr-2">
                            <p className="text-sm md:text-base font-medium text-white leading-snug">
                                Reserve direto, sem intermediário
                            </p>
                            <p className="text-xs text-stone-300/80 mt-0.5">
                                Hospedagem em Petrolina no Centro
                            </p>
                        </div>

                        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 items-center">
                            <a
                                href="#day-use"
                                className="group flex items-center gap-3 rounded-2xl -m-1.5 p-1.5 hover:bg-white/5 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-full bg-[#E5C98B] group-hover:bg-[#edd6a1] text-[#141210] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-all duration-300">
                                    <Clock size={17} strokeWidth={1.9} aria-hidden />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[#E5C98B] group-hover:text-[#f1ddb0] leading-snug inline-flex items-center gap-1 transition-colors">
                                        Day use
                                        <ArrowRight
                                            size={13}
                                            className="group-hover:translate-x-0.5 transition-transform"
                                            aria-hidden
                                        />
                                    </p>
                                    <p className="text-xs text-stone-300/80 mt-0.5 leading-snug">
                                        Das 8h às 12h · sem pernoite
                                    </p>
                                </div>
                            </a>

                            <div className="group flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white text-[#141210] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    <BadgePercent size={17} strokeWidth={1.8} aria-hidden />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white leading-snug">
                                        Economia vs hotel
                                    </p>
                                    <p className="text-xs text-stone-300/80 mt-0.5 leading-snug">
                                        Melhor custo-benefício que hotel
                                    </p>
                                </div>
                            </div>

                            <div className="group flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white text-[#141210] flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                    <Building2 size={17} strokeWidth={1.8} aria-hidden />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white leading-snug">
                                        NF PJ · Mensal
                                    </p>
                                    <p className="text-xs text-stone-300/80 mt-0.5 leading-snug">
                                        Flats mobiliados, lazer ou mensal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
