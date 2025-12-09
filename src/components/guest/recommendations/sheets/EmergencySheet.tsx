import React from 'react';
import { Ambulance, Flame, Shield, Phone } from 'lucide-react';
import { PlaceRecommendation } from '../../../../types';
import ExpandablePlaceList from '../ExpandablePlaceList';
import { useLanguage } from '../../../../hooks/useLanguage';

interface EmergencySheetProps {
    emergencyPlaces: PlaceRecommendation[];
}

/**
 * Conteúdo do sheet "SOS & Emergência"
 * Contém números de emergência e lista de hospitais/clínicas
 */
const EmergencySheet: React.FC<EmergencySheetProps> = ({ emergencyPlaces }) => {
    const { t } = useLanguage();

    return (
        <>
            {/* Grid de Números de Emergência */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <EmergencyButton
                    number="192"
                    label={t('SAMU', 'Ambulance', 'Ambulancia')}
                    icon={Ambulance}
                    colorClass="bg-red-500 hover:bg-red-600"
                    shadowClass="shadow-red-500/30"
                />
                <EmergencyButton
                    number="193"
                    label={t('Bombeiros', 'Firefighters', 'Bomberos')}
                    icon={Flame}
                    colorClass="bg-orange-600 hover:bg-orange-700"
                    shadowClass="shadow-orange-600/30"
                />
                <EmergencyButton
                    number="190"
                    label={t('Polícia', 'Police', 'Policía')}
                    icon={Shield}
                    colorClass="bg-blue-800 hover:bg-blue-900"
                    shadowClass="shadow-blue-800/30"
                />
                <EmergencyButton
                    number="188"
                    label={t('CVV (Vida)', 'Life Support', 'Apoyo Vital')}
                    icon={Phone}
                    colorClass="bg-teal-600 hover:bg-teal-700"
                    shadowClass="shadow-teal-600/30"
                />
            </div>

            {/* Hospitais e Clínicas */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-bold font-heading uppercase tracking-wider ml-1">
                {t('Hospitais e Clínicas', 'Hospitals & Clinics', 'Hospitales y Clínicas')}
            </p>
            <ExpandablePlaceList places={emergencyPlaces} />
        </>
    );
};

interface EmergencyButtonProps {
    number: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    colorClass: string;
    shadowClass: string;
}

const EmergencyButton: React.FC<EmergencyButtonProps> = ({
    number,
    label,
    icon: Icon,
    colorClass,
    shadowClass,
}) => (
    <a
        href={`tel:${number}`}
        className={`flex flex-col items-center justify-center p-4 ${colorClass} text-white rounded-xl shadow-lg ${shadowClass} transition-all active:scale-95 group`}
    >
        <Icon size={28} className="mb-1 group-hover:scale-110 transition-transform" />
        <span className="text-2xl font-bold font-heading leading-none">{number}</span>
        <span className="text-xs uppercase font-bold tracking-wider opacity-90">{label}</span>
    </a>
);

export default EmergencySheet;
