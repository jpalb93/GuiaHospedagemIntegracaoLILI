import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLongPress } from './useLongPress';

describe('useLongPress', () => {
    const onLongPress = vi.fn();
    const onClick = vi.fn();

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should trigger onLongPress after delay', () => {
        const { result } = renderHook(() => useLongPress({ onLongPress, delay: 500 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onMouseDown({ clientX: 0, clientY: 0 } as any);
        });

        expect(result.current.isLongPressing).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(onLongPress).toHaveBeenCalled();
        expect(result.current.isLongPressing).toBe(false);
    });

    it('should trigger onClick if released early', () => {
        const { result } = renderHook(() => useLongPress({ onLongPress, onClick, delay: 500 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onMouseDown({ clientX: 0, clientY: 0 } as any);
        });

        act(() => {
            vi.advanceTimersByTime(200); // Less than delay
            handlers.onMouseUp();
        });

        expect(onLongPress).not.toHaveBeenCalled();
        expect(onClick).toHaveBeenCalled();
    });

    it('should cancel if moved too far', () => {
        const { result } = renderHook(() => useLongPress({ onLongPress, threshold: 10 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onMouseDown({ clientX: 0, clientY: 0 } as any);
        });

        act(() => {
            // Move 20px (past threshold)
            handlers.onMouseMove({ clientX: 20, clientY: 0 } as any);
        });

        expect(result.current.isLongPressing).toBe(false);

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(onLongPress).not.toHaveBeenCalled();
    });

    it('should work with Touch events', () => {
        const { result } = renderHook(() => useLongPress({ onLongPress, delay: 500 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onTouchStart({ touches: [{ clientX: 0, clientY: 0 }] } as any);
        });

        expect(result.current.isLongPressing).toBe(true);

        act(() => {
            vi.advanceTimersByTime(500);
        });

        expect(onLongPress).toHaveBeenCalled();
    });
});
