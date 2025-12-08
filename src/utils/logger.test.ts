import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('Logger Utility', () => {
    // Save original console methods
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
    };

    // Mock console methods
    beforeEach(() => {
        console.log = vi.fn();
        console.warn = vi.fn();
        console.error = vi.fn();
        console.info = vi.fn();
    });

    afterEach(() => {
        // Restore original console methods
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.info = originalConsole.info;
        vi.clearAllMocks();
    });

    describe('Development Environment', () => {
        // import.meta.env.DEV is set by Vite during test runs
        // In test environment, it's typically true

        it('should call console.log in dev mode', () => {
            logger.log('Test message', 123);

            // In dev, logger.log should call console.log
            if (import.meta.env.DEV) {
                expect(console.log).toHaveBeenCalledWith('Test message', 123);
            }
        });

        it('should call console.warn in dev mode', () => {
            logger.warn('Warning message', { data: 'test' });

            if (import.meta.env.DEV) {
                expect(console.warn).toHaveBeenCalledWith('Warning message', { data: 'test' });
            }
        });

        it('should call console.info in dev mode', () => {
            logger.info('Info message');

            if (import.meta.env.DEV) {
                expect(console.info).toHaveBeenCalledWith('Info message');
            }
        });
    });

    describe('Error Logging', () => {
        it('should always call console.error regardless of environment', () => {
            logger.error('Error message', new Error('Test error'));

            // Error should always be logged
            expect(console.error).toHaveBeenCalledWith('Error message', expect.any(Error));
        });

        it('should handle multiple error arguments', () => {
            logger.error('Multiple', 'error', 'args');
            expect(console.error).toHaveBeenCalledWith('Multiple', 'error', 'args');
        });

        it('should handle error objects', () => {
            const error = new Error('Test error');
            logger.error(error);
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('Argument Handling', () => {
        it('should handle multiple arguments for log', () => {
            logger.log('arg1', 'arg2', 'arg3', 123, { key: 'value' });

            if (import.meta.env.DEV) {
                expect(console.log).toHaveBeenCalledWith('arg1', 'arg2', 'arg3', 123, { key: 'value' });
            }
        });

        it('should handle no arguments', () => {
            logger.log();

            if (import.meta.env.DEV) {
                expect(console.log).toHaveBeenCalledWith();
            }
        });

        it('should handle objects and arrays', () => {
            const obj = { test: 'data' };
            const arr = [1, 2, 3];

            logger.info(obj, arr);

            if (import.meta.env.DEV) {
                expect(console.info).toHaveBeenCalledWith(obj, arr);
            }
        });
    });

    describe('Type Safety', () => {
        it('should accept any type of arguments', () => {
            // Should not throw type errors
            logger.log('string', 123, true, null, undefined, { obj: 'val' }, [1, 2]);
            logger.warn(Symbol('test'));
            logger.info(BigInt(123));

            // Just verify no errors were thrown
            expect(true).toBe(true);
        });
    });
});
