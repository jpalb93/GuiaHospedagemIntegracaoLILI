// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import DesktopQrCard from './DesktopQrCard';

const { toDataURL, confetti } = vi.hoisted(() => ({
    toDataURL: vi.fn(),
    confetti: vi.fn(),
}));

vi.mock('qrcode', () => ({ toDataURL }));
vi.mock('../../../utils/confetti', () => ({ triggerConfetti: confetti }));

const generatedImage = 'data:image/png;base64,cXItZGVtbw==';
const renderCard = () =>
    render(
        <LanguageProvider>
            <DesktopQrCard />
        </LanguageProvider>
    );

beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/guia/reserva?token=privado');
    toDataURL.mockReset().mockResolvedValue(generatedImage);
    confetti.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
});

afterEach(() => cleanup());

describe('Desktop QR card', () => {
    it('generates the private guide QR locally and renders only a data URI', async () => {
        renderCard();
        expect(screen.getByRole('status').textContent).toContain('Gerando QR Code');
        const image = await screen.findByRole('img', { name: 'QR Code do guia do hóspede' });
        expect(image.getAttribute('src')).toBe(generatedImage);
        expect(toDataURL).toHaveBeenCalledWith(window.location.href, {
            width: 180,
            margin: 2,
            color: { dark: '#120F0D', light: '#ffffff' },
        });
        expect(document.querySelector('img[src^="http"]')).toBeNull();
        expect(document.querySelector('[src*="qrserver"]')).toBeNull();
    });

    it('recovers from QR generation failure without a remote fallback', async () => {
        toDataURL.mockRejectedValueOnce(new Error('Canvas unavailable'));
        renderCard();
        await screen.findByText('Não foi possível gerar o QR Code.');
        expect(screen.queryByRole('img')).toBeNull();
        fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
        const image = await screen.findByRole('img', { name: 'QR Code do guia do hóspede' });
        expect(image.getAttribute('src')).toBe(generatedImage);
        expect(toDataURL).toHaveBeenCalledTimes(2);
    });

    it('shows copy success only after the clipboard operation resolves', async () => {
        let completeCopy: () => void = () => undefined;
        const writeText = vi.fn(
            () =>
                new Promise<void>((resolve) => {
                    completeCopy = resolve;
                })
        );
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
        renderCard();
        await screen.findByRole('img');
        const button = screen.getByRole('button', { name: 'Copiar link do guia' });
        fireEvent.click(button);
        expect(writeText).toHaveBeenCalledWith(window.location.href);
        expect(screen.queryByText('Link Copiado!')).toBeNull();
        expect(button.hasAttribute('disabled')).toBe(true);
        await act(async () => completeCopy());
        expect(screen.getByText('Link Copiado!')).toBeTruthy();
        expect(confetti).toHaveBeenCalledTimes(1);
    });

    it('offers retry and manual selection when clipboard permission fails', async () => {
        const writeText = vi
            .fn()
            .mockRejectedValueOnce(new Error('Permission denied'))
            .mockResolvedValue(undefined);
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
        renderCard();
        await screen.findByRole('img');
        fireEvent.click(screen.getByRole('button', { name: 'Copiar link do guia' }));
        const fallback = await screen.findByRole('textbox', { name: 'Link do guia para copiar' });
        expect((fallback as HTMLInputElement).value).toBe(window.location.href);
        expect(screen.queryByText('Link Copiado!')).toBeNull();
        expect(confetti).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole('button', { name: 'Copiar link do guia' }));
        await waitFor(() => expect(screen.getByText('Link Copiado!')).toBeTruthy());
        expect(screen.queryByRole('textbox')).toBeNull();
    });
});
