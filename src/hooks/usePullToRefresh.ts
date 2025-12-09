import { useState, useEffect, useCallback } from 'react';

interface PullToRefreshOptions {
    threshold?: number;
    maxPullDistance?: number;
    onRefresh: () => Promise<void>;
    disabled?: boolean;
}

export const usePullToRefresh = ({
    threshold = 80,
    maxPullDistance = 120,
    onRefresh,
    disabled = false,
}: PullToRefreshOptions) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [touchStart, setTouchStart] = useState(0);

    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (disabled || isRefreshing) return;

        // Only trigger if at top of scroll
        if (window.scrollY === 0) {
            setTouchStart(e.touches[0].clientY);
        }
    }, [disabled, isRefreshing]);

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (disabled || isRefreshing || touchStart === 0) return;

        const currentTouch = e.touches[0].clientY;
        const distance = currentTouch - touchStart;

        // Only pull down (positive distance) and when at top
        if (distance > 0 && window.scrollY === 0) {
            // Apply resistance: diminishing returns as we pull further
            const resistedDistance = Math.min(
                distance * (1 - distance / (maxPullDistance * 2)),
                maxPullDistance
            );
            setPullDistance(resistedDistance);

            // Prevent scrolling while pulling
            if (resistedDistance > 10) {
                e.preventDefault();
            }
        }
    }, [disabled, isRefreshing, touchStart, maxPullDistance]);

    const handleTouchEnd = useCallback(async () => {
        if (disabled || isRefreshing || touchStart === 0) return;

        setTouchStart(0);

        // Trigger refresh if past threshold
        if (pullDistance >= threshold) {
            setIsRefreshing(true);
            setPullDistance(threshold); // Lock at threshold during refresh

            try {
                await onRefresh();
            } catch (error) {
                console.error('Pull to refresh error:', error);
            } finally {
                setIsRefreshing(false);
                setPullDistance(0);
            }
        } else {
            // Snap back if not past threshold
            setPullDistance(0);
        }
    }, [disabled, isRefreshing, touchStart, pullDistance, threshold, onRefresh]);

    // Attach/detach listeners
    useEffect(() => {
        if (disabled) return;

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [disabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

    return {
        pullDistance,
        isRefreshing,
        isPulling: pullDistance > 0,
        progress: Math.min(pullDistance / threshold, 1), // 0 to 1
    };
};
