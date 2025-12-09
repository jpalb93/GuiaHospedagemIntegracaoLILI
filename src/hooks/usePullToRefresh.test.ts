import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, fireEvent } from '@testing-library/react';
import { usePullToRefresh } from './usePullToRefresh';

describe('usePullToRefresh', () => {
    const onRefresh = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        vi.clearAllMocks();
        Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    });

    it('should initialize with default state', () => {
        const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

        expect(result.current.pullDistance).toBe(0);
        expect(result.current.isRefreshing).toBe(false);
        expect(result.current.isPulling).toBe(false);
        expect(result.current.progress).toBe(0);
    });

    it('should track pull distance when at top of page', () => {
        const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

        act(() => {
            fireEvent.touchStart(document, {
                touches: [{ clientY: 100 }],
            });

            fireEvent.touchMove(document, {
                touches: [{ clientY: 150 }], // Moved 50px down
            });
        });

        expect(result.current.pullDistance).toBeGreaterThan(0);
        expect(result.current.isPulling).toBe(true);
    });

    it('should NOT track pull if not at top of page', () => {
        Object.defineProperty(window, 'scrollY', { value: 100, writable: true }); // Scrolled down
        const { result } = renderHook(() => usePullToRefresh({ onRefresh }));

        act(() => {
            fireEvent.touchStart(document, {
                touches: [{ clientY: 100 }],
            });

            fireEvent.touchMove(document, {
                touches: [{ clientY: 150 }],
            });
        });

        expect(result.current.pullDistance).toBe(0);
    });

    it('should trigger onRefresh when threshold is crossed and released', async () => {
        const { result } = renderHook(() => usePullToRefresh({ onRefresh, threshold: 50 }));

        // 1. Start Pull
        act(() => {
            fireEvent.touchStart(document, {
                touches: [{ clientY: 100 }],
            });
        });

        // 2. Pull past threshold (move 100px down)
        act(() => {
            fireEvent.touchMove(document, {
                touches: [{ clientY: 200 }],
            });
        });

        expect(result.current.pullDistance).toBeGreaterThan(50);

        // 3. Release
        await act(async () => {
            fireEvent.touchEnd(document);
        });

        expect(result.current.isRefreshing).toBe(true);
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });
});

