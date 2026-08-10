import { useRef, useEffect } from 'react';
import { Navigation } from 'lucide-react';

const LocationSection: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const textBlockRef = useRef<HTMLDivElement>(null);
    const mapBlockRef = useRef<HTMLDivElement>(null);

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
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });

                    tl.from(textBlockRef.current, {
                        x: -40,
                        opacity: 0,
                        duration: 0.8,
                        ease: 'power3.out',
                    }).from(
                        mapBlockRef.current,
                        {
                            opacity: 0,
                            duration: 0.8,
                            ease: 'power3.out',
                        },
                        '-=0.6'
                    );
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                if (textBlockRef.current) {
                    textBlockRef.current.style.opacity = '1';
                    textBlockRef.current.style.transform = 'none';
                }
                if (mapBlockRef.current) {
                    mapBlockRef.current.style.opacity = '1';
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
        <section ref={sectionRef} id="localizacao" className="py-0 bg-stone-950 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
                <div
                    ref={textBlockRef}
                    className="lg:col-span-5 bg-stone-900 p-10 md:p-16 flex flex-col justify-center relative z-20 text-white border-r border-stone-800"
                >
                    <div className="w-12 h-px bg-orange-500 mb-8" />

                    <p className="text-orange-500 font-heading font-bold tracking-[0.2em] uppercase text-xs mb-4">
                        Localização
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6 leading-tight tracking-tight">
                        Hospedagem no Centro de Petrolina
                    </h2>

                    <div className="space-y-5 mb-10 border-l border-stone-700 pl-5">
                        <p className="text-stone-200 font-light leading-relaxed text-lg">
                            R. São José, 475 B
                            <br />
                            Centro · Petrolina - PE · 56302-270
                        </p>
                        <p className="text-stone-400 font-light text-sm max-w-xs leading-relaxed">
                            Perto de hospitais, comércio e polos de trabalho. Menos tempo no
                            trânsito, mais na estadia.
                        </p>
                    </div>

                    <a
                        href="https://maps.app.goo.gl/sdcm2s9nYXXbew796"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 text-white font-bold uppercase text-xs tracking-[0.15em] hover:text-orange-500 transition-colors group mt-auto w-fit"
                    >
                        Abrir no Maps
                        <Navigation
                            size={16}
                            className="text-orange-500 group-hover:translate-x-0.5 transition-transform"
                            aria-hidden
                        />
                    </a>
                </div>

                <div ref={mapBlockRef} className="lg:col-span-7 relative h-[420px] lg:h-auto">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.538608226922!2d-40.505701!3d-9.395689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773708a0e3867ff%3A0x6a2c222c5e533c37!2sR.%20S%C3%A3o%20Jos%C3%A9%2C%20475%20B%20-%20Centro%2C%20Petrolina%20-%20PE%2C%2056302-270!5e0!3m2!1spt-BR!2sbr!4v1709664000000!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Mapa Flats Integração, R. São José, 475 B, Centro, Petrolina"
                        className="w-full h-full grayscale-[85%] hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-stone-900 to-transparent pointer-events-none hidden lg:block" />
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
