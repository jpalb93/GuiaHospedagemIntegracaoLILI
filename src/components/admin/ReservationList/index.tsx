import React, { useMemo, useState } from 'react';
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
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import InspectionModal, { InspectionType } from '../InspectionModal';
import CleaningModal from '../CleaningModal';
import ReservationQuickActionsModal from '../modals/ReservationQuickActionsModal';
import PaymentRegistrationModal from '../modals/PaymentRegistrationModal';

// Sub-components
import FilterBar from './FilterBar';
import AdvancedFilters from './AdvancedFilters';
import ReservationKPIs from './ReservationKPIs';
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
    onNewReservation?: () => void;
}

const ReservationList: React.FC<ReservationListProps> = ({
    data,
    ui,
    form,
    userPermission,
    onNewReservation,
}) => {
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

    const [listCopiedId, setListCopiedId] = useState<string | null>(null);
    const [openHistoryGroups, setOpenHistoryGroups] = useState<number[]>([0]);
    const [propertyFilter, setPropertyFilter] = useState<PropertyId | 'all'>('all');
    const [flatFilter, setFlatFilter] = useState<string>('all');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // Advanced Filters State
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'cancelled'>(
        'all'
    );
    const [dateRange, setDateRange] = useState<{
        start: string;
        end: string;
        type: 'checkin' | 'checkout';
    }>({
        start: '',
        end: '',
        type: 'checkin',
    });

    // Inspection Modal State
    const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
    const [inspectionReservation, setInspectionReservation] = useState<Reservation | null>(null);

    // Quick Actions Modal State
    const [quickActionsReservation, setQuickActionsReservation] = useState<Reservation | null>(
        null
    );

    // Payment Registration Modal State
    const [paymentModalReservation, setPaymentModalReservation] = useState<Reservation | null>(
        null
    );

    // Cleaning Modal State
    const [cleaningModalOpen, setCleaningModalOpen] = useState(false);
    const [cleaningReservation, setCleaningReservation] = useState<Reservation | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

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
    const { leavingToday, staying, upcoming, historyList, todayStr, groupedHistory, allFiltered } =
        useMemo(() => {
            const allReservations = [...historyReservations, ...activeReservations];
            const uniqueReservations = Array.from(
                new Map(allReservations.map((item: Reservation) => [item.id, item])).values()
            );

            const today = new Date();
            const todayStrVal = today.toLocaleDateString('en-CA');

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
                    const rawTarget =
                        dateRange.type === 'checkin' ? res.checkInDate : res.checkoutDate;
                    const targetDate = normalizeToISODate(rawTarget);
                    if (targetDate) {
                        if (dateRange.start && targetDate < dateRange.start) dateMatch = false;
                        if (dateRange.end && targetDate > dateRange.end) dateMatch = false;
                    } else {
                        dateMatch = false;
                    }
                }

                return (
                    (nameMatch || notesMatch) &&
                    propertyMatch &&
                    statusMatch &&
                    flatMatch &&
                    dateMatch
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

                if (checkOutISO < todayStrVal) {
                    historyListArr.push(res);
                } else if (checkOutISO === todayStrVal) {
                    leavingTodayArr.push(res);
                } else if (checkInISO > todayStrVal) {
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
                todayStr: todayStrVal,
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
        showToast('Link copiado com sucesso!', 'success');
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

    const handleDuplicateReservation = (res: Reservation) => {
        handleStartEdit({
            ...res,
            id: '',
            shortId: '',
            guestName: `${res.guestName} (Cópia)`,
            createdAt: new Date().toISOString(),
        });
        showToast('Reserva duplicada no formulário.', 'success');
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

    const totalActiveCount = staying.length + leavingToday.length + upcoming.length;
    const totalPages = Math.max(1, Math.ceil(allFiltered.length / pageSize));

    return (
        <div className="w-full space-y-8 animate-fadeIn pb-[calc(11rem+env(safe-area-inset-bottom,0px))]">
            {/* 1. FILTER & ACTION TOOLBAR (Search, Filters, Status, + Nova Reserva) */}
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
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onNewReservation={onNewReservation}
            />

            {/* ADVANCED FILTERS PANEL */}
            <AdvancedFilters
                showFilters={showFilters}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                flatFilter={flatFilter}
                setFlatFilter={setFlatFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            {/* 2. REAL-TIME KPI METRICS BAR */}
            <ReservationKPIs
                reservations={activeReservations}
                allFiltered={allFiltered}
                todayStr={todayStr}
            />

            {/* 3. BULK ACTIONS & RESERVATION SECTIONS */}
            <div className="space-y-6">
                <BulkActionsToolbar
                    selectedIds={selectedIds}
                    onBulkDelete={handleBulkDelete}
                    onClearSelection={() => setSelectedIds([])}
                />

                {/* Section: Saindo Hoje */}
                <ReservationSection
                    title="Saindo Hoje"
                    list={leavingToday}
                    statusColor="border-amber-500"
                    showEmpty={false}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onOpenInspection={handleOpenInspection}
                    onQuickView={(res) => setQuickActionsReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                />

                {/* Section: Hospedados Agora */}
                <ReservationSection
                    title="Hospedados Agora"
                    list={staying}
                    statusColor="border-green-500"
                    showEmpty={false}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onOpenInspection={handleOpenInspection}
                    onQuickView={(res) => setQuickActionsReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                />

                {/* Section: Próximas Chegadas */}
                <ReservationSection
                    title="Próximas Chegadas"
                    list={upcoming}
                    statusColor="border-blue-500"
                    showEmpty={false}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onOpenInspection={handleOpenInspection}
                    onQuickView={(res) => setQuickActionsReservation(res)}
                    onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                />

                {/* Section: Histórico Recente */}
                <HistorySection
                    historyList={historyList}
                    groupedHistory={groupedHistory}
                    openHistoryGroups={openHistoryGroups}
                    toggleHistoryGroup={toggleHistoryGroup}
                    hasMoreHistory={hasMoreHistory}
                    loadingHistory={loadingHistory}
                    loadMoreHistory={loadMoreHistory}
                    selectedIds={selectedIds}
                    onToggleSelection={toggleSelection}
                    onOpenInspection={handleOpenInspection}
                    onQuickView={(res) => setQuickActionsReservation(res)}
                />

                {allFiltered.length === 0 && (
                    <div className="text-center py-20 bg-white/50 dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-200/60 dark:border-gray-700/60">
                        <Search
                            size={48}
                            className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                        />
                        <p className="text-gray-500 dark:text-gray-400 font-bold font-heading">
                            Nenhuma reserva encontrada com os filtros aplicados.
                        </p>
                    </div>
                )}
            </div>

            {/* 4. FOOTER PAGINATION BAR */}
            {allFiltered.length > 0 && (
                <div className="p-4 sm:p-5 bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 font-heading">
                        Mostrando{' '}
                        <span className="text-gray-900 dark:text-white font-extrabold">1</span> a{' '}
                        <span className="text-gray-900 dark:text-white font-extrabold">
                            {Math.min(totalActiveCount || allFiltered.length, pageSize)}
                        </span>{' '}
                        de{' '}
                        <span className="text-gray-900 dark:text-white font-extrabold">
                            {allFiltered.length}
                        </span>{' '}
                        reservas
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Page Numbers */}
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="w-8 h-8 rounded-xl bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center font-heading shadow-sm">
                                {currentPage}
                            </span>
                            {totalPages > 1 && (
                                <span className="text-xs text-gray-400 font-bold px-1">
                                    de {totalPages}
                                </span>
                            )}
                            <button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="w-8 h-8 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>

                        {/* Page Size */}
                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                        >
                            <option value={10}>10 por página</option>
                            <option value={20}>20 por página</option>
                            <option value={50}>50 por página</option>
                        </select>
                    </div>
                </div>
            )}

            {/* MODALS */}
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

            {/* QUICK ACTIONS MODAL (PROTOTYPE 2) */}
            <ReservationQuickActionsModal
                isOpen={Boolean(quickActionsReservation)}
                onClose={() => setQuickActionsReservation(null)}
                reservation={quickActionsReservation}
                onOpenInspection={handleOpenInspection}
                onOpenCleaning={handleOpenCleaning}
                onShareWhatsApp={handleShareListWhatsApp}
                onSendReminder={sendReminder}
                onCopyLink={handleCopyListLink}
                onOpenPaymentModal={(res) => setPaymentModalReservation(res)}
                onEdit={(res) => handleStartEdit(res)}
                onDuplicate={handleDuplicateReservation}
                onDelete={handleDeleteReservation}
                listCopiedId={listCopiedId}
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
