import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { generateShortId } from '../utils/helpers';
import { User } from 'firebase/auth';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import {
    subscribeToAuth, loginCMS, logoutCMS,
    subscribeToActiveReservations, fetchHistoryReservations,
    subscribeToFutureBlockedDates, saveReservation, updateReservation,
    deleteReservation, addBlockedDate, deleteBlockedDate
} from '../services/firebase';
import { fetchOfficialTime } from '../constants';
import { isApiConfigured } from '../services/geminiService';
import { Reservation, BlockedDateRange, PropertyId, PaymentMethod } from '../types';
import { PROPERTIES } from '../config/properties';
import { ToastMessage, ToastType } from '../components/Toast';
import { getUserPermission } from '../services/userManagement';
import { UserPermission } from '../types';

export const useAdminDashboard = () => {
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [userPermission, setUserPermission] = useState<UserPermission | null>(null);

    // Data State
    const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
    const [historyReservations, setHistoryReservations] = useState<Reservation[]>([]);
    const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);

    // History Pagination
    const [lastHistoryDoc, setLastHistoryDoc] = useState<unknown>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);

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

    // Blocked Dates Form State
    const [blockedStartDate, setBlockedStartDate] = useState('');
    const [blockedEndDate, setBlockedEndDate] = useState('');
    const [blockedReason, setBlockedReason] = useState('');
    const [isBlocking, setIsBlocking] = useState(false);

    // UI State
    const [activeTab, setActiveTab] = useState<'home' | 'create' | 'list' | 'calendar' | 'blocks' | 'places' | 'tips' | 'reviews' | 'suggestions' | 'settings'>(() => {
        const saved = localStorage.getItem('admin_active_tab');
        return (saved as any) || 'home';
    });

    useEffect(() => {
        localStorage.setItem('admin_active_tab', activeTab);
    }, [activeTab]);

    const [searchTerm, setSearchTerm] = useState('');
    const [generatedLink, setGeneratedLink] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    // Modal State
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        isDestructive: false
    });

    // --- HELPERS ---
    const showToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now().toString() + Math.random().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 4000);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const loadMoreHistory = async (reset = false) => {
        if (loadingHistory) return;
        setLoadingHistory(true);
        try {
            const lastDoc = reset ? null : (lastHistoryDoc as QueryDocumentSnapshot<unknown, DocumentData> | null);

            const filterProps = userPermission?.role === 'super_admin' ? undefined : userPermission?.allowedProperties;

            const { data, lastVisible, hasMore } = await fetchHistoryReservations(lastDoc, 20, filterProps);

            // FILTER HISTORY BY PERMISSION (Double check)
            const filteredData = data.filter(r =>
                !userPermission ||
                userPermission.role === 'super_admin' ||
                userPermission.allowedProperties.includes(r.propertyId || 'lili')
            );

            setHistoryReservations(prev => reset ? filteredData : [...prev, ...filteredData]);
            setLastHistoryDoc(lastVisible);
            setHasMoreHistory(hasMore);



        } catch (e) {
            logger.error("Erro ao carregar histórico", e);
            showToast("Erro ao carregar histórico", "error");
        } finally {
            setLoadingHistory(false);
        }
    };

    const resetForm = async () => {
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

        setBlockedStartDate(`${yyyy}-${mm}-${dd}`);
        setBlockedEndDate(`${t_yyyy}-${t_mm}-${t_dd}`);
        setBlockedReason('');
    };

    // --- AUTH LISTENER ---
    useEffect(() => {
        const unsubscribe = subscribeToAuth(async (u) => {
            setUser(u);
            if (u && u.email) {
                const perm = await getUserPermission(u.email);
                setUserPermission(perm);
            } else {
                setUserPermission(null);
            }
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- DATA LISTENERS ---
    useEffect(() => {
        if (user) {
            if (!userPermission) {
                // Removido toast de erro prematuro. O AdminDashboard mostrará um banner se necessário.
                return;
            }

            // AUTO-SELECT PROPERTY FOR RESTRICTED USERS
            if (userPermission.role !== 'super_admin' && userPermission.allowedProperties.length === 1) {
                setPropertyId(userPermission.allowedProperties[0]);
            }

            // Determine filters based on role
            const filterProps = userPermission.role === 'super_admin' ? undefined : userPermission.allowedProperties;

            const unsubActive = subscribeToActiveReservations((data) => {
                // O filtro por propriedade já é feito no serviço Firebase
                setActiveReservations(data);
            }, filterProps);

            loadMoreHistory(true);
            const unsubBlocked = subscribeToFutureBlockedDates(setBlockedDates);

            return () => {
                unsubActive();
                unsubBlocked();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userPermission, authLoading]);

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
                    logger.info(`[AdminDashboard] Tab visible after ${Math.round(timeInBackground / 1000)}s - refreshing data`);

                    if (reloadTimeout) clearTimeout(reloadTimeout);

                    reloadTimeout = setTimeout(() => {
                        // Força reload do histórico
                        loadMoreHistory(true);

                        // Mostra feedback ao usuário
                        showToast("Dados atualizados", "info");
                    }, 300);
                }
            } else {
                // Aba ficou invisível - marca o tempo
                lastVisibleTime = Date.now();
            }
        };

        // Também detecta quando a página foi restaurada do cache (bfcache)
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted && user && userPermission) {
                logger.info('[AdminDashboard] Page restored from bfcache - refreshing');
                loadMoreHistory(true);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pageshow', handlePageShow);
            if (reloadTimeout) clearTimeout(reloadTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userPermission]);

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
        e.preventDefault();
        try {
            await loginCMS(email, pass);
            showToast("Bem-vindo de volta!", "success");
        } catch (_e) {
            showToast("Erro ao entrar. Verifique email e senha.", "error");
        }
    };

    const handleSaveReservation = async () => {
        if (!guestName.trim()) { showToast("Preencha o nome do hóspede.", "warning"); return; }

        // PERMISSION CHECK
        if (userPermission && userPermission.role !== 'super_admin' && !userPermission.allowedProperties.includes(propertyId)) {
            showToast("Você não tem permissão para criar reservas nesta propriedade.", "error");
            return;
        }

        // Validação condicional baseada na propriedade
        if (propertyId === 'lili' && !lockCode.trim()) {
            showToast("Defina a senha da porta.", "warning"); return;
        }
        if (propertyId === 'integracao' && !flatNumber.trim()) {
            showToast("Defina o número do flat.", "warning"); return;
        }

        if (!checkInDate || !checkoutDate) { showToast("Verifique as datas de entrada e saída.", "warning"); return; }
        if (!checkInTime.includes(':') || !checkOutTime.includes(':')) { showToast("Verifique os horários.", "warning"); return; }

        const start = new Date(checkInDate);
        const end = new Date(checkoutDate);
        start.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);

        if (end <= start) {
            showToast("O Check-out deve ser DEPOIS do Check-in.", "error");
            return;
        }

        setIsSaving(true);
        try {
            // Use existing shortId if editing, otherwise generate new one
            const finalShortId = (editingId && shortId) ? shortId : generateShortId();

            const payload: Reservation = {
                guestName: guestName.trim(),
                guestPhone: guestPhone.replace(/\D/g, ''),
                propertyId,
                flatNumber: flatNumber.trim(),
                lockCode: lockCode.trim(),
                welcomeMessage: welcomeMessage.trim(), adminNotes: adminNotes.trim(),
                guestAlertActive: guestAlertActive,
                guestAlertText: guestAlertText.trim(),
                checkInDate: checkInDate, checkoutDate: checkoutDate,
                checkInTime: checkInTime, checkOutTime: checkOutTime,
                status: 'active', createdAt: '',
                shortId: finalShortId, // Passando o ID curto gerado
                guestCount,
                paymentMethod: paymentMethod as 'pix' | 'money' | 'card' | undefined
            };

            if (editingId) {
                await updateReservation(editingId, payload);
                showToast("Reserva atualizada com sucesso!", "success");
                resetForm();
            } else {
                await saveReservation(payload);
                const baseUrl = window.location.origin + '/';
                // LINK BONITO: domain.com/ABC1234
                const link = `${baseUrl}${finalShortId}`;
                setGeneratedLink(link);
                showToast("Reserva criada! Link curto gerado.", "success");
            }
        } catch (e) {
            showToast("Erro ao salvar reserva.", "error");
            logger.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteReservation = async (id?: string) => {
        if (!id) return;
        setConfirmModal({
            isOpen: true,
            title: "Excluir Reserva",
            message: "Tem certeza que deseja excluir esta reserva permanentemente? Esta ação não pode ser desfeita.",
            isDestructive: true,
            onConfirm: async () => {
                await deleteReservation(id);
                setHistoryReservations(prev => prev.filter(r => r.id !== id));
                setActiveReservations(prev => prev.filter(r => r.id !== id));
                showToast("Reserva excluída.", "success");
            }
        });
    };

    const handleStartEdit = (res: Reservation) => {
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

        setActiveTab('create');
        setGeneratedLink('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast("Editando reserva de " + res.guestName, "info");
    };

    const handleAddBlock = async () => {
        if (!blockedStartDate || !blockedEndDate) {
            showToast("Selecione as datas de início e fim.", "warning");
            return;
        }
        if (blockedEndDate < blockedStartDate) {
            showToast("A data final deve ser depois da data inicial.", "warning");
            return;
        }

        setIsBlocking(true);
        try {
            await addBlockedDate({
                startDate: blockedStartDate,
                endDate: blockedEndDate,
                reason: blockedReason
            });
            setBlockedReason('');
            showToast("Datas bloqueadas com sucesso!", "success");
        } catch (_e) {
            showToast("Erro ao bloquear datas.", "error");
        } finally {
            setIsBlocking(false);
        }
    };

    const handleDeleteBlock = async (id?: string) => {
        if (!id) return;
        setConfirmModal({
            isOpen: true,
            title: "Desbloquear Datas",
            message: "Tem certeza que deseja remover este bloqueio de datas?",
            isDestructive: false,
            onConfirm: async () => {
                await deleteBlockedDate(id);
                showToast("Datas desbloqueadas.", "success");
            }
        });
    };

    return {
        auth: { user, authLoading, handleLogin, logoutCMS, userPermission },
        data: { activeReservations, historyReservations, blockedDates, loadMoreHistory, hasMoreHistory, loadingHistory },
        form: {
            guestName, setGuestName, guestPhone, setGuestPhone, lockCode, setLockCode,
            propertyId, setPropertyId, flatNumber, setFlatNumber,
            welcomeMessage, setWelcomeMessage, adminNotes, setAdminNotes,
            guestAlertActive, setGuestAlertActive, guestAlertText, setGuestAlertText,
            checkInDate, setCheckInDate, checkoutDate, setCheckoutDate,
            checkInTime, setCheckInTime, checkOutTime, setCheckOutTime,
            guestCount, setGuestCount, paymentMethod, setPaymentMethod,
            editingId, handleSaveReservation, handleDeleteReservation, handleStartEdit, resetForm, isSaving
        },
        blocks: {
            blockedStartDate, setBlockedStartDate, blockedEndDate, setBlockedEndDate,
            blockedReason, setBlockedReason, isBlocking, handleAddBlock, handleDeleteBlock
        },
        ui: {
            activeTab, setActiveTab, searchTerm, setSearchTerm,
            generatedLink, setGeneratedLink,
            apiKeyStatus, toasts, showToast, removeToast,
            confirmModal, setConfirmModal
        }
    }
};
