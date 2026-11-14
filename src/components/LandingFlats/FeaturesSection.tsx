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
                    gsap.from('.feature-stage', {
                        y: 16,
                        duration: 0.55,
                        stagger: 0.08,
                        ease: 'power3.out',
                        clearProps: 'transform',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 95%',
                            toggleActions: 'play none none none',
                        },
                    });
                }, sectionRef);
            });
        };

        initGsap();

        return () => {
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="features"
            className="relative z-20 -mt-[16dvh] md:-mt-[22dvh] motion-reduce:mt-0 rounded-t-[28px] md:rounded-t-[40px] border-t border-white/60 pt-14 md:pt-20 pb-20 md:pb-24 bg-[#F5F2EB] text-[#181614] scroll-mt-16"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-12 md:space-y-14">
                <div className="feature-stage grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end">
                    <div className="lg:col-span-7">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold text-[#181614] leading-[1.06] tracking-tight">
                            Hotel cobra à parte.
                            <br />
                            <span className="text-[#9E6B2B]">Aqui já vem no flat.</span>
                        </h2>
                    </div>
                    <div className="lg:col-span-5">
                        <p className="text-[#5C564E] text-base md:text-lg font-normal leading-relaxed">
                            Hospedagem em Petrolina no Centro, mobiliada de verdade. Você cozinha,
                            trabalha e dorme bem, sem diária inchada de intermediário.
                        </p>
                    </div>
                </div>

                {/* Spread editorial: foto grande + coluna de momentos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
                    <article className="feature-stage group relative lg:col-span-7 min-h-[420px] md:min-h-[560px] rounded-3xl overflow-hidden bg-[#1B1916]">
                        <img
                            src="/assets/gallery/gallery-2.webp"
                            alt="Hospedagem em Petrolina: sala e estar do flat no Centro"
                            width={1200}
                            height={900}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/95 via-[#12110F]/35 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-8 md:p-11 space-y-3">
                            <p className="text-white text-3xl md:text-4xl font-heading font-semibold tracking-tight">
                                Cozinha completa
                            </p>
                            <p className="text-stone-200/90 text-base font-normal max-w-md leading-relaxed">
                                Frigobar, micro-ondas, utensílios. Café e janta no flat: você
                                economiza o que o hotel gasta em room service.
                            </p>
                        </div>
                    </article>

                    <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6">
                        <article className="feature-stage group relative flex-1 min-h-[250px] md:min-h-[270px] rounded-3xl overflow-hidden bg-[#1B1916]">
                            <img
                                src="/assets/gallery/gallery-4.webp"
                                alt="Quarto da hospedagem Flats Integração em Petrolina"
                                width={800}
                                height={600}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/95 via-[#12110F]/40 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-7 md:p-8 space-y-2">
                                <p className="text-white text-2xl md:text-3xl font-heading font-semibold tracking-tight">
                                    Quarto de verdade
                                </p>
                                <p className="text-stone-200/90 text-sm md:text-base font-normal leading-relaxed">
                                    Ar split, cama arrumada, banheiro só seu. Descanso sem cara de
                                    passagem.
                                </p>
                            </div>
                        </article>

                        <article className="feature-stage flex-1 bg-white border border-[#E5E0D5] rounded-3xl p-7 md:p-8 flex flex-col justify-between gap-6">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-[#9E6B2B] text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                                        Trabalho &amp; noite
                                    </p>
                                    <p className="text-[#181614] text-2xl font-heading font-semibold tracking-tight">
                                        Fibra + Smart TV
                                    </p>
                                    <p className="text-[#5C564E] text-sm mt-2 leading-relaxed">
                                        Reunião de manhã, série à noite. Mesma unidade, zero
                                        improvisação.
                                    </p>
                                </div>
                                <div className="h-px bg-[#E5E0D5]" />
                                <div>
                                    <p className="text-[#181614] text-2xl font-heading font-semibold tracking-tight">
                                        Centro monitorado
                                    </p>
                                    <p className="text-[#5C564E] text-sm mt-2 leading-relaxed">
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
