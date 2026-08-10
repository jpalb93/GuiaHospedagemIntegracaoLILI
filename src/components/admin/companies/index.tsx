import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Company, PropertyId } from '../../../types';
import {
    subscribeToCompanies,
    createContractWithAllocations,
    refreshCompanyActiveFlatCount,
} from '../../../services/firebase';
import { useToast } from '../../../contexts/ToastContext';
import { CompanyList } from './CompanyList';
import { CompanyDetail } from './CompanyDetail';
import { ContractDetail } from './ContractDetail';

type View =
    | { kind: 'list' }
    | { kind: 'company'; companyId: string }
    | { kind: 'contract'; companyId: string; contractId: string };

export const CompaniesManager: React.FC = () => {
    const { showSuccess, showError } = useToast();
    const [view, setView] = useState<View>({ kind: 'list' });
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return subscribeToCompanies((list) => {
            setCompanies(list);
            setLoading(false);
        });
    }, []);

    const handleConvertQuote = async ({
        startDate,
        endDate,
        flats,
        companyId,
        companyLabel,
        monthlyPricePerFlat,
    }: {
        startDate: string;
        endDate: string;
        flats: string[];
        companyId?: string;
        companyLabel?: string;
        monthlyPricePerFlat?: number;
    }) => {
        if (!companyId) {
            showError('Selecione uma empresa para criar o contrato');
            return;
        }
        try {
            const company = companies.find((c) => c.id === companyId);
            const name = companyLabel || company?.tradeName || company?.legalName || 'Empresa';
            const { contractId } = await createContractWithAllocations(
                {
                    companyId,
                    companyName: name,
                    status: 'active',
                    startDate,
                    endDate: endDate || undefined,
                    pricingModel: 'per_unit_monthly',
                    unitMonthlyPrice: monthlyPricePerFlat,
                    billingDay: 10,
                    prorationRule: 'daily',
                    emitsNf: true,
                    notes: `Gerado pela consulta de disponibilidade (${flats.length} flats)`,
                },
                flats.map((flatNumber) => ({
                    propertyId: 'integracao' as PropertyId,
                    flatNumber,
                    status: 'active' as const,
                    startDate,
                    endDate: endDate || undefined,
                }))
            );
            await refreshCompanyActiveFlatCount(companyId);
            showSuccess('Contrato criado e flats alocados');
            setView({ kind: 'contract', companyId, contractId });
        } catch (err) {
            showError(err instanceof Error ? err.message : 'Erro ao converter consulta');
        }
    };

    if (view.kind === 'company') {
        const company = companies.find((c) => c.id === view.companyId);
        if (!company && !loading) {
            return (
                <div className="p-6">
                    <button
                        type="button"
                        onClick={() => setView({ kind: 'list' })}
                        className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 min-h-[44px]"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>
                    <p className="mt-4 text-gray-500">Empresa não encontrada.</p>
                </div>
            );
        }
        if (!company) {
            return (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-slate-500" size={32} />
                </div>
            );
        }
        return (
            <CompanyDetail
                company={company}
                onBack={() => setView({ kind: 'list' })}
                onOpenContract={(contractId) =>
                    setView({ kind: 'contract', companyId: company.id!, contractId })
                }
                onArchived={() => setView({ kind: 'list' })}
            />
        );
    }

    if (view.kind === 'contract') {
        const company = companies.find((c) => c.id === view.companyId);
        if (!company) {
            return (
                <div className="p-6">
                    <button
                        type="button"
                        onClick={() => setView({ kind: 'list' })}
                        className="text-sm text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1 min-h-[44px]"
                    >
                        <ArrowLeft size={16} /> Voltar
                    </button>
                </div>
            );
        }
        return (
            <ContractDetail
                company={company}
                contractId={view.contractId}
                onBack={() => setView({ kind: 'company', companyId: company.id! })}
            />
        );
    }

    return (
        <CompanyList
            companies={companies}
            loading={loading}
            onSelectCompany={(companyId) => setView({ kind: 'company', companyId })}
            onNewCompanySaved={(companyId) => setView({ kind: 'company', companyId })}
            onConvertQuote={handleConvertQuote}
        />
    );
};

export default CompaniesManager;
