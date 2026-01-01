import React, { useRef } from 'react';
import { Navigation } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LocationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const mapBlockRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.from(textBlockRef.current, {
                x: -50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            }).from(
                mapBlockRef.current,
                {
                    x: 50,
                    opacity: 0,
                    duration: 1,
                    ease: 'power3.out',
                },
                '-=0.8'
            );
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} id="localizacao" className="py-0 bg-stone-950 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
                {/* Text Block - Anchored with background */}
                <div
                    ref={textBlockRef}
                    className="lg:col-span-5 bg-stone-900 p-12 md:p-20 flex flex-col justify-center relative z-20 text-white border-r border-stone-800"
                >
                    {/* Decorative detail */}
                    <div className="w-20 h-1 bg-orange-500 mb-10"></div>

                    <span className="text-stone-500 font-bold tracking-[0.2em] uppercase text-xs mb-8 block">
                        Localização
                    </span>
                    <h2 className="text-4xl lg:text-5xl font-heading font-light text-white mb-8 leading-none">
                        Petrolina <br />
                        <span className="italic font-serif text-stone-500">Centro</span>
                    </h2>

                    <div className="space-y-6 mb-12 border-l border-stone-700 pl-6">
                        <p className="text-stone-300 font-light leading-relaxed text-lg">
                            R. São José, 475 B <br />
                            Centro, 56302-270
                        </p>
                        <p className="text-stone-500 font-light text-sm max-w-xs">
                            No coração da cidade, onde tudo acontece. A conveniência de estar a
                            passos dos principais pontos de interesse.
                        </p>
                    </div>

                    <a
                        href="https://maps.app.goo.gl/cjGLg5TvgFE9mn2M7"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest hover:gap-6 transition-all duration-300 group mt-auto"
                    >
                        Ver no Mapa
                        <Navigation
                            size={16}
                            className="text-orange-500 group-hover:text-white transition-colors"
                        />
                    </a>
                </div>

                {/* Map Block - Integrated */}
                <div ref={mapBlockRef} className="lg:col-span-7 relative h-[500px] lg:h-auto">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.538608226922!2d-40.505701!3d-9.395689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773708a0e3867ff%3A0x6a2c222c5e533c37!2sR.%20S%C3%A3o%20Jos%C3%A9%2C%20475%20B%20-%20Centro%2C%20Petrolina%20-%20PE%2C%2056302-270!5e0!3m2!1spt-BR!2sbr!4v1709664000000!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa Flats Integração"
                        className="w-full h-full grayscale-[90%] hover:grayscale-0 transition-all duration-700"
                    ></iframe>

                    {/* Shadow overlay para conectar com o bloco de texto visualmente */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-stone-900 to-transparent pointer-events-none hidden lg:block"></div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
