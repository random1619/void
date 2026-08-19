import { Star } from 'lucide-react';
import { cn, getStarArray } from '../../lib/utils';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
}

export function StarRating({ rating, size = 'sm', showValue = false }: StarRatingProps) {
  const stars = getStarArray(rating);
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5 stars`}
    >
      {stars.map((star, i) => (
        <span key={i} className="relative inline-block" aria-hidden="true">
          {/* Empty star as the base layer */}
          <Star
            className={cn(iconSize, 'text-ink-mute/30')}
          />
          {/* Full star overlay — clipped to the left half when half star */}
          <span
            className={cn(
              'absolute inset-0 overflow-hidden',
              star === 'half' ? 'w-1/2' : star === 'full' ? 'w-full' : 'w-0'
            )}
          >
            <Star className={cn(iconSize, 'text-sienna fill-[var(--sienna)]')} />
          </span>
        </span>
      ))}
      {showValue && (
        <span className="text-xs text-ink-mute ml-1" aria-hidden="true">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
