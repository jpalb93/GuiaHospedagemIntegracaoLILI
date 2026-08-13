import React, { useState, useEffect } from 'react';
import {
    X,
    Sparkles,
    FileText,
    Printer,
    Plus,
    Trash2,
    Calendar,
    User,
    FileEdit,
    AlertTriangle,
} from 'lucide-react';
import {
    CleaningRecord,
    CleaningPaymentStatus,
    CleaningType,
    PropertyId,
    Reservation,
} from '../../types';
import { PROPERTIES } from '../../config/properties';
import CleaningReport from './CleaningReport';

interface CleaningModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation?: Reservation | null;
    defaultFee?: number;
    propertyId?: PropertyId;
    onSaveCleanings?: (reservationId: string, cleanings: CleaningRecord[]) => Promise<void> | void;
}

const CLEANING_TYPES: { id: CleaningType; label: string }[] = [
    { id: 'full', label: 'Limpeza Completa' },
    { id: 'linen_change', label: 'Troca de Enxoval (Toalhas/Lençóis)' },
    { id: 'light', label: 'Limpeza Leve / Retoque' },
    { id: 'disinfection', label: 'Desinfecção / Sanitização' },
    { id: 'custom', label: 'Outro (Especificar nas observações)' },
];

const PAYMENT_STATUS_OPTIONS: { id: CleaningPaymentStatus; label: string }[] = [
    { id: 'paid', label: 'Pago na hora (Dinheiro/PIX)' },
    { id: 'pending', label: 'Pendente (A cobrar)' },
    { id: 'billed_corporate', label: 'Fatura Corporativa (A cobrar da empresa)' },
    { id: 'courtesy', label: 'Cortesia (Sem cobrança)' },
];

const CleaningModal: React.FC<CleaningModalProps> = ({
    isOpen,
    onClose,
    reservation,
    defaultFee = 50,
    propertyId = 'integracao',
    onSaveCleanings,
}) => {
    const [step, setStep] = useState<'records' | 'report'>('records');
    const [cleanings, setCleanings] = useState<CleaningRecord[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const getCurrentTimeStr = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Form fields for adding/editing a cleaning
    const [isAdding, setIsAdding] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState(getCurrentTimeStr());
    const [cleanerName, setCleanerName] = useState('');
    const [type, setType] = useState<CleaningType>('full');
    const [cost, setCost] = useState<number>(defaultFee);
    const [paymentStatus, setPaymentStatus] = useState<CleaningPaymentStatus>('pending');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!isOpen) return;
        setCleanings(reservation?.cleanings || []);
        setStep('records');
        setIsAdding(false);
        setEditingRecordId(null);
        setDeletingId(null);
        setSaveSuccess(false);
        resetForm();
    }, [isOpen, reservation, defaultFee]);

    const resetForm = () => {
        setDate(new Date().toISOString().split('T')[0]);
        setTime(getCurrentTimeStr());
        setCleanerName('');
        setType('full');
        setCost(defaultFee);
        setPaymentStatus('pending');
        setNotes('');
        setEditingRecordId(null);
    };

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

    const totalAdditionalCost = cleanings.reduce((sum, item) => sum + (item.cost || 0), 0);

    const handleSaveRecord = () => {
        const selectedTypeObj = CLEANING_TYPES.find((t) => t.id === type);
        const typeLabel = selectedTypeObj ? selectedTypeObj.label : 'Limpeza Completa';

        if (editingRecordId) {
            // Edit existing
            setCleanings((prev) =>
                prev.map((c) =>
                    c.id === editingRecordId
                        ? {
                              ...c,
                              date,
                              time,
                              cleanerName: cleanerName.trim(),
                              type,
                              typeLabel,
                              cost: Number(cost) || 0,
                              paymentStatus,
                              notes: notes.trim(),
                          }
                        : c
                )
            );
        } else {
            // Add new
            const newRecord: CleaningRecord = {
                id: `clean_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                date,
                time,
                cleanerName: cleanerName.trim(),
                type,
                typeLabel,
                cost: Number(cost) || 0,
                paymentStatus,
                notes: notes.trim(),
                createdAt: new Date().toISOString(),
            };
            setCleanings((prev) => [...prev, newRecord]);
        }

        setIsAdding(false);
        resetForm();
    };

    const handleStartEdit = (record: CleaningRecord) => {
        setEditingRecordId(record.id);
        setDate(record.date || new Date().toISOString().split('T')[0]);
        setTime(record.time || '');
        setCleanerName(record.cleanerName || '');
        setType((record.type as CleaningType) || 'full');
        setCost(record.cost ?? defaultFee);
        setPaymentStatus(record.paymentStatus || 'pending');
        setNotes(record.notes || '');
        setIsAdding(true);
    };

    const handleDeleteRecord = (id: string) => {
        setDeletingId(id);
    };

    const handlePersistCleanings = async () => {
        if (!reservation.id || !onSaveCleanings) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            await onSaveCleanings(reservation.id, cleanings);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Erro ao salvar limpezas:', error);
            alert('Erro ao salvar no banco de dados. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePrintReport = () => {
        const reportContent = document.getElementById('cleaning-report-content');
        if (!reportContent) return;

        document.getElementById('cleaning-print-frame')?.remove();

        const printFrame = document.createElement('iframe');
        printFrame.id = 'cleaning-print-frame';
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
                <title>Relatório de Limpeza - ${reservation.guestName}</title>
                ${tailwindStyles}
                <style>
                @media print {
                    body { margin: 0; padding: 20px; background: white !important; color: black !important; }
                    #cleaning-report-content { width: 100% !important; max-width: 100% !important; margin: 0 !important; box-shadow: none !important; }
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
                        <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/30">
                            <Sparkles size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 font-heading">
                                    Custos Adicionais
                                </span>
                                {reservation.flatNumber && (
                                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">
                                        Flat {reservation.flatNumber}
                                    </span>
                                )}
                            </div>
                            <h2 className="text-lg sm:text-xl font-bold font-heading">
                                Limpezas Adicionais - {reservation.guestName}
                            </h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-all"
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
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                                step === 'records'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Sparkles size={14} /> Histórico ({cleanings.length})
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep('report')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold font-heading transition-all flex items-center gap-2 ${
                                step === 'report'
                                    ? 'bg-amber-500 text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                        >
                            <FileText size={14} /> Relatório Imprimível
                        </button>
                    </div>

                    {step === 'report' && (
                        <button
                            type="button"
                            onClick={handlePrintReport}
                            className="px-4 py-2 rounded-xl text-xs font-bold font-heading bg-gray-900 text-white hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Printer size={14} /> Imprimir / Salvar PDF
                        </button>
                    )}
                </div>

                {/* MODAL BODY */}
                <div className="p-5 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {step === 'records' ? (
                        <div className="space-y-6">
                            {/* CUSTOS ADICIONAIS CARD */}
                            <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase font-extrabold tracking-wider text-amber-700 dark:text-amber-400 font-heading">
                                        Total em Custos Adicionais (Limpeza)
                                    </p>
                                    <p className="text-xs text-stone-600 dark:text-gray-300 mt-0.5 font-medium">
                                        {cleanings.length} limpeza(s) realizada(s) durante a estadia
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                                        R${' '}
                                        {totalAdditionalCost.toLocaleString('pt-BR', {
                                            minimumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>

                            {/* ADD / EDIT FORM */}
                            {isAdding ? (
                                <div className="bg-gray-50 dark:bg-gray-800/60 p-5 rounded-2xl border border-amber-500/40 shadow-inner space-y-4 animate-fadeIn">
                                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900 dark:text-white flex items-center gap-2 font-heading">
                                            <Sparkles size={16} className="text-amber-500" />
                                            {editingRecordId
                                                ? 'Editar Registro de Limpeza'
                                                : 'Adicionar Nova Limpeza'}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                resetForm();
                                            }}
                                            className="text-xs font-bold text-gray-500 hover:text-red-500"
                                        >
                                            Cancelar
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Data da Limpeza
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Horário
                                            </label>
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-mono"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Responsável / Camareira (Opcional)
                                            </label>
                                            <input
                                                type="text"
                                                value={cleanerName}
                                                onChange={(e) => setCleanerName(e.target.value)}
                                                placeholder="Ex: Maria Santos"
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Modalidade de Serviço
                                            </label>
                                            <select
                                                value={type}
                                                onChange={(e) =>
                                                    setType(e.target.value as CleaningType)
                                                }
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                            >
                                                {CLEANING_TYPES.map((t) => (
                                                    <option key={t.id} value={t.id}>
                                                        {t.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Valor Cobrado (R$)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={cost}
                                                onChange={(e) =>
                                                    setCost(parseFloat(e.target.value) || 0)
                                                }
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-bold font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                                Status do Pagamento
                                            </label>
                                            <select
                                                value={paymentStatus}
                                                onChange={(e) =>
                                                    setPaymentStatus(
                                                        e.target.value as CleaningPaymentStatus
                                                    )
                                                }
                                                className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                            >
                                                {PAYMENT_STATUS_OPTIONS.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                            Observações / Notas
                                        </label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={2}
                                            placeholder="Ex: Troca de lençóis e toalhas de banho. Produto de lavanda utilizado."
                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-xs font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleSaveRecord}
                                            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-bold font-heading hover:opacity-90 transition-all shadow-md"
                                        >
                                            {editingRecordId
                                                ? 'Atualizar Registro'
                                                : 'Confirmar Registro'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setIsAdding(true);
                                    }}
                                    className="w-full py-3 px-4 border-2 border-dashed border-amber-500/50 hover:border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-2xl text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-heading flex items-center justify-center gap-2 transition-all"
                                >
                                    <Plus size={16} /> Adicionar Nova Limpeza
                                </button>
                            )}

                            {/* LIST OF CLEANINGS */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-heading">
                                    Registros de Limpeza ({cleanings.length})
                                </h3>

                                {cleanings.length === 0 ? (
                                    <div className="p-8 text-center text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-200 dark:border-gray-800">
                                        Nenhuma limpeza registrada ainda para esta reserva.
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {cleanings.map((item) => {
                                            const typeLabel =
                                                item.typeLabel ||
                                                CLEANING_TYPES.find((t) => t.id === item.type)
                                                    ?.label ||
                                                item.type;
                                            const formattedDate = item.date
                                                ? new Date(
                                                      item.date + 'T00:00:00'
                                                  ).toLocaleDateString('pt-BR')
                                                : '—';

                                            if (deletingId === item.id) {
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn"
                                                    >
                                                        <div className="flex items-center gap-2.5 text-xs font-bold text-red-900 dark:text-red-300">
                                                            <AlertTriangle
                                                                size={18}
                                                                className="text-red-500 shrink-0"
                                                            />
                                                            <span>
                                                                Remover esta limpeza ({typeLabel})
                                                                do histórico?
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => setDeletingId(null)}
                                                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-gray-800 transition-all"
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setCleanings((prev) =>
                                                                        prev.filter(
                                                                            (c) => c.id !== item.id
                                                                        )
                                                                    );
                                                                    setDeletingId(null);
                                                                }}
                                                                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm flex items-center gap-1.5 font-heading uppercase tracking-wider"
                                                            >
                                                                <Trash2 size={13} /> Sim, Remover
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            }

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="p-4 bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-amber-500/50 transition-all"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="text-xs font-bold text-gray-900 dark:text-white font-heading">
                                                                {typeLabel}
                                                            </span>
                                                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                                                                R${' '}
                                                                {(item.cost || 0).toLocaleString(
                                                                    'pt-BR',
                                                                    { minimumFractionDigits: 2 }
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar
                                                                    size={13}
                                                                    className="text-amber-500"
                                                                />{' '}
                                                                {formattedDate}{' '}
                                                                {item.time && `(${item.time})`}
                                                            </span>
                                                            {item.cleanerName && (
                                                                <span className="flex items-center gap-1">
                                                                    <User
                                                                        size={13}
                                                                        className="text-amber-500"
                                                                    />{' '}
                                                                    {item.cleanerName}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {item.notes && (
                                                            <p className="text-xs text-gray-600 dark:text-gray-300 italic pt-1">
                                                                "{item.notes}"
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleStartEdit(item)}
                                                            className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl transition-all"
                                                            title="Editar registro"
                                                        >
                                                            <FileEdit size={16} />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteRecord(item.id)
                                                            }
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all"
                                                            title="Excluir registro"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <CleaningReport
                            companyInfo={companyInfo}
                            reservation={reservation}
                            cleanings={cleanings}
                        />
                    )}
                </div>

                {/* MODAL FOOTER */}
                <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-200 dark:border-gray-700/80 flex items-center justify-between shrink-0">
                    <div>
                        {saveSuccess && (
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fadeIn">
                                ✓ Registros de limpeza salvos!
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase tracking-wider"
                        >
                            Fechar
                        </button>

                        <button
                            type="button"
                            onClick={handlePersistCleanings}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 transition-all shadow-md uppercase tracking-wider font-heading flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CleaningModal;
