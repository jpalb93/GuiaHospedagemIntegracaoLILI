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

const BlogSection: React.FC = () => {
    return (
        <section id="hospedagem" className="py-24 md:py-32 bg-stone-950 relative overflow-hidden">
            {/* Ambient Background Glow Mesh */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-500/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 space-y-24 relative z-10">
                {/* PART 1: OPÇÕES DE HOSPEDAGEM */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="max-w-2xl space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-heading font-bold uppercase tracking-[0.2em]">
                                <Sparkles size={13} />
                                Encontre sua estadia
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight leading-tight">
                                Opções de hospedagem em Petrolina
                            </h2>
                            <p className="text-stone-400 text-lg leading-relaxed font-light">
                                Escolha pelo tipo de viagem e veja informações específicas antes de
                                reservar.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STAY_OPTIONS.map((option) => {
                            const IconComponent = option.icon;
                            return (
                                <Link
                                    key={option.to}
                                    to={option.to}
                                    className="group relative bg-stone-900/60 border border-stone-800 hover:border-orange-500/50 rounded-3xl p-7 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-[0_15px_30px_rgba(249,115,22,0.12)] overflow-hidden"
                                >
                                    {/* Hover Ambient Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className="w-12 h-12 rounded-2xl bg-stone-800/80 border border-stone-700 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 flex items-center justify-center text-orange-400 transition-colors duration-300">
                                                <IconComponent size={22} />
                                            </div>
                                            <span className="text-[10px] font-heading font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-stone-800/60 text-stone-400 border border-stone-700/50 group-hover:text-orange-400 group-hover:border-orange-500/30 transition-colors">
                                                {option.tag}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <h3 className="font-heading font-bold text-xl text-white group-hover:text-orange-400 transition-colors duration-300">
                                                {option.title}
                                            </h3>
                                            <p className="text-stone-400 text-sm font-light leading-relaxed">
                                                {option.blurb}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-8 relative z-10">
                                        <span className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-[0.14em] text-orange-400/80 group-hover:text-orange-400 transition-colors">
                                            Ver detalhes{' '}
                                            <ArrowRight
                                                size={14}
                                                className="group-hover:translate-x-1.5 transition-transform duration-300"
                                            />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* SEPARATOR */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-800 to-transparent" />

                {/* PART 2: GUIA LOCAL — VISUAL MAGAZINE CARDS */}
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-heading font-bold uppercase tracking-[0.2em]">
                                <BookOpen size={13} />
                                Guia local
                            </div>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white tracking-tight">
                                Guia de Petrolina e hospedagem
                            </h2>
                            <p className="text-stone-400 text-base md:text-lg font-light leading-relaxed">
                                Dicas essenciais, passeios no Velho Chico, enoturismo e gastronomia
                                regional.
                            </p>
                        </div>
                        <Link
                            to="/guia"
                            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-orange-500/50 text-xs font-heading font-bold uppercase tracking-[0.15em] text-stone-200 hover:text-white transition-all duration-300 hover:bg-stone-800 shadow-lg w-fit"
                        >
                            <span>Ver guia completo</span>
                            <ArrowRight
                                size={15}
                                className="group-hover:translate-x-1.5 transition-transform"
                            />
                        </Link>
                    </div>

                    {/* Rich Visual Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {ARTICLES.map((article) => {
                            const IconComponent = article.icon;
                            return (
                                <Link
                                    key={article.to}
                                    to={article.to}
                                    className="group relative h-[380px] rounded-3xl overflow-hidden border border-stone-800 hover:border-orange-500/60 transition-all duration-500 hover:-translate-y-2 shadow-2xl hover:shadow-[0_20px_40px_rgba(249,115,22,0.2)] flex flex-col justify-between p-7"
                                >
                                    {/* Article Cover Image */}
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />

                                    {/* Gradient Overlays */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/40 to-stone-950/95 transition-opacity" />
                                    <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Top Tag Pill Badge */}
                                    <div className="relative z-10 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-1.5 bg-stone-950/75 backdrop-blur-md border border-white/10 text-orange-400 text-[10px] font-heading font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full shadow-lg">
                                            <IconComponent size={12} />
                                            {article.tag}
                                        </span>
                                    </div>

                                    {/* Bottom Content & Arrow */}
                                    <div className="relative z-10 space-y-3">
                                        <h3 className="font-heading font-bold text-2xl text-white group-hover:text-orange-400 transition-colors leading-tight drop-shadow-md">
                                            {article.title}
                                        </h3>
                                        <p className="text-stone-300 text-xs font-light leading-relaxed line-clamp-2 drop-shadow">
                                            {article.blurb}
                                        </p>

                                        <div className="pt-3 flex items-center justify-between text-xs font-heading font-bold uppercase tracking-wider text-orange-400">
                                            <span>Ler artigo</span>
                                            <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 group-hover:bg-orange-500 group-hover:text-white text-orange-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
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
            </div>
        </section>
    );
};

export default BlogSection;
