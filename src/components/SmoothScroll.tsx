import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * SmoothScroll Component
 * Initializes Lenis for smooth scrolling and synchronizes it with GSAP ScrollTrigger.
 * Place this component once in the root of your app (e.g., inside App.tsx or MainLayout).
 */
const SmoothScroll = () => {
    useEffect(() => {
        // Initialize Lenis
        const lenis = new Lenis({
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
        // Note: We use gsap.ticker to ensure Lenis updates in sync with GSAP animations
        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        // Disable lag smoothing in GSAP to prevent jumps during heavy scrolling
        gsap.ticker.lagSmoothing(0);

        // Cleanup function
        return () => {
            lenis.destroy();
            gsap.ticker.remove(update);
        };
    }, []);

    return null; // This component does not render anything visual
};

export default SmoothScroll;
