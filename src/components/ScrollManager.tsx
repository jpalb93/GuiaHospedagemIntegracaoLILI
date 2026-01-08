import { useEffect, useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * ScrollManager Component
 * 1. Disables native scroll restoration.
 * 2. Instantly resets scroll on PUSH/REPLACE navigations.
 * 3. Restores saved Home position on back (POP) navigation.
 * 4. Uses double-reset strategy to combat layout shifts during transitions.
 */
const ScrollManager = () => {
    const { pathname } = useLocation();
    const navType = useNavigationType();

    // Force manual scroll restoration
    useLayoutEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Instant reset / restoration on route change
    useLayoutEffect(() => {
        const isPush = navType === 'PUSH' || navType === 'REPLACE';
        const isBack = navType === 'POP';

        if (isPush) {
            // SCROLL JAIL: Lock the body to prevent browser scroll restoration
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            // Force reset
            window.scrollTo(0, 0);

            // Keep it locked for a short duration to let browser restoration attempts fail
            const t1 = setTimeout(() => {
                window.scrollTo(0, 0);
            }, 10);

            const t2 = setTimeout(() => {
                window.scrollTo(0, 0);
            }, 50);

            // Release the jail
            const unlockParams = {
                delay: 300 // Sufficient time for transitions to settle
            };

            const tUnlock = setTimeout(() => {
                document.body.style.overflow = originalOverflow;
                document.documentElement.style.overflow = '';
                // Final enforcement
                if (window.scrollY > 0) window.scrollTo(0, 0);
            }, unlockParams.delay);

            return () => {
                clearTimeout(t1);
                clearTimeout(t2);
                clearTimeout(tUnlock);
                // Safety cleanup in case of rapid unmount
                document.body.style.overflow = originalOverflow;
                document.documentElement.style.overflow = '';
            };
        } else if (isBack && pathname === '/') {
            const saved = sessionStorage.getItem('home_scroll_pos');
            if (saved) {
                const yPos = parseInt(saved, 10);
                window.scrollTo(0, yPos);

                // Retry restoration just in case
                setTimeout(() => window.scrollTo(0, yPos), 10);
            }
        }
    }, [pathname, navType]);

    // Save position before route change
    useEffect(() => {
        const handleSave = () => {
            if (window.location.pathname === '/') {
                sessionStorage.setItem('home_scroll_pos', window.scrollY.toString());
            }
        };

        // Listen for browser navigation / close
        window.addEventListener('beforeunload', handleSave);

        // Save on route change cleanup
        return () => {
            handleSave();
            window.removeEventListener('beforeunload', handleSave);
        };
    }, [pathname]);

    return null;
};

export default ScrollManager;
