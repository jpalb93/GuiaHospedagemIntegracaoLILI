import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
    currentLang: Language;
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    t: (ptText: string, enText?: string, esText?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentLang, setCurrentLang] = useState<Language>(() => {
        try {
            if (typeof window !== 'undefined') {
                const saved = window.localStorage.getItem('app_lang');
                return (saved as Language) || 'pt';
            }
        } catch (error) {
            console.warn('LocalStorage access denied', error);
        }
        return 'pt';
    });

    const toggleLanguage = () => {
        // Cycle: pt -> en -> es -> pt
        const nextLang = currentLang === 'pt' ? 'en' : currentLang === 'en' ? 'es' : 'pt';
        setLanguage(nextLang);
    };

    const setLanguage = (lang: Language) => {
        setCurrentLang(lang);
        try {
            window.localStorage.setItem('app_lang', lang);
        } catch (error) {
            console.warn('LocalStorage save failed', error);
        }
    };

    /**
     * Helper to return the correct text based on language
     * @param ptText Text in Portuguese (fallback)
     * @param enText Text in English (optional)
     * @param esText Text in Spanish (optional)
     */
    const t = (ptText: string, enText?: string, esText?: string): string => {
        if (currentLang === 'en' && enText) return enText;
        if (currentLang === 'es' && esText) return esText;
        // Fallback chain: if ES missing, try EN? No, stick to PT as strict fallback or user preference?
        // Let's stick to PT as base.
        return ptText;
    };

    return (
        <LanguageContext.Provider value={{ currentLang, toggleLanguage, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
