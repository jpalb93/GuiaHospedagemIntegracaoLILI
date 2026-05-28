import React from 'react';
import { Helmet } from 'react-helmet-async';
import { 
    Briefcase, 
    Home, 
    FileText, 
    Wifi, 
    MapPin,
    CalendarCheck, 
    UserCheck,
    Coffee,
    HelpCircle
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const MonthlyStayArticle: React.FC = () => {
    const slug = 'aluguel-mensal-petrolina-flat-mobiliado';
    const canonicalUrl = `https://www.flatsintegracao.com.br/guia/${slug}`;
    const pageTitle = "Aluguel Mensal em Petrolina: Flats Mobiliados no Centro";
    const pageDescription = "Buscando aluguel por mês em Petrolina? Conheça as vantagens de morar em um flat mobiliado no Centro com Wi-Fi, cozinha e sem burocracia de contrato.";

    return (
        <article className="pt-24 pb-16 min-h-screen bg-stone-950 text-stone-200">
            <ArticleScrollReset />
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content="https://www.flatsintegracao.com.br/images/home-office.jpg" />
                <meta property="og:locale" content="pt_BR" />
                <meta property="og:url" content={canonicalUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content="https://www.flatsintegracao.com.br/images/home-office.jpg" />
                <link rel="canonical" href={canonicalUrl} />
                
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'FAQPage',
                        mainEntity: [
                            {
                                '@type': 'Question',
                                'name': 'Como funciona o aluguel mensal no Flats Integração?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'O aluguel mensal funciona sem a burocracia de contratos longos ou fiadores. É um modelo de estadia prolongada com pagamento mensal, onde o hóspede tem direito ao flat mobiliado, Wi-Fi e taxas inclusas.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'É necessário fiador para alugar o flat por mês?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Não, ao contrário do aluguel imobiliário tradicional, não exigimos fiador. O processo é simplificado, ideal para quem está na cidade temporariamente.'
                                }
                            },
                            {
                                '@type': 'Question',
                                'name': 'Os flats já vêm com internet e mobília?',
                                'acceptedAnswer': {
                                    '@type': 'Answer',
                                    'text': 'Sim, todos os nossos flats são entregues prontos para morar, com mobília completa, cozinha equipada e internet de fibra ótica individual de alta velocidade.'
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
                        image: 'https://www.flatsintegracao.com.br/images/home-office.jpg',
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
                        datePublished: '2026-05-06T12:00:00-03:00',
                        dateModified: '2026-05-06T12:00:00-03:00'
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
                                name: 'Aluguel Mensal',
                                item: canonicalUrl
                            }
                        ]
                    })}
                </script>
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-1 rounded-full text-sm font-bold mb-6 border border-orange-500/20">
                    <Briefcase size={16} />
                    <span>Estadia Prolongada</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6 leading-tight">
                    Aluguel por Mês em Petrolina: Por que Escolher um Flat no Centro?
                </h1>
                <p className="text-xl text-stone-400 leading-relaxed italic">
                    A solução ideal para profissionais, executivos e pessoas em transição que buscam morar com conforto e sem burocracia.
                </p>
            </header>

            {/* Benefícios Rápidos */}
            <div className="container mx-auto px-4 max-w-5xl mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: FileText, title: 'Sem Burocracia', desc: 'Esqueça fiadores ou contratos de 12 meses.' },
                        { icon: Wifi, title: 'Tudo Incluso', desc: 'Wi-fi de alta velocidade e mobília completa.' },
                        { icon: Home, title: 'Pronto para Morar', desc: 'Cozinha equipada e enxoval básico.' },
                        { icon: MapPin, title: 'Centro Próximo', desc: 'Perto de bancos, mercados e hospitais.' },
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:shadow-lg transition-all text-center group">
                            <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <item.icon size={24} />
                            </div>
                            <h4 className="font-bold text-white mb-2">{item.title}</h4>
                            <p className="text-sm text-stone-500">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-invert prose-orange prose-headings:font-heading prose-headings:font-bold text-stone-300">
                <section>
                    <p>
                        O crescimento econômico de Petrolina, movido pelo agronegócio e pelo polo médico, atrai um fluxo constante de profissionais que precisam de moradia temporária. Muitas vezes, esses visitantes precisam ficar por <strong>30, 60 ou 90 dias</strong>, um período longo demais para um hotel e curto demais para um aluguel imobiliário convencional.
                    </p>
                </section>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <CalendarCheck className="text-orange-500" size={28} />
                    A Burocracia do Aluguel Tradicional vs. A Praticidade do Flat
                </h2>
                <p>
                    Alugar um apartamento de forma tradicional em Petrolina exige, geralmente, um contrato de 12 meses, fiador ou caução elevada, além da necessidade de ligar energia, internet e mobiliar todo o espaço.
                </p>
                <p>
                    No <strong>Flats Integração</strong>, o aluguel mensal funciona como uma "assinatura". Você paga pela mensalidade e entra apenas com sua mala. O Wi-fi já está funcionando, a cozinha está equipada e você tem a flexibilidade de renovar mês a mês.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <UserCheck className="text-orange-500" size={28} />
                    Para quem é indicado o Aluguel Mensal?
                </h2>
                <ul>
                    <li><strong>Executivos e Agrônomos:</strong> Profissionais em projetos temporários no Vale.</li>
                    <li><strong>Pessoas em Mudança:</strong> Aqueles que acabaram de chegar em Petrolina e precisam de um "pouso" enquanto procuram casa definitiva.</li>
                    <li><strong>Concurseiros e Estudantes:</strong> Foco total nos estudos em um ambiente silencioso e privativo.</li>
                    <li><strong>Acompanhantes Médicos:</strong> Famílias que precisam de uma base estável durante tratamentos prolongados nos hospitais do Centro.</li>
                </ul>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-white border-b border-white/10 pb-4">
                    <Coffee className="text-orange-500" size={28} />
                    Vida no Centro: Economia de Tempo e Dinheiro
                </h2>
                <p>
                    Hospedar-se no Centro de Petrolina reduz drasticamente seu gasto com deslocamento. Você faz quase tudo a pé: bancos, cartórios, melhores supermercados e farmácias estão a poucos metros.
                </p>

                <div className="bg-orange-500/5 p-8 rounded-3xl border border-orange-500/20 my-10 relative">
                    <HelpCircle className="absolute -top-4 -left-4 text-orange-500 bg-stone-900 rounded-full p-1 shadow-md border border-orange-500/20" size={32} />
                    <h3 className="m-0 text-orange-400 font-bold mb-3">Dica para Empresas:</h3>
                    <p className="m-0 text-stone-300 italic">
                        "Empresas que alocam funcionários em flats economizam cerca de 30% em comparação a diárias de hotéis, além de oferecerem um ambiente que reduz o desgaste do colaborador em viagens longas."
                    </p>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-orange-600 text-white py-16 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-3xl font-bold mb-4 font-heading">
                        Buscando uma solução de moradia mensal em Petrolina?
                    </h3>
                    <p className="text-white/90 mb-10 text-lg">
                        Temos condições especiais para estadias de 30 dias ou mais no Centro da cidade. Fale conosco e peça um orçamento personalizado.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Olá!%20Gostaria%20de%20saber%20os%20valores%20para%20aluguel%20mensal%20(30%20dias%20ou%20mais).`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-full font-extrabold text-xl transition-all transform hover:scale-105 shadow-xl shadow-black/40"
                    >
                        Solicitar Orçamento Mensal
                    </a>
                </div>
            </div>
        </article>
    );
};

export default MonthlyStayArticle;
