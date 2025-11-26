import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, ChevronLeft, ChevronRight, XCircle, Wifi, Tv, Coffee, Wind, Shield, Menu, X } from 'lucide-react';
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

    // 1. Checa Reservas
    const isReserved = reservations.some(res => {
       if (!res.checkInDate || !res.checkoutDate || res.status === 'cancelled') return false;
       const [inY, inM, inD] = res.checkInDate.split('-').map(Number);
       const [outY, outM, outD] = res.checkoutDate.split('-').map(Number);
       const start = new Date(inY, inM - 1, inD);
       const end = new Date(outY, outM - 1, outD);
       start.setHours(0,0,0,0); end.setHours(0,0,0,0);
       return targetTime >= start.getTime() && targetTime < end.getTime();
    });

    if (isReserved) return true;

    // 2. Checa Bloqueios Administrativos
    const isBlocked = blockedDates.some(block => {
       if (!block.startDate || !block.endDate) return false;
       const [inY, inM, inD] = block.startDate.split('-').map(Number);
       const [outY, outM, outD] = block.endDate.split('-').map(Number);
       const start = new Date(inY, inM - 1, inD);
       const end = new Date(outY, outM - 1, outD);
       start.setHours(0,0,0,0); end.setHours(0,0,0,0);
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
  const daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronLeft size={20} /></button>
        <h3 className="text-lg font-bold text-gray-800 capitalize">{monthNames[month]} {year}</h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full text-gray-600"><ChevronRight size={20} /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => <span key={d} className="text-xs font-bold text-gray-400 uppercase">{d}</span>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysArray.map((date, idx) => {
          if (!date) return <div key={idx} className="aspect-square"></div>;
          const isOccupied = isDateOccupied(date);
          const isToday = date.toDateString() === new Date().toDateString();
          const isPast = date < new Date(new Date().setHours(0,0,0,0));
          return (
            <div key={idx} className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium relative transition-all ${isOccupied ? 'bg-red-100 text-red-400 cursor-not-allowed' : isPast ? 'text-gray-300 cursor-not-allowed' : 'bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer hover:scale-105 font-bold'} ${isToday ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`} title={isOccupied ? "Ocupado" : (isPast ? "Passado" : "Disponível")}>
              {date.getDate()}
              {isOccupied && <XCircle size={12} className="absolute top-0.5 right-0.5 opacity-50" />}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-4 mt-4 text-xs font-medium text-gray-500">
         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Disponível</div>
         <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Ocupado</div>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const LandingPageLili: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('quarto');
  const [reviews, setReviews] = useState<GuestReview[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev === 1 ? 0 : 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getGuestReviews(3).then(data => {
        if(data.length > 0) {
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
    <div className="font-sans bg-white text-gray-800 scroll-smooth">
       
       {/* HEADER / NAV */}
       <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                  <div className="flex-shrink-0">
                      <a href="#" className="text-2xl font-bold text-amber-700 font-heading">Flat de Lili</a>
                  </div>
                  
                  {/* Menu Desktop */}
                  <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                          <a href="#inicio" className="text-gray-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Início</a>
                          <a href="#sobre" className="text-gray-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">O Flat</a>
                          <a href="#comodidades" className="text-gray-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Comodidades</a>
                          <a href="#localizacao" className="text-gray-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Localização</a>
                          <a href="#avaliacoes" className="text-gray-600 hover:text-amber-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Avaliações</a>
                          <a href="#calendario" className="bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-800 transition duration-300 shadow-md">Reservar Agora</a>
                      </div>
                  </div>

                  {/* Menu Mobile Button */}
                  <div className="md:hidden">
                      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-amber-700 p-2 rounded-md">
                          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                      </button>
                  </div>
              </div>

              {/* Menu Mobile Panel */}
              {isMobileMenuOpen && (
                  <div className="md:hidden shadow-lg border-t border-gray-200 pb-4 animate-fadeIn">
                      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                          <a href="#inicio" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:bg-amber-50 hover:text-amber-700 block px-3 py-2 rounded-md text-base font-medium">Início</a>
                          <a href="#sobre" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:bg-amber-50 hover:text-amber-700 block px-3 py-2 rounded-md text-base font-medium">O Flat</a>
                          <a href="#comodidades" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:bg-amber-50 hover:text-amber-700 block px-3 py-2 rounded-md text-base font-medium">Comodidades</a>
                          <a href="#localizacao" onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 hover:bg-amber-50 hover:text-amber-700 block px-3 py-2 rounded-md text-base font-medium">Localização</a>
                          <a href="#calendario" onClick={() => setIsMobileMenuOpen(false)} className="bg-amber-700 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-amber-800 mt-2">Reservar Agora</a>
                      </div>
                  </div>
              )}
          </nav>
       </header>

       {/* HERO SECTION */}
       <section id="inicio" className="relative h-[60vh] min-h-[500px] w-full overflow-hidden bg-gray-900">
          {LANDING_HERO_SLIDES.map((img, index) => (
             <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'}`}>
                <img src={img} className="w-full h-full object-cover opacity-60" alt="Flat de Lili" />
             </div>
          ))}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
             <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">Flat de Lili</h1>
             <p className="text-lg sm:text-xl md:text-2xl font-light text-white/90 mb-8 max-w-2xl drop-shadow-md">Seu refúgio de conforto e estilo no coração de Petrolina.</p>
             
             <a href="#calendario" className="bg-amber-700 text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-amber-800 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105">
                Ver Disponibilidade e Reservar
             </a>
          </div>
       </section>

       {/* SOBRE O ESPAÇO & GALERIA */}
       <section id="sobre" className="py-16 sm:py-24 bg-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-amber-900">Conheça o Flat</h2>
                <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Um espaço pensado em cada detalhe para o seu máximo conforto e conveniência.</p>
             </div>

             <div className="mb-16 max-w-4xl mx-auto">
                <SimpleGallery images={LANDING_GALLERY_IMAGES} />
             </div>

             <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-4xl mx-auto border-t-4 border-amber-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Sobre o espaço</h3>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                   <p>30 m² cheio de estilo, funcionalidade e economia. Um flat pequeno e fácil de organizar, que atende às suas necessidades. Quarto confortável com lençóis, alguns armários, arara, ar condicionado, TV e escrivaninha com teclado e mouse sem fio a sua disposição. Banheiro com box espaçoso, chuveiro com boa vazão, toalhas, shampoo, condicionador e sabonete. Sala de estar com TV 50", streaming Paramount, cafeteira, chás, jogos de tabuleiro e livros para você aproveitar.</p>
                   <p>A cozinha é bem equipada com tudo que você precisa: louça, talheres, panelas, purificador de água, microondas, liquidificador, sanduicheira, miniprocessador, etc. Na mini área de serviço, você encontrará produtos de limpeza, tanque de lavar roupa e varal retrátil.</p>
                </div>
             </div>
          </div>
       </section>

       {/* COMODIDADES (ACORDEÃO) */}
       <section id="comodidades" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-amber-900">O que o espaço oferece</h2>
                <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">Tudo o que você precisa para se sentir em casa.</p>
             </div>

             <div className="max-w-3xl mx-auto space-y-2">
                <AccordionItem id="banheiro" title="Banheiro" icon={<div className="text-amber-700"><img width="24" height="24" src="https://img.icons8.com/ios/50/shower.png" alt="shower" style={{filter: "sepia(100%) hue-rotate(350deg) saturate(500%)"}}/></div>} isOpen={openAccordion === 'banheiro'} onClick={() => toggleAccordion('banheiro')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Secador de cabelo</li>
                       <li>Produtos de limpeza</li>
                       <li>Xampu e Condicionador</li>
                       <li>Sabonete para o corpo</li>
                       <li>Água quente</li>
                    </ul>
                </AccordionItem>
                
                <AccordionItem id="quarto" title="Quarto e lavanderia" icon={<Wind className="text-amber-700" />} isOpen={openAccordion === 'quarto'} onClick={() => toggleAccordion('quarto')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Básico (Toalhas, lençóis, sabonete e papel higiênico)</li>
                       <li>Cabides e Guarda-roupa</li>
                       <li>Roupa de cama e Cobertores</li>
                       <li>Blackout nas cortinas</li>
                       <li>Ferro de passar e Varal</li>
                    </ul>
                </AccordionItem>

                <AccordionItem id="entretenimento" title="Entretenimento" icon={<Tv className="text-amber-700" />} isOpen={openAccordion === 'entretenimento'} onClick={() => toggleAccordion('entretenimento')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>HDTV 50" com Streaming</li>
                       <li>Sistema de som</li>
                       <li>Jogos de tabuleiro</li>
                       <li>Livros e material de leitura</li>
                       <li>Tapete de ioga</li>
                    </ul>
                </AccordionItem>

                <AccordionItem id="clima" title="Climatização" icon={<Wind className="text-amber-700" />} isOpen={openAccordion === 'clima'} onClick={() => toggleAccordion('clima')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Ar-condicionado split</li>
                       <li>Ventiladores portáteis</li>
                    </ul>
                </AccordionItem>

                <AccordionItem id="cozinha" title="Cozinha e sala de jantar" icon={<Coffee className="text-amber-700" />} isOpen={openAccordion === 'cozinha'} onClick={() => toggleAccordion('cozinha')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Geladeira, Fogão e Microondas</li>
                       <li>Air Fryer e Liquidificador</li>
                       <li>Cafeteira e Sanduicheira</li>
                       <li>Purificador de água</li>
                       <li>Louças e talheres completos</li>
                    </ul>
                </AccordionItem>

                <AccordionItem id="office" title="Internet e escritório" icon={<Wifi className="text-amber-700" />} isOpen={openAccordion === 'office'} onClick={() => toggleAccordion('office')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Wi-Fi de alta velocidade</li>
                       <li>Espaço de trabalho exclusivo (Escrivaninha)</li>
                    </ul>
                </AccordionItem>

                <AccordionItem id="seguranca" title="Segurança doméstica" icon={<Shield className="text-amber-700" />} isOpen={openAccordion === 'seguranca'} onClick={() => toggleAccordion('seguranca')}>
                    <ul className="list-disc list-inside pl-4 text-gray-700 space-y-2">
                       <li>Câmeras de segurança nas áreas comuns</li>
                       <li>Extintor de incêndio</li>
                       <li>Kit de primeiros socorros</li>
                    </ul>
                </AccordionItem>
             </div>
          </div>
       </section>

       {/* LOCALIZAÇÃO E CALENDÁRIO */}
       <section id="localizacao" className="py-16 sm:py-24 bg-amber-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                
                {/* Texto e Mapa */}
                <div>
                   <h2 className="text-3xl sm:text-4xl font-heading font-bold text-amber-900 mb-6">Localização Perfeita</h2>
                   <p className="text-lg text-gray-700 mb-4">Encontre-nos no coração de Petrolina, com fácil acesso aos melhores pontos da cidade.</p>
                   <div className="flex items-start text-gray-800 mb-6 bg-white p-4 rounded-lg shadow-sm">
                      <MapPin className="h-6 w-6 text-amber-700 mr-3 flex-shrink-0 mt-1" />
                      <span className="notranslate">{FLAT_ADDRESS}</span>
                   </div>
                   <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(FLAT_ADDRESS)}`} target="_blank" rel="noopener noreferrer" className="inline-block bg-amber-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-800 transition duration-300 shadow-md">
                      Abrir no Google Maps
                   </a>
                </div>

                {/* CALENDÁRIO INTELIGENTE */}
                <div id="calendario" className="bg-white p-6 rounded-2xl shadow-lg border border-amber-100 scroll-mt-24">
                   <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Verificar Disponibilidade</h3>
                   <AvailabilityCalendar />
                   <div className="mt-6 text-center">
                      <a href="https://wa.me/558788342138?text=Ol%C3%A1%20Lili%21%20Gostaria%20de%20saber%20mais%20sobre%20a%20disponibilidade%20do%20Flat." className="inline-block w-full bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-md flex items-center justify-center gap-2">
                         <Phone size={20} /> Falar com a Lili no WhatsApp
                      </a>
                   </div>
                </div>

             </div>
          </div>
       </section>

       {/* AVALIAÇÕES (DINÂMICAS) */}
       <section id="avaliacoes" className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4">
             <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-amber-900">O que nossos hóspedes dizem</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, idx) => (
                    <ReviewCard key={review.id || idx} name={review.name} text={review.text} />
                ))}
             </div>
          </div>
       </section>

       {/* FOOTER */}
       <footer className="bg-gray-900 text-gray-400 py-8 text-center border-t border-gray-800">
          <p>© 2025 Flat de Lili. Todos os direitos reservados.</p>
          <p className="text-xs mt-2 opacity-60">
             Nós respeitamos sua privacidade. Seus dados são utilizados apenas para a gestão da sua reserva e nunca compartilhados.
          </p>
       </footer>

       {/* BOTÃO FLUTUANTE WHATSAPP */}
       <a href="https://wa.me/558788342138" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition duration-300 z-50 hover:scale-110">
          <Phone size={24} />
       </a>
    </div>
  );
};

// --- SUB-COMPONENTES AUXILIARES ---

const AccordionItem = ({ title, icon, isOpen, onClick, children }: any) => (
  <div className="border-b border-gray-200">
     <button onClick={onClick} className="flex justify-between items-center w-full py-5 text-left text-xl font-semibold text-gray-800 hover:text-amber-700 transition-colors">
        <span className="flex items-center gap-3">
           {icon} {title}
        </span>
        <ChevronLeft className={`transition-transform duration-300 ${isOpen ? '-rotate-90' : '-rotate-180 text-gray-400'}`} />
     </button>
     <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pb-5 pl-4">
           {children}
        </div>
     </div>
  </div>
);

const ReviewCard: React.FC<{ name: string, text: string }> = ({ name, text }) => (
  <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-100">
     <div className="flex text-amber-500 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
     </div>
     <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">"{text}"</p>
     <p className="text-gray-900 font-bold text-sm">- {name}</p>
  </div>
);

export default LandingPageLili;