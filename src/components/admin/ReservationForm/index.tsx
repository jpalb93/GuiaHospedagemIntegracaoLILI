import React from 'react';
import { X, Eraser, Sparkles, Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../../ui/Button';
import {
    PropertyId,
    UserPermission,
    PaymentMethod,
    Reservation,
    ReservationTemplate,
} from '../../../types';

// Sub-components
import GuestInfoSection from './GuestInfoSection';
import PropertySection from './PropertySection';
import DatesSection from './DatesSection';
import AlertSection from './AlertSection';
import NotesSection from './NotesSection';
import TemplateManager from './TemplateManager';
import DangerZone from './DangerZone';
import GeneratedLinkActions from './GeneratedLinkActions';

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
        guestRating: number;
        setGuestRating: (v: number) => void;
        guestFeedback: string;
        setGuestFeedback: (v: string) => void;
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
        <div className="p-8 space-y-6 relative">
            <button
                onClick={resetForm}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors z-10"
                title="Limpar/Cancelar"
            >
                {editingId ? <X size={18} className="text-red-500" /> : <Eraser size={18} />}
            </button>

            {editingId ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30">
                    <Sparkles size={14} /> Você está editando a reserva de{' '}
                    <strong>{form.guestName}</strong>.
                </div>
            ) : (
                <div className="flex gap-2">
                    <div
                        className={`p-3 flex-1 rounded-2xl border flex items-center gap-3 text-xs ${apiKeyStatus === 'ok' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900 text-green-700 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-700'}`}
                    >
                        {apiKeyStatus === 'ok' ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <AlertCircle size={16} />
                        )}
                        <span className="font-bold">
                            {apiKeyStatus === 'ok' ? 'IA Concierge Ativa' : 'IA Inativa'}
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

            <GuestInfoSection
                guestName={form.guestName}
                setGuestName={form.setGuestName}
                guestPhone={form.guestPhone}
                setGuestPhone={form.setGuestPhone}
                previousGuests={previousGuests}
            />

            <PropertySection
                propertyId={form.propertyId}
                setPropertyId={form.setPropertyId}
                flatNumber={form.flatNumber}
                setFlatNumber={form.setFlatNumber}
                lockCode={form.lockCode}
                setLockCode={form.setLockCode}
                guestCount={form.guestCount}
                setGuestCount={form.setGuestCount}
                paymentMethod={form.paymentMethod}
                setPaymentMethod={form.setPaymentMethod}
                editingId={editingId}
                userPermission={userPermission}
            />

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
                        <Sparkles className="text-yellow-400" />
                    )
                }
                className={`py-4 text-lg shadow-xl ${editingId ? 'bg-orange-500' : 'bg-gray-900 dark:bg-white dark:text-gray-900'}`}
            >
                {isSaving ? 'Salvando...' : editingId ? 'Salvar Alterações' : 'Gerar Magic Link'}
            </Button>

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
