import { useRef, useEffect } from 'react';
import { Star, Quote, CheckCircle2, ArrowRight } from 'lucide-react';

const REAL_REVIEWS = [
    {
        name: 'Pedro',
        initials: 'P',
        country: 'Brasil',
        flag: '🇧🇷',
        rating: '10',
        date: '22 de março de 2026',
        tripType: 'Viajante individual',
        title: 'Foi muito boa, ótima localização e higiene.',
        comment:
            'Da pra duas pessoas tranquilamente, anfitriã também muito atenciosa. Muito limpa e organizada.',
    },
    {
        name: 'Gisele',
        initials: 'G',
        country: 'Brasil',
        flag: '🇧🇷',
        rating: '10',
        date: '13 de fevereiro de 2026',
        tripType: 'Viajante individual',
        title: 'Excepcional',
        comment: 'Super indico, muito limpo, boa localização, estrutura perfeita.',
    },
    {
        name: 'Edvanderson',
        initials: 'E',
        country: 'Brasil',
        flag: '🇧🇷',
        rating: '9,0',
        date: '4 de agosto de 2025',
        tripType: 'Viajante individual',
        title: 'Flat confortável e acolhedor próximo a Orla',
        comment:
            'O flat é bem confortável e acolhedor. Tem tudo o que você precisa, além do preço ser justo e convidativo. Fica próximo a Orla de Petrolina (uns 5 minutos a pé). Tem comércio próximo. Internet de boa qualidade e simpatia dos anfitriões...',
    },
] as const;

const ReputationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const scoreRef = useRef<HTMLSpanElement>(null);

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
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        },
                    });

                    tl.fromTo(
                        '.reputation-text',
                        { y: 18, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: 'power3.out',
                            clearProps: 'all',
                        }
                    );

                    tl.fromTo(
                        scoreRef.current,
                        { textContent: 0 },
                        {
                            textContent: 9.0,
                            duration: 1.1,
                            ease: 'power1.out',
                            snap: { textContent: 0.1 },
                            onUpdate: function () {
                                if (scoreRef.current) {
                                    scoreRef.current.innerHTML = parseFloat(
                                        this.targets()[0].textContent
                                    ).toFixed(1);
                                }
                            },
                        },
                        '-=0.4'
                    );

                    tl.fromTo(
                        '.review-card',
                        { y: 18, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.12,
                            ease: 'power2.out',
                            clearProps: 'all',
                        },
                        '-=0.4'
                    );
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    sectionRef.current
                        .querySelectorAll('.reputation-text, .review-card')
                        .forEach((el) => {
                            (el as HTMLElement).style.opacity = '1';
                            (el as HTMLElement).style.transform = 'none';
                        });
                }
                if (scoreRef.current) scoreRef.current.innerHTML = '9.0';
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
        <section ref={sectionRef} className="py-20 md:py-28 bg-[#12110F] text-stone-200">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-14">
                {/* Header com Nota do Booking */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center border-b border-white/10 pb-14">
                    <div className="lg:col-span-6 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5C98B]/10 border border-[#E5C98B]/25 text-[#E5C98B] text-xs font-semibold uppercase tracking-[0.18em]">
                            <Star size={12} className="fill-[#E5C98B]" />
                            Prova no Booking
                        </div>
                        <h2 className="reputation-text text-4xl md:text-5xl font-heading font-semibold text-white leading-[1.1] tracking-tight">
                            Nota 9.0:{' '}
                            <span className="text-stone-400 font-normal">quem ficou recomenda</span>
                        </h2>
                        <p className="reputation-text text-base md:text-lg text-stone-400 font-normal max-w-lg leading-relaxed">
                            Avaliações 100% autênticas de hóspedes que se hospedaram em nossos flats
                            em Petrolina através do Booking.com.
                        </p>
                    </div>

                    <div className="lg:col-span-6 flex lg:justify-end reputation-text">
                        <a
                            href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                            target="_blank"
                            rel="noreferrer"
                            className="group w-full max-w-md bg-[#1B1916] border border-white/10 hover:border-[#E5C98B]/40 p-8 md:p-10 rounded-3xl transition-all duration-300 shadow-2xl"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    ref={scoreRef}
                                    className="text-[6.5rem] md:text-[8rem] leading-none font-heading font-semibold text-white tracking-tighter group-hover:text-[#E5C98B] transition-colors"
                                >
                                    9.0
                                </span>
                                <Star
                                    className="w-7 h-7 mt-5 text-[#E5C98B] fill-[#E5C98B] shrink-0"
                                    aria-hidden
                                />
                            </div>
                            <div className="flex items-end justify-between mt-5 border-t border-white/10 pt-5 gap-4">
                                <div>
                                    <p className="uppercase text-xs tracking-[0.15em] font-semibold text-white">
                                        Excepcional
                                    </p>
                                    <p className="text-stone-400 text-xs mt-1">
                                        Avaliações públicas no Booking.com
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[#E5C98B] text-sm font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                                    Ver notas <ArrowRight size={14} aria-hidden />
                                </span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Depoimentos Reais dos Hóspedes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {REAL_REVIEWS.map((review, idx) => (
                        <div
                            key={idx}
                            className="review-card bg-[#1B1916] border border-white/10 hover:border-[#E5C98B]/30 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group opacity-100"
                        >
                            <Quote className="absolute top-5 right-5 text-white/[0.04] w-14 h-14 pointer-events-none" />

                            <div className="space-y-4 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#E5C98B]/15 text-[#E5C98B] border border-[#E5C98B]/30 flex items-center justify-center font-heading font-semibold text-sm shrink-0">
                                            {review.initials}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-heading font-semibold text-white text-base">
                                                    {review.name}
                                                </span>
                                                <span className="text-sm" title={review.country}>
                                                    {review.flag}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-stone-400 flex items-center gap-1">
                                                <CheckCircle2
                                                    size={11}
                                                    className="text-emerald-400"
                                                />
                                                Hóspede Verificado
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#E5C98B] text-[#141210] font-heading font-semibold text-xs px-3 py-1 rounded-full">
                                        {review.rating}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <h3 className="font-heading font-semibold text-white text-base leading-snug">
                                        "{review.title}"
                                    </h3>
                                    <p className="text-stone-300 text-sm font-normal leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>

                            <div className="pt-5 mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-stone-400 relative z-10">
                                <span>{review.date}</span>
                                <span>{review.tripType}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReputationSection;
