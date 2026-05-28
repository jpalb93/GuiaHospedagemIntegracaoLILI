import React from 'react';

const TopTicker: React.FC = () => {
    const benefits = [
        "Wi-Fi de Alta Velocidade",
        "Próximo aos Hospitais",
        "Ar-condicionado Split em todos os quartos",
        "Check-in simplificado",
        "Localização Central Privilegiada",
        "Flats Completos e Mobiliados"
    ];

    // Duplicating the array to create a seamless loop
    const displayBenefits = [...benefits, ...benefits, ...benefits];

    return (
        <div className="bg-orange-600 text-white overflow-hidden h-9 flex items-center relative z-[110] border-b border-orange-500/20">
            <div className="flex animate-ticker whitespace-nowrap">
                {displayBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center mx-6 lg:mx-10">
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            {benefit}
                            <span className="text-orange-300 opacity-50 ml-4 lg:ml-8">•</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopTicker;
