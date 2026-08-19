import { type Variants } from 'framer-motion';

/* Shared Apple & agency luxury ease curves */
export const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;
export const EASE_FLUID = [0.32, 0.72, 0, 1] as const;
export const EASE_EXIT = [0.3, 0, 0.8, 0.15] as const;

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_LUXURY },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_LUXURY },
  },
};

/* Headline reveal — words rise out of an overflow-hidden mask with 3D perspective */
export const headlineContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.1,
    },
  },
};

export const headlineWord: Variants = {
  hidden: { y: '110%', opacity: 0, rotateX: 15 },
  visible: {
    y: '0%',
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.65, ease: EASE_LUXURY },
  },
};

/* Kinetic tracking-expansion — letters rise while the word's tracking breathes open */
export const trackingWord: Variants = {
  hidden: { letterSpacing: '-0.05em', opacity: 0, y: '0.3em' },
  visible: {
    letterSpacing: '0em',
    opacity: 1,
    y: '0em',
    transition: { duration: 0.75, ease: EASE_LUXURY },
  },
};

/* Cinematic image settle — enters with subtle scale settle */
export const luxuryImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_LUXURY },
  },
};

/* Drawer / list item entrance */
export const drawerItemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EASE_LUXURY },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2, ease: EASE_EXIT },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_LUXURY },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.35, ease: EASE_EXIT },
  },
};

export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_LUXURY },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.25, ease: EASE_EXIT },
  },
};

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 28, mass: 0.7 },
  },
  exit: {
    opacity: 0,
    y: 16,
    transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.6 },
  },
};

export const clipReveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_LUXURY },
  },
};

