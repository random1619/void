import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/**
 * 404 — Lost in the Atelier.
 * An editorial dead-end: the oversized numeral carries the message,
 * the mono error code reads as an atelier reference, and the archive
 * links offer a way back without a modal or a wall of text.
 */
export default function NotFound() {
  const reducedMotion = useReducedMotion();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: EASE_FLUID }}
      className="min-h-[100dvh] flex items-center justify-center px-4 atelier-bg text-ink"
    >
      <div className="w-full max-w-3xl text-center">
        {/* Editorial numeral */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_FLUID }}
          className="relative inline-block"
        >
          <span className="atelier-display text-[clamp(6rem,18vw,12rem)] leading-[0.85] tracking-[-0.04em] text-[rgba(var(--sienna-rgb),0.2)] select-none" aria-hidden="true">
            404
          </span>
          {/* Hairline frame */}
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-hairline pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="absolute -top-2 -left-2 w-4 h-4 border-t border-l border-sienna/60 pointer-events-none"
          />
          <span
            aria-hidden="true"
            className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-sienna/60 pointer-events-none"
          />
        </motion.div>

        {/* Error code ledger */}
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_FLUID }}
          className="mt-6 font-mono text-[11px] text-ink-mute tracking-[0.28em] uppercase"
        >
          Ref · Atelier-404 · Not Found
        </motion.p>

        {/* Message */}
        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE_FLUID }}
          className="mt-4 font-display text-2xl md:text-3xl font-bold tracking-tight"
        >
          This page has left the <em className="text-sienna">collection</em>.
        </motion.h1>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: EASE_FLUID }}
          className="mt-3 text-ink-mute text-sm md:text-base max-w-sm mx-auto leading-relaxed"
        >
          The address may have been retired, or the piece may have sold. Either
          way, the atelier is still open.
        </motion.p>

        {/* Actions */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: EASE_FLUID }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/products"
            className="pressable inline-flex items-center gap-3 px-7 py-4 bg-ink text-ivory font-mono text-xs uppercase tracking-[0.2em] hover:bg-sienna transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            The Collection
          </Link>
          <Link
            to="/collections"
            className="pressable inline-flex items-center gap-3 px-7 py-4 border border-hairline font-mono text-xs uppercase tracking-[0.2em] text-ink hover:border-ink transition-colors duration-300"
          >
            Past Seasons
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </motion.main>
  );
}
