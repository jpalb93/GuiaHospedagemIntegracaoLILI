
import { PlaceRecommendation, BlockedGuest } from './types';
import { 
  Zap, Tv, Wind, Key, Wifi, Fan, Bed, Lightbulb, 
  Shirt, ShowerHead, Sparkles, Coffee, Gamepad2, 
  Flame, Clock, Heart, Palette, AlertTriangle, Sofa, Droplets
} from 'lucide-react';

/* 
  =============================================================================
  1. ÁLBUM DE FOTOS (CENTRAL DE IMAGENS)
  Aqui você altera todas as fotos estáticas do site.
  =============================================================================
*/

// --- CAPA DO SITE (HERO) ---
export const HERO_IMAGE_URL = "https://i.postimg.cc/JnkG03mm/5930cc64_fdef_4d4a_b6ba_a8380fde40de.jpg"; 
export const HERO_IMAGE_2_URL = "https://i.postimg.cc/HWK5mRBG/Whats-App-Image-2025-11-15-at-17-46-43.jpg";
export const HERO_IMAGE_3_URL = "https://i.postimg.cc/XvJHhts5/Gemini-Generated-Image-qgzulyqgzulyqgzu.png";

// --- GALERIA DA LANDING PAGE (Página da Lili) ---
export const LANDING_GALLERY_IMAGES = [
  "https://i.postimg.cc/JnkG03mm/5930cc64-fdef-4d4a-b6ba-a8380fde40de.jpg",
  "https://i.postimg.cc/vBVcT7M8/78e0984d-5800-4027-9578-e43b4de1815a.jpg",
  "https://i.postimg.cc/nzDCrKZn/aca338a7-c3f0-4838-90bf-4639fde2d2c4.jpg",
  "https://i.postimg.cc/50C6y514/d98177da-7250-456d-bd58-b4f9dfcebec7-1.jpg",
  "https://i.postimg.cc/Ls7JmQdM/dda93871-f7aa-4867-a0bd-49d59319fd64.jpg"
];

// --- SLIDESHOW DA LANDING PAGE (Fundo do Título) ---
export const LANDING_HERO_SLIDES = [
  "https://i.postimg.cc/4dZ1Q3dN/Whats-App-Image-2025-11-15-at-17-43-54.jpg",
  "https://i.postimg.cc/MTDmP8Mw/Whats-App-Image-2025-11-15-at-17-46-43.jpg"
];

// --- IMAGENS DOS STORIES (CURIOSIDADES DE PETROLINA) ---
// Estas imagens são embaralhadas e exibidas nos cards de curiosidades
export const CURIOSITY_STORY_IMAGES = [
  "https://i.postimg.cc/g2HPZXvW/Whats-App-Image-2025-11-15-at-17-46-43.jpg", // Ponte/Rio
  "https://i.postimg.cc/t4jjJtnS/Whats-App-Image-2025-11-24-at-17-39-45.jpg", // Uvas/Vinho
  "https://i.postimg.cc/rwkksCRh/Whats-App-Image-2025-11-24-at-17-39-46.jpg", // Pôr do Sol
  "https://i.postimg.cc/fRNNyjS8/Whats-App-Image-2025-11-24-at-17-39-47.jpg", // Rio
  "https://i.postimg.cc/DwPKXJ1Q/Whats-App-Image-2025-11-24-at-17-39-48.jpg"  // Turismo
];

// --- IMAGENS DOS STORIES (DICAS ÚTEIS DO FLAT) ---
// Substitua os links abaixo pelas fotos reais quando tiver.
export const TIPS_IMAGES = {
  foto_arte: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_caixinha_checkout: "https://i.postimg.cc/vHR7g4F4/selfcheckout.jpg", // FOTO REAL DA CAIXINHA
  foto_wifi: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_ventilador: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_travesseiro: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_cama: "https://i.postimg.cc/L8Z34zkx/06-foto-cama.jpg",
  foto_tomada: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_led: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_fechadura: "https://i.postimg.cc/MpjmZy0t/09-foto-fechadura.jpg",
  foto_lavanderia: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_bagunca: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_chuveiro: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_colchao: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_sofa: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_cafe: "https://i.postimg.cc/kgtvMxNj/15-foto-cafe.jpg",
  foto_jogos: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_tv: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_quebrou: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_ar_condicionado: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_agua: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_fogao: "https://i.postimg.cc/rwtNySGn/21-foto-fogao.jpg",
  foto_limpeza: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_relogio: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg",
  foto_vibe: "https://i.postimg.cc/2SB7j4d2/17-foto-tv.jpg"
};

// --- CONTEÚDO DOS STORIES DE DICAS (TEXTOS DA LILI) ---
export const FLAT_TIPS = [
  {
      id: 'tip-art',
      type: 'curiosity',
      title: 'Arte do Vale 🎨',
      subtitle: 'Decoração',
      content: 'Viu aquele quadro de barro bem lindão na sala? É inspirado em Ana das Carrancas, um ícone daqui do Vale - rainha absoluta do barro e da resistência. Ele é delicado, feito com amor e história... então trate com carinho.',
      icon: Palette, 
      image: TIPS_IMAGES.foto_arte 
  },
  {
      id: 'tip-checkout',
      type: 'curiosity',
      title: 'Hora de (infelizmente) dar tchau?👋',
      subtitle: 'Self Checkout',
      content: 'Self Checkout do jeitinho fácil. Na hora de ir embora, só trancar a porta e colocar a chave na caixinha "Self Checkout". Sem drama, sem cerimônia, sem novela mexicana.',
      icon: Key,
      image: TIPS_IMAGES.foto_caixinha_checkout 
  },
  {
      id: 'tip-wifi',
      type: 'curiosity',
      title: 'Wi-Fi Turbo 🚀',
      subtitle: 'Internet',
      content: 'Wi-Fi voando. O sinal é tão rápido que dá até pra mandar vídeo pra mãe, postar selfie e ainda stalkear o ex ao mesmo tempo.',
      icon: Wifi,
      image: TIPS_IMAGES.foto_wifi
  },
  {
      id: 'tip-fan',
      type: 'curiosity',
      title: 'Pequeno Notável 🌪️',
      subtitle: 'Ventilador',
      content: 'O ventilador pode até ser pequenininho, mas pense num bichinho potente! Liga ele pra sentir a brisa - é o famoso "não faz tamanho, mas faz estrago".',
      icon: Fan,
      image: TIPS_IMAGES.foto_ventilador 
  },
  {
      id: 'tip-pillows',
      type: 'curiosity',
      title: 'Nuvem ou Abraço? ☁️',
      subtitle: 'Conforto',
      content: 'Travesseiros: maciozinhos como abraço de vó. Escolha o seu preferido e durma como um anjo cansado.',
      icon: Bed,
      image: TIPS_IMAGES.foto_travesseiro 
  },
  {
      id: 'tip-bedding',
      type: 'curiosity',
      title: 'Cheirinho de Limpo ✨',
      subtitle: 'Cama',
      content: 'Roupas de cama: só deite e aproveite. Foram lavadas com carinho e cheirinho de "você merece descanso".',
      icon: Sparkles,
      image: TIPS_IMAGES.foto_cama 
  },
  {
      id: 'tip-outlets',
      type: 'curiosity',
      title: 'Energia 220V ⚡',
      subtitle: 'Voltagem',
      content: 'Tomadas estratégicas: Carregue seus sonhos, ops… seus eletrônicos. Mas lembra: aqui é 220v! Nada de explodir as coisas.',
      icon: Zap,
      image: TIPS_IMAGES.foto_tomada 
  },
  {
      id: 'tip-led',
      type: 'curiosity',
      title: 'Magic LED 🪄',
      subtitle: 'Iluminação',
      content: 'Aqui não é Big Brother, viu? Aquele botãozinho ao lado da coifa é sensor de led. Quer mudar a luz? Da uma passadinha de mão e ele acende, apaga ou fica todo charmoso pra você!',
      icon: Lightbulb,
      image: TIPS_IMAGES.foto_led 
  },
  {
      id: 'tip-lock',
      type: 'curiosity',
      title: 'Abre-te Sésamo 🔑',
      subtitle: 'Acesso',
      content: 'Se a fechadura resolver fazer charme e você esquecer a senha ou ela não abrir de primeira, é só me chamar. Eu abro a distância rapidinho. Quase mágica, só que sem a varinha.',
      icon: Key,
      image: TIPS_IMAGES.foto_fechadura 
  },
  {
      id: 'tip-laundry',
      type: 'curiosity',
      title: 'Lave e Seque 🧺',
      subtitle: 'Roupas',
      content: 'A máquina de lavar está aposentada. Mas relaxe: bem na esquina tem várias lavanderias self service prontinhas pra salvar suas roupas.',
      icon: Shirt,
      image: TIPS_IMAGES.foto_lavanderia 
  },
  {
      id: 'tip-mess',
      type: 'curiosity',
      title: 'Organização Express 🧹',
      subtitle: 'Bagunça',
      content: 'Bagunça criativa? Pode! Só lembra de dar um jeitinho antes de ir embora - o flat é desapegado, mas gosta de uma boa "organização express".',
      icon: Sparkles,
      image: TIPS_IMAGES.foto_bagunca 
  },
  {
      id: 'tip-shower',
      type: 'curiosity',
      title: 'Banho Sem Tostar 🚿',
      subtitle: 'Chuveiro',
      content: 'Aqui em Petrolina faz calor de 40ºC, viu? Então deixe o chuveiro no modo 1 pra não sair do banho "tostadinho".',
      icon: ShowerHead,
      image: TIPS_IMAGES.foto_chuveiro 
  },
  {
      id: 'tip-mattress',
      type: 'curiosity',
      title: 'Colchão de Rei 👑',
      subtitle: 'Cuidado',
      content: 'O colchão é novo, caro e um xodó do flat. Então, por favorzinho: nada de passar ferro por cima dele. A espuma agradece e continua fofinha pra você dormir como um anjinho.',
      icon: Bed,
      image: TIPS_IMAGES.foto_colchao 
  },
  {
      id: 'tip-sofa',
      type: 'curiosity',
      title: 'Modo Luxo Oculto 🛋️',
      subtitle: 'Sofá-cama',
      content: 'Sofá-cama esperto: Puxe o encosto pra frente e ele se transforma. Quer upgrade de conforto? Tem um pillow top te esperando embaixo da cama — praticamente um "modo luxo" escondido.',
      icon: Sofa,
      image: TIPS_IMAGES.foto_sofa 
  },
  {
      id: 'tip-coffee',
      type: 'curiosity',
      title: 'Combustível Diário ☕',
      subtitle: 'Café',
      content: 'Café? Claro que tem! Tem pó de café esperando por você. Use sem medo, aqui todo mundo é movido a cafeína mesmo.',
      icon: Coffee,
      image: TIPS_IMAGES.foto_cafe 
  },
  {
      id: 'tip-games',
      type: 'curiosity',
      title: 'Desconecte-se 🎲',
      subtitle: 'Lazer',
      content: 'Livrinhos e jogos. Tem livros e joguinhos pra quem quiser desligar do celular e ativar o cérebro (ou perder pro colega e fingir que não ficou com raiva).',
      icon: Gamepad2,
      image: TIPS_IMAGES.foto_jogos 
  },
  {
      id: 'tip-voltage-2',
      type: 'curiosity',
      title: 'Modo Potência 💥',
      subtitle: '220V',
      content: 'Energia 220V. Aqui é no modo potência, bebê. Confere seus aparelhos antes de ligar pra eles não virarem churrasquinho.',
      icon: Zap,
      image: TIPS_IMAGES.foto_tomada 
  },
  {
      id: 'tip-tv',
      type: 'curiosity',
      title: 'Cine Flat 🎬',
      subtitle: 'TV e Streaming',
      content: 'A TV já está no Wi-Fi! Quer maratonar série? Pode! Mas lembre-se: o streaming é por sua conta, viu? Não esquece de deslogar… senão eu descubro que você assiste novela turca escondida.',
      icon: Tv,
      image: TIPS_IMAGES.foto_tv 
  },
  {
      id: 'tip-breakage',
      type: 'curiosity',
      title: 'Sem Pânico 😬',
      subtitle: 'Acidentes',
      content: 'Se alguma coisa quebrar, não se preocupe. Só me avise! Prometo que não viro monstro, não brigo e não rodo a baiana.',
      icon: AlertTriangle,
      image: TIPS_IMAGES.foto_quebrou 
  },
  {
      id: 'tip-ac-eff',
      type: 'curiosity',
      title: 'Frio Eficiente ❄️',
      subtitle: 'Ar Condicionado',
      content: 'Porta e janela fechadas = frio eficiente. Saiu do flat? Desliga. Climatizar vento é desperdício e não refresca nem alma nem bolso.',
      icon: Wind,
      image: TIPS_IMAGES.foto_ar_condicionado 
  },
  {
      id: 'tip-checkout-2',
      type: 'curiosity',
      title: 'Sem Burocracia ✅',
      subtitle: 'Saída',
      content: 'Checkout simples: Trancou a porta, colocou a chave na caixinha "Self Checkout"... e pronto. Sem burocracia.',
      icon: Key,
      image: TIPS_IMAGES.foto_caixinha_checkout 
  },
  {
      id: 'tip-ac-warrior',
      type: 'curiosity',
      title: 'O Guerreiro 🛡️',
      subtitle: 'Ar Antigo',
      content: 'O ar condicionado é antigo, mas funciona como um verdadeiro guerreiro. Só um pedido: não deixe portas e janelas abertas, senão ele começa a suar (vulgo pingar). Ah, e quando você desligar, ele tem um delayzinho… é o tempo dele dizer “tô indo, calma aí”.',
      icon: Wind,
      image: TIPS_IMAGES.foto_ar_condicionado 
  },
  {
      id: 'tip-water',
      type: 'curiosity',
      title: 'Ouro Líquido 💧',
      subtitle: 'Água',
      content: 'Água é ouro por aqui: tome banho gostoso, mas sem virar sereia! Aqui a água é amor e merece cuidado.',
      icon: Droplets,
      image: TIPS_IMAGES.foto_agua 
  },
  {
      id: 'tip-stove',
      type: 'curiosity',
      title: 'MasterChef 🍳',
      subtitle: 'Cozinha',
      content: 'Fogão? Pode usar: Só não esqueça aquela panela no fogo enquanto vai "só dar uma olhadinha" no Instagram... o café vira carvão!',
      icon: Flame,
      image: TIPS_IMAGES.foto_fogao 
  },
  {
      id: 'tip-clean',
      type: 'curiosity',
      title: 'Casa Feliz ✨',
      subtitle: 'Limpeza',
      content: 'Casa limpa é casa feliz: Deu aquela derrubadinha básica de cuscuz? Uma passadinha rápida com o pano resolve tudo. O flat ama esse carinho.',
      icon: Sparkles,
      image: TIPS_IMAGES.foto_limpeza 
  },
  {
      id: 'tip-time',
      type: 'curiosity',
      title: 'Relógio Suíço ⏰',
      subtitle: 'Pontualidade',
      content: 'Check-in e check-out sem drama. Chegue no horário e vá no horário. Assim um hóspede sai feliz e o outro entra feliz também. Todo mundo ganha!',
      icon: Clock,
      image: TIPS_IMAGES.foto_relogio 
  },
  {
      id: 'tip-vibe',
      type: 'curiosity',
      title: 'Sinta-se em Casa ❤️',
      subtitle: 'Boas-vindas',
      content: 'O Flat de Lili te ama - cuide dele como se fosse seu. Abra a janela, deixe a luz entrar, respire, relaxe. Aqui a vibe é boa porque você faz parte dela.',
      icon: Heart,
      image: TIPS_IMAGES.foto_vibe 
  }
];

/* 
  =============================================================================
  2. CONFIGURAÇÕES DE LINKS E VÍDEOS
  =============================================================================
*/

// VÍDEOS DE INSTRUÇÃO (YOUTUBE EMBED)
// REMOVIDO ?autoplay=1 para evitar conflitos com o modal que já adiciona isso.
export const DRONE_VIDEO_URL = "https://www.youtube.com/embed/qACw10uUSeo";
export const SAFE_VIDEO_URL = "https://www.youtube.com/embed/cFD68mZO9bY"; // NOVO ID (Cofre)
export const LOCK_VIDEO_URL = "https://www.youtube.com/embed/slW_3OZdT20"; // NOVO ID (Fechadura)

// BLACKLIST / BLOQUEIO DE HÓSPEDES
export const BLOCKED_LIST: BlockedGuest[] = [];
export const EXTERNAL_BLOCKLIST_URL = "";

export const WIFI_SSID = "Flat_Petrolina_5G";
export const WIFI_PASS = "visitante123"; // Mude aqui a senha real
export const FLAT_ADDRESS = "R. São José, 475 - Centro, Petrolina - PE, 56302-270"; // Endereço Real
export const GOOGLE_REVIEW_LINK = 'https://search.google.com/local/writereview?placeid=ChIJz0sHkXpxcwcRwekJL9cyLjY';
export const HOST_PHONE = "5587988342138"; // Número da Lili

// TOKEN DO TINYURL (ENCURTADOR)
// Configure a variável VITE_TINY_URL_TOKEN no .env.local
export const TINY_URL_TOKEN = import.meta.env?.VITE_TINY_URL_TOKEN || "";

/*
  =============================================================================
  CONFIGURAÇÃO DE TEMPO (TIME SHIELD)
  =============================================================================
*/
export const USE_OFFICIAL_TIME = true; 

export const fetchOfficialTime = async (): Promise<Date> => {
  if (!USE_OFFICIAL_TIME) return new Date();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 
    
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
  4. CATEGORIAS DE RESTAURANTES E BARES
  =============================================================================
*/

export const BURGERS: PlaceRecommendation[] = [
  {
    name: "BurgerMill",
    description: "Hambúrguer artesanal de qualidade no centro da cidade.",
    tags: ["Hambúrguer", "Artesanal"],
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop", 
    phoneNumber: "5587988775721",
    address: "Rua João Alfredo, Centro – Petrolina/PE",
    distance: "900m"
  },
  {
    name: "McDonald's",
    description: "O clássico fast-food que todo mundo conhece.",
    tags: ["Fast Food", "Shopping"],
    imageUrl: "https://images.unsplash.com/photo-1616361675252-64026687f636?q=80&w=800&auto=format&fit=crop", 
    phoneNumber: "558738617419",
    address: "River Shopping - Petrolina/PE",
    distance: "950m"
  },
  {
    name: "Subway",
    description: "Sanduíches feitos na hora, do seu jeito.",
    tags: ["Sanduíche", "Saudável"],
    imageUrl: "https://images.unsplash.com/photo-1625657736782-9032a2d6eb20?q=80&w=800&auto=format&fit=crop", 
    phoneNumber: "558738617635",
    address: "River Shopping - Petrolina/PE",
    distance: "950m"
  },
  {
    name: "Bob's",
    description: "Milkshakes famosos e hambúrgueres.",
    tags: ["Fast Food", "Milkshake"],
    imageUrl: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800&auto=format&fit=crop", 
    phoneNumber: "5574991357980",
    address: "Rua Francisco de Assis Cavalcanti, Colônia Imperial",
    distance: "1,4km"
  },
  {
    name: "Lumberjack Smash Burguer",
    description: "Smash burguer suculento na brasa.",
    tags: ["Smash Burguer", "Artesanal"],
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop", 
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

export const SKEWERS: PlaceRecommendation[] = [];
export const SALADS: PlaceRecommendation[] = [];
export const PASTA: PlaceRecommendation[] = [];
export const ORIENTAL: PlaceRecommendation[] = [];

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

export const SELF_SERVICE: PlaceRecommendation[] = [];

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

export const SNACKS: PlaceRecommendation[] = [];

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
export const DEFAULT_CITY_CURIOSITIES: string[] = [
  "Petrolina fica no coração do semiárido, mas graças ao Rio São Francisco e aos projetos de irrigação, virou uma das maiores produtoras de frutas do Brasil.",
  "Mais de 90% da uva e manga exportadas pelo Brasil passam pelo Vale do São Francisco — e Petrolina é o centro disso tudo.",
  "O Vale do São Francisco, junto com algumas regiões desérticas da Austrália, está entre os poucos lugares do mundo que produzem vinho em clima tropical semiárido.",
  "Aqui a videira (uva) chega a render 2 a 3 safras por ano, enquanto na Europa é apenas uma.",
  "Nos últimos anos, Petrolina sempre aparece entre as cidades que mais crescem no Nordeste, especialmente em renda, agro e turismo.",
  "O aeroporto se chama 'Senador Nilo Coelho' e é tão importante que virou ponto de apoio aéreo para o exército e para voos de carga agrícola.",
  "Vista de cima, a Catedral Sagrado Coração de Jesus tem o desenho certinho de uma cruz — e 57 vitrais franceses.",
  "Foi planejada para ser referência nacional. Nos anos 1970, o governo tratou Petrolina como 'cidade-modelo do sertão': avenidas largas, irrigação e agro industrializado.",
  "As bodegas antigas deram origem ao Bodódromo. Antes de ser um polo gastronômico, eram barracas populares de carne de bode espalhadas pela cidade.",
  "A ponte Presidente Dutra uniu dois estados. Ela liga Petrolina (PE) a Juazeiro (BA) e transformou a economia da região. Antes dela, tudo era feito por barquinhos.",
  "Transporte Coletivo Fluvial: Mesmo com toda modernidade, Petrolina e Juazeiro ainda mantêm as tradicionais barquinhas fazendo a travessia pelo Velho Chico.",
  "O São João de Petrolina é um dos maiores do Nordeste! Cresceu tanto que hoje disputa de igual pra igual com Caruaru e Campina Grande.",
  "A barragem de Sobradinho mudou o nível do rio. Quando o lago encheu, o nível do São Francisco subiu de 12 a 15 metros, mudando completamente o cenário.",
  "A Embrapa Semiárido fica aqui e é referência mundial em pesquisa para agricultura no clima seco.",
  "Um dos melhores pôr do sol do Nordeste. A orla de Petrolina tem aquele pôr do sol dourado que parece de filme.",
  "O vinho daqui tem notas diferentes. As uvas amadurecem mais rápido, resultando em vinhos com mais corpo e sabor frutado.",
  "Petrolina já foi tema de livro e estudo internacional. Pesquisadores analisam como uma cidade no sertão virou referência mundial em irrigação.",
  "A cultura do vaqueiro é muito forte. Eventos, vaquejadas, festas tradicionais e músicas mantêm vivas as tradições sertanejas antigas.",
  "O São Francisco é chamado de 'rio da integração nacional' e Petrolina é um dos pontos onde essa integração mais se sente — social e economicamente.",
  "Ivete Sangalo nasceu em Juazeiro e desde pequena já mostrava o brilho que depois conquistou o Brasil. Cresceu perto do Rio São Francisco e sempre fala com orgulho do Vale.",
  "João Gomes também é filho do Vale e começou cantando dentro de casa até virar fenômeno nacional. Sua voz grave lembra os cantadores antigos.",
  "Léo Foguete é de Petrolina e ganhou esse apelido pela força e explosão no palco, representando a nova geração de artistas do sertão.",
  "Geraldo Azevedo nasceu em Petrolina e transformou o São Francisco em poesia. Sua música mistura forró, frevo e MPB.",
  "Targino Gondim é de Juazeiro e ficou conhecido pela sanfona afinada e pelo sorriso fácil. É dele a famosa música 'Esperando na Janela'.",
  "Grande parte da novela Amores Roubados foi gravada em Petrolina, Juazeiro e nas vinícolas do Vale do São Francisco.",
  "A canção 'Petrolina-Juazeiro', de Jorge de Altinho, transformou o verso 'Eu gosto de Juazeiro, mas eu adoro Petrolina' em símbolo da união das duas cidades."
];
