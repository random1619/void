import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters } from '../../types';
import { springs } from '../../lib/motion-tokens';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useSpringPress } from '../../hooks/useSpringPress';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Editorial Picks', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Coveted', value: 'rating' },
] as const;

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

interface FilterBarProps {
  filters: ProductFilters;
  activeChips: { key: string; label: string; clear: () => void }[];
  onUpdate: (key: string, value: string | undefined) => void;
  onClearAll: () => void;
  onToggleMobileFilters: () => void;
  showMobileFilters: boolean;
}

/** Magnetic size chip — pulls toward cursor, springs on press. */
function SizeChip({
  size,
  active,
  onClick,
}: {
  size: string;
  active: boolean;
  onClick: () => void;
}) {
  const magnetic = useMagnetic({ range: 6 });
  const press = useSpringPress({ scale: 0.94, stiffness: 400, damping: 25 });

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
      className={`min-w-[44px] h-[44px] px-2.5 text-xs font-display rounded-lg transition-[background-color,border-color,color] duration-200 ease-out border focus-visible:outline-offset-2 ${
        active
          ? 'border-[var(--sienna)] text-[var(--sienna)] bg-[rgba(180,85,45,0.06)]'
          : 'border-hairline text-ink-mute hover:border-[var(--ink)] hover:text-ink'
      }`}
    >
      {size}
    </motion.button>
  );
}

/** Magnetic toggle pill — subtle cursor pull + spring press. */
function TogglePill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  const magnetic = useMagnetic({ range: 8 });
  const press = useSpringPress({ scale: 0.95, stiffness: 380, damping: 28 });

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
      className={`inline-flex items-center h-[44px] px-4 text-xs font-display rounded-full transition-[background-color,border-color,color] duration-200 ease-out border focus-visible:outline-offset-2 ${
        active
          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]'
          : 'border-hairline text-ink-mute hover:border-[var(--ink)] hover:text-ink'
      }`}
    >
      {label}
    </motion.button>
  );
}

/** Magnetic clear chip — for active filter dismiss. */
function ClearChip({ label, onClear }: { label: string; onClear: () => void }) {
  const magnetic = useMagnetic({ range: 6 });
  const press = useSpringPress({ scale: 0.94, stiffness: 400, damping: 25 });

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
      onClick={onClear}
      className="inline-flex items-center gap-1.5 px-3 min-h-[44px] text-xs rounded-full border border-[var(--sienna)] text-[var(--sienna)] hover:bg-[var(--sienna)] hover:text-[var(--ivory)] transition-colors focus-visible:outline-offset-2"
      aria-label={`Remove filter: ${label}`}
    >
      {label}
      <X className="w-3 h-3" aria-hidden="true" />
    </motion.button>
  );
}

/**
 * FilterBar — the entire filtering & sorting surface, inline above the grid.
 * One horizontal pill row (desktop) collapses to a slide-down panel (mobile).
 *
 * Upgrades: magnetic hover on all interactive elements (Apple direct manipulation),
 * spring press feedback (Emil physical feel), spring-based sort menu entrance.
 */
export function FilterBar({
  filters,
  activeChips,
  onUpdate,
  onClearAll,
  onToggleMobileFilters,
  showMobileFilters,
}: FilterBarProps) {
  const reducedMotion = useReducedMotion();
  const isSizeSelected = (size: string) => filters.sizes?.includes(size) ?? false;

  return (
    <section
      aria-label="Filter and sort the collection"
      className="border-y border-hairline bg-[var(--ivory)]/88 backdrop-blur-md sticky top-[101px] z-30"
    >
      <div className="container-void py-4">
        {/* Desktop row — single horizontal affordance */}
        <div className="hidden lg:flex items-center gap-6">
          <span className="atelier-eyebrow !text-[11px] text-ink-mute shrink-0">
            Refine
          </span>

          {/* Sort */}
          <SortMenu value={filters.sortBy ?? 'newest'} onChange={(v) => onUpdate('sortBy', v)} />

          {/* Divider */}
          <span className="w-px h-5 bg-hairline" aria-hidden="true" />

          {/* Size chips */}
          <div className="flex items-center gap-2" role="group" aria-label="Filter by size">
            <span className="atelier-eyebrow !text-[11px] text-ink-mute mr-1">Size</span>
            {SIZE_OPTIONS.map((size) => (
              <SizeChip
                key={size}
                size={size}
                active={isSizeSelected(size)}
                onClick={() => {
                  const current = filters.sizes || [];
                  const next = isSizeSelected(size)
                    ? current.filter((s) => s !== size)
                    : [...current, size];
                  onUpdate('sizes', next.length ? next.join(',') : undefined);
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <span className="w-px h-5 bg-hairline" aria-hidden="true" />

          {/* Quick toggles */}
          <div className="flex items-center gap-2">
            <TogglePill
              label="New Arrivals"
              active={!!filters.isNew}
              onClick={() => onUpdate('isNew', filters.isNew ? undefined : 'true')}
            />
            <TogglePill
              label="On Sale"
              active={!!filters.onSale}
              onClick={() => onUpdate('onSale', filters.onSale ? undefined : 'true')}
            />
            <TogglePill
              label="Featured"
              active={!!filters.featured}
              onClick={() => onUpdate('featured', filters.featured ? undefined : 'true')}
            />
          </div>

          <span className="flex-1" />

          {/* Active filter count + clear */}
          {activeChips.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="atelier-eyebrow text-ink-mute hover:text-sienna underline underline-offset-4 transition-colors focus-visible:outline-offset-2"
            >
              Clear {activeChips.length} filter{activeChips.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>

        {/* Mobile row — collapsed, expands via AnimatePresence */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <MobileFilterButton
            onClick={onToggleMobileFilters}
            expanded={showMobileFilters}
            count={activeChips.length}
          />
          <SortMenu value={filters.sortBy ?? 'newest'} onChange={(v) => onUpdate('sortBy', v)} compact />
        </div>

        {/* Mobile expansion */}
        <AnimatePresence initial={false}>
          {showMobileFilters && (
            <motion.div
              id="mobile-filters-panel"
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, transition: springs.gentle }
              }
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, transition: springs.gentle }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 space-y-5 border-t border-hairline mt-4">
                <div>
                  <span className="atelier-eyebrow text-ink-mute block mb-2">Size</span>
                  <div className="flex flex-wrap gap-2">
                    {SIZE_OPTIONS.map((size) => (
                      <SizeChip
                        key={size}
                        size={size}
                        active={isSizeSelected(size)}
                        onClick={() => {
                          const current = filters.sizes || [];
                          const next = isSizeSelected(size)
                            ? current.filter((s) => s !== size)
                            : [...current, size];
                          onUpdate('sizes', next.length ? next.join(',') : undefined);
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <TogglePill
                    label="New Arrivals"
                    active={!!filters.isNew}
                    onClick={() => onUpdate('isNew', filters.isNew ? undefined : 'true')}
                  />
                  <TogglePill
                    label="On Sale"
                    active={!!filters.onSale}
                    onClick={() => onUpdate('onSale', filters.onSale ? undefined : 'true')}
                  />
                  <TogglePill
                    label="Featured"
                    active={!!filters.featured}
                    onClick={() => onUpdate('featured', filters.featured ? undefined : 'true')}
                  />
                </div>

                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearAll}
                    className="atelier-eyebrow text-sienna underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active chips — second row, present on both viewports */}
        <AnimatePresence initial={false}>
          {activeChips.length > 0 && (
            <motion.ul
              initial={reducedMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0, transition: springs.gentle }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4, transition: springs.gentle }}
              className="flex flex-wrap items-center gap-2 pt-3"
              aria-label="Active filters"
            >
              {activeChips.map((chip) => (
                <li key={chip.key}>
                  <ClearChip label={chip.label} onClear={chip.clear} />
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/** Mobile filter toggle button with magnetic pull. */
function MobileFilterButton({
  onClick,
  expanded,
  count,
}: {
  onClick: () => void;
  expanded: boolean;
  count: number;
}) {
  const magnetic = useMagnetic({ range: 8 });
  const press = useSpringPress({ scale: 0.94, stiffness: 400, damping: 25 });

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
      aria-expanded={expanded}
      aria-controls="mobile-filters-panel"
      className={`flex items-center gap-2 px-3.5 h-[44px] border rounded-lg transition-colors focus-visible:outline-offset-2 ${
        expanded
          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--ivory)]'
          : 'border-hairline text-ink hover:border-[var(--ink)]'
      }`}
    >
      <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
      <span className="atelier-eyebrow !text-[11px]">Refine</span>
      {count > 0 && (
        <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] bg-[var(--sienna)] text-[var(--ivory)] rounded-full">
          {count}
        </span>
      )}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Sort menu — controlled popover, fully keyboard navigable.           */
/* Spring-based entrance for the dropdown.                             */
/* ------------------------------------------------------------------ */

function SortMenu({
  value,
  onChange,
  compact = false,
}: {
  value: string;
  onChange: (v: string) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion() === true;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`inline-flex items-center gap-2 h-[44px] px-3 text-sm text-ink hover:text-sienna transition-colors rounded-lg focus-visible:outline-offset-2 ${
          compact ? 'border border-hairline px-3 min-w-[160px] justify-between' : ''
        }`}
      >
        <span className="atelier-eyebrow !text-[11px] text-ink-mute mr-1 hidden xl:inline">Sort</span>
        <span className="font-display text-sm">{current.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-ink-mute" aria-hidden="true" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.96 }}
            animate={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 350, damping: 30 } }
            }
            exit={
              reducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -8, scale: 0.96, transition: { duration: 0.15 } }
            }
            className="absolute right-0 top-[48px] min-w-[220px] atelier-card shadow-2xl z-40 py-2 rounded-xl overflow-hidden"
            style={{ transformOrigin: 'top right' }}
          >
            {SORT_OPTIONS.map((opt) => {
              const selected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm font-display transition-colors focus-visible:outline-offset-[-2px] flex items-center justify-between ${
                      selected
                        ? 'text-[var(--sienna)] font-semibold'
                        : 'text-ink hover:bg-[var(--ivory-deep)]'
                    }`}
                  >
                    {opt.label}
                    {selected && <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="text-[var(--sienna)]">·</motion.span>}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
