import React, { useRef } from 'react';
import { Shield, Sparkles, UtensilsCrossed, Wifi } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FeaturesSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                });

                tl.fromTo(
                    '.feature-card',
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power2.out',
                    }
                );
            });

            // Mobile Fallback: Ensure visibility immediately
            mm.add('(max-width: 800px)', () => {
                gsap.set('.feature-card', { opacity: 1, y: 0 });
            });

            return () => mm.revert();
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} id="features" className="py-32 bg-stone-950">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-20 max-w-2xl">
                    <span className="text-stone-500 font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                        Comodidades
                    </span>
                    <h2 className="text-4xl md:text-5xl font-heading font-light text-white leading-tight">
                        Essencial & Sofisticado
                    </h2>
                </div>

                {/* Grid Clássico de 4 Colunas - Redesign Layered Luxury Dark */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16 border-t border-stone-800">
                    {/* Card 1: Conforto Total */}
                    <div className="feature-card group bg-stone-900 p-8 rounded-[2rem] border border-stone-800 hover:border-orange-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-500 shadow-sm mb-6 border border-stone-700/50">
                            <Sparkles className="stroke-1 w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-heading font-medium text-white mb-3 group-hover:text-orange-400 transition-colors">
                            Conforto Total
                        </h3>
                        <p className="text-stone-400 font-light text-sm leading-relaxed">
                            Ar-condicionado split em todas as unidades, roupas de cama premium e
                            banheiros privativos modernos.
                        </p>
                    </div>

                    {/* Card 2: Cozinha Equipada */}
                    <div className="feature-card group bg-stone-900 p-8 rounded-[2rem] border border-stone-800 hover:border-blue-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-blue-500 group-hover:scale-110 transition-all duration-500 shadow-sm mb-6 border border-stone-700/50">
                            <UtensilsCrossed className="stroke-1 w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-heading font-medium text-white mb-3 group-hover:text-blue-400 transition-colors">
                            Cozinha Equipada
                        </h3>
                        <p className="text-stone-400 font-light text-sm leading-relaxed">
                            Micro-ondas, mesa de jantar e utensílios completos. Prepare suas
                            refeições como se estivesse em casa.
                        </p>
                    </div>

                    {/* Card 3: Conectividade & Lazer */}
                    <div className="feature-card group bg-stone-900 p-8 rounded-[2rem] border border-stone-800 hover:border-green-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-green-500 group-hover:scale-110 transition-all duration-500 shadow-sm mb-6 border border-stone-700/50">
                            <Wifi className="stroke-1 w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-heading font-medium text-white mb-3 group-hover:text-green-400 transition-colors">
                            Conectividade & Lazer
                        </h3>
                        <p className="text-stone-400 font-light text-sm leading-relaxed">
                            Wi-Fi gratuito de alta velocidade e TV de tela plana para seu
                            entretenimento e trabalho remoto.
                        </p>
                    </div>

                    {/* Card 4: Segurança 24h */}
                    <div className="feature-card group bg-stone-900 p-8 rounded-[2rem] border border-stone-800 hover:border-purple-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                        <div className="w-14 h-14 bg-stone-800 rounded-2xl flex items-center justify-center text-stone-400 group-hover:text-purple-500 group-hover:scale-110 transition-all duration-500 shadow-sm mb-6 border border-stone-700/50">
                            <Shield className="stroke-1 w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-heading font-medium text-white mb-3 group-hover:text-purple-400 transition-colors">
                            Segurança 24h
                        </h3>
                        <p className="text-stone-400 font-light text-sm leading-relaxed">
                            Monitoramento por câmeras nas áreas comuns e extintores de incêndio para
                            sua tranquilidade.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
