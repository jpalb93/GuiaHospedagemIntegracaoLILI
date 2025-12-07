import React from 'react';
import { Megaphone } from 'lucide-react';
import { AppConfig } from '../../../types';

interface NoticesSectionProps {
    localSettings: AppConfig;
    setLocalSettings: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const NoticesSection: React.FC<NoticesSectionProps> = ({ localSettings, setLocalSettings }) => {
    return (
        <>
            {/* Global Notices */}
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/30">
                <h3 className="text-sm font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-2 mb-3">
                    <Megaphone size={16} /> Avisos Globais
                </h3>

                <div className="space-y-4">
                    {(['lili', 'integracao'] as const).map((pId) => {
                        const notice = localSettings.globalNotices?.[pId] || {
                            active: false,
                            text: '',
                        };

                        return (
                            <div
                                key={pId}
                                className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-yellow-200 dark:border-yellow-800/50"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold uppercase text-gray-500">
                                        {pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}
                                    </span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={notice.active}
                                            onChange={(e) => {
                                                const newNotices = {
                                                    ...localSettings.globalNotices,
                                                };
                                                newNotices[pId] = {
                                                    ...notice,
                                                    active: e.target.checked,
                                                };
                                                setLocalSettings({
                                                    ...localSettings,
                                                    globalNotices: newNotices,
                                                });
                                            }}
                                        />
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                                    </label>
                                </div>
                                <textarea
                                    value={notice.text}
                                    onChange={(e) => {
                                        const newNotices = { ...localSettings.globalNotices };
                                        newNotices[pId] = { ...notice, text: e.target.value };
                                        setLocalSettings({
                                            ...localSettings,
                                            globalNotices: newNotices,
                                        });
                                    }}
                                    placeholder={`Aviso para ${pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}...`}
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-xs outline-none focus:ring-1 focus:ring-yellow-500 min-h-[60px]"
                                    disabled={!notice.active}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Host Phones */}
            <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                <h3 className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2 mb-3">
                    <Megaphone size={16} /> Telefones de Contato (WhatsApp)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['lili', 'integracao'] as const).map((pId) => {
                        const phone = localSettings.hostPhones?.[pId] || '';

                        return (
                            <div key={pId}>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                                    {pId === 'lili' ? 'Flat da Lili' : 'Flats Integração'}
                                </label>
                                <input
                                    value={phone}
                                    onChange={(e) => {
                                        const newPhones = { ...localSettings.hostPhones };
                                        newPhones[pId] = e.target.value;
                                        setLocalSettings({
                                            ...localSettings,
                                            hostPhones: newPhones,
                                        });
                                    }}
                                    placeholder="Ex: 5587999999999"
                                    className="w-full p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default React.memo(NoticesSection);
