import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieConsent: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Pequeno delay para não assustar o usuário assim que entra
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
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
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4"
                >
                    <div className="max-w-4xl mx-auto bg-gray-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-gray-700 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="bg-gray-800 p-3 rounded-full hidden sm:block">
                            <Cookie className="text-amber-400" size={24} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <p className="text-sm text-gray-300 leading-relaxed">
                                Utilizamos cookies para melhorar sua experiência e analisar o
                                tráfego do site. Ao continuar navegando, você concorda com nossa{' '}
                                <a
                                    href="/politica-privacidade"
                                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2"
                                >
                                    Política de Privacidade
                                </a>
                                .
                            </p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={handleAccept}
                                className="flex-1 sm:flex-none bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-amber-900/20 text-sm whitespace-nowrap"
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
