import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Instagram, MapPin, ArrowUpRight, Star, ShieldCheck } from 'lucide-react';
import flatsLogo from '../../assets/flats-integracao-logo.png';
import logoEximus from '../../assets/logo-eximus.png';
import { HOST_PHONE } from '../../constants';

const WA_RESERVE = `https://wa.me/${HOST_PHONE}?text=${encodeURIComponent(
    'Olá! Quero reservar um flat nos Flats Integração.'
)}`;

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0E0D0B] text-stone-400 font-sans text-sm relative overflow-hidden border-t border-white/10">
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 pt-16 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 pb-14 border-b border-white/10">
                    {/* Brand & Location Info Column */}
                    <div className="lg:col-span-4 space-y-6">
                        <Link to="/" className="block w-fit group">
                            <img
                                src={flatsLogo}
                                alt="Flats Integração"
                                width={160}
                                height={44}
                                className="h-10 w-auto brightness-0 invert opacity-95 group-hover:opacity-100 transition-opacity"
                            />
                        </Link>
                        <p className="text-stone-400 text-sm leading-relaxed max-w-sm font-normal">
                            Hospedagem mobiliada no Centro de Petrolina: cozinha equipada, Wi-Fi
                            fibra 500M e ar-condicionado. A alternativa ideal ao hotel com autonomia
                            e faturamento PJ.
                        </p>

                        <address
                            className="not-italic space-y-3 pt-2"
                            itemScope
                            itemType="https://schema.org/LocalBusiness"
                        >
                            <div className="flex items-start gap-3 bg-[#161412] border border-white/10 p-4 rounded-2xl max-w-sm">
                                <MapPin
                                    className="text-[#E5C98B] mt-0.5 flex-shrink-0"
                                    size={20}
                                    aria-hidden
                                />
                                <div className="text-xs text-stone-300 space-y-1">
                                    <strong
                                        itemProp="name"
                                        className="text-white font-heading font-semibold text-sm block"
                                    >
                                        Flats Integração
                                    </strong>
                                    <div
                                        itemProp="address"
                                        itemScope
                                        itemType="https://schema.org/PostalAddress"
                                        className="text-stone-400 leading-normal"
                                    >
                                        <span itemProp="streetAddress">
                                            R. São José, 475 B - Centro
                                        </span>
                                        , <span itemProp="addressLocality">Petrolina</span> -{' '}
                                        <span itemProp="addressRegion">PE</span>,{' '}
                                        <span itemProp="postalCode">56302-270</span>
                                    </div>
                                </div>
                            </div>
                        </address>

                        <div className="pt-2">
                            <a
                                href={WA_RESERVE}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2.5 bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-6 py-3 rounded-full font-semibold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98]"
                            >
                                <Phone size={15} aria-hidden />
                                Reservar no WhatsApp
                                <ArrowUpRight size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="text-white font-heading font-semibold uppercase tracking-wider text-xs border-b border-white/10 pb-3">
                            Navegação
                        </h3>
                        <nav aria-label="Rodapé, navegação rápida">
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link
                                        to="/"
                                        className="hover:text-[#E5C98B] transition-colors flex items-center gap-1.5"
                                    >
                                        Início
                                    </Link>
                                </li>
                                <li>
                                    <a
                                        href="/#galeria"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Galeria de Fotos
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#empresas"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Empresas & Mensal
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="/#hospede"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Área do Hóspede
                                    </a>
                                </li>
                                <li>
                                    <Link
                                        to="/guia"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Guia de Petrolina
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/politica-privacidade"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Termos & Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Column 3: Accommodation Types */}
                    <div className="lg:col-span-3 space-y-5">
                        <h3 className="text-white font-heading font-semibold uppercase tracking-wider text-xs border-b border-white/10 pb-3">
                            Hospedagem em Petrolina
                        </h3>
                        <nav aria-label="Rodapé, modalidades de hospedagem">
                            <ul className="space-y-3 text-sm">
                                <li>
                                    <Link
                                        to="/hospedagem-em-petrolina"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Hospedagem Geral em Petrolina
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/flat-centro-petrolina"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Flat no Centro (Localização)
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/aluguel-mensal-petrolina-flat-mobiliado"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Aluguel Mensal Mobiliado
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/hospedagem-corporativa-empresas-petrolina"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Hospedagem Corporativa PJ
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/guia/hospedagem-proximo-hospitais-petrolina"
                                        className="hover:text-[#E5C98B] transition-colors"
                                    >
                                        Polo Médico & Hospitais
                                    </Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Column 4: Trust & Social Badges */}
                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-white font-heading font-semibold uppercase tracking-wider text-xs border-b border-white/10 pb-3">
                            Confiança & Redes
                        </h3>

                        {/* Booking Trust Badge */}
                        <a
                            href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between bg-[#161412] border border-white/10 hover:border-[#E5C98B]/40 p-4 rounded-2xl transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-[#E5C98B] text-[#141210] font-heading font-semibold text-base px-2.5 py-1 rounded-xl">
                                    9.0
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-[#E5C98B] text-xs font-semibold uppercase">
                                        <Star size={12} className="fill-[#E5C98B]" />
                                        Excepcional
                                    </div>
                                    <span className="text-[11px] text-stone-400">Booking.com</span>
                                </div>
                            </div>
                            <ArrowUpRight
                                size={16}
                                className="text-stone-400 group-hover:text-[#E5C98B] transition-colors"
                            />
                        </a>

                        <div className="flex items-center gap-3 pt-1">
                            <a
                                href="https://www.instagram.com/flatintegracao/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#161412] border border-white/10 hover:border-[#E5C98B]/40 text-xs text-stone-300 hover:text-white transition-all group"
                                aria-label="Instagram Flats Integração"
                            >
                                <Instagram
                                    size={15}
                                    className="text-[#E5C98B] group-hover:scale-110 transition-transform"
                                />
                                <span>@flatintegracao</span>
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
                            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                            <span>Reserva Segura · Sem Taxas Ocultas</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal & Development Credits */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-stone-500">
                    <p>© {currentYear} Flats Integração. Todos os direitos reservados.</p>

                    <div className="flex items-center gap-6">
                        <span>Petrolina · Vale do São Francisco</span>
                        <span className="text-stone-800">•</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-wider text-stone-600">
                                Desenvolvido por
                            </span>
                            <a
                                href="https://www.eximusdigital.com.br"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:opacity-100 opacity-70 transition-opacity inline-block"
                            >
                                <img
                                    src={logoEximus}
                                    alt="Eximus Digital"
                                    width={90}
                                    height={18}
                                    className="h-3.5 w-auto"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
