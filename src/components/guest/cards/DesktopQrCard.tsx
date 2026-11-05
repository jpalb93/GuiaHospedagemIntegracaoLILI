import React, { useEffect, useId, useRef, useState } from 'react';
import { Smartphone, Copy, Check, QrCode } from 'lucide-react';
import { useLanguage } from '../../../hooks/useLanguage';
import { triggerConfetti } from '../../../utils/confetti';

interface DesktopQrCardProps {
    propertyId?: string;
    className?: string;
}

/**
 * Card exibido exclusivamente no Desktop para permitir ao hóspede
 * escanear o QR Code com a câmera do celular e continuar a experiência on-the-go.
 */
export const DesktopQrCard: React.FC<DesktopQrCardProps> = ({
    propertyId = 'lili',
    className = '',
}) => {
    const { t } = useLanguage();
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
    const [qr, setQr] = useState({ forUrl: '', dataUrl: '', error: false });
    const [qrAttempt, setQrAttempt] = useState(0);
    const mounted = useRef(false);
    const copyTimer = useRef<ReturnType<typeof setTimeout>>();
    const copyErrorId = useId();
    const copied = copyStatus === 'copied';
    const isIntegracao = propertyId === 'integracao';

    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const qrCodeUrl = qr.forUrl === currentUrl ? qr.dataUrl : '';
    const qrFailed = !currentUrl || (qr.forUrl === currentUrl && qr.error);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            if (copyTimer.current) clearTimeout(copyTimer.current);
        };
    }, []);

    useEffect(() => {
        if (!currentUrl) return;
        let cancelled = false;
        const generateQr = async () => {
            try {
                // The reservation URL stays in this browser; no remote QR service receives it.
                const { toDataURL } = await import('qrcode');
                const dataUrl = await toDataURL(currentUrl, {
                    width: 180,
                    margin: 2,
                    color: { dark: '#120F0D', light: '#ffffff' },
                });
                if (!cancelled) setQr({ forUrl: currentUrl, dataUrl, error: false });
            } catch {
                if (!cancelled) setQr({ forUrl: currentUrl, dataUrl: '', error: true });
            }
        };
        void generateQr();
        return () => {
            cancelled = true;
        };
    }, [currentUrl, qrAttempt]);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!currentUrl) return;
        const button = e.currentTarget;
        if (copyTimer.current) clearTimeout(copyTimer.current);
        setCopyStatus('copying');
        try {
            if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
            await navigator.clipboard.writeText(currentUrl);
            if (!mounted.current) return;
            setCopyStatus('copied');
            triggerConfetti(button);
            copyTimer.current = setTimeout(() => setCopyStatus('idle'), 2500);
        } catch {
            if (mounted.current) setCopyStatus('error');
        }
    };

    return (
        <div
            className={`bg-white dark:bg-[#1C1614] rounded-[24px] p-5 shadow-sm border border-stone-200/80 dark:border-amber-500/15 overflow-hidden relative group transition-all duration-300 hover:shadow-md ${className}`}
        >
            {/* Ambient Glow */}
            <div
                className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 transition-colors ${
                    isIntegracao ? 'bg-sky-500/30' : 'bg-amber-500/30'
                }`}
            />

            {/* Header com ícone e badge */}
            <div className="flex items-center justify-between mb-3.5 relative z-10">
                <div className="flex items-center gap-2.5">
                    <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${
                            isIntegracao
                                ? 'bg-sky-500/10 text-sky-500 border-sky-500/20'
                                : 'bg-amber-500/10 text-[#C85A32] dark:text-amber-400 border-amber-500/20'
                        }`}
                    >
                        <Smartphone size={18} />
                    </div>
                    <div>
                        <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">
                            {t('Leve no Celular', 'Take it on Mobile', 'Llévalo en tu Móvil')}
                        </h4>
                        <p className="text-[10px] text-stone-500 dark:text-stone-400 font-sans">
                            {t(
                                'Guia de Bolso On-the-Go',
                                'On-the-Go Pocket Guide',
                                'Guía de Bolsillo'
                            )}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isIntegracao
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                >
                    <QrCode size={10} />
                    QR CODE
                </span>
            </div>

            {/* Bloco Central com QR Code e instrução */}
            <div className="flex flex-col items-center text-center p-3.5 rounded-2xl bg-stone-50 dark:bg-[#241C19]/80 border border-stone-200/60 dark:border-amber-500/15 mb-3.5 relative z-10">
                <div className="p-2.5 bg-white rounded-xl shadow-md border border-stone-200/80 mb-2.5 group-hover:scale-102 transition-transform">
                    {qrCodeUrl ? (
                        <img
                            src={qrCodeUrl}
                            alt={t(
                                'QR Code do guia do hóspede',
                                'Guest guide QR code',
                                'Código QR de la guía del huésped'
                            )}
                            width={140}
                            height={140}
                            className="block rounded-lg"
                            loading="lazy"
                        />
                    ) : qrFailed ? (
                        <div className="w-[140px] min-h-[140px] flex flex-col items-center justify-center gap-3 p-2 text-stone-700">
                            <p role="status" className="text-xs leading-relaxed">
                                {t(
                                    'Não foi possível gerar o QR Code.',
                                    'Could not generate the QR code.',
                                    'No se pudo generar el código QR.'
                                )}
                            </p>
                            {currentUrl && (
                                <button
                                    type="button"
                                    className="text-xs font-bold underline underline-offset-4 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                                    onClick={() => {
                                        setQr({ forUrl: '', dataUrl: '', error: false });
                                        setQrAttempt((attempt) => attempt + 1);
                                    }}
                                >
                                    {t('Tentar novamente', 'Try again', 'Volver a intentar')}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            role="status"
                            className="w-[140px] h-[140px] bg-stone-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-stone-600 text-center p-3"
                        >
                            {t('Gerando QR Code…', 'Generating QR code…', 'Generando código QR…')}
                        </div>
                    )}
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-medium max-w-[240px]">
                    {t(
                        'Aponte a câmera do celular para ter o guia e as senhas na palma da mão.',
                        'Point your phone camera to have the guide and passwords in your pocket.',
                        'Apunta con la cámara de tu móvil para tener la guía en la palma de tu mano.'
                    )}
                </p>
            </div>

            {/* Botão de Copiar Link Direto */}
            <button
                type="button"
                onClick={handleCopy}
                disabled={!currentUrl || copyStatus === 'copying'}
                aria-label={t('Copiar link do guia', 'Copy guide link', 'Copiar enlace de la guía')}
                aria-describedby={copyStatus === 'error' ? copyErrorId : undefined}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold font-sans uppercase tracking-wide flex items-center justify-center gap-2 border transition-all active:scale-[0.98] shadow-sm relative z-10 ${
                    copied
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-emerald-900/20'
                        : isIntegracao
                          ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300/60 dark:border-sky-500/30 hover:bg-sky-100/70 dark:hover:bg-sky-900/40'
                          : 'bg-amber-50 dark:bg-white/5 text-[#C85A32] dark:text-amber-300 border-amber-200/80 dark:border-amber-500/25 hover:bg-amber-100/70 dark:hover:bg-white/10'
                }`}
            >
                {copied ? (
                    <>
                        <Check size={14} strokeWidth={2.5} />
                        <span>{t('Link Copiado!', 'Link Copied!', '¡Enlace Copiado!')}</span>
                    </>
                ) : copyStatus === 'copying' ? (
                    <span>{t('Copiando…', 'Copying…', 'Copiando…')}</span>
                ) : (
                    <>
                        <Copy size={13} />
                        <span>
                            {copyStatus === 'error'
                                ? t(
                                      'Tentar copiar novamente',
                                      'Try copying again',
                                      'Volver a copiar'
                                  )
                                : t('Copiar Link do Guia', 'Copy Guide Link', 'Copiar Enlace')}
                        </span>
                    </>
                )}
            </button>
            {copyStatus === 'error' && (
                <div className="mt-3 space-y-2">
                    <p
                        id={copyErrorId}
                        role="status"
                        className="text-xs leading-relaxed text-stone-700 dark:text-stone-200"
                    >
                        {t(
                            'Não foi possível copiar. Tente novamente ou selecione o link abaixo.',
                            'Could not copy. Try again or select the link below.',
                            'No se pudo copiar. Inténtalo de nuevo o selecciona el enlace de abajo.'
                        )}
                    </p>
                    <input
                        type="text"
                        value={currentUrl}
                        readOnly
                        onFocus={(event) => event.currentTarget.select()}
                        aria-label={t(
                            'Link do guia para copiar',
                            'Guide link to copy',
                            'Enlace de la guía para copiar'
                        )}
                        className="w-full min-w-0 rounded-lg border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-100 p-2 text-xs"
                    />
                </div>
            )}
        </div>
    );
};

export default DesktopQrCard;
