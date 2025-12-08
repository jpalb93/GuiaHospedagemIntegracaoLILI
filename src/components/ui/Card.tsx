import React from 'react';

type CardVariant = 'default' | 'glass' | 'dark' | 'white-shadow' | 'flat-border';

interface CardProps {
    variant?: CardVariant;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    onClick?: () => void;
}

const variantClasses: Record<CardVariant, string> = {
    default: 'ui-card',
    glass: 'ui-card-glass',
    dark: 'ui-card-dark',
    // Novos: baseados em padrões encontrados no código
    'white-shadow': 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg',
    'flat-border': 'bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700',
};

const paddingClasses: Record<string, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-8',
    xl: 'p-6', // Padrão comum encontrado (p-6)
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
