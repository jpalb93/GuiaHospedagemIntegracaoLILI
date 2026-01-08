import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
// GSAP dynamically imported

const PHOTOS = [
    '/assets/gallery/gallery-1.webp',
    '/assets/gallery/gallery-2.webp',
    '/assets/gallery/gallery-3.webp',
    '/assets/gallery/gallery-4.webp',
    '/assets/gallery/gallery-5.webp', // Corpoartivo
    '/assets/gallery/gallery-6.webp',
    '/assets/gallery/gallery-7.webp',
    '/assets/gallery/gallery-3.webp', // Repeat for grid balance
];

const GallerySection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const openLightbox = (img: string) => setSelectedImage(img);
    const closeLightbox = () => setSelectedImage(null);

    useEffect(() => {
        let ctx: any;
        let mm: any;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger')
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
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
                }, sectionRef);
            });

            mm.add('(max-width: 800px)', () => {
                if (sectionRef.current) {
                    const headers = sectionRef.current.querySelectorAll('.gallery-header');
                    const items = sectionRef.current.querySelectorAll('.gallery-item');
                    headers.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                    items.forEach((el) => { (el as HTMLElement).style.opacity = '1'; (el as HTMLElement).style.transform = 'translateY(0)'; });
                }
            });
        };

        const timer = setTimeout(() => {
            initGsap();
        }, 100);

        return () => {
            clearTimeout(timer);
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="galeria"
            className="py-0 bg-stone-950 border-b border-stone-900"
        >
            {/* Header com padding, mas galeria sangrada */}
            <div className="container mx-auto px-8 pt-32 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="gallery-header">
                    <span className="text-stone-400 font-bold tracking-widest uppercase text-xs mb-4 block">
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
                        <button
                            key={index}
                            onClick={() => openLightbox(photo)}
                            aria-label={`Ver foto ampliada do ambiente ${index + 1}`}
                            className="gallery-item aspect-[3/4] group relative overflow-hidden bg-stone-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-800"
                        >
                            <img
                                src={photo}
                                alt={`Ambiente da hospedagem ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter hover:contrast-110 opacity-90 group-hover:opacity-100"
                                loading="lazy"
                            />
                            {/* Overlay sutil apenas no hover para indicar interatividade */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/98 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-sm"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Visualização de imagem"
                >
                    <button
                        onClick={closeLightbox}
                        aria-label="Fechar galeria"
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-full"
                    >
                        <X size={40} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Foto do ambiente em tamanho ampliado"
                        className="max-w-full max-h-[90vh] object-contain shadow-2xl animate-scaleIn border border-stone-800 rounded-md"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default GallerySection;
