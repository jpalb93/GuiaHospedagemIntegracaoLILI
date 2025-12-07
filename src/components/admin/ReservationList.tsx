import React, { useMemo } from 'react';
import { Reservation, UserPermission, PropertyId } from '../../types';
import { useAdminSettings } from '../../hooks/useAdminSettings';
import { PROPERTIES } from '../../config/properties';
import { Badge, Input } from '../ui';
import {
    CalendarDays,
    History,
    KeyRound,
    StickyNote,
    MessageSquare,
    Pencil,
    Trash2,
    BellRing,
    LogOut,
    ClipboardCheck,
    Check,
    Link as LinkIcon,
    Share2,
    Search,
    Building2,
    ChevronUp,
    ChevronDown,
    Loader2,
} from 'lucide-react';
import InspectionModal from './InspectionModal';

interface ReservationListProps {
    data: {
        activeReservations: Reservation[];
        historyReservations: Reservation[];
        loadMoreHistory: () => void;
        hasMoreHistory: boolean;
        loadingHistory: boolean;
    };
    ui: {
        searchTerm: string;
        setSearchTerm: (term: string) => void;
        showToast: (msg: string, type: 'success' | 'error') => void;
    };
    form: {
        handleStartEdit: (res: Reservation) => void;
        handleDeleteReservation: (id: string) => void;
    };
    userPermission: UserPermission | null;
}

const ReservationList: React.FC<ReservationListProps> = ({ data, ui, form, userPermission }) => {
    const {
        activeReservations,
        historyReservations,
        loadMoreHistory,
        hasMoreHistory,
        loadingHistory,
    } = data;
    const { searchTerm, setSearchTerm, showToast } = ui;
    const { handleStartEdit, handleDeleteReservation } = form;
    const { settings } = useAdminSettings();

    const [listCopiedId, setListCopiedId] = React.useState<string | null>(null);
    const [openHistoryGroups, setOpenHistoryGroups] = React.useState<number[]>([0]);
    const [propertyFilter, setPropertyFilter] = React.useState<PropertyId | 'all'>('all');

    // Inspection Modal State
    const [inspectionModalOpen, setInspectionModalOpen] = React.useState(false);
    const [inspectionReservation, setInspectionReservation] = React.useState<Reservation | null>(
        null
    );

    // Optimized filtering and grouping
    const { leavingToday, staying, upcoming, historyList, tomorrowStr, groupedHistory } =
        useMemo(() => {
            const allReservations = [...activeReservations, ...historyReservations];
            const uniqueReservations = Array.from(
                new Map(allReservations.map((item: Reservation) => [item.id, item])).values()
            );

            const today = new Date();
            const todayStr = today.toLocaleDateString('en-CA');
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStrVal = tomorrow.toLocaleDateString('en-CA');

            const filteredList = uniqueReservations.filter((res: Reservation) => {
                const term = searchTerm.toLowerCase();
                const nameMatch = res.guestName.toLowerCase().includes(term);
                const notesMatch = res.adminNotes?.toLowerCase().includes(term);

                const propertyMatch =
                    propertyFilter === 'all' || (res.propertyId || 'lili') === propertyFilter;

                return (nameMatch || notesMatch) && propertyMatch;
            });

            const leavingTodayArr: Reservation[] = [];
            const stayingArr: Reservation[] = [];
            const upcomingArr: Reservation[] = [];
            const historyListArr: Reservation[] = [];

            filteredList.forEach((res: Reservation) => {
                if (!res.checkoutDate || !res.checkInDate) return;

                if (res.checkoutDate < todayStr) {
                    historyListArr.push(res);
                } else if (res.checkoutDate === todayStr) {
                    leavingTodayArr.push(res);
                } else if (res.checkInDate > todayStr) {
                    upcomingArr.push(res);
                } else {
                    stayingArr.push(res);
                }
            });

            leavingTodayArr.sort((a, b) => a.guestName.localeCompare(b.guestName));
            stayingArr.sort((a, b) => (a.checkoutDate ?? '').localeCompare(b.checkoutDate ?? ''));
            upcomingArr.sort((a, b) => (a.checkInDate ?? '').localeCompare(b.checkInDate ?? ''));
            historyListArr.sort((a, b) =>
                (b.checkoutDate ?? '').localeCompare(a.checkoutDate ?? '')
            );

            interface HistoryGroup {
                label: string;
                items: Reservation[];
            }
            const groupedHistoryArr = historyListArr.reduce(
                (groups: HistoryGroup[], res: Reservation) => {
                    if (!res.checkoutDate) return groups;
                    const [y, m] = res.checkoutDate.split('-');
                    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
                    const labelRaw = date.toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                    });
                    const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);
                    const lastGroup = groups[groups.length - 1];
                    if (lastGroup && lastGroup.label === label) {
                        lastGroup.items.push(res);
                    } else {
                        groups.push({ label, items: [res] });
                    }
                    return groups;
                },
                []
            );

            return {
                leavingToday: leavingTodayArr,
                staying: stayingArr,
                upcoming: upcomingArr,
                historyList: historyListArr,
                tomorrowStr: tomorrowStrVal,
                groupedHistory: groupedHistoryArr,
            };
        }, [activeReservations, historyReservations, searchTerm, propertyFilter]);

    const getLinkForReservation = (res: Reservation) => {
        const baseUrl = window.location.origin + '/';
        if (res.shortId) return `${baseUrl}${res.shortId}`;
        if (res.id) return `${baseUrl}?rid=${res.id}`;
        return '';
    };

    const formatMessage = (template: string, res: Reservation, link: string) => {
        const firstName = res.guestName.split(' ')[0];
        const password = res.lockCode || res.safeCode || '----';
        return template
            .replace(/{guestName}/g, firstName)
            .replace(/{link}/g, link)
            .replace(/{password}/g, password);
    };

    const handleCopyListLink = (res: Reservation) => {
        const link = getLinkForReservation(res);
        if (!link) return;
        navigator.clipboard.writeText(link);
        setListCopiedId(res.id || null);
        showToast('Link copiado!', 'success');
        setTimeout(() => setListCopiedId(null), 2000);
    };

    const handleShareListWhatsApp = (res: Reservation) => {
        if (!res.id) return;
        const link = getLinkForReservation(res);
        const defaultTemplate = `Olá, {guestName}! 👋\n\nPreparei um Guia Digital exclusivo para sua estadia no Flat. 📲\n\nAqui você encontra instruções e um passo a passo (com vídeos 🎥) de como entrar no flat sem dificuldade e ter uma estadia maravilhosa. ✨\n\nAlém disso, em caso de dúvidas, você pode clicar no ícone laranja 🟠 e conversar com uma Inteligência Artificial totalmente personalizada que sabe tudo (ou quase! 🤖) do nosso flat e Petrolina em geral.\n\n👇 Acesse aqui:\n{link}`;
        const template = settings.data.messageTemplates?.invite || defaultTemplate;
        const message = formatMessage(template, res, link);
        const phone = res.guestPhone ? res.guestPhone : '';
        const whatsappUrl = phone
            ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const sendReminder = (res: Reservation, type: 'checkin' | 'checkout') => {
        if (!res.id) return;
        const link = getLinkForReservation(res);
        const phone = res.guestPhone || '';
        let message = '';
        if (type === 'checkin') {
            const defaultTemplate = `Olá, {guestName}! Tudo pronto para sua chegada amanhã? ✈️\n\nJá deixei tudo preparado no seu Guia Digital (Senha da porta, Wi-Fi e Localização).\n\nAcesse aqui: {link}\n\nQualquer dúvida, estou por aqui!`;
            const template = settings.data.messageTemplates?.checkin || defaultTemplate;
            message = formatMessage(template, res, link);
        } else {
            const defaultTemplate = `Oi, {guestName}! Espero que a estadia esteja sendo ótima. 🌵\n\nComo seu check-out é amanhã, deixei as instruções de saída facilitadas aqui no guia: {link}\n\nBoa viagem de volta!`;
            const template = settings.data.messageTemplates?.checkout || defaultTemplate;
            message = formatMessage(template, res, link);
        }
        const whatsappUrl = phone
            ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const toggleHistoryGroup = (index: number) => {
        setOpenHistoryGroups((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleOpenInspection = (res: Reservation) => {
        setInspectionReservation(res);
        setInspectionModalOpen(true);
    };

    // --- RENDER HELPERS ---

    const renderMobileCard = (res: Reservation, statusColor: string, statusLabel?: string) => {
        const isCheckinTomorrow = res.checkInDate === tomorrowStr;
        const isCheckoutTomorrow = res.checkoutDate === tomorrowStr;
        const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];
        const isIntegracao = res.propertyId === 'integracao';

        return (
            <div
                key={res.id}
                className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border-l-4 ${statusColor} flex flex-col gap-4 mb-4`}
            >
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                            {res.guestName}
                        </h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {res.status === 'pending' && (
                                <Badge variant="yellow">Pré-Reserva</Badge>
                            )}
                            {statusLabel && (
                                <Badge
                                    variant={
                                        statusLabel === 'Checkout Hoje'
                                            ? 'orange'
                                            : statusLabel === 'Hospedado'
                                                ? 'green'
                                                : 'gray'
                                    }
                                >
                                    {statusLabel}
                                </Badge>
                            )}
                            <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                                {property.name}
                            </Badge>
                        </div>
                        <div className="flex flex-col mt-3 gap-1.5">
                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                <CalendarDays size={14} className="text-gray-400" /> In:{' '}
                                {res.checkInDate?.split('-').reverse().join('/')}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                <History size={14} className="text-gray-400" /> Out:{' '}
                                {res.checkoutDate?.split('-').reverse().join('/')}
                            </span>
                            {res.flatNumber && (
                                <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2 font-medium">
                                    <KeyRound size={14} className="text-gray-400" /> Flat:{' '}
                                    {res.flatNumber}
                                </span>
                            )}
                        </div>
                        {res.adminNotes && (
                            <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs px-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium border border-yellow-100 dark:border-yellow-900/30">
                                <StickyNote size={12} /> Nota: {res.adminNotes}
                            </div>
                        )}
                        {res.guestAlertActive && (
                            <div className="mt-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs px-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 font-medium border border-blue-100 dark:border-blue-900/30">
                                <MessageSquare size={12} /> Recado Ativo
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(res);
                            }}
                            className="p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-blue-500 rounded-xl transition-colors shadow-sm"
                            title="Editar"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (res.id) handleDeleteReservation(res.id);
                            }}
                            className="p-2.5 bg-gray-50 dark:bg-gray-700 text-gray-400 hover:text-red-500 rounded-xl transition-colors shadow-sm"
                            title="Excluir"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    {isCheckinTomorrow && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                sendReminder(res, 'checkin');
                            }}
                            className="col-span-2 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm animate-pulse"
                        >
                            <BellRing size={16} /> Lembrete Chegada
                        </button>
                    )}
                    {isCheckoutTomorrow && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                sendReminder(res, 'checkout');
                            }}
                            className="col-span-2 py-2.5 bg-orange-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                        >
                            <LogOut size={16} /> Instr. Saída
                        </button>
                    )}
                    {isIntegracao && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleOpenInspection(res);
                            }}
                            className="col-span-2 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
                        >
                            <ClipboardCheck size={16} /> Vistoria
                        </button>
                    )}

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyListLink(res);
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border ${listCopiedId === res.id ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600'}`}
                    >
                        {listCopiedId === res.id ? <Check size={14} /> : <LinkIcon size={14} />}{' '}
                        {listCopiedId === res.id ? 'Copiado' : 'Link'}
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShareListWhatsApp(res);
                        }}
                        className="py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors"
                    >
                        <Share2 size={14} /> WhatsApp
                    </button>
                </div>
            </div>
        );
    };

    const renderDesktopRow = (res: Reservation, statusLabel: string = '') => {
        const isCheckinTomorrow = res.checkInDate === tomorrowStr;
        const isCheckoutTomorrow = res.checkoutDate === tomorrowStr;
        const property = PROPERTIES[(res.propertyId || 'lili') as PropertyId];

        return (
            <tr
                key={res.id}
                className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
                <td className="py-4 px-4 align-top">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                            {res.guestName}
                        </span>
                        <span className="text-[10px] text-gray-400">
                            {res.flatNumber ? `Flat ${res.flatNumber}` : 'Sem nº'}
                        </span>
                        {res.adminNotes && (
                            <span className="text-[10px] text-yellow-600 mt-1 flex items-center gap-1">
                                <StickyNote size={8} /> {res.adminNotes}
                            </span>
                        )}
                    </div>
                </td>
                <td className="py-4 px-4 align-top">
                    <div className="flex flex-col items-start gap-1">
                        <Badge variant={property.id === 'lili' ? 'orange' : 'blue'}>
                            {property.name}
                        </Badge>
                        {statusLabel && (
                            <Badge
                                variant={
                                    statusLabel === 'Checkout Hoje'
                                        ? 'orange'
                                        : statusLabel === 'Hospedado'
                                            ? 'green'
                                            : res.status === 'pending'
                                                ? 'yellow'
                                                : 'gray'
                                }
                            >
                                {statusLabel}
                            </Badge>
                        )}
                    </div>
                </td>
                <td className="py-4 px-4 align-top">
                    <div className="flex flex-col text-xs text-gray-600 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1.5 mb-1">
                            <CalendarDays size={12} className="text-gray-400" />{' '}
                            {res.checkInDate?.split('-').reverse().join('/')}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <LogOut size={12} className="text-gray-400" />{' '}
                            {res.checkoutDate?.split('-').reverse().join('/')}
                        </span>
                    </div>
                </td>
                <td className="py-4 px-4 align-middle text-right">
                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        {isCheckinTomorrow && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    sendReminder(res, 'checkin');
                                }}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                title="Lembrete Chegada"
                            >
                                <BellRing size={16} />
                            </button>
                        )}
                        {isCheckoutTomorrow && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    sendReminder(res, 'checkout');
                                }}
                                className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                                title="Instruções Saída"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleShareListWhatsApp(res);
                            }}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="WhatsApp"
                        >
                            <Share2 size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCopyListLink(res);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Copiar Link"
                        >
                            <LinkIcon size={16} />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-1"></div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(res);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 rounded-lg"
                            title="Editar"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteReservation(res.id!);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                            title="Excluir"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    const renderSection = (
        title: string,
        list: Reservation[],
        statusColor: string,
        statusLabel: string,
        showEmpty = false
    ) => {
        if (list.length === 0 && !showEmpty) return null;

        return (
            <div className="mb-8 animate-fadeIn">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 pl-1 flex items-center gap-2">
                    {title}{' '}
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 rounded-md">
                        {list.length}
                    </span>
                </h3>
                <div className="md:hidden">
                    {list.map((res) => renderMobileCard(res, statusColor, statusLabel))}
                </div>
                <div className="hidden md:block bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-gray-700/50 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-gray-700/50">
                            <tr>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Hóspede
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Datas
                                </th>
                                <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {list.map((res) => renderDesktopRow(res, statusLabel))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 min-h-[400px]">
            {/* SEARCH & FILTERS */}
            <Input
                variant="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou nota..."
            />

            {(!userPermission ||
                userPermission.role === 'super_admin' ||
                userPermission.allowedProperties.length > 1) && (
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button
                            onClick={() => setPropertyFilter('all')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${propertyFilter === 'all' ? 'bg-gray-900 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            Todos
                        </button>
                        {Object.values(PROPERTIES).map((prop) => {
                            if (
                                userPermission &&
                                userPermission.role !== 'super_admin' &&
                                !userPermission.allowedProperties.includes(prop.id)
                            )
                                return null;
                            return (
                                <button
                                    key={prop.id}
                                    onClick={() => setPropertyFilter(prop.id)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${propertyFilter === prop.id ? (prop.id === 'lili' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30') : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'}`}
                                >
                                    <Building2 size={12} /> {prop.name}
                                </button>
                            );
                        })}
                    </div>
                )}

            <div className="space-y-2">
                {renderSection('Saindo Hoje', leavingToday, 'border-orange-500', 'Checkout Hoje')}
                {renderSection('Hospedados', staying, 'border-green-500', 'Hospedado')}
                {renderSection('Próximas Chegadas', upcoming, 'border-blue-500', '', false)}

                {historyList.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 ml-1">
                            Histórico Recente
                        </h3>
                        {groupedHistory.map((group, index) => (
                            <div
                                key={index}
                                className="mb-4 bg-white/40 dark:bg-gray-800/40 border border-white/50 dark:border-gray-700/30 rounded-3xl overflow-hidden backdrop-blur-sm"
                            >
                                <button
                                    onClick={() => toggleHistoryGroup(index)}
                                    className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                                >
                                    <span className="font-bold text-sm text-gray-700 dark:text-gray-300">
                                        {group.label}
                                    </span>
                                    {openHistoryGroups.includes(index) ? (
                                        <ChevronUp size={16} />
                                    ) : (
                                        <ChevronDown size={16} />
                                    )}
                                </button>
                                {openHistoryGroups.includes(index) && (
                                    <div className="p-2 md:p-4">
                                        <div className="md:hidden space-y-3">
                                            {group.items.map((res) =>
                                                renderMobileCard(
                                                    res,
                                                    'border-gray-300',
                                                    'Histórico'
                                                )
                                            )}
                                        </div>
                                        <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700">
                                            <table className="w-full text-left bg-white dark:bg-gray-900">
                                                <tbody className="divide-y divide-gray-100">
                                                    {group.items.map((res) =>
                                                        renderDesktopRow(res, 'Histórico')
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {hasMoreHistory && (
                            <button
                                onClick={loadMoreHistory}
                                disabled={loadingHistory}
                                className="w-full py-4 text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-2 transition-colors"
                            >
                                {loadingHistory ? (
                                    <Loader2 className="animate-spin" size={16} />
                                ) : (
                                    'Carregar Mais Antigos'
                                )}
                            </button>
                        )}
                    </div>
                )}

                {activeReservations.length === 0 && historyReservations.length === 0 && (
                    <div className="text-center py-20">
                        <Search size={48} className="mx-auto text-gray-200 mb-4" />
                        <p className="text-gray-400 font-medium">Nenhuma reserva encontrada.</p>
                    </div>
                )}
            </div>

            <InspectionModal
                isOpen={inspectionModalOpen}
                onClose={() => setInspectionModalOpen(false)}
                reservationName={inspectionReservation?.guestName || ''}
                unitNumber={inspectionReservation?.flatNumber}
                checklistItems={settings.data.checklist || []}
            />
        </div>
    );
};

export default ReservationList;
