import { useEffect, useRef, useState } from 'react';

type CopyState = { scope: string; field: string; state: 'pending' | 'success' | 'error' };

/** Feedback belongs to the exact credential being copied, never to a previous reservation. */
export function useAccessClipboard(scope: string) {
    const [state, setState] = useState<CopyState | null>(null);
    const mounted = useRef(true);
    const timer = useRef<ReturnType<typeof setTimeout>>();
    const request = useRef(0);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
            clearTimeout(timer.current);
        };
    }, []);
    useEffect(() => {
        request.current += 1;
        clearTimeout(timer.current);
    }, [scope]);
    const copy = async (value: string, field: string) => {
        const currentRequest = ++request.current;
        clearTimeout(timer.current);
        setState({ scope, field, state: 'pending' });
        try {
            await navigator.clipboard.writeText(value);
            if (!mounted.current || currentRequest !== request.current) return;
            setState({ scope, field, state: 'success' });
            timer.current = setTimeout(() => setState(null), 2500);
        } catch {
            if (mounted.current && currentRequest === request.current)
                setState({ scope, field, state: 'error' });
        }
    };
    return { copy, feedback: state?.scope === scope ? state : null };
}
