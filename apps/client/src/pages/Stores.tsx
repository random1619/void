import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Clock, ArrowUpRight, Phone, Mail } from 'lucide-react';
import { fadeUpVariants, staggerContainer } from '../lib/animations';

const EASE_FLUID = [0.32, 0.72, 0, 1] as const;

const STORES = [
  {
    city: 'London',
    region: 'Mayfair',
    address: '12 Bond Street',
    postcode: 'W1S 4RQ',
    hours: 'Mon – Sat, 10:00 – 19:00',
    phone: '+44 20 7495 1212',
    email: 'london@void-atelier.com',
    desc: 'The original atelier. A restored Georgian townhouse with glass balconies over a private garden.',
    notes: ['Private appointments', 'Bespoke tailoring floor'],
  },
  {
    city: 'Tokyo',
    region: 'Ginza',
    address: '4 Chuo-dori, 4F–7F',
    postcode: '104-0061',
    hours: 'Mon – Sun, 11:00 – 20:00',
    phone: '+81 3 3562 1180',
    email: 'tokyo@void-atelier.com',
    desc: 'A vertical atelier spanning four floors of raw concrete and woven silk partitions.',
    notes: ['Horology salon', 'Numbered-edition archive'],
  },
  {
    city: 'Paris',
    region: 'Le Marais',
    address: '28 Rue des Rosiers',
    postcode: '75004',
    hours: 'Tue – Sat, 11:00 – 19:00',
    phone: '+33 1 42 74 09 10',
    email: 'paris@void-atelier.com',
    desc: 'A limestone mezzanine above a quiet courtyard, where the atelier hosts seasonal salons.',
    notes: ['Seasonal salon', 'Concierge collection point'],
  },
];

/**
 * Store Locator — editorial directory, not a card grid.
 * Each maison is a full-width hairline-ruled row: the city leads on the
 * display scale, the address ledger sits in mono on the right, and the
 * description holds the middle. Asymmetric by design — the rows alternate
 * nothing; the hierarchy carries the page.
 */
export default function Stores() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="atelier-bg text-ink antialiased overflow-x-hidden min-h-[100dvh]">
      {/* Header — left-aligned editorial split */}
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
              Global Presence
            </p>
            <h1 className="atelier-display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
              The Maisons
            </h1>
          </motion.div>
          <motion.p
            variants={fadeUpVariants}
            className="lg:col-span-4 text-ink-soft text-base md:text-lg leading-relaxed lg:pb-2 max-w-sm"
          >
            Three addresses, one standard. Visit our ateliers in person — each
            space is designed as an extension of the collection.
          </motion.p>
        </motion.div>
      </section>

      {/* Directory — full-width hairline ledger rows */}
      <section className="container-void pb-20 md:pb-28">
        <div className="border-t border-hairline">
          {STORES.map((store, i) => (
            <motion.article
              key={store.city}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE_FLUID }}
              className="group grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 py-10 md:py-12 border-b border-hairline"
            >
              {/* City + index */}
              <div className="md:col-span-4 flex items-start gap-4">
                <span className="font-mono text-xs text-ink-faint tabular-nums pt-2">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-ink group-hover:text-sienna transition-colors duration-300">
                    {store.city}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-ink-mute tracking-[0.18em] uppercase">
                    {store.region}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="md:col-span-4 flex items-center">
                <p className="text-sm md:text-base text-ink-soft leading-relaxed max-w-sm">
                  {store.desc}
                </p>
              </div>

              {/* Address ledger */}
              <div className="md:col-span-4 md:border-l md:border-hairline md:pl-8 space-y-2">
                <p className="flex items-start gap-2 text-sm text-ink-mute">
                  <MapPin className="w-4 h-4 text-sienna mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    {store.address}, {store.postcode}
                  </span>
                </p>
                <p className="flex items-center gap-2 text-sm text-ink-mute">
                  <Clock className="w-4 h-4 text-sienna shrink-0" aria-hidden="true" />
                  {store.hours}
                </p>
                <div className="pt-3 flex flex-wrap gap-x-5 gap-y-2">
                  <a
                    href={`tel:${store.phone.replace(/\s/g, '')}`}
                    className="pressable inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-sienna transition-colors min-h-[44px]"
                  >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    {store.phone}
                  </a>
                  <a
                    href={`mailto:${store.email}`}
                    className="pressable inline-flex items-center gap-1.5 text-sm text-ink-mute hover:text-sienna transition-colors min-h-[44px]"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    Email
                  </a>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {store.notes.map((note) => (
                    <span
                      key={note}
                      className="px-3 py-1 border border-hairline text-[10px] font-mono uppercase tracking-wider text-ink-mute"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Concierge band — dark, editorial CTA */}
      <section className="atelier-ink text-ivory relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-96 h-96 bg-sienna/10 blur-[100px] rounded-full pointer-events-none"
        />
        <div className="container-void py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-ivory/70 mb-4">
              Before You Arrive
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight leading-[1.08]">
              Book a private appointment with a{' '}
              <span className="text-sienna italic font-normal">maison concierge</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href="mailto:concierge@void-atelier.com"
              className="pressable inline-flex items-center gap-3 px-6 py-4 border border-ivory/40 text-ivory font-mono text-xs uppercase tracking-[0.2em] hover:bg-ivory hover:text-ink transition-colors duration-300"
            >
              Request Appointment
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
