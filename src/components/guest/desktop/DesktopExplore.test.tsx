// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { LanguageProvider } from '../../../contexts/LanguageContext';
import { FavoritesProvider } from '../../../contexts/FavoritesContext';
import type { PlaceRecommendation } from '../../../types';
import DesktopExplore, { type DesktopExploreProps } from './DesktopExplore';

const cafe: PlaceRecommendation = {
    id: 'cafe',
    category: 'cafes',
    name: 'Café São José',
    description: 'Pães e café da manhã.',
    imageUrl: '/assets/gallery/gallery-1.webp',
    distance: '500 m',
    tags: ['Café'],
    address: 'Centro, Petrolina - PE',
};
const river: PlaceRecommendation = {
    id: 'river',
    category: 'attractions',
    name: 'Passeio no rio',
    description: 'Passeio ao ar livre.',
    imageUrl: 'https://example.com/river.jpg',
    tags: ['Passeio'],
};
const restaurant: PlaceRecommendation = {
    id: 'restaurant',
    category: 'alacarte',
    name: 'Mesa do Vale',
    description: 'Comida regional.',
    imageUrl: 'https://example.com/food.jpg',
    tags: ['Almoço'],
};
const largeCatalog: PlaceRecommendation[] = Array.from({ length: 18 }, (_, index) => ({
    id: `large-${index + 1}`,
    category: index < 9 ? 'cafes' : 'attractions',
    name: `Lugar ${String(index + 1).padStart(2, '0')}`,
    description: index < 9 ? 'Café do grupo manhã.' : 'Passeio do grupo tarde.',
    imageUrl: '/assets/gallery/gallery-1.webp',
    tags: [],
}));
const event = (id: string, eventDate: string, eventEndDate?: string): PlaceRecommendation => ({
    id,
    category: 'events',
    name: id,
    description: 'Evento de demonstração.',
    imageUrl: '',
    tags: [],
    eventDate,
    eventEndDate,
});

function renderExplore(props: Partial<DesktopExploreProps> = {}, favorites: string[] = []) {
    return render(
        <LanguageProvider>
            <FavoritesProvider initialFavorites={favorites}>
                <DesktopExplore places={[cafe, river, restaurant]} activeEvents={[]} {...props} />
            </FavoritesProvider>
        </LanguageProvider>
    );
}

beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-05T12:00:00-03:00'));
});
afterEach(() => {
    cleanup();
    vi.useRealTimers();
});

describe('Desktop guide exploration', () => {
    it('finds accented names without requiring accents and derives the visible detail', () => {
        renderExplore();
        fireEvent.change(screen.getByRole('searchbox', { name: 'Buscar lugares' }), {
            target: { value: 'sao jose' },
        });
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        expect(within(list).getByText(cafe.name)).toBeTruthy();
        expect(within(list).queryByText(river.name)).toBeNull();
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
    });

    it('filters by category and replaces a detail that no longer belongs to the results', () => {
        renderExplore();
        fireEvent.click(screen.getByRole('button', { name: /^Passeios\s*1$/ }));
        expect(screen.getByRole('heading', { level: 2, name: river.name })).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: /^Cafés e padarias\s*1$/ }));
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
        expect(screen.queryByRole('heading', { level: 2, name: river.name })).toBeNull();
    });

    it('shows an empty result and recovers without a stale selected detail', () => {
        renderExplore();
        const search = screen.getByRole('searchbox', { name: 'Buscar lugares' });
        fireEvent.change(search, { target: { value: 'não existe' } });
        expect(screen.queryByRole('article')).toBeNull();
        expect(screen.getByRole('status').textContent).toContain('0 lugares encontrados');
        fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
    });

    it('uses only current published events, including an ongoing multi-day event', () => {
        const expired = event('Evento expirado', '2026-11-03');
        const ongoing = event('Festival em andamento', '2026-11-03', '2026-11-07');
        const future = event('Próximo evento', '2026-11-08');
        const hidden = { ...event('Evento oculto', '2026-11-09'), visible: false };
        renderExplore({ places: [expired], activeEvents: [expired, ongoing, future, hidden] });
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        expect(within(list).queryByText(expired.name)).toBeNull();
        expect(within(list).queryByText(hidden.name)).toBeNull();
        expect(within(list).getByText(ongoing.name)).toBeTruthy();
        expect(within(list).getByText(future.name)).toBeTruthy();
    });

    it('updates the favorites view immediately when a saved place is removed', () => {
        renderExplore({ favoritesOnly: true }, ['cafe']);
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
        fireEvent.click(
            screen.getByRole('button', { name: `Remover dos favoritos: ${cafe.name}` })
        );
        expect(screen.queryByRole('heading', { level: 2, name: cafe.name })).toBeNull();
        expect(screen.getByRole('status').textContent).toContain('0 lugares encontrados');
    });

    it('never exposes untrusted URL protocols and provides a safe map fallback', () => {
        const unsafe = {
            ...cafe,
            mapsLink: 'javascript:alert(1)',
            orderLink: 'data:text/html,<h1>unsafe</h1>',
            whatsapp: 'javascript:alert(2)',
            phoneNumber: 'javascript:alert(3)',
        };
        renderExplore({ places: [unsafe] });
        const links = screen.getAllByRole('link');
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
            expect(link.getAttribute('href')).toMatch(
                /^https:\/\/www\.google\.com\/maps\/search\//
            );
            expect(link.getAttribute('target')).toBe('_blank');
            expect(link.getAttribute('rel')).toContain('noopener');
        }
    });

    it('renders valid local images and offers a fallback when they fail', () => {
        renderExplore({ places: [cafe] });
        const cover = screen.getByRole('img', { name: cafe.name });
        expect(cover.getAttribute('src')).toBe(cafe.imageUrl);
        fireEvent.error(cover);
        expect(screen.queryByRole('img', { name: cafe.name })).toBeNull();
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
    });

    it('keeps an unidentified place readable without offering a favorite that cannot persist', () => {
        renderExplore({ places: [{ ...cafe, id: undefined }] });
        expect(screen.getByRole('heading', { level: 2, name: cafe.name })).toBeTruthy();
        expect(screen.queryByRole('button', { name: /Salvar nos favoritos/ })).toBeNull();
    });

    it('paginates a large catalog in groups of six with consistent previous and next controls', () => {
        renderExplore({ places: largeCatalog });
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        const previous = screen.getByRole('button', { name: 'Anterior' });
        const next = screen.getByRole('button', { name: 'Próxima' });
        expect(within(list).getAllByRole('listitem')).toHaveLength(6);
        expect(screen.getByText('1–6 de 18')).toBeTruthy();
        expect(previous.hasAttribute('disabled')).toBe(true);

        fireEvent.click(next);
        expect(within(list).getAllByRole('listitem')).toHaveLength(6);
        expect(screen.getByText('7–12 de 18')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 07' })).toBeTruthy();
        expect(previous.hasAttribute('disabled')).toBe(false);

        fireEvent.click(next);
        expect(within(list).getAllByRole('listitem')).toHaveLength(6);
        expect(screen.getByText('13–18 de 18')).toBeTruthy();
        expect(next.hasAttribute('disabled')).toBe(true);
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 13' })).toBeTruthy();

        fireEvent.click(previous);
        expect(screen.getByText('7–12 de 18')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 07' })).toBeTruthy();
    });

    it('resets a large catalog to page one when searching, clearing search, or changing categories', () => {
        renderExplore({ places: largeCatalog });
        const next = screen.getByRole('button', { name: 'Próxima' });
        fireEvent.click(next);
        fireEvent.click(next);
        const search = screen.getByRole('searchbox', { name: 'Buscar lugares' });
        fireEvent.change(search, { target: { value: 'grupo manha' } });
        expect(screen.getByText('1–6 de 9')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 01' })).toBeTruthy();

        fireEvent.click(next);
        expect(screen.getByText('7–9 de 9')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));
        expect(screen.getByText('1–6 de 18')).toBeTruthy();

        fireEvent.click(next);
        fireEvent.click(next);
        fireEvent.click(screen.getByRole('button', { name: /^Passeios\s*9$/ }));
        expect(screen.getByText('1–6 de 9')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 10' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Anterior' }).hasAttribute('disabled')).toBe(
            true
        );
    });

    it('clamps the page when favorites are removed from the final page without stale details', () => {
        const savedPlaces = largeCatalog.slice(0, 13);
        renderExplore(
            { places: savedPlaces, favoritesOnly: true },
            savedPlaces.map((place) => place.id!)
        );
        fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
        fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
        expect(screen.getByText('13–13 de 13')).toBeTruthy();

        fireEvent.click(screen.getByRole('button', { name: 'Remover dos favoritos: Lugar 13' }));
        expect(screen.getByText('7–12 de 12')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 07' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Próxima' }).hasAttribute('disabled')).toBe(true);

        for (let index = 7; index <= 12; index += 1) {
            fireEvent.click(
                screen.getByRole('button', {
                    name: `Remover dos favoritos: Lugar ${String(index).padStart(2, '0')}`,
                })
            );
        }
        expect(screen.getByText('1–6 de 6')).toBeTruthy();
        expect(screen.getByRole('heading', { level: 2, name: 'Lugar 01' })).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Anterior' }).hasAttribute('disabled')).toBe(
            true
        );
        expect(screen.getByRole('button', { name: 'Próxima' }).hasAttribute('disabled')).toBe(true);
        expect(
            within(screen.getByRole('list', { name: 'Lugares encontrados' })).getAllByRole(
                'listitem'
            )
        ).toHaveLength(6);
    });

    it('resets only the details scroll when selecting another place and preserves list scroll and focus', () => {
        renderExplore({ places: largeCatalog });
        fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
        const detail = screen.getByRole('article', { name: 'Lugar 07' });
        const listPanel = screen.getByRole('region', { name: 'Lista de lugares' });
        detail.scrollTop = 320;
        listPanel.scrollTop = 180;
        const pageScroll = vi.spyOn(window, 'scrollTo');
        const list = screen.getByRole('list', { name: 'Lugares encontrados' });
        const eighthPlace = within(list).getByRole('button', { name: /^Lugar 08/ });
        eighthPlace.focus();
        fireEvent.click(eighthPlace);

        expect(screen.getByRole('article', { name: 'Lugar 08' }).scrollTop).toBe(0);
        expect(listPanel.scrollTop).toBe(180);
        expect(document.activeElement).toBe(eighthPlace);
        expect(screen.getByText('7–12 de 18')).toBeTruthy();
        expect(pageScroll).not.toHaveBeenCalled();
        pageScroll.mockRestore();
    });
});
