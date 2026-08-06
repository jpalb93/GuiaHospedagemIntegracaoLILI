import { useRef, useEffect } from 'react';
import { Clock, CigaretteOff, PartyPopper, PawPrint, VolumeX } from 'lucide-react';
// GSAP dynamically imported

const InfoSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

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
                            start: 'top 92%',
                            toggleActions: 'play none none reverse',
                        },
                    });

                    tl.fromTo(
                        cardRef.current,
                        { y: 20, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.6,
                            ease: 'power3.out',
                        }
                    ).fromTo(
                        '.info-item',
                        { y: 15, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.1,
                            ease: 'power2.out',
                        },
                        '-=0.4'
                    );
                }, sectionRef);
            });

            // Mobile Fallback: Ensure visibility immediately
            mm.add('(max-width: 800px)', () => {
                if (cardRef.current) {
                    cardRef.current.style.opacity = '1';
                    cardRef.current.style.transform = 'translateY(0)';
                    const items = sectionRef.current?.querySelectorAll('.info-item');
                    items?.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                }
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
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold tracking-[0.2em] text-orange-500 uppercase mb-4">
                            Regras e Detalhes
                        </span>
                        <h2 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight">
                            Sua Hospedagem em Petrolina:{" "}<br />
                            <span className="text-stone-500">O que você precisa saber</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Check-in / Out Bento Block */}
                    <div 
                        ref={cardRef}
                        className="lg:col-span-1 bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 flex flex-col justify-between"
                    >
                        <div className="space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
                                    <Clock size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Horários</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="info-item group">
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">Entrada (Check-in)</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-heading font-bold text-white">15:00</span>
                                        <span className="text-stone-500 text-sm italic">a partir das 15h</span>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

                                <div className="info-item group">
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">Saída (Check-out)</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-heading font-bold text-white">13:00</span>
                                        <span className="text-stone-500 text-sm italic">até as 13h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                            <p className="text-xs text-stone-400 leading-relaxed">
                                <span className="text-orange-500 font-bold">Early check-in ou Late check-out:</span> Valor a combinar mediante disponibilidade e cobrança de taxa adicional.
                            </p>
                        </div>
                    </div>

                    {/* Rules Bento Block */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* No Smoking */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <CigaretteOff className="w-6 h-6 text-stone-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Cigarro</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                É terminantemente proibido fumar nas áreas internas para preservar a qualidade e higiene dos flats.
                            </p>
                        </div>

                        {/* No Parties */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <PartyPopper className="w-6 h-6 text-stone-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Eventos</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                Nossos flats são destinados ao descanso. Festas ou eventos de qualquer natureza não são permitidos.
                            </p>
                        </div>

                        {/* No Pets */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <PawPrint className="w-6 h-6 text-stone-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Pets</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                Infelizmente não aceitamos animais de estimação na propriedade para garantir o padrão de limpeza.
                            </p>
                        </div>

                        {/* Silence Law */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <VolumeX className="w-6 h-6 text-stone-300 group-hover:text-orange-500 transition-colors" />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Lei do Silêncio</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                Respeitamos o descanso de todos. Silêncio absoluto obrigatório entre as 21:00 e as 07:00.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
