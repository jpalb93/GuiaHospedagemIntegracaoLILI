import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { articles } from '../data/articles';

const GuideList: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F5F2EB] text-[#181614]">
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
                                item: 'https://www.flatsintegracao.com.br',
                            },
                            {
                                '@type': 'ListItem',
                                position: 2,
                                name: 'Guia de Petrolina',
                                item: 'https://www.flatsintegracao.com.br/guia',
                            },
                        ],
                    })}
                </script>
            </Helmet>

            <header className="bg-[#12110F] text-white pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-12 border-b border-white/10">
                <div className="max-w-[1320px] mx-auto text-center">
                    <span className="inline-block text-xs sm:text-sm font-medium text-[#E5C98B] tracking-[0.18em] uppercase mb-3">
                        Blog de Viagem
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white font-heading tracking-tight mb-5">
                        Guia do Viajante em Petrolina
                    </h1>
                    <p className="text-stone-400 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
                        Dicas locais, segredos da cidade e roteiros imperdíveis selecionados para
                        você viver a melhor experiência no Vale do São Francisco.
                    </p>
                </div>
            </header>

            <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <Link key={article.id} to={`/guia/${article.slug}`} className="group">
                            <article className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D5] hover:border-[#9E6B2B]/40 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                <div className="h-60 overflow-hidden relative bg-stone-200">
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
                                        <div className="absolute top-4 left-4 bg-[#141210]/90 text-[#E5C98B] border border-[#E5C98B]/30 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                                            Imperdível
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-[#5C564E] text-xs font-medium uppercase tracking-wider mb-3">
                                        {article.icon ? (
                                            <article.icon size={14} className="text-[#9E6B2B]" />
                                        ) : (
                                            <MapPin size={14} className="text-[#9E6B2B]" />
                                        )}
                                        <span>{article.locationLabel || article.category}</span>
                                    </div>
                                    <h2 className="text-xl font-heading font-semibold text-[#181614] mb-3 group-hover:text-[#9E6B2B] transition-colors">
                                        {article.title}
                                    </h2>
                                    <p className="text-[#5C564E] text-sm mb-5 line-clamp-3 leading-relaxed">
                                        {article.description}
                                    </p>
                                    <div className="mt-auto inline-flex items-center text-[#181614] group-hover:text-[#9E6B2B] font-semibold text-sm transition-colors">
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
