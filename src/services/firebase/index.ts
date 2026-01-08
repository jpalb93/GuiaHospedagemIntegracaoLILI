/**
 * Firebase Services - Index
 * Re-exports de todos os módulos para manter compatibilidade
 */

// Config e inicialização
export {
    getFirestoreInstance,
    getStorageInstance,
    isFirebaseConfigured,
    validateFirebaseConfig,
} from './config';

// DEPRECATED COMPATIBILITY LAYER - REMOVED
// All consumers must use getFirestoreInstance()

// Places (Lugares)
export {
    getDynamicPlaces,
    subscribeToPlaces,
    addDynamicPlace,
    updateDynamicPlace,
    deleteDynamicPlace,
    cleanupExpiredEvents,
} from './places';

// Reservations (Reservas)
export {
    saveReservation,
    getReservation,
    updateReservation,
    deleteReservation,
    subscribeToSingleReservation,
    subscribeToActiveReservations,
    subscribeToFutureReservations,
    fetchHistoryReservations,
    subscribeToReservations,
} from './reservations';

// App Settings (Configurações, Hero Images, Sugestões)
export {
    getAppSettings,
    saveAppSettings,
    subscribeToAppSettings,
    getHeroImages,
    updateHeroImages,
    getSmartSuggestions,
    saveSmartSuggestions,
    subscribeToSmartSuggestions,
} from './appSettings';

// Content (Dicas, Curiosidades, Reviews)
export {
    getTips,
    addTip,
    updateTip,
    deleteTip,
    saveTipsOrder,
    getCuriosities,
    saveCuriosities,
    subscribeToTips,
    getGuestReviews,
    addGuestReview,
    deleteGuestReview,
} from './content';

// Blocked Dates (Datas Bloqueadas)
export {
    addBlockedDate,
    deleteBlockedDate,
    subscribeToBlockedDates,
    subscribeToFutureBlockedDates,
} from './blockedDates';

// Storage (Upload de Imagens)
export { uploadImage } from './storage';

// Auth (Autenticação)
export { loginCMS, logoutCMS, subscribeToAuth } from './auth';
