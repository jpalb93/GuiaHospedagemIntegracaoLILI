// @vitest-environment jsdom
import type { ComponentProps } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { FavoritesProvider } from '../../../contexts/FavoritesContext';
import type SmartSuggestion from '../../SmartSuggestion';
import DesktopGuestGuide from './DesktopGuestGuide';

const { smartSuggestionRender } = vi.hoisted(() => ({ smartSuggestionRender: vi.fn() }));
vi.mock('../../SmartSuggestion', () => ({
    default: (props: ComponentProps<typeof SmartSuggestion>) => {
        smartSuggestionRender(props);
        return (
            <div aria-label="Sugestão contextual de teste">
                <button type="button" onClick={props.onCheckinClick}>
                    Sugestão: entrada
                </button>
                <button type="button" onClick={props.onCheckoutClick}>
                    Sugestão: saída
                </button>
                <button
                    type="button"
                    onClick={() => props.onOpenCategorySheet?.('Cafés e Padarias')}
                >
                    Sugestão: cafés
                </button>
                <button type="button" onClick={props.onEmergency}>
                    Sugestão: emergência
                </button>
            </div>
        );
    },
}));

type Props = ComponentProps<typeof DesktopGuestGuide>;
const secretDoor = 'PRIVATE-DOOR-123';
const secretSafe = 'PRIVATE-SAFE-456';
const secretWifi = 'PRIVATE-WIFI-789';

function renderGuide(overrides: Partial<Props> = {}) {
    const onSupport = vi.fn();
    const props: Props = {
        config: {
            guestName: 'Hóspede de demonstração',
            propertyId: 'lili',
            flatNumber: '302',
            checkInDate: '2026-11-03',
            checkoutDate: '2026-11-08',
            lockCode: secretDoor,
            isReleased: true,
        },
        stayStage: 'middle',
        isPasswordReleased: true,
        wifiSSID: 'Rede teste',
        wifiPass: secretWifi,
        safeCode: secretSafe,
        loadingWifi: false,
        places: [],
        activeEvents: [],
        hasTips: false,
        hostPhone: '5500000000000',
        onCheckin: vi.fn(),
        onCheckout: vi.fn(),
        onSupport,
        onDriver: vi.fn(),
        onSaveAccess: vi.fn(),
        onKeyDetails: vi.fn(),
        onStories: vi.fn(),
        ...overrides,
    };
    render(
        <LanguageProvider>
            <FavoritesProvider>
                <DesktopGuestGuide {...props} />
            </FavoritesProvider>
        </LanguageProvider>
    );
    return props;
}

beforeEach(() => {
    localStorage.clear();
    smartSuggestionRender.mockClear();
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
        callback(0);
        return 1;
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
});
afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('Desktop guide privacy and navigation', () => {
    it.each([
        ['credentials not released by time', { isPasswordReleased: false }],
        [
            'server access revoked',
            {
                config: {
                    guestName: 'Teste',
                    propertyId: 'lili',
                    lockCode: secretDoor,
                    isReleased: false,
                },
            },
        ],
        [
            'manual deactivation',
            {
                config: {
                    guestName: 'Teste',
                    propertyId: 'lili',
                    lockCode: secretDoor,
                    isReleased: true,
                    manualDeactivation: true,
                },
            },
        ],
        ['stay finished', { stayStage: 'post_checkout' }],
    ] as [string, Partial<Props>][])(
        'does not render private credentials when %s',
        (_label, props) => {
            renderGuide(props);
            expect(screen.queryByText(secretDoor)).toBeNull();
            expect(screen.queryByText(secretSafe)).toBeNull();
            expect(screen.queryByText(secretWifi)).toBeNull();
            expect(screen.queryByRole('button', { name: 'Copiar senha' })).toBeNull();
        }
    );

    it('shows the authorized unit credentials during the active stay', () => {
        renderGuide();
        expect(screen.getByText(secretDoor)).toBeTruthy();
        expect(screen.getByText(secretSafe)).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Copiar senha' })).toBeTruthy();
    });

    it('keeps other property recommendations and hidden places out of the desktop catalog', () => {
        const makePlace = (
            id: string,
            propertyId?: 'lili' | 'integracao' | 'all',
            visible = true
        ) => ({
            id,
            name: id,
            category: 'cafes' as const,
            description: 'Demonstração',
            imageUrl: '',
            tags: [],
            propertyId,
            visible,
        });
        renderGuide({
            places: [
                makePlace('Lugar Lili', 'lili'),
                makePlace('Lugar Integração', 'integracao'),
                makePlace('Lugar compartilhado', 'all'),
                makePlace('Lugar legado'),
                makePlace('Lugar oculto', 'lili', false),
            ],
        });
        const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
        fireEvent.click(within(nav).getByRole('button', { name: 'Explorar a região' }));
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        expect(within(list).getByText('Lugar Lili')).toBeTruthy();
        expect(within(list).getByText('Lugar compartilhado')).toBeTruthy();
        expect(within(list).getByText('Lugar legado')).toBeTruthy();
        expect(screen.queryByText('Lugar Integração')).toBeNull();
        expect(screen.queryByText('Lugar oculto')).toBeNull();
        expect(
            within(nav)
                .getByRole('button', { name: 'Explorar a região' })
                .getAttribute('aria-current')
        ).toBe('page');
        expect(
            within(nav).getByRole('button', { name: 'Minha estadia' }).getAttribute('aria-current')
        ).toBeNull();
    });

    it('preserves the existing support action from the desktop help section', () => {
        const props = renderGuide();
        const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
        fireEvent.click(within(nav).getByRole('button', { name: 'Ajuda' }));
        fireEvent.click(screen.getByRole('button', { name: 'Abrir opções de contato' }));
        expect(props.onSupport).toHaveBeenCalledOnce();
    });

    it('preserves entry, saved access and driver actions in the stay context', () => {
        const props = renderGuide({ stayStage: 'checkin' });
        fireEvent.click(screen.getByRole('button', { name: 'Ver como entrar' }));
        fireEvent.click(screen.getByRole('button', { name: 'Ver instruções de entrada' }));
        expect(props.onCheckin).toHaveBeenCalledTimes(2);
        fireEvent.click(screen.getByRole('button', { name: 'Salvar acesso' }));
        expect(props.onSaveAccess).toHaveBeenCalledOnce();
        fireEvent.click(screen.getByRole('button', { name: 'Mostrar ao motorista' }));
        expect(props.onDriver).toHaveBeenCalledOnce();
    });

    it('opens the existing checkout flow from the departure stage', () => {
        const props = renderGuide({ stayStage: 'checkout' });
        fireEvent.click(screen.getByRole('button', { name: 'Ver orientações de saída' }));
        expect(props.onCheckout).toHaveBeenCalledOnce();
    });

    it.each([false, true])(
        'counts a saved active event once in navigation (also in places: %s)',
        (alsoInPlaces) => {
            const savedEvent = {
                id: 'saved-event',
                name: 'Evento favorito',
                category: 'events' as const,
                propertyId: 'lili' as const,
                description: 'Evento de demonstração.',
                imageUrl: '',
                tags: [],
                eventDate: '2099-11-07',
            };
            localStorage.setItem('lili_db_favorites', JSON.stringify([savedEvent.id]));
            renderGuide({
                places: alsoInPlaces ? [savedEvent] : [],
                activeEvents: [savedEvent],
            });
            const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
            const favorites = within(nav).getByRole('button', {
                name: /^Meus favoritos\s*1$/,
            });
            fireEvent.click(favorites);
            const list = screen.getByRole('list', { name: 'Lugares encontrados' });
            expect(within(list).getAllByText(savedEvent.name)).toHaveLength(1);
        }
    );

    it('offers checkout instructions while a day-use stay is still active', () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-11-05T10:00:00-03:00'));
        const props = renderGuide({
            stayStage: 'checkin',
            config: {
                guestName: 'Day use de demonstração',
                propertyId: 'integracao',
                stayType: 'day_use',
                checkInDate: '2026-11-05',
                checkoutDate: '2026-11-05',
                checkInTime: '08:00',
                checkOutTime: '12:00',
                guestCount: 1,
                isReleased: true,
            },
        });
        fireEvent.click(screen.getByRole('button', { name: 'Ver orientações de saída' }));
        expect(props.onCheckout).toHaveBeenCalledOnce();
    });

    it('keeps the current suggestion on My stay with the reservation data and action callbacks', () => {
        const smartSuggestions = { morning: [], lunch: [], sunset: [], night: [] };
        const props = renderGuide({ isTimeVerified: true, smartSuggestions });
        expect(smartSuggestionRender).toHaveBeenLastCalledWith(
            expect.objectContaining({
                stayStage: props.stayStage,
                config: props.config,
                hostPhone: props.hostPhone,
                isTimeVerified: true,
                customSuggestions: smartSuggestions,
            })
        );
        fireEvent.click(screen.getByRole('button', { name: 'Sugestão: entrada' }));
        fireEvent.click(screen.getByRole('button', { name: 'Sugestão: saída' }));
        expect(props.onCheckin).toHaveBeenCalledOnce();
        expect(props.onCheckout).toHaveBeenCalledOnce();
        const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
        fireEvent.click(within(nav).getByRole('button', { name: 'O flat' }));
        expect(screen.queryByRole('button', { name: 'Sugestão: entrada' })).toBeNull();
    });

    it('opens the matching Explore category from a contextual suggestion', () => {
        renderGuide({
            places: [
                {
                    id: 'cafe',
                    name: 'Café de demonstração',
                    category: 'cafes',
                    description: 'Café fictício.',
                    imageUrl: '',
                    tags: [],
                },
                {
                    id: 'food',
                    name: 'Restaurante de demonstração',
                    category: 'alacarte',
                    description: 'Mesa fictícia.',
                    imageUrl: '',
                    tags: [],
                },
            ],
        });
        fireEvent.click(screen.getByRole('button', { name: 'Sugestão: cafés' }));
        const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
        expect(
            within(nav)
                .getByRole('button', { name: 'Explorar a região' })
                .getAttribute('aria-current')
        ).toBe('page');
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        expect(within(list).getByText('Café de demonstração')).toBeTruthy();
        expect(within(list).queryByText('Restaurante de demonstração')).toBeNull();
        expect(
            screen
                .getByRole('button', { name: /^Cafés e padarias\s*1$/ })
                .getAttribute('aria-pressed')
        ).toBe('true');
    });

    it('opens the help section with emergency contacts expanded from a contextual suggestion', () => {
        renderGuide();
        fireEvent.click(screen.getByRole('button', { name: 'Sugestão: emergência' }));
        const nav = screen.getByRole('navigation', { name: 'Navegação do guia' });
        expect(
            within(nav).getByRole('button', { name: 'Ajuda' }).getAttribute('aria-current')
        ).toBe('page');
        expect(screen.getByRole('heading', { name: 'Conte com a gente' })).toBeTruthy();
        expect(screen.getByRole('link', { name: /SAMU/ })).toBeTruthy();
        expect(
            screen
                .getAllByRole('button', { name: 'SOS e emergência' })
                .some((button) => button.getAttribute('aria-expanded') === 'true')
        ).toBe(true);
    });
});
