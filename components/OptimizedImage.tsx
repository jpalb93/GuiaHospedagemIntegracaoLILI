import React, { useState } from 'react';
import { ImageOff, Loader2 } from 'lucide-react';

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
    <div className={`relative overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}>
      {/* SKELETON LOADING (Pulsante) */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse z-10">
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        </div>
      )}

      {/* ESTADO DE ERRO */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400">
          <ImageOff size={24} />
          <span className="text-[10px] mt-1 font-medium uppercase tracking-wider">Indisponível</span>
        </div>
      ) : (
        /* A IMAGEM REAL */
        <img
          src={src}
          alt={alt}
          loading="lazy" // O navegador só baixa quando estiver perto da tela
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