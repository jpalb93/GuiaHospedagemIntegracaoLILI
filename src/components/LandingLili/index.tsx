import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LILI_PHONE, FLAT_ADDRESS } from '../../constants';
import Header from './Header';
import Hero from './Hero';
import About from './About';
import Amenities from './Amenities';
import Reviews from './Reviews';
import Gallery from './Gallery';
import Location from './Location';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const LandingLili: React.FC = () => {
    useEffect(() => {
        document.title = 'Flat de Lili | Design & Conforto em Petrolina';

        // Inject JSON-LD (Schema.org)
        const schema = {
            '@context': 'https://schema.org',
            '@type': 'LodgingBusiness',
            name: 'Flat de Lili',
            image: ['https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg'],
            url: window.location.href,
            telephone: `+${LILI_PHONE}`,
            address: {
                '@type': 'PostalAddress',
                streetAddress: FLAT_ADDRESS?.split(',')[0] || 'Centro',
                addressLocality: 'Petrolina',
                addressRegion: 'PE',
                postalCode: '56302-270',
                addressCountry: 'BR',
            },
            priceRange: '$$$',
            description:
                'Flat boutique em Petrolina. 30m² de design e conforto no centro da cidade.',
            starRating: {
                '@type': 'Rating',
                ratingValue: '5',
            },
        };

        const scriptId = 'flat-lili-jsonld';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.id = scriptId;
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.text = JSON.stringify(schema);
    }, []);

    return (
        <div className="font-sans bg-stone-50 text-gray-900 selection:bg-orange-200 selection:text-orange-900">
            <Helmet>
                <title>Flat de Lili | Boutique em Petrolina</title>
            </Helmet>

            <Header />
            <Hero />
            <About />
            <Amenities />
            <Reviews />
            <Gallery />
            <Location />
            <Footer />

            {/* Floating WhatsApp Button */}
            <a
                href={`https://wa.me/${LILI_PHONE}`}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
                aria-label="Falar no WhatsApp"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp"
                    className="w-8 h-8 filter brightness-0 invert"
                />
            </a>
        </div>
    );
};

export default LandingLili;
