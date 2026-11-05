import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { IconType } from '../types';

interface SectionCardProps {
    title: string;
    icon: IconType;
    color: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
    forceOpen?: boolean;
    // Props para modo controlado (Accordion)
    isOpen?: boolean;
    onToggle?: () => void;
    // Novo prop para modo "Botão de Gaveta"
    isTrigger?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
    title,
    icon: Icon,
    color,
    children,
    defaultOpen = false,
    forceOpen = false,
    isOpen: controlledIsOpen,
    onToggle,
    isTrigger = false,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

    // Determina se está aberto (controlado ou interno)
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

    if (forceOpen && !isTrigger && !onToggle && !internalIsOpen) {
        setInternalIsOpen(true);
    }

    useEffect(() => {
        if (forceOpen && !isTrigger) {
            if (onToggle && !isOpen) {
                onToggle();
            }
        }
    }, [forceOpen, isOpen, onToggle, isTrigger]);

    const handleToggle = () => {
        if (onToggle) {
            onToggle();
        } else if (!isTrigger) {
            setInternalIsOpen(!internalIsOpen);
        }
    };

    return (
        <div
            className={`bg-white dark:bg-[#1C1614] rounded-[24px] shadow-[0_2px_10px_rgba(28,22,20,0.04)] dark:shadow-none border border-stone-200/80 dark:border-amber-500/15 break-inside-avoid transition-all duration-300 hover:shadow-[0_8px_20px_rgba(200,90,50,0.08)] hover:border-orange-300/60 dark:hover:border-amber-500/30 relative ${isTrigger ? 'cursor-pointer active:scale-[0.98]' : ''}`}
        >
            <button
                onClick={handleToggle}
                className={`w-full flex items-center justify-between p-5 text-left bg-white dark:bg-[#1C1614] active:bg-stone-50 dark:active:bg-[#241C19] transition-colors group rounded-[24px] ${!isTrigger ? 'sticky top-0 z-20' : ''}`}
            >
                <div className="flex items-center gap-4">
                    <div
                        className={`p-3 rounded-xl ${color} text-white shadow-md shadow-stone-200/80 dark:shadow-none group-hover:scale-105 transition-transform duration-300`}
                    >
                        <Icon size={20} strokeWidth={2.25} />
                    </div>
                    <span className="text-base sm:text-lg font-heading font-bold text-stone-900 dark:text-stone-100 group-hover:text-[#C85A32] dark:group-hover:text-amber-300 transition-colors">
                        {title}
                    </span>
                </div>

                {isTrigger ? (
                    <div className="bg-amber-500/10 dark:bg-amber-500/15 p-2 rounded-full text-amber-800 dark:text-amber-300 group-hover:bg-amber-500/20 transition-colors">
                        <ArrowRight size={18} strokeWidth={2.5} />
                    </div>
                ) : (
                    <ChevronDown
                        className={`text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        strokeWidth={3}
                        size={18}
                    />
                )}
            </button>

            {!isTrigger && (
                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                    <div className="overflow-hidden">
                        <div className="p-5 pt-0 bg-white dark:bg-[#1C1614] rounded-b-[24px]">
                            <div className="mt-1 text-stone-600 dark:text-stone-300 leading-relaxed font-sans text-sm">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(SectionCard);
