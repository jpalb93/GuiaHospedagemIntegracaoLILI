import React from 'react';

type CardVariant = 'default' | 'glass' | 'dark';

interface CardProps {
    variant?: CardVariant;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
    default: 'ui-card',
    glass: 'ui-card-glass',
    dark: 'ui-card-dark',
};

const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    className = '',
    children,
    onClick,
}) => {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
            onClick={onClick}
        >
            {children}
        </Component>
    );
};

export default Card;
