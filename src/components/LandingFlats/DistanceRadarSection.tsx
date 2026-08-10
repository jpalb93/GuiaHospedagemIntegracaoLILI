import React from 'react';
import { Navigation } from 'lucide-react';

const DistanceRadarSection: React.FC = () => {
    const spots = [
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
    ];

    return (
        <section id="localizacao-radar" className="py-20 md:py-28 bg-stone-950">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-10 md:space-y-14">
                <div className="space-y-4 max-w-3xl">
                    <p className="text-orange-500 text-xs font-heading font-bold uppercase tracking-[0.2em]">
                        Radar de Distâncias
                    </p>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-[1.08] tracking-tight">
                        Localização Estratégica em Petrolina
                    </h2>
                    <p className="text-stone-400 text-lg md:text-xl font-light leading-relaxed">
                        Calcule o tempo de deslocamento a partir do Centro para os principais pontos
                        da cidade.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {spots.map((spot, idx) => (
                        <div
                            key={idx}
                            className="group bg-stone-900 border border-stone-800 hover:border-orange-500/40 rounded-2xl p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-orange-500 group-hover:border-orange-500/30 transition-colors">
                                    <Navigation size={20} />
                                </div>
                                <span className="text-xs font-mono font-bold bg-orange-500/10 border border-orange-500/20 text-orange-400 px-3 py-1 rounded-full">
                                    {spot.time}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-heading font-bold text-white leading-snug">
                                    {spot.destination}
                                </h3>
                                <p className="text-stone-400 text-sm font-light leading-relaxed">
                                    {spot.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DistanceRadarSection;
