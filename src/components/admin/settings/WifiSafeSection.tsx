import React from 'react';
import { Wifi, Box, Lock, Eye, EyeOff } from 'lucide-react';
import { AppConfig } from '../../../types';

interface WifiSafeSectionProps {
    localSettings: AppConfig;
    setLocalSettings: React.Dispatch<React.SetStateAction<AppConfig>>;
    showSafeCode: boolean;
    setShowSafeCode: React.Dispatch<React.SetStateAction<boolean>>;
}

const WifiSafeSection: React.FC<WifiSafeSectionProps> = ({
    localSettings,
    setLocalSettings,
    showSafeCode,
    setShowSafeCode,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wi-Fi */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                    <Wifi size={16} className="text-blue-500" /> Rede Wi-Fi
                </h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Nome (SSID)
                        </label>
                        <input
                            value={localSettings.wifiSSID}
                            onChange={(e) =>
                                setLocalSettings({ ...localSettings, wifiSSID: e.target.value })
                            }
                            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Senha
                        </label>
                        <input
                            value={localSettings.wifiPass}
                            onChange={(e) =>
                                setLocalSettings({ ...localSettings, wifiPass: e.target.value })
                            }
                            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Safe Code */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                    <Box size={16} className="text-orange-500" /> Senha do Cofre
                </h3>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Senha Atual
                    </label>
                    <div className="relative">
                        <Lock
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type={showSafeCode ? 'text' : 'password'}
                            value={localSettings.safeCode}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    safeCode: e.target.value.replace(/\D/g, ''),
                                })
                            }
                            className="w-full p-2 pl-10 pr-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-mono tracking-widest"
                        />
                        <button
                            onClick={() => setShowSafeCode(!showSafeCode)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        >
                            {showSafeCode ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                        Visível para todos os hóspedes ativos.
                    </p>
                </div>
            </div>

            {/* Default Cleaning Fee */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <span className="text-amber-500 font-extrabold text-base">✨</span> Custos
                    Adicionais: Limpeza (Valor Padrão)
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Valor cobrado por padrão ao registrar uma limpeza adicional nas reservas
                            dos Flats Integração.
                        </p>
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Valor Padrão (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={localSettings.defaultCleaningFee ?? 50}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    defaultCleaningFee: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold font-mono text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            {/* Default Laundry Fee */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 md:col-span-2">
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                    <span className="text-blue-500 font-extrabold text-base">🧺</span> Custos
                    Adicionais: Lavagem de Roupa (Valor por Ciclo)
                </h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Valor cobrado por ciclo de lavagem/secagem de roupa nas reservas dos
                            Flats Integração.
                        </p>
                    </div>
                    <div className="w-full sm:w-48">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            Valor por Ciclo (R$)
                        </label>
                        <input
                            type="number"
                            step="0.5"
                            value={localSettings.defaultLaundryFee ?? 15}
                            onChange={(e) =>
                                setLocalSettings({
                                    ...localSettings,
                                    defaultLaundryFee: parseFloat(e.target.value) || 0,
                                })
                            }
                            className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-bold font-mono text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(WifiSafeSection);
