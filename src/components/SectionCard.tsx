import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { IconType } from '../types';

interface SectionCardProps {
  title: string;
  icon: IconType;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, color, children, defaultOpen = false, forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen && !isOpen) {
      // eslint-disable-next-line
      setIsOpen(true);
    }
  }, [forceOpen, isOpen]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden break-inside-avoid transition-all duration-300 hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700 transition-colors group"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color} text-white shadow-md shadow-gray-200 dark:shadow-none group-hover:scale-105 transition-transform duration-300`}>
            <Icon size={20} strokeWidth={2.5} />
          </div>
          <span className="text-base sm:text-lg font-heading font-bold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="text-gray-400" strokeWidth={3} size={18} /> : <ChevronDown className="text-gray-400" strokeWidth={3} size={18} />}
      </button>

      {isOpen && (
        <div className="p-5 pt-0 bg-white dark:bg-gray-800 animate-fadeIn">
          <div className="mt-1 text-gray-600 dark:text-gray-300 leading-relaxed font-sans text-sm">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionCard;