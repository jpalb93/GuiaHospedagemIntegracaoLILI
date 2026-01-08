import React from 'react';
import { Helmet } from 'react-helmet-async';
// import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, MapPin, Wine, ArrowRight } from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import ArticleScrollReset from '../../components/ArticleScrollReset';

const WineRouteArticle: React.FC = () => {
    return (
        <article className="pt-24 pb-16 min-h-screen bg-white">
            <ArticleScrollReset />
            <Helmet>
                <title>Roteiro do Vinho no Vale do São Francisco: Guia Completo e Preços</title>
                <meta
                    name="description"
                    content="Descubra como visitar as vinícolas Miolo (Vapor do Vinho) e Rio Sol saindo de Petrolina. Dicas de preços, horários e onde se hospedar."
                />
                <meta
                    property="og:title"
                    content="Roteiro do Vinho no Vale do São Francisco: Guia Completo e Preços"
                />
                <meta
                    property="og:description"
                    content="Descubra como visitar as vinícolas Miolo (Vapor do Vinho) e Rio Sol saindo de Petrolina. Dicas de preços, horários e onde se hospedar."
                />
                <link
                    rel="canonical"
                    href="https://flatsintegracao.com.br/guia/roteiro-vinho-petrolina"
                />
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
                    <Wine size={16} />
                    <span>Enoturismo</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-6 leading-tight">
                    Roteiro do Vinho no Vale do São Francisco: Como visitar as vinícolas saindo de
                    Petrolina?
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Você sabia que o sertão virou mar... de vinho? O guia definitivo para escolher
                    seu passeio e aproveitar o melhor do enoturismo no sertão.
                </p>
            </header>

            {/* Imagem Principal */}
            <div className="w-full h-[400px] md:h-[500px] mb-12 overflow-hidden">
                <img
                    src="/assets/blog/vapor-do-vinho-montagem.webp"
                    alt="Turistas visitando parreirais de uva no Vale do São Francisco"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-orange prose-headings:font-heading prose-headings:font-bold text-gray-700">
                <p>
                    O Vale do São Francisco é a única região do mundo que produz vinhos finos o ano
                    inteiro, graças ao sol eterno e à irrigação controlada. Se você está planejando
                    sua viagem para Petrolina, conhecer as vinícolas é obrigatório. Mas, como
                    funciona? Precisa de carro? Quanto custa?
                </p>
                <p>
                    Preparamos este guia definitivo para você escolher o melhor passeio — e claro,
                    descansar com conforto depois de algumas taças.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        1
                    </span>
                    O Clássico: Vapor do Vinho (Miolo)
                </h2>
                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 shadow-sm">
                    <p className="mt-0">
                        É o passeio mais famoso da região, unindo enoturismo e navegação pelo Velho
                        Chico. É ideal para quem quer uma experiência completa de dia inteiro.
                    </p>
                    <ul className="list-none pl-0 space-y-3 mt-4 mb-6">
                        <li className="flex gap-3">
                            <Clock className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>O Roteiro:</strong> Geralmente começa cedo (por volta das
                                8h). Um ônibus leva o grupo até o Lago de Sobradinho, onde você
                                embarca no "Vapor do Vinho" (catamarã com música ao vivo, jacuzzi e
                                toboágua). O passeio inclui parada para banho na Ilha da Fantasia e
                                almoço a bordo.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <MapPin className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>A Vinícola:</strong> A visita acontece na{' '}
                                <strong>Vinícola Miolo (Terranova)</strong>, em Casa Nova (BA). Você
                                conhece os parreirais e faz a degustação de espumantes, vinhos e do
                                famoso Brandy.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <Calendar className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>Quando:</strong> Sábados, domingos e feriados.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <DollarSign className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>Investimento:</strong> Média de R$ 260,00 por pessoa (inclui
                                almoço, transfer e visita).
                            </span>
                        </li>
                    </ul>

                    <a
                        href="https://vapordosaofrancisco.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg w-full md:w-auto justify-center"
                    >
                        Reservar Vapor do Vinho <ArrowRight size={18} />
                    </a>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        2
                    </span>
                    A Experiência "Wine Day": Rota dos Vinhos (Rio Sol)
                </h2>
                <p>
                    Se o seu foco é pisar na uva e ter um contato mais profundo com a produção, a
                    Vinícola Rio Sol, em Lagoa Grande (PE), oferece um roteiro incrível.
                </p>
                <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-100 shadow-sm">
                    <ul className="list-none pl-0 space-y-3 mt-0">
                        <li className="flex gap-3">
                            <Clock className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>O Roteiro:</strong> Diferente do Vapor, aqui você passa mais
                                tempo na fazenda. O tour inclui visita guiada ao campo (com prova de
                                uvas direto do pé!), visita à fábrica e adega. Depois, o grupo segue
                                para um catamarã exclusivo para ver o pôr do sol no Rio São
                                Francisco com espumante liberado.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <Wine className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>Destaque:</strong> O almoço regional harmonizado com vinhos
                                da casa é muito elogiado.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <Calendar className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>Quando:</strong> Aos sábados.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <DollarSign className="text-orange-500 flex-shrink-0" size={20} />
                            <span>
                                <strong>Investimento:</strong> Média de R$ 260,00 a R$ 286,00 por
                                pessoa.
                            </span>
                        </li>
                    </ul>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        3
                    </span>
                    Visitas Rápidas (Para quem tem pouco tempo)
                </h2>
                <p>Não quer passar o dia todo fora? Você pode fazer a visita tradicional.</p>
                <ul>
                    <li>
                        <strong>Miolo:</strong> O tour guiado simples custa cerca de R$ 80,00 (com
                        bônus revertido em produtos na loja). Requer agendamento.
                    </li>
                    <li>
                        <strong>Rio Sol:</strong> A visita tradicional custa a partir de R$ 50,00 e
                        mostra o processo de elaboração com degustação no final.
                    </li>
                </ul>

                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-8 rounded-r-lg">
                    <p className="font-bold text-orange-800 m-0 text-sm md:text-base">
                        💡 Dica de Ouro: Se for beber, não dirija. As estradas para as vinícolas
                        podem ser longas. Os roteiros completos já incluem o transporte (transfer)
                        que busca nos principais pontos da cidade.
                    </p>
                </div>

                <h2 className="mt-12 mb-6 text-2xl md:text-3xl text-gray-900">
                    Onde se hospedar para fazer o Roteiro do Vinho?
                </h2>
                <p>
                    Os passeios de enoturismo são cansativos (sol, barco e álcool). Ao final do dia,
                    tudo o que você quer é um banho gelado e uma cama confortável, sem pegar
                    estrada.
                </p>
                <p>
                    O <strong>Centro de Petrolina</strong> é o local mais estratégico para isso. A
                    maioria dos transfers dos passeios busca os turistas em hotéis da Orla ou do
                    Centro.
                </p>
                <p>
                    No <strong>Flats Integração</strong>, você tem a vantagem de estar no coração da
                    cidade:
                </p>
                <ul className="space-y-2">
                    <li>
                        ✅ <strong>Facilidade no Transfer:</strong> Combine com a agência de turismo
                        para te buscar na porta ou em um ponto de encontro a poucos metros daqui.
                    </li>
                    <li>
                        ✅ <strong>Economia e Conforto:</strong> Depois do passeio, você tem sua
                        própria cozinha para preparar um lanche ou pedir um delivery, sem a
                        formalidade de um hotel.
                    </li>
                    <li>
                        ✅ <strong>Melhor Custo-Benefício:</strong> Use o dinheiro que economizou na
                        diária (comparado aos hotéis da orla) para comprar mais garrafas de vinho na
                        vinícola!
                    </li>
                </ul>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-bold mb-4">Veja também:</h3>
                    <a href="/guia/onde-comer-petrolina-bododromo" className="block group">
                        <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all">
                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src="/assets/blog/bododromo-petrolina.webp"
                                    alt="Comida Regional"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <span className="text-orange-600 text-xs font-bold uppercase">
                                    Gastronomia
                                </span>
                                <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                    Bodódromo e Além: Onde comer bem?
                                </h4>
                            </div>
                            <ArrowRight className="ml-auto text-gray-400 group-hover:text-orange-500" />
                        </div>
                    </a>
                </div>
            </div>

            {/* CTA Final */}
            <div className="bg-gray-900 text-white py-12 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4 font-heading">
                        Vai vir para Petrolina?
                    </h3>
                    <p className="text-gray-400 mb-8 text-lg">
                        Garanta sua reserva direto conosco e evite taxas de sites de reserva.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Ol%C3%A1!%20Li%20o%20artigo%20sobre%20vinhos%20e%20gostaria%20de%20verificar%20disponibilidade.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
                    >
                        Reservar Flat pelo WhatsApp <ArrowRight />
                    </a>
                </div>
            </div>
        </article>
    );
};

export default WineRouteArticle;
