import React from 'react';
import { Search } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'search';
    leftIcon?: React.ReactNode;
    error?: string;
}

export const Input: React.FC<InputProps> = ({
    variant = 'default',
    leftIcon,
    error,
    className = '',
    ...props
}) => {
    const baseClass = variant === 'search' ? 'ui-input-search' : 'ui-input';
    const errorClass = error ? 'border-red-500 focus:ring-red-500' : '';

    const hasLeftIcon = variant === 'search' || Boolean(leftIcon);

    return (
        <div className="relative w-full">
            {variant === 'search' && (
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                />
            )}
            {leftIcon && variant !== 'search' && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    {leftIcon}
                </div>
            )}
            <input
                className={`${baseClass} ${errorClass} ${hasLeftIcon ? '!pl-12' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
