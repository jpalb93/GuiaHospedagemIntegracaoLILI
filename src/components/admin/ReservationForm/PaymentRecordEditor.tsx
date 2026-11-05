import { useId } from 'react';
import { Check } from 'lucide-react';
import type { PaymentMethod } from '../../../types';
import { getTodayDateStr } from '../../../utils/dateFormatting';

interface PaymentRecordEditorProps {
    title: string;
    date: string;
    setDate: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    method: PaymentMethod;
    setMethod: (value: PaymentMethod) => void;
    type: string;
    setType: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
    submitLabel: string;
    disabled?: boolean;
}

const fieldClass =
    'w-full min-h-11 rounded-xl border border-stone-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-base text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-600';
const labelClass = 'block text-sm font-semibold text-stone-700 dark:text-gray-200 mb-2';
const optionClass = 'min-h-11 rounded-xl px-3 py-2 text-sm font-bold transition-colors';

export default function PaymentRecordEditor(props: PaymentRecordEditorProps) {
    const id = useId();
    return (
        <section
            aria-labelledby={`${id}-heading`}
            className="payment-record-editor space-y-4 rounded-xl border border-emerald-600 bg-white dark:bg-gray-800 p-3 sm:p-4"
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <h4
                    id={`${id}-heading`}
                    className="text-sm font-bold text-emerald-900 dark:text-emerald-200"
                >
                    {props.title}
                </h4>
                <button
                    type="button"
                    onClick={props.onCancel}
                    className="min-h-11 rounded-lg px-3 text-sm font-semibold text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-gray-700"
                >
                    Cancelar
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <label htmlFor={`${id}-date`} className={labelClass}>
                            Data do lançamento
                        </label>
                        <button
                            type="button"
                            onClick={() => props.setDate(getTodayDateStr())}
                            className="min-h-11 px-3 text-sm font-bold text-emerald-800 dark:text-emerald-300"
                        >
                            Hoje
                        </button>
                    </div>
                    <input
                        id={`${id}-date`}
                        type="date"
                        value={props.date}
                        onChange={(event) => props.setDate(event.target.value)}
                        className={fieldClass}
                    />
                </div>
                <div>
                    <label htmlFor={`${id}-amount`} className={labelClass}>
                        Valor do lançamento (R$)
                    </label>
                    <input
                        id={`${id}-amount`}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        value={props.amount}
                        onChange={(event) => props.setAmount(event.target.value)}
                        placeholder="0,00"
                        className={fieldClass}
                    />
                </div>
            </div>
            <fieldset>
                <legend className={labelClass}>Tipo do pagamento</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                        { id: 'deposit', label: 'Sinal (parcial)' },
                        { id: 'installment', label: 'Abatimento / parcela' },
                        { id: 'full', label: 'Quitação total' },
                    ].map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={props.type === option.id}
                            onClick={() => props.setType(option.id)}
                            className={`${optionClass} ${props.type === option.id ? 'bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-gray-700 text-stone-700 dark:text-stone-200'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </fieldset>
            <fieldset>
                <legend className={labelClass}>Forma do lançamento</legend>
                <div className="grid grid-cols-2 gap-2">
                    {(
                        [
                            { id: 'pix', label: 'PIX' },
                            { id: 'card', label: 'Cartão' },
                            { id: 'money', label: 'Dinheiro' },
                            { id: 'transfer', label: 'Transferência' },
                        ] as const
                    ).map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            aria-pressed={props.method === option.id}
                            onClick={() => props.setMethod(option.id)}
                            className={`${optionClass} ${props.method === option.id ? 'bg-teal-700 text-white' : 'bg-stone-100 dark:bg-gray-700 text-stone-700 dark:text-stone-200'}`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </fieldset>
            <div>
                <label htmlFor={`${id}-notes`} className={labelClass}>
                    Observação do lançamento (opcional)
                </label>
                <input
                    id={`${id}-notes`}
                    type="text"
                    value={props.notes}
                    onChange={(event) => props.setNotes(event.target.value)}
                    className={fieldClass}
                />
            </div>
            <button
                type="button"
                onClick={props.onSubmit}
                disabled={props.disabled}
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed"
            >
                <Check size={18} aria-hidden="true" />
                {props.submitLabel}
            </button>
        </section>
    );
}
