import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Reservation } from '../../../types';

interface DangerZoneProps {
    editingId: string | null;
    manualDeactivation: boolean;
    setManualDeactivation: (v: boolean) => void;
    handleSaveReservation: (overrides?: Partial<Reservation>) => void;
}

const DangerZone: React.FC<DangerZoneProps> = ({
    editingId,
    manualDeactivation,
    setManualDeactivation,
    handleSaveReservation,
}) => {
    const [confirmAction, setConfirmAction] = useState<'deactivate' | 'reactivate' | null>(null);

    if (!editingId) return null;

    const handleClick = () => {
        if (manualDeactivation) {
            // LOGICA DE REATIVACAO
            if (confirmAction === 'reactivate') {
                setManualDeactivation(false);
                setConfirmAction(null);
                // Pass EXPLICIT value to avoid closure/state race condition
                setTimeout(
                    () =>
                        handleSaveReservation({
                            manualDeactivation: false,
                        }),
                    100
                );
            } else {
                setConfirmAction('reactivate');
                // Auto-reset after 3s if not confirmed
                setTimeout(() => setConfirmAction(null), 3000);
            }
        } else {
            // LOGICA DE DESATIVACAO (DANGER)
            if (confirmAction === 'deactivate') {
                setManualDeactivation(true);
                setConfirmAction(null);
                // Pass EXPLICIT value to avoid closure/state race condition
                setTimeout(() => handleSaveReservation({ manualDeactivation: true }), 100);
            } else {
                setConfirmAction('deactivate');
                // Auto-reset after 3s if not confirmed
                setTimeout(() => setConfirmAction(null), 3000);
            }
        }
    };

    const getButtonStyles = () => {
        if (manualDeactivation) {
            if (confirmAction === 'reactivate') {
                return 'bg-green-500 text-white border-green-600 scale-105 shadow-md';
            }
            return 'bg-white text-green-600 border-green-200 hover:bg-green-50';
        }
        if (confirmAction === 'deactivate') {
            return 'bg-red-600 text-white border-red-700 scale-105 shadow-md animate-pulse';
        }
        return 'bg-white dark:bg-gray-800 text-red-600 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20';
    };

    const getButtonText = () => {
        if (manualDeactivation) {
            if (confirmAction === 'reactivate') {
                return 'CONFIRMAR REATIVAÇÃO?';
            }
            return 'Reativar Acesso';
        }
        if (confirmAction === 'deactivate') {
            return 'TEM CERTEZA? CLIQUE P/ CONFIRMAR';
        }
        return 'Desativar Link';
    };

    return (
        <div
            className={`p-4 rounded-2xl border transition-all ${manualDeactivation ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}
        >
            <div className="flex justify-between items-center">
                <div>
                    <h3
                        className={`text-xs font-bold uppercase flex items-center gap-2 ${manualDeactivation ? 'text-red-700 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <AlertTriangle
                            size={14}
                            className={manualDeactivation ? 'text-red-600' : 'text-gray-400'}
                        />
                        {manualDeactivation ? 'Reserva Desativada' : 'Zona de Perigo'}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[250px]">
                        {manualDeactivation
                            ? 'O link deste hóspede está bloqueado. Ele verá uma tela de "Acesso Revogado".'
                            : 'Desativar o link imediatamente (emergência) sem excluir a reserva.'}
                    </p>
                </div>
                <button
                    onClick={handleClick}
                    type="button"
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border duration-200 ${getButtonStyles()}`}
                >
                    {getButtonText()}
                </button>
            </div>
        </div>
    );
};

export default DangerZone;
