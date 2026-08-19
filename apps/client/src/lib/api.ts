import axios, { type AxiosError, type AxiosResponse } from 'axios';
import { toast } from 'sonner';
import type { Product } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('void_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

import {
  mockProducts,
  mockCategories,
  mockUser,
  mockReviews,
  mockCoupons,
  mockOrders,
  mockAnalytics
} from './mockDatabase';

function handleMockRequest(url: string, method: string, requestData?: any) {
  const [pathOnly, queryString] = url.replace(/^(http:\/\/localhost:5000\/api\/v1|https:\/\/.*?\/api\/v1)/, '').split('?');
  const cleanUrl = pathOnly;
  const searchParams = new URLSearchParams(queryString || '');

  if (cleanUrl.endsWith('/products') && method === 'get') {
    let filtered = [...mockProducts];

    const category = searchParams.get('category');
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => {
        const catSlug = typeof p.category === 'object' && p.category !== null ? (p.category as any).slug : p.category;
        return catSlug === category || p.category === category;
      });
    }

    const onSale = searchParams.get('onSale') === 'true';
    if (onSale) {
      filtered = filtered.filter((p) => (p as any).isSale || p.onSale || (p.comparePrice && p.comparePrice > p.price));
    }

    const isFeatured = searchParams.get('featured') === 'true' || searchParams.get('isFeatured') === 'true';
    if (isFeatured) {
      filtered = filtered.filter((p) => p.featured);
    }

    const isNew = searchParams.get('isNew') === 'true' || searchParams.get('new') === 'true';
    if (isNew) {
      filtered = filtered.filter((p) => p.isNew);
    }

    const sizesParam = searchParams.get('sizes');
    if (sizesParam) {
      const sizes = sizesParam.split(',').filter(Boolean);
      if (sizes.length > 0) {
        filtered = filtered.filter((p) => p.sizes?.some((s) => sizes.includes(s.label)));
      }
    }

    const search = searchParams.get('search');
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    const minPrice = searchParams.get('minPrice');
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= parseFloat(minPrice));
    }

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= parseFloat(maxPrice));
    }

    const sort = searchParams.get('sortBy') || searchParams.get('sort');
    if (sort === 'price-asc' || sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc' || sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    }

    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data: paginated,
      total: filtered.length,
      page,
      pages: Math.ceil(filtered.length / limit),
      hasMore: page < Math.ceil(filtered.length / limit),
    };
  }

  const productDetailMatch = cleanUrl.match(/\/products\/([^/?]+)$/);
  if (productDetailMatch && method === 'get') {
    const identifier = decodeURIComponent(productDetailMatch[1]);
    const product = mockProducts.find(p => p._id === identifier || p.slug === identifier);
    if (product) return { success: true, data: product };
    // If not found by exact slug/id, return the first product as a resilient demo fallback
    return { success: true, data: mockProducts[0] };
  }

  const reviewsMatch = cleanUrl.match(/\/products\/([^/?]+)\/reviews/);
  if (reviewsMatch && method === 'get') {
    const pId = reviewsMatch[1];
    return { success: true, data: mockReviews[pId] || mockReviews['prod_1'] || [] };
  }

  if (reviewsMatch && method === 'post') {
    const pId = reviewsMatch[1];
    const body = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {});
    const newReview = {
      _id: `rev_mock_${Date.now()}`,
      product: pId,
      user: mockUser,
      rating: body.rating || 5,
      title: body.title || 'Review',
      body: body.body || '',
      verified: true,
      helpful: 0,
      createdAt: new Date().toISOString()
    };
    if (!mockReviews[pId]) mockReviews[pId] = [];
    mockReviews[pId].unshift(newReview);
    return { success: true, data: newReview };
  }

  if ((cleanUrl.endsWith('/categories') || cleanUrl.includes('/categories/')) && method === 'get') {
    // Handle /categories/{slug} detail lookup
    const slugMatch = cleanUrl.match(/\/categories\/([^?]+)/);
    if (slugMatch) {
      const slug = slugMatch[1];
      const category = mockCategories.find((c: any) => c.slug === slug);
      if (category) {
        return { success: true, data: category };
      }
      return { success: true, data: mockCategories[0] };
    }
    return { success: true, data: mockCategories };
  }

  if (cleanUrl.endsWith('/coupons/validate') && method === 'post') {
    const body = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {});
    const coupon = mockCoupons.find(c => c.code.toLowerCase() === body.code?.toLowerCase());
    if (coupon) {
      const discount = coupon.type === 'percentage' ? (body.subtotal * coupon.value / 100) : coupon.value;
      return {
        success: true,
        data: {
          code: coupon.code,
          type: coupon.type,
          value: coupon.value,
          discount
        }
      };
    }
    return null;
  }

  if ((cleanUrl.endsWith('/orders') || cleanUrl.endsWith('/orders/my-orders')) && method === 'get') {
    return { success: true, data: mockOrders };
  }

  if (cleanUrl.endsWith('/orders') && method === 'post') {
    const body = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {});
    const newOrder = {
      _id: `ord_mock_${Date.now()}`,
      user: mockUser,
      items: body.items || [],
      status: 'pending',
      shippingAddress: body.shippingAddress || mockUser.addresses[0],
      paymentStatus: 'pending',
      subtotal: body.subtotal || 0,
      tax: body.tax || 0,
      shipping: body.shipping || 0,
      discount: body.discount || 0,
      total: body.total || 0,
      createdAt: new Date().toISOString()
    };
    mockOrders.unshift(newOrder as any);
    return { success: true, data: newOrder };
  }

  const orderStatusMatch = cleanUrl.match(/\/orders\/([^/]+)\/status$/);
  if (orderStatusMatch && method === 'patch') {
    const ordId = orderStatusMatch[1];
    const body = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {});
    const order = mockOrders.find(o => o._id === ordId);
    if (order) {
      order.status = body.status;
      if (body.trackingNumber) order.trackingNumber = body.trackingNumber;
      return { success: true, data: order };
    }
  }

  if (cleanUrl.endsWith('/admin/analytics') && method === 'get') {
    return { success: true, data: mockAnalytics };
  }

  if (cleanUrl.endsWith('/admin/users') && method === 'get') {
    return { success: true, data: [mockUser] };
  }

  const userRoleMatch = cleanUrl.match(/\/admin\/users\/([^/]+)\/role$/);
  if (userRoleMatch && method === 'put') {
    const usrId = userRoleMatch[1];
    const body = typeof requestData === 'string' ? JSON.parse(requestData) : (requestData || {});
    if (mockUser._id === usrId) {
      mockUser.role = body.role;
      return { success: true, data: mockUser };
    }
  }

  if (cleanUrl.endsWith('/auth/me') && method === 'get') {
    return { success: true, data: mockUser };
  }

  if ((cleanUrl.endsWith('/users/wishlist') || cleanUrl.endsWith('/wishlist')) && method === 'get') {
    const products = mockUser.wishlist
      .map((id) => mockProducts.find((p) => p._id === id))
      .filter((p): p is Product => Boolean(p));
    return { success: true, data: products };
  }

  return null;
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // Network offline fallback
    if (!error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || (error as any).code === 'ECONNREFUSED') {
      const url = error.config?.url || '';
      const method = error.config?.method?.toLowerCase() || 'get';
      const mockRes = handleMockRequest(url, method, error.config?.data);
      if (mockRes) {
        return Promise.resolve({
          data: mockRes,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: error.config,
        } as AxiosResponse);
      }
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        const newToken = data.data.accessToken;
        localStorage.setItem('void_access_token', newToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch {
        localStorage.removeItem('void_access_token');
        window.location.href = '/auth/login';
      }
    }

    if (error.response?.status !== 401) {
      const message =
        (error.response?.data as { message?: string })?.message ||
        'Something went wrong. Please try again.';
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
