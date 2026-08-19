import { motion, useReducedMotion } from 'framer-motion';
import { ShieldCheck, Crown, Gem, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

const TIERS = [
  {
    icon: ShieldCheck,
    tier: 'Member',
    threshold: '01',
    thresholdLabel: 'First purchase',
    desc: 'Early access to new releases, priority concierge support, and complimentary garment care.',
    benefits: ['Early release access', 'Priority concierge', 'Complimentary garment care'],
  },
  {
    icon: Crown,
    tier: 'Atelier',
    threshold: '05',
    thresholdLabel: 'Numbered editions',
    desc: 'Private styling appointments, numbered-edition pre-orders, and bespoke alterations included.',
    benefits: ['Private styling', 'Edition pre-orders', 'Bespoke alterations'],
  },
  {
    icon: Gem,
    tier: 'Heritage',
    threshold: '∞',
    thresholdLabel: 'By invitation',
    desc: 'Invitation-only. Annual atelier visit, co-designed capsule access, and a dedicated concierge.',
    benefits: ['Annual atelier visit', 'Co-designed capsule', 'Dedicated concierge'],
  },
];

/**
 * Loyalty — a tier ladder, not a card row.
 * Each tier is a full-width row on a vertical ascent rule: the threshold
 * leads in display type on the left, the benefits read as a mono ledger
 * on the right. Progression is the content — the layout shows it.
 */
export default function Loyalty() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="atelier-bg text-ink antialiased overflow-x-hidden min-h-[100dvh]">
      {/* Header */}
      <section className="container-void pt-28 pb-10 md:pt-36 md:pb-14">
        <motion.div
          variants={staggerContainer}
          initial={reducedMotion ? false : 'hidden'}
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <motion.div variants={fadeUpVariants} className="lg:col-span-8">
            <p className="atelier-eyebrow text-sienna mb-5 inline-flex items-center gap-3">
              <span className="w-8 h-px bg-sienna" aria-hidden="true" />
              Membership Ledger
            </p>
            <h1 className="atelier-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
              The <em>Ladder</em>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUpVariants}
            className="lg:col-span-4 text-ink-soft text-base md:text-lg leading-relaxed lg:pb-2 max-w-sm"
          >
            Earn with every numbered edition. Your patronage is recorded,
            honored, and rewarded with discretion.
          </motion.p>
        </motion.div>
      </section>

      {/* Tier ladder */}
      <section className="container-void pb-20 md:pb-28">
        <div className="relative">
          {/* Vertical ascent rule */}
          <div
            aria-hidden="true"
            className="absolute left-4 md:left-6 top-4 bottom-4 w-px bg-gradient-to-b from-sienna/60 via-sienna/20 to-transparent"
          />
          <div className="space-y-0">
            {TIERS.map((t, i) => (
              <motion.article
                key={t.tier}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE_FLUID }}
                className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-10 md:py-12 border-b border-hairline"
              >
                {/* Threshold marker on the rule */}
                <div
                  aria-hidden="true"
                  className="absolute left-4 md:left-6 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sienna border-2 border-[var(--ivory)]"
                />

                {/* Threshold */}
                <div className="md:col-span-3 md:pl-12 flex items-start gap-4">
                  <div className="w-11 h-11 shrink-0 rounded-full border border-hairline bg-[var(--ivory-deep)] flex items-center justify-center text-sienna">
                    <t.icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink tabular-nums">
                      {t.threshold}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-ink-mute tracking-[0.18em] uppercase">
                      {t.thresholdLabel}
                    </p>
                  </div>
                </div>

                {/* Tier name + desc */}
                <div className="md:col-span-4 md:pt-1">
                  <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                    {t.tier} Tier
                  </h2>
                  <p className="mt-3 text-sm md:text-base text-ink-soft leading-relaxed max-w-sm">
                    {t.desc}
                  </p>
                </div>

                {/* Benefits ledger */}
                <div className="md:col-span-5 md:border-l md:border-hairline md:pl-8 flex flex-col justify-center gap-2">
                  {t.benefits.map((benefit) => (
                    <p key={benefit} className="flex items-center gap-3 text-sm text-ink-mute">
                      <span className="w-1 h-1 rounded-full bg-sienna shrink-0" aria-hidden="true" />
                      {benefit}
                    </p>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE_FLUID }}
          className="mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        >
          <p className="text-ink-mute text-sm max-w-md leading-relaxed">
            Every numbered edition you acquire is recorded in your ledger.
            Progression is automatic — no cards to carry, no points to remember.
          </p>
          <Link
            to="/products"
            className="pressable inline-flex items-center gap-3 px-6 py-3.5 bg-ink text-ivory font-mono text-xs uppercase tracking-[0.2em] hover:bg-sienna transition-colors duration-300"
          >
            Begin Your Ledger
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
