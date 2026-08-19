import { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { EASE_FLUID_IN, EASE_FLUID_OUT, route } from '../../lib/motion-tokens';

/**
 * FluidPageTransition — the shared route-transition layer.
 *
 * Every page mounts inside this. Three layers work together:
 *   1. A nested rise (the page content) — starts short of the final position
 *      and settles with the brand decelerate curve. Rising from *behind*
 *      the mask means the final position is already on screen, so a rapid
 *      back-navigation can grab the page mid-flight and reverse it without
 *      the content ever appearing to jump.
 *   2. A sienna keyline that draws across just under the header — the
 *      "route beam" that tells the eye the composition is settling.
 *
 * Asymmetric timing per the luxury rule: enter is slow and deliberate
 * (0.8s decelerate), exit is committed and fast (0.34s accelerate).
 * Only transform + opacity animate — the codebase deliberately avoids
 * filter/blur on large wrappers (breaks fixed descendants, paint-heavy).
 * Reduced motion renders the page statically — no travel, no keyline.
 */

interface FluidPageTransitionProps {
  children: React.ReactNode;
}

export function FluidPageTransition({ children }: FluidPageTransitionProps) {
  const reducedMotion = useReducedMotion();

  const variants = useMemo<{
    shell: Variants;
    content: Variants;
    keyline: Variants;
  }>(() => {
    if (reducedMotion) {
      return {
        shell: { initial: {}, animate: {}, exit: {} },
        content: { initial: {}, animate: {}, exit: {} },
        keyline: { initial: {}, animate: {}, exit: {} },
      };
    }

    const inEase = EASE_FLUID_IN;
    const outEase = EASE_FLUID_OUT;

    return {
      shell: {
        initial: {},
        animate: {
          transition: { staggerChildren: route.stagger, delayChildren: route.delay },
        },
        exit: {},
      },
      content: {
        initial: { y: 44, opacity: 0.001 },
        animate: {
          y: 0,
          opacity: 1,
          transition: { duration: route.enter, ease: inEase },
        },
        exit: {
          y: -24,
          opacity: 0,
          transition: { duration: route.exit, ease: outEase },
        },
      },
      keyline: {
        initial: { scaleX: 0 },
        animate: {
          scaleX: 1,
          transition: { duration: route.enter * 0.55, ease: inEase },
        },
        exit: {
          scaleX: 0,
          transition: { duration: route.exit, ease: outEase },
        },
      },
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div variants={variants.shell} initial="initial" animate="animate" exit="exit">
      {/* Route beam — sienna keyline under the header, drawn in on arrival. */}
      <motion.div
        variants={variants.keyline}
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-px bg-sienna origin-left z-[45] pointer-events-none"
      />
      <motion.div variants={variants.content}>{children}</motion.div>
    </motion.div>
  );
}
