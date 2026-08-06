import React from 'react';
import { Building2, FileCheck2, DollarSign, Utensils, Wifi, ShieldCheck, ArrowRight, Briefcase } from 'lucide-react';

interface CorporateB2BSectionProps {
    onRequestQuote?: () => void;
}

export const CorporateB2BSection: React.FC<CorporateB2BSectionProps> = ({ onRequestQuote }) => {
    const handleQuoteClick = () => {
        if (onRequestQuote) onRequestQuote();
        window.dispatchEvent(new CustomEvent('open-corporate-modal'));
    };

    return (
        <section id="empresas" className="py-20 bg-stone-900 text-stone-100 relative overflow-hidden w-full max-w-[100vw]">
            {/* Background Accent Glow */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] max-w-full bg-orange-600/10 rounded-full blur-[120px] pointer-events-none overflow-hidden" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] max-w-full bg-blue-600/10 rounded-full blur-[120px] pointer-events-none overflow-hidden" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* SECTION HEADER */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs tracking-widest uppercase font-heading">
                        <Briefcase size={14} /> Soluções B2B & Longas Estadias
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
                        Aluguel Mensal & Corporativo para Empresas em Petrolina
                    </h2>
                    <p className="text-stone-400 text-sm md:text-base leading-relaxed">
                        Hospede seus diretores, engenheiros, consultores e equipes com conforto de casa, economia expressiva e total facilidade contábil.
                    </p>
                </div>

                {/* 6 DIFFERENTIAL CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {/* CARD 1 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileCheck2 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Nota Fiscal PJ & Faturamento
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            Emissão imediata de Nota Fiscal para a empresa e opções de faturamento corporativo direto ou cartão corporativo.
                        </p>
                    </div>

                    {/* CARD 2 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <DollarSign size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Economia de 30% a 50%
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            Tabela de desconto progressivo para contratos mensalistas (30+ dias), reduzindo drasticamente o custo comparado a hotéis tradicionais.
                        </p>
                    </div>

                    {/* CARD 3 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Utensils size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Cozinha Equipada no Flat
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            Cozinha com geladeira, cooktop/fogão e utensílios completos. Seu colaborador economiza com refeições preparadas no próprio flat.
                        </p>
                    </div>

                    {/* CARD 4 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Wifi size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Workstation & Wi-Fi Fibra
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            Internet banda larga dedicada e ambiente estruturado com bancada para videoconferências, planilhas e relatórios de trabalho.
                        </p>
                    </div>

                    {/* CARD 5 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Building2 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Localização Central Estratégica
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            No Centro de Petrolina, com rápido acesso às indústrias, fazendas de irrigação, UNIVASF, hospitais e aeroporto.
                        </p>
                    </div>

                    {/* CARD 6 */}
                    <div className="bg-stone-950/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-stone-800 hover:border-orange-500/40 transition-all duration-300 group hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-white font-heading mb-3">
                            Sem Burocracia de Fiador
                        </h3>
                        <p className="text-stone-400 text-xs md:text-sm leading-relaxed">
                            Contrato direto e flexível para a empresa, com limpeza, manutenção e enxoval inclusos, sem necessidade de fiador ou calção abusivo.
                        </p>
                    </div>
                </div>

                {/* BANNER CALL TO ACTION */}
                <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left max-w-xl">
                        <h3 className="text-2xl md:text-3xl font-extrabold font-heading">
                            Precisa hospedar sua equipe em Petrolina?
                        </h3>
                        <p className="text-orange-100 text-xs md:text-sm">
                            Receba uma proposta corporativa personalizada em menos de 2 horas. Faturamento rápido e atendimento dedicado.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleQuoteClick}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-stone-900 hover:bg-stone-100 font-extrabold text-xs uppercase tracking-widest rounded-full shadow-xl transition-all active:scale-95 touch-manipulation flex items-center justify-center gap-2 font-heading"
                        >
                            Solicitar Cotação B2B <ArrowRight size={16} />
                        </button>
                        <a
                            href="/guia/hospedagem-corporativa-empresas-petrolina"
                            className="w-full sm:w-auto px-6 py-4 bg-orange-700/50 hover:bg-orange-700/80 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all text-center"
                        >
                            Saiba Mais
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CorporateB2BSection;
