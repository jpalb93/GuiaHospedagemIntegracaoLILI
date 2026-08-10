import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
    Hotel,
    Home,
    DollarSign,
    CheckCircle2,
    Coffee,
    UtensilsCrossed,
    Users,
    Zap,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const FlatVsHotelArticle: React.FC = () => {
    const slug = 'flat-ou-hotel-petrolina-comparativo';
    const canonicalUrl = `https://www.flatsintegracao.com.br/guia/${slug}`;
    const pageTitle = 'Flat ou Hotel em Petrolina? Descubra o Melhor Custo-Benefício';
    const pageDescription =
        'Comparativo completo entre hotel e flat por temporada em Petrolina. Veja preços, vantagens e qual opção vale mais a pena para sua viagem ao Sertão.';

    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="article" />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/images/cozinha-jantar.jpg"
                />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/images/cozinha-jantar.jpg"
                />
                <link rel="canonical" href={canonicalUrl} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'O que é mais barato em Petrolina: hotel ou flat?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'Geralmente, o flat por temporada oferece melhor custo-benefício, especialmente para estadias de mais de 2 noites ou para grupos, pois permite economizar com alimentação e oferece diárias competitivas a partir de R$ 199.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Quais as vantagens de um flat mobiliado em relação a um hotel?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'As principais vantagens são a cozinha privativa completa, maior espaço interno, maior privacidade e silêncio, além da autonomia de se sentir em casa durante a viagem.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'O Flats Integração tem serviço de quarto como hotel?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'Não oferecemos serviço de quarto diário ou café da manhã, pois nosso foco é oferecer autonomia total e preços mais baixos. No entanto, fornecemos enxoval completo e o flat é entregue higienizado.',
                                },
                            },
                        ],
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
                        image: 'https://www.flatsintegracao.com.br/images/cozinha-jantar.jpg',
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
                        datePublished: '2026-05-06T10:00:00-03:00',
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
                                name: 'Flat ou Hotel',
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-orange-500/20">
                    <Zap size={16} />
                    <span>Guia de Viagem</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                    Flat ou Hotel em Petrolina? Qual a Melhor Opção Para Você?
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed">
                    Comparamos preços, conforto e autonomia para você decidir onde se hospedar no
                    Vale do São Francisco.
                </p>
            </header>

            {/* Comparativo Visual */}
            <div className="container mx-auto px-4 max-w-4xl mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Hotel Card */}
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
                        <Hotel className="text-stone-500 mb-4" size={40} />
                        <h3 className="text-2xl font-bold mb-4 text-white font-heading">
                            Hotel Tradicional
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-stone-400">
                                <CheckCircle2 size={18} className="text-stone-600 mt-1 shrink-0" />
                                <span>Café da manhã incluso</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-400">
                                <CheckCircle2 size={18} className="text-stone-600 mt-1 shrink-0" />
                                <span>Recepção 24 horas</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-600 italic text-sm">
                                <Zap size={18} className="mt-1 shrink-0" />
                                <span>Menos privacidade (corredores cheios)</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-600 italic text-sm">
                                <Zap size={18} className="mt-1 shrink-0" />
                                <span>Sem cozinha no quarto</span>
                            </li>
                        </ul>
                    </div>

                    {/* Flat Card */}
                    <div className="bg-orange-600/10 rounded-3xl p-8 border border-orange-500/30 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
                        <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-tighter">
                            Melhor Escolha
                        </div>
                        <Home className="text-orange-500 mb-4" size={40} />
                        <h3 className="text-2xl font-bold mb-4 text-white font-heading">
                            Flat Mobiliado
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-stone-200">
                                <CheckCircle2 size={18} className="text-orange-500 mt-1 shrink-0" />
                                <span>Cozinha completa e autonomia</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-200">
                                <CheckCircle2 size={18} className="text-orange-500 mt-1 shrink-0" />
                                <span>Mais espaço e sensação de casa</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-200">
                                <CheckCircle2 size={18} className="text-orange-500 mt-1 shrink-0" />
                                <span>Melhor preço para famílias/grupos</span>
                            </li>
                            <li className="flex items-start gap-2 text-stone-200 font-bold">
                                <CheckCircle2 size={18} className="text-orange-500 mt-1 shrink-0" />
                                <span>Privacidade total</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-orange prose-headings:font-heading prose-headings:font-bold text-stone-300">
                <section>
                    <p>
                        Petrolina oferece hoje uma rede hoteleira robusta, mas o crescimento do{' '}
                        <strong>aluguel por temporada</strong> trouxe uma nova alternativa que tem
                        conquistado tanto turistas quanto executivos: os flats mobiliados no Centro.
                    </p>
                </section>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <DollarSign className="text-orange-500" size={28} />
                    Entendendo os preços em Petrolina
                </h2>
                <p>
                    Dados de buscadores mostram que as diárias em hotéis 3 estrelas variam entre{' '}
                    <strong>R$ 300 e R$ 340</strong>. Para uma família de 4 pessoas, isso muitas
                    vezes significa reservar dois quartos, dobrando o custo.
                </p>
                <p>
                    Já o <strong>aluguel de temporada no Centro</strong> permite acomodar mais
                    pessoas pelo mesmo valor de uma diária de hotel individual, oferecendo diárias
                    competitivas a partir de <strong>R$ 199</strong> em imóveis bem localizados.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Coffee className="text-orange-500" size={28} />
                    Quando o Hotel faz mais sentido?
                </h2>
                <p>
                    O hotel é ideal para quem está de passagem rápida (apenas uma noite) e não quer
                    ter trabalho nenhum. Se você valoriza ter o café da manhã pronto ao acordar e
                    não se importa em comer fora em todas as refeições, os hotéis tradicionais
                    atendem bem.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <UtensilsCrossed className="text-orange-500" size={28} />A liberdade do Flat e a
                    economia real
                </h2>
                <p>
                    A grande diferença está na <strong>cozinha equipada</strong>. Em um flat, você
                    economiza não apenas na diária, mas também na alimentação. Poder preparar seu
                    próprio jantar ou ter um frigobar para suas compras de mercado faz toda a
                    diferença em estadias de 3 dias ou mais.
                </p>
                <div className="bg-white/5 border-l-4 border-orange-500 p-8 my-10 rounded-r-3xl">
                    <h3 className="m-0 text-xl font-bold text-white mb-2">
                        Custo-benefício calculado
                    </h3>
                    <p className="m-0 text-stone-400 italic">
                        "Estudos mostram que viajantes em flats economizam até 40% do orçamento
                        total da viagem ao reduzir gastos com restaurantes e taxas de serviço de
                        hotéis."
                    </p>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Users className="text-orange-500" size={28} />
                    Veredito: Qual escolher?
                </h2>
                <p>
                    Escolha um <strong>Hotel</strong> se:
                </p>
                <ul>
                    <li>Sua estadia for de apenas 1 noite.</li>
                    <li>Você viaja sozinho e faz questão de serviço de quarto.</li>
                </ul>
                <p>
                    Escolha um <strong>Flat (como o Flats Integração)</strong> se:
                </p>
                <ul>
                    <li>Sua estadia for de 2 noites ou mais.</li>
                    <li>Você viaja em família, casal ou grupo de amigos.</li>
                    <li>Você valoriza silêncio, privacidade e quer se sentir em casa.</li>
                    <li>Você vem para tratamento médico ou trabalho prolongado.</li>
                </ul>
            </div>

            {/* CTA Final */}
            <div className="bg-stone-900 border-t border-white/5 text-white py-20 mt-20 text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 font-heading">
                        Quer a liberdade de um flat com preço de hotel econômico?
                    </h3>
                    <p className="text-stone-400 mb-12 text-xl">
                        Nossos flats no Centro de Petrolina são a escolha lógica para quem busca o
                        melhor custo-benefício.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href={`https://wa.me/${HOST_PHONE}?text=Olá!%20Li%20o%20artigo%20comparativo%20de%20preços%20e%20quero%20um%20orçamento.`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-orange-600 hover:bg-orange-500 text-white px-10 py-5 rounded-full font-extrabold text-xl transition-all shadow-xl shadow-orange-600/40"
                        >
                            Ver Preços e Fotos
                        </a>
                        <a
                            href="/guia"
                            className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-full font-bold text-xl transition-all"
                        >
                            Ver Outras Dicas
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default FlatVsHotelArticle;
