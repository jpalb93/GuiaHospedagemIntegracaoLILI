import { useState } from 'react';
import { logger } from '../utils/logger';
import { PlaceRecommendation, Tip, CityCuriosity } from '../types';
import {
    getDynamicPlaces, addDynamicPlace, updateDynamicPlace, deleteDynamicPlace,
    getTips, addTip, updateTip, deleteTip,
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
    const loadPlaces = async () => {
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
    };

    const handleAddPlace = async (place: Omit<PlaceRecommendation, 'id'>) => {
        setOperationLoading(true);
        try {
            await addDynamicPlace(place);
            await loadPlaces();
            return true;
        } catch (error) {
            logger.error("Error adding place:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    };

    const handleUpdatePlace = async (id: string, place: Partial<PlaceRecommendation>) => {
        setOperationLoading(true);
        try {
            await updateDynamicPlace(id, place);
            await loadPlaces();
            return true;
        } catch (error) {
            logger.error("Error updating place:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDeletePlace = async (id: string) => {
        if (!window.confirm("Tem certeza que deseja excluir este local?")) return false;
        setOperationLoading(true);
        try {
            await deleteDynamicPlace(id);
            await loadPlaces();
            return true;
        } catch (error) {
            logger.error("Error deleting place:", error);
            return false;
        } finally {
            setOperationLoading(false);
        }
    };

    // --- TIPS ---
    const loadTips = async () => {
        setLoadingTips(true);
        try {
            const data = await getTips();
            setTips(data);
        } catch (error) {
            logger.error("Error loading tips:", error);
        } finally {
            setLoadingTips(false);
        }
    };

    const handleAddTip = async (tip: Tip) => {
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
    };

    const handleUpdateTip = async (id: string, tip: Partial<Tip>) => {
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
    };

    const handleDeleteTip = async (id: string) => {
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
    };

    // --- CURIOSITIES ---
    const loadCuriosities = async () => {
        setLoadingCuriosities(true);
        try {
            const data = await getCuriosities();
            setCuriosities(data);
        } catch (error) {
            logger.error("Error loading curiosities:", error);
        } finally {
            setLoadingCuriosities(false);
        }
    };

    const handleSaveCuriosities = async (items: CityCuriosity[]) => {
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
    };

    // Initial Load removed to allow lazy loading by components
    // useEffect(() => {
    //     loadPlaces();
    //     loadTips();
    //     loadCuriosities();
    // }, []);

    return {
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
            refresh: loadTips
        },
        curiosities: {
            data: curiosities,
            loading: loadingCuriosities,
            save: handleSaveCuriosities,
            refresh: loadCuriosities
        },
        operationLoading
    };
};
