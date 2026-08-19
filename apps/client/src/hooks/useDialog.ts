import { useCallback, useEffect, useRef } from 'react';
import { getLenis } from './useLenis';

interface UseDialogOptions {
  /** Whether the dialog is currently open. */
  open: boolean;
  /** Called when the user requests dismissal via Escape or backdrop. */
  onClose: () => void;
  /** ID of the element that labels the dialog (for aria-labelledby). Optional. */
  labelledById?: string;
  /** Optional accessible name when no labelledby heading is available. */
  ariaLabel?: string;
}

/**
 * Accessible-dialog controller shared by CartDrawer, SearchPanel and MobileMenu.
 *
 * Handles the four things every modal overlay in this app was missing:
 *  - moves focus into the panel on open and traps it there (Tab cycles within)
 *  - closes on Escape
 *  - restores focus to the trigger element on close
 *  - locks background scroll (important because Lenis smooth-scroll is active)
 *
 * Returns a ref to attach to the dialog panel so it can be focused on open.
 */
export function useDialog<T extends HTMLElement>({
  open,
  onClose,
  labelledById,
  ariaLabel,
}: UseDialogOptions) {
  const panelRef = useRef<T>(null);
  // Remember whatever had focus before the dialog opened so we can return it.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Lock background scroll while the dialog is mounted. Lenis hijacks the
  // wheel/trackpad and drives window scrolling through its own rAF loop, so
  // clamping <body>'s overflow alone doesn't freeze the page behind an open
  // dialog — we also stop the shared Lenis instance. (getLenis() is null when
  // smooth-scroll is off, e.g. reduced-motion, in which case the overflow
  // toggle still covers native scrolling.)
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    getLenis()?.stop();
    return () => {
      document.body.style.overflow = overflow;
      getLenis()?.start();
    };
  }, [open]);

  // Move focus into the dialog when it opens; restore it when it closes.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Defer slightly so the panel has finished its enter transition/layout.
    const id = window.setTimeout(() => {
      const panel = panelRef.current;
      if (!panel) return;
      const target =
        panel.querySelector<HTMLElement>(
          '[autofocus], [data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || panel;
      target.focus();
    }, 60);

    return () => {
      window.clearTimeout(id);
      const trigger = previouslyFocused.current;
      if (trigger && typeof trigger.focus === 'function') {
        trigger.focus();
      }
    };
  }, [open]);

  // Escape to close + Tab focus trap.
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) {
        // Nothing focusable inside — keep focus on the panel itself.
        e.preventDefault();
        panel.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || !panel.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  // Aria props to spread onto the dialog panel element.
  const dialogProps = {
    ref: panelRef,
    role: 'dialog' as const,
    'aria-modal': true as const,
    'aria-labelledby': labelledById,
    'aria-label': labelledById ? undefined : ariaLabel,
    tabIndex: -1,
  };

  return { panelRef, dialogProps };
}
