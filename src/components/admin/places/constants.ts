import { PlaceCategory, PlaceRecommendation } from '../../../types';

/**
 * Lista de categorias disponíveis para locais/estabelecimentos
 */
export const CATEGORIES: { id: PlaceCategory | 'all'; label: string }[] = [
    { id: 'burgers', label: 'Hambúrguer & Sanduíches' },
    { id: 'skewers', label: 'Espetinhos & Jantinha' },
    { id: 'salads', label: 'Saladas & Saudável' },
    { id: 'pasta', label: 'Pizzas & Massas' },
    { id: 'oriental', label: 'Oriental & Sushi' },
    { id: 'alacarte', label: 'À La Carte & Refinados' },
    { id: 'selfservice', label: 'Self-Service & Almoço' },
    { id: 'snacks', label: 'Lanches Rápidos' },
    { id: 'bars', label: 'Bares & Pubs' },
    { id: 'cafes', label: 'Cafés & Padarias' },
    { id: 'attractions', label: 'Passeios & Lazer' },
    { id: 'events', label: 'Eventos & Agenda' },
    { id: 'essentials', label: 'Mercados & Serviços' },
    { id: 'laundry', label: 'Lavanderia' },
    { id: 'salon', label: 'Salão de Beleza' },
    { id: 'gym', label: 'Academia' },
    { id: 'bikes', label: 'Aluguel de Bicicletas' },
    { id: 'souvenirs', label: 'Lembrancinhas' },
    { id: 'emergency', label: 'Hospitais & Clínicas' },
    { id: 'pharmacies', label: 'Farmácias' },
];

/**
 * Estado inicial padrão para o formulário de criação/edição de local
 */
export const DEFAULT_FORM_DATA: Partial<PlaceRecommendation> = {
    name: '',
    description: '',
    address: '',
    mapsLink: '',
    imageUrl: '',
    category: 'burgers',
    visible: true,
    eventDate: '',
    eventEndDate: '',
    eventTime: '',
    orderLink: '',
    distance: '',
    phoneNumber: '',
    whatsapp: '',
    tags: [],
};

/**
 * Encontra o label de uma categoria pelo ID
 */
export const getCategoryLabel = (categoryId: PlaceCategory | undefined): string => {
    if (!categoryId) return 'Sem categoria';
    const category = CATEGORIES.find((c) => c.id === categoryId);
    return category?.label || categoryId;
};
