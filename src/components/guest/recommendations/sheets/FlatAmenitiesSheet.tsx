import React from 'react';
import { Tv, Wind, Utensils, ShowerHead, Briefcase, MapPin, CheckCircle2 } from 'lucide-react';
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
        <div className="flex flex-col gap-6 text-gray-700 dark:text-gray-300">
            {/* Intro */}
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {t(
                        'Um flat todo equipado, confortável e novinho! Com 30m² cheios de estilo, é fácil de manter organizado e atende perfeitamente às necessidades do dia a dia.',
                        'A fully equipped, comfortable and brand new flat! With 30m² full of style, it is easy to keep organized and perfectly meets daily needs.',
                        '¡Un piso totalmente equipado, cómodo y nuevo! Con 30m² llenos de estilo, es fácil de mantener organizado y satisface perfectamente las necesidades diarias.'
                    )}
                </p>
            </div>

            {/* Sobre a Localização */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg text-orange-600 dark:text-orange-400">
                        <MapPin size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        {t('Sobre a Localização', 'About the Location', 'Sobre la Ubicación')}
                    </h4>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 space-y-3 shadow-sm">
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                        {t('O flat fica na ', 'The flat is located at ', 'El piso está en ')}
                        <strong className="text-gray-900 dark:text-white">
                            Rua São José, 475 B
                        </strong>
                        {t(
                            ', ao lado da Av. da Integração. Acesso rápido ao centro, shopping e hospitais.',
                            ', next to Av. da Integração. Quick access to downtown, mall and hospitals.',
                            ', al lado de Av. da Integração. Acceso rápido al centro, centro comercial y hospitales.'
                        )}
                    </p>
                    <div className="space-y-2">
                        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="bg-red-100 text-red-600 p-0.5 rounded">🚗</span>
                            <span>
                                <strong className="text-gray-800 dark:text-gray-200">
                                    {t('Não possuímos estacionamento', 'We do not have parking', 'No tenemos estacionamiento')}
                                </strong>{' '}
                                ({t('vagas disponíveis na rua', 'street parking available', 'aparcamiento disponible en la calle')}).
                            </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="bg-orange-100 text-orange-600 p-0.5 rounded">👣</span>
                            <span>{t('O prédio não possui elevador (acesso por escadas).', 'The building has no elevator (stairs access).', 'El edificio no tiene ascensor (acceso por escaleras).')}</span>
                        </div>
                    </div>
                    <div className="flex gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide pt-1">
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{' '}
                            {t('Aeroporto: 15-20 min', 'Airport: 15-20 min', 'Aeropuerto: 15-20 min')}
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{' '}
                            {t('Rodoviária: 10-15 min', 'Bus Station: 10-15 min', 'Estación de Autobuses: 10-15 min')}
                        </span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20 rounded-xl p-3 mt-2">
                        <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">
                            {t('Curiosidade Local', 'Local Curiosity', 'Curiosidad Local')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                            {t('Quase em frente, você verá o icônico ', 'Almost in front, you will see the iconic ', 'Casi enfrente, verás el icónico ')}
                            <strong className="text-orange-800 dark:text-orange-300">
                                {t('Monumento da Integração', 'Integration Monument', 'Monumento a la Integración')}
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
        <>
            {/* Cozinha Privativa */}
            <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                    {t('Na sua cozinha privativa:', 'In your private kitchen:', 'En su cocina privada:')}
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                        t('Produtos de limpeza', 'Cleaning products', 'Productos de limpieza'),
                        t('Micro-ondas', 'Microwave', 'Microondas'),
                        t('Utensílios de cozinha', 'Kitchenware', 'Utensilios de cocina'),
                        t('Fogão', 'Stove', 'Estufa'),
                        t('Mesa de jantar', 'Dining table', 'Mesa de comedor'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                        >
                            <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banheiro Privativo */}
            <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                    {t('No seu banheiro privativo:', 'In your private bathroom:', 'En su baño privado:')}
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                        t('Vaso sanitário', 'Toilet', 'Inodoro'),
                        t('Banheira ou chuveiro', 'Bath or shower', 'Bañera o ducha'),
                        t('Toalhas', 'Towels', 'Toallas'),
                        t('Papel higiênico', 'Toilet paper', 'Papel higiénico'),
                    ].map(
                        (item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400"
                            >
                                <CheckCircle2 size={12} className="text-green-500 shrink-0" />
                                <span>{item}</span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Comodidades do Apartamento */}
            <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200 mb-3">
                    {t('Comodidades do apartamento:', 'Apartment amenities:', 'Comodidades del apartamento:')}
                </h4>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {[
                        t('Ar-condicionado', 'Air conditioning', 'Aire acondicionado'),
                        t('Cozinha', 'Kitchen', 'Cocina'),
                        t('Sofá', 'Sofa', 'Sofá'),
                        t('Roupa de cama', 'Bed linen', 'Ropa de cama'),
                        t('Tomada perto da cama', 'Socket near the bed', 'Enchufe cerca de la cama'),
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
                        t('Andares superiores acessíveis somente por escada', 'Upper floors accessible by stairs only', 'Pisos superiores accesibles solo por escaleras'),
                        t('Independente', 'Detached', 'Independiente'),
                        t('Flat particular em prédio', 'Private flat in building', 'Apartamento privado en edificio'),
                        t('Arara para roupas', 'Clothes rack', 'Perchero'),
                        t('Varal para secar roupas', 'Drying rack for clothing', 'Tendedero'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                        >
                            <CheckCircle2 size={12} className="text-green-500 shrink-0 mt-0.5" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fumantes */}
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 dark:text-gray-200 mt-2">
                <span>{t('Fumantes:', 'Smokers:', 'Fumadores:')}</span>
                <span className="font-normal text-gray-600 dark:text-gray-400">
                    {t('Não é permitido fumar', 'No smoking', 'Prohibido fumar')}
                </span>
            </div>
        </>
    );
};

/**
 * Comodidades específicas do Flat da Lili
 */
const LiliAmenities: React.FC = () => {
    const { t } = useLanguage();
    return (
        <>
            {/* Sala de Estar */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-blue-600 dark:text-blue-400">
                        <Tv size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        {t('Sala de Estar', 'Living Room', 'Sala de Estar')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        t('TV de 50"', '50" TV', 'TV de 50"'),
                        t('Cafeteira', 'Coffee maker', 'Cafetera'),
                        t('Jogos de Tabuleiro', 'Board games', 'Juegos de mesa'),
                        t('Livros', 'Books', 'Libros'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {item}
                            </span>
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
                        {t('Cozinha Completa', 'Full Kitchen', 'Cocina Completa')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        t('Geladeira Inverter', 'Inverter Refrigerator', 'Refrigerador Inverter'),
                        t('Microondas', 'Microwave', 'Microondas'),
                        t('Air Fryer', 'Air Fryer', 'Freidora de Aire'),
                        t('Liquidificador', 'Blender', 'Licuadora'),
                        t('Sanduicheira', 'Sandwich maker', 'Sandwichera'),
                        t('Mini Processador', 'Mini Processor', 'Mini Procesador'),
                    ].map((item, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm"
                        >
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-1">
                    {t('+ Panelas, louça e talheres.', '+ Pots, crockery and cutlery.', '+ Ollas, vajilla y cubiertos.')}
                </p>
            </div>

            {/* Quarto Acolhedor */}
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg text-purple-600 dark:text-purple-400">
                        <Wind size={16} />
                    </div>
                    <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                        {t('Quarto Acolhedor', 'Cozy Bedroom', 'Habitación Acogedora')}
                    </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        t('Ar-condicionado', 'Air conditioning', 'Aire acondicionado'),
                        t('Ventilador', 'Fan', 'Ventilador'),
                        t('Roupas de Cama', 'Bed linen', 'Ropa de cama'),
                        t('TV', 'TV', 'TV'),
                        t('Escrivaninha', 'Desk', 'Escritorio'),
                    ].map(
                        (item, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm"
                            >
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                    {item}
                                </span>
                            </div>
                        )
                    )}
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
                            {t('Banheiro', 'Bathroom', 'Baño')}
                        </h4>
                    </div>
                    <ul className="space-y-1.5">
                        {[
                            t('Chuveiro Elétrico', 'Electric Shower', 'Ducha Eléctrica'),
                            t('Secador de Cabelo', 'Hair dryer', 'Secador de pelo'),
                            t('Toalhas e Sabonete', 'Towels and Soap', 'Toallas y Jabón'),
                        ].map(
                            (item, idx) => (
                                <li
                                    key={idx}
                                    className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5"
                                >
                                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span> {item}
                                </li>
                            )
                        )}
                    </ul>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Briefcase size={16} />
                        </div>
                        <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                            {t('Home Office', 'Home Office', 'Oficina en Casa')}
                        </h4>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        {t(
                            'Espaço com iluminação confortável e conexão rápida. Ideal para reuniões e estudos.',
                            'Space with comfortable lighting and fast connection. Ideal for meetings and studies.',
                            'Espacio con iluminación cómoda y conexión rápida. Ideal para reuniones y estudios.'
                        )}
                    </p>
                </div>
            </div>
        </>
    );
};

export default FlatAmenitiesSheet;
