import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft, AlertTriangle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { formatPrice } from '../lib/utils';
import { toast } from 'sonner';
import { fadeUpVariants, staggerContainer } from '../lib/animations';
import { computeCartTotals } from '../lib/cartCosts';
import { FreeShippingProgress } from '../components/ui/FreeShippingProgress';
import { useMagnetic } from '../hooks/useMagnetic';
import { useSpringPress } from '../hooks/useSpringPress';
import type { CartItem } from '../types';

function getItemMaxStock(item: CartItem): number {
  const size = item.product.sizes?.find((s: any) => s.label === item.size);
  return size?.stock ?? 99;
}

/**
 * Magnetic quantity stepper button — subtle cursor-follow with spring press.
 */
function MagneticQtyButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  const magnetic = useMagnetic({ range: 3, stiffness: 400, damping: 30, mass: 0.5 });
  const press = useSpringPress({ scale: 0.92, stiffness: 400, damping: 20, mass: 0.5 });

  return (
    <motion.button
      ref={magnetic.ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      onPointerMove={magnetic.onPointerMove}
      onPointerLeave={magnetic.onPointerLeave}
      onPointerDown={press.onPointerDown}
      onPointerUp={press.onPointerUp}
      onPointerCancel={press.onPointerCancel}
      className="flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1.5 text-ink-mute hover:text-ink hover:bg-[var(--bone)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      style={{ ...magnetic.style, ...press.style }}
    >
      {children}
    </motion.button>
  );
}

export default function Cart() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();
  const [confirmingClear, setConfirmingClear] = useState(false);
  const reducedMotion = useReducedMotion() === true;

  const totals = computeCartTotals(getSubtotal());

  const handleQuantityChange = (item: CartItem, delta: number) => {
    const maxStock = getItemMaxStock(item);
    const next = item.quantity + delta;
    if (next > maxStock) {
      toast.info(`Only ${maxStock} units available in ${item.size}`);
      return;
    }
    updateQuantity(item.product._id, item.colorway.name, item.size, Math.max(0, next));
  };

  const handleRemove = (item: CartItem) => {
    removeItem(item.product._id, item.colorway.name, item.size);
    toast.success(`${item.product.name} removed from cart`);
  };

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      className="atelier-bg text-ink min-h-[100dvh] pt-36 pb-16"
    >
      <div className="container-void">
        <p className="atelier-eyebrow text-sienna mb-1">Curated Selection</p>
        <h1 className="atelier-display text-4xl sm:text-5xl mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <motion.div
            variants={fadeUpVariants}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            className="text-center atelier-card rounded-3xl p-12 md:p-16 max-w-xl mx-auto space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-sienna/10 border border-sienna/20 flex items-center justify-center mx-auto text-sienna">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="atelier-eyebrow text-sienna mb-2">Empty Atelier</p>
              <h2 className="text-ink font-display text-2xl md:text-3xl mb-3">Your atelier awaits its first piece</h2>
              <p className="text-ink-mute text-sm max-w-sm mx-auto font-light leading-relaxed mb-6">
                Explore the seasonal archives or timeless horological monoliths to curate your selection.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="btn-island-primary"
              >
                <span>View Full Catalog</span>
                <span className="icon-pill">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
              <Link
                to="/watches"
                className="btn-island-ghost"
              >
                <span>Horology Edition</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              variants={staggerContainer}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
              className="lg:col-span-2 space-y-4"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={`${item.product._id}-${item.colorway.name}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      x: -120,
                      transition: { type: 'spring', stiffness: 420, damping: 32, duration: 0.35 },
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="atelier-card atelier-card-hover flex gap-4 p-4"
                  >
                    <Link
                      to={`/products/${item.product.slug}`}
                      className="w-24 h-32 bg-[var(--bone)] flex-shrink-0 flex items-center justify-center border border-hairline overflow-hidden focus-visible:border-[var(--sienna)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                      aria-label={`View ${item.product.name}`}
                    >
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-sienna" />
                      )}
                    </Link>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <Link
                          to={`/products/${item.product.slug}`}
                          className="font-display text-ink hover:text-sienna transition-colors focus-visible:outline-offset-2"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-ink-mute mt-1">
                          {item.colorway.name} / {item.size}
                        </p>
                        <p className="text-sm text-sienna font-display mt-1">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center atelier-seat">
                          <MagneticQtyButton
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= 1}
                            label={`Decrease quantity of ${item.product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </MagneticQtyButton>
                          <span className="px-3 text-sm text-ink min-w-[1.5rem] text-center" aria-live="polite" aria-atomic="true">{item.quantity}</span>
                          <MagneticQtyButton
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={item.quantity >= getItemMaxStock(item)}
                            label={`Increase quantity of ${item.product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </MagneticQtyButton>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-ink font-display">{formatPrice(item.price * item.quantity)}</span>
                          <button
                            onClick={() => handleRemove(item)}
                            className="pressable flex items-center justify-center min-w-[44px] min-h-[44px] text-ink-mute hover:text-sienna transition-colors p-1 focus-visible:outline-offset-2"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex justify-between items-center pt-4">
                {confirmingClear ? (
                  <span className="flex items-center gap-2 text-xs" role="group" aria-label="Confirm clearing cart">
                    <AlertTriangle className="w-3.5 h-3.5 text-sienna" aria-hidden="true" />
                    <span className="text-ink-mute">Clear all?</span>
                    <button
                      onClick={() => {
                        clearCart();
                        setConfirmingClear(false);
                        toast.success('Cart cleared');
                      }}
                      className="text-sienna hover:underline focus-visible:outline-offset-2"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmingClear(false)}
                      className="text-ink-mute hover:text-ink focus-visible:outline-offset-2"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingClear(true)}
                    className="text-sm text-ink-mute hover:text-sienna transition-colors focus-visible:outline-offset-2"
                  >
                    Clear Cart
                  </button>
                )}
                <Link to="/products" className="text-sm text-ink-mute hover:text-sienna transition-colors flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Continue Shopping
                </Link>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              variants={fadeUpVariants}
              initial={reducedMotion ? false : 'hidden'}
              animate="visible"
              className="lg:col-span-1"
            >
              <div className="sticky top-24 atelier-card p-6 space-y-6">
                <h2 className="atelier-eyebrow text-ink tracking-widest">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Subtotal</span>
                    <span className="text-ink">{formatPrice(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Shipping</span>
                    <span className="text-ink">{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-mute">Tax (est.)</span>
                    <span className="text-ink">{formatPrice(totals.tax)}</span>
                  </div>
                  <hr className="atelier-rule" />
                  <div className="flex justify-between text-lg">
                    <span className="text-ink font-display">Total</span>
                    <span className="text-sienna font-display">{formatPrice(totals.total)}</span>
                  </div>
                </div>

                {/* Free-shipping progress — surfaces how close the customer is
                    to the threshold instead of a static line of fine print. */}
                <FreeShippingProgress subtotal={totals.subtotal} />

                <Link
                  to="/checkout"
                  className="atelier-btn block w-full text-center"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
