import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  srcSet?: string;
  sizes?: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function ImageWithFallback({
  src,
  srcSet,
  sizes,
  alt,
  fallbackTitle,
  className = 'w-full h-full object-cover',
  containerClassName = '',
  priority = false,
  width,
  height,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#111C30] via-[#0B1220] to-[#162540] text-[#A1AAB8] p-6 text-center ${containerClassName}`}
      >
        <ImageIcon className="w-8 h-8 text-[#3B82F6]/80" aria-hidden="true" />
        <span className="text-sm font-medium text-[#F8FAFC]">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#0B1220] ${containerClassName}`}>
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#0B1220] to-[#111C30]"
        />
      )}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
