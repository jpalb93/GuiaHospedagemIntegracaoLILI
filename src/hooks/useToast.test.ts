import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';

describe('useToast', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should start with empty toasts array', () => {
        const { result } = renderHook(() => useToast());

        expect(result.current.toasts).toEqual([]);
    });

    it('should add toast with default type info', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Test message');
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toBe('Test message');
        expect(result.current.toasts[0].type).toBe('info');
    });

    it('should add toast with custom type', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Error message', 'error');
        });

        expect(result.current.toasts[0].type).toBe('error');
    });

    it('should add multiple toasts', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('First', 'info');
            result.current.showToast('Second', 'success');
            result.current.showToast('Third', 'error');
        });

        expect(result.current.toasts).toHaveLength(3);
    });

    it('should generate unique IDs for each toast', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('First');
            result.current.showToast('Second');
        });

        const ids = result.current.toasts.map((t) => t.id);
        expect(ids[0]).not.toBe(ids[1]);
    });

    it('should remove toast manually', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Test');
        });

        const toastId = result.current.toasts[0].id;

        act(() => {
            result.current.removeToast(toastId);
        });

        expect(result.current.toasts).toHaveLength(0);
    });

    it('should auto-remove toast after 4 seconds', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Auto remove test');
        });

        expect(result.current.toasts).toHaveLength(1);

        act(() => {
            vi.advanceTimersByTime(4000);
        });

        expect(result.current.toasts).toHaveLength(0);
    });

    it('should not affect other toasts when removing one', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('First');
            result.current.showToast('Second');
        });

        const firstId = result.current.toasts[0].id;

        act(() => {
            result.current.removeToast(firstId);
        });

        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toBe('Second');
    });

    it('should handle removing non-existent toast gracefully', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Test');
        });

        act(() => {
            result.current.removeToast('non-existent-id');
        });

        expect(result.current.toasts).toHaveLength(1);
    });

    it('should support all toast types', () => {
        const { result } = renderHook(() => useToast());

        act(() => {
            result.current.showToast('Info', 'info');
            result.current.showToast('Success', 'success');
            result.current.showToast('Error', 'error');
            result.current.showToast('Warning', 'warning');
        });

        expect(result.current.toasts).toHaveLength(4);
        expect(result.current.toasts.map((t) => t.type)).toEqual([
            'info',
            'success',
            'error',
            'warning',
        ]);
    });
});
