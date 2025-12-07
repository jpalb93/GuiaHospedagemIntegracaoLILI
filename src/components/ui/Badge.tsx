import React from 'react';

type BadgeVariant = 'orange' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';

interface BadgeProps {
    variant?: BadgeVariant;
    className?: string;
    children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
    orange: 'ui-badge-orange',
    blue: 'ui-badge-blue',
    green: 'ui-badge-green',
    yellow: 'ui-badge-yellow',
    red: 'ui-badge-red',
    gray: 'ui-badge-gray',
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'gray',
    className = '',
    children,
}) => {
    return <span className={`${variantClasses[variant]} ${className}`}>{children}</span>;
};

export default Badge;
