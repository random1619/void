import { motion, AnimatePresence, useReducedMotion, usePresence } from 'framer-motion';
import { X, ShoppingBag, User, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { springs } from '../../lib/motion-tokens';
import { useDismissibleSheet } from '../../hooks/useDismissibleSheet';
import { useDialog } from '../../hooks/useDialog';
import { primaryNavLinks, supportLinks, isNavLinkActive } from '../../lib/navigation';
import { ThemeToggle } from './ThemeToggle';

const MENU_TITLE_ID = 'mobile-menu-title';
export const MOBILE_MENU_PANEL_ID = 'mobile-menu-panel';

export function MobileMenu() {
  const { isMobileMenuOpen, closeMobileMenu, openAuthPanel } = useUIStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { openCart, getTotalItems } = useCartStore();
  const location = useLocation();
  const { panelRef, dialogProps } = useDialog<HTMLDivElement>({
    open: isMobileMenuOpen,
    onClose: closeMobileMenu,
    labelledById: MENU_TITLE_ID,
  });

  const cartCount = getTotalItems();
  const reducedMotion = useReducedMotion() === true;
  const [isPresent, safeToRemove] = usePresence();

  // Same drag-to-dismiss physics as the cart drawer — 1:1 tracking,
  // velocity handoff on release, spring snap-back (apple-design §3, §5, §6).
  const sheet = useDismissibleSheet({
    present: isPresent,
    onExitComplete: () => safeToRemove?.(),
    onDismiss: closeMobileMenu,
    reducedMotion,
    panelRef,
  });

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            className="fixed inset-0 atelier-scrim z-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={springs.gentle}
            onClick={closeMobileMenu}
          />
          <motion.div
            {...dialogProps}
            id={MOBILE_MENU_PANEL_ID}
            className="fixed right-0 top-0 h-[100dvh] w-full max-w-sm atelier-bg atelier-sheet border-l border-hairline z-overlay flex flex-col"
            initial={false}
            style={{ x: sheet.x, opacity: reducedMotion ? sheet.panelOpacity : sheet.dragOpacity }}
            {...sheet.bind}
          >
            <div className="p-6 border-b border-hairline flex justify-between items-center">
              <h2 id={MENU_TITLE_ID} className="sr-only">
                Menu
              </h2>
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="font-display text-xl text-ink tracking-widest font-bold hover:text-sienna transition-colors focus-visible:outline-offset-2"
                aria-label="VOID Home"
              >
                VOID
              </Link>
              <button
                onClick={closeMobileMenu}
                className="pressable text-ink-mute hover:text-ink transition-colors p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-offset-2"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Materialized content — scales up from a slightly compressed
                state as the sheet slides in, so the surface reads as a real
                material arriving rather than a plain fade (apple-design §12). */}
            <motion.div
              className="flex-1 min-h-0 flex flex-col"
              initial={reducedMotion ? false : { scale: 0.985, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reducedMotion ? undefined : { scale: 0.985, opacity: 0 }}
              transition={springs.gentle}
            >
              <div className="flex-1 overflow-y-auto py-8 px-6 space-y-6">
                <motion.div
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.05 },
                    },
                  }}
                  initial={reducedMotion ? false : 'hidden'}
                  animate="visible"
                >
                  {primaryNavLinks.map((link) => {
                    const active = isNavLinkActive(link, location.pathname, new URLSearchParams(location.search));
                    return (
                      <motion.div
                        key={link.to}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0, transition: springs.gentle },
                        }}
                      >
                        <Link
                          to={link.to}
                          onClick={closeMobileMenu}
                          aria-current={active ? 'page' : undefined}
                          className={`block font-display text-2xl transition-colors focus-visible:outline-offset-2 ${
                            active ? 'text-sienna' : 'text-ink hover:text-sienna'
                          }`}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <div className="pt-6 border-t border-hairline space-y-3">
                  <span className="atelier-eyebrow text-sienna block">
                    Support
                  </span>
                  {supportLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMobileMenu}
                      className="block text-sm text-ink-mute hover:text-sienna transition-colors focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-hairline space-y-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm">{user?.name || 'Dashboard'}</span>
                    </Link>
                    <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="text-sm text-ink-mute hover:text-sienna transition-colors focus-visible:outline-offset-2"
                      aria-label="Sign Out"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      closeMobileMenu();
                      openAuthPanel('login');
                    }}
                    className="atelier-btn block w-full text-center focus-visible:outline-offset-2"
                  >
                    Sign In
                  </button>
                )}
                <button
                  onClick={() => { openCart(); closeMobileMenu(); }}
                  className="flex items-center gap-3 text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2 w-full"
                  aria-label={`Cart, ${cartCount} item${cartCount !== 1 ? 's' : ''}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-sm">Cart ({cartCount})</span>
                </button>
                <Link
                  to="/dashboard/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-ink-mute hover:text-ink transition-colors focus-visible:outline-offset-2"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Wishlist</span>
                </Link>

                <div className="pt-2 border-t border-hairline/60 flex items-center justify-between">
                  <span className="text-xs text-ink-mute font-mono uppercase tracking-wider">Appearance</span>
                  <ThemeToggle showLabel />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
