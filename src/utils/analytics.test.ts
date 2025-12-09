import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analytics } from './analytics';
import { track } from '@vercel/analytics';

// Mock everything from @vercel/analytics
vi.mock('@vercel/analytics', () => ({
    track: vi.fn(),
}));

describe('analytics', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should track review modal opening', () => {
        analytics.trackReviewModalOpened();
        expect(track).toHaveBeenCalledWith('review_modal_opened');
    });

    it('should track coupon generation with correct params', () => {
        const props = { guestName: 'John', couponCode: 'ABC-123' };
        analytics.trackCouponGenerated(props);

        expect(track).toHaveBeenCalledWith('coupon_generated', {
            guest_name: 'John',
            coupon_code: 'ABC-123',
        });
    });

    it('should track story views correctly', () => {
        analytics.trackStoryViewed({ type: 'agenda', hasActiveEvents: true });

        expect(track).toHaveBeenCalledWith('story_viewed', {
            story_type: 'agenda',
            has_active_events: true,
        });
    });

    it('should track language changes', () => {
        analytics.trackLanguageChanged({ from: 'pt', to: 'en' });

        expect(track).toHaveBeenCalledWith('language_changed', {
            from_lang: 'pt',
            to_lang: 'en',
        });
    });

    it('should track theme toggles', () => {
        analytics.trackThemeToggled({ theme: 'dark' });

        expect(track).toHaveBeenCalledWith('theme_toggled', {
            new_theme: 'dark',
        });
    });

    it('should track simple events', () => {
        analytics.trackAIChatOpened();
        expect(track).toHaveBeenCalledWith('ai_chat_opened');

        analytics.trackEmergencyClicked();
        expect(track).toHaveBeenCalledWith('emergency_clicked');

        analytics.trackReviewLinkClicked();
        expect(track).toHaveBeenCalledWith('review_link_clicked');

        analytics.trackSupportOpened();
        expect(track).toHaveBeenCalledWith('support_opened');

        analytics.trackCheckoutStarted();
        expect(track).toHaveBeenCalledWith('checkout_started');
    });
});
