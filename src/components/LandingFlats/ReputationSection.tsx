import { useRef, useState } from 'react';
import { Star, Quote, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDesktopGsap } from '../../hooks/useDesktopGsap';

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
    const [activeReview, setActiveReview] = useState(0);

    const featured = REAL_REVIEWS[activeReview];

    useDesktopGsap(sectionRef, (gsap) => {
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
                ease: 'power2.out',
                snap: { textContent: 0.1 },
                onUpdate: function () {
                    if (scoreRef.current) {
                        const val = parseFloat(this.targets()[0].textContent || '0').toFixed(1);
                        scoreRef.current.textContent = val;
                    }
                },
            },
            '-=0.4'
        );
    });

    return (
        <section
            ref={sectionRef}
            className="py-24 md:py-32 bg-[#12110F] text-stone-200 relative overflow-hidden"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/3 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(229,201,139,0.06)_0%,transparent_70%)]"
            />

            <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 space-y-12">
                {/* Palco Editorial Assimétrico: Placa 9.0 Monumental + Citação em Destaque */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    {/* Coluna Esquerda: Título + Troféu 9.0 Booking */}
                    <div className="lg:col-span-5 flex flex-col justify-between gap-8">
                        <div className="space-y-4">
                            <h2 className="reputation-text text-4xl md:text-5xl font-heading font-semibold text-white leading-[1.06] tracking-tight">
                                Nota 9.0:{' '}
                                <span className="text-stone-400 font-normal block sm:inline">
                                    quem ficou recomenda
                                </span>
                            </h2>
                            <p className="reputation-text text-base text-stone-400 font-normal leading-relaxed">
                                Avaliações reais de hóspedes que se hospedaram em nossos flats no
                                Centro de Petrolina pelo Booking.com.
                            </p>
                        </div>

                        <a
                            href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                            target="_blank"
                            rel="noreferrer"
                            className="reputation-text group relative overflow-hidden bg-[#171512] border border-[#E5C98B]/25 hover:border-[#E5C98B]/55 p-7 md:p-8 rounded-[28px] transition-all duration-500 shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
                        >
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(229,201,139,0.16)_0%,transparent_70%)]"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C98B]/60 to-transparent"
                            />

                            <div className="relative z-10 flex items-end justify-between gap-4">
                                <div className="flex items-start gap-2.5">
                                    <span
                                        ref={scoreRef}
                                        className="text-[5.25rem] sm:text-[6.25rem] leading-none font-heading font-semibold text-white tracking-tighter tabular-nums group-hover:text-[#E5C98B] transition-colors"
                                    >
                                        9.0
                                    </span>
                                    <Star
                                        className="w-6 h-6 mt-3 text-[#E5C98B] fill-[#E5C98B] shrink-0"
                                        aria-hidden
                                    />
                                </div>
                                <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#E5C98B] pb-2">
                                    / 10
                                </span>
                            </div>

                            {/* Barra arquitetônica de excelência */}
                            <div
                                className="relative z-10 mt-5 h-1 rounded-full bg-white/10 overflow-hidden"
                                aria-hidden="true"
                            >
                                <div className="h-full w-[90%] rounded-full bg-gradient-to-r from-[#9E6B2B] to-[#E5C98B]" />
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-5 pt-4 border-t border-white/10 gap-4">
                                <div>
                                    <p className="uppercase text-xs tracking-[0.18em] font-semibold text-white">
                                        Excepcional · Booking.com
                                    </p>
                                    <p className="text-stone-400 text-xs mt-0.5">
                                        Avaliações públicas verificadas
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[#E5C98B] text-xs font-semibold shrink-0 group-hover:translate-x-1 transition-transform">
                                    Ver notas <ArrowRight size={14} aria-hidden />
                                </span>
                            </div>
                        </a>
                    </div>

                    {/* Coluna Direita: Palco Spotlight do Depoimento em Tipografia de Revista */}
                    <div className="lg:col-span-7 bg-[#171512] border border-white/10 rounded-[30px] p-7 sm:p-10 md:p-12 flex flex-col justify-between gap-8 relative overflow-hidden shadow-2xl">
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C98B]/40 to-transparent"
                        />
                        <Quote
                            className="absolute top-8 right-8 text-[#E5C98B]/[0.07] w-20 h-20 pointer-events-none"
                            aria-hidden="true"
                        />

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between gap-4">
                                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                                    <CheckCircle2 size={14} aria-hidden="true" />
                                    Hóspede Verificado · Booking.com
                                </span>
                                <span className="bg-[#E5C98B] text-[#141210] font-heading font-semibold text-xs px-3.5 py-1 rounded-full tabular-nums">
                                    Nota {featured.rating}
                                </span>
                            </div>

                            <div key={featured.name} className="space-y-4">
                                <h3 className="text-2xl sm:text-3xl md:text-[32px] font-heading font-semibold text-white leading-[1.2] tracking-tight">
                                    &ldquo;{featured.title}&rdquo;
                                </h3>
                                <p className="text-stone-300 text-base sm:text-lg leading-relaxed font-normal max-w-2xl">
                                    {featured.comment}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5 relative z-10 pt-6 border-t border-white/10">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#E5C98B]/15 text-[#E5C98B] border border-[#E5C98B]/35 flex items-center justify-center font-heading font-semibold text-sm shrink-0">
                                        {featured.initials}
                                    </div>
                                    <div>
                                        <p className="font-heading font-semibold text-white text-sm">
                                            {featured.name} · {featured.tripType}
                                        </p>
                                        <p className="text-xs text-stone-400">{featured.date}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveReview(
                                                (activeReview - 1 + REAL_REVIEWS.length) %
                                                    REAL_REVIEWS.length
                                            )
                                        }
                                        aria-label="Avaliação anterior"
                                        className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setActiveReview(
                                                (activeReview + 1) % REAL_REVIEWS.length
                                            )
                                        }
                                        aria-label="Próxima avaliação"
                                        className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-white/[0.06] hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/10 flex items-center justify-center transition-colors"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Seletor rápido entre os 3 hóspedes reais */}
                            <div className="grid grid-cols-3 gap-2.5">
                                {REAL_REVIEWS.map((rev, idx) => {
                                    const selected = idx === activeReview;
                                    return (
                                        <button
                                            key={rev.name}
                                            type="button"
                                            onClick={() => setActiveReview(idx)}
                                            className={`text-left px-3.5 py-2.5 rounded-2xl border transition-all duration-300 ${
                                                selected
                                                    ? 'bg-[#E5C98B]/12 border-[#E5C98B]/45 text-white'
                                                    : 'bg-white/[0.02] border-white/10 hover:border-white/25 text-stone-400'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-heading font-semibold text-xs sm:text-sm truncate">
                                                    {rev.name}
                                                </span>
                                                <span className="text-[11px] font-mono text-[#E5C98B] tabular-nums">
                                                    {rev.rating}
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReputationSection;
