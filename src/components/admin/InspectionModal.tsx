import React, { useState, useRef } from 'react';
import {
    X,
    Check,
    AlertTriangle,
    Camera,
    FileText,
    Share2,
    Printer,
    User,
    Calendar,
    MapPin,
    Trash2,
    Image as ImageIcon,
    FileSignature,
} from 'lucide-react';
import { ChecklistItem } from '../../types';

// Constantes do Flats Integração
const COMPANY_INFO = {
    name: 'Flats Integração',
    address: 'Rua São José, 475 - Centro, Petrolina - PE, 56302-270',
    logo: 'https://i.postimg.cc/3xRGwtvg/Whats-App-Image-2025-12-04-at-16-45-58.jpg',
};

interface InspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationName: string;
    unitNumber?: string;
    checklistItems: ChecklistItem[];
}

interface ChecklistState {
    [key: string]: {
        status: 'ok' | 'issue';
        note?: string;
        image?: string;
    };
}

const InspectionModal: React.FC<InspectionModalProps> = ({
    isOpen,
    onClose,
    reservationName,
    unitNumber,
    checklistItems,
}) => {
    const [step, setStep] = useState<'inspection' | 'report'>('inspection');
    const [checklistState, setChecklistState] = useState<ChecklistState>({});
    const [inspectorName, setInspectorName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleStatusChange = (id: string, status: 'ok' | 'issue') => {
        setChecklistState((prev) => ({
            ...prev,
            [id]: { ...prev[id], status },
        }));
    };

    const handleNoteChange = (id: string, note: string) => {
        setChecklistState((prev) => ({
            ...prev,
            [id]: { ...prev[id], note },
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeItemId) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setChecklistState((prev) => ({
                    ...prev,
                    [activeItemId]: { ...prev[activeItemId], image: reader.result as string },
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerImageUpload = (id: string) => {
        setActiveItemId(id);
        fileInputRef.current?.click();
    };

    const removeImage = (id: string) => {
        setChecklistState((prev) => {
            const newState = { ...prev };
            if (newState[id]) {
                delete newState[id].image;
            }
            return newState;
        });
    };

    const getFormattedReport = () => {
        const date = new Date().toLocaleDateString('pt-BR');
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        let report = `*RELATÓRIO DE VISTORIA - ${COMPANY_INFO.name.toUpperCase()}*\n`;
        report += `--------------------------------\n`;
        report += `🏠 *Unidade:* ${unitNumber || 'N/A'}\n`;
        report += `👤 *Hóspede:* ${reservationName}\n`;
        report += `📅 *Data:* ${date} às ${time}\n`;
        report += `🕵️ *Vistoriador:* ${inspectorName || 'Não informado'}\n`;
        report += `--------------------------------\n\n`;

        const issues = checklistItems.filter((item) => checklistState[item.id]?.status === 'issue');
        const okItems = checklistItems.filter((item) => checklistState[item.id]?.status === 'ok');

        if (issues.length > 0) {
            report += `🚨 *ITENS COM ATENÇÃO:*\n`;
            issues.forEach((item) => {
                const state = checklistState[item.id];
                report += `❌ ${item.label} (${item.category || 'Geral'})\n`;
                if (state.note) report += `   📝 Nota: ${state.note}\n`;
                if (state.image) report += `   📸 [Foto Anexada no PDF]\n`;
            });
            report += `\n`;
        }

        if (okItems.length > 0) {
            report += `✅ *ITENS OK:* ${okItems.map((i) => i.label).join(', ')}\n`;
        }

        report += `\n📍 ${COMPANY_INFO.address}`;

        return report;
    };

    const handleCopyReport = () => {
        const text = getFormattedReport();
        navigator.clipboard.writeText(text);
        alert('Relatório copiado para a área de transferência!');
    };

    const handlePrint = () => {
        window.print();
    };

    const resetAndClose = () => {
        setStep('inspection');
        setChecklistState({});
        setInspectorName('');
        onClose();
    };

    const groupedItems = checklistItems.reduce(
        (acc, item) => {
            const cat = item.category || 'Outros';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, ChecklistItem[]>
    );

    const issueItems = checklistItems.filter((i) => checklistState[i.id]?.status === 'issue');
    const okItems = checklistItems.filter((i) => checklistState[i.id]?.status === 'ok');
    const totalChecked = issueItems.length + okItems.length;
    const progress =
        checklistItems.length > 0 ? Math.round((totalChecked / checklistItems.length) * 100) : 0;

    return (
        <div className="modal-overlay fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm print:p-0 print:bg-white print:block print:absolute print:top-0 print:left-0 print:w-full print:min-h-screen print:z-[9999]">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:h-auto print:block">
                {/* HEADER */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center print:hidden">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        {step === 'inspection' ? (
                            <Camera className="text-orange-500" />
                        ) : (
                            <FileText className="text-blue-500" />
                        )}
                        {step === 'inspection' ? 'Nova Vistoria' : 'Relatório Final'}
                    </h2>
                    <div className="flex items-center gap-3">
                        {step === 'inspection' && (
                            <div className="text-xs text-gray-500 font-medium">
                                {progress}% concluído
                            </div>
                        )}
                        <button
                            onClick={resetAndClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-4 print:overflow-visible print:p-0">
                    {step === 'inspection' ? (
                        <div className="space-y-6">
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30">
                                <p className="text-sm text-orange-800 dark:text-orange-200 font-medium">
                                    Vistoria do Flat <strong>{unitNumber}</strong> -{' '}
                                    {reservationName}
                                </p>
                                {/* Progress bar */}
                                <div className="mt-3 h-2 bg-orange-100 dark:bg-orange-900/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-orange-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-8">
                                {Object.entries(groupedItems).map(([category, items]) => (
                                    <div key={category}>
                                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 border-b border-gray-100 dark:border-gray-800 pb-1">
                                            {category}
                                        </h3>
                                        <div className="space-y-4">
                                            {items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700"
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-bold text-gray-700 dark:text-gray-200">
                                                            {item.label}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        item.id,
                                                                        'ok'
                                                                    )
                                                                }
                                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                                    checklistState[item.id]
                                                                        ?.status === 'ok'
                                                                        ? 'bg-green-500 text-white shadow-md scale-105'
                                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                                }`}
                                                            >
                                                                OK
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        item.id,
                                                                        'issue'
                                                                    )
                                                                }
                                                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                                                    checklistState[item.id]
                                                                        ?.status === 'issue'
                                                                        ? 'bg-red-500 text-white shadow-md scale-105'
                                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                                                }`}
                                                            >
                                                                PROBLEMA
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {checklistState[item.id]?.status ===
                                                        'issue' && (
                                                        <div className="animate-fadeIn space-y-3">
                                                            <textarea
                                                                placeholder="Descreva o problema..."
                                                                value={
                                                                    checklistState[item.id]?.note ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    handleNoteChange(
                                                                        item.id,
                                                                        e.target.value
                                                                    )
                                                                }
                                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-red-500 outline-none"
                                                                rows={2}
                                                            />

                                                            <div className="flex items-center gap-3">
                                                                {checklistState[item.id]?.image ? (
                                                                    <div className="relative group">
                                                                        <img
                                                                            src={
                                                                                checklistState[
                                                                                    item.id
                                                                                ]?.image
                                                                            }
                                                                            alt="Evidência"
                                                                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                                        />
                                                                        <button
                                                                            onClick={() =>
                                                                                removeImage(item.id)
                                                                            }
                                                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={() =>
                                                                            triggerImageUpload(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                                    >
                                                                        <Camera size={14} /> Anexar
                                                                        Foto
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ============================================
                           RELATÓRIO PROFISSIONAL - VERSÃO IMPRESSÃO
                           ============================================ */
                        <div className="print:p-8 print:pt-0">
                            {/* CABEÇALHO COM LOGO */}
                            <div className="flex items-center justify-between border-b-2 border-gray-300 pb-6 mb-6 print:border-black">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={COMPANY_INFO.logo}
                                        alt={COMPANY_INFO.name}
                                        className="w-20 h-20 object-contain rounded-lg print:w-24 print:h-24"
                                    />
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">
                                            {COMPANY_INFO.name}
                                        </h1>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {COMPANY_INFO.address}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold print:bg-blue-600">
                                        RELATÓRIO DE VISTORIA
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2 font-mono">
                                        {new Date().toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            {/* DESCRIÇÃO */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 print:bg-gray-100">
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Este documento registra o estado de conservação e conferência
                                    dos itens do imóvel após a saída do hóspede, garantindo a
                                    transparência e qualidade dos serviços prestados.
                                </p>
                            </div>

                            {/* INFORMAÇÕES DA VISTORIA */}
                            <div className="grid grid-cols-2 gap-4 mb-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden print:border-gray-400">
                                <div className="p-4 bg-white dark:bg-gray-900">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                        Unidade
                                    </p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin size={16} className="text-blue-500" />{' '}
                                        {unitNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-900">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                        Hóspede
                                    </p>
                                    <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                        <User size={16} className="text-orange-500" />{' '}
                                        {reservationName}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-900">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                        Data/Hora da Vistoria
                                    </p>
                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-400" />{' '}
                                        {new Date().toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div className="p-4 bg-white dark:bg-gray-900">
                                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                                        Responsável pela Vistoria
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Digite seu nome..."
                                        value={inspectorName}
                                        onChange={(e) => setInspectorName(e.target.value)}
                                        className="bg-transparent border-b-2 border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-blue-500 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 print:border-gray-900"
                                    />
                                </div>
                            </div>

                            {/* RESUMO */}
                            <div className="flex gap-4 mb-8">
                                <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 text-center">
                                    <p className="text-3xl font-bold text-green-600">
                                        {okItems.length}
                                    </p>
                                    <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase">
                                        Itens OK
                                    </p>
                                </div>
                                <div className="flex-1 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center">
                                    <p className="text-3xl font-bold text-red-600">
                                        {issueItems.length}
                                    </p>
                                    <p className="text-xs text-red-700 dark:text-red-400 font-medium uppercase">
                                        Com Atenção
                                    </p>
                                </div>
                            </div>

                            {/* ITENS COM PROBLEMA */}
                            {issueItems.length > 0 && (
                                <div className="mb-8 break-inside-avoid">
                                    <h3 className="text-sm font-bold uppercase border-b-2 border-red-500 pb-2 mb-4 flex items-center gap-2 text-red-600">
                                        <AlertTriangle size={16} /> Itens que Requerem Atenção
                                    </h3>
                                    <div className="space-y-4">
                                        {issueItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border-l-4 border-red-500 break-inside-avoid print:bg-red-50"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <X
                                                        size={20}
                                                        className="text-red-500 mt-0.5 flex-shrink-0"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-bold text-gray-900 dark:text-white">
                                                            {item.label}
                                                            <span className="text-xs font-normal text-gray-500 ml-2">
                                                                ({item.category || 'Geral'})
                                                            </span>
                                                        </p>
                                                        {checklistState[item.id]?.note && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic border-l-2 border-gray-300 pl-2">
                                                                "{checklistState[item.id]?.note}"
                                                            </p>
                                                        )}
                                                        {checklistState[item.id]?.image && (
                                                            <div className="mt-3">
                                                                <p className="text-[10px] font-bold uppercase text-gray-400 mb-1 flex items-center gap-1">
                                                                    <ImageIcon size={10} />{' '}
                                                                    Evidência Fotográfica:
                                                                </p>
                                                                <img
                                                                    src={
                                                                        checklistState[item.id]
                                                                            ?.image
                                                                    }
                                                                    alt={`Problema em ${item.label}`}
                                                                    className="max-w-full h-auto max-h-[250px] rounded-lg border border-gray-200 shadow-sm"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ITENS OK - AGRUPADOS */}
                            {okItems.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-sm font-bold uppercase border-b-2 border-green-500 pb-2 mb-4 flex items-center gap-2 text-green-600">
                                        <Check size={16} /> Itens Verificados e Aprovados
                                    </h3>
                                    <div className="space-y-4">
                                        {Object.entries(
                                            okItems.reduce(
                                                (acc, item) => {
                                                    const cat = item.category || 'Outros';
                                                    if (!acc[cat]) acc[cat] = [];
                                                    acc[cat].push(item);
                                                    return acc;
                                                },
                                                {} as Record<string, ChecklistItem[]>
                                            )
                                        ).map(([category, items]) => (
                                            <div key={category} className="break-inside-avoid">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                                    {category}
                                                </h4>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                    {items.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded print:bg-green-50"
                                                        >
                                                            <Check
                                                                size={12}
                                                                className="text-green-500 flex-shrink-0"
                                                            />
                                                            {item.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SEÇÃO DE ASSINATURA */}
                            <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700 print:border-gray-900">
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="text-center">
                                        <div className="border-b-2 border-gray-400 dark:border-gray-500 mb-2 h-12 print:border-gray-900"></div>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                                            Assinatura do Responsável
                                        </p>
                                        <p className="text-[10px] text-gray-400">
                                            {inspectorName || 'Nome do Vistoriador'}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="border-b-2 border-gray-400 dark:border-gray-500 mb-2 h-12 print:border-gray-900"></div>
                                        <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">
                                            Assinatura do Hóspede
                                        </p>
                                        <p className="text-[10px] text-gray-400">(Opcional)</p>
                                    </div>
                                </div>
                            </div>

                            {/* RODAPÉ */}
                            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <FileSignature size={14} className="text-gray-400" />
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        Documento gerado eletronicamente
                                    </p>
                                </div>
                                <p className="text-[10px] text-gray-400">
                                    {COMPANY_INFO.name} • {COMPANY_INFO.address}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 print:hidden">
                    {step === 'inspection' ? (
                        <button
                            onClick={() => setStep('report')}
                            disabled={totalChecked === 0}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Gerar Relatório ({totalChecked} itens verificados)
                        </button>
                    ) : (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('inspection')}
                                className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Voltar
                            </button>
                            <button
                                onClick={handleCopyReport}
                                className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Share2 size={18} /> Copiar WhatsApp
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex-1 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-800/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Printer size={18} /> Imprimir / PDF
                            </button>
                        </div>
                    )}
                </div>

                {/* HIDDEN FILE INPUT */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                />
            </div>
        </div>
    );
};

export default InspectionModal;
