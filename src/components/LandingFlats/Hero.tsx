import React, { useEffect, useState } from 'react';
import { ChevronRight, Award, MapPin, CalendarDays, MessageCircle } from 'lucide-react';
import flatsLogo from '../../assets/flats-integracao-logo.png';

const Hero: React.FC = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="inicio" className="relative h-screen min-h-[700px] w-full overflow-hidden bg-gray-900">
            {/* Background com Parallax */}
            <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                <img
                    src="https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg"
                    className="w-full h-full object-cover scale-110 opacity-60"
                    alt="Flats Integração"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

            {/* Conteúdo */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">

                <div className="mb-8 animate-fadeIn relative group">
                    <img src={flatsLogo} alt="Logo Flats Integração" className="relative z-10 h-40 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
                    <div
                        className="absolute inset-0 z-20 animate-logo-shimmer pointer-events-none"
                        style={{
                            maskImage: `url(${flatsLogo})`,
                            WebkitMaskImage: `url(${flatsLogo})`,
                            maskSize: 'contain',
                            WebkitMaskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskPosition: 'center',
                            WebkitMaskPosition: 'center'
                        }}
                    />
                </div>

                <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl animate-fadeIn delay-100">
                    <Award size={18} className="text-orange-400" />
                    <h1 className="text-white/90 text-sm font-semibold tracking-wide uppercase">Hospedagem em Petrolina</h1>
                </div>

                {/* Gradient Overlay */}



                <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/95 mb-10 max-w-3xl drop-shadow-lg leading-relaxed">
                    Seu lar longe de casa, com o <span className="font-semibold text-orange-300">conforto</span> e <span className="font-semibold text-orange-300">praticidade</span> que você merece.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl"
                    >
                        <CalendarDays size={20} />
                        Verificar Disponibilidade
                    </a>
                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center gap-2 border border-white/30 hover:border-white/50"
                    >
                        <MessageCircle size={20} />
                        Falar conosco no Whatsapp
                    </a>
                </div>

                <div className="mt-16 flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
                    <MapPin className="text-orange-400" size={18} />
                    <span>Petrolina, Pernambuco</span>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                <ChevronRight className="text-white/50 rotate-90" size={32} />
            </div>
        </section >
    );
};

export default Hero;
