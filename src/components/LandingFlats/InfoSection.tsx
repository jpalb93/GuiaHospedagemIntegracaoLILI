import { useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
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
                            Sua Hospedagem em Petrolina: <br />
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
                                        <span className="text-stone-500 text-sm italic">até 18:30</span>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

                                <div className="info-item group">
                                    <p className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-1 group-hover:text-orange-500 transition-colors">Saída (Check-out)</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-heading font-bold text-white">08:00</span>
                                        <span className="text-stone-500 text-sm italic">até 13:00</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                            <p className="text-xs text-stone-400 leading-relaxed italic">
                                <span className="text-orange-500 font-bold not-italic">Importante:</span> Informe seu horário de chegada previamente para garantirmos sua recepção.
                            </p>
                        </div>
                    </div>

                    {/* Rules Bento Block */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* No Smoking */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 12h3"/><path d="M18 10h3"/><path d="M18 14h3"/><path d="M7 15a3 3 0 1 1-3-3"/><path d="M11 12H7"/><path d="M21 12H15"/><path d="M11 14a3 3 0 0 1-3 3"/><path d="M11 10a3 3 0 0 0-3-3"/><path d="M21 15v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"/></svg>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Cigarro</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                É terminantemente proibido fumar nas áreas internas para preservar a qualidade e higiene dos flats.
                            </p>
                        </div>

                        {/* No Parties */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Eventos</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                Nossos flats são destinados ao descanso. Festas ou eventos de qualquer natureza não são permitidos.
                            </p>
                        </div>

                        {/* No Pets */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5.172C10 3.972 10.972 3 12.172 3c1.2 0 2.172.972 2.172 2.172v1.656C14.344 8.028 13.41 9 12.172 9c-1.238 0-2.172-.972-2.172-2.172V5.172z"/><path d="M21 16.5c0-1.933-1.567-3.5-3.5-3.5a3.486 3.486 0 0 0-2.5 1.072"/><path d="M21 16.5V21h-7v-3.5c0-1.381-1.119-2.5-2.5-2.5S9 16.119 9 17.5V21H2v-4.5C2 14.567 3.567 13 5.5 13a3.486 3.486 0 0 1 2.5 1.072"/></svg>
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Sem Pets</h4>
                            <p className="text-sm text-stone-400 leading-relaxed">
                                Infelizmente não aceitamos animais de estimação na propriedade para garantir o padrão de limpeza.
                            </p>
                        </div>

                        {/* Silence Law */}
                        <div className="info-item bg-stone-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-8 hover:border-orange-500/30 transition-all duration-500 group">
                            <div className="w-12 h-12 bg-stone-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/><path d="M12 7v5l3 3"/></svg>
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
