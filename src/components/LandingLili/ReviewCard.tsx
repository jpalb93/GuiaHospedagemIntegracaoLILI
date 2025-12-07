import React from 'react';
import { Star } from 'lucide-react';

interface ReviewCardProps {
    name: string;
    text: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ name, text }) => (
    <div className="bg-amber-50 p-6 rounded-xl shadow-sm border border-amber-100">
        <div className="flex text-amber-500 mb-4">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="currentColor" />
            ))}
        </div>
        <p className="text-gray-700 italic mb-4 text-sm leading-relaxed">"{text}"</p>
        <p className="text-gray-900 font-bold text-sm">- {name}</p>
    </div>
);

export default ReviewCard;
