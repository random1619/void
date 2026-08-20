/**
 * Watches — Configurator-First rebuild.
 *
 * THESIS: The watch page is a configurator, not a gallery. The visitor's first
 * act is choosing their watch — finish, strap, and price are live from the
 * first viewport. The category-default arrangement (hero image → spec cards →
 * catalog) is refused.
 *
 * OWN-WORLD: Ivory Atelier — warm ivory ground, ink typography, burnt-sienna
 * accent, hairline rules, sharp frames. Cabinet Grotesk display, Satoshi body,
 * Geist Mono metadata.
 *
 * STORY: The visitor arrives, sees the watch as a configurable object, chooses
 * finish and strap, watches the price update live, then scrolls into the
 * movement's engineering, the heritage lineage, and the full catalog. They
 * acquire.
 *
 * FIRST VIEWPORT: Full-height configurator. Left: the watch image, large, with
 * finish swatches. Right: configuration panel — finish, strap, live price,
 * acquire. The image and panel are the hero.
 *
 * FORM: Configurator-First, candidate 5 of 7 grounded structures.
 * Seed key d4722df3.
 *
 * FINISH: unreviewed and undocumented is unfinished; this build ends with the
 * finish review, the verdict, and DESIGN.md.
 *
 * Motion: Apple Designing Fluid Interfaces — springs over fixed durations,
 * interruptible reveals, critically damped defaults, velocity handoff. GSAP
 * reserved for scroll pinning and parallax. Framer Motion for component state.
 * Reduced motion removes parallax and positional movement, preserves opacity.
 */

import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
  animate,
  MotionConfig,
} from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  ShoppingBag,
  Sliders,
  Gauge,
  ShieldCheck,
  Droplets,
  Gem,
  Clock,
  Compass,
  Star,
  Check,
  RotateCcw,
  Heart,
  Eye,
  Cpu,
} from 'lucide-react';
import { WatchSpecDrawer } from '../components/watch/WatchSpecDrawer';
import { WatchHeritageTimeline } from '../components/watch/WatchHeritageTimeline';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { springs } from '../lib/motion-tokens';
import { toast } from 'sonner';
import { Image } from '../components/ui/Image';

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────── */
/* Data                                                                */
/* ─────────────────────────────────────────────────────────────────── */

interface WatchColorway {
  id: string;
  name: string;
  hex: string;
  heroImage: string;
  detailImage: string;
  badge: string;
  description: string;
}

const COLORWAYS: WatchColorway[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Titanium',
    hex: '#0A0A0A',
    heroImage: '/products/obsidian_titanium_hero.png',
    detailImage: '/products/obsidian_titanium_detail.png',
    badge: 'Flagship Edition',
    description:
      'A stealth ceramic-titanium monolith with 18K gold indices and a lacquered abyss dial.',
  },
  {
    id: 'platinum',
    name: 'Platinum Silver',
    hex: '#E2E8F0',
    heroImage: '/products/platinum_silver_hero.png',
    detailImage: '/products/platinum_silver_detail.png',
    badge: 'Polished 950 Platinum',
    description:
      'Brushed 950 platinum with an ice-blue Super-LumiNova chapter ring and anthracite dial.',
  },
  {
    id: 'rosegold',
    name: '18K Rose Gold',
    hex: '#B87333',
    heroImage: '/products/rose_gold_hero.png',
    detailImage: '/products/rose_gold_detail.png',
    badge: '18K Warm Alloy',
    description:
      'Warm 18K rose gold casing with a chocolate sunburst dial and champagne indices.',
  },
];

const WATCH_CATALOG: Product[] = [
  {
    _id: 'prod_watch_01',
    name: 'VOID Monolith Caliber V-01',
    slug: 'void-monolith-v01',
    description:
      'Obsidian ceramic-titanium timepiece with kinetic energy recovery system and 72-hour power reserve.',
    brand: 'VOID',
    category: { _id: 'cat_watch', name: 'Horological Monolith', slug: 'watches', active: true },
    price: 4850,
    comparePrice: 5500,
    sku: 'VD-WTCH-001',
    images: [{ url: COLORWAYS[0].heroImage, alt: 'VOID Monolith Caliber V-01' }],
    colorways: [{ name: 'Obsidian Black', hex: '#0A0A0A', images: [] }],
    sizes: [{ label: '42mm', stock: 5 }],
    materials: ['Ceramic-Titanium', 'Sapphire Crystal'],
    tags: ['watch', 'luxury', 'monolith'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 5.0,
    reviewCount: 28,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_watch_02',
    name: 'VOID Chrono Spectre',
    slug: 'void-chrono-spectre',
    description:
      'Forged carbon chronograph with high-frequency 36,000 vph escape wheel and tachymeter bezel.',
    brand: 'VOID',
    category: { _id: 'cat_watch', name: 'Horological Monolith', slug: 'watches', active: true },
    price: 5400,
    comparePrice: 6200,
    sku: 'VD-WTCH-002',
    images: [{ url: COLORWAYS[1].heroImage, alt: 'VOID Chrono Spectre' }],
    colorways: [{ name: 'Forged Carbon', hex: '#1C1C1E', images: [] }],
    sizes: [{ label: '44mm', stock: 3 }],
    materials: ['Forged Carbon', 'Titanium'],
    tags: ['watch', 'chronograph'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 4.9,
    reviewCount: 19,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_watch_03',
    name: 'VOID Solar Monolith',
    slug: 'void-solar-monolith',
    description:
      'Photovoltaic dial architecture harvesting light energy into perpetual precision horology.',
    brand: 'VOID',
    category: { _id: 'cat_watch', name: 'Horological Monolith', slug: 'watches', active: true },
    price: 4200,
    comparePrice: 4800,
    sku: 'VD-WTCH-003',
    images: [{ url: COLORWAYS[2].heroImage, alt: 'VOID Solar Monolith' }],
    colorways: [{ name: 'Solar Obsidian', hex: '#0F172A', images: [] }],
    sizes: [{ label: '40mm', stock: 7 }],
    materials: ['Photovoltaic Glass', 'Grade 5 Titanium'],
    tags: ['watch', 'solar'],
    featured: false,
    isNew: false,
    onSale: true,
    avgRating: 4.8,
    reviewCount: 14,
    createdAt: new Date().toISOString(),
  },
];

const STRAP_OPTIONS = [
  { id: 'titanium', name: 'Titanium Link Bracelet', priceModifier: 0 },
  { id: 'leather', name: 'Horween Leather Strap', priceModifier: 150 },
  { id: 'rubber', name: 'Tactical FKM Rubber', priceModifier: -100 },
];

const SPEC_ROWS = [
  { icon: Gauge, label: 'Frequency', value: '28,800', unit: 'vph', sub: '4 Hz precision' },
  { icon: Clock, label: 'Power Reserve', value: '72', unit: 'h', sub: 'Kinetic recovery' },
  { icon: ShieldCheck, label: 'Crystal', value: 'Sapphire', unit: '', sub: '9 Mohs hardness' },
  { icon: Droplets, label: 'Water Resistance', value: '100', unit: 'm', sub: '10 ATM rated' },
  { icon: Gem, label: 'Jewels', value: '27', unit: 'rubies', sub: 'Synthetic corundum' },
  { icon: Compass, label: 'Case', value: '42', unit: 'mm', sub: 'Grade 5 titanium' },
];

const MOVEMENT_LAYERS = [
  {
    index: '01',
    title: 'Sapphire Crystal',
    subtitle: 'Dual AR-Coated Shield',
    text: 'Synthetic corundum with a Mohs hardness of 9. Anti-reflective on both surfaces for zero-glare clarity in any light.',
    icon: Eye,
  },
  {
    index: '02',
    title: 'Octagonal Bezel',
    subtitle: 'Ceramic-Titanium Ring',
    text: 'Eight exposed titanium screws anchor the 60–500 tachymeter scale. Hand-polished bevels catch light at every angle.',
    icon: ShieldCheck,
  },
  {
    index: '03',
    title: 'Skeleton Dial',
    subtitle: 'Chronograph Trio',
    text: 'Laser-cut carbon dial exposing the kinetic inner heart, with three working sub-dials and Super-LumiNova indices.',
    icon: Compass,
  },
  {
    index: '04',
    title: 'Caliber V-01',
    subtitle: 'In-House Automatic',
    text: '27 ruby jewels, Geneva-striped bridges, perlage mainplate, and a kinetic rotor with 72-hour power reserve.',
    icon: Cpu,
  },
];

/* ─────────────────────────────────────────────────────────────────── */
/* Helpers                                                             */
/* ─────────────────────────────────────────────────────────────────── */

/** Count-up number that animates once when scrolled into view. */
function Counter({
  value,
  className,
  format,
}: {
  value: number;
  className?: string;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    format ? format(Math.round(v)) : Math.round(v).toLocaleString()
  );
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, value, mv]);
  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}

/** Thin sienna scroll-progress hairline. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-px bg-sienna z-[55] origin-left"
      aria-hidden="true"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Page                                                                */
/* ─────────────────────────────────────────────────────────────────── */

export default function Watch() {
  const [selectedColorway, setSelectedColorway] = useState<WatchColorway>(COLORWAYS[0]);
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0]);
  const [openLayer, setOpenLayer] = useState('01');
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const primaryProduct = WATCH_CATALOG[0];
  const configuredPrice = primaryProduct.price + selectedStrap.priceModifier;

  /* GSAP: parallax on the configurator image, pin on the movement section. */
  const configuratorRef = useRef<HTMLElement>(null);
  const configImageRef = useRef<HTMLDivElement>(null);
  const movementRef = useRef<HTMLElement>(null);
  const movementImageRef = useRef<HTMLDivElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      /* Configurator image: gentle parallax as the section scrolls away. */
      gsap.fromTo(
        configImageRef.current,
        { yPercent: -4, scale: 1.04 },
        {
          yPercent: 6,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: configuratorRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
      /* Movement section: pin the macro image while layers scroll past. */
      gsap.to(movementImageRef.current, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: movementRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, configuratorRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const handleAcquire = (product: Product = primaryProduct) => {
    addItem(
      product,
      { name: selectedColorway.name, hex: selectedColorway.hex, images: [] },
      '42mm',
      1,
      product._id === primaryProduct._id ? configuredPrice : product.price
    );
    toast.success(`${product.name} added to cart`);
    openCart();
  };

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
        {/* ══════════════════════════════════════════════════════════
            1. CONFIGURATOR HERO — the page opens as the configurator
           ══════════════════════════════════════════════════════════ */}
        <section
          ref={configuratorRef}
          className="relative min-h-[100dvh] flex items-center pt-28 pb-16"
          aria-label="Configure your timepiece"
        >
          {/* Hairline frame */}
          <div
            className="pointer-events-none absolute inset-3 md:inset-5 border border-hairline"
            aria-hidden="true"
          />

          <div className="container-void relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* LEFT: Watch image + finish swatches */}
              <div className="lg:col-span-7 order-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="relative"
                >
                  <div
                    ref={configImageRef}
                    className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-square atelier-frame overflow-hidden bg-bone img-grain"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={selectedColorway.id}
                        src={selectedColorway.heroImage}
                        alt={`VOID Monolith in ${selectedColorway.name}`}
                        loading="eager"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.04 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </AnimatePresence>

                    {/* Finish badge */}
                    <div className="absolute top-5 left-5 bg-ivory/85 backdrop-blur-md px-3.5 py-2 border border-hairline atelier-eyebrow text-ink flex items-center gap-2">
                      <span
                        className="inline-block w-2.5 h-2.5 rounded-full border border-ink/20"
                        style={{ backgroundColor: selectedColorway.hex }}
                        aria-hidden="true"
                      />
                      {selectedColorway.badge}
                    </div>
                  </div>
                </motion.div>

                {/* Finish swatches below the image */}
                <div className="mt-6">
                  <span className="atelier-eyebrow text-ink-mute block mb-4">
                    Finish · {selectedColorway.name}
                  </span>
                  <div className="flex gap-3" role="radiogroup" aria-label="Case finish">
                    {COLORWAYS.map((cw) => {
                      const isSelected = selectedColorway.id === cw.id;
                      return (
                        <button
                          key={cw.id}
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => setSelectedColorway(cw)}
                          title={cw.name}
                          aria-label={`Select ${cw.name}`}
                          className={`pressable relative w-11 h-11 flex items-center justify-center border transition-colors duration-300 ${
                            isSelected ? 'border-ink' : 'border-hairline hover:border-ink-soft'
                          }`}
                        >
                          <motion.span
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                            className="block w-6 h-6"
                            style={{ backgroundColor: cw.hex }}
                            aria-hidden="true"
                          />
                          {isSelected && (
                            <Check
                              className="absolute w-3.5 h-3.5 text-ivory drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={selectedColorway.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-4 text-xs text-ink-mute font-light leading-relaxed max-w-sm"
                    >
                      {selectedColorway.description}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: Configuration panel */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...springs.gentle, delay: 0.15 }}
                className="lg:col-span-5 flex flex-col items-start justify-center order-2"
              >
                <h1 className="atelier-display atelier-display-xl mb-6">
                  Time,
                  <br />
                  <em>Measured in Stone.</em>
                </h1>

                <p className="text-ink-soft text-sm md:text-base max-w-md mb-10 font-light leading-relaxed">
                  An architectural statement carved from proprietary{' '}
                  {selectedColorway.name.toLowerCase()}, governed by the in-house Caliber V-01
                  automatic movement with a 72-hour power reserve.
                </p>

                {/* Strap selector */}
                <fieldset className="w-full border border-hairline p-5 bg-ivory mb-8">
                  <legend className="atelier-eyebrow text-sienna px-3 -ml-3 atelier-bg">
                    Strap Architecture
                  </legend>
                  <div className="space-y-2">
                    {STRAP_OPTIONS.map((strap) => {
                      const isSelected = selectedStrap.id === strap.id;
                      return (
                        <button
                          key={strap.id}
                          onClick={() => setSelectedStrap(strap)}
                          aria-pressed={isSelected}
                          className={`pressable w-full p-4 min-h-[44px] border flex justify-between items-center gap-4 transition-colors duration-300 ${
                            isSelected
                              ? 'border-ink bg-ivory-deep text-ink'
                              : 'border-hairline text-ink-soft hover:text-ink hover:border-ink-soft bg-transparent'
                          }`}
                        >
                          <span className="font-display text-base">{strap.name}</span>
                          <span className="font-mono text-xs text-sienna whitespace-nowrap">
                            {strap.priceModifier > 0
                              ? `+$${strap.priceModifier}`
                              : strap.priceModifier < 0
                              ? `−$${Math.abs(strap.priceModifier)}`
                              : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Live price + CTAs */}
                <div className="w-full border border-ink bg-ivory p-5 flex flex-col gap-5 mb-8">
                  <div className="flex justify-between items-baseline gap-4 border-b border-hairline pb-4">
                    <div>
                      <span className="atelier-eyebrow text-ink-mute">Configured Total</span>
                      <div aria-live="polite" className="mt-1">
                        <AnimatePresence mode="popLayout">
                          <motion.div
                            key={configuredPrice}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-4xl text-ink font-bold"
                          >
                            {formatPrice(configuredPrice)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                    <span className="atelier-eyebrow text-sienna border border-sienna px-3 py-1.5 whitespace-nowrap">
                      In Stock · 5 Units
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleAcquire(primaryProduct)}
                      className="atelier-btn flex-1"
                      aria-label={`Add configured Monolith to cart for ${formatPrice(configuredPrice)}`}
                    >
                      <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                      Acquire · {formatPrice(configuredPrice)}
                    </button>
                    <button
                      onClick={() => setIsSpecDrawerOpen(true)}
                      className="atelier-btn-ghost"
                      aria-label="Open the technical blueprint"
                    >
                      <Sliders className="w-4 h-4" aria-hidden="true" /> Blueprint
                    </button>
                  </div>
                </div>

                {/* Trust marks */}
                <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 atelier-eyebrow text-ink-mute">
                  <li className="flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> 5.0 Rating
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> 5-Year
                    Warranty
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> Swiss Made
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        <hr className="atelier-rule" aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════
            2. MOVEMENT ANATOMY — pinned macro image, scrolling layers
           ══════════════════════════════════════════════════════════ */}
        <section
          ref={movementRef}
          className="section-gap"
          aria-label="Movement anatomy"
        >
          <div className="container-void">
            <div className="max-w-2xl mb-16">
              <h2 className="atelier-display atelier-display-lg">
                The Movement, <em>Layer by Layer.</em>
              </h2>
              <p className="mt-5 text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-xl">
                Four engineered strata, each finished to within microns, come together to form the
                Caliber V-01 automatic heart.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Sticky macro image */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div
                  ref={movementImageRef}
                  className="lg:sticky lg:top-24 atelier-frame overflow-hidden bg-bone aspect-[4/5] img-grain"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedColorway.id}
                      src={selectedColorway.detailImage}
                      alt={`Caliber V-01 macro in ${selectedColorway.name}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>

              {/* Accordion layers */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="border-t border-[var(--hairline)]">
                  {MOVEMENT_LAYERS.map((layer) => {
                    const Icon = layer.icon;
                    const isOpen = openLayer === layer.index;
                    return (
                      <div key={layer.index} className="border-b border-[var(--hairline)]">
                        <button
                          onClick={() => setOpenLayer(isOpen ? '' : layer.index)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 py-7 text-left group"
                        >
                          <div className="flex items-baseline gap-5">
                            <span className="atelier-eyebrow text-sienna shrink-0">
                              {layer.index}
                            </span>
                            <div>
                              <h3 className="font-display text-2xl md:text-3xl text-ink leading-snug transition-colors duration-300 group-hover:text-sienna">
                                {layer.title}
                              </h3>
                              <p className="atelier-eyebrow text-[11px] text-ink-mute mt-1.5">
                                {layer.subtitle}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 w-9 h-9 rounded-full border border-[var(--hairline)] flex items-center justify-center transition-colors duration-300 ${
                              isOpen ? 'bg-ink text-ivory border-ink' : 'text-ink-mute'
                            }`}
                          >
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="pb-7 pr-12 text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-xl">
                                {layer.text}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="atelier-rule" aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════
            3. SPECIFICATION LEDGER — dense hairline-ruled grid
           ══════════════════════════════════════════════════════════ */}
        <section className="section-gap atelier-bg-deep" aria-label="Key specifications">
          <div className="container-void">
            <div className="max-w-2xl mb-12">
              <h2 className="atelier-display atelier-display-lg">
                Six Pillars of <em>Precision.</em>
              </h2>
              <p className="mt-5 text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-xl">
                Every measurement is a promise — verified by hand, calibrated to microns, and
                certified for a lifetime of wear.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--hairline)] border border-[var(--hairline)]">
              {SPEC_ROWS.map((spec, index) => {
                const Icon = spec.icon;
                return (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ ...springs.gentle, delay: index * 0.06 }}
                    className="group relative bg-ivory p-6 md:p-7 overflow-hidden"
                  >
                    <span
                      className="absolute top-0 left-0 h-px w-full bg-sienna origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-luxury"
                      aria-hidden="true"
                    />
                    <Icon
                      className="w-5 h-5 text-sienna mb-4 transition-transform duration-300 ease-luxury group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                    <div className="font-display text-xl md:text-2xl text-ink leading-tight mb-1.5 transition-colors duration-300 group-hover:text-sienna">
                      {spec.value}
                      {spec.unit && (
                        <span className="text-sm text-ink-mute font-light ml-1">{spec.unit}</span>
                      )}
                    </div>
                    <div className="atelier-eyebrow text-ink mb-1">{spec.label}</div>
                    <div className="text-xs text-ink-mute">{spec.sub}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Count-up stats */}
            <div className="grid grid-cols-2 gap-px w-full mt-8 border border-[var(--hairline)] bg-[var(--hairline)]">
              <div className="atelier-bg-deep p-6">
                <div className="font-display text-3xl md:text-4xl text-ink font-bold mb-1.5 tabular-nums">
                  <Counter value={28800} />
                </div>
                <div className="atelier-eyebrow text-ink-mute">vph · 4 Hz</div>
              </div>
              <div className="atelier-bg-deep p-6">
                <div className="font-display text-3xl md:text-4xl text-ink font-bold mb-1.5 tabular-nums">
                  <Counter value={72} />
                  <span className="text-base text-ink-mute font-light ml-1">h</span>
                </div>
                <div className="atelier-eyebrow text-ink-mute">Power Reserve</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="atelier-rule" aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════
            4. HERITAGE TIMELINE — preserved component
           ══════════════════════════════════════════════════════════ */}
        <WatchHeritageTimeline />

        <hr className="atelier-rule" aria-hidden="true" />

        {/* ══════════════════════════════════════════════════════════
            5. CATALOG — fluid grid with focus-dim
           ══════════════════════════════════════════════════════════ */}
        <section className="section-gap" aria-label="Horology collection">
          <div className="container-void">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="atelier-display atelier-display-lg">
                  Horology <em>Collection.</em>
                </h2>
              </div>
              <p className="text-ink-soft text-sm font-light max-w-sm leading-relaxed md:text-right">
                Each timepiece is individually hand-assembled, numbered, and issued with an
                encrypted cryptographic certificate.
              </p>
            </div>

            <div className="fluid-grid grid grid-cols-1 md:grid-cols-3 gap-8">
              {WATCH_CATALOG.map((watch, index) => {
                const isWishlistedItem = isWishlisted(watch._id);
                const discount = watch.comparePrice
                  ? Math.round(((watch.comparePrice - watch.price) / watch.comparePrice) * 100)
                  : 0;
                return (
                  <div className="fluid-grid-item" key={watch._id}>
                    <motion.article
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ ...springs.gentle, delay: index * 0.1 }}
                      className="group flex flex-col border border-hairline bg-ivory hover:border-ink transition-colors duration-500 h-full"
                    >
                      <div className="relative aspect-square overflow-hidden bg-bone border-b border-hairline">
                        <Image
                          src={watch.images[0].url}
                          alt={watch.images[0].alt}
                          loading="lazy"
                          wrapperClassName="w-full h-full"
                          className="w-full h-full grayscale opacity-95 transition-[transform,filter,opacity] duration-700 ease-luxury group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:opacity-100"
                        />
                        {watch.isNew && (
                          <div className="absolute top-4 left-4 bg-ink text-ivory atelier-eyebrow px-3 py-1.5">
                            New
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="absolute top-4 right-4 bg-ivory text-sienna border border-sienna atelier-eyebrow px-3 py-1.5">
                            −{discount}%
                          </div>
                        )}
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <span className="atelier-eyebrow text-ink-mute block mb-2">{watch.sku}</span>
                        <h3 className="font-display text-2xl text-ink mb-2 leading-snug">
                          {watch.name}
                        </h3>
                        <p className="text-ink-soft text-sm font-light leading-relaxed mb-6 flex-1">
                          {watch.description}
                        </p>

                        <div className="pt-5 border-t border-hairline flex justify-between items-center gap-3">
                          <div>
                            <div className="font-display text-2xl text-ink font-bold">
                              {formatPrice(watch.price)}
                            </div>
                            {watch.comparePrice && (
                              <div className="text-xs text-ink-mute line-through">
                                {formatPrice(watch.comparePrice)}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleItem(watch._id)}
                              className={`pressable w-11 h-11 border flex items-center justify-center transition-colors duration-300 ${
                                isWishlistedItem
                                  ? 'border-sienna text-sienna'
                                  : 'border-hairline text-ink-soft hover:text-ink hover:border-ink'
                              }`}
                              aria-label={
                                isWishlistedItem
                                  ? `Remove ${watch.name} from wishlist`
                                  : `Add ${watch.name} to wishlist`
                              }
                              aria-pressed={isWishlistedItem}
                            >
                              <Heart
                                className={`w-4 h-4 ${isWishlistedItem ? 'fill-current' : ''}`}
                                aria-hidden="true"
                              />
                            </button>
                            <button
                              onClick={() => handleAcquire(watch)}
                              className="pressable px-5 h-11 bg-ink text-ivory atelier-eyebrow hover:bg-sienna transition-colors duration-300 flex items-center gap-2"
                              aria-label={`Acquire ${watch.name} for ${formatPrice(watch.price)}`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" /> Acquire
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  </div>
                );
              })}
            </div>

            <div className="mt-20 text-center">
              <p className="atelier-eyebrow text-ink-mute inline-flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-ink/25" aria-hidden="true" />
                Numbered editions · certificates verified on acquisition
                <ArrowRight className="w-3.5 h-3.5 text-sienna" aria-hidden="true" />
                <span className="inline-block w-8 h-px bg-ink/25" aria-hidden="true" />
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. SPEC DRAWER — preserved component
           ══════════════════════════════════════════════════════════ */}
        <WatchSpecDrawer
          isOpen={isSpecDrawerOpen}
          onClose={() => setIsSpecDrawerOpen(false)}
          product={primaryProduct}
          selectedColorway={{ name: selectedColorway.name, hex: selectedColorway.hex }}
        />
      </div>
    </MotionConfig>
  );
}
