
import React from 'react';
import { CalendarHeart, Key, Wifi, Check, MapPin, Maximize2, LogOut, MessageCircle, Bell, Sparkles, Star, Plane, Bus } from 'lucide-react';
import { GuestConfig } from '../../types';
import HolographicCard from '../ui/HolographicCard';
import { triggerConfetti } from '../../utils/confetti';
import { GOOGLE_REVIEW_LINK } from '../../constants';

interface GuestStatusCardProps {
    stayStage: 'pre_checkin' | 'checkin' | 'middle' | 'pre_checkout' | 'checkout' | 'post_checkout';
    isTimeVerified: boolean;
    isPasswordReleased: boolean;
    config: GuestConfig;
    wifiCopied: boolean;
    addressCopied: boolean;
    currentWifiSSID: string;
    currentWifiPass: string;
    onOpenCheckin: () => void;
    onOpenCheckout: () => void;
    onCopyWifi: () => void;
    onCopyAddress: () => void;
    onOpenDriverMode: () => void;
    formatFriendlyDate: (date?: string) => string;
    isSingleNight?: boolean;
    isCheckoutToday?: boolean;
    onOpenSupport: () => void;
    onEmergency: () => void;
    onSaveAccess: () => void;
}

const CardSkeleton = () => (
    <div className="w-full h-full min-h-[160px] p-6 flex flex-col items-center justify-center animate-pulse">
        <div className="w-12 h-12 bg-orange-200/50 dark:bg-orange-800/40 rounded-full mb-3"></div>
        <div className="h-4 w-32 bg-orange-200/50 dark:bg-orange-800/40 rounded mb-2"></div>
        <div className="h-3 w-48 bg-orange-200/50 dark:bg-orange-800/40 rounded"></div>
    </div>
);

const GuestStatusCard: React.FC<GuestStatusCardProps> = ({
    stayStage,
    isTimeVerified,
    isPasswordReleased,
    config,
    wifiCopied,
    addressCopied,
    currentWifiSSID,
    currentWifiPass,
    onOpenCheckin,
    onOpenCheckout,
    onCopyWifi,
    onCopyAddress,
    onOpenDriverMode,
    formatFriendlyDate,
    isSingleNight = false,

    onOpenSupport,
    onEmergency,
    onSaveAccess
}) => {
    if (!isTimeVerified) return <CardSkeleton />;

    return (
        <>
            {(stayStage === 'pre_checkin') && (
                <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-gold-pulse">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <h2 className="text-[10px] font-heading font-extrabold text-purple-400 uppercase tracking-[0.15em] mt-1.5">Pré-Checkin</h2>
                        <div className="flex gap-2">
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="text-[10px] font-bold text-gray-300 flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]">
                                <MessageCircle size={12} /> Ajuda
                            </button>
                        </div>
                    </div>

                    {isPasswordReleased ? (
                        <>
                            {/* Message: Passwords Released */}
                            <div className="mb-6 relative z-10 text-center">
                                <h3 className="text-lg font-heading font-bold text-white mb-2">Seu Check-in é Amanhã! 🤩</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                    Suas senhas já estão liberadas!
                                    <br />
                                    Salve seu acesso agora mesmo.
                                </p>
                            </div>

                            {/* ACCESS CARD (Golden Border) */}
                            <HolographicCard
                                onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onSaveAccess(); }}
                                className="w-full mb-4 bg-[#252535] p-4 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden group text-center cursor-pointer hover:bg-white/5 transition-all"
                                title="Salvar Acesso"
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500 to-purple-600 opacity-80" />
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <div className="p-3 bg-amber-500/10 rounded-full text-amber-500 mb-1 animate-pulse-slow">
                                        <Key size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wide">Salvar Cartão de Acesso</p>
                                    <p className="text-[10px] text-gray-400">Clique para ver e salvar senhas e endereço</p>
                                </div>
                            </HolographicCard>

                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] relative z-10">
                                Ver Instruções Completas
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Message: Coming Soon */}
                            <div className="mb-6 relative z-10 text-center">
                                <h3 className="text-lg font-heading font-bold text-white mb-2">Sua viagem está chegando! ✈️</h3>
                                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-xs mx-auto">
                                    Falta pouco para te recebermos.
                                    <br />
                                    Confira os detalhes da sua chegada.
                                </p>
                            </div>

                            {/* INFO CARD */}
                            <div className="bg-[#252535] p-4 rounded-xl border border-white/10 shadow-lg relative overflow-hidden mb-4 text-center">
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Check-in</p>
                                    <p className="text-xl font-bold text-white tracking-wide">
                                        {formatFriendlyDate(config.checkInDate)}
                                    </p>
                                    <p className="text-sm text-purple-400 font-bold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 mt-1">
                                        A partir das {config.checkInTime || '14:00'}
                                    </p>
                                </div>
                            </div>

                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl border border-white/10 active:scale-[0.98] relative z-10">
                                Ver Regras da Casa
                            </button>
                        </>
                    )}
                </div>
            )}

            {stayStage === 'pre_checkout' && (
                <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-gold-pulse">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

                    {/* Header: Title + Actions */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h2 className="text-[10px] font-heading font-extrabold text-gray-500 uppercase tracking-[0.15em] mt-1.5">Acesso Rápido</h2>
                        <div className="flex gap-2">
                            <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                                <LogOut size={12} className="rotate-180" /> SOS
                            </button>
                            <button
                                onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyWifi(); }}
                                className="text-gray-300 flex items-center justify-center bg-white/5 border border-white/10 w-[32px] h-[32px] rounded-full hover:bg-white/10 transition-colors shadow-sm"
                                aria-label="Copiar Wi-Fi"
                            >
                                <Wifi size={14} />
                            </button>
                            <button
                                onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onCopyAddress(); }}
                                className="text-gray-300 flex items-center justify-center bg-white/5 border border-white/10 w-[32px] h-[32px] rounded-full hover:bg-white/10 transition-colors shadow-sm"
                                aria-label="Copiar Endereço"
                            >
                                <MapPin size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6 relative z-10 text-center">
                        <h3 className="text-lg font-heading font-bold text-white flex items-center justify-center gap-2">
                            Sua estadia está chegando ao fim 🥲
                        </h3>
                    </div>

                    {/* CHECKOUT HIGHLIGHT */}
                    <div className="bg-[#252535] p-4 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden mb-3 text-center">
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Check-out</p>
                        <div className="flex flex-col items-center justify-center gap-1 mb-3">
                            <p className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                {config.checkOutTime || '11:00'}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">Amanhã</p>
                        </div>
                        <button
                            onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wide transition-all rounded-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <LogOut size={16} /> Ver Checklist de Saída
                        </button>
                    </div>

                    {/* COMPACT DOOR CODE */}
                    <HolographicCard
                        className="w-full mb-3 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden group text-center flex flex-col justify-center"
                        title={config.propertyId === 'integracao' ? 'Unidade' : 'Senha da Porta'}
                    >
                        {config.propertyId === 'integracao' ? (
                            <div className="flex items-center justify-between px-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Unidade</p>
                                <p className="text-xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                    {config.flatNumber}
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between px-2">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Senha Porta</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                        {config.lockCode}
                                    </p>
                                    <Bell size={16} className="text-orange-500 animate-pulse" />
                                </div>
                            </div>
                        )}
                    </HolographicCard>

                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                        <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                    </button>
                </div>
            )}

            {stayStage === 'middle' && (
                <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-gold-pulse">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

                    {/* Header: Title + Actions */}
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h2 className="text-[10px] font-heading font-extrabold text-gray-500 uppercase tracking-[0.15em] mt-1.5">Acesso Rápido</h2>
                        <div className="flex gap-2">
                            <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                                <LogOut size={12} className="rotate-180" /> SOS
                            </button>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onSaveAccess(); }} className="text-[10px] font-bold text-gray-300 flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]">
                                Salvar Acesso
                            </button>
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <div className="mb-4 relative z-10 text-center">
                        <h3 className="text-lg font-heading font-bold text-white flex items-center justify-center gap-2">
                            <Sparkles size={16} className="text-orange-400" /> Aproveite sua estadia!
                        </h3>
                    </div>

                    {/* COMPACT GRID: DOOR & WI-FI */}
                    <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                        {/* Door Code (Compact) */}
                        <HolographicCard
                            className="col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden group text-center flex flex-col justify-center"
                            title={config.propertyId === 'integracao' ? 'Unidade' : 'Senha da Porta'}
                        >
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-purple-600 opacity-80" />

                            {config.propertyId === 'integracao' ? (
                                <div className="pt-2">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Unidade</p>
                                    <p className="text-2xl font-mono font-bold text-white tracking-widest drop-shadow-md mb-0.5">
                                        {config.flatNumber}
                                    </p>
                                    <p className="text-[8px] text-gray-500 font-medium">Chave na portaria</p>
                                </div>
                            ) : (
                                <div className="pt-2">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Senha da Porta</p>
                                    <div className="flex items-center justify-center gap-2 mb-1">
                                        <p className="text-2xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                            {config.lockCode}
                                        </p>
                                    </div>
                                    <p className="text-[8px] text-gray-500 font-medium flex items-center justify-center gap-1">
                                        Digite a senha e toque no <Bell size={8} className="text-amber-500" />
                                    </p>
                                </div>
                            )}
                        </HolographicCard>

                        {/* Wi-Fi (Compact) */}
                        <HolographicCard
                            onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyWifi(); }}
                            className={`col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col items-center text-center justify-center cursor-pointer hover:bg-white/5 transition-all group ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                            title={`Senha: ${currentWifiPass}`}
                        >
                            <div className={`p-1.5 rounded-lg flex items-center justify-center mb-1 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}>
                                {wifiCopied ? <Check size={20} /> : <Wifi size={20} />}
                            </div>
                            <div className="w-full">
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Wi-Fi</p>
                                <p className="text-xs font-bold text-white truncate leading-none mb-1 w-full">{currentWifiSSID}</p>
                                <p className="text-[8px] text-blue-400 font-medium">{wifiCopied ? 'Copiado!' : 'Copiar Senha'}</p>
                            </div>
                        </HolographicCard>
                    </div>

                    {/* ADDRESS CARD (Horizontal) */}
                    <HolographicCard
                        onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyAddress(); }}
                        className={`w-full mb-4 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
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
                                <p className="text-sm font-bold text-white leading-none mb-0.5">R. São José, 475B</p>
                                <p className="text-[9px] text-gray-500 font-medium">Centro, Petrolina - PE</p>
                            </div>
                        </div>
                    </HolographicCard>

                    <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                        <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                    </button>
                </div>
            )}

            {(stayStage === 'checkin' || stayStage === 'checkout') && (
                isSingleNight && stayStage === 'checkin' ? (
                    <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-pop-in animate-gold-pulse">
                        {/* Background Effects */}
                        <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-orange-500/10 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />

                        {/* Header */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <h2 className="text-[10px] font-heading font-extrabold text-orange-400 uppercase tracking-[0.15em] mt-1.5">Estadia Rápida</h2>
                            <div className="flex gap-2">
                                <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                                    <LogOut size={12} className="rotate-180" /> SOS
                                </button>
                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onSaveAccess(); }} className="text-[10px] font-bold text-gray-300 flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]">
                                    Salvar Acesso
                                </button>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="mb-4 relative z-10 text-center">
                            <h3 className="text-lg font-heading font-bold text-white mb-1">
                                Veio rapidinho, {config.guestName?.split(' ')[0]}? 👋
                            </h3>
                            <p className="text-xs text-gray-400 font-medium">
                                Aproveite ao máximo sua estadia!
                            </p>
                        </div>

                        {/* CHECK-IN BUTTON (New Position) */}
                        <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wide transition-all rounded-xl shadow-lg shadow-purple-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mb-4 relative z-10 border border-white/10">
                            Como fazer Check-in
                        </button>

                        {/* GRID: DOOR & WI-FI */}
                        <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                            {/* Door Code */}
                            <HolographicCard
                                className="col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden group text-center flex flex-col justify-center"
                                title={config.propertyId === 'integracao' ? 'Unidade' : 'Senha da Porta'}
                            >
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-purple-600 opacity-80" />
                                {config.propertyId === 'integracao' ? (
                                    <div className="pt-2">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Unidade</p>
                                        <p className="text-2xl font-mono font-bold text-white tracking-widest drop-shadow-md mb-0.5">
                                            {config.flatNumber}
                                        </p>
                                        <p className="text-[8px] text-gray-500 font-medium">Chave na portaria</p>
                                    </div>
                                ) : (
                                    <div className="pt-2">
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Senha da Porta</p>
                                        <div className="flex items-center justify-center gap-1 mb-1">
                                            <p className="text-xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                                {config.lockCode}
                                            </p>
                                            <Bell size={12} className="text-amber-400 animate-pulse-subtle" />
                                        </div>
                                        <p className="text-[8px] text-gray-500 font-medium flex items-center justify-center gap-1">
                                            Digite a senha e toque no <Bell size={8} className="text-amber-500" />
                                        </p>
                                    </div>
                                )}
                            </HolographicCard>

                            {/* Wi-Fi */}
                            <HolographicCard
                                onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyWifi(); }}
                                className={`col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col items-center text-center justify-center cursor-pointer hover:bg-white/5 transition-all group ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                                title={`Senha: ${currentWifiPass}`}
                            >
                                <div className={`p-1.5 rounded-lg flex items-center justify-center mb-1 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}>
                                    {wifiCopied ? <Check size={20} /> : <Wifi size={20} />}
                                </div>
                                <div className="w-full">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Wi-Fi</p>
                                    <p className="text-xs font-bold text-white truncate leading-none mb-1 w-full">{currentWifiSSID}</p>
                                    <p className="text-[8px] text-blue-400 font-medium">{wifiCopied ? 'Copiado!' : 'Copiar Senha'}</p>
                                </div>
                            </HolographicCard>
                        </div>

                        {/* ADDRESS CARD (Horizontal) */}
                        <HolographicCard
                            onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyAddress(); }}
                            className={`w-full mb-4 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
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
                                    <p className="text-sm font-bold text-white leading-none mb-0.5">R. São José, 475B</p>
                                    <p className="text-[9px] text-gray-500 font-medium">Centro, Petrolina - PE</p>
                                </div>
                            </div>
                        </HolographicCard>

                        {/* CHECKOUT ALERT (Moved Here) */}
                        <div className="mb-4 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 flex items-center justify-between relative z-10">
                            <div>
                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wide flex items-center gap-1">
                                    <CalendarHeart size={12} /> Check-out Amanhã
                                </p>
                                <p className="text-xs text-orange-200 font-bold">Até às {config.checkOutTime || '11:00'}</p>
                            </div>
                            <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }} className="px-3 py-1.5 bg-orange-500/20 text-orange-300 text-[9px] font-bold uppercase rounded-lg shadow-sm border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
                                Ver Regras
                            </button>
                        </div>

                        <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] relative z-10">
                            <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                        </button>
                    </div>
                ) : (
                    <>



                        {stayStage === 'checkout' && (
                            <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-red-500/20 relative overflow-hidden w-full animate-gold-pulse">
                                {/* Background Effects: Red/Orange for Urgency/Departure */}
                                <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

                                {/* Header */}
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <h2 className="text-[10px] font-heading font-extrabold text-red-400 uppercase tracking-[0.15em] mt-1.5">Dia da Saída</h2>
                                    <div className="flex gap-2">
                                        <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                                            <LogOut size={12} className="rotate-180" /> SOS
                                        </button>
                                    </div>
                                </div>

                                {/* Main Message */}
                                <div className="mb-3 relative z-10 text-center">
                                    <h3 className="text-lg font-heading font-bold text-white mb-1">Volte sempre, viu? 👋</h3>
                                </div>

                                {/* REVIEW BUTTON (New Position) */}
                                <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer" className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-[0.98] mb-4 relative z-10">
                                    <Star size={14} className="fill-white" /> Avaliar Estadia
                                </a>

                                {/* TRANSPORTATION CARDS (Airport & Bus) */}
                                <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
                                    <a
                                        href="https://maps.app.goo.gl/DiuYdP3HWXH4Ksj67"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-[#252535] p-3 rounded-xl border border-white/5 hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group"
                                    >
                                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                            <Plane size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">Aeroporto</span>
                                    </a>

                                    <a
                                        href="https://maps.app.goo.gl/e3gXqN6SXhnHoJwc6"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-[#252535] p-3 rounded-xl border border-white/5 hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group"
                                    >
                                        <div className="p-2 bg-orange-500/10 rounded-full text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                                            <Bus size={18} />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">Rodoviária</span>
                                    </a>
                                </div>

                                {/* ADDRESS CARD (Prominent for Uber/Driver) */}
                                <HolographicCard
                                    onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyAddress(); }}
                                    className={`w-full mb-3 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
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
                                            <p className="text-sm font-bold text-white leading-none mb-0.5">R. São José, 475B</p>
                                            <p className="text-[9px] text-gray-500 font-medium">Centro, Petrolina - PE</p>
                                        </div>
                                    </div>
                                </HolographicCard>

                                {/* CHECKLIST ACTION (Primary) */}
                                <button
                                    onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckout(); }}
                                    className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white text-xs font-bold uppercase tracking-wide transition-all rounded-xl shadow-lg shadow-red-900/20 active:scale-[0.98] flex items-center justify-center gap-2 mb-3 relative z-10 border border-white/10"
                                >
                                    <LogOut size={16} /> Fazer Check-out Agora
                                </button>

                                {/* SUPPORT BUTTON */}
                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] relative z-10 mb-4">
                                    <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                                </button>

                                {/* CHECKOUT TIME (Bottom) */}
                                <div className="flex items-center justify-center gap-2 text-red-100/60 relative z-10 mt-auto">
                                    <p className="text-[10px] font-medium">Liberar o flat até às</p>
                                    <p className="text-sm font-mono font-bold text-white/80 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                        {config.checkOutTime || '11:00'}
                                    </p>
                                </div>
                            </div>
                        )}
                        {stayStage === 'checkin' && (
                            <div className="flex flex-col h-full bg-[#1E1E2E] p-4 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-gold-pulse">
                                {/* Background Effects */}
                                <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                                <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-orange-500/10 blur-[60px] rounded-full pointer-events-none" />

                                {/* Header: Title + Actions */}
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <h2 className="text-[10px] font-heading font-extrabold text-gray-500 uppercase tracking-[0.15em] mt-1.5">Acesso Rápido</h2>
                                    <div className="flex gap-2">
                                        <button onClick={onEmergency} className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]">
                                            <LogOut size={12} className="rotate-180" /> SOS
                                        </button>
                                        <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onSaveAccess(); }} className="text-[10px] font-bold text-gray-300 flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]">
                                            Salvar Acesso
                                        </button>
                                    </div>
                                </div>

                                {/* Welcome Message */}
                                <div className="mb-6 relative z-10 text-center">
                                    <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center justify-center gap-2">
                                        Feliz em te receber! 😄
                                    </h3>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mx-auto">
                                        Faça o check-in sem estresse com o passo a passo!
                                    </p>
                                </div>

                                {/* DOOR CODE CARD (Large) */}
                                <HolographicCard
                                    className="w-full mb-3 bg-[#252535] p-4 rounded-xl border border-amber-500/30 shadow-lg relative overflow-hidden group text-left"
                                    title={config.propertyId === 'integracao' ? 'Unidade' : 'Senha da Porta'}
                                >
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-orange-500 to-purple-600 opacity-80" />

                                    {config.propertyId === 'integracao' ? (
                                        <div className="pt-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Unidade</p>
                                                <div className="p-1.5 bg-white/5 rounded-lg text-gray-400"><Key size={14} /></div>
                                            </div>
                                            <p className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-md mb-1">
                                                {config.flatNumber}
                                            </p>
                                            <p className="text-[10px] text-gray-500 font-medium">Chave na portaria</p>
                                        </div>
                                    ) : (
                                        <div className="pt-3">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Senha da Porta</p>
                                                <div className="p-1.5 bg-white/5 rounded-lg text-gray-400"><Key size={14} /></div>
                                            </div>
                                            <div className="flex items-center justify-center gap-3 mb-2">
                                                <p className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                                    {config.lockCode}
                                                </p>
                                                <Bell size={20} className="text-orange-500 animate-pulse" />
                                            </div>
                                            <p className="text-[10px] text-gray-500 font-medium flex items-center justify-center gap-1">
                                                Digite a senha e toque no <Bell size={10} className="text-amber-500" />
                                            </p>
                                        </div>
                                    )}
                                </HolographicCard>

                                {/* GRID: WI-FI & LOCATION */}
                                <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                                    {/* Wi-Fi */}
                                    <HolographicCard
                                        onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyWifi(); }}
                                        className={`col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                                        title={`Senha: ${currentWifiPass}`}
                                    >
                                        <div className="absolute top-2 right-2">
                                            <Maximize2 size={10} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className={`p-2 rounded-lg flex items-center justify-center mb-2 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}>
                                            {wifiCopied ? <Check size={24} /> : <Wifi size={24} />}
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Wi-Fi</p>
                                            <p className="text-sm font-bold text-white truncate leading-none mb-1 w-full">{currentWifiSSID}</p>
                                            <p className="text-[9px] text-blue-400 font-medium">{wifiCopied ? 'Copiado!' : 'Copiar Senha'}</p>
                                        </div>
                                    </HolographicCard>

                                    {/* Location */}
                                    <HolographicCard
                                        onClick={(e) => { triggerConfetti(e.currentTarget as HTMLElement); onCopyAddress(); }}
                                        className={`col-span-1 bg-[#252535] p-3 rounded-xl border border-amber-500/30 shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group relative ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
                                        title="R. São José, 475B"
                                    >
                                        <div className="absolute top-2 right-2 z-20">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onOpenDriverMode(); }}
                                                className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                            >
                                                <Maximize2 size={14} />
                                            </button>
                                        </div>
                                        <div className={`p-2 rounded-lg flex items-center justify-center mb-2 ${addressCopied ? 'text-green-400' : 'text-purple-400'}`}>
                                            {addressCopied ? <Check size={24} /> : <MapPin size={24} />}
                                        </div>
                                        <div className="w-full">
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Local</p>
                                            <p className="text-sm font-bold text-white truncate leading-none mb-1">R. São José, 475B</p>
                                            <p className="text-[9px] text-purple-400 font-medium">{addressCopied ? 'Copiado!' : 'Copiar Endereço'}</p>
                                        </div>
                                    </HolographicCard>
                                </div>

                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenCheckin(); }} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25 text-sm flex items-center justify-center gap-2 font-sans active:scale-[0.98] mb-3">
                                    Iniciar Passo a Passo
                                </button>
                                <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
                                    <MessageCircle size={16} className="text-white" /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                                </button>

                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-center items-center gap-2 text-orange-300/80">
                                    <CalendarHeart size={14} />
                                    <p className="text-[10px] font-bold font-sans">Check-in liberado a partir das {config.checkInTime || '14:00'}</p>
                                </div>
                            </div>
                        )}
                    </>
                )
            )}

            {stayStage === 'post_checkout' && (
                <div className="flex flex-col h-full bg-[#1E1E2E] p-6 rounded-3xl text-white shadow-2xl border border-white/5 relative overflow-hidden w-full animate-pop-in animate-gold-pulse justify-center text-center">
                    {/* Background Effects */}
                    <div className="absolute top-[-20%] right-[-10%] w-[200px] h-[200px] bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[150px] h-[150px] bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 animate-float">
                            <Sparkles size={32} className="text-white" />
                        </div>

                        <h3 className="text-2xl font-heading font-bold text-white mb-2">Obrigado! 👋</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xs mx-auto mb-6">
                            Esperamos que tenha gostado de Petrolina.
                            <br />
                            Volte sempre!
                        </p>

                        <button onClick={() => { if (navigator.vibrate) navigator.vibrate(50); onOpenSupport(); }} className="w-full py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-[0.98] mb-3">
                            <MessageCircle size={16} /> {config.propertyId === 'lili' ? 'Fale com a Lili' : 'Fale Conosco'}
                        </button>

                        <a href={GOOGLE_REVIEW_LINK} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white text-xs font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-yellow-500/20 active:scale-[0.98]">
                            <Star size={16} className="fill-white" /> Avaliar Estadia
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export default GuestStatusCard;