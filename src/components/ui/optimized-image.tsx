import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  priority?: boolean;
}

export const OptimizedImage = ({ 
  src, 
  alt, 
  className, 
  lazy = true, 
  priority = false, 
  ...props 
}: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground text-sm",
        className
      )}>
        Failed to load image
      </div>
    );
  }

  return (
    <div className="relative">
      {!loaded && (
        <div className={cn(
          "absolute inset-0 bg-muted animate-pulse rounded-md",
          className
        )} />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : lazy ? "lazy" : undefined}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
    </div>
  );
};