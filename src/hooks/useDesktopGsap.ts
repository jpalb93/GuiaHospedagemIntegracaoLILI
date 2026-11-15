import { useEffect, useRef } from 'react';

type GsapSetup = (gsap: typeof import('gsap').default) => void;

/**
 * Carrega GSAP + ScrollTrigger sob demanda apenas em viewports desktop (>= 801px)
 * e quando o usuário não prefere movimento reduzido, evitando download/parse no mobile.
 */
export function useDesktopGsap(
    scopeRef: React.RefObject<HTMLElement | null>,
    setup: GsapSetup,
    delayMs = 100
) {
    const setupRef = useRef(setup);
    useEffect(() => {
        setupRef.current = setup;
    }, [setup]);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const desktopMql = window.matchMedia('(min-width: 801px)');
        const reducedMql = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (reducedMql.matches) return;

        let cancelled = false;
        let timerId = 0;
        let ctx: { revert: () => void } | undefined;
        let mm: { add: (query: string, func: () => void) => void; revert: () => void } | undefined;

        const boot = async () => {
            if (cancelled || !desktopMql.matches || reducedMql.matches) return;

            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import('gsap'),
                import('gsap/ScrollTrigger'),
            ]);
            if (cancelled || !scopeRef.current) return;

            const gsap = gsapModule.default;
            const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
            gsap.registerPlugin(ScrollTrigger);

            mm = gsap.matchMedia();
            mm.add('(min-width: 801px)', () => {
                ctx = gsap.context(() => {
                    setupRef.current(gsap);
                }, scopeRef);
            });
        };

        const scheduleBoot = () => {
            if (!desktopMql.matches || mm || cancelled) return;
            window.clearTimeout(timerId);
            timerId = window.setTimeout(() => {
                void boot();
            }, delayMs);
        };

        scheduleBoot();

        const handleMediaChange = () => {
            if (desktopMql.matches) {
                scheduleBoot();
            }
        };

        desktopMql.addEventListener?.('change', handleMediaChange);

        return () => {
            cancelled = true;
            window.clearTimeout(timerId);
            desktopMql.removeEventListener?.('change', handleMediaChange);
            if (ctx) ctx.revert();
            if (mm) mm.revert();
        };
    }, [scopeRef, delayMs]);
}
