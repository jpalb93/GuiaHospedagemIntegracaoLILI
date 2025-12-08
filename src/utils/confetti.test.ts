import { describe, it, expect, vi, beforeEach } from 'vitest';
import { triggerConfetti } from './confetti';
import confetti from 'canvas-confetti';

// Mock canvas-confetti library
vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

describe('Confetti Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: 1024,
        });
        Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: 768,
        });
    });

    describe('triggerConfetti', () => {
        it('should call confetti with default origin when no element provided', () => {
            triggerConfetti();

            expect(confetti).toHaveBeenCalledTimes(1);
            expect(confetti).toHaveBeenCalledWith({
                particleCount: 100,
                spread: 70,
                origin: { x: 0.5, y: 0.7 }, // Center-bottom default
                colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
                disableForReducedMotion: true,
                zIndex: 9999,
            });
        });

        it('should calculate origin from element position', () => {
            // Mock element with getBoundingClientRect
            const mockElement = {
                getBoundingClientRect: vi.fn().mockReturnValue({
                    left: 200,
                    top: 100,
                    width: 100,
                    height: 50,
                }),
            } as unknown as HTMLElement;

            triggerConfetti(mockElement);

            // Expected origin:
            // x = (200 + 100/2) / 1024 = 250 / 1024 ≈ 0.244
            // y = (100 + 50/2) / 768 = 125 / 768 ≈ 0.163
            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    origin: {
                        x: (200 + 50) / 1024,
                        y: (100 + 25) / 768,
                    },
                })
            );
        });

        it('should use correct particle count and spread', () => {
            triggerConfetti();

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    particleCount: 100,
                    spread: 70,
                })
            );
        });

        it('should use correct colors', () => {
            triggerConfetti();

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    colors: ['#FF5733', '#FFC300', '#DAF7A6', '#C70039', '#900C3F'],
                })
            );
        });

        it('should have accessibility settings enabled', () => {
            triggerConfetti();

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    disableForReducedMotion: true,
                })
            );
        });

        it('should set high zIndex for modal visibility', () => {
            triggerConfetti();

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    zIndex: 9999,
                })
            );
        });

        it('should handle element at top-left corner', () => {
            const mockElement = {
                getBoundingClientRect: vi.fn().mockReturnValue({
                    left: 0,
                    top: 0,
                    width: 50,
                    height: 50,
                }),
            } as unknown as HTMLElement;

            triggerConfetti(mockElement);

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    origin: {
                        x: 25 / 1024,
                        y: 25 / 768,
                    },
                })
            );
        });

        it('should handle element at bottom-right corner', () => {
            const mockElement = {
                getBoundingClientRect: vi.fn().mockReturnValue({
                    left: 900,
                    top: 700,
                    width: 100,
                    height: 50,
                }),
            } as unknown as HTMLElement;

            triggerConfetti(mockElement);

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    origin: {
                        x: (900 + 50) / 1024,
                        y: (700 + 25) / 768,
                    },
                })
            );
        });

        it('should handle different window sizes', () => {
            // Change window size
            Object.defineProperty(window, 'innerWidth', { value: 2048 });
            Object.defineProperty(window, 'innerHeight', { value: 1536 });

            const mockElement = {
                getBoundingClientRect: vi.fn().mockReturnValue({
                    left: 400,
                    top: 300,
                    width: 200,
                    height: 100,
                }),
            } as unknown as HTMLElement;

            triggerConfetti(mockElement);

            expect(confetti).toHaveBeenCalledWith(
                expect.objectContaining({
                    origin: {
                        x: (400 + 100) / 2048,
                        y: (300 + 50) / 1536,
                    },
                })
            );
        });
    });
});
