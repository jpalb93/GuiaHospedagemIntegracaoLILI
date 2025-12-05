import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Testes para lógica de pontuação do SmartSuggestion
 * Essa lógica determina qual lugar sugerir com base em vários fatores
 */

interface Place {
    id: string;
    name: string;
    category: string;
    phoneNumber?: string;
    whatsapp?: string;
    tags?: string[];
}

// Recria lógica de pontuação simplificada do SmartSuggestion
const scorePlace = (
    place: Place,
    timeOfDay: 'morning' | 'lunch' | 'sunset' | 'night',
    isWeekend: boolean
): number => {
    let score = 100; // Base score

    // Fim de semana bonus (bars/events)
    if (isWeekend && ['bars', 'events'].includes(place.category)) {
        score += 50;
    }

    // Tem contato disponível
    if (place.phoneNumber || place.whatsapp) {
        score += 30;
    }

    // Tags especiais
    if (place.tags?.includes('destaque')) {
        score += 20;
    }

    // Horário do dia adequado
    const timeCategories: Record<string, string[]> = {
        morning: ['cafes', 'essentials'],
        lunch: ['selfservice', 'alacarte', 'burgers'],
        sunset: ['bars', 'attractions'],
        night: ['bars', 'pasta', 'oriental', 'events']
    };

    if (timeCategories[timeOfDay]?.includes(place.category)) {
        score += 40;
    }

    return score;
};

// Função para ordenar lugares por score
const rankPlaces = (
    places: Place[],
    timeOfDay: 'morning' | 'lunch' | 'sunset' | 'night',
    isWeekend: boolean
): Place[] => {
    return [...places].sort((a, b) => {
        const scoreA = scorePlace(a, timeOfDay, isWeekend);
        const scoreB = scorePlace(b, timeOfDay, isWeekend);
        return scoreB - scoreA;
    });
};

describe('SmartSuggestion Scoring Logic', () => {
    const mockPlaces: Place[] = [
        { id: '1', name: 'Café da Manhã', category: 'cafes', phoneNumber: '87999999999' },
        { id: '2', name: 'Bar do Zé', category: 'bars', whatsapp: '87988888888' },
        { id: '3', name: 'Pizzaria Nápoles', category: 'pasta' },
        { id: '4', name: 'Show Especial', category: 'events', tags: ['destaque'] },
        { id: '5', name: 'Self-Service Central', category: 'selfservice', phoneNumber: '87977777777' }
    ];

    describe('scorePlace', () => {
        it('should give base score to all places', () => {
            const place: Place = { id: '1', name: 'Test', category: 'other' };
            expect(scorePlace(place, 'morning', false)).toBeGreaterThanOrEqual(100);
        });

        it('should add 50 points to bars on weekends', () => {
            const bar: Place = { id: '1', name: 'Bar', category: 'bars' };
            const weekendScore = scorePlace(bar, 'night', true);
            const weekdayScore = scorePlace(bar, 'night', false);
            expect(weekendScore - weekdayScore).toBe(50);
        });

        it('should add 30 points for places with phone contact', () => {
            const withPhone: Place = { id: '1', name: 'Test', category: 'other', phoneNumber: '123' };
            const withoutPhone: Place = { id: '2', name: 'Test', category: 'other' };
            expect(scorePlace(withPhone, 'morning', false) - scorePlace(withoutPhone, 'morning', false)).toBe(30);
        });

        it('should add 20 points for "destaque" tag', () => {
            const featured: Place = { id: '1', name: 'Test', category: 'other', tags: ['destaque'] };
            const normal: Place = { id: '2', name: 'Test', category: 'other' };
            expect(scorePlace(featured, 'morning', false) - scorePlace(normal, 'morning', false)).toBe(20);
        });

        it('should add 40 points for time-appropriate categories', () => {
            const cafe: Place = { id: '1', name: 'Café', category: 'cafes' };
            const morningScore = scorePlace(cafe, 'morning', false);
            const nightScore = scorePlace(cafe, 'night', false);
            expect(morningScore - nightScore).toBe(40);
        });
    });

    describe('rankPlaces', () => {
        it('should rank cafes higher in the morning', () => {
            const ranked = rankPlaces(mockPlaces, 'morning', false);
            expect(ranked[0].category).toBe('cafes');
        });

        it('should rank self-service higher at lunch', () => {
            const ranked = rankPlaces(mockPlaces, 'lunch', false);
            expect(ranked[0].category).toBe('selfservice');
        });

        it('should rank bars highest on weekend nights', () => {
            const ranked = rankPlaces(mockPlaces, 'night', true);
            // Bar should be first (high score from weekend + night + contact)
            expect(ranked[0].category).toBe('bars');
        });

        it('should give priority to featured events', () => {
            const ranked = rankPlaces(mockPlaces, 'night', true);
            // Evento com "destaque" deve estar no top
            const eventRank = ranked.findIndex(p => p.id === '4');
            expect(eventRank).toBeLessThanOrEqual(2);
        });
    });
});

describe('Time of Day Detection', () => {
    const getTimeOfDay = (hour: number): 'morning' | 'lunch' | 'sunset' | 'night' => {
        if (hour >= 6 && hour < 11) return 'morning';
        if (hour >= 11 && hour < 15) return 'lunch';
        if (hour >= 15 && hour < 18) return 'sunset';
        return 'night';
    };

    it('should identify morning correctly', () => {
        expect(getTimeOfDay(6)).toBe('morning');
        expect(getTimeOfDay(9)).toBe('morning');
        expect(getTimeOfDay(10)).toBe('morning');
    });

    it('should identify lunch correctly', () => {
        expect(getTimeOfDay(11)).toBe('lunch');
        expect(getTimeOfDay(12)).toBe('lunch');
        expect(getTimeOfDay(14)).toBe('lunch');
    });

    it('should identify sunset correctly', () => {
        expect(getTimeOfDay(15)).toBe('sunset');
        expect(getTimeOfDay(17)).toBe('sunset');
    });

    it('should identify night correctly', () => {
        expect(getTimeOfDay(18)).toBe('night');
        expect(getTimeOfDay(21)).toBe('night');
        expect(getTimeOfDay(0)).toBe('night');
        expect(getTimeOfDay(5)).toBe('night');
    });
});
