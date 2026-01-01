import { useState, useCallback } from 'react';
import { Reservation } from '../../../../types';

export interface GuestHistoryItem {
    reservation: Reservation;
    visitCount: number;
    lastVisit: string;
    averageRating: number;
}

interface UseGuestAutocompleteProps {
    previousGuests: Reservation[];
    onSelectGuest: (item: GuestHistoryItem) => void;
}

interface UseGuestAutocompleteReturn {
    filteredGuests: GuestHistoryItem[];
    showSuggestions: boolean;
    setShowSuggestions: (show: boolean) => void;
    handleGuestNameChange: (value: string) => void;
    selectGuest: (item: GuestHistoryItem) => void;
}

export function useGuestAutocomplete({
    previousGuests,
    onSelectGuest,
}: UseGuestAutocompleteProps): UseGuestAutocompleteReturn {
    const [filteredGuests, setFilteredGuests] = useState<GuestHistoryItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleGuestNameChange = useCallback(
        (value: string) => {
            if (value.length > 2) {
                // NORMALIZAÇÃO PARA BUSCA
                const term = value.toLowerCase();

                // 1. Agrupar visitas por Nome + Telefone (chave única aproximada)
                const guestMap = new Map<
                    string,
                    { item: GuestHistoryItem; totalRating: number; ratingCount: number }
                >();

                previousGuests.forEach((g) => {
                    // Remove espaços extras e normaliza
                    const name = g.guestName.trim();
                    const phone = g.guestPhone ? g.guestPhone.replace(/\D/g, '') : 'nophone';

                    // Chave composta para identificar unicamente (ou tentar)
                    const uniqueKey = `${name.toLowerCase()}_${phone}`;

                    if (name.toLowerCase().includes(term)) {
                        let entry = guestMap.get(uniqueKey);

                        if (!entry) {
                            entry = {
                                item: {
                                    reservation: g,
                                    visitCount: 0,
                                    lastVisit: '',
                                    averageRating: 0, // Will calculate at the end
                                },
                                totalRating: 0,
                                ratingCount: 0,
                            };
                            guestMap.set(uniqueKey, entry);
                        }

                        // Increment stats
                        entry.item.visitCount += 1;

                        // Update Last Visit
                        if (
                            g.checkoutDate &&
                            (!entry.item.lastVisit || g.checkoutDate > entry.item.lastVisit)
                        ) {
                            entry.item.lastVisit = g.checkoutDate;
                        }

                        // Accumulate Rating (if present)
                        if (g.guestRating) {
                            entry.totalRating += g.guestRating;
                            entry.ratingCount += 1;
                        }
                    }
                });

                // 2. Converter para array e calcular médias finais
                const results: GuestHistoryItem[] = Array.from(guestMap.values())
                    .map((entry) => {
                        // Calculate Average Rating (Default to 5 if no ratings yet)
                        const avg =
                            entry.ratingCount > 0 ? entry.totalRating / entry.ratingCount : 5;

                        return {
                            ...entry.item,
                            averageRating: avg,
                        };
                    })
                    .sort((a, b) => b.visitCount - a.visitCount)
                    .slice(0, 5);

                setFilteredGuests(results);
                setShowSuggestions(true);
            } else {
                setShowSuggestions(false);
            }
        },
        [previousGuests]
    );

    const selectGuest = useCallback(
        (item: GuestHistoryItem) => {
            onSelectGuest(item);
            setShowSuggestions(false);
        },
        [onSelectGuest]
    );

    return {
        filteredGuests,
        showSuggestions,
        setShowSuggestions,
        handleGuestNameChange,
        selectGuest,
    };
}
