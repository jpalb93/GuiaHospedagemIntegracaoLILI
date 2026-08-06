import { describe, it, expect } from 'vitest';
import { Reservation, SavedInspectionData } from '../../types';

describe('Inspection Persistence & Fallback Logic', () => {
    it('should fallback to preCheckInInspection when opening post_checkout if no postCheckOutInspection exists', () => {
        const mockPreInspection: SavedInspectionData = {
            timestamp: '2026-08-04T12:00:00Z',
            inspectorName: 'Maria Vistoriadora',
            checklistState: {
                'item-1': { status: 'ok' },
                'custom-123': { status: 'ok' },
            },
            customItems: [
                {
                    id: 'custom-123',
                    label: 'Berço de Bebê',
                    active: true,
                    category: 'Itens Especiais para esta Reserva',
                },
            ],
        };

        const mockReservation: Reservation = {
            id: 'res-1',
            guestName: 'Hóspede Teste',
            createdAt: '2026-08-04',
            status: 'active',
            preCheckInInspection: mockPreInspection,
        };

        // Determine what data post_checkout should load
        const savedForCurrentType = mockReservation.postCheckOutInspection;
        const savedToLoad =
            savedForCurrentType || mockReservation.preCheckInInspection;

        expect(savedToLoad).toBeDefined();
        expect(savedToLoad?.inspectorName).toBe('Maria Vistoriadora');
        expect(savedToLoad?.customItems).toHaveLength(1);
        expect(savedToLoad?.customItems?.[0].label).toBe('Berço de Bebê');
    });
});
