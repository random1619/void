// ============================================
// Cart cost calculation — single source of truth
// ============================================
// Cart.tsx, CartDrawer.tsx, Checkout.tsx and OrderConfirmation.tsx all derive
// shipping/tax/total from the same business rules. Centralizing them here keeps
// the free-shipping threshold, flat fee and tax rate from drifting out of sync
// across the funnel. Adjust once, reflected everywhere.

export const FREE_SHIPPING_THRESHOLD = 200;
export const FLAT_SHIPPING_FEE = 15;
export const TAX_RATE = 0.08;

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  freeShipping: boolean;
  /** How much more the customer must spend to unlock free shipping (0 if unlocked). */
  amountToFreeShipping: number;
  /** Progress 0–1 toward the free-shipping threshold, for progress-bar UIs. */
  freeShippingProgress: number;
}

/**
 * Compute the full set of cart totals from a subtotal and optional discount.
 * Money values are rounded to 2dp to avoid float-pennies in the UI.
 */
export function computeCartTotals(
  subtotal: number,
  discount = 0
): CartTotals {
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shipping = freeShipping ? 0 : FLAT_SHIPPING_FEE;
  // Tax is applied to the discounted subtotal, not the pre-discount amount.
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round(taxable * TAX_RATE * 100) / 100;
  const total = Math.max(0, taxable + shipping + tax);
  const amountToFreeShipping = freeShipping
    ? 0
    : FREE_SHIPPING_THRESHOLD - subtotal;
  const freeShippingProgress = Math.min(
    1,
    subtotal / FREE_SHIPPING_THRESHOLD
  );

  return {
    subtotal,
    shipping,
    tax,
    discount,
    total,
    freeShipping,
    amountToFreeShipping,
    freeShippingProgress,
  };
}
