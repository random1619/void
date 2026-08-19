import { create } from 'zustand';

interface UIStore {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isAuthPanelOpen: boolean;
  authPanelMode: 'login' | 'register' | 'forgot';
  cursorVariant: 'default' | 'hover' | 'text' | 'drag' | 'hidden';
  toggleSearch: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  openAuthPanel: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthPanel: () => void;
  setAuthPanelMode: (mode: 'login' | 'register' | 'forgot') => void;
  setCursorVariant: (variant: UIStore['cursorVariant']) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  isAuthPanelOpen: false,
  authPanelMode: 'login',
  cursorVariant: 'default',
  
  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  openAuthPanel: (mode = 'login') => set({ isAuthPanelOpen: true, authPanelMode: mode }),
  closeAuthPanel: () => set({ isAuthPanelOpen: false }),
  setAuthPanelMode: (mode) => set({ authPanelMode: mode }),
  setCursorVariant: (cursorVariant) => set({ cursorVariant }),
}));
