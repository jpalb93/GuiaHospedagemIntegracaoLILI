import React from 'react';

// Ordem realocada com ritmo editorial alternado (Deep Charcoal <-> Warm Alabaster):
// 1. Prova Social no Booking (Reputation — Charcoal)
// 2. Localização + Radar de Distâncias + Mapa Interativo (LocationSection — Alabaster)
// 3. Modalidades de Estadia + Day Use + Horários e Regras (StayOptions + DayUse + Info — Alabaster)
// 4. Empresas & Longa Estadia (Corporate B2B — Charcoal)
// 5. Guia Local de Petrolina (LocalGuide — Charcoal)
// 6. Dúvidas Frequentes (FAQ — Alabaster)
// 7. Chamada Final de Reserva & Acesso do Hóspede (FinalCTA + GuestAccess — Charcoal)

import ReputationSection from '../components/LandingFlats/ReputationSection';
import LocationSection from '../components/LandingFlats/LocationSection';
import { StayOptionsSection, LocalGuideSection } from '../components/LandingFlats/BlogSection';
import DayUseSection from '../components/LandingFlats/DayUseSection';
import CorporateB2BSection from '../components/LandingFlats/CorporateB2BSection';
import InfoSection from '../components/LandingFlats/InfoSection';
import FAQSection from '../components/LandingFlats/FAQSection';
import FinalCTA from '../components/LandingFlats/FinalCTA';
import GuestAccessSection from '../components/LandingFlats/GuestAccessSection';

const BelowTheFoldSections: React.FC = () => {
    return (
        <>
            <ReputationSection />
            <LocationSection />
            <StayOptionsSection />
            <DayUseSection />
            <InfoSection />
            <CorporateB2BSection />
            <LocalGuideSection />
            <FAQSection />
            <FinalCTA />
            <GuestAccessSection />
        </>
    );
};

export default BelowTheFoldSections;
