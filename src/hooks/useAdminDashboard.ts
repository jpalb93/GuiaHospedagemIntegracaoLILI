import { useState, useEffect, useCallback } from 'react';
import { logger } from '../utils/logger';
import { generateShortId } from '../utils/helpers';
import { saveReservation, updateReservation } from '../services/firebase/reservations';
import { isApiConfigured } from '../services/geminiService';
import { Reservation } from '../types';
import { useAdminAuth } from './useAdminAuth';
import { useToast } from '../contexts/ToastContext';
import { useReservations } from './useReservations';
import { useReservationForm } from './useReservationForm';
import { useBlockedDates } from './useBlockedDates';

export const useAdminDashboard = () => {
    // Use extracted auth hook
    const { user, userPermission, authLoading, login, logout } = useAdminAuth();

    // Use extracted toast hook
    const { showSuccess, showError, showWarning, showInfo } = useToast();

    // Compatibility wrapper for old showToast call signature
    const showToast = useCallback(
        (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
            const toastFunctions = {
                success: showSuccess,
                error: showError,
                warning: showWarning,
                info: showInfo,
            };
            toastFunctions[type](message);
        },
        [showSuccess, showError, showWarning, showInfo]
    );

    // Use extracted reservations hook
    const {
        activeReservations,
        historyReservations,
        loadingHistory,
        hasMoreHistory,
        loadMoreHistory,
        refreshHistory,
        removeReservation,
    } = useReservations({ userPermission, showToast });

    // Use extracted form hook
    const reservationForm = useReservationForm();
    const {
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
        shortId,
        manualDeactivation,
        setManualDeactivation,
        generatedLink,
        setGeneratedLink,
        isSaving,
        setIsSaving,
        resetForm: resetReservationForm,
        loadReservation,
        getFormValues,
        guestRating,
        setGuestRating,
        guestFeedback,
        setGuestFeedback,
    } = reservationForm;

    // Use extracted blocked dates hook
    const blockedDatesHook = useBlockedDates({ showToast });
    const {
        blockedDates,
        blockedStartDate,
        setBlockedStartDate,
        blockedEndDate,
        setBlockedEndDate,
        blockedReason,
        setBlockedReason,
        isBlocking,
        subscribe: subscribeToBlockedDates,
        resetBlockedForm,
        handleAddBlock,
        handleDeleteBlock: deleteBlock,
    } = blockedDatesHook;

    // UI State
    type AdminTab =
        | 'home'
        | 'create'
        | 'list'
        | 'calendar'
        | 'blocks'
        | 'places'
        | 'tips'
        | 'reviews'
        | 'suggestions'
        | 'settings'
        | 'analytics'
        | 'logs';

    const [activeTab, setActiveTab] = useState<AdminTab>(() => {
        const saved = localStorage.getItem('admin_active_tab');
        return (saved as AdminTab) || 'home';
    });

    useEffect(() => {
        localStorage.setItem('admin_active_tab', activeTab);
    }, [activeTab]);

    const [searchTerm, setSearchTerm] = useState('');
    const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        isDestructive: false,
        onConfirm: async () => { },
    });

    // Reset form wrapper that also resets blocked dates
    const resetForm = useCallback(async () => {
        await resetReservationForm();
        await resetBlockedForm();
    }, [resetReservationForm, resetBlockedForm]);

    // --- DATA LISTENERS (Blocked Dates Only - Reservations handled by useReservations) ---
    useEffect(() => {
        if (user && userPermission) {
            // AUTO-SELECT PROPERTY FOR RESTRICTED USERS
            if (
                userPermission.role !== 'super_admin' &&
                userPermission.allowedProperties.length === 1
            ) {
                setPropertyId(userPermission.allowedProperties[0]);
            }

            let unsubBlocked: (() => void) | undefined;
            subscribeToBlockedDates().then((unsub) => {
                unsubBlocked = unsub;
            });

            return () => {
                if (unsubBlocked) unsubBlocked();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userPermission, subscribeToBlockedDates]);

    // --- VISIBILITY CHANGE HANDLER (RECONEXÃO QUANDO ABA VOLTA) ---
    useEffect(() => {
        let reloadTimeout: ReturnType<typeof setTimeout> | null = null;
        let lastVisibleTime = Date.now();
        const STALE_THRESHOLD_MS = 30000; // 30 segundos em background = dados podem estar stale

        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible') {
                const timeInBackground = Date.now() - lastVisibleTime;

                // Se ficou mais de 30s em background, os dados podem estar stale
                if (timeInBackground > STALE_THRESHOLD_MS && user && userPermission) {
                    logger.info(
                        `[AdminDashboard] Tab visible after ${Math.round(timeInBackground / 1000)}s - refreshing data`
                    );

                    if (reloadTimeout) clearTimeout(reloadTimeout);

                    reloadTimeout = setTimeout(() => {
                        // Força reload do histórico
                        refreshHistory();

                        // Mostra feedback ao usuário
                        showToast('Dados atualizados', 'info');
                    }, 300);
                }
            } else {
                // Aba ficou invisível - marca o tempo
                lastVisibleTime = Date.now();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (reloadTimeout) clearTimeout(reloadTimeout);
        };
    }, [user, userPermission, loadMoreHistory, showToast, refreshHistory]);

    // --- API KEY CHECK ---
    useEffect(() => {
        if (isApiConfigured) setApiKeyStatus('ok');
        else setApiKeyStatus('missing');
    }, []);

    // --- INIT DATES ---
    useEffect(() => {
        resetForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // --- ACTIONS ---
    const handleLogin = async (e: React.FormEvent, email: string, pass: string) => {
        const result = await login(e, email, pass);
        if (result.success) {
            showToast('Bem-vindo de volta!', 'success');
        } else {
            showToast(result.error || 'Erro ao entrar. Verifique email e senha.', 'error');
        }
    };

    const handleSaveReservation = async (overrides?: Partial<Reservation>) => {
        if (!guestName.trim()) {
            showToast('Preencha o nome do hóspede.', 'warning');
            return;
        }

        // PERMISSION CHECK
        if (
            userPermission &&
            userPermission.role !== 'super_admin' &&
            !userPermission.allowedProperties.includes(propertyId)
        ) {
            showToast('Você não tem permissão para criar reservas nesta propriedade.', 'error');
            return;
        }

        // Validação condicional baseada na propriedade
        if (propertyId === 'lili' && !lockCode.trim()) {
            showToast('Defina a senha da porta.', 'warning');
            return;
        }
        if (propertyId === 'integracao' && !flatNumber.trim()) {
            showToast('Defina o número do flat.', 'warning');
            return;
        }

        if (!checkInDate || !checkoutDate) {
            showToast('Verifique as datas de entrada e saída.', 'warning');
            return;
        }
        if (!checkInTime.includes(':') || !checkOutTime.includes(':')) {
            showToast('Verifique os horários.', 'warning');
            return;
        }

        const start = new Date(checkInDate);
        const end = new Date(checkoutDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end <= start) {
            showToast('O Check-out deve ser DEPOIS do Check-in.', 'error');
            return;
        }

        setIsSaving(true);
        try {
            // Use existing shortId if editing, otherwise generate new one
            const finalShortId = editingId && shortId ? shortId : generateShortId();

            const formValues = getFormValues();
            const payload: Reservation = {
                ...formValues,
                ...overrides, // Apply overrides here (e.g. manualDeactivation: true)
                status: 'active',
                createdAt: '',
                shortId: finalShortId,
                paymentMethod: (overrides?.paymentMethod ?? formValues.paymentMethod) as
                    | 'pix'
                    | 'money'
                    | 'card'
                    | undefined,
                manualDeactivation:
                    overrides?.manualDeactivation ?? formValues.manualDeactivation ?? false,
            };

            if (editingId) {
                await updateReservation(editingId, payload);
                showToast('Reserva atualizada com sucesso!', 'success');
                resetReservationForm();
            } else {
                await saveReservation(payload);
                const baseUrl = window.location.origin + '/';
                // LINK BONITO: domain.com/ABC1234
                const link = `${baseUrl}${finalShortId}`;
                setGeneratedLink(link);
                showToast('Reserva criada! Link curto gerado.', 'success');
            }
        } catch (e) {
            showToast('Erro ao salvar reserva.', 'error');
            logger.error('Erro ao salvar reserva.', { error: e });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteReservation = async (id?: string) => {
        if (!id) return;
        setConfirmModal({
            isOpen: true,
            title: 'Excluir Reserva',
            message:
                'Tem certeza que deseja excluir esta reserva permanentemente? Esta ação não pode ser desfeita.',
            isDestructive: true,
            onConfirm: async () => {
                await removeReservation(id);
                showToast('Reserva excluída.', 'success');
            },
        });
    };

    const handleStartEdit = (res: Reservation) => {
        loadReservation(res);
        setActiveTab('create');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast('Editando reserva de ' + res.guestName, 'info');
    };

    const handleDeleteBlock = async (id?: string) => {
        if (!id) return;
        setConfirmModal({
            isOpen: true,
            title: 'Desbloquear Datas',
            message: 'Tem certeza que deseja remover este bloqueio de datas?',
            isDestructive: false,
            onConfirm: async () => {
                await deleteBlock(id);
            },
        });
    };

    return {
        auth: { user, authLoading, handleLogin, logout, userPermission },
        data: {
            activeReservations,
            historyReservations,
            blockedDates,
            loadMoreHistory,
            hasMoreHistory,
            loadingHistory,
        },
        form: {
            guestName,
            setGuestName,
            guestPhone,
            setGuestPhone,
            lockCode,
            setLockCode,
            propertyId,
            setPropertyId,
            flatNumber,
            setFlatNumber,
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
            guestRating,
            setGuestRating,
            guestFeedback,
            setGuestFeedback,
            editingId,
            handleSaveReservation,
            handleDeleteReservation,
            handleStartEdit,
            resetForm,
            isSaving,
            manualDeactivation,
            setManualDeactivation,
        },
        blocks: {
            blockedStartDate,
            setBlockedStartDate,
            blockedEndDate,
            setBlockedEndDate,
            blockedReason,
            setBlockedReason,
            isBlocking,
            handleAddBlock,
            handleDeleteBlock,
        },
        ui: {
            activeTab,
            setActiveTab,
            searchTerm,
            setSearchTerm,
            generatedLink,
            setGeneratedLink,
            apiKeyStatus,
            showToast,
            confirmModal,
            setConfirmModal,
        },
    };
};
