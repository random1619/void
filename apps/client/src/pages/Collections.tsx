import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowDown,
  X,
  ChevronRight,
  Eye,
} from 'lucide-react';
import api from '../lib/api';
import type { Category } from '../types';
import { CategorySkeleton } from '../components/ui/LoadingSkeleton';
import { useDialog } from '../hooks/useDialog';
import { Image } from '../components/ui/Image';

/**
 * VOID Collections — Cinematic Editorial Lookbook
 * ────────────────────────────────────────────────
 * Skills: /apple-design, /emil-design-eng, /design-taste-frontend-v1, /gpt-taste
 *
 * Built from scratch — no previous references.
 *
 * AIDA Structure:
 *   ATTENTION  → Cinematic Hero (full-viewport, centered typography, editorial image)
 *   INTEREST   → Three collection chapters (alternating L/R editorial splits)
 *                The Archive (gapless bento grid, grid-auto-flow: dense)
 *   DESIRE     → Lookbook modal with spring physics
 *   ACTION     → Dynamic category index (from API)
 *
 * Baseline Dials (Taste-v1): VARIANCE: 8 | MOTION: 6 | DENSITY: 4
 */

/* ───────────────────────────── Constants ───────────────────────────── */

/* Emil: custom ease-out — stronger than CSS default. */
const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/* ─── Lookbook data ─── */

interface LookbookItem {
  id: string;
  collectionTitle: string;
  subtitle: string;
  categorySlug?: string;
  description: string;
  editorialLine: string;
  looks: {
    title: string;
    image: string;
    caption: string;
    productSlug?: string;
  }[];
}

const LOOKBOOKS: Record<string, LookbookItem> = {
  'haute-couture': {
    id: 'haute-couture',
    collectionTitle: 'Haute Couture',
    subtitle: 'Autumn Exhibition',
    categorySlug: 'atelier',
    description:
      'A study in sculpted silhouettes and quiet structure. Sharp tailoring meets fluid drape, cut in natural fibres and held to the light before a single seam is closed.',
    editorialLine:
      'We don\u2019t design clothes. We engineer the silence between fabric and skin.',
    looks: [
      {
        title: 'Look I \u00b7 Sculpted Wool Coat',
        image: '/collections_look_01_coat.png',
        caption:
          'Draped wool coat with hand-rolled edges and sculptural shoulders, cut in one continuous piece.',
        productSlug: 'architectural-overcoat',
      },
      {
        title: 'Look II \u00b7 Draped Silk Shirt',
        image: '/collections_look_02_silk_shirt.png',
        caption:
          'Tonal embroidery on washed silk, layered beneath a sculpted chest piece cast in warm brass.',
        productSlug: 'atelier-draped-shirt',
      },
      {
        title: 'Look III \u00b7 Cashmere Evening Gown',
        image: '/collections_look_03_gown.png',
        caption:
          'A long, quiet silhouette in organic cashmere with an asymmetric train that moves with the wearer.',
        productSlug: 'cashmere-storm-coat',
      },
    ],
  },
  'future-street': {
    id: 'future-street',
    collectionTitle: 'Future Street',
    subtitle: 'City Layers',
    categorySlug: 'outerwear',
    description:
      'Utilitarian pieces elevated through considered material. Weatherproof natural weaves and calm, protective silhouettes, finished by hand for the long walk through the season.',
    editorialLine:
      'The city is harsh. Your armour should be beautiful.',
    looks: [
      {
        title: 'Look I \u00b7 Canvas Field Jacket',
        image: '/products/canvas_field_jacket.png',
        caption:
          'Generous storm collar in densely woven cotton canvas, finished with brass hardware and a weatherproof hand.',
        productSlug: 'minimalist-leather-jacket',
      },
      {
        title: 'Look II \u00b7 Weathered Leather Boot',
        image: '/collections_look_02_boot.png',
        caption:
          'A clean-lined boot in vegetable-tanned leather on a stitched rubber sole, made to age gracefully.',
        productSlug: 'futuristic-leather-boots',
      },
    ],
  },
  sculptural: {
    id: 'sculptural',
    collectionTitle: 'Sculptural Objects',
    subtitle: 'Small Series',
    categorySlug: 'footwear',
    description:
      'Objects made slowly and in small numbered editions. Vegetable-tanned leather, brushed brass, and undyed wool, assembled to be carried for decades.',
    editorialLine:
      'A numbered object is a promise. We keep ours.',
    looks: [
      {
        title: 'Object I \u00b7 Brass Signet Ring',
        image: '/products/brass_signet_ring.png',
        caption:
          'A weighted signet in brushed brass, cast in a small numbered edition and finished by hand.',
      },
      {
        title: 'Object II \u00b7 Structured Top-Handle Bag',
        image: '/products/structured_top_handle_bag.png',
        caption:
          'Structured handbag in vegetable-tanned leather with a hand-polished brass top handle.',
      },
      {
        title: 'Object III \u00b7 Acetate Eyewear',
        image: '/products/acetate_eyewear.png',
        caption:
          'Line-drawn angular frames in polished acetate with green-tinted lenses and warm metal temples.',
      },
    ],
  },
};

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  atelier: LOOKBOOKS['haute-couture'].looks[0].image,
  outerwear: LOOKBOOKS['future-street'].looks[0].image,
  footwear: LOOKBOOKS['future-street'].looks[1].image,
  accessories: LOOKBOOKS.sculptural.looks[2].image,
};

const HERO_IMAGE = LOOKBOOKS['haute-couture'].looks[2].image;

/* Collection chapters — the three editorial spreads shown full-viewport. */
const CHAPTERS = [
  {
    id: 'haute-couture',
    lookbookKey: 'haute-couture' as const,
    align: 'left' as const,
    image: LOOKBOOKS['haute-couture'].looks[0].image,
  },
  {
    id: 'future-street',
    lookbookKey: 'future-street' as const,
    align: 'right' as const,
    image: LOOKBOOKS['future-street'].looks[0].image,
  },
  {
    id: 'sculptural',
    lookbookKey: 'sculptural' as const,
    align: 'left' as const,
    image: LOOKBOOKS.sculptural.looks[0].image,
  },
] as const;

/* The fixed scroll-dot navigator was removed — it overlaid dialogs
   (z conflict) and duplicated labels already visible in each section. */

/* ══════════════════════════════════════════════════════════════════════ */
/* COLLECTIONS PAGE                                                     */
/* ══════════════════════════════════════════════════════════════════════ */

export default function Collections() {
  const reducedMotion = useReducedMotion();
  const [activeLookbookId, setActiveLookbookId] = useState<string | null>(
    null
  );
  const [activeLookIndex, setActiveLookIndex] = useState<number>(0);

  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{
        success: boolean;
        data: Category[];
      }>('/categories');
      return data.data;
    },
  });


  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openLookbook = (id: string) => {
    setActiveLookbookId(id);
    setActiveLookIndex(0);
  };

  const closeLookbook = () => {
    setActiveLookbookId(null);
  };

  const currentLookbook = activeLookbookId
    ? LOOKBOOKS[activeLookbookId]
    : null;

  /* Focus-trap + scroll-lock for lookbook modal. */
  const { dialogProps } = useDialog<HTMLDivElement>({
    open: activeLookbookId !== null,
    onClose: closeLookbook,
    labelledById: 'lookbook-title',
  });

  return (
    <div className="atelier-bg text-ink overflow-x-hidden w-full max-w-full min-h-[100dvh]">
      <main>
        {/* ============================================================ */}
        {/* ATTENTION: CINEMATIC HERO                                     */}
        {/* ============================================================ */}
        {/* GPT-Taste: Cinematic center hero. H1 max 2-3 lines.
           Apple: tight leading, negative tracking on display type.
           Emil: blur-to-sharp entrance, stagger 70ms.
           Taste-v1: min-h-[100dvh], no stamp badges.               */}
        <section
          id="hero"
          className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden pt-20"
        >
          {/* Background image — editorial filter. */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <div
              className="w-full h-full bg-[var(--ink)] bg-cover bg-center opacity-60 img-editorial"
              style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(var(--ivory-rgb),0.75)] via-[rgba(var(--ivory-rgb),0.35)] to-[var(--ivory)]" />
          </div>

          <div className="relative z-10 text-center px-4 md:px-16 max-w-5xl">
            <motion.span
              initial={
                reducedMotion ? undefined : { opacity: 0, y: 16 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_FLUID }}
              className="atelier-eyebrow text-sienna block mb-6"
            >
              Autumn Winter Atelier
            </motion.span>

            {/* H1: "The Autumn Exhibition" — wide container, clamp sizing,
                max 2 lines on desktop. GPT-Taste 2-line iron rule.       */}
            <motion.h1
              initial={
                reducedMotion
                  ? undefined
                  : { opacity: 0, y: 24 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.15,
                ease: EASE_FLUID,
              }}
              className="atelier-display text-[clamp(3rem,6vw,6rem)] mb-6 leading-[0.95]"
            >
              Where Cloth Becomes{' '}
              <em>Conviction.</em>
            </motion.h1>

            {/* Editorial sub-line — dynamic, evocative. */}
            <motion.p
              initial={
                reducedMotion
                  ? undefined
                  : { opacity: 0, y: 16 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.35,
                ease: EASE_FLUID,
              }}
              className="text-ink-soft text-base md:text-lg leading-relaxed max-w-[52ch] mx-auto mb-10 font-light"
            >
              Three houses. One uncompromising standard. Every garment
              in this exhibition was cut by hand, held to the light,
              and released only when it earned its number.
            </motion.p>

            <motion.div
              initial={
                reducedMotion ? undefined : { opacity: 0, y: 12 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: EASE_FLUID,
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => scrollToSection('haute-couture')}
                className="btn-island-primary group pressable"
              >
                <span>Explore Collections</span>
                <span className="icon-pill">
                  <ArrowDown className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:translate-y-0.5" />
                </span>
              </button>

              <Link
                to="/collections/ivory-series"
                className="btn-island-ghost group pressable"
              >
                <span>View Ivory Series</span>
                <span className="icon-pill">
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 hover-hover:group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Scroll hint — Apple spatial consistency: motion hints direction. */}
          <button
            onClick={() => scrollToSection('haute-couture')}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 min-w-11 min-h-11 flex items-center justify-center text-sienna hover:text-ink transition-colors pressable group/scrollhint"
            aria-label="Scroll to first collection"
          >
            <ArrowDown className="w-6 h-6 transition-transform duration-300 hover-hover:group-hover/scrollhint:translate-y-0.5" />
          </button>
        </section>

        {/* ============================================================ */}
        {/* INTEREST: COLLECTION CHAPTERS (Alternating Editorial Splits) */}
        {/* ============================================================ */}
        {/* Three full-viewport sections. Each alternates the glass info
           panel between left and right (Taste-v1 VARIANCE 8).
           Apple: spatial consistency — enter/exit along same path.
           Emil: ease-out [0.32, 0.72, 0, 1], 800ms duration.       */}
        {CHAPTERS.map((chapter) => {
          const lb = LOOKBOOKS[chapter.lookbookKey];
          const isRight = chapter.align === 'right';

          return (
            <section
              key={chapter.id}
              id={chapter.id}
              className="relative min-h-[100dvh] w-full flex items-center section-gap"
            >
              {/* Chapter background — static cover treatment (fixed-attachment
                 parallax is broken on iOS, so it was removed). */}
              <div
                className="absolute inset-0 z-0 bg-cover bg-center scale-[1.02]"
                style={{ backgroundImage: `url('${chapter.image}')` }}
                aria-hidden="true"
              >
                <div
                  className={`absolute inset-0 ${
                    isRight
                      ? 'bg-gradient-to-l from-[rgba(var(--ivory-rgb),0.8)] via-[rgba(var(--ivory-rgb),0.45)] to-transparent'
                      : 'bg-gradient-to-r from-[rgba(var(--ivory-rgb),0.8)] via-[rgba(var(--ivory-rgb),0.45)] to-transparent'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--ink-rgb),0.25)] via-transparent to-transparent" />
              </div>

              <div
                className={`relative z-10 container-void w-full ${
                  isRight ? 'flex justify-end' : ''
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
                  <motion.div
                    initial={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, x: isRight ? 30 : -30 }
                    }
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: EASE_FLUID }}
                    className={`${
                      isRight
                        ? 'md:col-start-7 md:col-span-6 lg:col-start-8 lg:col-span-5'
                        : 'md:col-span-6 lg:col-span-5'
                    } border border-hairline bg-[rgba(var(--ivory-rgb),0.92)] backdrop-blur-lg p-8 md:p-12 relative overflow-hidden group`}
                  >
                    {/* Sienna warmth on hover */}
                    <div
                      className="absolute inset-0 bg-[rgba(var(--sienna-rgb),0.04)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      aria-hidden="true"
                    />

                    <span
                      className={`atelier-eyebrow text-sienna mb-3 block ${
                        isRight ? 'text-right' : ''
                      }`}
                    >
                      {lb.subtitle}
                    </span>

                    <h2
                      className={`atelier-display text-3xl md:text-4xl mb-4 ${
                        isRight ? 'text-right' : ''
                      }`}
                    >
                      {lb.collectionTitle}
                    </h2>

                    {/* Dynamic editorial line — evocative, not descriptive. */}
                    <p
                      className={`text-sienna/80 font-display text-sm italic mb-4 ${
                        isRight ? 'text-right' : ''
                      }`}
                    >
                      &ldquo;{lb.editorialLine}&rdquo;
                    </p>

                    <p
                      className={`text-ink-soft mb-8 leading-relaxed text-sm md:text-base ${
                        isRight ? 'text-right' : ''
                      }`}
                    >
                      {lb.description}
                    </p>

                    <div
                      className={`flex flex-wrap gap-4 items-center ${
                        isRight ? 'justify-end' : ''
                      }`}
                    >
                      <button
                        onClick={() => openLookbook(chapter.lookbookKey)}
                        className="atelier-btn-ghost pressable inline-flex items-center gap-2 group/btn"
                      >
                        <Eye className="w-4 h-4" />
                        View Lookbook
                        <ArrowRight className="w-4 h-4 hover-hover:group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>

                      {lb.categorySlug && (
                        <Link
                          to={`/collections/${lb.categorySlug}`}
                          className="atelier-link font-label-caps text-ink-soft hover:text-ink transition-colors flex items-center gap-1 text-xs tracking-widest uppercase py-4 -my-1"
                        >
                          Shop Pieces{' '}
                          <ChevronRight className="w-3.5 h-3.5 text-sienna" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          );
        })}

        {/* ============================================================ */}
        {/* INTEREST: THE ARCHIVE — Gapless Bento Grid                   */}
        {/* ============================================================ */}
        {/* GPT-Taste: grid-auto-flow: dense, zero empty space.
           Emil: stagger 80ms, card-lift hover.
           Taste-v1: cards only when elevation is functional.          */}
        <section
          id="archive"
          className="section-gap-lg atelier-bg-deep relative z-20 border-t border-hairline"
        >
          <div className="container-void">
            <div className="text-center mb-16">
              <motion.span
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 8 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: EASE_FLUID }}
                className="atelier-eyebrow text-sienna block mb-4"
              >
                Past Seasons
              </motion.span>
              <motion.h2
                initial={
                  reducedMotion
                    ? undefined
                    : { opacity: 0, y: 16 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: EASE_FLUID,
                }}
                className="atelier-display text-4xl md:text-5xl"
              >
                The <em>Archive</em>
              </motion.h2>
              <motion.p
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 12 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: EASE_FLUID,
                }}
                className="text-ink-mute text-sm max-w-[48ch] mx-auto mt-4"
              >
                Runway essays and material experiments from previous
                seasons. Every collection a chapter; every garment a
                sentence we refuse to retract.
              </motion.p>
            </div>

            {/* Bento grid — grid-auto-flow: dense per GPT-Taste. */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[280px] md:auto-rows-[320px]" style={{ gridAutoFlow: 'dense' }}>
              {/* Large feature cell — 8 cols, 2 rows */}
              <motion.div
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: EASE_FLUID }}
                className="md:col-span-8 md:row-span-2 relative group overflow-hidden border border-hairline hover:border-[rgba(var(--sienna-rgb),0.4)] cursor-pointer transition-colors card-lift"
                onClick={() => openLookbook('haute-couture')}
              >
                <Image
                  src={LOOKBOOKS['haute-couture'].looks[2].image}
                  alt="Ivory Studies · SS 2023 Archive"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 hover-hover:group-hover:scale-105 transition-[opacity,transform] duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--ink-rgb),0.85)] via-[rgba(var(--ink-rgb),0.25)] to-transparent opacity-90" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="atelier-eyebrow !text-[var(--ivory)] mb-2 block">
                    SS 2023 Archive
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-[var(--ivory)] mb-2">
                    Ivory Studies
                  </h3>
                  <p className="text-xs md:text-sm text-[var(--ivory)]/70 max-w-lg hidden sm:block">
                    An early runway essay on weightless drape and chalk,
                    ivory, and undyed fibres.
                  </p>
                </div>
              </motion.div>

              {/* Small cell — AW 2022 */}
              <motion.div
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.08,
                  ease: EASE_FLUID,
                }}
                className="md:col-span-4 relative group overflow-hidden border border-hairline hover:border-[rgba(var(--sienna-rgb),0.4)] cursor-pointer transition-colors card-lift"
                onClick={() => openLookbook('future-street')}
              >
                <Image
                  src={LOOKBOOKS['haute-couture'].looks[1].image}
                  alt="Tonal Embroidery · AW 2022"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 hover-hover:group-hover:scale-105 transition-[opacity,transform] duration-300"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(var(--ivory-rgb),0.72)] group-hover:bg-[rgba(var(--ivory-rgb),0.85)] backdrop-blur-[2px] transition-colors duration-300">
                  <span className="atelier-eyebrow text-sienna mb-1">
                    AW 2022
                  </span>
                  <span className="text-xs text-ink font-medium">
                    Tonal Embroidery
                  </span>
                </div>
              </motion.div>

              {/* Small cell — SS 2022 */}
              <motion.div
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.16,
                  ease: EASE_FLUID,
                }}
                className="md:col-span-4 relative group overflow-hidden border border-hairline hover:border-[rgba(var(--sienna-rgb),0.4)] cursor-pointer transition-colors card-lift"
                onClick={() => openLookbook('sculptural')}
              >
                <Image
                  src={LOOKBOOKS.sculptural.looks[1].image}
                  alt="Wire Sculpture · SS 2022"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-90 hover-hover:group-hover:scale-105 transition-[opacity,transform] duration-300"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(var(--ivory-rgb),0.72)] group-hover:bg-[rgba(var(--ivory-rgb),0.85)] backdrop-blur-[2px] transition-colors duration-300">
                  <span className="atelier-eyebrow text-sienna mb-1">
                    SS 2022
                  </span>
                  <span className="text-xs text-ink font-medium">
                    Wire Sculpture
                  </span>
                </div>
              </motion.div>

              {/* Wide horizontal panoramic — 12 cols */}
              <motion.div
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 20 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: 0.24,
                  ease: EASE_FLUID,
                }}
                className="md:col-span-12 relative group overflow-hidden border border-hairline hover:border-[rgba(var(--sienna-rgb),0.4)] cursor-pointer transition-colors card-lift"
                onClick={() => openLookbook('haute-couture')}
              >
                <Image
                  src={LOOKBOOKS['future-street'].looks[0].image}
                  alt="Genesis Collection Panoramic"
                  loading="lazy"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-95 hover-hover:group-hover:scale-105 transition-[opacity,transform] duration-300"
                />
                <div className="absolute inset-0 bg-[rgba(var(--ink-rgb),0.45)] group-hover:bg-[rgba(var(--ink-rgb),0.25)] transition-colors duration-500" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
                  <span className="atelier-eyebrow !text-[var(--ivory)] block mb-2">
                    Heritage
                  </span>
                  <h3 className="font-display text-3xl md:text-5xl text-[var(--ivory)] opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                    Genesis Collection
                  </h3>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ACTION: DYNAMIC CATEGORY INDEX                               */}
        {/* ============================================================ */}
        {/* Data from API. Skeletal loaders → staggered card grid.
           Emil: loading = skeletal loaders matching layout sizes.
           Error states: clear inline reporting.                       */}
        <section
          id="categories"
          className="section-gap-lg atelier-bg border-t border-hairline"
        >
          <div className="container-void">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
              <div>
                <motion.span
                  initial={
                    reducedMotion ? undefined : { opacity: 0, y: 8 }
                  }
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE_FLUID }}
                  className="atelier-eyebrow text-sienna block"
                >
                  Full Catalogue
                </motion.span>
                <motion.h2
                  initial={
                    reducedMotion
                      ? undefined
                      : { opacity: 0, y: 16 }
                  }
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.7,
                    delay: 0.08,
                    ease: EASE_FLUID,
                  }}
                  className="atelier-display text-4xl md:text-5xl mt-2"
                >
                  Every Thread, <em>Accounted For.</em>
                </motion.h2>
              </div>
              <motion.p
                initial={
                  reducedMotion ? undefined : { opacity: 0, y: 12 }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.15,
                  ease: EASE_FLUID,
                }}
                className="text-ink-mute text-sm max-w-md"
              >
                Browse the entire spectrum of VOID houses and tailored
                garments. Each collection is a world unto itself.
              </motion.p>
            </div>

            {/* Loading state — skeletal cards matching layout. */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <CategorySkeleton count={6} />
              </div>
            ) : isError ? (
              /* Error state — clear inline reporting (Emil). */
              <div className="text-center py-16 border border-hairline bg-[var(--bone)]/40 max-w-xl mx-auto">
                <p className="text-ink font-display text-lg mb-2">
                  Unable to load collections
                </p>
                <p className="text-ink-mute text-sm mb-6">
                  {error instanceof Error
                    ? error.message
                    : 'Something went wrong. Please try again.'}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="atelier-btn inline-block pressable"
                >
                  Retry
                </button>
              </div>
            ) : categories?.length === 0 ? (
              /* Empty state — composed, not generic (Emil). */
              <div className="text-center py-20 max-w-md mx-auto">
                <p className="font-display text-xl text-ink mb-2">
                  The atelier is quiet today.
                </p>
                <p className="text-ink-mute text-sm">
                  No active collections found. New editions drop every
                  season.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((cat, idx) => (
                  <motion.div
                    key={cat._id}
                    initial={
                      reducedMotion
                        ? undefined
                        : { opacity: 0, y: 20 }
                    }
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.07,
                      ease: EASE_FLUID,
                    }}
                    className="group"
                  >
                    <Link
                      to={`/collections/${cat.slug}`}
                      className="block border border-hairline bg-[var(--bone)]/40 p-6 group-hover:border-[rgba(var(--sienna-rgb),0.5)] transition-colors duration-300 h-full relative overflow-hidden card-lift"
                    >
                      <div className="aspect-[16/9] mb-6 overflow-hidden bg-[var(--bone)] relative">
                        <Image
                          src={
                            cat.image ||
                            CATEGORY_FALLBACK_IMAGES[cat.slug] ||
                            HERO_IMAGE
                          }
                          alt={cat.name}
                          loading="lazy"
                          className="w-full h-full object-cover img-editorial hover-hover:group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(var(--ink-rgb),0.35)] via-transparent to-transparent" />
                      </div>

                      <span className="atelier-eyebrow text-sienna">
                        Collection
                      </span>
                      <h3 className="font-display text-xl text-ink group-hover:text-sienna transition-colors mt-1">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-xs text-ink-soft mt-2 line-clamp-2">
                          {cat.description}
                        </p>
                      )}

                      <div className="mt-6 pt-4 border-t border-hairline flex items-center justify-between">
                        <span className="text-label-caps text-xs text-sienna flex items-center gap-1 hover-hover:group-hover:translate-x-1 transition-transform duration-300">
                          Explore Collection{' '}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* LOOKBOOK MODAL — Spring-based entrance/exit                   */}
      {/* ============================================================ */}
      {/* Apple: spatial consistency — enters/exits from center.
         Emil: scale(0.95) initial (never 0), 400ms, exit faster.
         Taste-v1: atelier-scrim for consistent modal backdrop.       */}
      <AnimatePresence>
        {activeLookbookId && currentLookbook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeLookbook}
              className="absolute inset-0 atelier-scrim"
            />

            {/* Dialog */}
            <motion.div
              {...dialogProps}
              initial={
                reducedMotion
                  ? undefined
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.95, y: 20 }
              }
              transition={{
                duration: 0.4,
                ease: EASE_FLUID,
              }}
              className="relative z-10 w-full max-w-5xl max-h-[90vh] atelier-bg border border-hairline p-6 md:p-8 overflow-y-auto flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6 border-b border-hairline pb-4">
                <div>
                  <span className="atelier-eyebrow text-sienna">
                    {currentLookbook.subtitle}
                  </span>
                  <h3
                    id="lookbook-title"
                    className="atelier-display text-2xl md:text-3xl mt-1"
                  >
                    {currentLookbook.collectionTitle}{' '}
                    <em>Lookbook</em>
                  </h3>
                </div>

                <button
                  onClick={closeLookbook}
                  className="w-11 h-11 flex items-center justify-center text-ink-mute hover:text-ink border border-hairline hover:border-[rgba(var(--sienna-rgb),0.5)] transition-colors focus-visible:outline-offset-2 pressable"
                  aria-label="Close lookbook"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lookbook viewer — image + info split. */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-4">
                {/* Image — capped height on mobile. */}
                <div className="md:col-span-7 aspect-[3/4] max-h-[52vh] md:max-h-none mx-auto md:mx-0 relative overflow-hidden bg-[var(--bone)] border border-hairline">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeLookIndex}
                      src={
                        currentLookbook.looks[activeLookIndex]?.image
                      }
                      alt={
                        currentLookbook.looks[activeLookIndex]?.title
                      }
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          '/collections_fallback_hero.png';
                      }}
                      initial={
                        reducedMotion
                          ? undefined
                          : { opacity: 0, scale: 1.04 }
                      }
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE_FLUID,
                      }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Look counter + nav arrows */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[rgba(var(--ivory-rgb),0.9)] p-3 backdrop-blur-md border border-hairline">
                    <span className="text-label-caps text-xs text-sienna">
                      Look {activeLookIndex + 1} of{' '}
                      {currentLookbook.looks.length}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setActiveLookIndex((prev) =>
                            prev === 0
                              ? currentLookbook.looks.length - 1
                              : prev - 1
                          )
                        }
                        className="w-11 h-11 flex items-center justify-center text-ink-mute hover:text-ink border border-hairline hover:border-[rgba(var(--sienna-rgb),0.5)] transition-colors focus-visible:outline-offset-2 pressable"
                        aria-label="Previous look"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveLookIndex((prev) =>
                            prev ===
                            currentLookbook.looks.length - 1
                              ? 0
                              : prev + 1
                          )
                        }
                        className="w-11 h-11 flex items-center justify-center text-ink-mute hover:text-ink border border-hairline hover:border-[rgba(var(--sienna-rgb),0.5)] transition-colors focus-visible:outline-offset-2 pressable"
                        aria-label="Next look"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Look info + actions */}
                <div className="md:col-span-5 flex flex-col justify-between h-full">
                  <div>
                    <span className="atelier-eyebrow text-sienna block mb-2">
                      Selected Outfit
                    </span>
                    <h4 className="font-display text-xl text-ink mb-4">
                      {
                        currentLookbook.looks[activeLookIndex]
                          ?.title
                      }
                    </h4>

                    <p className="text-sm text-ink-mute leading-relaxed mb-6">
                      {
                        currentLookbook.looks[activeLookIndex]
                          ?.caption
                      }
                    </p>

                    <p className="text-xs text-ink-mute leading-relaxed border-t border-hairline pt-4">
                      {currentLookbook.description}
                    </p>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    {currentLookbook.looks[activeLookIndex]
                      ?.productSlug && (
                      <Link
                        to={`/products/${currentLookbook.looks[activeLookIndex].productSlug}`}
                        onClick={closeLookbook}
                        className="atelier-btn w-full text-center block pressable"
                      >
                        View Product Details
                      </Link>
                    )}

                    {currentLookbook.categorySlug && (
                      <Link
                        to={`/collections/${currentLookbook.categorySlug}`}
                        onClick={closeLookbook}
                        className="atelier-btn-ghost w-full text-center block pressable"
                      >
                        Explore Entire Category
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
