import ReactGA from 'react-ga4';
import { GA_MEASUREMENT_ID, ANALYTICS_CONFIG } from '../config/analyticsConfig';

// Initialize GA4
// This should be called once at the root of your app
export const initAnalytics = () => {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
        testMode: ANALYTICS_CONFIG.debug,
    });

    if (ANALYTICS_CONFIG.debug) {
        console.log('[Analytics] Initialized with ID:', GA_MEASUREMENT_ID);
    }
};

export const analytics = {
    trackEvent: (eventName: string, params?: Record<string, string | number | boolean>) => {
        // Log to console in development
        if (ANALYTICS_CONFIG.debug) {
            console.log(`[Analytics] ${eventName}`, params);
        }

        // Send to GA4
        ReactGA.event(eventName, params);
    },

    trackView: (viewName: string) => {
        if (ANALYTICS_CONFIG.debug) {
            console.log(`[Analytics] View: ${viewName}`);
        }

        // GA4 automatically tracks pages if connected to the router,
        // but for manual view tracking (like modals):
        ReactGA.send({
            hitType: 'pageview',
            page: window.location.pathname + window.location.search,
            title: viewName,
        });
    },

    trackCouponGenerated: (params: { guestName: string; couponCode: string }) => {
        if (ANALYTICS_CONFIG.debug) {
            console.log(`[Analytics] Coupon Generated`, params);
        }

        ReactGA.event({
            category: 'Conversion',
            action: 'coupon_generated',
            label: params.couponCode,
            value: 1, // Assign a value if suitable
        });
    },

    trackReviewModalOpened: () => {
        if (ANALYTICS_CONFIG.debug) console.log(`[Analytics] Review Modal Opened`);

        ReactGA.event({
            category: 'Engagement',
            action: 'review_modal_opened',
        });
    },

    trackReviewLinkClicked: () => {
        if (ANALYTICS_CONFIG.debug) console.log(`[Analytics] Review Link Clicked`);

        ReactGA.event({
            category: 'Engagement',
            action: 'review_link_clicked',
        });
    },

    trackStoryViewed: (
        params: { type: string; storyId?: string } & Record<string, string | number | boolean>
    ) => {
        if (ANALYTICS_CONFIG.debug) console.log(`[Analytics] Story Viewed`, params);

        ReactGA.event({
            category: 'Content',
            action: 'story_viewed',
            label: params.type,
        });
    },
};
