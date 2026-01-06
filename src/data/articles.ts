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
        imageUrl: '/assets/blog/vapor-do-vinho-montagem.webp',
        category: 'Turismo',
        date: '2025-12-21',
        readTime: '5 min de leitura',
        highlight: true,
        icon: Wine,
        locationLabel: 'Vale do São Francisco',
    },
    {
        id: 'onde-comer-petrolina-bododromo',
        slug: 'onde-comer-petrolina-bododromo',
        title: 'Bodódromo: O Paraíso da Carne de Sol',
        description:
            'Conheça o maior complexo gastronômico ao ar livre da América Latina, parada obrigatória em Petrolina.',
        imageUrl: '/assets/blog/bododromo-petrolina.webp',
        category: 'Gastronomia',
        date: '2025-12-20',
        readTime: '4 min de leitura',
        icon: Utensils,
        locationLabel: 'Petrolina',
    },
    {
        id: 'rio-sao-francisco-rodeadouro-barquinha',
        slug: 'rio-sao-francisco-rodeadouro-barquinha',
        title: 'Ilha do Rodeadouro e Travessia',
        description: 'Descubra as praias de água doce e o passeio de barquinha pelo Velho Chico.',
        imageUrl: '/assets/blog/rio-sao-francisco-rodeadouro.webp',
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
