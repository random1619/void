import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useUIStore } from '../../stores/uiStore';
import { useThemeStore } from '../../stores/themeStore';
import { springs } from '../../lib/motion-tokens';

const DOT_SIZE = 8;
const RING_SIZE = 36;

/**
 * World-Class Atelier Custom Cursor:
 * - High-contrast dual-tone Sienna & Ivory dot that remains clearly visible on both light and dark backgrounds.
 * - Magnetic fluid trailing ring with dynamic interactive expansion on buttons, links, cards, and tabs.
 * - Automatic detection of interactive elements and graceful fallback for text inputs.
 * - Layered at z-index 99999 so it is never obstructed by grain overlays, sticky headers, or modals.
 * - Fully disabled on touch/coarse devices to preserve native mobile interactions.
 */
export function CursorEffect() {
  const { cursorVariant } = useUIStore();
  const { resolvedTheme } = useThemeStore();
  const enabled = cursorVariant !== 'hidden';

  const [isFinePointer, setIsFinePointer] = useState(false);
  const [hasPositioned, setHasPositioned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isOverInteractive, setIsOverInteractive] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, springs.gentle);
  const ringY = useSpring(y, springs.gentle);

  const hasPositionedRef = useRef(false);

  // Check for fine pointer support (mouse / trackpad)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mqFine = window.matchMedia('(pointer: fine)');
    const mqAnyFine = window.matchMedia('(any-pointer: fine)');

    const updatePointer = () => {
      const fine = mqFine.matches || mqAnyFine.matches || !window.matchMedia('(pointer: coarse)').matches;
      setIsFinePointer(fine);
    };

    updatePointer();
    mqFine.addEventListener?.('change', updatePointer);
    mqAnyFine.addEventListener?.('change', updatePointer);

    return () => {
      mqFine.removeEventListener?.('change', updatePointer);
      mqAnyFine.removeEventListener?.('change', updatePointer);
    };
  }, []);

  const handlePointerMove = useCallback((e: MouseEvent) => {
    // If we receive real mouse events, ensure fine pointer is active
    setIsFinePointer(true);

    x.set(e.clientX);
    y.set(e.clientY);

    if (!hasPositionedRef.current) {
      hasPositionedRef.current = true;
      setHasPositioned(true);
    }
    setIsVisible(true);

    // Auto-detect interactive elements
    const target = e.target as HTMLElement | null;
    if (target) {
      const isInput = !!target.closest('input, textarea, select, [contenteditable="true"]');
      setIsOverInput(isInput);

      const isClickable = !!target.closest(
        'a, button, [role="button"], [role="tab"], .pressable, .cursor-pointer, .card-lift, [data-interactive]'
      );
      setIsOverInteractive(isClickable);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  const handleTouchStart = useCallback(() => {
    // Hide custom cursor immediately on touch interaction
    setIsFinePointer(false);
    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [enabled, handlePointerMove, handleMouseLeave, handleMouseEnter, handleTouchStart]);

  // Manage body class for native cursor hiding
  const active = enabled && isFinePointer && hasPositioned && isVisible;

  useEffect(() => {
    if (!active) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }
    document.body.classList.add('custom-cursor-active');
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, [active]);

  if (!active || isOverInput) return null;

  const isDark = resolvedTheme === 'dark';
  const isHovered = isOverInteractive || cursorVariant === 'hover';

  const accentColor = isDark ? '#C86A3E' : '#A34824';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden"
      style={{ zIndex: 99999 }}
    >
      {/* Outer fluid trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          x: ringX,
          y: ringY,
          width: RING_SIZE,
          height: RING_SIZE,
          marginLeft: -RING_SIZE / 2,
          marginTop: -RING_SIZE / 2,
          border: `1.5px solid ${accentColor}`,
          backgroundColor: isHovered
            ? (isDark ? 'rgba(200, 106, 62, 0.2)' : 'rgba(163, 72, 36, 0.15)')
            : (isDark ? 'rgba(200, 106, 62, 0.06)' : 'rgba(163, 72, 36, 0.05)'),
          boxShadow: isHovered
            ? (isDark ? '0 0 24px rgba(200, 106, 62, 0.4), inset 0 0 12px rgba(200, 106, 62, 0.15)' : '0 0 20px rgba(163, 72, 36, 0.3), inset 0 0 10px rgba(163, 72, 36, 0.1)')
            : (isDark ? '0 0 12px rgba(200, 106, 62, 0.25)' : '0 0 8px rgba(163, 72, 36, 0.15)'),
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          borderColor: isHovered
            ? (isDark ? 'rgba(226, 138, 94, 0.95)' : 'rgba(163, 72, 36, 0.9)')
            : (isDark ? 'rgba(200, 106, 62, 0.75)' : 'rgba(163, 72, 36, 0.65)'),
        }}
        transition={springs.snappy}
      />

      {/* Center precision dot — high contrast sienna with theme-calibrated halo */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none rounded-full"
        style={{
          x,
          y,
          width: DOT_SIZE,
          height: DOT_SIZE,
          marginLeft: -DOT_SIZE / 2,
          marginTop: -DOT_SIZE / 2,
          backgroundColor: accentColor,
          boxShadow: isDark
            ? '0 0 0 1.5px rgba(12, 10, 9, 0.95), 0 0 8px rgba(200, 106, 62, 0.5)'
            : '0 0 0 1.5px rgba(244, 241, 234, 0.95), 0 2px 6px rgba(24, 20, 16, 0.4)',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovered ? 0.6 : 1,
        }}
        transition={springs.snappy}
      />
    </div>
  );
}
