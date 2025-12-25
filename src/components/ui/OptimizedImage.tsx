import React, { useState } from 'react';
import { ImageOff, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
    fallbackIcon?: React.ElementType;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className,
    containerClassName,
    fallbackIcon: FallbackIcon = ImageOff,
    ...props
}) => {
    // Check if image should be loaded eagerly (LCP optimization)
    // If so, we bypass the loading state to show the image immediately
    const isEager = props.loading === 'eager' || props.fetchPriority === 'high';
    const [isLoading, setIsLoading] = useState(!isEager);
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={cn(
                'relative overflow-hidden bg-gray-200 dark:bg-gray-800',
                containerClassName,
                className
            )}
        >
            {/* Skeleton Loader - Visible while loading (unless eager) */}
            {isLoading && (
                <div className="absolute inset-0 z-10 overflow-hidden bg-gray-200 dark:bg-gray-700">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"></div>

                    {/* Optional centered icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20">
                        <ImageIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            )}

            {/* Error State */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 z-20">
                    <FallbackIcon className="w-6 h-6 mb-1 opacity-60" />
                    <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">
                        Indisponível
                    </span>
                </div>
            )}

            {/* Main Image */}
            <img
                src={src}
                alt={alt}
                loading={isEager ? 'eager' : 'lazy'}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                className={cn(
                    'transition-opacity duration-700 ease-in-out block h-full w-full object-cover',
                    isLoading ? 'opacity-0' : 'opacity-100',
                    // Reset className here because we aplied it to container too?
                    // Actually usually we want className on the IMG if it controls object-fit etc.
                    // But if className has dimensions (w-full h-full), it should be on container too?
                    // Let's keep it simple: className goes to IMG, containerClassName handles wrapper.
                    className
                )}
                {...props}
            />
        </div>
    );
};

export default OptimizedImage;
