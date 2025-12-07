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

    return (
        <div className="relative w-full">
            {variant === 'search' && (
                <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
            )}
            {leftIcon && variant !== 'search' && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {leftIcon}
                </div>
            )}
            <input
                className={`${baseClass} ${errorClass} ${leftIcon && variant !== 'search' ? 'pl-12' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
