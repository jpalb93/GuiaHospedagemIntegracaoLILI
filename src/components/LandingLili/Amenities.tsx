import React, { useRef } from 'react';
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
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Amenities: React.FC = () => {
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const items = gsap.utils.toArray(gridRef.current?.children || []);
            if (items.length > 0) {
                gsap.fromTo(
                    items,
                    {
                        y: 50,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 85%',
                        },
                    }
                );
            }
        },
        { scope: gridRef }
    );

    return (
        <section id="comodidades" className="py-24 bg-stone-950 border-y border-stone-800">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
                    <h2 className="text-4xl md:text-5xl font-heading font-medium text-white max-w-lg">
                        Comodidades <br /> <span className="italic text-stone-500">Exclusivas</span>
                    </h2>
                    <p className="text-stone-400 max-w-xs text-sm">
                        Tudo o que você espera de um hotel, com a liberdade de um apartamento.
                    </p>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
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
                            <div className="flex items-center gap-3 mb-4 text-orange-500">
                                <UtensilsCrossed size={28} />
                                <h3 className="text-2xl font-heading font-medium text-white">
                                    Cozinha & Jantar
                                </h3>
                            </div>
                            <ul className="text-stone-300 text-sm space-y-1 columns-2">
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
                            <div className="flex items-center gap-3 mb-4 text-orange-500">
                                <Monitor size={28} />
                                <h3 className="text-2xl font-heading font-medium text-white">
                                    Entretenimento
                                </h3>
                            </div>
                            <ul className="text-stone-300 text-sm space-y-1 columns-2">
                                <li>HDTV 50" com Streaming</li>
                                <li>Sistema de som</li>
                                <li>Jogos de tabuleiro</li>
                                <li>Livros e material de leitura</li>
                                <li>Tapete de ioga</li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Banheiro */}
                    <div className="relative group overflow-hidden bg-stone-900 min-h-[250px] rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-50 group-hover:opacity-40 transition-opacity">
                            <OptimizedImage
                                src="/images/banheiro.jpg"
                                className="w-full h-full object-cover"
                                alt="Banheiro"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2 text-orange-500">
                                <Droplets size={22} />
                                <h3 className="text-lg font-heading font-bold text-white">
                                    Banheiro
                                </h3>
                            </div>
                            <ul className="text-stone-300 text-xs space-y-1">
                                <li>Secador de cabelo</li>
                                <li>Produtos de limpeza</li>
                                <li>Xampu e Condicionador</li>
                                <li>Sabonete para o corpo</li>
                                <li>Água quente</li>
                            </ul>
                        </div>
                    </div>

                    {/* 4. Quarto e Lavanderia (Expanded to 2 cols) */}
                    <div className="md:col-span-2 relative group overflow-hidden bg-stone-900 min-h-[250px] rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-50 group-hover:opacity-40 transition-opacity">
                            <OptimizedImage
                                src="/images/quarto-lavanderia.jpg"
                                className="w-full h-full object-cover"
                                alt="Quarto e Lavanderia"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2 text-orange-500">
                                <BedDouble size={22} />
                                <h3 className="text-lg font-heading font-bold text-white">
                                    Quarto & Lavanderia
                                </h3>
                            </div>
                            <ul className="text-stone-300 text-xs space-y-1 columns-2">
                                <li>Enxoval completo</li>
                                <li>Cabides e Guarda-roupa</li>
                                <li>Blackout nas cortinas</li>
                                <li>Ferro de passar e Varal</li>
                                <li>Básico (Higiene e Limpeza)</li>
                            </ul>
                        </div>
                    </div>

                    {/* 6. Internet e Escritório */}
                    <div className="relative group overflow-hidden bg-stone-900 min-h-[250px] rounded-sm transition-all hover:shadow-lg">
                        <div className="absolute inset-0 opacity-50 group-hover:opacity-40 transition-opacity">
                            <OptimizedImage
                                src="/images/home-office.jpg"
                                className="w-full h-full object-cover"
                                alt="Home Office"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2 text-orange-500">
                                <Wifi size={22} />
                                <h3 className="text-lg font-heading font-bold text-white">
                                    Home Office
                                </h3>
                            </div>
                            <ul className="text-stone-300 text-xs space-y-1">
                                <li>Wi-Fi de alta velocidade</li>
                                <li>Espaço de trabalho (Escrivaninha)</li>
                            </ul>
                        </div>
                    </div>

                    {/* 5. Climatização (Moved and Expanded) */}
                    <div className="md:col-span-2 bg-stone-900 border border-stone-800 p-8 flex flex-col justify-between hover:border-orange-500/30 transition-colors min-h-[160px]">
                        <div className="flex items-center gap-3 mb-4 text-white">
                            <Snowflake size={24} />
                            <h3 className="text-xl font-heading font-bold">Climatização</h3>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2 text-stone-400 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                Ar-condicionado split
                            </div>
                            <div className="flex items-center gap-2 text-stone-400 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                Ventiladores portáteis
                            </div>
                        </div>
                    </div>

                    {/* 7. Segurança (Reduced visual size or shared row) */}
                    <div className="md:col-span-2 bg-stone-900 p-8 flex flex-col justify-between rounded-sm border border-stone-800 min-h-[160px]">
                        <div className="flex items-center gap-4 mb-4">
                            <Shield className="text-green-500" size={24} />
                            <h3 className="text-xl font-bold text-white font-heading">
                                Segurança Doméstica
                            </h3>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            <span className="flex items-center gap-2 text-sm text-stone-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>{' '}
                                Câmeras áreas comuns
                            </span>
                            <span className="flex items-center gap-2 text-sm text-stone-400">
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
