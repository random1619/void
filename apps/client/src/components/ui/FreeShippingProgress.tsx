import { useEffect } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { computeCartTotals, FREE_SHIPPING_THRESHOLD } from '../../lib/cartCosts';
import { cn, formatPrice } from '../../lib/utils';

interface FreeShippingProgressProps {
  subtotal: number;
  /** Compact variant used in drawers where vertical space is tight. */
  variant?: 'full' | 'compact';
  className?: string;
}

/**
 * Shared free-shipping nudge. Previously only the Cart page surfaced progress
 * toward the threshold; the drawer and checkout omitted it, so customers
 * couldn't see they were a few dollars from free shipping at the moments that
 * matter most. Centralizing the markup keeps the messaging consistent.
 *
 * The fill is a spring, not a CSS transition: when the subtotal changes (an
 * item added, a quantity bumped), the bar accelerates from its current value
 * toward the new one — carrying the momentum of the change instead of
 * re-tweening from zero each time (apple-design §3, §5).
 */
export function FreeShippingProgress({
  subtotal,
  variant = 'full',
  className,
}: FreeShippingProgressProps) {
  const totals = computeCartTotals(subtotal);
  const pct = Math.round(totals.freeShippingProgress * 100);
  const reducedMotion = useReducedMotion() === true;

  const target = useMotionValue(Math.max(0.02, pct / 100));
  const scaleX = useSpring(target, {
    stiffness: 260,
    damping: 30,
    mass: 0.8,
  });

  useEffect(() => {
    target.set(Math.max(0.02, pct / 100));
  }, [pct, target]);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'flex justify-between mb-1.5',
          variant === 'compact' ? 'text-[10px]' : 'text-[11px]'
        )}
      >
        <span className="text-ink-mute uppercase tracking-wider">Free shipping</span>
        <span className={totals.freeShipping ? 'text-sienna' : 'text-ink-mute'}>
          {totals.freeShipping
            ? 'Unlocked'
            : `${formatPrice(totals.amountToFreeShipping)} away`}
        </span>
      </div>
      <div
        className="h-1 w-full bg-[var(--ivory-deep)] rounded-full overflow-hidden border border-hairline"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progress toward free shipping at ${formatPrice(FREE_SHIPPING_THRESHOLD)}`}
      >
        <motion.div
          className={cn(
            'h-full w-full rounded-full origin-left',
            totals.freeShipping ? 'bg-sienna' : 'bg-sienna/50'
          )}
          style={{
            scaleX: reducedMotion ? Math.max(0.02, pct / 100) : scaleX,
            transition: reducedMotion ? 'none' : undefined,
          }}
        />
      </div>
    </div>
  );
}
