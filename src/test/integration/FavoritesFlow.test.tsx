import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../../contexts/FavoritesContext';

// Mock Component to simulate PlaceCard interaction
const MockPlaceCard = ({ id, name }: { id: string; name: string }) => {
    const { isFavorite, toggleFavorite } = useFavorites();
    const active = isFavorite(id);

    return (
        <div data-testid={`card-${id}`}>
            <h2>{name}</h2>
            <button
                data-testid={`fav-btn-${id}`}
                onClick={() => toggleFavorite(id)}
                aria-label={active ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
                {active ? "Favoritado" : "Favoritar"}
            </button>
        </div>
    );
};

// Mock Component to simulate "My Favorites" List
const MockFavoritesList = () => {
    const { favorites } = useFavorites();

    if (favorites.length === 0) return <div>Sem favoritos</div>;

    return (
        <ul>
            {favorites.map((id) => (
                <li key={id} data-testid={`fav-item-${id}`}>
                    {id}
                </li>
            ))}
        </ul>
    );
};

describe('Favorites Integration Flow', () => {
    beforeEach(() => {
        // Clear localStorage mock
        window.localStorage.clear();
    });

    it('should add item to favorites and update list instantly', () => {
        render(
            <FavoritesProvider>
                <MockPlaceCard id="place-123" name="Burger King" />
                <MockFavoritesList />
            </FavoritesProvider>
        );

        // 1. Check initial state
        expect(screen.getByText('Sem favoritos')).toBeInTheDocument();
        expect(screen.getByTestId('fav-btn-place-123')).toHaveTextContent('Favoritar');

        // 2. Click Favorite
        fireEvent.click(screen.getByTestId('fav-btn-place-123'));

        // 3. Check Button Update
        expect(screen.getByTestId('fav-btn-place-123')).toHaveTextContent('Favoritado');

        // 4. Check List Update
        expect(screen.getByTestId('fav-item-place-123')).toBeInTheDocument();
        expect(screen.queryByText('Sem favoritos')).not.toBeInTheDocument();
    });

    it('should toggle off and remove from list', () => {
        render(
            <FavoritesProvider>
                <MockPlaceCard id="place-123" name="Burger King" />
                <MockFavoritesList />
            </FavoritesProvider>
        );

        // 1. Add
        fireEvent.click(screen.getByTestId('fav-btn-place-123'));
        expect(screen.getByTestId('fav-item-place-123')).toBeInTheDocument();

        // 2. Remove
        fireEvent.click(screen.getByTestId('fav-btn-place-123'));

        // 3. Check Removal
        expect(screen.getByTestId('fav-btn-place-123')).toHaveTextContent('Favoritar');
        expect(screen.queryByTestId('fav-item-place-123')).not.toBeInTheDocument();
        expect(screen.getByText('Sem favoritos')).toBeInTheDocument();
    });

    it('should persist across re-renders (simulating page reload with same localStorage)', () => {
        // 1. Set localStorage manually
        window.localStorage.setItem('lili_db_favorites', JSON.stringify(['place-999']));

        render(
            <FavoritesProvider>
                <MockFavoritesList />
            </FavoritesProvider>
        );

        // 2. Should load from storage
        expect(screen.getByTestId('fav-item-place-999')).toBeInTheDocument();
    });
});
