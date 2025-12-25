/**
 * Google Analytics Configuration
 *
 * REPLACE 'G-XXXXXXXXXX' with your actual Measurement ID.
 * You can find this in: Google Analytics > Admin > Data Streams > Web Stream Details
 */
export const GA_MEASUREMENT_ID = 'G-EZ81121627';

export const ANALYTICS_CONFIG = {
    enabled: !import.meta.env.DEV, // Only enable in production by default
    debug: import.meta.env.DEV, // Enable debug mode in development
};
