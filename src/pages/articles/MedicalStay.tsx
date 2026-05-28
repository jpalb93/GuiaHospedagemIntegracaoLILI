import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
    HeartPulse, 
    MapPin,
    Utensils, 
    Clock, 
    ArrowRight, 
    ShieldCheck,
    Stethoscope
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const MedicalStayArticle: React.FC = () => {
    const slug = 'hospedagem-proximo-hospitais-petrolina';
    const canonicalUrl = `https://www.flatsintegracao.com.br/guia/${slug}`;
    const pageTitle = "Hospedagem perto do Hospital Dom Malan e HEMOPE em Petrolina";
    const pageDescription = "Buscando onde ficar para tratamento médico em Petrolina? Guia completo sobre hospedagem perto do Hospital Dom Malan, HEMOPE e Memorial com flats mobiliados.";

    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content="https://www.flatsintegracao.com.br/images/quarto-lavanderia.jpg" />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content="https://www.flatsintegracao.com.br/images/quarto-lavanderia.jpg" />
                <link rel="canonical" href={canonicalUrl} />
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                'name': 'Qual a vantagem de ficar em um flat para tratamento médico em Petrolina?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Flats oferecem cozinha completa para dietas restritivas, silêncio para recuperação e ambiente privativo, o que é fundamental para pacientes e acompanhantes em tratamento prolongado.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'O Flats Integração fica perto do Hospital Dom Malan?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Sim, estamos localizados no Centro, a poucos minutos dos principais hospitais como Dom Malan, Memorial e HEMOPE, facilitando o deslocamento diário.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Existe silêncio para repouso no flat?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Sim, nossas unidades são pensadas para o descanso, localizadas em área central porém com ambiente interno calmo, ideal para repouso pós-procedimentos.'
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
                        headline: pageTitle,
                        description: pageDescription,
                        image: 'https://www.flatsintegracao.com.br/images/quarto-lavanderia.jpg',
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
                        datePublished: '2026-05-06T09:00:00-03:00',
                        dateModified: '2026-05-06T09:00:00-03:00'
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
                                name: 'Hospedagem Próximo a Hospitais',
                                item: canonicalUrl
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-orange-500/20">
                    <HeartPulse size={16} />
                    <span>Saúde e Bem-estar</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                    Hospedagem para Tratamento Médico em Petrolina: Guia Perto dos Hospitais
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed italic">
                    Conforto, silêncio e praticidade para pacientes e acompanhantes no Polo Médico de Petrolina.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="container mx-auto px-4 max-w-4xl mb-12">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                    <img
                        src="/images/quarto-lavanderia.jpg"
                        alt="Quarto silencioso e confortável do flat, ideal para recuperação e descanso"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent"></div>
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-orange prose-headings:font-heading prose-headings:font-bold text-stone-300">
                <section>
                    <p>
                        <strong>Petrolina é hoje o principal polo regional de saúde do Sertão</strong>, atraindo pacientes de Pernambuco, Bahia e Piauí para tratamentos de alta complexidade em hospitais como o <strong>Dom Malan, HEMOPE e Hospital Memorial</strong>.
                    </p>
                    <p>
                        Para quem viaja em busca de cuidados médicos, a escolha da hospedagem vai além do preço: trata-se de encontrar um ambiente silencioso, climatizado e que permita manter rotinas de alimentação específicas, algo que hotéis tradicionais nem sempre oferecem.
                    </p>
                </section>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <MapPin className="text-orange-500" size={28} />
                    Onde ficam os principais hospitais de Petrolina?
                </h2>
                <p>
                    A maioria das unidades de referência está concentrada na região central. O <strong>Hospital Dom Malan</strong> e o <strong>Hospital Memorial Petrolina</strong> são os pilares do polo médico central, cercados por clínicas e laboratórios de imagem.
                </p>
                <p>
                    Já o <strong>Hospital Universitário (HU)</strong> e o <strong>HEMOPE</strong> completam essa rede de apoio. Estar hospedado no Centro significa estar a menos de 5 minutos de deslocamento dessas unidades, o que é vital em casos de acompanhamento diário ou exames em horários variados.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Utensils className="text-orange-500" size={28} />
                    A importância de uma cozinha para o paciente
                </h2>
                <p>
                    Dietas restritivas são comuns em tratamentos médicos. Ter um <strong>flat com cozinha completa</strong> (geladeira, fogão, micro-ondas) permite que o acompanhante prepare refeições leves e frescas, seguindo à risca as orientações médicas.
                </p>
                <div className="bg-orange-500/5 p-6 rounded-2xl border border-orange-500/20 my-8">
                    <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                        <ShieldCheck size={20} /> Vantagens do Flat vs Hotel:
                    </h3>
                    <ul className="list-none pl-0 space-y-3 text-stone-300 text-sm md:text-base">
                        <li><span className="text-orange-500 font-bold">✓</span> <strong>Silêncio:</strong> Ambiente privativo, longe do fluxo intenso de recepções de hotéis.</li>
                        <li><span className="text-orange-500 font-bold">✓</span> <strong>Economia:</strong> Preparar refeições no flat reduz drasticamente o custo da viagem.</li>
                        <li><span className="text-orange-500 font-bold">✓</span> <strong>Home Feel:</strong> A sensação de estar em casa ajuda na recuperação emocional do paciente.</li>
                        <li><span className="text-orange-500 font-bold">✓</span> <strong>Higiene:</strong> Controle total sobre a limpeza e o preparo dos alimentos.</li>
                    </ul>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Stethoscope className="text-orange-500" size={28} />
                    Por que ficar no Centro de Petrolina?
                </h2>
                <p>
                    Além da proximidade com os hospitais, o Centro oferece a melhor infraestrutura de apoio para quem está cuidando de alguém:
                </p>
                <ul>
                    <li><strong>Farmácias 24h:</strong> Facilidade para comprar medicamentos a qualquer hora.</li>
                    <li><strong>Supermercados:</strong> Abastecimento rápido para o flat.</li>
                    <li><strong>Bancos e Serviços:</strong> Resolva tudo a pé, sem estresse com trânsito.</li>
                    <li><strong>Bem-estar:</strong> A proximidade com a Orla permite caminhadas leves ao entardecer para aliviar a tensão do tratamento.</li>
                </ul>

                <div className="mt-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-white text-2xl md:text-3xl mb-6">Informações Úteis para sua Reserva</h2>
                    <p className="text-stone-400">
                        Se você está vindo para Petrolina para tratamento médico, o <strong>Flats Integração</strong> oferece unidades pensadas para o seu conforto:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="flex gap-4">
                            <Clock className="text-orange-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Check-in Flexível</h4>
                                <p className="text-sm text-stone-400">Entendemos que horários de exames podem mudar. Fale conosco.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <ShieldCheck className="text-orange-500 shrink-0" />
                            <div>
                                <h4 className="font-bold text-white">Ambiente Calmo</h4>
                                <p className="text-sm text-stone-400">Ideal para repouso pós-procedimentos e sono tranquilo.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interlinking */}
            <div className="container mx-auto px-4 max-w-[800px] mt-12 pt-8 border-t border-white/10">
                <h3 className="text-xl font-bold mb-4 text-white">Leia também:</h3>
                <a href="/guia/hospedagem-corporativa-empresas-petrolina" className="block group">
                    <div className="flex gap-4 items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all">
                        <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <img
                                src="/images/quarto-lavanderia.jpg"
                                alt="Corporativo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">
                                Negócios
                            </span>
                            <h4 className="font-bold text-white group-hover:text-orange-500 transition-colors">
                                Vem a trabalho? Veja as vantagens de ficar no Centro
                            </h4>
                        </div>
                        <ArrowRight className="ml-auto text-stone-500 group-hover:text-orange-500" />
                    </div>
                </a>
            </div>

            {/* CTA Final */}
            <div className="bg-orange-600 text-white py-16 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-3xl font-bold mb-4 font-heading">
                        Precisa de um lugar tranquilo para se recuperar?
                    </h3>
                    <p className="text-white/80 mb-10 text-lg">
                        Estamos localizados no coração do Polo Médico de Petrolina. Fale conosco para condições especiais de estadia prolongada.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Olá!%20Estou%20indo%20a%20Petrolina%20para%20tratamento%20médico%20e%20gostaria%20de%20verificar%20disponibilidade.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-extrabold text-xl transition-all transform hover:scale-105 shadow-xl shadow-black/40"
                    >
                        <HeartPulse size={24} />
                        Consultar Disponibilidade
                    </a>
                </div>
            </div>
        </article>
    );
};

export default MedicalStayArticle;
