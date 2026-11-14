import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Building2,
    MapPin,
    Calendar,
    Briefcase,
    Wine,
    UtensilsCrossed,
    Waves,
    Stethoscope,
    BookOpen,
    Sparkles,
} from 'lucide-react';

const STAY_OPTIONS = [
    {
        to: '/hospedagem-em-petrolina',
        title: 'Hospedagem em Petrolina',
        blurb: 'Conheça os flats, o que está incluso e como reservar direto.',
        icon: Building2,
        tag: 'Geral & Reservas',
    },
    {
        to: '/flat-centro-petrolina',
        title: 'Flat no Centro',
        blurb: 'Localização prática perto de hospitais, comércio e serviços.',
        icon: MapPin,
        tag: 'Localização',
    },
    {
        to: '/guia/aluguel-mensal-petrolina-flat-mobiliado',
        title: 'Aluguel mensal',
        blurb: 'Flat mobiliado para estadias de 30 dias ou mais.',
        icon: Calendar,
        tag: 'Longa Estadia',
    },
    {
        to: '/guia/hospedagem-corporativa-empresas-petrolina',
        title: 'Hospedagem para empresas',
        blurb: 'Longa estadia, Wi-Fi e atendimento corporativo.',
        icon: Briefcase,
        tag: 'Corporativo',
    },
] as const;

const ARTICLES = [
    {
        to: '/guia/roteiro-vinho-petrolina',
        title: 'Roteiro do Vinho',
        blurb: 'Vinícolas, Vapor do Vinho e dicas para a visita.',
        image: '/assets/blog/vapor-do-vinho-montagem.webp',
        icon: Wine,
        tag: 'Turismo & Lazer',
    },
    {
        to: '/guia/onde-comer-petrolina-bododromo',
        title: 'Gastronomia regional',
        blurb: 'Bodódromo e peixes do São Francisco.',
        image: '/assets/blog/bododromo-petrolina.webp',
        icon: UtensilsCrossed,
        tag: 'Gastronomia',
    },
    {
        to: '/guia/rio-sao-francisco-rodeadouro-barquinha',
        title: 'Rio São Francisco',
        blurb: 'Barquinha e Ilha do Rodeadouro.',
        image: '/assets/blog/rio-sao-francisco-rodeadouro.webp',
        icon: Waves,
        tag: 'Natureza & Orla',
    },
    {
        to: '/guia/hospedagem-proximo-hospitais-petrolina',
        title: 'Polo médico e hospitais',
        blurb: 'Hospedagem prática perto dos principais hospitais e clínicas.',
        image: '/assets/blog/hospedagem-medica.webp',
        icon: Stethoscope,
        tag: 'Saúde & Consultas',
    },
] as const;

export const StayOptionsSection: React.FC = () => {
    return (
        <section
            id="hospedagem"
            className="pt-20 md:pt-28 pb-12 md:pb-16 bg-[#F5F2EB] text-[#181614]"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181614]/5 border border-[#181614]/10 text-[#9E6B2B] text-xs font-semibold uppercase tracking-[0.18em]">
                            <Sparkles size={13} />
                            Encontre sua estadia
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#181614] tracking-tight leading-tight">
                            Opções de hospedagem em Petrolina
                        </h2>
                        <p className="text-[#5C564E] text-base md:text-lg leading-relaxed font-normal">
                            Escolha pelo tipo de viagem e veja informações específicas antes de
                            reservar.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {STAY_OPTIONS.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <Link
                                key={option.to}
                                to={option.to}
                                className="group relative bg-white border border-[#E5E0D5] hover:border-[#9E6B2B]/50 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md overflow-hidden"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="w-11 h-11 rounded-2xl bg-[#F5F2EB] border border-[#E5E0D5] group-hover:bg-[#141210] group-hover:text-[#E5C98B] flex items-center justify-center text-[#181614] transition-colors duration-300">
                                            <IconComponent size={20} strokeWidth={1.8} />
                                        </div>
                                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full bg-[#F5F2EB] text-[#5C564E] border border-[#E5E0D5]">
                                            {option.tag}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="font-heading font-semibold text-xl text-[#181614] group-hover:text-[#9E6B2B] transition-colors duration-200">
                                            {option.title}
                                        </h3>
                                        <p className="text-[#5C564E] text-sm font-normal leading-relaxed">
                                            {option.blurb}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-7">
                                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#181614] group-hover:text-[#9E6B2B] transition-colors">
                                        Ver detalhes{' '}
                                        <ArrowRight
                                            size={14}
                                            className="group-hover:translate-x-1 transition-transform duration-200"
                                        />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export const LocalGuideSection: React.FC = () => {
    return (
        <section className="py-20 md:py-28 bg-[#12110F] text-stone-200 relative overflow-hidden">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-12 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3 max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5C98B]/10 border border-[#E5C98B]/25 text-[#E5C98B] text-xs font-semibold uppercase tracking-[0.18em]">
                            <BookOpen size={13} />
                            Guia local
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-white tracking-tight">
                            Guia de Petrolina e hospedagem
                        </h2>
                        <p className="text-stone-400 text-base md:text-lg font-normal leading-relaxed">
                            Dicas essenciais, passeios no Velho Chico, enoturismo e gastronomia
                            regional.
                        </p>
                    </div>
                    <Link
                        to="/guia"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-[#E5C98B] border border-white/15 hover:border-[#E5C98B] text-xs font-semibold uppercase tracking-[0.14em] text-white hover:text-[#141210] transition-all duration-300 w-fit"
                    >
                        <span>Ver guia completo</span>
                        <ArrowRight
                            size={15}
                            className="group-hover:translate-x-1 transition-transform"
                        />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {ARTICLES.map((article) => {
                        const IconComponent = article.icon;
                        return (
                            <Link
                                key={article.to}
                                to={article.to}
                                className="group relative h-[380px] rounded-3xl overflow-hidden border border-white/10 hover:border-[#E5C98B]/50 transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between p-6"
                            >
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-gradient-to-b from-[#12110F]/70 via-[#12110F]/30 to-[#12110F]/95" />

                                <div className="relative z-10 flex items-center justify-between">
                                    <span className="inline-flex items-center gap-1.5 bg-[#12110F]/75 backdrop-blur-md border border-white/15 text-[#E5C98B] text-[10px] font-semibold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full">
                                        <IconComponent size={12} />
                                        {article.tag}
                                    </span>
                                </div>

                                <div className="relative z-10 space-y-2.5">
                                    <h3 className="font-heading font-semibold text-2xl text-white group-hover:text-[#E5C98B] transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                    <p className="text-stone-300 text-xs font-normal leading-relaxed line-clamp-2">
                                        {article.blurb}
                                    </p>

                                    <div className="pt-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#E5C98B]">
                                        <span>Ler artigo</span>
                                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 group-hover:bg-[#E5C98B] group-hover:border-[#E5C98B] group-hover:text-[#141210] text-white flex items-center justify-center transition-all duration-300">
                                            <ArrowRight
                                                size={14}
                                                className="group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

const BlogSection: React.FC = () => (
    <>
        <StayOptionsSection />
        <LocalGuideSection />
    </>
);

export default BlogSection;
