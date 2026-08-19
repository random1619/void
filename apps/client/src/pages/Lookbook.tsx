import { useEffect, useLayoutEffect, useRef, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useSpring, useMotionValue, useTransform, useMotionValueEvent, animate, AnimatePresence } from 'framer-motion';
import { ArrowRight, MoveHorizontal, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE_LUXURY, EASE_EXIT } from '../lib/animations';
import { prefersReducedMotion } from '../lib/utils';
import { Image } from '../components/ui/Image';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────────────
   Lookbook — Edition IV: Dressed in Light, Cut in Shadow
   ─────────────────────────────────────────────────────────────────────────────
   A complete editorial lookbook experience built around four chapters
   of the VOID atelier's seasonal narrative.

   Sections:
     1. IMMERSIVE MASTHEAD — full-bleed cinematic hero with parallax,
        staggered type reveal, and ambient grain overlay
     2. EDITORIAL SPREADS — alternating L/R split compositions with
        scroll-triggered image reveals and detail lightbox
     3. MATERIAL ARCHIVE — gapless bento grid of craft & textile precision
     4. LOOK INDEX — Apple-physics drag gallery with momentum + buttons
     5. CHAPTER STACK — full-viewport sticky stacking chapters with
        GSAP ScrollTrigger scrub
     6. CLOSING CTA — the series resolves into action
   ──────────────────────────────────────────────────────────────────────────── */

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

const LOOKS = [
  {
    id: '01',
    image: '/lookbook_look_01_drape.jpg',
    detail: '/lookbook_look_01_drape.jpg',
    title: 'The Draped Hour',
    subtitle: 'Silk & Structure',
    season: 'Edition IV',
    caption: 'Bias-cut silk falling against architectural seams.',
    material: 'Mulberry Silk',
    productSlug: 'atelier-draped-shirt',
  },
  {
    id: '02',
    image: '/products/sculpted_wool_coat.png',
    detail: '/products/sculpted_wool_coat.png',
    title: 'Ivory Volume',
    subtitle: 'Wool & Weight',
    season: 'Edition IV',
    caption: 'Sculpted wool, cut to hold its own shape.',
    material: 'Virgin Wool',
    productSlug: 'architectural-overcoat',
  },
  {
    id: '03',
    image: '/products/canvas_field_jacket.png',
    detail: '/products/canvas_field_jacket.png',
    title: 'Soft Armor',
    subtitle: 'Leather & Line',
    season: 'Edition IV',
    caption: 'Full-grain leather, softened into a second skin.',
    material: 'Full-Grain Leather',
    productSlug: 'minimalist-leather-jacket',
  },
  {
    id: '04',
    image: '/products/cashmere_evening_gown.png',
    detail: '/products/cashmere_evening_gown.png',
    title: 'Quiet Storm',
    subtitle: 'Cashmere & Control',
    season: 'Edition IV',
    caption: 'Cloudweight cashmere under a precise shoulder.',
    material: 'Organic Cashmere',
    productSlug: 'cashmere-storm-coat',
  },
];

const CHAPTERS = [
  {
    numeral: 'I',
    title: 'Drape',
    line: 'Fabric that follows the body, never fights it.',
    essay: 'Every thread is chosen for its fall. We pattern on a moving form, not a static one. Each seam maps to the gesture it will serve.',
    image: '/lookbook_look_01_drape.jpg',
  },
  {
    numeral: 'II',
    title: 'Structure',
    line: 'Seams that make a silhouette hold its ground.',
    essay: 'Shoulder lines drawn with architectural calipers. Lapels pressed under seventeen kilos of steam. Construction you can hear in the way the coat hangs.',
    image: '/products/sculpted_wool_coat.png',
  },
  {
    numeral: 'III',
    title: 'Hide',
    line: 'Leather worked until it behaves like cloth.',
    essay: 'Vegetable-tanned for nine months. Hand-softened over a brass roller. The grain is a signature. Every hide tells its own biography.',
    image: '/products/canvas_field_jacket.png',
  },
  {
    numeral: 'IV',
    title: 'Weight',
    line: 'Heavy cloth, cut light: volume without mass.',
    essay: 'Dense Japanese merinos woven at the heritage Biella mills, then finished in micro-batches of fifty. The cloth drapes heavy; the garment lifts.',
    image: '/products/cashmere_evening_gown.png',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MASTHEAD                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function Masthead() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() === true;

  useLayoutEffect(() => {
    if (reducedMotion || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -6, scale: 1.08 },
        {
          yPercent: 10,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${targetId}`);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden flex flex-col justify-end"
      aria-labelledby="lookbook-masthead"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          ref={imageRef}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.08 }}
          transition={{ duration: 2, ease: EASE_LUXURY }}
          className="absolute inset-[-8%] will-change-transform"
        >
          <Image
            src="/lookbook_hero_wide.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        {/* Cinematic overlays with dark protection */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        {/* Film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Type layer */}
      <div className="relative z-20 container-void pt-32 pb-16 md:pb-24">
        {/* Headline — wide 2-line layout with inline typography image pill */}
        <motion.h1
          id="lookbook-masthead"
          initial={reducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LUXURY }}
          className="text-[clamp(2.5rem,6.5vw,5.75rem)] leading-[0.92] tracking-[-0.035em] font-bold max-w-6xl text-[#F4F1EA]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Dressed in <em className="italic font-normal text-sienna">Light</em>,
          <span
            className="inline-block w-14 sm:w-20 md:w-28 h-7 sm:h-9 md:h-12 rounded-full align-middle mx-2 sm:mx-3 bg-cover bg-center border border-white/30 shadow-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
            style={{ backgroundImage: "url('/lookbook_look_01_drape.jpg')" }}
            aria-hidden="true"
          />
          Cut in <em className="italic font-normal text-sienna">Shadow</em>
        </motion.h1>

        {/* Meta & CTA row */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE_FLUID }}
          className="mt-10 flex flex-wrap items-end justify-between gap-8 max-w-6xl"
        >
          <div className="space-y-6 max-w-[48ch]">
            <p className="text-white/80 text-base md:text-lg leading-relaxed font-light">
              Four chapters from the atelier: drape, structure, hide, and weight.
              A seasonal narrative photographed under single-source directional light.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#editorial-spreads"
                onClick={(e) => handleScrollTo(e, 'editorial-spreads')}
                className="btn-island-primary"
              >
                <span>Explore Looks</span>
                <span className="icon-pill">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
              <a
                href="#material-archive"
                onClick={(e) => handleScrollTo(e, 'material-archive')}
                className="btn-island-ghost !border-white/30 !text-[#F4F1EA] hover:!border-white hover:!bg-white/10"
              >
                <span>Material Archive</span>
              </a>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-8 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/15 shadow-xl">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1">Chapters</p>
              <p className="text-2xl text-[#F4F1EA] tabular-nums font-bold" style={{ fontFamily: 'var(--font-heading)' }}>IV</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1">Looks</p>
              <p className="text-2xl text-[#F4F1EA] tabular-nums font-bold" style={{ fontFamily: 'var(--font-heading)' }}>04</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50 mb-1">Editions</p>
              <p className="text-2xl text-sienna tabular-nums font-bold" style={{ fontFamily: 'var(--font-heading)' }}>50</p>
            </div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-14 flex items-center gap-3"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="w-px h-8 bg-gradient-to-b from-sienna to-transparent"
          />
          <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* EDITORIAL SPREADS — alternating image/text split compositions              */
/* ═══════════════════════════════════════════════════════════════════════════ */

const EditorialSpread = memo(function EditorialSpread({
  look,
  index,
  onOpenLightbox,
}: {
  look: typeof LOOKS[number];
  index: number;
  onOpenLightbox: (index: number) => void;
}) {
  const reducedMotion = useReducedMotion() === true;
  const isReversed = index % 2 === 1;
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const img = sectionRef.current?.querySelector('.spread-image');
      if (img) {
        gsap.fromTo(
          img,
          { scale: 1.12, filter: 'brightness(0.7) saturate(0.6)', clipPath: 'inset(0 0 10% 0)' },
          {
            scale: 1.0,
            filter: 'brightness(1.0) saturate(1.0)',
            clipPath: 'inset(0 0 0% 0)',
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 85%',
              end: 'center 40%',
              scrub: 0.8,
            },
          }
        );
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-0 md:min-h-[85dvh] flex items-center overflow-hidden border-b border-hairline/60"
    >
      <div className="container-void grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* Image side */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, x: isReversed ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.9, ease: EASE_LUXURY }}
          className={`relative ${
            isReversed
              ? 'md:col-span-6 md:col-start-7 md:order-2'
              : 'md:col-span-6 md:order-1'
          }`}
        >
          <motion.div
            whileTap={reducedMotion ? undefined : { scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative aspect-[3/4] md:aspect-[4/5] overflow-hidden rounded-2xl atelier-frame atelier-frame-hover cursor-pointer shadow-lg active:cursor-pointer"
            onClick={() => onOpenLightbox(index)}
          >
            <Image
              src={look.image}
              alt={look.title}
              loading="lazy"
              decoding="async"
              className="spread-image w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white font-bold">
                View detail
              </span>
              <span className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-md flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </span>
            </div>
            {/* Index badge */}
            <div className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md">
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white font-bold">
                Look {look.id}
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Text side */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE_LUXURY }}
          className={`flex flex-col justify-center ${
            isReversed
              ? 'md:col-span-5 md:col-start-1 md:order-1 md:pr-6'
              : 'md:col-span-5 md:col-start-8 md:order-2 md:pl-6'
          }`}
        >
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-sienna font-bold mb-3 inline-flex items-center gap-3">
            <span className="w-6 h-px bg-sienna" />
            {look.season} · {look.subtitle}
          </p>
          <h3
            className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.03em] font-bold text-ink mb-5"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {look.title}
          </h3>
          <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-[40ch] mb-6">
            {look.caption}
          </p>
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-block px-3 py-1.5 rounded-full border border-hairline bg-[var(--bone)]/40 font-mono text-[10px] tracking-[0.15em] uppercase text-ink-mute font-semibold">
              {look.material}
            </span>
            <span className="inline-block px-3 py-1.5 rounded-full border border-hairline bg-[var(--bone)]/40 font-mono text-[10px] tracking-[0.15em] uppercase text-ink-mute font-semibold">
              Limited 50
            </span>
          </div>
          <Link
            to={`/products/${look.productSlug}`}
            className="group inline-flex items-center gap-2.5 text-xs font-mono tracking-widest uppercase font-bold text-ink hover:text-sienna transition-colors focus-visible:outline-offset-2"
          >
            <span>Shop this look</span>
            <span className="w-7 h-7 rounded-full bg-ink/5 dark:bg-white/10 group-hover:bg-sienna group-hover:text-white flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════ */
/* LIGHTBOX — cinematic full-screen look viewer with directional navigation   */
/* ═══════════════════════════════════════════════════════════════════════════ */

const lightboxFolioVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 44 : dir < 0 ? -44 : 0,
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: EASE_LUXURY,
    },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -44 : dir < 0 ? 44 : 0,
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: EASE_EXIT,
    },
  }),
};

function Lightbox({
  looks,
  activeIndex,
  onClose,
  onNavigate,
}: {
  looks: typeof LOOKS;
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number, direction?: number) => void;
}) {
  const reducedMotion = useReducedMotion() === true;
  const [direction, setDirection] = useState(0);
  const look = looks[activeIndex];

  const handleStep = (targetIdx: number) => {
    const dir = targetIdx > activeIndex ? 1 : -1;
    setDirection(dir);
    onNavigate(targetIdx, dir);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && activeIndex < looks.length - 1) handleStep(activeIndex + 1);
      if (e.key === 'ArrowLeft' && activeIndex > 0) handleStep(activeIndex - 1);
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [activeIndex, looks.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE_FLUID }}
      className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 md:p-10"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="pressable absolute top-6 right-6 z-50 min-w-[44px] min-h-[44px] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-offset-2"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleStep(activeIndex - 1); }}
          className="pressable absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 min-w-[44px] min-h-[44px] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-offset-2"
          aria-label="Previous look"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {activeIndex < looks.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleStep(activeIndex + 1); }}
          className="pressable absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 min-w-[44px] min-h-[44px] w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-offset-2"
          aria-label="Next look"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Image and Folio Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={look.id}
          custom={direction}
          variants={reducedMotion ? undefined : lightboxFolioVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="relative max-w-[88vw] max-h-[88vh] md:max-w-[70vw] flex flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black/50">
            <Image
              src={look.detail}
              alt={look.title}
              className="max-w-full max-h-[68vh] object-contain mx-auto"
            />
          </div>
          {/* Caption bar */}
          <div className="mt-5 w-full flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-sienna font-bold mb-1">
                Look {look.id} · {look.season}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-[#F4F1EA]" style={{ fontFamily: 'var(--font-heading)' }}>
                {look.title}
              </h3>
              <p className="text-white/70 text-sm mt-0.5">{look.caption}</p>
            </div>
            <Link
              to={`/products/${look.productSlug}`}
              className="btn-island-primary shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Shop Look</span>
              <span className="icon-pill">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
          {/* Dot indicators */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {looks.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); handleStep(i); }}
                className={`min-w-[32px] min-h-[32px] flex items-center justify-center focus-visible:outline-offset-2`}
                aria-label={`Go to look ${i + 1}`}
              >
                <span
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? 'bg-sienna w-6'
                      : 'bg-white/30 hover:bg-white/60 w-2'
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* DRAG GALLERY                                                               */
/* ═══════════════════════════════════════════════════════════════════════════ */

const DECELERATION_RATE = 0.998;
const RUBBERBAND_CONSTANT = 0.55;

function project(velocity: number, decel = DECELERATION_RATE): number {
  return (velocity / 1000) * decel / (1 - decel);
}

function rubberband(overshoot: number, dimension: number): number {
  return (overshoot * dimension * RUBBERBAND_CONSTANT) /
    (dimension + RUBBERBAND_CONSTANT * Math.abs(overshoot));
}

function DragGallery({ onOpenLightbox }: { onOpenLightbox: (index: number) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() === true;

  const [bounds, setBounds] = useState({ min: 0, max: 0 });
  const [activeLookIndex, setActiveLookIndex] = useState(0);

  const dragX = useMotionValue(0);
  const displayX = useSpring(dragX, { stiffness: 900, damping: 55, mass: 0.4 });
  const progress = useTransform(displayX, [0, -bounds.max || -1], [0, 1]);

  useMotionValueEvent(progress, 'change', (p) => {
    const count = LOOKS.length;
    const clamped = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))));
    if (clamped !== activeLookIndex) {
      setActiveLookIndex(clamped);
    }
  });

  const historyRef = useRef<{ t: number; x: number; committed: boolean }[]>([]);
  const suppressClickRef = useRef(false);
  const didDragRef = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!viewport || !track) return;
      const max = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setBounds({ min: -max, max: 0 });
      dragX.set(Math.max(-max, Math.min(0, dragX.get())));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [dragX]);

  if (reducedMotion) {
    return (
      <div ref={viewportRef} className="overflow-x-auto pb-4 -mx-6 px-6 md:-mx-12 md:px-12">
        <div ref={trackRef} className="flex gap-6 w-max">
          {LOOKS.map((look, i) => (
            <figure key={look.id} className="w-[78vw] md:w-[44vw] lg:w-[36vw] shrink-0">
              <div
                className="atelier-frame aspect-[4/5] overflow-hidden rounded-lg cursor-pointer"
                onClick={() => onOpenLightbox(i)}
              >
                <Image src={look.image} alt={look.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
              </div>
              <figcaption className="mt-4 flex justify-between items-baseline">
                <span className="atelier-eyebrow text-ink-mute text-[10px]">Look {look.id}</span>
                <span className="font-display text-lg text-ink">{look.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    );
  }

  const springTo = (target: number, velocity: number) => {
    animate(dragX, target, {
      type: 'spring',
      stiffness: 260,
      damping: 30,
      mass: 0.9,
      velocity,
    });
  };

  const settle = (velocity: number) => {
    const current = dragX.get();
    const projected = current + project(velocity);
    const target = Math.max(bounds.min, Math.min(bounds.max, projected));
    springTo(target, velocity);
  };

  const settleHome = () => {
    const current = dragX.get();
    springTo(Math.max(bounds.min, Math.min(bounds.max, current)), 0);
  };

  const stepNext = () => {
    const step = (viewportRef.current?.clientWidth ?? 600) * 0.45;
    const next = Math.max(bounds.min, dragX.get() - step);
    springTo(next, 0);
  };

  const stepPrev = () => {
    const step = (viewportRef.current?.clientWidth ?? 600) * 0.45;
    const next = Math.min(bounds.max, dragX.get() + step);
    springTo(next, 0);
  };

  const onWindowMove = (e: PointerEvent) => {
    const history = historyRef.current;
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const dx = e.clientX - last.x;

    if (!last.committed && Math.abs(dx) < 10) return;
    if (!last.committed) {
      history.forEach((h) => (h.committed = true));
      didDragRef.current = true;
    }

    const raw = dragX.get() + dx;
    let next = raw;
    if (raw > bounds.max) next = bounds.max + rubberband(raw - bounds.max, viewportRef.current?.clientWidth ?? 800);
    else if (raw < bounds.min) next = bounds.min + rubberband(raw - bounds.min, viewportRef.current?.clientWidth ?? 800);
    dragX.set(next);

    history.push({ t: e.timeStamp, x: e.clientX, committed: true });
    while (history.length > 2 && history[1].t < e.timeStamp - 120) history.shift();
  };

  const endGesture = () => {
    const history = historyRef.current;
    historyRef.current = [];
    window.removeEventListener('pointermove', onWindowMove);

    if (didDragRef.current) suppressClickRef.current = true;
    didDragRef.current = false;

    if (history.length < 2) {
      settleHome();
      return;
    }
    const first = history[0];
    const last = history[history.length - 1];
    const dt = (last.t - first.t) / 1000;
    if (dt <= 0) return;
    const velocity = (last.x - first.x) / dt;
    settle(velocity);
  };

  const onWindowUp = () => endGesture();
  const onWindowCancel = () => endGesture();

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
    animate(dragX, dragX.get(), { duration: 0 });
    historyRef.current = [{ t: e.timeStamp, x: e.clientX, committed: false }];
    didDragRef.current = false;

    window.addEventListener('pointermove', onWindowMove);
    window.addEventListener('pointerup', onWindowUp, { once: true });
    window.addEventListener('pointercancel', onWindowCancel, { once: true });
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = 320;
    if (e.key === 'ArrowRight') {
      const next = Math.max(bounds.min, dragX.get() - step);
      springTo(next, 0);
    } else if (e.key === 'ArrowLeft') {
      const next = Math.min(bounds.max, dragX.get() + step);
      springTo(next, 0);
    }
  };

  return (
    <div
      ref={viewportRef}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y focus-visible:outline-2 focus-visible:outline-sienna rounded-2xl"
      onPointerDown={onPointerDown}
      onClickCapture={onClickCapture}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Lookbook gallery — drag or use arrow keys to explore"
      tabIndex={0}
    >
      <motion.div
        ref={trackRef}
        style={{ x: displayX }}
        className="flex gap-6 md:gap-8 w-max px-6 md:px-12 py-4"
      >
        {LOOKS.map((look, i) => (
          <figure key={look.id} className="group w-[78vw] md:w-[42vw] lg:w-[34vw] shrink-0">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl atelier-frame atelier-frame-hover cursor-pointer shadow-md"
              onClick={() => {
                if (!suppressClickRef.current) onOpenLightbox(i);
              }}
            >
              <Image
                src={look.image}
                alt={look.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Look number overlay */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-sm">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white font-bold">
                  {look.id}
                </span>
              </div>
              {/* View CTA */}
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 text-white font-mono text-[10px] tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-500 font-bold">
                View detail <Eye className="w-3.5 h-3.5" />
              </span>
            </div>
            <figcaption className="mt-4 space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute font-bold">
                  Look {look.id} — {look.season}
                </span>
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-sienna font-semibold">
                  {look.subtitle}
                </span>
              </div>
              <h3 className="text-xl text-ink font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {look.title}
              </h3>
              <p className="text-sm text-ink-soft max-w-[38ch]">{look.caption}</p>
            </figcaption>
          </figure>
        ))}

        {/* Closing card */}
        <Link
          to="/products"
          className="group flex w-[60vw] md:w-[28vw] shrink-0 items-center justify-center atelier-card atelier-card-hover rounded-2xl p-8"
        >
          <div className="text-center">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-sienna font-bold block mb-4">
              End of Lookbook
            </span>
            <span className="text-3xl text-ink mb-4 block group-hover:text-sienna transition-colors font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
              Shop the Series
            </span>
            <span className="btn-island-primary mt-2">
              <span>Open Catalog</span>
              <span className="icon-pill">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Progress rail & Quick Navigation Buttons */}
      <div className="mt-8 pb-2 flex items-center justify-between gap-4 text-ink-mute px-6 md:px-12">
        <div className="flex items-center gap-3">
          <MoveHorizontal className="w-4 h-4 shrink-0 text-sienna" aria-hidden="true" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase shrink-0 font-bold">Drag</span>
          <div className="relative h-1 w-36 sm:w-48 bg-hairline rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: progress }}
              className="absolute inset-0 origin-left bg-sienna rounded-full"
            />
          </div>
          {/* Dynamic Active Look Counter */}
          <div className="flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] uppercase shrink-0 tabular-nums font-bold">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeLookIndex}
                initial={{ y: 5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -5, opacity: 0 }}
                transition={{ duration: 0.15, ease: EASE_LUXURY }}
                className="text-sienna"
              >
                {String(activeLookIndex + 1).padStart(2, '0')}
              </motion.span>
            </AnimatePresence>
            <span className="text-ink-mute/50">/</span>
            <span className="text-ink-mute">{String(LOOKS.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Quick previous / next step buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={stepPrev}
            aria-label="Previous looks"
            className="pressable w-8 h-8 rounded-full border border-hairline hover:border-ink hover:bg-[var(--bone)] text-ink-mute hover:text-ink flex items-center justify-center transition-colors focus-visible:outline-offset-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={stepNext}
            aria-label="Next looks"
            className="pressable w-8 h-8 rounded-full border border-hairline hover:border-ink hover:bg-[var(--bone)] text-ink-mute hover:text-ink flex items-center justify-center transition-colors focus-visible:outline-offset-2"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* CHAPTER STACK — full-viewport sticky scroll-stacking chapters              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function ChapterStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion() === true;

  useLayoutEffect(() => {
    if (reducedMotion || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      CHAPTERS.forEach((_, i) => {
        if (i === 0) return;
        gsap.to(`.lookbook-chapter-${i}`, {
          yPercent: -100,
          ease: 'none',
          scrollTrigger: {
            trigger: `.lookbook-chapter-${i}`,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative border-y border-hairline" aria-label="The four chapters">
      {CHAPTERS.map((chapter, i) => (
        <motion.article
          key={chapter.numeral}
          style={{ zIndex: i + 1 }}
          className={`lookbook-chapter-${i} relative min-h-[100dvh] flex items-center overflow-hidden will-change-transform ${
            i === 0 ? 'atelier-bg' : 'atelier-bg-deep sticky top-0'
          }`}
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6, ease: EASE_LUXURY }}
        >
          {/* Full-bleed chapter image */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <motion.img
              src={chapter.image}
              alt=""
              loading="lazy"
              decoding="async"
              initial={reducedMotion ? false : { scale: 1.12, filter: 'brightness(0.8)' }}
              whileInView={{ scale: 1, filter: 'brightness(1.0)' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.8, ease: EASE_LUXURY }}
              className="w-full h-full object-cover opacity-45 dark:opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--ivory)] via-[rgba(var(--ivory-rgb),0.9)] via-45% to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--ivory)] via-transparent to-transparent opacity-50" />
          </div>

          {/* Chapter type */}
          <div className="relative z-10 container-void py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.22em] uppercase text-sienna font-bold mb-5 inline-flex items-center gap-3">
                <span className="w-6 h-px bg-sienna" />
                Chapter {chapter.numeral}
              </p>
              <h2
                className="text-[clamp(3rem,8vw,7rem)] leading-[0.88] tracking-[-0.035em] font-bold max-w-[8ch] text-ink"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {chapter.title}
              </h2>
              <p className="mt-6 text-ink-soft text-base md:text-lg max-w-[36ch] leading-relaxed">
                {chapter.line}
              </p>
              <Link
                to="/products"
                className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-sienna transition-colors group focus-visible:outline-offset-2"
              >
                Shop this chapter
                <ArrowRight className="w-4 h-4 text-sienna transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="hidden md:block">
              <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-[44ch] italic border-l-2 border-sienna/40 pl-6">
                "{chapter.essay}"
              </p>
            </div>
          </div>
        </motion.article>
      ))}

      {/* Closing CTA */}
      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.8, ease: EASE_LUXURY }}
        className="relative min-h-[60dvh] flex items-center justify-center bg-ink text-[#F4F1EA]"
      >
        <div className="text-center px-6 py-24">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-sienna font-bold mb-6">
            The Series, Complete
          </p>
          <h2
            className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-[-0.03em] font-bold max-w-[14ch] mx-auto text-[#F4F1EA]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Every chapter, <em className="text-sienna italic font-normal">now in the atelier</em>
          </h2>
          <p className="mt-6 text-[#F4F1EA]/70 max-w-[42ch] mx-auto text-base">
            The pieces from Edition IV are available in limited runs, each numbered and signed.
          </p>
          <Link to="/products" className="btn-island-inverse mt-10">
            <span>Shop the Series</span>
            <span className="icon-pill">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* MATERIAL ARCHIVE — Gapless Bento Grid of craft & textile precision         */
/* ═══════════════════════════════════════════════════════════════════════════ */

const MATERIAL_CARDS = [
  {
    title: 'Bias-Cut Mulberry Silk',
    spec: '19 Momme · Yokohama Spun',
    desc: 'Woven on heritage shuttle looms. Patterns are drafted on live movement models so the cloth drapes organically without tension.',
    image: '/lookbook_look_01_drape.jpg',
    badge: 'Drape Metric: 98.4%',
    span: 'col-span-12 lg:col-span-7',
    aspect: 'min-h-[360px] md:min-h-[420px]',
  },
  {
    title: 'Sculpted Biella Wool',
    spec: '540 GSM · Northern Italian Mills',
    desc: 'Dense double-faced virgin wool engineered to hold architectural silhouettes without structural horsehair canvas.',
    image: '/products/sculpted_wool_coat.png',
    badge: 'Thermal Caliber: High',
    span: 'col-span-12 lg:col-span-5',
    aspect: 'min-h-[360px] md:min-h-[420px]',
  },
  {
    title: 'Botanical Tanned Hide',
    spec: '9-Month Oak Bark Cure',
    desc: 'Treated with mimosa and chestnut extracts before manual brass-roller softening for supple, second-skin weight.',
    image: '/products/canvas_field_jacket.png',
    badge: 'Limited Edition 50',
    span: 'col-span-12 lg:col-span-5',
    aspect: 'min-h-[360px] md:min-h-[420px]',
  },
  {
    title: 'Architectural Caliper Seams',
    spec: '17kg Steam Calibration · Milan Atelier',
    desc: 'Every lapel and collar edge is pressed under calibrated steam presses, creating razor-sharp drop lines that never collapse.',
    image: '/products/cashmere_evening_gown.png',
    badge: 'Hand-Finished Seams',
    span: 'col-span-12 lg:col-span-7',
    aspect: 'min-h-[360px] md:min-h-[420px]',
  },
];

function MaterialBento() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="material-archive" className="section-gap border-b border-hairline relative" aria-label="The Material Archive">
      <div className="container-void">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
          >
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-sienna font-bold mb-3 inline-flex items-center gap-3">
              <span className="w-6 h-px bg-sienna" />
              The Textile Archive
            </p>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.03em] font-bold text-ink"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Engineered cloth, <em className="font-normal italic text-sienna">machined line</em>
            </h2>
          </motion.div>
          <p className="text-sm text-ink-mute max-w-[36ch] leading-relaxed font-light">
            Every millimeter of weave is calibrated for physical weight and fluid motion under direct light.
          </p>
        </div>

        {/* Gapless Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 grid-flow-dense">
          {MATERIAL_CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_LUXURY }}
              className={`${card.span} ${card.aspect} group relative rounded-3xl overflow-hidden atelier-card atelier-card-hover p-8 md:p-10 flex flex-col justify-between border border-hairline shadow-md`}
            >
              {/* Background image backdrop with dark overlay */}
              <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                <Image
                  src={card.image}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-25 dark:opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ivory)] via-[rgba(var(--ivory-rgb),0.88)] to-[rgba(var(--ivory-rgb),0.3)]" />
              </div>

              {/* Card top badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[var(--bone)]/80 border border-hairline font-mono text-[10px] tracking-[0.15em] uppercase text-ink font-semibold">
                  {card.spec}
                </span>
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-sienna font-bold">
                  {card.badge}
                </span>
              </div>

              {/* Card bottom text */}
              <div className="relative z-10 space-y-2 mt-20">
                <h3
                  className="text-2xl md:text-3xl font-bold text-ink group-hover:text-sienna transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {card.title}
                </h3>
                <p className="text-sm md:text-base text-ink-soft max-w-[42ch] leading-relaxed font-light">
                  {card.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* PAGE — orchestration                                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function Lookbook() {
  const reducedMotion = useReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigateLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <motion.main
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: EASE_LUXURY }}
      className="min-h-[100dvh] atelier-bg text-ink overflow-x-hidden w-full max-w-full"
    >
      <Masthead />

      {/* Editorial Spreads */}
      <section id="editorial-spreads" className="section-gap border-b border-hairline" aria-label="Editorial spreads">
        <div className="container-void mb-16">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_LUXURY }}
            className="flex flex-wrap items-end justify-between gap-6"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-sienna font-bold mb-3 inline-flex items-center gap-3">
                <span className="w-6 h-px bg-sienna" />
                The Editorial
              </p>
              <h2
                className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.03em] font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Four looks, one <em className="font-normal italic text-ink-soft">light</em>
              </h2>
            </div>
            <p className="text-sm text-ink-mute max-w-[36ch]">
              Each look photographed under a single directional source. Click any image to view the detail.
            </p>
          </motion.div>
        </div>

        {LOOKS.map((look, i) => (
          <EditorialSpread
            key={look.id}
            look={look}
            index={i}
            onOpenLightbox={openLightbox}
          />
        ))}
      </section>

      {/* Material Archive — Gapless Bento */}
      <MaterialBento />

      {/* Look index — drag gallery */}
      <section className="section-gap border-b border-hairline" aria-labelledby="look-index">
        <div className="container-void">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-sienna font-bold mb-3 inline-flex items-center gap-3">
                <span className="w-6 h-px bg-sienna" />
                The Plate
              </p>
              <h2
                id="look-index"
                className="text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.03em] font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                The full plate
              </h2>
            </div>
            <p className="text-sm text-ink-mute max-w-[32ch]">
              Drag through the plate or use navigation controls to explore.
            </p>
          </div>
          <DragGallery onOpenLightbox={openLightbox} />
        </div>
      </section>

      <ChapterStack />

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            looks={LOOKS}
            activeIndex={lightboxIndex}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
