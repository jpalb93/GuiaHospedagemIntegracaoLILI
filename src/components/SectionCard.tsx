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
  isTrigger = false
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Determina se está aberto (controlado ou interno)
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (forceOpen && !isTrigger) {
      if (onToggle && !isOpen) {
        onToggle();
      } else if (!onToggle && !internalIsOpen) {
        setInternalIsOpen(true);
      }
    }
  }, [forceOpen, isOpen, onToggle, internalIsOpen, isTrigger]);

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else if (!isTrigger) {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 break-inside-avoid transition-all duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] relative ${isTrigger ? 'cursor-pointer active:scale-[0.98]' : ''}`}>
      <button
        onClick={handleToggle}
        className={`w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700 transition-colors group rounded-[24px] ${!isTrigger ? 'sticky top-0 z-20' : ''}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color} text-white shadow-md shadow-gray-200 dark:shadow-none group-hover:scale-105 transition-transform duration-300`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <span className="text-base sm:text-lg font-heading font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{title}</span>
        </div>

        {isTrigger ? (
          <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-full text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors">
            <ArrowRight size={18} strokeWidth={2.5} />
          </div>
        ) : (
          <ChevronDown
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            strokeWidth={3}
            size={18}
          />
        )}
      </button>

      {!isTrigger && (
        <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className="p-5 pt-0 bg-white dark:bg-gray-800 rounded-b-[24px]">
              <div className="mt-1 text-gray-600 dark:text-gray-300 leading-relaxed font-sans text-sm">
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;