import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function useLenis() {
  useEffect(() => {
    // Smooth/inertial scrolling is motion — skip it entirely for users who
    // prefer reduced motion. They get native, instant scrolling instead.
    // Reactively start/stop if the OS setting changes mid-session.
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

    let lenis: Lenis | null = null;

    // gsap.ticker.remove() matches by function identity, so the callback must
    // be a stable reference — otherwise the cleanup below silently does nothing
    // and orphaned raf callbacks keep calling into a destroyed Lenis instance.
    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };

    const start = () => {
      if (lenis) return; // already started

      lenis = new Lenis({
        // GSAP owns the clock below; a longer duration plus lower wheel gain gives
        // the storefront a slower, editorial scroll without changing native layout.
        duration: 1.2,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.72,
        touchMultiplier: 1.15,
      });

      lenisInstance = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    };

    const stop = () => {
      if (!lenis) return; // already stopped

      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenis = null;
      lenisInstance = null;
    };

    if (!mq.matches) start();

    const onChange = () => (mq.matches ? stop() : start());
    mq.addEventListener('change', onChange);

    return () => {
      mq.removeEventListener('change', onChange);
      stop();
    };
  }, []);
}
