import { useState, useEffect, useCallback } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import {
    subscribeToActiveReservations,
    fetchHistoryReservations,
    saveReservation,
    updateReservation,
    deleteReservation,
    ReservationSyncInfo,
    ReservationSyncStatus,
} from '../services/firebase/reservations';
import { Reservation, UserPermission } from '../types';
import { logger } from '../utils/logger';

interface UseReservationsOptions {
    userPermission: UserPermission | null;
    showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const useReservations = ({ userPermission, showToast }: UseReservationsOptions) => {
    const queryClient = useQueryClient();

    // --- 1. Real-time Active Reservations (Firestore Listener) ---
    // React Query doesn't natively support streams easily without third-party adapters,
    // and maintaining the live socket is good for "Active" view.
    const [activeReservations, setActiveReservations] = useState<Reservation[]>([]);
    const [activeSyncStatus, setActiveSyncStatus] = useState<ReservationSyncStatus>('connecting');
    const [activeSyncError, setActiveSyncError] = useState<Error | null>(null);
    const [subKey, setSubKey] = useState(0);

    const refreshActive = useCallback(() => {
        setActiveSyncStatus('connecting');
        setActiveSyncError(null);
        setSubKey((k) => k + 1);
    }, []);

    // Timer para recalcular o listener na virada da meia-noite (evita data 'today' congelada)
    useEffect(() => {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
        const msUntilMidnight = midnight.getTime() - now.getTime();

        const timer = setTimeout(() => {
            logger.info(
                '[useReservations] Midnight reached, refreshing active reservations subscription'
            );
            setSubKey((k) => k + 1);
        }, msUntilMidnight);

        return () => clearTimeout(timer);
    }, [subKey]);

    useEffect(() => {
        if (!userPermission) return;

        const allowedProperties = userPermission.allowedProperties;

        let unsubscribe: (() => void) | undefined;
        let disposed = false;

        const setupSubscription = async () => {
            try {
                unsubscribe = await subscribeToActiveReservations(
                    (data, sync?: ReservationSyncInfo) => {
                        if (disposed) return;

                        // Compatibilidade com mocks/consumidores antigos: sem metadados significa
                        // snapshot confirmado. Em produção, cache e escritas pendentes nunca
                        // substituem a última fotografia confirmada pelo servidor.
                        const nextStatus = sync?.status ?? 'synced';
                        setActiveSyncStatus(nextStatus);
                        if (nextStatus === 'synced') {
                            setActiveReservations(data);
                            setActiveSyncError(null);
                        }
                    },
                    allowedProperties,
                    (error) => {
                        if (disposed) return;
                        setActiveSyncStatus('error');
                        setActiveSyncError(error);
                    }
                );
            } catch (error) {
                if (disposed) return;
                const syncError =
                    error instanceof Error ? error : new Error('Falha ao sincronizar reservas');
                logger.error('Error subscribing to active reservations', { error: syncError });
                setActiveSyncStatus('error');
                setActiveSyncError(syncError);
            }
        };

        setupSubscription();

        return () => {
            disposed = true;
            if (unsubscribe) unsubscribe();
        };
    }, [userPermission, subKey]);

    // --- 2. History Reservations (Infinite Query) ---
    const allowedProperties = userPermission?.allowedProperties;

    // We use 'historyReservations' string as key + user permissions to segregate cache
    const historyQuery = useInfiniteQuery({
        queryKey: ['historyReservations', allowedProperties],
        queryFn: async ({ pageParam }) => {
            const result = await fetchHistoryReservations(
                (pageParam as QueryDocumentSnapshot) || null,
                20,
                allowedProperties
            );
            return result;
        },
        initialPageParam: null as unknown, // Explicit check allow mixed types
        getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.lastVisible : undefined),
        enabled: !!userPermission, // Only fetch if user is defined
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    // Flatten pages into a single list
    const historyReservations = historyQuery.data?.pages.flatMap((page) => page.data) || [];

    // --- 3. CRUD Mutations ---

    const createMutation = useMutation({
        mutationFn: saveReservation,
        onSuccess: () => {
            showToast('Reserva criada com sucesso!', 'success');
            // No need to invalidate history usually, as new reservations are "Active"
            // Active list updates automatically via subscription
        },
        onError: (error) => {
            logger.error('Error creating reservation', { error });
            showToast('Erro ao criar reserva', 'error');
        },
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Reservation> }) =>
            updateReservation(id, data),
        onSuccess: () => {
            showToast('Reserva atualizada!', 'success');
            // If we updated something that moves it to history (e.g. checkout dates), we might want to invalidate
            queryClient.invalidateQueries({ queryKey: ['historyReservations'] });
        },
        onError: (error) => {
            logger.error('Error updating reservation', { error });
            showToast('Erro ao atualizar reserva', 'error');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteReservation,
        onSuccess: (_, deletedId) => {
            showToast('Reserva excluída!', 'success');

            // Optimistically update Active list (though subscription will eventually catch up)
            setActiveReservations((prev) => prev.filter((r) => r.id !== deletedId));

            // Invalidate history to remove it if it was there
            queryClient.invalidateQueries({ queryKey: ['historyReservations'] });
        },
        onError: (error) => {
            logger.error('Error deleting reservation', { error });
            showToast('Erro ao excluir reserva', 'error');
        },
    });

    // --- API Adapters for existing components ---

    const loadMoreHistory = useCallback(() => {
        if (historyQuery.hasNextPage && !historyQuery.isFetchingNextPage) {
            historyQuery.fetchNextPage();
        }
    }, [historyQuery]);

    return {
        // Data
        activeReservations,
        activeSyncStatus,
        activeSyncError,
        historyReservations,

        // Pagination
        loadingHistory: historyQuery.isLoading || historyQuery.isFetchingNextPage,
        hasMoreHistory: !!historyQuery.hasNextPage,
        loadMoreHistory,
        refreshHistory: historyQuery.refetch,
        refreshActive,

        // Errors (Optional exposure)
        historyError: historyQuery.error,

        // CRUD
        createReservation: (data: Reservation) => createMutation.mutateAsync(data),
        editReservation: (id: string, data: Partial<Reservation>) =>
            editMutation.mutateAsync({ id, data }),
        removeReservation: (id: string) => deleteMutation.mutateAsync(id),

        // Loading states for actions
        isCreating: createMutation.isPending,
        isEditing: editMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};

export default useReservations;
