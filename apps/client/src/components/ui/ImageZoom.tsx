import * as DialogPrimitive from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Image } from './Image';

interface ImageZoomProps {
  images: string[];
  alt: string;
  initialIndex?: number;
  children: React.ReactNode;
}

/**
 * ImageZoom — Radix Dialog-based full-screen image lightbox.
 *
 * Click the trigger (product image) to open a focus-trapped, scroll-locked
 * lightbox with keyboard navigation (← → arrows, Escape to close).
 * Uses framer-motion for smooth overlay + content transitions.
 */
export function ImageZoom({ images, alt, initialIndex = 0, children }: ImageZoomProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleOpen = useCallback(() => {
    setActiveIndex(initialIndex);
    setOpen(true);
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    },
    [goNext, goPrev],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          onClick={handleOpen}
          className="block w-full text-left cursor-zoom-in focus-visible:outline-offset-4"
          aria-label={`Zoom ${alt}`}
        >
          {children}
        </button>
      </DialogPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              onKeyDown={handleKeyDown}
              aria-label={`${alt} — image ${activeIndex + 1} of ${images.length}`}
            >
              <motion.div
                className="fixed inset-0 z-[101] flex items-center justify-center p-4 md:p-8 outline-none"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                {/* Close button */}
                <DialogPrimitive.Close asChild>
                  <button
                    className="absolute top-4 right-4 z-10 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                    aria-label="Close lightbox"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </DialogPrimitive.Close>

                {/* Navigation — Previous */}
                {images.length > 1 && (
                  <button
                    onClick={goPrev}
                    className="absolute left-3 md:left-6 z-10 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Main image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0.5, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.3, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                    className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                  >
                    <Image
                      src={images[activeIndex]}
                      alt={`${alt} — view ${activeIndex + 1}`}
                      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
                      loading="eager"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation — Next */}
                {images.length > 1 && (
                  <button
                    onClick={goNext}
                    className="absolute right-3 md:right-6 z-10 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white/80 hover:text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                {/* Bottom counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
                    <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
                      {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
                    </span>
                    <div className="flex gap-1.5 ml-3">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveIndex(idx)}
                          aria-label={`View image ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === activeIndex
                              ? 'bg-white scale-125'
                              : 'bg-white/30 hover:bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
