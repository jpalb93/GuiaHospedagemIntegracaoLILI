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

const PILLARS = [
    {
        num: '01',
        icon: FileCheck2,
        title: 'Fiscal e contratos',
        body: 'Nota Fiscal PJ imediata, faturamento quinzenal ou mensal, cartão corporativo. Mensalistas sem fiador ou caução abusiva.',
    },
    {
        num: '02',
        icon: Wifi,
        title: 'Flat pronto para trabalho',
        body: 'Wi-Fi fibra, cozinha equipada, enxoval e limpeza. Equipe acomoda e produz sem montar imóvel.',
    },
    {
        num: '03',
        icon: MapPin,
        title: 'Centro de Petrolina',
        body: 'Acesso a indústrias, irrigação, Univasf, hospitais e aeroporto. Mobilidade prática no dia a dia.',
    },
] as const;

const MOBILE_COMPARISON = [
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
] as const;

export const CorporateB2BSection: React.FC<CorporateB2BSectionProps> = ({ onRequestQuote }) => {
    const handleQuoteClick = () => {
        if (onRequestQuote) onRequestQuote();
        window.dispatchEvent(new CustomEvent('open-corporate-modal'));
    };

    return (
        <section
            id="empresas"
            className="py-24 md:py-32 bg-[#12110F] text-stone-100 relative overflow-hidden w-full max-w-[100vw]"
        >
            {/* Iluminação arquitetônica sutil no topo */}
            <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E5C98B]/30 to-transparent"
                aria-hidden
            />

            <div className="max-w-[1320px] mx-auto px-6 md:px-12 relative z-10 space-y-16 md:space-y-20">
                {/* 1. Hero B2B Assimétrico: Copy Executiva + Showcase Visual com Métricas */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5C98B]/10 border border-[#E5C98B]/25 text-[#E5C98B] text-xs font-semibold uppercase tracking-[0.18em]">
                            <Building2 size={14} aria-hidden />
                            Empresas &amp; longas estadias
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-heading font-semibold text-white tracking-tight leading-[1.06]">
                            Hospedagem corporativa sob medida em Petrolina
                        </h2>

                        <p className="text-stone-300/90 text-base md:text-lg leading-relaxed max-w-xl font-normal">
                            Diretores, engenheiros e equipes de projeto em flats privativos, com
                            Nota Fiscal PJ e custo menor que hotelaria.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-3.5">
                            <button
                                type="button"
                                onClick={handleQuoteClick}
                                className="px-7 py-3.5 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] font-semibold text-sm rounded-full transition-all active:scale-[0.98] touch-manipulation inline-flex items-center justify-center gap-2 group shadow-lg"
                            >
                                <span>Solicitar cotação B2B</span>
                                <ArrowRight
                                    size={16}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </button>
                            <a
                                href="/guia/hospedagem-corporativa-empresas-petrolina"
                                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-full border border-white/15 transition-all"
                            >
                                Guia B2B
                            </a>
                        </div>
                    </div>

                    {/* Showcase Fotográfico + Monolito de Métricas */}
                    <div className="lg:col-span-6 space-y-4">
                        <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-white/10 bg-[#1B1916] shadow-2xl">
                            <img
                                src="/assets/gallery/gallery-5.webp"
                                alt="Flat corporativo equipado nos Flats Integração no Centro de Petrolina"
                                width={1000}
                                height={650}
                                loading="lazy"
                                className="w-full h-full object-cover object-center opacity-85"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/85 via-[#12110F]/20 to-transparent" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#191714] border border-emerald-500/25 rounded-3xl p-6 md:p-7 flex flex-col justify-between gap-5 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="p-2.5 bg-emerald-500/10 rounded-full text-emerald-400 border border-emerald-500/20">
                                        <TrendingDown size={18} aria-hidden />
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.18em] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                        REDUÇÃO
                                    </span>
                                </div>
                                <div>
                                    <div className="text-emerald-400 font-heading font-semibold text-3xl sm:text-4xl tracking-tight tabular-nums">
                                        30% a 50%
                                    </div>
                                    <p className="text-stone-300 text-xs sm:text-sm mt-1.5 font-medium">
                                        Economia vs. hotelaria
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#191714] border border-[#E5C98B]/25 rounded-3xl p-6 md:p-7 flex flex-col justify-between gap-5 shadow-xl">
                                <div className="flex items-center justify-between">
                                    <span className="p-2.5 bg-[#E5C98B]/10 rounded-full text-[#E5C98B] border border-[#E5C98B]/25">
                                        <FileCheck2 size={18} aria-hidden />
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.18em] font-mono font-semibold text-[#E5C98B] bg-[#E5C98B]/10 border border-[#E5C98B]/25 px-2.5 py-1 rounded-full">
                                        DIRETO
                                    </span>
                                </div>
                                <div>
                                    <div className="text-[#E5C98B] font-heading font-semibold text-3xl sm:text-4xl tracking-tight">
                                        NF PJ
                                    </div>
                                    <p className="text-stone-300 text-xs sm:text-sm mt-1.5 font-medium">
                                        Faturamento no CNPJ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Dossiê Executivo em 3 Colunas com Divisores Arquitetônicos */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-y border-white/15 divide-y md:divide-y-0 md:divide-x divide-white/15">
                    {PILLARS.map((item) => (
                        <div
                            key={item.title}
                            className="py-8 md:px-8 first:md:pl-0 last:md:pr-0 space-y-4 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="w-11 h-11 rounded-full bg-[#1B1916] border border-white/15 flex items-center justify-center text-[#E5C98B]">
                                    <item.icon size={19} strokeWidth={1.75} aria-hidden />
                                </div>
                                <span className="font-mono text-xs tracking-[0.2em] text-stone-500">
                                    {item.num}
                                </span>
                            </div>
                            <h3 className="text-xl font-heading font-semibold text-white leading-snug">
                                {item.title}
                            </h3>
                            <p className="text-stone-400 text-sm leading-relaxed font-normal">
                                {item.body}
                            </p>
                        </div>
                    ))}
                </div>

                {/* 3. Comparativo + Chamada Corporativa Integrada */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                    {/* Coluna Esquerda: Título do Comparativo + CTA B2B */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-8 bg-[#191714] border border-white/10 rounded-3xl p-7 md:p-9">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-1.5 text-[#E5C98B] text-xs font-mono font-semibold uppercase tracking-wider">
                                <Sparkles size={14} aria-hidden /> PROVA DE ECONOMIA
                            </div>
                            <h3 className="text-2xl md:text-3xl font-heading font-semibold text-white tracking-tight leading-tight">
                                Flat vs. hotel vs. aluguel
                            </h3>
                            <p className="text-stone-400 text-sm md:text-base leading-relaxed font-normal">
                                O que muda no custo e na operação da sua empresa.
                            </p>
                        </div>

                        <div className="border-t border-white/10 pt-7 space-y-4">
                            <h4 className="text-lg md:text-xl font-heading font-semibold text-white tracking-tight leading-snug">
                                Precisa hospedar sua equipe em Petrolina?
                            </h4>
                            <p className="text-stone-400 text-sm leading-relaxed font-normal">
                                Proposta corporativa e tabela mensal em até 2 horas. Faturamento
                                rápido e suporte direto.
                            </p>
                            <div className="pt-2 flex flex-col sm:flex-row lg:flex-col gap-3">
                                <button
                                    type="button"
                                    onClick={handleQuoteClick}
                                    className="w-full px-6 py-3.5 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] font-semibold text-sm rounded-full transition-all active:scale-[0.98] touch-manipulation inline-flex items-center justify-center gap-2 group shadow-lg"
                                >
                                    <span>Solicitar cotação B2B</span>
                                    <ArrowRight
                                        size={16}
                                        className="group-hover:translate-x-1 transition-transform"
                                    />
                                </button>
                                <a
                                    href="/guia/hospedagem-corporativa-empresas-petrolina"
                                    className="w-full px-6 py-3 bg-white/5 hover:bg-white/15 text-white font-medium text-sm rounded-full border border-white/15 transition-all text-center"
                                >
                                    Guia B2B
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita: Matrix Comparativa Spotlight */}
                    <div className="lg:col-span-8 bg-[#191714] border border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col justify-center shadow-2xl">
                        {/* --- VERSÃO MOBILE --- */}
                        <div className="space-y-3.5 md:hidden">
                            {MOBILE_COMPARISON.map((item) => (
                                <div
                                    key={item.criterion}
                                    className="bg-[#12110F] border border-white/10 rounded-2xl p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-stone-400">
                                            {item.criterion}
                                        </span>
                                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#E5C98B]/10 text-[#E5C98B] border border-[#E5C98B]/25">
                                            Vantagem Flat
                                        </span>
                                    </div>

                                    <div className="bg-[#E5C98B]/10 border border-[#E5C98B]/30 rounded-xl p-3.5 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#E5C98B]/20 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={16} className="text-[#E5C98B]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono font-bold text-[#E5C98B] uppercase tracking-widest">
                                                Flats Integração
                                            </p>
                                            <p
                                                className={`text-sm font-heading font-semibold ${item.flatsColor} leading-snug`}
                                            >
                                                {item.flats}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                                        <div className="bg-[#1B1916] border border-white/5 rounded-xl p-2.5 space-y-1">
                                            <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold">
                                                Hotel
                                            </p>
                                            <p className="text-xs text-stone-300 font-normal leading-snug">
                                                {item.hotel}
                                            </p>
                                        </div>
                                        <div className="bg-[#1B1916] border border-white/5 rounded-xl p-2.5 space-y-1">
                                            <p className="text-[10px] font-mono uppercase text-stone-400 font-semibold">
                                                Aluguel
                                            </p>
                                            <p className="text-xs text-stone-300 font-normal leading-snug flex items-center gap-1">
                                                {'hasRealEstateAlert' in item &&
                                                    item.hasRealEstateAlert && (
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

                        {/* --- VERSÃO DESKTOP --- */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 text-stone-400 font-heading">
                                        <th className="py-4 pr-4 font-semibold text-xs uppercase tracking-wider w-[18%]">
                                            Critério
                                        </th>
                                        <th className="py-4 px-5 font-semibold text-[#E5C98B] bg-gradient-to-b from-[#E5C98B]/15 to-[#E5C98B]/10 border-t border-x border-[#E5C98B]/30 rounded-t-2xl text-center text-xs uppercase tracking-wider w-[34%]">
                                            Flats Integração
                                        </th>
                                        <th className="py-4 px-4 font-semibold text-stone-400 text-center text-xs uppercase tracking-wider w-[23%]">
                                            Hotel
                                        </th>
                                        <th className="py-4 pl-4 font-semibold text-stone-400 text-center text-xs uppercase tracking-wider w-[25%]">
                                            Aluguel imobiliário
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10 text-stone-300">
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 pr-4 font-medium text-white">
                                            Custo mensal
                                        </td>
                                        <td className="py-5 px-5 font-semibold text-emerald-400 bg-[#E5C98B]/[0.08] border-x border-[#E5C98B]/30 text-center">
                                            Economia de 30% a 50%
                                        </td>
                                        <td className="py-5 px-4 text-center text-stone-400">
                                            Diárias acumuladas
                                        </td>
                                        <td className="py-5 pl-4 text-center text-stone-400">
                                            Mobília + contas à parte
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 pr-4 font-medium text-white">
                                            Refeições
                                        </td>
                                        <td className="py-5 px-5 font-medium text-white bg-[#E5C98B]/[0.07] border-x border-[#E5C98B]/30 text-center">
                                            <span className="inline-flex items-center gap-1.5 font-medium text-white">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#E5C98B] shrink-0"
                                                />
                                                Cozinha no flat
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-center text-stone-400">
                                            Restaurantes
                                        </td>
                                        <td className="py-5 pl-4 text-center text-stone-400">
                                            Montar cozinha
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 pr-4 font-medium text-white">
                                            Burocracia
                                        </td>
                                        <td className="py-5 px-5 font-medium text-white bg-[#E5C98B]/[0.06] border-x border-[#E5C98B]/30 text-center">
                                            <span className="inline-flex items-center gap-1.5 font-medium text-white">
                                                <CheckCircle2
                                                    size={16}
                                                    className="text-[#E5C98B] shrink-0"
                                                />
                                                Sem fiador / caução
                                            </span>
                                        </td>
                                        <td className="py-5 px-4 text-center text-stone-400">
                                            Sem fiador (caro)
                                        </td>
                                        <td className="py-5 pl-4 text-center">
                                            <span className="inline-flex items-center gap-1.5 text-stone-400">
                                                <XCircle
                                                    size={16}
                                                    className="text-rose-400 shrink-0"
                                                />
                                                Contrato longo + fiador
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-5 pr-4 font-medium text-white">
                                            Inclusos
                                        </td>
                                        <td className="py-5 px-5 font-medium text-white bg-[#E5C98B]/[0.05] border-x border-b border-[#E5C98B]/30 rounded-b-2xl text-center">
                                            Wi-Fi, limpeza, enxoval, manutenção
                                        </td>
                                        <td className="py-5 px-4 text-center text-stone-400">
                                            Limpeza
                                        </td>
                                        <td className="py-5 pl-4 text-center text-stone-400">
                                            Tudo por conta
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CorporateB2BSection;
