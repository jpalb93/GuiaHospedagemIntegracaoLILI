// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDesktopGuestLayout } from './useDesktopGuestLayout';

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

function LayoutProbe() {
    return <span>{useDesktopGuestLayout() ? 'desktop' : 'mobile'}</span>;
}

describe('Desktop guide breakpoint', () => {
    it('reacts to crossing 1280px and removes its media listener on unmount', () => {
        let matches = false;
        let listener: (() => void) | undefined;
        const remove = vi.fn();
        const matchMedia = vi.fn((query: string) => ({
            get matches() {
                return matches;
            },
            media: query,
            addEventListener: vi.fn((_event: string, callback: () => void) => {
                listener = callback;
            }),
            removeEventListener: remove,
        }));
        vi.stubGlobal('matchMedia', matchMedia);
        const view = render(<LayoutProbe />);
        expect(screen.getByText('mobile')).toBeTruthy();
        expect(matchMedia).toHaveBeenCalledWith('(min-width: 1280px)');
        act(() => {
            matches = true;
            listener?.();
        });
        expect(screen.getByText('desktop')).toBeTruthy();
        act(() => {
            matches = false;
            listener?.();
        });
        expect(screen.getByText('mobile')).toBeTruthy();
        view.unmount();
        expect(remove).toHaveBeenCalledWith('change', listener);
    });
});
