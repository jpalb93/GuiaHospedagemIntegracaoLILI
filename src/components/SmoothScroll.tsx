import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll Component
 * Initializes Lenis for smooth scrolling and synchronizes it with GSAP ScrollTrigger.
 */
const SmoothScroll = () => {
    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Expose to window for debugging and other components
        (window as any).lenis = lenis;

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Add Lenis to GSAP Ticker
        const rafUpdate = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(rafUpdate);
        gsap.ticker.lagSmoothing(0);

        // Cleanup function
        return () => {
            gsap.ticker.remove(rafUpdate);
            lenis.destroy();
            (window as any).lenis = null;
        };
    }, []);

    return null;
};

export default SmoothScroll;
