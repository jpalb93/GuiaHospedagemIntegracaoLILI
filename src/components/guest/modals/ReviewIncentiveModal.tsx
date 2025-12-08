import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Star, Gift, X } from 'lucide-react';
import { GOOGLE_REVIEW_LINK } from '../../../constants';
import CouponBoardingPass from './CouponBoardingPass';
import { analytics } from '../../../utils/analytics';

interface ReviewIncentiveModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyName?: string;
    guestName?: string;
}

const ReviewIncentiveModal: React.FC<ReviewIncentiveModalProps> = ({
    isOpen,
    onClose,
    propertyName = 'Flat da Lili',
    guestName,
}) => {
    const [showCoupon, setShowCoupon] = useState(false);

    if (!isOpen) return null;

    // Track modal open
    React.useEffect(() => {
        if (isOpen) {
            analytics.trackReviewModalOpened();
        }
    }, [isOpen]);

    const handleGoToReview = () => {
        analytics.trackReviewLinkClicked();
        window.open(GOOGLE_REVIEW_LINK, '_blank');
        // Don't close immediately - let them claim coupon after
    };

    const modalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn" style={{ isolation: 'isolate' }}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-amber-300 dark:border-amber-600 animate-scaleIn">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    aria-label="Fechar"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                </button>

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-amber-400 rounded-full blur-xl opacity-50 animate-pulse" />
                        <div className="relative p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full">
                            <Gift size={40} className="text-white" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2 font-heading">
                    Presente Especial! 🎁
                </h2>

                {/* Message */}
                <p className="text-center text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                    Compartilhe sua experiência no{' '}
                    <span className="font-bold text-amber-700 dark:text-amber-400">
                        {propertyName}
                    </span>{' '}
                    e ganhe:
                </p>

                {/* Offer Box */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 border-2 border-amber-300 dark:border-amber-600 shadow-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Star size={24} className="text-amber-500 fill-amber-500" />
                        <span className="text-3xl font-bold text-amber-600 dark:text-amber-400 font-heading">
                            5% OFF
                        </span>
                        <Star size={24} className="text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                        na sua próxima reserva!
                    </p>
                </div>

                {/* Details */}
                <div className="bg-amber-100 dark:bg-amber-900/30 rounded-xl p-3 mb-4">
                    <p className="text-xs text-center text-amber-800 dark:text-amber-300 leading-relaxed">
                        <strong>Como funciona:</strong> Avalie-nos no Google e ganhe seu cupom printável! 📱
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleGoToReview}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/30 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Star size={18} className="fill-white" />
                        Avaliar no Google
                    </button>
                    <button
                        onClick={() => setShowCoupon(true)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        ✅ Já Avaliei! Quero Meu Cupom
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full text-gray-600 dark:text-gray-400 font-medium py-2 px-6 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm"
                    >
                        Talvez depois
                    </button>
                </div>
            </div>

            {/* Coupon Boarding Pass Modal */}
            <CouponBoardingPass
                isOpen={showCoupon}
                onClose={() => {
                    setShowCoupon(false);
                    onClose();
                }}
                guestName={guestName || 'Hóspede'}
            />
        </div>
    );

    // Render using React Portal to ensure it's at document root
    return ReactDOM.createPortal(modalContent, document.body);
};

export default ReviewIncentiveModal;
