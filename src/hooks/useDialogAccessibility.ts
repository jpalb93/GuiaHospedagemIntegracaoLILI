import { useEffect, useRef } from 'react';

interface UseDialogAccessibilityOptions {
    isOpen: boolean;
    dialogRef: React.RefObject<HTMLElement | null>;
    onClose: () => void;
    onPrev?: () => void;
    onNext?: () => void;
}

const FOCUSABLE_SELECTOR =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Gerencia trava de scroll, foco inicial, ciclo de Tab, atalhos de teclado
 * (Escape e setas opcionais) e restauração de foco para diálogos e lightboxes.
 */
export function useDialogAccessibility({
    isOpen,
    dialogRef,
    onClose,
    onPrev,
    onNext,
}: UseDialogAccessibilityOptions) {
    const onCloseRef = useRef(onClose);
    const onPrevRef = useRef(onPrev);
    const onNextRef = useRef(onNext);

    useEffect(() => {
        onCloseRef.current = onClose;
        onPrevRef.current = onPrev;
        onNextRef.current = onNext;
    }, [onClose, onPrev, onNext]);

    useEffect(() => {
        if (!isOpen || typeof document === 'undefined') return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusTimer = window.requestAnimationFrame(() => {
            const container = dialogRef.current;
            if (!container) return;
            const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
            const target = focusables[0] ?? container;
            if (target && typeof target.focus === 'function') {
                target.focus({ preventScroll: true });
            }
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCloseRef.current();
                return;
            }
            if (e.key === 'ArrowLeft' && onPrevRef.current) {
                onPrevRef.current();
                return;
            }
            if (e.key === 'ArrowRight' && onNextRef.current) {
                onNextRef.current();
                return;
            }
            if (e.key !== 'Tab') return;

            const container = dialogRef.current;
            if (!container) return;
            const focusables = Array.from(
                container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
            ).filter((el) => el.offsetParent !== null || el === document.activeElement);

            if (focusables.length === 0) {
                e.preventDefault();
                return;
            }

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;

            if (e.shiftKey) {
                if (active === first || !container.contains(active)) {
                    e.preventDefault();
                    last.focus();
                }
            } else if (active === last || !container.contains(active)) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.cancelAnimationFrame(focusTimer);
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = prevOverflow;
            if (previouslyFocused && previouslyFocused.isConnected) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, [isOpen, dialogRef]);
}
