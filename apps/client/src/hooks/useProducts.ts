import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Product, ProductFilters, PaginatedResponse } from '../types';

export function useProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      Object.entries({ ...filters, page: pageParam, limit: 12 }).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
              value.forEach((v) => params.append(key, v));
            } else {
              params.append(key, String(value));
            }
          }
        }
      );
      const { data } = await api.get<PaginatedResponse<Product>>(
        `/products?${params.toString()}`
      );
      return data;
    },
    getNextPageParam: (lastPage) => {
      // Handle both real PaginatedResponse and mock { success, data } shapes
      const hasMore = lastPage.hasMore ?? (lastPage.data && lastPage.data.length === 12);
      const currentPage = lastPage.page ?? 1;
      return hasMore ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Product }>(
        `/products/${slug}`
      );
      return data.data;
    },
    enabled: !!slug,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Product[] }>(
        '/products?featured=true&limit=6'
      );
      return data.data;
    },
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Product[] }>(
        '/products?isNew=true&limit=8&sortBy=newest'
      );
      return data.data;
    },
  });
}
