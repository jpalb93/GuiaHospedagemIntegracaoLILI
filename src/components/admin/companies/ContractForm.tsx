import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Company, Contract, PricingModel } from '../../../types';
import { createContract, updateContract } from '../../../services/firebase';
import { validateContractPricing } from '../../../utils/corporateValidation';
import { fieldClass, btnPrimary, btnSecondary, today } from './companyUtils';

interface ContractFormProps {
    company: Company;
    initial?: Contract;
    onCancel: () => void;
    onSaved: (id: string) => void;
    onError: (msg: string) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
    company,
    initial,
    onCancel,
    onSaved,
    onError,
}) => {
    const [pricingModel, setPricingModel] = useState<PricingModel>(
        initial?.pricingModel || 'per_unit_monthly'
    );
    const [startDate, setStartDate] = useState(initial?.startDate || today());
    const [endDate, setEndDate] = useState(initial?.endDate || '');
    const [unitMonthlyPrice, setUnitMonthlyPrice] = useState(
        initial?.unitMonthlyPrice?.toString() || ''
    );
    const [packageMonthlyPrice, setPackageMonthlyPrice] = useState(
        initial?.packageMonthlyPrice?.toString() || ''
    );
    const [nightlyPrice, setNightlyPrice] = useState(initial?.nightlyPrice?.toString() || '');
    const [billingDay, setBillingDay] = useState(initial?.billingDay?.toString() || '10');
    const [emitsNf, setEmitsNf] = useState(initial?.emitsNf ?? true);
    const [notes, setNotes] = useState(initial?.notes || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company.id) return;
        if (endDate && endDate <= startDate) {
            onError('A saída/fim deve ser posterior ao início');
            return;
        }
        const priceError = validateContractPricing({
            pricingModel,
            unitMonthlyPrice: unitMonthlyPrice ? Number(unitMonthlyPrice) : undefined,
            packageMonthlyPrice: packageMonthlyPrice ? Number(packageMonthlyPrice) : undefined,
            nightlyPrice: nightlyPrice ? Number(nightlyPrice) : undefined,
        });
        if (priceError) {
            onError(priceError);
            return;
        }
        setSaving(true);
        try {
            const payload = {
                companyId: company.id,
                companyName: company.tradeName || company.legalName,
                status: (initial?.status || 'active') as Contract['status'],
                startDate,
                endDate: endDate || undefined,
                pricingModel,
                unitMonthlyPrice: unitMonthlyPrice ? Number(unitMonthlyPrice) : undefined,
                packageMonthlyPrice: packageMonthlyPrice ? Number(packageMonthlyPrice) : undefined,
                nightlyPrice: nightlyPrice ? Number(nightlyPrice) : undefined,
                billingDay: Math.min(28, Math.max(1, Number(billingDay) || 10)),
                prorationRule: (initial?.prorationRule || 'daily') as Contract['prorationRule'],
                emitsNf,
                notes: notes.trim() || undefined,
            };
            if (initial?.id) {
                await updateContract(initial.id, payload);
                onSaved(initial.id);
            } else {
                const id = await createContract(payload);
                onSaved(id);
            }
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Erro ao salvar contrato');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 rounded-[2rem] bg-slate-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 space-y-3"
        >
            <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 font-heading uppercase tracking-wider">
                {initial ? 'Editar contrato' : 'Novo contrato comercial'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <label
                        htmlFor="contract-pricing-model"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Modelo de preço
                    </label>
                    <select
                        id="contract-pricing-model"
                        className={fieldClass}
                        value={pricingModel}
                        onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                    >
                        <option value="per_unit_monthly">Por flat / mês</option>
                        <option value="package_monthly">Pacote mensal</option>
                        <option value="per_night">Por diária</option>
                    </select>
                </div>
                <div>
                    <label
                        htmlFor="contract-billing-day"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Vencimento (dia)
                    </label>
                    <input
                        id="contract-billing-day"
                        type="number"
                        min={1}
                        max={28}
                        className={fieldClass}
                        value={billingDay}
                        onChange={(e) => setBillingDay(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor="contract-start-date"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Início *
                    </label>
                    <input
                        id="contract-start-date"
                        type="date"
                        className={fieldClass}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="contract-end-date"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Saída/fim (dia não cobrado)
                    </label>
                    <input
                        id="contract-end-date"
                        type="date"
                        className={fieldClass}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                {pricingModel === 'per_unit_monthly' && (
                    <div>
                        <label
                            htmlFor="contract-unit-price"
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Preço / flat / mês (R$)
                        </label>
                        <input
                            id="contract-unit-price"
                            type="number"
                            min={0}
                            step="0.01"
                            className={fieldClass}
                            value={unitMonthlyPrice}
                            onChange={(e) => setUnitMonthlyPrice(e.target.value)}
                        />
                    </div>
                )}
                {pricingModel === 'package_monthly' && (
                    <div>
                        <label
                            htmlFor="contract-package-price"
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Pacote mensal (R$)
                        </label>
                        <input
                            id="contract-package-price"
                            type="number"
                            min={0}
                            step="0.01"
                            className={fieldClass}
                            value={packageMonthlyPrice}
                            onChange={(e) => setPackageMonthlyPrice(e.target.value)}
                        />
                    </div>
                )}
                {pricingModel === 'per_night' && (
                    <div>
                        <label
                            htmlFor="contract-nightly-price"
                            className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                        >
                            Diária (R$)
                        </label>
                        <input
                            id="contract-nightly-price"
                            type="number"
                            min={0}
                            step="0.01"
                            className={fieldClass}
                            value={nightlyPrice}
                            onChange={(e) => setNightlyPrice(e.target.value)}
                        />
                    </div>
                )}
            </div>
            <label
                htmlFor="contract-emits-nf"
                className="flex items-center gap-2 min-h-[44px] text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
            >
                <input
                    id="contract-emits-nf"
                    type="checkbox"
                    checked={emitsNf}
                    onChange={(e) => setEmitsNf(e.target.checked)}
                    className="rounded border-gray-300 text-slate-800 focus:ring-slate-400"
                />
                Emite Nota Fiscal
            </label>
            <div>
                <label
                    htmlFor="contract-notes"
                    className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                >
                    Observações
                </label>
                <textarea
                    id="contract-notes"
                    className={`${fieldClass} min-h-[60px]`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button type="button" onClick={onCancel} className={btnSecondary}>
                    Cancelar
                </button>
                <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Salvar contrato
                </button>
            </div>
        </form>
    );
};
