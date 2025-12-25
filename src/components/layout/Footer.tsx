import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, MapPin, ArrowRight } from 'lucide-react';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import logoEximus from '../../assets/logo-eximus.png';
import { HOST_PHONE } from '../../constants';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-400 py-16 border-t border-gray-800 font-sans text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* COLUNA 1: SOBRE E CONTATO (NAP) */}
                    <div className="space-y-6">
                        <Link to="/" className="block">
                            <img
                                src={flatsLogo}
                                alt="Flats Integração"
                                className="h-10 w-auto brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-gray-500 leading-relaxed">
                            Hospedagem com alma no coração de Petrolina. Conforto, praticidade e
                            localização estratégica.
                        </p>

                        <address className="not-italic space-y-3">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-orange-500 mt-1 flex-shrink-0" size={18} />
                                <span className="text-gray-400">
                                    R. São José, 475 B - Centro,
                                    <br />
                                    Petrolina - PE, 56302-270
                                </span>
                            </div>
                        </address>

                        <a
                            href={`https://wa.me/${HOST_PHONE}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-lg shadow-green-900/20 hover:shadow-green-900/40"
                        >
                            <Phone size={18} />
                            Falar no WhatsApp
                        </a>
                    </div>

                    {/* COLUNA 2: ACESSO RÁPIDO */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">
                            Acesso Rápido
                        </h4>
                        <nav>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/"
                                        className="hover:text-orange-500 transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight size={14} className="text-gray-600" /> Home
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#galeria"
                                        className="hover:text-orange-500 transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight size={14} className="text-gray-600" />{' '}
                                        Acomodações
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to="/guia"
                                        className="hover:text-orange-500 transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight size={14} className="text-gray-600" /> Guia do
                                        Viajante
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-gray-600 cursor-not-allowed flex items-center gap-2">
                                        <ArrowRight size={14} className="text-gray-700" /> Área do
                                        Hóspede (Login)
                                    </span>
                                </li>
                                <li>
                                    <Link
                                        to="/politica-privacidade"
                                        className="hover:text-orange-500 transition-colors flex items-center gap-2"
                                    >
                                        <ArrowRight size={14} className="text-gray-600" /> Política
                                        de Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* COLUNA 3: GUIA DO VIAJANTE (SEO) */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">
                            Dicas de Petrolina
                        </h4>
                        <nav>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/guia/roteiro-vinho-petrolina"
                                        className="hover:text-orange-500 transition-colors block"
                                    >
                                        Roteiro do Vinho
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/onde-comer-petrolina-bododromo"
                                        className="hover:text-orange-500 transition-colors block"
                                    >
                                        Gastronomia e Bodódromo
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/rio-sao-francisco-rodeadouro-barquinha"
                                        className="hover:text-orange-500 transition-colors block"
                                    >
                                        Rio São Francisco e Ilhas
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/hospedagem-corporativa-empresas-petrolina"
                                        className="hover:text-orange-500 transition-colors block"
                                    >
                                        Hospedagem Corporativa
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* COLUNA 4: REDES E COPY */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 tracking-wide">
                            Siga-nos
                        </h4>
                        <div className="flex gap-4 mb-8">
                            <a
                                href="https://www.instagram.com/flatintegracao/"
                                target="_blank"
                                rel="noreferrer"
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-orange-500 hover:text-white transition-all duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>

                        <div className="pt-8 border-t border-gray-800">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] uppercase tracking-wider text-gray-600">
                                    Desenvolvido por:
                                </span>
                                <a
                                    href="https://www.eximusdigital.com.br"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="hover:opacity-80 transition-opacity inline-block"
                                >
                                    <img
                                        src={logoEximus}
                                        alt="Eximus Digital"
                                        className="h-4 w-auto opacity-50 hover:opacity-100 transition-opacity"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RODAPÉ INFERIOR */}
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
                    <p>Copyright © {currentYear} Flats Integração. Todos os direitos reservados.</p>
                    <p className="flex items-center gap-1">
                        Feito com <span className="text-red-900">♥</span> no Vale do São Francisco
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
