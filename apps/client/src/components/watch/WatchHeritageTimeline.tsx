import { motion } from 'framer-motion';

/**
 * WatchHeritageTimeline — Ivory Atelier edition.
 * Editorial lineage ledger: oversized Playfair year markers in sienna against
 * a hairline vertical rule, ink titles, muted ink copy on an ivory ground.
 */

const TIMELINE_EVENTS = [
  {
    year: '1894',
    title: 'Genesis of Precision',
    description: 'Establishment of the VOID atelier in Val-de-Travers, crafting high-frequency pocket chronometers for naval navigation.',
  },
  {
    year: '1952',
    title: 'The Monolith Escape Wheel',
    description: 'Pioneered the monobloc titanium escape wheel, eliminating thermal expansion errors in extreme environments.',
  },
  {
    year: '1988',
    title: 'Caliber V-01 Development',
    description: 'Creation of the kinetic energy recovery rotor with 72-hour continuous power reserve capacity.',
  },
  {
    year: '2026',
    title: 'The Ceramic-Titanium Monolith',
    description: 'Unveiling of the current flagship timepiece carved from proprietary obsidian ceramic-titanium alloy.',
  },
];

export function WatchHeritageTimeline() {
  return (
    <section className="py-24 md:py-32 atelier-bg" aria-label="Heritage and lineage">
      <div className="container-void">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="atelier-eyebrow text-sienna mb-5 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-sienna" aria-hidden="true" />
              05 · Heritage &amp; Lineage
            </p>
            <h2 className="atelier-display text-[clamp(36px,5vw,64px)] text-ink">
              Horological <em>Genesis.</em>
            </h2>
          </div>

          {/* Timeline */}
          <ol className="relative border-l border-hairline ml-4 md:ml-36 space-y-16">
            {TIMELINE_EVENTS.map((event, index) => (
              <motion.li
                key={event.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-8 md:pl-14 group"
              >
                {/* Square node — the atelier doesn't do dots. */}
                <span
                  className="absolute -left-[5px] top-3 w-2.5 h-2.5 bg-sienna transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                />

                <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-10">
                  <span className="font-display text-3xl md:text-5xl text-sienna font-bold md:-ml-36 md:w-28 md:text-right shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5">
                    {event.year}
                  </span>
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-ink mb-2 transition-colors duration-300 group-hover:text-sienna">
                      {event.title}
                    </h3>
                    <p className="text-ink-soft text-sm font-light leading-relaxed max-w-xl">
                      {event.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
