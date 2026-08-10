import React, { useState } from 'react';
import { FileStack, Loader2, CheckCircle2, AlertTriangle, SkipForward } from 'lucide-react';
import {
    currentCompetence,
    generateInvoicesBatchForCompetence,
    BatchInvoiceResult,
} from '../../services/firebase/invoices';
import { formatCompetenceLabel } from '../../utils/corporateBilling';
import { useToast } from '../../contexts/ToastContext';

const BatchBillingPanel: React.FC = () => {
    const { showSuccess, showError } = useToast();
    const [competence, setCompetence] = useState(currentCompetence());
    const [running, setRunning] = useState(false);
    const [result, setResult] = useState<BatchInvoiceResult | null>(null);

    const handleRun = async () => {
        if (
            !confirm(
                `Gerar rascunhos de fatura para todos os contratos ativos em ${formatCompetenceLabel(competence)}?`
            )
        ) {
            return;
        }
        setRunning(true);
        setResult(null);
        try {
            const res = await generateInvoicesBatchForCompetence(competence);
            setResult(res);
            if (res.created.length > 0) {
                showSuccess(
                    `${res.created.length} fatura(s) gerada(s) em rascunho — ${formatCompetenceLabel(competence)}`
                );
            } else if (res.errors.length > 0) {
                showError('Lote concluído com erros — veja o detalhe abaixo');
            } else {
                showSuccess('Nenhuma fatura nova — todas já existiam ou sem alocação');
            }
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro no lote');
        } finally {
            setRunning(false);
        }
    };

    return (
        <div className="rounded-[2rem] border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-5 sm:p-6 shadow-lg shadow-gray-200/20 dark:shadow-none">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shrink-0">
                        <FileStack size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold text-gray-900 dark:text-white font-heading">
                            Faturamento do mês (lote)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Gera rascunhos para todos os contratos ativos nesta competência. Emita e
                            baixe depois em cada conta.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <label htmlFor="batch-competence" className="sr-only">
                        Competência para faturamento em lote
                    </label>
                    <input
                        id="batch-competence"
                        type="month"
                        value={competence}
                        onChange={(e) => {
                            setCompetence(e.target.value);
                            setResult(null);
                        }}
                        className="min-h-[44px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-400"
                    />
                    <button
                        type="button"
                        disabled={running}
                        onClick={handleRun}
                        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold disabled:opacity-50 touch-manipulation"
                    >
                        {running ? (
                            <Loader2 size={14} className="animate-spin" />
                        ) : (
                            <FileStack size={14} />
                        )}
                        Gerar competência
                    </button>
                </div>
            </div>

            {result && (
                <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs animate-fadeIn">
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                        <p className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <CheckCircle2 size={14} /> {result.created.length} criadas
                        </p>
                        {result.created.slice(0, 5).map((c) => (
                            <p key={c.contractId} className="text-emerald-700/80 mt-1 truncate">
                                {c.companyName}
                            </p>
                        ))}
                        {result.created.length > 5 && (
                            <p className="text-emerald-600 mt-1">+{result.created.length - 5}…</p>
                        )}
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                        <p className="font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                            <SkipForward size={14} /> {result.skipped.length} ignoradas
                        </p>
                        {result.skipped.slice(0, 4).map((c) => (
                            <p key={c.contractId} className="text-gray-500 mt-1 truncate">
                                {c.companyName}: {c.reason}
                            </p>
                        ))}
                    </div>
                    <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40">
                        <p className="font-extrabold text-red-700 dark:text-red-300 flex items-center gap-1">
                            <AlertTriangle size={14} /> {result.errors.length} erros
                        </p>
                        {result.errors.slice(0, 4).map((c) => (
                            <p key={c.contractId} className="text-red-600 mt-1 truncate">
                                {c.companyName}: {c.message}
                            </p>
                        ))}
                        {result.errors.length === 0 && (
                            <p className="text-red-500/70 mt-1">Nenhum</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchBillingPanel;
