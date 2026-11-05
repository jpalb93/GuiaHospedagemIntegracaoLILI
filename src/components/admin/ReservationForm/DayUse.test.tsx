// @vitest-environment jsdom
import { useEffect } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ReservationForm from './index';
import { useReservationForm } from '../../../hooks/useReservationForm';
import type { PropertyId } from '../../../types';

vi.mock('./CorporateLinkSection', () => ({ default: () => null }));

function FormHarness({
    propertyId = 'integracao',
    onSave = vi.fn(),
}: {
    propertyId?: PropertyId;
    onSave?: (value: unknown) => void;
}) {
    const form = useReservationForm();
    useEffect(() => {
        form.setPropertyId(propertyId);
        form.setCheckInDate('2026-10-28');
        form.setCheckoutDate('2026-10-29');
        // Initial fixture only: no backend is used by this component test.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propertyId]);
    return (
        <ReservationForm
            form={{ ...form, handleSaveReservation: () => onSave(form.getFormValues()) }}
            ui={{ generatedLink: '', apiKeyStatus: 'ok', showToast: vi.fn() }}
        />
    );
}

afterEach(cleanup);

describe('Day use admin form', () => {
    it('wires modality, same-day date, editable hours and individual capacity to the saved payload', () => {
        const onSave = vi.fn();
        render(<FormHarness onSave={onSave} />);
        fireEvent.change(screen.getByLabelText('Modalidade da reserva'), {
            target: { value: 'day_use' },
        });
        expect((screen.getByLabelText('Data de saída') as HTMLInputElement).disabled).toBe(true);
        expect(
            (screen.getByLabelText('Quantidade de hóspedes') as HTMLSelectElement).disabled
        ).toBe(true);
        expect((screen.getByLabelText('Horário de entrada') as HTMLInputElement).value).toBe(
            '08:00'
        );
        fireEvent.change(screen.getByLabelText('Data do day use'), {
            target: { value: '2026-11-01' },
        });
        fireEvent.change(screen.getByLabelText('Horário de entrada'), {
            target: { value: '13:00' },
        });
        expect((screen.getByLabelText('Horário de saída') as HTMLInputElement).value).toBe('17:00');
        fireEvent.click(screen.getByRole('button', { name: /Salvar Reserva/ }));
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({
                stayType: 'day_use',
                checkInDate: '2026-11-01',
                checkoutDate: '2026-11-01',
                checkInTime: '13:00',
                checkOutTime: '17:00',
                guestCount: 1,
            })
        );
    });

    it('does not offer day use for Flat da Lili', () => {
        render(<FormHarness propertyId="lili" />);
        expect(screen.queryByLabelText('Modalidade da reserva')).toBeNull();
    });
});
