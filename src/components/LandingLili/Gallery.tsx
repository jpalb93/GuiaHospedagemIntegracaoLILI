import React from 'react';
import SimpleGallery from '../SimpleGallery';
import { LANDING_GALLERY_IMAGES } from '../../constants';

const Gallery: React.FC = () => {
    return (
        <section className="py-24 bg-stone-50">
            <div className="container mx-auto px-6 md:px-12 mb-12">
                <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                    Galeria
                </h2>
            </div>
            <div className="container mx-auto px-4">
                <SimpleGallery images={LANDING_GALLERY_IMAGES} />
            </div>
        </section>
    );
};

export default Gallery;
