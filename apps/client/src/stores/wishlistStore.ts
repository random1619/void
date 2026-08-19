import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../lib/api';

interface WishlistStore {
  items: string[];
  /** True once a server sync (or a no-op seed) has run — persisted so a
   *  fresh store is seeded exactly once and later removals survive reloads. */
  hasSynced: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  toggleItem: (productId: string) => void;
  clearAll: () => void;
  isWishlisted: (productId: string) => boolean;
  syncWithServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      hasSynced: false,

      addItem: (productId) =>
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items
            : [...state.items, productId],
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),

      toggleItem: (productId) => {
        if (get().isWishlisted(productId)) {
          get().removeItem(productId);
        } else {
          get().addItem(productId);
        }
      },

      clearAll: () => set({ items: [] }),

      isWishlisted: (productId) => get().items.includes(productId),

      syncWithServer: async () => {
        try {
          const { data } = await api.get('/wishlist');
          const serverItems = data.data.map((p: { _id: string }) => p._id);
          set((state) =>
            state.hasSynced || state.items.length
              ? { hasSynced: true } // local edits win; never overwrite them
              : { items: serverItems, hasSynced: true }
          );
        } catch {
          // Fallback to local; mark synced so we don't retry and clobber edits
          set({ hasSynced: true });
        }
      },
    }),
    { name: 'void-wishlist' }
  )
);
