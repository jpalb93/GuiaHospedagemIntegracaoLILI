// Simple Analytics Wrapper
// In a real app, this would integrate with GA, Firebase Analytics, or Mixpanel

export const analytics = {
    trackEvent: (eventName: string, params?: Record<string, any>) => {
        // Log to console in development
        if (import.meta.env.DEV) {
            console.log(`[Analytics] ${eventName}`, params);
        }

        // Implementation for Google Analytics 4 (example)
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', eventName, params);
        }
    },

    trackView: (viewName: string) => {
        if (import.meta.env.DEV) {
            console.log(`[Analytics] View: ${viewName}`);
        }
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_title: viewName
            });
        }
    },

    trackCouponGenerated: (params: { guestName: string; couponCode: string }) => {
        if (import.meta.env.DEV) {
            console.log(`[Analytics] Coupon Generated`, params);
        }
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'coupon_generated', params);
        }
    },

    trackReviewModalOpened: () => {
        if (import.meta.env.DEV) console.log(`[Analytics] Review Modal Opened`);
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'review_modal_opened');
        }
    },

    trackReviewLinkClicked: () => {
        if (import.meta.env.DEV) console.log(`[Analytics] Review Link Clicked`);
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'review_link_clicked');
        }
    },

    trackStoryViewed: (params: { type: string; storyId?: string } & Record<string, any>) => {
        if (import.meta.env.DEV) console.log(`[Analytics] Story Viewed`, params);
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'story_viewed', params);
        }
    }
};
