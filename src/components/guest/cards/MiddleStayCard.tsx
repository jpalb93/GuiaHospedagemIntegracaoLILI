import React from 'react';
import { LogOut, Wifi, Check, MapPin, Maximize2, Sparkles, MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import HolographicCard from '../../ui/HolographicCard';
import Button from '../../ui/Button';
import { triggerConfetti } from '../../../utils/confetti';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import AccessTicket from './AccessTicket';

interface MiddleStayCardProps {
    config: GuestConfig;
    safeCode?: string;
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
    isLoadingWifi?: boolean;
}

const MiddleStayCard: React.FC<MiddleStayCardProps> = ({
    config,
    safeCode,
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
    onOpenCheckout: _onOpenCheckout,
    isLoadingWifi = false,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Header: Title + Actions */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2
                    className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${theme.text.secondary}`}
                >
                    {t('Acesso Rápido', 'Quick Access', 'Acceso Rápido')}
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
                        {t('Salvar Acesso', 'Save Access', 'Guardar Acceso')}
                    </button>
                </div>
            </div>

            {/* Welcome Message */}
            <div className="mb-4 relative z-10 text-center">
                <h3
                    className={`text-lg font-heading font-bold ${theme.text.primary} flex items-center justify-center gap-2`}
                >
                    <Sparkles size={16} className="text-orange-400" />{' '}
                    {t('Aproveite sua estadia!', 'Enjoy your stay!', '¡Disfruta tu estadía!')}
                </h3>
            </div>

            {/* FULL-WIDTH ACCESS TICKET: SAFE + DOOR/UNIT */}
            <div className="mb-3 relative z-10 w-full">
                <AccessTicket
                    propertyId={config.propertyId || 'lili'}
                    code={
                        config.propertyId === 'integracao'
                            ? config.flatNumber || ''
                            : config.lockCode || ''
                    }
                    safeCode={safeCode}
                    label={
                        config.propertyId === 'integracao'
                            ? t('Unidade', 'Unit', 'Unidad')
                            : t('Senha', 'Code', 'Código')
                    }
                    theme={theme}
                    alwaysVisible={true}
                    variant="small"
                />
            </div>

            {/* GRID: WI-FI & ADDRESS */}
            <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                {/* Wi-Fi */}
                <HolographicCard
                    onClick={(e) => {
                        triggerConfetti(e.currentTarget as HTMLElement);
                        onCopyWifi();
                    }}
                    className={`col-span-1 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group h-full ${wifiCopied ? 'ring-1 ring-green-500/50' : ''}`}
                    title={`${t('Senha', 'Pass', 'Clave')}: ${currentWifiPass}`}
                >
                    <div
                        className={`p-1.5 rounded-lg flex items-center justify-center mb-1 ${wifiCopied ? 'text-green-400' : 'text-blue-400'}`}
                    >
                        {wifiCopied ? <Check size={20} /> : <Wifi size={20} />}
                    </div>
                    <div className="w-full">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            {t('Wi-Fi', 'Wi-Fi', 'Wi-Fi')}
                        </p>
                        <p
                            className={`text-xs font-bold ${theme.text.primary} truncate leading-none mb-1 w-full`}
                        >
                            {isLoadingWifi ? (
                                <span className="inline-block w-20 h-3 bg-gray-700/50 animate-pulse rounded" />
                            ) : (
                                currentWifiSSID
                            )}
                        </p>
                        <p className="text-[9px] text-blue-400 font-medium">
                            {wifiCopied
                                ? t('Copiado!', 'Copied!', '¡Copiado!')
                                : t('Copiar Senha', 'Copy Password', 'Copiar Contraseña')}
                        </p>
                    </div>
                </HolographicCard>

                {/* Address */}
                <HolographicCard
                    onClick={(e) => {
                        triggerConfetti(e.currentTarget as HTMLElement);
                        onCopyAddress();
                    }}
                    className={`col-span-1 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col items-center text-center justify-between cursor-pointer hover:bg-white/5 transition-all group relative h-full ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
                    title="R. São José, 475B"
                >
                    <div className="absolute top-2 right-2 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenDriverMode();
                            }}
                            aria-label="Modo Motorista"
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                        >
                            <Maximize2 size={14} />
                        </button>
                    </div>
                    <div
                        className={`p-1.5 rounded-lg flex items-center justify-center mb-1 ${addressCopied ? 'text-green-400' : 'text-purple-400'}`}
                    >
                        {addressCopied ? <Check size={20} /> : <MapPin size={20} />}
                    </div>
                    <div className="w-full">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            {t('Endereço', 'Address', 'Dirección')}
                        </p>
                        <p
                            className={`text-xs font-bold ${theme.text.primary} truncate leading-none mb-1`}
                        >
                            R. São José, 475B
                        </p>
                        <p className="text-[9px] text-purple-400 font-medium">
                            {addressCopied
                                ? t('Copiado!', 'Copied!', '¡Copiado!')
                                : t('Copiar Endereço', 'Copy Address', 'Copiar Dirección')}
                        </p>
                    </div>
                </HolographicCard>
            </div>

            <Button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onOpenSupport();
                }}
                fullWidth
                leftIcon={<MessageCircle size={16} />}
                className={`${theme.button.primary} text-[11px] uppercase tracking-wide shadow-lg`}
            >
                {config.propertyId === 'lili'
                    ? t('Fale com a Lili', 'Talk to Lili', 'Hablar con Lili')
                    : t('Fale Conosco', 'Talk to Us', 'Habla con Nosotros')}
            </Button>
        </div>
    );
};

export default MiddleStayCard;
