import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import api from '../lib/api';
import type { Category, Product, PaginatedResponse } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { FluidGrid } from '../components/ui/FluidGrid';
import { ProductSkeleton, PageLoader } from '../components/ui/LoadingSkeleton';

export default function CollectionDetail() {
  const { slug } = useParams<{ slug: string }>();

  const { data: category, isLoading: loadingCat, isError: catError } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Category }>(`/categories/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });

  const { data: products, isLoading: loadingProducts, isError: productsError } = useQuery({
    queryKey: ['products', 'category', category?._id],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Product>>(`/products?category=${category!._id}&limit=20`);
      return data.data;
    },
    enabled: !!category?._id,
  });

  if (loadingCat) return <PageLoader />;

  if (catError || !category) {
    return (
      <div className="min-h-[100dvh] pt-24 flex items-center justify-center px-4 atelier-bg text-ink">
        <div className="text-center border border-hairline bg-[var(--bone)]/40 p-10 md:p-16 max-w-lg">
          <h1 className="atelier-display text-3xl mb-3">
            {catError ? 'Collection unavailable' : 'Collection not found'}
          </h1>
          <p className="text-ink-mute mb-8">
            {catError
              ? 'We could not load this collection right now. Please try again later.'
              : "The collection you're looking for doesn't exist or has been moved."}
          </p>
          <Link
            to="/collections"
            className="atelier-btn inline-block"
          >
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[100dvh] pt-24 pb-16 atelier-bg text-ink"
    >
      <div className="container-void">
        <div className="flex items-center gap-2 text-sm text-ink-mute mb-8">
          <Link to="/collections" className="hover:text-sienna transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink">{category.name}</span>
        </div>

        <div className="mb-12">
          <span className="atelier-eyebrow text-sienna block mb-3">Collection</span>
          <h1 className="atelier-display text-4xl sm:text-5xl">{category.name}</h1>
          {category.description && <p className="text-ink-mute mt-4 max-w-2xl measure">{category.description}</p>}
        </div>

        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={8} />
          </div>
        ) : productsError ? (
          <div className="text-center py-20 border border-hairline bg-[var(--bone)]/40">
            <p className="text-ink font-display text-lg mb-2">Unable to load products</p>
            <p className="text-ink-mute text-sm">Please try refreshing the page.</p>
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-20 border border-hairline bg-[var(--bone)]/40">
            <p className="text-ink font-display text-lg mb-2">This collection is currently empty</p>
            <p className="text-ink-mute text-sm mb-6">Check back soon for new arrivals.</p>
            <Link
              to="/products"
              className="atelier-btn inline-block"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <FluidGrid>
            {products?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </FluidGrid>
        )}
      </div>
    </motion.div>
  );
}
