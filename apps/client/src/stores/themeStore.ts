import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

const THEME_STORAGE_KEY = 'void_theme_preference';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeToDOM(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const body = document.body;

  if (resolved === 'dark') {
    root.classList.add('dark');
    body.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.remove('dark');
    body.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  resolvedTheme: 'light',

  initTheme: () => {
    if (typeof window === 'undefined') return;

    let savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
    if (!savedTheme || !['light', 'dark', 'system'].includes(savedTheme)) {
      savedTheme = 'light';
    }

    const resolved = savedTheme === 'system' ? getSystemTheme() : savedTheme;
    applyThemeToDOM(resolved);

    set({ theme: savedTheme, resolvedTheme: resolved });

    // Listen for OS theme preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (get().theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        applyThemeToDOM(newResolved);
        set({ resolvedTheme: newResolved });
      }
    };

    mediaQuery.addEventListener?.('change', handleSystemChange);
  },

  setTheme: (newTheme: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyThemeToDOM(resolved);
    set({ theme: newTheme, resolvedTheme: resolved });
  },

  toggleTheme: () => {
    const current = get().resolvedTheme;
    const nextTheme: ThemeMode = current === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },
}));
