import { PlaceRecommendation, BlockedGuest } from './types';

/* 
  =============================================================================
  1. CONFIGURAÇÕES BÁSICAS DO FLAT
  =============================================================================
*/
// IMAGEM DO TOPO (CAPA DO SITE) - Imagem 1 (Cozinha/Sala)
export const HERO_IMAGE_URL = "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"; 
// IMAGEM DO TOPO - Imagem 2 (Quarto/Outro ângulo)
export const HERO_IMAGE_2_URL = "https://i.postimg.cc/HWK5mRBG/Whats-App-Image-2025-11-15-at-17-46-43.jpg";
export const HERO_IMAGE_3_URL = "https://i.postimg.cc/XvJHhts5/Gemini-Generated-Image-qgzulyqgzulyqgzu.png";

// VÍDEOS DE INSTRUÇÃO (YOUTUBE)
// ATENÇÃO: Para funcionar no modal, o link DEVE conter "/embed/" e não "/shorts/" ou "/watch"
export const DRONE_VIDEO_URL = "https://www.youtube.com/embed/qACw10uUSeo?autoplay=1";
export const SAFE_VIDEO_URL = "https://www.youtube.com/embed/cFD68mZO9bY?autoplay=1"; // ID corrigido
export const LOCK_VIDEO_URL = "https://www.youtube.com/embed/slW_3OZdT20?autoplay=1"; // ID corrigido (do short original)

// BLACKLIST / BLOQUEIO DE HÓSPEDES
export const BLOCKED_LIST: BlockedGuest[] = [];
export const EXTERNAL_BLOCKLIST_URL = "";

export const WIFI_SSID = "Flat_Petrolina_5G";
export const WIFI_PASS = "visitante123"; // Mude aqui a senha real
export const FLAT_ADDRESS = "R. São José, 475 - Centro, Petrolina - PE, 56302-270"; // Endereço Real
export const GOOGLE_REVIEW_LINK = 'https://search.google.com/local/writereview?placeid=ChIJz0sHkXpxcwcRwekJL9cyLjY';
export const HOST_PHONE = "5587988342138"; // Número da Lili

// TOKEN DO TINYURL (ENCURTADOR) - COLE SEU TOKEN AQUI DENTRO DAS ASPAS
export const TINY_URL_TOKEN = "rJ2w893q3CakqdlxuKiPq20lwshLe6WbB25ufglw7NYA9HlRpuwanTNXGBTS"; 

/*
  =============================================================================
  CONFIGURAÇÃO DE TEMPO (TIME SHIELD)
  =============================================================================
*/
// true = Usa hora da internet (Seguro). false = Usa hora do computador (Testes).
export const USE_OFFICIAL_TIME = true; 

// Função Helper para pegar a hora oficial em toda a aplicação
export const fetchOfficialTime = async (): Promise<Date> => {
  if (!USE_OFFICIAL_TIME) return new Date();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
    
    const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return new Date(data.datetime);
    }
  } catch (error) {
    console.warn("Falha ao buscar hora oficial, usando hora local.");
  }
  return new Date(); // Fallback para hora local
};

/*
  =============================================================================
  2. O CÉREBRO DO CONCIERGE (O ROTEIRO DA IA)
  =============================================================================
*/
// BACKUP GENÉRICO (O TEXTO PRINCIPAL DEVE SER CONFIGURADO NO CMS)
export const DEFAULT_SYSTEM_INSTRUCTION = `
Você é um concierge virtual útil e educado de um flat de aluguel por temporada.
Seu objetivo é ajudar o hóspede com dúvidas sobre a estadia.
Se você não souber uma informação específica, peça gentilmente para o hóspede contatar o anfitrião.
`;

/*
  =============================================================================
  3. CATEGORIAS DE RESTAURANTES E BARES
  =============================================================================
*/

export const BURGERS: PlaceRecommendation[] = [
  {
    name: "BurgerMill",
    description: "Hambúrguer artesanal de qualidade no centro da cidade.",
    tags: ["Hambúrguer", "Artesanal"],
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", // Genérica
    phoneNumber: "5587988775721",
    address: "Rua João Alfredo, Centro – Petrolina/PE",
    distance: "900m"
  },
  {
    name: "McDonald's",
    description: "O clássico fast-food que todo mundo conhece.",
    tags: ["Fast Food", "Shopping"],
    imageUrl: "https://images.unsplash.com/photo-1616361675252-64026687f636?q=80&w=800&auto=format&fit=crop", // Genérica
    phoneNumber: "558738617419",
    address: "River Shopping - Petrolina/PE",
    distance: "950m"
  },
  {
    name: "Subway",
    description: "Sanduíches feitos na hora, do seu jeito.",
    tags: ["Sanduíche", "Saudável"],
    imageUrl: "https://images.unsplash.com/photo-1625657736782-9032a2d6eb20?q=80&w=800&auto=format&fit=crop", // Genérica
    phoneNumber: "558738617635",
    address: "River Shopping - Petrolina/PE",
    distance: "950m"
  },
  {
    name: "Bob's",
    description: "Milkshakes famosos e hambúrgueres.",
    tags: ["Fast Food", "Milkshake"],
    imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800&auto=format&fit=crop", // Genérica
    phoneNumber: "5574991357980",
    address: "Rua Francisco de Assis Cavalcanti, Colônia Imperial",
    distance: "1,4km"
  },
  {
    name: "Lumberjack Smash Burguer",
    description: "Smash burguer suculento na brasa.",
    tags: ["Smash Burguer", "Artesanal"],
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", // Genérica
    phoneNumber: "5587991912327",
    address: "Av. da Integração, Caminho do sol",
    distance: "3,4km"
  },
  {
    name: "Villa Romana",
    description: "Pizzas deliciosas e hambúrgueres para matar a sua fome.",
    tags: ["Pizza", "Hamburger", "Delivery"],
    imageUrl: "https://i.postimg.cc/LXBtvmKK/villaromana.jpg",
    phoneNumber: "5587988524056",
    orderLink: "https://villaromanapizza.ccmpedidoonline.com.br",
    distance: "550m"
  }
];

export const SKEWERS: PlaceRecommendation[] = [
  // Adicione os espetinhos aqui
];

export const SALADS: PlaceRecommendation[] = [
  // Adicione as saladas aqui
];

export const PASTA: PlaceRecommendation[] = [
  // Adicione as massas aqui
];

export const ORIENTAL: PlaceRecommendation[] = [
  // Adicione comida japonesa/chinesa aqui
];

export const ALA_CARTE: PlaceRecommendation[] = [
  {
    name: "Bodódromo",
    description: "Não é um restaurante, é um ponto turístico! Vários restaurantes servindo o melhor bode assado do mundo.",
    tags: ["Imperdível", "Carne de Bode", "Almoço/Jantar"],
    imageUrl: "https://i.postimg.cc/x8TrCFjC/bododromo.jpg", 
    address: "Av. São Gonçalo, Areia Branca",
    distance: "2.5 km (Uber/Carro)"
  },
  {
    name: "Casa Brasilis Bar e Restaurante",
    description: "Um vibrante bar e restaurante com a essência da cultura brasileira.",
    tags: ["Bar", "Restaurante"],
    imageUrl: "https://i.postimg.cc/WzbR3fpz/casabrasilis.jpg",
    address: "Av. da Integração, 671 - São José, Petrolina - PE",
    distance: "2 km"
  }
];

export const SELF_SERVICE: PlaceRecommendation[] = [
  // Adicione self-service aqui
];

export const BARS: PlaceRecommendation[] = [
  {
    name: "Haus Petrolina",
    description: "Gastrobar conhecido por seu chopp artesanal e pela vista para o Rio São Francisco.",
    tags: ["Bar", "Chopp"],
    imageUrl: "https://i.postimg.cc/cC4qH51L/hauspetrolina.jpg",
    address: "Av. Cardoso de Sá, 674 - Orla I, Petrolina - PE",
    distance: "800 m"
  }
];

/*
  =============================================================================
  4. LISTA DE CAFÉS E PADARIAS
  =============================================================================
*/
export const CAFES: PlaceRecommendation[] = [
  {
    name: "Pão Nosso",
    description: "A padaria sinônimo de tradição e qualidade!",
    tags: ["Padaria"],
    imageUrl: "https://i.postimg.cc/4db6wXkZ/paonosso.jpg",
    address: "Rua Doutor Júlio de Melo, Centro, N⁰478, Petrolina - PE",
    distance: "350 m"
  }
];

/*
  =============================================================================
  5. LISTA DE LANCHES E DELIVERY
  =============================================================================
*/
export const SNACKS: PlaceRecommendation[] = [
  // Se esvaziar esta lista, podemos remover o acordeão do site.
];

/*
  =============================================================================
  6. LISTA DE PASSEIOS / TURISMO
  =============================================================================
*/
export const ATTRACTIONS: PlaceRecommendation[] = [
  {
    name: "Vinícolas do Vale",
    description: "Você sabia que aqui produz vinho? O passeio nas vinícolas é chique e tem degustação.",
    tags: ["Enoturismo", "Passeio Pago", "Vinhos"],
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop",
    address: "Zona Rural (Consulte Agência)",
    distance: "20-40 km (Carro)"
  }
];

/*
  =============================================================================
  7. LISTA DE MERCADOS E FARMÁCIAS (ESSENCIAIS)
  =============================================================================
*/
export const ESSENTIALS: PlaceRecommendation[] = [
  {
    name: "Lorena Mercado Gourmet",
    description: "Mercado gourmet com a maior adega exclusiva do Vale, aberto 24h.",
    tags: ["Mercado", "Padaria", "Vinhos"],
    imageUrl: "https://i.postimg.cc/PqMR0QhY/lorenagourmet.jpg",
    address: "Av. Monsenhor Ângelo Sampaio, 499 - São José, Petrolina - PE",
    distance: "100m"
  },
  {
    name: "Frutos - Padaria, Hortifruti e Supermercado",
    description: "Mercado gourmet com padaria e hortifruti.",
    tags: ["Mercado", "Padaria"],
    imageUrl: "https://i.postimg.cc/s2JNb4y5/frutos.jpg",
    address: "Rua Dr. Júlio de Melo, 500 - Centro, Petrolina - PE",
    distance: "350m"
  },
  {
    name: "Drogasil (24 horas)",
    description: "Farmácia aberta 24 horas.",
    tags: ["Farmácia"],
    imageUrl: "https://i.postimg.cc/bvRB498Q/drogasil.jpg",
    address: "Av. Guararapes, 1972 - Centro, Petrolina - PE",
    distance: "900m"
  }
];

/*
  =============================================================================
  8. LISTA DE EMERGÊNCIA (SOS) - LOCAIS FÍSICOS
  * Os números 190, 192, 193 e 188 estão destacados no layout do site.
  * Coloque aqui apenas Hospitais, Clínicas ou Delegacias com endereço.
  =============================================================================
*/
export const EMERGENCY: PlaceRecommendation[] = [
  {
    name: "Hospital Unimed (Vale do São Francisco)",
    description: "Hospital particular de referência, atendimento 24h.",
    tags: ["Hospital", "Privado"],
    imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop",
    address: "Av. da Integração, 492 - Vila Eduardo, Petrolina - PE",
    distance: "2.5 km"
  }
];

/*
  =============================================================================
  9. CURIOSIDADES DA CIDADE (DID YOU KNOW?)
  =============================================================================
*/
// AGORA É DEFAULT_CITY_CURIOSITIES (BACKUP)
export const DEFAULT_CITY_CURIOSITIES: string[] = [
  "Petrolina fica no coração do semiárido, mas graças ao Rio São Francisco e à irrigação, virou um oásis verde.",
  "Mais de 90% da uva e manga exportadas pelo Brasil saem daqui do Vale do São Francisco.",
  "O Vale é uma das poucas regiões do mundo que produz vinho em clima tropical semiárido.",
  "Aqui a videira (uva) chega a render 2 a 3 safras por ano! Na Europa, é apenas uma.",
  "Petrolina é conhecida como a 'Califórnia Brasileira' devido à sua força na fruticultura.",
  "A Ilha do Fogo, no meio da ponte, é um dos melhores lugares para ver o pôr do sol no Rio.",
  "O Rio São Francisco é carinhosamente chamado de 'Velho Chico' pelos locais.",
  "Petrolina e Juazeiro (BA) são cidades irmãs, separadas apenas pela ponte Presidente Dutra.",
  "A carne de bode é tão famosa aqui que temos um complexo gastronômico só para ela: o Bodódromo.",
  "O clima aqui é quente o ano todo, com média de 300 dias de sol por ano.",
];