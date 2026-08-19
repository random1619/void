import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Lock } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { formatPrice } from '../lib/utils';
import { fadeUpVariants } from '../lib/animations';
import { computeCartTotals } from '../lib/cartCosts';
import { toast } from 'sonner';
import api from '../lib/api';
import { TrustBadges } from '../components/ui/TrustBadges';

export default function Checkout() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discount: number;
  } | null>(null);

  const subtotal = getSubtotal();

  const isShippingValid =
    address.firstName.trim() &&
    address.lastName.trim() &&
    address.street.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.zip.trim() &&
    address.phone.trim();

  const missingFields = [
    !address.firstName.trim() && 'First Name',
    !address.lastName.trim() && 'Last Name',
    !address.street.trim() && 'Street Address',
    !address.city.trim() && 'City',
    !address.state.trim() && 'State',
    !address.zip.trim() && 'ZIP',
    !address.phone.trim() && 'Phone',
  ].filter(Boolean) as string[];

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      discount = Math.round(subtotal * (appliedCoupon.value / 100) * 100) / 100;
    } else {
      discount = appliedCoupon.value;
    }
  }
  const totals = computeCartTotals(subtotal, discount);
  const { shipping, tax, total } = totals;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponCode.trim(),
        subtotal,
      });
      setAppliedCoupon(data.data);
      toast.success('Coupon applied successfully');
    } catch (err) {
      console.error('[checkout] coupon validation failed', err);
      // The api interceptor handles showing the actual error message toast.
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        colorway: item.colorway.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        image: item.product.images?.[0]?.url,
      }));

      const { data } = await api.post('/payments/create-checkout-session', {
        items: orderItems,
        shippingAddress: address,
        couponCode: appliedCoupon?.code || undefined,
      });

      if (data.data.url) {
        // SECURITY: Validate redirect URL is from trusted Stripe domain
        try {
          const redirectUrl = new URL(data.data.url);
          const allowedHosts = ['checkout.stripe.com', 'hooks.stripe.com'];
          if (allowedHosts.includes(redirectUrl.hostname)) {
            window.location.href = data.data.url;
          } else {
            throw new Error('Invalid redirect domain');
          }
        } catch {
          toast.error('Payment redirect failed. Please try again.');
          setLoading(false);
          return;
        }
      } else {
        const orderRes = await api.post('/orders', {
          items: items.map((item) => ({
            product: item.product._id,
            colorway: { name: item.colorway.name, hex: item.colorway.hex },
            size: item.size,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: address,
          couponCode: appliedCoupon?.code || undefined,
        });

        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${orderRes.data.data._id}`);
      }
    } catch (err) {
      console.error('[checkout] payment failed', err);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="atelier-bg min-h-[100dvh] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center atelier-card rounded-3xl p-10 md:p-16 max-w-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-sienna/10 border border-sienna/20 flex items-center justify-center mx-auto text-sienna">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <p className="atelier-eyebrow text-sienna mb-2">Checkout Reserved</p>
            <h1 className="atelier-display text-3xl sm:text-4xl mb-3 text-ink">Your selection is empty</h1>
            <p className="text-ink-mute text-sm max-w-sm mx-auto font-light leading-relaxed">
              Add a statement garment or timekeeper from the atelier before initiating secure checkout.
            </p>
          </div>
          <Link
            to="/products"
            className="btn-island-primary inline-flex"
          >
            <span>Explore The Collection</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="atelier-bg text-ink min-h-[100dvh] pt-36 pb-16"
    >
      <div className="container-void max-w-5xl">
        <p className="atelier-eyebrow text-sienna mb-1">Secure Acquisition</p>
        <h1 className="atelier-display text-4xl sm:text-5xl mb-8">Checkout</h1>

        {/* Progress Stepper */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className={`flex items-center gap-3 ${step >= 1 ? 'text-sienna' : 'text-ink-mute'}`}
            aria-current={step === 1 ? 'step' : undefined}
            aria-label="Step 1: Shipping"
          >
            <motion.div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${step >= 1 ? 'border-sienna bg-sienna text-ivory shadow-sm' : 'border-hairline'}`}
              aria-hidden="true"
              initial={false}
              animate={step >= 1 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 400, damping: 18 }}
            >
              1
            </motion.div>
            <span className="text-sm font-display font-semibold">Shipping Address</span>
          </div>
          <div className={`flex-1 h-px ${step >= 2 ? 'bg-sienna' : 'bg-hairline'}`} aria-hidden="true" />
          <div
            className={`flex items-center gap-3 ${step >= 2 ? 'text-sienna' : 'text-ink-mute'}`}
            aria-current={step === 2 ? 'step' : undefined}
            aria-label="Step 2: Payment"
          >
            <motion.div
              className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${step >= 2 ? 'border-sienna bg-sienna text-ivory shadow-sm' : 'border-hairline'}`}
              aria-hidden="true"
              initial={false}
              animate={step >= 2 ? { scale: [1, 1.12, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 400, damping: 18 }}
            >
              2
            </motion.div>
            <span className="text-sm font-display font-semibold">Payment & Review</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 1 ? (
              <motion.form
                variants={fadeUpVariants}
                initial="hidden"
                animate="visible"
                onSubmit={handleAddressSubmit}
                className="atelier-card rounded-2xl p-6 md:p-8 space-y-5"
              >
                <div className="border-b border-hairline pb-3">
                  <h2 className="text-xl text-ink font-display font-bold">Courier Destination</h2>
                  <p className="text-xs text-ink-mute mt-0.5">Please provide the delivery address for insured signature dispatch.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="ship-firstName" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">First Name</label>
                    <input
                      id="ship-firstName"
                      type="text"
                      value={address.firstName}
                      onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                      required
                      autoComplete="given-name"
                      className="atelier-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-lastName" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">Last Name</label>
                    <input
                      id="ship-lastName"
                      type="text"
                      value={address.lastName}
                      onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                      required
                      autoComplete="family-name"
                      className="atelier-input"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ship-street" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">Street Address</label>
                  <input
                    id="ship-street"
                    type="text"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    required
                    autoComplete="street-address"
                    placeholder="Suite, apartment, or street name"
                    className="atelier-input"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="ship-city" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">City</label>
                    <input
                      id="ship-city"
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                      autoComplete="address-level2"
                      className="atelier-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-state" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">State / Region</label>
                    <input
                      id="ship-state"
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                      autoComplete="address-level1"
                      className="atelier-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="ship-zip" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">Postal Code</label>
                    <input
                      id="ship-zip"
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      required
                      autoComplete="postal-code"
                      className="atelier-input"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="ship-phone" className="text-xs font-mono uppercase tracking-wider text-ink-mute mb-1.5 block">Phone Number (For Courier Verification)</label>
                  <input
                    id="ship-phone"
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    autoComplete="tel"
                    placeholder="+1 (555) 000-0000"
                    className="atelier-input"
                  />
                </div>
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={!isShippingValid}
                    whileTap={!isShippingValid ? undefined : { scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="btn-island-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Proceed to Payment</span>
                  </motion.button>
                  {!isShippingValid && (
                    <p className="text-xs text-sienna mt-3 text-center" role="alert">
                      Please complete required fields: {missingFields.join(', ')}
                    </p>
                  )}
                </div>
              </motion.form>
            ) : (
              <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="space-y-6">
                <h2 className="text-lg text-ink font-display">Payment</h2>
                <div className="atelier-card p-6 space-y-4">
                  <div className="flex items-center gap-3 text-ink-mute">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Secure payment powered by Stripe</span>
                  </div>
                  <div className="atelier-seat p-4">
                    <div className="flex items-center gap-2 text-ink-mute mb-4">
                      <CreditCard className="w-5 h-5" />
                      <span className="text-sm">Card details</span>
                    </div>
                    <p className="text-xs text-ink-mute">
                      In production, Stripe Elements would render here for secure card input.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <motion.button
                    onClick={() => setStep(1)}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="atelier-btn-ghost"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    onClick={handlePayment}
                    disabled={loading}
                    whileTap={!loading ? { scale: 0.97 } : undefined}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="atelier-btn flex-1 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </motion.button>
                </div>
                <div className="mt-5">
                  <TrustBadges />
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 atelier-card p-6 space-y-4">
              <h3 className="atelier-eyebrow text-ink">Order Summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto font-sans">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-12 h-16 bg-[var(--bone)] flex-shrink-0 border border-hairline">
                      {item.product.images?.[0] ? (
                        <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-sienna" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="text-ink">{item.product.name}</p>
                      <p className="text-ink-mute text-xs">{item.colorway.name} / {item.size} x {item.quantity}</p>
                    </div>
                    <span className="text-ink text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <hr className="atelier-rule" />
              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <label htmlFor="checkout-coupon" className="sr-only">Promo code</label>
                  <input
                    id="checkout-coupon"
                    type="text"
                    placeholder="PROMO CODE"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-transparent border border-hairline text-ink text-xs outline-none focus:border-[var(--sienna)] uppercase tracking-wider font-sans placeholder:text-ink-mute/60 atelier-seat"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 bg-[var(--ink)] text-ivory text-xs font-semibold tracking-wider hover:bg-sienna transition-colors disabled:opacity-50 font-sans"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="flex justify-between items-center bg-[rgba(var(--sienna-rgb),0.08)] border border-[rgba(var(--sienna-rgb),0.3)] px-3 py-2 text-xs">
                  <span className="text-sienna font-display uppercase tracking-wider font-semibold">
                    {appliedCoupon.code} Applied
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                    aria-label={`Remove promo code ${appliedCoupon.code}`}
                  >
                    Remove
                  </button>
                </div>
              )}

              <hr className="atelier-rule" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ink-mute">Subtotal</span><span className="text-ink">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink-mute">Shipping</span><span className="text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-ink-mute">Tax</span><span className="text-ink">{formatPrice(tax)}</span></div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sienna">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <hr className="atelier-rule" />
                <div className="flex justify-between text-lg"><span className="text-ink font-display">Total</span><span className="text-sienna font-display">{formatPrice(total)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
