import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import Footer from './Footer';
import SectionDivider from '../LandingFlats/SectionDivider';
import { HOST_PHONE } from '../../constants';
import { Briefcase } from 'lucide-react';
import CorporateProposalModal from '../modals/CorporateProposalModal';

interface MainLayoutProps {
    children: React.ReactNode;
}

const WA_RESERVE = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Quero reservar um flat nos Flats Integração.'
)}`;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { pathname } = useLocation();
    const isDarkTheme =
        pathname.startsWith('/guia') ||
        pathname === '/' ||
        pathname === '/hospedagem-em-petrolina' ||
        pathname === '/flat-centro-petrolina';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleOpenCorporateModal = () => setIsCorporateModalOpen(true);
        window.addEventListener('open-corporate-modal', handleOpenCorporateModal);
        return () => window.removeEventListener('open-corporate-modal', handleOpenCorporateModal);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMenuOpen(false);
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    const isHomePage = pathname === '/';
    const hash = (id: string) => (isHomePage ? `#${id}` : `/#${id}`);

    const navLinkClass = isHomePage
        ? 'relative text-xs font-bold uppercase tracking-[0.15em] text-stone-600 hover:text-stone-950 transition-colors duration-300 group'
        : 'text-xs font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-orange-600 transition-colors';

    return (
        <div
            className={`font-sans antialiased flex flex-col min-h-screen overflow-x-hidden max-w-[100vw] ${
                isDarkTheme ? 'bg-stone-950 text-stone-300' : 'bg-white text-stone-900'
            }`}
        >
            <header
                className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 w-full z-[100] transition-all duration-700 flex justify-center items-center pointer-events-none ${
                    isHomePage
                        ? isScrolled
                            ? 'pt-4 md:pt-6'
                            : 'pt-0'
                        : 'bg-white border-b border-stone-100 shadow-sm'
                }`}
            >
                <div
                    className={`flex items-center justify-between transition-all duration-700 pointer-events-auto border border-transparent ${
                        !isHomePage
                            ? 'w-full py-4 px-6 md:px-12'
                            : isScrolled
                              ? 'w-[94%] max-w-6xl bg-white/95 backdrop-blur-2xl py-3 px-5 md:px-8 rounded-full shadow-2xl border-white/20 ring-1 ring-black/5'
                              : 'w-full bg-white/90 backdrop-blur-md py-5 px-6 md:px-12 border-b border-white/10'
                    }`}
                >
                    <Link
                        to="/"
                        className="relative group transition-opacity hover:opacity-80 shrink-0"
                        aria-label="Flats Integração, início"
                    >
                        <img
                            src={flatsLogo}
                            alt="Logo Flats Integração"
                            width={180}
                            height={48}
                            className={`w-auto transition-all duration-700 drop-shadow-sm ${
                                isScrolled ? 'h-8 md:h-9' : 'h-10 md:h-14'
                            }`}
                        />
                    </Link>

                    {/* Primary nav: conversão — Guia fica no footer */}
                    <nav
                        className="hidden md:flex gap-5 lg:gap-8 items-center"
                        aria-label="Navegação principal"
                    >
                        <Link to="/hospedagem-em-petrolina" className={navLinkClass}>
                            Hospedagem
                            {isHomePage && (
                                <span className="pointer-events-none absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                            )}
                        </Link>
                        <a href={hash('galeria')} className={navLinkClass}>
                            Galeria
                            {isHomePage && (
                                <span className="pointer-events-none absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                            )}
                        </a>
                        <a href={hash('features')} className={navLinkClass}>
                            Diferenciais
                            {isHomePage && (
                                <span className="pointer-events-none absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                            )}
                        </a>
                        <a
                            href={hash('empresas')}
                            className="relative text-xs font-extrabold uppercase tracking-[0.15em] text-orange-600 hover:text-orange-500 transition-colors whitespace-nowrap group"
                        >
                            Empresas
                            {isHomePage && (
                                <span className="pointer-events-none absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300" />
                            )}
                        </a>
                    </nav>

                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCorporateModalOpen(true)}
                            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-orange-500/40 text-orange-600 hover:bg-orange-50 font-bold text-xs uppercase tracking-[0.15em] transition-all"
                        >
                            <Briefcase size={14} aria-hidden /> Cotação B2B
                        </button>
                        <a
                            href={WA_RESERVE}
                            target="_blank"
                            rel="noreferrer"
                            className={`font-bold text-xs uppercase tracking-[0.15em] transition-all duration-500 shadow-xl rounded-full ${
                                !isHomePage
                                    ? 'bg-orange-600 hover:bg-orange-500 text-white px-6 py-3'
                                    : isScrolled
                                      ? 'bg-orange-600 hover:bg-orange-500 text-white px-6 py-3'
                                      : 'bg-orange-600 text-white hover:bg-stone-900 px-7 py-3.5'
                            }`}
                        >
                            Reservar
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-stone-900"
                            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-nav"
                        >
                            <div className="space-y-1.5" aria-hidden>
                                <span
                                    className={`block w-6 h-0.5 bg-current transition-all ${
                                        isMenuOpen ? 'rotate-45 translate-y-2' : ''
                                    }`}
                                />
                                <span
                                    className={`block w-4 h-0.5 bg-current ml-auto transition-all ${
                                        isMenuOpen ? 'opacity-0' : ''
                                    }`}
                                />
                                <span
                                    className={`block w-6 h-0.5 bg-current transition-all ${
                                        isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                    }`}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            <div
                id="mobile-nav"
                className={`fixed inset-0 z-[90] bg-stone-950 md:hidden transition-all duration-500 flex flex-col justify-center items-center gap-8 ${
                    isMenuOpen
                        ? 'opacity-100 visible pointer-events-auto'
                        : 'opacity-0 invisible pointer-events-none'
                }`}
                aria-hidden={!isMenuOpen}
            >
                <nav className="flex flex-col items-center gap-6" aria-label="Menu mobile">
                    <Link
                        to="/hospedagem-em-petrolina"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-bold text-white"
                    >
                        Hospedagem
                    </Link>
                    <a
                        href={hash('galeria')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-bold text-white"
                    >
                        Galeria
                    </a>
                    <a
                        href={hash('features')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-bold text-white"
                    >
                        Diferenciais
                    </a>
                    <a
                        href={hash('empresas')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-bold text-orange-500"
                    >
                        Empresas
                    </a>
                    <Link
                        to="/guia"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-heading font-medium text-stone-500 hover:text-stone-300"
                    >
                        Guia local
                    </Link>
                </nav>
                <div className="flex flex-col items-center gap-3 w-[80%] max-w-xs">
                    <button
                        type="button"
                        onClick={() => {
                            setIsMenuOpen(false);
                            setIsCorporateModalOpen(true);
                        }}
                        className="w-full border border-orange-500/40 text-orange-400 py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2"
                    >
                        <Briefcase size={16} aria-hidden /> Cotação B2B
                    </button>
                    <a
                        href={WA_RESERVE}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-orange-600 text-white text-center py-3.5 rounded-full font-bold text-xs uppercase tracking-[0.15em] shadow-xl"
                    >
                        Reservar agora
                    </a>
                </div>
            </div>

            <main className="flex-grow relative z-0">{children}</main>

            <SectionDivider />
            <Footer />

            <CorporateProposalModal
                isOpen={isCorporateModalOpen}
                onClose={() => setIsCorporateModalOpen(false)}
            />

            <a
                href={WA_RESERVE}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-colors duration-300 flex items-center justify-center group"
                aria-label="Reservar pelo WhatsApp"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt=""
                    className="w-7 h-7 brightness-0 invert"
                    width={28}
                    height={28}
                />
                <span className="absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-stone-100">
                    Reservar
                </span>
            </a>
        </div>
    );
};

export default MainLayout;
