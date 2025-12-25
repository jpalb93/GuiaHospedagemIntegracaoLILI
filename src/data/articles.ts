import { Wine, Utensils, Anchor, Briefcase } from 'lucide-react';
import type { ComponentType } from 'react';

export interface Article {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    date: string;
    readTime: string; // '5 min'
    highlight?: boolean; // 'Imperdível' etc
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon?: ComponentType<any>;
    locationLabel?: string;
}

export const articles: Article[] = [
    {
        id: 'roteiro-vinho',
        slug: 'roteiro-vinho-petrolina',
        title: 'Roteiro do Vinho: Como visitar as vinícolas?',
        description:
            'O guia definitivo para os passeios de enoturismo como Vapor do Vinho, Miolo e Rio Sol. Preços, horários e dicas.',
        imageUrl: '/assets/blog/vapor-do-vinho-montagem.jpg',
        category: 'Enoturismo',
        date: '2025-12-21',
        readTime: '8 min',
        highlight: true,
        icon: Wine,
        locationLabel: 'Vale do São Francisco',
    },
    {
        id: 'onde-comer-bododromo',
        slug: 'onde-comer-petrolina-bododromo',
        title: 'Bodódromo e Além: Onde comer bem?',
        description:
            'Do clássico bode assado à moqueca na beira do rio. Descubra os melhores sabores do Vale.',
        imageUrl: '/assets/blog/bododromo-petrolina.jpg',
        category: 'Gastronomia',
        date: '2025-12-22',
        readTime: '6 min',
        icon: Utensils,
        locationLabel: 'Petrolina',
    },
    {
        id: 'rio-sao-francisco',
        slug: 'rio-sao-francisco-rodeadouro-barquinha',
        title: 'Experiências Fluviais',
        description:
            'Da histórica travessia de barquinha ao banho relaxante na Ilha do Rodeadouro. O guia completo.',
        imageUrl: '/assets/blog/rio-sao-francisco-rodeadouro.jpg',
        category: 'Passeios',
        date: '2025-12-22',
        readTime: '5 min',
        icon: Anchor,
        locationLabel: 'Rio São Francisco',
    },
    {
        id: 'hospedagem-corporativa',
        slug: 'hospedagem-corporativa-empresas-petrolina',
        title: 'Para Empresas e Executivos',
        description:
            'Wi-Fi de alta velocidade, nota fiscal e localização estratégica. A melhor escolha para sua viagem de negócios.',
        imageUrl: 'https://i.postimg.cc/tgpZD8kK/334291651.jpg',
        category: 'Corporativo',
        date: '2025-12-22',
        readTime: '4 min',
        icon: Briefcase,
        locationLabel: 'Centro',
    },
    // Future articles example:
    // {
    //     id: 'ilhas-velho-chico',
    //     slug: 'ilhas-rio-sao-francisco',
    //     title: 'As Ilhas do Velho Chico: O Caribe Sertanejo',
    //     description: 'Rodeadouro, Ilha do Fogo e Massangano. Onde tomar banho de rio com segurança e comer o melhor peixe.',
    //     imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
    //     category: 'Passeios',
    //     date: '2025-12-22',
    //     readTime: '6 min',
    //     locationLabel: 'Petrolina / Juazeiro'
    // }
];
