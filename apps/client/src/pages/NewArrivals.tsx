import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNewArrivals } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { FluidGrid } from '../components/ui/FluidGrid';
import { ProductSkeleton } from '../components/ui/LoadingSkeleton';
import type { Product } from '../types';
import { Image } from '../components/ui/Image';

function ArrivalFeature({ product }: { product: Product }) {
  return (
    <article className="grid min-h-[72vh] grid-cols-1 lg:grid-cols-12 border-y border-hairline">
      <Link to={`/products/${product.slug}`} className="group relative min-h-[54vh] overflow-hidden bg-[var(--bone)] lg:col-span-7 lg:min-h-full">
        <Image
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-luxury hover-hover:group-hover:scale-[1.025]"
          loading="eager"
          fetchPriority="high"
        />
        <span className="absolute left-5 top-5 bg-[var(--ivory)] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
          First release
        </span>
      </Link>
      <div className="flex flex-col justify-between bg-[var(--ink)] px-6 py-10 text-[var(--ivory)] md:px-12 md:py-14 lg:col-span-5 lg:px-16">
        <div className="flex items-center justify-between border-b border-white/20 pb-4 font-mono text-xs uppercase tracking-[0.18em] text-white/60">
          <span>Arrival 001</span>
          <span>{typeof product.category === 'string' ? product.category : product.category.name}</span>
        </div>
        <div className="py-16 lg:py-8">
          <h2 className="atelier-display max-w-[9ch] text-[clamp(48px,6vw,86px)] leading-[0.92] text-[var(--ivory)]">
            {product.name}
          </h2>
          <p className="mt-7 max-w-[42ch] text-base leading-relaxed text-white/70">{product.description}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/20 pt-6">
          <p className="font-display text-2xl tabular-nums">${product.price.toLocaleString()}</p>
          <Link to={`/products/${product.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--ivory)] hover:text-white">
            Discover the piece <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function NewArrivals() {
  const { data: arrivals, isLoading, isError, refetch } = useNewArrivals();
  const reducedMotion = useReducedMotion();
  const [lead, ...rest] = arrivals ?? [];

  return (
    <main className="min-h-[100dvh] atelier-bg text-ink">
      <header className="container-void pb-12 pt-32 lg:pb-16 lg:pt-40">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="atelier-display text-[clamp(58px,10vw,138px)] leading-[0.82] tracking-[-0.035em]">
            New <em className="text-sienna">Arrivals</em>
          </h1>
          <p className="mt-8 max-w-[38ch] text-base leading-relaxed text-ink-soft md:text-lg">
            The latest work from the atelier, released in limited runs and presented in the order it arrived.
          </p>
          <div className="mt-7 flex items-center justify-between border-t border-hairline pt-4 font-mono text-xs uppercase tracking-[0.18em] text-ink-mute">
            <span>Release journal</span><span>{String(arrivals?.length ?? 0).padStart(2, '0')} pieces</span>
          </div>
        </motion.div>
      </header>

      {isLoading ? (
        <div className="container-void grid grid-cols-1 gap-6 pb-24 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => <ProductSkeleton key={index} />)}
        </div>
      ) : isError ? (
        <section className="container-void border-y border-hairline section-gap-sm text-center">
          <h2 className="atelier-display text-4xl">The release journal is unavailable.</h2>
          <button type="button" onClick={() => refetch()} className="atelier-btn mt-7">Try again</button>
        </section>
      ) : !lead ? (
        <section className="container-void border-y border-hairline section-gap-sm text-center">
          <h2 className="atelier-display text-4xl">The next release is being prepared.</h2>
          <Link to="/products" className="atelier-btn mt-7">Explore all pieces</Link>
        </section>
      ) : (
        <>
          <ArrivalFeature product={lead} />
          <section className="container-void section-gap" aria-labelledby="release-index">
            <div className="mb-12 flex items-end justify-between gap-6 border-b border-hairline pb-5">
              <h2 id="release-index" className="atelier-display text-[clamp(34px,5vw,64px)]">The release index</h2>
              <span className="hidden font-mono text-xs uppercase tracking-[0.18em] text-ink-mute sm:block">Newest first</span>
            </div>
            <FluidGrid stagger={0.06}>
              {rest.map((product) => <ProductCard key={product._id} product={product} />)}
            </FluidGrid>
          </section>
        </>
      )}

      <section className="atelier-bg-deep border-t border-hairline">
        <div className="container-void flex flex-col justify-between gap-8 section-gap-sm md:flex-row md:items-end">
          <h2 className="atelier-display max-w-[12ch] text-4xl md:text-6xl">Looking for a piece from an earlier release?</h2>
          <Link to="/products" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-ink hover:text-sienna">
            Open the full catalogue <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
