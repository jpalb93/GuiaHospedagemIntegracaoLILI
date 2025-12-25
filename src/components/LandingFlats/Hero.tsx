import React, { useEffect, useState } from 'react';
import { ChevronRight, MapPin, CalendarDays, MessageCircle } from 'lucide-react';

const Hero: React.FC = () => {
    const [scrollY, setScrollY] = useState(() => {
        if (typeof window !== 'undefined') return window.scrollY;
        return 0;
    });

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section
            id="inicio"
            className="relative h-screen min-h-[700px] w-full overflow-hidden bg-gray-900"
        >
            {/* Background com Parallax */}
            <div
                className="absolute inset-0"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
            >
                <img
                    src="/hero-bg.jpg"
                    className="w-full h-full object-cover scale-110 opacity-60"
                    alt="Flats Integração"
                    fetchPriority="high"
                    loading="eager"
                    width="1920"
                    height="1080"
                    decoding="sync"
                />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"></div>

            {/* Conteúdo */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                <div className="flex flex-col items-center">
                    <div className="mb-4 inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-orange-500/30 animate-fadeIn">
                        <MapPin size={16} className="text-orange-400" />
                        <span className="text-orange-100 text-xs font-bold tracking-widest uppercase">
                            LOCALIZAÇÃO PRIVILEGIADA
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl text-center max-w-4xl leading-tight">
                        HOSPEDAGEM EM{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            PETROLINA
                        </span>
                    </h1>
                </div>

                {/* Gradient Overlay */}

                <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/95 mb-10 max-w-3xl drop-shadow-lg leading-relaxed">
                    Flats completos e mobiliados no{' '}
                    <strong className="font-semibold text-orange-300">Centro de Petrolina</strong>.
                    A liberdade de um apartamento com a{' '}
                    <strong className="font-semibold text-orange-300">
                        localização estratégica
                    </strong>{' '}
                    para curtas ou longas temporadas.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a
                        href="https://www.booking.com/hotel/br/flat-integracao-petrolina.pt-br.html"
                        target="_blank"
                        rel="noreferrer"
                        className="group bg-orange-600 hover:bg-orange-700 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl"
                    >
                        <CalendarDays size={20} />
                        Verificar Disponibilidade
                    </a>
                    <a
                        href="https://wa.me/5587988283273"
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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
        </section>
    );
};

export default Hero;
