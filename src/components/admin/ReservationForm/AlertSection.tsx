import React from 'react';
import { MessageSquare } from 'lucide-react';

interface AlertSectionProps {
    guestName: string;
    guestAlertActive: boolean;
    setGuestAlertActive: (v: boolean) => void;
    guestAlertText: string;
    setGuestAlertText: (v: string) => void;
}

const AlertSection: React.FC<AlertSectionProps> = ({
    guestName,
    guestAlertActive,
    setGuestAlertActive,
    guestAlertText,
    setGuestAlertText,
}) => {
    return (
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 space-y-3">
            <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 uppercase tracking-wider">
                    <MessageSquare size={14} /> Recado para {guestName || 'o Hóspede'}
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={guestAlertActive}
                        onChange={(e) => setGuestAlertActive(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                </label>
            </div>

            {guestAlertActive && (
                <textarea
                    value={guestAlertText}
                    onChange={(e) => setGuestAlertText(e.target.value)}
                    className="w-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/50 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm h-20 resize-none text-gray-700 dark:text-gray-200"
                    placeholder="Ex: Sua encomenda chegou na portaria."
                />
            )}
        </div>
    );
};

export default AlertSection;
