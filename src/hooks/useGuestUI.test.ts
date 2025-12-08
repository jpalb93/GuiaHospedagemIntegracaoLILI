import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGuestUI } from './useGuestUI';

// Mock navigator
global.navigator.vibrate = vi.fn();
global.navigator.clipboard = {
    writeText: vi.fn(),
} as any;

describe('useGuestUI', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Modals Management', () => {
        it('should initialize all modals as closed', () => {
            const { result } = renderHook(() => useGuestUI());

            expect(result.current.modals.showDriverMode).toBe(false);
            expect(result.current.modals.showOfflineCard).toBe(false);
            expect(result.current.modals.showVideoModal).toBe(false);
            expect(result.current.modals.isCheckinModalOpen).toBe(false);
            expect(result.current.modals.isCheckoutModalOpen).toBe(false);
            expect(result.current.modals.isSupportModalOpen).toBe(false);
            expect(result.current.modals.isStoryOpen).toBe(false);
        });

        it('should toggle driver mode', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.modals.setShowDriverMode(true);
            });

            expect(result.current.modals.showDriverMode).toBe(true);
        });
    });

    describe('Video Modal', () => {
        it('should open video modal with horizontal video', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.video.openVideoModal('https://video.url');
            });

            expect(result.current.video.currentVideoUrl).toBe('https://video.url');
            expect(result.current.video.isVideoVertical).toBe(false);
            expect(result.current.modals.showVideoModal).toBe(true);
            expect(navigator.vibrate).toHaveBeenCalledWith(50);
        });

        it('should open video modal with vertical video', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.video.openVideoModal('https://vertical.url', true);
            });

            expect(result.current.video.isVideoVertical).toBe(true);
        });
    });

    describe('Checkout Modal', () => {
        it('should open checkout modal with key details', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.checkout.handleOpenKeyDetails();
            });

            expect(result.current.modals.isCheckoutModalOpen).toBe(true);
            expect(result.current.checkout.startOnKeyDetails).toBe(true);
            expect(navigator.vibrate).toHaveBeenCalledWith(50);
        });

        it('should close checkout modal and reset key details flag', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.checkout.handleOpenKeyDetails();
            });

            act(() => {
                result.current.checkout.handleCloseCheckout();
            });

            expect(result.current.modals.isCheckoutModalOpen).toBe(false);

            act(() => {
                vi.advanceTimersByTime(500);
            });

            expect(result.current.checkout.startOnKeyDetails).toBe(false);
        });
    });

    describe('Clipboard Functionality', () => {
        it('should copy WiFi credentials', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.clipboard.copyToClipboard('MyWiFi-Password', 'wifi');
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('MyWiFi-Password');
            expect(result.current.clipboard.wifiCopied).toBe(true);
            expect(navigator.vibrate).toHaveBeenCalledWith(50);
        });

        it('should reset wifi copied state after 2 seconds', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.clipboard.copyToClipboard('Password', 'wifi');
            });

            expect(result.current.clipboard.wifiCopied).toBe(true);

            act(() => {
                vi.advanceTimersByTime(2000);
            });

            expect(result.current.clipboard.wifiCopied).toBe(false);
        });

        it('should copy address', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.clipboard.copyToClipboard('123 Main St', 'address');
            });

            expect(navigator.clipboard.writeText).toHaveBeenCalledWith('123 Main St');
            expect(result.current.clipboard.addressCopied).toBe(true);
        });

        it('should reset address copied state after 2 seconds', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.clipboard.copyToClipboard('Address', 'address');
            });

            expect(result.current.clipboard.addressCopied).toBe(true);

            act(() => {
                vi.advanceTimersByTime(2000);
            });

            expect(result.current.clipboard.addressCopied).toBe(false);
        });
    });

    describe('Stories', () => {
        it('should set story start index', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.stories.setStoryStartIndex(3);
            });

            expect(result.current.stories.storyStartIndex).toBe(3);
        });

        it('should open stories modal', () => {
            const { result } = renderHook(() => useGuestUI());

            act(() => {
                result.current.modals.setIsStoryOpen(true);
            });

            expect(result.current.modals.isStoryOpen).toBe(true);
        });
    });
});
