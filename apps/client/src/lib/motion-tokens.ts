/**
 * Motion Foundations — centralized tokens, springs, and reduced-motion helpers.
 * Import from here instead of using inline numbers or framer-motion defaults.
 */

import { MotionProps } from 'framer-motion';

// Brand eases — re-exported from animations.ts' EASE_LUXURY so all pages share
// one source of truth for the editorial decelerate curve.
export const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;
export const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

// Accent eases for the fluid choreography layer (fluid-shared.tsx).
// Asymmetric by design per the luxury timing rule: entries are deliberately
// slow (emphasized decelerate — accelerate hard, decelerate forever), exits
// are committed and quick (emphasized accelerate — get out fast, no drift).
export const EASE_FLUID_IN = [0.1, 0.9, 0.25, 1] as const;
export const EASE_FLUID_OUT = [0.4, 0, 1, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Duration tokens (seconds) — tuned for a premium, deliberate feel
export const duration = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  crawl: 0.8,
} as const;

// Easing curves — smooth, natural, never mechanical
export const easing = {
  // Standard curves
  linear: [0, 0, 1, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,      // Default "snappy but soft"
  gentle: [0.25, 0.1, 0.25, 1] as const,    // Very soft landing
  // Expressive curves
  emphasized: [0.2, 0, 0, 1] as const,      // Material 3 emphasized
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
} as const;

// Spring presets — physics-based, interrupt-safe
export const springs = {
  // Gentle, organic — great for micro-interactions and cursor followers
  gentle: { type: 'spring', stiffness: 180, damping: 26, mass: 0.8 } as const,
  // Snappy, decisive — buttons, toggles, quick state changes
  snappy: { type: 'spring', stiffness: 380, damping: 32, mass: 0.6 } as const,
  // Soft release for drag interactions
  release: { type: 'spring', stiffness: 220, damping: 28, mass: 1 } as const,
  // Slow, luxurious — large panels, drawers
  luxurious: { type: 'spring', stiffness: 120, damping: 24, mass: 1.1 } as const,
} as const;

// Scale tokens for hover/press states
export const scale = {
  hover: 1.02,
  press: 0.985,
  pop: 1.08,
} as const;

// Distance tokens (px) — consistent spatial rhythm
export const distance = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
  xxl: 64,
} as const;

// Route-level durations for the fluid-shared transition layer. Deliberately
// a touch longer than the UI durations: a page change is a cinematic beat,
// and every inner animation (headlines, images) choreographs against it.
export const route = {
  enter: 0.8,
  exit: 0.34,
  stagger: 0.07,
  delay: 0.12,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Type helpers
export type DurationToken = keyof typeof duration;
export type SpringToken = keyof typeof springs;
export type EasingToken = keyof typeof easing;

// ─────────────────────────────────────────────────────────────────────────────
// Reduced-motion helper — lives in hooks/useSafeMotion.ts (memoized + reactive)

// ─────────────────────────────────────────────────────────────────────────────
// Common transition presets (for non-spring animations)
export const transitions = {
  default: { duration: duration.normal, ease: easing.smooth },
  fast: { duration: duration.fast, ease: easing.smooth },
  slow: { duration: duration.slow, ease: easing.gentle },
  emphasized: { duration: duration.slow, ease: easing.emphasized },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Utility: attach these props to any motion component for consistent feel
export const motionDefaults: Partial<MotionProps> = {
  transition: transitions.default,
};