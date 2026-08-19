// ============================================
// Shared site navigation data — single source of truth
// ============================================
// Previously the primary nav links were hardcoded separately in Navigation.tsx
// and MobileMenu.tsx (and drifted: MobileMenu had Contact/FAQ, the header
// didn't), and the legal/utility links were duplicated in Footer.tsx and
// MobileMenu.tsx. This module holds all three sets once so adding a route
// means editing one place.

export interface NavLink {
  label: string;
  to: string;
  /** Path used for active-state matching (the `to` value minus any query). */
  matchPath: string;
  /** Optional query key that must be present for the link to count as active. */
  activeQueryKey?: string;
}

/**
 * Mega-menu panel content for a primary nav link. Each panel is a set of
 * link columns plus one featured image. Data is static and curated — it
 * references the same route slugs as the pages, and the imagery is drawn
 * from the existing public/product and lookbook exports so nothing new
 * needs to be shipped.
 */
export interface NavPanelColumn {
  heading: string;
  links: NavLink[];
}

export interface NavPanel {
  /** Small mono eyebrow shown above the panel description. */
  eyebrow: string;
  /** One-line editorial description under the eyebrow. */
  description: string;
  columns: NavPanelColumn[];
  /** Right-hand featured frame: a route link + editorial image. */
  featured?: {
    label: string;
    to: string;
    image: string;
    alt?: string;
  };
}

/** Primary nav link that may optionally carry a mega-menu panel. */
export interface NavLinkWithPanel extends NavLink {
  panel?: NavPanel;
}

/** Primary navigation shown in the header (desktop) and mobile menu. */
export const primaryNavLinks: NavLink[] = [
  { label: 'Collections', to: '/collections', matchPath: '/collections' },
  { label: 'Watches', to: '/watches', matchPath: '/watches' },
  {
    label: 'All Products',
    to: '/products',
    matchPath: '/products',
  },
  {
    label: 'New Arrivals',
    to: '/new-arrivals',
    matchPath: '/new-arrivals',
  },
  { label: 'Lookbook', to: '/lookbook', matchPath: '/lookbook' },
  { label: 'About', to: '/about', matchPath: '/about' },
  { label: 'Contact', to: '/contact', matchPath: '/contact' },
  { label: 'FAQ', to: '/faq', matchPath: '/faq' },
];

/**
 * Mega-menu panels keyed by primary nav link `to` values. Only links that
 * appear in this map get a dropdown on desktop; every other primary link
 * renders as a plain link (and the mobile menu is unchanged — it renders
 * the flat `primaryNavLinks` list).
 */
export const primaryNavPanels: Record<string, NavPanel> = {
  '/collections': {
    eyebrow: 'The Wardrobe',
    description: 'Three houses of form — drapery, architecture, and stride.',
    columns: [
      {
        heading: 'Collections',
        links: [
          { label: 'All Collections', to: '/collections', matchPath: '/collections' },
          { label: 'Ivory Series', to: '/collections/ivory-series', matchPath: '/collections/ivory-series' },
        ],
      },
      {
        heading: 'Atelier',
        links: [
          { label: 'Draped Shirt', to: '/products/atelier-draped-shirt', matchPath: '/products/atelier-draped-shirt' },
          { label: 'Silk Dress', to: '/products/atelier-silk-dress', matchPath: '/products/atelier-silk-dress' },
        ],
      },
      {
        heading: 'Outerwear',
        links: [
          { label: 'Architectural Overcoat', to: '/products/architectural-overcoat', matchPath: '/products/architectural-overcoat' },
          { label: 'Cashmere Storm Coat', to: '/products/cashmere-storm-coat', matchPath: '/products/cashmere-storm-coat' },
        ],
      },
    ],
    featured: {
      label: 'The Sculpted Wool Overcoat',
      to: '/products/architectural-overcoat',
      image: '/products/sculpted_wool_coat.png',
      alt: 'Architectural Overcoat in sculpted wool',
    },
  },
  '/watches': {
    eyebrow: 'Horology',
    description: 'Caliber-driven instruments, engineered in-house.',
    columns: [
      {
        heading: 'Timepieces',
        links: [
          { label: 'The Watch', to: '/watches', matchPath: '/watches' },
          { label: 'Configurator', to: '/watch', matchPath: '/watch' },
        ],
      },
      {
        heading: 'Maison',
        links: [
          { label: 'Brand', to: '/about', matchPath: '/about' },
          { label: 'New Arrivals', to: '/new-arrivals', matchPath: '/new-arrivals' },
        ],
      },
      {
        heading: 'Care',
        links: [
          { label: 'Contact', to: '/contact', matchPath: '/contact' },
          { label: 'FAQ', to: '/faq', matchPath: '/faq' },
        ],
      },
    ],
    featured: {
      label: 'Monolith Caliber V-01',
      to: '/watches',
      image: '/products/obsidian_titanium_hero.png',
      alt: 'VOID Monolith watch in obsidian titanium',
    },
  },
  '/lookbook': {
    eyebrow: 'Edition IV',
    description: 'Dressed in Light, Cut in Shadow — Seasonal Lookbook.',
    columns: [
      {
        heading: 'The Chapters',
        links: [
          { label: 'I. Drape', to: '/lookbook#editorial-spreads', matchPath: '/lookbook' },
          { label: 'II. Structure', to: '/lookbook#editorial-spreads', matchPath: '/lookbook' },
          { label: 'III. Hide', to: '/lookbook#editorial-spreads', matchPath: '/lookbook' },
          { label: 'IV. Weight', to: '/lookbook#editorial-spreads', matchPath: '/lookbook' },
        ],
      },
      {
        heading: 'Experience',
        links: [
          { label: 'The Editorial Spreads', to: '/lookbook#editorial-spreads', matchPath: '/lookbook' },
          { label: 'Material Archive', to: '/lookbook#material-archive', matchPath: '/lookbook' },
          { label: 'The Plate Gallery', to: '/lookbook#look-index', matchPath: '/lookbook' },
        ],
      },
    ],
    featured: {
      label: 'Edition IV: The Lookbook',
      to: '/lookbook',
      image: '/lookbook_hero_wide.jpg',
      alt: 'VOID Edition IV Lookbook Editorial',
    },
  },
  '/about': {
    eyebrow: 'The Maison',
    description: 'The house behind the label.',
    columns: [
      {
        heading: 'House',
        links: [
          { label: 'Our Story', to: '/about', matchPath: '/about' },
          { label: 'Stores', to: '/stores', matchPath: '/stores' },
        ],
      },
      {
        heading: 'Care',
        links: [
          { label: 'FAQ', to: '/faq', matchPath: '/faq' },
          { label: 'Contact', to: '/contact', matchPath: '/contact' },
        ],
      },
    ],
    featured: {
      label: 'The Atelier',
      to: '/about',
      image: '/lookbook-1-alt.png',
      alt: 'Inside the VOID atelier',
    },
  },
};

/** Secondary links shown in the mobile menu's "Support" block. */
export const supportLinks: NavLink[] = [
  { label: 'The Maisons', to: '/stores', matchPath: '/stores' },
  { label: 'Gift Cards', to: '/gift-cards', matchPath: '/gift-cards' },
  { label: 'Loyalty Program', to: '/loyalty', matchPath: '/loyalty' },
  { label: 'Wishlist', to: '/wishlist', matchPath: '/wishlist' },
  { label: 'Shipping & Returns', to: '/shipping', matchPath: '/shipping' },
  { label: 'Privacy Policy', to: '/privacy', matchPath: '/privacy' },
  { label: 'Terms of Service', to: '/terms', matchPath: '/terms' },
];

/** Watch the flat primary links, returning any with a mega-menu panel. */
export function primaryNavLinksWithPanels(): NavLinkWithPanel[] {
  return primaryNavLinks
    .map((link) => {
      const panel = primaryNavPanels[link.to];
      return panel ? { ...link, panel } : link;
    });
}

/**
 * Determine whether a nav link is active for the current route.
 * Replaces the fragile hand-rolled per-link isActive logic in Navigation.tsx,
 * which couldn't disambiguate "All Products" vs "New Arrivals" robustly and
 * used a loose `|| '/watch'` match.
 */
export function isNavLinkActive(
  link: NavLink,
  pathname: string,
  searchParams: URLSearchParams
): boolean {
  // A panel parent (e.g. /collections) stays lit while any of its child
  // routes are open — /collections/atelier, /collections/ivory-series, etc.
  if (pathname.startsWith(`${link.matchPath}/`)) return true;
  if (link.matchPath !== pathname) return false;
  if (link.activeQueryKey) {
    return searchParams.has(link.activeQueryKey);
  }
  return true;
}
