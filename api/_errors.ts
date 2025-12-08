import { VercelResponse } from '@vercel/node';
import { logger } from '../src/utils/logger';

/**
 * Custom API Error class for typed error handling
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Centralized error handler for all API endpoints
 * Returns consistent error responses and logs appropriately
 */
export const handleApiError = (res: VercelResponse, error: unknown): VercelResponse => {
    // Handle our custom ApiError
    if (error instanceof ApiError) {
        logger.warn(`API Error [${error.code || 'UNKNOWN'}]:`, error.message);
        return res.status(error.statusCode).json({
            error: error.message,
            code: error.code || 'API_ERROR',
        });
    }

    // Handle Zod validation errors
    if (error && typeof error === 'object' && 'issues' in error) {
        logger.warn('Validation error:', error);
        return res.status(400).json({
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error,
        });
    }

    // Handle generic errors
    logger.error('Unhandled API error:', error);
    return res.status(500).json({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
    });
};

/**
 * Common API errors for reuse
 */
export const ApiErrors = {
    MissingParameter: (param: string) => new ApiError(400, `Missing required parameter: ${param}`, 'MISSING_PARAMETER'),
    InvalidParameter: (param: string) => new ApiError(400, `Invalid parameter: ${param}`, 'INVALID_PARAMETER'),
    NotFound: (resource: string) => new ApiError(404, `${resource} not found`, 'NOT_FOUND'),
    Unauthorized: () => new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'),
    RateLimitExceeded: () => new ApiError(429, 'Rate limit exceeded', 'RATE_LIMIT'),
    InternalError: (message?: string) => new ApiError(500, message || 'Internal server error', 'INTERNAL_ERROR'),
};
