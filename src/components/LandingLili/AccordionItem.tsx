import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface AccordionItemProps {
    id?: string;
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, icon, isOpen, onClick, children }) => (
    <div className="border-b border-gray-200">
        <button onClick={onClick} className="flex justify-between items-center w-full py-5 text-left text-xl font-semibold text-gray-800 hover:text-amber-700 transition-colors">
            <span className="flex items-center gap-3">
                {icon} {title}
            </span>
            <ChevronLeft className={`transition-transform duration-300 ${isOpen ? '-rotate-90' : '-rotate-180 text-gray-400'}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="pb-5 pl-4">
                {children}
            </div>
        </div>
    </div>
);

export default AccordionItem;
