import { useState, useCallback } from 'react';
import { BlockedDateRange } from '../types';
import {
    subscribeToFutureBlockedDates,
    addBlockedDate,
    deleteBlockedDate,
} from '../services/firebase';
import { fetchOfficialTime } from '../constants';

interface UseBlockedDatesOptions {
    showToast: (msg: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useBlockedDates = ({ showToast }: UseBlockedDatesOptions) => {
    // Blocked Dates Data
    const [blockedDates, setBlockedDates] = useState<BlockedDateRange[]>([]);

    // Blocked Dates Form State
    const [blockedStartDate, setBlockedStartDate] = useState('');
    const [blockedEndDate, setBlockedEndDate] = useState('');
    const [blockedReason, setBlockedReason] = useState('');
    const [isBlocking, setIsBlocking] = useState(false);

    // Initialize form with today/tomorrow dates
    const resetBlockedForm = useCallback(async () => {
        const officialNow = await fetchOfficialTime();
        const yyyy = officialNow.getFullYear();
        const mm = String(officialNow.getMonth() + 1).padStart(2, '0');
        const dd = String(officialNow.getDate()).padStart(2, '0');

        const tomorrow = new Date(officialNow);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const t_yyyy = tomorrow.getFullYear();
        const t_mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const t_dd = String(tomorrow.getDate()).padStart(2, '0');

        setBlockedStartDate(`${yyyy}-${mm}-${dd}`);
        setBlockedEndDate(`${t_yyyy}-${t_mm}-${t_dd}`);
        setBlockedReason('');
    }, []);

    // Subscribe to blocked dates
    const subscribe = useCallback(() => {
        return subscribeToFutureBlockedDates(setBlockedDates);
    }, []);

    // Add a new blocked date range
    const handleAddBlock = useCallback(async () => {
        if (!blockedStartDate || !blockedEndDate) {
            showToast('Selecione as datas de início e fim.', 'warning');
            return;
        }

        if (new Date(blockedEndDate) < new Date(blockedStartDate)) {
            showToast('Data de fim deve ser após a data de início.', 'warning');
            return;
        }

        setIsBlocking(true);
        try {
            await addBlockedDate({
                startDate: blockedStartDate,
                endDate: blockedEndDate,
                reason: blockedReason.trim() || 'Bloqueio manual',
            });
            showToast('Período bloqueado com sucesso!', 'success');
            await resetBlockedForm();
        } catch (error) {
            showToast('Erro ao bloquear período.', 'error');
        } finally {
            setIsBlocking(false);
        }
    }, [blockedStartDate, blockedEndDate, blockedReason, showToast, resetBlockedForm]);

    // Delete a blocked date range
    const handleDeleteBlock = useCallback(async (id: string) => {
        try {
            await deleteBlockedDate(id);
            showToast('Bloqueio removido.', 'success');
        } catch (error) {
            showToast('Erro ao remover bloqueio.', 'error');
        }
    }, [showToast]);

    return {
        // Data
        blockedDates,

        // Form State
        blockedStartDate,
        setBlockedStartDate,
        blockedEndDate,
        setBlockedEndDate,
        blockedReason,
        setBlockedReason,
        isBlocking,

        // Actions
        subscribe,
        resetBlockedForm,
        handleAddBlock,
        handleDeleteBlock,
    };
};

export default useBlockedDates;
