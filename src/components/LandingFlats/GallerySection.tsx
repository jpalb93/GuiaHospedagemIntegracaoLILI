import React, { useState, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, Expand, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useDesktopGsap } from '../../hooks/useDesktopGsap';
import { useDialogAccessibility } from '../../hooks/useDialogAccessibility';

type RoomCategory = 'todos' | 'cozinha' | 'quarto' | 'banheiro';

interface GalleryPhoto {
    src: string;
    title: string;
    subtitle: string;
    category: Exclude<RoomCategory, 'todos'>;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
    {
        src: '/assets/gallery/gallery-1.webp',
        title: 'Cozinha e área de estar integradas',
        subtitle: 'Ambiente amplo com pia inox, frigobar, cooktop e sala de apoio.',
        category: 'cozinha',
    },
    {
        src: '/assets/gallery/gallery-2.webp',
        title: 'Cozinha completa equipada',
        subtitle: 'Micro-ondas, cafeteira, utensílios e frigobar para sua rotina.',
        category: 'cozinha',
    },
    {
        src: '/assets/gallery/gallery-4.webp',
        title: 'Quarto privativo com ar split',
        subtitle: 'Cama arrumada com enxoval completo para noites silenciosas.',
        category: 'quarto',
    },
    {
        src: '/assets/gallery/gallery-5.webp',
        title: 'Quarto e estação com Smart TV',
        subtitle: 'Bancada para trabalho remoto com Wi-Fi fibra e armário.',
        category: 'quarto',
    },
    {
        src: '/assets/gallery/gallery-3.webp',
        title: 'Banheiro privativo',
        subtitle: 'Box em vidro temperado, acabamento limpo e água quente.',
        category: 'banheiro',
    },
    {
        src: '/assets/gallery/gallery-6.webp',
        title: 'Copa e mesa para refeições',
        subtitle: 'Praticidade entre reuniões ou passeios pelo Centro.',
        category: 'cozinha',
    },
    {
        src: '/assets/gallery/gallery-7.webp',
        title: 'Bancada de trabalho e entretenimento',
        subtitle: 'Espaço organizado com Smart TV e apoio de cozinha.',
        category: 'cozinha',
    },
];

const CATEGORIES: { id: RoomCategory; label: string }[] = [
    { id: 'todos', label: 'Todos (07)' },
    { id: 'cozinha', label: 'Cozinha & Copa' },
    { id: 'quarto', label: 'Quarto & Trabalho' },
    { id: 'banheiro', label: 'Banheiro' },
];

const GallerySection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<RoomCategory>('todos');
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const lightboxRef = useRef<HTMLDivElement>(null);
    const touchStartXRef = useRef<number | null>(null);

    const filteredPhotos = useMemo(
        () =>
            activeCategory === 'todos'
                ? GALLERY_PHOTOS
                : GALLERY_PHOTOS.filter((item) => item.category === activeCategory),
        [activeCategory]
    );

    const currentPhoto = filteredPhotos[activeIndex] ?? filteredPhotos[0];
    const currentGlobalIndex = GALLERY_PHOTOS.findIndex((p) => p.src === currentPhoto.src);

    const handleCategoryChange = (cat: RoomCategory) => {
        setActiveCategory(cat);
        setActiveIndex(0);
    };

    const closeLightbox = useCallback(() => setLightboxIndex(null), []);
    const showPrevLightbox = useCallback(
        () =>
            setLightboxIndex((prev) =>
                prev === null ? null : (prev - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length
            ),
        []
    );
    const showNextLightbox = useCallback(
        () =>
            setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % GALLERY_PHOTOS.length)),
        []
    );

    useDialogAccessibility({
        isOpen: lightboxIndex !== null,
        dialogRef: lightboxRef,
        onClose: closeLightbox,
        onPrev: showPrevLightbox,
        onNext: showNextLightbox,
    });

    useDesktopGsap(sectionRef, (gsap) => {
        gsap.from('.gallery-stage-reveal', {
            y: 16,
            duration: 0.55,
            stagger: 0.06,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 92%',
                toggleActions: 'play none none none',
            },
        });
    });

    return (
        <section
            ref={sectionRef}
            id="galeria"
            className="pb-24 md:pb-32 pt-6 md:pt-8 bg-[#F5F2EB] text-[#181614]"
        >
            <div className="max-w-[1320px] mx-auto px-6 md:px-12 space-y-8 md:space-y-10">
                {/* Cabeçalho + Seletor de Ambientes */}
                <div className="border-t border-[#E5E0D5] pt-16 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="gallery-stage-reveal space-y-2">
                        <span className="text-[#9E6B2B] font-semibold tracking-[0.18em] uppercase text-xs block">
                            Tour visual interativo
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-semibold text-[#181614] tracking-tight">
                            Ambientes da hospedagem
                        </h2>
                    </div>

                    <div
                        className="gallery-stage-reveal flex flex-wrap gap-2"
                        role="tablist"
                        aria-label="Filtrar ambientes do flat"
                    >
                        {CATEGORIES.map((cat) => {
                            const selected = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={selected}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                                        selected
                                            ? 'bg-[#141210] text-[#E5C98B] shadow-md'
                                            : 'bg-[#ECE7DC] text-[#5C564E] hover:bg-[#E2DBCD] hover:text-[#181614]'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Palco Showroom Assimétrico */}
                <div className="gallery-stage-reveal grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Vitrine Principal */}
                    <div className="lg:col-span-8 group relative rounded-[28px] overflow-hidden bg-[#141210] min-h-[340px] sm:min-h-[460px] lg:min-h-[540px] shadow-[0_24px_60px_rgba(18,17,15,0.16)] ring-1 ring-inset ring-white/10">
                        <img
                            key={currentPhoto.src}
                            src={currentPhoto.src}
                            alt={`Hospedagem em Petrolina: ${currentPhoto.title}`}
                            width={1200}
                            height={800}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12110F]/95 via-[#12110F]/25 to-transparent" />

                        {/* Contador topo esquerdo + setas rápidas */}
                        <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                            <span className="inline-flex items-center gap-2 rounded-full bg-[#12110F]/75 backdrop-blur-md border border-white/15 px-3.5 py-1.5 text-[11px] font-mono tracking-[0.18em] text-[#E5C98B] tabular-nums">
                                0{activeIndex + 1} / 0{filteredPhotos.length}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            (activeIndex - 1 + filteredPhotos.length) %
                                                filteredPhotos.length
                                        )
                                    }
                                    aria-label="Ambiente anterior"
                                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-[#12110F]/80 hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/15 md:backdrop-blur-md flex items-center justify-center transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex((activeIndex + 1) % filteredPhotos.length)
                                    }
                                    aria-label="Próximo ambiente"
                                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-full bg-[#12110F]/80 hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/15 md:backdrop-blur-md flex items-center justify-center transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Legenda editorial na base + botão expandir */}
                        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
                            <div className="space-y-1.5 max-w-lg">
                                <span
                                    aria-hidden="true"
                                    className="block h-px w-8 bg-[#E5C98B]/80 mb-2"
                                />
                                <h3 className="text-white text-2xl sm:text-3xl font-heading font-semibold tracking-tight">
                                    {currentPhoto.title}
                                </h3>
                                <p className="text-stone-200/90 text-sm sm:text-base leading-relaxed">
                                    {currentPhoto.subtitle}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setLightboxIndex(
                                        currentGlobalIndex >= 0 ? currentGlobalIndex : 0
                                    )
                                }
                                className="shrink-0 inline-flex items-center gap-2 rounded-full bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] px-5 py-2.5 text-xs font-semibold tracking-wide transition-all shadow-lg active:scale-[0.98]"
                            >
                                <Expand size={14} aria-hidden="true" />
                                <span>Ampliar foto</span>
                            </button>
                        </div>
                    </div>

                    {/* Índice Curado Lateral (troca instantânea da vitrine) */}
                    <div className="lg:col-span-4 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto lg:max-h-[540px] pb-2 lg:pb-0">
                        {filteredPhotos.map((item, idx) => {
                            const isActive = idx === activeIndex;
                            return (
                                <button
                                    key={item.src}
                                    type="button"
                                    onClick={() => setActiveIndex(idx)}
                                    className={`group shrink-0 w-[230px] sm:w-[250px] lg:w-full text-left flex items-center gap-3.5 p-2.5 rounded-2xl border transition-all duration-300 ${
                                        isActive
                                            ? 'bg-[#141210] border-[#141210] text-white shadow-lg'
                                            : 'bg-[#FAF8F3] border-[#DFD8CA] hover:border-[#9E6B2B]/50 text-[#181614]'
                                    }`}
                                >
                                    <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden bg-[#E5E0D5] shrink-0">
                                        <img
                                            src={item.src}
                                            alt=""
                                            width={160}
                                            height={160}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1 pr-1">
                                        <span
                                            className={`text-[10px] font-mono tracking-[0.18em] uppercase block mb-0.5 tabular-nums ${
                                                isActive ? 'text-[#E5C98B]' : 'text-[#9E6B2B]'
                                            }`}
                                        >
                                            0{idx + 1}
                                        </span>
                                        <p className="font-heading font-semibold text-sm leading-snug line-clamp-2">
                                            {item.title}
                                        </p>
                                    </div>
                                    <ArrowUpRight
                                        size={15}
                                        className={`shrink-0 transition-transform ${
                                            isActive
                                                ? 'text-[#E5C98B]'
                                                : 'text-[#9E6B2B]/50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                                        }`}
                                        aria-hidden="true"
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Lightbox Cinematográfico Navegável via Portal acima do Header */}
            {lightboxIndex !== null &&
                typeof document !== 'undefined' &&
                createPortal(
                    <div
                        ref={lightboxRef}
                        tabIndex={-1}
                        className="fixed inset-0 z-[200] bg-[#12110F] md:bg-[#12110F]/95 md:backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fadeIn outline-none"
                        onClick={closeLightbox}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Visualização da hospedagem em Petrolina"
                    >
                        <div
                            className="w-full max-w-5xl flex items-center justify-between gap-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div>
                                <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#E5C98B] tabular-nums">
                                    0{lightboxIndex + 1} / 0{GALLERY_PHOTOS.length}
                                </span>
                                <p className="text-white text-sm sm:text-base font-heading font-medium mt-0.5">
                                    {GALLERY_PHOTOS[lightboxIndex].title}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeLightbox}
                                aria-label="Fechar galeria"
                                className="w-11 h-11 rounded-full bg-white/10 hover:bg-[#E5C98B] text-white hover:text-[#141210] transition-colors flex items-center justify-center border border-white/15 shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div
                            className="relative flex items-center justify-center w-full max-w-5xl flex-1 my-3 touch-pan-y"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                touchStartXRef.current = e.touches[0]?.clientX ?? null;
                            }}
                            onTouchEnd={(e) => {
                                const startX = touchStartXRef.current;
                                const endX = e.changedTouches[0]?.clientX ?? null;
                                touchStartXRef.current = null;
                                if (startX === null || endX === null) return;
                                const diff = startX - endX;
                                if (diff > 45) showNextLightbox();
                                else if (diff < -45) showPrevLightbox();
                            }}
                        >
                            <button
                                type="button"
                                onClick={showPrevLightbox}
                                aria-label="Foto anterior"
                                className="flex absolute left-2 md:left-4 z-10 w-11 h-11 rounded-full bg-[#1B1916]/90 hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/15 transition-colors items-center justify-center md:backdrop-blur-md"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <img
                                src={GALLERY_PHOTOS[lightboxIndex].src}
                                alt={GALLERY_PHOTOS[lightboxIndex].title}
                                className="max-w-full max-h-[70vh] object-contain shadow-2xl border border-white/15 rounded-2xl"
                            />

                            <button
                                type="button"
                                onClick={showNextLightbox}
                                aria-label="Próxima foto"
                                className="flex absolute right-2 md:right-4 z-10 w-11 h-11 rounded-full bg-[#1B1916]/90 hover:bg-[#E5C98B] text-white hover:text-[#141210] border border-white/15 transition-colors items-center justify-center md:backdrop-blur-md"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        <div
                            className="flex items-center gap-2 overflow-x-auto max-w-full pb-1"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {GALLERY_PHOTOS.map((thumb, idx) => (
                                <button
                                    key={thumb.src}
                                    type="button"
                                    onClick={() => setLightboxIndex(idx)}
                                    aria-label={`Ir para ${thumb.title}`}
                                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                                        idx === lightboxIndex
                                            ? 'border-[#E5C98B] scale-105 opacity-100'
                                            : 'border-white/15 opacity-45 hover:opacity-80'
                                    }`}
                                >
                                    <img
                                        src={thumb.src}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>,
                    document.body
                )}
        </section>
    );
};

export default GallerySection;
