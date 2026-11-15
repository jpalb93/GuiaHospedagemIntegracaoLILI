import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        document.documentElement.dataset.cookieConsent = isVisible ? 'open' : 'closed';
        window.dispatchEvent(new CustomEvent('cookie-consent-visibility', { detail: isVisible }));
    }, [isVisible]);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            let shown = false;
            const reveal = () => {
                if (shown) return;
                shown = true;
                setIsVisible(true);
                window.removeEventListener('scroll', reveal);
                window.removeEventListener('pointerdown', reveal);
            };
            // Reveal on first interaction or after hero settles without hijacking initial paint
            window.addEventListener('scroll', reveal, { passive: true, once: true });
            window.addEventListener('pointerdown', reveal, { passive: true, once: true });
            const timer = setTimeout(reveal, 3500);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('scroll', reveal);
                window.removeEventListener('pointerdown', reveal);
            };
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={shouldReduceMotion ? { opacity: 1 } : { y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { y: 100, opacity: 0 }}
                    transition={shouldReduceMotion ? { duration: 0.01 } : undefined}
                    className="fixed bottom-0 left-0 right-0 z-[60] p-3 sm:p-4 [&_p]:text-xs [&_p]:leading-snug"
                >
                    <div className="max-w-4xl mx-auto bg-[#161412] sm:bg-[#161412]/95 sm:backdrop-blur-xl text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-white/15 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="bg-white/5 border border-white/10 p-3 rounded-full hidden sm:block">
                            <Cookie className="text-[#E5C98B]" size={22} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-stone-300 leading-relaxed">
                                Utilizamos cookies para melhorar sua experiência e analisar o
                                tráfego do site. Ao continuar navegando, você concorda com nossa{' '}
                                <a
                                    href="/politica-privacidade"
                                    className="text-[#E5C98B] hover:text-[#f1ddb0] underline underline-offset-2"
                                >
                                    Política de Privacidade
                                </a>
                                .
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleAccept}
                                className="flex-1 sm:flex-none bg-[#E5C98B] hover:bg-[#edd6a1] text-[#141210] font-semibold py-2.5 px-6 rounded-full transition-colors shadow-lg shadow-black/20 text-sm whitespace-nowrap"
                            >
                                Aceitar e Fechar
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
