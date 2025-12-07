import React from 'react';
import {
    X,
    PenTool,
    AlertTriangle,
    MessageCircle,
    ChevronRight,
    HelpCircle,
    Clock,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestName: string;
    hostPhone?: string;
    propertyId?: 'lili' | 'integracao';
}

const SupportModal: React.FC<SupportModalProps> = ({
    isOpen,
    onClose,
    guestName,
    hostPhone,
    propertyId,
}) => {
    if (!isOpen) return null;

    const propertyName = propertyId === 'integracao' ? 'Flats Integração' : 'Flat da Lili';

    const openWhatsApp = (subject: string, text: string) => {
        if (navigator.vibrate) navigator.vibrate(50);
        const message = `Olá! Sou ${guestName} (${propertyName}). \n\n*Assunto: ${subject}*\n${text}`;
        const phone = hostPhone || HOST_PHONE;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/95 z-[160] flex flex-col items-end justify-end sm:items-center sm:justify-center p-4 animate-fadeIn backdrop-blur-sm">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-slideUp sm:animate-scaleIn border-t border-white/20 sm:border-none">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 p-6 pb-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-heading font-bold flex items-center gap-2 mb-1">
                        <HelpCircle size={24} className="text-orange-500" /> Central de Ajuda
                    </h2>
                    <p className="text-gray-400 text-xs font-medium">
                        Como podemos te ajudar agora?
                    </p>
                </div>

                <div className="p-4 -mt-4 bg-white dark:bg-gray-800 rounded-t-[24px] space-y-3 relative z-20">
                    <button
                        onClick={() =>
                            openWhatsApp('Manutenção / Algo Quebrou', 'Notei um problema com...')
                        }
                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                                <PenTool size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    Reportar Problema
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Algo quebrou ou não funciona?
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-gray-300 dark:text-gray-600 group-hover:text-orange-500 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() =>
                            openWhatsApp(
                                'Check-in / Check-out',
                                'Tenho uma dúvida sobre os horários ou acesso...'
                            )
                        }
                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    Check-in & Check-out
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Ficou alguma dúvida?
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() => openWhatsApp('Dúvida Geral', 'Tenho uma dúvida sobre...')}
                        className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                                <MessageCircle size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">
                                    Dúvida Simples
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Sobre o flat ou a cidade
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-gray-300 dark:text-gray-600 group-hover:text-green-500 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() => openWhatsApp('EMERGÊNCIA', 'Preciso de ajuda urgente!')}
                        className="w-full p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center justify-between group border border-red-100 dark:border-red-900/30"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform animate-pulse">
                                <AlertTriangle size={20} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-red-700 dark:text-red-400 text-sm">
                                    Emergência
                                </p>
                                <p className="text-xs text-red-600/70 dark:text-red-400/70">
                                    Assunto urgente
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-red-300 dark:text-red-800 group-hover:text-red-500 transition-colors"
                        />
                    </button>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 text-center border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] text-gray-400">
                        Geralmente respondemos em poucos minutos.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
