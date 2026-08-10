import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { HOST_PHONE } from '../../constants';

const WA_LINK = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Quero reservar um flat direto nos Flats Integração.'
)}`;

const FinalCTA: React.FC = () => {
    return (
        <section className="py-16 md:py-20 bg-stone-950 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 text-center space-y-6">
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight tracking-tight">
                    Reserve sua hospedagem em Petrolina
                    <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                        {' '}
                        direto e economize.
                    </span>
                </h2>

                <p className="text-stone-300 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
                    Sem taxas de intermediários. Fale conosco e garanta flats no Centro com o melhor
                    preço.
                </p>

                <div className="pt-2 flex justify-center">
                    <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white px-9 md:px-11 py-4 md:py-4.5 rounded-2xl text-base md:text-lg font-heading font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_8px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] border border-orange-400/50 hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        <MessageCircle
                            size={22}
                            className="shrink-0 group-hover:scale-110 transition-transform"
                        />
                        <span>Reservar pelo WhatsApp</span>
                        <ArrowRight
                            size={20}
                            className="shrink-0 group-hover:translate-x-1.5 transition-transform duration-300"
                        />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
