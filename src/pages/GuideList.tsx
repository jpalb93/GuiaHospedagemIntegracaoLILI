import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { articles } from '../data/articles';

const GuideList: React.FC = () => {
    return (
        <div className="pt-24 pb-16 min-h-screen bg-gray-50">
            <Helmet>
                <title>Guia de Petrolina: O que fazer e onde ir | Flats Integração</title>
                <meta
                    name="description"
                    content="Explore o melhor de Petrolina com nosso guia exclusivo para hóspedes. Roteiros de vinho, restaurantes, passeios e muito mais."
                />
                <link rel="canonical" href="https://www.flatsintegracao.com.br/guia" />
                <meta property="og:url" content="https://www.flatsintegracao.com.br/guia" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content="Guia de Petrolina: O que fazer e onde ir | Flats Integração"
                />
                <meta
                    property="og:description"
                    content="Explore o melhor de Petrolina com nosso guia exclusivo para hóspedes. Roteiros de vinho, restaurantes, passeios e muito mais."
                />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/assets/blog/vapor-do-vinho-montagem.webp"
                />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Guia de Petrolina: O que fazer e onde ir | Flats Integração"
                />
                <meta
                    name="twitter:description"
                    content="Explore o melhor de Petrolina com nosso guia exclusivo para hóspedes. Roteiros de vinho, restaurantes, passeios e muito mais."
                />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/assets/blog/vapor-do-vinho-montagem.webp"
                />
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
                                name: 'Guia de Petrolina',
                                item: 'https://www.flatsintegracao.com.br/guia'
                            }
                        ]
                    })}
                </script>
            </Helmet>

            <div className="container mx-auto px-4 mb-12 text-center">
                <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 block">
                    Blog de Viagem
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-heading mb-6">
                    Guia do Viajante em Petrolina
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Dicas locais, segredos da cidade e roteiros imperdíveis selecionados para você
                    viver a melhor experiência no Vale do São Francisco.
                </p>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <Link key={article.id} to={`/guia/${article.slug}`} className="group">
                            <article className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col">
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        width={800}
                                        height={450}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {article.highlight && (
                                        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            Imperdível
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                                        {article.icon ? (
                                            <article.icon size={14} />
                                        ) : (
                                            <MapPin size={14} />
                                        )}
                                        <span>{article.locationLabel || article.category}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {article.description}
                                    </p>
                                    <div className="mt-auto flex items-center text-orange-500 font-bold text-sm">
                                        Ler Artigo{' '}
                                        <ArrowRight
                                            size={16}
                                            className="ml-2 group-hover:translate-x-1 transition-transform"
                                        />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GuideList;
