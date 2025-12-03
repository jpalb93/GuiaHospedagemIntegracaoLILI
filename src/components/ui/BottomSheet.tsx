import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { IconType } from '../../types';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: IconType;
    children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    title,
    icon: Icon,
    children
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Pequeno delay para permitir que o navegador renderize antes de animar
            requestAnimationFrame(() => setIsAnimating(true));
            document.body.style.overflow = 'hidden'; // Bloqueia scroll do fundo
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = ''; // Libera scroll
            }, 300); // Tempo da animação
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`
          bg-white dark:bg-gray-900 w-full max-w-lg sm:rounded-2xl rounded-t-[32px] shadow-2xl 
          transform transition-transform duration-300 ease-out pointer-events-auto
          max-h-[85vh] flex flex-col
          ${isAnimating ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:scale-95 sm:translate-y-0 sm:opacity-0'}
        `}
            >
                {/* Handle Bar (Mobile only) */}
                <div className="w-full flex justify-center pt-3 pb-1 sm:hidden" onClick={onClose}>
                    <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shrink-0">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                <Icon size={20} />
                            </div>
                        )}
                        <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto overscroll-contain">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BottomSheet;
