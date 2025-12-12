import React, { useEffect, useState } from 'react';
import { SystemLog } from '../../types';
import { fetchLogs } from '../../services/firebase/logs';
import { Clock, User, FileText, Settings, Trash2, ShieldAlert, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

const ActivityLogs: React.FC = () => {
    const [logs, setLogs] = useState<SystemLog[]>([]);
    const [loading, setLoading] = useState(true);

    const loadLogs = async () => {
        setLoading(true);
        const data = await fetchLogs(50);
        setLogs(data);
        setLoading(false);
    };

    useEffect(() => {
        loadLogs();
    }, []);

    const getIcon = (action: SystemLog['action']) => {
        switch (action) {
            case 'create': return <FileText size={16} className="text-green-500" />;
            case 'update': return <RefreshCw size={16} className="text-blue-500" />;
            case 'delete': return <Trash2 size={16} className="text-red-500" />;
            case 'settings': return <Settings size={16} className="text-orange-500" />;
            case 'login': return <User size={16} className="text-purple-500" />;
            default: return <ShieldAlert size={16} className="text-gray-500" />;
        }
    };

    const formatAction = (action: string) => {
        const map: Record<string, string> = {
            create: 'Criou',
            update: 'Atualizou',
            delete: 'Excluiu',
            settings: 'Alterou Configuração',
            login: 'Login',
        };
        return map[action] || action;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">Histórico de Atividades</h2>
                <Button onClick={loadLogs} variant="ghost" size="sm" leftIcon={<RefreshCw size={14} />}>
                    Atualizar
                </Button>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Carregando histórico...</div>
                ) : logs.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Nenhuma atividade registrada.</div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex gap-4 items-start">
                            <div className="mt-1 p-2 bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-100 dark:border-gray-600">
                                {getIcon(log.action)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        <span className="font-bold">{formatAction(log.action)}</span>{' '}
                                        {log.targetName ? <span className="text-blue-600 dark:text-blue-400">{log.targetName}</span> : 'Item'}
                                    </p>
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        <Clock size={10} />
                                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                        <User size={10} /> {log.userEmail}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ActivityLogs;
