import { useState, useCallback, useRef, useEffect, TouchEvent as ReactTouchEvent, MouseEvent as ReactMouseEvent } from 'react';
import { hapticFeedback } from '../utils/haptics';

interface UseLongPressOptions {
    onLongPress: () => void;
    onClick?: () => void;
    delay?: number;
    threshold?: number; // Movement threshold before canceling
}

export const useLongPress = ({
    onLongPress,
    onClick,
    delay = 500,
    threshold = 10,
}: UseLongPressOptions) => {
    const [isLongPressing, setIsLongPressing] = useState(false);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startPosRef = useRef<{ x: number; y: number } | null>(null);
    const wasLongPressRef = useRef(false);

    const start = useCallback((clientX: number, clientY: number) => {
        startPosRef.current = { x: clientX, y: clientY };
        wasLongPressRef.current = false;
        setIsLongPressing(true);
        setProgress(0);

        // Progress animation
        const startTime = Date.now();
        intervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min(elapsed / delay, 1);
            setProgress(currentProgress);
        }, 16); // ~60fps

        // Long press timer
        timerRef.current = setTimeout(() => {
            wasLongPressRef.current = true;
            hapticFeedback('medium');
            setIsLongPressing(false);
            setProgress(0);
            onLongPress();

            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, delay);
    }, [delay, onLongPress]);

    const cancel = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsLongPressing(false);
        setProgress(0);
    }, []);

    const end = useCallback(() => {
        cancel();

        // If it wasn't a long press, trigger onClick
        if (!wasLongPressRef.current && onClick) {
            hapticFeedback('light');
            onClick();
        }

        wasLongPressRef.current = false;
    }, [cancel, onClick]);

    const move = useCallback((clientX: number, clientY: number) => {
        if (!startPosRef.current) return;

        const deltaX = Math.abs(clientX - startPosRef.current.x);
        const deltaY = Math.abs(clientY - startPosRef.current.y);

        // Cancel if moved too much
        if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) > threshold) {
            cancel();
        }
    }, [threshold, cancel]);

    // Touch handlers
    const handleTouchStart = useCallback((e: ReactTouchEvent) => {
        const touch = e.touches[0];
        start(touch.clientX, touch.clientY);
    }, [start]);

    const handleTouchMove = useCallback((e: ReactTouchEvent) => {
        const touch = e.touches[0];
        move(touch.clientX, touch.clientY);
    }, [move]);

    const handleTouchEnd = useCallback(() => {
        end();
    }, [end]);

    // Mouse handlers (for desktop testing)
    const handleMouseDown = useCallback((e: ReactMouseEvent) => {
        start(e.clientX, e.clientY);
    }, [start]);

    const handleMouseMove = useCallback((e: ReactMouseEvent) => {
        move(e.clientX, e.clientY);
    }, [move]);

    const handleMouseUp = useCallback(() => {
        end();
    }, [end]);

    const handleMouseLeave = useCallback(() => {
        cancel();
    }, [cancel]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return {
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onMouseDown: handleMouseDown,
            onMouseMove: isLongPressing ? handleMouseMove : undefined,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseLeave,
        },
        isLongPressing,
        progress, // 0 to 1 for visual feedback
    };
};
