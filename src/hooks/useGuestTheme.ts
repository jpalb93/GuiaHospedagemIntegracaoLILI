import { useMemo } from 'react';
import { PropertyId } from '../types';

// Exported for reuse in components like AccessTicket
export interface ThemeColors {
    background: string;
    backgroundGradient: string;
    surface?: string;
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
            // Rio São Francisco & Pedra Executiva (Deep River Slate / Sky / Warm Amber)
            return {
                background: 'bg-[#111922]',
                backgroundGradient: 'bg-gradient-to-br from-[#16222F] via-[#111922] to-[#0D141C]',
                surface: 'bg-[#1A2634]',
                border: 'border-sky-500/20',
                text: {
                    primary: 'text-stone-50',
                    secondary: 'text-slate-300',
                    accent: 'text-sky-400',
                    highlight: 'text-amber-300',
                },
                button: {
                    primary:
                        'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 shadow-sky-950/30',
                    secondary: 'bg-slate-800/70 hover:bg-slate-700/70',
                },
                effects: {
                    glow: 'shadow-sky-500/15',
                    blob1: 'bg-sky-500/15',
                    blob2: 'bg-amber-500/10',
                },
            };
        }

        // Default: Flat da Lili — Sol do São Francisco & Terracota (Warm Espresso Stone / Terracotta / Golden Amber)
        return {
            background: 'bg-[#1C1614]',
            backgroundGradient: 'bg-gradient-to-br from-[#241C19] via-[#1C1614] to-[#15110F]',
            surface: 'bg-[#28201D]',
            border: 'border-amber-500/20',
            text: {
                primary: 'text-stone-50',
                secondary: 'text-stone-400',
                accent: 'text-amber-400',
                highlight: 'text-orange-400',
            },
            button: {
                primary:
                    'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-950/30',
                secondary: 'bg-white/5 hover:bg-white/10',
            },
            effects: {
                glow: 'shadow-amber-500/15',
                blob1: 'bg-amber-500/15',
                blob2: 'bg-orange-500/10',
            },
        };
    }, [propertyId]);

    return theme;
};
