/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: {
          black: '#0A0A0A',
          dark: '#121414',
          surface: '#1E2020',
          'surface-high': '#282A2B',
          'surface-highest': '#333535',
          border: 'rgba(255,255,255,0.15)',
          text: '#E2E2E2',
          muted: '#C4C7C7',
          gold: '#D4AF37',
          'gold-dim': '#9E832A',
          blue: '#007AFF',
          'blue-bright': '#0EA5FF',
          white: '#FFFFFF',
          // Semantic colors — previously raw Tailwind red/green were sprinkled
          // ad-hoc across ProductCard, ProductDetail, Cart, Checkout and Admin.
          // Centralizing them keeps the gold/dark system consistent and gives
          // error/success/sold-out states a single, on-brand source of truth.
          danger: '#E5484D',
          'danger-dim': '#9B2C2C',
          success: '#3DD68C',
          'success-dim': '#1E7A4D',
        },
        sienna: 'rgba(var(--sienna-rgb), <alpha-value>)',
        ink: 'rgba(var(--ink-rgb), <alpha-value>)',
        ivory: 'rgba(var(--ivory-rgb), <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', 'Outfit', '"Playfair Display"', 'Georgia', 'sans-serif'],
        cabinet: ['"Cabinet Grotesk"', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Geist Mono"', '"Space Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Display sizes live in CSS (.atelier-display-xl/lg/md) — single
        // source of truth. These Tailwind aliases remain only for any code
        // still referencing them via class strings; they map to the same
        // optical sizing, leading, and tracking values as the CSS scale.
        'display-xl': ['80px', { lineHeight: '0.99', letterSpacing: '-0.025em' }],
        'display-lg': ['64px', { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg-mobile': ['40px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'headline-xl': ['56px', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        'headline-lg': ['48px', { lineHeight: '56px' }],
        'headline-md': ['32px', { lineHeight: '40px' }],
        'headline-sm': ['24px', { lineHeight: '32px' }],
        // Align with the CSS .text-label-caps utility (11px / 0.2em) so the
        // Tailwind token and the CSS class no longer disagree.
        'label-caps': ['11px', { lineHeight: '16px', letterSpacing: '0.2em' }],
      },
      zIndex: {
        // Documented z-scale so overlays and chrome stop colliding.
        // base < content < nav < backdrop < overlay < cursor
        content: '10',
        nav: '40',
        backdrop: '50',
        overlay: '60',
        cursor: '70',
      },
      spacing: {
        section: '128px',
        'section-sm': '80px',
      },
      maxWidth: {
        container: '1440px',
      },
      backdropBlur: {
        xs: '4px',
        glass: '32px',
        'glass-heavy': '64px',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'accordion-down': 'accordionDown 0.3s ease forwards',
        'accordion-up': 'accordionUp 0.3s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100%)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212,175,55,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(212,175,55,0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        accordionDown: {
          '0%': { height: '0', opacity: '0' },
          '100%': { height: 'var(--radix-accordion-content-height)', opacity: '1' },
        },
        accordionUp: {
          '0%': { height: 'var(--radix-accordion-content-height)', opacity: '1' },
          '100%': { height: '0', opacity: '0' },
        },
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212,175,55,0.4)',
        'gold-glow-lg': '0 0 40px rgba(212,175,55,0.6)',
        'blue-glow': '0 0 20px rgba(0,122,255,0.4)',
        'card': '0 4px 40px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 60px rgba(0,0,0,0.6)',
        'inner-gold': 'inset 0 0 20px rgba(212,175,55,0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37, #F5D06B, #9E832A)',
        'blue-gradient': 'linear-gradient(135deg, #007AFF, #0EA5FF)',
        'void-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #121414 50%, #0A0A0A 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
      transitionTimingFunction: {
        'luxury': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [
    // Gate transform/cosmetic hover effects behind capable pointers so touch
    // devices don't get stuck in hover states. DESIGN.md: "Hover-only effects
    // must be gated to fine pointers."
    plugin(({ addVariant }) => {
      addVariant('hover-hover', '@media (hover: hover) and (pointer: fine)');
    }),
  ],
}
