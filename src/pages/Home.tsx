import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/LandingFlats/Hero';
import FeaturesSection from '../components/LandingFlats/FeaturesSection';
import InfoSection from '../components/LandingFlats/InfoSection';
import ReputationSection from '../components/LandingFlats/ReputationSection';
import GallerySection from '../components/LandingFlats/GallerySection';
import LocationSection from '../components/LandingFlats/LocationSection';
import GuestAccessSection from '../components/LandingFlats/GuestAccessSection';
import FAQSection from '../components/LandingFlats/FAQSection';
import FinalCTA from '../components/LandingFlats/FinalCTA';

import BlogSection from '../components/LandingFlats/BlogSection';

const Home: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Flats Integração | Aluguel por Temporada no Centro de Petrolina</title>
                <meta
                    name="description"
                    content="Hospedagem completa no Centro de Petrolina. Flats mobiliados com cozinha, Wi-Fi e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    property="og:title"
                    content="Flats Integração | Aluguel por Temporada no Centro de Petrolina"
                />
                <meta
                    property="og:description"
                    content="Hospedagem completa no Centro de Petrolina. Flats mobiliados com cozinha, Wi-Fi e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    name="keywords"
                    content="flats Petrolina, hospedagem Petrolina, guia digital, Flats Integração, aluguel temporada, hotel Petrolina"
                />
                <meta name="author" content="Flats Integração" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://flatsintegracao.com.br" />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LodgingBusiness',
                        name: 'Flats Integração',
                        image: 'https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg',
                        telephone: '+55 87 98834-2138',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'R. São José, 475 B, Centro',
                            addressLocality: 'Petrolina',
                            addressRegion: 'PE',
                            postalCode: '56302-270',
                            addressCountry: 'BR',
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: 9.0,
                            bestRating: 10,
                            worstRating: 1,
                            ratingCount: 150,
                        },
                    })}
                </script>
            </Helmet>

            <Hero />
            <ReputationSection />
            <GallerySection />
            <InfoSection />
            <FeaturesSection />

            <BlogSection />

            <FAQSection />
            <GuestAccessSection />
            <LocationSection />
            <FinalCTA />
        </>
    );
};

export default Home;
