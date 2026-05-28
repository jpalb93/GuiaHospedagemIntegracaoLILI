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
            className="relative h-[100dvh] md:h-screen min-h-[600px] md:min-h-[700px] w-full overflow-hidden bg-stone-950"
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
                        alt="Flats Integração hospedagem centro Petrolina PE próximos hospitais"
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

            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center md:items-start relative z-20 pt-24 md:pt-32">
                <div ref={textRef} className="max-w-4xl text-center md:text-left flex flex-col items-center md:items-start">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                            Hospedagem em Petrolina <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                por Temporada
                            </span>
                        </h1>
                    </div>
                    <div className="mt-8 mb-12 space-y-6 animate-fade-up flex flex-col items-center md:items-start">
                        <p className="text-xl md:text-2xl font-light text-stone-400 leading-relaxed max-w-2xl">
                            Flats completos e mobiliados <br />
                            no Centro de Petrolina
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-4 gap-x-6 md:bg-white/5 md:backdrop-blur-md md:border md:border-white/10 md:px-8 md:py-4 md:rounded-full w-fit">
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-[11px] md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                Conforto
                            </span>
                            <span className="hidden md:block text-white/10 text-xl font-thin">|</span>
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-[11px] md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                Privacidade
                            </span>
                            <span className="hidden md:block text-white/10 text-xl font-thin">|</span>
                            <span className="flex items-center gap-2.5 text-stone-200 font-medium text-[11px] md:text-sm uppercase tracking-[0.2em]">
                                <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                                Localização Privilegiada
                            </span>
                        </div>
                    </div>
                </div>





                {/* Botões de Ação - Alto Contraste */}
                {/* CSS Animation: Delay 300ms */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-stone-100 hover:bg-white text-stone-950 px-8 py-5 rounded-none text-sm font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Reservar Agora
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                    <a
                        href="#galeria"
                        className="group bg-transparent border border-white/20 hover:border-white/50 text-stone-300 hover:text-white px-8 py-5 rounded-none text-sm font-medium uppercase tracking-wider transition-all duration-300 flex items-center justify-center hover:bg-white/5"
                    >
                        Ver Ambientes
                    </a>
                </div>
            </div>

            {/* Indicador de Scroll Minimalista */}
            <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-4 animate-bounce text-stone-600">
                <span className="vertical-rl text-xs tracking-widest uppercase rotate-180 writing-mode-vertical">
                    Scroll
                </span>
                <ChevronRight className="rotate-90" size={24} />
            </div>
        </section>
    );
};

export default Hero;
