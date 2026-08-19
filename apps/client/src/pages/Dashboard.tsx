import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Package, Heart, MapPin, LogOut, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { Order, Product, Address } from '../types';
import { formatPrice, formatDate } from '../lib/utils';
import { fadeUpVariants, staggerContainer, staggerItem } from '../lib/animations';
import { toast } from 'sonner';
import { OrderSkeleton, AddressSkeleton } from '../components/ui/LoadingSkeleton';

/* ------------------------------------------------------------------ */
/* Shared ledger-row + card primitives for the account area.           */
/* ------------------------------------------------------------------ */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-8 h-px bg-sienna" aria-hidden="true" />
      <h2 className="atelier-display text-2xl md:text-3xl tracking-tight">{children}</h2>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  body,
  ctaLabel,
  ctaTo,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  ctaLabel: string;
  ctaTo: string;
}) {
  return (
    <div className="text-center py-16 px-6 border border-hairline bg-[var(--bone)]/30">
      <div className="w-14 h-14 rounded-full border border-hairline bg-[var(--ivory)] flex items-center justify-center text-sienna mx-auto mb-5">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <p className="font-display text-xl text-ink mb-2">{title}</p>
      <p className="text-ink-mute text-sm mb-7 max-w-xs mx-auto leading-relaxed">{body}</p>
      <Link to={ctaTo} className="atelier-btn inline-flex">
        {ctaLabel}
        <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Profile                                                             */
/* ------------------------------------------------------------------ */

function ProfileOverview() {
  const { user } = useAuthStore();
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>Profile</SectionHeading>
      </motion.div>

      <motion.div
        variants={staggerItem}
        className="atelier-card p-6 md:p-8"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-[var(--bone)] border border-hairline flex items-center justify-center text-sienna shrink-0">
            <User className="w-6 h-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-xl text-ink truncate">{user?.name}</p>
            <p className="text-sm text-ink-mute truncate">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-hairline">
          <div className="p-4 border border-hairline bg-[var(--ivory)]">
            <p className="atelier-eyebrow text-ink-mute text-[10px] mb-1.5">Role</p>
            <p className="text-ink font-display capitalize">{user?.role}</p>
          </div>
          <div className="p-4 border border-hairline bg-[var(--ivory)]">
            <p className="atelier-eyebrow text-ink-mute text-[10px] mb-1.5">Member Since</p>
            <p className="text-ink font-display">{user?.createdAt ? formatDate(user.createdAt) : '—'}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function OrdersOverview() {
  const reducedMotion = useReducedMotion();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/my-orders');
      return data.data;
    },
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>Order History</SectionHeading>
      </motion.div>

      {isLoading ? (
        <OrderSkeleton count={3} />
      ) : !orders?.length ? (
        <motion.div variants={staggerItem}>
          <EmptyState
            icon={Package}
            title="No orders yet"
            body="Your couture journey starts with a single piece."
            ctaLabel="Explore Products"
            ctaTo="/products"
          />
        </motion.div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: Order, i: number) => (
            <motion.div
              key={order._id}
              variants={staggerItem}
              className="atelier-card atelier-card-hover p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <span
                  className="font-mono text-[10px] text-ink-mute tracking-[0.18em] uppercase w-8 shrink-0"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-ink text-sm font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-ink-mute text-xs mt-0.5">
                    {formatDate(order.createdAt)} · {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider border border-hairline text-ink-mute capitalize">
                  {order.status}
                </span>
                <p className="font-display text-lg text-ink tabular-nums">{formatPrice(order.total)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Wishlist                                                            */
/* ------------------------------------------------------------------ */

function WishlistOverview() {
  const reducedMotion = useReducedMotion();
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/users/wishlist');
      return data.data;
    },
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>Wishlist</SectionHeading>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-hairline bg-[var(--bone)]/40">
              <div className="aspect-[3/4]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[var(--bone)] rounded w-3/4" />
                <div className="h-3 bg-[var(--bone)] rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !wishlist?.length ? (
        <motion.div variants={staggerItem}>
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            body="Save pieces you love for your next visit."
            ctaLabel="Discover Pieces"
            ctaTo="/products"
          />
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {wishlist.map((product: Product) => (
            <motion.div key={product._id} variants={staggerItem}>
              <Link
                to={`/products/${product.slug}`}
                className="group block atelier-card atelier-card-hover overflow-hidden"
              >
                <div className="aspect-[3/4] bg-[var(--bone)] overflow-hidden">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0].url}
                      alt={product.images[0].alt || product.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-sienna" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="p-3.5">
                  <p className="text-ink text-sm font-display truncate group-hover:text-sienna transition-colors">
                    {product.name}
                  </p>
                  <p className="text-sienna text-sm mt-1 tabular-nums">{formatPrice(product.price)}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Addresses                                                           */
/* ------------------------------------------------------------------ */

function AddressesOverview() {
  const reducedMotion = useReducedMotion();
  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data } = await api.get('/users/addresses');
      return data.data;
    },
  });

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>Saved Addresses</SectionHeading>
      </motion.div>

      {isLoading ? (
        <AddressSkeleton count={2} />
      ) : !addresses?.length ? (
        <motion.div variants={staggerItem}>
          <EmptyState
            icon={MapPin}
            title="No saved addresses"
            body="Addresses can be saved during checkout."
            ctaLabel="Start Shopping"
            ctaTo="/products"
          />
        </motion.div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr: Address, i: number) => (
            <motion.div
              key={addr._id ?? i}
              variants={staggerItem}
              className="atelier-card p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <span
                  className="font-mono text-[10px] text-ink-mute tracking-[0.18em] uppercase w-8 shrink-0 pt-1"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-ink text-sm font-semibold">
                    {addr.firstName} {addr.lastName}
                  </p>
                  <p className="text-ink-mute text-sm mt-1">{addr.street}</p>
                  <p className="text-ink-mute text-sm">
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                </div>
              </div>
              {addr.isDefault && (
                <span className="px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider bg-sienna/10 text-sienna border border-sienna/20 shrink-0">
                  Default
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell — editorial header + ledger sidebar + routed content          */
/* ------------------------------------------------------------------ */

const sidebarLinks = [
  { label: 'Profile', to: '/dashboard', icon: User },
  { label: 'Orders', to: '/dashboard/orders', icon: Package },
  { label: 'Wishlist', to: '/dashboard/wishlist', icon: Heart },
  { label: 'Addresses', to: '/dashboard/addresses', icon: MapPin },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const reducedMotion = useReducedMotion();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <main className="min-h-[100dvh] atelier-bg text-ink antialiased overflow-x-hidden">
      {/* Editorial header */}
      <section className="container-void pt-28 pb-8 md:pt-36 md:pb-12">
        <motion.div
          variants={staggerContainer}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <motion.div variants={fadeUpVariants} className="lg:col-span-8">
            <p className="atelier-eyebrow text-sienna mb-5 inline-flex items-center gap-3">
              <span className="w-8 h-px bg-sienna" aria-hidden="true" />
              Private Client Area
            </p>
            <h1 className="atelier-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              The <em>Ledger</em>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUpVariants}
            className="lg:col-span-4 text-ink-soft text-base md:text-lg leading-relaxed lg:pb-2 max-w-sm"
          >
            Your orders, reservations, and addresses. Kept in one quiet place.
          </motion.p>
        </motion.div>
      </section>

      <section className="container-void pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Sidebar ledger */}
          <aside className="md:col-span-3">
            <nav
              aria-label="Account sections"
              className="md:sticky md:top-28 border border-hairline bg-[var(--ivory)]"
            >
              <div className="px-5 py-4 border-b border-hairline flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--bone)] border border-hairline flex items-center justify-center text-sienna shrink-0">
                  <User className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-ink text-sm font-display truncate">{user?.name}</p>
                  <p className="text-ink-mute text-[11px] truncate">{user?.email}</p>
                </div>
              </div>

              <div className="p-2 flex md:flex-col gap-1 overflow-x-auto">
                {sidebarLinks.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      aria-current={isActive ? 'page' : undefined}
                      className={`pressable flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap min-h-[44px] transition-colors ${
                        isActive
                          ? 'bg-[var(--ink)] text-[var(--ivory)]'
                          : 'text-ink-mute hover:text-ink hover:bg-[var(--bone)]/50'
                      }`}
                    >
                      <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {link.label}
                    </Link>
                  );
                })}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="pressable flex items-center gap-3 px-4 py-3 text-sm whitespace-nowrap min-h-[44px] text-sienna hover:bg-sienna/10 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                    Admin Panel
                  </Link>
                )}
              </div>

              <div className="p-2 border-t border-hairline">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="pressable w-full flex items-center gap-3 px-4 py-3 text-sm min-h-[44px] text-ink-mute hover:text-sienna transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* Routed content */}
          <div className="md:col-span-9 min-w-0">
            <Routes>
              <Route path="/" element={<ProfileOverview />} />
              <Route path="/orders" element={<OrdersOverview />} />
              <Route path="/wishlist" element={<WishlistOverview />} />
              <Route path="/addresses" element={<AddressesOverview />} />
            </Routes>
          </div>
        </div>
      </section>
    </main>
  );
}
