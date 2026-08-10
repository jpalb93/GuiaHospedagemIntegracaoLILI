import React, { useState, useRef, useMemo, useEffect } from 'react';
import { X, Camera, FileText, Printer, Save, CheckCircle2 } from 'lucide-react';
import { ChecklistItem, PropertyId, Reservation, SavedInspectionData } from '../../types';
import { PROPERTIES } from '../../config/properties';
import { DEFAULT_CHECKLIST } from '../../config/checklist';
import InspectionChecklist, { ChecklistState, InspectionItemStatus } from './InspectionChecklist';
import InspectionReport from './InspectionReport';

export type InspectionType = 'pre_checkin' | 'post_checkout';

interface InspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservation?: Reservation | null;
    reservationName: string;
    unitNumber?: string;
    checklistItems?: ChecklistItem[];
    propertyId?: PropertyId;
    initialType?: InspectionType;
    onSaveInspection?: (
        reservationId: string,
        type: InspectionType,
        inspectionData: SavedInspectionData
    ) => Promise<void> | void;
}

const InspectionModal: React.FC<InspectionModalProps> = ({
    isOpen,
    onClose,
    reservation,
    reservationName,
    unitNumber,
    checklistItems = [],
    propertyId = 'integracao',
    initialType = 'pre_checkin',
    onSaveInspection,
}) => {
    const [step, setStep] = useState<'inspection' | 'report'>('inspection');
    const [inspectionType, setInspectionType] = useState<InspectionType>(initialType);
    const [checklistState, setChecklistState] = useState<ChecklistState>({});
    const [inspectorName, setInspectorName] = useState('');
    const [customItems, setCustomItems] = useState<ChecklistItem[]>([]);
    const [excludedItemIds, setExcludedItemIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);

    // Carrega dados salvos quando abre ou muda o tipo/reserva
    useEffect(() => {
        if (!isOpen) return;

        const savedForCurrentType =
            inspectionType === 'pre_checkin'
                ? reservation?.preCheckInInspection
                : reservation?.postCheckOutInspection;

        // Se for Pós Check-out e ainda não tiver vistoria pós salva, usa a vistoria pré de base!
        const savedToLoad =
            savedForCurrentType ||
            (inspectionType === 'post_checkout' ? reservation?.preCheckInInspection : null);

        if (savedToLoad) {
            setChecklistState(
                savedToLoad.checklistState && typeof savedToLoad.checklistState === 'object'
                    ? savedToLoad.checklistState
                    : {}
            );
            setInspectorName(savedToLoad.inspectorName || '');
            if (savedToLoad.customItems) {
                const loadedCustom = Array.isArray(savedToLoad.customItems)
                    ? savedToLoad.customItems
                    : typeof savedToLoad.customItems === 'object'
                      ? Object.values(savedToLoad.customItems)
                      : [];
                setCustomItems(loadedCustom as ChecklistItem[]);
            } else {
                setCustomItems([]);
            }
            setExcludedItemIds(
                Array.isArray(savedToLoad.excludedItemIds) ? savedToLoad.excludedItemIds : []
            );
        } else {
            setChecklistState({});
            setInspectorName('');
            setCustomItems([]);
            setExcludedItemIds([]);
        }
    }, [isOpen, inspectionType, reservation]);

    const safeCustomItems: ChecklistItem[] = useMemo(() => {
        if (!customItems) return [];
        if (Array.isArray(customItems)) return customItems;
        if (typeof customItems === 'object') return Object.values(customItems) as ChecklistItem[];
        return [];
    }, [customItems]);

    const safeChecklistProp: ChecklistItem[] = useMemo(() => {
        if (checklistItems && Array.isArray(checklistItems) && checklistItems.length > 0) {
            return checklistItems;
        }
        return DEFAULT_CHECKLIST;
    }, [checklistItems]);

    const allChecklistItems = useMemo(() => {
        const excluded = new Set(excludedItemIds);
        return [...safeChecklistProp, ...safeCustomItems].filter((item): item is ChecklistItem =>
            Boolean(item && typeof item === 'object' && item.id && !excluded.has(item.id))
        );
    }, [safeChecklistProp, safeCustomItems, excludedItemIds]);

    const handleSaveInspectionData = async () => {
        if (!reservation?.id || !onSaveInspection) return;
        setIsSaving(true);
        try {
            const inspectionData: SavedInspectionData = {
                timestamp: new Date().toISOString(),
                inspectorName,
                checklistState,
                customItems,
                excludedItemIds,
            };
            await onSaveInspection(reservation.id, inspectionType, inspectionData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Erro ao salvar vistoria:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddCustomItem = (label: string) => {
        if (!label.trim()) return;
        const newItem: ChecklistItem = {
            id: `custom-${Date.now()}`,
            label: label.trim(),
            active: true,
            category: 'Itens Especiais para esta Reserva',
        };
        setCustomItems((prev) => [...prev, newItem]);
        setChecklistState((prev) => ({
            ...prev,
            [newItem.id]: { status: 'ok' },
        }));
    };

    const handleRemoveItem = (id: string) => {
        const item = [...safeChecklistProp, ...safeCustomItems].find((i) => i.id === id);
        const label = item?.label || 'este item';
        if (
            !window.confirm(
                `Remover "${label}" só desta vistoria?\n\nO item não aparecerá no relatório desta reserva. O checklist geral das configurações não será alterado.`
            )
        ) {
            return;
        }

        // Itens especiais desta reserva: remove da lista custom
        setCustomItems((prev) => prev.filter((i) => i.id !== id));
        // Itens do checklist padrão: marca como excluído nesta vistoria
        setExcludedItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        setChecklistState((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
        });
    };

    if (!isOpen) return null;

    // Get company info from property config (multi-tenant support)
    const companyInfo = PROPERTIES[propertyId]?.companyInfo || {
        name: 'Flats Integração',
        address: 'Rua São José, 475 - Centro, Petrolina - PE, 56302-270',
        logo: 'https://i.postimg.cc/3xRGwtvg/Whats-App-Image-2025-12-04-at-16-45-58.jpg',
    };

    // Handlers
    const handleStatusChange = (id: string, status: InspectionItemStatus) => {
        setChecklistState((prev) => ({
            ...prev,
            [id]: { ...prev[id], status },
        }));
    };

    const handleNoteChange = (id: string, note: string) => {
        setChecklistState((prev) => ({
            ...prev,
            [id]: { ...prev[id], status: prev[id]?.status || 'pending', note },
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeItemId) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setChecklistState((prev) => ({
                    ...prev,
                    [activeItemId]: {
                        ...prev[activeItemId],
                        status: prev[activeItemId]?.status || 'pending',
                        image: reader.result as string,
                    },
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

    const getItemStatus = (id: string): InspectionItemStatus =>
        checklistState[id]?.status || 'pending';

    const getFormattedReport = () => {
        const date = new Date().toLocaleDateString('pt-BR');
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const isPre = inspectionType === 'pre_checkin';

        let report = `*RELATÓRIO DE VISTORIA ${isPre ? 'PRÉ CHECK-IN (ENTRADA)' : 'PÓS CHECK-OUT (SAÍDA)'} - ${companyInfo.name.toUpperCase()}*\n`;
        report += `--------------------------------\n`;
        report += `🏠 *Unidade:* ${unitNumber || 'N/A'}\n`;
        report += `👤 *Hóspede:* ${reservationName}\n`;
        report += `📅 *Data:* ${date} às ${time}\n`;
        report += `🕵️ *Vistoriador:* ${inspectorName || 'Não informado'}\n`;
        report += `--------------------------------\n\n`;

        if (isPre) {
            report += `📋 *INVENTÁRIO E CONFERÊNCIA DE ENTRADA DO HÓSPEDE*\n\n`;
        } else {
            report += `🔍 *CONFERÊNCIA PÓS CHECK-OUT DA SAÍDA DO HÓSPEDE*\n\n`;
        }

        const issues = allChecklistItems.filter((item) => getItemStatus(item.id) === 'issue');
        const pendings = allChecklistItems.filter((item) => getItemStatus(item.id) === 'pending');
        const okItems = allChecklistItems.filter((item) => getItemStatus(item.id) === 'ok');

        if (issues.length > 0) {
            report += `🚨 *ITENS COM OBSERVAÇÃO / ATENÇÃO (${issues.length}):*\n`;
            issues.forEach((item) => {
                const state = checklistState[item.id];
                report += `❌ ${item.label} (${item.category || 'Geral'})\n`;
                if (state?.note) report += `   📝 Nota: ${state.note}\n`;
                if (state?.image) report += `   📸 [Foto Anexada no PDF]\n`;
            });
            report += `\n`;
        }

        if (pendings.length > 0) {
            report += `🟡 *ITENS PENDENTES DE VERIFICAÇÃO (${pendings.length}):*\n`;
            pendings.forEach((item) => {
                const state = checklistState[item.id];
                report += `⏳ ${item.label} (${item.category || 'Geral'})\n`;
                if (state?.note) report += `   📝 Nota: ${state.note}\n`;
            });
            report += `\n`;
        }

        if (okItems.length > 0) {
            report += `✅ *ITENS OK / CONFERIDOS (${okItems.length}):* ${okItems.map((i) => i.label).join(', ')}\n`;
        }

        report += `\n📍 ${companyInfo.address}`;

        return report;
    };

    const handleCopyReport = () => {
        const textReport = getFormattedReport();
        navigator.clipboard.writeText(textReport);
        alert('Relatório copiado para a área de transferência!');
    };

    const handlePrint = async () => {
        const reportContent = document.getElementById('inspection-report-content');
        if (!reportContent) return;

        document.getElementById('inspection-print-frame')?.remove();

        const printFrame = document.createElement('iframe');
        printFrame.id = 'inspection-print-frame';
        printFrame.title = 'Impressão do relatório de vistoria';
        printFrame.setAttribute('aria-hidden', 'true');
        Object.assign(printFrame.style, {
            position: 'fixed',
            left: '-10000px',
            top: '0',
            width: '210mm',
            height: '297mm',
            border: '0',
            pointerEvents: 'none',
        });
        document.body.appendChild(printFrame);

        try {
            const printDocument = printFrame.contentDocument;
            const printWindow = printFrame.contentWindow;
            if (!printDocument || !printWindow)
                throw new Error('Documento de impressão indisponível');

            printDocument.open();
            printDocument.write(
                '<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Relatório de Vistoria</title></head><body></body></html>'
            );
            printDocument.close();

            const base = printDocument.createElement('base');
            base.href = document.baseURI;
            printDocument.head.prepend(base);

            const stylesheetPromises = Array.from(
                document.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
                    'link[rel="stylesheet"], style'
                )
            ).map((sourceStyle) => {
                const clonedStyle = sourceStyle.cloneNode(true) as
                    | HTMLLinkElement
                    | HTMLStyleElement;
                if (clonedStyle.tagName !== 'LINK') {
                    printDocument.head.appendChild(clonedStyle);
                    return Promise.resolve();
                }

                return new Promise<void>((resolve) => {
                    clonedStyle.addEventListener('load', () => resolve(), { once: true });
                    clonedStyle.addEventListener('error', () => resolve(), { once: true });
                    printDocument.head.appendChild(clonedStyle);
                });
            });

            const printOverrides = printDocument.createElement('style');
            printOverrides.textContent = `
                @page { size: A4 portrait; margin: 8mm 10mm; }
                html, body {
                    width: auto !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    background: #ffffff !important;
                    color: #111827 !important;
                }
                #inspection-report-content {
                    position: static !important;
                    display: block !important;
                    width: 100% !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    border-radius: 0 !important;
                    box-shadow: none !important;
                    background: #ffffff !important;
                    color: #111827 !important;
                }
                #inspection-report-content, #inspection-report-content * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            `;
            printDocument.head.appendChild(printOverrides);
            printDocument.body.appendChild(reportContent.cloneNode(true));

            const imagesReady = Promise.all(
                Array.from(printDocument.images).map((image) => {
                    if (image.complete) return Promise.resolve();
                    return new Promise<void>((resolve) => {
                        image.addEventListener('load', () => resolve(), { once: true });
                        image.addEventListener('error', () => resolve(), { once: true });
                    });
                })
            );

            const assetsReady = Promise.all([
                ...stylesheetPromises,
                imagesReady,
                printDocument.fonts?.ready ?? Promise.resolve(),
            ]);
            await Promise.race([
                assetsReady,
                new Promise<void>((resolve) => window.setTimeout(resolve, 5_000)),
            ]);

            let cleanedUp = false;
            const cleanup = () => {
                if (cleanedUp) return;
                cleanedUp = true;
                printFrame.remove();
                window.clearTimeout(cleanupTimeout);
            };
            const cleanupTimeout = window.setTimeout(cleanup, 60_000);
            printWindow.addEventListener('afterprint', cleanup, { once: true });

            printWindow.focus();
            printWindow.print();
        } catch (error) {
            printFrame.remove();
            console.error('Erro ao imprimir vistoria:', error);
            window.alert('Não foi possível preparar o relatório para impressão. Tente novamente.');
        }
    };

    const resetAndClose = () => {
        setStep('inspection');
        setChecklistState({});
        setInspectorName('');
        setCustomItems([]);
        setExcludedItemIds([]);
        onClose();
    };

    // Calculations
    const issueItems = allChecklistItems.filter((i) => getItemStatus(i.id) === 'issue');
    const okItems = allChecklistItems.filter((i) => getItemStatus(i.id) === 'ok');
    const pendingItems = allChecklistItems.filter((i) => getItemStatus(i.id) === 'pending');
    const totalChecked = issueItems.length + okItems.length;
    const progress =
        allChecklistItems.length > 0
            ? Math.round((totalChecked / allChecklistItems.length) * 100)
            : 0;

    return (
        <div className="modal-overlay fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm print:p-0 print:bg-white print:block print:absolute print:top-0 print:left-0 print:w-full print:min-h-0 print:h-auto print:z-[9999]">
            <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none print:w-full print:max-w-none print:h-auto print:block print:overflow-visible overflow-hidden">
                {/* HEADER */}
                <div className="p-3.5 sm:p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center print:hidden shrink-0">
                    <h2 className="text-base sm:text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 truncate">
                        {step === 'inspection' ? (
                            <Camera
                                className={`shrink-0 ${inspectionType === 'pre_checkin' ? 'text-blue-500' : 'text-indigo-500'}`}
                                size={20}
                            />
                        ) : (
                            <FileText
                                className={`shrink-0 ${inspectionType === 'pre_checkin' ? 'text-blue-500' : 'text-indigo-500'}`}
                                size={20}
                            />
                        )}
                        <span className="truncate">
                            {step === 'inspection'
                                ? inspectionType === 'pre_checkin'
                                    ? 'Vistoria PRÉ Check-in'
                                    : 'Vistoria PÓS Check-out'
                                : 'Relatório Final'}
                        </span>
                    </h2>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {step === 'inspection' && (
                            <div className="text-xs text-gray-500 font-medium">{progress}%</div>
                        )}
                        <button
                            type="button"
                            onClick={resetAndClose}
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-95 touch-manipulation"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* TABS SELETOR VISTORIA PRÉ CHECK-IN VS PÓS CHECK-OUT */}
                <div className="px-3 sm:px-4 py-2 flex gap-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-900/70 print:hidden shrink-0">
                    <button
                        type="button"
                        onClick={() => setInspectionType('pre_checkin')}
                        className={`flex-1 min-h-[44px] py-2 px-2.5 sm:px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 border active:scale-95 touch-manipulation ${
                            inspectionType === 'pre_checkin'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📥 <span className="hidden sm:inline">Vistoria </span>PRÉ Check-in
                        <span className="hidden sm:inline"> (Entrada)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setInspectionType('post_checkout')}
                        className={`flex-1 min-h-[44px] py-2 px-2.5 sm:px-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 border active:scale-95 touch-manipulation ${
                            inspectionType === 'post_checkout'
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        📤 <span className="hidden sm:inline">Vistoria </span>PÓS Check-out
                        <span className="hidden sm:inline"> (Saída)</span>
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 print:overflow-visible print:p-0 no-scrollbar">
                    {step === 'inspection' ? (
                        <InspectionChecklist
                            checklistItems={allChecklistItems}
                            checklistState={checklistState}
                            unitNumber={unitNumber}
                            reservationName={reservationName}
                            progress={progress}
                            inspectionType={inspectionType}
                            onStatusChange={handleStatusChange}
                            onNoteChange={handleNoteChange}
                            onTriggerImageUpload={triggerImageUpload}
                            onRemoveImage={removeImage}
                            onAddCustomItem={handleAddCustomItem}
                            onRemoveItem={handleRemoveItem}
                        />
                    ) : (
                        <InspectionReport
                            companyInfo={companyInfo}
                            unitNumber={unitNumber}
                            reservationName={reservationName}
                            inspectorName={inspectorName}
                            onInspectorNameChange={setInspectorName}
                            checklistItems={allChecklistItems}
                            checklistState={checklistState}
                            inspectionType={inspectionType}
                        />
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-3.5 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 print:hidden shrink-0">
                    {step === 'inspection' ? (
                        <div className="flex gap-2">
                            {onSaveInspection && reservation?.id && (
                                <button
                                    type="button"
                                    onClick={handleSaveInspectionData}
                                    disabled={isSaving}
                                    className={`min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border shadow-xs shrink-0 active:scale-95 touch-manipulation ${
                                        saveSuccess
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                    }`}
                                >
                                    {saveSuccess ? (
                                        <>
                                            <CheckCircle2 size={16} /> Salvo!
                                        </>
                                    ) : (
                                        <>
                                            <Save size={16} /> {isSaving ? 'Salvando...' : 'Salvar'}
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    handleSaveInspectionData();
                                    setStep('report');
                                }}
                                className="flex-1 min-h-[44px] py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] text-xs flex items-center justify-center touch-manipulation"
                            >
                                <span className="hidden sm:inline">
                                    Gerar Relatório ({okItems.length} OK, {issueItems.length}{' '}
                                    Atenção, {pendingItems.length} Pendentes)
                                </span>
                                <span className="sm:hidden">
                                    Gerar Relatório ({okItems.length} OK)
                                </span>
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:flex sm:flex-nowrap gap-2">
                            <button
                                type="button"
                                onClick={() => setStep('inspection')}
                                className="min-h-[44px] px-3 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-xs active:scale-95 touch-manipulation"
                            >
                                Voltar
                            </button>
                            {onSaveInspection && reservation?.id && (
                                <button
                                    type="button"
                                    onClick={handleSaveInspectionData}
                                    disabled={isSaving}
                                    className={`min-h-[44px] py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border shadow-xs active:scale-95 touch-manipulation ${
                                        saveSuccess
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                                    }`}
                                >
                                    {saveSuccess ? <CheckCircle2 size={16} /> : <Save size={16} />}
                                    {saveSuccess ? 'Salvo!' : 'Salvar'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleCopyReport}
                                className="min-h-[44px] px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1 text-xs touch-manipulation"
                            >
                                Copiar Texto
                            </button>
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="col-span-2 sm:col-auto sm:flex-1 min-h-[44px] py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-bold shadow-md shadow-gray-800/20 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs touch-manipulation"
                            >
                                <Printer size={16} /> PDF / Imprimir
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
