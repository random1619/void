import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariants } from '../../lib/animations';
import { ProductCard } from '../product/ProductCard';
import { FluidGrid } from '../ui/FluidGrid';
import { ProductSkeleton } from '../ui/LoadingSkeleton';
import api from '../../lib/api';
import type { Product } from '../../types';

const CURATED_SLUGS = [
  'atelier-silk-dress',
  'architectural-overcoat',
  'cashmere-storm-coat',
  'futuristic-leather-boots',
  'asymmetric-tailored-blazer',
  'geometric-leather-bag',
  'minimalist-leather-jacket',
  'square-toe-chelsea-boots',
];

export function CuratedProducts() {
  const { data: products, isLoading } = useQuery({
    queryKey: ['curated-collection-products'],
    queryFn: async () => {
      const { data } = await api.get<{ data: Product[] }>('/products?limit=50');
      const bySlug = new Map(data.data.map((p) => [p.slug, p]));
      return CURATED_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as Product[];
    },
  });

  return (
    <section id="pieces" aria-labelledby="pieces-heading" className="section-gap atelier-bg border-y border-hairline">
      <div className="container-void">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <motion.div variants={fadeUpVariants} className="text-center max-w-2xl mx-auto mb-16">
            <h2 id="pieces-heading" className="atelier-display text-[clamp(32px,4.5vw,56px)]">
              Curated for <em>the Series</em>
            </h2>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <ProductSkeleton count={8} />
            </div>
          ) : (
            <FluidGrid stagger={0.07}>
              {products?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </FluidGrid>
          )}
        </motion.div>
      </div>
    </section>
  );
}
