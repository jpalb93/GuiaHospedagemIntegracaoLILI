import React, { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
    Reservation,
    UserPermission,
    PropertyId,
    SavedInspectionData,
    PaymentStatus,
    PaymentMethod,
    CleaningRecord,
} from '../../../types';
import { useAdminSettings } from '../../../hooks/useAdminSettings';
import { updateReservation } from '../../../services/firebase/reservations';
import { normalizeToISODate } from '../../../utils/dateFormatting';
import { Search } from 'lucide-react';
import InspectionModal, { InspectionType } from '../InspectionModal';
import CleaningModal from '../CleaningModal';
import ReservationQuickViewModal from '../modals/ReservationQuickViewModal';
import PaymentRegistrationModal from '../modals/PaymentRegistrationModal';

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
    const queryClient = useQueryClient();
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
    const [flatFilter, setFlatFilter] = React.useState<string>('all');
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

    // Quick View Modal State
    const [quickViewReservation, setQuickViewReservation] = React.useState<Reservation | null>(
        null
    );

    // Payment Registration Modal State
    const [paymentModalReservation, setPaymentModalReservation] =
        React.useState<Reservation | null>(null);

    // Cleaning Modal State
    const [cleaningModalOpen, setCleaningModalOpen] = React.useState(false);
    const [cleaningReservation, setCleaningReservation] = React.useState<Reservation | null>(null);

    const handleConfirmPayment = async (
        reservationId: string,
        paymentStatus: PaymentStatus,
        depositAmount: number,
        paymentMethod?: PaymentMethod
    ) => {
        try {
            await updateReservation(reservationId, {
                paymentStatus,
                depositAmount,
                paymentMethod,
            });
            showToast('Pagamento registrado com sucesso!', 'success');
        } catch (_error) {
            showToast('Erro ao registrar pagamento.', 'error');
        }
    };

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
        const allReservations = [...historyReservations, ...activeReservations];
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
            const flatMatch =
                flatFilter === 'all' ||
                (flatFilter === 'lili'
                    ? (res.propertyId || 'lili') === 'lili'
                    : res.flatNumber === flatFilter);

            let dateMatch = true;
            if (dateRange.start || dateRange.end) {
                const rawTarget = dateRange.type === 'checkin' ? res.checkInDate : res.checkoutDate;
                const targetDate = normalizeToISODate(rawTarget);
                if (targetDate) {
                    if (dateRange.start && targetDate < dateRange.start) dateMatch = false;
                    if (dateRange.end && targetDate > dateRange.end) dateMatch = false;
                } else {
                    dateMatch = false;
                }
            }

            return (
                (nameMatch || notesMatch) && propertyMatch && statusMatch && flatMatch && dateMatch
            );
        });

        const leavingTodayArr: Reservation[] = [];
        const stayingArr: Reservation[] = [];
        const upcomingArr: Reservation[] = [];
        const historyListArr: Reservation[] = [];

        filteredList.forEach((res: Reservation) => {
            const checkInISO = normalizeToISODate(res.checkInDate);
            const checkOutISO = normalizeToISODate(res.checkoutDate);
            if (!checkOutISO || !checkInISO) return;

            if (checkOutISO < todayStr) {
                historyListArr.push(res);
            } else if (checkOutISO === todayStr) {
                leavingTodayArr.push(res);
            } else if (checkInISO > todayStr) {
                upcomingArr.push(res);
            } else {
                stayingArr.push(res);
            }
        });

        const sortByFlatNumber = (a: Reservation, b: Reservation) => {
            const getFlatNum = (res: Reservation) => {
                if ((res.propertyId || 'lili') === 'lili') return 0;
                const num = parseInt(res.flatNumber || '0', 10);
                return isNaN(num) ? 9999 : num;
            };
            const diff = getFlatNum(a) - getFlatNum(b);
            if (diff !== 0) return diff;
            const aIn = normalizeToISODate(a.checkInDate);
            const bIn = normalizeToISODate(b.checkInDate);
            return aIn.localeCompare(bIn);
        };

        leavingTodayArr.sort(sortByFlatNumber);
        stayingArr.sort(sortByFlatNumber);
        upcomingArr.sort(sortByFlatNumber);
        historyListArr.sort(sortByFlatNumber);

        interface HistoryGroup {
            label: string;
            items: Reservation[];
        }
        const groupedHistoryArr = historyListArr.reduce(
            (groups: HistoryGroup[], res: Reservation) => {
                const groupingDate = normalizeToISODate(res.checkInDate || res.checkoutDate);
                if (!groupingDate) return groups;
                const [y, m] = groupingDate.split('-');
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
        flatFilter,
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
        const template = settings?.data?.messageTemplates?.invite || defaultTemplate;
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
            const template = settings?.data?.messageTemplates?.checkin || defaultTemplate;
            message = formatMessage(template, res, link);
        } else {
            const defaultTemplate = `Oi, {guestName}! Espero que a estadia esteja sendo ótima. 🌵\n\nComo seu check-out é amanhã, deixei as instruções de saída facilitadas aqui no guia: {link}\n\nBoa viagem de volta!`;
            const template = settings?.data?.messageTemplates?.checkout || defaultTemplate;
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

    const handleSaveInspection = async (
        reservationId: string,
        type: InspectionType,
        inspectionData: SavedInspectionData
    ) => {
        try {
            const fieldToUpdate =
                type === 'pre_checkin' ? 'preCheckInInspection' : 'postCheckOutInspection';
            await updateReservation(reservationId, {
                [fieldToUpdate]: inspectionData,
            });
            setInspectionReservation((prev) =>
                prev ? { ...prev, [fieldToUpdate]: inspectionData } : null
            );
            queryClient.invalidateQueries({
                queryKey: ['historyReservations'],
                refetchType: 'all',
            });
            showToast(
                `Vistoria ${type === 'pre_checkin' ? 'PRÉ Check-in' : 'PÓS Check-out'} salva na reserva!`,
                'success'
            );
        } catch (error) {
            console.error('Erro ao salvar vistoria na reserva:', error);
            showToast('Erro ao salvar vistoria na reserva', 'error');
            throw error;
        }
    };

    const handleOpenCleaning = (res: Reservation) => {
        setCleaningReservation(res);
        setCleaningModalOpen(true);
    };

    const handleSaveCleanings = async (reservationId: string, cleanings: CleaningRecord[]) => {
        try {
            await updateReservation(reservationId, {
                cleanings,
            });
            setCleaningReservation((prev) => (prev ? { ...prev, cleanings } : null));
            queryClient.invalidateQueries({
                queryKey: ['historyReservations'],
                refetchType: 'all',
            });
            showToast('Registros de limpeza atualizados!', 'success');
        } catch (error) {
            console.error('Erro ao salvar limpezas:', error);
            showToast('Erro ao salvar registros de limpeza', 'error');
            throw error;
        }
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
        setFlatFilter('all');
        setPropertyFilter('all');
        setDateRange({ start: '', end: '', type: 'checkin' });
        setSearchTerm('');
    };

    const hasActiveFilters =
        statusFilter !== 'all' ||
        flatFilter !== 'all' ||
        dateRange.start !== '' ||
        dateRange.end !== '' ||
        propertyFilter !== 'all';

    const handleBulkDelete = () => {
        if (window.confirm(`Deseja excluir ${selectedIds.length} reservas?`)) {
            selectedIds.forEach((id) => handleDeleteReservation(id));
            setSelectedIds([]);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-fadeIn pb-[calc(11rem+env(safe-area-inset-bottom,0px))]">
            {/* Executive Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-950 text-white p-6 sm:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-stone-800">
                <div className="relative z-10 space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold text-[11px] uppercase tracking-widest font-heading mb-2">
                        <Search size={14} className="text-amber-400" /> Gestão Completa de Hóspedes
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                        Central de Reservas
                    </h2>
                    <p className="text-stone-400 text-xs sm:text-sm font-medium">
                        Acompanhe check-ins, hospedados, vistorias e faturamento em tempo real.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-3 self-start sm:self-auto shrink-0 flex-wrap">
                    <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-heading flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        {staying.length} Hospedados Agora
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold font-heading flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        {leavingToday.length} Saindo Hoje
                    </div>
                </div>
            </div>

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
                flatFilter={flatFilter}
                setFlatFilter={setFlatFilter}
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
                    statusColor="border-amber-500"
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
                    onQuickView={(res) => setQuickViewReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                    onOpenCleaning={handleOpenCleaning}
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
                    onQuickView={(res) => setQuickViewReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                    onOpenCleaning={handleOpenCleaning}
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
                    onQuickView={(res) => setQuickViewReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                    onOpenCleaning={handleOpenCleaning}
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
                    onQuickView={(res) => setQuickViewReservation(res)}
                    onOpenCleaning={handleOpenCleaning}
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
                reservation={inspectionReservation}
                reservationName={inspectionReservation?.guestName || ''}
                unitNumber={inspectionReservation?.flatNumber}
                propertyId={(inspectionReservation?.propertyId as PropertyId) || 'integracao'}
                checklistItems={settings?.data?.checklist || []}
                onSaveInspection={handleSaveInspection}
            />

            <ReservationQuickViewModal
                isOpen={Boolean(quickViewReservation)}
                onClose={() => setQuickViewReservation(null)}
                reservation={quickViewReservation}
                onEdit={(res) => {
                    setQuickViewReservation(null);
                    handleStartEdit(res);
                }}
                onOpenPaymentModal={(res) => {
                    setQuickViewReservation(null);
                    setPaymentModalReservation(res);
                }}
            />

            <PaymentRegistrationModal
                isOpen={Boolean(paymentModalReservation)}
                onClose={() => setPaymentModalReservation(null)}
                reservation={paymentModalReservation}
                onConfirmPayment={handleConfirmPayment}
            />

            <CleaningModal
                isOpen={cleaningModalOpen}
                onClose={() => setCleaningModalOpen(false)}
                reservation={cleaningReservation}
                defaultFee={settings?.data?.defaultCleaningFee ?? 50}
                propertyId={(cleaningReservation?.propertyId as PropertyId) || 'integracao'}
                onSaveCleanings={handleSaveCleanings}
            />
        </div>
    );
};

export default ReservationList;
