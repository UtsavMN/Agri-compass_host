/**
 * Optimized Image Components
 * Lazy loading, blur placeholders, and performance optimization
 */

import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  priority?: boolean; // Don't lazy load if true
  className?: string;
  onLoad?: () => void;
}

/**
 * Optimized Image with Lazy Loading
 * @example
 * <OptimizedImage 
 *   src="/images/crop.jpg" 
 *   alt="Rice crop" 
 *   width={400} 
 *   height={300}
 * />
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  blurDataURL,
  priority = false,
  className = '',
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(priority ? src : undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image comes into view
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-slate-100 ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}

      {/* Shimmer loading effect */}
      {!isLoaded && !blurDataURL && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Actual image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0 invisible'}`}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Progressive Image - Shows low quality first, then high quality
 */
export function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  className = '',
  ...props
}: {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  className?: string;
} & ImgHTMLAttributes<HTMLImageElement>) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
  }, [highQualitySrc]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading="lazy"
      className={`transition-all duration-300 ${
        isHighQualityLoaded ? '' : 'blur-sm'
      } ${className}`}
      {...props}
    />
  );
}

/**
 * Background Image with Lazy Loading
 */
export function LazyBackgroundImage({
  src,
  children,
  className = '',
  threshold = 0.1,
}: {
  src: string;
  children?: React.ReactNode;
  className?: string;
  threshold?: number;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold }
    );

    if (divRef.current) {
      observer.observe(divRef.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (isInView) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
    }
  }, [isInView, src]);

  return (
    <div
      ref={divRef}
      className={`${className} transition-opacity duration-300 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : 'none',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Image with aspect ratio container
 */
export function AspectRatioImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  priority = false,
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio }}>
      <OptimizedImage
        src={src}
        alt={alt}
        priority={priority}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
}

/**
 * Generate blur data URL (for build time or server-side)
 */
export function generateBlurDataURL(color = '#e2e8f0'): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='${encodeURIComponent(
    color
  )}' filter='url(%23b)'/%3E%3C/svg%3E`;
}
