import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Clock, DollarSign, Utensils, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import { Link } from 'react-router-dom';

const BododromoArticle: React.FC = () => {
    return (
        <article className="pt-24 pb-16 min-h-screen bg-white">
            <Helmet>
                <title>Onde comer em Petrolina: Guia do Bodódromo e Restaurantes</title>
                <meta
                    name="description"
                    content="Do bode assado no Bodódromo à moqueca na orla de Juazeiro. Veja as melhores dicas gastronômicas e vantagens de ficar em flat com cozinha."
                />
                <meta
                    property="og:title"
                    content="Onde comer em Petrolina: Guia do Bodódromo e Restaurantes"
                />
                <meta
                    property="og:description"
                    content="Do bode assado no Bodódromo à moqueca na orla de Juazeiro. Veja as melhores dicas gastronômicas e vantagens de ficar em flat com cozinha."
                />
                <link
                    rel="canonical"
                    href="https://flatsintegracao.com.br/guia/onde-comer-petrolina-bododromo"
                />
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
                    <Utensils size={16} />
                    <span>Gastronomia</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-6 leading-tight">
                    Bodódromo e Além: Onde comer bem em Petrolina e Juazeiro?
                </h1>
            </header>

            {/* Imagem Principal */}
            <div className="w-full h-[400px] md:h-[500px] mb-12 overflow-hidden">
                <img
                    src="/assets/blog/bododromo-petrolina.jpg"
                    alt="Prato típico de carne de sol com macaxeira no Bodódromo"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-orange prose-headings:font-heading prose-headings:font-bold text-gray-700">
                <p>
                    Visitar o Vale do São Francisco e não provar a culinária local é como ir a Roma
                    e não ver o Papa. Mas, com tantas opções, onde ir?
                </p>
                <p>
                    Petrolina é famosa por ser um polo gastronômico que mistura a tradição sertaneja
                    com a modernidade. Preparamos um roteiro para você sair da dieta com gosto — e
                    dicas de como aproveitar isso melhor se hospedando em um flat.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        1
                    </span>
                    O Famoso Bodódromo
                </h2>
                <p>
                    Ao contrário do que o nome sugere, não é um lugar onde correm bodes! O
                    Bodódromo, no bairro Areia Branca, é um complexo gastronômico a céu aberto com
                    dezenas de restaurantes especializados em carne de carneiro e bode.
                </p>
                <div className="bg-orange-50 p-6 rounded-2xl mb-8 border border-orange-100">
                    <h3 className="text-lg font-bold text-orange-800 mb-2">O que pedir?</h3>
                    <p className="mb-4">
                        O clássico <strong>Bode Assado</strong>. A carne é macia, saborosa e
                        geralmente vem acompanhada de baião de dois, macaxeira (aipim) frita e
                        farofa.
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>É só bode?</strong> Não! A maioria dos restaurantes serve excelentes
                        picanhas, carne de sol com queijo coalho e até pizzas. O ambiente é
                        familiar, movimentado e ótimo para ir à noite.
                    </p>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        2
                    </span>
                    A Orla de Juazeiro (O outro lado da ponte)
                </h2>
                <p>
                    Basta atravessar a Ponte Presidente Dutra (o que leva uns 5 a 10 minutos saindo
                    aqui do Centro) para chegar à orla de Juazeiro, na Bahia.
                </p>
                <p>
                    <strong>O Destaque:</strong> A culinária aqui foca nos peixes de água doce. A{' '}
                    <strong>Moqueca de Surubim</strong> ou o <strong>Peixe Frito</strong> (Cari ou
                    Tilápia) na beira do rio, sentindo a brisa do Velho Chico, é uma experiência
                    imperdível. Restaurantes como o "Ooz do Velho Chico" são paradas tradicionais.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        3
                    </span>
                    Café da Manhã Regional
                </h2>
                <p>
                    No Nordeste, cuscuz é lei. Se você não quiser preparar seu café no flat, o
                    Centro de Petrolina tem padarias e cafés incríveis que servem o "Cuscuz com
                    Bode" ou "Cuscuz com Ovo" logo cedo. Estar hospedado na Rua São José te deixa a
                    passos dessas delícias.
                </p>

                <div className="mt-12 bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-xl shadow-orange-100/50">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                        A Vantagem Secreta de Ficar em um Flat 🤫
                    </h2>
                    <p>
                        Quem se hospeda em hotel comum conhece o problema: você vai ao Bodódromo, as
                        porções são gigantes (geralmente servem 3 ou 4 pessoas), sobra muita comida
                        deliciosa e você não tem onde guardar.
                    </p>
                    <p>
                        No <strong>Flats Integração</strong>, a experiência é outra:
                    </p>
                    <ul className="space-y-4 mt-4">
                        <li className="flex items-start gap-3">
                            <span className="bg-green-100 text-green-700 p-2 rounded-lg">
                                <Utensils size={20} />
                            </span>
                            <div>
                                <strong>Geladeira de Verdade:</strong> Sobrou aquele baião de dois
                                maravilhoso? Traga para viagem! Nossos flats têm geladeira grande,
                                não aquele frigobar minúsculo que mal cabe uma água.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-blue-100 text-blue-700 p-2 rounded-lg">
                                <Clock size={20} />
                            </span>
                            <div>
                                <strong>Cozinha Equipada:</strong> Bateu fome à meia-noite? Você tem
                                micro-ondas e fogão para esquentar seu "restodontê" ou preparar um
                                lanche rápido.
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="bg-yellow-100 text-yellow-700 p-2 rounded-lg">
                                <DollarSign size={20} />
                            </span>
                            <div>
                                <strong>Economia:</strong> Intercale jantares fora com refeições no
                                flat e economize muito na viagem.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Veja Também Interlinking */}
            <div className="container mx-auto px-4 max-w-[800px] mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4">Veja também:</h3>
                <Link to="/guia/rio-sao-francisco-rodeadouro-barquinha" className="block group">
                    <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src="/assets/blog/rio-sao-francisco-rodeadouro.jpg"
                                alt="Rio São Francisco"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-blue-600 text-xs font-bold uppercase">
                                Lazer e Natureza
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                Ilha do Rodeadouro e Barquinha: O que fazer no Rio
                            </h4>
                        </div>
                        <ArrowRight className="ml-auto text-gray-400 group-hover:text-blue-500" />
                    </div>
                </Link>
            </div>

            {/* CTA Final */}
            <div className="bg-gray-900 text-white py-12 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4 font-heading">
                        Ficou com água na boca?
                    </h3>
                    <p className="text-gray-400 mb-8 text-lg">
                        O Flats Integração fica a 5 minutos de carro do Bodódromo. Reserve sua
                        estadia e aproveite.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Ol%C3%A1!%20Li%20o%20artigo%20sobre%20o%20Bod%C3%B3dromo%20e%20quero%20conhecer.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
                    >
                        Reservar Flat <ArrowRight />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default BododromoArticle;
