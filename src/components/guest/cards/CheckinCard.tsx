import React from 'react';
import { LogOut, CalendarHeart, MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import QuickAccessUtilities from './QuickAccessUtilities';
import Button from '../../ui/Button';

import { getFirstName } from '../../../utils/helpers';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import AccessTicket from './AccessTicket';
import { PROPERTIES } from '../../../config/properties';

interface CheckinCardProps {
    isSingleNight: boolean;
    config: GuestConfig;
    safeCode?: string;
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
    isLoadingWifi?: boolean;
}

const CheckinCard: React.FC<CheckinCardProps> = ({
    isSingleNight,
    config,
    safeCode,

    currentWifiSSID,
    currentWifiPass,
    onOpenCheckin,
    onOpenSupport,
    onEmergency,
    onSaveAccess,

    onOpenDriverMode,
    onOpenCheckout,
    isLoadingWifi = false,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();

    return (
        <div
            className={`flex flex-col ${theme.background} ${theme.backgroundGradient} p-4 rounded-3xl text-stone-50 shadow-2xl border ${theme.border} relative w-full animate-gold-pulse`}
        >
            {/* Header: Title + Actions */}
            <div className="quick-access-header flex justify-between items-start mb-6 relative z-10">
                <h2
                    className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${isSingleNight ? 'text-amber-400' : theme.text.secondary}`}
                >
                    {isSingleNight
                        ? t('Estadia Rápida', 'Quick Stay', 'Estancia Rápida')
                        : t('Acesso Rápido', 'Quick Access', 'Acceso Rápido')}
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
            <div className="mb-6 relative z-10 text-center">
                <h3
                    className={`text-xl font-display font-semibold ${theme.text.primary} mb-2 flex items-center justify-center gap-2`}
                >
                    {isSingleNight
                        ? `${t('Veio rapidinho', 'Quick visit', 'Visita rápida')}${getFirstName(config.guestName) ? `, ${getFirstName(config.guestName)}` : ''}? 👋`
                        : t(
                              'Feliz em te receber! 😄',
                              'Happy to welcome you! 😄',
                              '¡Feliz de recibirte! 😄'
                          )}
                </h3>
                <p
                    className={`text-xs ${theme.text.secondary} font-medium leading-relaxed max-w-xs mx-auto`}
                >
                    {isSingleNight
                        ? t(
                              'Aproveite ao máximo sua estadia!',
                              'Make the most of your stay!',
                              '¡Aprovecha al máximo tu estadía!'
                          )
                        : t(
                              'Faça o check-in sem estresse com o passo a passo!',
                              'Stress-free check-in with our guide!',
                              '¡Haz el check-in sin estrés con nuestra guía!'
                          )}
                </p>
            </div>

            {isSingleNight && (
                <Button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenCheckin();
                    }}
                    fullWidth
                    className="mb-4 relative z-10 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-xs uppercase tracking-wide shadow-lg shadow-orange-950/30 border border-white/10"
                >
                    {t('Como fazer Check-in', 'How to Check-in', 'Cómo hacer el Check-in')}
                </Button>
            )}

            {/* ACCESS TICKET (Safe + Door/Unit) */}
            <div className="mb-4 relative z-10 w-full">
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
                            : t('Senha de Acesso', 'Access Code', 'Código de Acceso')
                    }
                    subLabel={
                        config.propertyId === 'integracao'
                            ? t('Chaves no cofre', 'Keys in safeBox', 'Llaves en caja fuerte')
                            : t(
                                  'Toque no sino após digitar',
                                  'Ring bell after typing',
                                  'Toca el timbre tras digitar'
                              )
                    }
                    theme={theme}
                />
            </div>

            <QuickAccessUtilities
                propertyId={config.propertyId || 'lili'}
                wifiSSID={currentWifiSSID}
                wifiPass={currentWifiPass}
                isLoadingWifi={isLoadingWifi}
                onOpenDriverMode={onOpenDriverMode}
            />
            {!isSingleNight && (
                <Button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenCheckin();
                    }}
                    fullWidth
                    className="mb-3 py-3.5 bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-900/30"
                >
                    {t(
                        'Passo a Passo do Check-in',
                        'Check-in Walkthrough',
                        'Guía Paso a Paso del Check-in'
                    )}
                </Button>
            )}

            {isSingleNight && (
                <div className="mb-4 bg-orange-500/10 p-3 rounded-xl border border-orange-500/20 flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1">
                            <CalendarHeart size={12} />{' '}
                            {t('Check-out Amanhã', 'Check-out Tomorrow', 'Check-out Mañana')}
                        </p>
                        <p className="text-xs text-amber-100 font-bold">
                            {t('Até às', 'Until', 'Hasta las')} {config.checkOutTime || '11:00'}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onOpenCheckout();
                        }}
                        className="px-3 py-1.5 bg-amber-500/20 text-amber-200 text-[9px] font-bold uppercase rounded-lg shadow-sm border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                    >
                        {t('Ver Regras', 'View Rules', 'Ver Reglas')}
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
                {config.propertyId === 'lili'
                    ? t('Fale com a Lili', 'Talk to Lili', 'Hablar con Lili')
                    : t('Fale Conosco', 'Talk to Us', 'Habla con Nosotros')}
            </Button>

            {!isSingleNight && (
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-center items-center gap-2 text-amber-300/85">
                    <CalendarHeart size={14} />
                    <p className="text-[10px] font-bold font-sans">
                        {t(
                            'Check-in liberado a partir das',
                            'Check-in available from',
                            'Check-in disponible desde'
                        )}{' '}
                        {config.checkInTime ||
                            PROPERTIES[config.propertyId || 'lili'].defaults.checkInTime}
                    </p>
                </div>
            )}
        </div>
    );
};

export default React.memo(CheckinCard);
