import { useQuery } from '@tanstack/react-query';
import { getGuestReviews } from '../services/firebase/content';
import { GuestReview } from '../types';

export const useGuestReviews = (limitCount: number = 3) => {
    return useQuery<GuestReview[]>({
        queryKey: ['guestReviews', limitCount],
        queryFn: () => getGuestReviews(limitCount),
        staleTime: 1000 * 60 * 60, // 1 hour cache (reviews change slowly)
        refetchOnWindowFocus: false,
    });
};
