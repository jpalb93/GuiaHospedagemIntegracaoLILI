import React from 'react';
import {
    X,
    Eraser,
    Sparkles,
    Loader2,
    Save,
    CheckCircle2,
    AlertCircle,
    User,
    CalendarDays,
    DollarSign,
    FileText,
} from 'lucide-react';
import Button from '../../ui/Button';
import {
    PropertyId,
    UserPermission,
    PaymentMethod,
    PaymentStatus,
    Reservation,
    ReservationTemplate,
    ReservationBillingMode,
} from '../../../types';

// Sub-components
import GuestInfoSection from './GuestInfoSection';
import PropertySection from './PropertySection';
import DatesSection from './DatesSection';
import PaymentSection from './PaymentSection';
import AlertSection from './AlertSection';
import NotesSection from './NotesSection';
import TemplateManager from './TemplateManager';
import DangerZone from './DangerZone';
import GeneratedLinkActions from './GeneratedLinkActions';
import CorporateLinkSection from './CorporateLinkSection';

interface ReservationFormProps {
    form: {
        guestName: string;
        setGuestName: (v: string | ((prev: string) => string)) => void;
        guestPhone: string;
        setGuestPhone: (v: string) => void;
        lockCode: string;
        setLockCode: (v: string) => void;
        propertyId: PropertyId;
        setPropertyId: (v: PropertyId) => void;
        flatNumber: string;
        setFlatNumber: (v: string) => void;
        welcomeMessage: string;
        setWelcomeMessage: (v: string | ((prev: string) => string)) => void;
        adminNotes: string;
        setAdminNotes: (v: string | ((prev: string) => string)) => void;
        guestAlertActive: boolean;
        setGuestAlertActive: (v: boolean) => void;
        guestAlertText: string;
        setGuestAlertText: (v: string) => void;
        checkInDate: string;
        setCheckInDate: (v: string) => void;
        checkoutDate: string;
        setCheckoutDate: (v: string) => void;
        checkInTime: string;
        setCheckInTime: (v: string) => void;
        checkOutTime: string;
        setCheckOutTime: (v: string) => void;
        guestCount: number;
        setGuestCount: (v: number) => void;
        paymentMethod: PaymentMethod | '';
        setPaymentMethod: (v: PaymentMethod | '') => void;
        paymentStatus: PaymentStatus | '';
        setPaymentStatus: (v: PaymentStatus) => void;
        totalAmount: number | '';
        setTotalAmount: (v: number | '') => void;
        depositAmount: number | '';
        setDepositAmount: (v: number | '') => void;
        guestRating: number;
        setGuestRating: (v: number) => void;
        guestFeedback: string;
        setGuestFeedback: (v: string) => void;
        billingMode: ReservationBillingMode;
        setBillingMode: (v: ReservationBillingMode) => void;
        companyId: string;
        setCompanyId: (v: string) => void;
        contractId: string;
        setContractId: (v: string) => void;
        allocationId: string;
        setAllocationId: (v: string) => void;
        editingId: string | null;
        handleSaveReservation: (overrides?: Partial<Reservation>) => void;
        resetForm: () => void;
        isSaving: boolean;
        manualDeactivation: boolean;
        setManualDeactivation: (v: boolean) => void;
    };
    ui: {
        generatedLink: string | null;
        apiKeyStatus: string;
        showToast: (msg: string, type: 'success' | 'error') => void;
    };
    userPermission?: UserPermission | null;
    previousGuests?: Reservation[];
    templates?: ReservationTemplate[];
    onSaveTemplate?: (template: ReservationTemplate) => void;
    onDeleteTemplate?: (id: string) => void;
}

const ReservationForm: React.FC<ReservationFormProps> = ({
    form,
    ui,
    userPermission,
    previousGuests = [],
    templates = [],
    onSaveTemplate,
    onDeleteTemplate,
}) => {
    const { editingId, handleSaveReservation, resetForm, isSaving } = form;
    const { generatedLink, apiKeyStatus, showToast } = ui;

    const handleApplyTemplate = (template: ReservationTemplate) => {
        if (template.guestName) form.setGuestName(template.guestName);
        if (template.guestPhone) form.setGuestPhone(template.guestPhone);
        if (template.propertyId) form.setPropertyId(template.propertyId);
        if (template.flatNumber) form.setFlatNumber(template.flatNumber);
        if (template.welcomeMessage) form.setWelcomeMessage(template.welcomeMessage);
        if (template.adminNotes) form.setAdminNotes(template.adminNotes);
        showToast(`Modelo '${template.name}' aplicado!`, 'success');
    };

    const handleCreateTemplate = () => {
        const name = window.prompt('Nome do novo modelo (Ex: Empresa X):');
        if (!name) return;

        const newTemplate: ReservationTemplate = {
            id: Date.now().toString(),
            name,
            guestName: form.guestName || undefined,
            guestPhone: form.guestPhone || undefined,
            propertyId: form.propertyId || undefined,
            flatNumber: form.flatNumber || undefined,
            welcomeMessage: form.welcomeMessage || undefined,
            adminNotes: form.adminNotes || undefined,
        };

        if (onSaveTemplate) onSaveTemplate(newTemplate);
    };

    return (
        <div className="p-4 md:p-8 space-y-6 relative max-w-4xl mx-auto">
            {/* BOTÃO LIMPAR / CANCELAR */}
            <button
                onClick={resetForm}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                title="Limpar/Cancelar"
            >
                {editingId ? <X size={20} className="text-red-500" /> : <Eraser size={20} />}
            </button>

            {/* BANNER IA CONCIERGE OU EDIÇÃO */}
            {editingId ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3.5 rounded-2xl flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <Sparkles size={16} className="text-blue-500 animate-pulse" /> Você está
                    editando a reserva de <strong className="underline">{form.guestName}</strong>.
                </div>
            ) : (
                <div className="flex gap-2">
                    <div
                        className={`p-3.5 flex-1 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
                            apiKeyStatus === 'ok'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                        }`}
                    >
                        {apiKeyStatus === 'ok' ? (
                            <CheckCircle2 size={18} className="text-green-500" />
                        ) : (
                            <AlertCircle size={18} className="text-red-500" />
                        )}
                        <span>
                            {apiKeyStatus === 'ok'
                                ? 'IA Concierge Ativa (Atendimento Automático)'
                                : 'IA Inativa'}
                        </span>
                    </div>

                    <TemplateManager
                        templates={templates}
                        guestName={form.guestName}
                        editingId={editingId}
                        onApplyTemplate={handleApplyTemplate}
                        onCreateTemplate={handleCreateTemplate}
                        onDeleteTemplate={onDeleteTemplate}
                    />
                </div>
            )}

            {/* CARD 1 — IDENTIFICAÇÃO DO HÓSPEDE */}
            <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <User size={16} className="text-orange-500" /> 1. Quem é o Hóspede?
                </div>
                <GuestInfoSection
                    guestName={form.guestName}
                    setGuestName={form.setGuestName}
                    guestPhone={form.guestPhone}
                    setGuestPhone={form.setGuestPhone}
                    previousGuests={previousGuests}
                />

                <CorporateLinkSection
                    billingMode={form.billingMode}
                    setBillingMode={form.setBillingMode}
                    companyId={form.companyId}
                    setCompanyId={form.setCompanyId}
                    contractId={form.contractId}
                    setContractId={form.setContractId}
                    allocationId={form.allocationId}
                    setAllocationId={form.setAllocationId}
                    setPropertyId={form.setPropertyId}
                    setFlatNumber={form.setFlatNumber}
                    setPaymentStatus={form.setPaymentStatus}
                    setTotalAmount={form.setTotalAmount}
                    setDepositAmount={form.setDepositAmount}
                    setPaymentMethod={form.setPaymentMethod}
                />
            </div>

            {/* CARD 2 — ESTADIA, DATAS & DISPONIBILIDADE DO FLAT */}
            <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <CalendarDays size={16} className="text-orange-500" /> 2. Datas & Escolha do
                    Flat
                </div>

                {/* 1. SELEÇÃO DE DATAS DE CHECK-IN E CHECKOUT */}
                <DatesSection
                    checkInDate={form.checkInDate}
                    setCheckInDate={form.setCheckInDate}
                    checkoutDate={form.checkoutDate}
                    setCheckoutDate={form.setCheckoutDate}
                    checkInTime={form.checkInTime}
                    setCheckInTime={form.setCheckInTime}
                    checkOutTime={form.checkOutTime}
                    setCheckOutTime={form.setCheckOutTime}
                />

                {/* 2. DISPONIBILIDADE EM TEMPO REAL, PROPRIEDADE E SELEÇÃO DE FLAT */}
                <PropertySection
                    propertyId={form.propertyId}
                    setPropertyId={form.setPropertyId}
                    flatNumber={form.flatNumber}
                    setFlatNumber={form.setFlatNumber}
                    lockCode={form.lockCode}
                    setLockCode={form.setLockCode}
                    guestCount={form.guestCount}
                    setGuestCount={form.setGuestCount}
                    checkInDate={form.checkInDate}
                    checkoutDate={form.checkoutDate}
                    reservations={previousGuests}
                    editingId={editingId}
                    userPermission={userPermission}
                />
            </div>

            {/* CARD 3 — FINANCEIRO & PAGAMENTO */}
            <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <DollarSign size={16} className="text-green-500" /> 3. Valor & Pagamento
                </div>
                <PaymentSection
                    paymentMethod={form.paymentMethod}
                    setPaymentMethod={form.setPaymentMethod}
                    paymentStatus={form.paymentStatus}
                    setPaymentStatus={form.setPaymentStatus}
                    totalAmount={form.totalAmount}
                    setTotalAmount={form.setTotalAmount}
                    depositAmount={form.depositAmount}
                    setDepositAmount={form.setDepositAmount}
                    isCorporate={form.billingMode === 'corporate'}
                />
            </div>

            {/* CARD 4 — OBSERVAÇÕES & ALERTAS DO GUIA */}
            <div className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <FileText size={16} className="text-purple-500" /> 4. Observações & Alertas do
                    Guia
                </div>

                <AlertSection
                    guestName={form.guestName}
                    guestAlertActive={form.guestAlertActive}
                    setGuestAlertActive={form.setGuestAlertActive}
                    guestAlertText={form.guestAlertText}
                    setGuestAlertText={form.setGuestAlertText}
                />

                <NotesSection
                    propertyId={form.propertyId}
                    welcomeMessage={form.welcomeMessage}
                    setWelcomeMessage={form.setWelcomeMessage}
                    adminNotes={form.adminNotes}
                    setAdminNotes={form.setAdminNotes}
                    guestRating={form.guestRating}
                    setGuestRating={form.setGuestRating}
                    guestFeedback={form.guestFeedback}
                    setGuestFeedback={form.setGuestFeedback}
                />

                <DangerZone
                    editingId={editingId}
                    manualDeactivation={form.manualDeactivation}
                    setManualDeactivation={form.setManualDeactivation}
                    handleSaveReservation={handleSaveReservation}
                />
            </div>

            {/* BOTÃO PRINCIPAL DE SALVAR */}
            <Button
                onClick={() => handleSaveReservation()}
                disabled={isSaving}
                fullWidth
                leftIcon={
                    isSaving ? (
                        <Loader2 className="animate-spin" />
                    ) : editingId ? (
                        <Save size={20} />
                    ) : (
                        <Sparkles className="text-yellow-400 animate-pulse" />
                    )
                }
                className={`py-4 text-base font-extrabold rounded-2xl shadow-xl transition-all ${
                    editingId
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-900 hover:bg-black text-white dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900'
                }`}
            >
                {isSaving
                    ? 'Salvando...'
                    : editingId
                      ? 'Salvar Alterações da Reserva'
                      : '⚡ Salvar Reserva & Gerar Guia Digital'}
            </Button>

            {/* AÇÕES DE LINK GERADO */}
            <GeneratedLinkActions
                generatedLink={generatedLink}
                editingId={editingId}
                guestName={form.guestName}
                guestPhone={form.guestPhone}
                showToast={showToast}
            />
        </div>
    );
};

export default ReservationForm;
