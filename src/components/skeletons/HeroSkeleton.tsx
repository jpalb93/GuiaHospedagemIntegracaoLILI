

export const HeroSkeleton = () => (
    <div className="w-full h-[50vh] md:h-[60vh] bg-gray-200 dark:bg-gray-800 animate-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
        <div className="absolute bottom-8 left-6 right-6">
            <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
    </div>
);
