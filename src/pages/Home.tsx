import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/LandingFlats/Hero';
import TopTicker from '../components/layout/TopTicker';
import SectionDivider from '../components/LandingFlats/SectionDivider';
import FeaturesSection from '../components/LandingFlats/FeaturesSection';
import GallerySection from '../components/LandingFlats/GallerySection';

// Lazy Load Sections below the fold as a single chunk to reduce request chaining
import BelowTheFoldSections from './BelowTheFoldSections';

const Home: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Hospedagem em Petrolina | Flats Integração (Centro)</title>
                <meta
                    name="description"
                    content="Hospedagem em Petrolina no Centro: flats mobiliados com cozinha, Wi-Fi fibra e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    property="og:title"
                    content="Hospedagem em Petrolina | Flats Integração (Centro)"
                />
                <meta
                    property="og:description"
                    content="Hospedagem em Petrolina no Centro: flats mobiliados com cozinha, Wi-Fi fibra e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    name="keywords"
                    content="hospedagem em Petrolina, hospedagem Petrolina, flats Petrolina, flat mobiliado Petrolina, hotel Petrolina, aluguel temporada Petrolina, Flats Integração, Centro Petrolina"
                />
                <meta name="author" content="Flats Integração" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://www.flatsintegracao.com.br" />
                <meta property="og:url" content="https://www.flatsintegracao.com.br" />
                <meta property="og:type" content="website" />
                <meta
                    property="og:image"
                    content="https://www.flatsintegracao.com.br/hero-bg-nova.webp"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:locale" content="pt_BR" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Hospedagem em Petrolina | Flats Integração (Centro)"
                />
                <meta
                    name="twitter:description"
                    content="Hospedagem em Petrolina no Centro: flats mobiliados com cozinha, Wi-Fi fibra e ar-condicionado. Melhor custo-benefício que hotel. Reserve direto."
                />
                <meta
                    name="twitter:image"
                    content="https://www.flatsintegracao.com.br/hero-bg-nova.webp"
                />

                {/* Structured Data (JSON-LD) */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            {
                                '@type': 'ListItem',
                                position: 1,
                                name: 'Hospedagem em Petrolina',
                                item: 'https://www.flatsintegracao.com.br',
                            },
                        ],
                    })}
                </script>

                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LodgingBusiness',
                        name: 'Flats Integração',
                        alternateName: 'Hospedagem em Petrolina - Flats Integração',
                        description:
                            'Hospedagem em Petrolina no Centro: flats mobiliados com cozinha, Wi-Fi fibra e ar-condicionado. Melhor custo-benefício que hotel.',
                        '@id': 'https://www.flatsintegracao.com.br',
                        url: 'https://www.flatsintegracao.com.br',
                        sameAs: [
                            'https://www.instagram.com/flatsintegracao/',
                            'https://www.airbnb.com.br/users/show/155799195',
                        ],
                        hasMap: 'https://maps.app.goo.gl/K8n5q9r9G7jQ8J9T6',
                        image: [
                            'https://i.postimg.cc/CxBg00qr/Whats_App_Image_2025_11_21_at_11_00_19.jpg',
                            'https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg',
                        ],
                        telephone: '+5587988283273',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'R. São José, 475 B, Centro',
                            addressLocality: 'Petrolina',
                            addressRegion: 'PE',
                            postalCode: '56302-270',
                            addressCountry: 'BR',
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: -9.395781,
                            longitude: -40.502621,
                        },
                        priceRange: '$$',
                        currenciesAccepted: 'BRL',
                        paymentAccepted: 'Cash, Credit Card, Pix',
                        openingHoursSpecification: {
                            '@type': 'OpeningHoursSpecification',
                            dayOfWeek: [
                                'Monday',
                                'Tuesday',
                                'Wednesday',
                                'Thursday',
                                'Friday',
                                'Saturday',
                                'Sunday',
                            ],
                            opens: '00:00',
                            closes: '23:59',
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: 4.9,
                            bestRating: 5,
                            worstRating: 1,
                            ratingCount: 84,
                        },
                    })}
                </script>
            </Helmet>

            {/* Primeira dobra: hero + ticker sempre visíveis juntos */}
            <div className="flex flex-col h-[100dvh] min-h-[636px] md:min-h-[736px]">
                <Hero />
                <TopTicker />
            </div>
            <GallerySection />
            <SectionDivider />
            <FeaturesSection />

            <BelowTheFoldSections />
        </>
    );
};

export default Home;
