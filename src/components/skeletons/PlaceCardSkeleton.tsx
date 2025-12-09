import React from 'react';

const PlaceCardSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-[20px] overflow-hidden border border-gray-100 dark:border-gray-700 w-full animate-pulse shadow-sm">
            {/* Header */}
            <div className="flex items-center p-3 min-h-[72px]">
                {/* Thumbnail Skeleton */}
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gray-200 dark:bg-gray-700"></div>

                {/* Text Info Skeleton */}
                <div className="ml-3 flex-1 flex flex-col justify-center gap-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                </div>

                {/* Heart Icon Skeleton */}
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-2"></div>

                {/* Chevron Skeleton */}
                <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Expanded Body Skeleton */}
            <div className="px-3 pb-4 pt-0">
                {/* Big Image Skeleton */}
                <div className="w-full h-32 rounded-xl bg-gray-200 dark:bg-gray-700 mb-3"></div>

                {/* Text Description Skeleton */}
                <div className="space-y-2 mb-4">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>

                {/* Buttons Skeleton */}
                <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
                </div>
            </div>
        </div>
    );
};

export default PlaceCardSkeleton;
