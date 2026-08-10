import { useRef, useEffect } from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const REAL_REVIEWS = [
    {
        name: 'Pedro',
        initials: 'P',
        avatarBg: 'bg-amber-600/30 text-amber-300 border-amber-500/40',
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
        avatarBg: 'bg-sky-600/30 text-sky-300 border-sky-500/40',
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
        avatarBg: 'bg-orange-600/30 text-orange-300 border-orange-500/40',
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
                            start: 'top 95%',
                            toggleActions: 'play none none none',
                        },
                    });

                    tl.fromTo(
                        '.reputation-text',
                        { y: 20, opacity: 0 },
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
                            duration: 1.2,
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
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.15,
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
        <section ref={sectionRef} className="py-24 md:py-32 bg-stone-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[400px] font-heading font-bold text-white/5 leading-none select-none -z-0 pointer-events-none">
                9
            </div>

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 space-y-16">
                {/* Header com Nota do Booking */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center border-b border-stone-800/80 pb-16">
                    <div className="lg:col-span-6 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-heading font-bold uppercase tracking-[0.2em]">
                            <Star size={12} className="fill-orange-400" />
                            Prova no Booking
                        </div>
                        <h2 className="reputation-text text-4xl md:text-6xl font-heading font-bold text-white leading-[1.1] tracking-tight">
                            Nota 9.0:{' '}
                            <span className="text-stone-500 font-medium">quem ficou recomenda</span>
                        </h2>
                        <p className="reputation-text text-lg text-stone-400 font-light max-w-lg leading-relaxed">
                            Avaliações 100% autênticas de hóspedes que se hospedaram em nossos flats
                            em Petrolina através do Booking.com.
                        </p>
                    </div>

                    <div className="lg:col-span-6 flex lg:justify-end reputation-text">
                        <a
                            href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                            target="_blank"
                            rel="noreferrer"
                            className="group w-full max-w-md bg-stone-900/60 border border-stone-800 hover:border-orange-500/40 p-8 md:p-10 rounded-[2rem] transition-all duration-500 shadow-xl hover:shadow-[0_10px_30px_rgba(249,115,22,0.15)]"
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    ref={scoreRef}
                                    className="text-[7rem] md:text-[8.5rem] leading-none font-heading font-medium text-white tracking-tighter group-hover:text-orange-500 transition-colors"
                                >
                                    9.0
                                </span>
                                <Star
                                    className="w-8 h-8 mt-6 text-orange-500 fill-orange-500 shrink-0"
                                    aria-hidden
                                />
                            </div>
                            <div className="flex items-end justify-between mt-4 border-t border-stone-800 pt-5 gap-4">
                                <div>
                                    <p className="uppercase text-xs tracking-[0.15em] font-bold text-stone-200">
                                        Excepcional
                                    </p>
                                    <p className="text-stone-500 text-xs mt-1">
                                        Avaliações públicas no Booking.com
                                    </p>
                                </div>
                                <span className="text-orange-500 text-sm font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                                    Ver notas →
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
                            className="review-card bg-stone-900/60 border border-stone-800 hover:border-orange-500/40 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl relative overflow-hidden group opacity-100"
                        >
                            {/* Watermark Quote Icon */}
                            <Quote className="absolute top-5 right-5 text-white/5 w-16 h-16 pointer-events-none group-hover:text-orange-500/10 transition-colors" />

                            <div className="space-y-4 relative z-10">
                                {/* Header do Hóspede */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-full ${review.avatarBg} border flex items-center justify-center font-heading font-bold text-sm shrink-0`}
                                        >
                                            {review.initials}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-heading font-bold text-white text-base">
                                                    {review.name}
                                                </span>
                                                <span className="text-sm" title={review.country}>
                                                    {review.flag}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-stone-500 flex items-center gap-1">
                                                <CheckCircle2
                                                    size={11}
                                                    className="text-emerald-500"
                                                />
                                                Hóspede Verificado
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-blue-600 text-white font-heading font-bold text-sm px-3 py-1 rounded-xl shadow-md">
                                        {review.rating}
                                    </div>
                                </div>

                                {/* Conteúdo do Depoimento */}
                                <div className="space-y-2 pt-2">
                                    <h3 className="font-heading font-bold text-stone-100 text-base leading-snug">
                                        "{review.title}"
                                    </h3>
                                    <p className="text-stone-300 text-sm font-light leading-relaxed">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>

                            {/* Rodapé com data e contexto */}
                            <div className="pt-6 mt-6 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500 relative z-10">
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
