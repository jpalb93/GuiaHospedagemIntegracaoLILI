import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
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
    children,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsVisible(true);
            requestAnimationFrame(() => setIsAnimating(true));
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => {
                setIsVisible(false);
                document.body.style.overflow = '';
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const sheetContent = (
        <div className="fixed inset-0 z-[130] flex items-end justify-center sm:items-center pointer-events-none">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-stone-950/65 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={`
          bg-[#FAF7F2] dark:bg-[#181311] w-full max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-5xl sm:rounded-2xl lg:rounded-3xl rounded-t-[32px] shadow-2xl border-t sm:border border-stone-200/80 dark:border-amber-500/20
          transform transition-transform duration-300 ease-out pointer-events-auto
          max-h-[88vh] flex flex-col
          ${isAnimating ? 'translate-y-0 sm:scale-100' : 'translate-y-full sm:scale-95 sm:translate-y-0 sm:opacity-0'}
        `}
            >
                {/* Handle Bar (Mobile only) */}
                <div
                    className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-pointer"
                    onClick={onClose}
                >
                    <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full" />
                </div>

                {/* Header */}
                <div className="px-6 py-4 lg:px-8 lg:py-5 flex items-center justify-between border-b border-stone-200/70 dark:border-stone-800 shrink-0">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className="p-2 lg:p-2.5 rounded-xl bg-orange-100/80 dark:bg-amber-500/15 text-[#C85A32] dark:text-amber-400">
                                <Icon size={20} className="lg:w-5 lg:h-5" />
                            </div>
                        )}
                        <h3 className="text-lg lg:text-xl font-display font-semibold text-stone-900 dark:text-stone-50">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Fechar"
                        className="p-2 rounded-full hover:bg-stone-200/60 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content com padding inferior para rolagem confortável */}
                <div className="p-5 sm:p-6 lg:p-8 pb-16 sm:pb-8 overflow-y-auto overscroll-contain">
                    {children}
                </div>
            </div>
        </div>
    );

    return typeof document !== 'undefined'
        ? ReactDOM.createPortal(sheetContent, document.body)
        : null;
};

export default BottomSheet;
