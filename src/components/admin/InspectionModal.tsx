import React, { useState, useRef } from 'react';
import { X, Camera, FileText, Share2, Printer } from 'lucide-react';
import { ChecklistItem, PropertyId } from '../../types';
import { PROPERTIES } from '../../config/properties';
import InspectionChecklist, { ChecklistState } from './InspectionChecklist';
import InspectionReport from './InspectionReport';

interface InspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationName: string;
    unitNumber?: string;
    checklistItems: ChecklistItem[];
    propertyId?: PropertyId;
}

const InspectionModal: React.FC<InspectionModalProps> = ({
    isOpen,
    onClose,
    reservationName,
    unitNumber,
    checklistItems,
    propertyId = 'integracao',
}) => {
    const [step, setStep] = useState<'inspection' | 'report'>('inspection');
    const [checklistState, setChecklistState] = useState<ChecklistState>({});
    const [inspectorName, setInspectorName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);

    if (!isOpen) return null;

    // Get company info from property config (multi-tenant support)
    const companyInfo = PROPERTIES[propertyId]?.companyInfo || {
        name: 'Flats Integração',
        address: 'Rua São José, 475 - Centro, Petrolina - PE, 56302-270',
        logo: 'https://i.postimg.cc/3xRGwtvg/Whats-App-Image-2025-12-04-at-16-45-58.jpg',
    };

    // Handlers
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

        let report = `*RELATÓRIO DE VISTORIA - ${companyInfo.name.toUpperCase()}*\n`;
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

        report += `\n📍 ${companyInfo.address}`;

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

    // Calculations
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
                        <InspectionChecklist
                            checklistItems={checklistItems}
                            checklistState={checklistState}
                            unitNumber={unitNumber}
                            reservationName={reservationName}
                            progress={progress}
                            onStatusChange={handleStatusChange}
                            onNoteChange={handleNoteChange}
                            onTriggerImageUpload={triggerImageUpload}
                            onRemoveImage={removeImage}
                        />
                    ) : (
                        <InspectionReport
                            companyInfo={companyInfo}
                            unitNumber={unitNumber}
                            reservationName={reservationName}
                            inspectorName={inspectorName}
                            onInspectorNameChange={setInspectorName}
                            checklistItems={checklistItems}
                            checklistState={checklistState}
                        />
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
