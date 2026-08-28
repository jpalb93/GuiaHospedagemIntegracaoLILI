import React from 'react';
import {
    FileCheck2,
    ArrowRight,
    CheckCircle2,
    XCircle,
    TrendingDown,
    Wifi,
    MapPin,
    Building2,
    Sparkles,
} from 'lucide-react';

interface CorporateB2BSectionProps {
    onRequestQuote?: () => void;
}

export const CorporateB2BSection: React.FC<CorporateB2BSectionProps> = ({ onRequestQuote }) => {
    const handleQuoteClick = () => {
        if (onRequestQuote) onRequestQuote();
        window.dispatchEvent(new CustomEvent('open-corporate-modal'));
    };

    return (
        <section
            id="empresas"
            className="py-24 md:py-32 bg-[#0C0A09] text-stone-100 relative overflow-hidden w-full max-w-[100vw]"
        >
            {/* Efeitos de Luz e Brilho "WOW" */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.02] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 space-y-20">
                {/* Header — editorial + métricas WOW */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center bg-stone-900/60 backdrop-blur-xl border border-stone-800/80 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    <div className="lg:col-span-7 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-heading font-bold uppercase tracking-[0.2em]">
                            <Building2 size={14} />
                            Empresas &amp; longas estadias
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight leading-[1.1]">
                            Hospedagem corporativa sob medida em Petrolina
                        </h2>
                        <p className="text-stone-400 text-base md:text-lg leading-relaxed max-w-xl font-light">
                            Diretores, engenheiros e equipes de projeto em flats privativos, com
                            Nota Fiscal PJ e custo menor que hotelaria.
                        </p>
                    </div>

                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        <div className="bg-stone-950/80 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between hover:border-emerald-500/30 transition-all shadow-md group">
                            <div className="flex items-center justify-between">
                                <span className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                                    <TrendingDown size={20} />
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded">
                                    REDUÇÃO
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="text-emerald-400 font-heading font-bold text-2xl sm:text-3xl tracking-tight">
                                    30% a 50%
                                </div>
                                <p className="text-stone-400 text-xs mt-1 font-medium">
                                    Economia vs. hotelaria
                                </p>
                            </div>
                        </div>

                        <div className="bg-stone-950/80 border border-stone-800 p-6 rounded-2xl flex flex-col justify-between hover:border-orange-500/30 transition-all shadow-md group">
                            <div className="flex items-center justify-between">
                                <span className="p-2.5 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
                                    <FileCheck2 size={20} />
                                </span>
                                <span className="text-[10px] uppercase tracking-widest font-mono text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded">
                                    DIRETO
                                </span>
                            </div>
                            <div className="mt-4">
                                <div className="text-orange-400 font-heading font-bold text-2xl sm:text-3xl tracking-tight">
                                    NF PJ
                                </div>
                                <p className="text-stone-400 text-xs mt-1 font-medium">
                                    Faturamento no CNPJ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Três pilares — Cards elevados com efeito glow top border */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: FileCheck2,
                            title: 'Fiscal e contratos',
                            body: 'Nota Fiscal PJ imediata, faturamento quinzenal ou mensal, cartão corporativo. Mensalistas sem fiador ou caução abusiva.',
                        },
                        {
                            icon: Wifi,
                            title: 'Flat pronto para trabalho',
                            body: 'Wi-Fi fibra, cozinha equipada, enxoval e limpeza. Equipe acomoda e produz sem montar imóvel.',
                        },
                        {
                            icon: MapPin,
                            title: 'Centro de Petrolina',
                            body: 'Acesso a indústrias, irrigação, Univasf, hospitais e aeroporto. Mobilidade prática no dia a dia.',
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="group bg-stone-900/50 hover:bg-stone-900/90 border border-stone-800/80 hover:border-orange-500/40 rounded-3xl p-8 space-y-5 transition-all duration-300 hover:-translate-y-1 shadow-lg relative overflow-hidden"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center text-orange-500 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 transition-colors">
                                <item.icon size={22} />
                            </div>
                            <h3 className="text-xl font-heading font-bold text-white leading-snug">
                                {item.title}
                            </h3>
                            <p className="text-stone-400 text-sm leading-relaxed font-light">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Comparativo — Card estilo Matrix com visualização adaptativa (Cards no Mobile, Tabela no Desktop) */}
                <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-5 sm:p-8 md:p-12 space-y-6 md:space-y-8 shadow-2xl backdrop-blur-md">
                    <div className="max-w-2xl space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-orange-400 text-xs font-mono font-bold uppercase tracking-wider">
                            <Sparkles size={14} /> PROVA DE ECONOMIA
                        </div>
                        <h3 className="text-2xl md:text-4xl font-heading font-bold text-white tracking-tight">
                            Flat vs. hotel vs. aluguel
                        </h3>
                        <p className="text-stone-400 text-sm md:text-base leading-relaxed font-light">
                            O que muda no custo e na operação da sua empresa.
                        </p>
                    </div>

                    {/* --- VERSÃO MOBILE (Cards elegantes sem corte horizontal) --- */}
                    <div className="space-y-3.5 md:hidden">
                        {[
                            {
                                criterion: 'Custo mensal',
                                flats: 'Economia de 30% a 50%',
                                flatsColor: 'text-emerald-400',
                                hotel: 'Diárias acumuladas',
                                realEstate: 'Mobília + contas à parte',
                            },
                            {
                                criterion: 'Refeições',
                                flats: 'Cozinha completa no flat',
                                flatsColor: 'text-white',
                                hotel: 'Restaurante / room service',
                                realEstate: 'Montar cozinha do zero',
                            },
                            {
                                criterion: 'Burocracia',
                                flats: 'Sem fiador / caução',
                                flatsColor: 'text-white',
                                hotel: 'Sem fiador (diária alta)',
                                realEstate: 'Contrato longo + fiador',
                                hasRealEstateAlert: true,
                            },
                            {
                                criterion: 'Inclusos no valor',
                                flats: 'Wi-Fi, limpeza, enxoval, manutenção',
                                flatsColor: 'text-white',
                                hotel: 'Apenas limpeza básica',
                                realEstate: 'Tudo por conta da empresa',
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-stone-950/80 border border-stone-800/90 rounded-2xl p-4 space-y-3 shadow-md relative overflow-hidden"
                            >
                                {/* Header do Critério */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-400">
                                        {item.criterion}
                                    </span>
                                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                        Vantagem Flat
                                    </span>
                                </div>

                                {/* Destaque Principal: Flats Integração */}
                                <div className="bg-gradient-to-r from-orange-500/15 via-orange-500/10 to-transparent border border-orange-500/35 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-inner">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={16} className="text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest">
                                                Flats Integração
                                            </p>
                                            <p
                                                className={`text-sm font-heading font-bold ${item.flatsColor} leading-snug`}
                                            >
                                                {item.flats}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Comparativo com Alternativas */}
                                <div className="grid grid-cols-2 gap-2 pt-0.5">
                                    <div className="bg-stone-900/70 border border-stone-800/80 rounded-xl p-2.5 space-y-1">
                                        <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold flex items-center gap-1">
                                            <span>🏨</span> Hotel
                                        </p>
                                        <p className="text-xs text-stone-300 font-light leading-snug">
                                            {item.hotel}
                                        </p>
                                    </div>
                                    <div className="bg-stone-900/70 border border-stone-800/80 rounded-xl p-2.5 space-y-1">
                                        <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold flex items-center gap-1">
                                            <span>🏢</span> Aluguel
                                        </p>
                                        <p className="text-xs text-stone-300 font-light leading-snug flex items-center gap-1">
                                            {item.hasRealEstateAlert && (
                                                <XCircle
                                                    size={12}
                                                    className="text-rose-400 shrink-0 inline"
                                                />
                                            )}
                                            <span>{item.realEstate}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- VERSÃO DESKTOP (Tabela Completa Matrix) --- */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse min-w-[620px]">
                            <thead>
                                <tr className="border-b border-stone-800 text-stone-400 font-heading">
                                    <th className="py-4 pr-4 font-bold text-xs uppercase tracking-wider">
                                        Critério
                                    </th>
                                    <th className="py-4 px-6 font-bold text-orange-500 bg-orange-500/10 border-t border-x border-orange-500/30 rounded-t-2xl text-center text-xs uppercase tracking-wider">
                                        Flats Integração
                                    </th>
                                    <th className="py-4 px-4 font-bold text-slate-400 text-center text-xs uppercase tracking-wider">
                                        Hotel
                                    </th>
                                    <th className="py-4 pl-4 font-bold text-slate-400 text-center text-xs uppercase tracking-wider">
                                        Aluguel imobiliário
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-800/80 text-stone-300">
                                <tr className="hover:bg-stone-800/20 transition-colors">
                                    <td className="py-4 pr-4 font-semibold text-white">
                                        Custo mensal
                                    </td>
                                    <td className="py-4 px-6 font-bold text-emerald-400 bg-orange-500/10 border-x border-orange-500/30 text-center">
                                        Economia de 30% a 50%
                                    </td>
                                    <td className="py-4 px-4 text-center text-stone-400">
                                        Diárias acumuladas
                                    </td>
                                    <td className="py-4 pl-4 text-center text-stone-400">
                                        Mobília + contas à parte
                                    </td>
                                </tr>
                                <tr className="hover:bg-stone-800/20 transition-colors">
                                    <td className="py-4 pr-4 font-semibold text-white">
                                        Refeições
                                    </td>
                                    <td className="py-4 px-6 font-medium text-stone-100 bg-orange-500/10 border-x border-orange-500/30 text-center">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                                            <CheckCircle2
                                                size={16}
                                                className="text-orange-500 shrink-0"
                                            />
                                            Cozinha no flat
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center text-stone-400">
                                        Restaurantes
                                    </td>
                                    <td className="py-4 pl-4 text-center text-stone-400">
                                        Montar cozinha
                                    </td>
                                </tr>
                                <tr className="hover:bg-stone-800/20 transition-colors">
                                    <td className="py-4 pr-4 font-semibold text-white">
                                        Burocracia
                                    </td>
                                    <td className="py-4 px-6 font-medium text-stone-100 bg-orange-500/10 border-x border-orange-500/30 text-center">
                                        <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                                            <CheckCircle2
                                                size={16}
                                                className="text-orange-500 shrink-0"
                                            />
                                            Sem fiador / caução
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center text-stone-400">
                                        Sem fiador (caro)
                                    </td>
                                    <td className="py-4 pl-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 text-stone-400">
                                            <XCircle size={16} className="text-rose-500 shrink-0" />
                                            Contrato longo + fiador
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-stone-800/20 transition-colors">
                                    <td className="py-4 pr-4 font-semibold text-white">Inclusos</td>
                                    <td className="py-4 px-6 font-medium text-stone-100 bg-orange-500/10 border-x border-b border-orange-500/30 rounded-b-2xl text-center">
                                        Wi-Fi, limpeza, enxoval, manutenção
                                    </td>
                                    <td className="py-4 px-4 text-center text-stone-400">
                                        Limpeza
                                    </td>
                                    <td className="py-4 pl-4 text-center text-stone-400">
                                        Tudo por conta
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CTA — Dual Geometry: conversão em pílula com brilho */}
                <div className="bg-gradient-to-r from-stone-900 via-[#1C1613] to-stone-900 border border-orange-500/30 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-3 max-w-xl relative z-10">
                        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">
                            Precisa hospedar sua equipe em Petrolina?
                        </h3>
                        <p className="text-stone-300 text-sm md:text-base leading-relaxed font-light">
                            Proposta corporativa e tabela mensal em até 2 horas. Faturamento rápido
                            e suporte direto.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full lg:w-auto relative z-10">
                        <button
                            type="button"
                            onClick={handleQuoteClick}
                            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-400 hover:to-orange-500 text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl border border-orange-400/40 hover:border-orange-300/80 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] transition-all active:scale-[0.98] touch-manipulation inline-flex items-center justify-center gap-2.5 group"
                        >
                            <span>Solicitar cotação B2B</span>
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform"
                            />
                        </button>
                        <a
                            href="/guia/hospedagem-corporativa-empresas-petrolina"
                            className="w-full sm:w-auto px-8 py-4 bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white font-heading font-bold text-xs uppercase tracking-widest rounded-xl border border-stone-700/80 hover:border-orange-500/50 hover:shadow-[0_0_18px_rgba(249,115,22,0.15)] transition-all text-center"
                        >
                            Guia B2B
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CorporateB2BSection;
