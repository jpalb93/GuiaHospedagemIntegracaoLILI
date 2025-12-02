
import React, { useState } from 'react';
import { ImageOff, Image as ImageIcon } from 'lucide-react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className = "", ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-200 dark:bg-gray-800 ${className}`}>
      {/* SKELETON LOADING ROBUSTO (SHIMMER EFFECT) */}
      {isLoading && (
        <div className="absolute inset-0 z-10 overflow-hidden bg-gray-200 dark:bg-gray-700">
          {/* O brilho que passa (Shimmer) */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"></div>

          {/* Ícone opcional centralizado para indicar imagem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-20">
            <ImageIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      )}

      {/* ESTADO DE ERRO */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 z-20">
          <ImageOff size={24} />
          <span className="text-[10px] mt-1 font-medium uppercase tracking-wider opacity-60">Indisponível</span>
        </div>
      ) : (
        /* A IMAGEM REAL */
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-700 ease-in-out ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
