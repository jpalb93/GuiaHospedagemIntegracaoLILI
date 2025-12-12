import { useState, useCallback } from 'react';
import { PropertyId, PaymentMethod, Reservation } from '../types';
import { PROPERTIES } from '../config/properties';
import { fetchOfficialTime } from '../constants';

// ReservationFormState removed - now using ReservationFormData from types.ts


export const useReservationForm = () => {
    // Form State
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
    const [shortId, setShortId] = useState('');

    // Rating / Quality Control (Internal)
    const [guestRating, setGuestRating] = useState<number>(5);
    const [guestFeedback, setGuestFeedback] = useState('');

    // UI State
    const [generatedLink, setGeneratedLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Reset form to default values
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
        setShortId('');
        setGuestRating(5);
        setGuestFeedback('');
    }, [propertyId]);

    // Load existing reservation for editing
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
        setShortId(res.shortId || '');
        setGuestRating(res.guestRating || 5);
        setGuestFeedback(res.guestFeedback || '');
        setGeneratedLink('');
    }, []);

    // Get current form values as object
    const getFormValues = useCallback((): Omit<Reservation, 'id' | 'createdAt' | 'status'> => ({
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
        paymentMethod: paymentMethod as PaymentMethod | undefined,
        shortId,
        guestRating,
        guestFeedback,
    }), [
        guestName, guestPhone, propertyId, flatNumber, lockCode,
        welcomeMessage, adminNotes, guestAlertActive, guestAlertText,
        checkInDate, checkoutDate, checkInTime, checkOutTime,
        guestCount, paymentMethod, shortId, guestRating, guestFeedback
    ]);

    return {
        // State
        editingId,
        guestName, setGuestName,
        guestPhone, setGuestPhone,
        propertyId, setPropertyId,
        flatNumber, setFlatNumber,
        lockCode, setLockCode,
        welcomeMessage, setWelcomeMessage,
        adminNotes, setAdminNotes,
        guestAlertActive, setGuestAlertActive,
        guestAlertText, setGuestAlertText,
        checkInDate, setCheckInDate,
        checkoutDate, setCheckoutDate,
        checkInTime, setCheckInTime,
        checkOutTime, setCheckOutTime,
        guestCount, setGuestCount,
        paymentMethod, setPaymentMethod,
        shortId, setShortId,
        guestRating, setGuestRating,
        guestFeedback, setGuestFeedback,

        // UI State
        generatedLink, setGeneratedLink,
        isSaving, setIsSaving,

        // Actions
        resetForm,
        loadReservation,
        getFormValues,
    };
};

export default useReservationForm;
