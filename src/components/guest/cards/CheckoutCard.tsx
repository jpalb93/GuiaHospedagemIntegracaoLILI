import React from 'react';
import { LogOut, MessageCircle, Star, Plane, Bus, Check, MapPin, Maximize2 } from 'lucide-react';
import { GuestConfig } from '../../../types';
import HolographicCard from '../../ui/HolographicCard';
import Button from '../../ui/Button';
import { triggerConfetti } from '../../../utils/confetti';
import { GOOGLE_REVIEW_LINK } from '../../../constants';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { useLanguage } from '../../../hooks/useLanguage';
import ReviewIncentiveModal from '../modals/ReviewIncentiveModal';
import { hapticFeedback } from '../../../utils/haptics';

interface CheckoutCardProps {
    config: GuestConfig;
    onOpenSupport: () => void;
    onEmergency: () => void;
    onOpenCheckout: () => void;
    onOpenReview: () => void;
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({
    config,
    onOpenSupport,
    onEmergency,
    onOpenCheckout,
    onOpenReview,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();
    const [showReviewModal, setShowReviewModal] = React.useState(false);
    // Hardcoded address state for checkout card as it's not passed down
    const addressCopied = false;
    const onCopyAddress = () => {
        hapticFeedback('light');
        navigator.clipboard.writeText('R. São José, 475B, Centro, Petrolina - PE');
        triggerConfetti(document.getElementById('checkout-address') as HTMLElement);
    };
    const onOpenDriverMode = () => {
        window.open(
            `https://www.google.com/maps/search/?api=1&query=R.+São+José,+475B,+Centro,+Petrolina+-+PE`,
            '_blank'
        );
    };

    return (
        <div
            className={`flex flex-col h-full ${theme.background} p-4 rounded-3xl text-white shadow-2xl border border-red-500/20 relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Background Effects Removed */}

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="text-[10px] font-heading font-extrabold text-red-400 uppercase tracking-[0.15em] mt-1.5">
                    {t('Dia da Saída', 'Departure Day')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={onEmergency}
                        className="text-[10px] font-bold text-red-400 flex items-center gap-1 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors font-sans shadow-sm min-h-[32px]"
                    >
                        <LogOut size={12} className="rotate-180" /> SOS
                    </button>
                </div>
            </div>

            {/* Main Message */}
            <div className="mb-3 relative z-10 text-center">
                <h3 className={`text-lg font-heading font-bold ${theme.text.primary} mb-1`}>
                    {t('Volte sempre, viu? 👋', 'Come back soon! 👋')}
                </h3>
            </div>

            {/* REVIEW BUTTON (New Position) */}
            <Button
                onClick={() => {
                    onOpenReview();
                    // Show incentive modal only for Lili property
                    if (config.propertyId === 'lili') {
                        setShowReviewModal(true);
                    } else {
                        // Direct link for other properties
                        window.open(GOOGLE_REVIEW_LINK, '_blank');
                    }
                }}
                fullWidth
                leftIcon={<Star size={14} className="fill-white" />}
                className="mb-4 relative z-10 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-[11px] uppercase tracking-wide shadow-lg shadow-yellow-500/20"
            >
                {t('Avaliar Estadia', 'Rate Stay')}
            </Button>

            {/* Review Incentive Modal - Only for Lili */}
            {config.propertyId === 'lili' && (
                <ReviewIncentiveModal
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    propertyName="Flat da Lili"
                    guestName={config.guestName}
                />
            )}

            {/* TRANSPORTATION CARDS (Airport & Bus) */}
            <div className="grid grid-cols-2 gap-3 mb-3 relative z-10">
                <a
                    href="https://maps.app.goo.gl/DiuYdP3HWXH4Ksj67"
                    target="_blank"
                    rel="noreferrer"
                    className={`bg-[#252535] p-3 rounded-xl border ${theme.border} hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group`}
                >
                    <div className="p-2 bg-blue-500/10 rounded-full text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                        <Plane size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                        {t('Aeroporto', 'Airport')}
                    </span>
                </a>

                <a
                    href="https://maps.app.goo.gl/e3gXqN6SXhnHoJwc6"
                    target="_blank"
                    rel="noreferrer"
                    className={`bg-[#252535] p-3 rounded-xl border ${theme.border} hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group`}
                >
                    <div className="p-2 bg-orange-500/10 rounded-full text-orange-400 group-hover:bg-orange-500/20 transition-colors">
                        <Bus size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">
                        {t('Rodoviária', 'Bus Station')}
                    </span>
                </a>
            </div>

            {/* ADDRESS CARD (Prominent for Uber/Driver) */}
            <HolographicCard
                onClick={(e) => {
                    triggerConfetti(e.currentTarget as HTMLElement);
                    onCopyAddress();
                }}
                className={`w-full mb-3 bg-[#252535] p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-green-500/50' : ''}`}
                title="R. São José, 475B"
            >
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenDriverMode();
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2.5 rounded-lg flex items-center justify-center ${addressCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-300'}`}
                    >
                        {addressCopied ? <Check size={20} /> : <MapPin size={20} />}
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                            {t('Endereço', 'Address')}
                        </p>
                        <p
                            className={`text-sm font-bold ${theme.text.primary} leading-none mb-0.5`}
                        >
                            R. São José, 475B
                        </p>
                        <p className="text-[9px] text-gray-500 font-medium">
                            Centro, Petrolina - PE
                        </p>
                    </div>
                </div>
            </HolographicCard>

            {/* CHECKLIST ACTION (Primary) */}
            <Button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onOpenCheckout();
                }}
                fullWidth
                leftIcon={<LogOut size={16} />}
                className="mb-3 relative z-10 py-3.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-xs uppercase tracking-wide shadow-lg shadow-red-900/20 border border-white/10"
            >
                {t('Fazer Check-out Agora', 'Check-out Now')}
            </Button>

            {/* SUPPORT BUTTON */}
            <Button
                onClick={() => {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onOpenSupport();
                }}
                fullWidth
                leftIcon={<MessageCircle size={16} />}
                className={`${theme.button.primary} text-[11px] uppercase tracking-wide shadow-lg relative z-10 mb-4`}
            >
                {config.propertyId === 'lili' ? t('Fale com a Lili', 'Talk to Lili') : t('Fale Conosco', 'Talk to Us')}
            </Button>

            {/* CHECKOUT TIME (Bottom) */}
            <div className="flex items-center justify-center gap-2 text-red-100/60 relative z-10 mt-auto">
                <p className="text-[10px] font-medium">{t('Liberar o flat até às', 'Vacate flat by')}</p>
                <p
                    className={`text-sm font-mono font-bold ${theme.text.primary} bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20`}
                >
                    {config.checkOutTime || '11:00'}
                </p>
            </div>
        </div>
    );
};

export default CheckoutCard;
