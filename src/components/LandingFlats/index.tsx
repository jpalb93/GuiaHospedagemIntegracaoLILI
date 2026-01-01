import React from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from './Hero';
import FeaturesSection from './FeaturesSection';
import InfoSection from './InfoSection';
import ReputationSection from './ReputationSection';
import GallerySection from './GallerySection';
import LocationSection from './LocationSection';
import GuestAccessSection from './GuestAccessSection';
import { Phone, Instagram } from 'lucide-react';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import logoEximus from '../../assets/logo-eximus.png';

gsap.registerPlugin(ScrollTrigger);

const LandingFlatsIntegracao: React.FC = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans antialiased bg-stone-950 text-stone-300">
            {/* SEO Meta Tags */}
            <Helmet>
                <title>Flats Integração - Hospedagem em Petrolina</title>
                <meta
                    name="description"
                    content="Guia interativo do Flats Integração com senhas Wi-Fi, informações da estadia, dicas de Petrolina e atendimento 24h."
                />
                <meta
                    name="keywords"
                    content="flats Petrolina, hospedagem Petrolina, guia digital, Flats Integração, aluguel temporada, hotel Petrolina"
                />
                <meta name="author" content="Flats Integração" />
                <meta name="robots" content="index, follow" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://flatsintegracao.com.br" />
                <meta property="og:title" content="Flats Integração - Hospedagem em Petrolina" />
                <meta
                    property="og:description"
                    content="Hospedagem com alma em Petrolina. Guia digital interativo para facilitar sua estadia."
                />
                <meta property="og:locale" content="pt_BR" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Flats Integração - Hospedagem em Petrolina" />
                <meta
                    name="twitter:description"
                    content="Guia interativo para sua estadia em Petrolina"
                />

                {/* Canonical URL */}
                <link rel="canonical" href="https://flatsintegracao.com.br" />
            </Helmet>

            {/* Header Sticky - Permanent Glass Look */}
            <nav
                className={`fixed top-0 w-full z-50 px-6 transition-all duration-300 flex justify-between items-center border-b ${
                    isScrolled
                        ? 'bg-stone-950/95 backdrop-blur-md py-3 shadow-lg border-stone-800'
                        : 'bg-stone-950/50 backdrop-blur-sm py-5 border-white/10'
                }`}
            >
                <a href="#inicio" className="hover:opacity-80 transition-opacity">
                    <img
                        src={flatsLogo}
                        alt="Flats Integração"
                        className={`w-auto drop-shadow-lg transition-all duration-300 ${
                            isScrolled ? 'h-10' : 'h-12 md:h-14'
                        }`}
                    />
                </a>

                <div className="flex items-center gap-6">
                    <a
                        href="#galeria"
                        className="text-stone-300 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors hidden sm:inline-block"
                    >
                        Galeria
                    </a>
                    <a
                        href="#features"
                        className="text-stone-300 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors hidden sm:inline-block"
                    >
                        Diferenciais
                    </a>
                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-orange-500/30"
                    >
                        Reservar
                    </a>
                </div>
            </nav>

            <Hero />

            <ReputationSection />

            <GallerySection />

            <InfoSection />

            <FeaturesSection />

            <LocationSection />

            <GuestAccessSection />

            {/* Footer Simples */}
            <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <h4 className="text-white font-bold text-lg mb-2">Flats Integração</h4>
                        <p className="text-sm">Hospedagem com alma em Petrolina.</p>
                    </div>

                    <div className="flex gap-6">
                        <a
                            href="https://www.instagram.com/flatintegracao/"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-orange-500 transition-colors"
                        >
                            <Instagram size={20} />
                        </a>
                        <a
                            href="https://wa.me/5587988283273"
                            className="hover:text-orange-500 transition-colors"
                        >
                            <Phone size={20} />
                        </a>
                    </div>

                    <div className="flex flex-col items-center md:items-end gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-gray-600">
                            Desenvolvido por:
                        </span>
                        <a
                            href="https://www.eximusdigital.com.br"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:opacity-80 transition-opacity"
                        >
                            <img
                                src={logoEximus}
                                alt="Eximus Digital"
                                className="h-5 w-auto opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </a>
                    </div>

                    <div className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Flats Integração.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingFlatsIntegracao;
