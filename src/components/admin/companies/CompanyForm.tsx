import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Company } from '../../../types';
import { createCompany, updateCompany } from '../../../services/firebase';
import { isValidCnpj } from '../../../utils/corporateValidation';
import { formatCnpj, fieldClass, btnPrimary, btnSecondary } from './companyUtils';

interface CompanyFormProps {
    initial?: Company;
    onCancel: () => void;
    onSaved: (id: string) => void;
    onError: (msg: string) => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
    initial,
    onCancel,
    onSaved,
    onError,
}) => {
    const [legalName, setLegalName] = useState(initial?.legalName || '');
    const [tradeName, setTradeName] = useState(initial?.tradeName || '');
    const [cnpj, setCnpj] = useState(initial?.cnpj ? formatCnpj(initial.cnpj) : '');
    const [billingEmail, setBillingEmail] = useState(initial?.billingEmail || '');
    const [opName, setOpName] = useState(initial?.contacts?.operational?.name || '');
    const [opPhone, setOpPhone] = useState(initial?.contacts?.operational?.phone || '');
    const [notes, setNotes] = useState(initial?.notes || '');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const digits = cnpj.replace(/\D/g, '');
        if (!isValidCnpj(digits)) {
            onError('Informe um CNPJ válido');
            return;
        }
        if (legalName.trim().length < 2) {
            onError('Informe a razão social');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                legalName: legalName.trim(),
                tradeName: tradeName.trim() || undefined,
                cnpj: digits,
                billingEmail: billingEmail.trim() || undefined,
                contacts: {
                    operational: {
                        name: opName.trim() || undefined,
                        phone: opPhone.trim() || undefined,
                    },
                },
                notes: notes.trim() || undefined,
                status: (initial?.status || 'active') as Company['status'],
            };
            if (initial?.id) {
                await updateCompany(initial.id, payload);
                onSaved(initial.id);
            } else {
                const id = await createCompany(payload);
                onSaved(id);
            }
        } catch (err) {
            onError(err instanceof Error ? err.message : 'Erro ao salvar empresa');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-[2rem] bg-white/90 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 space-y-4 shadow-xl shadow-gray-200/30 dark:shadow-none"
        >
            <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-100 uppercase tracking-wider font-heading">
                {initial ? 'Editar conta' : 'Nova conta corporativa'}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <label
                        htmlFor="company-legal-name"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Razão social *
                    </label>
                    <input
                        id="company-legal-name"
                        className={fieldClass}
                        value={legalName}
                        onChange={(e) => setLegalName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="company-trade-name"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Nome fantasia
                    </label>
                    <input
                        id="company-trade-name"
                        className={fieldClass}
                        value={tradeName}
                        onChange={(e) => setTradeName(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor="company-cnpj"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        CNPJ *
                    </label>
                    <input
                        id="company-cnpj"
                        className={fieldClass}
                        value={cnpj}
                        onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="company-billing-email"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        E-mail financeiro
                    </label>
                    <input
                        id="company-billing-email"
                        type="email"
                        className={fieldClass}
                        value={billingEmail}
                        onChange={(e) => setBillingEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label
                        htmlFor="company-operational-contact"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Contato operacional
                    </label>
                    <input
                        id="company-operational-contact"
                        className={fieldClass}
                        value={opName}
                        onChange={(e) => setOpName(e.target.value)}
                        placeholder="Nome"
                    />
                </div>
                <div>
                    <label
                        htmlFor="company-operational-phone"
                        className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                    >
                        Telefone
                    </label>
                    <input
                        id="company-operational-phone"
                        className={fieldClass}
                        value={opPhone}
                        onChange={(e) => setOpPhone(e.target.value)}
                        placeholder="(87) 9...."
                    />
                </div>
            </div>
            <div>
                <label
                    htmlFor="company-notes"
                    className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wide ml-1"
                >
                    Observações
                </label>
                <textarea
                    id="company-notes"
                    className={`${fieldClass} min-h-[72px]`}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>
            <div className="flex gap-2 justify-end pt-1">
                <button type="button" onClick={onCancel} className={btnSecondary}>
                    Cancelar
                </button>
                <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    Salvar
                </button>
            </div>
        </form>
    );
};
