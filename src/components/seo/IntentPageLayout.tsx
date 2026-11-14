import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MapPin, MessageCircle } from 'lucide-react';
import { HOST_PHONE } from '../../constants';

type Feature = {
    title: string;
    description: string;
};

type Faq = {
    question: string;
    answer: string;
};

type IntentPageLayoutProps = {
    canonicalPath: string;
    title: string;
    description: string;
    eyebrow: string;
    heading: string;
    lead: string;
    heroImage: string;
    heroImageAlt: string;
    featuresHeading: string;
    featuresLead: string;
    features: Feature[];
    detailHeading: string;
    detailParagraphs: string[];
    faqs: Faq[];
};

const CLUSTER_LINKS = [
    { to: '/hospedagem-em-petrolina', label: 'Hospedagem em Petrolina' },
    { to: '/flat-centro-petrolina', label: 'Flat no Centro' },
    {
        to: '/guia/aluguel-mensal-petrolina-flat-mobiliado',
        label: 'Aluguel mensal',
    },
    {
        to: '/guia/hospedagem-corporativa-empresas-petrolina',
        label: 'Hospedagem para empresas',
    },
] as const;

const IntentPageLayout: React.FC<IntentPageLayoutProps> = ({
    canonicalPath,
    title,
    description,
    eyebrow,
    heading,
    lead,
    heroImage,
    heroImageAlt,
    featuresHeading,
    featuresLead,
    features,
    detailHeading,
    detailParagraphs,
    faqs,
}) => {
    const canonicalUrl = `https://www.flatsintegracao.com.br${canonicalPath}`;
    const whatsappUrl = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
        'Olá! Quero informações sobre hospedagem nos Flats Integração em Petrolina.'
    )}`;

    return (
        <article className="bg-[#12110F] text-stone-200">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta
                    property="og:image"
                    content={`https://www.flatsintegracao.com.br${heroImage}`}
                />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Início',
                                item: 'https://www.flatsintegracao.com.br',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: heading,
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqs.map((faq) => ({
                            '@type': 'Question',
                            name: faq.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: faq.answer,
                            },
                        })),
                    })}
                </script>
            </Helmet>

            <header className="relative min-h-[620px] md:min-h-[680px] flex items-end overflow-hidden bg-[#12110F]">
                <img
                    src={heroImage}
                    alt={heroImageAlt}
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#12110F]/95 via-[#12110F]/60 to-[#12110F]/20" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#12110F]/50 via-transparent to-[#12110F]" />
                <div className="relative z-10 w-full max-w-[1320px] mx-auto px-6 md:px-12 pt-36 md:pt-44 pb-16 md:pb-24">
                    <span className="inline-block text-xs sm:text-sm font-medium text-[#E5C98B] tracking-[0.18em] uppercase mb-4">
                        {eyebrow}
                    </span>
                    <h1 className="max-w-4xl text-4xl sm:text-5xl md:text-6xl font-heading font-semibold text-white leading-[1.06] tracking-[-0.025em]">
                        {heading}
                    </h1>
                    <p className="mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-stone-300 font-light leading-relaxed">
                        {lead}
                    </p>
                    <div className="mt-9 flex flex-col sm:flex-row gap-3.5">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-7 py-3.5 text-sm font-semibold transition-all shadow-lg"
                        >
                            <MessageCircle size={17} aria-hidden />
                            Consultar disponibilidade
                        </a>
                        <Link
                            to="/#galeria"
                            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-white/25 hover:bg-white/10 text-white px-7 py-3.5 text-sm font-medium transition-colors"
                        >
                            Ver os flats <ArrowRight size={17} aria-hidden />
                        </Link>
                    </div>
                </div>
            </header>

            <nav
                aria-label="Opções de hospedagem"
                className="border-y border-white/10 bg-[#12110F]"
            >
                <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-4 flex gap-3 overflow-x-auto no-scrollbar">
                    {CLUSTER_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium tracking-wide transition-colors ${
                                link.to === canonicalPath
                                    ? 'bg-[#E5C98B]/15 border border-[#E5C98B]/40 text-[#E5C98B]'
                                    : 'border border-white/10 text-stone-400 hover:border-white/25 hover:text-white'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>

            <section className="bg-[#F5F2EB] text-[#181614] py-20 md:py-28 border-b border-[#E5E0D5]">
                <div className="max-w-[1320px] mx-auto px-6 md:px-12 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-5 space-y-4">
                        <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#9E6B2B]">
                            Estrutura completa
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#181614] leading-tight tracking-tight">
                            {featuresHeading}
                        </h2>
                        <p className="text-[#5C564E] text-base md:text-lg leading-relaxed">
                            {featuresLead}
                        </p>
                    </div>
                    <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl bg-white border border-[#E5E0D5] p-6 md:p-7 hover:border-[#9E6B2B]/40 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#F5F2EB] border border-[#E5E0D5] flex items-center justify-center mb-5">
                                    <Check size={18} className="text-[#9E6B2B]" aria-hidden />
                                </div>
                                <h3 className="text-lg text-[#181614] font-heading font-semibold">
                                    {feature.title}
                                </h3>
                                <p className="mt-2.5 text-sm text-[#5C564E] leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#12110F] text-stone-200 border-b border-white/10">
                <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-20 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    <div className="lg:col-span-5">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#E5C98B]/10 border border-[#E5C98B]/25 text-[#E5C98B] mb-6">
                            <MapPin size={22} aria-hidden />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-white leading-tight tracking-tight">
                            {detailHeading}
                        </h2>
                    </div>
                    <div className="lg:col-span-7 space-y-6 text-base md:text-lg text-stone-300 font-light leading-relaxed">
                        {detailParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#F5F2EB] text-[#181614] py-20 md:py-28 border-b border-[#E5E0D5]">
                <div className="max-w-4xl mx-auto px-6 md:px-12">
                    <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-[#9E6B2B] mb-3">
                        Dúvidas rápidas
                    </span>
                    <h2 className="text-3xl md:text-4xl font-heading font-semibold text-[#181614] tracking-tight">
                        Perguntas frequentes
                    </h2>
                    <div className="mt-10 space-y-3">
                        {faqs.map((faq) => (
                            <div
                                key={faq.question}
                                className="rounded-2xl bg-white border border-[#E5E0D5] p-6 md:p-7"
                            >
                                <h3 className="text-lg font-heading font-semibold text-[#181614]">
                                    {faq.question}
                                </h3>
                                <p className="mt-2.5 text-[#5C564E] leading-relaxed text-sm md:text-base">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#12110F] py-20 md:py-24 px-6 md:px-12">
                <div className="max-w-[1320px] mx-auto rounded-[2rem] border border-white/10 bg-[#191714] px-6 py-14 md:py-20 text-center">
                    <span className="inline-block text-xs font-medium uppercase tracking-[0.18em] text-[#E5C98B] mb-3">
                        Atendimento direto
                    </span>
                    <h2 className="text-3xl md:text-5xl font-heading font-semibold text-white tracking-tight">
                        Reserve direto em Petrolina
                    </h2>
                    <p className="mt-4 mx-auto max-w-xl text-stone-400 text-base md:text-lg">
                        Fale com os Flats Integração para consultar datas, estadias mensais ou
                        condições para empresas.
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex items-center justify-center gap-2.5 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-8 py-4 text-sm font-semibold transition-all shadow-lg"
                    >
                        Reservar pelo WhatsApp <ArrowRight size={17} aria-hidden />
                    </a>
                </div>
            </section>
        </article>
    );
};

export default IntentPageLayout;
