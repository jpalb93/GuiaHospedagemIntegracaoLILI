import React, { useMemo, useRef } from 'react';
import { Star } from 'lucide-react';
import { useGuestReviews } from '../../hooks/useGuestReviews';
import { GuestReview } from '../../types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Reviews: React.FC = () => {
    const { data: fetchedReviews, isLoading: isLoadingReviews } = useGuestReviews(3);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const items = gsap.utils.toArray(gridRef.current?.children || []);
            if (items.length > 0) {
                gsap.fromTo(
                    items,
                    {
                        y: 50,
                        opacity: 0,
                    },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        stagger: 0.2,
                        scrollTrigger: {
                            trigger: gridRef.current,
                            start: 'top 80%',
                        },
                    }
                );
            }
        },
        { scope: gridRef, dependencies: [fetchedReviews, isLoadingReviews] }
    );

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
        <section id="avaliacoes" className="py-24 bg-stone-950 border-t border-stone-800">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold uppercase tracking-widest text-xs mb-4 block">
                        O que dizem nossos hóspedes
                    </span>
                    <h2 className="text-4xl font-heading font-medium text-white">
                        Experiências Reais
                    </h2>
                </div>

                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-stone-900 p-8 rounded-xl shadow-sm border border-stone-800 hover:border-orange-500/30 transition-all hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={16}
                                        fill={i < (Number(review.rating) || 5) ? '#facc15' : 'none'}
                                        className={
                                            i < (Number(review.rating) || 5)
                                                ? 'text-yellow-400'
                                                : 'text-stone-700'
                                        }
                                    />
                                ))}
                            </div>
                            <p className="text-stone-300 italic mb-6">"{review.text}"</p>
                            <div className="flex justify-between items-center mt-auto">
                                <span className="font-bold text-white text-sm">{review.name}</span>
                                <span className="text-xs text-stone-500 capitalize">
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
