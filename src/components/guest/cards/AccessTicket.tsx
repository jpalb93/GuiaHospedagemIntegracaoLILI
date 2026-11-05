import React, { useState, useCallback } from 'react';
import { Key, Bell, Eye, Lock, Check } from 'lucide-react';
import { PropertyId } from '../../../types';
import { ThemeColors } from '../../../hooks/useGuestTheme';
import { triggerConfetti } from '../../../utils/confetti';
import { useLongPress } from '../../../hooks/useLongPress';
import { useLanguage } from '../../../hooks/useLanguage';

interface AccessTicketProps {
    propertyId: PropertyId;
    code: string;
    safeCode?: string;
    label: string;
    subLabel?: string;
    theme: ThemeColors;
    alwaysVisible?: boolean;
    variant?: 'default' | 'small';
}

const AccessTicket: React.FC<AccessTicketProps> = ({
    propertyId,
    code,
    safeCode,
    label,
    subLabel,
    theme,
    alwaysVisible = false,
    variant = 'default',
}) => {
    const { t } = useLanguage();
    const [copiedField, setCopiedField] = useState<'code' | 'safe' | null>(null);

    // Key for localStorage: access_revealed_{propertyId}_{code}_{safeCode}
    const storageKey = `access_revealed_${propertyId}_${code}_${safeCode || ''}`;

    const [internalIsRevealed, setInternalIsRevealed] = useState(() => {
        if (alwaysVisible) return true;
        if (propertyId === 'integracao' && !safeCode) return true;

        // Check localStorage
        const saved = localStorage.getItem(storageKey);
        return saved === 'true';
    });

    const isRevealed = alwaysVisible || internalIsRevealed;

    const [isAnimating, setIsAnimating] = useState(false);

    const handleReveal = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isRevealed) return;

        if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
        setIsAnimating(true);

        setTimeout(() => {
            setInternalIsRevealed(true);
            setIsAnimating(false);
            localStorage.setItem(storageKey, 'true');
            triggerConfetti(document.getElementById('access-ticket') as HTMLElement);
        }, 650);
    };

    const handleCopy = useCallback(
        (value: string, field: 'code' | 'safe', targetEl?: HTMLElement | null) => {
            if (!value || value === '----') return;
            navigator.clipboard.writeText(value);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
            if (targetEl) {
                triggerConfetti(targetEl);
            }
        },
        []
    );

    const handleCopyCode = useCallback(() => {
        handleCopy(code, 'code', document.getElementById('access-code-display'));
    }, [code, handleCopy]);

    // Long press for copy action with visual feedback
    const longPress = useLongPress({
        delay: 500,
        onClick: handleCopyCode,
        onLongPress: () => {
            handleCopyCode();
        },
    });

    const isSmall = variant === 'small';
    const isIntegracao = propertyId === 'integracao';
    const hasDualCodes = Boolean(safeCode && safeCode !== '----');

    return (
        <div
            id="access-ticket"
            className={`relative w-full overflow-hidden rounded-xl border ${theme.border} shadow-lg transition-all duration-300 group h-full`}
            style={{ backgroundColor: isIntegracao ? '#1E293B' : '#252535' }}
        >
            {/* Ticket Notch Effects (Visual only) */}
            <div className="absolute top-1/2 -left-1.5 w-3 h-3 rounded-full bg-[#1E1E2E] transform -translate-y-1/2" />
            <div className="absolute top-1/2 -right-1.5 w-3 h-3 rounded-full bg-[#1E1E2E] transform -translate-y-1/2" />

            {/* Top Decoration Line */}
            <div
                className={`absolute top-0 left-0 right-0 h-[3px] opacity-80 ${
                    isIntegracao
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600'
                        : 'bg-gradient-to-r from-orange-500 to-purple-600'
                }`}
            />

            <div
                className={`flex flex-col items-center justify-center text-center ${isSmall ? 'p-2.5 min-h-[auto]' : 'p-4 min-h-[124px]'} h-full`}
            >
                {/* Header */}
                <div
                    className={`flex items-center justify-between w-full ${isSmall ? 'mb-1.5' : 'mb-2.5'}`}
                >
                    <p
                        className={`font-bold uppercase tracking-[0.18em] ${theme.text.secondary} ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}
                    >
                        {hasDualCodes
                            ? isIntegracao
                                ? t(
                                      'Acesso ao Flat & Cofre',
                                      'Flat & Safe Access',
                                      'Acceso al Piso y Cofre'
                                  )
                                : t(
                                      'Senhas de Acesso (2 Passos)',
                                      'Access Codes (2 Steps)',
                                      'Códigos de Acceso (2 Pasos)'
                                  )
                            : label}
                    </p>
                    <div
                        className={`rounded-lg ${isIntegracao ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-gray-300'} ${isSmall ? 'p-1' : 'p-1.5'}`}
                    >
                        <Key size={isSmall ? 12 : 14} />
                    </div>
                </div>

                {/* Content Area */}
                <div
                    className={`relative w-full flex flex-col items-center justify-center ${isSmall ? 'py-0.5' : 'py-1'} flex-1`}
                >
                    {/* Hidden State */}
                    {!isRevealed && !isAnimating && (
                        <div className="flex flex-col items-center animate-fade-in py-1">
                            <div className="mb-2 p-2.5 bg-white/5 rounded-full">
                                <Lock size={22} className="text-gray-300" />
                            </div>
                            <button
                                onClick={handleReveal}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center gap-2 ${
                                    isIntegracao
                                        ? 'bg-cyan-600 text-white hover:bg-cyan-500'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }`}
                            >
                                <Eye size={14} />{' '}
                                {t('Revelar Senhas', 'Reveal Passwords', 'Revelar Contraseñas')}
                            </button>
                        </div>
                    )}

                    {/* Animating State */}
                    {isAnimating && (
                        <div className="flex flex-col items-center animate-pulse py-2">
                            <div className="mb-2 p-2.5 bg-amber-500/20 rounded-full animate-spin">
                                <Key size={22} className="text-amber-400" />
                            </div>
                            <p className="text-xs text-amber-400 font-bold">
                                {t('Desbloqueando...', 'Unlocking...', 'Desbloqueando...')}
                            </p>
                        </div>
                    )}

                    {/* Revealed State: Dual Codes (Safe + Door/Unit) */}
                    {isRevealed && !isAnimating && hasDualCodes && (
                        <div className="grid grid-cols-2 gap-2.5 w-full animate-fade-in">
                            {/* Box 1: Cofre (Lili) OR Unidade (Integração) */}
                            {isIntegracao ? (
                                <div className="bg-black/25 border border-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-0.5">
                                        {t('Unidade', 'Unit', 'Unidad')}
                                    </span>
                                    <span
                                        className={`font-mono font-bold tracking-widest text-white ${isSmall ? 'text-lg' : 'text-2xl'}`}
                                    >
                                        {code || '---'}
                                    </span>
                                    <span className="text-[10px] text-cyan-300/90 font-medium mt-0.5">
                                        Flats Integração
                                    </span>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(safeCode!, 'safe', e.currentTarget);
                                    }}
                                    className="bg-black/25 hover:bg-black/35 border border-white/10 rounded-xl p-2.5 flex flex-col items-center justify-center transition-colors cursor-pointer"
                                    title={t(
                                        'Toque para copiar a senha do cofre',
                                        'Tap to copy safe code',
                                        'Toca para copiar el código del cofre'
                                    )}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5 flex items-center gap-1">
                                        {t(
                                            '1º Cofre (Rua)',
                                            '1st Safe (Street)',
                                            '1º Cofre (Calle)'
                                        )}
                                        {copiedField === 'safe' && (
                                            <Check size={11} className="text-green-400" />
                                        )}
                                    </span>
                                    <span
                                        className={`font-mono font-bold tracking-widest text-white ${isSmall ? 'text-lg' : 'text-2xl'}`}
                                    >
                                        {safeCode}
                                    </span>
                                    <span className="text-[10px] text-gray-300 font-medium mt-0.5">
                                        {copiedField === 'safe'
                                            ? t('Copiado!', 'Copied!', '¡Copiado!')
                                            : t('Chave do portão', 'Gate key', 'Llave del portón')}
                                    </span>
                                </button>
                            )}

                            {/* Box 2: Cofre (Integração) OR Porta (Lili) */}
                            {isIntegracao ? (
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(safeCode!, 'safe', e.currentTarget);
                                    }}
                                    className="bg-black/25 hover:bg-black/35 border border-cyan-500/30 rounded-xl p-2.5 flex flex-col items-center justify-center transition-colors cursor-pointer"
                                    title={t(
                                        'Toque para copiar a senha do cofre',
                                        'Tap to copy safe code',
                                        'Toca para copiar el código del cofre'
                                    )}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 mb-0.5 flex items-center gap-1">
                                        {t('Senha do Cofre', 'Safe Code', 'Clave del Cofre')}
                                        {copiedField === 'safe' && (
                                            <Check size={11} className="text-green-400" />
                                        )}
                                    </span>
                                    <span
                                        className={`font-mono font-bold tracking-widest text-white ${isSmall ? 'text-lg' : 'text-2xl'}`}
                                    >
                                        {safeCode}
                                    </span>
                                    <span className="text-[10px] text-slate-300 font-medium mt-0.5">
                                        {copiedField === 'safe'
                                            ? t('Copiado!', 'Copied!', '¡Copiado!')
                                            : t(
                                                  'Pegue as 2 chaves',
                                                  'Get the 2 keys',
                                                  'Toma las 2 llaves'
                                              )}
                                    </span>
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    id="access-code-display"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(code, 'code', e.currentTarget);
                                    }}
                                    className="bg-black/25 hover:bg-black/35 border border-orange-500/30 rounded-xl p-2.5 flex flex-col items-center justify-center transition-colors cursor-pointer"
                                    title={t(
                                        'Toque para copiar a senha da porta',
                                        'Tap to copy door code',
                                        'Toca para copiar el código de la puerta'
                                    )}
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-300 mb-0.5 flex items-center gap-1">
                                        {t('2º Porta Flat', '2nd Flat Door', '2º Puerta Piso')}
                                        {copiedField === 'code' && (
                                            <Check size={11} className="text-green-400" />
                                        )}
                                    </span>
                                    <div className="flex items-center justify-center gap-1.5">
                                        <span
                                            className={`font-mono font-bold tracking-widest text-white ${isSmall ? 'text-lg' : 'text-2xl'}`}
                                        >
                                            {code}
                                        </span>
                                        <Bell
                                            size={isSmall ? 14 : 18}
                                            className="text-orange-400 animate-pulse shrink-0"
                                        />
                                    </div>
                                    <span className="text-[10px] text-gray-300 font-medium mt-0.5">
                                        {copiedField === 'code'
                                            ? t('Copiado!', 'Copied!', '¡Copiado!')
                                            : t(
                                                  'Toque no 🔔 após',
                                                  'Ring 🔔 after',
                                                  'Toca 🔔 después'
                                              )}
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {/* Revealed State: Single Code Fallback */}
                    {isRevealed && !isAnimating && !hasDualCodes && (
                        <div
                            id="access-code-display"
                            {...longPress.handlers}
                            className="relative flex flex-col items-center animate-fade-in cursor-pointer select-none"
                        >
                            <div className="flex items-center justify-center gap-2 mb-0.5">
                                <p
                                    className={`text-center font-mono font-bold tracking-widest transition-all ${
                                        isSmall ? 'text-lg' : 'text-2xl'
                                    }`}
                                    style={{ color: theme.text.primary }}
                                >
                                    {code}
                                </p>
                                {!isIntegracao && (
                                    <Bell
                                        size={isSmall ? 14 : 20}
                                        className="text-orange-500 animate-pulse"
                                    />
                                )}
                            </div>

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
                                    className={`font-medium flex items-center justify-center gap-1 ${theme.text.secondary} ${isSmall ? 'text-[9px]' : 'text-[10px]'}`}
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
