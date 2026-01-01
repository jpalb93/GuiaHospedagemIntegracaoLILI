import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PHOTOS = [
    'https://i.postimg.cc/W4TFSxSR/305095874.jpg',
    'https://i.postimg.cc/5tbYpDp1/305095888.jpg',
    'https://i.postimg.cc/1zsnMbBJ/334290310.jpg',
    'https://i.postimg.cc/9QGwdcP3/334290394.jpg',
    'https://i.postimg.cc/tgpZD8kK/334291651.jpg',
    'https://i.postimg.cc/YSMG8TRP/334291852.jpg',
    'https://i.postimg.cc/wBgyFn2w/334715657.jpg',
    'https://i.postimg.cc/1zsnMbBJ/334290310.jpg',
];

const GallerySection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const openLightbox = (img: string) => setSelectedImage(img);
    const closeLightbox = () => setSelectedImage(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });

            tl.fromTo(
                '.gallery-header',
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out',
                }
            ).fromTo(
                '.gallery-item',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=0.4'
            );
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="galeria"
            className="py-0 bg-stone-950 border-b border-stone-900"
        >
            {/* Header com padding, mas galeria sangrada */}
            <div className="container mx-auto px-8 pt-32 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="gallery-header">
                    <span className="text-stone-500 font-bold tracking-widest uppercase text-xs mb-4 block">
                        TOUR VISUAL
                    </span>
                    <h2 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter">
                        AMBIENTES
                    </h2>
                </div>
                <div className="gallery-header">
                    <p className="text-stone-400 max-w-sm text-right text-lg">
                        Cada detalhe pensado para o seu bem-estar.
                    </p>
                </div>
            </div>

            {/* Grid Otimizado para Fotos Verticais */}
            <div className="container mx-auto px-4 md:px-8 pb-20">
                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PHOTOS.map((photo, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(photo)}
                            className="gallery-item aspect-[3/4] group relative overflow-hidden cursor-pointer bg-stone-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-800"
                        >
                            <img
                                src={photo}
                                alt={`Ambiente da hospedagem ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter hover:contrast-110 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                            />
                            {/* Overlay sutil apenas no hover para indicar interatividade */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/98 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2"
                    >
                        <X size={40} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoom"
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-scaleIn border border-stone-800 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default GallerySection;
