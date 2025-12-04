import React from 'react';

interface HolographicCardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    title?: string;
}

const HolographicCard: React.FC<HolographicCardProps> = ({ children, className = '', onClick, title }) => {
    return (
        <div
            className={`relative ${className}`}
            onClick={onClick}
            title={title}
        >
            {/* Conteúdo do Card */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default HolographicCard;
