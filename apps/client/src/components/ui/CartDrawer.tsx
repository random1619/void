import { motion, AnimatePresence, useReducedMotion, usePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { formatPrice } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useDialog } from '../../hooks/useDialog';
import { useDismissibleSheet } from '../../hooks/useDismissibleSheet';
import { FreeShippingProgress } from './FreeShippingProgress';
import type { CartItem } from '../../types';

const CART_TITLE_ID = 'cart-drawer-title';
export const CART_PANEL_ID = 'cart-drawer-panel';

function getItemMaxStock(item: CartItem): number {
  const size = item.product.sizes?.find((s: any) => s.label === item.size);
  return size?.stock ?? 99;
}

function CartDrawerPanel() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const { panelRef, dialogProps } = useDialog<HTMLDivElement>({
    open: isOpen,
    onClose: closeCart,
    labelledById: CART_TITLE_ID,
  });
  const reducedMotion = useReducedMotion() === true;
  const [isPresent, safeToRemove] = usePresence();

  // One MotionValue is the single source of truth for the gesture AND the
  // dismissal spring: a release continues from the finger's current position
  // without competing with the exit transform (interruptibility, §3).
  const sheet = useDismissibleSheet({
    present: isPresent,
    onExitComplete: () => safeToRemove?.(),
    onDismiss: closeCart,
    reducedMotion,
    panelRef,
  });

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const maxStock = getItemMaxStock(item);
    const next = item.quantity + delta;
    if (next > maxStock) return;
    updateQuantity(item.product._id, item.colorway.name, item.size, Math.max(0, next));
  };

  return (
    <>
      <motion.div
        className="atelier-scrim fixed inset-0 z-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reducedMotion ? { duration: 0.18 } : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        onClick={closeCart}
      />
      <motion.div
        {...dialogProps}
        id={CART_PANEL_ID}
        className="fixed right-0 top-0 h-[100dvh] w-full max-w-md atelier-bg atelier-sheet border-l border-hairline z-overlay flex flex-col"
        initial={false}
        style={{ x: sheet.x, opacity: reducedMotion ? sheet.panelOpacity : sheet.dragOpacity }}
        {...sheet.bind}
      >
        <div className="p-6 border-b border-hairline flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <h2 id={CART_TITLE_ID} className="font-display text-2xl text-ink">
              Your Cart
            </h2>
            {items.length > 0 && (
              <Link
                to="/cart"
                onClick={closeCart}
                className="atelier-link text-[10px] text-ink-mute hover:text-ink whitespace-nowrap focus-visible:outline-offset-2"
              >
                View full cart
              </Link>
            )}
          </div>
          <button
            onClick={closeCart}
            className="pressable text-ink-mute hover:text-ink transition-colors p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-offset-2"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-ink-mute text-center">
              <p className="font-display text-xl mb-3 text-ink">Your cart is empty</p>
              <p className="text-sm text-ink-mute mb-8 max-w-xs">Explore the atelier to begin a selection.</p>
              <Link
                to="/products"
                onClick={closeCart}
                className="atelier-btn"
              >
                View the Collection
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.product._id}-${item.colorway.name}-${item.size}`} className="atelier-card flex gap-4 p-4">
                <Link
                  to={`/products/${item.product.slug}`}
                  onClick={closeCart}
                  className="w-20 h-24 bg-[var(--bone)] flex-shrink-0 flex items-center justify-center border border-hairline overflow-hidden focus-visible:border-sienna"
                  aria-label={`View ${item.product.name}`}
                >
                  {item.product.images?.[0] ? (
                    <img src={item.product.images[0].url} alt={item.product.name} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-4 h-4 bg-sienna rounded-full" />
                  )}
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={closeCart}
                      className="font-display text-ink text-base hover:text-sienna transition-colors focus-visible:outline-offset-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-ink-mute mt-1">{item.colorway.name} / {item.size}</p>
                    <p className="text-sm text-sienna font-display mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center atelier-seat">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="pressable flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1.5 hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-sm text-ink min-w-[2rem] text-center" aria-live="polite" aria-atomic="true">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="pressable flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1.5 hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-0 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Increase quantity of ${item.product.name}`}
                        disabled={item.quantity >= getItemMaxStock(item)}
                        title={item.quantity >= getItemMaxStock(item) ? 'Maximum stock reached' : undefined}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-ink font-display text-sm">{formatPrice(item.price * item.quantity)}</span>
                      <button
                        onClick={() => removeItem(item.product._id, item.colorway.name, item.size)}
                        className="pressable flex items-center justify-center min-w-[44px] min-h-[44px] text-ink-mute hover:text-sienna transition-colors p-1 focus-visible:outline-offset-2"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-hairline atelier-bg-deep space-y-4">
          {items.length > 0 && (
            <FreeShippingProgress subtotal={getSubtotal()} variant="compact" />
          )}
          <div className="flex justify-between items-center text-ink">
            <span className="atelier-eyebrow !text-[11px]">Subtotal</span>
            <span className="font-display text-xl text-sienna">{formatPrice(getSubtotal())}</span>
          </div>
          <Link
            to="/checkout"
            onClick={closeCart}
            className="atelier-btn w-full flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </>
  );
}

export function CartDrawer() {
  const { isOpen } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && <CartDrawerPanel key="cart-drawer" />}
    </AnimatePresence>
  );
}
