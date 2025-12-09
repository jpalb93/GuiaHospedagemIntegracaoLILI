import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BookingModal from '../../components/Booking/BookingModal';
import { saveReservation, updateReservation } from '../../services/firebase';

// Mock Firebase services
vi.mock('../../services/firebase', () => ({
    saveReservation: vi.fn(),
    updateReservation: vi.fn(),
}));

// Mock fetch
global.fetch = vi.fn();

describe('Reservation Integration Flow', () => {
    const mockOnClose = vi.fn();
    const startDate = new Date();
    const endDate = new Date(new Date().setDate(new Date().getDate() + 2)); // 2 days later

    beforeEach(() => {
        vi.clearAllMocks();
        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => ({
                qr_code: '00020126580014BR.GOV.BCB.PIX...',
                qr_code_base64: 'base64imagecontent',
            }),
        });
        (saveReservation as any).mockResolvedValue('reservation-123');
    });

    it('should fill form, create reservation, and show payment step', async () => {
        render(
            <BookingModal
                isOpen={true}
                onClose={mockOnClose}
                startDate={startDate}
                endDate={endDate}
                totalPrice={500}
            />
        );

        // 1. Check Header
        expect(screen.getByText('Confirmar Reserva')).toBeInTheDocument();

        // 2. Fill Form
        fireEvent.change(screen.getByPlaceholderText('João'), { target: { value: 'Carlos' } });
        fireEvent.change(screen.getByPlaceholderText('Silva'), { target: { value: 'Oliveira' } });
        fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '123.456.789-00' } });
        fireEvent.change(screen.getByPlaceholderText('joao@email.com'), { target: { value: 'carlos@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('(00) 00000-0000'), { target: { value: '(87) 99999-9999' } });

        // 3. Submit
        const submitBtn = screen.getByText('Gerar Pagamento PIX');
        fireEvent.click(submitBtn);

        // 4. Verify Firebase Call
        await waitFor(() => {
            expect(saveReservation).toHaveBeenCalled();
        });

        // 5. Verify Fetch Call (Payment API)
        expect(global.fetch).toHaveBeenCalledWith('/api/create-payment', expect.anything());

        // 6. Verify Step Change (Payment Screen)
        await waitFor(() => {
            expect(screen.getByText('Pagamento via PIX')).toBeInTheDocument();
            expect(screen.getByText('Reserva Pré-Confirmada!')).toBeInTheDocument();
        });
    });

    it('should handle payment confirmation', async () => {
        // Setup Step 2 manually or simulate flow
        // Simulating flow is better for integration

        render(
            <BookingModal
                isOpen={true}
                onClose={mockOnClose}
                startDate={startDate}
                endDate={endDate}
                totalPrice={500}
            />
        );

        // Fill & Submit
        fireEvent.change(screen.getByPlaceholderText('João'), { target: { value: 'Carlos' } });
        fireEvent.change(screen.getByPlaceholderText('Silva'), { target: { value: 'Oliveira' } });
        fireEvent.change(screen.getByPlaceholderText('000.000.000-00'), { target: { value: '123.456.789-00' } });
        fireEvent.change(screen.getByPlaceholderText('joao@email.com'), { target: { value: 'carlos@test.com' } });
        fireEvent.change(screen.getByPlaceholderText('(00) 00000-0000'), { target: { value: '(87) 99999-9999' } });

        fireEvent.click(screen.getByText('Gerar Pagamento PIX'));

        // Wait for Step 2
        await waitFor(() => expect(screen.getByText('Já realizei o pagamento')).toBeInTheDocument());

        // Click "Já realizei o pagamento"
        fireEvent.click(screen.getByText('Já realizei o pagamento'));

        // Verify Update Call
        expect(updateReservation).toHaveBeenCalledWith('reservation-123', { status: 'active' });

        // Verify Final Step
        await waitFor(() => {
            expect(screen.getByText('Reserva Confirmada!')).toBeInTheDocument();
        });
    });
});
