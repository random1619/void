// ============================================
// VOID Fashion — Global TypeScript Types
// ============================================

export interface Image {
  url: string;
  publicId?: string;
  alt: string;
}

export interface Colorway {
  name: string;
  hex: string;
  images: string[];
}

export interface SizeVariant {
  label: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  brand: string;
  category: Category | string;
  price: number;
  comparePrice?: number;
  sku: string;
  images: Image[];
  model3dUrl?: string;
  colorways: Colorway[];
  sizes: SizeVariant[];
  materials: string[];
  tags: string[];
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  avgRating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  order?: number;
  active: boolean;
}

export interface CartItem {
  product: Product;
  colorway: Colorway;
  size: string;
  quantity: number;
  price: number;
}

export interface Address {
  _id?: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  addresses: Address[];
  wishlist: string[];
  recentlyViewed: string[];
  createdAt: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentIntentId?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  coupon?: Coupon | string;
  trackingNumber?: string;
  createdAt: string;
}

export interface OrderItem {
  product: Product | string;
  colorway: Colorway;
  size: string;
  quantity: number;
  price: number;
}

export interface Review {
  _id: string;
  product: string;
  user: User | string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  tags?: string[];
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  search?: string;
  sortBy?: 'featured' | 'price_asc' | 'price_desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;
}

export interface CheckoutState {
  step: 1 | 2 | 3;
  shippingAddress?: Address;
  paymentIntentId?: string;
  couponCode?: string;
  couponDiscount?: number;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueByMonth: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
  topProducts: { product: Product; sold: number; revenue: number }[];
  recentOrders?: Order[];
}
