import React, { useState, useEffect } from 'react';
import {
    Utensils, Coffee, ShoppingBasket, Map,
    Flame, Pizza, Droplets,
    ShowerHead, Trash2, Ban, Lightbulb, UserCheck,
    Home, AlertTriangle, CalendarHeart,
    Tv, Wind, Briefcase, CheckCircle2, AlertCircle, MapPin,
    Ambulance, Shield, Phone, HeartPulse, Salad, Pill
} from 'lucide-react';
import SectionCard from '../SectionCard';
import PlaceCard from '../PlaceCard';
import BottomSheet from '../ui/BottomSheet';
import { PlaceRecommendation } from '../../types';

interface GuestRecommendationsProps {
    mergePlaces: (staticList: PlaceRecommendation[], category: string) => PlaceRecommendation[];
    hasContent: (list: PlaceRecommendation[], category: string) => boolean;
    activeEvents: PlaceRecommendation[];
    openEmergency?: boolean;
    emergencyRef?: React.RefObject<HTMLDivElement>;
}

const ExpandablePlaceList: React.FC<{ places: PlaceRecommendation[] }> = ({ places }) => {
    const LIMIT = 3;
    const [showAll, setShowAll] = useState(false);
    const visiblePlaces = showAll ? places : places.slice(0, LIMIT);
    const hiddenCount = places.length - LIMIT;

    if (places.length === 0) return null;

    return (
        <div className="flex flex-col gap-3 mb-5">
            {!showAll && places.length > LIMIT && (
                <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold font-sans ml-1">
                    Exibindo {LIMIT} de {places.length}
                </p>
            )}

            {visiblePlaces.map((place, idx) => (
                <PlaceCard key={idx} place={place} />
            ))}

            {places.length > LIMIT && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowAll(!showAll);
                    }}
                    className="w-full py-3 mt-1 text-xs font-bold font-sans text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-sm active:scale-[0.98]"
                >
                    {showAll ? 'Mostrar menos' : `Ver mais (+${hiddenCount})`}
                </button>
            )}
        </div>
    );
};

const CategoryHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
    <div className="flex items-center gap-2.5 mb-3 mt-4 px-1">
        <span className="text-lg filter drop-shadow-sm">{icon}</span>
        <h5 className="font-heading font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide">{title}</h5>
        <div className="h-px bg-gray-100 dark:bg-gray-700 flex-1 ml-2"></div>
    </div>
);

const GuestRecommendations: React.FC<GuestRecommendationsProps> = ({
    mergePlaces,
    hasContent,
    activeEvents,
    openEmergency,
    emergencyRef
}) => {
    const [activeSheet, setActiveSheet] = useState<string | null>(null);

    const handleOpen = (sheet: string) => {
        setActiveSheet(sheet);
    };

    const handleClose = () => {
        setActiveSheet(null);
    };

    useEffect(() => {
        if (openEmergency) {
            setActiveSheet('SOS & Emergência');
        }
    }, [openEmergency]);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* COLUNA 1 */}
                <div className="flex flex-col gap-6">

                    {/* O FLAT & COMODIDADES */}
                    <SectionCard
                        title="O Flat & Comodidades"
                        icon={Home}
                        color="bg-orange-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('O Flat & Comodidades')}
                    />

                    {/* REGRAS & AVISOS */}
                    <SectionCard
                        title="Regras & Avisos"
                        icon={AlertTriangle}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Regras & Avisos')}
                    />

                    {/* MERCADOS E SERVIÇOS */}
                    <SectionCard
                        title="Mercados e Serviços"
                        icon={ShoppingBasket}
                        color="bg-green-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Mercados e Serviços')}
                    />

                    {/* BARES E RESTAURANTES */}
                    <SectionCard
                        title="Bares e Restaurantes"
                        icon={Utensils}
                        color="bg-red-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Bares e Restaurantes')}
                    />
                </div>

                {/* COLUNA 2 */}
                <div className="flex flex-col gap-6">

                    {/* CAFÉS E PADARIAS */}
                    <SectionCard
                        title="Cafés e Padarias"
                        icon={Coffee}
                        color="bg-amber-600"
                        isTrigger={true}
                        onToggle={() => handleOpen('Cafés e Padarias')}
                    />

                    {/* PASSEIOS & LAZER */}
                    <SectionCard
                        title="Passeios & Lazer"
                        icon={Map}
                        color="bg-blue-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Passeios & Lazer')}
                    />

                    {/* EVENTOS & AGENDA */}
                    <SectionCard
                        title="Eventos & Agenda"
                        icon={CalendarHeart}
                        color="bg-pink-500"
                        isTrigger={true}
                        onToggle={() => handleOpen('Eventos & Agenda')}
                    />

                    {/* SOS & EMERGÊNCIA */}
                    <div ref={emergencyRef} className="break-inside-avoid">
                        <SectionCard
                            title="SOS & Emergência"
                            icon={HeartPulse}
                            color="bg-red-600"
                            isTrigger={true}
                            onToggle={() => handleOpen('SOS & Emergência')}
                        />
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SHEETS --- */}

            {/* O FLAT & COMODIDADES */}
            <BottomSheet
                isOpen={activeSheet === 'O Flat & Comodidades'}
                onClose={handleClose}
                title="O Flat & Comodidades"
                icon={Home}
            >
                <div className="flex flex-col gap-6 text-gray-700 dark:text-gray-300">
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                            Um flat todo equipado, confortável e novinho! Com 30m² cheios de estilo, é fácil de manter organizado e atende perfeitamente às necessidades do dia a dia.
                        </p>
                    </div>

                    {/* SOBRE A LOCALIZAÇÃO */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg text-orange-600 dark:text-orange-400">
                                <MapPin size={16} />
                            </div>
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Sobre a Localização</h4>
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
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Aeroporto: 15-20 min</span>
                                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Rodoviária: 10-15 min</span>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-800/20 rounded-xl p-3 mt-2">
                                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase mb-1">Curiosidade Local</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                    Quase em frente, você verá o icônico <strong className="text-orange-800 dark:text-orange-300">Monumento da Integração</strong> (apelidado de "Monumento da Besteira"). Ele simboliza a união dos bairros de Petrolina! 🤩
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SALA DE ESTAR */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg text-blue-600 dark:text-blue-400">
                                <Tv size={16} />
                            </div>
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Sala de Estar</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">TV de 50"</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Cafeteira</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Jogos de Tabuleiro</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Livros</span>
                            </div>
                        </div>
                    </div>

                    {/* COZINHA COMPLETA */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-600 dark:text-green-400">
                                <Utensils size={16} />
                            </div>
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Cozinha Completa</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Geladeira Inverter</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Microondas</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Air Fryer</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Liquidificador</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Sanduicheira</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Mini Processador</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 pl-1">+ Panelas, louça e talheres.</p>
                    </div>

                    {/* QUARTO ACOLHEDOR */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-lg text-purple-600 dark:text-purple-400">
                                <Wind size={16} />
                            </div>
                            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Quarto Acolhedor</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ar-condicionado</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Ventilador</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Roupas de Cama</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">TV</span>
                            </div>
                            <div className="border border-gray-100 dark:border-gray-700 rounded-xl p-2.5 text-center bg-white dark:bg-gray-800 shadow-sm col-span-1">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Escrivaninha</span>
                            </div>
                        </div>
                    </div>

                    {/* BANHEIRO & HOME OFFICE */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-cyan-100 dark:bg-cyan-900/30 p-1.5 rounded-lg text-cyan-600 dark:text-cyan-400">
                                    <ShowerHead size={16} />
                                </div>
                                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Banheiro</h4>
                            </div>
                            <ul className="space-y-1.5">
                                <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span> Chuveiro Elétrico
                                </li>
                                <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span> Secador de Cabelo
                                </li>
                                <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                    <span className="w-1 h-1 rounded-full bg-cyan-500"></span> Toalhas e Sabonete
                                </li>
                            </ul>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <Briefcase size={16} />
                                </div>
                                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">Home Office</h4>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Espaço com iluminação confortável e conexão rápida. Ideal para reuniões e estudos.
                            </p>
                        </div>
                    </div>
                </div>
            </BottomSheet>

            {/* REGRAS & AVISOS */}
            <BottomSheet
                isOpen={activeSheet === 'Regras & Avisos'}
                onClose={handleClose}
                title="Regras & Avisos"
                icon={AlertTriangle}
            >
                <div className="flex flex-col gap-4">
                    {/* HÓSPEDES DA RESERVA */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <UserCheck size={18} className="text-red-500" />
                            <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">Hóspedes da Reserva</h4>
                        </div>
                        <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                            Acesso exclusivo aos hóspedes da reserva. Proibida a entrada de visitantes.
                        </p>
                    </div>

                    {/* VOLTAGEM */}
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} className="text-red-500" />
                            <h4 className="font-heading font-bold text-sm text-red-800 dark:text-red-200">Atenção: Voltagem 220V</h4>
                        </div>
                        <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                            Cuidado ao ligar secadores e equipamentos.
                        </p>
                    </div>

                    {/* LIXO */}
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Trash2 size={18} className="text-blue-500" />
                            <h4 className="font-heading font-bold text-sm text-blue-800 dark:text-blue-200">Descarte de Lixo</h4>
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed mb-1">
                            Segunda, Quarta e Sexta (06:00 – 18:00h).
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                            Local: Na calçada entre o totem e o poste (<span className="font-bold">não colocar no vizinho</span>).
                        </p>
                    </div>

                    {/* ENXOVAL */}
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets size={18} className="text-amber-500" />
                            <h4 className="font-heading font-bold text-sm text-amber-800 dark:text-amber-200">Cuidado com o Enxoval</h4>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                            Danos ou manchas em lençóis e toalhas poderão gerar cobrança de taxa de reposição.
                        </p>
                    </div>

                    {/* CHECKOUT RÁPIDO */}
                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-800/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={18} className="text-green-600" />
                            <h4 className="font-heading font-bold text-sm text-green-800 dark:text-green-200">Check-out Rápido</h4>
                        </div>
                        <ul className="space-y-2 mb-3">
                            <li className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                Apague luzes e desligue o AC
                            </li>
                            <li className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                Feche as janelas
                            </li>
                            <li className="text-xs text-green-700 dark:text-green-300 flex items-start gap-2">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                                <span>Chave: Devolva na caixinha <strong className="font-bold">"Self Checkout"</strong></span>
                            </li>
                        </ul>
                        <button className="px-3 py-2 bg-white dark:bg-green-900/40 border border-green-200 dark:border-green-800 rounded-lg text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wide flex items-center gap-1.5 shadow-sm hover:bg-green-50 dark:hover:bg-green-900/60 transition-colors min-h-[32px]">
                            <Tv size={12} /> Ver Foto
                        </button>
                    </div>

                    {/* LISTA DE PROIBIÇÕES */}
                    <div className="space-y-2.5 pl-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Limpeza por conta do hóspede durante a estadia</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Não deixar pertences no hall ou áreas comuns</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Proibido fumar dentro do flat</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Proibido som alto</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Não são permitidos animais</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Não permitimos festas/eventos</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Não usar para qualquer atividade ilegal</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Ban size={14} className="text-gray-400" />
                            <span>Não secar roupas na cama ou sofá</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                            <Lightbulb size={14} className="text-green-500" />
                            <span>Usar AC com portas/janelas fechadas</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                            <Lightbulb size={14} className="text-green-500" />
                            <span>Usar água e energia de forma responsável</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                            <AlertCircle size={14} className="text-red-500" />
                            <span>Avisar imediatamente sobre danos</span>
                        </div>
                    </div>
                </div>
            </BottomSheet>

            {/* MERCADOS E SERVIÇOS */}
            <BottomSheet
                isOpen={activeSheet === 'Mercados e Serviços'}
                onClose={handleClose}
                title="Mercados e Serviços"
                icon={ShoppingBasket}
            >
                {hasContent([], 'essentials') && (
                    <>
                        <CategoryHeader title="Mercados" icon={<ShoppingBasket size={18} className="text-green-600" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'essentials')} />
                    </>
                )}

                {hasContent([], 'pharmacies') && (
                    <>
                        <CategoryHeader title="Farmácias" icon={<Pill size={18} className="text-red-500" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'pharmacies')} />
                    </>
                )}

                {hasContent([], 'laundry') && (
                    <>
                        <CategoryHeader title="Lavanderia" icon={<span role="img" aria-label="laundry">🧺</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'laundry')} />
                    </>
                )}

                {hasContent([], 'salon') && (
                    <>
                        <CategoryHeader title="Salão de Beleza" icon={<span role="img" aria-label="salon">💇‍♀️</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'salon')} />
                    </>
                )}

                {hasContent([], 'gym') && (
                    <>
                        <CategoryHeader title="Academia" icon={<span role="img" aria-label="gym">💪</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'gym')} />
                    </>
                )}
            </BottomSheet>

            {/* BARES E RESTAURANTES */}
            <BottomSheet
                isOpen={activeSheet === 'Bares e Restaurantes'}
                onClose={handleClose}
                title="Bares e Restaurantes"
                icon={Utensils}
            >
                {hasContent([], 'bars') && (
                    <>
                        <CategoryHeader title="Bares & Pubs" icon={<span role="img" aria-label="beer">🍺</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'bars')} />
                    </>
                )}

                {hasContent([], 'burgers') && (
                    <>
                        <CategoryHeader title="Hambúrguer & Sanduíches" icon={<span role="img" aria-label="burger">🍔</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'burgers')} />
                    </>
                )}

                {hasContent([], 'skewers') && (
                    <>
                        <CategoryHeader title="Espetinhos & Jantinha" icon={<Flame size={18} className="text-orange-500" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'skewers')} />
                    </>
                )}

                {hasContent([], 'salads') && (
                    <>
                        <CategoryHeader title="Saladas & Saudável" icon={<Salad size={18} className="text-green-500" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'salads')} />
                    </>
                )}

                {hasContent([], 'pasta') && (
                    <>
                        <CategoryHeader title="Pizzas & Massas" icon={<Pizza size={18} className="text-red-500" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'pasta')} />
                    </>
                )}

                {hasContent([], 'oriental') && (
                    <>
                        <CategoryHeader title="Oriental & Sushi" icon={<span role="img" aria-label="sushi">🍣</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'oriental')} />
                    </>
                )}

                {hasContent([], 'alacarte') && (
                    <>
                        <CategoryHeader title="À La Carte & Refinados" icon={<Utensils size={18} className="text-gray-500" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'alacarte')} />
                    </>
                )}

                {hasContent([], 'selfservice') && (
                    <>
                        <CategoryHeader title="Self-Service & Almoço" icon={<Utensils size={18} className="text-green-600" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'selfservice')} />
                    </>
                )}

                {hasContent([], 'snacks') && (
                    <>
                        <CategoryHeader title="Lanches Rápidos" icon={<span role="img" aria-label="hotdog">🌭</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'snacks')} />
                    </>
                )}
            </BottomSheet>

            {/* CAFÉS E PADARIAS */}
            <BottomSheet
                isOpen={activeSheet === 'Cafés e Padarias'}
                onClose={handleClose}
                title="Cafés e Padarias"
                icon={Coffee}
            >
                {hasContent([], 'cafes') && (
                    <>
                        <CategoryHeader title="Cafés & Padarias" icon={<Coffee size={18} className="text-amber-700" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'cafes')} />
                    </>
                )}
            </BottomSheet>

            {/* PASSEIOS & LAZER */}
            <BottomSheet
                isOpen={activeSheet === 'Passeios & Lazer'}
                onClose={handleClose}
                title="Passeios & Lazer"
                icon={Map}
            >
                {hasContent([], 'attractions') && (
                    <>
                        <CategoryHeader title="Passeios Imperdíveis" icon={<Map size={18} className="text-blue-600" />} />
                        <ExpandablePlaceList places={mergePlaces([], 'attractions')} />
                    </>
                )}

                {hasContent([], 'bikes') && (
                    <>
                        <CategoryHeader title="Aluguel de Bicicletas" icon={<span role="img" aria-label="bike">🚲</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'bikes')} />
                    </>
                )}

                {hasContent([], 'souvenirs') && (
                    <>
                        <CategoryHeader title="Lembrancinhas" icon={<span role="img" aria-label="gift">🎁</span>} />
                        <ExpandablePlaceList places={mergePlaces([], 'souvenirs')} />
                    </>
                )}
            </BottomSheet>

            {/* EVENTOS & AGENDA */}
            <BottomSheet
                isOpen={activeSheet === 'Eventos & Agenda'}
                onClose={handleClose}
                title="Eventos & Agenda"
                icon={CalendarHeart}
            >
                {activeEvents.length > 0 ? (
                    <ExpandablePlaceList places={activeEvents} />
                ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        <p className="text-xs">Nenhum evento programado para os próximos dias.</p>
                    </div>
                )}
            </BottomSheet>

            {/* SOS & EMERGÊNCIA */}
            <BottomSheet
                isOpen={activeSheet === 'SOS & Emergência'}
                onClose={handleClose}
                title="SOS & Emergência"
                icon={HeartPulse}
            >
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <a href="tel:192" className="flex flex-col items-center justify-center p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 transition-all active:scale-95 group">
                        <Ambulance size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold font-heading leading-none">192</span>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-90">SAMU</span>
                    </a>
                    <a href="tel:193" className="flex flex-col items-center justify-center p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-lg shadow-orange-600/30 transition-all active:scale-95 group">
                        <Flame size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold font-heading leading-none">193</span>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-90">Bombeiros</span>
                    </a>
                    <a href="tel:190" className="flex flex-col items-center justify-center p-4 bg-blue-800 hover:bg-blue-900 text-white rounded-xl shadow-lg shadow-blue-800/30 transition-all active:scale-95 group">
                        <Shield size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold font-heading leading-none">190</span>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-90">Polícia</span>
                    </a>
                    <a href="tel:188" className="flex flex-col items-center justify-center p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-lg shadow-teal-600/30 transition-all active:scale-95 group">
                        <Phone size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                        <span className="text-2xl font-bold font-heading leading-none">188</span>
                        <span className="text-xs uppercase font-bold tracking-wider opacity-90">CVV (Vida)</span>
                    </a>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-bold font-heading uppercase tracking-wider ml-1">Hospitais e Clínicas</p>
                <ExpandablePlaceList places={mergePlaces([], 'emergency')} />
            </BottomSheet>
        </>
    );
};

export default GuestRecommendations;
