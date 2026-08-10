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
    fetchHistoryReservations,
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
    subscribeToCuriosities,
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

// Corporate B2B
export {
    subscribeToCompanies,
    getCompany,
    createCompany,
    updateCompany,
    archiveCompany,
    unarchiveCompany,
    subscribeToContractsByCompany,
    getContract,
    createContract,
    createContractWithAllocations,
    updateContract,
    getEndContractChecklist,
    endContract,
    subscribeToAllocationsByContract,
    getAllocationsByCompany,
    createAllocation,
    createAllocationsBatch,
    updateAllocation,
    endAllocation,
    deleteAllocation,
    refreshCompanyActiveFlatCount,
    subscribeToActiveAllocations,
} from './corporate';

export {
    subscribeToInvoicesByCompany,
    subscribeToInvoicesByContract,
    getInvoice,
    generateInvoiceDraft,
    generateInvoicesBatchForCompetence,
    issueInvoice,
    cancelInvoice,
    registerInvoicePayment,
    deleteInvoicePayment,
    subscribeToPaymentsByInvoice,
    updateInvoiceNf,
    updateInvoiceDiscount,
    refreshCompanyOpenBalance,
    subscribeToOpenInvoices,
    subscribeToAllInvoices,
    currentCompetence,
} from './invoices';

export { logAction, fetchLogs, fetchCompanyActivityLogs } from './logs';

// Storage (Upload de Imagens)
export { uploadImage } from './storage';

// Auth (Autenticação)
export { loginCMS, logoutCMS, subscribeToAuth } from './auth';
