import { useHotkeys } from 'react-hotkeys-hook';
import { useUIStore } from '../stores/uiStore';
import { useCartStore } from '../stores/cartStore';

/**
 * Global keyboard shortcuts for VOID Atelier.
 *
 * ⌘K / Ctrl+K  → Open search panel
 * ⌘B / Ctrl+B  → Toggle cart drawer
 * Escape        → Close any open overlay (search, cart, mobile menu)
 *
 * All shortcuts are disabled when the user is focused on an input/textarea
 * to prevent conflicts with normal typing.
 */
export function useGlobalHotkeys() {
  const { openSearch, closeMobileMenu, isMobileMenuOpen } = useUIStore();
  const { toggleCart, isOpen: isCartOpen, closeCart } = useCartStore();

  // ⌘K / Ctrl+K → Search
  useHotkeys(
    'mod+k',
    (e) => {
      e.preventDefault();
      openSearch();
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
  );

  // ⌘B / Ctrl+B → Cart
  useHotkeys(
    'mod+b',
    (e) => {
      e.preventDefault();
      toggleCart();
    },
    {
      enableOnFormTags: false,
      preventDefault: true,
    },
  );

  // Escape → Close overlays
  useHotkeys(
    'escape',
    () => {
      if (isCartOpen) closeCart();
      if (isMobileMenuOpen) closeMobileMenu();
    },
    {
      enableOnFormTags: true,
    },
  );
}
