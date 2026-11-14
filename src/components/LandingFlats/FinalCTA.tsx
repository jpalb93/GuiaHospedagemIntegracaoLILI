import React from 'react';
import { ArrowRight, MessageCircle, Building2 } from 'lucide-react';
import { HOST_PHONE } from '../../constants';

const WA_LINK = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Quero reservar um flat direto nos Flats Integração.'
)}`;

const FinalCTA: React.FC = () => {
    const handleB2BClick = () => {
        window.dispatchEvent(new CustomEvent('open-corporate-modal'));
    };

    return (
        <section className="py-28 md:py-40 bg-[#12110F] text-white relative overflow-hidden rounded-t-[28px] md:rounded-t-[40px] border-t border-[#E5C98B]/25">
            {/* Silhueta fotográfica atmosférica fechando o arco visual da Home */}
            <img
                src="/assets/petrolina/01-ponte-entardecer.webp"
                alt=""
                aria-hidden="true"
                width={640}
                height={853}
                loading="lazy"
                className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-[0.16] scale-105 blur-[1px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_50%,rgba(229,201,139,0.12)_0%,rgba(18,17,15,0.88)_65%,#12110F_100%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#12110F]/70 via-transparent to-[#12110F]"
            />

            <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 text-center space-y-7">
                <div className="inline-flex items-center gap-3 text-[#E5C98B]/90">
                    <span className="w-6 sm:w-9 h-px bg-[#E5C98B]/50" aria-hidden="true" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.26em]">
                        Flats Integração · Petrolina
                    </span>
                    <span className="w-6 sm:w-9 h-px bg-[#E5C98B]/50" aria-hidden="true" />
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-semibold text-white leading-[1.06] tracking-tight max-w-3xl mx-auto">
                    Reserve sua hospedagem em Petrolina{' '}
                    <span className="text-[#E5C98B]">direto e economize.</span>
                </h2>

                <p className="text-stone-300/90 max-w-xl mx-auto text-base md:text-lg font-normal leading-relaxed">
                    Sem taxas de intermediários. Fale conosco e garanta flats no Centro com o melhor
                    preço.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                    <a
                        href={WA_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative overflow-hidden inline-flex items-center justify-center gap-3 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-8 md:px-10 py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 shadow-[0_14px_40px_rgba(229,201,139,0.2)] active:scale-[0.98]"
                    >
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-[130%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/45 to-transparent -skew-x-12"
                        />
                        <MessageCircle
                            size={18}
                            className="relative shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <span className="relative">Reservar pelo WhatsApp</span>
                        <ArrowRight
                            size={18}
                            className="relative shrink-0 group-hover:translate-x-1 transition-transform duration-300"
                        />
                    </a>
                    <button
                        type="button"
                        onClick={handleB2BClick}
                        className="inline-flex items-center justify-center gap-2.5 bg-[#12110F]/70 backdrop-blur-md hover:bg-white/[0.14] text-stone-100 px-6 py-4 rounded-full text-sm font-medium border border-white/15 hover:border-[#E5C98B]/40 transition-all duration-300 active:scale-[0.98]"
                    >
                        <Building2 size={16} className="text-[#E5C98B]" aria-hidden="true" />
                        <span>Cotação para empresas</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
