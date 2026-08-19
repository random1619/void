import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Sparkles, Mail, Package, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

const EDITIONS = [
  {
    icon: Mail,
    label: 'Digital Edition',
    tagline: 'Instant Delivery',
    desc: 'Delivered by email within minutes. Includes a handwritten message and a bespoke digital envelope.',
    price: 'From $150',
    highlight: false,
  },
  {
    icon: Package,
    label: 'Physical Edition',
    tagline: 'Hand-Finished Box',
    desc: 'A weighty card enclosed in a presentation box lined with raw silk. Shipped with concierge logistics.',
    price: 'From $320',
    highlight: false,
  },
  {
    icon: Gem,
    label: 'Concierge Edition',
    tagline: 'Private Curation',
    desc: 'Our atelier tailors select garments on behalf of the recipient. Includes a styling consultation and a leather-bound ledger of the pieces chosen.',
    price: 'From $840',
    highlight: true,
  },
];

/**
 * Gift Cards — asymmetric offering, not three equal cards.
 * The Concierge Edition is the featured panel (left, tall); the two
 * smaller editions stack beside it. Each carries a tactile hairline
 * bezel and a real destination on the Select action.
 */
export default function GiftCards() {
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
              Bespoke Gifting
            </p>
            <h1 className="atelier-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
              Gift <em>Cards</em>
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUpVariants}
            className="lg:col-span-4 text-ink-soft text-base md:text-lg leading-relaxed lg:pb-2 max-w-sm"
          >
            A curated gesture of taste. Delivered instantly, or presented with
            ceremonial precision.
          </motion.p>
        </motion.div>
      </section>

      {/* Offering — asymmetric split */}
      <section className="container-void pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Featured — Concierge Edition */}
          {EDITIONS.filter((e) => e.highlight).map((card) => (
            <motion.article
              key={card.label}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: EASE_FLUID }}
              className="lg:col-span-7 atelier-ink text-ivory relative overflow-hidden flex flex-col justify-between p-8 md:p-12"
            >
              <div
                aria-hidden="true"
                className="absolute -top-20 -right-20 w-72 h-72 bg-sienna/15 blur-[80px] rounded-full pointer-events-none"
              />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sienna text-ivory text-[10px] font-bold tracking-[0.2em] uppercase">
                  <Sparkles className="h-3 w-3" aria-hidden="true" />
                  Featured
                </div>
                <h2 className="mt-6 font-display text-3xl md:text-4xl font-bold tracking-tight">
                  {card.label}
                </h2>
                <p className="mt-2 font-mono text-xs text-ivory/60 tracking-[0.18em] uppercase">
                  {card.tagline}
                </p>
                <p className="mt-5 text-ivory/75 leading-relaxed max-w-md">
                  {card.desc}
                </p>
              </div>
              <div className="relative z-10 mt-10 flex flex-wrap items-end justify-between gap-6">
                <span className="font-display text-2xl font-bold">{card.price}</span>
                <Link
                  to="/contact"
                  className="pressable inline-flex items-center gap-2 px-6 py-3.5 bg-ivory text-ink font-mono text-xs uppercase tracking-[0.2em] hover:bg-sienna hover:text-ivory transition-colors duration-300"
                >
                  Enquire
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}

          {/* Stacked smaller editions */}
          <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
            {EDITIONS.filter((e) => !e.highlight).map((card, i) => (
              <motion.article
                key={card.label}
                initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: EASE_FLUID }}
                className="atelier-card-hover atelier-card p-7 md:p-9 flex-1 flex flex-col"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center text-sienna">
                      <card.icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h2 className="mt-4 font-display text-xl md:text-2xl font-bold tracking-tight">
                      {card.label}
                    </h2>
                    <p className="mt-1 font-mono text-[10px] text-ink-mute tracking-[0.18em] uppercase">
                      {card.tagline}
                    </p>
                  </div>
                  <span className="font-display text-lg font-bold text-ink shrink-0">
                    {card.price}
                  </span>
                </div>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed flex-1">
                  {card.desc}
                </p>
                <div className="mt-6 pt-5 border-t border-hairline flex justify-end">
                  <Link
                    to="/contact"
                    className="pressable inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink hover:text-sienna transition-colors min-h-[44px]"
                  >
                    Select
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
