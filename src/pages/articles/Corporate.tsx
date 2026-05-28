import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Briefcase,
    Wifi,
    Monitor,
    ChevronLeft,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const PHOTOS = [
    'https://i.postimg.cc/W4TFSxSR/305095874.jpg',
    'https://i.postimg.cc/5tbYpDp1/305095888.jpg',
    'https://i.postimg.cc/1zsnMbBJ/334291651.jpg',
    'https://i.postimg.cc/9QGwdcP3/334291394.jpg',
    'https://i.postimg.cc/tgpZD8kK/334291651.jpg',
    'https://i.postimg.cc/YSMG8TRP/334291852.jpg',
];

const CorporateArticle: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === PHOTOS.length - 1 ? 0 : prev + 1));
    };

    const canonicalUrl = "https://www.flatsintegracao.com.br/guia/hospedagem-corporativa-empresas-petrolina";

    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>Hotel ou Flat em Petrolina? A melhor escolha para Empresas</title>
                <meta
                    name="description"
                    content="Viajando a trabalho? Descubra por que executivos preferem alugar flats no Centro. Wi-Fi fibra, Nota Fiscal e economia para sua empresa."
                />
                <meta
                    property="og:title"
                    content="Hotel ou Flat em Petrolina? A melhor escolha para Empresas"
                />
                <meta
                    property="og:description"
                    content="Viajando a trabalho? Descubra por que executivos preferem alugar flats no Centro. Wi-Fi fibra, Nota Fiscal e economia para sua empresa."
                />
                <meta property="og:type" content="article" />
                <meta property="og:image" content="https://i.postimg.cc/tgpZD8kK/334291651.jpg" />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Hotel ou Flat em Petrolina? A melhor escolha para Empresas"
                />
                <meta
                    name="twitter:description"
                    content="Viajando a trabalho? Descubra por que executivos preferem alugar flats no Centro. Wi-Fi fibra, Nota Fiscal e economia para sua empresa."
                />
                <meta name="twitter:image" content="https://i.postimg.cc/tgpZD8kK/334291651.jpg" />
                <link
                    rel="canonical"
                    href={canonicalUrl}
                />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                'name': 'Por que escolher flat em vez de hotel para viagens de negócios em Petrolina?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Flats oferecem mais espaço, cozinha completa para manter a dieta e reduzir custos, além de ambiente separado para trabalho com Wi-Fi de alta velocidade, ideal para executivos que buscam produtividade.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'O Flats Integração emite Nota Fiscal para empresas?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Sim, emitimos Nota Fiscal de serviços para facilitar o reembolso e a contabilidade das empresas.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'O Wi-Fi é estável para reuniões online?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Sim, todos os nossos flats possuem internet de fibra ótica individual de alta velocidade, garantindo estabilidade para videochamadas e apresentações.'
                                }
                            }
                        ]
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': canonicalUrl
                        },
                        headline: 'Hotel ou Flat em Petrolina? A melhor escolha para Empresas',
                        image: 'https://i.postimg.cc/W4TFSxSR/305095874.jpg',
                        author: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br'
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br',
                            sameAs: [
                                'https://maps.app.goo.gl/9QPX2VnGxQwUCpzs6'
                            ],
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg'
                            }
                        },
                        datePublished: '2024-01-15T08:00:00-03:00',
                        dateModified: '2024-01-15T08:00:00-03:00'
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Home',
                                item: 'https://www.flatsintegracao.com.br'
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Guia',
                                item: 'https://www.flatsintegracao.com.br/guia'
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: 'Hospedagem Corporativa',
                                item: canonicalUrl
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-orange-500/20">
                    <Briefcase size={16} />
                    <span>Hospedagem Corporativa</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                    Por que empresas preferem Flats a Hotéis em Petrolina?
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed italic">
                    Conforto de casa com a praticidade que o mundo corporativo exige.
                </p>
            </header>

            {/* Slider de Fotos */}
            <div className="container mx-auto px-4 max-w-4xl mb-16">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                    <img
                        src={PHOTOS[currentSlide]}
                        alt={`Ambiente corporativo flat petrolina ${currentSlide + 1}`}
                        className="w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 to-transparent"></div>
                    
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-orange-500 text-white p-3 rounded-full transition-all backdrop-blur-sm"
                    >
                        <ChevronRight size={24} />
                    </button>
                    
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {PHOTOS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${
                                    i === currentSlide ? 'w-8 bg-orange-500' : 'w-2 bg-white/30'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-orange prose-headings:font-heading prose-headings:font-bold text-stone-300">
                <p className="lead">
                    Viajar a trabalho para o Vale do São Francisco exige foco e produtividade. Em Petrolina, a escolha entre um hotel tradicional e um <strong>flat mobiliado</strong> pode ser o diferencial para o sucesso da sua jornada.
                </p>

                <h2 className="text-white border-b border-white/10 pb-4">A Liberdade de um Escritório Próprio</h2>
                <p>
                    Diferente de um quarto de hotel apertado, nossos flats oferecem <strong>ambientes separados</strong>. Você tem uma mesa de trabalho dedicada, Wi-Fi de alta velocidade (fibra ótica) e o silêncio necessário para reuniões via Zoom ou foco total em relatórios.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <Wifi className="text-orange-500 mb-4" />
                        <h4 className="text-white font-bold mb-2 m-0">Conectividade Premium</h4>
                        <p className="text-sm text-stone-400 m-0">Fibra ótica estável para não cair em apresentações importantes.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <Monitor className="text-orange-500 mb-4" />
                        <h4 className="text-white font-bold mb-2 m-0">Home Office Real</h4>
                        <p className="text-sm text-stone-400 m-0">Ambiente ergonomicamente pensado para longas horas de produtividade.</p>
                    </div>
                </div>

                <h2 className="text-white border-b border-white/10 pb-4">Economia e Alimentação</h2>
                <p>
                    Comer fora em todas as refeições é cansativo e caro. Com uma cozinha completa, o executivo pode manter sua dieta e reduzir drasticamente os custos da empresa com alimentação.
                </p>

                <div className="bg-orange-500/5 p-8 rounded-3xl border border-orange-500/20 my-10">
                    <h3 className="text-orange-400 font-bold mb-4 flex items-center gap-2">
                        <CheckCircle2 size={24} /> Por que Empresas escolhem o Flats Integração:
                    </h3>
                    <ul className="list-none pl-0 space-y-3 m-0">
                        <li className="flex gap-2"><span className="text-orange-500">✓</span> Emissão de Nota Fiscal para reembolso.</li>
                        <li className="flex gap-2"><span className="text-orange-500">✓</span> Localização central (próximo a bancos e cartórios).</li>
                        <li className="flex gap-2"><span className="text-orange-500">✓</span> Check-in via código (sem filas de recepção).</li>
                        <li className="flex gap-2"><span className="text-orange-500">✓</span> Estacionamento incluso e seguro.</li>
                    </ul>
                </div>

                <h2 className="text-white border-b border-white/10 pb-4">Localização Estratégica</h2>
                <p>
                    Estar no Centro de Petrolina significa estar a poucos minutos dos principais hubs de negócios, repartições públicas e centros comerciais da cidade.
                </p>
            </div>

            {/* CTA Final */}
            <div className="bg-orange-600 text-white py-16 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-3xl font-bold mb-4 font-heading">
                        Sua empresa precisa de uma base em Petrolina?
                    </h3>
                    <p className="text-white/80 mb-10 text-lg">
                        Fale com nossa equipe corporativa para tarifas diferenciadas para estadias mensais ou pacotes para sua equipe.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Olá!%20Gostaria%20de%20receber%20um%20orçamento%20corporativo%20para%20minha%20empresa.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-extrabold text-xl transition-all transform hover:scale-105 shadow-xl shadow-black/40"
                    >
                        <Briefcase size={24} />
                        Solicitar Cotação Corporativa
                    </a>
                </div>
            </div>
        </article>
    );
};

export default CorporateArticle;
