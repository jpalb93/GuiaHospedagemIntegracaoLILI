import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
                className={`fixed w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-md py-4 border-b border-gray-100' : 'bg-transparent py-6'}`}
            >
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
                    <a href="#" className="relative z-50">
                        <LogoLili
                            className={`h-10 w-auto transition-colors duration-300 ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}
                        />
                    </a>

                    {/* Desktop Nav */}
                    <nav
                        className={`hidden md:flex gap-8 text-sm font-bold tracking-widest uppercase ${scrollY > 50 ? 'text-gray-900' : 'text-white/90'}`}
                    >
                        <a href="#inicio" className="hover:text-orange-500 transition-colors">
                            Início
                        </a>
                        <a href="#sobre" className="hover:text-orange-500 transition-colors">
                            O Flat
                        </a>
                        <a href="#comodidades" className="hover:text-orange-500 transition-colors">
                            Comodidades
                        </a>
                        <a href="#avaliacoes" className="hover:text-orange-500 transition-colors">
                            Reviews
                        </a>
                    </nav>

                    <a
                        href="#calendario"
                        className={`hidden md:block px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${scrollY > 50 ? 'bg-gray-900 text-white hover:bg-orange-600' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
                    >
                        Reservar
                    </a>

                    {/* Menu Mobile Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden relative z-50 p-2 ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}
                        aria-label="Menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white flex flex-col justify-center items-center gap-8 animate-fadeIn">
                    <a
                        href="#inicio"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-heading font-bold text-gray-900 text-center"
                    >
                        Início
                    </a>
                    <a
                        href="#sobre"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-heading font-bold text-gray-900 text-center"
                    >
                        O Flat
                    </a>
                    <a
                        href="#comodidades"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-heading font-bold text-gray-900 text-center"
                    >
                        Comodidades
                    </a>
                    <a
                        href="#calendario"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-3xl font-heading font-bold text-orange-600 text-center"
                    >
                        Reservar
                    </a>
                </div>
            )}
        </>
    );
};

export default Header;
