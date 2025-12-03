// Loading skeletons para diferentes rotas

/**
 * LoadingScreen genérico - usado quando o tipo de conteúdo ainda não é conhecido
 */
export const LoadingScreen = () => (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm font-medium">Carregando seu guia...</p>
        </div>
    </div>
);

/**
 * GuestSkeleton - skeleton específico para a visão do hóspede
 */
export const GuestSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 animate-pulse relative overflow-hidden">
        <div className="absolute inset-0 animate-shimmer z-10 pointer-events-none"></div>
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>

        {/* Hero Image Skeleton */}
        <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>

        {/* Content Cards Skeleton */}
        <div className="p-4 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
        </div>
    </div>
);

/**
 * AdminSkeleton - skeleton específico para o painel admin
 */
export const AdminSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-2">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
);

/**
 * LandingSkeleton - skeleton para landing page
 */
export const LandingSkeleton = () => (
    <div className="min-h-screen bg-gray-900 animate-pulse">
        <div className="h-screen bg-gray-800"></div>
    </div>
);
