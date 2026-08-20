import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsStringEnum,
} from 'nuqs';
import { useMemo, useCallback } from 'react';
import type { ProductFilters } from '../types';

type SortOption = NonNullable<ProductFilters['sortBy']>;
const sortOptions: SortOption[] = ['featured', 'price_asc', 'price_desc', 'newest', 'rating'];

export const productFilterParsers = {
  category: parseAsString.withDefault(''),
  brand: parseAsString.withDefault(''),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  sizes: parseAsArrayOf(parseAsString, ',').withDefault([]),
  featured: parseAsBoolean.withDefault(false),
  isNew: parseAsBoolean.withDefault(false),
  onSale: parseAsBoolean.withDefault(false),
  search: parseAsString.withDefault(''),
  sortBy: parseAsStringEnum<SortOption>(sortOptions).withDefault('newest'),
};

/**
 * Type-safe URL query state for product catalog filtering.
 * Powered by `nuqs` for automatic serialization, history management, and shareable URLs.
 */
export function useProductFilters() {
  const [filterState, setFilterState] = useQueryStates(productFilterParsers, {
    history: 'push',
    shallow: true,
  });

  const filters = useMemo<ProductFilters>(() => ({
    category: filterState.category || undefined,
    brand: filterState.brand || undefined,
    minPrice: filterState.minPrice ?? undefined,
    maxPrice: filterState.maxPrice ?? undefined,
    sizes: filterState.sizes.length > 0 ? filterState.sizes : undefined,
    featured: filterState.featured || undefined,
    isNew: filterState.isNew || undefined,
    onSale: filterState.onSale || undefined,
    search: filterState.search || undefined,
    sortBy: filterState.sortBy || 'newest',
  }), [filterState]);

  const updateFilter = useCallback(
    (key: string, value: string | undefined | null | boolean | number | string[]) => {
      setFilterState((prev) => {
        const next = { ...prev };
        if (key === 'sizes') {
          if (Array.isArray(value)) {
            next.sizes = value;
          } else if (typeof value === 'string') {
            next.sizes = value ? value.split(',').filter(Boolean) : [];
          } else {
            next.sizes = [];
          }
        } else if (key === 'minPrice' || key === 'maxPrice') {
          (next as any)[key] = value !== undefined && value !== null && value !== '' ? Number(value) : null;
        } else if (key === 'featured' || key === 'isNew' || key === 'onSale') {
          (next as any)[key] = value === true || value === 'true';
        } else if (key in next) {
          (next as any)[key] = (value as any) ?? null;
        }
        return next;
      });
    },
    [setFilterState]
  );

  const clearAllFilters = useCallback(() => {
    setFilterState({
      category: null,
      brand: null,
      minPrice: null,
      maxPrice: null,
      sizes: null,
      featured: null,
      isNew: null,
      onSale: null,
      search: null,
      sortBy: 'newest',
    });
  }, [setFilterState]);

  return {
    filterState,
    filters,
    setFilterState,
    updateFilter,
    clearAllFilters,
  };
}
