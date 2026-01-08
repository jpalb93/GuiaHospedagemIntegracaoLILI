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
                        // removed loading="eager" to avoid conflict with preload
                        // removed decoding="sync" to free up main thread
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

            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20 pt-24 md:pt-32">
                <div ref={textRef} className="max-w-4xl">
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                            Hospedagem <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                                em Petrolina
                            </span>
                        </h1>
                    </div>
                    {/* CSS Animation: Delay 150ms */}
                    <span
                        className="text-xl md:text-3xl font-light text-stone-300 block mt-6 mb-8"
                    >
                        Flat para hospedagem em Petrolina (Centro) – próximos a hospitais e orla.
                    </span>
                </div>

                {/* Schema LocalBusiness (LodgingBusiness) */}
                <script type="application/ld+json">
                    {`
                {
                    "@context": "https://schema.org",
                    "@type": "LodgingBusiness",
                    "name": "Flats Integração Petrolina (Centro)",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "R. São José, 475 B",
                        "addressLocality": "Petrolina",
                        "addressRegion": "PE",
                        "postalCode": "56302-270",
                        "addressCountry": "BR"
                    },
                    "telephone": "+5587988283273",
                    "description": "Flat mobiliado centro Petrolina próximo hospitais orla",
                    "url": "https://flatsintegracao.com.br",
                    "image": "https://flatsintegracao.com.br/hero-bg.jpg",
                    "priceRange": "$$"
                }
                `}
                </script>

                {/* Subheadline de Valor */}
                <p
                    className="text-lg md:text-xl text-stone-400 mb-6 max-w-2xl leading-relaxed border-l-4 border-orange-500 pl-6"
                >
                    Apartamentos completos que unem a liberdade de um lar ao serviço de uma
                    hospedagem profissional.
                </p>

                {/* Microcopy de Localização Rico */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 mb-10 text-stone-400 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-stone-200 font-bold bg-white/5 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Centro de Petrolina – PE
                    </div>
                    <span className="hidden md:block text-stone-500">•</span>
                    <span>
                        Próximo a hospitais, orla do São Francisco e principais vias de Petrolina.
                    </span>
                </div>

                {/* Botões de Ação - Alto Contraste */}
                {/* CSS Animation: Delay 300ms */}
                <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-stone-100 hover:bg-white text-stone-950 px-8 py-5 rounded-none text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Reservar Agora
                        <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </a>
                    <a
                        href="#galeria"
                        className="group bg-transparent border border-white/20 hover:border-white/50 text-stone-300 hover:text-white px-8 py-5 rounded-none text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center hover:bg-white/5"
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
