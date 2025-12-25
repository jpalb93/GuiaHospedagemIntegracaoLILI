/**
 * Structured Logger
 * Provides consistent JSON logging with context support.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: unknown;
}

class Logger {
    private context: LogContext = {};
    // Fallback to true if undefined (e.g. simple tests) or check proper env
    private isDev: boolean = import.meta.env
        ? import.meta.env.DEV
        : process.env.NODE_ENV !== 'production';

    /**
     * Set global context fields (e.g. userId, tenantId)
     * merged with existing context.
     */
    setContext(context: LogContext) {
        this.context = { ...this.context, ...context };
    }

    /**
     * Clear specific or all context
     */
    clearContext() {
        this.context = {};
    }

    private format(level: LogLevel, message: string, meta?: LogContext): unknown[] {
        const timestamp = new Date().toISOString();

        // In Development: Pretty print for readability
        if (this.isDev) {
            const mergedMeta = { ...this.context, ...meta };
            const hasMeta = Object.keys(mergedMeta).length > 0;
            return hasMeta
                ? [`[${level.toUpperCase()}] ${message}`, mergedMeta]
                : [`[${level.toUpperCase()}] ${message}`];
        }

        // In Production: JSON string for aggregation tools
        const entry = {
            timestamp,
            level,
            message,
            ...this.context,
            ...meta,
        };
        return [JSON.stringify(entry)];
    }

    info(message: string, meta?: LogContext) {
        // Only log info in dev to avoid console noise in prod, unless specifically needed
        if (this.isDev) {
            console.info(...this.format('info', message, meta));
        }
    }

    warn(message: string, meta?: LogContext) {
        // Warnings are usually relevant in Dev
        if (this.isDev) {
            console.warn(...this.format('warn', message, meta));
        }
    }

    error(message: string | Error, meta?: LogContext) {
        // Errors are always logged
        let msg = '';
        let errorMeta = {};

        if (message instanceof Error) {
            msg = message.message;
            errorMeta = {
                name: message.name,
                stack: message.stack,
                cause: (message as Error & { cause?: unknown }).cause,
            };
        } else {
            msg = message;
        }

        const finalMeta = { ...errorMeta, ...meta };
        console.error(...this.format('error', msg, finalMeta));
    }

    debug(message: string, meta?: LogContext) {
        if (this.isDev) {
            console.debug(...this.format('debug', message, meta));
        }
    }
}

export const logger = new Logger();
