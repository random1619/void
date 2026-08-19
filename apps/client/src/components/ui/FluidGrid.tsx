import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE_LUXURY } from '../../lib/animations';
import { cn } from '../../lib/utils';

/* ─────────────────────────────────────────────────────────────────────────────
   FluidGrid — a fluid, Apple-style items grid.
   ─────────────────────────────────────────────────────────────────────────────
   Three layers of fluidity, per apple-design (Designing Fluid Interfaces):

   1. INTERRUPTIBLE REORDER — FLIP-style reflow driven by framer's `layout`
      springs. When filters change and items swap or exit, every cell springs
      from its on-screen presentation value to the new position (interruptible,
      velocity-carrying, never a hard cut).

   2. CASCADE REVEAL — items enter one after another on the house luxury curve
      as they scroll into view. `layout` + the cached-y reset keep reflows from
      re-triggering the entrance (the "repeat flash" trap).

   3. ENVIRONMENT ATTENTION — hovering/focusing one card dims its siblings
      (pure CSS on an inner layer, see .fluid-grid in globals.css) so the board
      reads as a single instrument. CSS only, so it never fights this
      component's opacity animations.

   Reduced motion collapses everything to a short opacity cross-fade, per the
   site's atelier motion rules.
   ──────────────────────────────────────────────────────────────────────────── */

interface FluidGridProps {
  children: ReactNode;
  /** Tailwind grid classes. Default: 2 → 3 → 4 columns. */
  className?: string;
  /** Grid key — changing it remounts the grid (used by the Products view
      toggle so the two view modes never cross-reveal). */
  key?: string | number;
  /** Per-item entrance stagger in seconds. Default: 0.05. */
  stagger?: number;
}

function asArray(children: ReactNode): ReactElement[] {
  return Array.isArray(children)
    ? children
    : children
      ? [children as ReactElement]
      : [];
}

/** Cached position of the last successful reflow — every item starts its
    entrance at the same visual slot it will settle into, so `layout` reflows
    (which run on a 1-frame lag) never flash the item at translate-y-0. */
let layoutYCache = new Map<unknown, number>();

export function FluidGrid({
  children,
  className,
  stagger = 0.05,
}: FluidGridProps) {
  const reducedMotion = useReducedMotion();
  const [isInView, setIsInView] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const items = asArray(children);

  // Presence-only reveal (mount + `onViewportEnter`). The grid itself stays
  // fully mounted; the IntersectionObserver just flips the phase flag.
  useEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const itemVariants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
          opacity: 1,
          transition: { duration: 0.18, delay: Math.min(i * 0.03, 0.3) },
        }),
      }
    : {
        hidden: (i: number) => {
          const cache = layoutYCache.get(items[i]?.key ?? i);
          return { opacity: 0, y: cache ?? 32 };
        },
        visible: (i: number) => {
          layoutYCache.set(items[i]?.key ?? i, 0);
          return {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: EASE_LUXURY, delay: i * stagger },
          };
        },
      };

  return (
    <motion.div
      ref={gridRef}
      initial={reducedMotion ? false : 'hidden'}
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: {} }}
      className={cn(
        'fluid-grid',
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-14',
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {items.map((child, i) => {
          const key = child.key ?? i;
          return (
            <motion.div
              key={key}
              layout
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={itemVariants}
              custom={i}
              exit={{
                opacity: 0,
                scale: 0.96,
                transition: { duration: 0.24, ease: [0.3, 0, 0.8, 0.15] },
              }}
              transition={{
                layout: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
              }}
              className={cn('fluid-grid-item', 'relative')}
            >
              {child}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
