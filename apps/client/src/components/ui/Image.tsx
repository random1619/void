import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  wrapperClassName?: string;
}

export function Image({ className, skeletonClassName, wrapperClassName, alt, onError, ...props }: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName, className)}>
      <AnimatePresence>
        {!isLoaded && !hasError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={cn(
              'absolute inset-0 z-10 bg-black/10 dark:bg-white/10 animate-pulse',
              skeletonClassName
            )}
          />
        )}
      </AnimatePresence>
      {!hasError ? (
        <img
          alt={alt || ''}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            setHasError(true);
            onError?.(e);
          }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bone)]" aria-hidden="true">
          <span className="font-display text-3xl text-ink-mute/25 select-none">V</span>
        </div>
      )}
    </div>
  );
}
