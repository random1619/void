import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, ShoppingBag, Sliders, ChevronRight, ChevronLeft,
  Gauge, ShieldCheck, Droplets, Gem, Clock, Compass, Star,
  Check, RotateCcw, Heart, Eye
} from 'lucide-react';
import { WatchSpecDrawer } from '../components/watch/WatchSpecDrawer';
import { WatchHeritageTimeline } from '../components/watch/WatchHeritageTimeline';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { springs } from '../lib/motion-tokens';
import { toast } from 'sonner';

/**
 * Watches — Ivory Atelier edition.
 *
 * Redesign direction: the page leaves the legacy dark/gold "void" world and
 * joins the landing page's Ivory Atelier editorial system — warm ivory ground,
 * ink typography, hairline rules, oversized Playfair display, Space Mono index
 * labels, and a single burnt-sienna accent per composition. Imagery starts
 * grayscale and warms to full color on hover, like a lookbook coming to life.
 *
 * Mode: Persuade — every section ends one step closer to "Acquire".
 */

export interface WatchColorway {
  name: string;
  hex: string;
  heroImage: string;
  detailImage: string;
  badge: string;
  description: string;
}

const COLORWAYS: WatchColorway[] = [
  {
    name: 'Obsidian Titanium',
    hex: '#0A0A0A',
    heroImage: '/products/obsidian_titanium_hero.png',
    detailImage: '/products/obsidian_titanium_detail.png',
    badge: 'Flagship Edition',
    description: 'A stealth ceramic-titanium monolith with 18K gold indices and a lacquered abyss dial.',
  },
  {
    name: 'Platinum Silver',
    hex: '#E2E8F0',
    heroImage: '/products/platinum_silver_hero.png',
    detailImage: '/products/platinum_silver_detail.png',
    badge: 'Polished 950 Platinum',
    description: 'Brushed 950 platinum with an ice-blue Super-LumiNova chapter ring and anthracite dial.',
  },
  {
    name: '18K Rose Gold',
    hex: '#B87333',
    heroImage: '/products/rose_gold_hero.png',
    detailImage: '/products/rose_gold_detail.png',
    badge: '18K Warm Alloy',
    description: 'Warm 18K rose gold casing with a chocolate sunburst dial and champagne indices.',
  },
];

const WATCH_CATALOG: Product[] = [
  {
    _id: 'prod_watch_01',
    name: 'VOID Monolith Caliber V-01',
    slug: 'void-monolith-v01',
    description: 'Obsidian ceramic-titanium timepiece with kinetic energy recovery system and 72-hour power reserve.',
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
    description: 'Forged carbon chronograph with high-frequency 36,000 vph escape wheel and tachymeter bezel.',
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
    description: 'Photovoltaic dial architecture harvesting light energy into perpetual precision horology.',
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

const SPEC_CARDS = [
  { icon: Gauge, label: 'Frequency', value: '28,800 vph', sub: '4 Hz precision' },
  { icon: Clock, label: 'Power Reserve', value: '72 Hours', sub: 'Kinetic recovery' },
  { icon: ShieldCheck, label: 'Crystal', value: 'Sapphire', sub: '9 Mohs hardness' },
  { icon: Droplets, label: 'Water Resistance', value: '100 Meters', sub: '10 ATM rated' },
  { icon: Gem, label: 'Jewels', value: '27 Rubies', sub: 'Synthetic corundum' },
  { icon: Compass, label: 'Case', value: '42mm Monolith', sub: 'Grade 5 titanium' },
];

const MOVEMENT_LAYERS = [
  { index: '01', title: 'Sapphire Crystal', subtitle: 'Dual AR-Coated Shield', text: 'Synthetic corundum with a Mohs hardness of 9. Anti-reflective on both surfaces for zero-glare clarity.', icon: Eye },
  { index: '02', title: 'Octagonal Bezel', subtitle: 'Ceramic-Titanium Ring', text: 'Eight exposed titanium screws anchor the 60–500 tachymeter scale. Hand-polished bevels catch light at every angle.', icon: ShieldCheck },
  { index: '03', title: 'Skeleton Dial', subtitle: 'Chronograph Trio', text: 'Laser-cut carbon dial exposing the kinetic inner heart, with three working sub-dials and Super-LumiNova indices.', icon: Compass },
  { index: '04', title: 'Caliber V-01', subtitle: 'In-House Automatic', text: '27 ruby jewels, Geneva-striped bridges, perlage mainplate, and a kinetic rotor with 72-hour power reserve.', icon: Gauge },
];

/** Shared editorial section header: mono index + rule + oversized display. */
function SectionHeading({
  index,
  eyebrow,
  title,
  copy,
  align = 'left',
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  copy?: string;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <div className={centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
      <p
        className={`atelier-eyebrow text-sienna mb-5 flex items-center gap-3 ${
          centered ? 'justify-center' : ''
        }`}
      >
        <span className="inline-block w-8 h-px bg-sienna" aria-hidden="true" />
        {index} · {eyebrow}
      </p>
      <h2 className="atelier-display text-[clamp(36px,5vw,64px)] text-ink">{title}</h2>
      {copy && (
        <p className="mt-5 text-ink-soft text-sm md:text-base font-light leading-relaxed">
          {copy}
        </p>
      )}
    </div>
  );
}

export default function Watch() {
  const [selectedColorway, setSelectedColorway] = useState<WatchColorway>(COLORWAYS[0]);
  const [selectedStrap, setSelectedStrap] = useState(STRAP_OPTIONS[0]);
  const [activeImage, setActiveImage] = useState(0);
  const [isSpecDrawerOpen, setIsSpecDrawerOpen] = useState(false);
  const { addItem, openCart } = useCartStore();
  const { toggleItem, isWishlisted } = useWishlistStore();

  const primaryProduct = WATCH_CATALOG[0];
  const configuredPrice = primaryProduct.price + selectedStrap.priceModifier;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);

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

  const nextImage = () => setActiveImage((prev) => (prev + 1) % 2);
  const prevImage = () => setActiveImage((prev) => (prev - 1 + 2) % 2);

  const heroImages = [selectedColorway.heroImage, selectedColorway.detailImage];

  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      {/* ==================== 1. EDITORIAL HERO GALLERY ==================== */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-28 pb-20"
        aria-label="Featured timepiece"
      >
        {/* Hairline frame inset — the atelier signature. */}
        <div
          className="pointer-events-none absolute inset-3 md:inset-5 border border-hairline"
          aria-hidden="true"
        />

        <div className="container-void relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* LEFT: Editorial text (5 cols) */}
            <motion.div
              style={{ y: heroTextY }}
              className="lg:col-span-5 flex flex-col items-start justify-center order-1"
            >
              <p className="atelier-eyebrow text-sienna mb-6 flex items-center gap-3">
                <span className="inline-block w-8 h-px bg-sienna" aria-hidden="true" />
                Horological Monolith · Caliber V-01
              </p>

              <h1 className="atelier-display text-[clamp(48px,7vw,96px)] mb-6">
                Time,
                <br />
                <em>Measured in Stone.</em>
              </h1>

              <p className="text-ink-soft text-sm md:text-base max-w-md mb-10 font-light leading-relaxed">
                An architectural statement carved from proprietary{' '}
                {selectedColorway.name.toLowerCase()}, governed by the in-house
                Caliber V-01 automatic movement with a 72-hour power reserve.
              </p>

              {/* Colorway swatches */}
              <div className="mb-10 w-full">
                <span className="atelier-eyebrow text-ink-mute block mb-4">
                  Finish · {selectedColorway.name}
                </span>
                <div className="flex gap-3" role="radiogroup" aria-label="Case finish">
                  {COLORWAYS.map((cw) => {
                    const isSelected = selectedColorway.name === cw.name;
                    return (
                      <button
                        key={cw.name}
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => { setSelectedColorway(cw); setActiveImage(0); }}
                        title={cw.name}
                        aria-label={`Select ${cw.name}`}
                        className={`pressable relative w-11 h-11 flex items-center justify-center border transition-colors duration-300 ${
                          isSelected
                            ? 'border-ink'
                            : 'border-hairline hover:border-ink-soft'
                        }`}
                      >
                        <span
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
                <p className="mt-4 text-xs text-ink-mute font-light leading-relaxed max-w-sm">
                  {selectedColorway.description}
                </p>
              </div>

              {/* Price & CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                <button
                  onClick={() => handleAcquire(primaryProduct)}
                  className="atelier-btn"
                  aria-label={`Acquire the Monolith for ${formatPrice(configuredPrice)}`}
                >
                  Acquire · {formatPrice(configuredPrice)}
                  <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                </button>

                <button
                  onClick={() => setIsSpecDrawerOpen(true)}
                  className="atelier-btn-ghost"
                  aria-label="Open the technical blueprint"
                >
                  <Sliders className="w-4 h-4" aria-hidden="true" /> Blueprint Specs
                </button>
              </div>

              {/* Trust marks */}
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 atelier-eyebrow text-ink-mute">
                <li className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> 5.0 Rating
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> 5-Year Warranty
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-sienna" aria-hidden="true" /> Swiss Made
                </li>
              </ul>
            </motion.div>

            {/* RIGHT: Hero Image Gallery (7 cols) */}
            <motion.div
              style={{ y: heroImageY }}
              className="lg:col-span-7 order-2"
            >
              <div className="atelier-frame atelier-frame-hover relative aspect-[4/5] group/hero">
                {/* Main image — settles in on change, never from scale(0). */}
                <motion.div
                  key={activeImage + selectedColorway.name}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={heroImages[activeImage]}
                    alt={`VOID Monolith in ${selectedColorway.name} · view ${activeImage + 1} of 2`}
                    className="w-full h-full object-cover grayscale-[0.55] transition-[filter] duration-700 ease-luxury group-hover/hero:grayscale-0 group-focus-within/hero:grayscale-0"
                  />
                </motion.div>

                {/* Badge */}
                <div className="absolute top-6 left-6 bg-ivory/90 backdrop-blur-sm px-4 py-2 border border-hairline atelier-eyebrow text-ink">
                  {selectedColorway.badge}
                </div>

                {/* Gallery controls — 44px targets with visible labels. */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2" role="tablist" aria-label="Gallery views">
                    {heroImages.map((_, idx) => (
                      <button
                        key={idx}
                        role="tab"
                        aria-selected={activeImage === idx}
                        onClick={() => setActiveImage(idx)}
                        aria-label={`View ${idx === 0 ? 'profile' : 'detail'} image`}
                        className="pressable h-11 px-2 flex items-center"
                      >
                        <span
                          className={`block h-px w-10 transition-colors duration-300 ${
                            activeImage === idx ? 'bg-ink' : 'bg-ink/25'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={prevImage}
                      className="pressable w-11 h-11 border border-hairline bg-ivory/90 backdrop-blur-sm text-ink-soft hover:text-ink hover:border-ink transition-colors duration-300 flex items-center justify-center"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="pressable w-11 h-11 border border-hairline bg-ivory/90 backdrop-blur-sm text-ink-soft hover:text-ink hover:border-ink transition-colors duration-300 flex items-center justify-center"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <hr className="atelier-rule" aria-hidden="true" />

      {/* ==================== 2. SPECIFICATION LEDGER ==================== */}
      <section className="py-20 md:py-24" aria-label="Key specifications">
        <div className="container-void">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-hairline divide-x divide-y lg:divide-y-0 divide-[rgba(24,20,16,0.14)]">
            {SPEC_CARDS.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="atelier-ledger-cell p-6 md:p-7 group"
                >
                  <Icon
                    className="w-5 h-5 text-sienna mb-4 transition-transform duration-300 ease-luxury group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                  <div className="font-display text-xl md:text-2xl text-ink leading-tight mb-1.5 transition-colors duration-300 group-hover:text-sienna">
                    {spec.value}
                  </div>
                  <div className="atelier-eyebrow text-ink mb-1">{spec.label}</div>
                  <div className="text-xs text-ink-mute">{spec.sub}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="atelier-rule" aria-hidden="true" />

      {/* ==================== 3. CRAFTSMANSHIP & MICRO-MECHANICAL STORY ==================== */}
      <section className="py-24 md:py-32 atelier-bg-deep" aria-label="Craftsmanship">
        <div className="container-void grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Narrative (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col items-start order-2 lg:order-1"
          >
            <SectionHeading
              index="02"
              eyebrow="Micro-Mechanical Engineering"
              title={<>184 Components. <em>Zero Compromise.</em></>}
              copy="Every bridge plate is hand-beveled with Côtes de Genève stripes, while the mainplate carries circular-grained perlage. The in-house Caliber V-01 oscillates at 28,800 vibrations per hour for needle-sharp accuracy."
            />

            <div className="grid grid-cols-2 gap-px w-full my-10 border border-hairline bg-[rgba(24,20,16,0.14)]">
              <div className="atelier-bg-deep p-6">
                <div className="font-display text-3xl md:text-4xl text-ink font-bold mb-1.5">
                  28,800
                </div>
                <div className="atelier-eyebrow text-ink-mute">vph · 4 Hz</div>
              </div>
              <div className="atelier-bg-deep p-6">
                <div className="font-display text-3xl md:text-4xl text-ink font-bold mb-1.5">
                  72h
                </div>
                <div className="atelier-eyebrow text-ink-mute">Power Reserve</div>
              </div>
            </div>

            <button
              onClick={() => setIsSpecDrawerOpen(true)}
              className="atelier-link atelier-eyebrow text-ink inline-flex items-center gap-2 pb-1"
            >
              Explore the full horological specs
              <ArrowRight className="w-4 h-4 text-sienna" aria-hidden="true" />
            </button>
          </motion.div>

          {/* Macro Image (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2"
          >
            <figure className="atelier-frame atelier-frame-hover relative">
              <img
                src={selectedColorway.detailImage}
                alt="Macro detail of the Glucydur balance wheel and 27 ruby jewels"
                className="w-full aspect-[16/10] object-cover grayscale-[0.6] transition-[filter] duration-700 hover:grayscale-0"
              />
              <figcaption className="absolute bottom-6 left-6 bg-ivory/90 backdrop-blur-sm px-4 py-2 border border-hairline atelier-eyebrow text-ink">
                Macro · Glucydur Balance & 27 Rubies
              </figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      <hr className="atelier-rule" aria-hidden="true" />

      {/* ==================== 4. MOVEMENT LAYERS ==================== */}
      <section className="py-24 md:py-32" aria-label="Movement layers">
        <div className="container-void">
          <SectionHeading
            index="03"
            eyebrow="Deconstructed Haute Horlogerie"
            align="center"
            title={<>The Movement, <em>Layer by Layer.</em></>}
            copy="Four engineered strata, each finished to within microns, come together to form the Caliber V-01 automatic heart."
          />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-hairline divide-y lg:divide-x lg:divide-y-0 divide-[rgba(24,20,16,0.14)]">
            {MOVEMENT_LAYERS.map((layer, index) => {
              const Icon = layer.icon;
              return (
                <motion.article
                  key={layer.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="p-8 group"
                >
                  <div className="flex items-baseline justify-between mb-8">
                    <span className="atelier-eyebrow text-ink-mute">{layer.index}</span>
                    <Icon
                      className="w-5 h-5 text-sienna transition-transform duration-300 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-1.5">{layer.title}</h3>
                  <p className="atelier-eyebrow text-sienna mb-4">{layer.subtitle}</p>
                  <p className="text-ink-soft text-sm font-light leading-relaxed">{layer.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="atelier-rule" aria-hidden="true" />

      {/* ==================== 5. CONFIGURATOR ==================== */}
      <section className="py-24 md:py-32 atelier-bg-deep" aria-label="Configure your watch">
        <div className="container-void">
          <SectionHeading
            index="04"
            eyebrow="Atelier Configurator"
            align="center"
            title={<>Configure <em>Your Monolith.</em></>}
            copy="Select a case finish and strap architecture to match your aesthetic. Every configuration is hand-assembled and individually numbered."
          />

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left: Preview */}
            <div className="lg:col-span-5">
              <div className="atelier-frame lg:sticky lg:top-24">
                <div className="relative aspect-square bg-bone overflow-hidden">
                  <motion.img
                    key={selectedColorway.name}
                    src={selectedColorway.heroImage}
                    alt={`Configured VOID Monolith in ${selectedColorway.name}`}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-5 left-5 bg-ivory/90 backdrop-blur-sm px-3 py-1.5 border border-hairline atelier-eyebrow text-ink">
                    {selectedColorway.badge}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 px-5 py-4 border-t border-hairline">
                  <span className="atelier-eyebrow text-ink-mute">Selected</span>
                  <span className="font-display text-sm text-ink text-right">
                    {selectedColorway.name} / {selectedStrap.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="lg:col-span-7 space-y-8">
              {/* Finish selector */}
              <fieldset className="border border-hairline p-6 md:p-8">
                <legend className="atelier-eyebrow text-sienna px-3 -ml-3 atelier-bg-deep">
                  1 · Case Finish
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {COLORWAYS.map((cw) => {
                    const isSelected = selectedColorway.name === cw.name;
                    return (
                      <button
                        key={cw.name}
                        onClick={() => setSelectedColorway(cw)}
                        aria-pressed={isSelected}
                        className={`pressable p-5 min-h-[44px] text-left border transition-colors duration-300 ${
                          isSelected
                            ? 'border-ink bg-ivory'
                            : 'border-hairline hover:border-ink-soft bg-transparent'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span
                            className="block w-6 h-6 border border-ink/20"
                            style={{ backgroundColor: cw.hex }}
                            aria-hidden="true"
                          />
                          {isSelected && (
                            <Check className="w-4 h-4 text-sienna" aria-hidden="true" />
                          )}
                        </div>
                        <div className="font-display text-base text-ink mb-1.5">{cw.name}</div>
                        <div className="text-xs text-ink-mute font-light leading-relaxed">
                          {cw.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Strap selector */}
              <fieldset className="border border-hairline p-6 md:p-8">
                <legend className="atelier-eyebrow text-sienna px-3 -ml-3 atelier-bg-deep">
                  2 · Strap Architecture
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
                            ? 'border-ink bg-ivory text-ink'
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

              {/* Price & CTA */}
              <div className="border border-ink bg-ivory p-6 md:p-8 flex flex-col gap-5">
                <div className="flex justify-between items-baseline gap-4 border-b border-hairline pb-5">
                  <div>
                    <span className="atelier-eyebrow text-ink-mute">Configured Total</span>
                    <div aria-live="polite" className="mt-1">
                    <motion.div
                      key={configuredPrice}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display text-4xl text-ink font-bold"
                    >
                      {formatPrice(configuredPrice)}
                    </motion.div>
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
                    Acquire Configured Monolith
                  </button>
                  <button
                    onClick={() => { setSelectedColorway(COLORWAYS[0]); setSelectedStrap(STRAP_OPTIONS[0]); }}
                    className="atelier-btn-ghost"
                    aria-label="Reset configuration to defaults"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" /> Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 6. HOROLOGY HERITAGE TIMELINE ==================== */}
      <WatchHeritageTimeline />

      <hr className="atelier-rule" aria-hidden="true" />

      {/* ==================== 7. CURATED HOROLOGY CATALOG ==================== */}
      <section className="py-24 md:py-32" aria-label="Horology collection">
        <div className="container-void">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <SectionHeading
              index="06"
              eyebrow="The Atelier Catalog"
              title={<>Horology <em>Collection.</em></>}
            />
            <p className="text-ink-soft text-sm font-light max-w-sm leading-relaxed md:text-right">
              Each timepiece is individually hand-assembled, numbered, and issued with
              an encrypted cryptographic certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WATCH_CATALOG.map((watch, index) => {
              const isWishlistedItem = isWishlisted(watch._id);
              const discount = watch.comparePrice
                ? Math.round(((watch.comparePrice - watch.price) / watch.comparePrice) * 100)
                : 0;
              return (
                <motion.article
                  key={watch._id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ ...springs.gentle, delay: index * 0.1 }}
                  className="group flex flex-col border border-hairline bg-ivory hover:border-ink transition-colors duration-500"
                >
                  <div className="relative aspect-square overflow-hidden bg-bone border-b border-hairline">
                    <img
                      src={watch.images[0].url}
                      alt={watch.images[0].alt}
                      loading="lazy"
                      className="w-full h-full object-cover grayscale opacity-95 transition-[transform,filter,opacity] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:opacity-100 group-focus-within:grayscale-0"
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
              );
            })}
          </div>

          {/* Closing line */}
          <div className="mt-20 text-center">
            <p className="atelier-eyebrow text-ink-mute inline-flex items-center gap-3">
              <span className="inline-block w-8 h-px bg-ink/25" aria-hidden="true" />
              Numbered editions · certificates verified on acquisition
              <ArrowUpRight className="w-3.5 h-3.5 text-sienna" aria-hidden="true" />
              <span className="inline-block w-8 h-px bg-ink/25" aria-hidden="true" />
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 8. SLIDE-OUT SPECIFICATION DRAWER ==================== */}
      <WatchSpecDrawer
        isOpen={isSpecDrawerOpen}
        onClose={() => setIsSpecDrawerOpen(false)}
        product={primaryProduct}
        selectedColorway={{ name: selectedColorway.name, hex: selectedColorway.hex }}
      />
    </div>
  );
}
