import React from 'react';
import {
    Tv, Wind, Utensils, ShowerHead, Briefcase, MapPin, CheckCircle2
} from 'lucide-react';

interface FlatAmenitiesSheetProps {
    propertyId: string;
}

/**
 * Conteúdo do sheet "O Flat & Comodidades"
 * Separado por propertyId: 'lili' vs 'integracao'
 */
const FlatAmenitiesSheet: React.FC<FlatAmenitiesSheetProps> = ({ propertyId }) => {
    return (
        <div className="flex flex-col gap-6 text-gray-700 dark:text-gray-300">
            {/* Intro */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    Um flat todo equipado, confortável e novinho! Com 30m² cheios de estilo, é fácil de manter organizado e atende perfeitamente às necessidades do dia a dia.
                </p>
            </div>

            {/* Sobre a Localização */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg text-orange-600 dark:text-orange-400">
                        <MapPin size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        Sobre a Localização
                    </h4>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 space-y-3 shadow-sm">
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        O flat fica na <strong className="text-gray-900 dark:text-white">Rua São José, 475 B</strong>, ao lado da Av. da Integração. Acesso rápido ao centro, shopping e hospitais.
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="bg-red-100 text-red-600 p-0.5 rounded">🚗</span>
                            <span><strong className="text-gray-800 dark:text-gray-200">Não possuímos estacionamento</strong> (vagas disponíveis na rua).</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="bg-orange-100 text-orange-600 p-0.5 rounded">👣</span>
                            <span>O prédio não possui elevador (acesso por escadas).</span>
                        </div>
                    </div>
                    <div className="flex gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-1">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Aeroporto: 15-20 min
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Rodoviária: 10-15 min
                        </span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20 rounded-xl p-3 mt-2">
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Curiosidade Local</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                            Quase em frente, você verá o icônico <strong className="text-orange-800 dark:text-orange-300">Monumento da Integração</strong> (apelidado de "Monumento da Besteira"). Ele simboliza a união dos bairros de Petrolina! 🤩
                        </p>
                    </div>
                </div>
            </div>

            {propertyId === 'integracao' ? (
                <IntegracaoAmenities />
            ) : (
                <LiliAmenities />
            )}
        </div>
    );
};

/**
 * Comodidades específicas do Flat Integração
 */
const IntegracaoAmenities: React.FC = () => (
    <>
        {/* Cozinha Privativa */}
        <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                Na sua cozinha privativa:
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {['Produtos de limpeza', 'Micro-ondas', 'Utensílios de cozinha', 'Fogão', 'Mesa de jantar'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Banheiro Privativo */}
        <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                No seu banheiro privativo:
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {['Vaso sanitário', 'Banheira ou chuveiro', 'Toalhas', 'Papel higiênico'].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Comodidades do Apartamento */}
        <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                Comodidades do apartamento:
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {[
                    'Ar-condicionado', 'Cozinha', 'Sofá', 'Roupa de cama', 'Tomada perto da cama',
                    'Produtos de limpeza', 'Mesa de trabalho', 'Área de estar', 'TV', 'Chaleira/cafeteira',
                    'Ferro de passar roupa', 'Micro-ondas', 'TV de tela plana', 'Utensílios de cozinha',
                    'Cozinha compacta', 'Ventilador', 'Frigobar', 'Guarda-roupa ou armário', 'Fogão',
                    'Área para refeições', 'Mesa de jantar', 'Andares superiores acessíveis somente por escada',
                    'Independente', 'Flat particular em prédio', 'Arara para roupas', 'Varal para secar roupas'
                ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Fumantes */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200 mt-2">
            <span>Fumantes:</span>
            <span className="font-normal text-gray-600 dark:text-gray-400">Não é permitido fumar</span>
        </div>
    </>
);

/**
 * Comodidades específicas do Flat da Lili
 */
const LiliAmenities: React.FC = () => (
    <>
        {/* Sala de Estar */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-blue-600 dark:text-blue-400">
                    <Tv size={16} />
                </div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Sala de Estar
                </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {['TV de 50"', 'Cafeteira', 'Jogos de Tabuleiro', 'Livros'].map((item, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Cozinha Completa */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-600 dark:text-green-400">
                    <Utensils size={16} />
                </div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Cozinha Completa
                </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {['Geladeira Inverter', 'Microondas', 'Air Fryer', 'Liquidificador', 'Sanduicheira', 'Mini Processador'].map((item, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-1">+ Panelas, louça e talheres.</p>
        </div>

        {/* Quarto Acolhedor */}
        <div>
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg text-purple-600 dark:text-purple-400">
                    <Wind size={16} />
                </div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                    Quarto Acolhedor
                </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
                {['Ar-condicionado', 'Ventilador', 'Roupas de Cama', 'TV', 'Escrivaninha'].map((item, idx) => (
                    <div key={idx} className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Banheiro & Home Office */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-cyan-100 dark:bg-cyan-900/30 p-1.5 rounded-lg text-cyan-600 dark:text-cyan-400">
                        <ShowerHead size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        Banheiro
                    </h4>
                </div>
                <ul className="space-y-1.5">
                    {['Chuveiro Elétrico', 'Secador de Cabelo', 'Toalhas e Sabonete'].map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-cyan-500"></span> {item}
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <Briefcase size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        Home Office
                    </h4>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Espaço com iluminação confortável e conexão rápida. Ideal para reuniões e estudos.
                </p>
            </div>
        </div>
    </>
);

export default FlatAmenitiesSheet;
