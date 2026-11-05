import { useState, useCallback } from 'react';
import {
    PropertyId,
    PaymentMethod,
    PaymentStatus,
    PaymentRecord,
    Reservation,
    ReservationBillingMode,
} from '../types';
import { PROPERTIES } from '../config/properties';
import { fetchOfficialTime } from '../constants';

export const useReservationForm = () => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [guestName, setGuestName] = useState('');
    const [guestPhone, setGuestPhone] = useState('');
    const [propertyId, setPropertyIdState] = useState<PropertyId>('lili');
    const [flatNumber, setFlatNumber] = useState('');
    const [lockCode, setLockCode] = useState('');
    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [guestAlertActive, setGuestAlertActive] = useState(false);
    const [guestAlertText, setGuestAlertText] = useState('');
    const [stayType, setStayTypeState] = useState<'overnight' | 'day_use'>('overnight');
    const [checkInDate, setCheckInDateState] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [checkInTime, setCheckInTimeState] = useState('14:00');
    const [checkOutTime, setCheckOutTime] = useState('11:00');
    const [guestCount, setGuestCount] = useState<number>(1);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
    const [totalAmount, setTotalAmount] = useState<number | ''>('');
    const [depositAmount, setDepositAmount] = useState<number | ''>('');
    const [paidAt, setPaidAt] = useState<string>('');
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [shortId, setShortId] = useState('');
    const [manualDeactivation, setManualDeactivation] = useState(false);

    const [billingMode, setBillingModeState] = useState<ReservationBillingMode>('reservation');
    const [companyId, setCompanyId] = useState('');
    const [contractId, setContractId] = useState('');
    const [allocationId, setAllocationId] = useState('');

    const [guestRating, setGuestRating] = useState<number>(5);
    const [guestFeedback, setGuestFeedback] = useState('');

    const [generatedLink, setGeneratedLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const setCheckInTime = useCallback(
        (value: string) => {
            setCheckInTimeState(value);
            if (stayType !== 'day_use') return;
            if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
                setCheckOutTime('');
                return;
            }
            const [hours, minutes] = value.split(':').map(Number);
            const exitMinutes = hours * 60 + minutes + 4 * 60;
            // Day use stays on the same date; do not silently wrap into the next day.
            setCheckOutTime(
                exitMinutes < 24 * 60
                    ? `${String(Math.floor(exitMinutes / 60)).padStart(2, '0')}:${String(exitMinutes % 60).padStart(2, '0')}`
                    : ''
            );
        },
        [stayType]
    );

    const setCheckInDate = useCallback(
        (value: string) => {
            setCheckInDateState(value);
            if (stayType === 'day_use') setCheckoutDate(value);
        },
        [stayType]
    );

    const setStayType = useCallback(
        (value: 'overnight' | 'day_use') => {
            if (value === 'day_use' && (propertyId !== 'integracao' || billingMode === 'corporate'))
                return;
            setStayTypeState(value);
            if (value === 'day_use') {
                setCheckoutDate(checkInDate);
                setCheckInTimeState('08:00');
                setCheckOutTime('12:00');
                setGuestCount(1);
            } else {
                setCheckInTimeState(PROPERTIES[propertyId].defaults.checkInTime);
                setCheckOutTime(PROPERTIES[propertyId].defaults.checkOutTime);
                if (checkInDate && checkoutDate <= checkInDate) {
                    const nextDay = new Date(`${checkInDate}T12:00:00Z`);
                    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
                    setCheckoutDate(nextDay.toISOString().slice(0, 10));
                }
            }
        },
        [propertyId, billingMode, checkInDate, checkoutDate]
    );

    const setPropertyId = useCallback(
        (value: PropertyId) => {
            if (stayType === 'day_use' && value !== 'integracao') {
                setStayType('overnight');
                setCheckInTimeState(PROPERTIES[value].defaults.checkInTime);
                setCheckOutTime(PROPERTIES[value].defaults.checkOutTime);
            }
            setPropertyIdState(value);
        },
        [stayType, setStayType]
    );

    const setBillingMode = useCallback(
        (value: ReservationBillingMode) => {
            if (stayType === 'day_use' && value === 'corporate') setStayType('overnight');
            setBillingModeState(value);
        },
        [stayType, setStayType]
    );

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

        setStayTypeState('overnight');
        setCheckInDateState(`${yyyy}-${mm}-${dd}`);
        setCheckoutDate(`${t_yyyy}-${t_mm}-${t_dd}`);
        setCheckInTimeState(PROPERTIES[propertyId].defaults.checkInTime);
        setCheckOutTime(PROPERTIES[propertyId].defaults.checkOutTime);
        setGuestName('');
        setGuestPhone('');
        setPropertyIdState('lili');
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
        setPaidAt('');
        setPayments([]);
        setShortId('');
        setManualDeactivation(false);
        setGuestRating(5);
        setGuestFeedback('');
        setBillingModeState('reservation');
        setCompanyId('');
        setContractId('');
        setAllocationId('');
    }, [propertyId]);

    const loadReservation = useCallback((res: Reservation) => {
        setEditingId(res.id!);
        setGuestName(res.guestName);
        setGuestPhone(res.guestPhone || '');
        setPropertyIdState(res.propertyId || 'lili');
        setFlatNumber(res.flatNumber || '');
        setLockCode(res.lockCode || '');
        setWelcomeMessage(res.welcomeMessage || '');
        setAdminNotes(res.adminNotes || '');
        setGuestAlertActive(res.guestAlertActive || false);
        setGuestAlertText(res.guestAlertText || '');
        setStayTypeState(res.stayType || 'overnight');
        setCheckInDateState(res.checkInDate || '');
        setCheckoutDate(res.checkoutDate || '');
        setCheckInTimeState(res.checkInTime || '14:00');
        setCheckOutTime(res.checkOutTime || '11:00');
        setGuestCount(res.guestCount || 1);
        setPaymentMethod(res.paymentMethod || '');
        setPaymentStatus(res.paymentStatus || 'pending');
        setTotalAmount(res.totalAmount !== undefined ? res.totalAmount : '');
        setDepositAmount(res.depositAmount !== undefined ? res.depositAmount : '');
        setPaidAt(res.paidAt || '');
        setPayments(res.payments || []);
        setShortId(res.shortId || '');
        setManualDeactivation(res.manualDeactivation || false);
        setGuestRating(res.guestRating || 5);
        setGuestFeedback(res.guestFeedback || '');
        setBillingModeState(res.billingMode === 'corporate' ? 'corporate' : 'reservation');
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
            stayType,
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
            paidAt: isCorporate ? undefined : paidAt ? paidAt : undefined,
            payments: isCorporate
                ? undefined
                : payments && payments.length > 0
                  ? payments
                  : undefined,
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
        stayType,
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
        paidAt,
        payments,
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
        stayType,
        setStayType,
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
        paidAt,
        setPaidAt,
        payments,
        setPayments,
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
