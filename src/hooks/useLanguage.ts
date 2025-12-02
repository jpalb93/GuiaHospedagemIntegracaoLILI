import { useState } from 'react';

export type Language = 'pt' | 'en';

export const useLanguage = () => {
    const [currentLang, setCurrentLang] = useState<Language>(() => {
        if (typeof document === 'undefined') return 'pt';
        const cookies = document.cookie.split(';');
        const transCookie = cookies.find(c => c.trim().startsWith('googtrans='));
        if (transCookie && transCookie.includes('/pt/en')) {
            return 'en';
        }
        return 'pt';
    });

    const toggleLanguage = () => {
        if (currentLang === 'pt') {
            document.cookie = "googtrans=/pt/en; path=/";
            setCurrentLang('en');
        } else {
            document.cookie = "googtrans=/pt/pt; path=/";
            setCurrentLang('pt');
        }
        window.location.reload();
    };

    return {
        currentLang,
        toggleLanguage
    };
};
