import React, { useState } from 'react';
import { X, Video, Lock, Key, Bell, Copy, Check, Building2, Sparkles } from 'lucide-react';
import { SAFE_VIDEO_URL, LOCK_VIDEO_URL } from '../../constants';
import { Button } from '../ui';
import { useLanguage } from '../../hooks/useLanguage';

interface CheckinModalProps {
    isOpen: boolean;
    onClose: () => void;
    safeCode: string;
    lockCode?: string;
    isPasswordReleased: boolean;
    onOpenVideo: (url: string, isVertical: boolean) => void;
    propertyId?: 'lili' | 'integracao';
    flatNumber?: string;
}

const CheckinModal: React.FC<CheckinModalProps> = ({
    isOpen,
    onClose,
    safeCode,
    lockCode,
    isPasswordReleased,
    onOpenVideo,
    propertyId = 'lili',
    flatNumber,
}) => {
    const { t } = useLanguage();
    const [copiedField, setCopiedField] = useState<'safe' | 'door' | null>(null);

    if (!isOpen) return null;

    const isIntegracao = propertyId === 'integracao';
    const unitLabel = isIntegracao
        ? flatNumber
            ? `Flat ${flatNumber}`
            : 'Flats Integração'
        : `Flat ${flatNumber || '304'}`;

    const handleCopy = (value: string | undefined, field: 'safe' | 'door') => {
        if (!value || !isPasswordReleased) return;
        if (navigator.vibrate) navigator.vibrate(40);
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
            <div
                className="absolute inset-0 bg-[#120F0D]/75 backdrop-blur-md transition-opacity"
                onClick={onClose}
                role="button"
                tabIndex={0}
                aria-label="Fechar modal"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onClose();
                }}
            ></div>
            <div className="bg-[#FAF7F2] dark:bg-[#1C1614] w-full max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative z-10 animate-slideUp sm:animate-scaleIn flex flex-col max-h-[92vh] border border-stone-200/80 dark:border-amber-500/15">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full backdrop-blur-md transition-all bg-black/15 hover:bg-black/25 text-white border border-white/15 active:scale-95"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>

                {/* Header com identidade da propriedade */}
                <div
                    className={`p-6 pb-7 text-white relative overflow-hidden ${
                        isIntegracao
                            ? 'bg-gradient-to-br from-[#16283B] via-[#1B334B] to-[#0F1D2C]'
                            : 'bg-gradient-to-br from-[#C85A32] via-[#B54B25] to-[#8A3416]'
                    }`}
                >
                    <div
                        className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-3xl pointer-events-none ${
                            isIntegracao ? 'bg-sky-400/20' : 'bg-amber-300/25'
                        }`}
                    />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/15 text-[10px] font-bold uppercase tracking-widest mb-2.5 backdrop-blur-sm">
                            <Building2 size={11} className="text-amber-300" />
                            <span>{unitLabel}</span>
                        </div>
                        <h2 className="text-2xl font-display font-semibold tracking-tight mb-1">
                            {t('Jornada de Check-in', 'Check-in Journey', 'Guía de Check-in')}
                        </h2>
                        <p className="text-white/85 text-xs font-medium flex items-center gap-1.5">
                            <Sparkles size={12} className="text-amber-300 shrink-0" />
                            {isIntegracao
                                ? t(
                                      'Acesso prático em 1 única etapa no cofre.',
                                      'Easy 1-step access via the key safe.',
                                      'Acceso práctico en 1 solo paso en el cofre.'
                                  )
                                : t(
                                      'Acesso rápido em 2 etapas (Cofre + Porta).',
                                      'Quick 2-step access (Safe + Door).',
                                      'Acceso rápido en 2 pasos (Cofre + Puerta).'
                                  )}
                        </p>
                    </div>
                </div>

                <div className="p-5 overflow-y-auto space-y-4 bg-[#FAF7F2] dark:bg-[#1C1614]">
                    {/* Passo único para Integração OU Passo 1 para Lili */}
                    <div className="bg-white dark:bg-[#241C19] p-5 rounded-2xl border border-stone-200/80 dark:border-amber-500/15 shadow-sm">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3.5">
                                <div
                                    className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold shadow-sm font-display text-lg border shrink-0 ${
                                        isIntegracao
                                            ? 'bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/25'
                                            : 'bg-amber-50 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-300 border-amber-200 dark:border-amber-500/25'
                                    }`}
                                >
                                    {isIntegracao ? <Key size={20} /> : <span>1º</span>}
                                </div>
                                <div>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest font-bold font-heading mb-0.5">
                                        {isIntegracao
                                            ? t(
                                                  'ACESSO PRINCIPAL (ENTRADA)',
                                                  'MAIN ACCESS (ENTRANCE)',
                                                  'ACCESO PRINCIPAL (ENTRADA)'
                                              )
                                            : t(
                                                  'PORTÃO DE ENTRADA (RUA)',
                                                  'STREET GATE',
                                                  'PORTÓN DE ENTRADA (CALLE)'
                                              )}
                                    </p>
                                    <p className="text-base font-bold text-stone-900 dark:text-stone-100 font-heading leading-snug">
                                        {isIntegracao
                                            ? t(
                                                  'Pegue as 2 chaves no cofre',
                                                  'Pick up the 2 keys in the safe',
                                                  'Tome las 2 llaves en el cofre'
                                              )
                                            : t(
                                                  'Pegue a chave do portão no cofre',
                                                  'Pick up the gate key in the safe',
                                                  'Tome la llave del portón en el cofre'
                                              )}
                                    </p>
                                </div>
                            </div>

                            {isPasswordReleased ? (
                                <button
                                    type="button"
                                    onClick={() => handleCopy(safeCode, 'safe')}
                                    className="w-full py-3.5 px-4 text-center bg-[#FAF7F2] dark:bg-[#171210] hover:bg-amber-50/60 dark:hover:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-amber-500/20 transition-all active:scale-[0.99] group relative"
                                >
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1 font-bold">
                                        {t('Senha do Cofre', 'Safe Code', 'Clave del Cofre')}
                                    </p>
                                    <div className="flex items-center justify-center gap-2.5">
                                        <p className="text-3xl font-bold text-stone-900 dark:text-amber-50 tracking-widest font-mono notranslate">
                                            {safeCode}
                                        </p>
                                        <span className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-white/10 text-stone-600 dark:text-amber-300 group-hover:scale-105 transition-transform">
                                            {copiedField === 'safe' ? (
                                                <Check size={14} className="text-emerald-500" />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1 font-medium">
                                        {copiedField === 'safe'
                                            ? t('Senha copiada!', 'Code copied!', '¡Clave copiada!')
                                            : t(
                                                  'Toque para copiar a senha',
                                                  'Tap to copy code',
                                                  'Toca para copiar la clave'
                                              )}
                                    </p>
                                </button>
                            ) : (
                                <div className="py-4 text-center bg-[#FAF7F2] dark:bg-[#171210] rounded-2xl border border-stone-200/80 dark:border-white/10 flex flex-col items-center justify-center">
                                    <Lock size={20} className="text-stone-400 mb-1" />
                                    <p className="text-lg font-bold text-stone-400 tracking-widest font-mono">
                                        ****
                                    </p>
                                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold bg-stone-200/70 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                                        {t(
                                            'Liberada na véspera do check-in',
                                            'Released the day before check-in',
                                            'Liberada en la víspera del check-in'
                                        )}
                                    </p>
                                </div>
                            )}

                            <Button
                                variant="secondary"
                                onClick={() => onOpenVideo(SAFE_VIDEO_URL, true)}
                                fullWidth
                                size="sm"
                                leftIcon={<Video size={16} />}
                                className="rounded-xl font-bold"
                            >
                                {t(
                                    'Ver Vídeo de Como Abrir o Cofre',
                                    'Watch How to Open the Safe',
                                    'Ver Video de Cómo Abrir el Cofre'
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Passo 2: Fechadura - APENAS PARA LILI */}
                    {!isIntegracao && (
                        <div className="bg-white dark:bg-[#241C19] p-5 rounded-2xl border border-stone-200/80 dark:border-amber-500/15 shadow-sm relative overflow-hidden">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-11 h-11 flex items-center justify-center bg-amber-50 dark:bg-amber-500/15 rounded-xl text-[#C85A32] dark:text-amber-300 font-bold shadow-sm font-display text-lg border border-amber-200 dark:border-amber-500/25 shrink-0">
                                        <span>2º</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest font-bold font-heading mb-0.5">
                                            {t(
                                                'PORTA DO FLAT (3º ANDAR)',
                                                'FLAT DOOR (3RD FLOOR)',
                                                'PUERTA DEL PISO (3º PISO)'
                                            )}
                                        </p>
                                        <p className="text-base font-bold text-stone-900 dark:text-stone-100 font-heading leading-snug">
                                            {t(
                                                'Digite na fechadura digital',
                                                'Enter on the digital lock',
                                                'Ingrese en la cerradura digital'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {isPasswordReleased ? (
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(lockCode, 'door')}
                                        className="w-full py-4 px-4 text-center bg-[#FAF7F2] dark:bg-[#171210] hover:bg-amber-50/60 dark:hover:bg-stone-900 rounded-2xl border border-amber-200/80 dark:border-amber-500/25 transition-all active:scale-[0.99] group"
                                    >
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-1 font-bold">
                                            {t('Senha da Porta', 'Door Code', 'Clave de la Puerta')}
                                        </p>
                                        <div className="flex items-center justify-center gap-2.5">
                                            <p className="text-3xl font-bold text-stone-900 dark:text-amber-50 tracking-widest font-mono notranslate">
                                                {lockCode || '----'}
                                            </p>
                                            <Bell
                                                size={22}
                                                className="text-[#C85A32] dark:text-amber-400 animate-pulse shrink-0"
                                            />
                                            <span className="p-1.5 rounded-lg bg-stone-200/70 dark:bg-white/10 text-stone-600 dark:text-amber-300 group-hover:scale-105 transition-transform">
                                                {copiedField === 'door' ? (
                                                    <Check size={14} className="text-emerald-500" />
                                                ) : (
                                                    <Copy size={14} />
                                                )}
                                            </span>
                                        </div>
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 dark:bg-amber-500/15 border border-amber-300/60 dark:border-amber-400/25 text-[11px] font-bold text-amber-900 dark:text-amber-300">
                                            <Bell size={12} className=" shrink-0" />
                                            <span>
                                                {copiedField === 'door'
                                                    ? t(
                                                          'Senha copiada!',
                                                          'Code copied!',
                                                          '¡Clave copiada!'
                                                      )
                                                    : t(
                                                          'Toque no sino 🔔 após digitar a senha',
                                                          'Tap the bell 🔔 after entering the code',
                                                          'Toca el timbre 🔔 tras ingresar la clave'
                                                      )}
                                            </span>
                                        </div>
                                    </button>
                                ) : (
                                    <div className="py-4 text-center bg-[#FAF7F2] dark:bg-[#171210] rounded-2xl border border-stone-200/80 dark:border-white/10 flex flex-col items-center justify-center">
                                        <Lock size={22} className="text-stone-400 mb-1.5" />
                                        <p className="text-lg font-bold text-stone-400 tracking-widest font-mono">
                                            ****
                                        </p>
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 font-semibold bg-stone-200/70 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                                            {t(
                                                'Liberada na véspera do check-in',
                                                'Released the day before check-in',
                                                'Liberada en la víspera del check-in'
                                            )}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={() => onOpenVideo(LOCK_VIDEO_URL, true)}
                                    fullWidth
                                    size="sm"
                                    leftIcon={<Video size={16} />}
                                    className="rounded-xl font-bold bg-amber-50 dark:bg-amber-500/15 border border-amber-200 dark:border-amber-500/30 text-[#C85A32] dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/25"
                                >
                                    {t(
                                        'Ver Vídeo da Fechadura Digital',
                                        'Watch Digital Lock Video',
                                        'Ver Video de la Cerradura Digital'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckinModal;
