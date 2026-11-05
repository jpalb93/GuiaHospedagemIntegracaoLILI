import React, { useState } from 'react';
import {
    X,
    Wifi,
    Camera,
    User,
    Lock,
    Copy,
    Check,
    QrCode,
    MapPin,
    Bell,
    Calendar,
} from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { GuestConfig } from '../../types';
import { PROPERTIES } from '../../config/properties';
import { getFirstName } from '../../utils/helpers';

interface OfflineCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: GuestConfig;
    wifiSSID: string;
    wifiPass: string;
    safeCode: string;
    isPasswordReleased: boolean;
    address: string;
}

const OfflineCardModal: React.FC<OfflineCardModalProps> = ({
    isOpen,
    onClose,
    config,
    wifiSSID,
    wifiPass,
    safeCode,
    isPasswordReleased,
    address,
}) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [showQrCode, setShowQrCode] = useState(false);
    const { t } = useLanguage();

    if (!isOpen) return null;

    const property = PROPERTIES[config.propertyId || 'lili'];
    const isIntegracao = config.propertyId === 'integracao';

    const handleCopy = (text: string, field: string) => {
        if (!text) return;
        if (navigator.vibrate) navigator.vibrate(40);
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatShortDate = (dateStr?: string) => {
        if (!dateStr) return '--/--';
        const parts = dateStr.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
        return dateStr;
    };

    const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;

    return (
        <div className="fixed inset-0 bg-[#0D0A09]/90 z-[70] flex flex-col items-center justify-center p-4 animate-fadeIn backdrop-blur-md">
            {/* Close Button */}
            <button
                onClick={onClose}
                aria-label="Fechar cartão offline"
                className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/15 shadow-lg group active:scale-95"
            >
                <X size={22} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Main Card Container */}
            <div className="relative w-full max-w-sm group perspective-1000">
                {/* Warm Glow Effects */}
                <div
                    className={`absolute -inset-1 rounded-[35px] blur opacity-45 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 ${
                        isIntegracao
                            ? 'bg-gradient-to-r from-sky-400 via-[#1B334B] to-amber-400'
                            : 'bg-gradient-to-r from-amber-400 via-[#C85A32] to-orange-700'
                    }`}
                ></div>

                <div
                    className={`relative backdrop-blur-xl w-full rounded-[32px] p-6 shadow-2xl border overflow-hidden ${
                        isIntegracao
                            ? 'bg-[#111922]/95 border-sky-400/20'
                            : 'bg-[#1C1614]/95 border-amber-500/20'
                    }`}
                >
                    {/* Ambient Shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <div
                        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                            isIntegracao ? 'bg-sky-500/20' : 'bg-amber-500/20'
                        }`}
                    ></div>
                    <div
                        className={`absolute -bottom-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
                            isIntegracao ? 'bg-amber-400/15' : 'bg-[#C85A32]/25'
                        }`}
                    ></div>

                    {/* Header */}
                    <div className="text-center mb-5 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-2.5 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-stone-200 uppercase tracking-widest">
                                {t(
                                    'Cartão de Acesso Offline',
                                    'Offline Access Pass',
                                    'Pase de Acceso Offline'
                                )}
                            </span>
                        </div>
                        <h2 className="text-2xl font-display font-semibold text-stone-50 tracking-tight mb-1">
                            {property.name}
                        </h2>
                        <div className="flex items-center justify-center gap-1.5 text-stone-300/80 text-xs font-medium">
                            <User size={12} className="text-amber-400" />
                            <span>
                                {getFirstName(config.guestName) ||
                                    t('Hóspede Especial', 'Special Guest', 'Huésped Especial')}
                            </span>
                        </div>
                    </div>

                    {/* Unit & Dates Row (Boarding Pass style) */}
                    <div className="grid grid-cols-3 gap-2 mb-4 relative z-10">
                        <div className="bg-black/25 rounded-2xl p-2.5 text-center border border-white/10 flex flex-col justify-center">
                            <p className="text-[9px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">
                                {t('Check-in', 'Check-in', 'Check-in')}
                            </p>
                            <p className="text-xs font-bold text-stone-100 flex items-center justify-center gap-1">
                                <Calendar size={10} className="text-amber-400" />
                                {formatShortDate(config.checkInDate)}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono">
                                {config.checkInTime || '14:00'}
                            </p>
                        </div>

                        <div className="bg-gradient-to-b from-white/10 to-white/5 rounded-2xl p-2.5 text-center border border-amber-400/30 shadow-inner relative overflow-hidden flex flex-col justify-center">
                            <div
                                className={`absolute top-0 left-0 w-full h-0.5 ${
                                    isIntegracao
                                        ? 'bg-gradient-to-r from-sky-400 to-amber-300'
                                        : 'bg-gradient-to-r from-amber-400 to-[#C85A32]'
                                }`}
                            ></div>
                            <p className="text-[9px] text-amber-300 uppercase tracking-widest font-bold mb-0.5">
                                {t('Unidade', 'Unit', 'Unidad')}
                            </p>
                            <span className="text-xl font-mono font-bold text-white tracking-wider">
                                {isIntegracao
                                    ? config.flatNumber || '---'
                                    : config.flatNumber || '304'}
                            </span>
                        </div>

                        <div className="bg-black/25 rounded-2xl p-2.5 text-center border border-white/10 flex flex-col justify-center">
                            <p className="text-[9px] text-stone-400 uppercase tracking-wider font-bold mb-0.5">
                                {t('Check-out', 'Check-out', 'Check-out')}
                            </p>
                            <p className="text-xs font-bold text-stone-100 flex items-center justify-center gap-1">
                                <Calendar size={10} className="text-amber-400" />
                                {formatShortDate(config.checkoutDate)}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono">
                                {config.checkOutTime || '11:00'}
                            </p>
                        </div>
                    </div>

                    {/* Secondary Codes Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                        {/* Safe Code (Step 1) */}
                        <button
                            onClick={() => isPasswordReleased && handleCopy(safeCode, 'safe')}
                            disabled={!isPasswordReleased}
                            className={`bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl p-3 flex flex-col items-center justify-between transition-all group/item ${isIntegracao ? 'col-span-2' : ''}`}
                        >
                            <div className="flex items-center gap-1.5 mb-1 text-stone-300 group-hover/item:text-white transition-colors">
                                <Lock size={13} className="text-amber-400" />
                                <span className="text-[10px] uppercase tracking-wider font-bold">
                                    {isIntegracao
                                        ? t('Cofre (2 Chaves)', 'Safe (2 Keys)', 'Cofre (2 Llaves)')
                                        : t(
                                              '1º Cofre (Portão)',
                                              '1st Safe (Gate)',
                                              '1º Cofre (Portón)'
                                          )}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 my-0.5">
                                <span className="text-xl font-mono font-bold text-white tracking-wider notranslate">
                                    {isPasswordReleased ? safeCode : '****'}
                                </span>
                                {isPasswordReleased && copiedField === 'safe' && (
                                    <Check size={14} className="text-emerald-400" />
                                )}
                            </div>
                            <span className="text-[10px] text-stone-400 font-medium">
                                {isIntegracao
                                    ? t(
                                          'Na entrada do prédio',
                                          'At building entrance',
                                          'En la entrada'
                                      )
                                    : t(
                                          'Chave do portão na rua',
                                          'Street gate key',
                                          'Llave del portón'
                                      )}
                            </span>
                        </button>

                        {/* Door Code (Step 2 - Lili) */}
                        {!isIntegracao && (
                            <button
                                onClick={() =>
                                    isPasswordReleased && handleCopy(config.lockCode || '', 'door')
                                }
                                disabled={!isPasswordReleased}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/30 rounded-2xl p-3 flex flex-col items-center justify-between transition-all group/item"
                            >
                                <div className="flex items-center gap-1.5 mb-1 text-stone-300 group-hover/item:text-white transition-colors">
                                    <Lock size={13} className="text-[#E07A53]" />
                                    <span className="text-[10px] uppercase tracking-wider font-bold">
                                        {t('2º Porta Flat', '2nd Flat Door', '2º Puerta Piso')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 my-0.5">
                                    <span className="text-xl font-mono font-bold text-white tracking-wider notranslate">
                                        {isPasswordReleased ? config.lockCode : '****'}
                                    </span>
                                    {isPasswordReleased && (
                                        <Bell size={16} className="text-amber-400 animate-pulse" />
                                    )}
                                    {isPasswordReleased && copiedField === 'door' && (
                                        <Check size={14} className="text-emerald-400" />
                                    )}
                                </div>
                                <span className="text-[10px] text-amber-300/90 font-medium flex items-center gap-1">
                                    {t('Toque no', 'Tap', 'Toca')}{' '}
                                    <Bell size={10} className="text-amber-400" />{' '}
                                    {t('após senha', 'after code', 'tras clave')}
                                </span>
                            </button>
                        )}
                    </div>

                    {/* WiFi Section with QR Code Toggle */}
                    <div className="bg-white/5 rounded-2xl p-1 border border-white/10 relative z-10 overflow-hidden mb-3">
                        <div className="bg-black/25 rounded-xl p-3.5">
                            <div className="flex items-center justify-between mb-2.5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`p-2 rounded-lg ${
                                            isIntegracao
                                                ? 'bg-sky-500/20 text-sky-300'
                                                : 'bg-amber-500/20 text-amber-300'
                                        }`}
                                    >
                                        <Wifi size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-stone-400 uppercase font-bold">
                                            {t('Rede Wi-Fi', 'Wi-Fi Network', 'Red Wi-Fi')}
                                        </p>
                                        <p className="text-white font-bold text-sm tracking-wide">
                                            {wifiSSID}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowQrCode(!showQrCode)}
                                    aria-label="Alternar QR Code do Wi-Fi"
                                    className={`p-2 rounded-lg transition-all ${
                                        showQrCode
                                            ? 'bg-[#C85A32] text-white shadow-lg shadow-orange-950/30'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                >
                                    <QrCode size={18} />
                                </button>
                            </div>

                            {showQrCode ? (
                                <div className="flex flex-col items-center justify-center py-2 animate-fadeIn">
                                    <div className="bg-white p-2 rounded-xl shadow-lg mb-2">
                                        <img
                                            src={wifiQrUrl}
                                            alt="WiFi QR Code"
                                            className="w-32 h-32"
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-400">
                                        {t(
                                            'Aponte a câmera para conectar',
                                            'Point camera to connect',
                                            'Apunta la cámara para conectar'
                                        )}
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCopy(wifiPass, 'wifi')}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-2 flex items-center justify-center gap-2 transition-all group/wifi"
                                >
                                    <span className="text-xs text-stone-400 group-hover/wifi:text-white">
                                        {t('Senha:', 'Pass:', 'Clave:')}
                                    </span>
                                    <span className="text-sm font-mono font-bold text-amber-100 notranslate">
                                        {wifiPass}
                                    </span>
                                    {copiedField === 'wifi' ? (
                                        <Check size={14} className="text-emerald-400" />
                                    ) : (
                                        <Copy
                                            size={14}
                                            className="text-white/40 group-hover/wifi:text-white"
                                        />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Address Section (Tap to Copy) */}
                    <button
                        type="button"
                        onClick={() => handleCopy(address, 'address')}
                        className="w-full text-left bg-white/5 hover:bg-white/10 rounded-2xl p-3.5 border border-white/10 relative z-10 flex items-center justify-between gap-3 transition-all active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="bg-white/10 p-2 rounded-xl text-amber-300 shrink-0">
                                <MapPin size={16} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[9px] text-stone-400 uppercase font-bold mb-0.5">
                                    {t('Endereço', 'Address', 'Dirección')}
                                </p>
                                <p className="text-xs font-bold text-stone-100 leading-tight truncate">
                                    {address}
                                </p>
                            </div>
                        </div>
                        <div className="shrink-0 text-stone-400">
                            {copiedField === 'address' ? (
                                <Check size={15} className="text-emerald-400" />
                            ) : (
                                <Copy size={14} />
                            )}
                        </div>
                    </button>

                    {/* Footer Actions */}
                    <div className="mt-5 flex justify-center gap-4 relative z-10">
                        <div className="inline-flex items-center gap-1.5 text-amber-300/70 text-[10px] uppercase tracking-widest font-bold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                            <Camera size={12} />
                            <span>
                                {t(
                                    'Tire um Print desta tela',
                                    'Take a Screenshot',
                                    'Toma una Captura'
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfflineCardModal;
