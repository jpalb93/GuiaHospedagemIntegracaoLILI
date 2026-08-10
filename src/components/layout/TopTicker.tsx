import React from 'react';

const TopTicker: React.FC = () => {
    const benefits = [
        'Hospedagem em Petrolina no Centro',
        'Melhor custo-benefício que hotel',
        'Nota Fiscal PJ para empresas',
        'Wi-Fi fibra e cozinha completa',
        'Flats mobiliados, lazer ou mensal',
        'Reserve direto, sem intermediário',
    ];

    // Duplicating the array to create a seamless loop
    const displayBenefits = [...benefits, ...benefits, ...benefits];

    return (
        <div className="bg-orange-700 text-white overflow-hidden h-9 shrink-0 flex items-center relative z-30 border-b border-orange-600/20">
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
