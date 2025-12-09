import PlaceCardSkeleton from './skeletons/PlaceCardSkeleton';

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
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex justify-between items-center">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
        </div>

        {/* Categories Pills Skeleton */}
        <div className="px-4 mb-6 flex gap-3 overflow-x-hidden">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
            ))}
        </div>

        {/* Content Cards Skeleton - List of PlaceCardSkeletons */}
        <div className="px-4 space-y-4 pb-20">
            {[1, 2, 3].map((i) => (
                <PlaceCardSkeleton key={i} />
            ))}
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
