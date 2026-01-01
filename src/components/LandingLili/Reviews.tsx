import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useGuestReviews } from '../../hooks/useGuestReviews';
import { GuestReview } from '../../types';

const Reviews: React.FC = () => {
    const { data: fetchedReviews, isLoading: isLoadingReviews } = useGuestReviews(3);

    const reviews = useMemo(() => {
        if (fetchedReviews && fetchedReviews.length > 0) return fetchedReviews;
        if (!isLoadingReviews) {
            return [
                {
                    id: '1',
                    name: 'Ana Silva',
                    text: 'Lugar incrível, super limpo e aconchegante. A localização é perfeita!',
                    date: '2024-01-15',
                    rating: 5,
                    source: 'google',
                    visible: true,
                },
                {
                    id: '2',
                    name: 'Carlos Oliveira',
                    text: 'Ótima estadia, anfitriões muito atenciosos. Recomendo para todos!',
                    date: '2024-02-10',
                    rating: 5,
                    source: 'booking',
                    visible: true,
                },
                {
                    id: '3',
                    name: 'Mariana Costa',
                    text: 'Tudo impecável, desde a decoração até o conforto da cama. Voltarei com certeza!',
                    date: '2024-03-05',
                    rating: 5,
                    source: 'airbnb',
                    visible: true,
                },
            ] as GuestReview[];
        }
        return [] as GuestReview[];
    }, [fetchedReviews, isLoadingReviews]);

    return (
        <section id="avaliacoes" className="py-24 bg-stone-100">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                        O que dizem nossos hóspedes
                    </span>
                    <h2 className="text-4xl font-heading font-medium text-gray-900">
                        Experiências Reais
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        className={
                                            i < Number(review.rating)
                                                ? 'fill-orange-400 text-orange-400'
                                                : 'text-gray-200'
                                        }
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 italic mb-6">"{review.text}"</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="font-bold text-gray-900 text-sm">
                                    {review.name}
                                </span>
                                <span className="text-xs text-gray-400 capitalize">
                                    {review.source}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
