import { useEffect } from 'react';
import type Lenis from 'lenis';
import type gsap from 'gsap';
// Dynamic imports used instead

/**
 * SmoothScroll Component
 * Initializes Lenis for smooth scrolling and synchronizes it with GSAP ScrollTrigger.
 * Place this component once in the root of your app (e.g., inside App.tsx or MainLayout).
 */
const SmoothScroll = () => {
    useEffect(() => {
        let lenis: Lenis;
        let gsapVal: typeof gsap;
        let rafUpdate: (time: number) => void;

        const init = async () => {
            const [gsapModule, scrollTriggerModule, lenisModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
                import('lenis')
            ]);

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            const Lenis = lenisModule.default;
            gsapVal = gsap;

            // Initialize Lenis
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default easing
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            });

            // Sync Lenis with GSAP ScrollTrigger
            lenis.on('scroll', ScrollTrigger.update);

            // Add Lenis to GSAP Ticker for smooth animation frame updates
            rafUpdate = (time: number) => {
                lenis.raf(time * 1000);
            };

            gsap.ticker.add(rafUpdate);

            // Disable lag smoothing in GSAP to prevent jumps during heavy scrolling
            gsap.ticker.lagSmoothing(0);
        };

        const timer = setTimeout(() => {
            init();
        }, 100);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            if (lenis) lenis.destroy();
            if (gsapVal && rafUpdate) gsapVal.ticker.remove(rafUpdate);
        };
    }, []);

    return null; // This component does not render anything visual
};

export default SmoothScroll;
