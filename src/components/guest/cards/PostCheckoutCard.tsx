import React from 'react';
import { MessageCircle, Star, Sparkles } from 'lucide-react';
import { GuestConfig } from '../../../types';
import Button from '../../ui/Button';
import { GOOGLE_REVIEW_LINK } from '../../../constants';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';

interface PostCheckoutCardProps {
    config: GuestConfig;
    onOpenSupport: () => void;
    onOpenReview: () => void;
}

const PostCheckoutCard: React.FC<PostCheckoutCardProps> = ({
    config,
    onOpenSupport,
    onOpenReview,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-6 rounded-3xl text-white shadow-2xl border ${theme.border} relative overflow-hidden w-full animate-pop-in animate-gold-pulse justify-center text-center`}
        >
            {/* Background Effects Removed */}

            <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30 animate-float">
                    <Sparkles size={32} className="text-white" />
                </div>

                <h3 className={`text-2xl font-heading font-bold ${theme.text.primary} mb-2`}>
                    {t('Obrigado! 👋', 'Thank You! 👋', '¡Gracias! 👋')}
                </h3>
                <p
                    className={`text-sm ${theme.text.secondary} font-medium leading-relaxed max-w-xs mx-auto mb-6`}
                >
                    {t('Esperamos que tenha gostado de Petrolina.', 'We hope you enjoyed Petrolina.', 'Esperamos que hayas disfrutado de Petrolina.')}
                    <br />
                    {t('Volte sempre!', 'Come back soon!', '¡Vuelve pronto!')}
                </p>

                <Button
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(50);
                        onOpenSupport();
                    }}
                    fullWidth
                    variant="secondary"
                    leftIcon={<MessageCircle size={16} />}
                    className="mb-3 py-3.5 border border-white/10 text-xs uppercase tracking-wide shadow-lg"
                >
                    {config.propertyId === 'lili' ? t('Fale com a Lili', 'Talk to Lili', 'Hablar con Lili') : t('Fale Conosco', 'Talk to Us', 'Habla con Nosotros')}
                </Button>

                <Button
                    onClick={() => {
                        onOpenReview();
                        window.open(GOOGLE_REVIEW_LINK, '_blank');
                    }}
                    fullWidth
                    leftIcon={<Star size={16} className="fill-white" />}
                    className="py-3.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-xs uppercase tracking-wide shadow-lg shadow-yellow-500/20"
                >
                    {t('Avaliar Estadia', 'Rate Stay', 'Calificar Estancia')}
                </Button>
            </div>
        </div>
    );
};

export default PostCheckoutCard;
