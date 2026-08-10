import React, { useEffect, useState } from 'react';
import {
    ArrowLeft,
    Archive,
    FileText,
    Plus,
    ChevronRight,
    Phone,
    History,
    Loader2,
} from 'lucide-react';
import { Company, Contract, SystemLog } from '../../../types';
import {
    subscribeToContractsByCompany,
    fetchCompanyActivityLogs,
    archiveCompany,
} from '../../../services/firebase';
import { useToast } from '../../../contexts/ToastContext';
import InvoicePanel from '../InvoicePanel';
import { CompanyForm } from './CompanyForm';
import { ContractForm } from './ContractForm';
import {
    companyInitials,
    formatCnpj,
    money,
    statusLabel,
    contractStatusLabel,
    pricingLabel,
    btnPrimary,
    btnSecondary,
    btnDanger,
} from './companyUtils';

interface CompanyDetailProps {
    company: Company;
    onBack: () => void;
    onOpenContract: (contractId: string) => void;
    onArchived: () => void;
}

export const CompanyDetail: React.FC<CompanyDetailProps> = ({
    company,
    onBack,
    onOpenContract,
    onArchived,
}) => {
    const { showSuccess, showError } = useToast();
    const [editing, setEditing] = useState(false);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [showNewContract, setShowNewContract] = useState(false);
    const [activityLogs, setActivityLogs] = useState<SystemLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    useEffect(() => {
        if (!company.id) return;
        return subscribeToContractsByCompany(company.id, setContracts);
    }, [company.id]);

    useEffect(() => {
        if (!company.id) return;
        const names = [company.legalName, company.tradeName || ''].filter(Boolean);
        fetchCompanyActivityLogs(company.id, names)
            .then(setActivityLogs)
            .finally(() => setLoadingLogs(false));
    }, [company.id, company.legalName, company.tradeName, company.openBalance, company.updatedAt]);

    const activeContracts = contracts.filter((c) => c.status === 'active').length;
    const opPhone = company.contacts?.operational?.phone?.replace(/\D/g, '') || '';
    const opName = company.contacts?.operational?.name;

    const pricePreview = (ct: Contract) => {
        if (ct.unitMonthlyPrice != null) return `R$ ${money(ct.unitMonthlyPrice)}/flat`;
        if (ct.packageMonthlyPrice != null) return `Pacote R$ ${money(ct.packageMonthlyPrice)}`;
        if (ct.nightlyPrice != null) return `R$ ${money(ct.nightlyPrice)}/noite`;
        return 'Preço a definir';
    };

    return (
        <div className="space-y-8 animate-fadeIn pb-8">
            <button
                type="button"
                onClick={onBack}
                className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1.5 min-h-[44px] touch-manipulation"
            >
                <ArrowLeft size={16} /> Contas Corporativas
            </button>

            {/* Account header */}
            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="flex items-start gap-4 min-w-0">
                        <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-slate-800 to-slate-950 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-lg font-heading">
                            {companyInitials(company)}
                        </div>
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-heading tracking-tight truncate">
                                    {company.tradeName || company.legalName}
                                </h2>
                                <span
                                    className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                        company.status === 'active'
                                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300'
                                            : company.status === 'delinquent'
                                              ? 'bg-red-100 text-red-800 border border-red-200'
                                              : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {statusLabel[company.status]}
                                </span>
                            </div>
                            {company.tradeName && (
                                <p className="text-sm text-gray-500 mt-0.5">{company.legalName}</p>
                            )}
                            <p className="text-xs text-gray-400 font-mono mt-1">
                                {formatCnpj(company.cnpj)}
                            </p>
                            {opName && (
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">
                                        {opName}
                                    </span>
                                    {opPhone && (
                                        <a
                                            href={`https://wa.me/55${opPhone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                                        >
                                            <Phone size={12} /> WhatsApp
                                        </a>
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setEditing((v) => !v)}
                            className={btnSecondary}
                        >
                            {editing ? 'Fechar edição' : 'Editar'}
                        </button>
                        <button
                            type="button"
                            onClick={async () => {
                                if (!company.id) return;
                                if (!confirm('Arquivar esta empresa?')) return;
                                try {
                                    await archiveCompany(company.id);
                                    showSuccess('Empresa arquivada');
                                    onArchived();
                                } catch {
                                    showError('Não foi possível arquivar');
                                }
                            }}
                            className={btnDanger}
                        >
                            <Archive size={14} /> Arquivar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-gray-900/50 border border-slate-100 dark:border-gray-700">
                        <p className="text-[10px] font-extrabold uppercase text-slate-500">
                            Flats ativos
                        </p>
                        <p className="text-2xl font-extrabold font-heading text-gray-900 dark:text-white mt-1">
                            {company.activeFlatCount ?? 0}
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-red-50/80 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40">
                        <p className="text-[10px] font-extrabold uppercase text-red-600">
                            Em aberto
                        </p>
                        <p className="text-2xl font-extrabold font-heading text-red-800 dark:text-red-200 mt-1">
                            R$ {money(company.openBalance || 0)}
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40">
                        <p className="text-[10px] font-extrabold uppercase text-blue-600">
                            Contratos ativos
                        </p>
                        <p className="text-2xl font-extrabold font-heading text-blue-900 dark:text-blue-100 mt-1">
                            {activeContracts}
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                        <p className="text-[10px] font-extrabold uppercase text-emerald-700">
                            Contato
                        </p>
                        <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100 mt-2 truncate">
                            {opName || company.billingEmail || '—'}
                        </p>
                    </div>
                </div>
            </div>

            {editing && (
                <CompanyForm
                    initial={company}
                    onCancel={() => setEditing(false)}
                    onSaved={() => {
                        setEditing(false);
                        showSuccess('Empresa atualizada');
                    }}
                    onError={(msg) => showError(msg)}
                />
            )}

            <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-2 font-heading">
                        <FileText size={14} /> Contratos comerciais
                    </h3>
                    <button
                        type="button"
                        onClick={() => setShowNewContract(true)}
                        className={`${btnPrimary} !min-h-[44px] !px-4 !text-sm`}
                    >
                        <Plus size={14} /> Novo contrato
                    </button>
                </div>

                {showNewContract && (
                    <div className="mb-4">
                        <ContractForm
                            company={company}
                            onCancel={() => setShowNewContract(false)}
                            onSaved={(id) => {
                                setShowNewContract(false);
                                showSuccess('Contrato criado');
                                onOpenContract(id);
                            }}
                            onError={(msg) => showError(msg)}
                        />
                    </div>
                )}

                {contracts.length === 0 ? (
                    <div className="rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
                        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                            Nenhum contrato comercial
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Crie um contrato e aloque os flats desta conta.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {contracts.map((ct) => (
                            <button
                                key={ct.id}
                                type="button"
                                onClick={() => onOpenContract(ct.id!)}
                                className="text-left p-5 rounded-[1.75rem] bg-white/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 hover:border-slate-400 transition-all shadow-sm group flex items-center gap-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="font-extrabold text-sm text-gray-900 dark:text-white font-heading">
                                            {pricingLabel[ct.pricingModel]}
                                        </p>
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                                            {contractStatusLabel[ct.status]}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Início {ct.startDate.split('-').reverse().join('/')}
                                        {ct.endDate
                                            ? ` · Fim ${ct.endDate.split('-').reverse().join('/')}`
                                            : ' · Vigência aberta'}
                                    </p>
                                    <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1.5">
                                        {pricePreview(ct)} · venc. dia {ct.billingDay}
                                        {ct.emitsNf ? ' · NF' : ''}
                                    </p>
                                </div>
                                <ChevronRight
                                    size={18}
                                    className="text-gray-300 group-hover:text-slate-600 shrink-0"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {company.id && (
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none">
                    <InvoicePanel companyId={company.id} />
                </div>
            )}

            <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 border border-white/60 dark:border-gray-700/60 shadow-xl shadow-gray-200/20 dark:shadow-none">
                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider flex items-center gap-2 font-heading mb-4">
                    <History size={14} /> Histórico da conta
                </h3>
                {loadingLogs ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-slate-400" size={22} />
                    </div>
                ) : activityLogs.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        Sem registros recentes — emissões e baixas aparecem aqui.
                    </p>
                ) : (
                    <ul className="space-y-2 max-h-72 overflow-y-auto">
                        {activityLogs.slice(0, 25).map((log) => (
                            <li
                                key={log.id || `${log.timestamp}-${log.details}`}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700/50 text-xs"
                            >
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {log.details}
                                </span>
                                <span className="text-gray-400 shrink-0">
                                    {log.userEmail} ·{' '}
                                    {new Date(log.timestamp).toLocaleString('pt-BR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
