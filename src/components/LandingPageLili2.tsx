import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, ChevronLeft, ChevronRight, XCircle, Wifi, Tv, Coffee, Wind, Shield, Menu, X, Sparkles, Award, Heart } from 'lucide-react';
import { subscribeToFutureReservations, getGuestReviews, subscribeToFutureBlockedDates } from '../services/firebase';
import { Reservation, GuestReview, BlockedDateRange } from '../types';
import SimpleGallery from './SimpleGallery';
import { LANDING_GALLERY_IMAGES, LANDING_HERO_SLIDES, FLAT_ADDRESS } from '../constants';

// --- CALENDÁRIO DINÂMICO (OTIMIZADO) ---
const AvailabilityCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);

    useEffect(() => {
        const unsubscribeRes = subscribeToFutureReservations((data) => {
            setReservations(data);
        });
        const unsubscribeBlocked = subscribeToFutureBlockedDates((data) => {
            setBlockedDates(data);
        });
        return () => {
            unsubscribeRes();
            unsubscribeBlocked();
        };
    }, []);

    const isDateOccupied = (date: Date) => {
        const target = new Date(date);
        target.setHours(0, 0, 0, 0);
        const targetTime = target.getTime();

        const isReserved = reservations.some(res => {
            if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return false;
            const [inY, inM, inD] = res.checkInDate.split('-').map(Number);
            const [outY, outM, outD] = res.checkoutDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime < end.getTime();
        });

        if (isReserved) return true;

        const isBlocked = blockedDates.some(block => {
            if (!block.startDate || !block.endDate) return false;
            const [inY, inM, inD] = block.startDate.split('-').map(Number);
            const [outY, outM, outD] = block.endDate.split('-').map(Number);
            const start = new Date(inY, inM - 1, inD);
            const end = new Date(outY, outM - 1, outD);
            start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
            return targetTime >= start.getTime() && targetTime <= end.getTime();
        });

        return isBlocked;
    };

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const daysArray: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <div className="w-full">
            {/* Header do Calendário */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 rounded-full transition-all duration-300 group" aria-label="Mês anterior">
                    <ChevronLeft size={20} className="text-gray-600 group-hover:text-amber-700 transition-colors" />
                </button>
                <h4 className="font-bold text-gray-800 capitalize text-lg tracking-wide">
                    {monthNames[month]} {year}
                </h4>
                <button onClick={nextMonth} className="p-2 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 rounded-full transition-all duration-300 group" aria-label="Próximo mês">
                    <ChevronRight size={20} className="text-gray-600 group-hover:text-amber-700 transition-colors" />
                </button>
            </div>

            {/* Grid Dias da Semana */}
            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                    <div key={i} className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Grid Dias */}
            <div className="grid grid-cols-7 gap-2">
                {daysArray.map((date, idx) => {
                    if (!date) return <div key={idx} className="aspect-square"></div>;

                    const isOccupied = isDateOccupied(date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                    return (
                        <div
                            key={idx}
                            className={`
                        aspect-square flex items-center justify-center rounded-xl text-sm font-semibold relative transition-all duration-300
                        ${isOccupied
                                    ? 'bg-gradient-to-br from-red-100 to-rose-100 text-red-500 cursor-not-allowed shadow-sm'
                                    : isPast
                                        ? 'text-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700 hover:from-emerald-100 hover:to-teal-100 cursor-pointer hover:scale-110 hover:shadow-lg font-bold'
                                } 
                        ${isToday ? 'ring-2 ring-amber-400 ring-offset-2 shadow-xl' : ''}
                     `}
                            title={isOccupied ? "Ocupado" : (isPast ? "Passado" : "Disponível")}
                        >
                            {date.getDate()}
                            {isOccupied && <XCircle size={10} className="absolute top-1 right-1 opacity-60" />}
                        </div>
                    );
                })}
            </div>

            {/* Legenda Premium */}
            <div className="flex justify-center gap-6 mt-6 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 shadow-sm"></div>
                    Disponível
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-lg bg-gradient-to-br from-red-100 to-rose-100 border border-red-200 shadow-sm"></div>
                    Ocupado
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
const LandingPageLili2: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>('quarto');
    const [reviews, setReviews] = useState<GuestReview[]>([]);
    const [scrollY, setScrollY] = useState(0);

    // Parallax effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prev => (prev === 1 ? 0 : 1));
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        getGuestReviews(3).then(data => {
            if (data.length > 0) {
                setReviews(data);
            } else {
                setReviews([
                    { name: "Joana S.", text: "Um lugar incrível! Extremamente limpo, organizado e com uma localização perfeita. A Lili foi muito atenciosa. Voltarei com certeza!" },
                    { name: "Ricardo F.", text: "O flat é exatamente como nas fotos. Muito bem equipado, não faltou nada. O processo de check-in foi super fácil." },
                    { name: "Mariana L.", text: "Silencioso, confortável e muito bonito. A TV com streaming foi um diferencial. Recomendo!" }
                ]);
            }
        });
    }, []);

    const toggleAccordion = (id: string) => {
        setOpenAccordion(prev => prev === id ? null : id);
    };

    return (
        <div className="font-sans bg-white text-gray-800 scroll-smooth overflow-x-hidden">

            {/* HEADER / NAV - Premium Glassmorphism */}
            <header className="bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-amber-100/20">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0">
                            <a href="#" className="text-3xl font-bold bg-gradient-to-r from-amber-700 via-amber-600 to-rose-600 bg-clip-text text-transparent font-heading tracking-tight flex items-center gap-2">
                                <Sparkles size={28} className="text-amber-600" />
                                Flat de Lili
                            </a>
                        </div>

                        {/* Menu Desktop */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-6">
                                <a href="#inicio" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50">Início</a>
                                <a href="#sobre" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50">O Flat</a>
                                <a href="#comodidades" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50">Comodidades</a>
                                <a href="#localizacao" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50">Localização</a>
                                <a href="#avaliacoes" className="text-gray-700 hover:text-amber-700 px-3 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-amber-50">Avaliações</a>
                                <a href="#calendario" className="bg-gradient-to-r from-amber-600 to-rose-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-md">
                                    Reservar Agora
                                </a>
                            </div>
                        </div>

                        {/* Menu Mobile Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-700 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-50 transition-all">
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Menu Mobile Panel */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden shadow-xl border-t border-amber-100 pb-4 animate-fadeIn bg-white/95 backdrop-blur-xl">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-amber-700 block px-4 py-3 rounded-lg text-base font-semibold transition-all">Início</a>
                                <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-amber-700 block px-4 py-3 rounded-lg text-base font-semibold transition-all">O Flat</a>
                                <a href="#comodidades" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-amber-700 block px-4 py-3 rounded-lg text-base font-semibold transition-all">Comodidades</a>
                                <a href="#localizacao" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-rose-50 hover:text-amber-700 block px-4 py-3 rounded-lg text-base font-semibold transition-all">Localização</a>
                                <a href="#calendario" onClick={() => setIsMobileMenuOpen(false)} className="bg-gradient-to-r from-amber-600 to-rose-600 text-white block px-4 py-3 rounded-full text-base font-bold hover:shadow-xl mt-2 text-center">Reservar Agora</a>
                            </div>
                        </div>
                    )}
                </nav>
            </header>

            {/* HERO SECTION - Cinematográfico com Parallax */}
            <section id="inicio" className="relative h-screen min-h-[700px] w-full overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
                {/* Background com Parallax */}
                <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                    {LANDING_HERO_SLIDES.map((img, index) => (
                        <div key={index} className={`absolute inset-0 transition-opacity duration-2000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}>
                            <img src={img} className="w-full h-full object-cover scale-110" alt="Flat de Lili" />
                        </div>
                    ))}
                </div>

                {/* Gradient Overlay Premium */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

                {/* Efeito de Brilho Sutil */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-rose-500/10"></div>

                {/* Conteúdo Central */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
                    {/* Badge Premium */}
                    <div className="mb-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 shadow-xl animate-fadeIn">
                        <Award size={18} className="text-amber-400" />
                        <span className="text-white/90 text-sm font-semibold tracking-wide">Experiência Premium em Petrolina</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white mb-6 drop-shadow-2xl tracking-tight animate-fadeIn leading-tight">
                        Flat de Lili
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/95 mb-10 max-w-3xl drop-shadow-lg animate-fadeIn leading-relaxed">
                        Seu refúgio de <span className="font-semibold text-amber-300">conforto sofisticado</span> e <span className="font-semibold text-rose-300">estilo único</span> no coração de Petrolina
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn">
                        <a href="#calendario" className="group bg-gradient-to-r from-amber-600 to-rose-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 shadow-xl">
                            Ver Disponibilidade
                            <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </a>
                        <a href="#sobre" className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all duration-300 border border-white/30 shadow-xl">
                            Conhecer o Espaço
                        </a>
                    </div>

                    {/* Stats Premium */}
                    <div className="mt-16 flex flex-wrap justify-center gap-8 animate-fadeIn">
                        <div className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <Star className="text-amber-400 fill-amber-400" size={20} />
                                <span className="text-3xl font-bold text-white">5.0</span>
                            </div>
                            <p className="text-white/70 text-sm font-medium">Avaliação</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <Heart className="text-rose-400 fill-rose-400" size={20} />
                                <span className="text-3xl font-bold text-white">100%</span>
                            </div>
                            <p className="text-white/70 text-sm font-medium">Recomendação</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center gap-2 justify-center mb-1">
                                <MapPin className="text-emerald-400" size={20} />
                                <span className="text-3xl font-bold text-white">Centro</span>
                            </div>
                            <p className="text-white/70 text-sm font-medium">Localização</p>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
                    <ChevronRight className="text-white/50 rotate-90" size={32} />
                </div>
            </section>

            {/* SOBRE O ESPAÇO & GALERIA - Design Premium */}
            <section id="sobre" className="py-24 sm:py-32 bg-gradient-to-br from-amber-50 via-white to-rose-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 rounded-full mb-4">
                            <Sparkles size={16} className="text-amber-700" />
                            <span className="text-amber-800 text-sm font-bold uppercase tracking-wider">Conheça</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-rose-800 bg-clip-text text-transparent mb-4">
                            O Flat
                        </h2>
                        <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed">
                            Um espaço pensado em <span className="font-semibold text-amber-700">cada detalhe</span> para o seu máximo conforto e conveniência
                        </p>
                    </div>

                    <div className="mb-20 max-w-5xl mx-auto">
                        <SimpleGallery images={LANDING_GALLERY_IMAGES} />
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-10 md:p-16 rounded-3xl shadow-2xl max-w-5xl mx-auto border border-amber-100 relative overflow-hidden">
                        {/* Decorative Corner */}
                        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-br-full"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-rose-500/10 to-transparent rounded-tl-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-1 h-12 bg-gradient-to-b from-amber-600 to-rose-600 rounded-full"></div>
                                <h3 className="text-3xl font-bold text-gray-900 font-heading">Sobre o espaço</h3>
                            </div>
                            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                                <p className="first-letter:text-5xl first-letter:font-bold first-letter:text-amber-700 first-letter:mr-2 first-letter:float-left">
                                    30 m² cheio de estilo, funcionalidade e economia. Um flat pequeno e fácil de organizar, que atende às suas necessidades. Quarto confortável com lençóis, alguns armários, arara, ar condicionado, TV e escrivaninha com teclado e mouse sem fio a sua disposição.
                                </p>
                                <p>
                                    Banheiro com box espaçoso, chuveiro com boa vazão, toalhas, shampoo, condicionador e sabonete. Sala de estar com TV 50", streaming Paramount, cafeteira, chás, jogos de tabuleiro e livros para você aproveitar.
                                </p>
                                <p className="pb-0">
                                    A cozinha é bem equipada com tudo que você precisa: louça, talheres, panelas, purificador de água, microondas, liquidificador, sanduicheira, miniprocessador, etc. Na mini área de serviço, você encontrará produtos de limpeza, tanque de lavar roupa e varal retrátil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMODIDADES (ACORDEÃO) - Premium Design */}
            <section id="comodidades" className="py-24 sm:py-32 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #d97706 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 rounded-full mb-4">
                            <Award size={16} className="text-amber-700" />
                            <span className="text-amber-800 text-sm font-bold uppercase tracking-wider">Comodidades</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-rose-800 bg-clip-text text-transparent mb-4">
                            O que o espaço oferece
                        </h2>
                        <p className="text-xl text-gray-600 mt-4 max-w-3xl mx-auto">
                            Tudo o que você precisa para se sentir em casa
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto space-y-3">
                        <AccordionItem id="banheiro" title="Banheiro" icon={<div className="text-amber-700"><img width="24" height="24" src="https://img.icons8.com/ios/50/shower.png" alt="shower" style={{ filter: "sepia(100%) hue-rotate(350deg) saturate(500%)" }} /></div>} isOpen={openAccordion === 'banheiro'} onClick={() => toggleAccordion('banheiro')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Secador de cabelo</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Produtos de limpeza</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Xampu e Condicionador</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Sabonete para o corpo</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Água quente</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="quarto" title="Quarto e lavanderia" icon={<Wind className="text-amber-700" />} isOpen={openAccordion === 'quarto'} onClick={() => toggleAccordion('quarto')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Básico (Toalhas, lençóis, sabonete e papel higiênico)</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Cabides e Guarda-roupa</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Roupa de cama e Cobertores</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Blackout nas cortinas</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Ferro de passar e Varal</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="entretenimento" title="Entretenimento" icon={<Tv className="text-amber-700" />} isOpen={openAccordion === 'entretenimento'} onClick={() => toggleAccordion('entretenimento')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>HDTV 50" com Streaming</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Sistema de som</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Jogos de tabuleiro</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Livros e material de leitura</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Tapete de ioga</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="clima" title="Climatização" icon={<Wind className="text-amber-700" />} isOpen={openAccordion === 'clima'} onClick={() => toggleAccordion('clima')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Ar-condicionado split</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Ventiladores portáteis</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="cozinha" title="Cozinha e sala de jantar" icon={<Coffee className="text-amber-700" />} isOpen={openAccordion === 'cozinha'} onClick={() => toggleAccordion('cozinha')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Geladeira, Fogão e Microondas</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Air Fryer e Liquidificador</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Cafeteira e Sanduicheira</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Purificador de água</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Louças e talheres completos</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="office" title="Internet e escritório" icon={<Wifi className="text-amber-700" />} isOpen={openAccordion === 'office'} onClick={() => toggleAccordion('office')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Wi-Fi de alta velocidade</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Espaço de trabalho exclusivo (Escrivaninha)</li>
                            </ul>
                        </AccordionItem>

                        <AccordionItem id="seguranca" title="Segurança doméstica" icon={<Shield className="text-amber-700" />} isOpen={openAccordion === 'seguranca'} onClick={() => toggleAccordion('seguranca')}>
                            <ul className="list-none pl-0 text-gray-700 space-y-3">
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Câmeras de segurança nas áreas comuns</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Extintor de incêndio</li>
                                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500"></div>Kit de primeiros socorros</li>
                            </ul>
                        </AccordionItem>
                    </div>
                </div>
            </section>

            {/* LOCALIZAÇÃO E CALENDÁRIO - Premium Layout */}
            <section id="localizacao" className="py-24 sm:py-32 bg-gradient-to-br from-amber-50 via-white to-rose-50 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                        {/* Texto e Mapa */}
                        <div className="space-y-8">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 rounded-full mb-4">
                                    <MapPin size={16} className="text-amber-700" />
                                    <span className="text-amber-800 text-sm font-bold uppercase tracking-wider">Localização</span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-heading font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-rose-800 bg-clip-text text-transparent mb-6">
                                    Localização Perfeita
                                </h2>
                                <p className="text-xl text-gray-700 leading-relaxed">
                                    Encontre-nos no <span className="font-semibold text-amber-700">coração de Petrolina</span>, com fácil acesso aos melhores pontos da cidade.
                                </p>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-amber-100">
                                <div className="flex items-start text-gray-800 gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                        <MapPin className="text-white" size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">Endereço</p>
                                        <span className="notranslate text-gray-700">{FLAT_ADDRESS}</span>
                                    </div>
                                </div>
                            </div>

                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FLAT_ADDRESS)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-rose-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all duration-300 shadow-lg hover:scale-105">
                                <MapPin size={20} />
                                Abrir no Google Maps
                            </a>
                        </div>

                        {/* CALENDÁRIO PREMIUM */}
                        <div id="calendario" className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-amber-100 scroll-mt-24 relative overflow-hidden">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full"></div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center font-heading">Verificar Disponibilidade</h3>
                                <AvailabilityCalendar />
                                <div className="mt-8">
                                    <a href="https://wa.me/558788342138?text=Ol%C3%A1%20Lili%21%20Gostaria%20de%20saber%20mais%20sobre%20a%20disponibilidade%20do%20Flat." className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 hover:scale-105">
                                        <Phone size={22} />
                                        Falar com a Lili no WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* AVALIAÇÕES - Premium Cards */}
            <section id="avaliacoes" className="py-24 sm:py-32 bg-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #e11d48 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-rose-100 px-4 py-2 rounded-full mb-4">
                            <Heart size={16} className="text-rose-700" />
                            <span className="text-amber-800 text-sm font-bold uppercase tracking-wider">Depoimentos</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold bg-gradient-to-r from-amber-900 via-amber-800 to-rose-800 bg-clip-text text-transparent mb-4">
                            O que nossos hóspedes dizem
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {reviews.map((review, idx) => (
                            <ReviewCard key={review.id || idx} name={review.name} text={review.text} />
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER - Premium */}
            <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-400 py-12 text-center border-t border-gray-800 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-rose-600/5 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles size={20} className="text-amber-500" />
                        <p className="text-lg font-semibold text-gray-200">Flat de Lili</p>
                    </div>
                    <p className="text-gray-400">© 2025 Flat de Lili. Todos os direitos reservados.</p>
                    <p className="text-xs mt-3 opacity-60 max-w-md mx-auto">
                        Nós respeitamos sua privacidade. Seus dados são utilizados apenas para a gestão da sua reserva e nunca compartilhados.
                    </p>
                </div>
            </footer>

            {/* BOTÃO FLUTUANTE WHATSAPP - Premium */}
            <a href="https://wa.me/558788342138" target="_blank" rel="noreferrer" className="fixed bottom-8 right-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 rounded-full shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 z-50 group animate-pulse hover:animate-none border-4 border-white">
                <Phone size={28} className="group-hover:rotate-12 transition-transform" />
            </a>
        </div>
    );
};

// --- SUB-COMPONENTES AUXILIARES ---

interface AccordionItemProps {
    id?: string;
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem = ({ title, icon, isOpen, onClick, children }: AccordionItemProps) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300">
        <button onClick={onClick} className="flex justify-between items-center w-full px-8 py-6 text-left hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-rose-50/50 transition-all duration-300 group">
            <span className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    {icon}
                </div>
                <span className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{title}</span>
            </span>
            <ChevronLeft className={`transition-all duration-500 ${isOpen ? '-rotate-90 text-amber-700' : '-rotate-180 text-gray-400'}`} size={24} />
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="px-8 pb-6 pl-24">
                {children}
            </div>
        </div>
    </div>
);

const ReviewCard: React.FC<{ name: string, text: string }> = ({ name, text }) => (
    <div className="bg-gradient-to-br from-amber-50 via-white to-rose-50 p-8 rounded-2xl shadow-xl border border-amber-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden group">
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-200/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

        <div className="relative z-10">
            <div className="flex text-amber-500 mb-5 gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="currentColor" className="drop-shadow" />)}
            </div>
            <p className="text-gray-700 italic mb-6 text-base leading-relaxed">"{text}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold shadow-lg">
                    {name.charAt(0)}
                </div>
                <p className="text-gray-900 font-bold">— {name}</p>
            </div>
        </div>
    </div>
);

export default LandingPageLili2;
