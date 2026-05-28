import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import Footer from './Footer';
import TopTicker from './TopTicker';
import { HOST_PHONE } from '../../constants';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { pathname } = useLocation();
    const isDarkTheme = pathname.startsWith('/guia') || pathname === '/';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fecha o menu ao mudar de rota e reseta o scroll
    useEffect(() => {
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    const isHomePage = pathname === '/';

    return (
        <div className={`font-sans antialiased flex flex-col min-h-screen ${isDarkTheme ? 'bg-stone-950 text-stone-300' : 'bg-white text-gray-900'}`}>
            <TopTicker />
            {/* --- Premium Header --- */}
            <header
                className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 w-full z-[100] transition-all duration-700 flex justify-center items-center pointer-events-none 
                ${isHomePage 
                    ? (isScrolled ? 'top-0 pt-4 md:pt-6' : 'top-9 pt-0') 
                    : 'top-0 bg-white border-b border-gray-100 shadow-sm'
                }`}
            >
                <div
                    className={`flex items-center justify-between transition-all duration-700 pointer-events-auto border border-transparent 
                    ${!isHomePage 
                        ? 'w-full py-4 px-8 md:px-16' 
                        : (isScrolled
                            ? 'w-[92%] max-w-6xl bg-white/95 backdrop-blur-2xl py-3 px-6 md:px-10 rounded-full shadow-2xl border-white/20 ring-1 ring-black/5'
                            : 'w-full bg-white/90 backdrop-blur-md py-6 px-8 md:px-16 border-b border-white/10')
                    }`}
                >
                    <Link to="/" className="relative group transition-opacity hover:opacity-80">
                        <img
                            src={flatsLogo}
                            alt="Logo Flats Integração"
                            width={180}
                            height={48}
                            className={`w-auto transition-all duration-700 drop-shadow-sm ${isScrolled ? 'h-9 md:h-10' : 'h-12 md:h-16'}`}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-10 items-center">
                        <Link to="/" className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isHomePage ? 'text-stone-600 hover:text-stone-950' : 'text-gray-500 hover:text-orange-600'}`}>Início</Link>
                        <Link to="/guia" className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isHomePage ? 'text-stone-600 hover:text-stone-950' : 'text-gray-500 hover:text-orange-600'}`}>Guia Petrolina</Link>
                        <a href={isHomePage ? "#galeria" : "/#galeria"} className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isHomePage ? 'text-stone-600 hover:text-stone-950' : 'text-gray-500 hover:text-orange-600'}`}>Galeria</a>
                        <a href={isHomePage ? "#features" : "/#features"} className={`text-xs font-bold uppercase tracking-[0.2em] transition-colors ${isHomePage ? 'text-stone-600 hover:text-stone-950' : 'text-gray-500 hover:text-orange-600'}`}>Diferenciais</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href={`https://wa.me/${HOST_PHONE}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`font-medium text-xs uppercase tracking-widest transition-all duration-500 shadow-xl ${!isHomePage 
                                    ? 'bg-stone-900 hover:bg-orange-600 text-white px-8 py-4 rounded-full'
                                    : (isScrolled
                                        ? 'bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full'
                                        : 'bg-orange-600 text-white hover:bg-stone-900 px-8 py-4 rounded-full')
                                }`}
                        >
                            Reservar
                        </a>

                        {/* Hamburger Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className={`md:hidden p-2 ${isHomePage ? 'text-stone-900' : 'text-stone-900'}`}
                            aria-label="Menu"
                        >
                            <div className="space-y-1.5">
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-4 h-0.5 bg-current ml-auto transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[90] bg-white md:hidden transition-all duration-700 flex flex-col justify-center items-center gap-8 ${isMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                <nav className="flex flex-col items-center gap-8">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading font-bold text-stone-900">Início</Link>
                    <Link to="/guia" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading font-bold text-stone-900">Guia Local</Link>
                    <a href="#galeria" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading font-bold text-stone-900">Ambientes</a>
                    <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-3xl font-heading font-bold text-stone-900">Diferenciais</a>
                </nav>
                <a
                    href={`https://wa.me/${HOST_PHONE}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-8 bg-orange-600 text-white px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-xl"
                >
                    Reservar Agora
                </a>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow relative z-0">
                {children}
            </main>

            <Footer />

            {/* Botão Flutuante do WhatsApp */}
            <a
                href={`https://wa.me/${HOST_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-110 flex items-center justify-center group"
                aria-label="Falar no WhatsApp"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-7 h-7 brightness-0 invert"
                />
                <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-stone-100">
                    Falar Conosco
                </span>
            </a>
        </div>
    );
};

export default MainLayout;
