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
        <article className="bg-stone-950 text-stone-300">
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

            <header className="relative min-h-[680px] flex items-end overflow-hidden">
                <img
                    src={heroImage}
                    alt={heroImageAlt}
                    width={1920}
                    height={1080}
                    fetchPriority="high"
                    className="absolute inset-0 h-full w-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/20" />
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-36 pb-20 md:pb-28">
                    <p className="text-orange-500 text-xs font-heading font-bold uppercase tracking-[0.2em] mb-5">
                        {eyebrow}
                    </p>
                    <h1 className="max-w-5xl text-4xl sm:text-5xl md:text-7xl font-heading font-bold text-white leading-[1.05] tracking-tight">
                        {heading}
                    </h1>
                    <p className="mt-7 max-w-2xl text-lg md:text-xl text-stone-300 font-light leading-relaxed">
                        {lead}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-3 bg-stone-100 hover:bg-white text-stone-950 px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] transition-colors"
                        >
                            <MessageCircle size={18} aria-hidden />
                            Consultar disponibilidade
                        </a>
                        <Link
                            to="/#galeria"
                            className="inline-flex items-center justify-center gap-3 border border-white/25 hover:border-white/60 text-white px-8 py-5 text-xs font-bold uppercase tracking-[0.15em] transition-colors"
                        >
                            Ver os flats <ArrowRight size={18} aria-hidden />
                        </Link>
                    </div>
                </div>
            </header>

            <nav
                aria-label="Opções de hospedagem"
                className="border-y border-stone-800 bg-stone-950"
            >
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex gap-x-8 gap-y-4 overflow-x-auto">
                    {CLUSTER_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`whitespace-nowrap text-xs uppercase tracking-[0.14em] font-bold transition-colors ${
                                link.to === canonicalPath
                                    ? 'text-orange-500'
                                    : 'text-stone-500 hover:text-stone-200'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </nav>

            <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight tracking-tight">
                            {featuresHeading}
                        </h2>
                        <p className="mt-6 text-stone-400 text-lg leading-relaxed">
                            {featuresLead}
                        </p>
                    </div>
                    <div className="lg:col-span-7 grid sm:grid-cols-2 border-t border-stone-800">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className={`py-8 sm:px-7 border-b border-stone-800 ${
                                    index % 2 === 0 ? 'sm:border-r' : ''
                                }`}
                            >
                                <Check size={20} className="text-orange-500 mb-5" aria-hidden />
                                <h3 className="text-xl text-white font-heading font-medium">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-sm text-stone-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-stone-800 bg-stone-900/40">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-28 grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <div className="lg:col-span-5">
                        <MapPin size={28} className="text-orange-500 mb-6" aria-hidden />
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight tracking-tight">
                            {detailHeading}
                        </h2>
                    </div>
                    <div className="lg:col-span-7 space-y-6 text-lg text-stone-400 font-light leading-relaxed">
                        {detailParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-4xl mx-auto px-6 md:px-12 py-24 md:py-28">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
                    Perguntas frequentes
                </h2>
                <div className="mt-10 divide-y divide-stone-800 border-y border-stone-800">
                    {faqs.map((faq) => (
                        <div key={faq.question} className="py-7">
                            <h3 className="text-lg font-heading font-medium text-stone-100">
                                {faq.question}
                            </h3>
                            <p className="mt-3 text-stone-400 leading-relaxed">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="border-t border-stone-800">
                <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">
                        Reserve direto em Petrolina
                    </h2>
                    <p className="mt-5 mx-auto max-w-xl text-stone-400 text-lg">
                        Fale com os Flats Integração para consultar datas, estadias mensais ou
                        condições para empresas.
                    </p>
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-8 inline-flex items-center justify-center gap-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-colors"
                    >
                        Reservar pelo WhatsApp <ArrowRight size={17} aria-hidden />
                    </a>
                </div>
            </section>
        </article>
    );
};

export default IntentPageLayout;
