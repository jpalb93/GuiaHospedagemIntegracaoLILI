import React, { useState, useEffect, useCallback } from 'react';
import {
    X,
    Shirt,
    FileText,
    Printer,
    Plus,
    Trash2,
    Calendar,
    FileEdit,
    AlertTriangle,
} from 'lucide-react';
import {
    LaundryRecord,
    LaundryPaymentStatus,
    LaundryType,
    PropertyId,
    Reservation,
} from '../../types';
import { PROPERTIES } from '../../config/properties';
import LaundryReport from './LaundryReport';

interface LaundryModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation?: Reservation | null;
    defaultFee?: number;
    propertyId?: PropertyId;
    onSaveLaundries?: (reservationId: string, laundries: LaundryRecord[]) => Promise<void> | void;
}

const LAUNDRY_TYPES: { id: LaundryType; label: string }[] = [
    { id: 'wash', label: 'Lavagem Simples (Ciclo de Lavagem)' },
    { id: 'dry', label: 'Secagem (Ciclo de Secadora)' },
    { id: 'wash_and_dry', label: 'Lavagem e Secagem Completa' },
    { id: 'custom', label: 'Outro (Especificar nas observações)' },
];

const PAYMENT_STATUS_OPTIONS: { id: LaundryPaymentStatus; label: string }[] = [
    { id: 'paid', label: 'Pago na hora (Dinheiro/PIX)' },
    { id: 'pending', label: 'Pendente (A cobrar)' },
    { id: 'billed_corporate', label: 'Fatura Corporativa (A cobrar da empresa)' },
    { id: 'courtesy', label: 'Cortesia (Sem cobrança)' },
];

const LaundryModal: React.FC<LaundryModalProps> = ({
    isOpen,
    onClose,
    reservation,
    defaultFee = 15,
    propertyId = 'integracao',
    onSaveLaundries,
}) => {
    const [step, setStep] = useState<'records' | 'report'>('records');
    const [laundries, setLaundries] = useState<LaundryRecord[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const getCurrentTimeStr = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Form fields for adding/editing a laundry record
    const [isAdding, setIsAdding] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(getCurrentTimeStr());
    const [cyclesCount, setCyclesCount] = useState<number>(1);
    const [type, setType] = useState<LaundryType>('wash');
    const [cost, setCost] = useState<number>(defaultFee);
    const [paymentStatus, setPaymentStatus] = useState<LaundryPaymentStatus>('pending');
    const [notes, setNotes] = useState('');

    const resetForm = useCallback(() => {
        setDate(new Date().toISOString().split('T')[0]);
        setTime(getCurrentTimeStr());
        setCyclesCount(1);
        setType('wash');
        setCost(defaultFee);
        setPaymentStatus('pending');
        setNotes('');
        setEditingRecordId(null);
    }, [defaultFee]);

    useEffect(() => {
        if (!isOpen) return;
        setLaundries(reservation?.laundries || []);
        setStep('records');
        setIsAdding(false);
        setEditingRecordId(null);
        setDeletingId(null);
        setSaveSuccess(false);
        resetForm();
    }, [isOpen, reservation, resetForm]);

    if (!isOpen || !reservation) return null;

    const currentProp = PROPERTIES[propertyId] || PROPERTIES['integracao'];
    const companyInfo = {
        name: currentProp.companyInfo?.name || currentProp.name || 'Flats Integração',
        address: currentProp.companyInfo?.address || currentProp.address || 'Petrolina - PE',
        logo:
            currentProp.companyInfo?.logo ||
            currentProp.assets?.heroImage ||
            '/assets/flats-integracao-logo.png',
    };

    const totalAdditionalCost = laundries.reduce((sum, item) => sum + (item.cost || 0), 0);
    const totalCycles = laundries.reduce((sum, item) => sum + (item.cyclesCount || 1), 0);

    const handleCyclesChange = (newCycles: number) => {
        const validCycles = Math.max(1, newCycles);
        setCyclesCount(validCycles);
        setCost(validCycles * defaultFee);
    };

    const handleSaveRecord = () => {
        const selectedTypeObj = LAUNDRY_TYPES.find((t) => t.id === type);
        const typeLabel = selectedTypeObj ? selectedTypeObj.label : 'Lavagem Simples';

        if (editingRecordId) {
            // Edit existing
            setLaundries((prev) =>
                prev.map((l) =>
                    l.id === editingRecordId
                        ? {
                              ...l,
                              date,
                              time,
                              cyclesCount: Number(cyclesCount) || 1,
                              type,
                              typeLabel,
                              cost: Number(cost) || 0,
                              paymentStatus,
                              notes: notes.trim(),
                          }
                        : l
                )
            );
        } else {
            // Add new
            const newRecord: LaundryRecord = {
                id: `laundry_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                date,
                time,
                cyclesCount: Number(cyclesCount) || 1,
                type,
                typeLabel,
                cost: Number(cost) || 0,
                paymentStatus,
                notes: notes.trim(),
                createdAt: new Date().toISOString(),
            };
            setLaundries((prev) => [...prev, newRecord]);
        }

        setIsAdding(false);
        resetForm();
    };

    const handleStartEdit = (record: LaundryRecord) => {
        setEditingRecordId(record.id);
        setDate(record.date || new Date().toISOString().split('T')[0]);
        setTime(record.time || '');
        setCyclesCount(record.cyclesCount || 1);
        setType((record.type as LaundryType) || 'wash');
        setCost(record.cost ?? (record.cyclesCount || 1) * defaultFee);
        setPaymentStatus(record.paymentStatus || 'pending');
        setNotes(record.notes || '');
        setIsAdding(true);
    };

    const handleDeleteRecord = (id: string) => {
        setDeletingId(id);
    };

    const handlePersistLaundries = async () => {
        if (!reservation.id || !onSaveLaundries) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await onSaveLaundries(reservation.id, laundries);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar lavanderia:', error);
            alert('Erro ao salvar no banco de dados. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrintReport = () => {
        const reportContent = document.getElementById('laundry-report-content');
        if (!reportContent) return;

        document.getElementById('laundry-print-frame')?.remove();

        const printFrame = document.createElement('iframe');
        printFrame.id = 'laundry-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);

        const frameDoc = printFrame.contentWindow?.document;
        if (!frameDoc) return;

        const tailwindStyles = Array.from(
            document.querySelectorAll('style, link[rel="stylesheet"]')
        )
            .map((el) => el.outerHTML)
            .join('\n');

        frameDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Relatório de Lavanderia - ${reservation.guestName}</title>
                ${tailwindStyles}
                <style>
                @media print {
                    body { margin: 0; padding: 20px; background: white !important; color: black !important; }
                    #laundry-report-content { width: 100% !important; max-width: 100% !important; margin: 0 !important; box-shadow: none !important; }
                }
                </style>
            </head>
            <body className="bg-white">
                ${reportContent.outerHTML}
            </body>
            </html>
        `);
        frameDoc.close();

        setTimeout(() => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[92vh]">
                {/* MODAL HEADER */}
                <div className="bg-stone-900 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30">
                            <Shirt size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 font-heading">
                                    Custos Adicionais
                                </span>
                                {reservation.flatNumber && (
                                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                                        Flat {reservation.flatNumber}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold font-heading">
                                Lavagem de Roupa - {reservation.guestName}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* MODAL TABS */}
                <div className="bg-gray-100 dark:bg-gray-800/80 px-6 py-2 border-b border-gray-200 dark:border-gray-700/60 flex items-center justify-between shrink-0 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setStep('records')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 cursor-pointer ${
                                step === 'records'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Shirt size={14} /> Histórico ({laundries.length} registros ·{' '}
                            {totalCycles} ciclos)
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('report')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 cursor-pointer ${
                                step === 'report'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FileText size={14} /> Relatório Imprimível
                        </button>
                    </div>

                    {step === 'report' && laundries.length > 0 && (
                        <button
                            type="button"
                            onClick={handlePrintReport}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-sm font-heading cursor-pointer"
                        >
                            <Printer size={14} /> Imprimir / PDF
                        </button>
                    )}
                </div>

                {/* BODY CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                    {step === 'records' ? (
                        <div className="space-y-6">
                            {/* TOP ACTION & SUMMARY BAR */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 p-4 sm:p-5 rounded-2xl">
                                <div>
                                    <h3 className="text-xs uppercase font-extrabold tracking-wider text-blue-900 dark:text-blue-300 font-heading">
                                        Resumo de Lavanderia
                                    </h3>
                                    <p className="text-xs text-stone-600 dark:text-gray-400 mt-0.5">
                                        Valor padrão: <strong>R$ 15,00 por ciclo</strong>
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-left sm:text-right">
                                        <span className="text-xs text-gray-500 block">
                                            Total Acumulado
                                        </span>
                                        <span className="text-xl font-extrabold font-mono text-blue-600 dark:text-blue-400">
                                            R${' '}
                                            {totalAdditionalCost.toLocaleString('pt-BR', {
                                                minimumFractionDigits: 2,
                                            })}
                                        </span>
                                    </div>

                                    {!isAdding && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                setIsAdding(true);
                                            }}
                                            className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-1.5 shadow-md font-heading cursor-pointer"
                                        >
                                            <Plus size={16} /> Nova Lavagem
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* ADD / EDIT FORM */}
                            {isAdding && (
                                <div className="bg-white dark:bg-gray-800 border-2 border-blue-500/30 rounded-2xl p-5 shadow-lg space-y-4 animate-fadeIn">
                                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-3">
                                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white font-heading flex items-center gap-2">
                                            <Shirt size={16} className="text-blue-500" />
                                            {editingRecordId
                                                ? 'Editar Lavagem'
                                                : 'Registrar Nova Lavagem'}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                resetForm();
                                            }}
                                            className="text-gray-400 hover:text-gray-600 text-xs font-bold"
                                        >
                                            Cancelar
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Date */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Data
                                            </label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                            />
                                        </div>

                                        {/* Time */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Horário
                                            </label>
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                            />
                                        </div>

                                        {/* Quantity of Cycles */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Quantidade de Ciclos
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="50"
                                                    value={cyclesCount}
                                                    onChange={(e) =>
                                                        handleCyclesChange(Number(e.target.value))
                                                    }
                                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                                                />
                                                <div className="flex gap-1">
                                                    {[1, 2, 3].map((c) => (
                                                        <button
                                                            type="button"
                                                            key={c}
                                                            onClick={() => handleCyclesChange(c)}
                                                            className={`px-2.5 py-2 rounded-xl text-xs font-extrabold font-heading cursor-pointer ${
                                                                cyclesCount === c
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                            }`}
                                                        >
                                                            {c}x
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Service Type */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Modalidade do Serviço
                                            </label>
                                            <select
                                                value={type}
                                                onChange={(e) =>
                                                    setType(e.target.value as LaundryType)
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                            >
                                                {LAUNDRY_TYPES.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Cost */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Valor Total (R$)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                                    R$
                                                </span>
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    value={cost}
                                                    onChange={(e) =>
                                                        setCost(Number(e.target.value))
                                                    }
                                                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-9 pr-3 text-xs font-mono font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                                />
                                            </div>
                                        </div>

                                        {/* Payment Status */}
                                        <div>
                                            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                                Status do Pagamento
                                            </label>
                                            <select
                                                value={paymentStatus}
                                                onChange={(e) =>
                                                    setPaymentStatus(
                                                        e.target.value as LaundryPaymentStatus
                                                    )
                                                }
                                                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                            >
                                                {PAYMENT_STATUS_OPTIONS.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-[11px] uppercase tracking-wider font-extrabold text-gray-500 mb-1 font-heading">
                                            Observações / Detalhes (Opcional)
                                        </label>
                                        <input
                                            type="text"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Ex: Roupas escuras, sabão especial, 2 cestos..."
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/30"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveRecord}
                                            className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-all font-heading shadow-md cursor-pointer"
                                        >
                                            {editingRecordId ? 'Atualizar' : 'Adicionar'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* LIST OF LAUNDRY RECORDS */}
                            <div className="space-y-3">
                                {laundries.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                                        <Shirt
                                            size={40}
                                            className="mx-auto text-gray-300 dark:text-gray-600 mb-2"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-bold font-heading">
                                            Nenhum registro de lavagem de roupa adicionado.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsAdding(true)}
                                            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all cursor-pointer font-heading inline-flex items-center gap-1.5"
                                        >
                                            <Plus size={14} /> Registrar primeiro ciclo
                                        </button>
                                    </div>
                                ) : (
                                    laundries.map((item) => {
                                        const typeObj = LAUNDRY_TYPES.find(
                                            (t) => t.id === item.type
                                        );
                                        const typeLabel =
                                            item.typeLabel || (typeObj ? typeObj.label : item.type);
                                        const payOption = PAYMENT_STATUS_OPTIONS.find(
                                            (p) => p.id === item.paymentStatus
                                        );
                                        const payLabel = payOption
                                            ? payOption.label
                                            : item.paymentStatus;
                                        const cycles = item.cyclesCount || 1;

                                        return (
                                            <div
                                                key={item.id}
                                                className="p-4 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-blue-500/40 transition-all"
                                            >
                                                <div className="space-y-1 min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white font-heading">
                                                            {typeLabel}
                                                        </span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-heading">
                                                            {cycles} ciclo{cycles > 1 ? 's' : ''}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider font-heading ${
                                                                item.paymentStatus === 'paid'
                                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                                                    : item.paymentStatus ===
                                                                        'billed_corporate'
                                                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                                                                      : item.paymentStatus ===
                                                                          'courtesy'
                                                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                                                                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                                            }`}
                                                        >
                                                            {payLabel}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                                        <span className="flex items-center gap-1 font-mono">
                                                            <Calendar
                                                                size={12}
                                                                className="text-blue-500"
                                                            />
                                                            {item.date
                                                                ? item.date
                                                                      .split('-')
                                                                      .reverse()
                                                                      .join('/')
                                                                : '—'}
                                                            {item.time && ` às ${item.time}`}
                                                        </span>
                                                        {item.notes && (
                                                            <span className="text-[11px] italic text-gray-400 truncate max-w-xs">
                                                                &ldquo;{item.notes}&rdquo;
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-700">
                                                    <span className="text-base font-extrabold font-mono text-gray-900 dark:text-white">
                                                        R${' '}
                                                        {(item.cost || 0).toLocaleString('pt-BR', {
                                                            minimumFractionDigits: 2,
                                                        })}
                                                    </span>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEdit(item)}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer"
                                                            title="Editar"
                                                        >
                                                            <FileEdit size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteRecord(item.id)
                                                            }
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* INLINE DELETE CONFIRMATION */}
                                                {deletingId === item.id && (
                                                    <div className="w-full mt-2 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl flex items-center justify-between gap-2 animate-fadeIn">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-300">
                                                            <AlertTriangle size={15} />
                                                            <span>
                                                                Deseja remover este registro de
                                                                lavagem?
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingId(null)}
                                                                className="px-2.5 py-1 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 rounded-lg cursor-pointer"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setLaundries((prev) =>
                                                                        prev.filter(
                                                                            (l) => l.id !== item.id
                                                                        )
                                                                    );
                                                                    setDeletingId(null);
                                                                }}
                                                                className="px-3 py-1 text-[11px] font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-lg font-heading shadow-xs cursor-pointer"
                                                            >
                                                                Excluir
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        /* STEP 2: PRINTABLE A4 REPORT */
                        <LaundryReport
                            companyInfo={companyInfo}
                            reservation={reservation}
                            laundries={laundries}
                        />
                    )}
                </div>

                {/* MODAL FOOTER */}
                <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-heading cursor-pointer"
                    >
                        Fechar
                    </button>

                    <div className="flex items-center gap-3">
                        {saveSuccess && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn font-heading">
                                ✓ Salvo com sucesso!
                            </span>
                        )}
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handlePersistLaundries}
                            className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md font-heading transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer active:scale-95"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryModal;
