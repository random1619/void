import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Image } from '../components/ui/Image';
import { springs } from '../lib/motion-tokens';

/**
 * The Journey — one object, five moments.
 * A vertical journey through the making of a single VOID piece: the route
 * is pinned at the left, the scenes scroll past it, each anchored by an
 * editorial photograph. Ends in the acquisition.
 */

const CHAPTERS = [
  {
    index: '01',
    title: 'The Route',
    tagline: 'Fiber',
    body: 'The journey opens not at the bench but at the source — the mill, the tanner, the horological foundry. Materials are chosen like instruments before a single panel is cut.',
    image: '/journey_01_route.jpg',
    alt: 'Raw silk route',
    mood: 'Routed by hand, not by hand-off. The maison travels the entire line.',
  },
  {
    index: '02',
    title: 'The Draft',
    tagline: 'Geometry',
    body: 'Every object begins as a 1:1 draft, a measured geometry on paper. Proportion is decided before fabric is ever cut, the way a movement is drawn before a case is turned.',
    image: '/journey_02_draft.jpg',
    alt: 'Silhouette drafting',
    mood: 'Proportion precedes material.',
  },
  {
    index: '03',
    title: 'The Bench',
    tagline: 'Labor',
    body: 'At the bench, cutting tension, seam set, and hand finish become the object. This is where the discipline lives — a single maker from first stitch to numbered certificate.',
    image: '/journey_03_bench.jpg',
    alt: 'The craft bench',
    mood: 'One maker, one object, one certificate.',
  },
  {
    index: '04',
    title: 'The Object',
    tagline: 'Form',
    body: 'The finished piece enters the maison — pressed, polished, inspected under north light, and numbered. It leaves the atelier only once.',
    image: '/journey_04_object.jpg',
    alt: 'The finished object',
    mood: 'Numbered once. Worn for decades.',
  },
  {
    index: '05',
    title: 'The Wearer',
    tagline: 'Continuation',
    body: 'The journey does not end at acquisition. VOID objects are serviced for life — re-pressed, re-burnished, re-issued — so the piece continues past its first decade.',
    image: '/journey_05_wearer.png',
    alt: 'The wearer',
    mood: 'A lifetime of service, not a season of wear.',
  },
];

export default function TheJourney() {
  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* ==================== HERO ==================== */}
        <section className="pt-36 pb-14 border-b border-hairline" aria-labelledby="journey-h1">
          <div className="container-void">
            <span className="atelier-eyebrow text-sienna block mb-4">The Journey</span>
            <h1
              id="journey-h1"
              className="atelier-display atelier-display-xl mb-6 max-w-5xl"
            >
              From Fiber <em>to Form.</em>
            </h1>
            <p className="max-w-xl text-ink-soft text-base md:text-lg leading-relaxed font-light measure">
              A single VOID object travels five moments before it reaches you — each one a
              discipline, each one photographed, none of them skipped.
            </p>
          </div>
        </section>

        {/* ==================== POSTED CHAPTERS ==================== */}
        <section className="section-gap-lg" aria-label="Chapters">
          <div className="container-void space-y-20">
            {CHAPTERS.map((c, i) => {
              const reversed = i % 2 === 1;
              return (
                <motion.article
                  key={c.index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ ...springs.gentle, delay: i * 0.05 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center"
                >
                  <div className={`lg:col-span-6 ${reversed ? 'lg:order-2' : ''}`}>
                    <div className="atelier-frame overflow-hidden atelier-frame-hover img-grain aspect-[16/11]">
                      <Image
                        src={c.image}
                        alt={c.alt}
                        loading="lazy"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className={`lg:col-span-6 ${reversed ? 'lg:order-1' : ''}`}>
                    <div className="flex items-baseline gap-4 mb-3">
                      <span className="atelier-eyebrow text-sienna">{c.index}</span>
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ink-mute">
                        {c.tagline}
                      </span>
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl text-ink mb-4 leading-tight">
                      {c.title}
                    </h2>
                    <p className="text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-lg">
                      {c.body}
                    </p>
                    <p className="mt-5 text-sienna font-display text-lg leading-snug italic">
                      {c.mood}
                    </p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="section-gap-lg atelier-bg-deep border-t border-hairline" aria-label="Begin your journey">
          <div className="container-void text-center">
            <h2 className="atelier-display atelier-display-lg mb-8 max-w-3xl mx-auto">
              Begin <em>yours.</em>
            </h2>
            <p className="max-w-md mx-auto text-ink-soft text-sm md:text-base font-light leading-relaxed mb-10">
              The journey continues at your wrist — start with the Monolith, or step into the
              materials that built it.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/watches" className="atelier-btn">
                Explore the Watches <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/materials" className="atelier-btn-ghost">
                The Materials Archive
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}