import React from 'react';
import { LogOut, Sparkles, MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import QuickAccessUtilities from './QuickAccessUtilities';
import Button from '../../ui/Button';

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
    safeCode: _safeCode,

    currentWifiSSID,
    currentWifiPass,
    onOpenSupport,
    onEmergency,
    onSaveAccess,

    onOpenDriverMode,
    onOpenCheckout: _onOpenCheckout,
    isLoadingWifi = false,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();
    const isIntegracao = config.propertyId === 'integracao';

    const displayUnit = config.flatNumber
        ? /^flat\b/i.test(config.flatNumber.trim())
            ? config.flatNumber
            : `${t('Flat', 'Flat', 'Flat')} ${config.flatNumber}`
        : t('Sua Unidade', 'Your Unit', 'Tu Unidad');

    return (
        <div
            className={`flex flex-col h-full ${theme.background} ${theme.backgroundGradient} p-4 rounded-3xl text-stone-50 shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Header: Title + Actions */}
            <div className="quick-access-header flex justify-between items-start mb-4 relative z-10">
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
                    className={`text-xl font-display font-semibold ${theme.text.primary} flex items-center justify-center gap-2`}
                >
                    <Sparkles size={16} className="text-amber-400" />{' '}
                    {t('Aproveite sua estadia!', 'Enjoy your stay!', '¡Disfruta tu estadía!')}
                </h3>
            </div>

            {/* FULL-WIDTH ACCESS TICKET: ONLY DOOR CODE (LILI) OR UNIT (INTEGRAÇÃO) DURING STAY */}
            <div className="mb-3 relative z-10 w-full">
                <AccessTicket
                    propertyId={config.propertyId || 'lili'}
                    code={isIntegracao ? displayUnit : config.lockCode || ''}
                    label={
                        isIntegracao
                            ? t('Sua Unidade', 'Your Unit', 'Tu Unidad')
                            : t(
                                  'Senha da Porta (Flat)',
                                  'Door Code (Flat)',
                                  'Código de la Puerta (Piso)'
                              )
                    }
                    subLabel={
                        isIntegracao
                            ? t(
                                  'Chaves em mãos • Portaria e Flat',
                                  'Keys in hand • Reception & Flat',
                                  'Llaves en mano • Recepción y Flat'
                              )
                            : t(
                                  'Toque no 🔔 após digitar',
                                  'Ring 🔔 after typing',
                                  'Toca el 🔔 tras digitar'
                              )
                    }
                    theme={theme}
                    alwaysVisible={true}
                    variant="small"
                />
            </div>

            <QuickAccessUtilities
                propertyId={config.propertyId || 'lili'}
                wifiSSID={currentWifiSSID}
                wifiPass={currentWifiPass}
                isLoadingWifi={isLoadingWifi}
                onOpenDriverMode={onOpenDriverMode}
            />
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
