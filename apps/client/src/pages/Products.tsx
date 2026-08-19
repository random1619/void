import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, useMotionValue, useSpring, animate } from 'framer-motion';
import { ArrowRight, LayoutGrid, Rows3 } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { FluidGrid } from '../components/ui/FluidGrid';
import { FilterBar } from '../components/product/FilterBar';
import { springs } from '../lib/motion-tokens';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSpringPress } from '../hooks/useSpringPress';
import type { ProductFilters, Product } from '../types';
import { Image } from '../components/ui/Image';

type ViewMode = 'grid' | 'editorial';

/** Ambient gradient background — subtle breathing orb. */
function PageAmbient() {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    const controls = [
      animate(y, [0, 40, 0, -40, 0], { duration: 14, ease: 'easeInOut', repeat: Infinity }),
      animate(x, [0, 30, 0, -30, 0], { duration: 18, ease: 'easeInOut', repeat: Infinity }),
    ];
    return () => controls.forEach(c => c.stop());
  }, [reducedMotion, x, y]);

  return (
    <motion.div
      style={{ x, y }}
      className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sienna/6 via-transparent to-transparent pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}

/** Magnetic view toggle button. */
function ViewToggle({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const magnetic = useMagnetic({ range: 6 });
  const press = useSpringPress({ scale: 0.94 });

  return (
    <motion.button
      ref={magnetic.ref as React.RefObject<HTMLButtonElement>}
      style={{ ...magnetic.style, ...press.style }}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={(e) => { magnetic.onPointerLeave(); press.onPointerLeave?.(e); }}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`flex items-center justify-center w-[44px] h-[44px] transition-colors focus-visible:outline-offset-2 ${
        active ? 'bg-[var(--ink)] text-[var(--ivory)]' : 'text-ink-mute hover:text-ink'
      }`}
    >
      <Icon className="w-4 h-4" aria-hidden="true" />
    </motion.button>
  );
}

/** Magnetic "View the piece" link for cover section. */
function MagneticCoverLink({ href, children }: { href: string; children: React.ReactNode }) {
  const magnetic = useMagnetic({ range: 10 });
  const press = useSpringPress({ scale: 0.96 });

  return (
    <motion.a
      ref={magnetic.ref as React.RefObject<HTMLAnchorElement>}
      href={href}
      style={{ ...magnetic.style, ...press.style }}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={(e) => { magnetic.onPointerLeave(); press.onPointerLeave?.(e); }}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      className="inline-flex min-h-11 items-center gap-2 atelier-link text-sm font-semibold text-ink"
    >
      {children}
    </motion.a>
  );
}

/** Parallax image for cover section. */
function ParallaxCoverImage({ src, alt }: { src: string; alt: string }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 22, mass: 1 });
  const springY = useSpring(y, { stiffness: 150, damping: 22, mass: 1 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(((centerX - e.clientX) / rect.width) * 14);
    y.set(((centerY - e.clientY) / rect.height) * 14);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 w-[108%] h-[108%] object-cover -left-[4%] -top-[4%]"
        style={{ x: springX, y: springY }}
      />
    </motion.div>
  );
}

/** Shimmer skeleton for loading state. */
function ShimmerSkeleton() {
  return (
    <div className="relative overflow-hidden bg-[var(--bone)] animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer-sweep_1.5s_infinite]" />
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const filters = useMemo<ProductFilters>(() => ({
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || undefined,
    featured: searchParams.get('featured') === 'true' || undefined,
    isNew: searchParams.get('isNew') === 'true' || undefined,
    onSale: searchParams.get('onSale') === 'true' || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as ProductFilters['sortBy']) || 'newest',
  }), [searchParams]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch } = useProducts(filters);

  const products = data?.pages.flatMap((page) => page.data) ?? [];

  const updateFilter = useCallback(
    (key: string, value: string | undefined) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      });
    },
    [setSearchParams]
  );

  const clearAllFilters = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  // Active filter chips, computed once. The `key` makes the list stable so
  // an unmounting chip doesn't re-mount the same one next to it.
  const activeFilterChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.category) chips.push({ key: `cat-${filters.category}`, label: filters.category, clear: () => updateFilter('category', undefined) });
    if (filters.brand) chips.push({ key: `brand-${filters.brand}`, label: filters.brand, clear: () => updateFilter('brand', undefined) });
    filters.sizes?.forEach((s) => chips.push({ key: `size-${s}`, label: `Size ${s}`, clear: () => updateFilter('sizes', filters.sizes!.filter((x) => x !== s).join(',') || undefined) }));
    if (filters.minPrice) chips.push({ key: 'min', label: `Min $${filters.minPrice}`, clear: () => updateFilter('minPrice', undefined) });
    if (filters.maxPrice) chips.push({ key: 'max', label: `Max $${filters.maxPrice}`, clear: () => updateFilter('maxPrice', undefined) });
    if (filters.onSale) chips.push({ key: 'sale', label: 'On Sale', clear: () => updateFilter('onSale', undefined) });
    if (filters.featured) chips.push({ key: 'feat', label: 'Featured', clear: () => updateFilter('featured', undefined) });
    if (filters.isNew) chips.push({ key: 'new', label: 'New Arrivals', clear: () => updateFilter('isNew', undefined) });
    if (filters.search) chips.push({ key: 'q', label: `"${filters.search}"`, clear: () => updateFilter('search', undefined) });
    return chips;
  }, [filters, updateFilter]);

  const headline = filters.featured
    ? { eyebrow: 'Curated', title: ['Editorial', 'Picks'], accent: 'Featured' }
    : filters.isNew
      ? { eyebrow: 'Newly Arrived', title: ['The Latest', 'in the Atelier'], accent: 'New' }
      : filters.onSale
        ? { eyebrow: 'Reduced', title: ['Considered', 'Pieces'], accent: 'On Sale' }
        : filters.search
          ? { eyebrow: 'Searching', title: ['Results for', 'Your Inquiry'], accent: `"${filters.search}"` }
          : { eyebrow: 'The Collection', title: ['Every Piece,', 'Considered'], accent: 'All' };

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '500px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.25 }}
      className="atelier-bg text-ink min-h-[100dvh] relative overflow-hidden"
    >
      {/* Ambient breathing gradient background. */}
      <PageAmbient />

      {/* Editorial cover band — eyebrow / oversized display / running meta.
          Sized like a magazine masthead, not a catalog title. */}
      <header className="pt-28 lg:pt-32 pb-10 lg:pb-14 border-b border-hairline relative z-10">
        <div className="container-void">
          <motion.div
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="lg:col-span-8"
            >
              <p className="atelier-eyebrow text-sienna mb-5 inline-flex items-center gap-3">
                <span className="w-8 h-px bg-sienna" aria-hidden="true" />
                {headline.eyebrow}
              </p>
              <h1 className="atelier-display text-[clamp(40px,7vw,96px)] leading-[0.96] tracking-[-0.03em]">
                {headline.title.map((line, i) => (
                  <span key={i} className="block overflow-hidden">
                    <motion.span
                      variants={{
                        hidden: { y: '110%', opacity: 0 },
                        visible: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
                      }}
                      className="block"
                    >
                      {i === 1 ? <em className="text-sienna">{line}</em> : line}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 } },
              }}
              className="lg:col-span-4 lg:pb-3"
            >
              <p className="text-ink-soft font-display text-lg lg:text-xl leading-snug max-w-sm">
                A curated index of pieces from the atelier.
                Refine by silhouette, size, or season.
              </p>
              <div className="mt-5 flex items-center gap-3 text-ink-mute">
                <span className="atelier-eyebrow">Index</span>
                <span className="font-display text-base text-ink tabular-nums">
                  {products.length.toString().padStart(2, '0')}
                </span>
                <span className="h-px flex-1 bg-hairline" aria-hidden="true" />
                <span className="atelier-eyebrow text-sienna">{headline.accent}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Filter bar — sticky, single horizontal rail on desktop, expandable on mobile. */}
      <FilterBar
        filters={filters}
        activeChips={activeFilterChips}
        onUpdate={updateFilter}
        onClearAll={clearAllFilters}
        onToggleMobileFilters={() => setShowMobileFilters((p) => !p)}
        showMobileFilters={showMobileFilters}
      />

      {/* Result meta strip — count + view toggle */}
      <div className="container-void mt-6 mb-4 flex items-center justify-between gap-4 relative z-10">
        <p className="text-sm text-ink-mute">
          <span className="font-display text-ink tabular-nums">{products.length}</span>
          {' '}piece{products.length !== 1 ? 's' : ''}
          {filters.search && (
            <> matching <span className="text-ink font-display">{`"${filters.search}"`}</span> </>
          )}
        </p>

        <div
          className="hidden md:inline-flex items-center border border-hairline rounded-lg overflow-hidden"
          role="group"
          aria-label="View mode"
        >
          <ViewToggle
            icon={LayoutGrid}
            label="Grid view"
            active={view === 'grid'}
            onClick={() => setView('grid')}
          />
          <div className="w-px h-6 bg-hairline" aria-hidden="true" />
          <ViewToggle
            icon={Rows3}
            label="Editorial view"
            active={view === 'editorial'}
            onClick={() => setView('editorial')}
          />
        </div>
      </div>

      {/* Body — the pieces */}
      <div className="container-void section-gap relative z-10">
        {isLoading ? (
          <ProductGridSkeleton view={view} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : products.length === 0 ? (
          <EmptyState onClear={clearAllFilters} hasFilters={activeFilterChips.length > 0} />
        ) : (
          /* The two view modes are separate mounted subtrees — the toggle
             crossfades them instead of sharing grid cells, so switching
             never reflows cards between layouts. Each subtree re-enters on
             its own FluidGrid cascade. */
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === 'grid' ? (
                <Grid products={products} />
              ) : (
                <EditorialList products={products} />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        <div ref={loadMoreRef} className="h-px" aria-hidden="true" />

        {/* Loading more — sits beneath the grid, never above it */}
        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center gap-3 text-ink-mute"
            >
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-sienna to-transparent animate-shimmer" />
              <span className="atelier-eyebrow">Revealing more pieces</span>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasNextPage && products.length > 0 && !isFetchingNextPage && (
          <motion.p
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={springs.gentle}
            className="pt-16 text-center atelier-eyebrow text-ink-mute"
          >
            End of the index
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Grid view — asymmetric, like a magazine spread. The first piece spans */
/* two columns on desktop so the page starts with a focal cover, then    */
/* settles into a uniform rhythm. On smaller screens the cover collapses */
/* back into the row.                                                     */
/* ─────────────────────────────────────────────────────────────────── */

function Grid({ products }: { products: Product[] }) {
  const [cover, ...rest] = products;

  return (
    <div className="space-y-12">
      {cover && (
        <motion.section
          aria-label="Featured piece"
          initial={{ opacity: 0, transform: 'translateY(12px)' }}
          animate={{ opacity: 1, transform: 'translateY(0)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center pb-10 border-b border-hairline"
        >
          <div className="lg:col-span-5 relative aspect-[3/4] atelier-frame overflow-hidden group">
            <ParallaxCoverImage
              src={cover.images?.[0]?.url || '/lookbook-1-alt.png'}
              alt={cover.images?.[0]?.alt || cover.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          <div className="lg:col-span-7 lg:pr-[12%]">
            <p className="text-sm font-medium text-sienna mb-3">Featured selection</p>
            <h2 className="atelier-display text-3xl lg:text-5xl mb-4 leading-[1.05]">
              {cover.name}
            </h2>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-lg text-ink">{cover.brand}</span>
              <span className="font-display text-xl text-sienna tabular-nums">${cover.price.toLocaleString()}</span>
              {cover.comparePrice && (
                <span className="text-sm text-ink-mute line-through tabular-nums">${cover.comparePrice.toLocaleString()}</span>
              )}
            </div>
            <p className="text-ink-soft text-base lg:text-lg leading-relaxed max-w-[52ch]">
              {cover.description || `${cover.name} from ${cover.brand}. A considered piece, photographed under atelier light.`}
            </p>
            <div className="mt-7">
              <MagneticCoverLink href={`/products/${cover.slug}`}>
                View the piece
                <ArrowRight className="w-4 h-4 text-sienna" aria-hidden="true" />
              </MagneticCoverLink>
            </div>
          </div>
        </motion.section>
      )}

      {/* Staggered grid entrance — FluidGrid owns the reveal (cascade on
          the luxury curve), the spring reflow when filters change, and the
          sibling focus-dim. Items key on product id so exits/entrances
          animate instead of hard-cutting. */}
      <FluidGrid key={`grid-${rest.length}`}>
        {rest.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </FluidGrid>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Editorial list view — single column, image + meta side-by-side, a hairline */
/* rule between each. Reads like a magazine contents page.                    */
/* ─────────────────────────────────────────────────────────────────── */

function EditorialList({ products }: { products: Product[] }) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
      }}
      className="divide-y divide-hairline border-y border-hairline"
    >
      {products.map((product, idx) => (
        <EditorialRow key={product._id} product={product} index={idx} />
      ))}
    </motion.ul>
  );
}

/** Magnetic editorial row — subtle cursor pull on hover. */
function EditorialRow({ product, index }: { product: Product; index: number }) {
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25, mass: 0.8 });

  const handlePointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (!e.currentTarget || reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    x.set(((e.clientX - centerX) / rect.width) * 4);
  };

  const handlePointerLeave = () => {
    x.set(0);
  };

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -16 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      style={{ x: springX }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="py-6 group cursor-pointer"
    >
      <Link
        to={`/products/${product.slug}`}
        className="grid grid-cols-12 gap-4 lg:gap-8 items-center focus-visible:outline-offset-4"
        aria-label={`View ${product.name} by ${product.brand}`}
      >
        <span className="col-span-1 atelier-eyebrow text-ink-mute tabular-nums group-hover:text-sienna transition-colors">
          {(index + 1).toString().padStart(2, '0')}
        </span>

        <div className="col-span-4 md:col-span-3 aspect-[3/4] overflow-hidden bg-[var(--bone)] border border-hairline relative">
          {product.images?.[0] ? (
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-display text-4xl text-ink-mute/30">V</span>
            </div>
          )}
        </div>

        <div className="col-span-7 md:col-span-6 min-w-0">
          <p className="atelier-eyebrow text-ink-mute mb-1">{product.brand}</p>
          <h3 className="font-display text-ink text-xl lg:text-2xl group-hover:text-sienna transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-ink-mute mt-2 line-clamp-2 max-w-md">
              {product.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            {product.colorways?.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-3 h-3 rounded-full border border-hairline"
                style={{ backgroundColor: c.hex }}
                aria-label={`Colorway ${c.name}`}
              />
            ))}
            {product.colorways && product.colorways.length > 4 && (
              <span className="atelier-eyebrow text-ink-mute">
                +{product.colorways.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="hidden md:flex col-span-2 flex-col items-end justify-center">
          <span className="text-sienna font-display text-xl tabular-nums">
            ${product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-ink-mute/70 line-through text-xs tabular-nums">
              ${product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
      </Link>
    </motion.li>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Skeleton — the grid feels like a real loading state, not a generic spinner. */
/* ─────────────────────────────────────────────────────────────────── */

function ProductGridSkeleton({ view }: { view: ViewMode }) {
  if (view === 'editorial') {
    return (
      <div className="divide-y divide-hairline border-y border-hairline">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-6 grid grid-cols-12 gap-4 lg:gap-8 items-center">
            <div className="col-span-1 h-3 w-6 bg-hairline" />
            <div className="col-span-4 md:col-span-3 aspect-[3/4] bg-[var(--bone)]">
              <ShimmerSkeleton />
            </div>
            <div className="col-span-7 md:col-span-6 space-y-2">
              <div className="h-2.5 w-16 bg-hairline" />
              <div className="h-5 w-3/4 bg-[var(--bone)]" />
              <div className="h-3 w-full bg-[var(--bone)]" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 pb-10 border-b border-hairline items-center">
        <div className="lg:col-span-5 aspect-[3/4] bg-[var(--bone)]">
          <ShimmerSkeleton />
        </div>
        <div className="lg:col-span-7 space-y-3">
          <div className="h-2.5 w-24 bg-hairline" />
          <div className="h-9 w-3/4 bg-[var(--bone)]" />
          <div className="h-3 w-full bg-[var(--bone)]" />
          <div className="h-3 w-2/3 bg-[var(--bone)]" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-8 lg:gap-y-14 pt-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-[var(--bone)]">
            <ShimmerSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Empty / error — atelier voice, never generic.                       */
/* ─────────────────────────────────────────────────────────────────── */

function EmptyState({ onClear, hasFilters }: { onClear: () => void; hasFilters: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
      className="py-24 text-center"
      role="status"
    >
      <p className="atelier-eyebrow text-sienna mb-4 inline-flex items-center gap-3 mx-auto">
        <span className="w-6 h-px bg-sienna" aria-hidden="true" />
        Empty Page
      </p>
      <h2 className="atelier-display text-3xl lg:text-4xl mb-3 max-w-md mx-auto leading-tight">
        The atelier found <em className="text-sienna">no pieces</em> matching your inquiry
      </h2>
      <p className="text-ink-mute text-sm max-w-sm mx-auto mb-8">
        {hasFilters
          ? 'Loosen a filter or two · there is something for you further down the index.'
          : 'The collection is between seasons. Check back as new pieces arrive.'}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="atelier-btn-ghost inline-flex items-center gap-2 focus-visible:outline-offset-4"
        >
          Clear all filters
        </button>
      )}
    </motion.div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-24 text-center"
      role="alert"
    >
      <p className="atelier-eyebrow text-sienna mb-4">A Moment of Difficulty</p>
      <h2 className="atelier-display text-3xl mb-3">Couldn't reach the atelier</h2>
      <p className="text-ink-mute text-sm max-w-sm mx-auto mb-8">
        The connection faltered. Try again · the index is usually a heartbeat away.
      </p>
      <button type="button" onClick={onRetry} className="atelier-btn-ghost focus-visible:outline-offset-4">
        Try again
      </button>
    </motion.div>
  );
}
