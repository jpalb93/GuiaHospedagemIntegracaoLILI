import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
    Briefcase,
    Wifi,
    Monitor,
    Coffee,
    MapPin,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';

const PHOTOS = [
    'https://i.postimg.cc/W4TFSxSR/305095874.jpg',
    'https://i.postimg.cc/5tbYpDp1/305095888.jpg',
    'https://i.postimg.cc/1zsnMbBJ/334290310.jpg',
    'https://i.postimg.cc/9QGwdcP3/334290394.jpg',
    'https://i.postimg.cc/tgpZD8kK/334291651.jpg',
    'https://i.postimg.cc/YSMG8TRP/334291852.jpg',
];

const CorporateArticle: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev === PHOTOS.length - 1 ? 0 : prev + 1));
    };

    return (
        <article className="pt-24 pb-16 min-h-screen bg-white">
            <Helmet>
                <title>Hotel ou Flat em Petrolina? A melhor escolha para Empresas</title>
                <meta
                    name="description"
                    content="Viajando a trabalho? Descubra por que executivos preferem alugar flats no Centro. Wi-Fi fibra, Nota Fiscal e economia para sua empresa."
                />
                <meta
                    property="og:title"
                    content="Hotel ou Flat em Petrolina? A melhor escolha para Empresas"
                />
                <meta
                    property="og:description"
                    content="Viajando a trabalho? Descubra por que executivos preferem alugar flats no Centro. Wi-Fi fibra, Nota Fiscal e economia para sua empresa."
                />
                <link
                    rel="canonical"
                    href="https://flatsintegracao.com.br/guia/hospedagem-corporativa-empresas-petrolina"
                />
            </Helmet>

            {/* Header do Artigo */}
            <header className="container mx-auto px-4 max-w-3xl mb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-1 rounded-full text-sm font-bold mb-6">
                    <Briefcase size={16} />
                    <span>Corporativo</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 font-heading mb-6 leading-tight">
                    Hospedagem Corporativa: Por que executivos estão trocando hotéis por flats em
                    Petrolina?
                </h1>
            </header>

            {/* Carrossel de Imagens */}
            <div className="container mx-auto px-4 max-w-4xl mb-12">
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
                    <img
                        src={PHOTOS[currentSlide]}
                        alt="Interior do Flat Integração mobiliado para executivos"
                        className="w-full h-full object-cover transition-transform duration-500"
                    />

                    {/* Controles do Carrossel */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={24} className="text-gray-800" />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {PHOTOS.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentSlide(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    currentSlide === idx
                                        ? 'bg-white w-6'
                                        : 'bg-white/50 hover:bg-white/80'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2 italic">
                    Ambientes reais dos nossos flats, prontos para sua estadia.
                </p>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="container mx-auto px-4 max-w-[800px] prose prose-lg prose-slate prose-headings:font-heading prose-headings:font-bold text-gray-700">
                <p>
                    Petrolina consolidou-se como um dos polos econômicos mais dinâmicos do interior
                    do Nordeste. Seja pela força do agronegócio exportador ou por ser o maior hub
                    médico da região, a cidade recebe diariamente centenas de profissionais em
                    trânsito.
                </p>
                <p>
                    Para quem viaja a negócios, a hospedagem não é apenas sobre onde dormir, mas
                    sobre manter a produtividade longe do escritório. É nesse cenário que os flats
                    no Centro têm se destacado como a escolha inteligente frente à hotelaria
                    tradicional.
                </p>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        1
                    </span>
                    O Escritório Longe de Casa
                </h2>
                <p>
                    A maior queixa de quem viaja a trabalho é a falta de ergonomia nos quartos de
                    hotel padrão. Trabalhar com o notebook no colo ou em mesas improvisadas é
                    insustentável.
                </p>
                <p>
                    No Flats Integração, entendemos essa necessidade. Nossas unidades oferecem
                    espaço dedicado para trabalho, com mesa adequada e iluminação correta.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col items-center text-center">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 mb-4">
                            <Wifi size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Wi-Fi de Alta Velocidade
                        </h3>
                        <p className="text-sm text-gray-600">
                            Sabemos que uma videoconferência não pode travar. Investimos em fibra
                            ótica estável e gratuita.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center text-center">
                        <div className="bg-slate-200 p-3 rounded-full text-slate-700 mb-4">
                            <Monitor size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Estação de Trabalho
                        </h3>
                        <p className="text-sm text-gray-600">
                            Mesa e cadeira adequadas para você montar seu escritório temporário com
                            conforto.
                        </p>
                    </div>
                </div>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        2
                    </span>
                    A Logística do Centro
                </h2>
                <p>
                    Tempo é o ativo mais valioso em uma viagem de negócios. Estar hospedado no
                    Centro de Petrolina significa estar no "olho do furacão" comercial.
                </p>
                <ul className="list-none pl-0 space-y-4">
                    <li className="flex gap-3">
                        <MapPin className="text-slate-500 flex-shrink-0" size={20} />
                        <span>
                            <strong>Proximidade:</strong> Bancos, cartórios, prefeitura e os
                            principais hospitais e clínicas estão a uma curta caminhada de
                            distância.
                        </span>
                    </li>
                    <li className="flex gap-3">
                        <ArrowRight className="text-slate-500 flex-shrink-0" size={20} />
                        <span>
                            <strong>Mobilidade:</strong> O acesso para o Distrito Industrial ou para
                            as áreas irrigadas é facilitado pelas vias arteriais que cortam o
                            centro, evitando o trânsito pesado de horários de pico em bairros
                            periféricos.
                        </span>
                    </li>
                </ul>

                <h2 className="flex items-center gap-3 mt-12 mb-6 text-2xl md:text-3xl text-gray-900 border-b pb-4">
                    <span className="bg-slate-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                        3
                    </span>
                    Custo-Benefício e Autonomia
                </h2>
                <p>
                    Para empresas que enviam colaboradores ou para profissionais autônomos, a
                    redução de custos operacionais (diárias + alimentação) é vital.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="flex items-center gap-2 font-bold mb-2">
                        <Coffee size={20} className="text-amber-700" /> Alimentação
                    </h3>
                    <p className="m-0 text-gray-600 text-sm">
                        Com uma cozinha completa, você não fica refém dos preços altos de room
                        service ou restaurantes todos os dias. Preparar seu próprio café da manhã ou
                        jantar gera uma economia significativa ao final da estadia.
                    </p>
                </div>
                <p>
                    <strong>Tarifas Competitivas:</strong> Oferecemos condições especiais para
                    estadias prolongadas ou recorrentes, entregando muito mais espaço (quarto + sala
                    + cozinha) por um valor frequentemente menor que um quarto standard de hotel.
                </p>
            </div>

            {/* Veja Também Interlinking */}
            <div className="container mx-auto px-4 max-w-[800px] mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold mb-4">Aproveite sua folga:</h3>
                <Link to="/guia/roteiro-vinho-petrolina" className="block group">
                    <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-slate-200 hover:shadow-md transition-all">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Vinho"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <span className="text-slate-600 text-xs font-bold uppercase">
                                Lazer
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-slate-600 transition-colors">
                                Relax no fim de semana: Roteiro do Vinho
                            </h4>
                        </div>
                        <ArrowRight className="ml-auto text-gray-400 group-hover:text-slate-500" />
                    </div>
                </Link>
            </div>

            {/* CTA Final */}
            <div className="bg-gray-900 text-white py-12 mt-16 text-center">
                <div className="container mx-auto px-4 max-w-2xl">
                    <h3 className="text-2xl font-bold mb-4 font-heading">
                        Vai vir a Petrolina a trabalho?
                    </h3>
                    <p className="text-gray-400 mb-8 text-lg">
                        Faça a escolha inteligente. Nota fiscal, conforto e localização.
                    </p>
                    <a
                        href={`https://wa.me/${HOST_PHONE}?text=Ol%C3%A1!%20Sou%20uma%20empresa/profissional%20e%20gostaria%20de%20verificar%20condi%C3%A7%C3%B5es%20para%20hospedagem.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
                    >
                        <Briefcase size={20} />
                        Falar com a Central de Reservas
                    </a>
                </div>
            </div>
        </article>
    );
};

export default CorporateArticle;
