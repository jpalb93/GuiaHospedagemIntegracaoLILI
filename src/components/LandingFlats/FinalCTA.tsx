import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { HOST_PHONE } from '../../constants';

const WA_LINK = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Quero reservar um flat direto nos Flats Integração.'
)}`;

const FinalCTA: React.FC = () => {
    return (
        <section className="py-20 md:py-28 bg-[#12110F] text-white relative overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 text-center space-y-6">
                <h2 className="text-3xl md:text-5xl font-heading font-semibold text-white leading-tight tracking-tight max-w-3xl mx-auto">
                    Reserve sua hospedagem em Petrolina{' '}
                    <span className="text-[#E5C98B]">direto e economize.</span>
                </h2>

                <p className="text-stone-300 max-w-xl mx-auto text-base md:text-lg font-normal leading-relaxed">
                    Sem taxas de intermediários. Fale conosco e garanta flats no Centro com o melhor
                    preço.
                </p>

                <div className="pt-3 flex justify-center">
                    <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-8 md:px-10 py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-xl active:scale-[0.98]"
                    >
                        <MessageCircle
                            size={18}
                            className="shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <span>Reservar pelo WhatsApp</span>
                        <ArrowRight
                            size={18}
                            className="shrink-0 group-hover:translate-x-1 transition-transform duration-300"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
