import React, { useState } from 'react';
import { X, Navigation, Copy, Check, ExternalLink, MapPin } from 'lucide-react';
import { PropertyId } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

interface DriverModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    address: string;
    propertyId?: PropertyId;
    flatNumber?: string;
}

const DriverModeModal: React.FC<DriverModeModalProps> = ({
    isOpen,
    onClose,
    address,
    propertyId = 'lili',
    flatNumber,
}) => {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const isIntegracao = propertyId === 'integracao';
    const unitDisplay = isIntegracao
        ? flatNumber
            ? `FLAT ${flatNumber}`
            : null
        : `FLAT ${flatNumber || '304'}`;
    const propertyName = isIntegracao ? 'Flats Integração' : 'Flat da Lili';

    const handleCopyAddress = () => {
        if (navigator.vibrate) navigator.vibrate(40);
        navigator.clipboard.writeText(address || 'Rua São José, 475B - Centro, Petrolina - PE');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-[#0D0A09]/95 z-[60] flex flex-col items-center justify-center p-5 text-center animate-fadeIn backdrop-blur-md">
            <button
                onClick={onClose}
                aria-label="Fechar modo motorista"
                className="absolute top-6 right-6 z-50 text-stone-200 p-3.5 bg-white/10 rounded-full hover:bg-white/20 border border-white/15 transition-all active:scale-95"
            >
                <X size={26} />
            </button>

            <div className="flex flex-col items-center animate-scaleIn w-full max-w-md bg-[#1C1614] border border-amber-500/25 rounded-[32px] p-7 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="inline-flex items-center gap-2 text-amber-300 text-xs mb-6 uppercase tracking-[0.2em] bg-amber-500/10 border border-amber-500/25 px-4 py-1.5 rounded-full font-bold">
                    <Navigation size={13} />
                    <span>
                        {t('Mostre ao Motorista', 'Show to Driver', 'Muestra al Conductor')}
                    </span>
                </div>

                <h1 className="text-amber-300 font-display font-bold text-4xl sm:text-5xl leading-tight mb-2 tracking-tight">
                    R. São José,
                    <br /> 475B
                </h1>
                <h2 className="text-stone-100 font-heading text-2xl sm:text-3xl mb-3 font-semibold">
                    Centro
                    <br />
                    Petrolina - PE
                </h2>

                <p className="text-stone-400 text-xs font-medium mb-6 flex items-center justify-center gap-1.5 bg-black/25 px-3.5 py-1.5 rounded-full border border-white/10">
                    <MapPin size={13} className="text-[#E07A53] shrink-0" />
                    <span>
                        {t(
                            'Ref: Ao lado da Av. da Integração (Monumento)',
                            'Ref: Next to Av. da Integração (Monument)',
                            'Ref: Al lado de Av. da Integração (Monumento)'
                        )}
                    </span>
                </p>

                {unitDisplay && (
                    <div className="bg-black/35 border border-amber-500/25 px-8 py-4 rounded-2xl mb-6 w-full">
                        <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold block mb-1">
                            {t('Complemento', 'Unit', 'Complemento')}
                        </span>
                        <span className="text-[#E07A53] text-3xl sm:text-4xl font-bold font-mono tracking-widest">
                            {unitDisplay}
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 w-full mb-5">
                    <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-stone-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                        {copied ? (
                            <>
                                <Check size={15} className="text-emerald-400" />
                                <span>{t('Copiado!', 'Copied!', '¡Copiado!')}</span>
                            </>
                        ) : (
                            <>
                                <Copy size={15} className="text-amber-300" />
                                <span>{t('Copiar', 'Copy', 'Copiar')}</span>
                            </>
                        )}
                    </button>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || 'Rua São José, 475B - Centro, Petrolina - PE')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#C85A32] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all active:scale-95"
                    >
                        <ExternalLink size={15} />
                        <span>Google Maps</span>
                    </a>
                </div>

                <p className="text-stone-400 text-sm font-semibold tracking-wide">{propertyName}</p>
            </div>
        </div>
    );
};

export default DriverModeModal;
