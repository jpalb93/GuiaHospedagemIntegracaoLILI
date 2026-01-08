import React from 'react';
import { Link } from 'react-router-dom';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen">
            {/* Header Sticky */}
            <nav
                className={`fixed top-0 w-full z-50 px-6 transition-all duration-300 flex justify-between items-center ${isScrolled
                    ? 'bg-black/95 backdrop-blur-md py-3 shadow-lg border-b border-white/10'
                    : 'bg-gradient-to-b from-black/80 to-transparent py-4'
                    }`}
            >
                <Link to="/" className="hover:opacity-80 transition-opacity">
                    <img
                        src={flatsLogo}
                        alt="Flats Integração"
                        width="180"
                        height="48"
                        className={`w-auto drop-shadow-lg transition-all duration-300 ${isScrolled ? 'h-10' : 'h-12 md:h-14'}`}
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
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-orange-700 hover:bg-orange-800 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg hover:shadow-orange-500/30"
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
