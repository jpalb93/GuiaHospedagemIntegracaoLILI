import React from 'react';
import {
    X,
    PenTool,
    AlertTriangle,
    MessageCircle,
    ChevronRight,
    HelpCircle,
    Clock,
    Building2,
} from 'lucide-react';
import { HOST_PHONE } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';

interface SupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    guestName: string;
    hostPhone?: string;
    propertyId?: 'lili' | 'integracao';
    flatNumber?: string;
}

const SupportModal: React.FC<SupportModalProps> = ({
    isOpen,
    onClose,
    guestName,
    hostPhone,
    propertyId = 'lili',
    flatNumber,
}) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    const isIntegracao = propertyId === 'integracao';
    const propertyName = isIntegracao ? 'Flats Integração' : 'Flat da Lili';
    const unitInfo = flatNumber ? ` - Flat ${flatNumber}` : '';

    const openWhatsApp = (subject: string, text: string) => {
        if (navigator.vibrate) navigator.vibrate(50);
        const message = `Olá! Sou ${guestName} (${propertyName}${unitInfo}).\n\n*Assunto: ${subject}*\n${text}`;
        const phone = hostPhone || HOST_PHONE;
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#120F0D]/80 z-[160] flex flex-col items-end justify-end sm:items-center sm:justify-center p-0 sm:p-4 animate-fadeIn backdrop-blur-md">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-[#FAF7F2] dark:bg-[#1C1614] w-full max-w-sm rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-slideUp sm:animate-scaleIn border border-stone-200/80 dark:border-amber-500/15">
                {/* Header */}
                <div
                    className={`p-6 pb-9 text-white relative overflow-hidden ${
                        isIntegracao
                            ? 'bg-gradient-to-br from-[#16283B] via-[#1B334B] to-[#0F1D2C]'
                            : 'bg-gradient-to-br from-[#C85A32] via-[#B54B25] to-[#8A3416]'
                    }`}
                >
                    <div
                        className={`absolute -top-12 -right-12 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
                            isIntegracao ? 'bg-sky-400/20' : 'bg-amber-300/25'
                        }`}
                    />
                    <button
                        onClick={onClose}
                        aria-label="Fechar central de ajuda"
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/15 hover:bg-black/25 border border-white/15 transition-all active:scale-95"
                    >
                        <X size={20} />
                    </button>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/15 text-[10px] font-bold uppercase tracking-widest mb-2.5 backdrop-blur-sm">
                        <Building2 size={11} className="text-amber-300" />
                        <span>
                            {propertyName}
                            {unitInfo}
                        </span>
                    </div>

                    <h2 className="text-2xl font-display font-semibold flex items-center gap-2 mb-1 tracking-tight">
                        <HelpCircle size={22} className="text-amber-300 shrink-0" />
                        {isIntegracao
                            ? t('Central de Ajuda', 'Help Center', 'Centro de Ayuda')
                            : t('Fale com a Lili', 'Talk to Lili', 'Habla con Lili')}
                    </h2>
                    <p className="text-white/85 text-xs font-medium">
                        {t(
                            'Escolha o assunto para abrir a conversa no WhatsApp:',
                            'Choose a topic to start a WhatsApp chat:',
                            'Elige un tema para abrir el chat en WhatsApp:'
                        )}
                    </p>
                </div>

                <div className="p-4 -mt-4 bg-[#FAF7F2] dark:bg-[#1C1614] rounded-t-[24px] space-y-2.5 relative z-20">
                    <button
                        onClick={() =>
                            openWhatsApp('Manutenção / Algo Quebrou', 'Notei um problema com...')
                        }
                        className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#241C19] hover:bg-amber-50/50 dark:hover:bg-[#2C221E] transition-all flex items-center justify-between group border border-stone-200/80 dark:border-amber-500/15 shadow-sm active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-500/15 flex items-center justify-center text-[#C85A32] dark:text-amber-300 group-hover:scale-110 transition-transform border border-amber-200/60 dark:border-amber-500/20">
                                <PenTool size={18} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                    {t(
                                        'Reportar Problema',
                                        'Report an Issue',
                                        'Reportar un Problema'
                                    )}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {t(
                                        'Algo quebrou ou precisa de ajuste?',
                                        'Something broken or needs fixing?',
                                        '¿Algo se rompió o necesita ajuste?'
                                    )}
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-stone-300 dark:text-stone-600 group-hover:text-[#C85A32] dark:group-hover:text-amber-400 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() =>
                            openWhatsApp(
                                'Check-in / Check-out',
                                'Tenho uma dúvida sobre os horários ou acesso...'
                            )
                        }
                        className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#241C19] hover:bg-sky-50/50 dark:hover:bg-[#2C221E] transition-all flex items-center justify-between group border border-stone-200/80 dark:border-amber-500/15 shadow-sm active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-sky-100/80 dark:bg-sky-500/15 flex items-center justify-center text-sky-600 dark:text-sky-300 group-hover:scale-110 transition-transform border border-sky-200/60 dark:border-sky-500/20">
                                <Clock size={18} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                    {t(
                                        'Check-in & Check-out',
                                        'Check-in & Check-out',
                                        'Check-in y Check-out'
                                    )}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {t(
                                        'Dúvidas sobre horários, senhas ou chaves',
                                        'Questions about times, codes or keys',
                                        'Dudas sobre horarios, claves o llaves'
                                    )}
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-stone-300 dark:text-stone-600 group-hover:text-sky-500 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() => openWhatsApp('Dúvida Geral', 'Tenho uma dúvida sobre...')}
                        className="w-full p-3.5 rounded-2xl bg-white dark:bg-[#241C19] hover:bg-emerald-50/40 dark:hover:bg-[#2C221E] transition-all flex items-center justify-between group border border-stone-200/80 dark:border-amber-500/15 shadow-sm active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-300 group-hover:scale-110 transition-transform border border-emerald-200/60 dark:border-emerald-500/20">
                                <MessageCircle size={18} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                                    {t('Dúvida Rápida', 'Quick Question', 'Duda Rápida')}
                                </p>
                                <p className="text-xs text-stone-500 dark:text-stone-400">
                                    {t(
                                        'Sobre o flat, comodidades ou Petrolina',
                                        'About the flat, amenities or Petrolina',
                                        'Sobre el piso, comodidades o Petrolina'
                                    )}
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-stone-300 dark:text-stone-600 group-hover:text-emerald-500 transition-colors"
                        />
                    </button>

                    <button
                        onClick={() => openWhatsApp('EMERGÊNCIA', 'Preciso de ajuda urgente!')}
                        className="w-full p-3.5 rounded-2xl bg-red-50/90 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all flex items-center justify-between group border border-red-200/80 dark:border-red-500/30 active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform animate-pulse border border-red-200 dark:border-red-500/30">
                                <AlertTriangle size={18} />
                            </div>
                            <div className="text-left">
                                <p className="font-bold text-red-700 dark:text-red-300 text-sm">
                                    {t('Emergência', 'Emergency', 'Emergencia')}
                                </p>
                                <p className="text-xs text-red-600/80 dark:text-red-400/80">
                                    {t(
                                        'Assunto urgente na hospedagem',
                                        'Urgent matter with your stay',
                                        'Asunto urgente en el alojamiento'
                                    )}
                                </p>
                            </div>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-red-300 dark:text-red-700 group-hover:text-red-500 transition-colors"
                        />
                    </button>
                </div>

                <div className="p-3.5 bg-stone-100/70 dark:bg-[#171210] text-center border-t border-stone-200/80 dark:border-amber-500/10">
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        {t(
                            'Atendimento direto pelo WhatsApp • Resposta rápida',
                            'Direct support via WhatsApp • Fast reply',
                            'Atención directa por WhatsApp • Respuesta rápida'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SupportModal;
