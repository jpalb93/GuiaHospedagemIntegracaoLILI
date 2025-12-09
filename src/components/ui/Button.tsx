import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: 'py-2 px-3 text-xs min-h-[44px]',
    md: 'py-3 px-5 text-sm min-h-[48px]',
    lg: 'py-4 px-6 text-base min-h-[52px]',
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'ui-btn-primary active:scale-95',
    secondary: 'ui-btn-secondary active:scale-95',
    ghost: 'ui-btn-ghost active:scale-95',
    icon: 'ui-btn-icon min-w-[44px] min-h-[44px] active:scale-90',
    danger: 'ui-btn-danger active:scale-95',
};

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    children,
    className = '',
    ...props
}) => {
    // Icon variant ignores size classes
    const sizeClass = variant === 'icon' ? '' : sizeClasses[size];
    const widthClass = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${variantClasses[variant]} ${sizeClass} ${widthClass} ${className}`}
            {...props}
        >
            {leftIcon}
            {children}
            {rightIcon}
        </button>
    );
};

export default Button;
