import React from 'react';

// Ordem otimizada para Alta Conversão e Storytelling do Usuário:
// 1. Prova Social no Booking (Reputation)
// 2. Radar de Distâncias no Centro (Hospitais, Orla, Bodódromo)
// 3. Empresas & Longa Estadia (B2B / Conveniência)
// 4. Guia Local & Opções de Hospedagem (Blog)
// 5. Como funciona o flat / Regras (Info)
// 6. Dúvidas Frequentes (FAQ)
// 7. Localização no Mapa
// 8. Chamada Final de Reserva (FinalCTA)
// 9. Acesso do Hóspede (GuestAccess)

import SectionDivider from '../components/LandingFlats/SectionDivider';
import ReputationSection from '../components/LandingFlats/ReputationSection';
import DistanceRadarSection from '../components/LandingFlats/DistanceRadarSection';
import CorporateB2BSection from '../components/LandingFlats/CorporateB2BSection';
import BlogSection from '../components/LandingFlats/BlogSection';
import InfoSection from '../components/LandingFlats/InfoSection';
import FAQSection from '../components/LandingFlats/FAQSection';
import LocationSection from '../components/LandingFlats/LocationSection';
import FinalCTA from '../components/LandingFlats/FinalCTA';
import GuestAccessSection from '../components/LandingFlats/GuestAccessSection';

const BelowTheFoldSections: React.FC = () => {
    return (
        <>
            <SectionDivider />
            <ReputationSection />
            <SectionDivider />
            <DistanceRadarSection />
            <SectionDivider />
            <CorporateB2BSection />
            <SectionDivider />
            <BlogSection />
            <SectionDivider />
            <InfoSection />
            <SectionDivider />
            <FAQSection />
            <SectionDivider />
            <LocationSection />
            <SectionDivider />
            <FinalCTA />
            <SectionDivider />
            <GuestAccessSection />
        </>
    );
};

export default BelowTheFoldSections;
