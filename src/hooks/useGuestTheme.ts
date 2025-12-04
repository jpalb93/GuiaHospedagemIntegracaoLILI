import { useMemo } from 'react';
import { PropertyId } from '../types';

interface ThemeColors {
    background: string;
    backgroundGradient: string;
    border: string;
    text: {
        primary: string;
        secondary: string;
        accent: string;
        highlight: string;
    };
    button: {
        primary: string;
        secondary: string;
    };
    effects: {
        glow: string;
        blob1: string;
        blob2: string;
    };
}

export const useGuestTheme = (propertyId: PropertyId) => {
    const theme: ThemeColors = useMemo(() => {
        if (propertyId === 'integracao') {
            // Navy Blue / Silver / Cyan Theme (Executive/Clean)
            return {
                background: 'bg-[#0F172A]', // Slate 900
                backgroundGradient: 'bg-gradient-to-br from-[#0F172A] to-[#1E293B]',
                border: 'border-cyan-500/20',
                text: {
                    primary: 'text-white',
                    secondary: 'text-slate-400',
                    accent: 'text-cyan-400',
                    highlight: 'text-sky-300',
                },
                button: {
                    primary: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-900/20',
                    secondary: 'bg-slate-700/50 hover:bg-slate-700/70',
                },
                effects: {
                    glow: 'shadow-cyan-500/10',
                    blob1: 'bg-cyan-500/10',
                    blob2: 'bg-blue-600/10',
                }
            };
        }

        // Default: Lili Theme (Purple / Gold / Magical)
        return {
            background: 'bg-[#1E1E2E]',
            backgroundGradient: 'bg-[#1E1E2E]', // Or gradient if desired
            border: 'border-white/5',
            text: {
                primary: 'text-white',
                secondary: 'text-gray-400',
                accent: 'text-purple-400',
                highlight: 'text-amber-400',
            },
            button: {
                primary: 'bg-purple-600 hover:bg-purple-500 shadow-purple-900/20',
                secondary: 'bg-white/5 hover:bg-white/10',
            },
            effects: {
                glow: 'shadow-purple-500/20',
                blob1: 'bg-purple-500/20',
                blob2: 'bg-blue-500/10',
            }
        };
    }, [propertyId]);

    return theme;
};
