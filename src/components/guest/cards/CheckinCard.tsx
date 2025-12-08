import React from 'react';
import { LogOut, Wifi, Check, MapPin, Maximize2, CalendarHeart, MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import HolographicCard from '../../ui/HolographicCard';
import Button from '../../ui/Button';
import { triggerConfetti } from '../../../utils/confetti';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import AccessTicket from './AccessTicket';

interface CheckinCardProps {
    isSingleNight: boolean;
    config: GuestConfig;
    wifiCopied: boolean;
    addressCopied: boolean;
    currentWifiSSID: string;
    currentWifiPass: string;
    onOpenCheckin: () => void;
    onOpenSupport: () => void;
    onEmergency: () => void;
    onSaveAccess: () => void;
    onCopyWifi: () => void;
    onCopyAddress: () => void;
    onOpenDriverMode: () => void;
    onOpenCheckout: () => void;
}

const CheckinCard: React.FC<CheckinCardProps> = ({
    isSingleNight,
    config,
    wifiCopied,
    addressCopied,
    currentWifiSSID,
    currentWifiPass,
    onOpenCheckin,
    onOpenSupport,
    onEmergency,
    onSaveAccess,
    onCopyWifi,
    onCopyAddress,
    onOpenDriverMode,
    onOpenCheckout,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Background Effects Removed */}

            {/* Header: Title + Actions */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <h2
                    className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${isSingleNight ? 'text-orange-400' : 'text-gray-500'}`}
                >
                    {isSingleNight ? 'Estadia Rápida' : 'Acesso Rápido'}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onEmergency}
                        className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]"
                    >
                        <LogOut size={12} className="rotate-180" /> SOS
                    </button>
                    <button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onSaveAccess();
                        }}
                        className={`text-[10px] font-bold ${theme.text.secondary} flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]`}
                    >
                        Salvar Acesso
                    </button>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-6 relative z-10 text-center">
                <h3
                    className={`text-xl font-heading font-bold ${theme.text.primary} mb-2 flex items-center justify-center gap-2`}
                >
                    {isSingleNight
                        ? `Veio rapidinho, ${config.guestName?.split(' ')[0]}? 👋`
                        : 'Feliz em te receber! 😄'}
                </h3>
                <p
                    className={`text-xs ${theme.text.secondary} font-medium leading-relaxed max-w-xs mx-auto`}
                >
                    {isSingleNight
                        ? 'Aproveite ao máximo sua estadia!'
                        : 'Faça o check-in sem estresse com o passo a passo!'}
                </p>
            </div>

            {isSingleNight && (
                <Button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenCheckin();
                    }}
                    fullWidth
                    className="mb-4 relative z-10 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs uppercase tracking-wide shadow-lg shadow-purple-900/20 border border-white/10"
                >
                    Como fazer Check-in
                </Button>
            )}

            {/* ACCESS TICKET (Replaces HolographicCard for Access) */}
            <div className="mb-4 relative z-10 w-full">
                <AccessTicket
                    propertyId={config.propertyId || 'lili'}
                    code={
                        config.propertyId === 'integracao'
                            ? config.flatNumber || ''
                            : config.lockCode || ''
                    }
                    label={config.propertyId === 'integracao' ? 'Unidade' : 'Senha de Acesso'}
                    subLabel={
                        config.propertyId === 'integracao'
                            ? 'Chaves no cofre'
                            : 'Toque no sino após digitar'
                    }
                    theme={theme}
                />
            </div>

            {/* GRID: WI-FI & LOCATION */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                {/* Wi-Fi */}
                <HolographicCard
                    onClick={(e) => {
                        triggerConfetti(e.currentTarget as HTMLElement);
                        onCopyWifi();
                    }}
                    className={`col-span-1 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                    title={`Senha: ${currentWifiPass}`}
                >
                    <div className="absolute top-2 right-2">
                        <Maximize2
                            size={10}
                            className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    </div>
                    <div
                        className={`p-2 rounded-lg flex items-center justify-center mb-2 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}
                    >
                        {wifiCopied ? <Check size={24} /> : <Wifi size={24} />}
                    </div>
                    <div className="w-full">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            Wi-Fi
                        </p>
                        <p
                            className={`text-sm font-bold ${theme.text.primary} truncate leading-none mb-1 w-full`}
                        >
                            {currentWifiSSID}
                        </p>
                        <p className="text-[9px] text-blue-400 font-medium">
                            {wifiCopied ? 'Copiado!' : 'Copiar Senha'}
                        </p>
                    </div>
                </HolographicCard>

                {/* Location */}
                <HolographicCard
                    onClick={(e) => {
                        triggerConfetti(e.currentTarget as HTMLElement);
                        onCopyAddress();
                    }}
                    className={`col-span-1 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group relative ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
                    title="R. São José, 475B"
                >
                    <div className="absolute top-2 right-2 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenDriverMode();
                            }}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <Maximize2 size={14} />
                        </button>
                    </div>
                    <div
                        className={`p-2 rounded-lg flex items-center justify-center mb-2 ${addressCopied ? 'text-green-400' : 'text-purple-400'}`}
                    >
                        {addressCopied ? <Check size={24} /> : <MapPin size={24} />}
                    </div>
                    <div className="w-full">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            Local
                        </p>
                        <p
                            className={`text-sm font-bold ${theme.text.primary} truncate leading-none mb-1`}
                        >
                            R. São José, 475B
                        </p>
                        <p className="text-[9px] text-purple-400 font-medium">
                            {addressCopied ? 'Copiado!' : 'Copiar Endereço'}
                        </p>
                    </div>
                </HolographicCard>
            </div>

            {!isSingleNight && (
                <Button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenCheckin();
                    }}
                    fullWidth
                    className="mb-3 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25"
                >
                    Iniciar Passo a Passo
                </Button>
            )}

            {isSingleNight && (
                <div className="mb-4 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1">
                            <CalendarHeart size={12} /> Check-out Amanhã
                        </p>
                        <p className="text-xs text-orange-200 font-bold">
                            Até às {config.checkOutTime || '11:00'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onOpenCheckout();
                        }}
                        className="px-3 py-1.5 bg-orange-500/20 text-orange-300 text-[9px] font-bold uppercase rounded-lg shadow-sm border border-orange-500/30 hover:bg-orange-500/30 transition-colors"
                    >
                        Ver Regras
                    </button>
                </div>
            )}

            <Button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onOpenSupport();
                }}
                fullWidth
                leftIcon={<MessageCircle size={16} />}
                className={`${theme.button.primary} text-[11px] uppercase tracking-wide shadow-lg`}
            >
                {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
            </Button>

            {!isSingleNight && (
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center items-center gap-2 text-orange-300/80">
                    <CalendarHeart size={14} />
                    <p className="text-[10px] font-bold font-sans">
                        Check-in liberado a partir das {config.checkInTime || '14:00'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default React.memo(CheckinCard);
