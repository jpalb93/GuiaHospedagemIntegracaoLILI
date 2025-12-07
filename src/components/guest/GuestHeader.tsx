import React from 'react';
import { Megaphone, MessageSquare, X } from 'lucide-react';
import { AppConfig, GuestConfig } from '../../types';

interface GuestHeaderProps {
    appSettings: AppConfig | null;
    config: GuestConfig;
    dismissedAlerts: { global: string; personal: string };
    onDismissAlert: (type: 'global' | 'personal', text: string) => void;
}

const GuestHeader: React.FC<GuestHeaderProps> = ({
    appSettings,
    config,
    dismissedAlerts,
    onDismissAlert,
}) => {
    const propertyId = config.propertyId || 'lili';
    const globalNotice = appSettings?.globalNotices?.[propertyId];

    // Fallback para o sistema antigo se não tiver específico
    const activeNoticeText = globalNotice?.active
        ? globalNotice.text
        : appSettings?.noticeActive
          ? appSettings.noticeText
          : '';
    const isNoticeActive = globalNotice?.active || appSettings?.noticeActive;

    const showGlobalBanner =
        isNoticeActive && activeNoticeText && activeNoticeText !== dismissedAlerts.global;
    const showPersonalBanner =
        config.guestAlertActive && config.guestAlertText !== dismissedAlerts.personal;

    return (
        <div className="sticky top-0 left-0 w-full z-[45] flex flex-col shadow-md">
            {showGlobalBanner && (
                <div className="bg-yellow-500 text-white animate-fadeIn relative">
                    <div className="max-w-3xl mx-auto px-4 py-2 flex items-start gap-3 pr-8">
                        <Megaphone
                            size={18}
                            className="shrink-0 mt-0.5 animate-pulse"
                            fill="currentColor"
                        />
                        <p className="text-xs font-bold leading-snug font-sans">
                            {activeNoticeText}
                        </p>
                    </div>
                    <button
                        onClick={() => onDismissAlert('global', activeNoticeText || '')}
                        className="absolute top-1 right-1 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
            {showPersonalBanner && (
                <div className="bg-blue-600 text-white animate-fadeIn border-t border-blue-500/50 relative">
                    <div className="max-w-3xl mx-auto px-4 py-2 flex items-start gap-3 pr-8">
                        <MessageSquare size={18} className="shrink-0 mt-0.5" fill="currentColor" />
                        <p className="text-xs font-bold leading-snug font-sans">
                            {config.guestAlertText}
                        </p>
                    </div>
                    <button
                        onClick={() => onDismissAlert('personal', config.guestAlertText || '')}
                        className="absolute top-1 right-1 p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GuestHeader;
