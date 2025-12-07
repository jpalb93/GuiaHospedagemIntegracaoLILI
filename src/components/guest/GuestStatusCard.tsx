import React from 'react';
import { GuestConfig } from '../../types';
import CardSkeleton from './cards/CardSkeleton';
import PreCheckinCard from './cards/PreCheckinCard';
import CheckinCard from './cards/CheckinCard';
import MiddleStayCard from './cards/MiddleStayCard';
import PreCheckoutCard from './cards/PreCheckoutCard';
import CheckoutCard from './cards/CheckoutCard';
import PostCheckoutCard from './cards/PostCheckoutCard';

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
    onOpenReview?: () => void; // Added optional prop for review
}

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
    onSaveAccess,
    onOpenReview = () => {}, // Default no-op
}) => {
    if (!isTimeVerified) return <CardSkeleton />;

    switch (stayStage) {
        case 'pre_checkin':
            return (
                <PreCheckinCard
                    isPasswordReleased={isPasswordReleased}
                    config={config}
                    onOpenCheckin={onOpenCheckin}
                    onOpenSupport={onOpenSupport}
                    onSaveAccess={onSaveAccess}
                    formatFriendlyDate={formatFriendlyDate}
                />
            );
        case 'checkin':
            return (
                <CheckinCard
                    isSingleNight={isSingleNight}
                    config={config}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    onOpenCheckin={onOpenCheckin}
                    onOpenSupport={onOpenSupport}
                    onEmergency={onEmergency}
                    onSaveAccess={onSaveAccess}
                    onCopyWifi={onCopyWifi}
                    onCopyAddress={onCopyAddress}
                    onOpenDriverMode={onOpenDriverMode}
                    onOpenCheckout={onOpenCheckout}
                />
            );
        case 'middle':
            return (
                <MiddleStayCard
                    config={config}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    onOpenSupport={onOpenSupport}
                    onEmergency={onEmergency}
                    onSaveAccess={onSaveAccess}
                    onCopyWifi={onCopyWifi}
                    onCopyAddress={onCopyAddress}
                    onOpenDriverMode={onOpenDriverMode}
                    onOpenCheckout={onOpenCheckout}
                />
            );
        case 'pre_checkout':
            return (
                <PreCheckoutCard
                    config={config}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    onOpenSupport={onOpenSupport}
                    onEmergency={onEmergency}
                    onSaveAccess={onSaveAccess}
                    onCopyWifi={onCopyWifi}
                    onCopyAddress={onCopyAddress}
                    onOpenDriverMode={onOpenDriverMode}
                    onOpenCheckout={onOpenCheckout}
                />
            );
        case 'checkout':
            return (
                <CheckoutCard
                    config={config}
                    onOpenSupport={onOpenSupport}
                    onEmergency={onEmergency}
                    onOpenCheckout={onOpenCheckout}
                    onOpenReview={onOpenReview}
                />
            );
        case 'post_checkout':
            return (
                <PostCheckoutCard
                    config={config}
                    onOpenSupport={onOpenSupport}
                    onOpenReview={onOpenReview}
                />
            );
        default:
            return null;
    }
};

export default GuestStatusCard;
