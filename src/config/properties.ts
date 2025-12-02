

export type PropertyId = 'lili' | 'integracao';

export interface PropertyConfig {
    id: PropertyId;
    name: string;
    theme: {
        primaryColor: string;
        secondaryColor: string;
    };
    features: {
        hasDigitalLock: boolean; // Se tem senha na porta
        hasSafe: boolean;        // Se tem cofre
        hasTipsStories: boolean; // Se mostra os stories de "Dicas do Flat"
        hasReviews: boolean;     // Se mostra a seção de avaliações
        hasReception: boolean;   // Se tem portaria física
        hasBlockedDates: boolean; // Se tem gerenciamento de bloqueios de data
    };
    assets: {
        heroImage: string;
        heroSlides?: string[]; // Slideshow do Hero
        logo?: string;
    };
    defaults: {
        checkInTime: string;
        checkOutTime: string;
        welcomeMessage?: string;
    };
    ai: {
        systemPrompt: string;
        botName: string;
    };
    address: string;
    hostPhone: string;
    googleReviewLink?: string;
}

export const PROPERTIES: Record<PropertyId, PropertyConfig> = {
    lili: {
        id: 'lili',
        name: 'Flat da Lili',
        address: "R. São José, 475 - Centro, Petrolina - PE, 56302-270",
        hostPhone: "5587988342138",
        googleReviewLink: "https://search.google.com/local/writereview?placeid=ChIJz0sHkXpxcwcRwekJL9cyLjY",
        theme: {
            primaryColor: 'orange',
            secondaryColor: 'blue',
        },
        features: {
            hasDigitalLock: true,
            hasSafe: true,
            hasTipsStories: true,
            hasReviews: true,
            hasReception: false,
            hasBlockedDates: true,
        },
        assets: {
            heroImage: "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg",
            heroSlides: [
                "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg",
                "https://i.postimg.cc/HWK5mRBG/Whats-App-Image-2025-11-15-at-17-46-43.jpg",
                "https://i.postimg.cc/XvJHhts5/Gemini-Generated-Image-qgzulyqgzulyqgzu.png"
            ]
        },
        defaults: {
            checkInTime: '15:00',
            checkOutTime: '11:00',
            welcomeMessage: "Olá! Seja muito bem-vindo(a) ao Flat da Lili. Preparei este guia com muito carinho para você."
        },
        ai: {
            botName: 'Mandacaru',
            systemPrompt: `
Você é o Mandacaru, o concierge virtual do Flat da Lili em Petrolina.
Seu tom é acolhedor, nordestino (mas sem exageros caricatos) e muito prestativo.
Você ajuda com senha do wi-fi, dicas de restaurantes e dúvidas sobre o flat.
Se não souber, peça para falar com a Lili (Anfitriã).
`
        }
    },
    integracao: {
        id: 'integracao',
        name: 'Flats Integração',
        address: "R. São José, 475 - Centro, Petrolina - PE, 56302-270",
        hostPhone: "5587988342138", // Placeholder
        theme: {
            primaryColor: 'blue',
            secondaryColor: 'gray',
        },
        features: {
            hasDigitalLock: false, // Chave na portaria
            hasSafe: true,
            hasTipsStories: false, // Não mostra dicas do flat por enquanto
            hasReviews: false,
            hasReception: true,    // Tem portaria
            hasBlockedDates: false,
        },
        assets: {
            heroImage: "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg", // Placeholder por enquanto
            heroSlides: [
                "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg" // Apenas uma imagem por enquanto
            ]
        },
        defaults: {
            checkInTime: '15:00',
            checkOutTime: '13:00',
            welcomeMessage: "Olá! Seja bem-vindo aos Flats Integração. Aqui você encontra conforto e praticidade."
        },
        ai: {
            botName: 'Concierge Integração',
            systemPrompt: `
Você é o Concierge Virtual dos Flats Integração em Petrolina.
Seu tom é profissional, direto e educado.
Você ajuda com informações sobre o flat e a cidade.
A chave fica na portaria 24h.
`
        }
    }
};
