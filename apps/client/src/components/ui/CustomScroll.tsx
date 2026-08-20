import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { getLenis } from '../../hooks/useLenis';

export function CustomScroll() {
  const reducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 30,
    mass: 0.5,
  });

  // All hook transformations declared strictly at top-level
  const percentage = useTransform(smoothProgress, (value) => `${Math.round(value * 100)}%`);
  const fillHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const thumbTop = useTransform(smoothProgress, [0, 1], ['0%', 'calc(100% - 14px)']);

  useEffect(() => {
    const checkScrollable = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      setIsScrollable(scrollHeight > clientHeight + 100);
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    const observer = new MutationObserver(checkScrollable);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkScrollable);
      observer.disconnect();
    };
  }, []);

  const scrollToPosition = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const targetProgress = relativeY / rect.height;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = targetProgress * maxScroll;

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(targetY, { duration: 1.0 });
    } else {
      window.scrollTo({
        top: targetY,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    scrollToPosition(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    scrollToPosition(e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  };

  return (
    <div
      style={{
        opacity: isScrollable ? 1 : 0,
        pointerEvents: isScrollable ? 'auto' : 'none',
      }}
      className="fixed right-3 md:right-4 top-1/2 -translate-y-1/2 z-[99] hidden sm:flex flex-col items-center select-none transition-opacity duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsHovered(false);
      }}
    >
      {/* Percentage Tooltip on Hover */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: isHovered || isDragging ? 1 : 0, x: isHovered || isDragging ? 0 : 8 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none mb-3 px-2 py-0.5 rounded-md bg-ink text-ivory dark:bg-ivory dark:text-ink font-mono text-[9px] uppercase tracking-widest font-bold shadow-lg"
      >
        <motion.span>{percentage}</motion.span>
      </motion.div>

      {/* Floating Scroll Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`relative w-1.5 md:w-2 h-44 md:h-56 rounded-full cursor-pointer transition-all duration-300 ${
          isHovered || isDragging
            ? 'w-2.5 md:w-3 bg-hairline/80 backdrop-blur-md shadow-sm'
            : 'bg-hairline/40'
        }`}
        role="scrollbar"
        aria-label="Custom Page Scroll"
        aria-valuenow={Math.round(scrollYProgress.get() * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Active Progress Fill */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-sienna/60 rounded-full"
          style={{ height: fillHeight }}
        />

        {/* Sienna Scrubbing Thumb */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-sienna border-2 border-ivory dark:border-ink shadow-md transition-transform duration-150 active:scale-125"
          style={{ top: thumbTop }}
        />
      </div>

      {/* Scroll indicator label */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered || isDragging ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="pointer-events-none mt-2 font-mono text-[8px] tracking-[0.25em] uppercase text-ink-mute font-bold"
      >
        Scroll
      </motion.span>
    </div>
  );
}
