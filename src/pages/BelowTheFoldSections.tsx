import React from 'react';

// Seções que serão carregadas juntas em um único chunk
import InfoSection from '../components/LandingFlats/InfoSection';
import FeaturesSection from '../components/LandingFlats/FeaturesSection';
import BlogSection from '../components/LandingFlats/BlogSection';
import FAQSection from '../components/LandingFlats/FAQSection';
import GuestAccessSection from '../components/LandingFlats/GuestAccessSection';
import LocationSection from '../components/LandingFlats/LocationSection';
import FinalCTA from '../components/LandingFlats/FinalCTA';

const BelowTheFoldSections: React.FC = () => {
    return (
        <>
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

export default BelowTheFoldSections;
