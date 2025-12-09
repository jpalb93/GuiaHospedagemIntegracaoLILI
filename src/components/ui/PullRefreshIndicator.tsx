import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PullRefreshIndicatorProps {
    pullDistance: number;
    isRefreshing: boolean;
    progress: number; // 0 to 1
}

export const PullRefreshIndicator: React.FC<PullRefreshIndicatorProps> = ({
    pullDistance,
    isRefreshing,
    progress,
}) => {
    if (pullDistance === 0 && !isRefreshing) return null;

    const scale = Math.min(progress * 1.2, 1);
    const rotation = isRefreshing ? 0 : progress * 180;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
            style={{
                transform: `translateY(${Math.min(pullDistance - 40, 40)}px)`,
                transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none',
            }}
        >
            <div className="mt-4 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700">
                <RefreshCw
                    size={24}
                    className={`text-blue-500 ${isRefreshing ? 'animate-spin' : ''}`}
                    style={{
                        transform: `scale(${scale}) rotate(${rotation}deg)`,
                        transition: isRefreshing ? 'none' : 'transform 0.2s ease-out',
                    }}
                />
            </div>
        </div>
    );
};

export default PullRefreshIndicator;
