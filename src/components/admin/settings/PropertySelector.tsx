import React from 'react';
import { Home, Building } from 'lucide-react';

interface PropertySelectorProps {
    activeProperty: 'lili' | 'integracao';
    setActiveProperty: (property: 'lili' | 'integracao') => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({
    activeProperty,
    setActiveProperty,
}) => {
    return (
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
                onClick={() => setActiveProperty('lili')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeProperty === 'lili' ? 'bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                <Home size={16} /> Flat da Lili
            </button>
            <button
                onClick={() => setActiveProperty('integracao')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeProperty === 'integracao' ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
                <Building size={16} /> Flats Integração
            </button>
        </div>
    );
};

export default React.memo(PropertySelector);
