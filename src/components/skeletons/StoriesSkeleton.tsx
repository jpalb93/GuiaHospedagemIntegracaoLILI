

export const StoriesSkeleton = () => (
    <div className="flex gap-4 overflow-x-hidden p-4">
        {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse ring-2 ring-gray-100 dark:ring-gray-700"></div>
                <div className="w-12 h-3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
            </div>
        ))}
    </div>
);
