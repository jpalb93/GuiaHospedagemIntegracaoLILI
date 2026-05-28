import React, { useEffect, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LILI_PHONE, FLAT_ADDRESS } from '../../constants';
import Header from './Header';
import Hero from './Hero';
// Lazy Load Sections
const About = lazy(() => import('./About'));
const Amenities = lazy(() => import('./Amenities'));
const Reviews = lazy(() => import('./Reviews'));
const Gallery = lazy(() => import('./Gallery'));
const Location = lazy(() => import('./Location'));
const Footer = lazy(() => import('./Footer'));

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
        <div className="font-sans bg-stone-950 text-stone-50 selection:bg-orange-900 selection:text-white">
            <Helmet>
                <title>Flat de Lili | Boutique em Petrolina (Centro)</title>
                <meta
                    name="description"
                    content="Conheça o Flat de Lili: design boutique, conforto e a melhor localização no Centro de Petrolina. Reserve direto e aproveite uma estadia exclusiva."
                />
                <meta
                    property="og:title"
                    content="Flat de Lili | Design & Conforto em Petrolina"
                />
                <meta
                    property="og:description"
                    content="Flat boutique em Petrolina. 30m² de design e conforto no centro da cidade."
                />
                <meta
                    property="og:image"
                    content="https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"
                />
                <meta property="og:url" content="https://flatsintegracao.com.br/lili" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Flat de Lili | Design & Conforto em Petrolina" />
                <meta
                    name="twitter:description"
                    content="Flat boutique em Petrolina. 30m² de design e conforto no centro da cidade."
                />
                <meta
                    name="twitter:image"
                    content="https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"
                />
                <link rel="canonical" href="https://flatsintegracao.com.br/lili" />
            </Helmet>

            <Header />
            <Hero />


            <Suspense fallback={<div className="min-h-[50vh]" />}>
                <About />
                <Amenities />
                <Reviews />
                <Gallery />
                <Location />
                <Footer />
            </Suspense>

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
