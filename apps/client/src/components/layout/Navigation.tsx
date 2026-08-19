import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  AnimatePresence,
} from 'framer-motion';
import { ShoppingBag, Search, Menu, User, LogOut, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import {
  primaryNavLinks,
  isNavLinkActive,
  primaryNavLinksWithPanels,
  type NavLink,
  type NavLinkWithPanel,
} from '../../lib/navigation';
import { prefersReducedMotion } from '../../lib/utils';
import { MOBILE_MENU_PANEL_ID } from '../ui/MobileMenu';
import { ThemeToggle } from '../ui/ThemeToggle';
import { springs } from '../../lib/motion-tokens';
import { EASE_LUXURY } from '../../lib/animations';

const DESKTOP_NAV_SPLIT_INDEX = 4;
const ANNOUNCEMENT_STORAGE_KEY = 'void_announcement_dismissed';

// Scroll thresholds for the auto-hide header (px) — small enough that the
// header hides promptly, large enough that a single tick doesn't flicker it.
const HIDE_BELOW = 120;
const REVEAL_ABOVE = 12;

/* ─────────────────────────────────────────────────────────────────── */
/* Top Announcement Bar — dismissible, persists to localStorage         */
/* ─────────────────────────────────────────────────────────────────── */
function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
    if (wasDismissed) setDismissed(true);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, '1');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-ink text-ivory overflow-hidden"
      aria-label="Announcement"
    >
      <div className="container-void flex items-center justify-center gap-3 py-2.5 px-4 relative">
        <span className="font-mono text-xs uppercase tracking-widest text-ivory/70 text-center">
          Complimentary worldwide shipping on orders above $500
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="absolute right-2 md:right-auto md:relative text-ivory/50 hover:text-ivory transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-offset-2"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Active Indicator — follows the active nav link                      */
/* ─────────────────────────────────────────────────────────────────── */
function ActiveIndicator() {
  return (
    <motion.span
      layoutId="nav-active-pill"
      className="absolute inset-0 bg-ink/5 rounded-full -z-0 border border-ink/5"
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 30,
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Logo — editorial wordmark with a subtle hover pulse + sienna mark    */
/* ─────────────────────────────────────────────────────────────────── */
function Logo() {
  const scale = useSpring(1, { stiffness: 300, damping: 25 });

  const handleEnter = () => scale.set(1.04);
  const handleLeave = () => scale.set(1);

  return (
    <motion.div style={{ scale }} onPointerEnter={handleEnter} onPointerLeave={handleLeave}>
      <Link
        to="/"
        className="pressable font-display text-xl md:text-2xl font-bold tracking-tight text-ink hover:text-sienna transition-colors inline-flex items-baseline gap-0.5 md:gap-1 focus-visible:outline-offset-4"
        aria-label="VOID Home"
      >
        <span
          className="inline-flex items-center justify-center text-sienna"
          aria-hidden="true"
        >
          <span className="text-base leading-none font-black">V</span>
          <span className="text-[0.45em] leading-none mb-0.5">◆</span>
        </span>
        <span className="tracking-tight">OID</span>
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Action Button — shared styles for search / user / cart icons        */
/* ─────────────────────────────────────────────────────────────────── */
function ActionButton({
  onClick,
  label,
  children,
  badge,
}: {
  onClick?: () => void;
  label: string;
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="pressable relative min-w-[40px] min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-transparent hover:border-hairline hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors duration-200 focus-visible:outline-offset-4"
      title={label}
      aria-label={label}
    >
      {children}
      {badge}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Live clock — editorial horology touch (desktop 2xl+ only)           */
/* ─────────────────────────────────────────────────────────────────── */
const CLOCK_TIMEZONE = 'Asia/Kolkata';

function NavClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    if (prefersReducedMotion()) return; // static instant under reduced motion
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const label = new Intl.DateTimeFormat('en-GB', {
    timeZone: CLOCK_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(time);

  return (
    <div
      className="flex items-center gap-1.5 shrink-0 select-none"
      aria-label="Local time at VOID Atelier"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-sienna animate-pulse" aria-hidden="true" />
      <span className="font-mono text-[10px] tracking-[0.18em] text-ink-mute tabular-nums">
        {label}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* MegaMenu — desktop hover/focus dropdown panel for a primary link     */
/* ─────────────────────────────────────────────────────────────────── */
function MegaMenu({
  link,
  isActive,
  align = 'left',
  onNavigate,
}: {
  link: NavLinkWithPanel;
  isActive: boolean;
  align?: 'left' | 'right' | 'center';
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close on route change (including child-route clicks that stay mounted).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Close on Escape (keyboard users) — hover users won't be mid-keyboard.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const panel = link.panel;
  if (!panel) return null;

  const alignClasses =
    align === 'right'
      ? 'right-0 left-auto translate-x-0'
      : align === 'center'
      ? 'left-1/2 -translate-x-1/2'
      : 'left-0 translate-x-0';

  const transformOrigin =
    align === 'right' ? 'top right' : align === 'center' ? 'top center' : 'top left';

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        to={link.to}
        aria-current={isActive ? 'page' : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={onNavigate}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          // Close only when focus leaves the whole dropdown group.
          if (!e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) {
            setOpen(false);
          }
        }}
        className={`group relative flex items-center gap-1 px-3 py-1.5 whitespace-nowrap font-mono text-[11px] font-bold tracking-widest uppercase transition-colors duration-200 rounded-full focus-visible:outline-offset-4 ${
          isActive || open ? 'text-ink' : 'text-ink-mute hover:text-ink hover:bg-[var(--bone)]/60'
        }`}
      >
        <span className="relative z-10 flex items-center gap-1">
          {link.label}
          <ChevronDown
            className={`w-3 h-3 text-ink-mute transition-transform duration-200 ${
              open ? 'rotate-180 text-sienna' : 'group-hover:text-sienna'
            }`}
            aria-hidden="true"
          />
        </span>
        {isActive && <ActiveIndicator />}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={`${link.label} menu`}
            className={`absolute top-[calc(100%+8px)] pt-1 w-[min(92vw,720px)] z-nav ${alignClasses}`}
            style={{ transformOrigin }}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_LUXURY }}
          >
            <div
              className="mega-panel rounded-2xl grid gap-6 p-6 shadow-2xl border border-hairline bg-ivory/95 dark:bg-[#161412]/95 backdrop-blur-xl"
              style={{
                gridTemplateColumns: panel.featured
                  ? `repeat(${panel.columns.length}, minmax(130px, 1fr)) 1.25fr`
                  : `repeat(${panel.columns.length}, minmax(140px, 1fr))`,
              }}
            >
              {panel.columns.map((column) => (
                <div key={column.heading} className="space-y-3">
                  <p className="mega-panel-heading">{column.heading}</p>
                  <ul className="space-y-2">
                    {column.links.map((sub) => (
                      <li key={sub.to}>
                        <Link
                          to={sub.to}
                          role="menuitem"
                          onClick={onNavigate}
                          className="mega-panel-link group/link"
                        >
                          {sub.label}
                          <ArrowUpRight
                            className="w-3 h-3 opacity-0 -translate-x-1 translate-y-1 transition-[opacity,transform] duration-200 group-hover/link:opacity-100 group-hover/link:translate-x-0 group-hover/link:translate-y-0"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {panel.featured && (
                <Link
                  to={panel.featured.to}
                  role="menuitem"
                  onClick={onNavigate}
                  className="mega-panel-featured group/featured relative block overflow-hidden rounded-xl border border-hairline"
                >
                  <img
                    src={panel.featured.image}
                    alt={panel.featured.alt ?? panel.featured.label}
                    className="h-full w-full object-cover min-h-[160px]"
                    loading="lazy"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 pt-10 pb-3">
                    <span className="block font-display text-sm text-white font-medium">
                      {panel.featured.label}
                    </span>
                    <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/80 font-semibold">
                      Discover
                      <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/* Navigation — the header itself                                      */
/* ─────────────────────────────────────────────────────────────────── */
export function Navigation() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { openCart, getTotalItems } = useCartStore();
  const { isMobileMenuOpen, toggleMobileMenu, openSearch, openAuthPanel } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  // Scrolled state — compositor-driven, no React re-renders on scroll tick.
  const { scrollY, scrollYProgress } = useScroll();
  const scrolledMV = useTransform(scrollY, [0, 40], [0, 1], { clamp: true });

  useMotionValueEvent(scrollY, 'change', (y) => {
    const isPast = y > 20;
    if (isPast !== scrolled) {
      setScrolled(isPast);
    }
  });

  // Top border accent opacity — fades in as you scroll past the hero.
  const borderOpacity = useTransform(scrolledMV, [0.3, 1], [0, 1]);

  // Scroll progress — thin sienna hairline at the very top of the header.
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Auto-hide: translate the header up on scroll-down, reveal on scroll-up.
  // Respects reduced motion — the header never hides, it just condenses.
  const headerY = useSpring(0, { stiffness: 380, damping: 36, mass: 0.5 });
  const headerTranslateY = useTransform(headerY, [-1, 0], ['-100%', '0%']);
  const lastYRef = useRef(0);
  useMotionValueEvent(scrollY, 'change', (y) => {
    if (prefersReducedMotion()) {
      headerY.set(0);
      lastYRef.current = y;
      return;
    }
    const delta = y - lastYRef.current;
    lastYRef.current = y;
    const shouldHide = y > HIDE_BELOW && delta > 0;
    const shouldReveal = delta < 0 || y < REVEAL_ABOVE;
    headerY.set(shouldHide ? -1 : shouldReveal ? 0 : headerY.get());
  });

  const cartCount = getTotalItems();

  // Cart badge pop — only on count *change* after mount.
  const mountedRef = useRef(false);
  const prevCountRef = useRef(cartCount);
  const countChanged = mountedRef.current && prevCountRef.current !== cartCount;
  useEffect(() => {
    mountedRef.current = true;
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const leftNavLinks = primaryNavLinks.slice(0, DESKTOP_NAV_SPLIT_INDEX);
  const rightNavLinks = primaryNavLinks.slice(DESKTOP_NAV_SPLIT_INDEX);

  const renderNavLink = (link: NavLink, _index: number, isActive: boolean) => {
    return (
      <Link
        key={link.to}
        to={link.to}
        aria-current={isActive ? 'page' : undefined}
        className={`relative px-3 py-1.5 whitespace-nowrap font-mono text-[11px] font-bold tracking-widest uppercase transition-colors duration-200 rounded-full focus-visible:outline-offset-4 ${
          isActive ? 'text-ink' : 'text-ink-mute hover:text-ink hover:bg-[var(--bone)]/60'
        }`}
      >
        <span className="relative z-10">{link.label}</span>
        {isActive && <ActiveIndicator />}
      </Link>
    );
  };

  // A primary link renders as a MegaMenu when it has panel data; every
  // other link keeps the plain treatment (including on mobile, where the
  // dropdowns never mount — MobileMenu owns the touch experience).
  const renderPrimaryLink = (link: NavLink, index: number, isActive: boolean, align: 'left' | 'right' = 'left') => {
    const withPanel = primaryNavLinksWithPanels().find((l) => l.to === link.to);
    if (withPanel?.panel) {
      return (
        <MegaMenu
          key={link.to}
          link={withPanel}
          isActive={isActive}
          align={align}
          onNavigate={() => undefined}
        />
      );
    }
    return renderNavLink(link, index, isActive);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 w-full z-nav pointer-events-none"
      style={{ y: headerTranslateY }}
    >
      {/* Scroll progress — sienna hairline at the very top */}
      <motion.div
        className="h-px bg-sienna w-full origin-left pointer-events-auto"
        style={{ scaleX: progressScale }}
        aria-hidden="true"
      />

      {/* Top border accent — appears on scroll */}
      <motion.div
        className="h-px bg-sienna w-full pointer-events-auto"
        style={{ opacity: borderOpacity }}
        aria-hidden="true"
      />

      {/* Announcement bar */}
      <div className="pointer-events-auto">
        <AnnouncementBar />
      </div>

      {/* Main nav floating capsule */}
      <motion.nav
        aria-label="Primary"
        data-scrolled={scrolled ? 'true' : 'false'}
        className="nav-scrolled pointer-events-auto"
      >
        <div className="container-void">
          <div className="nav-scrolled-inner relative rounded-full border border-hairline/80 backdrop-blur-xl">
            <div className="relative flex items-center justify-between px-4 sm:px-6 py-2.5 md:py-3 gap-3 md:gap-4">

              {/* Left side: Mobile hamburger OR Desktop primary links */}
              <div className="flex items-center gap-1 flex-1 min-w-0">
                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center">
                  <button
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls={MOBILE_MENU_PANEL_ID}
                    className="pressable text-ink-mute hover:text-sienna transition-colors min-w-[40px] min-h-[40px] w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--bone)] focus-visible:outline-offset-2"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </div>

                {/* Desktop left nav links */}
                <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0">
                  {leftNavLinks.map((link, idx) => {
                    const active = isNavLinkActive(link, location.pathname, searchParams);
                    return renderPrimaryLink(link, idx, active, 'left');
                  })}
                </div>
              </div>

              {/* Centered Logo */}
              <div className="shrink-0 flex items-center justify-center">
                <Logo />
              </div>

              {/* Right side: Desktop right links + Action icons + Live Clock */}
              <div className="flex items-center justify-end gap-1 sm:gap-2 flex-1 min-w-0">
                {/* Desktop right nav links */}
                <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 min-w-0">
                  {rightNavLinks.map((link, idx) => {
                    const active = isNavLinkActive(link, location.pathname, searchParams);
                    return renderPrimaryLink(link, idx, active, 'right');
                  })}
                </div>

                {/* Clock on large screens */}
                <div className="hidden 2xl:flex items-center pl-2 pr-1 border-l border-hairline/60">
                  <NavClock />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 text-ink-mute shrink-0">
                  <ThemeToggle />

                  <ActionButton
                    onClick={openSearch}
                    label="Search"
                    badge={null}
                  >
                    <Search className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  </ActionButton>

                  {isAuthenticated ? (
                    <div className="flex items-center gap-0.5">
                      <Link
                        to="/dashboard"
                        className="pressable min-w-[40px] min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-transparent hover:border-hairline hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors duration-200 focus-visible:outline-offset-4"
                        title={user?.name || 'Account'}
                        aria-label={user?.name || 'Account'}
                      >
                        <User className="w-4 h-4 md:w-4.5 md:h-4.5" />
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="pressable hidden md:flex min-w-[40px] min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 items-center justify-center hover:text-sienna transition-colors rounded-full border border-transparent hover:border-hairline hover:bg-[var(--bone)] focus-visible:outline-offset-4"
                        title="Sign Out"
                        aria-label="Sign Out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthPanel('login')}
                      className="pressable min-w-[40px] min-h-[40px] w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-transparent hover:border-hairline hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors duration-200 focus-visible:outline-offset-4"
                      title="Sign In"
                      aria-label="Sign In"
                    >
                      <User className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </button>
                  )}

                  <ActionButton
                    onClick={openCart}
                    label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
                    badge={
                      cartCount > 0 ? (
                        <motion.span
                          key={cartCount}
                          initial={
                            countChanged && !prefersReducedMotion()
                              ? { scale: 0.6, opacity: 0 }
                              : false
                          }
                          animate={{ scale: 1, opacity: 1 }}
                          transition={
                            prefersReducedMotion()
                              ? { duration: 0 }
                              : springs.gentle
                          }
                          className="absolute -top-0.5 -right-0.5 bg-sienna text-ivory font-mono font-bold text-[10px] min-w-[18px] h-[18px] px-0.5 rounded-full flex items-center justify-center shadow-xs"
                        >
                          {cartCount}
                        </motion.span>
                      ) : null
                    }
                  >
                    <ShoppingBag className="w-4 h-4 md:w-4.5 md:h-4.5" />
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
