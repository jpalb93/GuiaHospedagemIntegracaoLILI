import React, { useMemo } from 'react';
import { Wifi, Smartphone } from 'lucide-react';

interface WifiQRCodeProps {
    ssid: string;
    password: string;
    size?: number;
}

/**
 * Componente que gera um QR Code para conexão WiFi automática.
 * O usuário escaneia com a câmera do celular e conecta automaticamente.
 *
 * Formato do QR Code WiFi:
 * WIFI:T:WPA;S:<SSID>;P:<PASSWORD>;;
 */
const WifiQRCode: React.FC<WifiQRCodeProps> = ({ ssid, password, size = 180 }) => {
    // Gera a string no formato WiFi QR Code
    const wifiString = useMemo(() => {
        // Escapa caracteres especiais
        const escapedSSID = ssid.replace(/[\\;,:]/g, '\\$&');
        const escapedPassword = password.replace(/[\\;,:]/g, '\\$&');
        return `WIFI:T:WPA;S:${escapedSSID};P:${escapedPassword};;`;
    }, [ssid, password]);

    // URL do Google Charts API para gerar QR Code (gratuito e confiável)
    const qrCodeUrl = useMemo(() => {
        const encodedData = encodeURIComponent(wifiString);
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}&bgcolor=ffffff&color=000000&margin=10`;
    }, [wifiString, size]);

    return (
        <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                <Wifi className="text-blue-500" size={24} />
                <span className="font-bold text-lg">Conectar ao WiFi</span>
            </div>

            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl shadow-inner">
                <img
                    src={qrCodeUrl}
                    alt={`QR Code para conectar ao WiFi ${ssid}`}
                    width={size}
                    height={size}
                    className="rounded-lg"
                    loading="lazy"
                />
            </div>

            {/* Instruções */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Smartphone size={16} />
                <span>Aponte a câmera do celular</span>
            </div>

            {/* Info da rede */}
            <div className="w-full text-center space-y-1 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-400 uppercase tracking-wider">Rede</div>
                <div className="font-mono font-bold text-gray-800 dark:text-white">{ssid}</div>
            </div>
        </div>
    );
};

export default React.memo(WifiQRCode);
