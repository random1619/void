import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { Image } from '../components/ui/Image';
import { springs } from '../lib/motion-tokens';

/**
 * Materials — the archive.
 * A gapless, dense bento grid of the maison's material voice, each tile
 * anchored by real photography. Large hero tile, tight editorial cells,
 * and a quiet material-index footnote.
 */

const MATERIALS = [
  {
    name: 'Washed Silk',
    code: 'MS-01',
    tone: 'A surface that moves — drapes without clinging, catches light without glare.',
    image: '/materials_washed_silk.png',
    alt: 'Washed silk drape detail',
    span: 'large',
  },
  {
    name: 'Sculpted Wool',
    code: 'MS-02',
    tone: 'Melton cloth with hand-rolled edges that hold their architecture.',
    image: '/materials_sculpted_wool.png',
    alt: 'Sculpted wool coat',
    span: '',
  },
  {
    name: 'Vegetable Tanned Leather',
    code: 'MS-03',
    tone: 'Tanned over ninety days; deepens with wear like a patinated instrument.',
    image: '/products/architectural_handbag.jpg',
    alt: 'Vegetable tanned leather handbag',
    span: '',
  },
  {
    name: 'Grade 5 Titanium',
    code: 'MS-04',
    tone: 'Milled for hardware and the horological case — hard, light, and annealed in-house.',
    image: '/materials_titanium.jpg',
    alt: 'Titanium metallurgy',
    span: 'wide',
  },
  {
    name: 'Sapphire Crystal',
    code: 'MS-05',
    tone: 'Synthetic corundum at 9 Mohs — the watch glass that never scratches.',
    image: '/materials_sapphire_crystal.jpg',
    alt: 'Sapphire crystal watch macro',
    span: '',
  },
  {
    name: 'Organic Cashmere',
    code: 'MS-06',
    tone: 'Herd-raised, carded by hand, knitted in a single run per garment.',
    image: '/materials_cashmere.png',
    alt: 'Cashmere knit detail',
    span: '',
  },
];

const PLACES = [
  'VAL-DE-TRAVERS',
  'KYOTO',
  'MILANO',
  'PARIS',
  'NEW YORK',
  'NEW DELHI',
];

export default function Materials() {
  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* ==================== HEADER ==================== */}
        <section className="pt-36 pb-14" aria-labelledby="materials-h1">
          <div className="container-void">
            <h1
              id="materials-h1"
              className="atelier-display atelier-display-xl mb-6 max-w-5xl"
            >
              The Materials <em>Archive.</em>
            </h1>
            <p className="max-w-xl text-ink-soft text-base md:text-lg leading-relaxed font-light measure">
              Every VOID object is built from a small, obsessive library of material — each one
              catalogued, certified, and returned to season after season.
            </p>
          </div>
        </section>

        {/* ==================== BENTO GRID ==================== */}
        <section className="pb-16" aria-label="Material index">
          <div className="container-void">
            <div className="fluid-grid grid grid-cols-1 md:grid-cols-3 md:grid-flow-dense gap-4 md:gap-5">
              {MATERIALS.map((m, i) => {
                const isLarge = m.span === 'large';
                const isWide = m.span === 'wide';
                return (
                  <motion.figure
                    key={m.code}
                    initial={{ opacity: 0, scale: 0.985 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ ...springs.gentle, delay: (i % 3) * 0.08 }}
                    className={`fluid-grid-item group relative overflow-hidden border border-hairline atelier-frame ${
                      isLarge ? 'md:col-span-2 md:row-span-2' : isWide ? 'md:col-span-2' : ''
                    }`}
                  >
                    <div
                      className={`relative overflow-hidden bg-bone ${
                        isLarge ? 'aspect-[4/5] md:aspect-auto md:h-full md:min-h-[560px]' : 'aspect-[4/5]'
                      }`}
                    >
                      <Image
                        src={m.image}
                        alt={m.alt}
                        loading="lazy"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover grayscale-[0.25] transition-[transform,filter] duration-700 ease-luxury group-hover:scale-[1.04] group-hover:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />

                      <figcaption className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <span className="atelier-eyebrow text-ivory/70 block mb-1">{m.code}</span>
                            <h2 className="font-display text-xl md:text-2xl text-ivory leading-tight">
                              {m.name}
                            </h2>
                          </div>
                          <Plus
                            className="w-4 h-4 text-ivory/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1 group-hover:translate-y-0"
                            aria-hidden="true"
                          />
                        </div>
                        <p className="text-ivory/70 text-xs md:text-sm font-light leading-relaxed mt-2 max-w-sm hidden md:block">
                          {m.tone}
                        </p>
                      </figcaption>
                    </div>
                  </motion.figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================== MARQUEE ==================== */}
        <section className="py-14 border-y border-hairline overflow-hidden" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex shrink-0 items-center">
                {PLACES.map((place) => (
                  <span
                    key={place + dup}
                    className="font-display text-2xl md:text-4xl text-ink-faint tracking-tight px-6 md:px-10 whitespace-nowrap"
                  >
                    {place} <span className="text-sienna">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* ==================== CTA ==================== */}
        <section className="section-gap-lg" aria-label="Continue exploring">
          <div className="container-void text-center">
            <h2 className="atelier-display atelier-display-lg mb-10 max-w-3xl mx-auto">
              See the discipline that <em>uses</em> them.
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/craft-atelier" className="atelier-btn">
                Visit the Craft Atelier <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/products" className="atelier-btn-ghost">
                Browse the Collection
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}