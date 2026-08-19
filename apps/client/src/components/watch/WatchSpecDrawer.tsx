import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Compass, Cpu, Layers, Clock, Droplets, Gem, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../types';
import { springs } from '../../lib/motion-tokens';

/**
 * WatchSpecDrawer — Ivory Atelier edition.
 * Slide-out technical blueprint: ivory panel on a soft ink scrim, mono spec
 * ledger rows, sienna accents, ink acquisition bar. Escape closes, focus
 * moves into the drawer on open.
 */

interface WatchSpecDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColorway: { name: string; hex: string };
}

const SPEC_ROWS = [
  { icon: Compass, label: 'Case Architecture', value: '42mm Monolith (Grade 5 Titanium)' },
  { icon: Cpu, label: 'Movement Caliber', value: 'In-House Caliber V-01 Automatic' },
  { icon: Layers, label: 'Frequency & Jewels', value: '28,800 vph (4 Hz) / 27 Rubies' },
  { icon: ShieldCheck, label: 'Crystal Shield', value: 'Dual AR Sapphire (9 Mohs)' },
  { icon: Clock, label: 'Power Reserve', value: '72 Hours Capacity' },
  { icon: Droplets, label: 'Water Resistance', value: '100 Meters (10 ATM)' },
  { icon: Gem, label: 'Finishing', value: 'Côtes de Genève & Perlage' },
];

export function WatchSpecDrawer({
  isOpen,
  onClose,
  product,
  selectedColorway,
}: WatchSpecDrawerProps) {
  const { addItem, openCart } = useCartStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes the drawer; move focus inside on open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const handleAcquire = () => {
    addItem(product, { ...selectedColorway, images: [] }, '42mm');
    onClose();
    openCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} technical blueprint`}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 atelier-scrim"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={springs.luxurious}
            className="relative z-10 w-full max-w-lg atelier-bg border-l border-hairline h-full flex flex-col justify-between p-8 sm:p-10 overflow-y-auto text-ink shadow-2xl"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-start gap-4 mb-8 pb-5 border-b border-hairline">
                <div>
                  <span className="atelier-eyebrow text-sienna block mb-2">
                    Horology Blueprint
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl text-ink leading-snug">
                    {product.name}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close blueprint"
                  className="pressable w-11 h-11 shrink-0 border border-hairline text-ink-soft hover:text-ink hover:border-ink transition-colors duration-300 flex items-center justify-center"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Colorway Indicator */}
              <div className="flex items-center gap-4 p-4 border border-hairline atelier-bg-deep mb-8">
                <span
                  className="block w-6 h-6 border border-ink/20"
                  style={{ backgroundColor: selectedColorway.hex }}
                  aria-hidden="true"
                />
                <div>
                  <span className="atelier-eyebrow text-ink-mute block mb-1">
                    Selected Finish
                  </span>
                  <span className="font-display text-base text-ink">
                    {selectedColorway.name}
                  </span>
                </div>
              </div>

              {/* Technical Specifications Ledger */}
              <div>
                <span className="atelier-eyebrow text-sienna block mb-2">
                  Technical Specifications
                </span>

                <dl className="border-t border-hairline">
                  {SPEC_ROWS.map((row) => {
                    const Icon = row.icon;
                    return (
                      <div
                        key={row.label}
                        className="flex justify-between items-center gap-4 py-3.5 border-b border-hairline"
                      >
                        <dt className="flex items-center gap-2.5 text-sm text-ink-soft">
                          <Icon className="w-4 h-4 text-sienna shrink-0" aria-hidden="true" />
                          {row.label}
                        </dt>
                        <dd className="font-mono text-xs text-ink text-right">
                          {row.value}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            </div>

            {/* Bottom Acquisition Bar */}
            <div className="pt-8 border-t border-hairline mt-8 space-y-5">
              <div className="flex justify-between items-baseline gap-4">
                <span className="atelier-eyebrow text-ink-mute">Acquisition Price</span>
                <span className="font-display text-3xl text-ink font-bold">
                  ${product.price.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleAcquire}
                className="atelier-btn w-full"
                aria-label={`Acquire ${product.name} for $${product.price.toLocaleString()}`}
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                Acquire Timepiece · ${product.price.toLocaleString()}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
