import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface SimpleGalleryProps {
  images: string[];
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({ images }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // --- LIGHTBOX STATE ---
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // --- 1. AUTO-PLAY (FOTOS MUDAM SOZINHAS) ---
  // Pausa o autoplay se o lightbox estiver aberto
  useEffect(() => {
    if (!images || images.length === 0 || isLightboxOpen) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { current } = scrollRef;
        const isLastSlide = activeIndex === images.length - 1;

        if (isLastSlide) {
          current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          current.scrollBy({ left: current.clientWidth, behavior: 'smooth' });
        }
      }
    }, 4000); // Muda a cada 4 segundos

    return () => clearInterval(interval);
  }, [activeIndex, images, isLightboxOpen]);

  // --- FUNÇÕES DE CONTROLE ---
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth;

      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
      setActiveIndex(index);
    }
  };

  // --- LIGHTBOX FUNCTIONS ---
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* ESTILO PARA ESCONDER A BARRA DE ROLAGEM */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
              display: none;
          }
          .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
          }
        `}
      </style>

      {/* --- GALERIA PRINCIPAL --- */}
      <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 bg-gray-900 mb-8">

        {/* --- BOTÕES --- */}

        {/* Botão Esquerda */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all ${activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Foto anterior"
        >
          <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Botão Direita */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full backdrop-blur-md transition-all ${activeIndex === images.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          aria-label="Próxima foto"
        >
          <ChevronRight size={20} className="sm:w-6 sm:h-6" />
        </button>

        {/* Container das Imagens */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full aspect-[16/9] sm:aspect-[21/9]"
        >
          {images.map((src, idx) => (
            <div key={idx} className="min-w-full snap-center relative h-full">
              <div
                className="w-full h-full overflow-hidden cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <img
                  src={src}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Indicadores (Bolinhas) */}
        <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ left: idx * scrollRef.current.clientWidth, behavior: 'smooth' })
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === activeIndex ? 'bg-white w-6' : 'bg-white/40 w-1.5'}`}
              aria-label={`Ir para foto ${idx + 1}`}
            />
          ))}
        </div>

        {/* Contador no canto */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10 z-20 pointer-events-none">
          <ImageIcon size={12} /> {activeIndex + 1} / {images.length}
        </div>

        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white text-xxs font-bold px-2 py-1 rounded-full border border-white/10 z-20 pointer-events-none">
          Clique para ampliar
        </div>
      </div>

      {/* --- LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
          >
            <ChevronRight className="rotate-45" size={40} />
          </button>

          <button
            onClick={prevLightboxImage}
            className="absolute left-4 sm:left-8 p-4 text-white/70 hover:text-white transition-all hover:scale-110"
          >
            <ChevronLeft size={40} />
          </button>

          <div
            className="max-w-7xl max-h-[85vh] p-2 relative"
            onClick={e => e.stopPropagation()} // Impede fechar ao clicar na imagem
          >
            <img
              src={images[lightboxIndex]}
              alt="Fullscreen"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          <button
            onClick={nextLightboxImage}
            className="absolute right-4 sm:right-8 p-4 text-white/70 hover:text-white transition-all hover:scale-110"
          >
            <ChevronRight size={40} />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium">
            {lightboxIndex + 1} de {images.length}
          </div>
        </div>
      )}
    </>
  );
};

export default SimpleGallery;