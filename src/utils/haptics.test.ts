import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { hapticFeedback } from './haptics';

describe('hapticFeedback', () => {
    const originalNavigator = global.navigator;

    beforeEach(() => {
        // Mock navigator.vibrate
        Object.defineProperty(global, 'navigator', {
            value: {
                ...originalNavigator,
                vibrate: vi.fn(),
            },
            writable: true,
        });
    });

    afterEach(() => {
        // Restore navigator
        Object.defineProperty(global, 'navigator', {
            value: originalNavigator,
            writable: true,
        });
        vi.clearAllMocks();
    });

    it('should return false if vibrate is not supported', () => {
        // Remove vibrate from navigator
        Object.defineProperty(global, 'navigator', {
            value: {}, // Empty navigator
            writable: true,
        });

        const result = hapticFeedback('success');
        expect(result).toBe(false);
    });

    it('should call navigator.vibrate with correct pattern for "success"', () => {
        const result = hapticFeedback('success');

        expect(navigator.vibrate).toHaveBeenCalledWith([10, 30, 10]);
        expect(result).toBe(true);
    });

    it('should call navigator.vibrate with correct pattern for "error"', () => {
        const result = hapticFeedback('error');

        expect(navigator.vibrate).toHaveBeenCalledWith([30, 10, 30, 10, 30]);
        expect(result).toBe(true);
    });

    it('should call navigator.vibrate with correct pattern for "light"', () => {
        const result = hapticFeedback('light');

        expect(navigator.vibrate).toHaveBeenCalledWith([10]);
        expect(result).toBe(true);
    });

    it('should handle errors gracefully', () => {
        // Force vibrate to throw
        Object.defineProperty(global, 'navigator', {
            value: {
                vibrate: vi.fn().mockImplementation(() => {
                    throw new Error('Vibration failed');
                }),
            },
            writable: true,
        });

        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

        const result = hapticFeedback('success');

        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalled();
    });
});
