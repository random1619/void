import { useEffect, useLayoutEffect, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
  useVelocity,
  AnimatePresence,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight, Sparkles, Shield, Clock, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts, useNewArrivals } from '../hooks/useProducts';
import { CategoryShowcase } from '../components/home/CategoryShowcase';
import { EditorialSlider } from '../components/home/EditorialSlider';
import { AtelierHeritageShowcase } from '../components/home/AtelierHeritageShowcase';
import { AtelierServicesDrawer, type ServiceType } from '../components/home/AtelierServicesDrawer';
import { Testimonials } from '../components/home/Testimonials';
import { NewsletterCta } from '../components/home/NewsletterCta';
import { ProductCard } from '../components/product/ProductCard';
import { FluidGrid } from '../components/ui/FluidGrid';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSpringPress } from '../hooks/useSpringPress';
import { AnimatedHeading } from '../components/ui/AnimatedHeading';
import { ScrambleText } from '../components/ui/ScrambleText';
import { formatPrice } from '../lib/utils';
import { fadeUpVariants, staggerContainer } from '../lib/animations';
import type { Product } from '../types';
import { Image } from '../components/ui/Image';

gsap.registerPlugin(ScrollTrigger);

const ATELIER_SERVICES = [
  {
    type: 'styling' as const,
    title: 'Private Styling',
    detail: 'Bespoke one-on-one wardrobe curation from our atelier master tailors in Tokyo & Milan.',
    badge: 'Book Session',
  },
  {
    type: 'editions' as const,
    title: 'Numbered Editions',
    detail: 'Each garment is cut in strictly limited batches with cryptographic ledger serialization.',
    badge: 'Verify Serial',
  },
  {
    type: 'logistics' as const,
    title: 'Concierge Logistics',
    detail: 'Sub-48h door-to-wardrobe delivery with complimentary custom cedar garment cases.',
    badge: 'Global Courier',
  },
];

const MARQUEE_PHRASES = [
  'Hand-Finished',
  'Numbered Editions',
  'Sub-48h Delivery',
  'Organic Merino',
  'Concierge Service',
  'Atelier Cut',
  'Strictly 50 Pieces',
  'Ivory & Obsidian Series',
];

const GARMENT_CATEGORIES = [
  { id: 'all', label: 'All Releases' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'tailoring', label: 'Tailoring' },
  { id: 'watches', label: 'Horology' },
  { id: 'footwear', label: 'Footwear' },
];

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/* ─────────────────── Infinite Fluid Marquee (GPU Memoized) ─────────────────── */
const EditorialMarquee = memo(function EditorialMarquee() {
  const doubled = [...MARQUEE_PHRASES, ...MARQUEE_PHRASES];
  return (
    <section
      aria-label="Brand highlights"
      className="border-y border-hairline bg-[var(--ivory-deep)] overflow-hidden py-4 select-none"
    >
      <div className="marquee-track flex items-center">
        {doubled.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="flex items-center gap-5 px-6 whitespace-nowrap"
          >
            <span className="font-mono text-xs text-ink-mute tracking-[0.22em] uppercase font-bold">
              {phrase}
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-sienna/70 shrink-0"
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </section>
  );
});

/* ─────────────────── Magnetic CTA Button ─────────────────── */
function MagneticButton({
  children,
  href,
  variant = 'primary',
  className = '',
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'ghost' | 'inverse';
  className?: string;
}) {
  const magnetic = useMagnetic({ range: 12 });
  const press = useSpringPress({ scale: 0.96, stiffness: 400, damping: 25 });

  const baseClass =
    variant === 'primary'
      ? 'btn-island-primary group'
      : variant === 'inverse'
        ? 'btn-island-inverse group'
        : 'btn-island-ghost group';

  return (
    <motion.a
      ref={magnetic.ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      style={{ ...magnetic.style, ...press.style }}
      onPointerMove={(e) => {
        magnetic.onPointerMove(e);
      }}
      onPointerLeave={() => {
        magnetic.onPointerLeave();
        press.onPointerLeave?.();
      }}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      className={`${baseClass} ${className}`}
    >
      {children}
    </motion.a>
  );
}

/* ─────────────────── Dynamic Ambient Atmospheric Glow ─────────────────── */
function AmbientOrb() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 45, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 18 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set((e.clientX - window.innerWidth / 2) * 0.15);
      mouseY.set((e.clientY - window.innerHeight / 2) * 0.15);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      className="ambient-orb absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[640px] pointer-events-none z-0 opacity-75"
    />
  );
}

/* ─────────────────── Damped Scroll Hint ─────────────────── */
function ScrollHint({ reducedMotion }: { reducedMotion: boolean }) {
  const wheelY = useMotionValue(0);
  const rubberY = useSpring(wheelY, { stiffness: 280, damping: 22, mass: 0.6 });
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setVisible(true), 1400);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onWheel = (e: WheelEvent) => {
      if (window.scrollY > 24 || dismissed) return;
      const next = Math.min(30, Math.max(0, wheelY.get() + e.deltaY * 0.5));
      wheelY.set(next);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => wheelY.set(0), 420);
    };
    const onScroll = () => {
      if (window.scrollY > 24) setDismissed(true);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, [reducedMotion, dismissed, wheelY]);

  if (dismissed) return null;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
      transition={{ duration: 0.6, ease: EASE_FLUID }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 pointer-events-none z-10"
    >
      <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-ivory/70">
        Scroll
      </span>
      <span className="relative block w-px h-9 bg-white/20 overflow-hidden">
        <motion.span
          style={{ y: rubberY }}
          className="absolute left-1/2 -translate-x-1/2 top-0 w-1.5 h-1.5 rounded-full bg-sienna"
        />
      </span>
    </motion.div>
  );
}

/* ────────────────────── Skeleton Loader Card ──────────────────────── */
function SkeletonCard({ height = 'h-[360px]' }: { height?: string }) {
  return (
    <div className="bezel-outer animate-pulse">
      <div className={`bezel-inner p-4 ${height} bg-bone/40`} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* HeroSection — Full-bleed cinematic masthead with GSAP parallax       */
/* ─────────────────────────────────────────────────────────────────── */
function HeroSection({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reducedMotion) return;
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
      gsap.to('.home-hero-content', {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const headline = [
    { text: 'The' },
    { text: 'Atelier' },
    { text: 'of' },
    { text: 'Modern', em: true },
    { text: 'Dress.' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden flex flex-col justify-end pb-16 md:pb-24"
      aria-labelledby="home-hero"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          ref={imageRef}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1.08 }}
          transition={{ duration: 2, ease: [0.33, 1, 0.68, 1] }}
          className="absolute inset-[-8%] will-change-transform"
        >
          <Image
            src="/hero_atelier_flagship.jpg"
            alt=""
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,10,9,0.92)] via-[rgba(12,10,9,0.4)] to-[rgba(12,10,9,0.2)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(12,10,9,0.65)] via-transparent to-transparent" />
      </div>

      <div className="home-hero-content relative z-20 container-void">
        {/* Eyebrow with Live Atelier Archive Status */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE_FLUID }}
          className="mb-6 flex flex-wrap items-center gap-3"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/20 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-sienna animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-bold text-ivory">
              <ScrambleText text="Edition IV · 2026 Archive" speed={28} delay={500} />
            </span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[11px] text-ivory/60 uppercase tracking-widest">
            <Clock className="w-3 h-3 text-sienna" />
            Strictly 50 Ledger Pieces
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="home-hero"
          initial={reducedMotion ? undefined : 'hidden'}
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.055, delayChildren: 0.5 } },
          }}
          className="text-[clamp(2.5rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.04em] font-bold max-w-[14ch] text-ivory"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {headline.map((word, i) => (
            <span
              key={i}
              className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
            >
              <motion.span
                variants={{
                  hidden: { y: '115%', rotate: 2.5 },
                  visible: {
                    y: '0%',
                    rotate: 0,
                    transition: { duration: 0.7, ease: EASE_FLUID },
                  },
                }}
                className={`inline-block ${
                  word.em ? 'italic font-normal text-sienna' : ''
                }`}
              >
                {word.text}
              </motion.span>
              {i < headline.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </motion.h1>

        {/* Copy & CTAs */}
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: EASE_FLUID }}
          className="mt-8 max-w-[52ch]"
        >
          <p className="text-ivory/80 text-base md:text-lg leading-relaxed mb-8 font-light">
            Sculpted silhouettes, architectural tailoring, and precision
            horology for those who dress with deliberate intent. Cut in
            strictly limited, numbered editions.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton href="/new-arrivals" variant="primary">
              <span>Shop New Arrivals</span>
              <span className="icon-pill">
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </MagneticButton>
            <MagneticButton href="/collections" variant="ghost">
              <span className="text-ivory">Explore Lookbook</span>
              <span className="icon-pill !bg-white/10 !border-white/20 !text-ivory">
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Scroll Progress — thin sienna hairline that fills with scroll.       */
/* ─────────────────────────────────────────────────────────────────── */
function ScrollProgress({ reducedMotion }: { reducedMotion: boolean }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    mass: 0.6,
  });

  if (reducedMotion) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="home-progress"
      style={{ scaleX }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Living Proof — Apple-style velocity product rail & scrubbing counters*/
/* ─────────────────────────────────────────────────────────────────── */
function LivingProof({
  products,
  isLoading,
  reducedMotion,
}: {
  products: Product[];
  isLoading: boolean;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const scrollVelocity = useVelocity(scrollYProgress);
  const velocityClamped = useTransform(
    scrollVelocity,
    [-0.4, 0, 0.4],
    [-8, 0, 8]
  );
  const tiltX = useSpring(velocityClamped, { stiffness: 300, damping: 30, mass: 0.5 });

  const editions = useTransform(scrollYProgress, [0, 1], [12, 50]);
  const series = useTransform(scrollYProgress, [0, 1], [4, 24]);
  const ateliers = useTransform(scrollYProgress, [0, 1], [2, 6]);

  const editionsInt = useTransform(editions, (v) => Math.round(v));
  const seriesInt = useTransform(series, (v) => Math.round(v));
  const ateliersInt = useTransform(ateliers, (v) => Math.round(v));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const items = (products ?? []).slice(0, 4);
  if (items.length === 0) return null;

  return (
    <div ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
      {/* Copy column */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="lg:col-span-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-4">
          <Shield className="w-3.5 h-3.5 text-sienna" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-sienna font-bold">
            Guaranteed Rarity
          </span>
        </div>
        <AnimatedHeading
          level={2}
          text="Numbered, not _mass-produced_."
          className="atelier-display text-[clamp(28px,3.4vw,44px)] leading-[1.02]"
        />
        <motion.p
          variants={fadeUpVariants}
          className="mt-5 text-ink-soft leading-relaxed max-w-sm font-light"
        >
          Every piece carries an indelible ledger entry. The editions below are cut in
          strictly limited micro-batches of fifty. When they are archived, they are gone.
        </motion.p>

        {/* Scrubbing stat counters */}
        <motion.div
          variants={fadeUpVariants}
          className="mt-10 grid grid-cols-3 gap-6 border-t border-hairline pt-6"
        >
          {[
            { label: 'Numbered Editions', value: editionsInt },
            { label: 'Seasonal Series', value: seriesInt },
            { label: 'Atelier Maisons', value: ateliersInt },
          ].map((stat) => (
            <div key={stat.label}>
              <span
                className="block font-display text-3xl md:text-4xl font-bold text-ink tabular-nums"
              >
                {reducedMotion ? (
                  '50'
                ) : (
                  <motion.span>{stat.value}</motion.span>
                )}
              </span>
              <span className="mt-1 block atelier-eyebrow text-[10px] text-ink-mute">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Product rail — velocity-reactive */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
      >
        {items.map((p, idx) => (
          <motion.div
            key={p._id}
            variants={fadeUpVariants}
            className={`relative group ${idx === 0 ? 'col-span-2 md:col-span-2 md:row-span-1' : ''}`}
          >
            <motion.div
              style={reducedMotion ? undefined : { rotateX: tiltX }}
              className="bezel-outer h-full"
            >
              <div className="bezel-inner p-3 h-full">
                <Link
                  to={`/products/${p.slug}`}
                  className="block relative aspect-[3/4] overflow-hidden rounded-xl bg-bone"
                  aria-label={`${p.name} by ${p.brand}`}
                >
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0].url}
                      alt={p.images[0].alt || p.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover img-editorial transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--bone)]">
                      <span className="font-display text-4xl text-ink-mute/30">V</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="truncate font-display text-sm text-ink font-bold">
                    {p.name}
                  </span>
                  <span className="shrink-0 font-mono text-xs text-sienna font-bold">
                    {formatPrice(p.price)}
                  </span>
                </div>
                <p className="atelier-eyebrow text-[10px] text-ink-mute mt-0.5">
                  {p.brand}
                </p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Atelier Pillars — Interactive trigger cards                          */
/* ─────────────────────────────────────────────────────────────────── */
function AtelierPillars({
  reducedMotion,
  onSelectService,
}: {
  reducedMotion: boolean;
  onSelectService: (service: ServiceType) => void;
}) {
  return (
    <section
      aria-label="Atelier services"
      className="border-b border-hairline bg-[var(--ivory-deep)] section-gap-sm"
    >
      <div className="container-void">
        <ul className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-hairline">
          {ATELIER_SERVICES.map((s, idx) => (
            <motion.li
              key={s.title}
              initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.06, ease: EASE_FLUID }}
              className="py-6 md:py-2 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-display text-lg md:text-xl font-bold text-ink mb-2">
                  {s.title}
                </h3>
                <p className="text-xs md:text-sm text-ink-soft leading-relaxed font-light mb-4">
                  {s.detail}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectService(s.type)}
                className="w-fit text-sienna hover:text-ink font-mono text-xs uppercase tracking-widest font-bold inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>{s.badge}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Featured Garments — with Interactive Category Filter                 */
/* ─────────────────────────────────────────────────────────────────── */
function FeaturedGarments({
  featured,
  isFeaturedLoading,
  reducedMotion: _reducedMotion,
}: {
  featured: Product[];
  isFeaturedLoading: boolean;
  reducedMotion: boolean;
}) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = (featured ?? []).filter((p) => {
    if (activeCategory === 'all') return true;
    const catStr = typeof p.category === 'string'
      ? p.category
      : (p.category?.name || p.category?.slug || '');
    const combined = `${catStr} ${p.name} ${p.description || ''}`.toLowerCase();
    
    if (activeCategory === 'outerwear') return combined.includes('outerwear') || combined.includes('jacket') || combined.includes('coat') || combined.includes('trench');
    if (activeCategory === 'tailoring') return combined.includes('tailor') || combined.includes('suit') || combined.includes('blazer') || combined.includes('trouser') || combined.includes('pant') || combined.includes('shirt');
    if (activeCategory === 'watches') return combined.includes('watch') || combined.includes('horology') || combined.includes('timepiece') || combined.includes('chrono');
    if (activeCategory === 'footwear') return combined.includes('footwear') || combined.includes('boot') || combined.includes('shoe') || combined.includes('sneaker');
    return true;
  });

  return (
    <section aria-labelledby="featured-heading" className="section-gap">
      <div className="container-void">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sienna" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sienna font-bold">
                Curated Selection
              </span>
            </div>
            <AnimatedHeading
              id="featured-heading"
              text="Featured _Garments_"
              variant="tracking"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
            />
          </div>
          <MagneticButton href="/products" variant="ghost">
            <span>Shop All Products</span>
            <span className="icon-pill">
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </MagneticButton>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {GARMENT_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200 shrink-0 ${
                  isSelected ? 'text-white' : 'text-ink-mute hover:text-ink bg-bone/40'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="garment-filter-pill"
                    className="absolute inset-0 bg-ink rounded-full -z-0"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <FluidGrid stagger={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {(filteredProducts.length > 0 ? filteredProducts : (featured ?? [])).slice(0, 6).map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </FluidGrid>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* New Arrivals — compact rail                                          */
/* ─────────────────────────────────────────────────────────────────── */
function NewArrivalsSection({
  arrivals,
  isArrivalsLoading,
  reducedMotion,
}: {
  arrivals: Product[];
  isArrivalsLoading: boolean;
  reducedMotion: boolean;
}) {
  return (
    <section
      aria-labelledby="arrivals-heading"
      className="section-gap border-t border-hairline"
    >
      <div className="container-void">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sienna/10 border border-sienna/20 mb-3">
              <Compass className="w-3.5 h-3.5 text-sienna" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-sienna font-bold">
                Direct Atelier Pattern Room
              </span>
            </div>
            <AnimatedHeading
              id="arrivals-heading"
              text="New _Arrivals_"
              variant="tracking"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink"
            />
          </div>
          <MagneticButton href="/new-arrivals" variant="ghost">
            <span>View All Arrivals</span>
            <span className="icon-pill">
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </MagneticButton>
        </div>

        {isArrivalsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i} height="h-[300px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(arrivals ?? []).slice(0, 8).map((p, idx) => (
              <motion.div
                key={p._id}
                initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: idx * 0.04,
                  ease: EASE_FLUID,
                }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const reducedMotion = useReducedMotion();
  const { data: featured, isLoading: isFeaturedLoading } = useFeaturedProducts();
  const { data: arrivals, isLoading: isArrivalsLoading } = useNewArrivals();
  const [activeService, setActiveService] = useState<ServiceType>(null);

  return (
    <main className="atelier-bg text-ink antialiased overflow-x-hidden w-full max-w-full relative">
      <AmbientOrb />
      <ScrollProgress reducedMotion={!!reducedMotion} />

      {/* 1. CINEMATIC HERO */}
      <HeroSection reducedMotion={!!reducedMotion} />
      <ScrollHint reducedMotion={!!reducedMotion} />

      {/* 2. INFINITE MARQUEE STRIP */}
      <EditorialMarquee />

      {/* 3. RUNWAY & CAPSULE SHOWCASE SLIDER */}
      <EditorialSlider />

      {/* 4. LIVING PROOF (VELOCITY-REACTIVE PRODUCT RAIL + STATS COUNTER) */}
      <section
        aria-labelledby="proof-heading"
        className="section-gap border-b border-hairline"
      >
        <div className="container-void">
          <LivingProof
            products={featured ?? []}
            isLoading={isFeaturedLoading}
            reducedMotion={!!reducedMotion}
          />
        </div>
      </section>

      {/* 5. GAPLESS BENTO SHOWCASE */}
      <CategoryShowcase />

      {/* 6. FEATURED GARMENTS (WITH INTERACTIVE CATEGORY FILTER) */}
      <FeaturedGarments
        featured={featured ?? []}
        isFeaturedLoading={isFeaturedLoading}
        reducedMotion={!!reducedMotion}
      />

      {/* 7. ANATOMY OF CRAFT (HERITAGE 4-PILLAR TIMELINE) */}
      <AtelierHeritageShowcase />

      {/* 8. NEW ARRIVALS */}
      <NewArrivalsSection
        arrivals={arrivals ?? []}
        isArrivalsLoading={isArrivalsLoading}
        reducedMotion={!!reducedMotion}
      />

      {/* 9. TESTIMONIALS & PRESS ACCOLADES */}
      <Testimonials />

      {/* 10. ATELIER PILLARS & CONCIERGE TRIGGER */}
      <AtelierPillars
        reducedMotion={!!reducedMotion}
        onSelectService={(service) => setActiveService(service)}
      />

      {/* 11. NEWSLETTER CTA */}
      <NewsletterCta />

      {/* INTERACTIVE SERVICES CONCIERGE DRAWER */}
      <AtelierServicesDrawer
        service={activeService}
        onClose={() => setActiveService(null)}
      />
    </main>
  );
}
