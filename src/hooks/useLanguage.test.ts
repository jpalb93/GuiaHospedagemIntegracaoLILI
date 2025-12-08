import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguage } from './useLanguage';

describe('useLanguage', () => {
    beforeEach(() => {
        // Clear cookies
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        vi.clearAllMocks();
    });

    it('should default to Portuguese', () => {
        const { result } = renderHook(() => useLanguage());

        expect(result.current.currentLang).toBe('pt');
    });

    it('should detect English from cookie', () => {
        document.cookie = 'googtrans=/pt/en';

        const { result } = renderHook(() => useLanguage());

        expect(result.current.currentLang).toBe('en');
    });

    it('should toggle from Portuguese to English', () => {
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        const { result } = renderHook(() => useLanguage());

        expect(result.current.currentLang).toBe('pt');

        act(() => {
            result.current.toggleLanguage();
        });

        expect(document.cookie).toContain('googtrans=/pt/en');
        expect(reloadMock).toHaveBeenCalled();
    });

    it('should toggle from English to Portuguese', () => {
        document.cookie = 'googtrans=/pt/en';
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.toggleLanguage();
        });

        expect(document.cookie).toContain('googtrans=/pt/pt');
        expect(reloadMock).toHaveBeenCalled();
    });

    it('should set cookie path to root', () => {
        const reloadMock = vi.fn();
        Object.defineProperty(window, 'location', {
            value: { reload: reloadMock },
            writable: true,
        });

        const { result } = renderHook(() => useLanguage());

        act(() => {
            result.current.toggleLanguage();
        });

        expect(document.cookie).toContain('path=/');
    });
});
