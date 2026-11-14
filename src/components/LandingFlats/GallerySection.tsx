import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

const PHOTOS = [
    '/assets/gallery/gallery-1.webp',
    '/assets/gallery/gallery-2.webp',
    '/assets/gallery/gallery-3.webp',
    '/assets/gallery/gallery-4.webp',
    '/assets/gallery/gallery-5.webp',
    '/assets/gallery/gallery-6.webp',
    '/assets/gallery/gallery-7.webp',
];

const GallerySection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    const openLightbox = (img: string) => setSelectedImage(img);
    const closeLightbox = () => setSelectedImage(null);

    useEffect(() => {
        let ctx: { revert: () => void } | undefined;
        let mm: { add: (query: string, func: () => void) => void; revert: () => void } | undefined;

        const initGsap = async () => {
            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();

            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
                    gsap.from('.gallery-item', {
                        y: 14,
                        duration: 0.45,
                        stagger: 0.04,
                        ease: 'power2.out',
                        clearProps: 'transform',
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: 'top 95%',
                            toggleActions: 'play none none none',
                        },
                    });
                }, sectionRef);
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
            className="pb-20 md:pb-28 pt-6 md:pt-8 bg-[#F5F2EB] text-[#181614]"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12">
                <div className="border-t border-[#E5E0D5] pt-16 pb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="gallery-header">
                        <span className="text-[#9E6B2B] font-semibold tracking-[0.18em] uppercase text-xs mb-3 block">
                            Tour visual
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#181614] tracking-tight">
                            Ambientes da hospedagem
                        </h2>
                    </div>
                    <div className="gallery-header">
                        <p className="text-[#5C564E] max-w-sm md:text-right text-base md:text-lg leading-relaxed">
                            Flats mobiliados no Centro de Petrolina: cozinha, quarto e estar.
                        </p>
                    </div>
                </div>

                {/* Grid Arquitetônico Curado (7 fotos únicas, sem repetição) */}
                <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-12 gap-4">
                    {PHOTOS.map((photo, index) => {
                        const spanClass =
                            index === 0
                                ? 'col-span-2 md:col-span-6 aspect-[16/10] md:aspect-auto md:h-[380px]'
                                : index <= 2
                                  ? 'col-span-1 md:col-span-3 aspect-[3/4] md:aspect-auto md:h-[380px]'
                                  : 'col-span-1 md:col-span-3 aspect-[3/4]';

                        return (
                            <button
                                key={photo}
                                type="button"
                                onClick={() => openLightbox(photo)}
                                aria-label={`Ver foto ampliada do ambiente ${index + 1}`}
                                className={`gallery-item ${spanClass} group relative overflow-hidden bg-[#E5E0D5] rounded-2xl transition-all duration-300 border border-[#DFD9CC] hover:border-[#9E6B2B]/50 shadow-sm`}
                            >
                                <img
                                    src={photo}
                                    alt={`Hospedagem em Petrolina: ambiente do flat ${index + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                    width="600"
                                    height="800"
                                />
                                <div className="absolute inset-0 bg-[#12110F]/0 group-hover:bg-[#12110F]/15 transition-colors duration-300" />
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[120] bg-[#12110F]/95 flex items-center justify-center p-4 animate-fadeIn backdrop-blur-md"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Visualização da hospedagem em Petrolina"
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        aria-label="Fechar galeria"
                        className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-[#E5C98B] text-white hover:text-[#141210] transition-colors flex items-center justify-center"
                    >
                        <X size={22} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Foto do ambiente em tamanho ampliado"
                        className="max-w-full max-h-[88vh] object-contain shadow-2xl animate-scaleIn border border-white/10 rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default GallerySection;
