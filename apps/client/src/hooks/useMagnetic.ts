import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface MagneticOptions {
  /** How many pixels the element can move. Default: 20 */
  range?: number;
  /** Spring stiffness. Default: 200 */
  stiffness?: number;
  /** Spring damping. Default: 40 */
  damping?: number;
  /** Mass of the spring. Default: 0.5 */
  mass?: number;
}

/**
 * Magnetic cursor-follow physics — Apple-style direct manipulation.
 * The element subtly pulls toward the cursor, creating a physical,
 * alive feel. Attach the returned ref and spread motion styles onto
 * any element.
 *
 * @example
 * const { ref, style } = useMagnetic({ range: 16 });
 * <motion.button ref={ref} style={style}>Hover me</motion.button>
 */
export function useMagnetic(options: MagneticOptions = {}) {
  const { range = 20, stiffness = 200, damping = 40, mass = 0.5 } = options;
  const reducedMotion = useReducedMotion();

  const ref = useRef<HTMLElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring the movement so it feels physical, not robotic.
  const springX = useSpring(x, { stiffness, damping, mass });
  const springY = useSpring(y, { stiffness, damping, mass });

  const transform = useTransform(
    [springX, springY],
    ([latestX, latestY]) => `translate(${latestX}px, ${latestY}px)`
  );

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!ref.current || reducedMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Normalized offset: -0.5 to 0.5
    const offsetX = (e.clientX - centerX) / rect.width;
    const offsetY = (e.clientY - centerY) / rect.height;
    x.set(offsetX * range);
    y.set(offsetY * range);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    ref,
    style: { transform },
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };
}
