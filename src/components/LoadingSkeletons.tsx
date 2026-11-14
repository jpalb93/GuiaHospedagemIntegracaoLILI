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
    <div className="min-h-[100dvh] bg-[#12110F] relative overflow-hidden flex flex-col justify-between">
        {/* Background Image Layer - Matches Hero */}
        <picture>
            <source media="(max-width: 800px)" srcSet="/hero-bg-mobile1.webp" type="image/webp" />
            <img
                src="/hero-bg-nova1.webp"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
            />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#12110F]/90 via-[#12110F]/50 to-[#12110F]/15 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#12110F]/45 via-transparent to-[#12110F]/95 z-10" />

        {/* Content Layer - Matches New Hero */}
        <div className="max-w-[1320px] w-full mx-auto px-6 md:px-12 relative z-20 flex-1 flex flex-col justify-center pt-28 sm:pt-32 md:pt-36 pb-10">
            <div className="max-w-2xl">
                <span className="inline-block text-xs sm:text-sm font-medium text-[#E5C98B] tracking-[0.18em] uppercase mb-3">
                    Flats Integração
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-heading font-semibold text-white leading-[1.06] tracking-[-0.025em]">
                    Hospedagem em Petrolina
                </h1>
                <p className="mt-5 text-base sm:text-lg md:text-[1.125rem] font-normal text-stone-200/90 leading-relaxed max-w-lg">
                    Hospedagem mobiliada no Centro: cozinha, Wi-Fi fibra e melhor custo-benefício
                    que hotel. Lazer ou empresa.
                </p>
                <div className="mt-8 flex flex-wrap gap-3.5">
                    <div className="h-12 w-44 rounded-full bg-[#E5C98B]/80 animate-pulse" />
                    <div className="h-12 w-44 rounded-full bg-white/10 border border-white/20 animate-pulse" />
                </div>
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
