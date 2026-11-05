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
    addressCopied?: boolean;
    onCopyAddress?: () => void;
    onOpenDriverMode?: () => void;
    onOpenSupport: () => void;
    onEmergency: () => void;
    onOpenCheckout: () => void;
    onOpenReview: () => void;
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({
    config,
    addressCopied = false,
    onCopyAddress: onCopyAddressProp,
    onOpenDriverMode: onOpenDriverModeProp,
    onOpenSupport,
    onEmergency,
    onOpenCheckout,
    onOpenReview,
}) => {
    const theme = useGuestTheme(config.propertyId || 'lili');
    const { t } = useLanguage();
    const [showReviewModal, setShowReviewModal] = React.useState(false);
    const isIntegracao = config.propertyId === 'integracao';
    const subCardBg = isIntegracao ? 'bg-[#1A2634]' : 'bg-[#28201D]';

    const onCopyAddress = () => {
        if (onCopyAddressProp) {
            onCopyAddressProp();
            return;
        }
        hapticFeedback('light');
        navigator.clipboard.writeText('R. São José, 475B, Centro, Petrolina - PE');
    };
    const onOpenDriverMode = () => {
        if (onOpenDriverModeProp) {
            onOpenDriverModeProp();
            return;
        }
        window.open(
            `https://www.google.com/maps/search/?api=1&query=R.+São+José,+475B,+Centro,+Petrolina+-+PE`,
            '_blank'
        );
    };

    return (
        <div
            className={`flex flex-col h-full ${theme.background} ${theme.backgroundGradient} p-4 rounded-3xl text-stone-50 shadow-2xl border border-orange-500/25 relative overflow-hidden w-full animate-gold-pulse`}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h2 className="text-[10px] font-heading font-extrabold text-orange-400 uppercase tracking-[0.15em] mt-1.5">
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
                <h3 className={`text-xl font-display font-semibold ${theme.text.primary} mb-1`}>
                    {t('Volte sempre, viu? 👋', 'Come back soon! 👋')}
                </h3>
            </div>

            {/* REVIEW BUTTON */}
            <Button
                onClick={() => {
                    onOpenReview();
                    if (config.propertyId === 'lili') {
                        setShowReviewModal(true);
                    } else {
                        window.open(GOOGLE_REVIEW_LINK, '_blank');
                    }
                }}
                fullWidth
                leftIcon={<Star size={14} className="fill-white" />}
                className="mb-4 relative z-10 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-[11px] uppercase tracking-wide shadow-lg shadow-amber-500/20"
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
                    className={`${subCardBg} p-3 rounded-xl border ${theme.border} hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group`}
                >
                    <div className="p-2 bg-sky-500/15 rounded-full text-sky-400 group-hover:bg-sky-500/25 transition-colors">
                        <Plane size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200 uppercase tracking-wide">
                        {t('Aeroporto', 'Airport')}
                    </span>
                </a>

                <a
                    href="https://maps.app.goo.gl/e3gXqN6SXhnHoJwc6"
                    target="_blank"
                    rel="noreferrer"
                    className={`${subCardBg} p-3 rounded-xl border ${theme.border} hover:border-white/20 shadow-lg flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/5 active:scale-95 group`}
                >
                    <div className="p-2 bg-amber-500/15 rounded-full text-amber-400 group-hover:bg-amber-500/25 transition-colors">
                        <Bus size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-stone-200 uppercase tracking-wide">
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
                className={`w-full mb-3 ${subCardBg} p-3 rounded-xl border ${theme.border} shadow-lg flex flex-col justify-center cursor-pointer hover:bg-white/5 transition-all group relative z-10 ${addressCopied ? 'ring-1 ring-emerald-500/50' : ''}`}
                title="R. São José, 475B"
            >
                <div className="absolute top-2 right-2 z-20">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenDriverMode();
                        }}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-stone-400 hover:text-white"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className={`p-2.5 rounded-lg flex items-center justify-center ${addressCopied ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-amber-300'}`}
                    >
                        {addressCopied ? <Check size={20} /> : <MapPin size={20} />}
                    </div>
                    <div className="text-left">
                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider mb-0.5">
                            {t('Endereço', 'Address')}
                        </p>
                        <p
                            className={`text-sm font-bold ${theme.text.primary} leading-none mb-0.5`}
                        >
                            R. São José, 475B
                        </p>
                        <p className="text-[9px] text-stone-400 font-medium">
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
                className="mb-3 relative z-10 py-3.5 bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-500 hover:to-amber-600 text-xs uppercase tracking-wide shadow-lg shadow-orange-950/30 border border-white/10"
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
                {config.propertyId === 'lili'
                    ? t('Fale com a Lili', 'Talk to Lili')
                    : t('Fale Conosco', 'Talk to Us')}
            </Button>

            {/* CHECKOUT TIME (Bottom) */}
            <div className="flex items-center justify-center gap-2 text-orange-100/70 relative z-10 mt-auto">
                <p className="text-[10px] font-medium">
                    {t('Liberar o flat até às', 'Vacate flat by')}
                </p>
                <p
                    className={`text-sm font-mono font-bold ${theme.text.primary} bg-orange-500/15 px-2 py-0.5 rounded border border-orange-500/25`}
                >
                    {config.checkOutTime || '11:00'}
                </p>
            </div>
        </div>
    );
};

export default CheckoutCard;
