import React from 'react';
import {
    Tv,
    Wind,
    Utensils,
    ShowerHead,
    Briefcase,
    MapPin,
    Sparkles,
    Car,
    Footprints,
    Home,
    CigaretteOff,
    Check,
} from 'lucide-react';
import { useLanguage } from '../../../../hooks/useLanguage';

interface FlatAmenitiesSheetProps {
    propertyId: string;
}

/**
 * Conteúdo do sheet "O Flat & Comodidades"
 * Separado por propertyId: 'lili' vs 'integracao'
 */
const FlatAmenitiesSheet: React.FC<FlatAmenitiesSheetProps> = ({ propertyId }) => {
    const { t } = useLanguage();

    return (
        <div className="flex flex-col gap-6 text-stone-700 dark:text-stone-300">
            {/* Intro Editorial com Citação Hospitaleira */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:to-[#1C1614] p-5 rounded-2xl border border-amber-200/60 dark:border-amber-500/20 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-3 relative z-10">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-[#C85A32] dark:text-amber-400 shrink-0 mt-0.5">
                        <Sparkles size={18} />
                    </div>
                    <p className="text-sm leading-relaxed text-stone-700 dark:text-stone-200 font-sans">
                        {t(
                            'Um flat todo equipado, confortável e novinho! Com 30m² cheios de estilo, é fácil de manter organizado e atende perfeitamente às necessidades do dia a dia.',
                            'A fully equipped, comfortable and brand new flat! With 30m² full of style, it is easy to keep organized and perfectly meets daily needs.',
                            '¡Un piso totalmente equipado, cómodo y nuevo! Con 30m² llenos de estilo, es fácil de mantener organizado y satisface perfectamente las necesidades diarias.'
                        )}
                    </p>
                </div>
            </div>

            {/* Sobre a Localização */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-amber-100 dark:bg-amber-500/15 p-1.5 rounded-lg text-[#C85A32] dark:text-amber-400">
                        <MapPin size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t('Sobre a Localização', 'About the Location', 'Sobre la Ubicación')}
                    </h4>
                </div>
                <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
                    {/* Endereço */}
                    <div className="pb-3 border-b border-stone-100 dark:border-stone-800">
                        <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-sans">
                            {t('O flat fica na ', 'The flat is located at ', 'El piso está en ')}
                            <strong className="text-stone-900 dark:text-white font-bold">
                                Rua São José, 475 B
                            </strong>
                            {t(
                                ', ao lado da Av. da Integração. Acesso rápido ao centro, shopping e hospitais.',
                                ', next to Av. da Integração. Quick access to downtown, mall and hospitals.',
                                ', al lado de Av. da Integração. Acceso rápido al centro, centro comercial y hospitales.'
                            )}
                        </p>
                    </div>

                    {/* Pontos de Atenção (Estacionamento & Escadas) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/15 text-xs text-stone-600 dark:text-stone-300">
                            <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-[#C85A32] dark:text-amber-400 shrink-0">
                                <Car size={14} />
                            </div>
                            <span className="leading-snug">
                                <strong className="text-stone-900 dark:text-stone-100 font-semibold block">
                                    {t(
                                        'Não possuímos estacionamento',
                                        'We do not have parking',
                                        'No tenemos estacionamiento'
                                    )}
                                </strong>
                                <span className="text-stone-500 dark:text-stone-400">
                                    (
                                    {t(
                                        'vagas disponíveis na rua',
                                        'street parking available',
                                        'aparcamiento disponible en la calle'
                                    )}
                                    )
                                </span>
                            </span>
                        </div>

                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/15 text-xs text-stone-600 dark:text-stone-300">
                            <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-[#C85A32] dark:text-amber-400 shrink-0">
                                <Footprints size={14} />
                            </div>
                            <span className="leading-snug">
                                {t(
                                    'O prédio não possui elevador (acesso por escadas).',
                                    'The building has no elevator (stairs access).',
                                    'El edificio no tiene ascensor (acceso por escaleras).'
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Estimativas de Deslocamento */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                            {t(
                                'Aeroporto: 15-20 min',
                                'Airport: 15-20 min',
                                'Aeropuerto: 15-20 min'
                            )}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
                            {t(
                                'Rodoviária: 10-15 min',
                                'Bus Station: 10-15 min',
                                'Estación de Autobuses: 10-15 min'
                            )}
                        </span>
                    </div>

                    {/* Curiosidade Local */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 dark:from-amber-500/10 dark:to-orange-500/5 border border-amber-200/70 dark:border-amber-500/20 rounded-xl p-3.5 mt-2">
                        <p className="text-[11px] font-bold text-[#C85A32] dark:text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <span>✨</span>{' '}
                            {t('Curiosidade Local', 'Local Curiosity', 'Curiosidad Local')}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-300 italic leading-relaxed">
                            {t(
                                'Quase em frente, você verá o icônico ',
                                'Almost in front, you will see the iconic ',
                                'Casi enfrente, verás el icónico '
                            )}
                            <strong className="text-amber-900 dark:text-amber-200 not-italic font-bold">
                                {t(
                                    'Monumento da Integração',
                                    'Integration Monument',
                                    'Monumento a la Integración'
                                )}
                            </strong>{' '}
                            {t(
                                '(apelidado de "Monumento da Besteira"). Ele simboliza a união dos bairros de Petrolina! 🤩',
                                '(nicknamed "Monument of Nonsense"). It symbolizes the union of Petrolina neighborhoods! 🤩',
                                '(apodado "Monumento de la Tontería"). ¡Simboliza la unión de los barrios de Petrolina! 🤩'
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {propertyId === 'integracao' ? <IntegracaoAmenities /> : <LiliAmenities />}
        </div>
    );
};

/**
 * Comodidades específicas do Flat Integração
 */
const IntegracaoAmenities: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            {/* Cozinha Privativa */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-amber-100 dark:bg-amber-500/15 p-1.5 rounded-lg text-[#C85A32] dark:text-amber-400">
                        <Utensils size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t(
                            'Na sua cozinha privativa:',
                            'In your private kitchen:',
                            'En su cocina privada:'
                        )}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('Produtos de limpeza', 'Cleaning products', 'Productos de limpieza'),
                        t('Micro-ondas', 'Microwave', 'Microondas'),
                        t('Utensílios de cozinha', 'Kitchenware', 'Utensilios de cocina'),
                        t('Fogão', 'Stove', 'Estufa'),
                        t('Mesa de jantar', 'Dining table', 'Mesa de comedor'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check
                                size={14}
                                className="text-[#C85A32] dark:text-amber-400 shrink-0"
                            />
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banheiro Privativo */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-sky-100 dark:bg-sky-500/15 p-1.5 rounded-lg text-sky-600 dark:text-sky-400">
                        <ShowerHead size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t(
                            'No seu banheiro privativo:',
                            'In your private bathroom:',
                            'En su baño privado:'
                        )}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('Vaso sanitário', 'Toilet', 'Inodoro'),
                        t('Banheira ou chuveiro', 'Bath or shower', 'Bañera o ducha'),
                        t('Toalhas', 'Towels', 'Toallas'),
                        t('Papel higiênico', 'Toilet paper', 'Papel higiénico'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check size={14} className="text-sky-600 dark:text-sky-400 shrink-0" />
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comodidades do Apartamento */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-100 dark:bg-orange-500/15 p-1.5 rounded-lg text-[#C85A32] dark:text-amber-400">
                        <Home size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t(
                            'Comodidades do apartamento:',
                            'Apartment amenities:',
                            'Comodidades del apartamento:'
                        )}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('Ar-condicionado', 'Air conditioning', 'Aire acondicionado'),
                        t('Cozinha', 'Kitchen', 'Cocina'),
                        t('Sofá', 'Sofa', 'Sofá'),
                        t('Roupa de cama', 'Bed linen', 'Ropa de cama'),
                        t(
                            'Tomada perto da cama',
                            'Socket near the bed',
                            'Enchufe cerca de la cama'
                        ),
                        t('Produtos de limpeza', 'Cleaning products', 'Productos de limpieza'),
                        t('Mesa de trabalho', 'Desk', 'Escritorio'),
                        t('Área de estar', 'Seating Area', 'Zona de estar'),
                        t('TV', 'TV', 'TV'),
                        t('Chaleira/cafeteira', 'Tea/Coffee Maker', 'Tetera/Cafetera'),
                        t('Ferro de passar roupa', 'Iron', 'Plancha para ropa'),
                        t('Micro-ondas', 'Microwave', 'Microondas'),
                        t('TV de tela plana', 'Flat-screen TV', 'TV de pantalla plana'),
                        t('Utensílios de cozinha', 'Kitchenware', 'Utensilios de cocina'),
                        t('Cozinha compacta', 'Kitchenette', 'Cocina pequeña'),
                        t('Ventilador', 'Fan', 'Ventilador'),
                        t('Frigobar', 'Minibar', 'Minibar'),
                        t('Guarda-roupa ou armário', 'Wardrobe or closet', 'Armario o ropero'),
                        t('Fogão', 'Stove', 'Estufa'),
                        t('Área para refeições', 'Dining area', 'Zona de comedor'),
                        t('Mesa de jantar', 'Dining table', 'Mesa de comedor'),
                        t(
                            'Andares superiores acessíveis somente por escada',
                            'Upper floors accessible by stairs only',
                            'Pisos superiores accesibles solo por escaleras'
                        ),
                        t('Independente', 'Detached', 'Independiente'),
                        t(
                            'Flat particular em prédio',
                            'Private flat in building',
                            'Apartamento privado en edificio'
                        ),
                        t('Arara para roupas', 'Clothes rack', 'Perchero'),
                        t('Varal para secar roupas', 'Drying rack for clothing', 'Tendedero'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check
                                size={13}
                                className="text-[#C85A32] dark:text-amber-400 shrink-0 mt-0.5"
                            />
                            <span className="leading-tight">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fumantes */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-100/80 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200">
                <CigaretteOff size={16} className="text-stone-500 dark:text-stone-400 shrink-0" />
                <span>
                    <strong className="font-bold mr-1">
                        {t('Fumantes:', 'Smokers:', 'Fumadores:')}
                    </strong>
                    <span className="text-stone-600 dark:text-stone-400">
                        {t('Não é permitido fumar', 'No smoking', 'Prohibido fumar')}
                    </span>
                </span>
            </div>
        </div>
    );
};

/**
 * Comodidades específicas do Flat da Lili
 */
const LiliAmenities: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="space-y-6">
            {/* Sala de Estar */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-amber-100 dark:bg-amber-500/15 p-1.5 rounded-lg text-[#C85A32] dark:text-amber-400">
                        <Tv size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t('Sala de Estar', 'Living Room', 'Sala de Estar')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('TV de 50"', '50" TV', 'TV de 50"'),
                        t('Cafeteira', 'Coffee maker', 'Cafetera'),
                        t('Jogos de Tabuleiro', 'Board games', 'Juegos de mesa'),
                        t('Livros', 'Books', 'Libros'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check
                                size={14}
                                className="text-[#C85A32] dark:text-amber-400 shrink-0"
                            />
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cozinha Completa */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-emerald-100 dark:bg-emerald-500/15 p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400">
                        <Utensils size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t('Cozinha Completa', 'Full Kitchen', 'Cocina Completa')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('Frigobar', 'Mini-Fridge', 'Frigobar'),
                        t('Microondas', 'Microwave', 'Microondas'),
                        t('Air Fryer', 'Air Fryer', 'Freidora de Aire'),
                        t('Liquidificador', 'Blender', 'Licuadora'),
                        t('Sanduicheira', 'Sandwich maker', 'Sandwichera'),
                        t('Mini Processador', 'Mini Processor', 'Mini Procesador'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check
                                size={14}
                                className="text-emerald-600 dark:text-emerald-400 shrink-0"
                            />
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 pl-1 italic">
                    {t(
                        '+ Panelas, louça e talheres.',
                        '+ Pots, crockery and cutlery.',
                        '+ Ollas, vajilla y cubiertos.'
                    )}
                </p>
            </div>

            {/* Quarto Acolhedor */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-100 dark:bg-orange-500/15 p-1.5 rounded-lg text-orange-600 dark:text-orange-400">
                        <Wind size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                        {t('Quarto Acolhedor', 'Cozy Bedroom', 'Habitación Acogedora')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {[
                        t('Ar-condicionado', 'Air conditioning', 'Aire acondicionado'),
                        t('Ventilador', 'Fan', 'Ventilador'),
                        t('Roupas de Cama', 'Bed linen', 'Ropa de cama'),
                        t('TV', 'TV', 'TV'),
                        t('Escrivaninha', 'Desk', 'Escritorio'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 shadow-sm text-xs font-medium text-stone-700 dark:text-stone-300"
                        >
                            <Check
                                size={14}
                                className="text-orange-600 dark:text-orange-400 shrink-0"
                            />
                            <span className="truncate">{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banheiro & Home Office */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-sky-100 dark:bg-sky-500/15 p-1.5 rounded-lg text-sky-600 dark:text-sky-400">
                            <ShowerHead size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                            {t('Banheiro', 'Bathroom', 'Baño')}
                        </h4>
                    </div>
                    <ul className="space-y-2">
                        {[
                            t('Chuveiro Elétrico', 'Electric Shower', 'Ducha Eléctrica'),
                            t('Secador de Cabelo', 'Hair dryer', 'Secador de pelo'),
                            t('Toalhas e Sabonete', 'Towels and Soap', 'Toallas y Jabón'),
                        ].map((item, idx) => (
                            <li
                                key={idx}
                                className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-2"
                            >
                                <Check size={12} className="text-sky-500 shrink-0" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white dark:bg-[#241C19] border border-stone-200/80 dark:border-amber-500/15 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-amber-100 dark:bg-amber-500/15 p-1.5 rounded-lg text-[#C85A32] dark:text-amber-400">
                                <Briefcase size={16} />
                            </div>
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800 dark:text-stone-200">
                                {t('Home Office', 'Home Office', 'Oficina en Casa')}
                            </h4>
                        </div>
                        <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
                            {t(
                                'Espaço com iluminação confortável e conexão rápida. Ideal para reuniões e estudos.',
                                'Space with comfortable lighting and fast connection. Ideal for meetings and studies.',
                                'Espacio con iluminación cómoda y conexión rápida. Ideal para reuniones y estudios.'
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlatAmenitiesSheet;
