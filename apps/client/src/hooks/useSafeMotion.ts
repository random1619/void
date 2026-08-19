import { useEffect, useMemo, useState } from 'react';
import { springs, distance } from '../lib/motion-tokens';

/**
 * Returns safe, reduced-motion-aware animation props.
 * Use for any component that enters/exits the viewport.
 */
export function useSafeMotion(distanceValue = distance.xl) {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(mq.matches);

    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return useMemo(() => {
    if (prefersReduced) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.18 },
      };
    }

    return {
      initial: { opacity: 0, y: distanceValue },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: distanceValue * 0.6 },
      transition: springs.gentle,
    };
  }, [distanceValue, prefersReduced]);
}