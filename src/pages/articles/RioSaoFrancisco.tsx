import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Anchor, Sun, Waves, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const RioSaoFranciscoArticle: React.FC = () => {
    const canonicalUrl = 'https://www.flatsintegracao.com.br/guia/rio-sao-francisco-rodeadouro-barquinha';
    const pageTitle = 'Ilha do Rodeadouro e Barquinha: O que fazer no Rio São Francisco';
    const pageDescription =
        'Guia das melhores experiências no Velho Chico: travessia de barquinha Juazeiro-Petrolina e banho na Ilha do Rodeadouro. Roteiro econômico.';
    const ogImage = 'https://www.flatsintegracao.com.br/assets/blog/rio-sao-francisco-rodeadouro.webp';

    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-300">
            <ArticleScrollReset />
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={ogImage} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                'name': 'Como chegar na Ilha do Rodeadouro em Petrolina?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'A Ilha do Rodeadouro fica a cerca de 12 km do centro de Petrolina. O acesso é feito por estrada pavimentada até o ponto de travessia, onde barcos fazem o transporte de passageiros até a ilha.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Quanto tempo dura a travessia de barquinha Petrolina-Juazeiro?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'A travessia de barquinha entre as orlas de Petrolina (PE) e Juazeiro (BA) dura aproximadamente 10 minutos, sendo uma opção rápida e cênica de deslocamento entre as cidades.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Qual o melhor horário para passear no Rio São Francisco?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'O melhor horário é ao final da tarde, por volta das 17h, para apreciar o pôr do sol sobre o Velho Chico, especialmente durante a travessia de barquinha.'
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
                            '@id': canonicalUrl,
                        },
                        headline: pageTitle,
                        description: pageDescription,
                        image: ogImage,
                        author: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br',
                            sameAs: ['https://maps.app.goo.gl/9QPX2VnGxQwUCpzs6'],
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg',
                            },
                        },
                        datePublished: '2025-12-22T10:00:00-03:00',
                        dateModified: '2026-05-06T10:00:00-03:00',
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
                                item: 'https://www.flatsintegracao.com.br',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Guia',
                                item: 'https://www.flatsintegracao.com.br/guia',
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: 'Rio São Francisco',
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-4xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-blue-500/20">
                    <Anchor size={16} />
                    <span>Passeios</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-8 leading-tight">
                    O Velho Chico: <br />
                    <span className="text-blue-500 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Experiências Fluviais</span>
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">
                    Da travessia tradicional de barquinha ao refúgio relaxante da Ilha do Rodeadouro. 
                    Descubra como viver o Rio São Francisco como um local.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="container mx-auto px-4 max-w-5xl mb-16">
                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                    <img
                        src="/assets/blog/rio-sao-francisco-rodeadouro.webp"
                        alt="Vista panorâmica do Rio São Francisco com a Ilha do Rodeadouro"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-3xl prose prose-invert prose-blue prose-lg">
                <p className="lead text-stone-300 text-xl">
                    <strong>O que fazer no Rio São Francisco em Petrolina?</strong> As duas melhores opções de lazer no "Velho Chico" são a tradicional <strong>travessia de barquinha</strong> entre Petrolina e Juazeiro e o banho nas praias fluviais da <strong>Ilha do Rodeadouro</strong>.
                </p>

                <h2 className="text-white">1. A Travessia de Barquinha: Tradição e Beleza</h2>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl not-prose mb-12">
                    <p className="text-stone-300 mb-6 font-medium">
                        As "barquinhas" não são apenas uma atração turística, mas um modal de transporte
                        eficiente e charmoso utilizado diariamente pela população.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <Waves className="text-blue-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">O Trajeto:</strong> 
                                Dura cerca de 10 minutos. O embarque ocorre na Orla de Petrolina, proporcionando uma vista privilegiada da Ponte Presidente Dutra.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <Sun className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Dica de Ouro:</strong> 
                                Faça a travessia ao entardecer. É a maneira mais barata e bonita de assistir ao pôr do sol no sertão.
                            </span>
                        </li>
                    </ul>
                </div>

                <h2 className="text-white">2. Ilha do Rodeadouro: O Balneário do Vale</h2>
                <p>
                    Localizada a aproximadamente 12 km do centro, esta ilha é o refúgio perfeito para quem busca lazer e contato com a natureza.
                </p>
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-8 my-12 rounded-r-3xl">
                    <p className="text-blue-200 m-0 italic">
                        "Com águas calmas e rasas, o Rodeadouro oferece segurança para banhos relaxantes e uma gastronomia de beira de rio que é referência na região."
                    </p>
                </div>

                <h2 className="text-white">Por que o Centro é a melhor base?</h2>
                <p>
                    Hospedar-se no <strong>Centro de Petrolina</strong> oferece o melhor dos dois mundos:
                </p>
                <ul>
                    <li><strong>Proximidade:</strong> Você pode caminhar até a orla para pegar a barquinha.</li>
                    <li><strong>Acesso:</strong> Fácil saída para a estrada que leva à Ilha do Rodeadouro.</li>
                    <li><strong>Conforto:</strong> No <strong>Flats Integração</strong>, você retorna do rio para o conforto de um flat moderno, silencioso e totalmente climatizado.</li>
                </ul>
            </div>

            {/* CTA Final */}
            <div className="container mx-auto px-4 max-w-4xl mt-20">
                <div className="bg-gradient-to-br from-blue-900/40 to-black p-10 md:p-16 rounded-[2.5rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10"></div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                        Sua varanda para o Velho Chico
                    </h3>
                    <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
                        Aproveite Petrolina no melhor ponto da cidade. Conforto, praticidade e proximidade com o Rio.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-stone-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
                    >
                        Ver disponibilidade <ArrowRight size={22} />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default RioSaoFranciscoArticle;
