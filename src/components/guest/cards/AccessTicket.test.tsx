// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { useGuestTheme } from '../../../hooks/useGuestTheme';
import { PROPERTIES } from '../../../config/properties';
import AccessTicket from './AccessTicket';
import QuickAccessUtilities from './QuickAccessUtilities';

const writeText = vi.fn();
function Ticket({
    code = '01234567',
    propertyId = 'lili' as 'lili' | 'integracao',
    safeCode = '1234',
    alwaysVisible = false,
}) {
    const theme = useGuestTheme(propertyId);
    return (
        <LanguageProvider>
            <AccessTicket
                propertyId={propertyId}
                code={code}
                safeCode={safeCode}
                label="Senha de acesso"
                theme={theme}
                alwaysVisible={alwaysVisible}
            />
        </LanguageProvider>
    );
}
beforeEach(() => {
    localStorage.clear();
    writeText.mockReset().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
});
afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('Quick access credentials', () => {
    it('reveals two ordered steps and copies all eight digits including the leading zero', async () => {
        render(<Ticket />);
        expect(screen.queryByText('01234567')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Mostrar senhas de acesso' }));
        expect(screen.getByTestId('door-access-code').textContent).toBe('01234567');
        const labels = Array.from(document.querySelectorAll('.qa-step-label')).map(
            (node) => node.textContent
        );
        expect(labels).toEqual(['1Cofre da entrada', '2Porta do flat']);
        expect(screen.getByText('Após digitar, toque no sino da fechadura.')).toBeTruthy();
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha da porta' }))
        );
        expect(writeText).toHaveBeenCalledWith('01234567');
        expect(screen.getByRole('status').textContent).toBe('Código copiado.');
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha do cofre' }))
        );
        expect(writeText).toHaveBeenLastCalledWith('1234');
    });
    it('confirms copying only after clipboard success and recovers from denial', async () => {
        let finish!: () => void;
        writeText.mockReturnValueOnce(
            new Promise<void>((resolve) => {
                finish = resolve;
            })
        );
        render(<Ticket alwaysVisible />);
        fireEvent.click(screen.getByRole('button', { name: 'Copiar senha da porta' }));
        expect(screen.getByRole('status').textContent).toBe('');
        expect(
            screen.getByRole('button', { name: 'Copiar senha da porta' }).hasAttribute('disabled')
        ).toBe(true);
        await act(async () => finish());
        writeText.mockRejectedValueOnce(new Error('Permission denied'));
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha do cofre' }))
        );
        expect(screen.getByRole('status').textContent).toContain('Não foi possível copiar');
        expect(screen.getByRole('status').textContent).not.toContain('Código copiado.');
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha do cofre' }))
        );
        expect(screen.getByRole('status').textContent).toBe('Código copiado.');
    });
    it('can hide again, resets revelation for changed credentials and never stores codes', () => {
        const persist = vi.spyOn(Storage.prototype, 'setItem');
        const view = render(<Ticket />);
        fireEvent.click(screen.getByRole('button', { name: 'Mostrar senhas de acesso' }));
        fireEvent.click(screen.getByRole('button', { name: 'Ocultar' }));
        expect(screen.queryByText('01234567')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Mostrar senhas de acesso' }));
        view.rerender(<Ticket code="76543210" />);
        expect(screen.queryByText('01234567')).toBeNull();
        expect(screen.queryByText('76543210')).toBeNull();
        expect(persist).not.toHaveBeenCalled();
    });
    it('keeps unit identity separate from key-safe credentials for Integração', async () => {
        render(<Ticket propertyId="integracao" code="302" alwaysVisible />);
        expect(screen.getByText('302')).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Copiar senha da porta' })).toBeNull();
        expect(screen.queryByTestId('door-access-code')).toBeNull();
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha do cofre' }))
        );
        expect(writeText).toHaveBeenCalledWith('1234');
    });
    it('ignores a late copy response from credentials that have been replaced', async () => {
        let finishOldCopy!: () => void;
        writeText.mockReturnValueOnce(
            new Promise<void>((resolve) => {
                finishOldCopy = resolve;
            })
        );
        const view = render(<Ticket alwaysVisible />);
        fireEvent.click(screen.getByRole('button', { name: 'Copiar senha da porta' }));
        view.rerender(<Ticket code="76543210" alwaysVisible />);
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha da porta' }))
        );
        expect(screen.getByRole('status').textContent).toBe('Código copiado.');
        await act(async () => finishOldCopy());
        expect(screen.getByRole('status').textContent).toBe('Código copiado.');
        expect(screen.getByTestId('door-access-code').textContent).toBe('76543210');
    });
    it('does not offer copying an empty code and supports the door-only stay state', async () => {
        const view = render(<Ticket code="" safeCode="" alwaysVisible />);
        expect(
            screen.getByRole('button', { name: 'Copiar senha da porta' }).hasAttribute('disabled')
        ).toBe(true);
        expect(screen.getByText('A confirmar')).toBeTruthy();
        view.rerender(<Ticket safeCode="" alwaysVisible />);
        expect(screen.queryByText('Cofre da entrada')).toBeNull();
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha da porta' }))
        );
        expect(writeText).toHaveBeenCalledWith('01234567');
    });
});

describe('Quick access utilities', () => {
    it('copies the configured property address and Wi-Fi without exposing passwords in tooltips', async () => {
        const driver = vi.fn();
        render(
            <LanguageProvider>
                <QuickAccessUtilities
                    propertyId="lili"
                    wifiSSID="Rede da Lili"
                    wifiPass="private-wifi"
                    onOpenDriverMode={driver}
                />
            </LanguageProvider>
        );
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar endereço' }))
        );
        expect(writeText).toHaveBeenLastCalledWith(PROPERTIES.lili.address);
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha' }))
        );
        expect(writeText).toHaveBeenLastCalledWith('private-wifi');
        expect(document.querySelector('[title*="private-wifi"]')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Motorista' }));
        expect(driver).toHaveBeenCalledOnce();
    });
    it('disables Wi-Fi while loading and reports clipboard failure without false success', async () => {
        const props = {
            propertyId: 'lili' as const,
            wifiSSID: 'Rede',
            wifiPass: 'secret',
            onOpenDriverMode: vi.fn(),
        };
        const view = render(
            <LanguageProvider>
                <QuickAccessUtilities {...props} isLoadingWifi />
            </LanguageProvider>
        );
        expect(screen.getByRole('button', { name: 'Copiar senha' }).hasAttribute('disabled')).toBe(
            true
        );
        view.rerender(
            <LanguageProvider>
                <QuickAccessUtilities {...props} />
            </LanguageProvider>
        );
        writeText.mockRejectedValueOnce(new Error('Clipboard unavailable'));
        await act(async () =>
            fireEvent.click(screen.getByRole('button', { name: 'Copiar senha' }))
        );
        expect(screen.getByRole('alert').textContent).toContain('Não foi possível copiar');
        expect(screen.queryByText('Senha copiada')).toBeNull();
    });
});
