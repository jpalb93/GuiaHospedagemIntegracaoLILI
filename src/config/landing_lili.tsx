
import { Wind, Tv, Coffee, Shield, Wifi } from 'lucide-react';

export const LANDING_LILI_CONTENT = {
    hero: {
        title: "Flat de Lili",
        subtitle: "Seu refúgio de conforto e estilo no coração de Petrolina.",
        cta: "Ver Disponibilidade e Reservar"
    },
    about: {
        title: "Conheça o Flat",
        subtitle: "Um espaço pensado em cada detalhe para o seu máximo conforto e conveniência.",
        boxTitle: "Sobre o espaço",
        description: [
            "30 m² cheio de estilo, funcionalidade e economia. Um flat pequeno e fácil de organizar, que atende às suas necessidades. Quarto confortável com lençóis, alguns armários, arara, ar condicionado, TV e escrivaninha com teclado e mouse sem fio a sua disposição. Banheiro com box espaçoso, chuveiro com boa vazão, toalhas, shampoo, condicionador e sabonete. Sala de estar com TV 50\", streaming Paramount, cafeteira, chás, jogos de tabuleiro e livros para você aproveitar.",
            "A cozinha é bem equipada com tudo que você precisa: louça, talheres, panelas, purificador de água, microondas, liquidificador, sanduicheira, miniprocessador, etc. Na mini área de serviço, você encontrará produtos de limpeza, tanque de lavar roupa e varal retrátil."
        ]
    },
    amenities: [
        {
            id: "banheiro",
            title: "Banheiro",
            icon: <div className="text-amber-700"><img width="24" height="24" src="https://img.icons8.com/ios/50/shower.png" alt="shower" style={{ filter: "sepia(100%) hue-rotate(350deg) saturate(500%)" }} /></div>,
            items: [
                "Secador de cabelo",
                "Produtos de limpeza",
                "Xampu e Condicionador",
                "Sabonete para o corpo",
                "Água quente"
            ]
        },
        {
            id: "quarto",
            title: "Quarto e lavanderia",
            icon: <Wind className="text-amber-700" />,
            items: [
                "Básico (Toalhas, lençóis, sabonete e papel higiênico)",
                "Cabides e Guarda-roupa",
                "Roupa de cama e Cobertores",
                "Blackout nas cortinas",
                "Ferro de passar e Varal"
            ]
        },
        {
            id: "entretenimento",
            title: "Entretenimento",
            icon: <Tv className="text-amber-700" />,
            items: [
                "HDTV 50\" com Streaming",
                "Sistema de som",
                "Jogos de tabuleiro",
                "Livros e material de leitura",
                "Tapete de ioga"
            ]
        },
        {
            id: "clima",
            title: "Climatização",
            icon: <Wind className="text-amber-700" />,
            items: [
                "Ar-condicionado split",
                "Ventiladores portáteis"
            ]
        },
        {
            id: "cozinha",
            title: "Cozinha e sala de jantar",
            icon: <Coffee className="text-amber-700" />,
            items: [
                "Geladeira, Fogão e Microondas",
                "Air Fryer e Liquidificador",
                "Cafeteira e Sanduicheira",
                "Purificador de água",
                "Louças e talheres completos"
            ]
        },
        {
            id: "office",
            title: "Internet e escritório",
            icon: <Wifi className="text-amber-700" />,
            items: [
                "Wi-Fi de alta velocidade",
                "Espaço de trabalho exclusivo (Escrivaninha)"
            ]
        },
        {
            id: "seguranca",
            title: "Segurança doméstica",
            icon: <Shield className="text-amber-700" />,
            items: [
                "Câmeras de segurança nas áreas comuns",
                "Extintor de incêndio",
                "Kit de primeiros socorros"
            ]
        }
    ],
    location: {
        title: "Localização Perfeita",
        description: "Encontre-nos no coração de Petrolina, com fácil acesso aos melhores pontos da cidade."
    },
    reviews: {
        title: "O que nossos hóspedes dizem",
        fallback: [
            { name: "Joana S.", text: "Um lugar incrível! Extremamente limpo, organizado e com uma localização perfeita. A Lili foi muito atenciosa. Voltarei com certeza!" },
            { name: "Ricardo F.", text: "O flat é exatamente como nas fotos. Muito bem equipado, não faltou nada. O processo de check-in foi super fácil." },
            { name: "Mariana L.", text: "Silencioso, confortável e muito bonito. A TV com streaming foi um diferencial. Recomendo!" }
        ]
    },
    footer: {
        text: "© 2025 Flat de Lili. Todos os direitos reservados.",
        disclaimer: "Nós respeitamos sua privacidade. Seus dados são utilizados apenas para a gestão da sua reserva e nunca compartilhados."
    }
};
