import { useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface SpringPressOptions {
  /** Scale factor on press. Default: 0.96 */
  scale?: number;
  /** Spring stiffness. Default: 400 */
  stiffness?: number;
  /** Spring damping. Default: 25 */
  damping?: number;
  /** Mass. Default: 0.6 */
  mass?: number;
}

/**
 * Spring-based press feedback — replaces CSS :active scale transitions.
 * Apple's press is physical: instant on pointer-down, spring-back on release.
 * Spread the returned props onto any motion.* component.
 *
 * @example
 * const press = useSpringPress({ scale: 0.96 });
 * <motion.button {...press}>Press me</motion.button>
 */
export function useSpringPress(options: SpringPressOptions = {}) {
  const { scale = 0.96, stiffness = 400, damping = 25, mass = 0.6 } = options;
  const reducedMotion = useReducedMotion();

  const isPressed = useMotionValue(0);

  // Use a spring so the release feels physical, not timed.
  const springScale = useSpring(
    useTransform(isPressed, [0, 1], [1, scale]),
    { stiffness, damping, mass }
  );

  return {
    style: reducedMotion ? undefined : { scale: springScale },
    onPointerDown: () => isPressed.set(1),
    onPointerUp: () => isPressed.set(0),
    onPointerCancel: () => isPressed.set(0),
    onPointerLeave: (_e?: React.PointerEvent) => isPressed.set(0),
  };
}
