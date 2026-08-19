import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { Order } from '../types';
import { formatPrice, formatDate } from '../lib/utils';
import { fadeUpVariants } from '../lib/animations';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="atelier-bg min-h-[100dvh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="atelier-eyebrow text-ink-mute tracking-widest">VOID</div>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-sienna to-transparent animate-shimmer" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="atelier-bg text-ink min-h-[100dvh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <div>
          <p className="atelier-display text-2xl sm:text-3xl mb-2">Order not found</p>
          <p className="text-ink-mute text-sm">We couldn't locate this order. It may have been removed.</p>
        </div>
        <Link
          to="/home"
          className="atelier-btn inline-flex items-center gap-2"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="atelier-bg text-ink min-h-[100dvh] pt-24 pb-16"
    >
      <div className="container-void max-w-2xl">
        <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="text-center mb-12" role="status">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16, mass: 0.8, delay: 0.15 }}
            className="relative w-16 h-16 mx-auto mb-4"
          >
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border border-sienna/40"
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
            <CheckCircle className="w-16 h-16 text-sienna relative" aria-hidden="true" />
          </motion.div>
          <p className="atelier-eyebrow text-sienna mb-3">Thank You</p>
          <h1 className="atelier-display text-4xl sm:text-5xl">Order Confirmed</h1>
          <p className="text-ink-mute mt-3">Thank you for your purchase</p>
          <p className="text-sm text-ink-mute mt-1">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-ink-mute/70 mt-3">A confirmation has been sent to your email with these details.</p>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          className="border border-hairline bg-[var(--bone)]/40 p-6 space-y-6"
        >
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-sienna" />
            <div>
              <p className="text-ink text-sm">Order Status</p>
              <p className="text-sienna text-xs capitalize">{order.status}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-ink text-sm">Date</p>
              <p className="text-ink-mute text-xs">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <hr className="atelier-rule" />

          <div>
            <h3 className="atelier-eyebrow text-ink mb-3">Items</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <div>
                    <span className="text-ink">{typeof item.product === 'object' ? item.product.name : 'Product'}</span>
                    <span className="text-ink-mute ml-2">x{item.quantity}</span>
                    <span className="text-ink-mute ml-2">({item.size})</span>
                  </div>
                  <span className="text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="atelier-rule" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-mute">Subtotal</span><span className="text-ink">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-ink-mute">Shipping</span><span className="text-ink">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
            <div className="flex justify-between"><span className="text-ink-mute">Tax</span><span className="text-ink">{formatPrice(order.tax)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span className="text-ink-mute">Discount</span><span className="text-sienna">-{formatPrice(order.discount)}</span></div>}
            <hr className="atelier-rule" />
            <div className="flex justify-between text-lg"><span className="text-ink font-display">Total</span><span className="text-sienna font-display">{formatPrice(order.total)}</span></div>
          </div>

          <div>
            <h3 className="atelier-eyebrow text-ink mb-2">Shipping To</h3>
            <p className="text-sm text-ink-mute">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
          </div>
        </motion.div>

        <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="atelier-btn inline-flex items-center gap-2"
          >
            View Dashboard <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/products"
            className="atelier-btn-ghost inline-flex items-center gap-2"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
