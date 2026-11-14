import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Music, Calendar, Star, Flame, Users, Navigation } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';
import { ArticleCategoryBadge, ArticleFinalCTA } from '../../components/articles/ArticleChrome';

const SaoJoaoArticle: React.FC = () => {
    const slug = 'onde-ficar-petrolina-sao-joao-guia';
    const canonicalUrl = `https://www.flatsintegracao.com.br/guia/${slug}`;
    const pageTitle = 'Onde ficar no São João de Petrolina 2026: Guia de Hospedagem';
    const pageDescription =
        'Vai curtir o melhor São João do Brasil? Veja as melhores opções de hospedagem no Centro de Petrolina, perto do Pátio Ana das Carrancas e da Vila Junina.';

    return (
        <article className="pt-32 md:pt-40 pb-20 min-h-screen bg-[#12110F] text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="article" />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/images/entretenimento.jpg"
                />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/images/entretenimento.jpg"
                />
                <link rel="canonical" href={canonicalUrl} />

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                name: 'Onde fica o Pátio do São João de Petrolina?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'O palco principal, Pátio de Eventos Ana das Carrancas, fica a cerca de 10-15 minutos de carro do centro de Petrolina. É uma área ampla projetada para grandes shows e eventos.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Qual o melhor lugar para se hospedar no São João de Petrolina?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'O Centro de Petrolina é considerado a melhor base, pois oferece facilidade de acesso a serviços (bancos, farmácias, mercados) e melhor logística de transporte para o Pátio de Eventos, além de concentrar as festas diurnas.',
                                },
                            },
                            {
                                '@type': 'Question',
                                name: 'Como ir do Centro para o Pátio Ana das Carrancas?',
                                acceptedAnswer: {
                                    '@type': 'Answer',
                                    text: 'A maneira mais comum é via aplicativos de transporte ou transfers oficiais que circulam durante o período junino. Recomendamos sair com antecedência nos dias de grandes atrações devido ao fluxo intenso de trânsito.',
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
                        image: 'https://www.flatsintegracao.com.br/images/entretenimento.jpg',
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
                        datePublished: '2026-05-06T11:00:00-03:00',
                        dateModified: '2026-05-06T11:00:00-03:00',
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
                                name: 'São João de Petrolina',
                                item: canonicalUrl,
                            },
                        ],
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <ArticleCategoryBadge icon={<Flame size={15} />} label="São João 2026" />
                <h1 className="text-3xl md:text-5xl font-semibold text-white font-heading mb-6 leading-tight tracking-tight">
                    Onde Ficar para o São João de Petrolina: Guia de Hospedagem no Centro
                </h1>
                <p className="text-lg md:text-xl text-stone-400 leading-relaxed italic">
                    Dicas estratégicas para curtir o Pátio Ana das Carrancas com conforto, segurança
                    e mobilidade.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="container mx-auto px-4 max-w-4xl mb-12">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#191714]">
                    <img
                        src="/images/entretenimento.jpg"
                        alt="Área de convivência e entretenimento do flat, ideal para relaxar durante o São João"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/80 to-transparent"></div>
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-headings:font-heading prose-headings:font-semibold prose-a:text-[#E5C98B] text-stone-300">
                <section>
                    <p>
                        O <strong>São João de Petrolina</strong> consolidou-se como um dos maiores e
                        mais organizados festejos juninos do Brasil. Com uma programação que mistura
                        grandes astros nacionais e o autêntico forró pé-de-serra, a cidade recebe
                        milhares de turistas em junho.
                    </p>
                    <p>
                        A grande dúvida de quem vem pela primeira vez é:{' '}
                        <strong>vale a pena ficar perto do Pátio de Eventos ou no Centro?</strong>{' '}
                        Vamos te mostrar por que o Centro é a escolha inteligente.
                    </p>
                </section>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Navigation className="text-[#E5C98B]" size={26} />
                    Pátio Ana das Carrancas: Onde a festa acontece
                </h2>
                <p>
                    O Pátio de Eventos Ana das Carrancas é o palco principal, localizado a cerca de
                    10-15 minutos do Centro. Embora a festa seja lá, a maioria dos visitantes
                    prefere se hospedar no <strong>Centro</strong> pela facilidade de serviços
                    durante o dia e pela segurança.
                </p>
                <div className="bg-[#191714] p-6 md:p-8 rounded-2xl border border-[#E5C98B]/25 my-8 not-prose">
                    <h3 className="text-[#E5C98B] font-semibold font-heading text-lg mb-3 flex items-center gap-2">
                        <Star size={18} /> Dica de Ouro:
                    </h3>
                    <p className="text-stone-300 text-sm md:text-base m-0 leading-relaxed">
                        O trânsito perto do Pátio fica muito intenso nas noites de grandes shows.
                        Hospedar-se no Centro permite que você use aplicativos de transporte ou
                        transfers oficiais com muito mais facilidade e tenha acesso a bancos e
                        farmácias sem precisar cruzar a cidade.
                    </p>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Music className="text-[#E5C98B]" size={26} />
                    Atrações além do Pátio
                </h2>
                <p>
                    O São João de Petrolina não é só o palco principal. Durante o dia, o{' '}
                    <strong>Centro</strong> ganha vida com o "São João nos Bairros" e a Vila Junina.
                    Ficar hospedado no coração da cidade significa estar a poucos passos da agitação
                    cultural diurna, antes de seguir para o Pátio à noite.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Users className="text-[#E5C98B]" size={26} />
                    Vantagens de alugar um Flat no São João
                </h2>
                <p>
                    Para quem viaja em grupo de amigos ou família (muito comum no São João), os
                    flats mobiliados oferecem vantagens imbatíveis:
                </p>
                <ul>
                    <li>
                        <strong>Independência:</strong> Prepare seu café da manhã em qualquer
                        horário (ideal para quem chega tarde da festa).
                    </li>
                    <li>
                        <strong>Conforto:</strong> Ar-condicionado potente é essencial para o calor
                        de Petrolina, mesmo em junho.
                    </li>
                    <li>
                        <strong>Social:</strong> Sala integrada para reunir o grupo antes de sair
                        para o Pátio.
                    </li>
                </ul>

                <div className="mt-12 bg-[#191714] border border-white/10 rounded-3xl p-8 shadow-2xl not-prose">
                    <h2 className="text-white font-heading font-semibold text-2xl md:text-3xl mb-4 flex items-center gap-3">
                        <Calendar className="text-[#E5C98B]" /> Reserve com Antecedência!
                    </h2>
                    <p className="text-stone-400 leading-relaxed">
                        A ocupação hoteleira em Petrolina chega a{' '}
                        <strong className="text-white">95%</strong> durante a semana principal do
                        São João. Se você planeja vir em 2026, comece a pesquisar agora.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="p-4 bg-[#12110F] border border-white/10 rounded-2xl">
                            <h4 className="font-semibold text-white mb-1">Pico da Festa</h4>
                            <p className="text-xs text-[#E5C98B] font-medium">
                                De 19 a 27 de Junho
                            </p>
                        </div>
                        <div className="p-4 bg-[#12110F] border border-white/10 rounded-2xl">
                            <h4 className="font-semibold text-white mb-1">Localização</h4>
                            <p className="text-xs text-[#E5C98B] font-medium">
                                Prefira o Centro / Orla
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <ArticleFinalCTA
                eyebrow="São João de Petrolina"
                heading="Buscando hospedagem para o São João 2026?"
                description="Nossos flats no Centro são a base perfeita para quem quer curtir a festa com o máximo de conforto. Vagas limitadas!"
                primary={{
                    href: `https://wa.me/${HOST_PHONE}?text=Olá!%20Gostaria%20de%20consultar%20disponibilidade%20para%20o%20São%20João%20de%20Petrolina.`,
                    label: 'Consultar Período Junino',
                    icon: <Music size={18} />,
                    external: true,
                }}
            />
        </article>
    );
};

export default SaoJoaoArticle;
