import { useRef, useEffect } from 'react';
import { Star, MapPin, ShieldCheck, Heart } from 'lucide-react';
// GSAP dynamically imported

const ReputationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const scoreRef = useRef<HTMLSpanElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: any;
        let mm: any;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();

            // Desktop Animation
            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 70%',
                            toggleActions: 'play none none reverse',
                        },
                    });

                    // 1. Reveal Text & Headline
                    tl.from('.reputation-text', {
                        y: 50,
                        opacity: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power3.out',
                    });

                    // 2. Animate Score Number (Count up)
                    tl.from(
                        scoreRef.current,
                        {
                            textContent: 0,
                            duration: 2,
                            ease: 'power1.out',
                            snap: { textContent: 0.1 },
                            stagger: 1,
                            onUpdate: function () {
                                if (scoreRef.current) {
                                    scoreRef.current.innerHTML = parseFloat(
                                        this.targets()[0].textContent
                                    ).toFixed(1);
                                }
                            },
                        },
                        '-=0.5'
                    );

                    // 3. Reveal Bottom Values
                    tl.from(
                        '.reputation-value',
                        {
                            y: 30,
                            opacity: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: 'power2.out',
                        },
                        '-=1.5'
                    );
                }, sectionRef);
            });

            // Mobile Fallback
            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    const texts = sectionRef.current.querySelectorAll('.reputation-text');
                    const values = sectionRef.current.querySelectorAll('.reputation-value');
                    texts.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                    values.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
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
        <section ref={sectionRef} className="py-32 bg-stone-950 relative overflow-hidden">
            {/* Decorative Background Number */}
            <div className="absolute top-0 right-0 text-[400px] font-heading font-bold text-white/5 leading-none select-none -z-0 pointer-events-none">
                9
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div
                    ref={contentRef}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-b border-stone-800 pb-20"
                >
                    {/* Editorial Headline */}
                    <div className="lg:col-span-6">
                        <span className="reputation-text text-stone-400 font-bold tracking-[0.2em] uppercase text-xs mb-6 block">
                            Experiência
                        </span>
                        <h2 className="reputation-text text-5xl md:text-7xl font-heading font-light text-white leading-tight tracking-tight mb-8">
                            Aprovado por <br />
                            <span className="italic font-serif text-stone-400">quem viveu.</span>
                        </h2>
                        <p className="reputation-text text-xl text-stone-400 font-light max-w-lg leading-relaxed">
                            A excelência não é um ato, mas um hábito. Nossa pontuação reflete o
                            compromisso diário com seu conforto absoluto.
                        </p>
                    </div>

                    {/* Framed Score Card */}
                    <div className="lg:col-span-6 flex justify-end reputation-text">
                        <a
                            href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                            target="_blank"
                            rel="noreferrer"
                            className="group relative bg-stone-900/50 backdrop-blur-md p-10 rounded-[2.5rem] shadow-2xl shadow-black/50 hover:shadow-orange-900/20 hover:-translate-y-2 transition-all duration-500 border border-white/5 hover:border-orange-500/30"
                        >
                            <div className="flex items-start gap-4">
                                <span
                                    ref={scoreRef}
                                    className="text-[140px] leading-none font-heading font-medium text-white tracking-tighter group-hover:text-orange-500 transition-colors"
                                >
                                    9.0
                                </span>
                                <div className="pt-8">
                                    <Star className="w-10 h-10 text-orange-500 fill-orange-500 animate-pulse" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 border-t border-stone-800 pt-6">
                                <div className="flex flex-col">
                                    <span className="uppercase text-sm tracking-widest font-bold text-stone-200">
                                        Excepcional
                                    </span>
                                    <span className="text-stone-400 text-xs mt-1">
                                        Baseado em avaliações reais
                                    </span>
                                </div>
                                <span className="text-stone-400 text-sm italic group-hover:text-orange-400 transition-colors">
                                    Ver no Booking &rarr;
                                </span>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Values Layout - Clean & Dividers */}
                <div className="grid grid-cols-1 md:grid-cols-3 pt-16 gap-12">
                    <div className="reputation-value space-y-4">
                        <div className="w-full h-px bg-stone-800 mb-6"></div>
                        <h3 className="text-lg font-heading font-medium text-stone-200 flex items-center gap-3">
                            <MapPin className="stroke-1 text-stone-400" size={20} /> Localização
                        </h3>
                        <p className="text-stone-400 font-light leading-relaxed text-sm">
                            No epicentro de Petrolina. A poucos passos de tudo o que importa,
                            mantendo a privacidade que você precisa.
                        </p>
                    </div>

                    <div className="reputation-value space-y-4">
                        <div className="w-full h-px bg-stone-800 mb-6"></div>
                        <h3 className="text-lg font-heading font-medium text-stone-200 flex items-center gap-3">
                            <ShieldCheck className="stroke-1 text-stone-400" size={20} />{' '}
                            Privacidade & Segurança
                        </h3>
                        <p className="text-stone-400 font-light leading-relaxed text-sm">
                            Monitoramento discreto e sistemas de segurança de última geração para
                            sua total tranquilidade.
                        </p>
                    </div>

                    <div className="reputation-value space-y-4">
                        <div className="w-full h-px bg-stone-800 mb-6"></div>
                        <h3 className="text-lg font-heading font-medium text-stone-200 flex items-center gap-3">
                            <Heart className="stroke-1 text-stone-400" size={20} /> Conforto Premium
                        </h3>
                        <p className="text-stone-400 font-light leading-relaxed text-sm">
                            Cada detalhe, do lençol ao chuveiro, pensado para proporcionar uma
                            experiência de descanso superior.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReputationSection;
