import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { springs } from '../../lib/motion-tokens';
import { useDialog } from '../../hooks/useDialog';
import { Image } from './Image';

const SEARCH_INPUT_ID = 'search-panel-input';
const SEARCH_TITLE_ID = 'search-panel-title';
export const SEARCH_PANEL_ID = 'search-panel';

export function SearchPanel() {
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const { dialogProps } = useDialog<HTMLDivElement>({
    open: isSearchOpen,
    onClose: closeSearch,
    labelledById: SEARCH_TITLE_ID,
  });

  const trimmed = query.trim();
  const { data, isLoading } = useQuery({
    queryKey: ['search', trimmed],
    queryFn: async () => {
      if (!trimmed) return [];
      const { data } = await api.get<{ data: Product[] }>(`/products?search=${encodeURIComponent(trimmed)}&limit=8`);
      return data.data;
    },
    enabled: trimmed.length > 1,
  });

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      // Delay focus slightly to let the panel entrance animation begin
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isSearchOpen]);

  const reset = () => {
    setQuery('');
    closeSearch();
  };

  const results = data ?? [];
  const hasSearched = trimmed.length > 1;

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            className="fixed inset-0 atelier-scrim z-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.gentle}
            onClick={closeSearch}
          />
          <motion.div
            {...dialogProps}
            id={SEARCH_PANEL_ID}
            className="fixed top-0 left-0 right-0 z-overlay atelier-bg border-b border-hairline"
            initial={reducedMotion ? { opacity: 0 } : { y: '-100%', scale: 0.99 }}
            animate={reducedMotion ? { opacity: 1 } : { y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { y: '-100%', scale: 0.99 }}
            transition={
              reducedMotion
                ? { duration: 0.18 }
                : springs.snappy
            }
          >
            <div className="container-void py-6">
              <h2 id={SEARCH_TITLE_ID} className="sr-only">
                Search
              </h2>
              <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-ink-mute" aria-hidden="true" />
                <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
                  Search products
                </label>
                <input
                  ref={inputRef}
                  id={SEARCH_INPUT_ID}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-ink text-lg outline-none placeholder-ink-mute"
                />
                <button
                  onClick={closeSearch}
                  className="pressable text-ink-mute hover:text-ink transition-colors p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-offset-2"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div aria-live="polite">
                {isLoading && (
                  <div className="mt-6 flex items-center justify-center gap-3 text-ink-mute" role="status">
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span className="text-sm">Searching products...</span>
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="mt-6">
                    <p className="atelier-eyebrow text-ink-mute mb-3">
                      {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                    <div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto"
                      role="region"
                      aria-label="Search results"
                    >
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product.slug}`}
                          onClick={reset}
                          className="flex gap-3 p-3 text-left hover:bg-[var(--bone)] transition-colors border border-hairline focus-visible:border-sienna"
                        >
                          <div className="w-16 h-20 bg-[var(--bone)] flex-shrink-0 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <Image src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-sienna" />
                            )}
                          </div>
                          <div>
                            <p className="text-ink text-sm font-display">{product.name}</p>
                            <p className="text-ink-mute text-xs">{product.brand}</p>
                            <p className="text-sienna text-sm mt-1 font-display">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading && hasSearched && results.length === 0 && (
                  <div className="mt-6 text-center py-8 border border-hairline">
                    <p className="text-ink font-display text-lg mb-2">No pieces matched your search</p>
                    <p className="text-ink-mute text-sm mb-4">Try a different term, or browse the full collection</p>
                    <Link
                      to="/products"
                      onClick={reset}
                      className="atelier-link atelier-eyebrow text-ink text-[11px] inline-flex items-center gap-1.5"
                    >
                      View the Collection
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
