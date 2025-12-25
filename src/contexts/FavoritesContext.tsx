import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FavoritesContextData {
    favorites: string[];
    toggleFavorite: (id: string) => void;
    isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

const STORAGE_KEY = 'lili_db_favorites';

import { toggleFavoritePlace } from '../services/firebase/reservations';

export const FavoritesProvider: React.FC<{
    children: React.ReactNode;
    reservationId?: string;
    initialFavorites?: string[];
}> = ({ children, reservationId, initialFavorites }) => {
    const [favorites, setFavorites] = useState<string[]>(() => {
        // 1. Preferência: Dados do Banco (se disponíveis)
        if (initialFavorites && initialFavorites.length > 0) return initialFavorites;

        // 2. Fallback: LocalStorage
        try {
            if (typeof window === 'undefined') return [];
            const item = window.localStorage.getItem(STORAGE_KEY);
            return item ? JSON.parse(item) : [];
        } catch (error) {
            console.error('Error reading favorites from localStorage:', error);
            return [];
        }
    });

    // Sync com props recebidas (quando carregadas da API)
    useEffect(() => {
        if (initialFavorites) {
            // Mescla com locais para não perder dados offline?
            // Simplificação: Se veio do banco, confia no banco.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFavorites((current) => {
                // Opção: Mesclar
                const merged = Array.from(new Set([...current, ...initialFavorites]));
                return merged;
            });
        }
    }, [initialFavorites]);

    // Persist to localStorage whenever favorites change
    useEffect(() => {
        try {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            }
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    const toggleFavorite = useCallback(
        async (id: string) => {
            // Optimistic UI Update
            setFavorites((prev) => {
                const isRemoved = prev.includes(id);
                const next = isRemoved ? prev.filter((favId) => favId !== id) : [...prev, id];

                // Trigger Background Sync (Fire & Forget logic handled here for responsiveness)
                if (reservationId) {
                    toggleFavoritePlace(reservationId, id, prev).catch((err) => {
                        console.error('Failed to sync favorite:', err);
                        // Opcional: Reverter estado em caso de erro
                    });
                }

                return next;
            });
        },
        [reservationId]
    );

    const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
