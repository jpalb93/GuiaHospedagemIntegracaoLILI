import React, { useEffect, useState } from 'react';
import { Building2 } from 'lucide-react';
import {
    Company,
    Contract,
    Allocation,
    PropertyId,
    ReservationBillingMode,
    PaymentStatus,
} from '../../../types';
import {
    subscribeToCompanies,
    subscribeToContractsByCompany,
    subscribeToAllocationsByContract,
} from '../../../services/firebase/corporate';

interface CorporateLinkSectionProps {
    billingMode: ReservationBillingMode;
    setBillingMode: (v: ReservationBillingMode) => void;
    companyId: string;
    setCompanyId: (v: string) => void;
    contractId: string;
    setContractId: (v: string) => void;
    allocationId: string;
    setAllocationId: (v: string) => void;
    setPropertyId: (v: PropertyId) => void;
    setFlatNumber: (v: string) => void;
    setPaymentStatus: (v: PaymentStatus) => void;
    setTotalAmount: (v: number | '') => void;
    setDepositAmount: (v: number | '') => void;
    setPaymentMethod: (v: '' | 'pix' | 'money' | 'card' | 'transfer') => void;
}

const CorporateLinkSection: React.FC<CorporateLinkSectionProps> = ({
    billingMode,
    setBillingMode,
    companyId,
    setCompanyId,
    contractId,
    setContractId,
    allocationId,
    setAllocationId,
    setPropertyId,
    setFlatNumber,
    setPaymentStatus,
    setTotalAmount,
    setDepositAmount,
    setPaymentMethod,
}) => {
    const isCorporate = billingMode === 'corporate';
    const [companies, setCompanies] = useState<Company[]>([]);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [allocations, setAllocations] = useState<Allocation[]>([]);

    useEffect(() => {
        return subscribeToCompanies(setCompanies);
    }, []);

    useEffect(() => {
        if (!companyId) return;
        return subscribeToContractsByCompany(companyId, (list) => {
            setContracts(list.filter((c) => c.status === 'active'));
        });
    }, [companyId]);

    useEffect(() => {
        if (!contractId) return;
        return subscribeToAllocationsByContract(contractId, (list) => {
            setAllocations(list.filter((a) => a.status === 'active'));
        });
    }, [contractId]);

    const enableCorporate = () => {
        setBillingMode('corporate');
        setPaymentStatus('billed');
        setTotalAmount('');
        setDepositAmount('');
        setPaymentMethod('');
    };

    const disableCorporate = () => {
        setBillingMode('reservation');
        setCompanyId('');
        setContractId('');
        setAllocationId('');
        setPaymentStatus('pending');
    };

    const fieldClass =
        'w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-600 rounded-2xl py-3 px-4 outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm text-gray-900 dark:text-gray-100';

    const activeCompanies = companies.filter((c) => c.status !== 'archived');

    return (
        <div className="space-y-3">
            <label
                htmlFor="reservation-is-corporate"
                className="flex items-start gap-3 min-h-[44px] p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-stone-50 dark:bg-gray-900/40 cursor-pointer"
            >
                <input
                    id="reservation-is-corporate"
                    type="checkbox"
                    checked={isCorporate}
                    onChange={(e) => (e.target.checked ? enableCorporate() : disableCorporate())}
                    className="mt-1 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <div>
                    <p className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                        <Building2 size={16} className="text-orange-500" />
                        Reserva corporativa (faturada na empresa)
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        Vincula ao contrato e flat da empresa. O valor fica na fatura mensal — não
                        entra no caixa avulso desta reserva.
                    </p>
                </div>
            </label>

            {isCorporate && (
                <div className="space-y-3 p-4 rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-950/20 animate-fadeIn">
                    <div>
                        <label
                            htmlFor="corporate-company"
                            className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1"
                        >
                            Empresa *
                        </label>
                        <select
                            id="corporate-company"
                            className={fieldClass}
                            value={companyId}
                            onChange={(e) => {
                                setCompanyId(e.target.value);
                                setContractId('');
                                setAllocationId('');
                            }}
                        >
                            <option value="">Selecione…</option>
                            {activeCompanies.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.tradeName || c.legalName}
                                </option>
                            ))}
                        </select>
                        {activeCompanies.length === 0 && (
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                                Nenhuma empresa cadastrada. Crie em Empresas no menu.
                            </p>
                        )}
                    </div>

                    {companyId && (
                        <div>
                            <label
                                htmlFor="corporate-contract"
                                className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1"
                            >
                                Contrato *
                            </label>
                            <select
                                id="corporate-contract"
                                className={fieldClass}
                                value={contractId}
                                onChange={(e) => {
                                    setContractId(e.target.value);
                                    setAllocationId('');
                                }}
                            >
                                <option value="">Selecione…</option>
                                {contracts.map((ct) => (
                                    <option key={ct.id} value={ct.id}>
                                        {ct.startDate}
                                        {ct.endDate ? ` → ${ct.endDate}` : ' (aberto)'} ·{' '}
                                        {ct.pricingModel === 'package_monthly'
                                            ? 'Pacote'
                                            : ct.pricingModel === 'per_night'
                                              ? 'Diária'
                                              : 'Por flat'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {contractId && (
                        <div>
                            <label
                                htmlFor="corporate-allocation"
                                className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1"
                            >
                                Flat do contrato *
                            </label>
                            <select
                                id="corporate-allocation"
                                className={fieldClass}
                                value={allocationId}
                                onChange={(e) => {
                                    const id = e.target.value;
                                    setAllocationId(id);
                                    const alloc = allocations.find((a) => a.id === id);
                                    if (alloc) {
                                        setPropertyId(alloc.propertyId);
                                        setFlatNumber(alloc.flatNumber || '');
                                    }
                                }}
                            >
                                <option value="">Selecione…</option>
                                {allocations.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.propertyId === 'lili'
                                            ? 'Flat da Lili'
                                            : `Flat ${a.flatNumber}`}
                                    </option>
                                ))}
                            </select>
                            {allocations.length === 0 && (
                                <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">
                                    Este contrato não tem flats ativos. Aloque em Empresas.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CorporateLinkSection;
