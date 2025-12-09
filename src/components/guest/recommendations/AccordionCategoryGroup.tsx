import React, { useState } from 'react';
import { PlaceRecommendation } from '../../../types';
import { PlacesCategory } from './PlacesCategory';

export interface CategoryData {
    id: string;
    title: string;
    icon: React.ReactNode;
    places: PlaceRecommendation[];
    visible?: boolean;
}

interface AccordionCategoryGroupProps {
    categories: CategoryData[];
    initialOpenId?: string;
}

const AccordionCategoryGroup: React.FC<AccordionCategoryGroupProps> = ({
    categories,
    initialOpenId
}) => {
    const [openId, setOpenId] = useState<string | null>(initialOpenId || null);

    const handleToggle = (id: string) => {
        setOpenId(prev => prev === id ? null : id);
    };

    return (
        <div className="flex flex-col">
            {categories.map(cat => (
                <PlacesCategory
                    key={cat.id}
                    title={cat.title}
                    icon={cat.icon}
                    places={cat.places}
                    visible={cat.visible}
                    isOpen={openId === cat.id}
                    onToggle={() => handleToggle(cat.id)}
                />
            ))}
        </div>
    );
};

export default AccordionCategoryGroup;
