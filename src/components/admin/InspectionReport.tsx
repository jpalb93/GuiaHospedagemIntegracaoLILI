import React from 'react';
import {
    Check,
    AlertTriangle,
    User,
    Calendar,
    MapPin,
    X,
    Clock,
    Image as ImageIcon,
    FileSignature,
} from 'lucide-react';
import { ChecklistItem } from '../../types';
import { ChecklistState, InspectionItemStatus } from './InspectionChecklist';

// Company info should be externalized for multi-tenant support
interface CompanyInfo {
    name: string;
    address: string;
    logo: string;
}

interface InspectionReportProps {
    companyInfo: CompanyInfo;
    unitNumber?: string;
    reservationName: string;
    inspectorName: string;
    onInspectorNameChange: (name: string) => void;
    checklistItems: ChecklistItem[];
    checklistState: ChecklistState;
    inspectionType?: 'pre_checkin' | 'post_checkout';
}

const InspectionReport: React.FC<InspectionReportProps> = ({
    companyInfo,
    unitNumber,
    reservationName,
    inspectorName,
    onInspectorNameChange,
    checklistItems,
    checklistState,
    inspectionType = 'pre_checkin',
}) => {
    const getItemStatus = (id: string): InspectionItemStatus =>
        (checklistState && checklistState[id]?.status) || 'pending';

    const safeItems = (checklistItems && Array.isArray(checklistItems))
        ? checklistItems.filter((i): i is ChecklistItem => Boolean(i && typeof i === 'object' && i.id))
        : [];

    const issueItems = safeItems.filter((i) => getItemStatus(i.id) === 'issue');
    const pendingItems = safeItems.filter((i) => getItemStatus(i.id) === 'pending');
    const okItems = safeItems.filter((i) => getItemStatus(i.id) === 'ok');

    // Group OK items by category
    const groupedOkItems = okItems.reduce(
        (acc, item) => {
            const cat = item.category || 'Outros';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, ChecklistItem[]>
    );

    return (
        <div
            id="inspection-report-content"
            className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4 rounded-xl print:bg-white print:text-gray-900 print:p-0 print:rounded-none"
        >
            {/* HEADER WITH LOGO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-gray-300 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-3 print:border-black">
                <div className="flex items-center gap-3">
                    <img
                        src={companyInfo.logo}
                        alt={companyInfo.name}
                        className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-lg shrink-0 print:w-24 print:h-24"
                    />
                    <div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wide leading-tight">
                            {companyInfo.name}
                        </h1>
                        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                            {companyInfo.address}
                        </p>
                    </div>
                </div>
                <div className="text-left sm:text-right shrink-0">
                    <div
                        className={`text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-bold inline-block ${
                            inspectionType === 'pre_checkin' ? 'bg-blue-600' : 'bg-indigo-700'
                        }`}
                    >
                        {inspectionType === 'pre_checkin'
                            ? 'VISTORIA PRÉ CHECK-IN'
                            : 'VISTORIA PÓS CHECK-OUT'}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-mono">
                        {new Date().toLocaleDateString('pt-BR')}
                    </p>
                </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 print:bg-gray-100">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {inspectionType === 'pre_checkin'
                        ? 'Este documento registra o inventário e o estado de conservação de todos os itens do imóvel no momento da entrega da chave ao hóspede, assegurando a conferência de entrada.'
                        : 'Este documento registra a conferência pós checkout para checagem da presença e estado de conservação dos itens inventariados no pré check-in.'}
                </p>
            </div>

            {/* INSPECTION INFO GRID */}
            <div className="grid grid-cols-2 gap-4 mb-8 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden print:border-gray-400">
                <div className="p-4 bg-white dark:bg-gray-900">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Unidade
                    </p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" /> {unitNumber || 'N/A'}
                    </p>
                </div>
                <div className="p-4 bg-white dark:bg-gray-900">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider mb-1">
                        Hóspede
                    </p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                        <User size={16} className="text-orange-500" /> {reservationName}
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
                        onChange={(e) => onInspectorNameChange(e.target.value)}
                        className="bg-transparent border-b-2 border-gray-300 dark:border-gray-600 w-full focus:outline-none focus:border-blue-500 text-sm font-bold text-gray-900 dark:text-white placeholder-gray-400 print:hidden"
                    />
                    <p className="hidden print:block border-b-2 border-gray-900 w-full text-sm font-bold text-gray-900 pb-0.5">
                        {inspectorName || 'Não informado'}
                    </p>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800 text-center">
                    <p className="text-3xl font-bold text-green-600">{okItems.length}</p>
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase">
                        Itens OK
                    </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                    <p className="text-3xl font-bold text-amber-600">{pendingItems.length}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium uppercase">
                        Pendentes
                    </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    <p className="text-3xl font-bold text-red-600">{issueItems.length}</p>
                    <p className="text-xs text-red-700 dark:text-red-400 font-medium uppercase">
                        Com Atenção
                    </p>
                </div>
            </div>

            {/* ISSUE ITEMS */}
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
                                    <X size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
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
                                                    <ImageIcon size={10} /> Evidência Fotográfica:
                                                </p>
                                                <img
                                                    src={checklistState[item.id]?.image}
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

            {/* PENDING ITEMS */}
            {pendingItems.length > 0 && (
                <div className="mb-8 break-inside-avoid">
                    <h3 className="text-sm font-bold uppercase border-b-2 border-amber-500 pb-2 mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                        <Clock size={16} /> Itens Pendentes de Verificação ({pendingItems.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {pendingItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border-l-4 border-amber-500 flex items-center justify-between print:bg-amber-50"
                            >
                                <div className="flex-1 pr-2">
                                    <p className="font-bold text-xs text-gray-900 dark:text-white">
                                        {item.label}{' '}
                                        <span className="text-[10px] font-normal text-gray-500 ml-1">
                                            ({item.category || 'Geral'})
                                        </span>
                                    </p>
                                    {checklistState[item.id]?.note && (
                                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic">
                                            "{checklistState[item.id]?.note}"
                                        </p>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 shrink-0">
                                    Pendente
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* OK ITEMS GROUPED */}
            {okItems.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-sm font-bold uppercase border-b-2 border-green-500 pb-2 mb-4 flex items-center gap-2 text-green-600">
                        <Check size={16} /> Itens Verificados e Aprovados
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(groupedOkItems).map(([category, items]) => (
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
                                            <Check size={12} className="text-green-500 flex-shrink-0" />
                                            {item.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SIGNATURE SECTION */}
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

            {/* FOOTER */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <FileSignature size={14} className="text-gray-400" />
                    <p className="text-[10px] text-gray-400 font-medium">
                        Documento gerado eletronicamente
                    </p>
                </div>
                <p className="text-[10px] text-gray-400">
                    {companyInfo.name} • {companyInfo.address}
                </p>
            </div>
        </div>
    );
};

export default InspectionReport;
