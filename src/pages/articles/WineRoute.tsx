import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, DollarSign, MapPin, Wine, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';
import { ArticleCategoryBadge, ArticleFinalCTA } from '../../components/articles/ArticleChrome';

const WineRouteArticle: React.FC = () => {
    const canonicalUrl = 'https://www.flatsintegracao.com.br/guia/roteiro-vinho-petrolina';
    const pageTitle = 'Roteiro do Vinho no Vale do São Francisco: Guia Completo e Preços';
    const pageDescription =
        'Descubra como visitar as vinícolas Miolo (Vapor do Vinho) e Rio Sol saindo de Petrolina. Dicas de preços, horários e onde se hospedar.';
    const ogImage = 'https://www.flatsintegracao.com.br/assets/blog/vapor-do-vinho-montagem.webp';

    return (
        <article className="pt-32 md:pt-40 pb-20 min-h-screen bg-[#12110F] text-stone-200">
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
                                name: 'Quais vinícolas visitar em Petrolina?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'As vinícolas mais visitadas são a Miolo (Terranova), famosa pelo passeio Vapor do Vinho, e a Rio Sol, que oferece o Wine Day com pisa da uva e almoço harmonizado.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Quanto custa o passeio Vapor do Vinho?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'O passeio custa em média R$ 260 por pessoa, incluindo transfer de Petrolina, navegação pelo Rio São Francisco, almoço e visita à Vinícola Miolo.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Como agendar visita às vinícolas do Vale do São Francisco?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'As visitas podem ser agendadas diretamente nos sites das operadoras de turismo ou nas próprias vinícolas. Recomendamos reservar com antecedência, especialmente nos finais de semana.',
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
                <ArticleCategoryBadge icon={<Wine size={15} />} label="Enoturismo" />
                <h1 className="text-4xl md:text-6xl font-semibold text-white font-heading mb-6 leading-tight tracking-tight">
                    Roteiro do Vinho no <br />
                    <span className="text-[#E5C98B]">Vale do São Francisco</span>
                </h1>
                <p className="text-lg md:text-xl text-stone-400 leading-relaxed max-w-2xl mx-auto">
                    Você sabia que o sertão virou mar... de vinho? O guia definitivo para escolher
                    seu passeio e aproveitar o melhor do enoturismo no sertão.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="container mx-auto px-4 max-w-5xl mb-16">
                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#191714]">
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
            <div className="container mx-auto px-4 max-w-3xl prose prose-invert prose-headings:font-heading prose-headings:font-semibold prose-a:text-[#E5C98B] prose-lg text-stone-300">
                <p className="lead text-stone-200 text-xl">
                    <strong>
                        Como fazer o Roteiro do Vinho em Petrolina e quais as melhores vinícolas
                        para visitar?
                    </strong>
                    As opções mais procuradas são o tradicional{' '}
                    <strong>Vapor do Vinho (Miolo/Terranova)</strong> e o
                    <strong>Wine Day na Vinícola Rio Sol</strong>. Ambas oferecem transfer e custam
                    em média R$ 260 por pessoa.
                </p>

                <h2 className="text-white">1. O que é o Vapor do Vinho e a visita à Miolo?</h2>
                <div className="bg-[#191714] border border-white/10 p-8 rounded-3xl not-prose mb-12">
                    <p className="text-stone-300 mb-6">
                        É o passeio mais famoso da região, unindo enoturismo e navegação pelo Velho
                        Chico. É ideal para quem quer uma experiência completa de dia inteiro.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <Clock className="text-[#E5C98B] shrink-0" size={22} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">O Roteiro:</strong>
                                Começa por volta das 8h. Ônibus até Sobradinho, embarque no catamarã
                                com música ao vivo, jacuzzi e toboágua. Inclui banho na Ilha da
                                Fantasia e almoço.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <MapPin className="text-[#E5C98B] shrink-0" size={22} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">A Vinícola:</strong>
                                Visita à{' '}
                                <strong className="text-white">
                                    Vinícola Miolo (Terranova)
                                </strong>{' '}
                                em Casa Nova (BA). Degustação de espumantes, vinhos e Brandy.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <DollarSign className="text-[#E5C98B] shrink-0" size={22} />
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
                            className="inline-flex items-center gap-2 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-7 py-3.5 rounded-full font-semibold text-sm transition-all shadow-lg"
                        >
                            Reservar Vapor do Vinho <ArrowRight size={18} />
                        </a>
                    </div>
                </div>

                <h2 className="text-white">2. Passeio Wine Day na Vinícola Rio Sol</h2>
                <p>
                    Se o seu foco é pisar na uva e ter um contato mais profundo com a produção, a
                    Vinícola Rio Sol, em Lagoa Grande (PE), oferece um roteiro incrível.
                </p>
                <div className="bg-[#191714] border border-white/10 p-8 rounded-3xl not-prose mb-12">
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <Clock className="text-[#E5C98B] shrink-0" size={22} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Foco no Campo:</strong>
                                Visita guiada aos parreirais (com prova de uvas do pé!), fábrica e
                                adega. Pôr do sol no Rio São Francisco com espumante liberado.
                            </span>
                        </li>
                        <li className="flex gap-4">
                            <Calendar className="text-[#E5C98B] shrink-0" size={22} />
                            <span className="text-stone-300">
                                <strong className="text-white block mb-1">Quando:</strong>
                                Geralmente aos sábados, com almoço regional harmonizado incluso.
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-[#191714] border-l-4 border-[#E5C98B] border-y border-r border-white/10 p-8 my-12 rounded-r-3xl not-prose">
                    <p className="text-stone-200 m-0 italic leading-relaxed">
                        "O Vale do São Francisco é a única região do mundo que produz vinhos finos o
                        ano inteiro. Cada visita é uma experiência única de adaptação e tecnologia
                        no Semiárido."
                    </p>
                </div>

                <h2 className="text-white">Por que o Centro de Petrolina é a melhor base?</h2>
                <p>
                    Os passeios são intensos e costumam durar o dia todo. Hospedar-se no Centro,
                    como no <strong>Flats Integração</strong>, oferece vantagens práticas:
                </p>
                <ul>
                    <li>
                        <strong>Facilidade de Transfer:</strong> As agências buscam você na porta.
                    </li>
                    <li>
                        <strong>Logística Gastronômica:</strong> Ao voltar, você está perto dos
                        melhores restaurantes da cidade sem precisar de carro.
                    </li>
                    <li>
                        <strong>Custo-Benefício:</strong> Economize na hospedagem premium e invista
                        em experiências e vinhos.
                    </li>
                </ul>
            </div>

            <ArticleFinalCTA
                eyebrow="Enoturismo no Vale"
                heading="Sua adega particular no Centro"
                description="Depois de um dia explorando vinícolas, nada melhor do que relaxar em um flat moderno e silencioso."
                primary={{
                    href: `https://wa.me/${HOST_PHONE}`,
                    label: 'Ver disponibilidade',
                    icon: <ArrowRight size={18} />,
                    external: true,
                }}
            />
        </article>
    );
};

export default WineRouteArticle;
