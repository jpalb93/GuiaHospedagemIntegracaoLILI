import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/LandingFlats/Hero';
import FeaturesSection from '../components/LandingFlats/FeaturesSection';
import InfoSection from '../components/LandingFlats/InfoSection';
import ReputationSection from '../components/LandingFlats/ReputationSection';
import GallerySection from '../components/LandingFlats/GallerySection';
import LocationSection from '../components/LandingFlats/LocationSection';
import GuestAccessSection from '../components/LandingFlats/GuestAccessSection';
import FAQSection from '../components/LandingFlats/FAQSection';

const Home: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Flats Integração | Aluguel por Temporada no Centro de Petrolina</title>
                <meta
                    name="description"
                    content="Hospedagem completa no Centro de Petrolina. Flats mobiliados com cozinha, Wi-Fi e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    property="og:title"
                    content="Flats Integração | Aluguel por Temporada no Centro de Petrolina"
                />
                <meta
                    property="og:description"
                    content="Hospedagem completa no Centro de Petrolina. Flats mobiliados com cozinha, Wi-Fi e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    name="keywords"
                    content="flats Petrolina, hospedagem Petrolina, guia digital, Flats Integração, aluguel temporada, hotel Petrolina"
                />
                <meta name="author" content="Flats Integração" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://flatsintegracao.com.br" />

                {/* Opengraph and Twitter tags omitted for brevity, logic remains same as original */}
                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LodgingBusiness',
                        name: 'Flats Integração',
                        image: 'https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg',
                        telephone: '+55 87 98834-2138',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'R. São José, 475 B, Centro',
                            addressLocality: 'Petrolina',
                            addressRegion: 'PE',
                            postalCode: '56302-270',
                            addressCountry: 'BR',
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '9.0',
                            bestRating: '10',
                            worstRating: '1',
                            ratingCount: '150',
                        },
                    })}
                </script>
            </Helmet>

            <Hero />
            <ReputationSection />
            <GallerySection />
            <InfoSection />
            <FeaturesSection />

            {/* Nova Seção: Descubra Petrolina */}
            <section className="py-16 bg-gray-50 border-t border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2">
                            Explore a Região
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-heading">
                            Descubra Petrolina
                        </h2>
                        <p className="text-gray-600 mt-4 max-w-2xl">
                            Aproveite o melhor que o Vale do São Francisco tem a oferecer com nossos
                            roteiros selecionados.
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Roteiro do Vinho */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="/assets/blog/vapor-do-vinho-montagem.jpg"
                                    alt="Montagem de fotos do Roteiro do Vinho em Petrolina, mostrando o barco Vapor do Vinho no Rio São Francisco, banho no rio, vista aérea da vinícola e barris de carvalho com garrafas de Brandy Miolo na adega"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <h3 className="text-white text-xl font-bold">
                                        Roteiro do Vinho
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Guia completo sobre vinícolas, Vapor do Vinho e preços.
                                </p>
                                <Link
                                    to="/guia/roteiro-vinho-petrolina"
                                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors uppercase tracking-wide text-xs"
                                >
                                    Ler Artigo <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Bodódromo */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="/assets/blog/bododromo-petrolina.jpg"
                                    alt="Complexo Gastronômico Bodódromo em Petrolina"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <h3 className="text-white text-xl font-bold">
                                        Gastronomia Regional
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Onde comer carne de bode e peixes do Rio São Francisco.
                                </p>
                                <Link
                                    to="/guia/onde-comer-petrolina-bododromo"
                                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors uppercase tracking-wide text-xs"
                                >
                                    Ler Artigo <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Rio São Francisco */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="/assets/blog/rio-sao-francisco-rodeadouro.jpg"
                                    alt="Pôr do sol no Rio São Francisco em Petrolina"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <h3 className="text-white text-xl font-bold">
                                        Experiências Fluviais
                                    </h3>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Ilha do Rodeadouro e a travessia de barquinha.
                                </p>
                                <Link
                                    to="/guia/rio-sao-francisco-rodeadouro-barquinha"
                                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors uppercase tracking-wide text-xs"
                                >
                                    Ler Artigo <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Corporativo */}
                        <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-100 flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src="https://i.postimg.cc/tgpZD8kK/334291651.jpg"
                                    alt="Flat para hospedagem corporativa com mesa de trabalho em Petrolina"
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <h3 className="text-white text-xl font-bold">Para Empresas</h3>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col justify-between">
                                <p className="text-gray-600 mb-4 text-sm">
                                    Wi-Fi de alta velocidade, nota fiscal e localização estratégica.
                                </p>
                                <Link
                                    to="/guia/hospedagem-corporativa-empresas-petrolina"
                                    className="inline-flex items-center gap-2 text-orange-500 font-bold hover:text-orange-600 transition-colors uppercase tracking-wide text-xs"
                                >
                                    Ler Artigo <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FAQSection />
            <GuestAccessSection />
            <LocationSection />
        </>
    );
};

export default Home;
