import { describe, it, expect } from 'vitest';
import { getIcon, getIconName, iconMap } from './iconMap';
import { Wifi, Sparkles } from 'lucide-react';

describe('iconMap Utility', () => {
    it('should return the correct icon component for a valid name', () => {
        const icon = getIcon('Wifi');
        expect(icon).toBe(Wifi);
    });

    it('should return the fallback icon (Sparkles) for an invalid name', () => {
        const icon = getIcon('InvalidIconName');
        expect(icon).toBe(Sparkles);
    });

    it('should return the correct name for a given icon component', () => {
        const name = getIconName(Wifi);
        expect(name).toBe('Wifi');
    });

    it('should return "Sparkles" for an unknown icon component', () => {
        // Mocking a component that isn't in the map
        const UnknownIcon = () => null;
        const name = getIconName(UnknownIcon as any);
        expect(name).toBe('Sparkles');
    });

    it('should contain expected icons in the map', () => {
        expect(iconMap).toHaveProperty('Zap');
        expect(iconMap).toHaveProperty('Tv');
        expect(iconMap).toHaveProperty('Wifi');
    });
});
