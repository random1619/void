import { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { AdminAnalytics } from '../types';
import { formatPrice } from '../lib/utils';
import { staggerContainer, staggerItem, fadeUpVariants } from '../lib/animations';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';
import { Image } from '../components/ui/Image';

/* Shared input class — recessed seat with sienna focus. */
const FIELD =
  'w-full px-4 py-3 text-sm text-ink bg-[var(--ivory)] outline-none atelier-seat';

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="w-8 h-px bg-sienna" aria-hidden="true" />
      <h2 className="atelier-display text-2xl md:text-3xl tracking-tight">{children}</h2>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const tone =
    status === 'delivered'
      ? 'bg-sienna/10 text-sienna border-sienna/25'
      : status === 'shipped'
        ? 'bg-ink/5 text-ink border-hairline'
        : status === 'processing'
          ? 'bg-[var(--bone)]/60 text-ink-soft border-hairline'
          : status === 'cancelled'
            ? 'bg-transparent text-ink-mute border-hairline line-through'
            : 'bg-[var(--bone)]/40 text-ink-mute border-hairline';
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider border capitalize ${tone}`}
    >
      {status}
    </span>
  );
}

function PulseRows({ count = 4, height = 'h-20' }: { count?: number; height?: string }) {
  return (
    <div className="space-y-3" aria-hidden="true" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} animate-pulse border border-hairline bg-[var(--bone)]/40`} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Analytics                                                           */
/* ------------------------------------------------------------------ */

function AnalyticsDashboard() {
  const reducedMotion = useReducedMotion();
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: AdminAnalytics }>('/admin/analytics');
      return data.data;
    },
  });

  if (isLoading) return <PulseRows count={4} height="h-24" />;

  const stats = [
    { label: 'Total Revenue', value: formatPrice(analytics?.totalRevenue || 0), icon: BarChart3 },
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: Package },
    { label: 'Customers', value: analytics?.totalCustomers || 0, icon: Users },
    { label: 'Products', value: analytics?.totalProducts || 0, icon: LayoutDashboard },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>Analytics Overview</SectionHeading>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={staggerItem} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="atelier-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className="w-4 h-4 text-sienna" aria-hidden="true" />
              <span className="atelier-eyebrow text-[10px] text-ink-mute">{stat.label}</span>
            </div>
            <p className="font-display text-2xl text-ink tabular-nums">{stat.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by status */}
        <motion.div variants={staggerItem} className="atelier-card p-6">
          <h3 className="atelier-eyebrow text-ink mb-5">Orders by Status</h3>
          <div className="space-y-4">
            {analytics?.ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-3">
                <span className="text-sm text-ink-mute capitalize w-24 shrink-0">{s.status}</span>
                <div className="flex-1 h-1.5 bg-[var(--bone)] overflow-hidden">
                  <div
                    className="h-full bg-sienna"
                    style={{ width: `${(s.count / (analytics?.totalOrders || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-ink w-8 text-right tabular-nums">{s.count}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top products */}
        <motion.div variants={staggerItem} className="atelier-card p-6">
          <h3 className="atelier-eyebrow text-ink mb-5">Top Products</h3>
          <div className="space-y-3">
            {analytics?.topProducts.map((tp, i) => (
              <div key={tp.product._id} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-[11px] text-sienna w-6 shrink-0 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-ink flex-1 truncate">{tp.product.name}</span>
                <span className="text-ink-mute text-xs shrink-0">{tp.sold} sold</span>
                <span className="text-ink font-display shrink-0 tabular-nums">{formatPrice(tp.revenue)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent orders */}
      <motion.div variants={staggerItem} className="atelier-card p-6">
        <h3 className="atelier-eyebrow text-ink mb-5">Recent Orders</h3>
        <div className="space-y-2">
          {analytics?.recentOrders?.map((order: any) => (
            <div
              key={order._id}
              className="flex items-center justify-between p-3.5 border border-hairline bg-[var(--ivory)] text-sm"
            >
              <div className="min-w-0">
                <span className="text-ink font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                <span className="text-ink-mute ml-3 truncate">{order.user?.name}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <StatusChip status={order.status} />
                <span className="text-ink font-display tabular-nums">{formatPrice(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function AdminOrders() {
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [status, setStatus] = useState('processing');
  const [trackingNumber, setTrackingNumber] = useState('');

  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders?limit=50');
      return data.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, trackingNumber }: { id: string; status: string; trackingNumber?: string }) => {
      const { data } = await api.patch(`/orders/${id}/status`, { status, trackingNumber });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('Order status updated');
      setSelectedOrderId(null);
    },
  });

  const handleOpenEdit = (order: any) => {
    setSelectedOrderId(order._id);
    setStatus(order.status);
    setTrackingNumber(order.trackingNumber || '');
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem}>
        <SectionHeading>All Orders</SectionHeading>
      </motion.div>

      {isLoading ? (
        <PulseRows count={5} height="h-16" />
      ) : (
        <div className="space-y-3">
          {orders?.map((order: any) => {
            const isEditing = selectedOrderId === order._id;
            return (
              <motion.div
                key={order._id}
                variants={staggerItem}
                className="atelier-card p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="text-ink font-semibold">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-ink-mute text-xs mt-0.5 truncate">
                      {order.user?.name} · {order.user?.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-ink-mute">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </span>
                    <StatusChip status={order.status} />
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="sm:text-right">
                      <p className="text-ink font-display tabular-nums">{formatPrice(order.total)}</p>
                      <p className="text-xs text-ink-mute capitalize">{order.paymentStatus}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => (isEditing ? setSelectedOrderId(null) : handleOpenEdit(order))}
                      aria-label={isEditing ? 'Close editor' : `Edit order ${order._id.slice(-8)}`}
                      className="pressable p-2.5 border border-hairline text-ink-mute hover:text-sienna hover:border-sienna/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-hairline grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-[var(--bone)]/30 p-4">
                    <div>
                      <label htmlFor={`status-${order._id}`} className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">
                        Status
                      </label>
                      <select
                        id={`status-${order._id}`}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={FIELD}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`tracking-${order._id}`} className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">
                        Tracking Number
                      </label>
                      <input
                        id={`tracking-${order._id}`}
                        type="text"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking #"
                        className={FIELD}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateStatusMutation.mutate({ id: order._id, status, trackingNumber })}
                        disabled={updateStatusMutation.isPending}
                        className="pressable flex-1 py-3 bg-ink text-ivory font-mono text-xs uppercase tracking-[0.18em] hover:bg-sienna transition-colors disabled:opacity-50 min-h-[44px]"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(null)}
                        className="pressable px-4 py-3 border border-hairline text-ink-mute font-mono text-xs uppercase tracking-[0.18em] hover:text-ink transition-colors min-h-[44px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

function AdminProducts() {
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('VOID');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [onSale, setOnSale] = useState(false);

  // Default size configuration
  const defaultSizes = [
    { label: 'XS', stock: 10 },
    { label: 'S', stock: 15 },
    { label: 'M', stock: 20 },
    { label: 'L', stock: 15 },
    { label: 'XL', stock: 10 },
    { label: 'XXL', stock: 5 },
  ];

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await api.get('/products?limit=50');
      return data.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    },
  });

  const resetForm = () => {
    setName('');
    setBrand('VOID');
    setPrice('');
    setComparePrice('');
    setSku('');
    setCategoryId('');
    setDescription('');
    setMaterials('');
    setTags('');
    setFeatured(false);
    setOnSale(false);
    setIsCreating(false);
    setEditingProduct(null);
  };

  const createProductMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post('/products', payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product created successfully');
      resetForm();
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await api.put(`/products/${id}`, payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product updated successfully');
      resetForm();
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/products/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      toast.success('Product deleted successfully');
    },
  });

  const handleEditOpen = (product: any) => {
    setEditingProduct(product);
    setIsCreating(false);
    setName(product.name);
    setBrand(product.brand);
    setPrice(String(product.price));
    setComparePrice(product.comparePrice ? String(product.comparePrice) : '');
    setSku(product.sku);
    setCategoryId(product.category?._id || product.category || '');
    setDescription(product.description);
    setMaterials(product.materials?.join(', ') || '');
    setTags(product.tags?.join(', ') || '');
    setFeatured(product.featured || false);
    setOnSale(product.onSale || false);
  };

  const handleCreateOpen = () => {
    resetForm();
    setIsCreating(true);
    if (categories?.length > 0) {
      setCategoryId(categories[0]._id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name,
      slug,
      brand,
      price: parseFloat(price),
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      sku,
      category: categoryId,
      description,
      materials: materials.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((s) => s.trim()).filter(Boolean),
      featured,
      onSale,
      images: editingProduct?.images || [{ url: '', alt: name }],
      colorways: editingProduct?.colorways || [{ name: 'Void Black', hex: '#0A0A0A', images: [] }],
      sizes: editingProduct?.sizes || defaultSizes,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, payload });
    } else {
      createProductMutation.mutate(payload);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={staggerItem} className="flex justify-between items-center gap-4">
        <SectionHeading>Product Management</SectionHeading>
        {!isCreating && !editingProduct && (
          <button
            type="button"
            onClick={handleCreateOpen}
            className="pressable inline-flex items-center gap-2 px-5 py-3 bg-ink text-ivory font-mono text-xs uppercase tracking-[0.18em] hover:bg-sienna transition-colors min-h-[44px] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" /> Add Product
          </button>
        )}
      </motion.div>

      {isCreating || editingProduct ? (
        <motion.form
          variants={staggerItem}
          onSubmit={handleSubmit}
          className="atelier-card p-6 md:p-8 space-y-5"
        >
          <h3 className="font-display text-lg text-ink">
            {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-name" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Product Name</label>
              <input id="p-name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-brand" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Brand</label>
              <input id="p-brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} required className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-price" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Price ($)</label>
              <input id="p-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-compare" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Compare Price ($)</label>
              <input id="p-compare" type="number" step="0.01" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-sku" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">SKU</label>
              <input id="p-sku" type="text" value={sku} onChange={(e) => setSku(e.target.value)} required className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-category" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Category</label>
              <select id="p-category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={FIELD}>
                <option value="">Select Category</option>
                {categories?.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="p-desc" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Description</label>
            <textarea id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3} className={`${FIELD} resize-none`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="p-materials" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Materials (comma-separated)</label>
              <input id="p-materials" type="text" value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="e.g. 100% Cashmere, Wool" className={FIELD} />
            </div>
            <div>
              <label htmlFor="p-tags" className="atelier-eyebrow text-[10px] text-ink-mute mb-1.5 block">Tags (comma-separated)</label>
              <input id="p-tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. winter, coat, luxury" className={FIELD} />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-ink">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 accent-[var(--sienna)]"
              />
              Featured Product
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onSale}
                onChange={(e) => setOnSale(e.target.checked)}
                className="w-4 h-4 accent-[var(--sienna)]"
              />
              On Sale
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
              className="pressable px-7 py-3 bg-ink text-ivory font-mono text-xs uppercase tracking-[0.18em] hover:bg-sienna transition-colors disabled:opacity-50 min-h-[44px]"
            >
              Save Product
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="pressable px-5 py-3 border border-hairline text-ink-mute font-mono text-xs uppercase tracking-[0.18em] hover:text-ink transition-colors min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      ) : (
        <div className="space-y-3">
          {isLoading ? (
            <PulseRows count={5} height="h-16" />
          ) : (
            productsData?.map((prod: any, i: number) => (
              <motion.div
                key={prod._id}
                variants={staggerItem}
                className="atelier-card atelier-card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 text-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-mono text-[10px] text-ink-mute tracking-[0.18em] w-6 shrink-0 tabular-nums" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-12 h-14 bg-[var(--bone)] border border-hairline overflow-hidden shrink-0">
                    {prod.images?.[0] ? (
                      <Image src={prod.images[0].url} alt="" loading="lazy" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-sienna" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-ink font-semibold truncate">{prod.name}</p>
                    <p className="text-ink-mute text-xs mt-0.5 truncate">{prod.brand} · SKU: {prod.sku}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                  <div className="sm:text-right">
                    <p className="text-ink font-display tabular-nums">{formatPrice(prod.price)}</p>
                    <p className="text-xs text-ink-mute capitalize">{prod.category?.name || 'Uncategorized'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditOpen(prod)}
                      aria-label={`Edit ${prod.name}`}
                      className="pressable p-2.5 border border-hairline text-ink-mute hover:text-sienna hover:border-sienna/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Edit className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete ${prod.name}?`)) deleteProductMutation.mutate(prod._id);
                      }}
                      aria-label={`Delete ${prod.name}`}
                      className="pressable p-2.5 border border-hairline text-ink-mute hover:text-[#B3261E] hover:border-[#B3261E]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Users                                                               */
/* ------------------------------------------------------------------ */

function AdminUsers() {
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users?limit=50');
      return data.data;
    },
  });

  const toggleRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const { data } = await api.put(`/admin/users/${id}/role`, { role });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast.success('User role updated');
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
        <SectionHeading>User Management</SectionHeading>
      </motion.div>

      {isLoading ? (
        <PulseRows count={5} height="h-16" />
      ) : (
        <div className="space-y-3">
          {users?.map((usr: any) => (
            <motion.div
              key={usr._id}
              variants={staggerItem}
              className="atelier-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 text-sm"
            >
              <div className="min-w-0">
                <p className="text-ink font-semibold truncate">{usr.name}</p>
                <p className="text-ink-mute text-xs mt-0.5 truncate">{usr.email}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`inline-block px-2.5 py-1 text-[10px] uppercase font-semibold tracking-wider border ${
                    usr.role === 'admin'
                      ? 'bg-sienna/10 text-sienna border-sienna/25'
                      : 'bg-[var(--bone)]/40 text-ink-mute border-hairline'
                  }`}
                >
                  {usr.role}
                </span>
                <button
                  type="button"
                  onClick={() => toggleRoleMutation.mutate({ id: usr._id, role: usr.role === 'admin' ? 'user' : 'admin' })}
                  className="pressable text-xs font-mono uppercase tracking-[0.14em] text-sienna border border-sienna/30 hover:bg-sienna hover:text-ivory transition-colors px-4 py-2.5 min-h-[44px]"
                >
                  Toggle Role
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const adminLinks = [
  { label: 'Analytics', to: '/admin', icon: BarChart3 },
  { label: 'Products', to: '/admin/products', icon: LayoutDashboard },
  { label: 'Orders', to: '/admin/orders', icon: Package },
  { label: 'Users', to: '/admin/users', icon: Users },
];

export default function Admin() {
  const location = useLocation();
  const { user } = useAuthStore();
  const reducedMotion = useReducedMotion();

  if (user?.role !== 'admin') return <Navigate to="/" replace />;

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
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Atelier Control
            </p>
            <h1 className="atelier-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.95] tracking-[-0.03em]">
              The <em>Registry</em>
            </h1>
          </motion.div>
          <motion.div variants={fadeUpVariants} className="lg:col-span-4 lg:pb-2 flex flex-col gap-3 items-start lg:items-end">
            <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-sm lg:text-right">
              Products, orders, and patrons. Managed from one desk.
            </p>
            <Link
              to="/dashboard"
              className="pressable inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:text-sienna transition-colors min-h-[44px]"
            >
              Back to Dashboard
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="container-void pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {/* Sidebar ledger */}
          <aside className="md:col-span-3">
            <nav
              aria-label="Admin sections"
              className="md:sticky md:top-28 border border-hairline bg-[var(--ivory)]"
            >
              <div className="px-5 py-4 border-b border-hairline flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--ink)] flex items-center justify-center text-[var(--ivory)] shrink-0">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-ink text-sm font-display truncate">{user?.name}</p>
                  <p className="text-sienna text-[11px] font-mono uppercase tracking-[0.14em]">Administrator</p>
                </div>
              </div>

              <div className="p-2 flex md:flex-col gap-1 overflow-x-auto">
                {adminLinks.map((link) => {
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
              </div>
            </nav>
          </aside>

          {/* Routed content */}
          <div className="md:col-span-9 min-w-0">
            <Routes>
              <Route path="/" element={<AnalyticsDashboard />} />
              <Route path="/products" element={<AdminProducts />} />
              <Route path="/orders" element={<AdminOrders />} />
              <Route path="/users" element={<AdminUsers />} />
            </Routes>
          </div>
        </div>
      </section>
    </main>
  );
}
