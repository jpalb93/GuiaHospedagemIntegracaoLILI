import React from 'react';
import { X, Wifi, MapPin, Camera, User, Lock } from 'lucide-react';
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
  isOpen, onClose, config, wifiSSID, wifiPass, safeCode, isPasswordReleased, address
}) => {
  if (!isOpen) return null;

  const property = PROPERTIES[config.propertyId || 'lili'];
  const isIntegracao = config.propertyId === 'integracao';

  return (
    <div className="fixed inset-0 bg-gray-900/95 z-[70] flex flex-col items-center justify-center p-6 animate-fadeIn backdrop-blur-sm">

      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2 rounded-full backdrop-blur-md transition-colors bg-white/10 hover:bg-white/20 text-white dark:bg-black/20 dark:hover:bg-black/40"
      >
        <X size={24} />
      </button>

      <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-[28px] p-6 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-amber-500"></div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-900 dark:text-white">Cartão de Acesso</h2>
          <p className="text-orange-600 dark:text-orange-400 text-xs font-bold mt-0.5 font-sans uppercase tracking-wide">{property.name}</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-500 dark:text-gray-400">
            <User size={12} />
            <span className="text-xs font-medium">{config.guestName || 'Visitante'}</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex justify-center mb-2">
            <div className="bg-gray-900 dark:bg-black text-white px-5 py-2 rounded-xl shadow-xl border border-gray-700 flex flex-col items-center min-w-[100px]">
              <span className="text-[8px] text-gray-400 uppercase tracking-[0.2em] font-bold mb-0.5">
                {isIntegracao ? 'Unidade' : (config.propertyId === 'lili' ? 'Flat' : 'Senha Porta')}
              </span>
              <span className="text-2xl font-heading font-bold text-orange-400 tracking-widest">
                {isIntegracao ? config.flatNumber : (config.propertyId === 'lili' ? '304' : (isPasswordReleased ? config.lockCode : '****'))}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/30 p-1 rounded-2xl border border-gray-100 dark:border-gray-600 mb-5">
            {isPasswordReleased ? (
              <div className={`grid ${isIntegracao ? 'grid-cols-1' : 'grid-cols-2 divide-x divide-gray-200 dark:divide-gray-600'}`}>
                {!isIntegracao && (
                  <div className="p-3 flex flex-col items-center">
                    <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Porta</span>
                    <span className="text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wider notranslate">{config.lockCode}</span>
                  </div>
                )}
                <div className="p-3 flex flex-col items-center">
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">Cofre</span>
                  <span className="text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wider notranslate">{safeCode}</span>
                </div>
              </div>
            ) : (
              <div className="py-4 flex flex-col items-center justify-center gap-1">
                <Lock size={20} className="text-gray-300 dark:text-gray-600" />
                <span className="text-[10px] text-gray-400 font-medium">Senhas disponíveis no check-in</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400"><Wifi size={18} strokeWidth={2.5} /></div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide mb-0.5">WiFi</p>
                <p className="font-bold text-gray-900 dark:text-white text-xs notranslate">{wifiSSID}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5 notranslate">Senha: {wifiPass}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-left p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600">
              <div className="bg-purple-50 dark:bg-purple-900/30 p-2.5 rounded-xl text-purple-600 dark:text-purple-400"><MapPin size={18} strokeWidth={2.5} /></div>
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wide mb-0.5">Endereço</p>
                <p className="font-bold text-gray-900 dark:text-white text-xs leading-tight notranslate">{address}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">Centro, Petrolina</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <div className="flex items-center justify-center gap-1.5 text-gray-400 dark:text-gray-500 text-[10px] uppercase tracking-wide font-bold animate-pulse">
            <Camera size={12} />
            <span>Tire um print agora</span>
          </div>
        </div>
      </div>
      <p className="text-white/50 text-xs mt-6 text-center max-w-xs font-medium leading-relaxed">Salve esta tela para acessar o flat caso fique sem internet.</p>
    </div>
  );
};

export default OfflineCardModal;