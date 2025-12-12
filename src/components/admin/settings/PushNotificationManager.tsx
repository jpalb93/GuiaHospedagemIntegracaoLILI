import React from 'react';
import { Copy, Check } from 'lucide-react';
import Button from '../../ui/Button';
import { usePushNotifications } from '../../../hooks/usePushNotifications';

export const PushNotificationManager: React.FC = () => {
    const { token, notificationPermission, requestPermission } = usePushNotifications();
    const [copied, setCopied] = React.useState(false);

    const handleCopyToken = () => {
        if (token) {
            navigator.clipboard.writeText(token);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${notificationPermission === 'granted' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        Status: {notificationPermission === 'granted' ? 'Ativo' : 'Inativo'}
                    </span>
                </div>

                {notificationPermission !== 'granted' && (
                    <Button onClick={requestPermission} size="sm" className="bg-orange-500 text-white text-xs">
                        Ativar
                    </Button>
                )}
            </div>

            {token && (
                <div className="space-y-1 animate-fadeIn">
                    <label className="text-[10px] uppercase font-bold text-gray-400">Device Token (Para Testes)</label>
                    <div className="flex gap-2">
                        <code className="text-[10px] bg-gray-100 dark:bg-black p-2 rounded border border-gray-200 dark:border-gray-700 break-all flex-1 font-mono text-gray-600 dark:text-gray-400">
                            {token}
                        </code>
                        <Button onClick={handleCopyToken} variant="icon" className="shrink-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </Button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                        Copie este token e use no Firebase Console (Cloud Messaging) para enviar um teste.
                    </p>
                </div>
            )}
        </div>
    );
};
