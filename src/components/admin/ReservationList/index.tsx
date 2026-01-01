import React, { useMemo } from 'react';
import { Reservation, UserPermission, PropertyId } from '../../../types';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { Search } from 'lucide-react';
import InspectionModal from '../InspectionModal';

// Sub-components
import FilterBar from './FilterBar';
import AdvancedFilters from './AdvancedFilters';
import ReservationSection from './ReservationSection';
import HistorySection from './HistorySection';
import BulkActionsToolbar from './BulkActionsToolbar';

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
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    // Advanced Filters State
    const [showFilters, setShowFilters] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState<
        'all' | 'active' | 'pending' | 'cancelled'
    >('all');
    const [dateRange, setDateRange] = React.useState<{
        start: string;
        end: string;
        type: 'checkin' | 'checkout';
    }>({
        start: '',
        end: '',
        type: 'checkin',
    });

    // Inspection Modal State
    const [inspectionModalOpen, setInspectionModalOpen] = React.useState(false);
    const [inspectionReservation, setInspectionReservation] = React.useState<Reservation | null>(
        null
    );

    const toggleSelection = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Optimized filtering and grouping
    const {
        leavingToday,
        staying,
        upcoming,
        historyList,
        tomorrowStr,
        groupedHistory,
        allFiltered,
    } = useMemo(() => {
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
            const statusMatch = statusFilter === 'all' || res.status === statusFilter;

            let dateMatch = true;
            if (dateRange.start || dateRange.end) {
                const targetDate =
                    dateRange.type === 'checkin' ? res.checkInDate : res.checkoutDate;
                if (targetDate) {
                    if (dateRange.start && targetDate < dateRange.start) dateMatch = false;
                    if (dateRange.end && targetDate > dateRange.end) dateMatch = false;
                } else {
                    dateMatch = false;
                }
            }

            return (nameMatch || notesMatch) && propertyMatch && statusMatch && dateMatch;
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
        historyListArr.sort((a, b) => (b.checkoutDate ?? '').localeCompare(a.checkoutDate ?? ''));

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
            allFiltered: filteredList,
        };
    }, [
        activeReservations,
        historyReservations,
        searchTerm,
        propertyFilter,
        statusFilter,
        dateRange,
    ]);

    // Link and message helpers
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

    const handleExportCSV = () => {
        if (!allFiltered || allFiltered.length === 0) {
            showToast('Nenhuma reserva para exportar', 'error');
            return;
        }

        const headers = [
            'Hóspede',
            'Property',
            'Flat',
            'Status',
            'Check-in',
            'Check-out',
            'Telefone',
            'Email',
            'Link',
        ];
        const csvContent = [
            headers.join(','),
            ...allFiltered.map((res) => {
                const link = getLinkForReservation(res);
                return [
                    `"${res.guestName}"`,
                    res.propertyId || 'lili',
                    res.flatNumber || '',
                    res.status,
                    res.checkInDate || '',
                    res.checkoutDate || '',
                    `"${res.guestPhone || ''}"`,
                    res.email || '',
                    link,
                ].join(',');
            }),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const linkEl = document.createElement('a');
        linkEl.setAttribute('href', url);
        linkEl.setAttribute(
            'download',
            `reservas_export_${new Date().toISOString().split('T')[0]}.csv`
        );
        linkEl.style.visibility = 'hidden';
        document.body.appendChild(linkEl);
        linkEl.click();
        document.body.removeChild(linkEl);
    };

    const handleClearFilters = () => {
        setStatusFilter('all');
        setDateRange({ start: '', end: '', type: 'checkin' });
    };

    const hasActiveFilters =
        statusFilter !== 'all' || dateRange.start !== '' || dateRange.end !== '';

    const handleBulkDelete = () => {
        if (window.confirm(`Deseja excluir ${selectedIds.length} reservas?`)) {
            selectedIds.forEach((id) => handleDeleteReservation(id));
            setSelectedIds([]);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <FilterBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                propertyFilter={propertyFilter}
                setPropertyFilter={setPropertyFilter}
                userPermission={userPermission}
                showFilters={showFilters}
                setShowFilters={setShowFilters}
                hasActiveFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
                onExportCSV={handleExportCSV}
                exportCount={allFiltered.length}
            />

            <AdvancedFilters
                showFilters={showFilters}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <div className="space-y-2">
                <BulkActionsToolbar
                    selectedIds={selectedIds}
                    onBulkDelete={handleBulkDelete}
                    onClearSelection={() => setSelectedIds([])}
                />

                <ReservationSection
                    title="Saindo Hoje"
                    list={leavingToday}
                    statusColor="border-orange-500"
                    statusLabel="Checkout Hoje"
                    tomorrowStr={tomorrowStr}
                    selectedIds={selectedIds}
                    listCopiedId={listCopiedId}
                    onToggleSelection={toggleSelection}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteReservation}
                    onCopyLink={handleCopyListLink}
                    onShareWhatsApp={handleShareListWhatsApp}
                    onSendReminder={sendReminder}
                    onOpenInspection={handleOpenInspection}
                />

                <ReservationSection
                    title="Hospedados"
                    list={staying}
                    statusColor="border-green-500"
                    statusLabel="Hospedado"
                    tomorrowStr={tomorrowStr}
                    selectedIds={selectedIds}
                    listCopiedId={listCopiedId}
                    onToggleSelection={toggleSelection}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteReservation}
                    onCopyLink={handleCopyListLink}
                    onShareWhatsApp={handleShareListWhatsApp}
                    onSendReminder={sendReminder}
                    onOpenInspection={handleOpenInspection}
                />

                <ReservationSection
                    title="Próximas Chegadas"
                    list={upcoming}
                    statusColor="border-blue-500"
                    statusLabel=""
                    showEmpty={false}
                    tomorrowStr={tomorrowStr}
                    selectedIds={selectedIds}
                    listCopiedId={listCopiedId}
                    onToggleSelection={toggleSelection}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteReservation}
                    onCopyLink={handleCopyListLink}
                    onShareWhatsApp={handleShareListWhatsApp}
                    onSendReminder={sendReminder}
                    onOpenInspection={handleOpenInspection}
                />

                <HistorySection
                    historyList={historyList}
                    groupedHistory={groupedHistory}
                    openHistoryGroups={openHistoryGroups}
                    toggleHistoryGroup={toggleHistoryGroup}
                    hasMoreHistory={hasMoreHistory}
                    loadingHistory={loadingHistory}
                    loadMoreHistory={loadMoreHistory}
                    tomorrowStr={tomorrowStr}
                    selectedIds={selectedIds}
                    listCopiedId={listCopiedId}
                    onToggleSelection={toggleSelection}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteReservation}
                    onCopyLink={handleCopyListLink}
                    onShareWhatsApp={handleShareListWhatsApp}
                    onSendReminder={sendReminder}
                    onOpenInspection={handleOpenInspection}
                />

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
