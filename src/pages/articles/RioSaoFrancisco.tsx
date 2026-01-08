import React from 'react';
import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
import { Anchor, Sun, Waves, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const RioSaoFranciscoArticle: React.FC = () => {
    return (
        <article className="pt-24 pb-16 min-h-screen bg-white">
            <ArticleScrollReset />
            <Helmet>
                <title>Ilha do Rodeadouro e Barquinha: O que fazer no Rio São Francisco</title>
                <meta
                    name="description"
                    content="Guia das melhores experiências no Velho Chico: travessia de barquinha Juazeiro-Petrolina e banho na Ilha do Rodeadouro. Roteiro econômico."
                />
                <meta
                    property="og:title"
                    content="Ilha do Rodeadouro e Barquinha: O que fazer no Rio São Francisco"
                />
                <meta
                    property="og:description"
                    content="Guia das melhores experiências no Velho Chico: travessia de barquinha Juazeiro-Petrolina e banho na Ilha do Rodeadouro. Roteiro econômico."
                />
                <link
                    rel="canonical"
                    href="https://flatsintegracao.com.br/guia/rio-sao-francisco-rodeadouro-barquinha"
                />
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
                    <Anchor size={16} />
                    <span>Passeios</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-6 leading-tight">
                    Experiências Fluviais: Da travessia tradicional ao refúgio do Rodeadouro.
                </h1>
            </header>

            {/* Imagem Principal */}
            <div className="w-full h-[400px] md:h-[500px] mb-12 overflow-hidden">
                <img
                    src="/assets/blog/rio-sao-francisco-rodeadouro.jpg"
                    alt="Vista panorâmica do Rio São Francisco e Ilha do Rodeadouro"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-blue prose-headings:font-heading prose-headings:font-bold text-gray-700">
                <p>
                    O Rio São Francisco não é apenas um cenário geográfico; é a artéria vital que
                    conecta Pernambuco e Bahia. Para o visitante que deseja compreender a dinâmica
                    local, existem duas vivências fluviais obrigatórias: a histórica travessia de
                    barquinha entre os centros urbanos e o lazer balneário na Ilha do Rodeadouro.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        1
                    </span>
                    A Travessia das Barquinhas: Patrimônio em Movimento
                </h2>
                <p>
                    Enquanto muitas cidades dependem exclusivamente de pontes congestionadas,
                    Petrolina e Juazeiro mantêm viva a tradição do transporte fluvial. As
                    "barquinhas" não são apenas uma atração turística, mas um modal de transporte
                    eficiente e charmoso utilizado diariamente pela população.
                </p>

                <div className="bg-blue-50 p-6 rounded-2xl mb-8 border border-blue-100">
                    <ul className="list-none pl-0 space-y-4">
                        <li className="flex gap-3">
                            <span className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                                <Waves size={20} />
                            </span>
                            <div>
                                <strong>A Experiência:</strong> O embarque ocorre na Orla de
                                Petrolina, a poucos minutos de caminhada do centro comercial. A
                                travessia dura cerca de 10 minutos e oferece uma perspectiva
                                privilegiada da Ponte Presidente Dutra e do horizonte das duas
                                cidades.
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <span className="bg-white p-2 rounded-full shadow-sm text-orange-500">
                                <Sun size={20} />
                            </span>
                            <div>
                                <strong>Por que fazer:</strong> É a maneira mais autêntica (e
                                econômica) de visitar a orla de Juazeiro para um jantar. Ao
                                entardecer, o trajeto se transforma, proporcionando um dos pores do
                                sol mais bonitos do sertão a um custo irrisório.
                            </div>
                        </li>
                    </ul>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        2
                    </span>
                    Ilha do Rodeadouro: O Oásis Sertanejo
                </h2>
                <p>
                    Se a barquinha é para contemplação urbana, o Rodeadouro é para imersão na
                    natureza. Localizada a aproximadamente 12 km do centro, esta ilha é o balneário
                    preferido de locais e turistas exigentes.
                </p>

                <ul className="list-disc pl-6 space-y-3">
                    <li>
                        <strong>Infraestrutura e Gastronomia:</strong> Diferente de bancos de areia
                        isolados, a ilha possui estrutura robusta de restaurantes que servem o
                        melhor da culinária ribeirinha, com destaque para o peixe frito na hora,
                        diretamente nas mesas "pé na areia".
                    </li>
                    <li>
                        <strong>Banho Seguro:</strong> As águas no canal da ilha são conhecidas por
                        serem mais calmas e rasas, criando um ambiente seguro para banhos
                        relaxantes, ideal para famílias e para quem deseja se refrescar do calor
                        tropical com tranquilidade.
                    </li>
                </ul>

                <h2 className="mt-16 mb-6 text-2xl md:text-3xl text-gray-900">
                    A Estratégia de Hospedagem no Centro
                </h2>
                <p>
                    Optar por se hospedar no <strong>Centro de Petrolina</strong> oferece o melhor
                    dos dois mundos. Você está posicionado estrategicamente para caminhar até o
                    porto das barquinhas para um passeio rápido, e ao mesmo tempo, tem fácil acesso
                    rodoviário (via Estrada da Tapera) para os translados até a Ilha do Rodeadouro.
                </p>

                <p>
                    No <strong>Flats Integração</strong>, você retorna do rio para um ambiente
                    climatizado, privativo e com toda a estrutura necessária para lavar a areia do
                    corpo e descansar com o conforto que sua viagem merece.
                </p>
            </div>

            {/* Veja Também Interlinking */}
            <div className="container mx-auto px-4 max-w-[800px] mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4">Veja também:</h3>
                <a href="/guia/hospedagem-corporativa-empresas-petrolina" className="block group">
                    <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src="https://i.postimg.cc/tgpZD8kK/334291651.jpg"
                                alt="Corporativo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-blue-600 text-xs font-bold uppercase">
                                Corporativo
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                Vem a trabalho? Veja por que ficar no Centro
                            </h4>
                        </div>
                        <ArrowRight className="ml-auto text-gray-400 group-hover:text-blue-500" />
                    </div>
                </a>
            </div>
            <div className="bg-gray-900 text-white py-12 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4 font-heading">
                        Procurando um refúgio no sertão?
                    </h3>
                    <p className="text-gray-400 mb-8 text-lg">
                        Fique no melhor ponto da cidade para aproveitar o rio.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Ol%C3%A1!%20Li%20o%20artigo%20sobre%20o%20Rio%20S%C3%A3o%20Francisco%20e%20gostaria%20de%20reservar.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
                    >
                        Reservar Flat no Centro <ArrowRight />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default RioSaoFranciscoArticle;
