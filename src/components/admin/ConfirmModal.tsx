import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isDestructive = false
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDestructive ? 'bg-red-100 dark:bg-red-900/30 text-red-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'}`}>
                        <AlertTriangle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all text-sm flex items-center gap-2 ${isDestructive
                                ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
                                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
