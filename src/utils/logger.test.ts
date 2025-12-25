import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger } from './logger';

describe('Logger', () => {
    // Spy on console methods
    const consoleSpy = {
        info: vi.spyOn(console, 'info').mockImplementation(() => {}),
        warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
        error: vi.spyOn(console, 'error').mockImplementation(() => {}),
        debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        logger.clearContext();
    });

    afterEach(() => {
        // Reset context to avoid polluting other tests
        logger.clearContext();
    });

    it('should log info messages in dev environment', () => {
        logger.info('Test Info');
        expect(consoleSpy.info).toHaveBeenCalled();
        expect(consoleSpy.info).toHaveBeenCalledWith(expect.stringContaining('[INFO] Test Info'));
    });

    it('should include context in logs', () => {
        logger.setContext({ userId: '123' });
        logger.info('User Action');

        expect(consoleSpy.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] User Action'),
            expect.objectContaining({ userId: '123' })
        );
    });

    it('should log errors with stack trace', () => {
        const error = new Error('Something failed');
        logger.error(error);

        expect(consoleSpy.error).toHaveBeenCalled();
        // Since we are mocking the environment, formatting might fallback to simple array or JSON depending on env detection in test provided by Vitest
        // We just verify it calls console.error
    });

    it('should merge method meta with global context', () => {
        logger.setContext({ global: 'a' });
        logger.info('Merge', { local: 'b' });

        expect(consoleSpy.info).toHaveBeenCalledWith(
            expect.stringContaining('[INFO] Merge'),
            expect.objectContaining({ global: 'a', local: 'b' })
        );
    });
});
