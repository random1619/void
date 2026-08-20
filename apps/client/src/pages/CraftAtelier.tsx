import { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Compass, Cpu, Gem, Ruler, Scissors, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image } from '../components/ui/Image';
import { prefersReducedMotion } from '../lib/utils';
import { springs } from '../lib/motion-tokens';

gsap.registerPlugin(ScrollTrigger);

/**
 * Craft Atelier — the workshop floor.
 * A pinned machinery stage (the object under construction) with the craft
 * discipline scrolled past on its flank; then a discipline grid in the
 * maison's hairline ledger language.
 */

const STAGES = [
  {
    index: '01',
    title: 'Cut',
    body: 'Every panel is cut by hand from a single hide or bolt — grain direction respected, no two cuts identical.',
    icon: Scissors,
  },
  {
    index: '02',
    title: 'Construct',
    body: 'Seams are set under tension and pressed in the open position before closing, so a VOID garment holds its architecture. ',
    icon: Ruler,
  },
  {
    index: '03',
    title: 'Engineer',
    body: 'Hardware is milled in Titanium, bezels in ceramics — the same discipline that drives the horological atelier.',
    icon: Cpu,
  },
  {
    index: '04',
    title: 'Finish',
    body: 'Edge-painting, burnishing and a final hand inspection. A numbered certificate accompanies every object.',
    icon: Flame,
  },
];

const STOCK_DISCIPLINES = [
  { icon: Compass, label: 'Pattern Engineering', value: 'Every silhouette starts as a measured geometry on a 1:1 draft — no digital averaging.' },
  { icon: Gem, label: 'The Finish Cabinet', value: 'Eleven finishers, one bench. Polish, burnish, and a final inspection under north light.' },
  { icon: Flame, label: 'The Metalwork Cell', value: 'Milling, annealing and hand-bevelling in the same room as the cutters — the maison never subcontracts its material voice.' },
];

export default function CraftAtelier() {
  const pinRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !pinRef.current) return;
    const ctx = gsap.context(() => {
      // Cinematic settle — the pinned macro frame starts slightly oversize and
      // drifts up as the disciplines scroll past, so the object feels like it
      // is being assembled while the craft reads beside it.
      gsap.fromTo(
        stageRef.current,
        { scale: 1.06, yPercent: 4 },
        {
          scale: 1,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );
    }, pinRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="atelier-bg text-ink min-h-screen antialiased overflow-x-hidden">
      <main className="overflow-x-hidden w-full max-w-full">
        {/* ==================== HERO ==================== */}
        <section className="relative min-h-[88vh] flex items-end pb-16 pt-36 overflow-hidden" aria-labelledby="craft-h1">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/craft_atelier_hero.jpg"
              alt=""
              loading="eager"
              className="w-full h-full object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/45 to-ivory/10" />
          </div>

          <div className="relative z-10 container-void">
            <h1
              id="craft-h1"
              className="atelier-display atelier-display-xl mb-5 max-w-4xl"
            >
              The Craft <em>Atelier.</em>
            </h1>
            <p className="max-w-xl text-ink-soft text-base md:text-lg leading-relaxed font-light measure">
              One room, four disciplines, a single object — the workshop where every VOID piece
              is cut, constructed, engineered and finished under one roof.
            </p>
          </div>
        </section>

        {/* ==================== PINNED MACHINERY ==================== */}
        <section
          ref={pinRef}
          className="relative min-h-[130vh] flex items-center overflow-hidden"
          aria-label="The workshop floor"
        >
          <div className="container-void grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="atelier-eyebrow text-ink-mute mb-4">The Workshop Floor</div>
              <h2 className="atelier-display atelier-display-lg mb-5">
                Cut, Construct, <em>Engineer, Finish.</em>
              </h2>
              <p className="text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-md">
                Scroll past the disciplines — the object under construction holds its place, a
                quiet anchor while the craft scrolls beside it.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-16">
                {STAGES.map((stage, i) => {
                  const Icon = stage.icon;
                  return (
                    <motion.div
                      key={stage.index}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ ...springs.gentle, delay: i * 0.05 }}
                      className="group flex gap-6"
                    >
                      <span className="atelier-eyebrow text-sienna shrink-0 pt-1">{stage.index}</span>
                      <div className="border-l border-hairline pl-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-4 h-4 text-sienna" aria-hidden="true" />
                          <h3 className="font-display text-2xl md:text-3xl text-ink group-hover:text-sienna transition-colors duration-300">
                            {stage.title}
                          </h3>
                        </div>
                        <p className="text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-md">
                          {stage.body}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed macro anchor — pinned on large screens */}
          <div
            ref={stageRef}
            className="hidden lg:block absolute inset-y-0 right-0 w-1/2 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-[4vw] w-[min(30vw,420px)]">
              <div className="atelier-frame overflow-hidden img-grain aspect-[4/5] shadow-2xl">
                <Image
                  src="/craft_metallurgy_frame.jpg"
                  alt=""
                  loading="lazy"
                  wrapperClassName="w-full h-full"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STOCK DISCIPLINES ==================== */}
        <section className="section-gap-lg atelier-bg-deep" aria-label="Craft disciplines">
          <div className="container-void">
            <div className="max-w-2xl mb-12">
              <h2 className="atelier-display atelier-display-lg">
                The <em>Stock Room.</em>
              </h2>
              <p className="mt-5 text-ink-soft text-sm md:text-base font-light leading-relaxed max-w-xl">
                The disciplines the atelier refuses to outsource — kept in-house so every
                material voice stays the maison's own.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STOCK_DISCIPLINES.map((d, i) => {
                const Icon = d.icon;
                return (
                  <motion.div
                    key={d.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ ...springs.gentle, delay: i * 0.1 }}
                    className="atelier-card atelier-card-hover p-7 flex flex-col gap-4"
                  >
                    <Icon className="w-5 h-5 text-sienna" aria-hidden="true" />
                    <h3 className="font-display text-xl text-ink leading-snug">{d.label}</h3>
                    <p className="text-ink-soft text-sm font-light leading-relaxed flex-1">
                      {d.value}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <Link to="/materials" className="atelier-btn">
                Enter the Materials Archive <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}