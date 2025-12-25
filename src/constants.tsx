/* 
  =============================================================================
  1. ÁLBUM DE FOTOS (CENTRAL DE IMAGENS)
  Aqui você altera todas as fotos estáticas do site.
  =============================================================================
*/

// --- CAPA DO SITE (HERO) ---
export const HERO_IMAGE_URL =
    'https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg';
export const HERO_IMAGE_2_URL =
    'https://i.postimg.cc/HWK5mRBG/Whats-App-Image-2025-11-15-at-17-46-43.jpg';
export const HERO_IMAGE_3_URL =
    'https://i.postimg.cc/XvJHhts5/Gemini-Generated-Image-qgzulyqgzulyqgzu.png';

// --- CONFIGURAÇÃO PADRÃO DE SLIDES (FALLBACK) ---
export const DEFAULT_SLIDES = [HERO_IMAGE_URL, HERO_IMAGE_2_URL, HERO_IMAGE_3_URL];

// --- GALERIA DA LANDING PAGE (Página da Lili) ---
export const LANDING_GALLERY_IMAGES = [
    'https://i.postimg.cc/JnkG03mm/5930cc64-fdef-4d4a-b6ba-a8380fde40de.jpg',
    'https://i.postimg.cc/vBVcT7M8/78e0984d-5800-4027-9578-e43b4de1815a.jpg',
    'https://i.postimg.cc/nzDCrKZn/aca338a7-c3f0-4838-90bf-4639fde2d2c4.jpg',
    'https://i.postimg.cc/50C6y514/d98177da-7250-456d-bd58-b4f9dfcebec7-1.jpg',
    'https://i.postimg.cc/Ls7JmQdM/dda93871-f7aa-4867-a0bd-49d59319fd64.jpg',
];

// --- SLIDESHOW DA LANDING PAGE (Fundo do Título) ---
export const LANDING_HERO_SLIDES = [
    'https://i.postimg.cc/4dZ1Q3dN/Whats-App-Image-2025-11-15-at-17-43-54.jpg',
    'https://i.postimg.cc/MTDmP8Mw/Whats-App-Image-2025-11-15-at-17-46-43.jpg',
];

// --- IMAGENS DOS STORIES (CURIOSIDADES DE PETROLINA) ---
// Estas imagens são embaralhadas e exibidas nos cards de curiosidades
export const CURIOSITY_STORY_IMAGES = [
    'https://i.postimg.cc/g2HPZXvW/Whats-App-Image-2025-11-15-at-17-46-43.jpg', // Ponte/Rio
    'https://i.postimg.cc/t4jjJtnS/Whats-App-Image-2025-11-24-at-17-39-45.jpg', // Uvas/Vinho
    'https://i.postimg.cc/rwkksCRh/Whats-App-Image-2025-11-24-at-17-39-46.jpg', // Pôr do Sol
    'https://i.postimg.cc/fRNNyjS8/Whats-App-Image-2025-11-24-at-17-39-47.jpg', // Rio
    'https://i.postimg.cc/DwPKXJ1Q/Whats-App-Image-2025-11-24-at-17-39-48.jpg', // Turismo
];

/* 
  =============================================================================
  2. CONFIGURAÇÕES DE LINKS E VÍDEOS
  =============================================================================
*/

// VÍDEOS DE INSTRUÇÃO (YOUTUBE EMBED)
// REMOVIDO ?autoplay=1 para evitar conflitos com o modal que já adiciona isso.
export const DRONE_VIDEO_URL = 'https://www.youtube.com/embed/VWjqZrhIP2A?autoplay=1';
export const SAFE_VIDEO_URL = 'https://www.youtube.com/embed/n5H07VAzujY'; // NOVO ID (Cofre)
export const LOCK_VIDEO_URL = 'https://www.youtube.com/embed/d05nDY1YIEQ'; // NOVO ID (Fechadura)

export const WIFI_SSID = 'Flat_Petrolina_5G';
// export const WIFI_PASS = "REMOVIDO_POR_SEGURANCA"; // Agora vem do Banco de Dados via API
export const FLAT_ADDRESS = 'R. São José, 475 - Centro, Petrolina - PE, 56302-270'; // Endereço Real
export const GOOGLE_REVIEW_LINK =
    'https://search.google.com/local/writereview?placeid=ChIJz0sHkXpxcwcRwekJL9cyLjY';
export const HOST_PHONE = '5587988283273'; // Flats Integração (Geral)
export const LILI_PHONE = '5587988342138'; // Número da Lili (Específico para o Flat da Lili)

// TOKEN DO TINYURL (ENCURTADOR) - REMOVIDO (Sistema próprio de Short Links)
// export const TINY_URL_TOKEN = import.meta.env?.VITE_TINY_URL_TOKEN || "";

/*
  =============================================================================
  CONFIGURAÇÃO DE TEMPO (TIME SHIELD)
  =============================================================================
*/
export const USE_OFFICIAL_TIME = true;

import { logger } from './utils/logger';
export const fetchOfficialTime = async (): Promise<Date> => {
    if (!USE_OFFICIAL_TIME) return new Date();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo', {
            signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            return new Date(data.datetime);
        }
    } catch (_error) {
        logger.warn('Falha ao buscar hora oficial, usando hora local.');
    }
    return new Date();
};

/*
  =============================================================================
  3. O CÉREBRO DO CONCIERGE (O ROTEIRO DA IA)
  =============================================================================
*/
export const DEFAULT_SYSTEM_INSTRUCTION = `
Você é um concierge virtual útil e educado de um flat de aluguel por temporada.
Seu objetivo é ajudar o hóspede com dúvidas sobre a estadia.
Se você não souber uma informação específica, peça gentilmente para o hóspede contatar o anfitrião.
`;

/*
  =============================================================================
  9. CURIOSIDADES DA CIDADE (DID YOU KNOW?)
  =============================================================================
*/
export const DEFAULT_CITY_CURIOSITIES: string[] = [
    'Petrolina fica no coração do semiárido, mas graças ao Rio São Francisco e aos projetos de irrigação, virou uma das maiores produtoras de frutas do Brasil.',
    'Mais de 90% da uva e manga exportadas pelo Brasil passam pelo Vale do São Francisco — e Petrolina é o centro disso tudo.',
    'O Vale do São Francisco, junto com algumas regiões desérticas da Austrália, está entre os poucos lugares do mundo que produzem vinho em clima tropical semiárido.',
    'Aqui a videira (uva) chega a render 2 a 3 safras por ano, enquanto na Europa é apenas uma.',
    'Nos últimos anos, Petrolina sempre aparece entre as cidades que mais crescem no Nordeste, especialmente em renda, agro e turismo.',
    "O aeroporto se chama 'Senador Nilo Coelho' e é tão importante que virou ponto de apoio aéreo para o exército e para voos de carga agrícola.",
    'Vista de cima, a Catedral Sagrado Coração de Jesus tem o desenho certinho de uma cruz — e 57 vitrais franceses.',
    "Foi planejada para ser referência nacional. Nos anos 1970, o governo tratou Petrolina como 'cidade-modelo do sertão': avenidas largas, irrigação e agro industrializado.",
    'As bodegas antigas deram origem ao Bodódromo. Antes de ser um polo gastronômico, eram barracas populares de carne de bode espalhadas pela cidade.',
    'A ponte Presidente Dutra uniu dois estados. Ela liga Petrolina (PE) a Juazeiro (BA) e transformou a economia da região. Antes dela, tudo era feito por barquinhos.',
    'Transporte Coletivo Fluvial: Mesmo com toda modernidade, Petrolina e Juazeiro ainda mantêm as tradicionais barquinhas fazendo a travessia pelo Velho Chico.',
    'O São João de Petrolina é um dos maiores do Nordeste! Cresceu tanto que hoje disputa de igual pra igual com Caruaru e Campina Grande.',
    'A barragem de Sobradinho mudou o nível do rio. Quando o lago encheu, o nível do São Francisco subiu de 12 a 15 metros, mudando completamente o cenário.',
    'A Embrapa Semiárido fica aqui e é referência mundial em pesquisa para agricultura no clima seco.',
    'Um dos melhores pôr do sol do Nordeste. A orla de Petrolina tem aquele pôr do sol dourado que parece de filme.',
    'O vinho daqui tem notas diferentes. As uvas amadurecem mais rápido, resultando em vinhos com mais corpo e sabor frutado.',
    'Petrolina já foi tema de livro e estudo internacional. Pesquisadores analisam como uma cidade no sertão virou referência mundial em irrigação.',
    'A cultura do vaqueiro é muito forte. Eventos, vaquejadas, festas tradicionais e músicas mantêm vivas as tradições sertanejas antigas.',
    "O São Francisco é chamado de 'rio da integração nacional' e Petrolina é um dos pontos onde essa integração mais se sente — social e economicamente.",
    'Ivete Sangalo nasceu em Juazeiro e desde pequena já mostrava o brilho que depois conquistou o Brasil. Cresceu perto do Rio São Francisco e sempre fala com orgulho do Vale.',
    'João Gomes também é filho do Vale e começou cantando dentro de casa até virar fenômeno nacional. Sua voz grave lembra os cantadores antigos.',
    'Léo Foguete é de Petrolina e ganhou esse apelido pela força e explosão no palco, representando a nova geração de artistas do sertão.',
    'Geraldo Azevedo nasceu em Petrolina e transformou o São Francisco em poesia. Sua música mistura forró, frevo e MPB.',
    "Targino Gondim é de Juazeiro e ficou conhecido pela sanfona afinada e pelo sorriso fácil. É dele a famosa música 'Esperando na Janela'.",
    'Grande parte da novela Amores Roubados foi gravada em Petrolina, Juazeiro e nas vinícolas do Vale do São Francisco.',
    "A canção 'Petrolina-Juazeiro', de Jorge de Altinho, transformou o verso 'Eu gosto de Juazeiro, mas eu adoro Petrolina' em símbolo da união das duas cidades.",
];
