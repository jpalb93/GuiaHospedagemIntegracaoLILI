import React from 'react';
import { MessageCircle } from 'lucide-react';
import { GuestConfig } from '../../../types';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import Button from '../../ui/Button';
import AccessTicket from './AccessTicket';

interface PreCheckinCardProps {
    isPasswordReleased: boolean;
    config: GuestConfig;
    onOpenCheckin: () => void;
    onOpenSupport: () => void;
    onSaveAccess: () => void;
    formatFriendlyDate: (date?: string) => string;
}

const PreCheckinCard: React.FC<PreCheckinCardProps> = ({
    isPasswordReleased,
    config,
    onOpenCheckin,
    onOpenSupport,
    onSaveAccess,
    formatFriendlyDate,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Background Effects Removed */}

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
                <h2
                    className={`text-[10px] font-heading font-extrabold uppercase tracking-[0.15em] mt-1.5 ${theme.text.accent}`}
                >
                    {t('Pré-Checkin', 'Pre-Checkin', 'Pre-Checkin')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onOpenSupport();
                        }}
                        className={`text-[10px] font-bold ${theme.text.secondary} flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors font-sans shadow-sm min-h-[32px]`}
                    >
                        <MessageCircle size={12} /> {t('Ajuda', 'Help', 'Ayuda')}
                    </button>
                </div>
            </div>

            {isPasswordReleased ? (
                <>
                    {/* Message: Passwords Released */}
                    <div className="mb-6 relative z-10 text-center">
                        <h3 className={`text-lg font-heading font-bold ${theme.text.primary} mb-2`}>
                            {t('Seu Check-in é Amanhã! 🤩', 'Your Check-in is Tomorrow! 🤩', '¡Tu Check-in es Mañana! 🤩')}
                        </h3>
                        <p
                            className={`text-xs ${theme.text.secondary} font-medium leading-relaxed max-w-xs mx-auto`}
                        >
                            {t('Suas senhas já estão liberadas!', 'Your passwords are now released!', '¡Tus contraseñas ya están liberadas!')}
                            <br />
                            {t('Salve seu acesso agora mesmo.', 'Save your access right now.', 'Guarda tu acceso ahora mismo.')}
                        </p>
                    </div>

                    {/* ACCESS TICKET (Replaces HolographicCard for Access) */}
                    <div className="mb-4 relative z-10" onClick={() => onSaveAccess()}>
                        <AccessTicket
                            propertyId={config.propertyId || 'lili'}
                            code={
                                config.propertyId === 'integracao'
                                    ? config.flatNumber || ''
                                    : config.lockCode || ''
                            }
                            label={
                                config.propertyId === 'integracao' ? t('Unidade', 'Unit', 'Unidad') : t('Senha de Acesso', 'Access Code', 'Código de Acceso')
                            }
                            subLabel={
                                config.propertyId === 'integracao'
                                    ? t('Chaves no cofre', 'Keys in safeBox', 'Llaves en caja fuerte')
                                    : t('Toque no sino após digitar', 'Ring bell after typing', 'Toca el timbre tras digitar')
                            }
                            theme={theme}
                        />
                        <p className="text-[10px] text-center text-gray-500 mt-2">
                            {t('Toque para salvar o cartão de acesso', 'Tap to save access card', 'Toca para guardar la tarjeta de acceso')}
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onOpenCheckin();
                        }}
                        fullWidth
                        className={`${theme.button.primary} text-[11px] uppercase tracking-wide shadow-lg relative z-10`}
                    >
                        {t('Ver Instruções Completas', 'View Full Instructions', 'Ver Instrucciones Completas')}
                    </Button>
                </>
            ) : (
                <>
                    {/* Message: Coming Soon */}
                    <div className="mb-6 relative z-10 text-center">
                        <h3 className={`text-lg font-heading font-bold ${theme.text.primary} mb-2`}>
                            {t('Sua viagem está chegando! ✈️', 'Your trip is coming! ✈️', '¡Tu viaje se acerca! ✈️')}
                        </h3>
                        <p
                            className={`text-xs ${theme.text.secondary} font-medium leading-relaxed max-w-xs mx-auto`}
                        >
                            {t('Falta pouco para te recebermos.', "We can't wait to welcome you.", 'Falta poco para recibirte.')}
                            <br />
                            {t('Confira os detalhes da sua chegada.', 'Check your arrival details.', 'Consulta los detalles de tu llegada.')}
                        </p>
                    </div>

                    {/* INFO CARD */}
                    <div
                        className={`bg-[#252535] p-4 rounded-xl border ${theme.border} shadow-lg relative overflow-hidden mb-4 text-center`}
                    >
                        <div className="flex flex-col items-center justify-center gap-1">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
                                Check-in
                            </p>
                            <p className={`text-xl font-bold ${theme.text.primary} tracking-wide`}>
                                {formatFriendlyDate(config.checkInDate)}
                            </p>
                            <p
                                className={`text-sm font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10 mt-1 ${theme.text.accent}`}
                            >
                                {t('A partir das', 'From', 'A partir de')} {config.checkInTime || '14:00'}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            if (navigator.vibrate) navigator.vibrate(50);
                            onOpenCheckin();
                        }}
                        fullWidth
                        variant="secondary"
                        className="text-[11px] uppercase tracking-wide border border-white/10 relative z-10"
                    >
                        {t('Como fazer seu Check-In', 'How to Check-In', 'Cómo hacer tu Check-In')}
                    </Button>
                </>
            )}
        </div>
    );
};

export default PreCheckinCard;
