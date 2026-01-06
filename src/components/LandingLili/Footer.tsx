import React from 'react';
import { Wifi, Coffee, Shield } from 'lucide-react';
import LogoLili from '../LogoLili';

const Footer: React.FC = () => {
    return (
        <footer className="bg-stone-950 text-white py-24 text-center">
            <LogoLili className="h-20 w-auto mx-auto mb-8 text-white" />
            <p className="text-stone-500 font-light text-sm tracking-widest uppercase mb-8">
                By Flats Integração
            </p>
            <div className="flex justify-center gap-6 opacity-50 mb-12 text-stone-400">
                <Wifi size={20} />
                <Coffee size={20} />
                <Shield size={20} />
            </div>

            <div className="pt-8 border-t border-stone-800 w-full max-w-xs mx-auto">
                <div className="flex flex-col items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-stone-600">
                        Desenvolvido por:
                    </span>
                    <a
                        href="https://www.eximusdigital.com.br"
                        target="_blank"
                        rel="noreferrer"
                        className="hover:opacity-80 transition-opacity"
                    >
                        <img
                            src="/assets/logo-eximus.png"
                            alt="Eximus Digital"
                            className="h-5 w-auto hover:opacity-80 transition-opacity brightness-0 invert"
                        />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
