import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGuestTheme } from './useGuestTheme';

describe('useGuestTheme', () => {
    describe('Lili Theme (Default — Sol do São Francisco & Terracota)', () => {
        it('should return warm stone/terracotta theme for lili property', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.background).toBe('bg-[#1C1614]');
            expect(result.current.text.primary).toBe('text-stone-50');
            expect(result.current.text.accent).toBe('text-amber-400');
            expect(result.current.button.primary).toContain('from-orange-600');
        });

        it('should have golden amber/terracotta highlight and glow colors', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.text.highlight).toBe('text-orange-400');
            expect(result.current.effects.glow).toBe('shadow-amber-500/15');
            expect(result.current.effects.blob1).toBe('bg-amber-500/15');
        });

        it('should have proper warm border styling', () => {
            const { result } = renderHook(() => useGuestTheme('lili'));

            expect(result.current.border).toBe('border-amber-500/20');
        });
    });

    describe('Integracao Theme (Rio São Francisco & Pedra Executiva)', () => {
        it('should return integracao theme for integracao property', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.background).toBe('bg-[#111922]');
            expect(result.current.text.accent).toBe('text-sky-400');
            expect(result.current.button.primary).toContain('from-sky-600');
        });

        it('should have river sky/amber executive theme colors', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.text.highlight).toBe('text-amber-300');
            expect(result.current.effects.glow).toBe('shadow-sky-500/15');
            expect(result.current.border).toBe('border-sky-500/20');
        });

        it('should have gradient background', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.backgroundGradient).toContain('bg-gradient-to-br');
            expect(result.current.backgroundGradient).toContain('#111922');
        });

        it('should have slate secondary button', () => {
            const { result } = renderHook(() => useGuestTheme('integracao'));

            expect(result.current.button.secondary).toContain('bg-slate-800/70');
        });
    });

    describe('Theme Memoization', () => {
        it('should memoize theme based on propertyId', () => {
            const { result, rerender } = renderHook(({ propertyId }) => useGuestTheme(propertyId), {
                initialProps: { propertyId: 'lili' as const },
            });

            const firstTheme = result.current;

            // Rerender with same propertyId
            rerender({ propertyId: 'lili' });

            expect(result.current).toBe(firstTheme); // Same object reference
        });

        it('should return new theme when propertyId changes', () => {
            const { result, rerender } = renderHook(({ propertyId }) => useGuestTheme(propertyId), {
                initialProps: { propertyId: 'lili' as const },
            });

            const liliTheme = result.current;

            rerender({ propertyId: 'integracao' });

            expect(result.current).not.toBe(liliTheme);
            expect(result.current.text.accent).toBe('text-sky-400'); // Integracao theme
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
