"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  style?: React.CSSProperties;
  onError?: () => void;
  showPlaceholder?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/placeholder-image.svg",
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  quality = 80,
  sizes,
  style,
  onError,
  showPlaceholder = true,
  ...props
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    setIsLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError && showPlaceholder) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height, ...style }}
      >
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      {isLoading && showPlaceholder && (
        <div 
          className={`absolute inset-0 bg-muted animate-pulse flex items-center justify-center ${className}`}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={className}
        style={style}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}