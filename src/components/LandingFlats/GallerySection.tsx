import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

const PHOTOS = [
    'https://i.postimg.cc/W4TFSxSR/305095874.jpg',
    'https://i.postimg.cc/5tbYpDp1/305095888.jpg',
    'https://i.postimg.cc/1zsnMbBJ/334290310.jpg',
    'https://i.postimg.cc/9QGwdcP3/334290394.jpg',
    'https://i.postimg.cc/tgpZD8kK/334291651.jpg',
    'https://i.postimg.cc/YSMG8TRP/334291852.jpg',
    'https://i.postimg.cc/wBgyFn2w/334715657.jpg',
];

const GallerySection: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openLightbox = (img: string) => setSelectedImage(img);
    const closeLightbox = () => setSelectedImage(null);

    return (
        <section id="galeria" className="py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold tracking-wider uppercase text-sm mb-2 block animate-fadeIn">
                        Conheça por dentro
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-heading font-bold text-gray-900 mb-4 text-balance">
                        Nossos Ambientes
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Um tour visual pelo conforto e design que esperam por você.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
                    {PHOTOS.map((photo, index) => (
                        <div
                            key={index}
                            onClick={() => openLightbox(photo)}
                            className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ${index === 0 || index === 4 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
                        >
                            <img
                                src={photo}
                                alt={`Ambiente ${index + 1}`}
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                                    <Camera size={24} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox Overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <X size={32} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoom"
                        className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </section>
    );
};

export default GallerySection;
