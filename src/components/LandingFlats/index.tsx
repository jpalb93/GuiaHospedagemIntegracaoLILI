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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            if (scrollPos > 50 && !isScrolled) setIsScrolled(true);
            if (scrollPos <= 50 && isScrolled) setIsScrolled(false);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);

    return (
        <div className="font-sans antialiased bg-stone-950 text-stone-300">
            {/* SEO Meta Tags */}
            {/* ... (Helmet remains the same) */}
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

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name: 'Flats Integração',
                        image: 'https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg',
                        '@id': 'https://flatsintegracao.com.br',
                        url: 'https://flatsintegracao.com.br',
                        telephone: '+5587988283273',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'Av. Cardoso de Sá',
                            addressLocality: 'Petrolina',
                            addressRegion: 'PE',
                            postalCode: '56328-020',
                            addressCountry: 'BR'
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: -9.3941,
                            longitude: -40.5036
                        },
                        sameAs: [
                            'https://www.instagram.com/flatintegracao/',
                            'https://maps.app.goo.gl/9QPX2VnGxQwUCpzs6'
                        ],
                        openingHoursSpecification: {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: [
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                                'Sunday'
                            ],
                            opens: '00:00',
                            closes: '23:59'
                        }
                    })}
                </script>
            </Helmet>

            {/* Header Sticky - Premium Floating Pill Design */}
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 flex justify-center items-center pointer-events-none ${isScrolled ? 'pt-4 md:pt-6' : 'pt-0'
                    }`}
            >
                <div
                    className={`flex items-center justify-between transition-all duration-700 pointer-events-auto border border-transparent ${isScrolled
                        ? 'w-[92%] max-w-6xl bg-white/95 backdrop-blur-2xl py-3 px-6 md:px-10 rounded-full shadow-2xl border-white/20 ring-1 ring-black/5'
                        : 'w-full bg-white/90 backdrop-blur-md py-6 px-8 md:px-16 border-b border-white/10'
                        }`}
                >
                    <a
                        href="#inicio"
                        className="relative group transition-opacity hover:opacity-80 flex items-center"
                        aria-label="Ir para o topo"
                    >
                        <img
                            src={flatsLogo}
                            alt="Logo Flats Integração"
                            className={`w-auto transition-all duration-700 drop-shadow-sm ${isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-12'
                                }`}
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-10" aria-label="Navegação principal">
                        {[
                            { name: 'Galeria', href: '#galeria' },
                            { name: 'Comodidades', href: '#features' },
                            { name: 'Informações', href: '#info' },
                            { name: 'Localização', href: '#location' },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-xs font-bold uppercase tracking-[0.2em] text-stone-600 hover:text-stone-950 transition-colors duration-300 group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://wa.me/5587988283273"
                            target="_blank"
                            rel="noreferrer"
                            className={`font-bold text-xs uppercase tracking-widest transition-all duration-500 shadow-xl ${isScrolled
                                ? 'bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full'
                                : 'bg-orange-600 text-white hover:bg-stone-900 px-8 py-4 rounded-full'
                                }`}
                        >
                            Reservar
                        </a>

                        {/* Mobile Toggle - Standardized */}
                        <button
                            className="md:hidden p-2 text-stone-900 transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Abrir menu"
                        >
                            <div className="space-y-1.5 text-stone-900">
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-4 h-0.5 bg-current ml-auto transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay - Premium Feel */}
                <div className={`fixed inset-0 bg-white z-[90] md:hidden transition-all duration-700 flex flex-col justify-center items-center gap-8 ${isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                    <nav className="flex flex-col items-center gap-8">
                        {[
                            { name: 'Galeria', href: '#galeria' },
                            { name: 'Comodidades', href: '#features' },
                            { name: 'Informações', href: '#info' },
                            { name: 'Localização', href: '#location' },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-heading font-bold text-stone-900 hover:text-orange-500 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>
                    <a
                        href="https://wa.me/5587988283273"
                        className="mt-8 bg-orange-600 text-white px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest"
                    >
                        Reservar Agora
                    </a>
                </div>
            </header>

            <main>
                <Hero />

                <ReputationSection />

                <GallerySection />

                <InfoSection />

                <FeaturesSection />

                <LocationSection />

                <GuestAccessSection />
            </main>

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
                            aria-label="Seguir no Instagram"
                            className="hover:text-orange-500 transition-colors"
                        >
                            <Instagram size={20} />
                        </a>
                        <a
                            href="https://wa.me/5587988283273"
                            aria-label="Falar conosco via WhatsApp"
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
                                width="100"
                                height="25"
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
