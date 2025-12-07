import React from 'react';
import { LogOut, MessageCircle, Wifi, MapPin } from 'lucide-react';
import { GuestConfig } from '../../../types';
import { triggerConfetti } from '../../../utils/confetti';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import AccessTicket from './AccessTicket';

interface PreCheckoutCardProps {
    config: GuestConfig;
    wifiCopied: boolean;
    addressCopied: boolean;
    currentWifiSSID: string;
    currentWifiPass: string;
    onOpenSupport: () => void;
    onEmergency: () => void;
    onSaveAccess: () => void;
    onCopyWifi: () => void;
    onCopyAddress: () => void;
    onOpenDriverMode: () => void;
    onOpenCheckout: () => void;
}

const PreCheckoutCard: React.FC<PreCheckoutCardProps> = ({
    config,
    onOpenSupport,
    onEmergency,
    onCopyWifi,
    onCopyAddress,
    onOpenCheckout,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Background Effects Removed */}

            {/* Header: Title + Actions */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2
                    className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${theme.text.secondary}`}
                >
                    Acesso Rápido
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onEmergency}
                        className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]"
                    >
                        <LogOut size={12} className="rotate-180" /> SOS
                    </button>
                    <button
                        onClick={(e) => {
                            triggerConfetti(e.currentTarget as HTMLElement);
                            onCopyWifi();
                        }}
                        className={`text-gray-300 flex items-center justify-center bg-white/5 border border-white/10 w-[32px] h-[32px] rounded-full hover:bg-white/10 transition-colors shadow-sm`}
                        aria-label="Copiar Wi-Fi"
                    >
                        <Wifi size={14} />
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onCopyAddress();
                        }}
                        className={`text-gray-300 flex items-center justify-center bg-white/5 border border-white/10 w-[32px] h-[32px] rounded-full hover:bg-white/10 transition-colors shadow-sm`}
                        aria-label="Copiar Endereço"
                    >
                        <MapPin size={14} />
                    </button>
                </div>
            </div>

            {/* Message */}
            <div className="mb-6 relative z-10 text-center">
                <h3
                    className={`text-lg font-heading font-bold ${theme.text.primary} flex items-center justify-center gap-2`}
                >
                    Sua estadia está chegando ao fim 🥲
                </h3>
            </div>

            {/* CHECKOUT HIGHLIGHT */}
            <div
                className={`bg-[#252535] p-4 rounded-xl border ${theme.border} shadow-lg relative overflow-hidden mb-3 text-center`}
            >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    Check-out
                </p>
                <div className="flex flex-col items-center justify-center gap-1 mb-3">
                    <p
                        className={`text-3xl font-mono font-bold ${theme.text.primary} tracking-widest drop-shadow-md`}
                    >
                        {config.checkOutTime || '11:00'}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">Amanhã</p>
                </div>
                <button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenCheckout();
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wide transition-all rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    <LogOut size={16} /> Ver Checklist de Saída
                </button>
            </div>

            {/* COMPACT DOOR CODE */}
            <div className="mb-3 w-full">
                <AccessTicket
                    propertyId={config.propertyId || 'lili'}
                    code={
                        config.propertyId === 'integracao'
                            ? config.flatNumber || ''
                            : config.lockCode || ''
                    }
                    label={config.propertyId === 'integracao' ? 'Unidade' : 'Senha'}
                    theme={theme}
                    alwaysVisible={true}
                />
            </div>

            <button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onOpenSupport();
                }}
                className={`w-full py-3 ${theme.button.primary} text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-[0.98]`}
            >
                <MessageCircle size={16} className="text-white" />{' '}
                {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
            </button>
        </div>
    );
};

export default PreCheckoutCard;
