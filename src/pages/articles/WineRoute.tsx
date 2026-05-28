import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, DollarSign, MapPin, Wine, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const WineRouteArticle: React.FC = () => {
    const canonicalUrl = 'https://www.flatsintegracao.com.br/guia/roteiro-vinho-petrolina';
    const pageTitle = 'Roteiro do Vinho no Vale do São Francisco: Guia Completo e Preços';
    const pageDescription =
        'Descubra como visitar as vinícolas Miolo (Vapor do Vinho) e Rio Sol saindo de Petrolina. Dicas de preços, horários e onde se hospedar.';
    const ogImage = 'https://www.flatsintegracao.com.br/assets/blog/vapor-do-vinho-montagem.webp';

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
                                'name': 'Quais vinícolas visitar em Petrolina?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'As vinícolas mais visitadas são a Miolo (Terranova), famosa pelo passeio Vapor do Vinho, e a Rio Sol, que oferece o Wine Day com pisa da uva e almoço harmonizado.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Quanto custa o passeio Vapor do Vinho?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'O passeio custa em média R$ 260 por pessoa, incluindo transfer de Petrolina, navegação pelo Rio São Francisco, almoço e visita à Vinícola Miolo.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Como agendar visita às vinícolas do Vale do São Francisco?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'As visitas podem ser agendadas diretamente nos sites das operadoras de turismo ou nas próprias vinícolas. Recomendamos reservar com antecedência, especialmente nos finais de semana.'
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
                        datePublished: '2025-12-21T10:00:00-03:00',
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
                                name: 'Roteiro do Vinho',
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-4xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-orange-500/20">
                    <Wine size={16} />
                    <span>Enoturismo</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white font-heading mb-8 leading-tight">
                    Roteiro do Vinho no <br />
                    <span className="text-orange-500">Vale do São Francisco</span>
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">
                    Você sabia que o sertão virou mar... de vinho? O guia definitivo para escolher 
                    seu passeio e aproveitar o melhor do enoturismo no sertão.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="container mx-auto px-4 max-w-5xl mb-16">
                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <img
                        src="/assets/blog/vapor-do-vinho-montagem.webp"
                        alt="Turistas visitando parreirais de uva e degustando vinhos"
                        width={1200}
                        height={675}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-3xl prose prose-invert prose-orange prose-lg">
                <p className="lead text-stone-300 text-xl">
                    <strong>Como fazer o Roteiro do Vinho em Petrolina e quais as melhores vinícolas para visitar?</strong> 
                    As opções mais procuradas são o tradicional <strong>Vapor do Vinho (Miolo/Terranova)</strong> e o 
                    <strong>Wine Day na Vinícola Rio Sol</strong>. Ambas oferecem transfer e custam em média R$ 260 por pessoa.
                </p>

                <h2 className="text-white">1. O que é o Vapor do Vinho e a visita à Miolo?</h2>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl not-prose mb-12">
                    <p className="text-stone-300 mb-6">
                        É o passeio mais famoso da região, unindo enoturismo e navegação pelo Velho
                        Chico. É ideal para quem quer uma experiência completa de dia inteiro.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <Clock className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">O Roteiro:</strong> 
                                Começa por volta das 8h. Ônibus até Sobradinho, embarque no catamarã com música ao vivo, jacuzzi e toboágua. Inclui banho na Ilha da Fantasia e almoço.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <MapPin className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">A Vinícola:</strong> 
                                Visita à <strong>Vinícola Miolo (Terranova)</strong> em Casa Nova (BA). Degustação de espumantes, vinhos e Brandy.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <DollarSign className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Investimento:</strong> 
                                Média de R$ 260,00 por pessoa (almoço, transfer e visita inclusos).
                            </span>
                        </li>
                    </ul>
                    <div className="mt-8">
                        <a
                            href="https://vapordosaofrancisco.com/"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg shadow-orange-600/20"
                        >
                            Reservar Vapor do Vinho <ArrowRight size={20} />
                        </a>
                    </div>
                </div>

                <h2 className="text-white">2. Passeio Wine Day na Vinícola Rio Sol</h2>
                <p>
                    Se o seu foco é pisar na uva e ter um contato mais profundo com a produção, a
                    Vinícola Rio Sol, em Lagoa Grande (PE), oferece um roteiro incrível.
                </p>
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl not-prose mb-12">
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <Clock className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Foco no Campo:</strong> 
                                Visita guiada aos parreirais (com prova de uvas do pé!), fábrica e adega. Pôr do sol no Rio São Francisco com espumante liberado.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <Calendar className="text-orange-500 shrink-0" size={24} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Quando:</strong> 
                                Geralmente aos sábados, com almoço regional harmonizado incluso.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-8 my-12 rounded-r-3xl">
                    <p className="text-orange-200 m-0 italic">
                        "O Vale do São Francisco é a única região do mundo que produz vinhos finos o ano inteiro. Cada visita é uma experiência única de adaptação e tecnologia no Semiárido."
                    </p>
                </div>

                <h2 className="text-white">Por que o Centro de Petrolina é a melhor base?</h2>
                <p>
                    Os passeios são intensos e costumam durar o dia todo. Hospedar-se no Centro, como no <strong>Flats Integração</strong>, oferece vantagens práticas:
                </p>
                <ul>
                    <li><strong>Facilidade de Transfer:</strong> As agências buscam você na porta.</li>
                    <li><strong>Logística Gastronômica:</strong> Ao voltar, você está perto dos melhores restaurantes da cidade sem precisar de carro.</li>
                    <li><strong>Custo-Benefício:</strong> Economize na hospedagem premium e invista em experiências e vinhos.</li>
                </ul>
            </div>

            {/* CTA Final */}
            <div className="container mx-auto px-4 max-w-4xl mt-20">
                <div className="bg-gradient-to-br from-stone-900 to-black p-10 md:p-16 rounded-[2.5rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[100px] -z-10"></div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 font-heading">
                        Sua adega particular no Centro
                    </h3>
                    <p className="text-stone-400 text-lg mb-10 max-w-lg mx-auto">
                        Depois de um dia explorando vinícolas, nada melhor do que relaxar em um flat moderno e silencioso.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-stone-950 px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
                    >
                        Ver disponibilidade <ArrowRight size={22} />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default WineRouteArticle;
