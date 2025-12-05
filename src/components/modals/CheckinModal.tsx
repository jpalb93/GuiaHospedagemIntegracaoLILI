import React from 'react';
import { X, Video, Lock, Key } from 'lucide-react';
import { SAFE_VIDEO_URL } from '../../constants';

interface CheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  safeCode: string;
  lockCode?: string;
  isPasswordReleased: boolean;
  onOpenVideo: (url: string, isVertical: boolean) => void;
  propertyId?: 'lili' | 'integracao';
}

const CheckinModal: React.FC<CheckinModalProps> = ({
  isOpen,
  onClose,
  safeCode,
  lockCode,
  isPasswordReleased,
  onOpenVideo,
  propertyId = 'lili'
}) => {
  if (!isOpen) return null;

  const isIntegracao = propertyId === 'integracao';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={0}
        aria-label="Fechar modal"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose(); }}
      ></div>
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[28px] overflow-hidden shadow-2xl relative z-10 animate-scaleIn flex flex-col max-h-[90vh] border border-white/10">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-50 p-2 rounded-full backdrop-blur-md transition-colors bg-black/5 hover:bg-black/10 text-gray-600 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        <div className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white">
          <h2 className="text-xl font-heading font-bold mb-1">Jornada de Check-in</h2>
          <p className="text-orange-100 text-xs font-medium opacity-90">
            {isIntegracao ? 'Uma etapa para acessar.' : 'Duas etapas para acessar.'}
          </p>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 bg-gray-50/50 dark:bg-gray-900/50">

          {/* Passo único para Integração OU Passo 1 para Lili */}
          <div className="bg-white dark:bg-gray-700 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 font-bold shadow-sm font-heading text-base border border-orange-100 dark:border-orange-800">
                  {isIntegracao ? <Key size={20} /> : <span>1º</span>}
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 dark:text-gray-400 uppercase tracking-widest font-bold font-heading mb-0.5">
                    {isIntegracao ? 'ACESSO' : 'PORTÃO (RUA)'}
                  </p>
                  <p className="text-base font-bold text-gray-800 dark:text-white font-heading">
                    {isIntegracao ? 'Pegue as duas chaves no cofre' : 'Pegue a chave no cofre'}
                  </p>
                </div>
              </div>

              {isPasswordReleased ? (
                <div className="py-3 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5 font-bold">Senha do Cofre</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-widest font-mono notranslate">{safeCode}</p>
                </div>
              ) : (
                <div className="py-3 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center">
                  <Lock size={20} className="text-gray-400 mb-1" />
                  <p className="text-lg font-bold text-gray-400 tracking-widest font-mono">****</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Libera no dia anterior</p>
                </div>
              )}

              <button
                onClick={() => onOpenVideo(SAFE_VIDEO_URL, true)}
                className="w-full py-3 px-4 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 text-gray-600 dark:text-gray-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-500 hover:border-orange-200 transition-all shadow-sm"
              >
                <Video size={16} /> Ver Vídeo do Cofre
              </button>
            </div>
          </div>

          {/* Passo 2: Fechadura - APENAS PARA LILI */}
          {!isIntegracao && (
            <div className="bg-white dark:bg-gray-700 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm relative overflow-hidden">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-orange-50 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 font-bold shadow-sm font-heading text-base border border-orange-100 dark:border-orange-800">
                    <span>2º</span>
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 dark:text-gray-400 uppercase tracking-widest font-bold font-heading mb-0.5">PORTA DO FLAT</p>
                    <p className="text-base font-bold text-gray-800 dark:text-white font-heading">Digite a senha</p>
                  </div>
                </div>

                {isPasswordReleased ? (
                  <div className="py-4 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-center gap-3">
                      <p className="text-4xl font-bold text-gray-900 dark:text-white tracking-widest font-mono notranslate">{lockCode || '----'}</p>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium mt-2">
                      Toque no sino após digitar a senha
                    </p>
                  </div>
                ) : (
                  <div className="py-4 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center">
                    <Lock size={24} className="text-gray-400 mb-2" />
                    <p className="text-lg font-bold text-gray-400 tracking-widest font-mono">****</p>
                    <p className="text-[10px] text-gray-500 mt-1 font-medium bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">Libera no dia anterior</p>
                  </div>
                )}

                <button
                  onClick={() => onOpenVideo(SAFE_VIDEO_URL, true)}
                  className="w-full py-3 px-4 bg-orange-50 dark:bg-orange-900/30 border border-orange-100 dark:border-orange-800 text-orange-700 dark:text-orange-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-all"
                >
                  <Video size={16} /> Ver Vídeo da Fechadura
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckinModal;