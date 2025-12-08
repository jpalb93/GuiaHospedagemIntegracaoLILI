import { track } from '@vercel/analytics';

/**
 * Analytics event tracking utilities
 * Centralized tracking for all user interactions
 */

// Event Types
export type AnalyticsEvent =
    | 'review_modal_opened'
    | 'coupon_generated'
    | 'story_viewed'
    | 'language_changed'
    | 'theme_toggled'
    | 'ai_chat_opened'
    | 'emergency_clicked'
    | 'review_link_clicked'
    | 'support_opened'
    | 'checkout_started';

// Event Properties
interface CouponGeneratedProps {
    guestName: string;
    couponCode: string;
}

interface StoryViewedProps {
    type: 'agenda' | 'curiosities' | 'tips';
    hasActiveEvents?: boolean;
}

interface LanguageChangedProps {
    from: 'pt' | 'en';
    to: 'pt' | 'en';
}

interface ThemeToggledProps {
    theme: 'light' | 'dark';
}

// Tracking Functions
export const analytics = {
    /**
     * Track when review incentive modal is opened
     */
    trackReviewModalOpened: () => {
        track('review_modal_opened');
    },

    /**
     * Track when a coupon is generated
     */
    trackCouponGenerated: (props: CouponGeneratedProps) => {
        track('coupon_generated', {
            guest_name: props.guestName,
            coupon_code: props.couponCode,
        });
    },

    /**
     * Track when a story is viewed
     */
    trackStoryViewed: (props: StoryViewedProps) => {
        track('story_viewed', {
            story_type: props.type,
            has_active_events: props.hasActiveEvents ?? false,
        });
    },

    /**
     * Track language changes
     */
    trackLanguageChanged: (props: LanguageChangedProps) => {
        track('language_changed', {
            from_lang: props.from,
            to_lang: props.to,
        });
    },

    /**
     * Track theme toggles
     */
    trackThemeToggled: (props: ThemeToggledProps) => {
        track('theme_toggled', {
            new_theme: props.theme,
        });
    },

    /**
     * Track AI chat opens
     */
    trackAIChatOpened: () => {
        track('ai_chat_opened');
    },

    /**
     * Track emergency button clicks
     */
    trackEmergencyClicked: () => {
        track('emergency_clicked');
    },

    /**
     * Track when user clicks review link
     */
    trackReviewLinkClicked: () => {
        track('review_link_clicked');
    },

    /**
     * Track support modal opens
     */
    trackSupportOpened: () => {
        track('support_opened');
    },

    /**
     * Track checkout process starts
     */
    trackCheckoutStarted: () => {
        track('checkout_started');
    },
};

export default analytics;
