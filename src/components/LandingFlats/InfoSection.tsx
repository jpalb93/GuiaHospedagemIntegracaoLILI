import { useRef, useEffect } from 'react';
import { Clock, CigaretteOff, PartyPopper, PawPrint, VolumeX } from 'lucide-react';

const RULES = [
    {
        icon: CigaretteOff,
        title: 'Sem cigarro',
        body: 'Proibido fumar nas áreas internas. Assim preservamos a higiene e o padrão do flat.',
    },
    {
        icon: PartyPopper,
        title: 'Sem eventos',
        body: 'Espaço para descanso e trabalho. Festas ou eventos não são permitidos.',
    },
    {
        icon: PawPrint,
        title: 'Sem pets',
        body: 'Não aceitamos animais de estimação, para manter limpeza e enxoval consistentes.',
    },
    {
        icon: VolumeX,
        title: 'Lei do silêncio',
        body: 'Silêncio entre 21h e 7h, por respeito ao descanso de todos os hóspedes.',
    },
] as const;

const InfoSection: React.FC = () => {
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
                        '.info-reveal',
                        { y: 16, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5,
                            stagger: 0.08,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: sectionRef.current,
                                start: 'top 90%',
                                toggleActions: 'play none none reverse',
                            },
                        }
                    );
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                sectionRef.current?.querySelectorAll('.info-reveal').forEach((el) => {
                    (el as HTMLElement).style.opacity = '1';
                    (el as HTMLElement).style.transform = 'translateY(0)';
                });
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
        <section
            ref={sectionRef}
            id="info"
            className="py-24 md:py-32 bg-stone-950 relative overflow-hidden"
        >
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 space-y-16">
                <div className="info-reveal max-w-2xl space-y-4 border-b border-stone-800 pb-10">
                    <p className="text-orange-500 font-heading font-bold text-xs uppercase tracking-[0.2em]">
                        Antes de reservar
                    </p>
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-[1.1] tracking-tight">
                        Horários e regras da hospedagem
                    </h2>
                    <p className="text-stone-400 text-base md:text-lg leading-relaxed max-w-xl">
                        Informações práticas para planejar sua estadia em Petrolina, sem surpresa na
                        chegada.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="info-reveal lg:col-span-4 space-y-8">
                        <div className="flex items-center gap-3">
                            <Clock size={22} className="text-orange-500 stroke-1" aria-hidden />
                            <h3 className="text-xl font-heading font-medium text-white">
                                Horários
                            </h3>
                        </div>

                        <div className="space-y-6 border-t border-stone-800 pt-6">
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                                    Check-in
                                </p>
                                <p className="text-4xl font-heading font-bold text-white">15:00</p>
                                <p className="text-stone-500 text-sm mt-1">A partir das 15h</p>
                            </div>
                            <div className="h-px w-full bg-stone-800" />
                            <div>
                                <p className="text-xs font-bold text-stone-500 uppercase tracking-[0.15em] mb-2">
                                    Check-out
                                </p>
                                <p className="text-4xl font-heading font-bold text-white">13:00</p>
                                <p className="text-stone-500 text-sm mt-1">Até as 13h</p>
                            </div>
                        </div>

                        <p className="text-sm text-stone-400 leading-relaxed border-l-2 border-orange-500/40 pl-4">
                            <span className="text-stone-200 font-medium">Early / late:</span> valor
                            a combinar conforme disponibilidade.
                        </p>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 border-t border-stone-800">
                        {RULES.map((rule, i) => (
                            <div
                                key={rule.title}
                                className={`info-reveal py-8 sm:px-6 space-y-4 ${
                                    i % 2 === 0 ? 'sm:border-r border-stone-800' : ''
                                } ${i < 2 ? 'border-b border-stone-800' : ''}`}
                            >
                                <rule.icon
                                    size={22}
                                    className="text-orange-500 stroke-1"
                                    aria-hidden
                                />
                                <h4 className="text-lg font-heading font-medium text-white">
                                    {rule.title}
                                </h4>
                                <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
                                    {rule.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
