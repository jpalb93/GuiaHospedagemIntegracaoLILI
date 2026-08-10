import React, { useMemo, useState } from 'react';
import {
    Building2,
    Plus,
    Loader2,
    ShieldCheck,
    Briefcase,
    Home,
    Wallet,
    Search,
    ChevronRight,
    RotateCcw,
} from 'lucide-react';
import { Company } from '../../../types';
import { unarchiveCompany, refreshCompanyOpenBalance } from '../../../services/firebase';
import { useToast } from '../../../contexts/ToastContext';
import BatchBillingPanel from '../BatchBillingPanel';
import CorporateAvailabilityQuotePanel from '../CorporateAvailabilityQuote';
import { CompanyForm } from './CompanyForm';
import { companyInitials, formatCnpj, money, statusLabel, btnPrimary } from './companyUtils';

interface CompanyListProps {
    companies: Company[];
    loading: boolean;
    onSelectCompany: (id: string) => void;
    onNewCompanySaved: (id: string) => void;
    onConvertQuote: (payload: {
        startDate: string;
        endDate: string;
        flats: string[];
        companyId?: string;
        companyLabel?: string;
        monthlyPricePerFlat?: number;
    }) => void | Promise<void>;
}

export const CompanyList: React.FC<CompanyListProps> = ({
    companies,
    loading,
    onSelectCompany,
    onNewCompanySaved,
    onConvertQuote,
}) => {
    const { showSuccess, showError } = useToast();
    const [showNewCompany, setShowNewCompany] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'delinquent'>('all');
    const [showArchived, setShowArchived] = useState(false);

    const portfolio = useMemo(() => {
        const visible = companies.filter((c) => c.status !== 'archived');
        const active = visible.filter((c) => c.status === 'active');
        const flats = visible.reduce((s, c) => s + (c.activeFlatCount || 0), 0);
        const open = visible.reduce((s, c) => s + (c.openBalance || 0), 0);
        return {
            activeCount: active.length,
            totalVisible: visible.length,
            flats,
            open,
        };
    }, [companies]);

    const filteredCompanies = useMemo(() => {
        const q = searchQuery.trim().toLowerCase().replace(/\D/g, '');
        const qText = searchQuery.trim().toLowerCase();
        return companies
            .filter((c) => (showArchived ? c.status === 'archived' : c.status !== 'archived'))
            .filter((c) => {
                if (showArchived) return true;
                if (statusFilter === 'active' && c.status !== 'active') return false;
                if (statusFilter === 'delinquent' && c.status !== 'delinquent') return false;
                return true;
            })
            .filter((c) => {
                if (!qText) return true;
                const name = `${c.tradeName || ''} ${c.legalName}`.toLowerCase();
                const cnpj = c.cnpj.replace(/\D/g, '');
                return name.includes(qText) || (q.length > 0 && cnpj.includes(q));
            })
            .sort((a, b) =>
                (a.tradeName || a.legalName).localeCompare(b.tradeName || b.legalName, 'pt-BR')
            );
    }, [companies, searchQuery, statusFilter, showArchived]);

    const archivedCount = useMemo(
        () => companies.filter((c) => c.status === 'archived').length,
        [companies]
    );

    return (
        <div className="space-y-8 animate-fadeIn pb-8">
            {/* Hero executivo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-800 to-slate-900 text-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-orange-400 font-heading mb-1">
                        <ShieldCheck size={16} /> B2B · faturamento por fatura
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
                        Contas Corporativas
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium max-w-xl">
                        Carteira de empresas, contratos e alocações — cobrança no ciclo, ocupação no
                        flat.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowNewCompany(true)}
                    className={`${btnPrimary} relative z-10 shrink-0 bg-white text-slate-900 hover:bg-gray-100 shadow-xl`}
                >
                    <Plus size={18} /> Nova conta
                </button>
            </div>

            {/* KPIs da carteira */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/20 dark:shadow-none">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Briefcase size={12} /> Contas ativas
                    </p>
                    <p className="text-3xl font-extrabold font-heading text-gray-900 dark:text-white mt-1">
                        {portfolio.activeCount}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                        {portfolio.totalVisible} na carteira
                    </p>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/20 dark:shadow-none">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Home size={12} /> Flats alocados
                    </p>
                    <p className="text-3xl font-extrabold font-heading text-blue-900 dark:text-blue-100 mt-1">
                        {portfolio.flats}
                    </p>
                    <p className="text-[11px] text-blue-500/80 mt-0.5">unidades em contrato</p>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl p-5 rounded-[2rem] border border-white/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/20 dark:shadow-none">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                        <Wallet size={12} /> Em aberto
                    </p>
                    <p className="text-3xl font-extrabold font-heading text-red-800 dark:text-red-200 mt-1">
                        R$ {money(portfolio.open)}
                    </p>
                    <p className="text-[11px] text-red-500/80 mt-0.5">saldo de faturas</p>
                </div>
            </div>

            <BatchBillingPanel />

            <CorporateAvailabilityQuotePanel companies={companies} onConvert={onConvertQuote} />

            {showNewCompany && (
                <CompanyForm
                    onCancel={() => setShowNewCompany(false)}
                    onSaved={async (id) => {
                        setShowNewCompany(false);
                        showSuccess('Empresa cadastrada');
                        onNewCompanySaved(id);
                    }}
                    onError={(msg) => showError(msg)}
                />
            )}

            {/* Busca e filtros */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por nome ou CNPJ…"
                        className="w-full min-h-[48px] pl-11 pr-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium outline-none focus:ring-2 focus:ring-slate-400 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {(
                        [
                            { id: 'all', label: 'Todas' },
                            { id: 'active', label: 'Ativas' },
                            { id: 'delinquent', label: 'Inadimplentes' },
                        ] as const
                    ).map((f) => (
                        <button
                            key={f.id}
                            type="button"
                            disabled={showArchived}
                            onClick={() => {
                                setShowArchived(false);
                                setStatusFilter(f.id);
                            }}
                            className={`min-h-[44px] px-4 rounded-full text-xs font-extrabold whitespace-nowrap transition-all touch-manipulation disabled:opacity-40 ${
                                !showArchived && statusFilter === f.id
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => setShowArchived((v) => !v)}
                        className={`min-h-[44px] px-4 rounded-full text-xs font-extrabold whitespace-nowrap transition-all touch-manipulation ${
                            showArchived
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                : 'bg-white dark:bg-gray-800 text-gray-500 border border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        Arquivadas{archivedCount > 0 ? ` (${archivedCount})` : ''}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="animate-spin text-slate-500" size={32} />
                </div>
            ) : filteredCompanies.length === 0 ? (
                <div className="rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 p-12 text-center bg-white/60 dark:bg-gray-800/40">
                    <Building2
                        className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
                        size={40}
                    />
                    <p className="text-gray-700 dark:text-gray-200 text-sm font-bold font-heading">
                        {showArchived
                            ? 'Nenhuma conta arquivada'
                            : searchQuery || statusFilter !== 'all'
                              ? 'Nenhuma conta neste filtro'
                              : 'Nenhuma conta B2B'}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
                        {showArchived
                            ? 'Contas arquivadas aparecem aqui para consulta e restauração.'
                            : searchQuery || statusFilter !== 'all'
                              ? 'Ajuste a busca ou o filtro de status.'
                              : 'Cadastre a primeira empresa para alocar vários flats sem repetir o cadastro.'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <button
                            type="button"
                            onClick={() => setShowNewCompany(true)}
                            className={`${btnPrimary} mt-5`}
                        >
                            <Plus size={16} /> Nova conta
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid gap-3">
                    {filteredCompanies.map((c) => (
                        <div
                            key={c.id}
                            className="w-full p-5 rounded-[2rem] bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl border border-white/60 dark:border-gray-700/60 shadow-lg shadow-gray-200/20 dark:shadow-none flex items-center gap-4"
                        >
                            <button
                                type="button"
                                onClick={() => onSelectCompany(c.id!)}
                                className="flex items-center gap-4 min-w-0 flex-1 text-left group hover:-translate-y-0.5 transition-all"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-md font-heading">
                                    {companyInitials(c)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-extrabold text-gray-900 dark:text-white font-heading truncate">
                                            {c.tradeName || c.legalName}
                                        </h3>
                                        <span
                                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                                c.status === 'active'
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800'
                                                    : c.status === 'delinquent'
                                                      ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/40 dark:text-red-300'
                                                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}
                                        >
                                            {statusLabel[c.status]}
                                        </span>
                                    </div>
                                    {c.tradeName && (
                                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                                            {c.legalName}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-1 font-mono">
                                        {formatCnpj(c.cnpj)}
                                    </p>
                                    <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-bold text-gray-500">
                                        <span>
                                            {c.activeFlatCount ?? 0} flat
                                            {(c.activeFlatCount ?? 0) !== 1 ? 's' : ''}
                                        </span>
                                        {(c.openBalance ?? 0) > 0 ? (
                                            <span className="text-red-600 dark:text-red-400">
                                                R$ {money(c.openBalance || 0)} em aberto
                                            </span>
                                        ) : c.status !== 'archived' ? (
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                Em dia
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                                <ChevronRight
                                    size={20}
                                    className="text-gray-300 group-hover:text-slate-600 shrink-0 transition-colors"
                                />
                            </button>
                            {c.status === 'archived' && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!c.id) return;
                                        try {
                                            await unarchiveCompany(c.id);
                                            await refreshCompanyOpenBalance(c.id);
                                            showSuccess('Conta restaurada');
                                            setShowArchived(false);
                                            onSelectCompany(c.id);
                                        } catch {
                                            showError('Não foi possível restaurar');
                                        }
                                    }}
                                    className="shrink-0 inline-flex items-center gap-1.5 min-h-[44px] px-3 rounded-2xl text-xs font-bold border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300"
                                >
                                    <RotateCcw size={14} /> Restaurar
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
