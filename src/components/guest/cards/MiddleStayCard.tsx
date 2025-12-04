import React from 'react';
import { LogOut, Wifi, Check, MapPin, Maximize2, Sparkles, MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import HolographicCard from '../../ui/HolographicCard';
import { triggerConfetti } from '../../../utils/confetti';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import AccessTicket from './AccessTicket';

interface MiddleStayCardProps {
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

const MiddleStayCard: React.FC<MiddleStayCardProps> = ({
    config,
    wifiCopied,
    addressCopied,
    currentWifiSSID,
    currentWifiPass,
    onOpenSupport,
    onEmergency,
    onSaveAccess,
    onCopyWifi,
    onCopyAddress,
    onOpenDriverMode,
    onOpenCheckout: _onOpenCheckout
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');

    return (
        <div className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}>
            {/* Background Effects Removed */}

            {/* Header: Title + Actions */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${theme.text.secondary}`}>Acesso Rápido</h2>
                <div className="flex gap-2">
                    <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                        <LogOut size={12} className="rotate-180" /> SOS
                    </button>
                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onSaveAccess(); }} className={`text-[10px] font-bold ${theme.text.secondary} flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]`}>
                        Salvar Acesso
                    </button>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-4 relative z-10 text-center">
                <h3 className={`text-lg font-heading font-bold ${theme.text.primary} flex items-center justify-center gap-2`}>
                    <Sparkles size={16} className="text-orange-400" /> Aproveite sua estadia!
                </h3>
            </div>

            {/* COMPACT GRID: DOOR & WI-FI */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                {/* Door Code (Compact) */}
                <div className="col-span-1 h-full">
                    <AccessTicket
                        propertyId={config.propertyId || 'lili'}
                        code={config.propertyId === 'integracao' ? (config.flatNumber || '') : (config.lockCode || '')}
                        label={config.propertyId === 'integracao' ? 'Unidade' : 'Senha'}
                        theme={theme}
                        alwaysVisible={true}
                        variant="small"
                    />
                </div>

                {/* Wi-Fi (Compact) */}
                <HolographicCard
                    onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyWifi(); }}
                    className={`col-span-1 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                    title={`Senha: ${currentWifiPass}`}
                >
                    <div className={`p-1.5 rounded-lg flex items-center justify-center mb-1 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}>
                        {wifiCopied ? <Check size={20} /> : <Wifi size={20} />}
                    </div>
                    <div className="w-full">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Wi-Fi</p>
                        <p className={`text-xs font-bold ${theme.text.primary} truncate leading-none mb-1 w-full`}>{currentWifiSSID}</p>
                        <p className="text-[8px] text-blue-400 font-medium">{wifiCopied ? 'Copiado!' : 'Copiar Senha'}</p>
                    </div>
                </HolographicCard>
            </div>

            {/* ADDRESS CARD (Horizontal) */}
            <HolographicCard
                onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyAddress(); }}
                className={`w-full mb-4 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
                title="R. São José, 475B"
            >
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); onOpenDriverMode(); }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center ${addressCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-300'}`}>
                        {addressCopied ? <Check size={20} /> : <MapPin size={20} />}
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Endereço</p>
                        <p className={`text-sm font-bold ${theme.text.primary} leading-none mb-0.5`}>R. São José, 475B</p>
                        <p className="text-[9px] text-gray-500 font-medium">Centro, Petrolina - PE</p>
                    </div>
                </div>
            </HolographicCard>

            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className={`w-full py-3 ${theme.button.primary} text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-[0.98]`}>
                <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
            </button>
        </div>
    );
};

export default MiddleStayCard;
