import { useState, useCallback } from 'react';
import {
    PropertyId,
    PaymentMethod,
    PaymentStatus,
    Reservation,
    ReservationBillingMode,
} from '../types';
import { PROPERTIES } from '../config/properties';
import { fetchOfficialTime } from '../constants';

export const useReservationForm = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [propertyId, setPropertyId] = useState<PropertyId>('lili');
    const [flatNumber, setFlatNumber] = useState('');
    const [lockCode, setLockCode] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [guestAlertActive, setGuestAlertActive] = useState(false);
    const [guestAlertText, setGuestAlertText] = useState('');
    const [checkInDate, setCheckInDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [checkInTime, setCheckInTime] = useState('14:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');
    const [guestCount, setGuestCount] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [totalAmount, setTotalAmount] = useState<number | ''>('');
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [shortId, setShortId] = useState('');
    const [manualDeactivation, setManualDeactivation] = useState(false);

    const [billingMode, setBillingMode] = useState<ReservationBillingMode>('reservation');
    const [companyId, setCompanyId] = useState('');
    const [contractId, setContractId] = useState('');
    const [allocationId, setAllocationId] = useState('');

    const [guestRating, setGuestRating] = useState<number>(5);
    const [guestFeedback, setGuestFeedback] = useState('');

    const [generatedLink, setGeneratedLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const resetForm = useCallback(async () => {
        const officialNow = await fetchOfficialTime();
        const yyyy = officialNow.getFullYear();
        const mm = String(officialNow.getMonth() + 1).padStart(2, '0');
        const dd = String(officialNow.getDate()).padStart(2, '0');

        const tomorrow = new Date(officialNow);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const t_yyyy = tomorrow.getFullYear();
        const t_mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const t_dd = String(tomorrow.getDate()).padStart(2, '0');

        setCheckInDate(`${yyyy}-${mm}-${dd}`);
        setCheckoutDate(`${t_yyyy}-${t_mm}-${t_dd}`);
        setCheckInTime(PROPERTIES[propertyId].defaults.checkInTime);
        setCheckOutTime(PROPERTIES[propertyId].defaults.checkOutTime);
        setGuestName('');
        setGuestPhone('');
        setPropertyId('lili');
        setFlatNumber('');
        setLockCode('');
        setWelcomeMessage('');
        setAdminNotes('');
        setGuestAlertActive(false);
        setGuestAlertText('');
        setGeneratedLink('');
        setEditingId(null);
        setGuestCount(1);
        setPaymentMethod('');
        setPaymentStatus('pending');
        setTotalAmount('');
        setDepositAmount('');
        setShortId('');
        setManualDeactivation(false);
        setGuestRating(5);
        setGuestFeedback('');
        setBillingMode('reservation');
        setCompanyId('');
        setContractId('');
        setAllocationId('');
    }, [propertyId]);

    const loadReservation = useCallback((res: Reservation) => {
        setEditingId(res.id!);
        setGuestName(res.guestName);
        setGuestPhone(res.guestPhone || '');
        setPropertyId(res.propertyId || 'lili');
        setFlatNumber(res.flatNumber || '');
        setLockCode(res.lockCode || '');
        setWelcomeMessage(res.welcomeMessage || '');
        setAdminNotes(res.adminNotes || '');
        setGuestAlertActive(res.guestAlertActive || false);
        setGuestAlertText(res.guestAlertText || '');
        setCheckInDate(res.checkInDate || '');
        setCheckoutDate(res.checkoutDate || '');
        setCheckInTime(res.checkInTime || '14:00');
        setCheckOutTime(res.checkOutTime || '11:00');
        setGuestCount(res.guestCount || 1);
        setPaymentMethod(res.paymentMethod || '');
        setPaymentStatus(res.paymentStatus || 'pending');
        setTotalAmount(res.totalAmount !== undefined ? res.totalAmount : '');
        setDepositAmount(res.depositAmount !== undefined ? res.depositAmount : '');
        setShortId(res.shortId || '');
        setManualDeactivation(res.manualDeactivation || false);
        setGuestRating(res.guestRating || 5);
        setGuestFeedback(res.guestFeedback || '');
        setBillingMode(res.billingMode === 'corporate' ? 'corporate' : 'reservation');
        setCompanyId(res.companyId || '');
        setContractId(res.contractId || '');
        setAllocationId(res.allocationId || '');
        setGeneratedLink('');
    }, []);

    const getFormValues = useCallback((): Omit<Reservation, 'id' | 'createdAt' | 'status'> => {
        const parseAmount = (value: number | ''): number | undefined => {
            if (typeof value === 'number' && Number.isFinite(value)) return value;
            if (value === '' || value === null || value === undefined) return undefined;
            const n = Number(value);
            return Number.isFinite(n) ? n : undefined;
        };

        const isCorporate = billingMode === 'corporate';

        return {
            guestName: guestName.trim(),
            guestPhone: guestPhone.replace(/\D/g, ''),
            propertyId,
            flatNumber: flatNumber.trim(),
            lockCode: lockCode.trim(),
            welcomeMessage: welcomeMessage.trim(),
            adminNotes: adminNotes.trim(),
            guestAlertActive,
            guestAlertText: guestAlertText.trim(),
            checkInDate,
            checkoutDate,
            checkInTime,
            checkOutTime,
            guestCount,
            paymentMethod: isCorporate
                ? undefined
                : ((paymentMethod || undefined) as PaymentMethod | undefined),
            paymentStatus: isCorporate ? 'billed' : ((paymentStatus || 'pending') as PaymentStatus),
            totalAmount: isCorporate ? undefined : parseAmount(totalAmount),
            depositAmount: isCorporate ? undefined : parseAmount(depositAmount),
            shortId,
            manualDeactivation,
            guestRating,
            guestFeedback,
            billingMode: isCorporate ? 'corporate' : 'reservation',
            companyId: isCorporate && companyId ? companyId : undefined,
            contractId: isCorporate && contractId ? contractId : undefined,
            allocationId: isCorporate && allocationId ? allocationId : undefined,
        };
    }, [
        guestName,
        guestPhone,
        propertyId,
        flatNumber,
        lockCode,
        welcomeMessage,
        adminNotes,
        guestAlertActive,
        guestAlertText,
        checkInDate,
        checkoutDate,
        checkInTime,
        checkOutTime,
        guestCount,
        paymentMethod,
        paymentStatus,
        totalAmount,
        depositAmount,
        shortId,
        manualDeactivation,
        guestRating,
        guestFeedback,
        billingMode,
        companyId,
        contractId,
        allocationId,
    ]);

    return {
        editingId,
        guestName,
        setGuestName,
        guestPhone,
        setGuestPhone,
        propertyId,
        setPropertyId,
        flatNumber,
        setFlatNumber,
        lockCode,
        setLockCode,
        welcomeMessage,
        setWelcomeMessage,
        adminNotes,
        setAdminNotes,
        guestAlertActive,
        setGuestAlertActive,
        guestAlertText,
        setGuestAlertText,
        checkInDate,
        setCheckInDate,
        checkoutDate,
        setCheckoutDate,
        checkInTime,
        setCheckInTime,
        checkOutTime,
        setCheckOutTime,
        guestCount,
        setGuestCount,
        paymentMethod,
        setPaymentMethod,
        paymentStatus,
        setPaymentStatus,
        totalAmount,
        setTotalAmount,
        depositAmount,
        setDepositAmount,
        shortId,
        setShortId,
        manualDeactivation,
        setManualDeactivation,
        guestRating,
        setGuestRating,
        guestFeedback,
        setGuestFeedback,
        billingMode,
        setBillingMode,
        companyId,
        setCompanyId,
        contractId,
        setContractId,
        allocationId,
        setAllocationId,
        generatedLink,
        setGeneratedLink,
        isSaving,
        setIsSaving,
        resetForm,
        loadReservation,
        getFormValues,
    };
};
