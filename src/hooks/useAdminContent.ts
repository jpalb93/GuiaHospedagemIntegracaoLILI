import { useState, useCallback, useMemo } from 'react';
import { logger } from '../utils/logger';
import { PlaceRecommendation, Tip, CityCuriosity } from '../types';
import {
    getDynamicPlaces, addDynamicPlace, updateDynamicPlace, deleteDynamicPlace,
    getTips, addTip, updateTip, deleteTip, saveTipsOrder,
    getCuriosities, saveCuriosities
} from '../services/firebase';

export const useAdminContent = () => {
    // Places State
    const [places, setPlaces] = useState<PlaceRecommendation[]>([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);

    // Tips State
    const [tips, setTips] = useState<Tip[]>([]);
    const [loadingTips, setLoadingTips] = useState(false);

    // Curiosities State
    const [curiosities, setCuriosities] = useState<CityCuriosity[]>([]);
    const [loadingCuriosities, setLoadingCuriosities] = useState(false);

    // General Loading
    const [operationLoading, setOperationLoading] = useState(false);

    // --- PLACES ---
    const loadPlaces = useCallback(async () => {
        setLoadingPlaces(true);
        try {
            const data = await getDynamicPlaces(true); // Force refresh

            // --- AUTO-CLEANUP LOGIC ---
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to start of day

            const activePlaces: PlaceRecommendation[] = [];
            const expiredIds: string[] = [];

            data.forEach(place => {
                if (place.category === 'events' && place.eventDate) {
                    // Determine expiration date (End Date OR Start Date)
                    const dateToCheckStr = place.eventEndDate || place.eventDate;
                    const [y, m, d] = dateToCheckStr.split('-').map(Number);
                    const eventDate = new Date(y, m - 1, d);
                    eventDate.setHours(0, 0, 0, 0);

                    // If event date is strictly BEFORE today, it's expired
                    if (eventDate.getTime() < today.getTime()) {
                        if (place.id) expiredIds.push(place.id);
                        return; // Skip adding to activePlaces
                    }
                }
                activePlaces.push(place);
            });

            // Update UI with only active places immediately
            setPlaces(activePlaces);

            // Delete expired events in background (Fire & Forget)
            if (expiredIds.length > 0) {
                logger.log(`[Auto-Cleanup] Deleting ${expiredIds.length} expired events...`);
                Promise.all(expiredIds.map(id => deleteDynamicPlace(id)))
                    .then(() => logger.log('[Auto-Cleanup] Expired events deleted.'))
                    .catch(err => logger.error('[Auto-Cleanup] Error deleting events:', err));
            }

        } catch (error) {
            logger.error("Error loading places:", error);
        } finally {
            setLoadingPlaces(false);
        }
    }, []);

    const handleAddPlace = useCallback(async (place: Omit<PlaceRecommendation, 'id'>) => {
        // Optimistic Update: Add to UI immediately with a temp ID
        const tempId = 'temp_' + Date.now();
        const tempPlace = { ...place, id: tempId };
        setPlaces(prev => [tempPlace, ...prev]);

        // Background Sync
        addDynamicPlace(place).then(() => {
            // Silent refresh to get real ID
            loadPlaces();
        }).catch(error => {
            logger.error("Error adding place:", error);
            // Revert on error (could be improved with toast)
            setPlaces(prev => prev.filter(p => p.id !== tempId));
        });

        return true; // Return success immediately
    }, [loadPlaces]);

    const handleUpdatePlace = useCallback(async (id: string, place: Partial<PlaceRecommendation>) => {
        // Optimistic Update: Update UI immediately
        setPlaces(prev => prev.map(p => p.id === id ? { ...p, ...place } : p));

        // Background Sync
        updateDynamicPlace(id, place).then(() => {
            // Silent refresh to ensure consistency
            // loadPlaces(); // Optional: might not be needed if we trust the optimistic update
        }).catch(error => {
            logger.error("Error updating place:", error);
            // Revert would require fetching old state, skipping for now as rare
            loadPlaces();
        });

        return true; // Return success immediately
    }, [loadPlaces]);

    const handleDeletePlace = useCallback(async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este local?")) return false;

        // Optimistic Update: Remove from UI immediately
        setPlaces(prev => prev.filter(p => p.id !== id));

        // Background Sync
        deleteDynamicPlace(id).then(() => {
            // Success
        }).catch(error => {
            logger.error("Error deleting place:", error);
            // Revert
            loadPlaces();
        });

        return true; // Return success immediately
    }, [loadPlaces]);

    // --- TIPS ---
    const loadTips = useCallback(async () => {
        setLoadingTips(true);
        try {
            const data = await getTips();
            setTips(data);
        } catch (error) {
            logger.error("Error loading tips:", error);
        } finally {
            setLoadingTips(false);
        }
    }, []);

    const handleAddTip = useCallback(async (tip: Tip) => {
        setOperationLoading(true);
        try {
            await addTip(tip);
            await loadTips();
            return true;
        } catch (error) {
            logger.error("Error adding tip:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    }, [loadTips]);

    const handleUpdateTip = useCallback(async (id: string, tip: Partial<Tip>) => {
        setOperationLoading(true);
        try {
            await updateTip(id, tip);
            await loadTips();
            return true;
        } catch (error) {
            logger.error("Error updating tip:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    }, [loadTips]);

    const handleDeleteTip = useCallback(async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir esta dica?")) return false;
        setOperationLoading(true);
        try {
            await deleteTip(id);
            await loadTips();
            return true;
        } catch (error) {
            logger.error("Error deleting tip:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    }, [loadTips]);

    const handleReorderTips = useCallback(async (newTips: Tip[]) => {
        // Optimistic Update
        setTips(newTips);

        try {
            await saveTipsOrder(newTips);
            return true;
        } catch (error) {
            logger.error("Error reordering tips:", error);
            // Revert on error (optional, but good practice would be to reload)
            await loadTips();
            return false;
        }
    }, [loadTips]);

    // --- CURIOSITIES ---
    const loadCuriosities = useCallback(async () => {
        setLoadingCuriosities(true);
        try {
            const data = await getCuriosities();
            setCuriosities(data);
        } catch (error) {
            logger.error("Error loading curiosities:", error);
        } finally {
            setLoadingCuriosities(false);
        }
    }, []);

    const handleSaveCuriosities = useCallback(async (items: CityCuriosity[]) => {
        setOperationLoading(true);
        try {
            await saveCuriosities(items);
            setCuriosities(items);
            return true;
        } catch (error) {
            logger.error("Error saving curiosities:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    }, []);

    // Memoize the return object to prevent unnecessary re-renders in consumers
    return useMemo(() => ({
        places: {
            data: places,
            loading: loadingPlaces,
            add: handleAddPlace,
            update: handleUpdatePlace,
            delete: handleDeletePlace,
            refresh: loadPlaces
        },
        tips: {
            data: tips,
            loading: loadingTips,
            add: handleAddTip,
            update: handleUpdateTip,
            delete: handleDeleteTip,
            reorder: handleReorderTips,
            refresh: loadTips
        },
        curiosities: {
            data: curiosities,
            loading: loadingCuriosities,
            save: handleSaveCuriosities,
            refresh: loadCuriosities
        },
        operationLoading
    }), [
        places, loadingPlaces, handleAddPlace, handleUpdatePlace, handleDeletePlace, loadPlaces,
        tips, loadingTips, handleAddTip, handleUpdateTip, handleDeleteTip, handleReorderTips, loadTips,
        curiosities, loadingCuriosities, handleSaveCuriosities, loadCuriosities,
        operationLoading
    ]);
};
