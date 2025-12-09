import React, { useState, useEffect, useCallback } from 'react';
import { Key, Bell, Eye, Lock } from 'lucide-react';
import { PropertyId } from '../../../types';
import { ThemeColors } from '../../../hooks/useGuestTheme';
import { triggerConfetti } from '../../../utils/confetti';
import { useLongPress } from '../../../hooks/useLongPress';
import { useLanguage } from '../../../hooks/useLanguage';

interface AccessTicketProps {
    propertyId: PropertyId;
    code: string;
    label: string;
    subLabel?: string;
    theme: ThemeColors;
    alwaysVisible?: boolean;
    variant?: 'default' | 'small';
}

const AccessTicket: React.FC<AccessTicketProps> = ({
    propertyId,
    code,
    label,
    subLabel,
    theme,
    alwaysVisible = false,
    variant = 'default',
}) => {
    const { t } = useLanguage();
    // Key for localStorage: access_revealed_{propertyId}_{code}
    // We use the code itself in the key so if the password changes, it resets
    const storageKey = `access_revealed_${propertyId}_${code}`;

    const [isRevealed, setIsRevealed] = useState(() => {
        if (alwaysVisible) return true;
        if (propertyId === 'integracao') return true;

        // Check localStorage
        const saved = localStorage.getItem(storageKey);
        return saved === 'true';
    });

    const [isAnimating, setIsAnimating] = useState(false);

    // Update state if alwaysVisible changes
    useEffect(() => {
        if (alwaysVisible) {
            setIsRevealed(true);
        }
    }, [alwaysVisible]);

    const handleReveal = () => {
        if (isRevealed) return;

        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        setIsAnimating(true);

        setTimeout(() => {
            setIsRevealed(true);
            setIsAnimating(false);
            localStorage.setItem(storageKey, 'true'); // Save to localStorage
            triggerConfetti(document.getElementById('access-ticket') as HTMLElement);
        }, 800); // Animation duration
    };

    const handleCopyCode = useCallback(() => {
        navigator.clipboard.writeText(code);
        triggerConfetti(document.getElementById('access-code-display') as HTMLElement);
    }, [code]);

    // Long press for copy action with visual feedback
    const longPress = useLongPress({
        delay: 500,
        onClick: handleCopyCode,
        onLongPress: () => {
            // Long press action: could show QR code or details modal
            // For now, just copy with extra feedback
            handleCopyCode();
        },
    });

    const isSmall = variant === 'small';

    return (
        <div
            id="access-ticket"
            className={`relative w-full overflow-hidden rounded-xl border ${theme.border} shadow-lg transition-all duration-300 group h-full`}
            style={{ backgroundColor: propertyId === 'integracao' ? '#1E293B' : '#252535' }}
        >
            {/* Ticket Notch Effects (Visual only) */}
            <div className="absolute top-1/2 -left-1.5 w-3 h-3 rounded-full bg-[#1E1E2E] transform -translate-y-1/2" />
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 rounded-full bg-[#1E1E2E] transform -translate-y-1/2" />

            {/* Top Decoration Line */}
            <div
                className={`absolute top-0 left-0 right-0 h-[3px] opacity-80 ${propertyId === 'integracao'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                    : 'bg-gradient-to-r from-orange-500 to-purple-600'
                    }`}
            />

            <div
                className={`flex flex-col items-center justify-center text-center ${isSmall ? 'p-2 min-h-[auto]' : 'p-4 min-h-[120px]'} h-full`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between w-full ${isSmall ? 'mb-1' : 'mb-2'}`}
                >
                    <p
                        className={`font-bold uppercase tracking-[0.2em] ${theme.text.secondary} ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}
                    >
                        {label}
                    </p>
                    <div
                        className={`rounded-lg ${propertyId === 'integracao' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-gray-400'} ${isSmall ? 'p-1' : 'p-1.5'}`}
                    >
                        <Key size={isSmall ? 12 : 14} />
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className={`relative w-full flex flex-col items-center justify-center ${isSmall ? 'py-0' : 'py-2'} flex-1`}
                >
                    {/* Hidden State (Lili) */}
                    {!isRevealed && !isAnimating && (
                        <div className="flex flex-col items-center animate-fade-in">
                            <div className="mb-2 p-3 bg-white/5 rounded-full">
                                <Lock size={24} className="text-gray-400" />
                            </div>
                            <button
                                onClick={handleReveal}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-2 ${propertyId === 'integracao'
                                    ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                <Eye size={14} /> {t('Revelar Senha', 'Reveal Password', 'Revelar Contraseña')}
                            </button>
                        </div>
                    )}

                    {/* Animating State */}
                    {isAnimating && (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="mb-2 p-3 bg-amber-500/20 rounded-full animate-spin">
                                <Key size={24} className="text-amber-500" />
                            </div>
                            <p className="text-xs text-amber-400 font-bold">{t('Desbloqueando...', 'Unlocking...', 'Desbloqueando...')}</p>
                        </div>
                    )}

                    {/* Revealed State (Code Display) */}
                    {isRevealed && !isAnimating && (
                        <div
                            id="access-code-display"
                            {...longPress.handlers}
                            className="relative flex flex-col items-center animate-fade-in cursor-pointer select-none"
                        >
                            <div className="flex items-center justify-center gap-2 mb-0.5">
                                <p
                                    className={`text-center font-mono font-bold tracking-widest transition-all ${isSmall ? 'text-lg' : 'text-2xl'
                                        }`}
                                    style={{ color: theme.text.primary }}
                                >
                                    {code}
                                </p>
                                {propertyId !== 'integracao' && (
                                    <Bell
                                        size={isSmall ? 14 : 20}
                                        className="text-orange-500 animate-pulse"
                                    />
                                )}
                            </div>

                            {/* Long Press Progress Indicator */}
                            {longPress.isLongPressing && (
                                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all"
                                        style={{ width: `${longPress.progress * 100}%` }}
                                    />
                                </div>
                            )}
                            {subLabel && (
                                <p
                                    className={`font-medium flex items-center justify-center gap-1 ${theme.text.secondary} ${isSmall ? 'text-[8px]' : 'text-[10px]'}`}
                                >
                                    {subLabel}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccessTicket;
