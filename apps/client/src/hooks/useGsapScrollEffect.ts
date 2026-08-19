import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface GsapScrollEffectOptions {
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  duration?: number;
  ease?: string;
}

interface GsapParallaxOptions {
  yPercent?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
}

export function useGsapScrollEffect<T extends HTMLElement>({
  y = 56,
  x = 0,
  scale = 0.98,
  opacity = 1,
  start = 'top 92%',
  end = 'top 58%',
  duration = 1,
  ease = 'power3.out',
}: GsapScrollEffectOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      gsap.set(element, { autoAlpha: 1, x: 0, y: 0, scale: 1, clearProps: 'all' });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          autoAlpha: opacity,
          x,
          y,
          scale,
          transformOrigin: '50% 60%',
          willChange: 'transform, opacity',
        },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration,
          ease,
          scrollTrigger: {
            trigger: element,
            start,
            end,
            scrub: false,
            once: true,
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
          onComplete: () => gsap.set(element, { clearProps: 'willChange' }),
        }
      );
    }, element);

    return () => ctx.revert();
  }, [duration, ease, end, opacity, scale, start, x, y]);

  return ref;
}

export function useGsapParallax<T extends HTMLElement>({
  yPercent = 12,
  start = 'top bottom',
  end = 'bottom top',
  scrub = 1.1,
}: GsapParallaxOptions = {}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      gsap.set(element, { yPercent: 0, clearProps: 'transform' });
      return;
    }

    const trigger = element.parentElement || element;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { yPercent: -yPercent },
        {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start,
            end,
            scrub,
            invalidateOnRefresh: true,
          },
        }
      );
    }, element);

    return () => ctx.revert();
  }, [end, scrub, start, yPercent]);

  return ref;
}
