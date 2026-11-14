import { useRef, useEffect } from 'react';
import { Navigation } from 'lucide-react';

const RADAR_SPOTS = [
    {
        destination: 'Complexo Médico & Hospitais',
        time: '3 min',
        desc: 'Próximo ao Hospital Unimed, Neurocárdio e clínicas',
    },
    {
        destination: 'Orla do Rio São Francisco',
        time: '4 min',
        desc: 'Passeios de barco, barquinha e pôr do sol',
    },
    {
        destination: 'Bodódromo (Polo Gastronômico)',
        time: '8 min',
        desc: 'Restaurantes de carne de sol e culinária regional',
    },
    {
        destination: 'Aeroporto Senador Nilo Coelho',
        time: '15 min',
        desc: 'Acesso direto pelas avenidas principais',
    },
] as const;

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
                    gsap.from([textBlockRef.current, mapBlockRef.current], {
                        y: 16,
                        duration: 0.6,
                        stagger: 0.12,
                        ease: 'power3.out',
                        clearProps: 'transform',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 92%',
                            toggleActions: 'play none none none',
                        },
                    });
                }, sectionRef);
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
            id="localizacao"
            className="py-20 md:py-28 bg-[#F5F2EB] text-[#181614] relative"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-12">
                {/* Header unificado: Localização + Radar de Distâncias */}
                <div
                    id="localizacao-radar"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-end border-b border-[#E5E0D5] pb-10"
                >
                    <div className="lg:col-span-7 space-y-3">
                        <p className="text-[#9E6B2B] font-semibold tracking-[0.18em] uppercase text-xs">
                            Localização · Radar de Distâncias
                        </p>
                        <h2 className="text-3xl sm:text-5xl font-heading font-semibold text-[#181614] leading-[1.08] tracking-tight">
                            Localização Estratégica em Petrolina
                        </h2>
                    </div>
                    <div className="lg:col-span-5">
                        <p className="text-[#5C564E] text-base md:text-lg font-normal leading-relaxed">
                            Calcule o tempo de deslocamento a partir do Centro para os principais
                            pontos da cidade.
                        </p>
                    </div>
                </div>

                {/* Split: Endereço + Tempos de Deslocamento | Mapa */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    <div
                        ref={textBlockRef}
                        className="lg:col-span-5 flex flex-col justify-between gap-8"
                    >
                        {/* Bloco de Endereço */}
                        <div className="bg-white border border-[#E5E0D5] rounded-3xl p-7 md:p-8 space-y-5 shadow-sm">
                            <h3 className="text-2xl font-heading font-semibold text-[#181614] leading-tight tracking-tight">
                                Hospedagem no Centro de Petrolina
                            </h3>
                            <div className="space-y-3 border-l-2 border-[#9E6B2B] pl-4">
                                <p className="text-[#181614] font-medium leading-relaxed text-base">
                                    R. São José, 475 B
                                    <br />
                                    Centro · Petrolina - PE · 56302-270
                                </p>
                                <p className="text-[#5C564E] font-normal text-sm leading-relaxed">
                                    Perto de hospitais, comércio e polos de trabalho. Menos tempo no
                                    trânsito, mais na estadia.
                                </p>
                            </div>
                            <a
                                href="https://maps.app.goo.gl/sdcm2s9nYXXbew796"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 bg-[#141210] hover:bg-[#2a2622] text-white font-medium text-xs uppercase tracking-[0.14em] px-5 py-3 rounded-full transition-colors group w-fit"
                            >
                                Abrir no Maps
                                <Navigation
                                    size={14}
                                    className="text-[#E5C98B] group-hover:translate-x-0.5 transition-transform"
                                    aria-hidden
                                />
                            </a>
                        </div>

                        {/* Lista Radar de Distâncias */}
                        <div className="divide-y divide-[#E5E0D5] border-y border-[#E5E0D5]">
                            {RADAR_SPOTS.map((spot) => (
                                <div
                                    key={spot.destination}
                                    className="py-4 flex items-start justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <h4 className="font-heading font-semibold text-base text-[#181614]">
                                            {spot.destination}
                                        </h4>
                                        <p className="text-[#5C564E] text-xs md:text-sm leading-relaxed">
                                            {spot.desc}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs font-mono font-semibold bg-[#141210] text-[#E5C98B] px-3 py-1 rounded-full">
                                        {spot.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        ref={mapBlockRef}
                        className="lg:col-span-7 relative min-h-[420px] lg:min-h-[540px] rounded-3xl overflow-hidden border border-[#E5E0D5] shadow-sm bg-[#E5E0D5]"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3935.538608226922!2d-40.505701!3d-9.395689!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x773708a0e3867ff%3A0x6a2c222c5e533c37!2sR.%20S%C3%A3o%20Jos%C3%A9%2C%20475%20B%20-%20Centro%2C%20Petrolina%20-%20PE%2C%2056302-270!5e0!3m2!1spt-BR!2sbr!4v1709664000000!5m2!1spt-BR!2sbr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa Flats Integração, R. São José, 475 B, Centro, Petrolina"
                            className="w-full h-full min-h-[420px]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocationSection;
