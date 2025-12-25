import React from 'react';
import { Link } from 'react-router-dom';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen">
            {/* Header Transparente */}
            <nav className="absolute top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img
                        src={flatsLogo}
                        alt="Flats Integração"
                        className="h-12 md:h-14 w-auto drop-shadow-lg"
                    />
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                        to="/guia"
                        className="text-white/90 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors hidden sm:inline-block"
                    >
                        Guia de Petrolina
                    </Link>
                    <a
                        href="/#galeria"
                        className="text-white/90 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors hidden sm:inline-block"
                    >
                        Galeria
                    </a>
                    <a
                        href="/#features"
                        className="text-white/90 hover:text-white font-semibold text-sm uppercase tracking-wider transition-colors hidden sm:inline-block"
                    >
                        Diferenciais
                    </a>
                    <a
                        href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-orange-500/30"
                    >
                        Reservar
                    </a>
                </div>
            </nav>

            <main className="flex-grow">{children}</main>

            <Footer />
        </div>
    );
};

export default MainLayout;
