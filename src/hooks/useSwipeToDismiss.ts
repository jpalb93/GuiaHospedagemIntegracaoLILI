import { useState, useCallback, TouchEvent as ReactTouchEvent } from 'react';
import { hapticFeedback } from '../utils/haptics';

interface UseSwipeToDismissOptions {
    onDismiss: () => void;
    threshold?: number;
    disabled?: boolean;
}

export const useSwipeToDismiss = ({
    onDismiss,
    threshold = 100,
    disabled = false,
}: UseSwipeToDismissOptions) => {
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [currentY, setCurrentY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleTouchStart = useCallback((e: ReactTouchEvent) => {
        if (disabled) return;
        setTouchStartY(e.touches[0].clientY);
        setIsDragging(true);
    }, [disabled]);

    const handleTouchMove = useCallback((e: ReactTouchEvent) => {
        if (disabled || touchStartY === null) return;

        const currentTouch = e.touches[0].clientY;
        const deltaY = currentTouch - touchStartY;

        // Only allow downward swipe
        if (deltaY > 0) {
            setCurrentY(deltaY);
        }
    }, [disabled, touchStartY]);

    const handleTouchEnd = useCallback(() => {
        if (disabled || touchStartY === null) return;

        setIsDragging(false);
        setTouchStartY(null);

        // Dismiss if past threshold
        if (currentY >= threshold) {
            hapticFeedback('medium');
            onDismiss();
        } else {
            // Snap back
            setCurrentY(0);
        }
    }, [disabled, touchStartY, currentY, threshold, onDismiss]);

    // Reset state
    const reset = useCallback(() => {
        setCurrentY(0);
        setTouchStartY(null);
        setIsDragging(false);
    }, []);

    return {
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        dragY: currentY,
        isDragging,
        progress: Math.min(currentY / threshold, 1), // 0 to 1
        reset,
    };
};
