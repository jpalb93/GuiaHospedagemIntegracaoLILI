import React, { useState } from 'react';
import { X, Wifi, Camera, User, Lock, Copy, Check, QrCode, MapPin, Bell } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';
import { GuestConfig } from '../../types';
import { PROPERTIES } from '../../config/properties';

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
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WIFI:S:${wifiSSID};T:WPA;P:${wifiPass};;`;

    return (
        <div className="fixed inset-0 bg-black/80 z-[70] flex flex-col items-center justify-center p-4 animate-fadeIn backdrop-blur-sm">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all border border-white/10 shadow-lg group"
            >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Main Card Container */}
            <div className="relative w-full max-w-sm group perspective-1000">
                {/* Glow Effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 rounded-[35px] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>

                <div className="relative bg-gray-900/90 backdrop-blur-xl w-full rounded-[32px] p-6 shadow-2xl border border-white/10 overflow-hidden">
                    {/* Holographic Shine */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-3 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                                {t('Cartão de Acesso', 'Access Card', 'Tarjeta de Acceso')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-white tracking-tight mb-1">
                            {property.name}
                        </h2>
                        <div className="flex items-center justify-center gap-2 text-white/50 text-xs font-medium">
                            <User size={12} />
                            <span>{config.guestName || t('Visitante VIP', 'VIP Guest', 'Visitante VIP')}</span>
                        </div>
                    </div>

                    {/* Main Access Code (Redesigned as "Placa") */}
                    <div className="mb-6 relative z-10 flex justify-center">
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg px-8 py-4 text-center border border-white/10 shadow-xl relative overflow-hidden min-w-[180px]">
                            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-500 to-rose-500"></div>

                            <p className="text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
                                {isIntegracao
                                    ? t('Unidade', 'Unit', 'Unidad')
                                    : config.propertyId === 'lili'
                                        ? 'Flat'
                                        : t('Senha Porta', 'Door Code', 'Código Puerta')}
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <span className="text-3xl font-mono font-bold text-white tracking-widest drop-shadow-md">
                                    {isIntegracao
                                        ? config.flatNumber
                                        : config.propertyId === 'lili'
                                            ? '304'
                                            : isPasswordReleased
                                                ? config.lockCode
                                                : '****'}
                                </span>
                                {!isIntegracao && config.propertyId !== 'lili' && (
                                    <Bell size={24} className="text-amber-500 animate-pulse" />
                                )}
                            </div>

                            {!isIntegracao && config.propertyId !== 'lili' && (
                                <p className="text-[9px] text-gray-500 font-medium mt-2 flex items-center justify-center gap-1">
                                    {t('Toque no', 'Tap on', 'Toca en')} <Bell size={10} className="text-amber-500" /> {t('após digitar a senha', 'after typing code', 'tras digitar el código')}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Secondary Codes Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-6 relative z-10">
                        {/* Door Code (if applicable) */}
                        {!isIntegracao && (
                            <button
                                onClick={() =>
                                    isPasswordReleased && handleCopy(config.lockCode || '', 'door')
                                }
                                disabled={!isPasswordReleased}
                                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-3 flex flex-col items-center transition-all group/item"
                            >
                                <div className="flex items-center gap-2 mb-1 text-gray-400 group-hover/item:text-white transition-colors">
                                    <Lock size={14} />
                                    <span className="text-[9px] uppercase tracking-widest font-bold">
                                        {t('Porta', 'Door', 'Puerta')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-mono font-bold text-white">
                                        {isPasswordReleased ? config.lockCode : '****'}
                                    </span>
                                    {isPasswordReleased && copiedField === 'door' && (
                                        <Check size={12} className="text-green-400" />
                                    )}
                                </div>
                            </button>
                        )}

                        {/* Safe Code */}
                        <button
                            onClick={() => isPasswordReleased && handleCopy(safeCode, 'safe')}
                            disabled={!isPasswordReleased}
                            className={`bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-3 flex flex-col items-center transition-all group/item ${isIntegracao ? 'col-span-2' : ''}`}
                        >
                            <div className="flex items-center gap-2 mb-1 text-gray-400 group-hover/item:text-white transition-colors">
                                <Lock size={14} />
                                <span className="text-[9px] uppercase tracking-widest font-bold">
                                    {t('Cofre', 'Safe', 'Caja Fuerte')}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-mono font-bold text-white">
                                    {isPasswordReleased ? safeCode : '****'}
                                </span>
                                {isPasswordReleased && copiedField === 'safe' && (
                                    <Check size={12} className="text-green-400" />
                                )}
                            </div>
                        </button>
                    </div>

                    {/* WiFi Section with QR Code Toggle */}
                    <div className="bg-white/5 rounded-2xl p-1 border border-white/5 relative z-10 overflow-hidden mb-4">
                        <div className="bg-black/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
                                        <Wifi size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                                            {t('Rede Wi-Fi', 'Wi-Fi Network', 'Red Wi-Fi')}
                                        </p>
                                        <p className="text-white font-bold text-sm tracking-wide">
                                            {wifiSSID}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowQrCode(!showQrCode)}
                                    className={`p-2 rounded-lg transition-all ${showQrCode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
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
                                    <p className="text-[10px] text-gray-400">
                                        {t('Escaneie para conectar', 'Scan to connect', 'Escanea para conectar')}
                                    </p>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCopy(wifiPass, 'wifi')}
                                    className="w-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-lg py-2 flex items-center justify-center gap-2 transition-all group/wifi"
                                >
                                    <span className="text-xs text-gray-400 group-hover/wifi:text-white">
                                        {t('Senha:', 'Pass:', 'Clave:')}
                                    </span>
                                    <span className="text-sm font-mono font-bold text-white">
                                        {wifiPass}
                                    </span>
                                    {copiedField === 'wifi' ? (
                                        <Check size={14} className="text-green-400" />
                                    ) : (
                                        <Copy
                                            size={14}
                                            className="text-white/30 group-hover/wifi:text-white"
                                        />
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Address Section (New) */}
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10 flex items-center gap-3">
                        <div className="bg-white/10 p-2.5 rounded-xl text-gray-300">
                            <MapPin size={18} />
                        </div>
                        <div>
                            <p className="text-[9px] text-gray-400 uppercase font-bold mb-0.5">
                                {t('Endereço', 'Address', 'Dirección')}
                            </p>
                            <p className="text-xs font-bold text-white leading-tight">{address}</p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex justify-center gap-4 relative z-10">
                        <div className="flex items-center gap-1.5 text-white/40 text-[10px] uppercase tracking-wide font-bold">
                            <Camera size={12} />
                            <span>Print Screen</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-white/30 text-xs mt-8 text-center max-w-xs font-medium">
                {t('Salve este card para acesso offline.', 'Save this card for offline access.', 'Guarda este card para acceso offline.')}
            </p>
        </div>
    );
};

export default OfflineCardModal;
