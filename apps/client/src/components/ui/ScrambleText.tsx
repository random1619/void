import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&';

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Milliseconds per character decode step. Default 32. */
  speed?: number;
  /** Delay before the decode starts, ms. Default 400. */
  delay?: number;
}

/**
 * ScrambleText — the mono ledger line decodes itself into legibility.
 *
 * A short scramble of random glyphs settles character-by-character into the
 * final text, left to right. Runs once on mount.
 */
export function ScrambleText({
  text,
  className,
  speed = 30,
  delay = 350,
}: ScrambleTextProps) {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(() => (reducedMotion ? text : ''));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return;
    }

    let start = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(Math.floor(elapsed / speed), text.length);

      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (i < progress) {
          next += text[i];
        } else if (text[i] === ' ') {
          next += ' ';
        } else {
          next += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
      }
      setDisplay(next);

      if (progress < text.length) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    timeout = setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [text, speed, delay, reducedMotion]);

  return (
    <span className={className} aria-label={text} aria-live="polite">
      {display}
    </span>
  );
}
