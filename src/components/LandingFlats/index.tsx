import React from 'react';
import Hero from './Hero';
import FeaturesSection from './FeaturesSection';
import InfoSection from './InfoSection';
import ReputationSection from './ReputationSection';
import GallerySection from './GallerySection';
import LocationSection from './LocationSection';
import GuestAccessSection from './GuestAccessSection';
import { Phone, Instagram } from 'lucide-react';

const LandingFlatsIntegracao: React.FC = () => {

    return (
        <div className="font-sans antialiased bg-white text-gray-900">
            {/* Header Transparente */}
            <nav className="absolute top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80"></div>
                <div>
                    <a href="#galeria" className="text-white/90 hover:text-white font-semibold text-sm transition-colors hidden sm:inline-block mr-6">Galeria</a>
                    <a href="#features" className="text-white/90 hover:text-white font-semibold text-sm transition-colors hidden sm:inline-block mr-6">Diferenciais</a>
                    <a href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html" target="_blank" rel="noreferrer" className="text-white/90 hover:text-white font-semibold text-sm transition-colors hidden sm:inline-block">Reservar</a>
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
                        <a href="https://www.instagram.com/flatintegracao/" target="_blank" rel="noreferrer" className="hover:text-orange-500 transition-colors"><Instagram size={20} /></a>
                        <a href="https://wa.me/5587988283273" className="hover:text-orange-500 transition-colors"><Phone size={20} /></a>
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
