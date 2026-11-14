import React from 'react';
import { Helmet } from 'react-helmet-async';
import {
    ArrowDown,
    Clock,
    Utensils,
    ArrowRight,
    CalendarClock,
    ChevronRight,
    CircleParking,
    ExternalLink,
    List,
    MapPin,
    Navigation,
    Coffee,
    Wine,
    CheckCircle2,
    Wallet,
    ChefHat,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';
import { ArticleFinalCTA } from '../../components/articles/ArticleChrome';

const MAP_URL = 'https://www.google.com/maps/search/?api=1&query=Bod%C3%B3dromo%20Petrolina%20PE';

const articleSections = [
    { id: 'bododromo', label: 'Bodódromo' },
    { id: 'orlas', label: 'Orlas' },
    { id: 'cafe', label: 'Café da manhã' },
    { id: 'vinhos', label: 'Vinhos' },
    { id: 'dicas', label: 'Dicas práticas' },
    { id: 'faq', label: 'Perguntas frequentes' },
];

const faqItems = [
    {
        question: 'O que é o Bodódromo de Petrolina?',
        answer: 'O Bodódromo é um complexo gastronômico a céu aberto inaugurado em 2000, localizado na Av. São Francisco, bairro Areia Branca, em Petrolina (PE). Reúne cerca de 10 restaurantes e 23 quiosques especializados em culinária sertaneja, com destaque para bode assado, carneiro e buchada.',
    },
    {
        question: 'O que comer no Bodódromo de Petrolina?',
        answer: 'Os pratos principais são o bode assado, o carneiro assado ou ensopado (o mais pedido), a buchada, o sarapatel e a carne-de-sol com macaxeira. O Bodódromo também serve vinhos produzidos nas vinícolas do Vale do São Francisco.',
    },
    {
        question: 'Onde fica o Bodódromo em Petrolina?',
        answer: 'O Bodódromo fica na Avenida São Francisco, no bairro Areia Branca, em Petrolina (PE). O complexo tem estacionamento amplo e gratuito e funciona principalmente à noite, com maior movimento de quinta a domingo.',
    },
    {
        question: 'Onde comer peixe em Petrolina?',
        answer: 'Os melhores restaurantes de peixe ficam na Orla de Petrolina e na Orla de Juazeiro (BA), do outro lado da Ponte Presidente Dutra. O prato mais famoso é a moqueca de surubim, peixe nativo do Rio São Francisco.',
    },
    {
        question: 'Tem vinícola perto de Petrolina?',
        answer: 'Sim. Petrolina fica no coração do Vale do São Francisco, o único polo vitícola tropical do mundo em escala comercial. Vinícolas como Miolo, Rio Sol e Ouro Verde ficam a menos de 50 km do centro da cidade e produzem duas safras por ano.',
    },
    {
        question: 'Quanto custa comer no Bodódromo de Petrolina?',
        answer: 'A faixa de preço no Bodódromo varia entre R$ 80 e R$ 200 ou mais por pessoa, dependendo do consumo de bebidas e da quantidade de pratos. As porções são generosas e costumam servir duas pessoas.',
    },
];

const dishes = [
    {
        name: 'Bode Assado',
        detail: 'Com baião de dois, macaxeira frita e farofa de manteiga de garrafa.',
    },
    {
        name: 'Carneiro Assado ou Ensopado',
        detail: 'A opção mais pedida e elogiada do complexo.',
    },
    {
        name: 'Buchada Tradicional',
        detail: 'Miúdos cozidos no bucho; o sabor mais autêntico do Sertão.',
    },
    {
        name: 'Sarapatel Sertanejo',
        detail: 'Fígado e rins refogados com temperos regionais.',
    },
    {
        name: 'Carne-de-Sol na Manteiga',
        detail: 'Acompanhada de macaxeira cozida e queijo coalho.',
    },
];

const BododromoArticle: React.FC = () => {
    return (
        <article className="pt-32 md:pt-40 pb-20 min-h-screen bg-[#12110F] text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>Onde Comer em Petrolina: Guia do Bodódromo e Gastronomia do Vale</title>
                <meta
                    name="description"
                    content="Melhores restaurantes de Petrolina: Bodódromo, bode assado, carneiro e vinhos do Vale. Guia completo com endereços e dicas práticas de onde comer."
                />
                <link
                    rel="canonical"
                    href="https://www.flatsintegracao.com.br/guia/onde-comer-petrolina-bododromo"
                />
                <meta
                    property="og:url"
                    content="https://www.flatsintegracao.com.br/guia/onde-comer-petrolina-bododromo"
                />
                <meta property="og:type" content="article" />
                <meta
                    property="og:title"
                    content="Onde Comer em Petrolina: Guia do Bodódromo e Gastronomia do Vale"
                />
                <meta
                    property="og:description"
                    content="Melhores restaurantes de Petrolina: Bodódromo, bode assado, carneiro, orla do Rio São Francisco e vinhos do Vale. Guia completo com endereços e dicas práticas."
                />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/assets/blog/bododromo-petrolina.webp"
                />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Onde Comer em Petrolina: Guia do Bodódromo e Gastronomia do Vale"
                />
                <meta
                    name="twitter:description"
                    content="Melhores restaurantes de Petrolina: Bodódromo, bode assado, carneiro, orla do Rio São Francisco e vinhos do Vale. Guia completo com endereços e dicas práticas."
                />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/assets/blog/bododromo-petrolina.webp"
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
                                name: 'Guia',
                                item: 'https://www.flatsintegracao.com.br/guia',
                            },
                            {
                                '@type': 'ListItem',
                                position: 3,
                                name: 'Onde Comer em Petrolina',
                                item: 'https://www.flatsintegracao.com.br/guia/onde-comer-petrolina-bododromo',
                            },
                        ],
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: faqItems.map((item) => ({
                            '@type': 'Question',
                            name: item.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: item.answer,
                            },
                        })),
                    })}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Article',
                        mainEntityOfPage: {
                            '@type': 'WebPage',
                            '@id': 'https://www.flatsintegracao.com.br/guia/onde-comer-petrolina-bododromo',
                        },
                        headline:
                            'Onde Comer em Petrolina: Guia do Bodódromo e Gastronomia do Vale',
                        description:
                            'Melhores restaurantes de Petrolina: Bodódromo, bode assado, carneiro, orla do Rio São Francisco e vinhos do Vale. Guia completo com endereços e dicas práticas.',
                        image: 'https://www.flatsintegracao.com.br/assets/blog/bododromo-petrolina.webp',
                        author: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br',
                        },
                        publisher: {
                            '@type': 'Organization',
                            name: 'Flats Integração',
                            url: 'https://www.flatsintegracao.com.br',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg',
                            },
                        },
                        datePublished: '2025-12-20T10:00:00-03:00',
                        dateModified: '2026-05-06T10:00:00-03:00',
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-4xl mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-white font-heading mb-6 leading-[1.08] tracking-tight">
                    Onde Comer em <br />
                    <span className="text-[#E5C98B]">Petrolina</span>
                </h1>
                <p className="text-lg md:text-2xl text-stone-400 leading-relaxed max-w-3xl mx-auto font-light">
                    Do autêntico bode assado em brasas aos vinhos premiados do Vale. O guia
                    definitivo para saborear o Sertão.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.15em] text-stone-400">
                    <span className="inline-flex items-center gap-2">
                        <Utensils size={14} className="text-[#E5C98B]" aria-hidden /> Guia local
                    </span>
                    <span className="h-1 w-1 rounded-full bg-stone-700" aria-hidden />
                    <span className="inline-flex items-center gap-2">
                        <Clock size={14} className="text-[#E5C98B]" aria-hidden /> 4 min de leitura
                    </span>
                    <span className="h-1 w-1 rounded-full bg-stone-700" aria-hidden />
                    <span>Petrolina + Juazeiro</span>
                </div>
            </header>

            {/* Imagem Principal */}
            <figure className="container mx-auto px-4 max-w-5xl mb-12">
                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#191714]">
                    <img
                        src="/assets/blog/bododromo-petrolina.webp"
                        width={1200}
                        height={675}
                        loading="eager"
                        decoding="async"
                        alt="Carne de sol grelhada com macaxeira, arroz, feijão e farofa"
                        className="w-full h-full object-cover"
                    />
                </div>
                <figcaption className="mt-3 px-1 text-sm text-stone-400">
                    Sabores sertanejos para começar a explorar a gastronomia do Vale do São
                    Francisco.
                </figcaption>
            </figure>

            <nav aria-label="Neste guia" className="container mx-auto mb-14 max-w-5xl px-4">
                <div className="flex flex-col gap-4 border-y border-white/10 py-5 md:flex-row md:items-center md:gap-8">
                    <div className="flex shrink-0 items-center gap-2 text-sm font-semibold text-white">
                        <List size={18} className="text-[#E5C98B]" aria-hidden />
                        Neste guia
                    </div>
                    <div className="no-scrollbar flex min-w-0 gap-2 overflow-x-auto pb-1 text-sm text-stone-400">
                        {articleSections.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="shrink-0 rounded-full border border-white/10 px-4 py-2 transition-colors hover:border-[#E5C98B]/50 hover:text-[#E5C98B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                            >
                                {section.label}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-3xl prose prose-invert prose-headings:font-heading prose-headings:font-semibold prose-a:text-[#E5C98B] prose-lg text-stone-300">
                <p className="lead text-stone-200 text-xl">
                    Petrolina é uma surpresa gastronômica. A cidade mais populosa do Sertão
                    pernambucano guarda uma cena alimentar que vai do bode assado em brasas a vinhos
                    premiados produzidos a menos de 50 km do centro. Se você está chegando pela
                    primeira vez — ou voltando com mais tempo — este guia cobre os destinos
                    obrigatórios, o que pedir em cada um, quanto esperar gastar e como se organizar
                    logisticamente.
                </p>

                <section
                    aria-labelledby="resumo-heading"
                    className="not-prose my-14 rounded-3xl border border-[#E5C98B]/25 bg-[#191714] p-6 md:p-8"
                >
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E5C98B]">
                                Para decidir em 30 segundos
                            </p>
                            <h2
                                id="resumo-heading"
                                className="text-2xl font-semibold font-heading text-white md:text-3xl"
                            >
                                O melhor programa depende do seu apetite
                            </h2>
                        </div>
                        <ArrowDown
                            className="mt-1 hidden shrink-0 text-[#E5C98B] md:block"
                            size={24}
                            aria-hidden
                        />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                        {[
                            {
                                label: 'Primeira visita',
                                value: 'Bodódromo',
                                detail: 'Bode assado, carneiro e porções generosas.',
                            },
                            {
                                label: 'Clima mais leve',
                                value: 'Orlas',
                                detail: 'Peixe do São Francisco e mesa com vista para o rio.',
                            },
                            {
                                label: 'Para experimentar',
                                value: 'Surubim',
                                detail: 'Grelhado, frito ou em moqueca na cozinha do rio.',
                            },
                            {
                                label: 'Para organizar',
                                value: 'Jantar à noite',
                                detail: 'O Bodódromo costuma ficar mais movimentado de quinta a domingo.',
                            },
                        ].map((item) => (
                            <div key={item.label} className="border-t border-white/10 pt-4">
                                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-stone-400">
                                    {item.label}
                                </p>
                                <p className="mb-1 text-lg font-semibold text-white">
                                    {item.value}
                                </p>
                                <p className="text-sm leading-relaxed text-stone-400">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="bododromo" className="scroll-mt-32">
                    <h2 className="text-white mt-12 mb-6">
                        O Bodódromo: O Complexo Gastronômico da Av. São Francisco
                    </h2>
                    <p className="mb-6">
                        O Bodódromo não é um restaurante. É um complexo gastronômico a céu aberto
                        inaugurado no ano 2000, localizado na Av. São Francisco, bairro Areia
                        Branca, que reúne cerca de 10 restaurantes e 23 quiosques especializados em
                        culinária sertaneja. É o principal destino gastronômico de Petrolina e ponto
                        de referência obrigatório para qualquer visitante.
                    </p>

                    <div className="bg-[#191714] border border-white/10 p-8 md:p-12 rounded-[2.5rem] not-prose mb-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Utensils size={120} />
                        </div>

                        <h3 className="text-white text-3xl font-semibold font-heading mb-8 flex items-center gap-3">
                            <ChefHat className="text-[#E5C98B]" size={30} /> Sugestões do Chef
                        </h3>

                        <p className="text-stone-300 text-lg mb-10 leading-relaxed">
                            O símbolo da casa é o{' '}
                            <strong className="text-white">bode assado</strong>, mas a{' '}
                            <strong className="text-white">carne de carneiro</strong> é a campeã de
                            pedidos pela sua suavidade.
                        </p>

                        <div className="space-y-8">
                            {dishes.map((dish) => (
                                <div key={dish.name} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-white font-semibold text-xl group-hover:text-[#E5C98B] transition-colors">
                                            {dish.name}
                                        </span>
                                        <div className="flex-1 border-b border-white/10 mx-4 mb-1.5 border-dotted"></div>
                                    </div>
                                    <p className="text-stone-400 text-sm">{dish.detail}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <MapPin className="text-[#E5C98B]" size={16} /> Localização
                                </h4>
                                <p className="text-stone-400 text-sm">
                                    Av. São Francisco, Bairro Areia Branca, Petrolina – PE
                                </p>
                                <a
                                    href={MAP_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#E5C98B] transition-colors hover:text-[#edd6a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                                >
                                    Abrir no mapa <ExternalLink size={15} aria-hidden />
                                </a>
                            </div>
                            <div>
                                <h4 className="text-white font-semibold mb-3 flex items-center gap-2 text-xs uppercase tracking-wider">
                                    <Wallet className="text-[#E5C98B]" size={16} /> Faixa de Preço
                                </h4>
                                <p className="text-stone-400 text-sm">R$ 80 a R$ 200+ por pessoa</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="orlas" className="scroll-mt-32">
                    <h2 className="text-white mt-16 mb-6">
                        Orla de Petrolina e Orla de Juazeiro: Cozinha do Rio
                    </h2>
                    <p className="mb-6">
                        A poucos minutos do centro, a Orla de Petrolina concentra bares e
                        restaurantes com vista para o Rio São Francisco. O clima é mais
                        descontraído, ideal para almoços longos de fim de semana. Do outro lado da
                        Ponte Presidente Dutra, a Orla de Juazeiro (BA) complementa a experiência
                        com culinária focada em peixes de água doce.
                    </p>
                    <div className="my-12 border-y border-[#E5C98B]/30 py-8">
                        <p className="text-stone-200 m-0 italic">
                            "O prato-chefe é o surubim — peixe de couro sem espinhas, carne firme e
                            sabor delicado, nativo do São Francisco. Aparece grelhado, frito ou em
                            moqueca, uma das preparações mais admiradas da região."
                        </p>
                    </div>
                    <p className="mb-12">
                        Comer na beira do Velho Chico tem um valor simbólico que vai além da comida.
                        O rio une os dois estados, e a mesa às suas margens é literalmente o ponto
                        de encontro da região.
                    </p>
                </section>

                <section id="cafe" className="scroll-mt-32 my-20">
                    <h2 className="text-white mb-8">Café da Manhã Nordestino</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                        {[
                            {
                                title: 'Cuscuz de Milho',
                                desc: 'Com ovo caipira ou carne de sol desfiada. É a base da energia sertaneja.',
                                icon: <Coffee size={24} />,
                            },
                            {
                                title: 'Tapioca de Coalho',
                                desc: 'Sempre com manteiga de garrafa generosa e queijo coalho assado.',
                                icon: <Utensils size={24} />,
                            },
                            {
                                title: 'Bolo de Rolo',
                                desc: 'O clássico pernambucano, com camadas finíssimas e recheio de goiabada.',
                                icon: <ChefHat size={24} />,
                            },
                            {
                                title: 'Café Coado',
                                desc: 'Forte e quente, servido em xícara pequena para despertar os sentidos.',
                                icon: <Clock size={24} />,
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="bg-[#191714] border border-white/10 p-6 rounded-2xl flex gap-4"
                            >
                                <div className="text-[#E5C98B] shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                                    <p className="text-stone-400 text-sm leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-8 text-stone-400">
                        O desjejum sertanejo é denso e calórico. Padarias de bairro costumam esgotar
                        os itens quentes antes das 9h — chegue cedo.
                    </p>
                </section>

                <section id="vinhos" className="scroll-mt-32 my-20">
                    <h2 className="text-white mb-6">Vinhos do Vale do São Francisco</h2>
                    <div className="bg-[#191714] border border-white/10 p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center mb-8 not-prose">
                        <div className="bg-[#E5C98B]/10 border border-[#E5C98B]/20 p-6 rounded-2xl shrink-0">
                            <Wine className="text-[#E5C98B]" size={44} />
                        </div>
                        <div>
                            <p className="text-stone-300 m-0 leading-relaxed mb-4">
                                Petrolina fica no coração do único polo vitícola tropical do mundo
                                em escala comercial. As vinícolas do Vale —{' '}
                                <strong className="text-white">
                                    Miolo, Rio Sol, Ouro Verde, Santa Maria
                                </strong>{' '}
                                — produzem uvas em regime de duas safras por ano.
                            </p>
                            <p className="text-stone-400 text-sm mt-4 italic mb-0">
                                Você pode visitar uma vinícola em plena caatinga e tomar vinho
                                produzido a menos de 50 km do seu prato.
                            </p>
                        </div>
                    </div>
                    <p className="text-stone-300">
                        Isso significa que você pode visitar uma vinícola em plena caatinga, a 40°C,
                        e tomar vinho produzido a menos de 50 km do lugar onde está jantando. Alguns
                        restaurantes da Orla e do Bodódromo já incorporaram rótulos locais às cartas
                        — vale perguntar ao garçom.
                    </p>
                </section>

                <section id="dicas" className="scroll-mt-32 my-20">
                    <h2 className="text-white mb-8">Dicas Práticas para o Viajante</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
                        {[
                            {
                                title: 'Porções Generosas',
                                desc: 'Peça com cautela na primeira visita, os pratos costumam servir bem duas pessoas.',
                                icon: <CheckCircle2 size={20} />,
                            },
                            {
                                title: 'Doggy Bag',
                                desc: 'É cultural e esperado. Não hesite em pedir para embrulhar o que sobrou.',
                                icon: <CheckCircle2 size={20} />,
                            },
                            {
                                title: 'Momento Social',
                                desc: 'O Bodódromo brilha à noite. O jantar é o ponto alto da vida social local.',
                                icon: <CheckCircle2 size={20} />,
                            },
                            {
                                title: 'Leve Dinheiro',
                                desc: 'Embora cartões sejam aceitos, alguns quiosques menores podem ter falhas na rede.',
                                icon: <Wallet size={20} />,
                            },
                        ].map((tip, index) => (
                            <div
                                key={index}
                                className="flex gap-3 items-start p-5 bg-[#191714] rounded-2xl border border-white/10"
                            >
                                <div className="text-[#E5C98B] mt-0.5">{tip.icon}</div>
                                <div>
                                    <span className="text-white font-semibold block mb-1">
                                        {tip.title}
                                    </span>
                                    <p className="text-stone-400 text-sm">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <aside className="not-prose my-14 rounded-3xl border border-white/10 bg-[#191714] p-6 md:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <Navigation className="text-[#E5C98B]" size={22} aria-hidden />
                        <h3 className="text-2xl font-semibold font-heading text-white">
                            Planeje sua ida
                        </h3>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-3">
                        <div className="border-t border-white/10 pt-4">
                            <CalendarClock className="mb-3 text-[#E5C98B]" size={20} aria-hidden />
                            <p className="mb-1 text-sm font-semibold text-white">Melhor momento</p>
                            <p className="text-sm leading-relaxed text-stone-400">
                                À noite, especialmente de quinta a domingo.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            <CircleParking className="mb-3 text-[#E5C98B]" size={20} aria-hidden />
                            <p className="mb-1 text-sm font-semibold text-white">Estacionamento</p>
                            <p className="text-sm leading-relaxed text-stone-400">
                                O complexo conta com estacionamento amplo e gratuito.
                            </p>
                        </div>
                        <div className="border-t border-white/10 pt-4">
                            <MapPin className="mb-3 text-[#E5C98B]" size={20} aria-hidden />
                            <p className="mb-1 text-sm font-semibold text-white">Endereço</p>
                            <p className="text-sm leading-relaxed text-stone-400">
                                Av. São Francisco, Areia Branca, Petrolina – PE.
                            </p>
                        </div>
                    </div>
                    <a
                        href={MAP_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#E5C98B] transition-colors hover:text-[#edd6a1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B]"
                    >
                        Traçar rota no Google Maps <ChevronRight size={16} aria-hidden />
                    </a>
                </aside>

                <section id="faq" className="scroll-mt-32 my-20">
                    <h2 className="text-white mb-8">Perguntas frequentes</h2>
                    <div className="not-prose divide-y divide-white/10 border-y border-white/10">
                        {faqItems.map((item) => (
                            <details key={item.question} className="group py-5">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5C98B] [&::-webkit-details-marker]:hidden">
                                    <span>{item.question}</span>
                                    <ChevronRight
                                        size={19}
                                        className="shrink-0 text-[#E5C98B] transition-transform group-open:rotate-90"
                                        aria-hidden
                                    />
                                </summary>
                                <p className="mb-0 mt-4 pr-8 text-base leading-relaxed text-stone-400">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                <div className="bg-[#191714] border border-[#E5C98B]/25 p-8 md:p-12 rounded-[2rem] not-prose my-12 shadow-2xl relative overflow-hidden">
                    <h3 className="text-2xl md:text-3xl font-semibold font-heading text-white mb-6">
                        Hospedagem perto de tudo isso 🏡
                    </h3>
                    <p className="text-stone-300 mb-10 text-lg leading-relaxed">
                        O <strong className="text-white">Flats Integração</strong> fica no centro de
                        Petrolina, a cerca de 10 minutos de carro do Bodódromo e 8 minutos da Orla.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-[#E5C98B]/15 border border-[#E5C98B]/30 text-[#E5C98B] p-3 rounded-2xl shrink-0">
                                <Utensils size={22} />
                            </div>
                            <div>
                                <strong className="text-white block mb-1 text-lg">
                                    Cozinha Completa
                                </strong>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    Frigobar, fogão e micro-ondas — ideal para guardar e reaquecer o
                                    seu doggy bag.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-[#E5C98B]/15 border border-[#E5C98B]/30 text-[#E5C98B] p-3 rounded-2xl shrink-0">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <strong className="text-white block mb-1 text-lg">
                                    Localização Central
                                </strong>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    No coração da cidade, facilitando o deslocamento para qualquer
                                    polo gastronômico.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ArticleFinalCTA
                eyebrow="Gastronomia do Vale"
                heading="Sinta-se em casa no coração de Petrolina"
                description="O Flats Integração oferece o conforto de um lar com a praticidade que sua viagem exige."
                primary={{
                    href: '/reservas',
                    label: 'Ver disponibilidade',
                    icon: <ArrowRight size={18} />,
                }}
                secondary={{
                    href: `https://wa.me/${HOST_PHONE}`,
                    label: 'Dúvidas? Chame no Whats',
                    external: true,
                }}
            />
        </article>
    );
};

export default BododromoArticle;
