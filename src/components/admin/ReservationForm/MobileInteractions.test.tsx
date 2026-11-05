// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import TemplateManager from './TemplateManager';
import PaymentSection from './PaymentSection';
import type { PaymentMethod, PaymentRecord, PaymentStatus } from '../../../types';

afterEach(cleanup);

describe('Reservation templates on touch and keyboard', () => {
    it('opens on click, applies the template and restores focus', () => {
        const onApply = vi.fn();
        render(
            <TemplateManager
                templates={[{ id: 'one', name: 'Modelo da empresa' }]}
                guestName="Ana"
                editingId={null}
                onApplyTemplate={onApply}
                onCreateTemplate={vi.fn()}
            />
        );
        const trigger = screen.getByRole('button', { name: 'Modelos' });
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        fireEvent.click(trigger);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        fireEvent.click(screen.getByRole('button', { name: 'Modelo da empresa' }));
        expect(onApply).toHaveBeenCalledWith({ id: 'one', name: 'Modelo da empresa' });
        expect(screen.queryByRole('region', { name: 'Modelos de reserva' })).toBeNull();
        expect(document.activeElement).toBe(trigger);
    });

    it('closes on Escape/outside pointer and keeps delete separate from apply', () => {
        const onDelete = vi.fn();
        const onApply = vi.fn();
        vi.spyOn(window, 'confirm').mockReturnValue(true);
        render(
            <TemplateManager
                templates={[{ id: 'one', name: 'Modelo' }]}
                guestName="Ana"
                editingId={null}
                onApplyTemplate={onApply}
                onCreateTemplate={vi.fn()}
                onDeleteTemplate={onDelete}
            />
        );
        const trigger = screen.getByRole('button', { name: 'Modelos' });
        fireEvent.click(trigger);
        fireEvent.keyDown(screen.getByRole('button', { name: 'Modelo' }), {
            key: 'Escape',
        });
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        fireEvent.click(trigger);
        fireEvent.click(screen.getByRole('button', { name: 'Excluir modelo Modelo' }));
        expect(onDelete).toHaveBeenCalledWith('one');
        expect(onApply).not.toHaveBeenCalled();
        fireEvent.pointerDown(document.body);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        vi.restoreAllMocks();
    });
});

function PaymentHarness() {
    const [status, setStatus] = useState<PaymentStatus>('pending');
    const [method, setMethod] = useState<PaymentMethod | ''>('');
    const [total, setTotal] = useState<number | ''>(200);
    const [deposit, setDeposit] = useState<number | ''>('');
    const [paidAt, setPaidAt] = useState('');
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    return (
        <>
            <PaymentSection
                paymentStatus={status}
                setPaymentStatus={setStatus}
                paymentMethod={method}
                setPaymentMethod={setMethod}
                totalAmount={total}
                setTotalAmount={setTotal}
                depositAmount={deposit}
                setDepositAmount={setDeposit}
                paidAt={paidAt}
                setPaidAt={setPaidAt}
                payments={payments}
                setPayments={setPayments}
            />
            <output data-testid="payment-state">
                {JSON.stringify({ status, total, deposit, payments, paidAt })}
            </output>
        </>
    );
}

describe('Accessible payment editor preserves finance behavior', () => {
    it('adds, edits and removes a payment with the new mobile layout', () => {
        render(<PaymentHarness />);
        expect(screen.getByLabelText(/Valor Total da Reserva/)).toBeTruthy();
        expect(screen.getByLabelText('Forma de Pagamento')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Adicionar' }));
        fireEvent.change(screen.getByLabelText('Data do lançamento'), {
            target: { value: '2026-10-29' },
        });
        fireEvent.change(screen.getByLabelText('Valor do lançamento (R$)'), {
            target: { value: '50' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Cartão' }));
        expect(screen.getByRole('button', { name: 'Cartão' }).getAttribute('aria-pressed')).toBe(
            'true'
        );
        fireEvent.click(screen.getByRole('button', { name: 'Adicionar ao extrato' }));
        let state = JSON.parse(screen.getByTestId('payment-state').textContent!);
        expect(state).toMatchObject({
            status: 'partial',
            deposit: 50,
            payments: [{ amount: 50, method: 'card', date: '2026-10-29' }],
        });
        fireEvent.click(screen.getByRole('button', { name: /Alterar data, tipo ou dados/ }));
        fireEvent.change(screen.getByLabelText('Valor do lançamento (R$)'), {
            target: { value: '200' },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));
        state = JSON.parse(screen.getByTestId('payment-state').textContent!);
        expect(state).toMatchObject({
            status: 'paid',
            total: 200,
            deposit: 200,
            payments: [{ amount: 200, method: 'card' }],
        });
        fireEvent.click(screen.getByRole('button', { name: 'Remover lançamento' }));
        state = JSON.parse(screen.getByTestId('payment-state').textContent!);
        expect(state).toMatchObject({ status: 'pending', deposit: '', payments: [] });
    });
});
