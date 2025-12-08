import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGuestTheme } from './useGuestTheme';

describe('useGuestTheme', () => {
    describe('Lili Theme (Default)', () => {
        it('should return lili theme for lili property', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.background).toBe('bg-[#1E1E2E]');
            expect(result.current.text.primary).toBe('text-white');
            expect(result.current.text.accent).toBe('text-purple-400');
            expect(result.current.button.primary).toContain('bg-purple-600');
        });

        it('should have purple/gold magical theme colors', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.text.highlight).toBe('text-amber-400');
            expect(result.current.effects.glow).toBe('shadow-purple-500/20');
            expect(result.current.effects.blob1).toBe('bg-purple-500/20');
        });

        it('should have proper border styling', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.border).toBe('border-white/5');
        });
    });

    describe('Integracao Theme', () => {
        it('should return integracao theme for integracao property', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.background).toBe('bg-[#0F172A]');
            expect(result.current.text.accent).toBe('text-cyan-400');
            expect(result.current.button.primary).toContain('bg-cyan-600');
        });

        it('should have navy/cyan executive theme colors', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.text.highlight).toBe('text-sky-300');
            expect(result.current.effects.glow).toBe('shadow-cyan-500/10');
            expect(result.current.border).toBe('border-cyan-500/20');
        });

        it('should have gradient background', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.backgroundGradient).toContain('bg-gradient-to-br');
            expect(result.current.backgroundGradient).toContain('#0F172A');
        });

        it('should have slate secondary button', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.button.secondary).toContain('bg-slate-700/50');
        });
    });

    describe('Theme Memoization', () => {
        it('should memoize theme based on propertyId', () => {
            const { result, rerender } = renderHook(
                ({ propertyId }) => useGuestTheme(propertyId),
                { initialProps: { propertyId: 'lili' as const } }
            );

            const firstTheme = result.current;

            // Rerender with same propertyId
            rerender({ propertyId: 'lili' });

            expect(result.current).toBe(firstTheme); // Same object reference
        });

        it('should return new theme when propertyId changes', () => {
            const { result, rerender } = renderHook(
                ({ propertyId }) => useGuestTheme(propertyId),
                { initialProps: { propertyId: 'lili' as const } }
            );

            const liliTheme = result.current;

            rerender({ propertyId: 'integracao' });

            expect(result.current).not.toBe(liliTheme);
            expect(result.current.text.accent).toBe('text-cyan-400'); // Integracao theme
        });
    });

    describe('Theme Structure', () => {
        it('should have all required theme properties for lili', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current).toHaveProperty('background');
            expect(result.current).toHaveProperty('backgroundGradient');
            expect(result.current).toHaveProperty('border');
            expect(result.current).toHaveProperty('text.primary');
            expect(result.current).toHaveProperty('text.secondary');
            expect(result.current).toHaveProperty('text.accent');
            expect(result.current).toHaveProperty('text.highlight');
            expect(result.current).toHaveProperty('button.primary');
            expect(result.current).toHaveProperty('button.secondary');
            expect(result.current).toHaveProperty('effects.glow');
            expect(result.current).toHaveProperty('effects.blob1');
            expect(result.current).toHaveProperty('effects.blob2');
        });

        it('should have all required theme properties for integracao', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current).toHaveProperty('background');
            expect(result.current).toHaveProperty('border');
            expect(result.current).toHaveProperty('text.primary');
            expect(result.current).toHaveProperty('button.primary');
            expect(result.current).toHaveProperty('effects.glow');
        });
    });
});
