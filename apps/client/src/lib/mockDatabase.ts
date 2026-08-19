import type { Product, Category, Order, User, Review, Coupon, AdminAnalytics } from '../types';

export const mockCategories: Category[] = [
  {
    _id: 'cat_1',
    name: 'Atelier',
    slug: 'atelier',
    description: 'Exclusive, custom-tailored draped designs.',
    active: true,
  },
  {
    _id: 'cat_2',
    name: 'Outerwear',
    slug: 'outerwear',
    description: 'Heavyweight architectural coats and jackets.',
    active: true,
  },
  {
    _id: 'cat_3',
    name: 'Footwear',
    slug: 'footwear',
    description: 'Sleek futuristic designer boots and sneakers.',
    active: true,
  },
];

export const mockProducts: Product[] = [
  {
    _id: 'prod_1',
    name: 'Architectural Overcoat',
    slug: 'architectural-overcoat',
    description: 'Crafted from heavyweight virgin wool, this structured overcoat features clean architectural lines, a concealed front button closure, and side welt pockets.',
    brand: 'VOID',
    category: mockCategories[1],
    price: 1250,
    comparePrice: 1500,
    sku: 'VD-COAT-001',
    images: [
      { url: '/products/sculpted_wool_coat.png', alt: 'Architectural Overcoat' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 10 },
      { label: 'M', stock: 12 },
      { label: 'L', stock: 8 }
    ],
    materials: ['80% Virgin Wool', '20% Polyamide'],
    tags: ['outerwear', 'luxury', 'wool', 'structured'],
    featured: true,
    isNew: true,
    onSale: true,
    avgRating: 4.8,
    reviewCount: 4,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_2',
    name: 'Cashmere Storm Coat',
    slug: 'cashmere-storm-coat',
    description: 'A premium storm-resistant draped coat crafted from organic cashmere, detailing an asymmetric design and storm-flap collar.',
    brand: 'VOID',
    category: mockCategories[1],
    price: 1850,
    sku: 'VD-COAT-002',
    images: [
      { url: '/products/cashmere_evening_gown.png', alt: 'Cashmere Storm Coat' }
    ],
    colorways: [
      { name: 'Charcoal', hex: '#282A2B', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 5 },
      { label: 'M', stock: 8 },
      { label: 'L', stock: 5 }
    ],
    materials: ['100% Organic Cashmere'],
    tags: ['outerwear', 'cashmere', 'draped', 'limited'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 5.0,
    reviewCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_3',
    name: 'Atelier Draped Shirt',
    slug: 'atelier-draped-shirt',
    description: 'An asymmetrical black silk shirt detailing luxurious avant-garde draped lines and lightweight silk construction.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 650,
    sku: 'VD-SHRT-003',
    images: [
      { url: '/products/draped_silk_shirt.png', alt: 'Atelier Draped Shirt' }
    ],
    colorways: [
      { name: 'Satin Black', hex: '#000000', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 15 },
      { label: 'M', stock: 20 },
      { label: 'L', stock: 15 }
    ],
    materials: ['100% Mulberry Silk'],
    tags: ['atelier', 'shirt', 'silk', 'draped'],
    featured: false,
    isNew: false,
    onSale: false,
    avgRating: 4.5,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_4',
    name: 'Futuristic Leather Boots',
    slug: 'futuristic-leather-boots',
    description: 'Premium dark leather boots showcasing a rugged yet refined profile with custom metal hardware accents.',
    brand: 'VOID',
    category: mockCategories[2],
    price: 950,
    comparePrice: 1100,
    sku: 'VD-BOOT-004',
    images: [
      { url: '/products/weathered_leather_boot.png', alt: 'Futuristic Leather Boots' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#050505', images: [] }
    ],
    sizes: [
      { label: 'M', stock: 10 },
      { label: 'L', stock: 10 }
    ],
    materials: ['100% Full-grain Leather', 'Vibram Outsole'],
    tags: ['footwear', 'leather', 'boots', 'premium'],
    featured: true,
    isNew: false,
    onSale: true,
    avgRating: 4.7,
    reviewCount: 3,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_5',
    name: 'Asymmetric Tailored Blazer',
    slug: 'asymmetric-tailored-blazer',
    description: 'An avant-garde tailored blazer featuring sharp asymmetric panels and an architectural collar design.',
    brand: 'VOID',
    category: mockCategories[1],
    price: 850,
    sku: 'VD-BLZR-005',
    images: [
      { url: '/products/asymmetric_blazer.png', alt: 'Asymmetric Tailored Blazer' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 8 },
      { label: 'M', stock: 10 },
      { label: 'L', stock: 6 }
    ],
    materials: ['100% Worsted Wool'],
    tags: ['blazer', 'tailored', 'asymmetric', 'outerwear'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 4.9,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_6',
    name: 'Structured Draped Trousers',
    slug: 'structured-draped-trousers',
    description: 'Relaxed yet structural tailored trousers featuring pleating details and a modern draped silhouette.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 550,
    sku: 'VD-TRSR-006',
    images: [
      { url: '/products/structured_trousers.png', alt: 'Structured Draped Trousers' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 12 },
      { label: 'M', stock: 15 },
      { label: 'L', stock: 10 }
    ],
    materials: ['Wool-Gabardine Blend'],
    tags: ['trousers', 'draped', 'tailored', 'atelier'],
    featured: false,
    isNew: false,
    onSale: false,
    avgRating: 4.6,
    reviewCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_7',
    name: 'Atelier Silk Dress',
    slug: 'atelier-silk-dress',
    description: 'An elegant long silk dress detailing beautiful draped lines and fluid avant-garde movements.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 1450,
    sku: 'VD-DRSS-007',
    images: [
      { url: '/products/silk_dress.png', alt: 'Atelier Silk Dress' }
    ],
    colorways: [
      { name: 'Satin Black', hex: '#000000', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 4 },
      { label: 'M', stock: 6 },
      { label: 'L', stock: 4 }
    ],
    materials: ['100% Mulberry Silk'],
    tags: ['dress', 'silk', 'draped', 'atelier'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 5.0,
    reviewCount: 3,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_8',
    name: 'Minimalist Leather Jacket',
    slug: 'minimalist-leather-jacket',
    description: 'A raw-cut premium leather jacket featuring sleek minimalist lines and industrial steel closures.',
    brand: 'VOID',
    category: mockCategories[1],
    price: 1650,
    comparePrice: 1950,
    sku: 'VD-JKT-008',
    images: [
      { url: '/products/leather_jacket.png', alt: 'Minimalist Leather Jacket' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 6 },
      { label: 'M', stock: 8 },
      { label: 'L', stock: 5 }
    ],
    materials: ['100% Calfskin Leather', 'Satin lining'],
    tags: ['leather', 'jacket', 'outerwear', 'premium'],
    featured: true,
    isNew: false,
    onSale: true,
    avgRating: 4.8,
    reviewCount: 2,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_9',
    name: 'Heavyweight Cashmere Scarf',
    slug: 'heavyweight-cashmere-scarf',
    description: 'An oversized heavy-knit scarf crafted from soft organic cashmere for optimal warmth and texture.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 320,
    sku: 'VD-SCRF-009',
    images: [
      { url: '/products/knit_scarf.png', alt: 'Heavyweight Cashmere Scarf' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#080808', images: [] }
    ],
    sizes: [
      { label: 'OS', stock: 25 }
    ],
    materials: ['100% Organic Cashmere'],
    tags: ['scarf', 'cashmere', 'knitwear', 'accessories'],
    featured: false,
    isNew: true,
    onSale: false,
    avgRating: 4.9,
    reviewCount: 8,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_10',
    name: 'Architectural Gold Ring',
    slug: 'architectural-gold-ring',
    description: 'A heavy minimalist band showcasing custom geometric contours and a premium matte finish.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 450,
    sku: 'VD-RING-010',
    images: [
      { url: '/products/gold_ring.png', alt: 'Architectural Gold Ring' }
    ],
    colorways: [
      { name: 'Matte Gold', hex: '#D4AF37', images: [] }
    ],
    sizes: [
      { label: '6', stock: 5 },
      { label: '7', stock: 8 },
      { label: '8', stock: 5 }
    ],
    materials: ['18k Gold Plated Brass'],
    tags: ['ring', 'jewelry', 'gold', 'accessories'],
    featured: false,
    isNew: false,
    onSale: false,
    avgRating: 4.7,
    reviewCount: 4,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_11',
    name: 'Futuristic Trench Coat',
    slug: 'futuristic-trench-coat',
    description: 'A water-resistant avant-garde trench coat detailing structured storm flaps and industrial strapping.',
    brand: 'VOID',
    category: mockCategories[1],
    price: 1150,
    sku: 'VD-COAT-011',
    images: [
      { url: '/products/trench_coat.png', alt: 'Futuristic Trench Coat' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: 'S', stock: 8 },
      { label: 'M', stock: 10 },
      { label: 'L', stock: 8 }
    ],
    materials: ['Waterproof Nylon-Cotton Blend'],
    tags: ['trench', 'coat', 'outerwear', 'waterproof'],
    featured: false,
    isNew: false,
    onSale: false,
    avgRating: 4.5,
    reviewCount: 1,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_12',
    name: 'Geometric Leather Bag',
    slug: 'geometric-leather-bag',
    description: 'A compact structural leather shoulder bag designed with clean angular lines and hidden magnetic closure.',
    brand: 'VOID',
    category: mockCategories[0],
    price: 780,
    sku: 'VD-BAG-012',
    images: [
      { url: '/products/messenger_bag.png', alt: 'Geometric Leather Bag' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#050505', images: [] }
    ],
    sizes: [
      { label: 'OS', stock: 15 }
    ],
    materials: ['100% Full-grain Leather'],
    tags: ['bag', 'leather', 'accessories', 'geometric'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 4.8,
    reviewCount: 3,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'prod_13',
    name: 'Square-Toe Chelsea Boots',
    slug: 'square-toe-chelsea-boots',
    description: 'Square-toe Chelsea boots crafted from smooth calfskin with an elevated stacked heel and side elastic gussets.',
    brand: 'VOID',
    category: mockCategories[2],
    price: 890,
    sku: 'VD-BOOT-013',
    images: [
      { url: '/products/chelsea_boots.png', alt: 'Square-Toe Chelsea Boots' }
    ],
    colorways: [
      { name: 'Void Black', hex: '#0A0A0A', images: [] }
    ],
    sizes: [
      { label: '41', stock: 8 },
      { label: '42', stock: 12 },
      { label: '43', stock: 10 }
    ],
    materials: ['100% Calfskin Leather', 'Leather sole'],
    tags: ['footwear', 'boots', 'chelsea', 'leather'],
    featured: true,
    isNew: true,
    onSale: false,
    avgRating: 4.9,
    reviewCount: 2,
    createdAt: new Date().toISOString(),
  },
];

export const mockUser: User = {
  _id: 'usr_mock_1',
  name: 'Dev User',
  email: 'admin@void.fashion',
  role: 'admin',
  addresses: [
    {
      firstName: 'Dev',
      lastName: 'User',
      street: '742 void avenue',
      city: 'void city',
      state: 'VC',
      zip: '00000',
      country: 'Void Country',
      phone: '123-456-7890',
      isDefault: true,
    }
  ],
  wishlist: ['prod_1'],
  recentlyViewed: ['prod_2'],
  createdAt: new Date().toISOString(),
};

export const mockReviews: Record<string, Review[]> = {
  prod_1: [
    {
      _id: 'rev_1',
      product: 'prod_1',
      user: { ...mockUser, name: 'Sven Lindqvist' },
      rating: 5,
      title: 'Flawless tailoring',
      body: 'The architectural lines of this coat are even cleaner in person. Exquisite construction.',
      verified: true,
      helpful: 4,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      _id: 'rev_2',
      product: 'prod_1',
      user: { ...mockUser, name: 'Elena Rostova' },
      rating: 4,
      title: 'Beautiful but fits large',
      body: 'Highly structured shoulders. Consider sizing down if you prefer a slimmer look.',
      verified: true,
      helpful: 2,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    }
  ]
};

export const mockCoupons: Coupon[] = [
  {
    _id: 'cp_1',
    code: 'VOID10',
    type: 'percentage',
    value: 10,
    active: true,
    usageCount: 5,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  },
  {
    _id: 'cp_2',
    code: 'FIRST50',
    type: 'fixed',
    value: 50,
    active: true,
    usageCount: 12,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 30).toISOString(),
  }
];

export const mockOrders: Order[] = [
  {
    _id: 'ord_mock_1',
    user: mockUser,
    items: [
      {
        product: mockProducts[0],
        colorway: mockProducts[0].colorways[0],
        size: 'M',
        quantity: 1,
        price: 1250,
      }
    ],
    status: 'processing',
    shippingAddress: mockUser.addresses[0],
    paymentStatus: 'paid',
    subtotal: 1250,
    tax: 100,
    shipping: 0,
    discount: 0,
    total: 1350,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

export const mockAnalytics: AdminAnalytics = {
  totalRevenue: 24500,
  totalOrders: 15,
  totalCustomers: 8,
  totalProducts: 4,
  revenueByMonth: [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 5500 },
    { month: 'Mar', revenue: 7000 },
    { month: 'Apr', revenue: 8000 }
  ],
  ordersByStatus: [
    { status: 'pending', count: 2 },
    { status: 'processing', count: 4 },
    { status: 'shipped', count: 3 },
    { status: 'delivered', count: 6 }
  ],
  topProducts: [
    { product: mockProducts[0], sold: 8, revenue: 10000 },
    { product: mockProducts[1], sold: 4, revenue: 7400 }
  ],
  recentOrders: mockOrders,
};
