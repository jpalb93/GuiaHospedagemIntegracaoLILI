import React, { useState, useEffect } from 'react';
import { X, Check, ArrowLeft, Key, Info, AlertTriangle } from 'lucide-react';
import { GuestConfig } from '../../types';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: GuestConfig;
    startOnKeyDetails?: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    config,
    startOnKeyDetails = false,
}) => {
    const [showKeyDetails, setShowKeyDetails] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowKeyDetails(!!startOnKeyDetails);
        }
    }, [isOpen, startOnKeyDetails]);

    if (!isOpen) return null;

    const handleClose = () => {
        setShowKeyDetails(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
            {/* BACKDROP PRINCIPAL */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={handleClose}
                role="button"
                tabIndex={0}
                aria-label="Fechar modal"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClose();
                }}
            ></div>

            {/* MODAL PRINCIPAL */}
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-white/10">
                {/* BOTÃO FECHAR */}
                <button
                    onClick={handleClose}
                    className="absolute top-3 right-3 z-50 p-2 rounded-full backdrop-blur-md transition-colors bg-black/5 hover:bg-black/10 text-gray-600 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* === CONTEÚDO: CHECKLIST PADRÃO === */}
                <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                    <h2 className="text-xl font-heading font-bold mb-1">
                        Check-out Sem Estresse 😎
                    </h2>
                    <p className="text-blue-100 text-xs font-medium opacity-90">
                        Tudo pronto para partir?
                    </p>
                </div>

                <div className="p-5 overflow-y-auto space-y-5 bg-gray-50/50 dark:bg-gray-900/50">
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white font-heading text-sm">
                                Horário Limite
                            </p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                                Para a limpeza iniciar.
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-heading">
                            {config.checkOutTime || '11:00'}
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 font-heading pl-1">
                            Checklist Rápido
                        </p>

                        <div className="flex items-start gap-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-3 rounded-xl shadow-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mt-0.5">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-100 text-xs">
                                    Caça ao Tesouro
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                    Verifique gavetas e tomadas (carregadores!).
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-3 rounded-xl shadow-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400 mt-0.5">
                                <Check size={12} strokeWidth={3} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 dark:text-gray-100 text-xs">
                                    Tudo Desligado?
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                                    Ar condicionado e luzes apagadas.
                                </p>
                            </div>
                        </div>

                        {/* Item da Chave (Botão interno) */}
                        <div className="flex items-start gap-3 bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 p-3 rounded-xl shadow-sm relative overflow-hidden">
                            <div className="absolute right-0 top-0 h-full w-1 bg-orange-500"></div>
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-1 rounded-full text-orange-600 dark:text-orange-400 mt-0.5">
                                <Key size={12} strokeWidth={3} />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-800 dark:text-gray-100 text-xs">
                                    A Chave
                                </p>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight mb-2">
                                    Deve ser devolvida na caixinha "Self Checkout".
                                </p>

                                <button
                                    onClick={() => setShowKeyDetails(true)}
                                    className="w-full py-1.5 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-bold uppercase tracking-wide rounded-lg border border-orange-200 dark:border-orange-800/50 flex items-center justify-center gap-1.5 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
                                >
                                    <Info size={12} />
                                    Ver foto e onde deixar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl text-center border border-blue-100 dark:border-blue-800/30">
                        <p className="text-xs text-blue-900 dark:text-blue-200 font-semibold">
                            Obrigado por ficar conosco! 🌵
                        </p>
                        <p className="text-[10px] text-blue-700 dark:text-blue-300 mt-0.5 font-medium">
                            Boa viagem de volta!
                        </p>
                    </div>
                </div>

                {/* === MODAL SOBRE MODAL: DETALHES DA CHAVE === */}
                {showKeyDetails && (
                    <div className="absolute inset-0 z-20 bg-white dark:bg-gray-800 animate-slideUp flex flex-col">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 flex items-center gap-3 border-b border-gray-200 dark:border-gray-600 pr-12">
                            <button
                                onClick={() => setShowKeyDetails(false)}
                                className="p-1.5 bg-white dark:bg-gray-600 rounded-full shadow-sm text-gray-600 dark:text-white hover:bg-gray-50 transition-colors"
                                aria-label="Voltar"
                            >
                                <ArrowLeft size={18} />
                            </button>
                            <h3 className="font-heading font-bold text-gray-800 dark:text-white truncate">
                                Devolução da Chave
                            </h3>
                        </div>

                        <div className="p-5 overflow-y-auto flex-1">
                            <div className="mb-5 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-600 relative group">
                                <img
                                    src="https://i.postimg.cc/vHR7g4F4/selfcheckout.jpg"
                                    alt="Caixinha Self Checkout"
                                    className="w-full h-64 object-cover object-center"
                                />
                                <div className="absolute bottom-0 left-0 w-full bg-black/80 p-3 text-center backdrop-blur-sm">
                                    <p className="text-white text-sm font-bold uppercase tracking-wider">
                                        Caixa Self Checkout
                                    </p>
                                </div>
                            </div>

                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/50 mb-4">
                                <div className="flex items-start gap-3">
                                    <Info
                                        size={20}
                                        className="text-orange-600 dark:text-orange-400 shrink-0 mt-0.5"
                                    />
                                    <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                                        No dia do seu checkout, por favor deposite a chave na caixa
                                        do <strong>"Self Checkout"</strong> localizada no primeiro
                                        andar ao lado do quadro de avisos.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50 flex items-start gap-3">
                                <AlertTriangle
                                    size={20}
                                    className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
                                />
                                <div>
                                    <p className="text-xs font-bold text-red-700 dark:text-red-300 uppercase mb-1">
                                        Importante
                                    </p>
                                    <p className="text-sm text-red-800 dark:text-red-200 font-bold leading-snug">
                                        Deposite a chave SOMENTE DEPOIS de abrir o portão de
                                        entrada/saída!
                                    </p>
                                    <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                                        Caso contrário, você ficará trancado do lado de dentro.
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
