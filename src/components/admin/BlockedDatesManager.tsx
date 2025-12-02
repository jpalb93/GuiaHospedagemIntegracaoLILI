import React from 'react';
import { Ban, CalendarOff, Trash2 } from 'lucide-react';
import { BlockedDateRange } from '../../types';

interface BlockedDatesManagerProps {
    blocks: {
        blockedStartDate: string;
        setBlockedStartDate: (value: string) => void;
        blockedEndDate: string;
        setBlockedEndDate: (value: string) => void;
        blockedReason: string;
        setBlockedReason: (value: string) => void;
        isBlocking: boolean;
        handleAddBlock: () => void;
        handleDeleteBlock: (id: string) => void;
    };
    blockedDates: BlockedDateRange[];
}

const BlockedDatesManager: React.FC<BlockedDatesManagerProps> = ({ blocks, blockedDates }) => {
    const {
        blockedStartDate, setBlockedStartDate, blockedEndDate, setBlockedEndDate,
        blockedReason, setBlockedReason, isBlocking, handleAddBlock, handleDeleteBlock
    } = blocks;

    return (
        <div className="p-6 space-y-6 bg-white dark:bg-gray-800 min-h-[400px]">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-2xl border border-red-100 dark:border-red-800/30 text-center">
                <h2 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center justify-center gap-2 uppercase tracking-wide mb-2">
                    <Ban size={16} /> Bloquear Datas
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Use isso para fechar o calendário para manutenção ou uso próprio.
                    <strong> Isso não impede você de criar reservas manuais.</strong>
                </p>
                <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-[10px] text-yellow-800 dark:text-yellow-200 font-bold border border-yellow-200 dark:border-yellow-800">
                    ⚠️ Importante: No momento, esta função aplica bloqueios apenas ao "Flat da Lili".
                </div>
            </div>

            <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Início</label>
                        <input type="date" value={blockedStartDate} onChange={(e) => setBlockedStartDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">Fim</label>
                        <input type="date" value={blockedEndDate} onChange={(e) => setBlockedEndDate(e.target.value)} className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Motivo (Opcional)</label>
                    <input type="text" value={blockedReason} onChange={(e) => setBlockedReason(e.target.value)} placeholder="Ex: Manutenção do Ar" className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-2 text-sm outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <button
                    onClick={handleAddBlock}
                    disabled={isBlocking}
                    className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                    {isBlocking ? 'Bloqueando...' : 'Bloquear Período'}
                </button>
            </div>

            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Bloqueios Ativos</h3>
                {blockedDates && blockedDates.length > 0 ? (
                    <div className="space-y-2">
                        {blockedDates.map((block: BlockedDateRange) => (
                            <div key={block.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl">
                                <div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-red-700 dark:text-red-300">
                                        <CalendarOff size={14} />
                                        {block.startDate.split('-').reverse().join('/')} até {block.endDate.split('-').reverse().join('/')}
                                    </div>
                                    {block.reason && <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">{block.reason}</p>}
                                </div>
                                <button onClick={() => block.id && handleDeleteBlock(block.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-400 text-xs py-4">Nenhum bloqueio ativo.</p>
                )}
            </div>
        </div>
    );
};

export default BlockedDatesManager;
