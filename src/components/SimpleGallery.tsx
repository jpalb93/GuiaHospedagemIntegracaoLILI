import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface SimpleGalleryProps {
    images: string[];
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({ images }) => {
    // --- LIGHTBOX STATE ---
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

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
            {/* --- MASONRY GRID GALLERY --- */}
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {images.map((src, idx) => (
                    <div
                        key={idx}
                        className="break-inside-avoid relative group overflow-hidden rounded-lg cursor-pointer bg-stone-900"
                        onClick={() => openLightbox(idx)}
                    >
                        <img
                            src={src}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Maximize2 className="text-white drop-shadow-md" size={32} />
                        </div>
                    </div>
                ))}
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
                        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar na imagem
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
