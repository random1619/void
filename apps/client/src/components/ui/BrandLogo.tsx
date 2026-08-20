import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useReducedMotion, useTransform } from 'framer-motion';
import { useRef, useCallback } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  onClick?: () => void;
}

/**
 * VOID Atelier — Precision Geometric Monogram & Architectural Typography
 *
 * The emblem is a faceted prism frame housing an architectural 'V' aperture.
 * On hover the emblem rotates, reveals a warm sienna gradient core, and the
 * wordmark letters stagger-reveal with a kinetic spring.
 */
export function BrandLogo({
  className = '',
  size = 'md',
  showSubtext = true,
  onClick,
}: BrandLogoProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLAnchorElement>(null);

  /* ── Spring-driven interactive rotation ── */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { stiffness: 260, damping: 24, mass: 0.6 };
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-8, 8]), springConfig);
  const emblemScale = useSpring(1, { stiffness: 350, damping: 22 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (reducedMotion) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerX.set(nx);
      pointerY.set(ny);
    },
    [reducedMotion, pointerX, pointerY],
  );

  const handlePointerEnter = useCallback(() => {
    if (reducedMotion) return;
    emblemScale.set(1.06);
  }, [reducedMotion, emblemScale]);

  const handlePointerLeave = useCallback(() => {
    if (reducedMotion) return;
    pointerX.set(0);
    pointerY.set(0);
    emblemScale.set(1);
  }, [reducedMotion, pointerX, pointerY, emblemScale]);

  const sizeStyles = {
    sm: {
      emblem: 'w-6 h-6',
      text: 'text-[15px] tracking-[0.28em]',
      sub: 'text-[6.5px] tracking-[0.34em]',
      gap: 'gap-2',
      svgSize: 24,
    },
    md: {
      emblem: 'w-7 h-7 md:w-8 md:h-8',
      text: 'text-lg md:text-xl tracking-[0.3em]',
      sub: 'text-[7.5px] md:text-[8px] tracking-[0.38em]',
      gap: 'gap-2.5 md:gap-3',
      svgSize: 32,
    },
    lg: {
      emblem: 'w-9 h-9 md:w-10 md:h-10',
      text: 'text-2xl md:text-3xl tracking-[0.32em]',
      sub: 'text-[9px] md:text-[10px] tracking-[0.4em]',
      gap: 'gap-3.5',
      svgSize: 40,
    },
    xl: {
      emblem: 'w-11 h-11 md:w-14 md:h-14',
      text: 'text-3xl md:text-4xl tracking-[0.34em]',
      sub: 'text-[10px] md:text-[11px] tracking-[0.44em]',
      gap: 'gap-4',
      svgSize: 56,
    },
  }[size];

  return (
    <Link
      ref={containerRef}
      to="/"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group inline-flex items-center ${sizeStyles.gap} select-none focus-visible:outline-offset-4 ${className}`}
      aria-label="VOID Atelier Home"
    >
      {/* ── Precision Geometric Monogram Emblem ── */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          scale: emblemScale,
          perspective: 600,
          transformStyle: 'preserve-3d',
        }}
        className={`relative ${sizeStyles.emblem} shrink-0 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* Warm sienna → deep amber gradient for hover state */}
            <linearGradient id="void-warm" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="var(--sienna, #B8703F)" />
              <stop offset="100%" stopColor="var(--sienna, #B8703F)" stopOpacity="0.55" />
            </linearGradient>

            {/* Subtle radial glow behind the aperture */}
            <radialGradient id="void-glow" cx="50%" cy="50%" r="45%">
              <stop offset="0%" stopColor="var(--sienna, #B8703F)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--sienna, #B8703F)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background glow — appears on hover */}
          <circle
            cx="28"
            cy="28"
            r="24"
            fill="url(#void-glow)"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Outer frame — Precision octagonal prism */}
          <path
            d="M28 3L47.5 12.5L53 28L47.5 43.5L28 53L8.5 43.5L3 28L8.5 12.5Z"
            className="stroke-ink/80 dark:stroke-ivory/80 group-hover:stroke-sienna transition-colors duration-400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Inner frame — rotated square creating depth illusion */}
          <rect
            x="28"
            y="11"
            width="24"
            height="24"
            rx="1.5"
            transform="rotate(45 28 11)"
            className="stroke-ink/30 dark:stroke-ivory/30 group-hover:stroke-sienna/50 transition-colors duration-400"
            strokeWidth="1"
          />

          {/* Architectural V — the core 'VOID' aperture letterform */}
          <path
            d="M18 17L28 40L38 17"
            className="stroke-ink dark:stroke-ivory group-hover:stroke-sienna transition-colors duration-300"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Horizontal crossbar — precision engineering reference line */}
          <line
            x1="21"
            y1="24"
            x2="35"
            y2="24"
            className="stroke-ink/40 dark:stroke-ivory/40 group-hover:stroke-sienna/70 transition-colors duration-300"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Zenith dot — the keystone */}
          <circle
            cx="28"
            cy="14"
            r="2"
            className="fill-sienna opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />

          {/* Nadir dot — balancing counterweight */}
          <circle
            cx="28"
            cy="43"
            r="1.2"
            className="fill-ink/25 dark:fill-ivory/25 group-hover:fill-sienna/60 transition-colors duration-300"
          />
        </svg>
      </motion.div>

      {/* ── Architectural Typography Wordmark ── */}
      <div className="flex flex-col justify-center leading-none overflow-hidden">
        <div className="flex items-baseline gap-[0.08em]">
          {'VOID'.split('').map((letter, i) => (
            <span
              key={letter + i}
              className={`inline-block font-display font-black text-ink dark:text-ivory group-hover:text-sienna transition-colors ${sizeStyles.text} uppercase`}
              style={{
                fontFamily: 'var(--font-heading)',
                transitionDelay: `${i * 35}ms`,
                transitionDuration: '280ms',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {showSubtext && (
          <span
            className={`font-mono font-semibold uppercase text-ink-mute dark:text-ivory/50 group-hover:text-sienna group-hover:tracking-[0.5em] ${sizeStyles.sub} mt-0.5 transition-all duration-400`}
          >
            ATELIER
          </span>
        )}
      </div>
    </Link>
  );
}
