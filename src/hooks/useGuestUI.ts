import { useState } from 'react';

export const useGuestUI = () => {
    const [wifiCopied, setWifiCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);

    const [showDriverMode, setShowDriverMode] = useState(false);
    const [showOfflineCard, setShowOfflineCard] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

    const [isStoryOpen, setIsStoryOpen] = useState(false);
    const [storyStartIndex, setStoryStartIndex] = useState(0);

    const [currentVideoUrl, setCurrentVideoUrl] = useState('');
    const [isVideoVertical, setIsVideoVertical] = useState(false);
    const [startOnKeyDetails, setStartOnKeyDetails] = useState(false);

    const openVideoModal = (url: string, vertical: boolean = false) => {
        if (navigator.vibrate) navigator.vibrate(50);
        setCurrentVideoUrl(url);
        setIsVideoVertical(vertical);
        setShowVideoModal(true);
    };

    const handleOpenKeyDetails = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        setStartOnKeyDetails(true);
        setIsCheckoutModalOpen(true);
    };

    const handleCloseCheckout = () => {
        setIsCheckoutModalOpen(false);
        setTimeout(() => setStartOnKeyDetails(false), 500);
    };

    const copyToClipboard = (text: string, type: 'wifi' | 'address') => {
        if (navigator.vibrate) navigator.vibrate(50);
        navigator.clipboard.writeText(text);
        if (type === 'wifi') {
            setWifiCopied(true);
            setTimeout(() => setWifiCopied(false), 2000);
        } else {
            setAddressCopied(true);
            setTimeout(() => setAddressCopied(false), 2000);
        }
    };

    return {
        modals: {
            showDriverMode,
            setShowDriverMode,
            showOfflineCard,
            setShowOfflineCard,
            showVideoModal,
            setShowVideoModal,
            isCheckinModalOpen,
            setIsCheckinModalOpen,
            isCheckoutModalOpen,
            setIsCheckoutModalOpen,
            isSupportModalOpen,
            setIsSupportModalOpen,
            isStoryOpen,
            setIsStoryOpen,
        },
        video: {
            currentVideoUrl,
            isVideoVertical,
            openVideoModal,
        },
        checkout: {
            startOnKeyDetails,
            handleOpenKeyDetails,
            handleCloseCheckout,
        },
        stories: {
            storyStartIndex,
            setStoryStartIndex,
        },
        clipboard: {
            wifiCopied,
            addressCopied,
            copyToClipboard,
        },
    };
};
