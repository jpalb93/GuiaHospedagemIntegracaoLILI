import React, { useState, useEffect } from 'react';
import {
    X,
    Check,
    ArrowLeft,
    Key,
    Info,
    AlertTriangle,
    MessageCircle,
    Clock,
    Sparkles,
} from 'lucide-react';
import { GuestConfig } from '../../types';
import { Button } from '../ui';
import { useLanguage } from '../../hooks/useLanguage';
import { HOST_PHONE } from '../../constants';
import { PROPERTIES } from '../../config/properties';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: GuestConfig;
    startOnKeyDetails?: boolean;
    hostPhone?: string;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    config,
    startOnKeyDetails = false,
    hostPhone,
}) => {
    const { t } = useLanguage();
    const [showKeyDetails, setShowKeyDetails] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
        belongings: false,
        appliances: false,
        keys: false,
    });

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowKeyDetails(!!startOnKeyDetails);
        }
    }, [isOpen, startOnKeyDetails]);

    if (!isOpen) return null;

    const isIntegracao = config.propertyId === 'integracao';
    const property = PROPERTIES[config.propertyId || 'lili'];
    const completedCount = Object.values(checkedItems).filter(Boolean).length;

    const toggleItem = (key: 'belongings' | 'appliances' | 'keys') => {
        if (navigator.vibrate) navigator.vibrate(30);
        setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleClose = () => {
        setShowKeyDetails(false);
        onClose();
    };

    const handleNotifyCheckoutWhatsApp = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        const unitInfo = config.flatNumber ? ` (Flat ${config.flatNumber})` : '';
        const msg = `Olá! Sou ${config.guestName || 'hóspede'}${unitInfo} do ${property.name}. Acabei de realizar o check-out e já deixei a chave no Self Checkout! Muito obrigado pela estadia! ✨`;
        const phone = hostPhone || property.hostPhone || HOST_PHONE;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            {/* BACKDROP PRINCIPAL */}
            <div
                className="absolute inset-0 bg-[#120F0D]/75 backdrop-blur-md"
                onClick={handleClose}
                role="button"
                tabIndex={0}
                aria-label="Fechar modal"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClose();
                }}
            ></div>

            {/* MODAL PRINCIPAL */}
            <div className="bg-[#FAF7F2] dark:bg-[#1C1614] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-slideUp sm:animate-scaleIn flex flex-col max-h-[92vh] border border-stone-200/80 dark:border-amber-500/15">
                {/* BOTÃO FECHAR */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md transition-all bg-black/15 hover:bg-black/25 text-white border border-white/15 active:scale-95"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* === CONTEÚDO: CHECKLIST PADRÃO === */}
                <div
                    className={`p-6 pb-7 text-white relative overflow-hidden ${
                        isIntegracao
                            ? 'bg-gradient-to-br from-[#16283B] via-[#1B334B] to-[#0F1D2C]'
                            : 'bg-gradient-to-br from-[#C85A32] via-[#B54B25] to-[#8A3416]'
                    }`}
                >
                    <div
                        className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
                            isIntegracao ? 'bg-sky-400/20' : 'bg-amber-300/25'
                        }`}
                    />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-display font-semibold tracking-tight mb-1">
                            {t(
                                'Check-out Sem Estresse ✨',
                                'Stress-Free Check-out ✨',
                                'Check-out Sin Estrés ✨'
                            )}
                        </h2>
                        <p className="text-white/85 text-xs font-medium">
                            {t(
                                'Marque os passos abaixo antes de partir',
                                'Check the steps below before leaving',
                                'Marca los pasos abajo antes de salir'
                            )}
                        </p>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto space-y-4 bg-[#FAF7F2] dark:bg-[#1C1614]">
                    {/* Card Horário Limite */}
                    <div className="bg-white dark:bg-[#241C19] p-4 rounded-2xl border border-stone-200/80 dark:border-amber-500/15 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                                    isIntegracao
                                        ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-200/60 dark:border-sky-500/25'
                                        : 'bg-amber-50 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-300 border-amber-200/60 dark:border-amber-500/25'
                                }`}
                            >
                                <Clock size={18} />
                            </div>
                            <div>
                                <p className="font-bold text-stone-900 dark:text-stone-100 font-heading text-sm">
                                    {t('Horário Limite', 'Check-out Time', 'Hora Límite')}
                                </p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                                    {t(
                                        'Para nossa equipe iniciar a preparação.',
                                        'So our team can start preparing.',
                                        'Para que nuestro equipo inicie la limpieza.'
                                    )}
                                </p>
                            </div>
                        </div>
                        <p
                            className={`text-2xl font-bold font-mono tracking-tight ${
                                isIntegracao
                                    ? 'text-sky-700 dark:text-sky-300'
                                    : 'text-[#C85A32] dark:text-amber-300'
                            }`}
                        >
                            {config.checkOutTime || '11:00'}
                        </p>
                    </div>

                    {/* Checklist Interativo */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 font-heading">
                                {t(
                                    'Checklist Rápido (toque para marcar)',
                                    'Quick Checklist (tap to check)',
                                    'Lista Rápida (toca para marcar)'
                                )}
                            </p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-white/10 text-stone-700 dark:text-amber-300">
                                {completedCount}/3
                            </span>
                        </div>

                        {/* Item 1: Caça ao Tesouro */}
                        <button
                            type="button"
                            onClick={() => toggleItem('belongings')}
                            className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.99] shadow-sm ${
                                checkedItems.belongings
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300/70 dark:border-emerald-500/30'
                                    : 'bg-white dark:bg-[#241C19] border-stone-200/80 dark:border-amber-500/15 hover:border-amber-300/60'
                            }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors border ${
                                    checkedItems.belongings
                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                        : 'bg-stone-100 dark:bg-white/5 text-stone-400 border-stone-300 dark:border-white/15'
                                }`}
                            >
                                <Check size={13} strokeWidth={3} />
                            </div>
                            <div className="flex-1">
                                <p
                                    className={`font-bold text-xs transition-colors ${
                                        checkedItems.belongings
                                            ? 'line-through text-stone-500 dark:text-stone-400'
                                            : 'text-stone-900 dark:text-stone-100'
                                    }`}
                                >
                                    {t('Caça ao Tesouro', 'Treasure Hunt', 'Búsqueda del Tesoro')}
                                </p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                                    {t(
                                        'Verifique gavetas, banheiro, embaixo dos travesseiros e tomadas (carregadores!).',
                                        'Check drawers, bathroom, under pillows and sockets (chargers!).',
                                        'Revise cajones, baño, almohadas y enchufes (¡cargadores!).'
                                    )}
                                </p>
                            </div>
                        </button>

                        {/* Item 2: Tudo Desligado */}
                        <button
                            type="button"
                            onClick={() => toggleItem('appliances')}
                            className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl border transition-all active:scale-[0.99] shadow-sm ${
                                checkedItems.appliances
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300/70 dark:border-emerald-500/30'
                                    : 'bg-white dark:bg-[#241C19] border-stone-200/80 dark:border-amber-500/15 hover:border-amber-300/60'
                            }`}
                        >
                            <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors border ${
                                    checkedItems.appliances
                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                        : 'bg-stone-100 dark:bg-white/5 text-stone-400 border-stone-300 dark:border-white/15'
                                }`}
                            >
                                <Check size={13} strokeWidth={3} />
                            </div>
                            <div className="flex-1">
                                <p
                                    className={`font-bold text-xs transition-colors ${
                                        checkedItems.appliances
                                            ? 'line-through text-stone-500 dark:text-stone-400'
                                            : 'text-stone-900 dark:text-stone-100'
                                    }`}
                                >
                                    {t('Tudo Desligado?', 'Everything Off?', '¿Todo Apagado?')}
                                </p>
                                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                                    {t(
                                        'Ar-condicionado desligado, janelas fechadas e luzes apagadas.',
                                        'Air conditioning off, windows closed and lights off.',
                                        'Aire acondicionado apagado, ventanas cerradas y luces apagadas.'
                                    )}
                                </p>
                            </div>
                        </button>

                        {/* Item 3: A Chave (Com botão de ver foto) */}
                        <div
                            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all shadow-sm relative overflow-hidden ${
                                checkedItems.keys
                                    ? 'bg-emerald-50/70 dark:bg-emerald-950/25 border-emerald-300/70 dark:border-emerald-500/30'
                                    : 'bg-white dark:bg-[#241C19] border-stone-200/80 dark:border-amber-500/15'
                            }`}
                        >
                            <div className="absolute right-0 top-0 h-full w-1 bg-[#C85A32]"></div>
                            <button
                                type="button"
                                onClick={() => toggleItem('keys')}
                                aria-label="Marcar devolução da chave"
                                className={`w-6 h-6 rounded-full flex items-center justify-center mt-0.5 shrink-0 transition-colors border ${
                                    checkedItems.keys
                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                        : 'bg-amber-100 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-300 border-amber-300 dark:border-amber-500/30'
                                }`}
                            >
                                {checkedItems.keys ? (
                                    <Check size={13} strokeWidth={3} />
                                ) : (
                                    <Key size={12} strokeWidth={2.5} />
                                )}
                            </button>
                            <div className="flex-1">
                                <div
                                    onClick={() => toggleItem('keys')}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') toggleItem('keys');
                                    }}
                                    className="cursor-pointer"
                                >
                                    <p
                                        className={`font-bold text-xs ${
                                            checkedItems.keys
                                                ? 'line-through text-stone-500 dark:text-stone-400'
                                                : 'text-stone-900 dark:text-stone-100'
                                        }`}
                                    >
                                        {isIntegracao
                                            ? t('As Chaves', 'The Keys', 'Las Llaves')
                                            : t('A Chave', 'The Key', 'La Llave')}
                                    </p>
                                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug mb-2.5">
                                        {t(
                                            'Deve ser devolvida na caixinha "Self Checkout" (no 1º andar) após abrir o portão.',
                                            'Must be returned to the "Self Checkout" box (1st floor) after opening the gate.',
                                            'Debe devolverse en la cajita "Self Checkout" (1º piso) tras abrir el portón.'
                                        )}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setShowKeyDetails(true)}
                                    fullWidth
                                    size="sm"
                                    leftIcon={<Info size={13} />}
                                    className="bg-amber-50 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/25 text-[11px] font-bold uppercase tracking-wide rounded-xl"
                                >
                                    {t(
                                        'Ver foto e onde deixar',
                                        'See photo & where to leave it',
                                        'Ver foto y dónde dejarla'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Avisar Check-out no WhatsApp */}
                    <div className="pt-1 space-y-3">
                        <button
                            type="button"
                            onClick={handleNotifyCheckoutWhatsApp}
                            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <MessageCircle size={16} />
                            <span>
                                {t(
                                    'Já saí! Avisar Check-out no WhatsApp',
                                    'I checked out! Notify via WhatsApp',
                                    '¡Ya salí! Avisar Check-out por WhatsApp'
                                )}
                            </span>
                        </button>

                        <div className="bg-amber-50/70 dark:bg-[#241C19] p-3.5 rounded-2xl text-center border border-amber-200/60 dark:border-amber-500/15">
                            <p className="text-xs text-stone-800 dark:text-amber-100 font-semibold flex items-center justify-center gap-1.5">
                                <Sparkles
                                    size={13}
                                    className="text-[#C85A32] dark:text-amber-400"
                                />
                                {t(
                                    'Obrigado por ficar conosco! 🌵',
                                    'Thank you for staying with us! 🌵',
                                    '¡Gracias por quedarte con nosotros! 🌵'
                                )}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 font-medium">
                                {t(
                                    'Boa viagem de volta e até a próxima!',
                                    'Have a safe trip back and see you next time!',
                                    '¡Buen viaje de regreso y hasta la próxima!'
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* === MODAL SOBRE MODAL: DETALHES DA CHAVE === */}
                {showKeyDetails && (
                    <div className="absolute inset-0 z-20 bg-[#FAF7F2] dark:bg-[#1C1614] animate-slideUp flex flex-col">
                        <div className="p-4 bg-white dark:bg-[#241C19] flex items-center gap-3 border-b border-stone-200/80 dark:border-amber-500/15 pr-14">
                            <Button
                                variant="icon"
                                onClick={() => setShowKeyDetails(false)}
                                className="bg-stone-100 dark:bg-white/10 shadow-sm text-stone-700 dark:text-white hover:bg-stone-200"
                                aria-label="Voltar"
                            >
                                <ArrowLeft size={18} />
                            </Button>
                            <h3 className="font-display font-semibold text-lg text-stone-900 dark:text-stone-100 truncate">
                                {t('Devolução da Chave', 'Key Return', 'Devolución de la Llave')}
                            </h3>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1 space-y-4">
                            <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200/80 dark:border-amber-500/20 relative group">
                                <img
                                    src="https://i.postimg.cc/vHR7g4F4/selfcheckout.jpg"
                                    alt="Caixinha Self Checkout"
                                    className="w-full h-64 object-cover object-center"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-[#120F0D]/85 p-3 text-center backdrop-blur-sm">
                                    <p className="text-amber-100 text-xs font-bold uppercase tracking-widest">
                                        {t(
                                            'Caixinha Self Checkout (1º Andar)',
                                            'Self Checkout Box (1st Floor)',
                                            'Cajita Self Checkout (1º Piso)'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-[#241C19] p-4 rounded-2xl border border-amber-200/70 dark:border-amber-500/20 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <Info
                                        size={20}
                                        className="text-[#C85A32] dark:text-amber-400 shrink-0 mt-0.5"
                                    />
                                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed font-medium">
                                        {t(
                                            'No momento da saída, deposite a chave na caixinha ',
                                            'When leaving, drop the key into the ',
                                            'Al salir, deposite la llave en la cajita '
                                        )}
                                        <strong className="text-stone-900 dark:text-amber-200">
                                            "Self Checkout"
                                        </strong>
                                        {t(
                                            ' localizada no primeiro andar, ao lado do quadro de avisos.',
                                            ' box located on the first floor, next to the notice board.',
                                            ' ubicada en el primer piso, al lado del cuadro de avisos.'
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-2xl border border-red-200/80 dark:border-red-500/30 flex items-start gap-3">
                                <AlertTriangle
                                    size={20}
                                    className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                                />
                                <div>
                                    <p className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase tracking-wider mb-1">
                                        {t(
                                            'Atenção Importante',
                                            'Important Warning',
                                            'Atención Importante'
                                        )}
                                    </p>
                                    <p className="text-xs sm:text-sm text-red-900 dark:text-red-100 font-bold leading-snug">
                                        {t(
                                            'Deposite a chave SOMENTE DEPOIS de destrancar e abrir o portão da rua!',
                                            'Drop the key ONLY AFTER unlocking and opening the street gate!',
                                            '¡Deposite la llave SOLO DESPUÉS de abrir el portón de la calle!'
                                        )}
                                    </p>
                                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                                        {t(
                                            'Caso contrário, você ficará trancado do lado de dentro do prédio.',
                                            'Otherwise, you will be locked inside the building.',
                                            'De lo contrario, quedará encerrado dentro del edificio.'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;
