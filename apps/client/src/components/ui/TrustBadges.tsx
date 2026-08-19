import { Lock, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const BADGES = [
  { icon: Lock, label: 'Encrypted Checkout' },
  { icon: ShieldCheck, label: 'PCI Compliant' },
  { icon: RefreshCw, label: 'Free Returns' },
];

/**
 * Reassurance row placed near the payment CTA. On a luxury funnel where the
 * next action is committing money, surfacing trust signals inline reduces
 * abandonment without adding chrome elsewhere. Each badge gets a subtle
 * spring lift on hover for a tactile, physical feel.
 */
export function TrustBadges() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-ink-mute">
      {BADGES.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
          <motion.span
            className="inline-flex items-center gap-1.5 cursor-default"
            whileHover={{ y: -2, scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, mass: 0.5 }}
          >
            <Icon className="w-3.5 h-3.5 text-sienna" aria-hidden="true" />
            {label}
          </motion.span>
        </li>
      ))}
    </ul>
  );
}
