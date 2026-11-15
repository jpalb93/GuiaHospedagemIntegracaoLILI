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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 40);
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

    const navLinkClass =
        'relative text-[13px] font-medium text-white/80 hover:text-white transition-colors duration-200 whitespace-nowrap';

    return (
        <div className="font-sans antialiased flex flex-col min-h-screen overflow-x-clip max-w-[100vw] bg-[#12110F] text-stone-200">
            <header
                className={`fixed top-0 left-0 w-full z-[100] flex justify-center items-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                    isScrolled
                        ? 'pt-3.5 md:pt-5 px-3 sm:px-6 bg-transparent'
                        : isHomePage
                          ? 'pt-0 px-0 bg-gradient-to-b from-[#12110F]/75 via-[#12110F]/25 to-transparent'
                          : 'pt-0 px-0 bg-[#12110F]/95 backdrop-blur-xl border-b border-white/10'
                }`}
            >
                <div
                    className={`flex items-center justify-between gap-2 pointer-events-auto w-full border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                        isScrolled
                            ? 'max-w-[1024px] rounded-[40px] border-white/15 py-2 md:py-2.5 px-3.5 sm:px-6 bg-[#141210]/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55)] ring-1 ring-white/5'
                            : 'max-w-[1320px] rounded-[0px] border-transparent py-3.5 sm:py-5 px-4 sm:px-6 md:px-12 bg-transparent shadow-none'
                    }`}
                >
                    <Link
                        to="/"
                        className="relative group inline-flex items-center transition-opacity hover:opacity-90 shrink-0"
                        aria-label="Flats Integração, início"
                    >
                        <img
                            src={flatsLogo}
                            alt="Logo Flats Integração"
                            width={180}
                            height={48}
                            className={`w-auto object-contain transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${
                                isScrolled ? 'h-8 md:h-9' : 'h-9 sm:h-10 md:h-11'
                            }`}
                        />
                    </Link>

                    {/* Primary nav: conversão — Guia fica no footer */}
                    <nav
                        className="hidden md:flex gap-6 lg:gap-8 items-center"
                        aria-label="Navegação principal"
                    >
                        <Link to="/hospedagem-em-petrolina" className={navLinkClass}>
                            Hospedagem
                        </Link>
                        <a href={hash('galeria')} className={navLinkClass}>
                            Galeria
                        </a>
                        <a href={hash('features')} className={navLinkClass}>
                            Diferenciais
                        </a>
                        <a
                            href={hash('empresas')}
                            className="relative text-[13px] font-medium text-[#E5C98B] hover:text-[#f1ddb0] transition-colors whitespace-nowrap"
                        >
                            Empresas
                        </a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={() => setIsCorporateModalOpen(true)}
                            className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 font-medium text-xs transition-all"
                        >
                            <Briefcase size={13} aria-hidden /> Cotação B2B
                        </button>
                        <a
                            href={WA_RESERVE}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center transition-all duration-300 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] font-semibold text-xs sm:text-[13px] leading-none px-5 py-2.5 shadow-md"
                        >
                            Reservar
                        </a>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden inline-flex items-center justify-center p-2 text-white"
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
                className={`fixed inset-0 z-[90] bg-[#12110F] md:hidden transition-all duration-500 flex flex-col justify-center items-center gap-8 ${
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
                        className="text-2xl font-heading font-semibold text-white hover:text-[#E5C98B] transition-colors"
                    >
                        Hospedagem
                    </Link>
                    <a
                        href={hash('galeria')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-semibold text-white hover:text-[#E5C98B] transition-colors"
                    >
                        Galeria
                    </a>
                    <a
                        href={hash('features')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-semibold text-white hover:text-[#E5C98B] transition-colors"
                    >
                        Diferenciais
                    </a>
                    <a
                        href={hash('empresas')}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-2xl font-heading font-semibold text-[#E5C98B]"
                    >
                        Empresas
                    </a>
                    <Link
                        to="/guia"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-lg font-heading font-medium text-stone-400 hover:text-white transition-colors"
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
                        className="w-full border border-[#E5C98B]/40 text-[#E5C98B] hover:bg-[#E5C98B]/10 py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] inline-flex items-center justify-center gap-2 transition-colors"
                    >
                        <Briefcase size={16} aria-hidden /> Cotação B2B
                    </button>
                    <a
                        href={WA_RESERVE}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] text-center py-3.5 rounded-full font-semibold text-xs uppercase tracking-[0.15em] shadow-xl transition-colors"
                    >
                        Reservar agora
                    </a>
                </div>
            </div>

            <main className="flex-grow relative z-0">{children}</main>

            {!isHomePage && <SectionDivider />}
            <Footer />

            <CorporateProposalModal
                isOpen={isCorporateModalOpen}
                onClose={() => setIsCorporateModalOpen(false)}
            />

            <a
                href={WA_RESERVE}
                target="_blank"
                rel="noreferrer"
                aria-hidden={!isScrolled}
                tabIndex={isScrolled ? 0 : -1}
                className={`fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${
                    isScrolled
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
                aria-label="Reservar pelo WhatsApp"
            >
                <svg
                    viewBox="0 0 32 32"
                    className="w-7 h-7 fill-current"
                    width={28}
                    height={28}
                    aria-hidden="true"
                >
                    <path d="M16 3C8.82 3 3 8.82 3 16c0 2.3.6 4.55 1.74 6.53L3.1 28.9l6.53-1.71A12.93 12.93 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3Zm0 23.62c-2.08 0-4.12-.56-5.9-1.62l-.42-.25-3.88 1.02 1.04-3.78-.28-.44A10.58 10.58 0 0 1 5.38 16C5.38 10.14 10.14 5.38 16 5.38S26.62 10.14 26.62 16 21.86 26.62 16 26.62Zm5.82-7.95c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.36-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64 0 1.56 1.14 3.07 1.3 3.28.16.21 2.24 3.42 5.42 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
                </svg>
                <span className="hidden md:block absolute right-full mr-4 bg-white text-stone-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-stone-100">
                    Reservar
                </span>
            </a>
        </div>
    );
};

export default MainLayout;
