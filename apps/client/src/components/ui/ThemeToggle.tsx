import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`pressable relative flex items-center justify-center rounded-full border border-transparent hover:border-[var(--hairline)] hover:bg-[var(--bone)] text-ink-mute hover:text-ink transition-colors duration-200 focus-visible:outline-offset-4 ${
        showLabel
          ? 'px-3.5 py-2 gap-2 text-xs font-mono uppercase tracking-wider'
          : 'w-9 h-9 sm:w-10 sm:h-10'
      } ${className}`}
      title={isDark ? 'Switch to Ivory Light mode' : 'Switch to Obsidian Dark mode'}
      aria-label={isDark ? 'Switch to Ivory Light mode' : 'Switch to Obsidian Dark mode'}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className="w-4 h-4 md:w-4.5 md:h-4.5 text-sienna" />
        ) : (
          <Moon className="w-4 h-4 md:w-4.5 md:h-4.5" />
        )}
      </motion.div>

      {showLabel && (
        <span className="font-mono text-xs font-semibold tracking-wider">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
