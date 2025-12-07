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
    sm: 'py-2 px-3 text-xs',
    md: 'py-3 px-5 text-sm',
    lg: 'py-4 px-6 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
    primary: 'ui-btn-primary',
    secondary: 'ui-btn-secondary',
    ghost: 'ui-btn-ghost',
    icon: 'ui-btn-icon',
    danger: 'ui-btn-danger',
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
