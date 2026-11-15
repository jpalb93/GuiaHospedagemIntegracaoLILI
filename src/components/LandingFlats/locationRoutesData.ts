export type TravelMode = 'driving' | 'walking';
export type SpotCategory = 'destaques' | 'saude' | 'gastronomia' | 'lazer' | 'negocios';

export interface RouteMetrics {
    kmLabel: string;
    minutes: number;
    timeLabel: string;
}

export interface RadarSpot {
    id: string;
    category: Exclude<SpotCategory, 'destaques'>;
    featured: boolean;
    shortLabel: string;
    destination: string;
    desc: string;
    coords: [number, number];
    routeQuery: string;
    driving: RouteMetrics;
    walking: RouteMetrics;
}

export const SPOT_CATEGORIES: { id: SpotCategory; label: string }[] = [
    { id: 'destaques', label: 'Destaques' },
    { id: 'saude', label: 'Saúde' },
    { id: 'gastronomia', label: 'Mercado & Gastrô' },
    { id: 'lazer', label: 'Lazer & Rio' },
    { id: 'negocios', label: 'Compras & Acesso' },
];

export const FLAT_ORIGIN = {
    name: 'Flats Integração',
    address: 'R. São José, 475 B · Centro',
    coords: [-9.39961, -40.49352] as [number, number],
};

export const RADAR_SPOTS: RadarSpot[] = [
    {
        id: 'hospitais',
        category: 'saude',
        featured: true,
        shortLabel: 'Hospital Unimed',
        destination: 'Hospital Unimed Vale do São Francisco',
        desc: 'Av. da Integração · Urgência e complexo hospitalar',
        coords: [-9.39413, -40.48381],
        routeQuery: 'Hospital+Unimed+Vale+do+Sao+Francisco+Petrolina',
        driving: {
            kmLabel: '1,9 km',
            minutes: 3,
            timeLabel: '3 min',
        },
        walking: {
            kmLabel: '1,4 km',
            minutes: 21,
            timeLabel: '21 min',
        },
    },
    {
        id: 'neurocardio',
        category: 'saude',
        featured: false,
        shortLabel: 'Neurocárdio',
        destination: 'Hospital Neurocárdio',
        desc: 'R. Tobias Barreto · Cardiologia, neurologia e exames',
        coords: [-9.39339, -40.49883],
        routeQuery: 'Hospital+Neurocardio+Petrolina',
        driving: {
            kmLabel: '1,5 km',
            minutes: 3,
            timeLabel: '3 min',
        },
        walking: {
            kmLabel: '1,2 km',
            minutes: 17,
            timeLabel: '17 min',
        },
    },
    {
        id: 'dom-malan',
        category: 'saude',
        featured: false,
        shortLabel: 'Dom Malan',
        destination: 'Hospital Dom Malan (HMDP)',
        desc: 'R. Joaquim Nabuco · Referência materno-infantil',
        coords: [-9.39457, -40.49971],
        routeQuery: 'Hospital+Dom+Malan+Petrolina',
        driving: {
            kmLabel: '1,6 km',
            minutes: 3,
            timeLabel: '3 min',
        },
        walking: {
            kmLabel: '1,1 km',
            minutes: 16,
            timeLabel: '16 min',
        },
    },
    {
        id: 'hu-univasf',
        category: 'saude',
        featured: false,
        shortLabel: 'HU-Univasf',
        destination: 'Hospital Universitário (HU-Univasf)',
        desc: 'Av. José de Sá Maniçoba · Hospital de ensino e traumas',
        coords: [-9.39242, -40.49666],
        routeQuery: 'Hospital+Universitario+UNIVASF+Petrolina',
        driving: {
            kmLabel: '1,8 km',
            minutes: 4,
            timeLabel: '4 min',
        },
        walking: {
            kmLabel: '1,5 km',
            minutes: 22,
            timeLabel: '22 min',
        },
    },
    {
        id: 'frutos',
        category: 'gastronomia',
        featured: false,
        shortLabel: 'Superm. Frutos',
        destination: 'Frutos Hortifruti e Mercado Gourmet',
        desc: 'R. Dr. Júlio de Melo, 500 · Hortifrúti, açougue e mercado',
        coords: [-9.40031, -40.49656],
        routeQuery: 'Frutos+Hortifruti+e+Mercado+Gourmet+Petrolina',
        driving: {
            kmLabel: '447 m',
            minutes: 2,
            timeLabel: '2 min',
        },
        walking: {
            kmLabel: '426 m',
            minutes: 6,
            timeLabel: '6 min',
        },
    },
    {
        id: 'lorena',
        category: 'gastronomia',
        featured: false,
        shortLabel: 'Lorena Gourmet',
        destination: 'Lorena Mercado Gourmet',
        desc: 'Av. Monsenhor Ângelo Sampaio, 499 · Café e conveniência ao lado',
        coords: [-9.3998, -40.49252],
        routeQuery: 'Lorena+Mercado+Gourmet+Petrolina',
        driving: {
            kmLabel: '287 m',
            minutes: 2,
            timeLabel: '2 min',
        },
        walking: {
            kmLabel: '287 m',
            minutes: 4,
            timeLabel: '4 min',
        },
    },
    {
        id: 'villarejo',
        category: 'gastronomia',
        featured: false,
        shortLabel: 'Villarejo Gastrô',
        destination: 'Villarejo Container Gastrô',
        desc: 'Av. Cardoso de Sá, 1155 · Vila gastronômica e música ao vivo',
        coords: [-9.4022, -40.4916],
        routeQuery: 'Villarejo+Container+Gastro+Petrolina',
        driving: {
            kmLabel: '754 m',
            minutes: 2,
            timeLabel: '2 min',
        },
        walking: {
            kmLabel: '689 m',
            minutes: 10,
            timeLabel: '10 min',
        },
    },
    {
        id: 'bododromo',
        category: 'gastronomia',
        featured: true,
        shortLabel: 'Bodódromo',
        destination: 'Bodódromo (Polo Gastronômico)',
        desc: 'Av. São Francisco · Restaurantes típicos e carne de sol',
        coords: [-9.38185, -40.49354],
        routeQuery: 'Bododromo+Petrolina',
        driving: {
            kmLabel: '2,8 km',
            minutes: 4,
            timeLabel: '4 min',
        },
        walking: {
            kmLabel: '2,6 km',
            minutes: 37,
            timeLabel: '37 min',
        },
    },
    {
        id: 'orla',
        category: 'lazer',
        featured: true,
        shortLabel: 'Orla I',
        destination: 'Orla do Rio São Francisco',
        desc: 'Av. Cardoso de Sá · Calçadão, barquinhas e pôr do sol',
        coords: [-9.40309, -40.49801],
        routeQuery: 'Orla+de+Petrolina',
        driving: {
            kmLabel: '1,0 km',
            minutes: 3,
            timeLabel: '3 min',
        },
        walking: {
            kmLabel: '931 m',
            minutes: 13,
            timeLabel: '13 min',
        },
    },
    {
        id: 'parque-josepha',
        category: 'lazer',
        featured: false,
        shortLabel: 'Parque Josepha',
        destination: 'Parque Municipal Josepha Coelho',
        desc: 'Área verde, pista de caminhada e lazer no Centro',
        coords: [-9.38853, -40.49802],
        routeQuery: 'Parque+Municipal+Josepha+Coelho+Petrolina',
        driving: {
            kmLabel: '2,7 km',
            minutes: 6,
            timeLabel: '6 min',
        },
        walking: {
            kmLabel: '2,4 km',
            minutes: 35,
            timeLabel: '35 min',
        },
    },
    {
        id: 'catedral',
        category: 'lazer',
        featured: false,
        shortLabel: 'Catedral',
        destination: 'Catedral Sagrado Coração de Jesus',
        desc: 'Av. Guararapes · Marco histórico no coração da cidade',
        coords: [-9.39931, -40.5007],
        routeQuery: 'Catedral+de+Petrolina',
        driving: {
            kmLabel: '1,2 km',
            minutes: 4,
            timeLabel: '4 min',
        },
        walking: {
            kmLabel: '941 m',
            minutes: 14,
            timeLabel: '14 min',
        },
    },
    {
        id: 'ilha-do-fogo',
        category: 'lazer',
        featured: false,
        shortLabel: 'Ilha do Fogo',
        destination: 'Ilha do Fogo (Ponte Pres. Dutra)',
        desc: 'Mirante fluvial, banho de rio e travessia Petrolina-Juazeiro',
        coords: [-9.40593, -40.50428],
        routeQuery: 'Ilha+do+Fogo+Petrolina',
        driving: {
            kmLabel: '2,9 km',
            minutes: 5,
            timeLabel: '5 min',
        },
        walking: {
            kmLabel: '1,9 km',
            minutes: 27,
            timeLabel: '27 min',
        },
    },
    {
        id: 'river-shopping',
        category: 'negocios',
        featured: false,
        shortLabel: 'River Shopping',
        destination: 'River Shopping Petrolina',
        desc: 'Av. Mons. Ângelo Sampaio, 100 · Lojas, praça e cinema',
        coords: [-9.39404, -40.49229],
        routeQuery: 'River+Shopping+Petrolina',
        driving: {
            kmLabel: '1,6 km',
            minutes: 4,
            timeLabel: '4 min',
        },
        walking: {
            kmLabel: '778 m',
            minutes: 11,
            timeLabel: '11 min',
        },
    },
    {
        id: 'univasf',
        category: 'negocios',
        featured: false,
        shortLabel: 'UNIVASF',
        destination: 'UNIVASF · Campus Centro',
        desc: 'Av. José de Sá Maniçoba · Eventos, congressos e graduação',
        coords: [-9.39051, -40.49689],
        routeQuery: 'UNIVASF+Campus+Petrolina',
        driving: {
            kmLabel: '2,3 km',
            minutes: 5,
            timeLabel: '5 min',
        },
        walking: {
            kmLabel: '1,9 km',
            minutes: 27,
            timeLabel: '27 min',
        },
    },
    {
        id: 'rodoviaria',
        category: 'negocios',
        featured: false,
        shortLabel: 'Rodoviária',
        destination: 'Terminal Rodoviário de Petrolina',
        desc: 'Av. Nilo Coelho · Conexões regionais e interestaduais',
        coords: [-9.39221, -40.50896],
        routeQuery: 'Rodoviaria+de+Petrolina',
        driving: {
            kmLabel: '2,5 km',
            minutes: 6,
            timeLabel: '6 min',
        },
        walking: {
            kmLabel: '2,3 km',
            minutes: 33,
            timeLabel: '33 min',
        },
    },
    {
        id: 'aeroporto',
        category: 'negocios',
        featured: true,
        shortLabel: 'Aeroporto',
        destination: 'Aeroporto Senador Nilo Coelho',
        desc: 'BR-235 · Terminal de passageiros com acesso pelas avenidas',
        coords: [-9.36747, -40.56623],
        routeQuery: 'Aeroporto+de+Petrolina',
        driving: {
            kmLabel: '11,7 km',
            minutes: 13,
            timeLabel: '13 min',
        },
        walking: {
            kmLabel: '10,4 km',
            minutes: 150,
            timeLabel: '2h 30min',
        },
    },
];
