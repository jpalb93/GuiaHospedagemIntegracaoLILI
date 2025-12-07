import React from 'react';
import { MessageSquare } from 'lucide-react';
import { AppConfig } from '../../../types';

interface MessageTemplatesSectionProps {
    localSettings: AppConfig;
    setLocalSettings: React.Dispatch<React.SetStateAction<AppConfig>>;
}

const MessageTemplatesSection: React.FC<MessageTemplatesSectionProps> = ({
    localSettings,
    setLocalSettings,
}) => {
    const updateTemplate = (key: 'invite' | 'checkin' | 'checkout', value: string) => {
        setLocalSettings({
            ...localSettings,
            messageTemplates: {
                ...(localSettings.messageTemplates || { checkin: '', checkout: '', invite: '' }),
                [key]: value,
            },
        });
    };

    return (
        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-3">
                <MessageSquare size={16} /> Templates de Mensagem (WhatsApp)
            </h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Convite (Boas-vindas)
                    </label>
                    <textarea
                        value={localSettings.messageTemplates?.invite || ''}
                        onChange={(e) => updateTemplate('invite', e.target.value)}
                        placeholder="Mensagem de convite..."
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Lembrete de Check-in (Véspera)
                    </label>
                    <textarea
                        value={localSettings.messageTemplates?.checkin || ''}
                        onChange={(e) => updateTemplate('checkin', e.target.value)}
                        placeholder="Mensagem de check-in..."
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Lembrete de Checkout (Véspera)
                    </label>
                    <textarea
                        value={localSettings.messageTemplates?.checkout || ''}
                        onChange={(e) => updateTemplate('checkout', e.target.value)}
                        placeholder="Mensagem de checkout..."
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    />
                </div>
                <p className="text-[10px] text-gray-400">
                    Variáveis disponíveis: {'{guestName}'}, {'{link}'}, {'{password}'}
                </p>
            </div>
        </div>
    );
};

export default React.memo(MessageTemplatesSection);
