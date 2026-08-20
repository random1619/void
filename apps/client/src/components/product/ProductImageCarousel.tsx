import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { Image } from '../ui/Image';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
  autoplay?: boolean;
  onSlideClick?: (index: number) => void;
}

/**
 * ProductImageCarousel — Embla-powered touch carousel for product images.
 *
 * Physics-based drag with native-feeling momentum, snap alignment, and
 * optional autoplay. Designed for mobile product detail galleries.
 */
export function ProductImageCarousel({
  images,
  alt,
  autoplay = false,
  onSlideClick,
}: ProductImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const plugins = autoplay
    ? [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
    : [];

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: images.length > 1,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
    },
    plugins,
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    onSelect();
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  if (images.length === 0) {
    return (
      <div className="aspect-[3/4] bg-[var(--bone)] flex items-center justify-center rounded-xl">
        <span className="font-display text-4xl text-ink-mute/30">V</span>
      </div>
    );
  }

  return (
    <div className="relative select-none">
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex touch-pan-y">
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] min-w-0 relative aspect-[3/4]"
            >
              <button
                type="button"
                className="block w-full h-full cursor-zoom-in"
                onClick={() => onSlideClick?.(i)}
                aria-label={`View ${alt} image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} — view ${i + 1}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              aria-label={`Go to image ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                idx === selectedIndex
                  ? 'w-7 h-2 bg-sienna shadow-[0_2px_6px_-1px_rgba(163,72,36,0.4)]'
                  : 'w-2 h-2 bg-ink/15 hover:bg-ink/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/15">
          <span className="font-mono text-[10px] text-white/80 tracking-widest uppercase font-bold">
            {String(selectedIndex + 1).padStart(2, '0')}/{String(images.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
}
