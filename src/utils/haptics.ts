/**
 * Haptic Feedback Utility
 * Provides tactile feedback for mobile interactions
 */

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPattern {
    duration: number[];
}

const HAPTIC_PATTERNS: Record<HapticType, HapticPattern> = {
    light: { duration: [10] },
    medium: { duration: [20] },
    heavy: { duration: [30] },
    success: { duration: [10, 30, 10] },
    warning: { duration: [20, 50] },
    error: { duration: [30, 10, 30, 10, 30] },
};

/**
 * Triggers haptic feedback if supported by the device
 * @param type - Type of haptic feedback
 * @returns true if haptic was triggered, false otherwise
 */
export const hapticFeedback = (type: HapticType = 'light'): boolean => {
    // Check if Vibration API is supported
    if (!('vibrate' in navigator)) {
        return false;
    }

    try {
        const pattern = HAPTIC_PATTERNS[type];
        navigator.vibrate(pattern.duration);
        return true;
    } catch (error) {
        console.warn('Haptic feedback failed:', error);
        return false;
    }
};

/**
 * Hook for haptic feedback with React
 */
export const useHaptic = () => {
    const trigger = (type: HapticType = 'light') => {
        hapticFeedback(type);
    };

    return { trigger, hapticFeedback };
};
