import { useState, useEffect, useCallback } from 'react';
import { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import {
    subscribeToActiveReservations,
    fetchHistoryReservations,
    saveReservation,
    updateReservation,
    deleteReservation,
} from '../services/firebase';
import { Reservation, PropertyId, UserPermission } from '../types';
import { logger } from '../utils/logger';

interface UseReservationsOptions {
    userPermission: UserPermission | null;
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useReservations = ({ userPermission, showToast }: UseReservationsOptions) => {
    // Data State
    const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
    const [historyReservations, setHistoryReservations] = useState<Reservation[]>([]);

    // History Pagination
    const [lastHistoryDoc, setLastHistoryDoc] = useState<unknown>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [hasMoreHistory, setHasMoreHistory] = useState(true);

    // Get filter properties based on user permission
    const getFilterProps = useCallback((): PropertyId[] | undefined => {
        if (!userPermission) return undefined;
        return userPermission.role === 'super_admin'
            ? undefined
            : userPermission.allowedProperties;
    }, [userPermission]);

    // Load history with pagination
    const loadMoreHistory = useCallback(async (reset = false) => {
        if (loadingHistory) return;
        setLoadingHistory(true);
        try {
            const lastDoc = reset
                ? null
                : (lastHistoryDoc as QueryDocumentSnapshot<unknown, DocumentData> | null);

            const filterProps = getFilterProps();

            const { data, lastVisible, hasMore } = await fetchHistoryReservations(
                lastDoc,
                20,
                filterProps
            );

            // Double check filter by permission
            const filteredData = data.filter(
                (r) =>
                    !userPermission ||
                    userPermission.role === 'super_admin' ||
                    userPermission.allowedProperties.includes(r.propertyId || 'lili')
            );

            setHistoryReservations((prev) => (reset ? filteredData : [...prev, ...filteredData]));
            setLastHistoryDoc(lastVisible);
            setHasMoreHistory(hasMore);
        } catch (e) {
            logger.error('Erro ao carregar histórico', e);
            showToast('Erro ao carregar histórico', 'error');
        } finally {
            setLoadingHistory(false);
        }
    }, [loadingHistory, lastHistoryDoc, userPermission, getFilterProps, showToast]);

    // Subscribe to active reservations
    useEffect(() => {
        if (!userPermission) return;

        const filterProps = getFilterProps();
        const unsubActive = subscribeToActiveReservations((data) => {
            setActiveReservations(data);
        }, filterProps);

        loadMoreHistory(true);

        return () => {
            unsubActive();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPermission]);

    // CRUD Operations
    const createReservation = useCallback(async (payload: Reservation): Promise<void> => {
        await saveReservation(payload);
    }, []);

    const editReservation = useCallback(async (id: string, payload: Reservation): Promise<void> => {
        await updateReservation(id, payload);
    }, []);

    const removeReservation = useCallback(async (id: string): Promise<void> => {
        await deleteReservation(id);
        setHistoryReservations((prev) => prev.filter((r) => r.id !== id));
        setActiveReservations((prev) => prev.filter((r) => r.id !== id));
    }, []);

    return {
        // Data
        activeReservations,
        historyReservations,

        // Pagination
        loadingHistory,
        hasMoreHistory,
        loadMoreHistory,

        // CRUD
        createReservation,
        editReservation,
        removeReservation,
    };
};

export default useReservations;
