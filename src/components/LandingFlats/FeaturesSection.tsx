import { useRef, useEffect } from 'react';

const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

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
                    gsap.fromTo(
                        '.feature-stage',
                        { y: 24, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.7,
                            stagger: 0.12,
                            ease: 'power3.out',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top 88%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                sectionRef.current?.querySelectorAll('.feature-stage').forEach((el) => {
                    (el as HTMLElement).style.opacity = '1';
                    (el as HTMLElement).style.transform = 'translateY(0)';
                });
            });
        };

        initGsap();

        return () => {
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-20 md:py-28 bg-stone-950">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-10 md:space-y-14">
                <div className="feature-stage max-w-4xl space-y-5">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.05] tracking-tight">
                        Hotel cobra à parte.
                        <br />
                        <span className="text-orange-500">Aqui já vem no flat.</span>
                    </h2>
                    <p className="text-stone-400 text-lg md:text-xl font-light max-w-2xl leading-relaxed">
                        Hospedagem em Petrolina no Centro, mobiliada de verdade. Você cozinha,
                        trabalha e dorme bem, sem diária inchada de intermediário.
                    </p>
                </div>

                {/* Spread editorial: foto grande + coluna de momentos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
                    <article className="feature-stage group relative lg:col-span-7 min-h-[420px] md:min-h-[560px] overflow-hidden bg-stone-900">
                        <img
                            src="/assets/gallery/gallery-2.webp"
                            alt="Hospedagem em Petrolina: sala e estar do flat no Centro"
                            width={1200}
                            height={900}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 space-y-3">
                            <p className="text-white text-3xl md:text-5xl font-heading font-bold tracking-tight">
                                Cozinha completa
                            </p>
                            <p className="text-stone-300 text-base md:text-lg font-light max-w-md leading-relaxed">
                                Frigobar, micro-ondas, utensílios. Café e janta no flat: você
                                economiza o que o hotel gasta em room service.
                            </p>
                        </div>
                    </article>

                    <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
                        <article className="feature-stage group relative flex-1 min-h-[240px] md:min-h-0 overflow-hidden bg-stone-900">
                            <img
                                src="/assets/gallery/gallery-4.webp"
                                alt="Quarto da hospedagem Flats Integração em Petrolina"
                                width={800}
                                height={600}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-7 md:p-8 space-y-2">
                                <p className="text-white text-2xl md:text-3xl font-heading font-bold tracking-tight">
                                    Quarto de verdade
                                </p>
                                <p className="text-stone-300 text-sm md:text-base font-light leading-relaxed">
                                    Ar split, cama arrumada, banheiro só seu. Descanso sem cara de
                                    passagem.
                                </p>
                            </div>
                        </article>

                        <article className="feature-stage flex-1 bg-stone-900 border border-stone-800 p-7 md:p-9 flex flex-col justify-between gap-8 min-h-[220px]">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-orange-500 text-xs font-heading font-bold uppercase tracking-[0.2em] mb-2">
                                        Trabalho &amp; noite
                                    </p>
                                    <p className="text-white text-2xl font-heading font-bold tracking-tight">
                                        Fibra + Smart TV
                                    </p>
                                    <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                                        Reunião de manhã, série à noite. Mesma unidade, zero
                                        improvisação.
                                    </p>
                                </div>
                                <div className="h-px bg-stone-800" />
                                <div>
                                    <p className="text-white text-2xl font-heading font-bold tracking-tight">
                                        Centro monitorado
                                    </p>
                                    <p className="text-stone-400 text-sm mt-2 leading-relaxed">
                                        24h de acompanhamento. Hospitais, comércio e polos de
                                        serviço a poucos minutos.
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
