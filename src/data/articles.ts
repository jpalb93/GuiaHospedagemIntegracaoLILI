import { Wine, Utensils, Anchor, Briefcase, Sparkles } from 'lucide-react';
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
        imageUrl: '/images/home-office.jpg',
        category: 'Corporativo',
        date: '2025-12-22',
        readTime: '4 min',
        icon: Briefcase,
        locationLabel: 'Centro',
    },
    {
        id: 'hospedagem-medica',
        slug: 'hospedagem-proximo-hospitais-petrolina',
        title: 'Hospedagem perto do Hospital Dom Malan e HEMOPE',
        description:
            'Guia completo para pacientes e acompanhantes que buscam conforto, silêncio e praticidade perto dos principais hospitais de Petrolina.',
        imageUrl: '/images/quarto-lavanderia.jpg',
        category: 'Saúde',
        date: '2026-05-06',
        readTime: '6 min',
        icon: Briefcase,
        locationLabel: 'Centro / Polo Médico',
    },
    {
        id: 'flat-vs-hotel',
        slug: 'flat-ou-hotel-petrolina-comparativo',
        title: 'Flat ou Hotel em Petrolina? Qual escolher para sua viagem',
        description:
            'Um comparativo real de preços, conforto e custo-benefício para ajudar você a decidir a melhor hospedagem no Sertão.',
        imageUrl: '/images/cozinha-jantar.jpg',
        category: 'Dicas',
        date: '2026-05-06',
        readTime: '7 min',
        icon: Briefcase,
        locationLabel: 'Centro / Petrolina',
    },
    {
        id: 'sao-joao-petrolina',
        slug: 'onde-ficar-petrolina-sao-joao-guia',
        title: 'Onde ficar no São João de Petrolina: Guia de Hospedagem',
        description:
            'Planeje sua estadia para o melhor São João do Brasil. Dicas de localização, transporte e como garantir conforto perto do Pátio de Eventos.',
        imageUrl: '/images/entretenimento.jpg',
        category: 'Eventos',
        date: '2026-05-06',
        readTime: '8 min',
        icon: Sparkles,
        locationLabel: 'Centro / Pátio de Eventos',
    },
    {
        id: 'aluguel-mensal',
        slug: 'aluguel-mensal-petrolina-flat-mobiliado',
        title: 'Aluguel por Mês em Petrolina: Vantagens de Morar em Flat',
        description:
            'Trabalho, mudança ou estudo? Descubra por que o aluguel mensal de um flat no Centro é mais prático e barato que contratos tradicionais.',
        imageUrl: '/images/home-office.jpg',
        category: 'Trabalho',
        date: '2026-05-06',
        readTime: '9 min',
        icon: Briefcase,
        locationLabel: 'Centro / Longa Estadia',
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
