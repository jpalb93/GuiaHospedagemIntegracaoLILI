import { describe, it, expect } from 'vitest';
import { filterPlacesByProperty } from './places';
import { filterTipsByProperty } from './content';
import { PlaceRecommendation, Tip } from '../../types';

describe('Multi-Tenant Content Filtering Utilities', () => {
    describe('filterPlacesByProperty', () => {
        const places: PlaceRecommendation[] = [
            { id: '1', name: 'Restaurante Genérico (Legado)', description: '', tags: [], imageUrl: '' },
            { id: '2', name: 'Local Global', propertyId: 'all', description: '', tags: [], imageUrl: '' },
            { id: '3', name: 'Dica da Lili', propertyId: 'lili', description: '', tags: [], imageUrl: '' },
            { id: '4', name: 'Dica do Integração', propertyId: 'integracao', description: '', tags: [], imageUrl: '' },
        ];

        it('should return all places when propertyId is undefined', () => {
            const result = filterPlacesByProperty(places);
            expect(result).toHaveLength(4);
        });

        it('should return legacy (no propertyId), "all", and "lili" places for propertyId "lili"', () => {
            const result = filterPlacesByProperty(places, 'lili');
            expect(result.map((p) => p.id)).toEqual(['1', '2', '3']);
        });

        it('should return legacy (no propertyId), "all", and "integracao" places for propertyId "integracao"', () => {
            const result = filterPlacesByProperty(places, 'integracao');
            expect(result.map((p) => p.id)).toEqual(['1', '2', '4']);
        });
    });

    describe('filterTipsByProperty', () => {
        const tips: Tip[] = [
            { id: 't1', type: 'curiosity', title: 'Tip Legado', subtitle: '', content: '', iconName: 'Wifi' },
            { id: 't2', type: 'curiosity', title: 'Tip All', propertyId: 'all', subtitle: '', content: '', iconName: 'Wifi' },
            { id: 't3', type: 'curiosity', title: 'Tip Lili', propertyId: 'lili', subtitle: '', content: '', iconName: 'Wifi' },
            { id: 't4', type: 'curiosity', title: 'Tip Integração', propertyId: 'integracao', subtitle: '', content: '', iconName: 'Wifi' },
        ];

        it('should return all tips when propertyId is undefined', () => {
            const result = filterTipsByProperty(tips);
            expect(result).toHaveLength(4);
        });

        it('should filter tips correctly for Lili without dropping legacy tips', () => {
            const result = filterTipsByProperty(tips, 'lili');
            expect(result.map((t) => t.id)).toEqual(['t1', 't2', 't3']);
        });

        it('should filter tips correctly for Integração without dropping legacy tips', () => {
            const result = filterTipsByProperty(tips, 'integracao');
            expect(result.map((t) => t.id)).toEqual(['t1', 't2', 't4']);
        });
    });
});
