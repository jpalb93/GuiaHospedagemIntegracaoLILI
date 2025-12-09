import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSwipeToDismiss } from './useSwipeToDismiss';

describe('useSwipeToDismiss', () => {
    const onDismiss = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize correctly', () => {
        const { result } = renderHook(() => useSwipeToDismiss({ onDismiss }));

        expect(result.current.dragY).toBe(0);
        expect(result.current.isDragging).toBe(false);
    });

    it('should track downward swipe', () => {
        const { result } = renderHook(() => useSwipeToDismiss({ onDismiss }));
        const { handlers } = result.current;

        act(() => {
            handlers.onTouchStart({
                touches: [{ clientY: 100 } as any]
            } as any);
        });

        act(() => {
            handlers.onTouchMove({
                touches: [{ clientY: 150 } as any] // +50px
            } as any);
        });

        expect(result.current.dragY).toBe(50);
        expect(result.current.isDragging).toBe(true);
    });

    it('should ignore upward swipe', () => {
        const { result } = renderHook(() => useSwipeToDismiss({ onDismiss }));
        const { handlers } = result.current;

        act(() => {
            handlers.onTouchStart({
                touches: [{ clientY: 100 } as any]
            } as any);
        });

        act(() => {
            handlers.onTouchMove({
                touches: [{ clientY: 50 } as any] // -50px (up)
            } as any);
        });

        expect(result.current.dragY).toBe(0);
    });

    it('should dismiss when threshold reached', () => {
        const { result } = renderHook(() => useSwipeToDismiss({ onDismiss, threshold: 100 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onTouchStart({ touches: [{ clientY: 100 } as any] } as any);
        });

        act(() => {
            handlers.onTouchMove({ touches: [{ clientY: 250 } as any] } as any); // +150px
        });

        act(() => {
            handlers.onTouchEnd();
        });

        expect(onDismiss).toHaveBeenCalled();
    });

    it('should reset if threshold not reached', () => {
        const { result } = renderHook(() => useSwipeToDismiss({ onDismiss, threshold: 100 }));
        const { handlers } = result.current;

        act(() => {
            handlers.onTouchStart({ touches: [{ clientY: 100 } as any] } as any);
        });

        act(() => {
            handlers.onTouchMove({ touches: [{ clientY: 150 } as any] } as any); // +50px
        });

        act(() => {
            handlers.onTouchEnd();
        });

        expect(onDismiss).not.toHaveBeenCalled();
        expect(result.current.dragY).toBe(0);
    });
});
