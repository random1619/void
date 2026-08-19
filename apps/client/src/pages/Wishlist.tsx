import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Heart, Trash2, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSpringPress } from '../hooks/useSpringPress';
import { useMagnetic } from '../hooks/useMagnetic';
import { useWishlistStore } from '../stores/wishlistStore';
import api from '../lib/api';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';
import { Image } from '../components/ui/Image';

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

/**
 * Magnetic "View" link — pulls toward cursor with spring press.
 */
function MagneticViewLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  const magnetic = useMagnetic({ range: 6, stiffness: 300, damping: 25, mass: 0.4 });
  const press = useSpringPress({ scale: 0.94, stiffness: 400, damping: 20, mass: 0.5 });

  return (
    <motion.a
      ref={magnetic.ref as React.Ref<HTMLAnchorElement>}
      href={to}
      className={className}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      style={{ ...magnetic.style, ...press.style }}
    >
      {children}
    </motion.a>
  );
}

/**
 * Magnetic remove button with spring press.
 */
function MagneticRemoveButton({ onClick, children, 'aria-label': ariaLabel }: { onClick: () => void; children: React.ReactNode; 'aria-label': string }) {
  const magnetic = useMagnetic({ range: 4, stiffness: 350, damping: 25, mass: 0.4 });
  const press = useSpringPress({ scale: 0.9, stiffness: 500, damping: 18, mass: 0.3 });

  return (
    <motion.button
      ref={magnetic.ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      aria-label={ariaLabel}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      className="p-2.5 rounded-full border border-hairline text-ink-mute hover:text-sienna hover:border-sienna/40 hover:bg-[var(--bone)] transition-colors"
      style={{ ...magnetic.style, ...press.style }}
    >
      {children}
    </motion.button>
  );
}

/**
 * A single wishlist row. The image is real product imagery, the link
 * navigates to the product detail page, and removal is wired to the
 * shared wishlist store so the heart state stays in sync everywhere.
 */
function WishlistRow({ product, index }: { product: Product; index: number }) {
  const removeItem = useWishlistStore((s) => s.removeItem);
  const reducedMotion = useReducedMotion();

  const image = product.images?.[0];

  return (
    <motion.article
      layout
      key={product._id}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: EASE_FLUID }}
      className="group flex items-center justify-between px-6 md:px-8 py-6 hover:bg-[var(--bone)]/40 transition-colors"
    >
      <Link
        to={`/products/${product.slug}`}
        className="flex items-center gap-5 md:gap-6 min-h-[44px] flex-1"
      >
        <div className="h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden bg-[var(--bone)] shrink-0 border border-hairline/60">
          {image ? (
            <Image
              src={image.url}
              alt={image.alt || product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.04]"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-mono text-[10px] text-ink-mute">IMG</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink group-hover:text-sienna transition-colors truncate">
            {product.name}
          </h3>
          <p className="font-mono text-[11px] text-ink-mute uppercase tracking-[0.14em]">
            {typeof product.category === 'string' ? product.category : product.category?.name}
          </p>
          <p className="font-display text-base text-ink mt-1">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <MagneticViewLink
          to={`/products/${product.slug}`}
          className="btn-island inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-full bg-ink text-ivory hover:bg-sienna transition-colors shadow-sm"
        >
          View <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </MagneticViewLink>
        <MagneticRemoveButton
          onClick={() => removeItem(product._id)}
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </MagneticRemoveButton>
      </div>
    </motion.article>
  );
}

export default function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  const hasSynced = useWishlistStore((s) => s.hasSynced);
  const syncWithServer = useWishlistStore((s) => s.syncWithServer);
  const clearAll = useWishlistStore((s) => s.clearAll);
  const reducedMotion = useReducedMotion();

  // Seed the store with the server's wishlist exactly once (per persisted
  // `hasSynced`). Afterwards the local store is the single source of truth,
  // so removals/additions on this page and on product cards stay in sync.
  useEffect(() => {
    if (!hasSynced) syncWithServer();
  }, [hasSynced, syncWithServer]);

  // Resolve the currently saved ids against the catalogue (offline-safe: the
  // mock API serves /users/wishlist and product detail lookups).
  const { data: products } = useQuery({
    queryKey: ['wishlist', 'resolved', items],
    queryFn: async () => {
      if (!items.length) return [] as Product[];
      const resolved = await Promise.all(
        items.map(async (id) => {
          const { data } = await api.get<{ success: boolean; data: Product }>(`/products/${id}`);
          return data.data;
        })
      );
      return resolved.filter((p): p is Product => Boolean(p));
    },
    enabled: items.length > 0,
  });

  const resolved = products ?? [];

  return (
    <main className="min-h-[100dvh] atelier-bg">
      {/* Editorial Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-ink/5 via-transparent to-atelier-bg pointer-events-none" />
        <div className="container-void pt-36 pb-12 relative z-10">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_FLUID }}
          >
            <div className="font-mono text-[11px] text-ink-mute tracking-widest uppercase mb-4">
              Curated Selection
            </div>
            <h1 className="atelier-display text-[clamp(3rem,8vw,7rem)] leading-[0.95] tracking-[-0.04em] text-ink max-w-5xl">
              Your <span className="italic font-serif text-sienna">Wishlist</span>
            </h1>
            <p className="mt-6 text-lg font-light text-ink-soft max-w-xl leading-relaxed">
              A personal curation of pieces reserved in silence. Each selection reflects intention over impulse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* List container */}
      <section className="container-void pb-24 relative">
        <div className="atelier-card rounded-3xl overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-hairline/30">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-ink text-ivory">
                <Heart className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-ink leading-none">Saved Pieces</h2>
                <p className="font-mono text-[10px] text-ink-mute mt-1 tracking-wide">{resolved.length} ITEMS RESERVED</p>
              </div>
            </div>
            {resolved.length > 0 && (
              <button
                onClick={clearAll}
                className="btn-island-ghost text-xs px-4 py-2 rounded-full border border-hairline hover:border-sienna transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Items */}
          <div className="divide-y divide-hairline/20">
            <AnimatePresence initial={false}>
              {resolved.map((product, idx) => (
                <WishlistRow key={product._id} product={product} index={idx} />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty state */}
          {resolved.length === 0 && (
            <div className="px-8 py-20 text-center">
              <Heart className="h-10 w-10 text-hairline mx-auto mb-4" aria-hidden="true" />
              <p className="text-ink-soft font-light">Your wishlist is empty.</p>
              <p className="text-xs text-ink-mute font-mono mt-1">No reserved pieces at this time.</p>
              <Link
                to="/products"
                className="atelier-btn inline-flex items-center gap-3 mt-8"
              >
                Explore the Collection
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}