import { useRef, useEffect } from 'react';
import { Shield, Sparkles, UtensilsCrossed, Wifi } from 'lucide-react';
// GSAP dynamically imported

const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

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

            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 95%', // Antecipado para aparecer logo que entra
                            toggleActions: 'play none none reverse',
                        },
                    });

                    tl.fromTo(
                        '.feature-card',
                        { y: 20, opacity: 0 }, // Reduzido de 50 para 20
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.5, // Reduzido de 0.8 para 0.5
                            stagger: 0.1,  // Reduzido de 0.15 para 0.1
                            ease: 'power2.out',
                        }
                    );
                }, sectionRef);
            });

            // Mobile Fallback: Ensure visibility immediately
            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    const cards = sectionRef.current.querySelectorAll('.feature-card');
                    cards.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                }
            });
        };

        initGsap();

        return () => {
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

    return (
        <section ref={sectionRef} id="features" className="py-32 bg-stone-950">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-24 max-w-3xl">
                    <span className="text-orange-500 font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">
                        Comodidades & Estrutura
                    </span>
                    <h2 className="text-4xl md:text-6xl font-heading font-light text-white leading-[1.1] mb-8">
                        O Melhor Flat em Petrolina <br />
                        <span className="italic font-serif text-stone-500">para Sua Estadia</span>
                    </h2>
                    <div className="w-24 h-px bg-gradient-to-r from-orange-500 to-transparent"></div>
                </div>

                {/* Layout Editorial - Sem cards pesados, apenas linhas e tipografia */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-stone-800/50">
                    {[
                        {
                            num: '01',
                            title: 'Hospedagem com Conforto',
                            desc: 'Ar-condicionado split, roupas de cama premium e banheiros privativos para garantir a melhor hospedagem em Petrolina.',
                            icon: <Sparkles className="stroke-1 w-6 h-6" />
                        },
                        {
                            num: '02',
                            title: 'Flat em Petrolina com Cozinha',
                            desc: 'Cozinha completa com micro-ondas e utensílios. Ideal para quem busca um flat mobiliado em Petrolina com total autonomia.',
                            icon: <UtensilsCrossed className="stroke-1 w-6 h-6" />
                        },
                        {
                            num: '03',
                            title: 'Internet e Trabalho Remoto',
                            desc: 'Wi-Fi de alta velocidade e Smart TV. A estrutura perfeita para quem precisa de hospedagem em Petrolina para trabalho.',
                            icon: <Wifi className="stroke-1 w-6 h-6" />
                        },
                        {
                            num: '04',
                            title: 'Segurança em Petrolina',
                            desc: 'Monitoramento 24h e localização segura no Centro de Petrolina, garantindo tranquilidade em sua estadia.',
                            icon: <Shield className="stroke-1 w-6 h-6" />
                        }
                    ].map((feature, i) => (
                        <div key={i} className="feature-card group relative p-10 lg:p-12 border-b lg:border-b-0 lg:border-r border-stone-800/50 hover:bg-stone-900/30 transition-all duration-700">
                            {/* Número Serifado de Fundo */}
                            <span className="absolute top-8 right-10 text-6xl font-serif italic text-stone-900 group-hover:text-orange-950/20 transition-colors duration-700 select-none">
                                {feature.num}
                            </span>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="text-stone-500 group-hover:text-orange-500 transition-colors duration-500 mb-12">
                                    {feature.icon}
                                </div>
                                
                                <h3 className="text-xl font-heading font-medium text-white mb-6 leading-snug group-hover:translate-x-2 transition-transform duration-500">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-stone-400 font-light text-sm leading-relaxed max-w-[240px]">
                                    {feature.desc}
                                </p>

                                <div className="mt-auto pt-10">
                                    <div className="w-0 group-hover:w-full h-px bg-orange-500/50 transition-all duration-700"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
