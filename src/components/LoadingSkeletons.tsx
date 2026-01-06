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

import { HeroSkeleton } from './skeletons/HeroSkeleton';
import { StoriesSkeleton } from './skeletons/StoriesSkeleton';

/**
 * GuestSkeleton - skeleton específico para a visão do hóspede
 * Atualizado para refletir o layout real (Hero -> Stories -> Grid -> Recommendations)
 */
export const GuestSkeleton = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {/* Hero Section */}
        <HeroSkeleton />

        {/* Stories Section */}
        <div className="mt-4">
            <StoriesSkeleton />
        </div>

        {/* Main Grid Layout Mimic */}
        <div className="max-w-5xl mx-auto px-4 mt-6 pb-20">
            {/* Upper Grid: Status + Local Link */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Status Card Skeleton */}
                <div className="h-48 bg-white dark:bg-gray-800 rounded-2xl p-6 animate-pulse border border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                </div>

                {/* Smart Suggestion + Location Skeleton */}
                <div className="flex flex-col gap-6">
                    <div className="h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse"></div>
                    <div className="flex-1 h-32 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700"></div>
                </div>
            </div>

            {/* Recommendations Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-20 bg-white dark:bg-gray-800 rounded-xl animate-pulse flex items-center p-4 gap-4 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-4 hidden lg:block">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-20 bg-white dark:bg-gray-800 rounded-xl animate-pulse flex items-center p-4 gap-4 border border-gray-100 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
                            <div className="flex-1 space-y-2">
                                <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                <div className="w-1/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
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
    <div className="min-h-screen bg-stone-900 relative overflow-hidden">
        {/* Background Image Layer - Matches index.html */}
        <picture>
            <source media="(max-width: 799px)" srcSet="/hero-bg-mobile.webp" />
            <source media="(min-width: 800px)" srcSet="/hero-bg.webp" />
            <img
                src="/hero-bg-mobile.webp"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
        </picture>
        <div className="absolute inset-0 bg-stone-950/40 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent z-10"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-stone-950 to-transparent z-10"></div>

        {/* Content Layer - Matches index.html App Shell */}
        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20 pt-24 md:pt-32">
            <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                        Hospedagem <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                            em Petrolina
                        </span>
                    </h1>
                </div>
                <span className="text-xl md:text-3xl font-light text-stone-300 block mt-6 mb-8">
                    Flat para hospedagem em Petrolina (Centro) – próximos a hospitais e orla.
                </span>
            </div>
        </div>
    </div>
);

/**
 * LiliSkeleton - skeleton específico para a Landing Page da Lili
 * Imita o lili.html para transição perfeita
 */
export const LiliSkeleton = () => (
    <div className="min-h-screen bg-stone-900 relative overflow-hidden">
        {/* Background Image Layer - Matches lili.html */}
        <div className="absolute inset-0 z-0">
            <img
                src="https://i.postimg.cc/4dZ1Q3dN/Whats-App-Image-2025-11-15-at-17-43-54.jpg"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover opacity-100 scale-105"
            />
            <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content Layer - Matches lili.html App Shell */}
        <div className="absolute inset-0 z-10 container mx-auto px-6 md:px-12 pb-12 md:pb-24 flex flex-col justify-end items-start text-white">
            <div className="max-w-4xl">
                <span className="block text-orange-400 font-bold tracking-[0.2em] uppercase text-sm mb-6 flex items-center gap-3">
                    <span className="w-12 h-[1px] bg-orange-400"></span>
                    Flat de Lili Apresenta
                </span>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-medium leading-[1.1] mb-8">
                    A experiência <br />
                    <span className="italic font-light text-white">boutique</span> de <br />
                    <span className="text-orange-500 font-bold">Petrolina.</span>
                </h1>
                <p className="text-lg md:text-xl font-light text-white/80 max-w-lg leading-relaxed mb-10 border-l border-white/30 pl-6">
                    Design autoral, conforto absoluto e uma localização privilegiada no centro da
                    cidade.
                </p>
            </div>
        </div>
    </div>
);
