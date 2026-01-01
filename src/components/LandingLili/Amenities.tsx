import React from 'react';
import {
    UtensilsCrossed,
    Monitor,
    Droplets,
    Wifi,
    Shield,
    BedDouble,
    Snowflake,
} from 'lucide-react';
import OptimizedImage from '../ui/OptimizedImage';

const Amenities: React.FC = () => {
    return (
        <section id="comodidades" className="py-24 bg-white border-y border-gray-100">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
                    <h2 className="text-4xl md:text-5xl font-heading font-medium text-gray-900 max-w-lg">
                        Comodidades <br /> <span className="italic text-gray-400">Exclusivas</span>
                    </h2>
                    <p className="text-gray-500 max-w-xs text-sm">
                        Tudo o que você espera de um hotel, com a liberdade de um apartamento.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
                    {/* 1. Cozinha (Large) */}
                    <div className="md:col-span-2 group relative bg-stone-900 overflow-hidden rounded-sm hover:shadow-lg transition-all min-h-[320px]">
                        {/* Imagem de Fundo (Opcional ou Gradiente) */}
                        <div className="absolute inset-0 opacity-40">
                            <OptimizedImage
                                src="/images/cozinha-jantar.jpg"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Cozinha e Jantar"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 flex flex-col justify-end">
                            <div className="flex items-center gap-3 mb-4 text-orange-400">
                                <UtensilsCrossed size={28} />
                                <h3 className="text-2xl font-heading font-medium text-white">
                                    Cozinha & Jantar
                                </h3>
                            </div>
                            <ul className="text-gray-50 text-sm space-y-1 columns-2">
                                <li>Geladeira, Fogão e Microondas</li>
                                <li>Air Fryer e Liquidificador</li>
                                <li>Cafeteira e Sanduicheira</li>
                                <li>Purificador de água</li>
                                <li>Louças e talheres completos</li>
                            </ul>
                        </div>
                    </div>

                    {/* 2. Entretenimento (Large) */}
                    <div className="md:col-span-2 group relative bg-stone-900 overflow-hidden rounded-sm hover:shadow-lg transition-all min-h-[320px]">
                        <div className="absolute inset-0 opacity-40 group-hover:opacity-30 transition-opacity">
                            <OptimizedImage
                                src="/images/entretenimento.jpg"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Entretenimento"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 flex flex-col justify-end">
                            <div className="flex items-center gap-3 mb-4 text-orange-400">
                                <Monitor size={28} />
                                <h3 className="text-2xl font-heading font-medium text-white">
                                    Entretenimento
                                </h3>
                            </div>
                            <ul className="text-gray-50 text-sm space-y-1 columns-2">
                                <li>HDTV 50" com Streaming</li>
                                <li>Sistema de som</li>
                                <li>Jogos de tabuleiro</li>
                                <li>Livros e material de leitura</li>
                                <li>Tapete de ioga</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Banheiro */}
                    <div className="relative group overflow-hidden bg-stone-900 min-h-[250px] p-6 flex flex-col justify-end rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-60 group-hover:opacity-50 transition-opacity">
                            <OptimizedImage
                                src="/images/banheiro.jpg"
                                className="w-full h-full object-cover"
                                alt="Banheiro"
                            />
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                <Droplets size={22} />
                                <h3 className="text-lg font-heading font-bold">Banheiro</h3>
                            </div>
                            <ul className="text-gray-50 text-xs space-y-1">
                                <li>Secador de cabelo</li>
                                <li>Produtos de limpeza</li>
                                <li>Xampu e Condicionador</li>
                                <li>Sabonete para o corpo</li>
                                <li>Água quente</li>
                            </ul>
                        </div>
                    </div>

                    {/* 4. Quarto e Lavanderia (Expanded to 2 cols) */}
                    <div className="md:col-span-2 relative group overflow-hidden bg-stone-900 min-h-[250px] p-6 flex flex-col justify-end rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-60 group-hover:opacity-50 transition-opacity">
                            <OptimizedImage
                                src="/images/quarto-lavanderia.jpg"
                                className="w-full h-full object-cover"
                                alt="Quarto e Lavanderia"
                            />
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                <BedDouble size={22} />
                                <h3 className="text-lg font-heading font-bold">
                                    Quarto & Lavanderia
                                </h3>
                            </div>
                            <ul className="text-gray-50 text-xs space-y-1 columns-2">
                                <li>Enxoval completo</li>
                                <li>Cabides e Guarda-roupa</li>
                                <li>Blackout nas cortinas</li>
                                <li>Ferro de passar e Varal</li>
                                <li>Básico (Higiene e Limpeza)</li>
                            </ul>
                        </div>
                    </div>

                    {/* 6. Internet e Escritório */}
                    <div className="relative group overflow-hidden bg-stone-900 min-h-[250px] p-6 flex flex-col justify-end rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-60 group-hover:opacity-50 transition-opacity">
                            <OptimizedImage
                                src="/images/home-office.jpg"
                                className="w-full h-full object-cover"
                                alt="Home Office"
                            />
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                <Wifi size={22} />
                                <h3 className="text-lg font-heading font-bold">Home Office</h3>
                            </div>
                            <ul className="text-gray-50 text-xs space-y-1">
                                <li>Wi-Fi de alta velocidade</li>
                                <li>Espaço de trabalho (Escrivaninha)</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5. Climatização (Moved and Expanded) */}
                    <div className="md:col-span-2 bg-white border border-gray-100 p-8 flex flex-col justify-between hover:border-orange-200 transition-colors min-h-[160px]">
                        <div className="flex items-center gap-3 mb-4 text-gray-900">
                            <Snowflake size={24} />
                            <h3 className="text-xl font-heading font-bold">Climatização</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                Ar-condicionado split
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                Ventiladores portáteis
                            </div>
                        </div>
                    </div>

                    {/* 7. Segurança (Reduced visual size or shared row) */}
                    <div className="md:col-span-2 bg-gray-50 p-8 flex flex-col justify-between rounded-sm border border-gray-200 min-h-[160px]">
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="text-green-600" size={24} />
                            <h3 className="text-xl font-bold text-gray-700 font-heading">
                                Segurança Doméstica
                            </h3>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{' '}
                                Câmeras áreas comuns
                            </span>
                            <span className="flex items-center gap-2 text-sm text-gray-500">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{' '}
                                Extintor de incêndio
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Amenities;
