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
    currentSafeCode?: string;
    isLoadingWifi?: boolean;
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
    onOpenReview?: () => void;
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
    currentSafeCode,
    isLoadingWifi = false,
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
    onOpenReview = () => {},
}) => {
    if (!isTimeVerified) return <CardSkeleton />;

    switch (stayStage) {
        case 'pre_checkin':
            return (
                <PreCheckinCard
                    isPasswordReleased={isPasswordReleased}
                    config={config}
                    safeCode={currentSafeCode}
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
                    safeCode={currentSafeCode}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    isLoadingWifi={isLoadingWifi}
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
                    safeCode={currentSafeCode}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    isLoadingWifi={isLoadingWifi}
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
                    safeCode={currentSafeCode}
                    wifiCopied={wifiCopied}
                    addressCopied={addressCopied}
                    currentWifiSSID={currentWifiSSID}
                    currentWifiPass={currentWifiPass}
                    isLoadingWifi={isLoadingWifi}
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
                    addressCopied={addressCopied}
                    onCopyAddress={onCopyAddress}
                    onOpenDriverMode={onOpenDriverMode}
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
