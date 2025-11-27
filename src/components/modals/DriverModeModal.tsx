import React from 'react';
import { X } from 'lucide-react';

interface DriverModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

const DriverModeModal: React.FC<DriverModeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-[60] flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-50 text-white/80 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
      >
        <X size={28} />
      </button>
      
      <p className="text-gray-400 text-[10px] mb-8 uppercase tracking-[0.2em] border border-gray-700 px-4 py-1.5 rounded-full font-bold">Mostre ao Motorista</p>
      
      <h1 className="text-yellow-400 font-heading font-bold text-5xl leading-tight mb-3 tracking-tight">
        R. São José,<br/> 475B
      </h1>
      <h2 className="text-white font-heading text-3xl mb-8 font-medium">
        Centro<br/>Petrolina - PE
      </h2>

      <div className="bg-gray-900 border border-gray-700 px-6 py-4 rounded-2xl mb-12">
         <span className="text-gray-400 text-xs uppercase tracking-widest font-bold block mb-1">Complemento</span>
         <span className="text-orange-500 text-4xl font-bold font-heading tracking-widest">FLAT 304</span>
      </div>
      
      <div className="w-20 h-1 bg-gray-800 rounded-full mb-8"></div>
      
      <p className="text-gray-500 text-lg font-medium tracking-wide">Flats Integração</p>
    </div>
  );
};

export default DriverModeModal;