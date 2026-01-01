import React, { useRef } from 'react';
import { Clock, UserCheck } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InfoSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo(
                cardRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    ease: 'power3.out',
                }
            ).fromTo(
                '.info-item',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=0.8'
            );
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} className="py-24 bg-stone-950 relative overflow-hidden">
            {/* Decorative Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#44403c_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

            <div className="container mx-auto px-6 md:px-12 max-w-6xl relative z-10">
                {/* Header Integrado */}
                <div className="text-center mb-16">
                    <span className="text-xs font-bold tracking-[0.2em] text-stone-500 uppercase">
                        Informações
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-light text-white mt-3">
                        Detalhes da Estadia
                    </h2>
                </div>

                {/* Paper Card Container Dark */}
                <div
                    ref={cardRef}
                    className="bg-stone-900 p-10 md:p-20 rounded-[2.5rem] shadow-2xl shadow-black/50 border border-stone-800"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 relative">
                        {/* Divider vertical desktop */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-stone-800"></div>

                        {/* Column 1: Times */}
                        <div className="space-y-12">
                            <div className="info-item flex items-center gap-4 text-white">
                                <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
                                    <Clock className="stroke-1 w-6 h-6 text-stone-400" />
                                </div>
                                <h3 className="text-lg font-serif italic text-xl text-stone-300">
                                    Check-in & Out
                                </h3>
                            </div>

                            <div className="space-y-8 pl-4 border-l border-stone-800">
                                <div className="info-item flex justify-between items-end border-b border-stone-800 pb-2 border-dashed">
                                    <span className="text-sm tracking-widest uppercase text-stone-500 font-bold">
                                        Chegada
                                    </span>
                                    <span className="font-heading text-2xl text-white">
                                        15:00{' '}
                                        <span className="text-sm text-stone-500 font-sans">
                                            - 18:30
                                        </span>
                                    </span>
                                </div>

                                <div className="info-item flex justify-between items-end border-b border-stone-800 pb-2 border-dashed">
                                    <span className="text-sm tracking-widest uppercase text-stone-500 font-bold">
                                        Saída
                                    </span>
                                    <span className="font-heading text-2xl text-white">
                                        08:00{' '}
                                        <span className="text-sm text-stone-500 font-sans">
                                            - 13:00
                                        </span>
                                    </span>
                                </div>

                                <p className="info-item text-xs text-stone-500 italic text-right mt-2 flex items-center justify-end gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{' '}
                                    Por favor, informe seu horário.
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Policies */}
                        <div className="space-y-12">
                            <div className="info-item flex items-center gap-4 text-white">
                                <div className="p-3 bg-stone-800 rounded-xl border border-stone-700">
                                    <UserCheck className="stroke-1 w-6 h-6 text-stone-400" />
                                </div>
                                <h3 className="text-lg font-serif italic text-xl text-stone-300">
                                    Políticas do Flat
                                </h3>
                            </div>

                            <ul className="space-y-6">
                                <li className="info-item flex items-start gap-4 group p-4 hover:bg-stone-800 rounded-xl transition-colors duration-300 -mx-4 cursor-default border border-transparent hover:border-stone-700/50">
                                    <span className="w-2 h-2 rounded-full bg-stone-600 mt-2 group-hover:bg-red-500 transition-colors"></span>
                                    <span className="text-stone-400 font-light group-hover:text-stone-200 transition-colors">
                                        Proibido fumar em áreas internas.
                                    </span>
                                </li>
                                <li className="info-item flex items-start gap-4 group p-4 hover:bg-stone-800 rounded-xl transition-colors duration-300 -mx-4 cursor-default border border-transparent hover:border-stone-700/50">
                                    <span className="w-2 h-2 rounded-full bg-stone-600 mt-2 group-hover:bg-red-500 transition-colors"></span>
                                    <span className="text-stone-400 font-light group-hover:text-stone-200 transition-colors">
                                        Não são permitidas festas ou eventos.
                                    </span>
                                </li>
                                <li className="info-item flex items-start gap-4 group p-4 hover:bg-stone-800 rounded-xl transition-colors duration-300 -mx-4 cursor-default border border-transparent hover:border-stone-700/50">
                                    <span className="w-2 h-2 rounded-full bg-stone-600 mt-2 group-hover:bg-red-500 transition-colors"></span>
                                    <span className="text-stone-400 font-light group-hover:text-stone-200 transition-colors">
                                        Pets não são permitidos.
                                    </span>
                                </li>
                                <li className="info-item flex items-start gap-4 group p-4 hover:bg-stone-800 rounded-xl transition-colors duration-300 -mx-4 cursor-default border border-transparent hover:border-stone-700/50">
                                    <span className="w-2 h-2 rounded-full bg-stone-600 mt-2 group-hover:bg-blue-500 transition-colors"></span>
                                    <span className="text-stone-400 font-light group-hover:text-stone-200 transition-colors">
                                        Lei do Silêncio: 21:00 às 07:00.
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InfoSection;
