import { useLayoutEffect } from 'react';

/**
 * ArticleScrollReset
 * Forces the window to scroll to the top immediately upon mounting.
 * This is used to fix an issue where navigating to articles from the home page
 * would sometimes retain the previous scroll position (footer).
 */
const ArticleScrollReset = () => {
    useLayoutEffect(() => {
        // Force scroll to top immediately
        window.scrollTo(0, 0);

        // Retry to ensure it sticks against any async layout shifts
        const frame1 = requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            requestAnimationFrame(() => window.scrollTo(0, 0));
        });

        return () => cancelAnimationFrame(frame1);
    }, []);

    return null;
};

export default ArticleScrollReset;
