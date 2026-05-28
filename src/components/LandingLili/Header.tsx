import React, { useState, useEffect } from 'react';
import LogoLili from '../LogoLili';

const Header: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 flex justify-center items-center pointer-events-none ${scrollY > 50 ? 'pt-4 md:pt-6' : 'pt-0'
                    }`}
            >
                <div
                    className={`flex items-center justify-between transition-all duration-700 pointer-events-auto border border-transparent ${scrollY > 50
                        ? 'w-[92%] max-w-6xl bg-stone-900/90 backdrop-blur-2xl py-3 px-6 md:px-10 rounded-full shadow-2xl border-white/10 ring-1 ring-white/5'
                        : 'w-full bg-stone-950/20 backdrop-blur-sm py-6 px-8 md:px-16 border-b border-white/5'
                        }`}
                >
                    <a href="#" className="relative group transition-opacity hover:opacity-80">
                        <LogoLili
                            className={`transition-all duration-700 ${scrollY > 50 ? 'h-8 md:h-9' : 'h-10 md:h-12'}`}
                        />
                    </a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex gap-10 items-center">
                        {[
                            { name: 'Início', href: '#inicio' },
                            { name: 'O Flat', href: '#sobre' },
                            { name: 'Comodidades', href: '#comodidades' },
                            { name: 'Reviews', href: '#avaliacoes' },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="relative text-xs font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-white transition-colors duration-300 group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-1/2 w-0 h-[1.5px] bg-orange-500 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <a
                            href="#calendario"
                            className={`font-bold text-xs uppercase tracking-widest transition-all duration-500 shadow-xl ${scrollY > 50
                                ? 'bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full'
                                : 'bg-white text-stone-950 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-full'
                                }`}
                        >
                            Reservar
                        </a>

                        {/* Menu Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-white transition-colors"
                            aria-label="Menu"
                        >
                            <div className="space-y-1.5 text-white">
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-4 h-0.5 bg-current ml-auto transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[90] bg-stone-950 lg:hidden transition-all duration-700 flex flex-col justify-center items-center gap-8 ${isMobileMenuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                <nav className="flex flex-col items-center gap-8">
                    {[
                        { name: 'Início', href: '#inicio' },
                        { name: 'O Flat', href: '#sobre' },
                        { name: 'Comodidades', href: '#comodidades' },
                        { name: 'Reviews', href: '#avaliacoes' },
                    ].map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-heading font-light text-white hover:text-orange-500 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>
                <a
                    href="#calendario"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-8 bg-orange-600 text-white px-12 py-4 rounded-full font-bold text-sm uppercase tracking-widest"
                >
                    Ver Disponibilidade
                </a>
            </div>
        </>
    );
};

export default Header;
