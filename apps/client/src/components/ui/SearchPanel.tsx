import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
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

/* ─────────────────────────────────────────────────────────────────── */
/* SearchPanel — Ivory Atelier command bar.                            */
/* A recessed bone seat for the field, a hairline-ruled result ledger,  */
/* and a sienna focus ring read as machined rather than browser-default. */
/* The panel enters from the top — same axis the nav button lives on —   */
/* and every result row is a 44px+ target with a clear focus state.      */
/* ─────────────────────────────────────────────────────────────────── */

export function SearchPanel() {
  const { isSearchOpen, openSearch, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const reducedMotion = useReducedMotion();
  const { dialogProps } = useDialog<HTMLDivElement>({
    open: isSearchOpen,
    onClose: closeSearch,
    labelledById: SEARCH_TITLE_ID,
  });

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSearchOpen) {
          closeSearch();
        } else {
          openSearch();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, openSearch, closeSearch]);

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
            transition={reducedMotion ? { duration: 0.18 } : springs.snappy}
          >
            <div className="container-void py-6 md:py-8">
              <h2 id={SEARCH_TITLE_ID} className="sr-only">
                Search
              </h2>

              {/* Recessed search seat */}
              <div className="atelier-seat flex items-center gap-3 sm:gap-4 px-4 sm:px-5 rounded-lg">
                <Search className="w-5 h-5 text-ink-mute shrink-0" aria-hidden="true" />
                <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
                  Search products
                </label>
                <input
                  ref={inputRef}
                  id={SEARCH_INPUT_ID}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the atelier…"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-ink text-lg outline-none placeholder-ink-mute min-h-[44px]"
                />
                <AnimatePresence>
                  {trimmed && (
                    <motion.button
                      key="clear"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={springs.snappy}
                      onClick={() => setQuery('')}
                      className="pressable w-9 h-9 flex items-center justify-center text-ink-mute hover:text-ink transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
                <button
                  onClick={closeSearch}
                  className="pressable text-ink-mute hover:text-ink transition-colors p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div aria-live="polite">
                {/* Loading — skeleton rows keep the ledger shape steady */}
                {isLoading && (
                  <div className="mt-6" role="status" aria-label="Searching">
                    <div className="animate-pulse space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 p-3">
                          <div className="w-12 h-14 bg-[var(--bone)] flex-shrink-0" />
                          <div className="space-y-2 flex-1">
                            <div className="h-3 w-1/3 bg-[var(--bone)]" />
                            <div className="h-2.5 w-1/5 bg-[var(--bone)]" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <span className="sr-only">Searching products…</span>
                  </div>
                )}

                {/* Results ledger */}
                {!isLoading && results.length > 0 && (
                  <div className="mt-6">
                    <p className="atelier-eyebrow text-ink-mute mb-3">
                      {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                    <div
                      className="border-t border-hairline max-h-[60vh] overflow-y-auto"
                      role="region"
                      aria-label="Search results"
                    >
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          to={`/products/${product.slug}`}
                          onClick={reset}
                          className="group flex items-center gap-4 p-3 sm:px-4 text-left hover:bg-[var(--bone)] transition-colors border-b border-hairline focus-visible:outline-none focus-visible:bg-[var(--bone)]"
                        >
                          <div className="w-12 h-14 bg-[var(--bone)] flex-shrink-0 flex items-center justify-center group-hover:bg-[var(--ivory-deep)] transition-colors">
                            {product.images?.[0] ? (
                              <Image src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-3 h-3 rounded-full bg-sienna" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-ink text-sm font-display truncate">{product.name}</p>
                            <p className="text-ink-mute text-xs">{product.brand}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-sienna text-sm font-display">{formatPrice(product.price)}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-ink-faint group-hover:text-sienna group-hover:translate-x-0.5 transition-[color,transform] duration-300" aria-hidden="true" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {!isLoading && hasSearched && results.length === 0 && (
                  <div className="mt-6 text-center py-10 border border-hairline">
                    <p className="text-ink font-display text-lg mb-2">No pieces matched your search</p>
                    <p className="text-ink-mute text-sm mb-5">Try a different term, or browse the full collection</p>
                    <Link
                      to="/products"
                      onClick={reset}
                      className="atelier-btn-ghost"
                      aria-label="View the full collection"
                    >
                      View the Collection
                    </Link>
                  </div>
                )}

                {/* Quick suggestions on initial open */}
                {!isLoading && !hasSearched && (
                  <div className="mt-8 space-y-6">
                    <div>
                      <span className="block font-mono text-[9px] uppercase tracking-widest text-ink-mute mb-3 font-bold">
                        Suggested Categories & Silhouettes
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {['Tailoring', 'Outerwear', 'Japanese Denim', 'Silk', 'Footwear', 'Chronograph'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setQuery(tag)}
                            className="pressable px-3 py-1.5 rounded-full bg-[var(--bone)] hover:bg-sienna hover:text-white border border-hairline font-mono text-xs uppercase tracking-wider text-ink transition-colors duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-3 text-ink-faint atelier-eyebrow text-[10px]">
                      <div className="flex items-center gap-2">
                        <span>SEARCH COMMAND</span>
                        <kbd className="inline-block px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-hairline font-mono text-[10px] text-ink-mute font-bold">
                          ⌘K / Ctrl+K
                        </kbd>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>DISMISS</span>
                        <kbd className="inline-block px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 border border-hairline font-mono text-[10px] text-ink-mute font-bold">
                          ESC
                        </kbd>
                      </div>
                    </div>
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