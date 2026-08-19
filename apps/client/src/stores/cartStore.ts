import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Colorway, Product } from '../types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, colorway: Colorway, size: string, quantity?: number, priceOverride?: number) => void;
  removeItem: (productId: string, colorway: string, size: string) => void;
  updateQuantity: (productId: string, colorway: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, colorway, size, quantity = 1, priceOverride) => {
        const unitPrice = priceOverride ?? product.price;
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product._id === product._id &&
              item.colorway.name === colorway.name &&
              item.size === size
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              { product, colorway, size, quantity, price: unitPrice },
            ],
          };
        });
      },

      removeItem: (productId, colorway, size) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product._id === productId &&
                item.colorway.name === colorway &&
                item.size === size)
          ),
        }));
      },

      updateQuantity: (productId, colorway, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, colorway, size);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId &&
            item.colorway.name === colorway &&
            item.size === size
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: 'void-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
