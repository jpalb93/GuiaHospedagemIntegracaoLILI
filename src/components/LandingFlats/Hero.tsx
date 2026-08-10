import { useRef, useEffect } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';
// GSAP is now dynamically imported to save initial bundle size

const Hero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: gsap.Context | undefined;

        const initGsap = async () => {
            // Dynamic import GSAP modules
            const gsapModule = await import('gsap');
            const scrollTriggerModule = await import('gsap/ScrollTrigger');

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

            gsap.registerPlugin(ScrollTrigger);

            // Parallax Effect - Desktop Only to save Mobile CPU (TBT)
            // Entrance animations are now handled by pure CSS (animate-fade-up) for best LCP
            const mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                // Context for cleanup
                ctx = gsap.context(() => {
                    if (bgRef.current && containerRef.current) {
                        gsap.to(bgRef.current, {
                            yPercent: 30,
                            scale: 1.2,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top top',
                                end: 'bottom top',
                                scrub: true,
                            },
                        });
                    }
                }, containerRef);
            });
        };

        // Delay slightly to prioritize LCP
        const timer = setTimeout(() => {
            initGsap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section
            id="inicio"
            ref={containerRef}
            className="relative flex-1 min-h-0 w-full overflow-hidden bg-stone-950"
        >
            {/* 
            SEO OTIMIZAÇÃO:
            <title>Flats Integração Petrolina (Centro) – Hospedagem Flat Mobiliado</title>
            <meta name="description" content="Flat em Petrolina (Centro) próximo hospitais e orla do São Francisco. Hospedagem profissional para trabalho, consultas e turismo. Reservar agora!">
            
            OPEN GRAPH:
            <meta property="og:title" content="Flats Integração Petrolina (Centro) – Hospedagem Flat Mobiliado" />
            <meta property="og:description" content="Flat em Petrolina (Centro) próximo hospitais e orla do São Francisco. Hospedagem profissional para trabalho, consultas e turismo. Reservar agora!" />
            <meta property="og:image" content="/hero-bg.jpg" />
            */}

            {/* Background com Picture para Imagens Responsivas */}
            <div ref={bgRef} className="absolute inset-0">
                <picture>
                    <source
                        media="(max-width: 800px)"
                        srcSet="/hero-bg-mobile.webp"
                        type="image/webp"
                    />
                    <img
                        src="/hero-bg-nova.webp"
                        className="w-full h-full object-cover opacity-60"
                        alt="Hospedagem em Petrolina: Flats Integração no Centro, próximos a hospitais"
                        loading="eager"
                        fetchPriority="high"
                        width="1920"
                        height="1080"
                    />
                </picture>
            </div>

            {/* Overlay Gradient - Dark Theme */}
            <div className="absolute inset-0 bg-stone-950/40 z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950 to-transparent z-10"></div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-full flex flex-col justify-center items-center relative z-20 pt-24 md:pt-32 pb-12 text-center">
                <div
                    ref={textRef}
                    className="max-w-4xl text-center flex flex-col items-center mx-auto"
                >
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                        <span className="text-xl sm:text-2xl md:text-3xl font-heading font-semibold text-stone-300 tracking-[0.15em] uppercase drop-shadow-md">
                            Flats Integração
                        </span>
                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 leading-[1.08] tracking-tight drop-shadow-2xl">
                            Hospedagem em Petrolina
                        </h1>
                    </div>
                    <div className="mt-6 mb-10 space-y-6 animate-fade-up flex flex-col items-center">
                        <p className="text-xl md:text-2xl font-light text-stone-300 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                            Hospedagem mobiliada no Centro: cozinha, Wi-Fi fibra e
                            <br className="hidden sm:block" /> melhor custo-benefício que hotel.
                            Lazer ou empresa.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-6 bg-stone-900/60 backdrop-blur-md border border-white/10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl sm:rounded-full w-fit mx-auto shadow-xl">
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-xs md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
                                Economia vs hotel
                            </span>
                            <span className="hidden md:block text-white/20 text-xl font-thin">
                                |
                            </span>
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-xs md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
                                Cozinha + Wi-Fi
                            </span>
                            <span className="hidden md:block text-white/20 text-xl font-thin">
                                |
                            </span>
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-xs md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]"></span>
                                NF PJ · Mensal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dual intent: lazer (WhatsApp) + B2B (cotação) — Centralized CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto mx-auto">
                    <a
                        href="https://wa.me/5587988283273?text=Ol%C3%A1!%20Quero%20reservar%20um%20flat%20nos%20Flats%20Integra%C3%A7%C3%A3o."
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-xs font-heading font-bold uppercase tracking-widest border border-orange-400/60 hover:border-orange-300 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md active:scale-[0.98] w-full sm:w-auto"
                    >
                        <span>Reservar Agora</span>
                        <ArrowRight
                            size={16}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                    <a
                        href="#empresas"
                        className="group bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white px-8 py-4 rounded-xl text-xs font-heading font-bold uppercase tracking-widest border border-stone-700 hover:border-orange-500/60 transition-all duration-300 flex items-center justify-center shadow-md active:scale-[0.98] w-full sm:w-auto"
                    >
                        Cotação empresas
                    </a>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-4 text-stone-600">
                <span className="vertical-rl text-xs tracking-widest uppercase rotate-180 writing-mode-vertical">
                    Scroll
                </span>
                <ChevronRight className="rotate-90" size={24} />
            </div>
        </section>
    );
};

export default Hero;
